import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { ethers } from "ethers";

// const IS_MAINNET = process.env.REACT_APP_NETWORK === 'mainnet';
const IS_MAINNET = false;

const chainId = IS_MAINNET? 1 : 4;
const rpcUrl = IS_MAINNET? "https://eth-mainnet.alchemyapi.io/v2/ccd5do8Kqn7QHjkrx74pwwlgzo10Rtvh/" : "https://rinkeby.infura.io/v3/0b31c4e492e64acc86ab55fd05d5c415";
const scanUrl = IS_MAINNET? "https://bscscan.com/" : "https://testnet.bscscan.com/";

// const BINANCE_MAINNET_PARAMS = {
//   chainId: chainId,
//   chainName: "Ether",
//   nativeCurrency: {
//     name: "Ether",
//     symbol: "BNB",
//     decimals: 18,
//   },
//   rpcUrls: [rpcUrl],
//   blockExplorerUrls: [scanUrl],
// };

const injected = new InjectedConnector({ 
  supportedChainIds: [chainId] 
});

const binance_wallet = new InjectedConnector({
  supportedChainIds: [Number(chainId)],
});


const CoinbaseWallet = new WalletLinkConnector({
  url: rpcUrl,
  appName: 'Formation App',
  appLogoUrl: ''
})

const trustWallet = new InjectedConnector({
  supportedChainIds: [Number(chainId)],
});

const walletConnect = new WalletConnectConnector({
  rpc: {
    1: "https://eth-mainnet.alchemyapi.io/v2/ccd5do8Kqn7QHjkrx74pwwlgzo10Rtvh/",
    4: "https://rinkeby.infura.io/v3/0b31c4e492e64acc86ab55fd05d5c415/",
  },
  bridge: "https://bridge.walletconnect.org/",
  qrcode: true,
  pollingInterval: 12000,
});

export const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export { injected, trustWallet, CoinbaseWallet, walletConnect, binance_wallet, chainId };
