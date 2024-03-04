/*
 * Title: Utilities
 * Description: Utility functions
 * Author: Mehedi Hasan
 * Date: 2024-03-04
 *
 */

const utilities = {};

// Parse JSON
utilities.parseJSON = (string) => {
    let output;
    try {
        output = JSON.parse(string);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        output = {};
    }

    return output;
};

utilities.stringValidator = (value) => {
    return typeof value === "string" && value.trim().length > 0 ? value : false;
};

module.exports = utilities;
