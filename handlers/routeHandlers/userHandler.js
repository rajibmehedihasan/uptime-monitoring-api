/*
 * Title: User Handler
 * Description: Handler to handle user routes
 * Author: Mehedi Hasan
 * Date: 2024-03-04
 *
 */

const { stringValidator, hash, parseJSON } = require("../../helpers/utilities");
const { create, read } = require("../../lib/data");

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ["get", "post", "put", "delete"];
    const { method } = requestProperties;

    if (acceptedMethods.indexOf(method) > -1) {
        handler._users[method](requestProperties, callback);
    } else {
        callback(500);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const { firstName, lastName, phone, password, tosAgreement } =
        requestProperties.body;

    if (
        stringValidator(firstName) &&
        stringValidator(lastName) &&
        stringValidator(phone) &&
        stringValidator(password) &&
        tosAgreement === true
    ) {
        const _data = {
            firstName,
            lastName,
            phone,
            password: hash(password, phone),
            tosAgreement,
        };
        create("users", phone, _data, (err) => {
            if (!err) {
                callback(200, {
                    message: "User created successfully",
                });
            } else {
                callback(500, {
                    error: err || "Could not able to create user",
                });
            }
        });
    } else {
        callback(400, {
            error: "Invalid request body",
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone = stringValidator(
        requestProperties.queryStringObject.get("phone")
    );

    if (!phone) {
        callback(400, {
            error: "Invalid phone number provided.",
        });
        return;
    }

    read("users", phone, (err, user) => {
        const _user = parseJSON(user);
        if (!err && _user) {
            delete _user.password;
            callback(200, _user);
        } else {
            callback(404, {
                error: "Requested user was not found.",
            });
        }
    });
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
