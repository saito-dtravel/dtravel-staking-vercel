const IS_MAINNET = process.env.REACT_APP_NETWORK === 'mainnet';

const CONTRACTS = IS_MAINNET
  ? {
    MC_TOKEN: '0x592b6Fa61392846b19115148dcD35766e04F5F7d',
    SMC_TOKEN: '0xC959ae9baf8FeD9cbe286614f1b93Db89fAa4677',
    EMC_TOKEN: '0xAA25caEdEC129a4CC8dd527C7EA68d420C68CB89',
    // LP_TOKEN: '0x62d5ade17b32b23c7e848dab1a5a38efe41a65e0',
    // SMC_LP_Token: '0x3b50F9b7A88431ca000E0E6F6b9fe9BDa6ea0b6e',
    FREE_TRVL:'0x9008eDC655693C638027254eb4C47F79D9BC0E23',
    FREE_TRVL_STAKING: '0x9008edc655693c638027254eb4c47f79d9bc0e23',
  } : {
    MC_TOKEN: '0x592b6Fa61392846b19115148dcD35766e04F5F7d',
    SMC_TOKEN: '0xC959ae9baf8FeD9cbe286614f1b93Db89fAa4677',
    EMC_TOKEN: '0xAA25caEdEC129a4CC8dd527C7EA68d420C68CB89',
    // LP_TOKEN: '0x62d5ade17b32b23c7e848dab1a5a38efe41a65e0',
    // SMC_LP_Token: '0x3b50F9b7A88431ca000E0E6F6b9fe9BDa6ea0b6e',
    FREE_TRVL:'0x9008eDC655693C638027254eb4C47F79D9BC0E23',
    FREE_TRVL_STAKING: '0x9008edc655693c638027254eb4c47f79d9bc0e23',
  }

/* Moralis init code */
const serverUrl = "https://ukqbtwjhqpvw.usemoralis.com:2053/server";
const appId = "t0OjdfZQCncaZy2kGAJ7DrH9txcGJ8EFp09eIejQ";
const masterKey = "G0HiUC8bLx0MHBjcKzSnmKoJdAxo6ihwafmtz70f";
export const MORALIS_URL = process.env.MORALIS_URL;

const HTTP_PROVIDER_URL = IS_MAINNET ? "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" : "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

export {
  IS_MAINNET,
  CONTRACTS,
  HTTP_PROVIDER_URL,
  serverUrl,
  appId,
  masterKey,
}
