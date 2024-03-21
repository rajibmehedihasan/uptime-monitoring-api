/*
 * Title: User Handler
 * Description: Handler to handle user routes
 * Author: Mehedi Hasan
 * Date: 2024-03-04
 *
 */

const {
    stringValidator,
    hash,
    parseJSON,
    phoneStringValidator,
} = require("../../helpers/utilities");
const { create, read, update, deleteData } = require("../../lib/data");
const { _token } = require("./tokenHandler");

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const { method } = requestProperties;
    if (handler._users[method]) {
        handler._users[method](requestProperties, callback);
    } else {
        callback(405, {
            error: "Method not allowed!",
        });
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const { firstName, lastName, phone, password, tosAgreement } =
        requestProperties.body;

    if (
        stringValidator(firstName) &&
        stringValidator(lastName) &&
        phoneStringValidator(phone) &&
        stringValidator(password) &&
        tosAgreement === true
    ) {
        const hashedPassword = hash(password, phone);
        const userData = {
            firstName,
            lastName,
            phone,
            password: hashedPassword,
            tosAgreement,
        };

        create("users", phone, userData, (err) => {
            if (!err) {
                return callback(200, {
                    message: "User created successfully",
                });
            }
            return callback(500, {
                error: "Could not able to create user",
            });
        });
    } else {
        return callback(400, {
            error: "Invalid request body",
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone = phoneStringValidator(
        requestProperties.queryStringObject.get("phone")
    );

    if (!phone) {
        return callback(400, {
            error: "Invalid phone number provided.",
        });
    }

    const token =
        typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;

    console.log(token);
    _token.verify(token, phone, (tokenId) => {
        if (!tokenId) {
            return callback(403, {
                error: "Authentication faliure!",
            });
        }

        read("users", phone, (err, userData) => {
            if (err || !userData) {
                return callback(404, {
                    error: "Requested user was not found.",
                });
            }

            const user = parseJSON(userData);
            delete user.password;
            return callback(200, user);
        });
    });
};

handler._users.put = (requestProperties, callback) => {
    const { firstName, lastName, phone, password } = requestProperties.body;

    const _phone = phoneStringValidator(phone);

    if (!_phone) {
        return callback(400, {
            error: "Invalid phone number.",
        });
    }

    if (
        !stringValidator(firstName) &&
        !stringValidator(lastName) &&
        !stringValidator(password)
    ) {
        return callback(400, {
            error: "You have a problem in your request!",
        });
    }

    read("users", _phone, (err, userData) => {
        if (err || !userData) {
            return callback(404, {
                error: "Requested user was not found.",
            });
        }

        const user = parseJSON(userData);

        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (password) {
            user.password = hash(password, _phone);
        }

        update("users", _phone, user, (err) => {
            if (err) {
                return callback(500, {
                    error: "There was a problem in the server side!",
                });
            }

            return callback(200, {
                message: "User updated successfully!",
            });
        });
    });
};

handler._users.delete = (requestProperties, callback) => {
    const phone = phoneStringValidator(
        requestProperties.queryStringObject.get("phone")
    );

    if (!phone) {
        return callback(400, {
            error: "Invalid phone number provided.",
        });
    }

    read("users", phone, (err, userData) => {
        if (err) {
            return callback(500, {
                error: "There was a server side error!",
            });
        }

        if (!userData) {
            return callback(404, {
                error: "Requested user was not found.",
            });
        }

        deleteData("users", phone, (err) => {
            if (err) {
                return callback(500, {
                    error: "There was a server side error!",
                });
            }

            return callback(200, {
                message: "Deleted successfully!",
            });
        });
    });
};

module.exports = handler;
