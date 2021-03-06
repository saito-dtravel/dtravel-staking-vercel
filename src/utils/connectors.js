import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { ethers } from "ethers";

const IS_MAINNET = process.env.REACT_APP_NETWORK === 'mainnet';
const chainId = IS_MAINNET? 56 : 97;
const rpcUrl = IS_MAINNET? "https://bsc-dataseed.binance.org/" : "https://data-seed-prebsc-1-s1.binance.org:8545/";
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
    56: "https://bsc-dataseed.binance.org/",
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
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

export { injected, trustWallet, CoinbaseWallet, walletConnect, binance_wallet };
