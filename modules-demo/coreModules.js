/**
 * Module 1: Introduction to Node.js
 * -----------------------------------
 * Demonstrates Node's core (built-in) modules and Buffers.
 * Run directly with:   node modules-demo/coreModules.js
 * Or paste these lines one at a time into the Node REPL
 * (type `node` in your terminal) to practice the REPL interactive shell.
 */

// ---- Core module: os ----
const os = require('os');
console.log('--- os module ---');
console.log('Platform:', os.platform());
console.log('CPU architecture:', os.arch());
console.log('Total memory (MB):', Math.round(os.totalmem() / 1024 / 1024));
console.log('Free memory (MB):', Math.round(os.freemem() / 1024 / 1024));
console.log('Number of CPU cores:', os.cpus().length);

// ---- Core module: path ----
const path = require('path');
console.log('\n--- path module ---');
const sampleFilePath = path.join(__dirname, 'data', 'sample.txt');
console.log('Joined path:', sampleFilePath);
console.log('File extension:', path.extname(sampleFilePath));
console.log('Directory name:', path.dirname(sampleFilePath));
console.log('Base file name:', path.basename(sampleFilePath));

// ---- Core module: util ----
const util = require('util');
console.log('\n--- util module ---');
function greet(name, callback) {
  setTimeout(() => callback(null, `Hello, ${name}!`), 100);
}
const greetPromise = util.promisify(greet);
greetPromise('Node.js Student').then((msg) => console.log('Promisified callback result:', msg));

// ---- Buffers ----
console.log('\n--- Buffers ---');
const buf1 = Buffer.from('Hello Node.js');
console.log('Buffer from string:', buf1);
console.log('Buffer to string:', buf1.toString());
console.log('Buffer length (bytes):', buf1.length);

const buf2 = Buffer.alloc(10); // allocates 10 bytes, filled with zeros
buf2.write('Hi');
console.log('Allocated buffer after write:', buf2);

// ---- A simple local (user-defined) module ----
// See ./localModuleExample.js for the module being required here.
const { add, multiply } = require('./localModuleExample');
console.log('\n--- Local module ---');
console.log('add(2, 3) =', add(2, 3));
console.log('multiply(4, 5) =', multiply(4, 5));
