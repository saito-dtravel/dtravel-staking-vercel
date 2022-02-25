import { Box } from '@material-ui/core';
import styled from "styled-components";
import Mark01 from "../../assets/dtravle_mark01.png"
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ modalFlag, setModal }) => {
    let navigate = useNavigate();
    const { account, library } = useWeb3React();
    const account_address = window.localStorage.getItem("account_address");
    return (
        <StyledComponent>
            <Leftmark>
                <Mark display={"flex"} alignItems={"center"} onClick={()=>{
                    navigate("/");
                    window.scrollTo(0, 0);
                }}>
                    <img src={Mark01} alt='mark01'></img>
                    {'\u00a0'}{'\u00a0'}{'\u00a0'}TRVL
                </Mark>
            </Leftmark>
            <RightPart01>
                {/* <Link01>
                    <LinkButton>Overview</LinkButton>
                    <LinkButton>Rewards</LinkButton>
                    <LinkButton>Swap</LinkButton>
                    <LinkButton>Leaderboard</LinkButton>
                    <LinkButton>NFT</LinkButton>
                </Link01> */}
                <ConnectWallet onClick={() => {
                    setModal(!modalFlag);
                }}>{account_address === 'undefined' || account_address === null ? "Connect Wallet" : account_address.slice(0, 6) + "..." + account_address.slice(-4)}</ConnectWallet>
            </RightPart01>
        </StyledComponent>
    );
}


const StyledComponent = styled(Box)`
    display: flex;
    width: 70%;
    height: 150px;
`

const Leftmark = styled(Box)`
    display: flex;
    flex: 1;
    align-items: center;
`
const RightPart01 = styled(Box)`
    display: flex;
    flex: 2;
    justify-content: flex-end;
    align-items: center;
`

const Link01 = styled(Box)`
    display: flex;
    justify-content: space-between;
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
    color: #05070c;
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
    color: #05070c;
    background: 0;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    transition: .3s;
    cursor: pointer;
    margin-right: 8px;
    &:hover{
        color: #e57622;
        background: rgba(0,0,0,.05);
    }
`

const ConnectWallet = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 30px;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;
    letter-spacing: -.01em;
    color: #A32A2F;
    border-radius: 100px;
    background: hsla(0,0%,100%,.8);
    border: none;
    padding: 8px 16px;
    transition: .3s;
    cursor: pointer;
    &:hover{
        box-shadow: 0px 10px 10px rgb(0 0 0  / 20%), inset 2px 2px 2px #fff;
        background: white;
        transition: .2s;
    }
`

export default Header;
