/*
 * Title: User Handler
 * Description: Handler to handle user routes
 * Author: Mehedi Hasan
 * Date: 2024-03-04
 *
 */

const { stringValidator, hash } = require("../../helpers/utilities");
const { create } = require("../../lib/data");

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
    const phone = stringValidator(requestProperties.searchParams.get("phone"));

    console.log(phone);
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;