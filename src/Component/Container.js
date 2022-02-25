import '../css/Body.css';
import '../css/Main.css';
import Staking from "./Staking";
import NotConnected from './NotConnected';
import Staked from './Staked';
import Price from './Price';
import Rewards from './Rewards';
import React from "react";

class Container extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
   
    render() {
      return (
        <div className='container'>
            <Staking/>
            <Rewards/>
            <Price/>
            <Staked/>
            <NotConnected/>
        </div>
      );
    }
  }

  export default Container;