import { cursorTo } from 'readline';

export type Matrix = {
    title: string;
    data: number[][];
}

export const createMatrix = (title: string, w: number, h: number) => {
    const m: Matrix = { title, data: [] };
    for (let i = 0; i < h; i++) {
        m.data.push([]);
        for (let j = 0; j < w; j++) {
            m.data[i].push(0);
        }
    }
    return m;
}

export const logMatrix = (m: Matrix, str: string) => {
    drawMatrix(m);
    console.log(`\n\n\x1b[31m\x1b[1m${m.title}\n\x1b[37m${str}`);
}

const drawMatrix = (m: Matrix) => {
    cursorTo(process.stdout, 0, 0);
    let str = "";
    str += '\x1b[47m  ';
    m.data[0].forEach(() => str += '  ');
    str += '  \x1b[40m\n';
    for (let y = 0; y < m.data.length; y++) {
        str += '\x1b[47m  \x1b[40m';
        for (let x = 0; x < m.data[y].length; x++) {
            str += `\x1b[31m${numberToDensity(m.data[y][x])}`;
            str += `${numberToDensity(m.data[y][x])}`;
        }
        str += "\x1b[47m  \x1b[40m\n";
    }
    str += '\x1b[47m  ';
    m.data[0].forEach(() => str += '  '); 
    str += '  \x1b[40m\n';
    process.stdout.clearScreenDown();
    process.stdout.write(`${str}`); 
}


const densities = [' ', '░', '▒', '▓','█'];
const numberToDensity = (n: number) => {
    for(let i = densities.length - 1; i >= 0; i--) {
        if (n > 1 / densities.length * i) return densities[i];
    }
    return ' ';
}