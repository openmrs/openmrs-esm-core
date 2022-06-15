# OpenMRS Frontend 3.0 for Developers

<!--

  This documentation follows the Google developer documentation style guide:
    https://developers.google.com/style
  
  Please give it a read and write accordingly.

  Canonical names:
    - "frontend module": any "-app" package
    - "microfrontends": the generic architecture concept
    - "OpenMRS Frontend 3.0": the OpenMRS framework for frontend modules
    - "the OpenMRS CI server": dev3.openmrs.org
    - "community-managed frontend modules": what it sounds like. Doesn't necessarily include
        everything published to the `openmrs` NPM org.

  Other notes:
    - Use Title Case for sidebar links and page titles.
    - Use line breaks. Try and keep line length below 100 characters.
    - Links between different documentation pages must work in the GitHub UI
        (in addition to Docsify). This means that they must be relative and
        suffixed with `.md`.
          Bad: `/main/state`
          Good: `../main/state.md`
    - Right now, it's okay to assume devs are using React. When possible,
        please do include framework-agnostic examples. Keep in mind that at
        some point in the future it may make sense to refactor these docs to
        be less React-centric.
  -->

:link: **Link to this guide: [om.rs/dev3docs](https://om.rs/dev3docs)** :link:	

This documentation is intended to enable developers to develop and deploy
custom UI features for OpenMRS.

Visit the
[Wiki page](https://wiki.openmrs.org/display/projects/OpenMRS+3.0%3A+A+Frontend+Framework+that+enables+collaboration+and+better+User+Experience)
if you haven't already. It provides a high-level
introduction to the project and all of the relevant links.

You should first read the
[Implementer Documentation](https://wiki.openmrs.org/pages/viewpage.action?pageId=224527013),
which provides some conceptual orientation as well as instructions for deployment
and configuring.

Once you've read that, click [Prerequisite knowledge](getting_started/prerequisites.md)
here or in the left sidebar to begin, or check out some videos below.

> Note: This documentation tends to assume that the developer is using React,
but this is not a requirement of OpenMRS Frontend 3.0. Indeed, the entire purpose
of choosing a microfrontends-based architecture was to allow collaboration between
different teams using different technologies. If you are developing
frontend modules in a technology other than React, please tell us so in the
[#openmrs3](https://openmrs.slack.com/archives/CHP5QAE5R) channel on Slack.
We'd love to work with you to make the development experience as smooth as possible,
and take the opportunity to expand OpenMRS Frontend 3.0 support for different
frameworks.

## Videos 🎥

These videos are available to show how you can develop new frontend functionalities using the OpenMRS 3.0 setup.

### Talks 

These are videos which have been recorded for some talks and conference sessions.

- [Why Microfrontends?](https://youtu.be/XDIIuM7Ffas)

### Spotlight Videos

These are videos below 5 minutes showing small dedicated things.

- [Tooling](https://youtu.be/KDC8DwPWwjc)
- [Breadcrumbs](https://youtu.be/Rq4QGSF9r2M)
- [Extensions Introduction](https://youtu.be/crdEL91oBGs)
- [Internationalization](https://youtu.be/1pLUi47BIBo)
- [How to see UX & component guidance in Zeplin designs](https://www.youtube.com/watch?v=SjluEGDH4LU&feature=youtu.be&ab_channel=OpenMRS)

### Tutorials

These are more extensive videos with focus on showing how to develop new frontend modules.

- [Part 1: OpenMRS SPA Extensions Tutorial: About our Frontend Module Architecture & How to Use Extensions](https://iu.mediaspace.kaltura.com/media/t/1_e7kvnx9t?st=702) 
- [Part 2: OpenMRS SPA Extensions Workshop: Practical Session on our MFE Architecture & How to Use Extensions](https://iu.mediaspace.kaltura.com/media/t/1_iaq63mfd?st=282)
   - [OMRS SPA Workshop practice tasks](https://github.com/openmrs/openmrs-esm-testresults/tree/feature/workshop)
   - [OMRS SPA Workshop practice solutions](https://github.com/openmrs/openmrs-esm-testresults/tree/feature/workshop-solutions)


### Others

- [Development Overview](https://youtu.be/aIi1t5o7agI)
- [Patient Banner Implementation](https://youtu.be/3AoxdCjXbys)
- [Attachments Demo](https://youtu.be/Vm6sWV55nBQ)
- [Registration Configuration](https://youtu.be/PA9IiNgHAq8)
