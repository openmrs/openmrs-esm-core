import '@testing-library/jest-dom';

window.URL.createObjectURL = jest.fn();

jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
  if (typeof message === 'string' && message.includes('Attempted to override the existing store')) {
    return;
  }
  console.warn(message, ...args);
});
