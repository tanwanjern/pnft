# PNFT - NFT Marketplace

Welcome to PNFT, I built this marketplace for learning purpose and fun.

> P stand for Pasar or Playground, NFT stand for Non-fungible token.

### Overview

⋅ **Language/Framework/Library:** Solidity, Polygon, IPFS, Next.js, Ethers.js, and Hardhat.

⋅ **Network:** Polygon Mumbai Testnet

⋅ **Preview:** [Demo](https://pnft-fdyolf1og-tanwanjern.vercel.app/)


### Local setup

To run this project locally, follow these steps.

1. Install the dependencies:

```
# install using NPM or Yarn
npm install

# or
yarn
```

2. Start the local Hardhat node

```sh
npx hardhat node
```

3. With the network running, deploy the contracts to the local network in a separate terminal window

```sh
npx hardhat run scripts/deploy.js --network localhost
```

4. Start the app

```
npm run dev
```

5. Remove ```rpc``` from ```index.js```

```
/* Update this: */
const provider = new ethers.providers.JsonRpcProvider(rpc)
/* to this: */
const provider = new ethers.providers.JsonRpcProvider()
```

### Credit
[Tutorial](https://www.youtube.com/watch?v=GKJBEEXUha0&t=584s)

