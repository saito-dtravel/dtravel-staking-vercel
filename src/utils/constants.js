// const IS_MAINNET = process.env.REACT_APP_NETWORK === 'mainnet';
console.log(process.env);
const IS_MAINNET = false;

const CONTRACTS = IS_MAINNET
  ? {
    MC_TOKEN: '0xd47bDF574B4F76210ed503e0EFe81B58Aa061F3d',
    SMC_TOKEN: '0xfC7ABcD8bbf53d843487BdF87FC51B6E670646b8',
    EMC_TOKEN: '0xd401c29DDC8C0093e7E3080f1dB606071F47c244',
    // LP_TOKEN: '0x62d5ade17b32b23c7e848dab1a5a38efe41a65e0',
    // SMC_LP_Token: '0x3b50F9b7A88431ca000E0E6F6b9fe9BDa6ea0b6e',
    FREE_TRVL:'0x86E2a99F0F3dD01A480f8eaA935937111f8496d7',
    FREE_TRVL_STAKING: '0x86E2a99F0F3dD01A480f8eaA935937111f8496d7',
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
const serverUrl = IS_MAINNET ? "https://2e7qseoizqxu.usemoralis.com:2053/server" : "https://ukqbtwjhqpvw.usemoralis.com:2053/server";
const appId = IS_MAINNET ? "6aU6simMKJWjcumjYe2YUfMTk9s7QhiBW24e6kPZ" :"t0OjdfZQCncaZy2kGAJ7DrH9txcGJ8EFp09eIejQ";
const masterKey = IS_MAINNET ? "5CHAojtAHTAIE6sF0r8WUEzDLDv47FB0oOLwAMBS" : "G0HiUC8bLx0MHBjcKzSnmKoJdAxo6ihwafmtz70f";

const TRANSACTION_SCAN_URL = "https://testnet.bscscan.com/tx/";

const HTTP_PROVIDER_URL = IS_MAINNET ? "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" : "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

export {
  IS_MAINNET,
  CONTRACTS,
  HTTP_PROVIDER_URL,
  TRANSACTION_SCAN_URL,
  serverUrl,
  appId,
  masterKey,
}
