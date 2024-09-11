

---

# Node Project Archive Manager

## Description
**Node Project Archive Manager** is a web application designed for managing project archives. It allows users to create full and incremental archives, add comments, and manage archives efficiently through a user-friendly interface.

This application saves the archives in the following directory:
```
const archivesDir = path.resolve('C:/Users/name/OneDrive/backup/project');
```
This path can be customized based on your specific setup.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/node-project-archive-manager.git
   ```

2. Navigate to the project directory:
   ```bash
   cd node-project-archive-manager
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   node archive
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3005`.
2. Enter a comment and select the type of archive (Full or Incremental).
3. Click the **Create Archive** button to generate the archive.

---

## Features

### 1. **Create Full and Incremental Archives**
   - The application allows users to create two types of archives:
     - **Full Archive**: A complete backup of the project at a specific moment. All files are included in the archive, regardless of any changes made since the last archive.
     - **Incremental Archive**: A backup that only includes files that have been modified or added since the last full or incremental archive. This type helps to save storage space and reduce archive creation time when only minor changes have occurred.

   Users can choose the archive type via a simple and intuitive radio button interface in the web UI.

### 2. **Add Comments to Archives**
   - When creating an archive, users can add a comment to describe the archive. This feature allows better organization and easy identification of the contents of each archive. Comments can provide context, such as the purpose of the archive or the changes included.

### 3. **Edit Archive Comments**
   - After an archive has been created, users can update the comment associated with it. This is useful for clarifying or modifying descriptions, especially in cases where a comment might have been left vague or incomplete at the time of creation. The interface allows for in-place editing of comments by clicking on the archive comment badge.

### 4. **Extract Archives**
   - Users can extract the contents of an archive back into the project directory. This allows them to restore their project to a previous state using the files saved in the selected archive. A smooth progress bar displays the extraction process, giving users real-time feedback on the operation's progress.

### 5. **Delete Archives**
   - Archives that are no longer needed can be easily deleted. This feature helps users manage storage by removing outdated or unnecessary backups. A confirmation dialog ensures that users don’t accidentally delete important archives.

### 6. **Progress Bar for Archive Operations**
   - The application features a smooth progress bar that visually represents the completion status of various archive operations, such as creating or extracting archives. This provides users with clear feedback on the status of their requests and ensures a more interactive user experience.

### 7. **Dynamic Textarea for Comments**
   - The comment field in the form dynamically adjusts its height based on the content. This ensures that longer comments remain visible without the need for excessive scrolling, improving the usability of the interface.

### 8. **Archive Listing with Pagination**
   - Archives are displayed in a paginated table, ensuring that users can efficiently navigate through a large number of archives. Pagination controls allow users to browse between pages, and archives are shown with their names, comments, and actions for extraction or deletion.

### 9. **Mobile-Responsive Interface**
   - The web interface is built using Bootstrap, ensuring it is responsive and looks good on various devices, including mobile phones and tablets. This makes the application accessible for users managing archives on the go.

### 10. **Debounced Comment Field**
   - The comment field includes debouncing functionality to optimize performance. This ensures that certain operations (like resizing the comment box or handling input) are not executed too frequently, reducing the load on the browser and providing a smoother experience.

### 11. **Pagination and Archive Count Management**
   - The application displays archives with pagination, making it easier to navigate through large sets of archives. Users can control the number of archives displayed per page and switch between pages for efficient browsing.

---

## API Documentation

### 1. **Load Archives**
   - **URL**: `/archives`
   - **Method**: `GET`
   - **Description**: Retrieves a paginated list of all available archives from the archive directory.
   - **Query Parameters**:
     - `page` (optional): The page number for pagination (default is 1).
     - `pageSize` (optional): The number of archives to display per page (default is 10).
   - **Response**:
     - `archives`: An array of archive objects, each containing:
       - `id`: The inode number of the archive file.
       - `name`: The name of the archive file.
       - `comment`: The comment associated with the archive (if available).
       - `date`: The modification date of the archive file.
     - `totalCount`: The total number of archives available.

### 2. **Create Full Archive**
   - **URL**: `/create-full-archive`
   - **Method**: `POST`
   - **Description**: Creates a full archive of the project, which includes all files matching the specified patterns.
   - **Request Body**:
     - `comment` (required): A text comment describing the archive being created.

### 3. **Create Incremental Archive**
   - **URL**: `/create-incremental-archive`
   - **Method**: `POST`
   - **Description**: Creates an incremental archive, which includes only the files that have been modified since the last archive.
   - **Request Body**:
     - `comment` (required): A text comment describing the incremental archive.

### 4. **Delete Archive**
   - **URL**: `/delete-archive/:name`
   - **Method**: `DELETE`
   - **Description**: Deletes an archive (along with its comment file, if it exists) by its name.
   - **Parameters**:
     - `name` (required): The name of the archive to be deleted (must include the `.zip` extension).

### 5. **Edit Archive Comment**
   - **URL**: `/edit-archive/:name`
   - **Method**: `PUT`
   - **Description**: Updates the comment of a specified archive.
   - **Request Body**:
     - `comment` (required): The new comment to replace the old one.

### 6. **Extract Archive**
   - **URL**: `/extract-archive/:name`
   - **Method**: `POST`
   - **Description**: Extracts the contents of an archive back into the project directory. This is useful for restoring a previous state of the project.
   - **Parameters**:
     - `name` (required): The name of the archive to extract.

---

## Project Structure

```
node-project-archive-manager/
├── archiveUtils.js
├── archive.js
├── package.json
├── README.md
├── LICENSE
├── .gitignore
├── public/
│   └── css/
│       └── archive.css
├── views/
│   └── arc.ejs
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your branch to your forked repository.
5. Create a pull request to the main repository.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Contact
- Email: [axmsrn@gmail.com](mailto:axmsrn@gmail.com)
- GitHub: [axmsrn](https://github.com/axmsrn)

---

This version of the `README.md` includes all necessary instructions and information about the project, including the path for the archives, contributing guidelines, and a detailed API documentation.
