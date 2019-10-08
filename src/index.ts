import * as tf from '@tensorflow/tfjs-node';
import { createMatrix, logMatrix, Matrix } from './matrix';

const epochsPerIteration: number = 100;
const w: number = 10;
const h: number = 10;
const title: string = `XOR with ${epochsPerIteration} epochs/iteration`;
const m: Matrix = createMatrix(title, w, h);

let loss: number = 1;
let iteration: number = 0;

const model: tf.Sequential = tf.sequential();
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

const iterate = async () => {
    iteration++;
    await train();
    predict();
    logMatrix(m, `\nIteration: ${iteration}\nLoss: ${loss.toFixed(4)}`);
    iterate();
}

const predict = () => {    
    tf.tidy(() => {
        // add all coordinates from the matrix as inputs
        let inputs = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                inputs.push([x/w,y/h]);
            }
        }
        // convert inputs to a tensor
        const xs: tf.Tensor2D = tf.tensor2d(inputs);
        // run prediction
        const ys: tf.backend_util.TypedArray = (model.predict(xs) as tf.Tensor).dataSync();
        // add predicted values to the matrix data
        ys.forEach((val: number, i: number) => m.data[Math.floor(i/w)][i%w] = val);
    });
}

const train = async () => {
    // input data
    let xs = tf.tensor2d([
        [0,0],
        [1,0],
        [0,1],
        [1,1],
    ]);
    // desired output
    let ys = tf.tensor2d([
        [0],
        [1],
        [1],
        [0]
    ]);
    // train the model
    const h: tf.History = await model.fit(xs, ys,
    {
        epochs: epochsPerIteration,
        shuffle: true,
        verbose: 0, 
    });
    // clear memory
    xs.dispose();
    ys.dispose();
    // set the loss value
    loss = h.history.loss[0] as number;
}
// start iterating
iterate(); 
