export const showNotification = jest.fn();
export const showActionableNotification = jest.fn();
export const showSnackbar = jest.fn();
export const showToast = jest.fn();

beforeEach(() => {
  showNotification.mockReset();
  showActionableNotification.mockReset();
  showToast.mockReset();
  showSnackbar.mockReset();
});
