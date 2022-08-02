# Staying Current & Troubleshooting

Staying current with the code base is important to make sure we the latest fixes, latest features, and the correct API to develop against. When developing a microfrontend your code will depend on app-shell and core libraries and sometimes other microfrontends. For the OpenMRS project there are several places we should look to make sure our application is kept up to date. If you are having trouble running code locally when it appears to be working on the server ([dev3](https://dev3.openmrs.org/openmrs/spa)), consider taking any or all of these upgrade steps.
## Updating core libraries

If you notice your app suddenly stop working there is a chance that some core library has changed. The main dependencies shared by all OpenMRS microfrontends are  `openmrs` and `@openmrs/esm-framework`.

```sh
yarn upgrade openmrs @openmrs/esm-framework
git restore package.json # resets version numbers to "next" 
```

After updating these core libraries be sure to restart your development server

## Updating current branch

It's good practice to merge the main branch into your working branch often, at least once a week. This way, if anyone else has made changes to the app dependencies or fixed any bugs you will be able to get these benefits. Also, this prevents merge conflicts when trying to make a PR if your files are behind the main branch.

```sh
git checkout main
git pull
git checkout [my-branch-name]
git merge main
```

## Refreshing importmap

Sometimes the modules being pointed to by the importmap have been updated. If your local development setup is using an old importmap consider replacing the static versions with more recent versions. Another alternative here is to use a dynamic importmap when starting your local server 

```sh
# an example of pointing a local development server to a dynamic importmap
yarn start --importmap "https://spa-modules.nyc3.digitaloceanspaces.com/import-map.json"
```

## Clearing out the browser cache

By default the module javascript files are cached by your browser for 30 days. This is thanks to a [configuration setting](https://github.com/openmrs/openmrs-contrib-ansible-docker-compose/blob/c36115ca22b8fb842f8cf0ff745d1d35a4567912/files/emr-3-dev/proxy.conf#L97) on the server. This is a fine setting for end users, and caching is useful to make sure we don't need to download the entire app again with each reload, but as developers we often need the latest version of a core module or microfrontend as soon as it comes out. The easiest way to trigger a re-download of the app javascript files is to open your browser's implementer tools, going to the "Network" tab and checking "Disable Cache". Then, force reload the page. You should get brand new javascript files from the server. After you have refreshed the page to replace your cached script files, you can uncheck the "Disable Cache" option to improve the application behavior and not re-download script files on every reload. 

How to open browser developer tools (chrome)
<img width="933" alt="open-devtools-chrome" src="https://user-images.githubusercontent.com/5445264/182458545-ba701bb0-1cfe-4083-98bb-5e7338d97065.png">

How to disable asset (javascript, css) cache (chrome)
<img width="936" alt="disable-cache-chrome" src="https://user-images.githubusercontent.com/5445264/182458626-bab053e1-0d4c-4d71-a69a-1357fc1dd13e.png">

## Restarting your computer

Its possible for browser caches to not get cleared properly, or else for applications to be left in an inconsistent state which causes them to run poorly, slowly, or not at all. Sometimes these issues are only recoverable with restarting your computer

 > *Did you turn it off and then on again?*
