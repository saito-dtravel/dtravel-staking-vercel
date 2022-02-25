import '../css/Body.css';
import '../css/Main.css';
import logo from '../static/media/stakingLogo.9c5d58cb.svg';

function Footer() {
  return (
    <div className="footer">
        <a href="/">
                <img src={logo} alt="Logo Dtravel"/>
        </a>
        <p className='h4 align.right'>@CopyRight MetaMask</p>
    </div>
  );
}

export default Footer;
