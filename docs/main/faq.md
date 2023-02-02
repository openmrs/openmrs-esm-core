# Frequently Asked Questions

## Troubleshooting Local Dev Environment

It's important to keep your working code base current with the latest fixes, latest features, and library APIs to develop against. When developing a frontend module your code will depend on the app shell and core libraries, and sometimes other frontend modules. If you are having trouble running code locally when it appears to be working on the server ([dev3](https://dev3.openmrs.org/openmrs/spa)), try the following.


### How do I keep my local dev server up to date?

Just pull the repository you want to work on and run `yarn`.
That will install the latest dependencies, which includes `openmrs`, which is
the tool that runs the dev server.

For help with pulling the latest code see the [community help page](https://wiki.openmrs.org/display/docs/Using+Git) for basic git commands.

### I'm not seeing the latest `@openmrs/esm-framework`. How do I update the dependency?

If you notice your app suddenly stop working, it might be because a core library has changed in the app shell on the server you are developing against. The main dependencies shared by all OpenMRS frontend modules are `openmrs` and `@openmrs/esm-framework`. They can be updated like this:

```sh
# Upgrade core libraries
yarn up openmrs @openmrs/esm-framework

# Reset version specifiers to `next`. Don't commit actual version numbers.
git checkout package.json

# Run `yarn` to recreate the lockfile
yarn
```

### Using a custom importmap

By default, when you run `yarn start`, the command will use the importmap from dev3, that is, https://dev3.openmrs.org/openmrs/spa/importmap.json. This is the default importmap for the reference application and generally what you will want to use. However, in some situations, you may want to us a custom importmap, such as a distribution-specific importmap. In this case, you can use the `--importmap` argument to the `yarn start` command to point to any importmap you like:

```sh
yarn start --importmap "https://dev3.openmrs.org/openmrs/spa/import-map.json"
```

### Clearing out the browser cache

By default the server [tells your browser](https://github.com/openmrs/openmrs-contrib-ansible-docker-compose/blob/c36115ca22b8fb842f8cf0ff745d1d35a4567912/files/emr-3-dev/proxy.conf#L97) to cache JavaScript files for 30 days. You can [bypass your browser's cache](https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache) when refreshing the page. If you want to keep the cache disabled while you are developing, open your browser's developer tools, go to the "Network" tab, and check "Disable Cache." The cache will only be disabled while the developer tools are open, and only for the page that they are attached to. 

How to open browser developer tools (chrome)
<img width="933" alt="open-devtools-chrome" src="https://user-images.githubusercontent.com/5445264/182458545-ba701bb0-1cfe-4083-98bb-5e7338d97065.png">

How to disable asset (javascript, css) cache (chrome)
<img width="936" alt="disable-cache-chrome" src="https://user-images.githubusercontent.com/5445264/182458626-bab053e1-0d4c-4d71-a69a-1357fc1dd13e.png">

### Clear local package cache

Although yarn is very good at maintaining its dependency list as specified in `yarn.lock` it is possible for the `node_modules` folder containing library packages to get corrupted. You can manually remove the the `node_modules` folder and rebuild it with `yarn`

```sh
rm -rf node_modules/
yarn
```

This will only delete the root `node_modules` folder. You may also want to delete the `node_modules` of all packages in a monorepo. If the monorepo has Lerna you can simply run `npx lerna clean` followed by `yarn`. Otherwise delete these manually, then run `yarn`.

Yarn is smart and will quickly compile the new `node_modules` folder from its internal cache. If you are worried that yarn has cached an invalid version of a package you can clear yarn cache to force it to download the packages again

```sh
yarn cache clean
```


## Further Info

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

### How do I develop against a restricted environment?

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


## Dev hacks

### Turn on dev tools

```js
localStorage.setItem('openmrs:devtools', true)
```

### Manually set an importmap override

```js
localStorage.setItem("import-map-override:@openmrs/esm-form-entry-app", "http://localhost:4200/openmrs-esm-form-entry-app.js");
```
