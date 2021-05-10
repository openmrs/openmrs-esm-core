window.System = {
  import: (name) => import(name),
  resolve: jest.fn().mockImplementation(() => {
    throw new Error("file not found");
  }),
};

window.openmrsBase = "/openmrs";
window.spaBase = "/spa";
window.getOpenmrsSpaBase = () => "/openmrs/spa/";
