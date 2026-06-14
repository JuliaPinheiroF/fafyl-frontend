const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(({ children }) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'map' }, children);
  }),
  TileLayer: jest.fn(() => null),
  Marker: jest.fn(() => null),
  Polyline: jest.fn(() => null),
  Popup: jest.fn(({ children }) => {
    const React = require('react');
    return React.createElement('div', null, children);
  }),
  useMap: jest.fn(),
}));

jest.mock('@/config/env', () => ({
  API_BASE: 'http://localhost:8080',
  IS_DEV: false,
  USE_MOCKS: true,
}));
