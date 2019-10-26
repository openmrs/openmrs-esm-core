window.System = {
  import: jest
    .fn()
    .mockRejectedValue(new Error("config.json not available in import map")),
  resolve: jest.fn().mockImplementation(() => {
    throw new Error("config.json not available in import map");
  }),
  register: jest.fn()
};
