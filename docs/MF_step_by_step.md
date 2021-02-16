1. Create a new repo in github called “openmrs-esm-[name]-ext”, e.g. openmrs-esm-foo-ext

2. Create a directory called openmrs-esm and cd into it. Clone the above repo here.

3. Clone https://github.com/openmrs/openmrs-esm-login.git to openmrs-esm directory as well. We are going to use this as a “template” for creating a new extension widget

4. Copy all the code from openmrs-esm-login to your openmrs-esm-...-ext directory: ``` cp -r openmrs-esm-login/* openmrs-esm-...-ext/ ```

5. Open up this folder in Visual Studio Code

6. Update webpack.config.js
- Find and replace "-esm-login" with "-esm-...-ext" (where ... is the name you chose)

7. In your terminal, install the npm modules: 
``` npm install ```
- make sure you are using a relatively recent version of node, LTE is 14.x.x, you can type node -version to find your current version.
- I would recommend using n to manage your node version: see https://www.npmjs.com/package/n

