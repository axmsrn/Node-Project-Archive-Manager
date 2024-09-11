

---

# Node Project Archive Manager

## Description
**Node Project Archive Manager** is a web application designed for managing project archives. It allows users to create full and incremental archives, add comments, and manage archives efficiently through a user-friendly interface.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
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
   - **Example Response**:
     ```json
     {
       "archives": [
         {
           "id": 123456789,
           "name": "05-Oct-2023_12.00.00_worklog_full.zip",
           "comment": "Initial full archive",
           "date": "2023-10-05T12:00:00.000Z"
         },
         {
           "id": 987654321,
           "name": "06-Oct-2023_14.30.00_worklog_inc.zip",
           "comment": "Incremental backup with minor changes",
           "date": "2023-10-06T14:30:00.000Z"
         }
       ],
       "totalCount": 2
     }
     ```

### 2. **Create Full Archive**
   - **URL**: `/create-full-archive`
   - **Method**: `POST`
   - **Description**: Creates a full archive of the project, which includes all files matching the specified patterns.
   - **Request Body**:
     - `comment` (required): A text comment describing the archive being created.
   - **Response**:
     - `success`: A boolean indicating whether the archive was successfully created.
     - `message`: A message confirming the archive creation.
   - **Example Request**:
     ```json
     {
       "comment": "Initial full archive with all project files"
     }
     ```
   - **Example Response**:
     ```json
     {
       "success": true,
       "message": "Archive created successfully!"
     }
     ```

### 3. **Create Incremental Archive**
   - **URL**: `/create-incremental-archive`
   - **Method**: `POST`
   - **Description**: Creates an incremental archive, which includes only the files that have been modified since the last archive.
   - **Request Body**:
     - `comment` (required): A text comment describing the incremental archive.
   - **Response**:
     - `success`: A boolean indicating whether the incremental archive was successfully created.
     - `message`: A message confirming the archive creation or indicating that no changes were detected.
   - **Example Request**:
     ```json
     {
       "comment": "Incremental archive with changes"
     }
     ```
   - **Example Response (if changes are detected)**:
     ```json
     {
       "success": true,
       "message": "Archive created successfully!"
     }
     ```
   - **Example Response (if no changes are detected)**:
     ```json
     {
       "success": true,
       "message": "No changes detected. Incremental archive not created."
     }
     ```

### 4. **Delete Archive**
   - **URL**: `/delete-archive/:name`
   - **Method**: `DELETE`
   - **Description**: Deletes an archive (along with its comment file, if it exists) by its name.
   - **Parameters**:
     - `name` (required): The name of the archive to be deleted (must include the `.zip` extension).
   - **Response**:
     - `success`: A boolean indicating whether the archive was successfully deleted.
     - `error`: An error message in case the archive could not be found or deleted.
   - **Example Response (success)**:
     ```json
     {
       "success": true
     }
     ```
   - **Example Response (error)**:
     ```json
     {
       "success": false,
       "error": "Archive not found"
     }
     ```

### 5. **Edit Archive Comment**
   - **URL**: `/edit-archive/:name`
   - **Method**: `PUT`
   - **Description**: Updates the comment of a specified archive.
   - **Parameters**:
     - `name` (required): The name of the archive for which the comment needs to be updated.
   - **Request Body**:
     - `comment` (required): The new comment to replace the old one.
   - **Response**:
     - `success`: A boolean indicating whether the comment was successfully updated.
     - `error`: An error message in case the comment file could not be found or updated.


   - **Example Request**:
     ```json
     {
       "comment": "Updated comment for the archive"
     }
     ```
   - **Example Response (success)**:
     ```json
     {
       "success": true
     }
     ```
   - **Example Response (error)**:
     ```json
     {
       "success": false,
       "error": "Comment file not found"
     }
     ```

### 6. **Extract Archive**
   - **URL**: `/extract-archive/:name`
   - **Method**: `POST`
   - **Description**: Extracts the contents of an archive back into the project directory. This is useful for restoring a previous state of the project.
   - **Parameters**:
     - `name` (required): The name of the archive to extract.
   - **Response**:
     - `success`: A boolean indicating whether the archive was successfully extracted.
     - `error`: An error message in case the archive could not be found or extracted.
   - **Example Response (success)**:
     ```json
     {
       "success": true
     }
     ```
   - **Example Response (error)**:
     ```json
     {
       "success": false,
       "error": "Error extracting archive"
     }
     ```

---

### Summary of API Endpoints

| Endpoint                               | Method  | Description                                    |
| -------------------------------------- | ------- | ---------------------------------------------- |
| `/archives`                            | `GET`   | Fetches a list of archives with pagination.    |
| `/create-full-archive`                 | `POST`  | Creates a full archive of the project.         |
| `/create-incremental-archive`          | `POST`  | Creates an incremental archive.                |
| `/delete-archive/:name`                | `DELETE`| Deletes an archive by name.                    |
| `/edit-archive/:name`                  | `PUT`   | Edits the comment associated with an archive.  |
| `/extract-archive/:name`               | `POST`  | Extracts an archive's contents into the project directory. |

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

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
- Email: [axmsrn@gmail.com](mailto:axmsrn@gmail.com)
- GitHub: [your-github-profile](https://github.com/your-github-profile)

---

