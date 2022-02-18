## <small>0.0.13 (2022-02-10)</small>

* Fix issue with accounts not having identifier ([5a9e3cf](https://github.com/block-core/blockcore-extension/commit/5a9e3cf))
* Make the explorer link dependent on instance of extension ([4588833](https://github.com/block-core/blockcore-extension/commit/4588833))
* Update changelog and version ([01d1624](https://github.com/block-core/blockcore-extension/commit/01d1624))



## <small>0.0.12 (2022-02-09)</small>

* Add handling of indexer online but node is offline ([0dacaa6](https://github.com/block-core/blockcore-extension/commit/0dacaa6))
* Add the network status check to watch indexer also ([6401991](https://github.com/block-core/blockcore-extension/commit/6401991))
* Fixing the network configuration for test networks ([283ac79](https://github.com/block-core/blockcore-extension/commit/283ac79))
* Update the changelog and version ([e759009](https://github.com/block-core/blockcore-extension/commit/e759009))



## <small>0.0.11 (2022-02-08)</small>

* Add a rudimentary network status indicator ([65c5528](https://github.com/block-core/blockcore-extension/commit/65c5528))
* Add refresh of transactions on account view ([c93a78d](https://github.com/block-core/blockcore-extension/commit/c93a78d)), closes [#65](https://github.com/block-core/blockcore-extension/issues/65)
* Add some improved error handling and logging for different network status ([35caf66](https://github.com/block-core/blockcore-extension/commit/35caf66))
* Add syncing status (behind tip) to the network status indicator ([d7d00f6](https://github.com/block-core/blockcore-extension/commit/d7d00f6))
* Change how network is connected to accounts ([1cc6495](https://github.com/block-core/blockcore-extension/commit/1cc6495))
* Improve the networks status code ([e00fa88](https://github.com/block-core/blockcore-extension/commit/e00fa88))
* Introduce a new 'ui-activated' event used to get additional state information ([d17bc29](https://github.com/block-core/blockcore-extension/commit/d17bc29))
* Skip querying the indexer if the status is not online ([84b90d4](https://github.com/block-core/blockcore-extension/commit/84b90d4))
* Starts implementing an improve network status manager ([8982d17](https://github.com/block-core/blockcore-extension/commit/8982d17))
* WIP: Work on the NetworkStatusManager ([ec4ca51](https://github.com/block-core/blockcore-extension/commit/ec4ca51))



## <small>0.0.10 (2022-02-06)</small>

* Make the transaction history unique ([636d8ae](https://github.com/block-core/blockcore-extension/commit/636d8ae)), closes [#65](https://github.com/block-core/blockcore-extension/issues/65)
* Update changelog ([0ad5a36](https://github.com/block-core/blockcore-extension/commit/0ad5a36))



## <small>0.0.9 (2022-02-05)</small>

* Add developer mode in settings ([cde814d](https://github.com/block-core/blockcore-extension/commit/cde814d))
* Add French language file to prepare for translation ([086114c](https://github.com/block-core/blockcore-extension/commit/086114c))
* Add support for i18n (internationalization) ([87725a3](https://github.com/block-core/blockcore-extension/commit/87725a3))
* Add translation module and translation extractor ([d42b493](https://github.com/block-core/blockcore-extension/commit/d42b493))
* Change the syntax for translation keys ([f625b3f](https://github.com/block-core/blockcore-extension/commit/f625b3f))
* Fix CreateNewWallet translation ([685da73](https://github.com/block-core/blockcore-extension/commit/685da73))
* Fixes the transaction history and displays correctly ([cfcb940](https://github.com/block-core/blockcore-extension/commit/cfcb940))
* Improved the transaction history with consolidation that works better ([b7884a7](https://github.com/block-core/blockcore-extension/commit/b7884a7))
* Revert "Update build pipeline to run in parallel" ([49617ef](https://github.com/block-core/blockcore-extension/commit/49617ef))
* Update changelog ([2877dac](https://github.com/block-core/blockcore-extension/commit/2877dac))



## <small>0.0.8 (2022-02-04)</small>

* Add retry logic for indexer calls ([c36a9c6](https://github.com/block-core/blockcore-extension/commit/c36a9c6))
* Fix a typo and upgrade version ([4935e8c](https://github.com/block-core/blockcore-extension/commit/4935e8c)), closes [#60](https://github.com/block-core/blockcore-extension/issues/60)



## <small>0.0.7 (2022-02-01)</small>

* Hide the extra languages in settings ([4d5d4f9](https://github.com/block-core/blockcore-extension/commit/4d5d4f9)), closes [#26](https://github.com/block-core/blockcore-extension/issues/26)
* Update changelog and version ([a014206](https://github.com/block-core/blockcore-extension/commit/a014206))
* Update network pipe to use NetworkService ([3c26c25](https://github.com/block-core/blockcore-extension/commit/3c26c25))



## <small>0.0.6 (2022-02-01)</small>

* Add a button to maximize wallet in a tab ([fa48f7a](https://github.com/block-core/blockcore-extension/commit/fa48f7a)), closes [#31](https://github.com/block-core/blockcore-extension/issues/31)
* Add dedicated LoggerService and BackgroundLoggerService ([b9809fa](https://github.com/block-core/blockcore-extension/commit/b9809fa))
* Add framework for logging ([e7509a3](https://github.com/block-core/blockcore-extension/commit/e7509a3))
* Change the initial wallet name ([4011d45](https://github.com/block-core/blockcore-extension/commit/4011d45))
* Improve handling of wallet selection after delete wallet ([cf69653](https://github.com/block-core/blockcore-extension/commit/cf69653)), closes [#48](https://github.com/block-core/blockcore-extension/issues/48)
* Remove console logging from indexer ([35b36f8](https://github.com/block-core/blockcore-extension/commit/35b36f8))
* Remove console logging from wallet manager ([d027133](https://github.com/block-core/blockcore-extension/commit/d027133))
* Update changelog and version for next release ([dd6eaff](https://github.com/block-core/blockcore-extension/commit/dd6eaff))
* Update the expander icon ([5a37df7](https://github.com/block-core/blockcore-extension/commit/5a37df7))



## <small>0.0.5 (2022-01-31)</small>

* Enable all features for dev mode ([95d70ef](https://github.com/block-core/blockcore-extension/commit/95d70ef))
* Fix a lint issue ([1dc12d7](https://github.com/block-core/blockcore-extension/commit/1dc12d7))
* Fix type linting issue for production build ([27a48aa](https://github.com/block-core/blockcore-extension/commit/27a48aa))
* Improve stateless orchestration ([8e51625](https://github.com/block-core/blockcore-extension/commit/8e51625)), closes [#50](https://github.com/block-core/blockcore-extension/issues/50)
* Improve the stateless orchestration ([95d4e76](https://github.com/block-core/blockcore-extension/commit/95d4e76)), closes [#50](https://github.com/block-core/blockcore-extension/issues/50)
* Increase wallet lock to 15 minutes ([293f6b7](https://github.com/block-core/blockcore-extension/commit/293f6b7))
* Refactor orchestration to be stateless ([c85c359](https://github.com/block-core/blockcore-extension/commit/c85c359)), closes [#50](https://github.com/block-core/blockcore-extension/issues/50)
* Update README and featureset for individual instances ([f62abb5](https://github.com/block-core/blockcore-extension/commit/f62abb5))



## <small>0.0.4 (2022-01-31)</small>

* Add build of multiple instances ([f778df4](https://github.com/block-core/blockcore-extension/commit/f778df4))
* Migrate away from "-extension" subfix ([d199b4d](https://github.com/block-core/blockcore-extension/commit/d199b4d))
* Prepare for next release ([23da37c](https://github.com/block-core/blockcore-extension/commit/23da37c))
* Simplify the build and update some labels for steps ([a0468c7](https://github.com/block-core/blockcore-extension/commit/a0468c7))



## <small>0.0.3 (2022-01-31)</small>

* Add a notification that Cirrus is not yet supported ([a65f23c](https://github.com/block-core/blockcore-extension/commit/a65f23c))
* Add change password feature ([c1aa2fe](https://github.com/block-core/blockcore-extension/commit/c1aa2fe)), closes [#25](https://github.com/block-core/blockcore-extension/issues/25)
* Add changelog functionality ([cdc9803](https://github.com/block-core/blockcore-extension/commit/cdc9803))
* Add Cirrus back as enabled network ([5658646](https://github.com/block-core/blockcore-extension/commit/5658646))
* Add display of balance on send and support maximum send ([9df248c](https://github.com/block-core/blockcore-extension/commit/9df248c))
* Add link to releases in the changes view ([9fe5a8d](https://github.com/block-core/blockcore-extension/commit/9fe5a8d))
* Add listener for last addresses ([2191747](https://github.com/block-core/blockcore-extension/commit/2191747))
* Add reference to another issue in the changes log ([f088608](https://github.com/block-core/blockcore-extension/commit/f088608))
* Add watch on addresses when used in transactions ([c6c419d](https://github.com/block-core/blockcore-extension/commit/c6c419d))
* Fix bug where Cirrus account could not be added ([6d8ce3c](https://github.com/block-core/blockcore-extension/commit/6d8ce3c))
* Fix issue with empty change amount when sending max ([a3cc4f1](https://github.com/block-core/blockcore-extension/commit/a3cc4f1))
* Fix potential issue with rounding error in display of total ([9a75b73](https://github.com/block-core/blockcore-extension/commit/9a75b73))
* Fix the max button ([cb7de95](https://github.com/block-core/blockcore-extension/commit/cb7de95))
* Perform a wallet scan every 30 seconds when account view is open ([6e169b4](https://github.com/block-core/blockcore-extension/commit/6e169b4))
* Update packages ([cac58dc](https://github.com/block-core/blockcore-extension/commit/cac58dc))
* Update the changes history ([fe98c1e](https://github.com/block-core/blockcore-extension/commit/fe98c1e))
* Update the document title based upon instance ([f5f5269](https://github.com/block-core/blockcore-extension/commit/f5f5269))
* Update the scan options ([d15037b](https://github.com/block-core/blockcore-extension/commit/d15037b))
* Update with results from "npm audit fix" ([5f3d729](https://github.com/block-core/blockcore-extension/commit/5f3d729))
* Upgrade to v0.0.3 for next release ([e00c930](https://github.com/block-core/blockcore-extension/commit/e00c930))



## <small>0.0.2 (2022-01-28)</small>

* Add a basic empty browser extension ([ef71032](https://github.com/block-core/blockcore-extension/commit/ef71032))
* Add a close button to sidenav ([b64acbe](https://github.com/block-core/blockcore-extension/commit/b64acbe))
* Add a complete basic wallet management ([45db94f](https://github.com/block-core/blockcore-extension/commit/45db94f))
* Add a couple of wait for async operations for wallet and account create ([dd08719](https://github.com/block-core/blockcore-extension/commit/dd08719))
* Add a paunch task for the basic web test ([503bc21](https://github.com/block-core/blockcore-extension/commit/503bc21))
* Add a pipe to render ticker for network ([b39b7b0](https://github.com/block-core/blockcore-extension/commit/b39b7b0)), closes [#12](https://github.com/block-core/blockcore-extension/issues/12)
* Add a privacy notice on DID edit ([d05f76f](https://github.com/block-core/blockcore-extension/commit/d05f76f))
* Add a receive component to display receive address ([22000aa](https://github.com/block-core/blockcore-extension/commit/22000aa))
* Add account creation wizard ([b462f68](https://github.com/block-core/blockcore-extension/commit/b462f68))
* Add account listing on dashboard ([70ca89e](https://github.com/block-core/blockcore-extension/commit/70ca89e))
* Add account status UI ([0200cd2](https://github.com/block-core/blockcore-extension/commit/0200cd2))
* Add AccountManager to keep state and operations for individual accounts ([4c1a967](https://github.com/block-core/blockcore-extension/commit/4c1a967))
* Add additional settings and wipe functionality ([507f563](https://github.com/block-core/blockcore-extension/commit/507f563))
* Add almost complete working tx build and signing ([0ee9afc](https://github.com/block-core/blockcore-extension/commit/0ee9afc))
* Add animated gif to show the extension in use ([8dce704](https://github.com/block-core/blockcore-extension/commit/8dce704))
* add await and enable broadcast ([72654cf](https://github.com/block-core/blockcore-extension/commit/72654cf))
* Add background script ([6b89761](https://github.com/block-core/blockcore-extension/commit/6b89761))
* Add basic address generation ([27faeb5](https://github.com/block-core/blockcore-extension/commit/27faeb5))
* Add basic Angular and Material project ([f018346](https://github.com/block-core/blockcore-extension/commit/f018346))
* Add basic loading simulation ([1150b47](https://github.com/block-core/blockcore-extension/commit/1150b47))
* Add basic mnemonic generation and encryption/restore ([7b287b4](https://github.com/block-core/blockcore-extension/commit/7b287b4))
* Add buttons for vault configuration ([3118aee](https://github.com/block-core/blockcore-extension/commit/3118aee))
* Add calculation of amounts, fees and display OP_RETURN data. ([88c89c2](https://github.com/block-core/blockcore-extension/commit/88c89c2))
* Add child routing process for transaction sending ([ae009eb](https://github.com/block-core/blockcore-extension/commit/ae009eb))
* Add colors to transaction history and make them link to explorer ([82df480](https://github.com/block-core/blockcore-extension/commit/82df480))
* Add complete receive query and balance caluclation ([376e6af](https://github.com/block-core/blockcore-extension/commit/376e6af))
* Add creation of accounts from the default account screen ([7bbc748](https://github.com/block-core/blockcore-extension/commit/7bbc748)), closes [#33](https://github.com/block-core/blockcore-extension/issues/33)
* Add CRS address derivation ([de39b9f](https://github.com/block-core/blockcore-extension/commit/de39b9f))
* Add display of amount in correct format ([89dcafe](https://github.com/block-core/blockcore-extension/commit/89dcafe))
* Add display of network status ([6222548](https://github.com/block-core/blockcore-extension/commit/6222548))
* Add edit (rename) of wallet ([7cf8c1c](https://github.com/block-core/blockcore-extension/commit/7cf8c1c)), closes [#3](https://github.com/block-core/blockcore-extension/issues/3)
* add feature toggling ([0972d8f](https://github.com/block-core/blockcore-extension/commit/0972d8f)), closes [#20](https://github.com/block-core/blockcore-extension/issues/20)
* Add function to broadcast transaction to the indexer ([ee5d6ce](https://github.com/block-core/blockcore-extension/commit/ee5d6ce))
* Add functionality for "Show Secret Recovery Phrase" ([1f9d1b7](https://github.com/block-core/blockcore-extension/commit/1f9d1b7))
* Add functions to get network ([e734802](https://github.com/block-core/blockcore-extension/commit/e734802))
* Add hot-reload ([e7fa325](https://github.com/block-core/blockcore-extension/commit/e7fa325))
* Add identity action ([ba87b8d](https://github.com/block-core/blockcore-extension/commit/ba87b8d))
* Add interfaces for account, transaction and history ([6a2cc53](https://github.com/block-core/blockcore-extension/commit/6a2cc53))
* Add keyboard enter input on unlock ([9f5de7b](https://github.com/block-core/blockcore-extension/commit/9f5de7b))
* Add menu and toolbar ([b35f8fc](https://github.com/block-core/blockcore-extension/commit/b35f8fc))
* Add multiple output projects ([4259a77](https://github.com/block-core/blockcore-extension/commit/4259a77))
* Add OK button at the end of payment process ([f8a8ab4](https://github.com/block-core/blockcore-extension/commit/f8a8ab4))
* Add options to settings ([30fbcc5](https://github.com/block-core/blockcore-extension/commit/30fbcc5))
* Add password change UI ([ab6e2c7](https://github.com/block-core/blockcore-extension/commit/ab6e2c7)), closes [#25](https://github.com/block-core/blockcore-extension/issues/25)
* Add persistence of encrypted mnemonic ([31a2544](https://github.com/block-core/blockcore-extension/commit/31a2544))
* Add proper icon for CoinVault extension ([a974a99](https://github.com/block-core/blockcore-extension/commit/a974a99))
* Add purposeAddress to allow override of address format ([f1d123b](https://github.com/block-core/blockcore-extension/commit/f1d123b))
* Add QR code and more details to receive page ([5b7d0ed](https://github.com/block-core/blockcore-extension/commit/5b7d0ed))
* Add query of change address and combine the balance ([6c86ec8](https://github.com/block-core/blockcore-extension/commit/6c86ec8))
* Add receive address generation ([7d79e71](https://github.com/block-core/blockcore-extension/commit/7d79e71))
* Add settings and improve add account ([33c15d1](https://github.com/block-core/blockcore-extension/commit/33c15d1))
* Add sorted transaction history on account ([94c956b](https://github.com/block-core/blockcore-extension/commit/94c956b))
* Add standard .vscode setup for Angular projects ([c837bc2](https://github.com/block-core/blockcore-extension/commit/c837bc2))
* Add storage of identities ([98c8bdc](https://github.com/block-core/blockcore-extension/commit/98c8bdc))
* Add support for actions triggered from web pages ([287fdb4](https://github.com/block-core/blockcore-extension/commit/287fdb4))
* Add support for dark and light mode ([8b9936c](https://github.com/block-core/blockcore-extension/commit/8b9936c))
* Add support for icons on accounts ([c2ac089](https://github.com/block-core/blockcore-extension/commit/c2ac089))
* Add support for identity publish ([5857eb1](https://github.com/block-core/blockcore-extension/commit/5857eb1))
* Add supported browsers to README ([2938168](https://github.com/block-core/blockcore-extension/commit/2938168))
* Add tabs on dashboard ([b652ff7](https://github.com/block-core/blockcore-extension/commit/b652ff7))
* Add the account selection ([add4045](https://github.com/block-core/blockcore-extension/commit/add4045))
* Add workflow to build release ([0782da7](https://github.com/block-core/blockcore-extension/commit/0782da7))
* Add xpub generation for accounts when added ([0294bec](https://github.com/block-core/blockcore-extension/commit/0294bec))
* Adds retrieval of unspent outputs and lists the outputs on send ([1fc40bd](https://github.com/block-core/blockcore-extension/commit/1fc40bd)), closes [#40](https://github.com/block-core/blockcore-extension/issues/40)
* Attempt to flatten the package structure ([74328f5](https://github.com/block-core/blockcore-extension/commit/74328f5))
* Basic proof-of-concept for lock and unlock with background service ([a3ddeb9](https://github.com/block-core/blockcore-extension/commit/a3ddeb9))
* Clean up networks and introduce application manager ([c51e0b9](https://github.com/block-core/blockcore-extension/commit/c51e0b9))
* Cleanup and improve logic for wallet management ([0afa72c](https://github.com/block-core/blockcore-extension/commit/0afa72c))
* Cleanup and temporary "scan" button on account ([a4907a2](https://github.com/block-core/blockcore-extension/commit/a4907a2))
* Cleanup the wallet create account ([d0486f3](https://github.com/block-core/blockcore-extension/commit/d0486f3))
* Completes the signing workflow ([cb77e80](https://github.com/block-core/blockcore-extension/commit/cb77e80))
* Completes update ability for identities ([2c3966d](https://github.com/block-core/blockcore-extension/commit/2c3966d))
* Correct folder name for workflow ([2f66150](https://github.com/block-core/blockcore-extension/commit/2f66150))
* Create addresses.ts ([c056f6a](https://github.com/block-core/blockcore-extension/commit/c056f6a))
* Disable extra features ([df4383d](https://github.com/block-core/blockcore-extension/commit/df4383d))
* Disable the send button if the transaction is not generated correctly ([b1d780f](https://github.com/block-core/blockcore-extension/commit/b1d780f))
* Display change address in the details below balance ([9c6ef44](https://github.com/block-core/blockcore-extension/commit/9c6ef44))
* Display name, version and description from manifest ([50995c0](https://github.com/block-core/blockcore-extension/commit/50995c0))
* Display transaction details ([6bf24fb](https://github.com/block-core/blockcore-extension/commit/6bf24fb))
* Drop the hard-coded link to blockcore ([1fece39](https://github.com/block-core/blockcore-extension/commit/1fece39))
* Enable broadcast of transaction ([d6caa75](https://github.com/block-core/blockcore-extension/commit/d6caa75))
* export the new account and transaction types ([387bca2](https://github.com/block-core/blockcore-extension/commit/387bca2))
* Extend the network definitions to include more details ([d7c3371](https://github.com/block-core/blockcore-extension/commit/d7c3371))
* Extension is now active everywhere ([bada66f](https://github.com/block-core/blockcore-extension/commit/bada66f))
* Finalize the most basic send functionality ([a4cbed3](https://github.com/block-core/blockcore-extension/commit/a4cbed3)), closes [#41](https://github.com/block-core/blockcore-extension/issues/41)
* Finalize the send UI ([8356b1f](https://github.com/block-core/blockcore-extension/commit/8356b1f))
* Fix account management state ([b7f4943](https://github.com/block-core/blockcore-extension/commit/b7f4943))
* Fix capitalized .ts ([31d53da](https://github.com/block-core/blockcore-extension/commit/31d53da))
* Fix capitalized .ts for NOSTR ([9fe645b](https://github.com/block-core/blockcore-extension/commit/9fe645b))
* Fix initial state load issues ([2d1aca2](https://github.com/block-core/blockcore-extension/commit/2d1aca2))
* Fix issue with CSP with change in defaults for Angular 12 ([1471ae6](https://github.com/block-core/blockcore-extension/commit/1471ae6))
* Fix issue with identity address generation ([8b2e2ac](https://github.com/block-core/blockcore-extension/commit/8b2e2ac))
* Fix issue with reveal of secret recovery phrase (missing await) ([b0de5fa](https://github.com/block-core/blockcore-extension/commit/b0de5fa))
* Fix issue with transaction details ([7a2009a](https://github.com/block-core/blockcore-extension/commit/7a2009a))
* Fix rename of wallet ([edbc46b](https://github.com/block-core/blockcore-extension/commit/edbc46b))
* Fix scrolling on regular screens ([dca0cee](https://github.com/block-core/blockcore-extension/commit/dca0cee))
* Fix sequence for DID Document updates ([13a21d6](https://github.com/block-core/blockcore-extension/commit/13a21d6))
* Fix typo on account creation and add note to never share ([c10f3dc](https://github.com/block-core/blockcore-extension/commit/c10f3dc))
* Handle wallet change and auto-unlock ([2500811](https://github.com/block-core/blockcore-extension/commit/2500811))
* Hide setting options that are not yet supported ([08c65fe](https://github.com/block-core/blockcore-extension/commit/08c65fe))
* Hide some default account options ([202b4c2](https://github.com/block-core/blockcore-extension/commit/202b4c2))
* Implement force scan for transactions ([942a773](https://github.com/block-core/blockcore-extension/commit/942a773))
* Implemented background state ([4c23e64](https://github.com/block-core/blockcore-extension/commit/4c23e64))
* Improve the instruction in README ([abc00bb](https://github.com/block-core/blockcore-extension/commit/abc00bb))
* Improve the scrollbar styling and support theme ([e44dd6c](https://github.com/block-core/blockcore-extension/commit/e44dd6c))
* Improve the scrolling behavior ([6cc3bb5](https://github.com/block-core/blockcore-extension/commit/6cc3bb5))
* Improve UI with fee rate and input validation ([3287316](https://github.com/block-core/blockcore-extension/commit/3287316))
* Initial commit ([b556c2e](https://github.com/block-core/blockcore-extension/commit/b556c2e))
* Initial upgrade to Angular 13 ([43fd84b](https://github.com/block-core/blockcore-extension/commit/43fd84b))
* Introduce the WalletManager that act as root for user data ([e3d7a43](https://github.com/block-core/blockcore-extension/commit/e3d7a43))
* Make account creation use the available network list ([7a4c791](https://github.com/block-core/blockcore-extension/commit/7a4c791))
* Make interface and types for network definitions ([6a1dd2d](https://github.com/block-core/blockcore-extension/commit/6a1dd2d))
* Make the extension activate everywhere ([4b4331b](https://github.com/block-core/blockcore-extension/commit/4b4331b))
* Make the URLs in settings dependent on environment ([9f1ec71](https://github.com/block-core/blockcore-extension/commit/9f1ec71))
* Migrate from EncryptedDataVault to VerifiableDataRegistry ([795c2d1](https://github.com/block-core/blockcore-extension/commit/795c2d1))
* Migrate to using Psbt for transaction building ([c13b2c5](https://github.com/block-core/blockcore-extension/commit/c13b2c5))
* Minor improvements ([ac5196f](https://github.com/block-core/blockcore-extension/commit/ac5196f))
* Minor margin change ([c7d3082](https://github.com/block-core/blockcore-extension/commit/c7d3082))
* Minor tweaks to change password ([6e12a10](https://github.com/block-core/blockcore-extension/commit/6e12a10))
* Move the scan button and make the UI loading indicator correct ([f99a65e](https://github.com/block-core/blockcore-extension/commit/f99a65e))
* Navigate into folder to pack ([9775679](https://github.com/block-core/blockcore-extension/commit/9775679))
* Query the indexer every single minute ([2d51e82](https://github.com/block-core/blockcore-extension/commit/2d51e82))
* Reduce the available networks to only STRAX ([362d750](https://github.com/block-core/blockcore-extension/commit/362d750))
* Refactoring more code ([81f1db9](https://github.com/block-core/blockcore-extension/commit/81f1db9))
* Remove some debug code ([c74407a](https://github.com/block-core/blockcore-extension/commit/c74407a))
* Remove the temporary state fix ([f2074a4](https://github.com/block-core/blockcore-extension/commit/f2074a4)), closes [#44](https://github.com/block-core/blockcore-extension/issues/44)
* Remove the test recovery phrase from wallet restore ([9434e11](https://github.com/block-core/blockcore-extension/commit/9434e11))
* Remove unlocked from state (exists on wallet manager now) ([b4e2f20](https://github.com/block-core/blockcore-extension/commit/b4e2f20))
* Retrieves the transaction details ([1afbaee](https://github.com/block-core/blockcore-extension/commit/1afbaee)), closes [#39](https://github.com/block-core/blockcore-extension/issues/39)
* Set a default indexer and improve URL calculation ([49f8c3f](https://github.com/block-core/blockcore-extension/commit/49f8c3f))
* Show toast when identity is published ([87c1295](https://github.com/block-core/blockcore-extension/commit/87c1295))
* Signing works ([d2e85e2](https://github.com/block-core/blockcore-extension/commit/d2e85e2))
* Some prototype code for Vault creation ([9907ea2](https://github.com/block-core/blockcore-extension/commit/9907ea2))
* Start the secret recovery phrase recovery ([0b5906c](https://github.com/block-core/blockcore-extension/commit/0b5906c))
* Stop populating default accounts on wallet create ([a3f044d](https://github.com/block-core/blockcore-extension/commit/a3f044d))
* Tuning the colors a bit ([dd5df03](https://github.com/block-core/blockcore-extension/commit/dd5df03))
* UI improvements for the sending process ([f131b57](https://github.com/block-core/blockcore-extension/commit/f131b57))
* Unable to reproduce the import error ([ac53309](https://github.com/block-core/blockcore-extension/commit/ac53309))
* Update Angular #2 ([db92744](https://github.com/block-core/blockcore-extension/commit/db92744)), closes [#2](https://github.com/block-core/blockcore-extension/issues/2)
* Update background.ts ([75f7a7e](https://github.com/block-core/blockcore-extension/commit/75f7a7e))
* update coinvault icon ([52a45e9](https://github.com/block-core/blockcore-extension/commit/52a45e9))
* Update home.component.ts ([79c066a](https://github.com/block-core/blockcore-extension/commit/79c066a))
* Update release notes in app ([3b8a14a](https://github.com/block-core/blockcore-extension/commit/3b8a14a))
* Update the angular package size limits ([1f71993](https://github.com/block-core/blockcore-extension/commit/1f71993))
* Update the branding for the extension ([b8d9b78](https://github.com/block-core/blockcore-extension/commit/b8d9b78))
* Update the JSON structure for Vault configuration ([f0a3e66](https://github.com/block-core/blockcore-extension/commit/f0a3e66))
* Update the manifest output for assets ([955ae50](https://github.com/block-core/blockcore-extension/commit/955ae50))
* Upgrade Angular #1 ([83f20f0](https://github.com/block-core/blockcore-extension/commit/83f20f0)), closes [#1](https://github.com/block-core/blockcore-extension/issues/1)
* Upgrade axios dependency due to warning ([4f32e31](https://github.com/block-core/blockcore-extension/commit/4f32e31))
* Upgrade some packages ([49dcca8](https://github.com/block-core/blockcore-extension/commit/49dcca8))
* Upgrade to Angular 13 ([c78e53f](https://github.com/block-core/blockcore-extension/commit/c78e53f))
* Upgrades packages and fix build error ([280cf68](https://github.com/block-core/blockcore-extension/commit/280cf68))
* Use a custom Angular port for extension ([d187fb6](https://github.com/block-core/blockcore-extension/commit/d187fb6))
* Very basic showing of history data ([8f482a8](https://github.com/block-core/blockcore-extension/commit/8f482a8))
* Was a missing await causing identity storage issue ([b427d38](https://github.com/block-core/blockcore-extension/commit/b427d38)), closes [#18](https://github.com/block-core/blockcore-extension/issues/18)
* WIP: Add vault creation components ([cd1425f](https://github.com/block-core/blockcore-extension/commit/cd1425f))
* WIP: Basic account management done ([3c842a4](https://github.com/block-core/blockcore-extension/commit/3c842a4))
* WIP: Started working on the menu ([241d72a](https://github.com/block-core/blockcore-extension/commit/241d72a))



