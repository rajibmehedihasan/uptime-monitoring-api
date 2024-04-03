/*
 * Title: Routes
 * Description: Application Route
 * Author: Mehedi Hasan
 * Date: 01/11/2023
 *
 */

const { checkHandler } = require("./handlers/routeHandlers/checkHandler");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;
