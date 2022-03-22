import './App.css';
import React, { useState, useEffect } from "react";
import { Box, Modal } from "@material-ui/core";
import Header from './Component/layouts/header';
import Content from './Component/layouts/content';
import Reward from "./Component/layouts/reward";
import styled from 'styled-components';
import MetaMaskImg from "./assets/metamask.png";
import Coin98Img from "./assets/coin98.png";
import CoinbaseImg from "./assets/coinbase.svg";
import WalletConnectImg from "./assets/walletConnect.svg";
import { injected, walletConnect, trustWallet, binance_wallet } from "./utils/connectors";
import { useWeb3React } from "@web3-react/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const [wConnect, set_wConnect] = useState();

  const DESKTOP_CONNECTORS = {
    MetaMask: injected,
    WalletConnect: walletConnect,
    BinanceWallet: binance_wallet,
    TrustWallet: trustWallet,
  };
  const walletConnectors = DESKTOP_CONNECTORS;
  const { account, activate } = useWeb3React();

  const handleConnect = async (currentConnector) => {
    await activate(walletConnectors[currentConnector]);
    set_wConnect(walletConnectors[currentConnector]);
    window.localStorage.setItem("CurrentWalletConnect", currentConnector);
    handleClose();
  };
  // const handleDisconnect = () => {
  //   deactivate();
  //   window.localStorage.removeItem("CurrentWalletConnect");
  //   window.localStorage.removeItem("CurrentAccount");
  // };

  useEffect(() => {
    const currentWalletState = window.localStorage.getItem("CurrentWalletConnect");
    currentWalletState && activate(walletConnectors[currentWalletState]);
  }, []);
  return (
    <>
      <Box display={"flex"} flexDirection={"column"} alignItems="center" >
        <BrowserRouter>
          <Header setModal={setOpen} wConnect={wConnect}></Header>
          <Routes>
            <Route path="/" element={<Content modalFlag={open} setModal={setOpen} />} />
            <Route path="/reward" element={<Reward modalFlag={open} setModal={setOpen} />} />
          </Routes>
        </BrowserRouter>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <ModalBox>
            <UpText>Select Wallet</UpText>
            <DownText>Connect to the site below with one of our available wallet providers.</DownText>
            <ConnectPart>
              <ConnectWallet onClick={() => {
                handleConnect("MetaMask");
              }}>
                <Box display={"flex"} marginLeft={"5%"} >
                  Metamask
                </Box>
                <Box display={"flex"} marginRight={"5%"}>
                  <img src={MetaMaskImg} width={"24px"} height={"24px"} alt="" />
                </Box>
              </ConnectWallet>
              <ConnectWallet onClick={() => {
                handleConnect("TrustWallet");
              }}>
                <Box display={"flex"} marginLeft={"5%"}>
                  Coinbase Wallet
                </Box>
                <Box display={"flex"} marginRight={"5%"}>
                  <img src={CoinbaseImg} width={"24px"} height={"24px"} alt="" />
                </Box>
              </ConnectWallet>
              <ConnectWallet onClick={() => {
                handleConnect("WalletConnect");
              }}>
                <Box display={"flex"} marginLeft={"5%"}>
                  WalletConnect
                </Box>
                <Box display={"flex"} marginRight={"5%"}>
                  <img src={WalletConnectImg} width={"24px"} height={"24px"} alt="" />
                </Box>
              </ConnectWallet>
              <ConnectWallet onClick={() => {
                handleConnect("MetaMask");
              }}>
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
}

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
  &:hover{
    cursor: pointer;
    transition: .3s;
    background: #e1e3e5;
  }
`

const ConnectPart = styled(Box)`
  display: flex;
  flex: 4;
  flex-direction: column;
  font-family: "Inter",sans-serif!important;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -.01em;
  color: #05070c;
`

const UpText = styled(Box)`
  display: flex;
  flex:1;
  align-items: center;
  font-family: "Inter",sans-serif!important;
  font-style: normal;
  letter-spacing: -.01em;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  color: #05070c;

`
const DownText = styled(Box)`
  display: flex;
  flex:1;
  align-items: flex-start;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  font-family: "Inter",sans-serif!important;
  font-style: normal;
  letter-spacing: -.01em;
  color: #05070c;

`

const ModalBox = styled(Box)`
  display: flex;
  width: 350px;
  height: 400px;
  flex-direction: column;
  background-color: #D4EEE9;
  border: none;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(100px)!important;
  border-radius: 20px!important;
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
`


export default App;
