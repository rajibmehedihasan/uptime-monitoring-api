/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Mehedi Hasan
 * Date: 18/08/2023
 *
 */

const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

const app = {};

app.config = {
    port: 3000,
};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`App is listening to port ${app.config.port}`);
    });
};

app.handleReqRes = handleReqRes;

app.createServer();
