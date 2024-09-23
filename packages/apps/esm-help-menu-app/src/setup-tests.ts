(window as any).importMapOverrides = {
  getOverrideMap: jest.fn().mockReturnValue({ imports: {} }),
};
