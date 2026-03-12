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

## Dev
Run `npm run dev` in the root and `test/local-test/`.

## Publish
1. Update `"version"` in `package.json`
2. Commit it and run `git tag v9.99.99` (Note: tag MUST start with `v`)
3. `git push --tags`

## Memo
- `tsup@8.5.1` contains a bug around `--watch` (does not emit `.js`).
  So `8.3.0` is selected.
