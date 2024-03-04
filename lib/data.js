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

//base directory for data
lib.baseDir = path.join(__dirname, "../.data/");

//Write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir + dir}/${file}.json`, "wx", (err, fd) => {
        if (err) {
            if (err.code === "EEXIST") {
                console.error("File already exists");
                return;
            }
            throw err;
        }

        const stringData = JSON.stringify(data);

        fs.writeFile(fd, stringData, (err) => {
            if (err) {
                console.error(
                    "An error occurred while writing to the file:",
                    err
                );
            } else {
                console.log("Data has been written to the file successfully!");
            }

            // Close the file descriptor
            fs.close(fd, (err) => {
                if (err) {
                    console.error(
                        "An error occurred while closing the file:",
                        err
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

lib.create(this.baseDir, "test", { hello: "World" });
module.exports = lib;
