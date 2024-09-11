//archive.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {
  loadArchives,
  createFullArchive,
  createIncrementalArchive,
  deleteArchive,
  editArchiveComment,
  extractArchive,
} = require('./archiveUtils');

const app = express();
const router = express.Router();
const archivesDir = path.resolve('C:/Users/alex/OneDrive/backup/worklog');
const projectPath = path.resolve(__dirname, '..'); // Points to D:\Projects\WorkLog
const projectName = path.basename(projectPath); // Will be 'worklog'

// Configure middleware
app.use(bodyParser.json());
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Serve static files from the archives directory
router.use('/archives', express.static(archivesDir));

// Render the arc.ejs page
router.get('/', (req, res) => {
  const archives = loadArchives();
  res.render('arc', { archives, projectName });
});

app.get('/archives', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const archives = loadArchives(); // Use the loadArchives function
  const paginatedArchives = archives.slice(startIndex, endIndex);
  const totalCount = archives.length;

  res.json({
    archives: paginatedArchives,
    totalCount,
  });
});

// Create a new full archive
router.post('/create-full-archive', (req, res) => {
  createFullArchive(req.body.comment, res);
});

// Create a new incremental archive
router.post('/create-incremental-archive', (req, res) => {
  createIncrementalArchive(req.body.comment, res);
});

// Delete an archive
router.delete('/delete-archive/:name', (req, res) => {
  deleteArchive(req.params.name, res);
});

// Update the comment of an archive
router.put('/edit-archive/:name', (req, res) => {
  editArchiveComment(req.params.name, req.body.comment, res);
});

// Extract files from an archive into the project directory
router.post('/extract-archive/:name', async (req, res) => {
  extractArchive(req.params.name, res);
});

// Use the router
app.use('/', router);

// Start the server
const port = process.env.PORT || 3005;

app.listen(port, async () => {
  const url = `http://localhost:${port}`;
  console.log(`Server started on port ${port}`);
  const { default: open } = await import('open');
  open(url); // Opens the browser
});

module.exports = router;
