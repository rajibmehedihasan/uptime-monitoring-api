/*
 * Title: Routes
 * Description: Application Route
 * Author: Mehedi Hasan
 * Date: 01/11/2023
 *
 */

const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
