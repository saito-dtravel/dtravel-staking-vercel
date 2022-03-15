import React, { useState, useEffect, useMemo } from "react";
import { Box, Modal } from '@material-ui/core';
import { TailSpin } from 'react-loader-spinner';
import styled from "styled-components";
import Staked01 from "../../assets/stake.svg"
import Reward01 from "../../assets/rewards.svg";
import Mark01 from "../../assets/dtravle_mark01.png"
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { CONTRACTS } from "../../utils/constants";
import { MC_ABI, SMC_ABI, LP_MC_ABI, LP_SMC_ABI, FREE_TRVL_ABI } from "../../utils/abi";
import CustomButton from '../elements/buttons';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { GiCancel } from 'react-icons/gi';
import { useNavigate } from "react-router-dom";
import Web3 from 'web3'
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Content = ({ modalFlag, setModal }) => {
    let navigate = useNavigate();
    const { account, active, library } = useWeb3React();
    const [total_stake, set_total_stake] = useState(0);
    const [user_total_stake, set_user_total_stake] = useState(0);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);
    const [open1, setOpen1] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);
    const [open2, setOpen2] = useState(false);
    const connect_wallet = () => {
        setModal(!modalFlag);
    }
    const [amount, set_amount] = useState(0);
    const [amount_free, set_amount_free] = useState(0);
    const [duration, set_duration] = useState(0);
    const [locked, set_locked] = useState(false);
    const [mc_apr, set_mc_apr] = useState(0);
    const [lp_apr, set_lp_apr] = useState(0);
    const [flag_flag_staking_modal, set_flag_staking_modal] = useState(0);
    const [total_lp_stake, set_total_lp_stake] = useState(0);
    const [rewards, set_rewards] = useState(0);
    const [free_trvl_staked_value, set_free_trvl_staked_value] = useState(0);
    const [flag_spin_load, set_spin_load] = useState(false);
    const [flag_spin_load_free, set_spin_load_free] = useState(false);
    const [trvl_pools, set_trvl_pools] = useState(null);
    const [trvllp_pools, set_trvllp_pools] = useState(null);
    const [claim_rewards, set_claim_rewards] = useState(0);
    const MC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.MC_TOKEN, MC_ABI, library.getSigner()) : null), [library]);
    const SMC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_TOKEN, SMC_ABI, library.getSigner()) : null), [library]);
    const LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.LP_TOKEN, LP_MC_ABI, library.getSigner()) : null), [library]);
    const SMC_LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_LP_Token, LP_SMC_ABI, library.getSigner()) : null), [library]);
    const FREE_TRVL_CONTRACT = useMemo(() => (library ? new ethers.Contract(CONTRACTS.FREE_TRVL, FREE_TRVL_ABI, library.getSigner()) : null), [library]);

    const useStyles = makeStyles((theme) => ({
        root: {
            width: 250,
        },
        margin: {
            height: theme.spacing(3),
        },
    }));

    const marks = [
        {
            value: 0,
            label: '0 weeks',
        },
        {
            value: 52,
            label: '52 weeks',
        },
    ];

    function valuetext(value) {
        return `${value} weeks`;
    }

    const handleSliderChange = (event, newValue) => {
        set_duration(newValue);
    };

    const stake = async () => {
        try {
            set_spin_load(true);
            let amount_wei = amount * Math.pow(10, 18);
            const approve = await MC_Contract.approve(CONTRACTS.SMC_TOKEN, "0x" + amount_wei.toString(16));
            await approve.wait();
            var t_duration;
            if (locked === true) {
                t_duration = duration * 60 * 60 * 24 * 7;
            }
            else {
                t_duration = 0;
            }
            const stake_mc = await SMC_Contract.deposit("0x" + amount_wei.toString(16), "0x" + t_duration.toString(16), account);
            await stake_mc.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
            setTimeout(() => {
                get_total_stake();
                set_spin_load(false);
                get_rewards();
                get_mc_apr();
                set_amount(0);
                set_locked(false);
                handleClose();
            }, 3000);

        }
        catch (err) {
            console.log(err);
            NotificationManager.error('Failed. Try it again.', 'Hi.', 3000);
            set_spin_load(false);
            set_locked(false);
            set_amount(0);
            handleClose();
        }
    }

    const stake_lp = async () => {
        try {
            set_spin_load(true);
            let amount_wei = amount * Math.pow(10, 18);
            const approve = await LP_Contract.approve(CONTRACTS.SMC_LP_Token, "0x" + amount_wei.toString(16));
            await approve.wait();
            var t_duration;
            if (locked === true) {
                t_duration = duration * 60 * 60 * 24 * 7;
            }
            else {
                t_duration = 0;
            }
            const stake_mc = await SMC_LP_Contract.deposit("0x" + amount_wei.toString(16), "0x" + t_duration.toString(16), account);
            await stake_mc.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
            setTimeout(() => {
                get_total_lp_stake();
                set_spin_load(false);
                get_lp_apr();
                set_amount(0);
                get_rewards();
                handleClose();
            }, 3000);
        }
        catch (err) {
            console.log(err);
            NotificationManager.error('Failed. Try it again.', 'Hi.', 3000);
            set_spin_load(false);
            set_locked(false);
            set_amount(0);
            handleClose();
        }
    }

    const stake_free = async () => {
        try {
            set_spin_load(true);
            let amount_wei = amount * Math.pow(10, 18);
            const approve = await MC_Contract.approve(CONTRACTS.FREE_TRVL, "0x" + amount_wei.toString(16));
            await approve.wait();
            const stake_mc = await FREE_TRVL_CONTRACT.stake("0x" + amount_wei.toString(16));
            await stake_mc.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
            setTimeout(() => {
                handleClose();
                get_free_trvl_staked_value();
                set_spin_load(false);
                set_amount(0);
            }, 3000);
        }
        catch (err) {
            console.log(err);
            NotificationManager.error('Failed. Try it again.', 'Hi.', 3000);
            get_free_trvl_staked_value();
            set_spin_load(false);
            set_amount(0);
            handleClose();
        }
    }

    const get_free_trvl_staked_value = async () => {
        try {
            let t_value = await FREE_TRVL_CONTRACT.balanceOf(account);
            set_free_trvl_staked_value(parseInt(t_value._hex) / Math.pow(10, 18));
        }
        catch (err) {
            console.log(err);
        }
    };

    const get_mc_apr = async () => {
        try {
            let locked1 = await SMC_Contract.getTotalDeposit(account);
            let total = await SMC_Contract.balanceOf(account);
            let apr = (parseInt(total._hex) / parseInt(locked1) * 100).toFixed(2);
            set_mc_apr(apr);
        }
        catch (err) {
            console.log(err);
        }
    }


    const get_lp_apr = async () => {
        try {
            let locked1 = await SMC_LP_Contract.getTotalDeposit(account);
            let total = await SMC_LP_Contract.balanceOf(account);
            let apr = (parseInt(total._hex) / parseInt(locked1) * 100).toFixed(2);
            set_lp_apr(apr);
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_rewards = async () => {
        try {
            let t_rewards = await SMC_Contract.withdrawableRewardsOf(account);
            // let t_lp_rewards = await SMC_LP_Contract.withdrawableRewardsOf(account);
            set_rewards((parseInt(t_rewards._hex) / Math.pow(10, 18)).toFixed(2));
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_total_staked_amount = async () => {
        window.web3 = new Web3(window.web3.currentProvider);
        const mc_contract = new window.web3.eth.Contract(MC_ABI, CONTRACTS.MC_TOKEN);
        const t_value = await mc_contract.methods.balanceOf(CONTRACTS.SMC_TOKEN).call();
        // console.log(t_value)
        set_total_stake((parseInt(t_value) / Math.pow(10, 18)).toFixed(2));
    }

    const get_total_stake = async () => {
        try {
            const t_value = await MC_Contract.balanceOf(CONTRACTS.SMC_TOKEN);
            const user_t_value = await SMC_Contract.getTotalDeposit(account);
            const user_t_free_value = await FREE_TRVL_CONTRACT.balanceOf(account);
            set_total_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(2));
            set_user_total_stake(((parseInt(user_t_value._hex) + parseInt(user_t_free_value._hex)) / Math.pow(10, 18)).toFixed(2));
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_total_lp_stake = async () => {
        try {
            let t_value = await SMC_LP_Contract.balanceOf(account);
            set_total_lp_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(2));
        }
        catch (err) {
            console.log(err);
        }
    }

    const unstake = async (index) => {
        try {
            const unstake_mc = await SMC_Contract.withdraw(index, account);
            await unstake_mc.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
            get_total_stake();
            get_rewards();
            get_total_lp_stake();

        }
        catch (err) {
            console.log(err);
        }
    }

    const unstake_lp = async (index) => {
        try {
            const unstake_mc = await SMC_LP_Contract.withdraw(index, account);
            await unstake_mc.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
            get_total_stake();
            get_rewards();
            get_total_lp_stake();
        }
        catch (err) {
            console.log(err);
        }
    }

    const unstake_free = async () => {
        try {
            set_spin_load_free(true);
            const unstake_free1 = await FREE_TRVL_CONTRACT.withdraw("0x"+(amount_free*Math.pow(10,18)).toString(16));
            await unstake_free1.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
            setTimeout(() => {
                handleClose2();
                get_free_trvl_staked_value();
                set_spin_load_free(false);
                set_amount_free(0);
            }, 3000);
        }
        catch (err) {
            console.log(err);
            NotificationManager.error('Failed. Try it again.', 'Hi.', 3000);
            set_spin_load_free(false);
            get_free_trvl_staked_value();
            set_amount_free(0);
            handleClose2();
        }
    }


    const get_claimRewads = async () => {
        try {
            let claim_rewards1 = await SMC_Contract.totalClaimReward();
            let lp_claim_rewards = await SMC_LP_Contract.totalClaimReward();
            let total = ((parseInt(claim_rewards1._hex) + parseInt(lp_claim_rewards)) / Math.pow(10, 18)).toFixed(2);

            set_claim_rewards(total);
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_pools = async () => {
        const trvl_pools = await SMC_Contract.getDepositsOf(account);
        const trvllp_pools = await SMC_LP_Contract.getDepositsOf(account);
        // console.log('mc_pools', trvl_pools);
        set_trvl_pools(trvl_pools);
        set_trvllp_pools(trvllp_pools);
    }

    useEffect(() => {
        if (active === false) {
        }
        else {
            get_total_stake();
            get_total_lp_stake();
            get_mc_apr();
            get_lp_apr();
            get_rewards();
            get_pools();
            get_claimRewads();
            get_free_trvl_staked_value();
        }
        get_total_staked_amount();
    }, [active]);

    return (
        <StyledComponent>
            <RewardText>
                <LeftText01>
                    Rewards
                </LeftText01>
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
                            active ?
                                <>
                                    <ConnectWalletBtn01 onClick={() => {
                                        window.scrollTo(0, document.body.scrollHeight);
                                    }}>
                                        Stake
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

                            active ?
                                <>
                                    <ConnectWalletBtn01 onClick={() => {
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
                            $ {claim_rewards}
                        </Bgtext02>
                    </Part01>

                </Right01>
            </CenterPart>
            {
                active ?
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
            {active ?
                <>
                    <RewardText marginTop={"5%"}>
                        <LeftText01>
                            Core Pools
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
                                <img alt="" />TRVL
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                $ {total_stake * 1}
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                {mc_apr !== "NaN" ? mc_apr : 100}%
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                                <Box display={"1"} width={"30%"}><CustomButton str={""} width={"100%"} height={""} color={""} bgcolor={""} fsize={""} fweight={""} bradius={""}></CustomButton></Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    handleOpen1();
                                    set_flag_staking_modal(0);
                                }}><CustomButton str={"Details"} width={"100%"} height={"30px"} color={"black"} bgcolor={"white"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    handleOpen();
                                    set_flag_staking_modal(0);
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
                                {lp_apr !== "NaN" ? lp_apr : 100}%
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                                <Box display={"1"} width={"30%"}>
                                    <a target="_blank" rel="noopener noreferrer" href="https://v2.info.uniswap.org/pair/0xccb63225a7b19dcf66717e4d40c9a72b39331d61"><CustomButton str={"Buy LP"} width={"100%"} height={"30px"} color={"black"} bgcolor={"white"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></a></Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    handleOpen1();
                                    set_flag_staking_modal(1);
                                }}>
                                    <CustomButton str={"Details"} width={"100%"} height={"30px"} color={"black"} bgcolor={"white"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton>
                                </Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    handleOpen();
                                    set_flag_staking_modal(1);
                                }}>
                                    <CustomButton str={"Stake"} width={"100%"} height={"30px"} color={"white"} bgcolor={"rgba(0,0,0,.3)"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton>
                                </Box>
                            </Box>
                        </Row03>
                        <Row02 marginBottom={"5%"}>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                <img alt="" />Free TRVL
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                $ {free_trvl_staked_value * 1}
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                100%
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                                <Box display={"1"} width={"30%"}><CustomButton str={""} width={"100%"} height={""} color={""} bgcolor={""} fsize={""} fweight={""} bradius={""}></CustomButton></Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    // handleOpen1();
                                    // set_flag_staking_modal(2);
                                }}><CustomButton str={"Details"} width={"100%"} height={"30px"} color={"black"} bgcolor={"white"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                                <Box display={"1"} width={"30%"} onClick={() => {
                                    handleOpen();
                                    set_flag_staking_modal(2);
                                }}><CustomButton str={"Stake"} width={"100%"} height={"30px"} color={"white"} bgcolor={"rgba(0,0,0,.3)"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                            </Box>
                        </Row02>
                    </PoolsPart></> :
                <></>
            }


            {active ?
                <>
                    <RewardText marginTop={"5%"}>
                        <LeftText01>
                            Pools
                        </LeftText01>
                    </RewardText>
                    <PoolsPart>
                        <Row01>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                Pool
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                                Amount Staked
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                Lock Date
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                Unlock Date
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} >
                            </Box>
                        </Row01>
                        {
                            trvl_pools && trvl_pools.map((pool, index) => {
                                return (
                                    <Row02 key={index}>
                                        <Box display={"flex"} flex="1" alignItems={"center"} >
                                            <img alt="" />TRVL Pool
                                        </Box>
                                        <Box display={"flex"} flex="1" alignItems={"center"} >
                                            $ {(parseInt(pool.amount._hex) / Math.pow(10, 18)).toFixed(2)}
                                        </Box>
                                        <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                            {
                                                new Date(parseInt(pool.start._hex) * 1000).toLocaleDateString("en-US") + " "
                                                + new Date(parseInt(pool.start._hex) * 1000).toLocaleTimeString("en-US")
                                            }
                                        </Box>
                                        <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                            {
                                                new Date(parseInt(pool.end._hex) * 1000).toLocaleDateString("en-US") + " "
                                                + new Date(parseInt(pool.end._hex) * 1000).toLocaleTimeString("en-US")
                                            }
                                        </Box>
                                        <Box display={"flex"} flex="1" alignItems={"center"} justifyContent="center" width={"100%"}>
                                            {
                                                Date.now() > (parseInt(pool.end._hex) * 1000) ?
                                                    <>
                                                        <Box display={"1"} width={"40%"} onClick={() => {
                                                            unstake(index);
                                                        }}>
                                                            <CustomButton
                                                                str={"Unlock"}
                                                                width={"100%"}
                                                                height={"30px"}
                                                                color={"black"}
                                                                bgcolor={"white"}
                                                                fsize={"16px"}
                                                                fweight={"600"}
                                                                bradius={"8px"}
                                                            >
                                                            </CustomButton>
                                                        </Box>
                                                    </> : <></>
                                            }
                                        </Box>
                                    </Row02>
                                )

                            })
                        }

                        {
                            trvllp_pools && trvllp_pools.map((pool, index) => {
                                return (
                                    <Row02 key={index}>
                                        <Box display={"flex"} flex="1" alignItems={"center"} >
                                            <img alt="" />TRVL/LP Pool
                                        </Box>
                                        <Box display={"flex"} flex="1" alignItems={"center"} >
                                            $ {(parseInt(pool.amount._hex) / Math.pow(10, 18)).toFixed(2)}
                                        </Box>
                                        <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                            {
                                                new Date(parseInt(pool.start._hex) * 1000).toLocaleDateString("en-US") + " "
                                                + new Date(parseInt(pool.start._hex) * 1000).toLocaleTimeString("en-US")
                                            }
                                        </Box>
                                        <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                            {
                                                new Date(parseInt(pool.end._hex) * 1000).toLocaleDateString("en-US") + " "
                                                + new Date(parseInt(pool.end._hex) * 1000).toLocaleTimeString("en-US")
                                            }
                                        </Box>
                                        <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"center"} width={"100%"} >
                                            {
                                                Date.now() > (parseInt(pool.end._hex) * 1000) ?
                                                    <>
                                                        <Box display={"1"} width={"40%"} onClick={() => {
                                                            unstake_lp(index);
                                                        }}>
                                                            <CustomButton
                                                                str={"Unlock"}
                                                                width={"100%"}
                                                                height={"30px"}
                                                                color={"black"}
                                                                bgcolor={"white"}
                                                                fsize={"16px"}
                                                                fweight={"600"}
                                                                bradius={"8px"}>
                                                            </CustomButton>
                                                        </Box>
                                                    </> : <></>
                                            }
                                        </Box>
                                    </Row02>
                                )

                            })
                        }
                        {
                            free_trvl_staked_value === 0 ? <></> :
                                <Row02>
                                    <Box display={"flex"} flex="1" alignItems={"center"} >
                                        <img alt="" />Free TRVL Pool
                                    </Box>
                                    <Box display={"flex"} flex="1" alignItems={"center"} >
                                        $ {free_trvl_staked_value}
                                    </Box>
                                    <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                        No Lock Time
                                    </Box>
                                    <Box display={"flex"} flex="1.2" alignItems={"center"} >
                                        {
                                            new Date().toLocaleDateString("en-US") + " "
                                            + new Date().toLocaleTimeString("en-US")
                                        }
                                    </Box>
                                    <Box display={"flex"} flex="1" alignItems={"center"} justifyContent="center" width={"100%"}>
                                        <Box display={"1"} width={"40%"} onClick={() => {
                                            handleOpen2();
                                        }}>
                                            <CustomButton
                                                str={"Unlock"}
                                                width={"100%"}
                                                height={"30px"}
                                                color={"black"}
                                                bgcolor={"white"}
                                                fsize={"16px"}
                                                fweight={"600"}
                                                bradius={"8px"}
                                            >
                                            </CustomButton>
                                        </Box>

                                    </Box>
                                </Row02>
                        }



                        <Row03></Row03>
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
                        {'\u00a0'}{'\u00a0'}{flag_flag_staking_modal === 0 ? "TRVL" : flag_flag_staking_modal === 1 ? "TRVL/ETH Uniswap LP" : "Free TRVL"}
                    </TitleText01>
                    {flag_flag_staking_modal === 2 ? <></> : <SelectDuration>
                        <FlexibleBox onClick={() => {
                            if (flag_spin_load === true) {
                                NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                                return;
                            }
                            set_locked(false);
                        }} locked={locked ? 1 : 0}>Flexible</FlexibleBox>
                        <LockedBox onClick={() => {
                            if (flag_spin_load === true) {
                                NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                                return;
                            }
                            set_locked(true);
                        }} locked={locked ? 1 : 0}>Locked</LockedBox>
                    </SelectDuration>}

                    <SmText04 >
                        Amount
                    </SmText04>
                    <InputAmount component={"input"} value={amount} type={'number'} onChange={(e) => {
                        if (flag_spin_load === true) {
                            NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                            return;
                        }
                        set_amount(e.target.value);
                    }}></InputAmount>
                    {locked ? <>
                        <Box display={"flex"} width={"100%"}>
                            <Box display={"flex"} flex="1" width={"100%"}>
                                <SmText04>
                                    Lock for : ({duration} weeks)
                                </SmText04></Box>
                            <Box display={"flex"} flex="1" width={"100%"} >
                                <SmText04 justifyContent={"flex-end"}>
                                    Weight : ({(1 + duration / 52).toFixed(2)})
                                </SmText04></Box>
                        </Box>
                        <Slider
                            defaultValue={0}
                            getAriaValueText={valuetext}
                            aria-labelledby="discrete-slider-always"
                            // step={10}
                            value={duration}
                            marks={marks}
                            max={52}
                            valueLabelDisplay="on"
                            onChange={handleSliderChange}
                        />
                        {/* <InputAmount component={"input"} value={duration} type={'number'} onChange={(e) => {
                            set_duration(e.target.value);
                        }}></InputAmount> */}
                    </> : <></>}
                    <Box display={"flex"} width={"100%"} marginTop={"5%"} position={"relative"} onClick={() => {
                        if (flag_flag_staking_modal === 0) {
                            if (flag_spin_load === true) {
                                NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                                return;
                            }
                            stake();
                        }
                        else if (flag_flag_staking_modal === 1) {
                            if (flag_spin_load === true) {
                                NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                                return;
                            }
                            stake_lp();
                        }
                        else if (flag_flag_staking_modal === 2) {
                            if (flag_spin_load === true) {
                                NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                                return;
                            }
                            stake_free();
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
            <Modal open={open1} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <ModalBox>
                    <CancelBox01 onClick={() => {
                        handleClose1();
                        set_spin_load(false);
                    }}>
                        <GiCancel></GiCancel>
                    </CancelBox01>
                    <TitleText01>
                        <img src={Mark01} width={"30px"} height={"30px"} alt=""></img>
                        {'\u00a0'}{'\u00a0'}{flag_flag_staking_modal === 0 ? "TRVL" : flag_flag_staking_modal === 1 ? "TRVL/ETH Uniswap LP" : "Free TRVL"}
                    </TitleText01>
                    <TitleText01 marginTop={"8%"}>
                        Details
                    </TitleText01>
                    <TitleText02 marginTop={"5%"}>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>TVL</Box>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>$</Box>
                    </TitleText02>
                    <TitleText02 marginTop={"3%"}>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>Weight</Box>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>20%</Box>
                    </TitleText02>
                    <TitleText02 marginTop={"3%"}>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>Pending rewards</Box>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>0.00 MC</Box>
                    </TitleText02>
                    <TitleText02 marginTop={"3%"}>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>Pool APR</Box>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>%</Box>
                    </TitleText02>
                    <TitleText02 marginTop={"3%"}>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>My liquidity</Box>
                        <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>0.00 MC</Box>
                    </TitleText02>
                    <Box display={"flex"} width={"100%"} marginTop={"5%"} position={"relative"} onClick={() => {
                        if (flag_flag_staking_modal === false) {
                            // stake();
                        }
                        else {
                            // stake_lp();
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
            <Modal open={open2} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <ModalBox>
                    <CancelBox01 onClick={() => {
                        handleClose2();
                        set_spin_load_free(false);
                        set_amount_free(0);
                        NotificationManager.error('Cancelled. Try it again.', 'Hi.', 3000);
                    }}>
                        <GiCancel></GiCancel>
                    </CancelBox01>
                    <TitleText01>
                        <img src={Mark01} width={"30px"} height={"30px"} alt=""></img>
                        {'\u00a0'}{'\u00a0'}Free TRVL
                    </TitleText01>
                    <SmText04 >
                        Amount
                    </SmText04>
                    <InputAmount component={"input"} value={amount_free} type={'number'} onChange={(e) => {
                        if (flag_spin_load_free === true) {
                            NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                            return;
                        }
                        set_amount_free(e.target.value);
                    }}></InputAmount>
                    <Box display={"flex"} width={"100%"} marginTop={"5%"} position={"relative"} onClick={() => {
                        if (flag_spin_load_free === true) {
                            NotificationManager.error('Please wait while processing.', 'Hi.', 2000);
                            return;
                        }
                        unstake_free();
                    }}>
                        {flag_spin_load_free ?
                            <Box display={"flex"} position={"absolute"} left={"20%"} justifyContent={"center"} alignItems={"center"} top="10%">
                                <TailSpin color="white" height={35} width={35} />
                            </Box>
                            :
                            <></>
                        }
                        <CustomButton str={"Unstake"} width={"100%"} height={"50px"} color={"white"} bgcolor={"#A32A2F"} fsize={"16px"} fweight={"600"} bradius={"8px"} />
                    </Box>
                </ModalBox>
            </Modal>
            <NotificationContainer />
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

const TitleText02 = styled(Box)`
  display: flex;
  flex:1;
  align-items: center;
  font-family: "Inter",sans-serif!important;
  font-style: normal;
  letter-spacing: -.01em;
  font-weight: 400;
  font-size: 18px;
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
    /* margin-bottom: 5%; */
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
// const RightText01 = styled(Box)`
//     display: flex;
//     flex: 1;
//     font-family: "Inter",sans-serif;
//     font-style: normal;
//     font-weight: 400;
//     font-size: 24px;
//     line-height: 32px;
//     letter-spacing: -.01em;
//     color: #05070c;
//     max-width: 560px;
//     float: right;
// `

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

// const GraphBox = styled(Box)`
//     display: flex;
//     flex: 2;

// `

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

// const SizeBox = styled(Box)`
//     display: flex;
//     position: absolute;
//     right: 5%;
//     top: 10%;
//     justify-content: center;
//     align-items: center;
//     border-radius: 8px;
//     padding: 8px 8px 6px;
//     background: rgba(0,0,0,.3);
//     color: white;
//     cursor: pointer;
//     z-index: 100;
//     transition: .2s;
//     &:hover{
//         box-shadow: 0 10px 10px rgb(0 0 0 / 30%);
//         cursor: pointer;
//         transition: .2s;
//         background: rgba(0,0,0,.5);
//     }
// `

export default Content;
