const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('@/config/env', () => ({
  API_BASE: 'http://localhost:8080',
  IS_DEV: false,
  USE_MOCKS: true,
}));
