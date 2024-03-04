/*
 * Title: User Handler
 * Description: Handler to handle user routes
 * Author: Mehedi Hasan
 * Date: 2024-03-04
 *
 */

const { stringValidator } = require("../../helpers/utilities");
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
            password,
            tosAgreement,
        };
        create("users", phone, _data, (err) => {
            if (!err) {
                callback(200, {
                    message: "User was created successfully",
                });
            } else {
                callback(500, {
                    error: "Could not able to create user",
                });
            }
        });
    } else {
        callback(400, {
            error: "Invalid request body",
        });
    }
};

module.exports = handler;
