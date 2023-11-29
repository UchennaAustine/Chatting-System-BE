"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
var status;
(function (status) {
    status[status["OK"] = 200] = "OK";
    status[status["CREATED"] = 201] = "CREATED";
    status[status["NOT_FOUND"] = 404] = "NOT_FOUND";
    status[status["FORBIDDEN"] = 403] = "FORBIDDEN";
    status[status["BAD_REQUEST"] = 400] = "BAD_REQUEST";
})(status || (exports.status = status = {}));
