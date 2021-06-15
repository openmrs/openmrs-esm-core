# Squad DevOps and CI

The CI server at openmrs-spa.org is a community resource maintained by
AMPATH. It is hosted in DigitalOcean. Every time a commit is made to
`master` in a community-managed microfrontend repository, GitHub Actions
deploys the built package to the CI server.

[OpenMRS Bamboo](https://ci.openmrs.org/allPlans.action) is used only for
[openmrs-module-spa](https://github.com/openmrs/openmrs-module-spa/). Its jobs
are [here](https://ci.openmrs.org/browse/SM).
Its CI and release process is the same as all other OpenMRS modules'.
