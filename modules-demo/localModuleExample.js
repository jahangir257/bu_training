/**
 * A simple local module demonstrating module.exports / require.
 */

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
