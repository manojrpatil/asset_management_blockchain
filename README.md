# Asset management using blockchain (Real Estate)
An ethereum blockchain project

Follow the steps below to download, install, and run this project.

## Dependencies
Install these prerequisites to follow along with the tutorial. See free video tutorial or a full explanation of each prerequisite.

- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/

## Step 1. Clone the project
git clone https://github.com/manojrpatil/asset_management_blockchain.git

## Step 2. Install dependencies
$ cd asset_management_blockchain
$ npm install

## Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance. See free video tutorial for full explanation.

## Step 4. Compile & Deploy Election Smart Contract
$ truffle compile This will compile the code and build two files under 'build' folder.
$ truffle migrate --reset You must migrate the election smart contract each time your restart ganache.

## Step 5. Run the Front End Application
$ npm run dev Visit this URL in your browser: http://localhost:8080 Please note that if this port is in use, it will increase the port until it gets the free port and will host it there. You can get the exact port number from the console.

If you get stuck, please post your issues.
