# Frequently Asked Questions

### I'm not seeing the latest `@openmrs/esm-framework`. How do I update the dependency?

In a repository using Yarn:

```sh
yarn upgrade @openmrs/esm-framework openmrs  // to upgrade
git checkout package.json  // to reset the version specifiers to 'next'
yarn  // to re-create the lockfile
```

### How do I keep my local dev server up to date?

Just pull the repository you want to work on and run `yarn` or `npm install`.
That will install the latest dependencies, which includes `openmrs`, which is
the tool that runs the dev server.

### How do I find out where the code I need to work on is?

There is no simple correlation between packages and pages and content.

The first thing to check is the [list of repositories](http://o3-dev.docs.openmrs.org/#/main/map?id=repositories-you-should-know-octocat)
and their descriptions. There aren't very many, so it's likely you can
figure out what you're trying to work on just by looking at the list.

If that doesn't work out, another trick is to clone all of the repositories
and then run `grep` across them to look for something you expect to find—
e.g. a piece of text from the UI.

If you have done both of the above things and still haven't found the
code you're looking for, feel free to ask in the
[#openmrs-helpme](https://openmrs.slack.com/archives/C02UNMKFH8V) channel
on Slack.

### How to develop against a restricted environment?

In general you can develop against another environment using the `--backend` flag.
If the other environment is guarded, e.g., by an IP or network restriction then
this is something you need to take care of on your local machine.

In case the guarded environment is restricted via some SSO mechanism using a
cookie you could use the `--add-cookie` flag to achieve this. As an example,
look at the access for a development server from the ICRC:

```sh
npx openmrs start --backend "https://emr-v2.test.icrc.org/" --add-cookie "MRHSession=1234..."
```

The cookie must be obtained by you and strongly depends on the used backend.
