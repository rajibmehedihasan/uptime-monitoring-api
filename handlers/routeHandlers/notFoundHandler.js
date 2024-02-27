/*
 * Title: 404
 * Description: Not Found Handler
 * Author: Mehedi Hasan
 * Date: 01/11/2023
 *
 */

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        status: 404,
        message: "Not Found!!!",
    });
};

module.exports = handler;
