// bankly/jest.setup.js
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Some pg versions also expect global crypto
if (!global.crypto) {
  global.crypto = require('crypto').webcrypto;
}