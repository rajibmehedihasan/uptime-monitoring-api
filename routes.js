/*
 * Title: Routes
 * Description: Application Route
 * Author: Mehedi Hasan
 * Date: 01/11/2023
 *
 */

const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
