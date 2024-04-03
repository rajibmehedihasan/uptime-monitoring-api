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
const { read, create, update, deleteData } = require("../../lib/data");
const { maxChecks } = require("../../helpers/environment");
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
        ["GET", "POST", "PUT", "DELETE"].includes(method)
            ? method
            : false;

    successCodes =
        typeof successCodes === "object" && successCodes instanceof Array
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

handler._check.get = (requestProperties, callback) => {
    const id = requestProperties.queryStringObject.get("id");

    if (!stringValidator(id) || id.length !== 20) {
        return callback(404, { error: "Invalid Request" });
    }

    read("checks", id, (err, checkData) => {
        if (err || !checkData) {
            return callback(404, { error: "Requested check not found!" });
        }

        const token =
            typeof requestProperties.headersObject.token === "string"
                ? requestProperties.headersObject.token
                : false;

        _token.verify(token, parseJSON(checkData).phone, (tokenId) => {
            if (!tokenId) {
                return callback(403, {
                    error: "Authentication faliure!",
                });
            }

            return callback(200, parseJSON(checkData));
        });
    });
};

handler._check.put = (requestProperties, callback) => {
    let { id, protocol, url, method, successCodes, timeoutSeconds } =
        requestProperties.body;

    id = stringValidator(id) && id.length === 20 ? id : false;

    protocol =
        stringValidator(protocol) && ["http", "https"].includes(protocol)
            ? protocol
            : false;

    url = stringValidator(url);

    method = stringValidator(method) && ["GET", "POST", "PUT", "DELETE"]
        ? method
        : false;

    successCodes =
        typeof successCodes === "object" && successCodes instanceof Array
            ? successCodes
            : false;

    timeoutSeconds =
        typeof timeoutSeconds === "number" &&
        timeoutSeconds % 1 === 0 &&
        timeoutSeconds >= 1 &&
        timeoutSeconds <= 5
            ? timeoutSeconds
            : false;

    if (!id) {
        return callback(400, {
            error: "Invalid request!",
        });
    }

    if (!protocol || !url || !method || !successCodes || !timeoutSeconds) {
        return callback(400, {
            error: "Invalid request!",
        });
    }

    read("checks", id, (err, checkData) => {
        if (err || !checkData) {
            return callback(404, { error: "Requested check not found!" });
        }

        const token =
            typeof requestProperties.headersObject.token === "string"
                ? requestProperties.headersObject.token
                : false;

        const checkObject = parseJSON(checkData);

        _token.verify(token, checkObject.phone, (isTokenValid) => {
            if (!isTokenValid) {
                return callback(403, {
                    error: "Authentication faliure!",
                });
            }

            if (protocol) {
                checkObject.protocol = protocol;
            }
            if (url) {
                checkObject.url = url;
            }
            if (method) {
                checkObject.method = method;
            }
            if (successCodes) {
                checkObject.successCodes = successCodes;
            }
            if (timeoutSeconds) {
                checkObject.timeoutSeconds = timeoutSeconds;
            }

            update("checks", id, checkObject, (err2) => {
                if (err2) {
                    return callback(500, {
                        error: "There was a problem in the server side!",
                    });
                }

                return callback(200, {
                    message: "Check updated successfully!",
                });
            });
        });
    });
};

handler._check.delete = (requestProperties, callback) => {
    const id = requestProperties.queryStringObject.get("id");

    if (!stringValidator(id) || id.length !== 20) {
        return callback(404, { error: "Invalid Request!" });
    }

    read("checks", id, (err, checkData) => {
        const checkObject = parseJSON(checkData);

        if (err || !checkData) {
            return callback(404, { error: "Requested check not found!" });
        }

        const token =
            typeof requestProperties.headersObject.token === "string"
                ? requestProperties.headersObject.token
                : false;
        const { phone } = checkObject;

        _token.verify(token, phone, (isTokenValid) => {
            if (!isTokenValid) {
                return callback(403, {
                    error: "Authentication faliure!",
                });
            }

            deleteData("checks", id, (err2) => {
                if (err2) {
                    return callback(500, {
                        error: "There was a server side error!",
                    });
                }

                read("users", phone, (err3, userData) => {
                    if (err3 || !userData) {
                        return callback(500, {
                            error: "There was a server side error!",
                        });
                    }
                    const userObject = parseJSON(userData);
                    const userChecks =
                        typeof userObject.checks === "object" &&
                        userObject.checks instanceof Array
                            ? userObject.checks
                            : [];

                    const checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                        userChecks.splice(checkPosition, 1);
                        userObject.checks = userChecks;
                        update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err4) => {
                                if (!err4) {
                                    callback(200);
                                } else {
                                    callback(500, {
                                        error: "There was a server side problem!",
                                    });
                                }
                            }
                        );
                    } else {
                        callback(500, {
                            error: "The check id that you are trying to remove is not found in user!",
                        });
                    }
                });
            });
        });
    });
};

module.exports = handler;
