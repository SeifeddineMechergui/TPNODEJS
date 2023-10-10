"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class server {
    constructor(port) {
        this.port = port;
    }
    ;
    start() {
        const app = express();
        app.get('/', (req, res) => {
            res.send(`TypeScript start`);
        });
        app.listen(this.port, () => {
            console.log("Server Start");
        });
    }
}
exports.default = server;
