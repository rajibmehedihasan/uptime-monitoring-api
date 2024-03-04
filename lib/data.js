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
    fs.open(`${lib.baseDir + dir}/${file}.json`, "wx", (err, fd) => {
        if (err) {
            if (err.code === "EEXIST") {
                console.error("File already exists");
                return callback("File already exists");
            }
            throw err;
        }

        const stringData = JSON.stringify(data);

        fs.writeFile(fd, stringData, (err2) => {
            if (err2) {
                console.error(
                    "An error occurred while writing to the file:",
                    err2
                );
            } else {
                console.log("Data has been written to the file successfully!");
            }

            // Close the file descriptor
            fs.close(fd, (err3) => {
                if (err3) {
                    console.error(
                        "An error occurred while closing the file:",
                        err3
                    );
                } else {
                    console.log("File has been closed successfully!");
                }

                // Invoke the callback function
                if (callback) {
                    callback(err);
                }
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
lib.delete = (dir, file, callback) => {
    fs.access(`${lib.baseDir + dir}/${file}.json`, fs.constants.F_OK, (err) => {
        if (!err) {
            // Delete the file
            fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err2) => {
                if (err2) {
                    // If there was an error deleting the file, return the error
                    return callback(err2);
                }

                // File deleted successfully
                console.log("File deleted successfully!");
                return callback(null);
            });
        }

        // If the file does not exist, return an error
        console.error("No such file or directory");
        return callback(err);
    });
};

module.exports = lib;
