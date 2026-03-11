## Install
1. Create Personal Access Token in GitHub
2. Write the following in (somewhere imported by) `.zshrc`.
   ```bash
   export NODE_AUTH_TOKEN="your_token_here"
   ```
3. Write the following in `.npmrc` (at `~/.npmrc` or project directory)
   ```
   @shwaka:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```
4. Run
   ```bash
   npm i @shwaka/simple-navbar
    ```
