"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs-node"));
var matrix_1 = require("./matrix");
var epochsPerIteration = 100;
var w = 10;
var h = 10;
var title = "XOR with " + epochsPerIteration + " epochs/iteration";
var m = matrix_1.createMatrix(title, w, h);
var loss = 1;
var iteration = 0;
var model = tf.sequential();
model.add(tf.layers.dense({
    inputShape: [2],
    units: 2,
    activation: 'sigmoid',
}));
model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid',
}));
model.compile({
    optimizer: tf.train.sgd(0.4),
    loss: tf.losses.meanSquaredError,
});
var iterate = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                iteration++;
                return [4 /*yield*/, train()];
            case 1:
                _a.sent();
                predict();
                matrix_1.logMatrix(m, "\nIteration: " + iteration + "\nLoss: " + loss.toFixed(4));
                iterate();
                return [2 /*return*/];
        }
    });
}); };
var predict = function () {
    tf.tidy(function () {
        // add all coordinates from the matrix as inputs
        var inputs = [];
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                inputs.push([x / w, y / h]);
            }
        }
        // convert inputs to a tensor
        var xs = tf.tensor2d(inputs);
        // run prediction
        var ys = model.predict(xs).dataSync();
        // add predicted values to the matrix data
        ys.forEach(function (val, i) { return m.data[Math.floor(i / w)][i % w] = val; });
    });
};
var train = function () { return __awaiter(void 0, void 0, void 0, function () {
    var xs, ys, h;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                xs = tf.tensor2d([
                    [0, 0],
                    [1, 0],
                    [0, 1],
                    [1, 1],
                ]);
                ys = tf.tensor2d([
                    [0],
                    [1],
                    [1],
                    [0]
                ]);
                return [4 /*yield*/, model.fit(xs, ys, {
                        epochs: epochsPerIteration,
                        shuffle: true,
                        verbose: 0,
                    })];
            case 1:
                h = _a.sent();
                // clear memory
                xs.dispose();
                ys.dispose();
                // set the loss value
                loss = h.history.loss[0];
                return [2 /*return*/];
        }
    });
}); };
// start iterating
iterate();
