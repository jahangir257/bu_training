/**
 * Module 2: File System module
 * -----------------------------
 * Demonstrates synchronous and asynchronous file operations:
 * create/open, read, update (append), and delete.
 *
 * Run with:  node modules-demo/fileSystemDemo.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'sample.txt');

console.log('=== SYNCHRONOUS FILE OPERATIONS ===');

// Create / write a file synchronously
fs.writeFileSync(filePath, 'Hello from the synchronous File System demo!\n');
console.log('1. File written (sync).');

// Read a file synchronously
const syncContent = fs.readFileSync(filePath, 'utf8');
console.log('2. File read (sync):', syncContent.trim());

// Update (append) a file synchronously
fs.appendFileSync(filePath, 'This line was appended synchronously.\n');
console.log('3. File updated/appended (sync).');
console.log('   New content:', fs.readFileSync(filePath, 'utf8').trim().replace(/\n/g, ' | '));

console.log('\n=== ASYNCHRONOUS FILE OPERATIONS ===');

// Create / write a file asynchronously
const asyncFilePath = path.join(__dirname, 'data', 'sample-async.txt');

fs.writeFile(asyncFilePath, 'Hello from the asynchronous File System demo!\n', (err) => {
  if (err) return console.error('Error writing file (async):', err);
  console.log('1. File written (async).');

  // Read a file asynchronously
  fs.readFile(asyncFilePath, 'utf8', (err, data) => {
    if (err) return console.error('Error reading file (async):', err);
    console.log('2. File read (async):', data.trim());

    // Update (append) a file asynchronously
    fs.appendFile(asyncFilePath, 'This line was appended asynchronously.\n', (err) => {
      if (err) return console.error('Error appending file (async):', err);
      console.log('3. File updated/appended (async).');

      // Finally, delete the async demo file
      fs.unlink(asyncFilePath, (err) => {
        if (err) return console.error('Error deleting file (async):', err);
        console.log('4. File deleted (async): sample-async.txt removed.');
      });
    });
  });
});

// Note: sample.txt (the sync demo file) is left in place so you can inspect it.
// To delete it manually (sync), you could run: fs.unlinkSync(filePath);
