/*
 * Title: Handle Request Response
 * Description: Handle Request and Response
 * Author: Mehedi Hasan
 * Date: 01/11/2023
 *
 */

require("dotenv").config();
const { StringDecoder } = require("string_decoder");
const { URL } = require("url");

const handler = {};

handler.handleReqRes = (req, res) => {
    const parsedURL = new URL(req.url, process.env.APP_BASE_URL);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");
    const method = req.method.toLowerCase();
    const queryStringObject = parsedURL.query;
    const headersObject = req.headers;

    const decoder = new StringDecoder("utf-8");
    let realData = "";

    req.on("data", (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on("end", () => {
        realData += decoder.end();
        console.log(realData);
        res.end("Hello World");
    });
};

module.exports = handler;
