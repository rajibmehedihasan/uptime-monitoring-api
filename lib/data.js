/*
 * Title: Data CRUD
 * Description: Handle data files CRUD operations
 * Author: Mehedi Hasan
 * Date: 2024-03-04
 *
 */

const fs = require("fs");
const path = require("path");

const lib = {};

// base directory for data
lib.baseDir = path.join(__dirname, "../.data/");

// Write data to file
lib.create = (dir, file, data, callback) => {
    // Construct the full path to the file
    const filePath = path.join(lib.baseDir, dir, `${file}.json`);

    // Create directory if it doesn't exist
    fs.mkdir(path.dirname(filePath), { recursive: true }, (err1) => {
        if (err1) {
            console.error("Error creating directory:", err1);
            return callback(err1);
        }

        // Open or create the file for writing
        fs.open(filePath, "wx", (err2, fd) => {
            if (err2) {
                if (err2.code === "EEXIST") {
                    console.error("File already exists");
                    return callback("File already exists");
                }
                console.error("Error opening file:", err2);
                return callback(err2);
            }

            // Convert data to a string
            const stringData = JSON.stringify(data);

            // Write data to the file
            fs.writeFile(fd, stringData, (err3) => {
                if (err3) {
                    console.error("Error writing to file:", err3);
                } else {
                    console.log(
                        "Data has been written to the file successfully!"
                    );
                }

                // Close the file descriptor
                fs.close(fd, (err4) => {
                    if (err4) {
                        console.error("Error closing file:", err4);
                    } else {
                        console.log("File has been closed successfully!");
                    }

                    // Invoke the callback function
                    if (callback) {
                        callback(err3 || err4); // Return the first error encountered
                    }
                });
            });
        });
    });
};

// Read file data
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir + dir}/${file}.json`, "utf8", (err, data) => {
        callback(err, data);
    });
};

// Update file data
lib.update = (dir, file, data, callback) => {
    // Open the file for reading and writing
    fs.open(`${lib.baseDir + dir}/${file}.json`, "r+", (err, fd) => {
        if (err) {
            console.error("Error opening file:", err);
            if (callback) {
                callback(err);
            }
            return;
        }

        // Convert data to a string
        const stringData = JSON.stringify(data);

        // Truncate the file to 0 bytes
        fs.ftruncate(fd, (err2) => {
            if (err2) {
                console.error("Error truncating file:", err2);
                fs.close(fd, () => {
                    if (callback) {
                        callback(err2);
                    }
                });
                return;
            }

            // Write data to the file
            fs.writeFile(fd, stringData, (err3) => {
                if (err) {
                    console.error("Error writing to file:", err3);
                } else {
                    console.log(
                        "Data has been written to the file successfully!"
                    );
                }

                // Close the file
                fs.close(fd, (err4) => {
                    if (err4) {
                        console.error("Error closing file:", err4);
                    } else {
                        console.log("File has been closed successfully!");
                    }

                    // Invoke the callback function
                    if (callback) {
                        callback(err4);
                    }
                });
            });
        });
    });
};

// Delete file
lib.deleteData = (dir, file, callback) => {
    const filePath = `${lib.baseDir + dir}/${file}.json`;

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file does not exist, return an error
            console.error("No such file or directory");
            return callback(err);
        }

        // Delete the file
        fs.unlink(filePath, (err2) => {
            if (err2) {
                // If there was an error deleting the file, return the error
                console.error("Error deleting file:", err2);
                return callback(err2);
            }

            // File deleted successfully
            console.log("File deleted successfully!");
            callback(null);
        });
    });
};

module.exports = lib;
