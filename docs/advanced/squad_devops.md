# Squad DevOps and CI

The CI server at openmrs-spa.org is a community resource maintained by
AMPATH. It is hosted in DigitalOcean. Every time a commit is made to
`master` in a community-managed microfrontend repository, GitHub Actions
deploys the built package to the CI server.

Every time a GitHub release is created in a community-managed microfrontend repository, GitHub Actions releases a new NPM package for each microfrontend (tag: "latest"). The difference to an ordinary commit to `master` is that these only create preview packages (tag: "next").

[OpenMRS Bamboo](https://ci.openmrs.org/allPlans.action) is used only for
[openmrs-module-spa](https://github.com/openmrs/openmrs-module-spa/). Its jobs
are [here](https://ci.openmrs.org/browse/SM).

Its CI and release process is the same as all other OpenMRS modules.
