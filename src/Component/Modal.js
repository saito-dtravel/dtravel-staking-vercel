import '../css/Modal.css';
// import '../css/Main.css';
import React from "react";
import FadeIn from 'react-fade-in';
import Metamask from "../static/media/metamask.02e3ec27.png";
import Coinbase from "../static/media/coinbase.a3a7d7fd.svg";
import Walletconnect from "../static/media/walletConnect.304e3277.svg";
import Coin98 from "../static/media/coin98.d2743de3.png";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        var IsShowed = this.props.IsShowModal;
        this.state = {IsShowModal: IsShowed};
        //console.log("Modal.props.IsShowModal");
        //console.log(this.state);
      }
    
    Onclick = () =>{
        console.log("selected wallet");
        this.CollectWallet();
    }

    CollectWallet = () => {
        if(window.ethereum){
          window.ethereum.request({method: 'eth_requestAccounts'})
          .then(result => {
            console.log(result[0]);
          })
        }else{
          console.error("Install MetaMask");
          console.log(window);
        }
      }


    
    render() {
        return(
            <>
            {
                this.props.IsShowModal?(
                    <div role="presentation" className="MuiModal-root MuiDialog-root css-126xj0f" aria-hidden="true" onClick = {this.props.handler}>
                        <div aria-hidden="true" className="MuiBackdrop-root css-919eu4"
                            style={{ opacity: 1,
                                transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"}} ></div>
                        <div tabIndex="0" data-test="sentinelStart"></div>
                        <div className="MuiDialog-container MuiDialog-scrollPaper css-ekeie0 MuiDialog-style" role="presentation" tabIndex="-1" 
                            style={{
                                transform: "none",
                                transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms"}}>
                            <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm css-uhb5lp" role="dialog" aria-describedby="alert-dialog-slide-description" aria-labelledby="mui-45758897">
                                <h3 className="connect-wallet-card-title">Select Wallet</h3><h3 className="connect-wallet-card-text">Connect to the site below with one of our available wallet providers.</h3>
                                <div className="MuiDialogContent-root css-1ty026z">
                                    <button className="choose-wallet-button" onClick = {this.Onclick}>
                                        <span>Metamask</span>
                                        <div className="wallet-icon-container">
                                            <img height={24} width={24} src={Metamask}/>
                                        </div>
                                    </button>
                                    <button className="choose-wallet-button" onClick = {this.Onclick}>
                                        <span>Coinbase Wallet</span>
                                        <div className="wallet-icon-container">
                                            <img src={Coinbase}/>
                                        </div>
                                    </button>
                                    <button className="choose-wallet-button" onClick = {this.Onclick}>
                                        <span>WalletConnect</span>
                                        <div className="wallet-icon-container">
                                            <img src={Walletconnect}/>
                                        </div>
                                    </button>
                                    <button className="choose-wallet-button" onClick = {this.Onclick}>
                                        <span>Coin98</span>
                                        <div className="wallet-icon-container">
                                            <img height={24} width={24} src={Coin98}/>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div tabIndex="0" data-test="sentinelEnd"></div>
                    </div>
                ):
                (
                    <div role="presentation" className="MuiModal-root MuiModal-hidden MuiDialog-root css-h5z058" aria-hidden="false">
                        <div aria-hidden="true" className="MuiBackdrop-root css-919eu4"
                        style={{opacity: 0,
                            transition: "opacity 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                            visibility: "hidden"}}></div>
                        <div tabIndex="0" data-test="sentinelStart"></div>
                        <div className="MuiDialog-container MuiDialog-scrollPaper css-ekeie0 MuiDialog-style" role="presentation" tabIndex="-1" 
                            style={{
                                transform: "translateY(775px)",
                                visibility: "hidden"}}>
                            <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm css-uhb5lp" role="dialog" aria-describedby="alert-dialog-slide-description" aria-labelledby="mui-45758897">
                                <h3 className="connect-wallet-card-title">Select Wallet</h3><h3 className="connect-wallet-card-text">Connect to the site below with one of our available wallet providers.</h3>
                                <div className="MuiDialogContent-root css-1ty026z">
                                    <button className="choose-wallet-button">
                                        <span>Metamask</span>
                                        <div className="wallet-icon-container">
                                            <img height={24} width={24} src={Metamask}/>
                                        </div>
                                    </button>
                                    <button className="choose-wallet-button">
                                        <span>Coinbase Wallet</span>
                                        <div className="wallet-icon-container">
                                            <img src={Coinbase}/>
                                        </div>
                                    </button>
                                    <button className="choose-wallet-button">
                                        <span>WalletConnect</span>
                                        <div className="wallet-icon-container">
                                            <img src={Walletconnect}/>
                                        </div>
                                    </button>
                                    <button className="choose-wallet-button">
                                        <span>Coin98</span>
                                        <div className="wallet-icon-container">
                                            <img height={24} width={24} src={Coin98}/>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div tabIndex="0" data-test="sentinelEnd"></div>
                    </div>
                )
            }
            </>
            
        );
    }
}

export default Modal;
