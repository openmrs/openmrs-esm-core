window.System = {
  import: (name) => import(name),
  resolve: jest.fn().mockImplementation(() => {
    throw new Error("config.json not available in import map");
  }),
  register: jest.fn(),
};

window.openmrsBase = "/openmrs";
window.spaBase = "/spa";
window.getOpenmrsSpaBase = () => "/openmrs/spa/";
