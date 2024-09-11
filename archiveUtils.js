//archiveUtils.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const unzipper = require('unzipper');
const glob = require('glob');

const archivesDir = path.resolve('C:/Users/alex/OneDrive/backup/worklog');
const projectPath = path.resolve(__dirname, '..'); // Points to D:\Projects\Name
const projectName = path.basename(projectPath).toLowerCase(); // Will be 'worklog'
const projectPathMeta = path.resolve(__dirname, ''); // Path for metadata
const metadataFile = path.join(archivesDir, 'metadata.json');

// Watched files patterns
const watchedFiles = [
  'routes/**/*.js',
  'controllers/**/*.js',
  'views/**/*.*',
  'public/**/*.*',
  '!public/uploads/*.*',
  '*.js',
  '*.json',
  '*.db',
  '.env',
  '*.txt',
  '*.bat',
];

// Separate included and excluded patterns
const includedFiles = watchedFiles.filter(
  (pattern) => !pattern.startsWith('!'),
);
const excludedFiles = watchedFiles
  .filter((pattern) => pattern.startsWith('!'))
  .map((pattern) => pattern.slice(1));

// Function to load archives
function loadArchives() {
  const files = fs.readdirSync(archivesDir);
  return files
    .filter((file) => file.endsWith('.zip'))
    .map((file) => {
      const baseName = file.slice(0, -'.zip'.length);
      const commentPath = path.join(archivesDir, `${baseName}.txt`);
      const comment = fs.existsSync(commentPath)
        ? fs.readFileSync(commentPath, 'utf-8')
        : '';
      const stats = fs.statSync(path.join(archivesDir, file));
      return {
        id: stats.ino,
        name: file,
        comment,
        date: stats.mtime.toISOString(),
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Function to generate archive name
function generateArchiveName(type) {
  const now = new Date();
  const dateString = now
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/\s/g, '-');
  const timeString = now
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/:/g, '.');
  return `${dateString}_${timeString}_${projectName}_${type}.zip`;
}

// Function to update metadata
function updateMetadata() {
  const metadata = fs.existsSync(metadataFile)
    ? JSON.parse(fs.readFileSync(metadataFile, 'utf-8'))
    : {};

  if (!metadata[projectName]) {
    metadata[projectName] = {};
  }

  function addFileMetadata(filePath) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        metadata[projectName][filePath] = {
          mtime: stats.mtime.getTime(),
          size: stats.size,
        };
      } else if (stats.isDirectory()) {
        fs.readdirSync(filePath).forEach((file) =>
          addFileMetadata(path.join(filePath, file)),
        );
      }
    }
  }

  includedFiles.forEach((pattern) => {
    const files = glob.sync(pattern, { cwd: projectPathMeta, absolute: true });
    files.forEach((filePath) => {
      if (
        !excludedFiles.some((exclusionPattern) =>
          glob.hasMagic(exclusionPattern)
            ? glob
                .sync(exclusionPattern, {
                  cwd: projectPathMeta,
                  absolute: true,
                })
                .includes(filePath)
            : filePath.includes(exclusionPattern),
        )
      ) {
        addFileMetadata(filePath);
      }
    });
  });

  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf-8');
  console.log('Metadata updated successfully.');
}

// Function to get changed files
function getChangedFiles() {
  const metadata = fs.existsSync(metadataFile)
    ? JSON.parse(fs.readFileSync(metadataFile, 'utf-8'))
    : {};
  const projectMetadata = metadata[projectName] || {};
  const changedFiles = [];

  function checkFileChanges(filePath) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        const fileMetadata = projectMetadata[filePath];
        const fileChanged =
          !fileMetadata ||
          fileMetadata.mtime !== stats.mtime.getTime() ||
          fileMetadata.size !== stats.size;
        if (fileChanged) {
          changedFiles.push(filePath);
          console.log(`File changed: ${filePath}`);
        }
      } else if (stats.isDirectory()) {
        fs.readdirSync(filePath).forEach((file) =>
          checkFileChanges(path.join(filePath, file)),
        );
      }
    }
  }

  includedFiles.forEach((pattern) => {
    const files = glob.sync(pattern, { cwd: projectPathMeta, absolute: true });
    files.forEach((filePath) => {
      if (
        !excludedFiles.some((exclusionPattern) =>
          glob.hasMagic(exclusionPattern)
            ? glob
                .sync(exclusionPattern, {
                  cwd: projectPathMeta,
                  absolute: true,
                })
                .includes(filePath)
            : filePath.includes(exclusionPattern),
        )
      ) {
        checkFileChanges(filePath);
      }
    });
  });

  return {
    changedFiles,
    hasChanges: changedFiles.length > 0,
  };
}

// Function to create an archive
function createArchive(type, comment, res) {
  const { changedFiles, hasChanges } = getChangedFiles();
  if (type === 'inc' && !hasChanges) {
    return res.json({
      success: true,
      message: 'No changes detected. Incremental archive not created.',
    });
  }

  const archiveName = generateArchiveName(type);
  const commentFileName = `${archiveName.replace('.zip', '.txt')}`;
  const output = fs.createWriteStream(path.join(archivesDir, archiveName));
  const archive = archiver('zip', { zlib: { level: 9 } });

  // Add changed files to the comment
  if (changedFiles.length > 0) {
    const changedFileNames = changedFiles.map((filePath) =>
      path.basename(filePath),
    );
    comment += `\nChanged files:\n${changedFileNames.join('\n')}`;
  }

  output.on('close', () => {
    fs.writeFileSync(path.join(archivesDir, commentFileName), comment, 'utf-8');
    updateMetadata();
    res.json({ success: true });
  });

  archive.on('error', (err) => {
    res.status(500).json({ success: false, error: err.message });
  });

  archive.pipe(output);

  if (type === 'full') {
    includedFiles.forEach((filePattern) => {
      const files = glob.sync(filePattern, {
        cwd: projectPathMeta,
        absolute: true,
      });
      files.forEach((filePath) => {
        if (
          !excludedFiles.some((exclusionPattern) =>
            glob.hasMagic(exclusionPattern)
              ? glob
                  .sync(exclusionPattern, {
                    cwd: projectPathMeta,
                    absolute: true,
                  })
                  .includes(filePath)
              : filePath.includes(exclusionPattern),
          )
        ) {
          archive.file(filePath, {
            name: path.relative(projectPathMeta, filePath),
          });
        }
      });
    });
  } else if (type === 'inc') {
    changedFiles.forEach((filePath) => {
      archive.file(filePath, {
        name: path.relative(projectPathMeta, filePath),
      });
    });
  }

  archive.finalize();
}

// Function to delete an archive
function deleteArchive(archiveName, res) {
  const archivePath = path.join(archivesDir, archiveName);
  const baseName = path.basename(archiveName, path.extname(archiveName));
  const commentPath = path.join(archivesDir, `${baseName}.txt`);

  if (!fs.existsSync(archivePath)) {
    return res.status(404).json({ success: false, error: 'Archive not found' });
  }

  const deleteFile = (filePath) =>
    new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => (err ? reject(err) : resolve()));
      } else {
        resolve();
      }
    });

  deleteFile(archivePath)
    .then(() => deleteFile(commentPath))
    .then(() => res.json({ success: true }))
    .catch((err) =>
      res.status(500).json({ success: false, error: 'Error deleting file' }),
    );
}

// Function to update the comment of an archive
function editArchiveComment(name, comment, res) {
  const baseName = path.basename(name, path.extname(name));
  const commentFilePath = path.join(archivesDir, `${baseName}.txt`);

  if (!fs.existsSync(commentFilePath)) {
    return res
      .status(404)
      .json({ success: false, error: 'Comment file not found' });
  }

  fs.writeFile(commentFilePath, comment, 'utf-8', (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: 'Error updating comment' });
    }
    res.json({ success: true });
  });
}

// Function to extract files from an archive into the project directory
async function extractArchive(name, res) {
  try {
    const archivePath = path.join(archivesDir, name);
    const extractPath = path.resolve(__dirname);
    const fileStream = fs.createReadStream(archivePath);

    await fileStream
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const fullPath = path.join(extractPath, entry.path);
        if (entry.type === 'Directory') {
          fs.mkdirSync(fullPath, { recursive: true });
        } else {
          entry.pipe(fs.createWriteStream(fullPath));
        }
      })
      .promise();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  loadArchives,
  generateArchiveName,
  updateMetadata,
  getChangedFiles,
  createFullArchive: (comment, res) => createArchive('full', comment, res),
  createIncrementalArchive: (comment, res) =>
    createArchive('inc', comment, res),
  deleteArchive,
  editArchiveComment,
  extractArchive,
};
