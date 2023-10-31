/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Mehedi Hasan
 * Date: 01/11/2023
 *
 */

const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: "This is sample URL",
    });
};

module.exports = handler;
