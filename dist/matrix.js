"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline_1 = require("readline");
exports.createMatrix = function (title, w, h) {
    var m = { title: title, data: [] };
    for (var i = 0; i < h; i++) {
        m.data.push([]);
        for (var j = 0; j < w; j++) {
            m.data[i].push(0);
        }
    }
    return m;
};
exports.logMatrix = function (m, str) {
    drawMatrix(m);
    console.log("\n\n\u001B[31m\u001B[1m" + m.title + "\n\u001B[37m" + str);
};
var drawMatrix = function (m) {
    readline_1.cursorTo(process.stdout, 0, 0);
    var str = "";
    str += '\x1b[47m  ';
    m.data[0].forEach(function () { return str += '  '; });
    str += '  \x1b[40m\n';
    for (var y = 0; y < m.data.length; y++) {
        str += '\x1b[47m  \x1b[40m';
        for (var x = 0; x < m.data[y].length; x++) {
            str += "\u001B[31m" + numberToDensity(m.data[y][x]);
            str += "" + numberToDensity(m.data[y][x]);
        }
        str += "\x1b[47m  \x1b[40m\n";
    }
    str += '\x1b[47m  ';
    m.data[0].forEach(function () { return str += '  '; });
    str += '  \x1b[40m\n';
    process.stdout.clearScreenDown();
    process.stdout.write("" + str);
};
var densities = [' ', '░', '▒', '▓', '█'];
var numberToDensity = function (n) {
    for (var i = densities.length - 1; i >= 0; i--) {
        if (n > 1 / densities.length * i)
            return densities[i];
    }
    return ' ';
};
