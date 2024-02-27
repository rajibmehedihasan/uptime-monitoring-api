/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Mehedi Hasan
 * Date: 18/08/2023
 *
 */

const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./handlers/routeHandlers/environment");

const app = {};

app.createServer = () => {
    const server = http.createServer(handleReqRes);
    server.listen(environment.port, () => {
        console.log(`App is listening to port ${environment.port}`);
    });
};

app.createServer();
