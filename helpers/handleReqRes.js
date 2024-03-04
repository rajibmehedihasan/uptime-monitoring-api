/*
 * Title: Handle Request Response
 * Description: Handle Request and Response
 * Author: Mehedi Hasan
 * Date: 01/11/2023
 *
 */
const { StringDecoder } = require("string_decoder");
const { URL } = require("url");
const routes = require("../routes");
const {
    notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");
const { parseJSON } = require("./utilities");

const handler = {};

handler.handleReqRes = (req, res) => {
    const parsedURL = new URL(
        req.url,
        process.env.APP_BASE_URL || "http://localhost:3000"
    );
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");
    const method = req.method.toLowerCase();
    const queryStringObject = parsedURL.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedURL,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder("utf-8");
    let realData = "";

    const chosenHandler = routes[trimmedPath]
        ? routes[trimmedPath]
        : notFoundHandler;

    req.on("data", (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on("end", () => {
        realData += decoder.end();
        requestProperties.body = parseJSON(realData);
        chosenHandler(requestProperties, (status, data) => {
            const statusCode = typeof status === "number" ? status : 500;
            const payload = typeof data === "object" ? data : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
