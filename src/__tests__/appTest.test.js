"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
// @ts-ignore
var sum_1 = require("./sum");
(0, globals_1.describe)('sum module', function () {
    (0, globals_1.test)('adds 1 + 2 to equal 3', function () {
        (0, globals_1.expect)((0, sum_1.sum)(1, 2)).toBe(3);
    });
});
