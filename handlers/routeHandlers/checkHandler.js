/*
 * Title: Check Handler
 * Description: Handler to handle user defined checks
 * Author: Mehedi Hasan
 * Date: 2024-04-02
 *
 */

const {
    stringValidator,
    parseJSON,
    createRandomString,
} = require("../../helpers/utilities");
const { read, create, update } = require("../../lib/data");
const { maxChecks } = require("./environment");
const { _token } = require("./tokenHandler");

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const { method } = requestProperties;
    if (handler._check[method]) {
        handler._check[method](requestProperties, callback);
    } else {
        callback(405, {
            error: "Method not allowed!",
        });
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    let { protocol, url, method, successCodes, timeoutSeconds } =
        requestProperties.body;

    protocol =
        stringValidator(protocol) && ["http", "https"].includes(protocol)
            ? protocol
            : false;

    url = stringValidator(url);

    method =
        stringValidator(method) &&
        ["get", "post", "put", "delete"].includes(protocol.toLowerCase())
            ? method
            : false;

    successCodes =
        successCodes === "object" && successCodes instanceof Array
            ? successCodes
            : false;

    timeoutSeconds =
        typeof timeoutSeconds === "number" &&
        timeoutSeconds % 1 === 0 &&
        timeoutSeconds >= 1 &&
        timeoutSeconds <= 5
            ? timeoutSeconds
            : false;

    if ((!protocol, !url, !method, !successCodes, !timeoutSeconds)) {
        return callback(400, {
            error: "Invalid request body!!!",
        });
    }

    const token = requestProperties.headersObject.token
        ? stringValidator(requestProperties.headersObject.token)
        : false;

    if (!token) {
        return callback(403, {
            error: "Authentication faliure!",
        });
    }

    read("tokens", token, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(403, {
                error: "User not found!",
            });
        }

        const { phone } = parseJSON(tokenData);

        if (!phone) {
            return callback(403, {
                error: "User not found!",
            });
        }

        read("users", phone, (err2, userData) => {
            if (err2 || !userData) {
                return callback(403, {
                    error: "User not found!",
                });
            }

            _token.verify(token, phone, (isTokenValid) => {
                if (!isTokenValid) {
                    return callback(403, {
                        error: "Authentication problem!",
                    });
                }

                const userObject = parseJSON(userData);
                const userChecks =
                    typeof userObject.checks === "object" &&
                    userObject.checks instanceof Array
                        ? userObject.checks
                        : [];

                if (userChecks.length < maxChecks) {
                    const checkId = createRandomString(20);
                    const checkObject = {
                        id: checkId,
                        phone,
                        protocol,
                        url,
                        method,
                        successCodes,
                        timeoutSeconds,
                    };

                    create("checks", checkId, checkObject, (err3) => {
                        if (!err3) {
                            userObject.checks = userChecks;
                            userObject.checks.push(checkId);

                            update("users", phone, userObject, (err4) => {
                                if (err4) {
                                    return callback(500, {
                                        error: "There was a problem in the server side!",
                                    });
                                }

                                return callback(200, checkObject);
                            });
                        }
                    });
                } else {
                    return callback(401, {
                        error: "User has already reached max check limit!",
                    });
                }
            });
        });
    });
};

module.exports = handler;
