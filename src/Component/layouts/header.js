import { Box } from '@material-ui/core';
import styled from "styled-components";
import Mark01 from "../../assets/dtravle_mark01.png"
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiExit } from "react-icons/bi"

const Header = ({ setModal, wConnect }) => {
    let navigate = useNavigate();
    const [flag_drop, set_drop] = useState(false);
    const { account, active, deactivate } = useWeb3React();
    return (
        <StyledComponent>
            <Leftmark>
                <Mark display={"flex"} alignItems={"center"} onClick={() => {
                    navigate("/");
                    window.scrollTo(0, 0);
                }}>
                    <img src={Mark01} alt='mark01'></img>
                    {'\u00a0'}{'\u00a0'}{'\u00a0'}TRVL
                </Mark>
                <Link01>
                    <LinkButton onClick={() => {
                        navigate("/");
                        window.scrollTo(0, 0);
                    }}>Overview</LinkButton>
                    <LinkButton onClick={() => {
                        navigate("/reward");
                        window.scrollTo(0, 0);
                    }}>Rewards</LinkButton>
                    {/* <LinkButton>Swap</LinkButton>
                    <LinkButton>Leaderboard</LinkButton>
                    <LinkButton>NFT</LinkButton> */}
                </Link01>
            </Leftmark>
            <RightPart01>
                <Box display={"flex"} >TRVL Price: $0,11</Box>
                <Box display={"flex"} width={"30%"} position={"relative"} marginLeft={"5%"}>
                    <ConnectWallet onClick={() => {
                        if (active === false) {
                            setModal(true);
                        }
                        else {
                            setModal(false);
                            set_drop(!flag_drop);
                        }
                    }}>{active === false ? "Connect Wallet" : account.slice(0, 6) + "..." + account.slice(-4)}</ConnectWallet>
                    {
                        flag_drop ?
                            <DropBox onMouseLeave={() => {
                                set_drop(false);
                            }} onClick={async () => {
                                // setModal(true);
                                set_drop(false);
                                await deactivate(wConnect);
                                window.localStorage.removeItem("CurrentWalletConnect");
                            }}>
                                <BiExit />Disconnect
                            </DropBox> :
                            <></>
                    }
                </Box>
            </RightPart01>
        </StyledComponent>
    );
}

const DropBox = styled(Box)`
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    left: 15%;
    bottom: -60%;
    width: 120px;
    height: 25px;
    border-radius: 0px 0px 8px 8px;
    padding: 8px 16px;
    background: hsla(0,30%,100%,.8);
    border: none;
    transition: .5s;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;
    letter-spacing: -.01em;
    color: black;
    cursor: pointer;
    &:hover{
        box-shadow: 0px 10px 10px rgb(0 0 0  / 20%), inset 2px 2px 2px #fff;
        background: white;
        transition: .5s;
    }

`

const StyledComponent = styled(Box)`
    display: flex;
    width: 70%;
    height: 150px;
    border-bottom: 1px solid #0B2336;
`

const Leftmark = styled(Box)`
    display: flex;
    flex: 1;
    align-items: center;
`
const RightPart01 = styled(Box)`
    display: flex;
    flex: 1;
    width: 100%;
    position: relative;
    justify-content: flex-end;
    align-items: center;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    color: #0B2336;
`

const Link01 = styled(Box)`
    display: flex;
    flex: 2;
    margin-left: 2%;
    /* justify-content: space-between; */
`

const Mark = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 38px;
    line-height: 32px;
    color: #0B2336;
    &:hover{
        cursor: pointer;
    }
`

const LinkButton = styled(Box)`
    display: flex;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    color: #0B2336;
    background: 0;
    border: none;
    /* padding: 8px 16px;
    border-radius: 8px; */
    /* transition: .3s; */
    cursor: pointer;
    border-bottom: 2px solid rgba(0,0,0,0);
    margin-left: 10%;

    &:hover{
        border-bottom: 2px solid #0B2336;
        
        /* background: rgba(0,0,0,.05); */
    }

`

const ConnectWallet = styled(Box)`
    display: flex;
    flex:1;
    justify-content: center;
    align-items: center;
    width: 149px;
    height: 56px;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;
    letter-spacing: -.01em;
    color: #D4EEE9;
    border-radius: 100px;
    background: #0B2336;
    border: none;
    padding: 8px 16px;
    transition: .3s;
    cursor: pointer;
    &:hover{
        box-shadow: 0 5px 5px rgb(0 0 0 / 30%);
        /* background: white; */
        transition: .5s;
    }
    margin-left: 5%;
`

export default Header;
