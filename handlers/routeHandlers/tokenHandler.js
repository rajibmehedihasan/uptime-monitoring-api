/*
 * Title: Token Handler
 * Description: Handler to handle token related routes
 * Author: Mehedi Hasan
 * Date: 2024-03-20
 *
 */

const {
    phoneStringValidator,
    stringValidator,
    parseJSON,
    hash,
    createRandomString,
} = require("../../helpers/utilities");
const { create, read, update, deleteData } = require("../../lib/data");

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ["get", "post", "put", "delete"];
    const { method } = requestProperties;

    if (acceptedMethods.indexOf(method) > -1) {
        handler._token[method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const { phone, password } = requestProperties.body;
    const _phone = phoneStringValidator(phone);
    const _password = stringValidator(password);

    if (_phone && _password) {
        read("users", _phone, (err, userData) => {
            if (err || !userData) {
                callback(400, {
                    error: "Invalid phone number provided.",
                });
                return;
            }

            const _userData = parseJSON(userData);
            const hashPassword = hash(password, phone);

            if (hashPassword === _userData.password) {
                const tokenID = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenID,
                    expires,
                };

                create("tokens", tokenID, tokenObject, (err2) => {
                    if (err2) {
                        callback(500, {
                            error: "There was a problem in the server side!",
                        });
                        return;
                    }

                    callback(200, tokenObject);
                });
            } else {
                callback(400, {
                    error: "Password not valid!",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request",
        });
    }
};

handler._token.get = (requestProperties, callback) => {
    const id = stringValidator(requestProperties.queryStringObject.get("id"));

    if (!id) {
        callback(404, {
            error: "Invalid Request",
        });
        return;
    }

    read("tokens", id, (err, tokenData) => {
        const token = { ...parseJSON(tokenData) };
        if (err || !token) {
            callback(404, {
                error: "Requested user not found!",
            });
            return;
        }

        callback(200, token);
    });
};

handler._token.put = (requestProperties, callback) => {
    const { phone, password } = requestProperties.body;
    const _phone = phoneStringValidator(phone);
    const _password = stringValidator(password);

    if (_phone && _password) {
        read("users", _phone, (err, userData) => {
            if (err || !userData) {
                callback(400, {
                    error: "Invalid phone number provided.",
                });
                return;
            }

            const _userData = parseJSON(userData);
            const hashPassword = hash(password, phone);

            if (hashPassword === _userData.password) {
                const tokenID = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenID,
                    expires,
                };

                create("tokens", tokenID, tokenObject, (err2) => {
                    if (err2) {
                        callback(500, {
                            error: "There was a problem in the server side!",
                        });
                        return;
                    }

                    callback(200, tokenObject);
                });
            } else {
                callback(400, {
                    error: "Password not valid!",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request",
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const { phone, password } = requestProperties.body;
    const _phone = phoneStringValidator(phone);
    const _password = stringValidator(password);

    if (_phone && _password) {
        read("users", _phone, (err, userData) => {
            if (err || !userData) {
                callback(400, {
                    error: "Invalid phone number provided.",
                });
                return;
            }

            const _userData = parseJSON(userData);
            const hashPassword = hash(password, phone);

            if (hashPassword === _userData.password) {
                const tokenID = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenID,
                    expires,
                };

                create("tokens", tokenID, tokenObject, (err2) => {
                    if (err2) {
                        callback(500, {
                            error: "There was a problem in the server side!",
                        });
                        return;
                    }

                    callback(200, tokenObject);
                });
            } else {
                callback(400, {
                    error: "Password not valid!",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request",
        });
    }
};

handler._token.verify = (requestProperties, callback) => {
    const { phone, password } = requestProperties.body;
    const _phone = phoneStringValidator(phone);
    const _password = stringValidator(password);

    if (_phone && _password) {
        read("users", _phone, (err, userData) => {
            if (err || !userData) {
                callback(400, {
                    error: "Invalid phone number provided.",
                });
                return;
            }

            const _userData = parseJSON(userData);
            const hashPassword = hash(password, phone);

            if (hashPassword === _userData.password) {
                const tokenID = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenID,
                    expires,
                };

                create("tokens", tokenID, tokenObject, (err2) => {
                    if (err2) {
                        callback(500, {
                            error: "There was a problem in the server side!",
                        });
                        return;
                    }

                    callback(200, tokenObject);
                });
            } else {
                callback(400, {
                    error: "Password not valid!",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request",
        });
    }
};

module.exports = handler;
