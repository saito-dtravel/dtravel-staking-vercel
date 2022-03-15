import React, { useState, useEffect, useMemo } from "react";
import { Box, Modal } from '@material-ui/core';
import { TailSpin } from 'react-loader-spinner';
import styled from "styled-components";
import Mark01 from "../../assets/dtravle_mark01.png"
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { CONTRACTS } from "../../utils/constants";
import { MC_ABI, SMC_ABI, LP_MC_ABI, LP_SMC_ABI, FREE_TRVL_ABI } from "../../utils/abi";
import CustomButton from '../elements/buttons';
import { GiCancel } from 'react-icons/gi';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Reward = () => {
    const { account, active, library } = useWeb3React();
    const [total_stake, set_total_stake] = useState(0);
    const [user_total_stake, set_user_total_stake] = useState(0);
    const [mc_apr, set_mc_apr] = useState(0);
    const [lp_token_flag, set_lp_token_flag] = useState(false);
    const [total_lp_stake, set_total_lp_stake] = useState(0);
    const [flag_account, set_flag_account] = useState(false);
    const [rewards, set_rewards] = useState(0);
    const [lp_rewards, set_lp_rewards] = useState(0);
    const [claim_rewards, set_claim_rewards] = useState(0);
    const [free_rewards, set_free_rewards] = useState(0);
    const [free_trvl_staked_value, set_free_trvl_staked_value] = useState(0);
    const MC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.MC_TOKEN, MC_ABI, library.getSigner()) : null), [library]);
    const SMC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_TOKEN, SMC_ABI, library.getSigner()) : null), [library]);
    const LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.LP_TOKEN, LP_MC_ABI, library.getSigner()) : null), [library]);
    const SMC_LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_LP_Token, LP_SMC_ABI, library.getSigner()) : null), [library]);
    const FREE_TRVL_CONTRACT = useMemo(() => (library ? new ethers.Contract(CONTRACTS.FREE_TRVL, FREE_TRVL_ABI, library.getSigner()) : null), [library]);

    useEffect(() => {
        if (active === false) {
            set_flag_account(false);
        }
        else {
            set_flag_account(true);
            get_total_stake();
            get_total_lp_stake();
            get_mc_apr();
            get_rewards();
            get_pools();
            get_claimRewads();
            get_free_trvl_staked_value();
        }
    }, [active]);

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

    const get_rewards = async () => {
        try {
            let t_rewards = await SMC_Contract.withdrawableRewardsOf(account);
            let t_lp_rewards = await SMC_LP_Contract.withdrawableRewardsOf(account);
            let free_rewards = await FREE_TRVL_CONTRACT.rewards(account);
            set_rewards((parseInt(t_rewards._hex) / Math.pow(10, 18)).toFixed(2));
            set_lp_rewards((parseInt(t_lp_rewards._hex) / Math.pow(10, 18)).toFixed(2));
            set_free_rewards((parseInt(free_rewards._hex) / Math.pow(10, 18)).toFixed(2))
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_total_stake = async () => {
        try {
            let t_value = await MC_Contract.balanceOf(CONTRACTS.SMC_TOKEN);
            let user_t_value = await SMC_Contract.getTotalDeposit(account);
            set_total_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(2));
            set_user_total_stake((parseInt(user_t_value._hex) / Math.pow(10, 18)).toFixed(2));

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

    const claim = async () => {
        try {
            let t_claim = await SMC_Contract.claimRewards(account);
            await t_claim.wait();
        }
        catch (err) {
            console.log(err);
        }
    }

    const claimLP = async () => {
        try {
            let t_claim = await SMC_LP_Contract.claimRewards(account);
            await t_claim.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
        }
        catch (err) {
            console.log(err);
        }
    }

    const claim_free = async () => {
        try {
            let t_claim = await FREE_TRVL_CONTRACT.getReward();
            await t_claim.wait();
            NotificationManager.success('Successed. See your results.', 'Hi.', 3000);
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_claimRewads = async () => {
        try {
            let claim_rewards = await SMC_LP_Contract.totalClaimReward();
            set_claim_rewards(claim_rewards);
        }
        catch (err) {
            console.log(err);
        }
    }

    const get_pools = async () => {
        const mc_pools = await SMC_Contract.getDepositsOf(account);
        console.log('mc_pools', mc_pools);
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

    return (
        <StyledComponent>
            <RewardText>
                <LeftText01>
                    Rewards
                </LeftText01>
                <RightText01>
                    Staking rewards enter a 12 month vesting period after claiming. TRVL tokens are non-transferable and only used for accounting purposes.
                </RightText01>
            </RewardText>
            <PoolsPart>
                <Row01>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        Care Pools
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        Amount Staked
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        Claimable Rewards
                    </Box>
                    <Box display={"flex"} flex="0.5" alignItems={"center"} ></Box>
                </Row01>
                <Row02>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        <img />TRVL
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        $ {user_total_stake * 1}
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        {rewards} TRVL
                    </Box>
                    <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>
                        <Box display={"1"} width={"60%"} onClick={() => {
                            claim();
                        }}><CustomButton str={"Claim"} width={"100%"} height={"30px"} color={"white"} bgcolor={"rgba(0,0,0,.3)"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                    </Box>
                </Row02>
                <Row03>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        TRVL/ETH Uniswap LP
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        {total_lp_stake * 1}
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        {lp_rewards} TRVL
                    </Box>
                    <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>

                        <Box display={"1"} width={"60%"} onClick={() => {
                            claimLP();
                        }}>
                            <CustomButton str={"Claim"} width={"100%"} height={"30px"} color={"white"} bgcolor={"rgba(0,0,0,.3)"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                    </Box>
                </Row03>
                <Row03 marginBottom={"5%"}>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        Free TRVL
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        $ {free_trvl_staked_value * 1}
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"} >
                        {free_rewards} TRVL
                    </Box>
                    <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>

                        <Box display={"1"} width={"60%"} onClick={() => {
                            claim_free();
                        }}>
                            <CustomButton str={"Claim"} width={"100%"} height={"30px"} color={"white"} bgcolor={"rgba(0,0,0,.3)"} fsize={"16px"} fweight={"600"} bradius={"8px"}></CustomButton></Box>
                    </Box>
                </Row03>
            </PoolsPart>
            <NotificationContainer />
        </StyledComponent>
    );
}

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

export default Reward;
