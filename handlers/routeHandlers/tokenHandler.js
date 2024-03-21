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
    const { method } = requestProperties;
    if (handler._token[method]) {
        handler._token[method](requestProperties, callback);
    } else {
        callback(405, {
            error: "Method not allowed!",
        });
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
                return callback(400, {
                    error: "Invalid phone number provided.",
                });
            }

            const _userData = parseJSON(userData);
            const hashPassword = hash(password, phone);

            if (hashPassword !== _userData.password) {
                return callback(400, {
                    error: "Password not valid!",
                });
            }

            const tokenID = createRandomString(20);
            const expires = Date.now() + 60 * 60 * 1000;
            const tokenObject = { phone, id: tokenID, expires };

            create("tokens", tokenID, tokenObject, (err2) => {
                if (err2) {
                    return callback(500, {
                        error: "There was a problem in the server side!",
                    });
                }

                return callback(200, tokenObject);
            });
        });
    } else {
        return callback(400, {
            error: "You have a problem in your request",
        });
    }
};

handler._token.get = (requestProperties, callback) => {
    const id = requestProperties.queryStringObject.get("id");

    if (!stringValidator(id) || id.length !== 20) {
        return callback(404, { error: "Invalid Request" });
    }

    read("tokens", id, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(404, { error: "Requested user not found!" });
        }

        return callback(200, parseJSON(tokenData));
    });
};

handler._token.put = (requestProperties, callback) => {
    let { id, extend } = requestProperties.body;
    id = stringValidator(id) && id.length === 20 ? id : false;

    if (!id || !extend) {
        return callback(400, { error: "Invalid request body" });
    }

    read("tokens", id, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(400, {
                error: "There was a problem in your request",
            });
        }

        const tokenObj = parseJSON(tokenData);

        if (tokenObj.expires <= Date.now()) {
            return callback(400, { error: "Token already expired!" });
        }

        tokenObj.expires = Date.now() + 60 * 60 * 1000;

        update("tokens", id, tokenObj, (err) => {
            if (err) {
                return callback(500, { error: "Internal server error!" });
            }

            return callback(200);
        });
    });
};

handler._token.delete = (requestProperties, callback) => {
    const id = requestProperties.queryStringObject.get("id");

    if (!stringValidator(id) || id.length !== 20) {
        return callback(404, { error: "Invalid Request" });
    }

    read("tokens", id, (err, tokenData) => {
        if (err) {
            return callback(500, { error: "There was a server side error!" });
        }

        if (!tokenData) {
            return callback(404, { error: "Not found!" });
        }

        deleteData("tokens", id, (err2) => {
            if (err2) {
                return callback(500, {
                    error: "There was a server side error!",
                });
            }

            return callback(200, { message: "Deleted successfully!" });
        });
    });
};

handler._token.verify = (id, phoneNumber, callback) => {
    read("tokens", id, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(false);
        }

        const _tokenData = parseJSON(tokenData);
        const { phone, expires } = _tokenData;

        if (phone === phoneNumber && expires > Date.now()) {
            return callback(true);
        }

        return callback(false);
    });
};

module.exports = handler;
