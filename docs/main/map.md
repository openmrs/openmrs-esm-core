# Map of the Project

## Orientation

OpenMRS Frontend 3.0 uses microfrontends. A microfrontend is a self-contained piece of application. It has some UI, and some ideas about where in the application it should be rendered. Each microfrontend can be configured, and some aspects of how microfrontends interact can be configured, too.

There are four important pieces of the OpenMRS Microfrontends system:

- The **app shell**, which is the "base" of the application and coordinates everything
- The **framework**, which is a library that all microfrontends use
- The **import map**, which is a file that tells the app shell what microfrontends to use and where they are
- The **microfrontends**, from which the interface is composed

The microfrontends communicate with the **backend**, which is the OpenMRS server, using its APIs.

### The framework

The **framework** is an NPM package called `@openmrs/esm-framework`, which is composed of multiple smaller libraries. These are documented in the
[OpenMRS Frontend Core README](https://github.com/openmrs/openmrs-esm-core#openmrs-frontend-core).

### The microfrontends

The **microfrontends** are shipped in the ES Module format and usually thus just called `esm`s (same prefix as the libraries). In any case these microfrontends are indeed also libraries, but very special ones that

- are not directly integrated into the main application,
- are loaded indirectly via a special JSON called an "import map", and they
- export a predefined set of functionality including a function called `setupOpenMRS`.

These microfrontends bring in domain-specific UI capabilities such as menu entries, page content, or notifications. In many cases they also come with dedicted [offline](../advanced/offline.md) capabilities, which allow, e.g., registration or modifications of certain patients while not being connected.

### The backend

The backend is an OpenMRS server and its APIs. The frontend application and backend server do not have to be colocated. Since the frontend really just a set of static files, it can be served from anywhere. The specific setup is up to you.

### The repos you should know
The 3.x EMR Reference Application is made up of all the microfrontends found in the following repositories:

- [openmrs-esm-core](https://github.com/openmrs/openmrs-esm-core/tree/master/packages/apps): Microfrontends which are administrative or else integral to the application
- [openmrs-esm-patient-management](https://github.com/openmrs/openmrs-esm-patient-management/tree/main/packages): Microfrontends which deal with creating, searching, and listing patients
- [openmrs-esm-patient-chart](https://github.com/openmrs/openmrs-esm-patient-chart/tree/master/packages): The patient chart microfrontend and all its widgets
- [openmrs-esm-home](https://github.com/openmrs/openmrs-esm-home/tree/master/packages): Microfrontends tied to the home page
- [openmrs-rfc-frontend](https://github.com/openmrs/openmrs-rfc-frontend): a git repo that facilitates a democratic process where folks can propose changes to the frontend implementation via RFCs (Request For Comments). See, for example, the [Contributing Guidelines for Microfrontends](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0020-contributing-guidelines.md), which were established with RFC #20.
