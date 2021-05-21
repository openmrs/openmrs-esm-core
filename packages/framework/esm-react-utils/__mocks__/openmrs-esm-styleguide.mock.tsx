export const showNotification = jest.fn();
export const showToast = jest.fn();

beforeEach(() => {
  showNotification.mockReset();
  showToast.mockReset();
});
