import "./App.css";
import React, { useState, useEffect } from "react";
import { chainId } from "./utils/connectors";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Box, Modal } from "@material-ui/core";
import Header from "./Component/layouts/header";
import Content from "./Component/layouts/content";
import Reward from "./Component/layouts/reward";
import styled from "styled-components";
import MetaMaskImg from "./assets/metamask.png";
import Coin98Img from "./assets/coin98.png";
import CoinbaseImg from "./assets/coinbase.svg";
import WalletConnectImg from "./assets/walletConnect.svg";
import { injected, walletConnect, trustWallet, binance_wallet, CoinbaseWallet } from "./utils/connectors";
import { useWeb3React } from "@web3-react/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const [active ,setActive] = useState(false);
  const [wConnect, set_wConnect] = useState();

  const DESKTOP_CONNECTORS = {
    MetaMask: injected,
    WalletConnect: walletConnect,
    CoinbaseWallet: CoinbaseWallet,
    TrustWallet: trustWallet,
  };
  const walletConnectors = DESKTOP_CONNECTORS;
  const { account, activate, library } = useWeb3React();

  const handleConnect = async (currentConnector) => {
    await activate(walletConnectors[currentConnector]);
    set_wConnect(walletConnectors[currentConnector]);
    window.localStorage.setItem("CurrentWalletConnect", currentConnector);
    handleSwitch();
    handleClose();
    setActive(true);
  };

  const handleSwitch = async () => {
    try{
      if (window.ethereum.networkVersion !== chainId){
        console.log("window.ethereum", window.ethereum);
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
        }).then(() => {
          
          setActive(true);
        });
        console.log("You have succefully switched to Rinkeby Test network");
        await timeout(2000);
        // getLibrary()
        console.log("networkVersion", window.ethereum.networkVersion);
      }
  
    }
    catch(err)
    {
      setActive(false);
    }
  };

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
  }

  const handleDisconnect = () => {
    // deactivate();
    window.localStorage.removeItem("CurrentWalletConnect");
    window.localStorage.removeItem("CurrentAccount");
  };

  useEffect(() => {
    const currentWalletState = window.localStorage.getItem("CurrentWalletConnect");
    // const currentWalletState = "MetaMask";
    currentWalletState && activate(walletConnectors[currentWalletState]);
  }, []);
  return (
    <>
      <Box maxWidth={"1440px"} width={"100%"} display={"flex"} flexDirection={"column"} alignItems="center" boxSizing={"border-box"} sx={{ px: { xs: "24px", sm: "64px", md: "108px" } }}>
        <BrowserRouter>
          <Header setModal={setOpen} wConnect={wConnect} active={active} setActive={setActive} current={current} setCurrent={setCurrent}></Header>
          <Routes>
            <Route path="/" element={<Content modalFlag={open} setModal={setOpen} library={library} active={active} setActive={setActive} setCurrent={setCurrent}/>} />
            <Route path="/reward" element={<Reward active={active}/>} />
          </Routes>
        </BrowserRouter>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <ModalBox>
            <UpText>Select Wallet</UpText>
            <DownText>Connect to the site below with one of our available wallet providers.</DownText>
            <ConnectPart>
              <ConnectWallet
                onClick={() => {
                  handleConnect("MetaMask");
                }}
              >
                <Box display={"flex"} marginLeft={"5%"}>
                  Metamask
                </Box>
                <Box display={"flex"} marginRight={"5%"}>
                  <img src={MetaMaskImg} width={"24px"} height={"24px"} alt="" />
                </Box>
              </ConnectWallet>
              <ConnectWallet
                onClick={() => {
                  handleConnect("CoinbaseWallet");
                }}
              >
                <Box display={"flex"} marginLeft={"5%"}>
                  Coinbase Wallet
                </Box>
                <Box display={"flex"} marginRight={"5%"}>
                  <img src={CoinbaseImg} width={"24px"} height={"24px"} alt="" />
                </Box>
              </ConnectWallet>
              <ConnectWallet
                onClick={() => {
                  handleConnect("WalletConnect");
                }}
              >
                <Box display={"flex"} marginLeft={"5%"}>
                  WalletConnect
                </Box>
                <Box display={"flex"} marginRight={"5%"}>
                  <img src={WalletConnectImg} width={"24px"} height={"24px"} alt="" />
                </Box>
              </ConnectWallet>
              <ConnectWallet
                onClick={() => {
                  handleConnect("TrustWallet");
                }}
              >
                <Box display={"flex"} marginLeft={"5%"}>
                  Coin98
                </Box>
                <Box display={"flex"} marginRight={"5%"}>
                  <img src={Coin98Img} width={"24px"} height={"24px"} alt="" />
                </Box>
              </ConnectWallet>
            </ConnectPart>
          </ModalBox>
        </Modal>
      </Box>
    </>
    // <div className="staking-container">
    //   <Nav handler={this.handler} IsShowModal={this.state.IsShowModal} />
    //   <Body handler={this.handler} IsShowModal={this.state.IsShowModal} />
    //   <Modal handler={this.handler} IsShowModal={this.state.IsShowModal} />
    // </div>
  );
};

const ConnectWallet = styled(Box)`
  display: flex;
  width: 100%;
  flex: 1;
  margin-top: 2%;
  margin-bottom: 2%;
  justify-content: space-between;
  align-items: center;
  background: #f1f3f5;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    transition: 0.3s;
    background: #e1e3e5;
  }
`;

const ConnectPart = styled(Box)`
  display: flex;
  flex: 4;
  flex-direction: column;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #05070c;
`;

const UpText = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  letter-spacing: -0.01em;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  color: #05070c;
`;
const DownText = styled(Box)`
  display: flex;
  flex: 1;
  align-items: flex-start;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  letter-spacing: -0.01em;
  color: #05070c;
`;

const ModalBox = styled(Box)`
  display: flex;
  width: 350px;
  height: 400px;
  flex-direction: column;
  background-color: #d4eee9;
  border: none;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(100px) !important;
  border-radius: 20px !important;
  padding: 30px;
  transition: box-shadow 300ms;
  transition: transform 505ms cubic-bezier(0, 0, 0.2, 1) 0ms !important;
  outline: none;
  animation: back_animation1 0.5s 1;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  @keyframes back_animation1 {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }
`;

export default App;
