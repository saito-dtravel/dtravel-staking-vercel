import React, { useState, useEffect, useMemo } from "react";
import { Box, Modal } from '@material-ui/core';
import { TailSpin } from 'react-loader-spinner';
import styled from "styled-components";
import Staked01 from "../../assets/stake.svg"
import Reward01 from "../../assets/rewards.svg";
import Mark01 from "../../assets/dtravle_mark01.png"
import Triangle01 from "../../assets/triangle.png"
import { IoMdResize } from "react-icons/io";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { CONTRACTS } from "../../utils/constants";
import { MC_ABI, SMC_ABI, EMC_ABI, LP_ABI } from "../../utils/abi";
import CustomButton from '../elements/buttons';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { GiCancel } from 'react-icons/gi';
import { useNavigate } from "react-router-dom";

const Content = ({ modalFlag, setModal }) => {
    let navigate = useNavigate();
    const { account, library } = useWeb3React();
    const [total_stake, set_total_stake] = useState(0);
    const [user_total_stake, set_user_total_stake] = useState(0);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const connect_wallet = () => {
        setModal(!modalFlag);
    }
    const account_t = window.localStorage.getItem("account_address");
    const [amount, set_amount] = useState(0);
    const [duration, set_duration] = useState(0);
    const [locked, set_locked] = useState(false);
    const [mc_apr, set_mc_apr] = useState(0);
    const [lp_token_flag, set_lp_token_flag] = useState(false);
    const [total_lp_stake, set_total_lp_stake] = useState(0);
    const [flag_account, set_flag_account] = useState(false);
    const [rewards, set_rewards] = useState(0);
    const [flag_spin_load, set_spin_load] = useState(false);
    const MC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.MC_TOKEN, MC_ABI, library.getSigner()) : null), [library]);
    const SMC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_TOKEN, SMC_ABI, library.getSigner()) : null), [library]);
    const EMC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.EMC_TOKEN, EMC_ABI, library.getSigner()) : null), [library]);
    const LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.LP_TOKEN, LP_ABI, library.getSigner()) : null), [library]);
    const SMC_LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_LP_Token, SMC_ABI, library.getSigner()) : null), [library]);

    useEffect(() => {
        if (account_t === 'undefined' || account_t === null) {
            set_flag_account(false);
        }
        else {
            set_flag_account(true);
            get_total_stake();
            get_total_lp_stake();
            get_mc_apr();
            get_rewards();
        }
    });

    const stake = async () => {
        try {
            set_spin_load(true);
            const amount_wei = amount * Math.pow(10, 18);
            const approve = await MC_Contract.approve(CONTRACTS.SMC_TOKEN, "0x" + amount_wei.toString(16));
            await approve.wait();
            var t_duration;
            if (locked === true) {
                t_duration = duration;
            }
            else {
                t_duration = 0;
            }
            const stake_mc = await SMC_Contract.deposit("0x" + amount_wei.toString(16), t_duration, account);
            await stake_mc.wait();
            get_total_stake();
            set_spin_load(false);
            get_rewards();
            set_amount(0);
            handleClose();

        }
        catch (err) {
            console.log(err);
            set_spin_load(false);
            set_locked(false);
            set_amount(0);
            handleClose();
        }
    }

    const stake_lp = async () => {
        try {
            set_spin_load(true);
            const amount_wei = amount * Math.pow(10, 18);
            const approve = await LP_Contract.approve(CONTRACTS.SMC_LP_Token, "0x" + amount_wei.toString(16));
            await approve.wait();
            var t_duration;
            if (locked === true) {
                t_duration = duration;
            }
            else {
                t_duration = 0;
            }
            const stake_mc = await SMC_LP_Contract.deposit("0x" + amount_wei.toString(16), t_duration, account);
            await stake_mc.wait();
            get_total_lp_stake();
            set_spin_load(false);
            set_amount(0);
            get_rewards();
            handleClose();
        }
        catch (err) {
            console.log(err);
            set_spin_load(false);
            set_locked(false);
            set_amount(0);
            handleClose();
        }
    }

    const get_mc_apr = async () => {
        try {
            let locked1 = await SMC_Contract.getTotalDeposit(account);
            let total = await SMC_Contract.balanceOf(account);
            let apr = (total / locked1 * 100).toFixed(2);
            set_mc_apr(apr);
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_rewards = async() => {
        try {
            let t_rewards = await SMC_Contract.withdrawableRewardsOf(account);
            let t_lp_rewards = await SMC_LP_Contract.withdrawableRewardsOf(account);
            set_rewards(((parseInt(t_rewards._hex)+parseInt(t_lp_rewards._hex))/Math.pow(10, 18)).toFixed(2));
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_total_stake = async () => {
        try {
            let t_value = await MC_Contract.balanceOf(CONTRACTS.SMC_TOKEN);
            let user_t_value = await SMC_Contract.getTotalDeposit(account);
            set_total_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(3));
            set_user_total_stake((parseInt(user_t_value._hex) / Math.pow(10, 18)).toFixed(3));

        }
        catch (err) {
            console.log(err);
        }
    }

    const get_total_lp_stake = async () => {
        try {
            let t_value = await SMC_LP_Contract.balanceOf(account);
            set_total_lp_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(3));
        }
        catch (err) {
            console.log(err);
        }
    }

    const unstake = async () => {
        try {
            const unstake_mc = await SMC_Contract.withdraw(0, account);
            await unstake_mc.wait();
            get_total_stake();
            get_rewards();
            get_total_lp_stake();
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledComponent>
            <RewardText>
                <LeftText01>
                    Rewards
                </LeftText01>
                {/* <RightText01>
                    The Merit Circle DAO offers two core pools. Variable locking for up to twelve months is available for MC and LP staking.
                </RightText01> */}
            </RewardText>
            <CenterPart>
                <Left01>
                    <Box display={"flex"} flex={"2"} justifyContent="center" alignItems={"center"} flexDirection={"column"} width="60%" borderBottom={"1px solid white"}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} marginTop="2%" flex={"3"}>
                            <img src={Staked01} alt="staked01"></img>
                        </Box>
                        <SmText01>
                            Staked
                        </SmText01>
                        <BgText01>
                            $ {user_total_stake * 1}
                        </BgText01>
                    </Box>
                    <Box display={"flex"} flex={"1"} justifyContent="center" alignItems={"center"} width="60%">
                        {

                            flag_account ?
                                <>
                                    <ConnectWalletBtn01 onClick={() => {
                                        window.scrollTo(0, document.body.scrollHeight);
                                    }}>
                                        Stake
                                    </ConnectWalletBtn01>
                                    <Box display={"flex"} flex="0.1"></Box>
                                    <ConnectWalletBtn01 onClick={() => {
                                        unstake();
                                    }}>
                                        UnStake
                                    </ConnectWalletBtn01>
                                </> :
                                <>
                                    <ConnectWalletBtn01 onClick={() => connect_wallet()}>
                                        Connect Wallet
                                    </ConnectWalletBtn01>
                                </>
                        }
                    </Box>
                </Left01>
                <Center01>
                    <Box display={"flex"} flex={"2"} justifyContent="center" alignItems={"center"} flexDirection={"column"} width="60%" borderBottom={"1px solid white"}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} marginTop="2%" flex={"3"} width={"100%"}>
                            <img src={Reward01} alt="reward01"></img>
                        </Box>
                        <SmText01>
                            Unclaimed Rewards
                        </SmText01>
                        <BgText01>
                            $ {rewards}
                        </BgText01>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} marginTop="2%" flex={"3"} width={"100%"}>
                            <SmText02 display={"flex"} justifyContent={"center"} alignContent={"center"} width={"100%"}>
                                {/* <img src={Mark02} width={"40px"} height={"40px"} alt="mark02" ></img>{'\u00a0'} */}
                                TRVL {rewards}
                            </SmText02>
                        </Box>
                    </Box>
                    <Box display={"flex"} flex={"1"} justifyContent="center" alignItems={"center"} width="60%">
                        {

                            flag_account ?
                                <>
                                    <ConnectWalletBtn01 onClick={()=>{
                                        navigate('/reward');
                                        window.scrollTo(0, 0);
                                    }}>
                                        Claim
                                    </ConnectWalletBtn01>
                                </> :
                                <>
                                    <ConnectWalletBtn01 onClick={() => connect_wallet()}>
                                        Connect Wallet
                                    </ConnectWalletBtn01>
                                </>
                        }
                    </Box>
                </Center01>
                <Right01>
                    <Part01 display={"flex"} position={"relative"} flex={"1"} justifyContent="center" alignItems={"center"} flexDirection={"column"} width="100%">
            
                        <GraphInfoBox>
                            <Box display={"flex"} flex="1" fontSize={"18px"} justifyContent={"center"} alignItems={"center"} >TRVL Price</Box>
                            <Box display={"flex"} flex="1" fontSize={"24px"} justifyContent={"center"} alignItems={"center"} fontWeight={"600"}>$ 1</Box>
                            {/* <Box display={"flex"} flex="1" fontSize={"18px"} justifyContent={"center"} alignItems={"center"} fontWeight={"600"} color={"white"}>
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}><img src={Triangle01} width={"16px"} height={"16px"} alt="" /></Box>
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} marginLeft={"2%"}>1.63%</Box>
                            </Box> */}
                        </GraphInfoBox>
                    </Part01>
                    <Part01 display={"flex"} flex={"1"} justifyContent="center" alignItems={"center"} flexDirection={"column"} width="100%" marginTop={"10%"}>
                        <SmText03>
                            Total Locked Amount
                        </SmText03>
                        <Bgtext02>
                            $ {total_stake * 1}
                        </Bgtext02>
                        <SmText03>
                            Total Claimed Amount
                        </SmText03>
                        <Bgtext02>
                            $ 0.00
                        </Bgtext02>
                    </Part01>

                </Right01>
            </CenterPart>
            {
                flag_account ?
                    <>
                        {/* <ConnectWalletBtn01>
                            {account_t.slice(0, 6) + "..." + account_t.slice(-4)}
                        </ConnectWalletBtn01> */}
                    </> :
                    <>
                        <DownPart>
                            <ConnectWalletBtn01 onClick={() => connect_wallet()}>
                                Connect Wallet
                            </ConnectWalletBtn01>
                        </DownPart>
                    </>
            }
            {flag_account ?
                <>
                    <RewardText marginTop={"5%"}>
                        <LeftText01>
                            Pools
                        </LeftText01>
                    </RewardText>
                    <PoolsPart>
                        <Row01>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                Care Pools
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                Total Value Locked
                            </Box>
                            <Box display={"flex"} flex="0.6" alignItems={"center"} >
                                APR
                            </Box>
                            <Box display={"flex"} flex="1.4" alignItems={"center"} ></Box>
                        </Row01>
                        <Row02>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                <img />TRVL
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                $ {total_stake * 1}
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                {mc_apr!="NaN" ? mc_apr : 100}%
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                                <Box display={"1"} width={"30%"}><CustomButton str={""} width={"100%"} height={""} color={""} bgcolor={""} fsize={""} fweight={""} bradius={""}></CustomButton></Box>
                                <Box display={"1"} width={"30%"}><CustomButton str={"Details"} width={"100%"} height={"30px"} color={"black"} bgcolor={"white"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    handleOpen();
                                    set_lp_token_flag(false);
                                }}><CustomButton str={"Stake"} width={"100%"} height={"30px"} color={"white"} bgcolor={"rgba(0,0,0,.3)"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                            </Box>
                        </Row02>
                        <Row03>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                TRVL/ETH Uniswap LP
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                $ {total_lp_stake * 1}
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                104.421%
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                                <Box display={"1"} width={"30%"}>
                                    <a target="_blank" rel="noopener noreferrer" href="https://v2.info.uniswap.org/pair/0xccb63225a7b19dcf66717e4d40c9a72b39331d61"><CustomButton str={"Buy LP"} width={"100%"} height={"30px"} color={"black"} bgcolor={"white"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></a></Box>
                                <Box display={"1"} width={"30%"}><CustomButton str={"Details"} width={"100%"} height={"30px"} color={"black"} bgcolor={"white"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    handleOpen();
                                    set_lp_token_flag(true);
                                }}>
                                    <CustomButton str={"Stake"} width={"100%"} height={"30px"} color={"white"} bgcolor={"rgba(0,0,0,.3)"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                            </Box>
                        </Row03>
                    </PoolsPart></> :
                <></>
            }
            <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <ModalBox>
                    <CancelBox01 onClick={() => {
                        handleClose();
                        set_spin_load(false);
                        set_locked(false);
                        set_amount(0);
                        set_duration(0);
                    }}>
                        <GiCancel></GiCancel>
                    </CancelBox01>
                    <TitleText01>
                        <img src={Mark01} width={"30px"} height={"30px"} alt=""></img>
                        {'\u00a0'}{'\u00a0'}{!lp_token_flag ? "TRVL" : "TRVL/ETH Uniswap LP"}
                    </TitleText01>
                    <SelectDuration>
                        <FlexibleBox onClick={() => {
                            set_locked(false);
                        }} locked={locked}>Flexible</FlexibleBox>
                        <LockedBox onClick={() => {
                            set_locked(true);
                        }} locked={locked}>Locked</LockedBox>
                    </SelectDuration>
                    <SmText04 >
                        Amount
                    </SmText04>
                    <InputAmount component={"input"} value={amount} type={'number'} onChange={(e) => {
                        set_amount(e.target.value);
                    }}></InputAmount>
                    {locked ? <>
                        <SmText04>
                            Duration(weeks)
                        </SmText04>
                        <InputAmount component={"input"} value={duration} type={'number'} onChange={(e) => {
                            set_duration(e.target.value);
                        }}></InputAmount>
                    </> : <></>}
                    <Box display={"flex"} width={"100%"} marginTop={"5%"} position={"relative"} onClick={() => {
                        if (lp_token_flag === false) {
                            stake();
                        }
                        else {
                            stake_lp();
                        }
                    }}>
                        {flag_spin_load ?
                            <Box display={"flex"} position={"absolute"} left={"20%"} justifyContent={"center"} alignItems={"center"} top="10%">
                                <TailSpin color="white" height={35} width={35} />
                            </Box>
                            :
                            <></>
                        }

                        <CustomButton str={"Stake"} width={"100%"} height={"50px"} color={"white"} bgcolor={"#A32A2F"} fsize={"16px"} fweight={"600"} bradius={"8px"} />
                    </Box>
                </ModalBox>
            </Modal>
        </StyledComponent>
    );
}

const CancelBox01 = styled(Box)`
    display: flex;
    position: absolute;
    right: 5%;
    top: 5%;
    font-size: 30px;
    color:#322f2f;
    transition: .1s;
    &:hover{
        cursor:pointer;
        transition: .3s;
        color:black;
    }
`

const FlexibleBox = styled(Box)`
    display: flex;
    flex: 1;
    border-radius: 50px;
    border: none;
    background-color: ${({ locked }) => locked ? "white" : "#A32A2F"};
    color:${({ locked }) => locked ? "#A32A2F" : "white"};
    justify-content: center;
    align-items: center;
    transition: .3s;
    &:hover{
        cursor: pointer;
    }
`

const LockedBox = styled(Box)`
    display: flex;
    flex: 1;
    border-radius: 50px;
    border: none;
    background-color: ${({ locked }) => locked ? "#A32A2F" : "white"};
    color:${({ locked }) => locked ? "white" : "#A32A2F"};
    justify-content: center;
    align-items: center;
    transition: .3s;
    &:hover{
        cursor: pointer;
    }
`

const SelectDuration = styled(Box)`
    display: flex;
    width: 100%;
    margin-top: 8%;
    height: 50px;
    border-radius: 50px;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    border: 2px solid rgb(133, 133, 133);
`

const InputAmount = styled(Box)`
    display: flex;
    margin-top: 2%;
    height: 40px;
    border-radius: 8px;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
`

const SmText04 = styled(Box)`
    display: flex;
    width: 100%;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: black;
    margin-top: 5%;
`

const TitleText01 = styled(Box)`
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

const ModalBox = styled(Box)`
    display: flex;
    width: 350px;
    flex-direction: column;
    background-color: white;
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



const PoolsPart = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 3%;
    margin-bottom: 5%;
    background: #A32A2F;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    transition: .3s;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    letter-spacing: -.01em;
    color: white;
    font-size: 18px;
    line-height: 24px;
    align-items: center;
    &:hover{
        box-shadow: 0 29px 32px rgb(201 155 159 / 100%) ;
    }
`
const Row01 = styled(Box)`
    display: flex;
    flex:1;
    margin-top: 5%;
    width: 90%;
`

const Row02 = styled(Box)`
    display: flex;
    flex:1;
    margin-top: 2%;
    width: 90%;
    border-top: 1px solid rgb(255 255 255 /50%);
    padding-top: 2%;
`
const Row03 = styled(Box)`
    display: flex;
    flex:1;
    margin-top: 2%;
    width: 90%;
    border-top: 1px solid rgb(255 255 255 /50%);
    padding-top: 2%;
    margin-bottom: 5%;
`

const StyledComponent = styled(Box)`
    display: flex;
    width: 70%;
    flex-direction: column;
    margin-top: 5%;

`

const RewardText = styled(Box)`
    display: flex;
    width: 100%;
`

const LeftText01 = styled(Box)`
    display: flex;
    flex: 1;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 54px;
    line-height: 36px;
    letter-spacing: -.01em;
    color: #05070c;
`
const RightText01 = styled(Box)`
    display: flex;
    flex: 1;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: -.01em;
    color: #05070c;
    max-width: 560px;
    float: right;
`

const CenterPart = styled(Box)`
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 5%;
`

const DownPart = styled(Box)`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-top: 3%;
    background: #A32A2F;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    transition: .3s;
    height:200px;
    margin-bottom: 5%;
    &:hover{
        box-shadow: 0 29px 32px rgb(201 155 159 / 100%);
    }
`

const Left01 = styled(Box)`
    display: flex;
    width: 30%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #A32A2F;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    transition: .3s;
    height:414px;
    &:hover{
        box-shadow: 0 29px 32px rgb(201 155 159 / 100%);
    }
`

const Center01 = styled(Box)`
    display: flex;
    width: 30%;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    background: #A32A2F;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    transition: .3s;
    height:414px;
    &:hover{
        box-shadow: 0 29px 32px rgb(201 155 159 / 100%);
    }
`

const Right01 = styled(Box)`
    display: flex;
    width: 30%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height:414px;

`
const Part01 = styled(Box)`
    display: flex;
    background: #A32A2F;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    transition: .3s;
    &:hover{
        box-shadow: 0 29px 32px rgb(201 155 159 / 100%);
    }
`

const SmText01 = styled(Box)`
    display: flex;
    flex:1;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    letter-spacing: -.01em;
    color: white;
`

const BgText01 = styled(Box)`
    display: flex;
    flex:2;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    text-align: center;
    letter-spacing: -.01em;
    font-size: 40px;
    line-height: 40px;
    color: white;
`
const Bgtext02 = styled(Box)`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -.01em;
    color: white;
`
const SmText03 = styled(Box)`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: flex-end;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    letter-spacing: -.01em;
    color: white;
`

const GraphBox = styled(Box)`
    display: flex;
    flex: 2;

`

const GraphInfoBox = styled(Box)`
    display: flex;
    flex: 1;
    width: 80%;
    justify-content: center;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    letter-spacing: -.01em;
    color: white;
`

const ConnectWalletBtn01 = styled(Box)`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    background: rgba(0,0,0,.3);
    border-radius: 8px;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    margin: 0 auto;
    max-width: 240px;
    text-align: center;
    transition: .3s;
    &:hover{
        cursor: pointer;
        background: rgba(0,0,0,.5);
        box-shadow: 0 10px 10px rgb(0 0 0 / 30%);
        cursor: pointer;
        transition: .2s;
    }
`
const SmText02 = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 24px;
    font-family: "Inter",sans-serif;
    font-style: normal;
    font-weight: 600;
    text-align: center;
    letter-spacing: -.01em;
    color: white;
`

const SizeBox = styled(Box)`
    display: flex;
    position: absolute;
    right: 5%;
    top: 10%;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    padding: 8px 8px 6px;
    background: rgba(0,0,0,.3);
    color: white;
    cursor: pointer;
    z-index: 100;
    transition: .2s;
    &:hover{
        box-shadow: 0 10px 10px rgb(0 0 0 / 30%);
        cursor: pointer;
        transition: .2s;
        background: rgba(0,0,0,.5);
    }
`

export default Content;
