# Squad DevOps and CI

The CI server at dev3.openmrs.org is a community resource, hosted on the OpenMRS infrastructure, though the actual ESMs are stored in a Digital Ocean space kindly provided by AMPATH. Every time a commit is made to
`main` in a community-managed frontend module repository, GitHub Actions
deploys the built package to Digital Ocean and updates the importmap so that the CI server always runs the latest version of all modules.

Every time a GitHub release is created in a community-managed frontend module repository, GitHub Actions releases a new NPM package for each frontend module (tag: "latest"). The difference to an ordinary commit to `main` is that these only create preview packages (tag: "next").

[OpenMRS Bamboo](https://ci.openmrs.org/allPlans.action) is used only for
[openmrs-module-spa](https://github.com/openmrs/openmrs-module-spa/). Its jobs
are [here](https://ci.openmrs.org/browse/SM).

Its CI and release process is the same as all other OpenMRS modules.

## Docker Containers
Dockerized containers of the 3.x Reference Application are available here: 
* https://hub.docker.com/r/openmrs/openmrs-reference-application-3-frontend 
* https://hub.docker.com/r/openmrs/openmrs-reference-application-3-backend
* https://hub.docker.com/r/openmrs/openmrs-reference-application-3-gateway 
