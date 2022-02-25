import '../css/Body.css';
// import '../css/Main.css';
import EthIcon from "../static/media/EthIcon.png";
import Maximum from "../static/media/maximize.c0438627.svg";

function Price() {
  return (
    <div className="Price">
        <div className="mini-card">
            {/* <div className='price-card'> */}
                <div className='price-container'>
                    <div className='price-container-top'>
                        <span className="price-title">MC Price</span>
                        <span className="price-number">$2.49</span>
                        <span className='price-title number-go-up'>
                            <img width={16} height={16} src={EthIcon}/>5.66%
                        </span>
                    </div>
                </div>
                <div className='price-container-bottom'>
                            <div className='chart'>
                                <div className='maximize-container'>
                                    <img src={Maximum}/>
                                </div>
                                <svg className="chart-gradient">
                                    <defs>
                                        <linearGradient id="myGradient" x1="50" y1="50" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                                            <stop offset="0.0748905" stop-color="#FFA461"></stop>
                                            <stop offset="0.124419" stop-color="#FF7D48"></stop>
                                            <stop offset="0.200744" stop-color="#FF5634"></stop>
                                            <stop offset="0.316871" stop-color="#FF435F"></stop>
                                            <stop offset="0.428144" stop-color="#FF6A9A"></stop>
                                            <stop offset="0.494806" stop-color="#FF7DAC"></stop>
                                            <stop offset="0.562893" stop-color="#C5A0C6"></stop>
                                            <stop offset="0.642557" stop-color="#9CB7DD"></stop>
                                            <stop offset="0.829958" stop-color="#87D3F5"></stop>
                                            <stop offset="0.936092" stop-color="#D6F3FD"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
            {/* </div> */}
        </div>
    </div>
  );
}

export default Price;
