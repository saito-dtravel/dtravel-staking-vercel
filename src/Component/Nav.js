import logo from '../static/media/stakingLogo.9c5d58cb.svg';
import logoMobile from '../static/media/stakingLogoMobile.28c0aeb3.svg';
import menuButton from '../static/media/menu.aca47f39.svg';
import '../App.css';
// import '../css/Main.css';
import React from "react";

class Nav extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.state);
    // console.log(this.props);
  }
  render() {
    return (
      <div className="staking-nav-container">
        <a aria-current="page" className='active' href='/'>
          <img className="desktopLogo" alt="" src={logo} />
          <img className="mobileLogo" alt="" src={logoMobile} />
        </a>
        <div className="staking-nav-contents-container">
          <a aria-current="page" className="is-active">
            <div className='staking-nav-tab' variant="text" color="inherit">Overview</div>
          </a>
          <a aria-current="page" href='/'>
            <div className="staking-nav-tab">Reward</div>
          </a>
          <a aria-current="page" href='/LeaderBoard'>
            <div className="staking-nav-tab">LeaderBoard</div>
          </a>
          <a aria-current="page">
            <div className="staking-nav-tab nav-disabled" disabled>NFT</div>
          </a>
          <a aria-current="page">
            <div className="staking-nav-wallet-button" onClick={this.props.handler}>Connect Wallet</div>
          </a>
          <div><button className="menu-button"><img alt="" src={menuButton} /></button></div>
        </div>
      </div>
    );
  }
}

export default Nav;
