import '../css/Body.css';
// import '../css/Main.css';
import Reward from "../static/media/rewards.6e73b96c.svg";
import McIcon from "../static/media/mcicon.ed082177.svg";

function Rewards() {
  return (
    <div className="Rewards">
        <div className="card">
            <img alt="" className="icon" src={Reward}/>
            <span className="card-title">Unclaimed Rewards</span>
            <span className="number">$0.00</span>
            <span className='small-number'>
                <img width={16} height={16} src={McIcon}/>MC 0.00
            </span>
            <div className='divider'></div>
            <div className='not-connected' href="#pools">Connect Wallet</div>
        </div>
    </div>
  );
}

export default Rewards;
