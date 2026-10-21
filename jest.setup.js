/* eslint-disable no-undef */
let mockStore = {};
const mockAsyncStorage = {
  getItem: jest.fn((key) => Promise.resolve(mockStore[key] || null)),
  setItem: jest.fn((key, value) => {
    mockStore[key] = value.toString();
    return Promise.resolve(null);
  }),
  removeItem: jest.fn((key) => {
    delete mockStore[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    mockStore = {};
    return Promise.resolve(null);
  }),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
  ...mockAsyncStorage,
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
    Svg: (props) => React.createElement(View, props),
    Circle: (props) => React.createElement(View, props),
    Path: (props) => React.createElement(View, props),
    Defs: (props) => React.createElement(View, props),
    LinearGradient: (props) => React.createElement(View, props),
    Stop: (props) => React.createElement(View, props),
  };
});
