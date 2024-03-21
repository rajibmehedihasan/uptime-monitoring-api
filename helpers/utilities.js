/*
 * Title: Utilities
 * Description: Utility functions
 * Author: Mehedi Hasan
 * Date: 2024-03-04
 *
 */

const { createHmac } = require("node:crypto");

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

// Hash
utilities.hash = (string, secret) => {
    if (typeof string === "string" && string.length > 0) {
        const hash = createHmac("sha256", secret || "app_secret_key")
            .update(string)
            .digest("hex");
        return hash;
    }

    return false;
};

utilities.stringValidator = (value) => {
    return typeof value === "string" && value.trim().length > 0 ? value : false;
};

utilities.phoneStringValidator = (value) => {
    return typeof value === "string" && value.trim().length === 11
        ? value
        : false;
};

utilities.createRandomString = (strlength) => {
    let length =
        typeof strlength === "number" && strlength > 0 ? strlength : false;

    if (length) {
        const possiblecharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
        let output = "";

        for (let i = 0; i < length; i += 1) {
            const randomCharacter = possiblecharacters.charAt(
                Math.floor(Math.random() * possiblecharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }

    return false;
};

module.exports = utilities;
