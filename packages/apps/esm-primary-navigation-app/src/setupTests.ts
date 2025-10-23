import '@testing-library/jest-dom';

const { getComputedStyle } = window;

window.getComputedStyle = (elt) => getComputedStyle(elt);
window.getOpenmrsSpaBase = jest.fn();
window['getOpenmrsSpaBase'] = jest.fn().mockImplementation(() => '/');

jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
  if (typeof message === 'string' && message.includes('Attempted to override the existing store')) {
    return;
  }
  console.warn(message, ...args);
});
