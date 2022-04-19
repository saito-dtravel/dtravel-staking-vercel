import React, { useState, useEffect, useMemo } from "react";
import { Box, Modal } from "@material-ui/core";
import { TailSpin } from "react-loader-spinner";
import styled from "styled-components";
import Staked01 from "../../assets/stake.svg";
import Reward01 from "../../assets/rewards.svg";
import Mark01 from "../../assets/dtravle_mark01.png";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Moralis } from "moralis"
import { CONTRACTS, serverUrl, appId, masterKey, TRANSACTION_SCAN_URL} from "../../utils/constants";
import {requestAPICall} from "../../utils/helpers/apiService"
import { MC_ABI, SMC_ABI, LP_MC_ABI, LP_SMC_ABI, FREE_TRVL_ABI } from "../../utils/abi";
import CustomButton from "../elements/buttons";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { GiCancel } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import lib, { NotificationContainer, NotificationManager } from "react-notifications";
import { InjectedConnector } from "@web3-react/injected-connector";
import "react-notifications/lib/notifications.css";
import { EtherIcon, LogoIcon, LogoRoundedIcon } from "../elements/icons";
import { Web3Provider } from "@ethersproject/providers";
import { useGetPrice } from "../hooks/price";

const Content = ({ modalFlag, setModal, active, setActive }) => {
  const chainId = process.env.REACT_APP_NETWORK == "mainnet" ? 1 : 97;
  let navigate = useNavigate();
  const { account, library } = useWeb3React();
  const [total_stake, set_total_stake] = useState(0);
  const [total_trvl_stake, set_total_trvl_stake] = useState(0);
  // const [total_free_trvl_stake, set_total_free_trvl_stake] = useState(0);
  const [total_claim_rewards, set_total_claim_rewards] = useState(0);
  const [total_trvl_reward, set_total_trvl_reward] = useState(0);
  // const [total_free_trvl_reward, set_total_free_trvl_reward] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [open1, setOpen1] = useState(false);
  // const handleOpen2 = () => setOpen2(true);
  // const handleClose2 = () => setOpen2(false);
  // const [open2, setOpen2] = useState(false);
  const connect_wallet = () => {
    setModal(!modalFlag);
  };
  const [balance, set_balance] = useState(0);
  const [amount, set_amount] = useState(0);
  const [amount_free, set_amount_free] = useState(0);
  const [duration, set_duration] = useState(0);
  const [locked, set_locked] = useState(false);
  const [mc_apr, set_mc_apr] = useState(0);
  const [lp_apr, set_lp_apr] = useState(0);
  const [free_apr, set_free_apr] = useState(0);
  const [flag_flag_staking_modal, set_flag_staking_modal] = useState(0);

  const [total_lp_stake, set_total_lp_stake] = useState(0);
  const [user_total_stake, set_user_total_stake] = useState(0);
  const [user_total_trvl_stake, set_user_total_trvl_stake] = useState(0);
  // const [user_free_trvl_stake, set_user_free_trvl_stake] = useState(0);
  const [user_total_rewards, set_user_total_rewards] = useState(0);

  const [flag_spin_load, set_spin_load] = useState(false);
  const [flag_spin_load_free, set_spin_load_free] = useState(false);
  const [trvl_pools, set_trvl_pools] = useState(null);
  const [trvllp_pools, set_trvllp_pools] = useState(null);
  const MC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.MC_TOKEN, MC_ABI, library.getSigner()) : null), [library]);
  const SMC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_TOKEN, SMC_ABI, library.getSigner()) : null), [library]);
  // const LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.LP_TOKEN, LP_MC_ABI, library.getSigner()) : null), [library]);
  // const SMC_LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_LP_Token, LP_SMC_ABI, library.getSigner()) : null), [library]);
  // const FREE_TRVL_CONTRACT = useMemo(() => (library ? new ethers.Contract(CONTRACTS.FREE_TRVL, FREE_TRVL_ABI, library.getSigner()) : null), [library]);

  const price = useGetPrice();
  // const getLibrary = (provider) => {
  //   const library = new Web3Provider(provider);
  //   library.pollingInterval = 8000;
  //   return setLibrary(library);
  // }
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
      label: "0 weeks",
    },
    {
      value: 52,
      label: "52 weeks",
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
      } else {
        t_duration = 0;
      }
      const stake_mc = await SMC_Contract.deposit("0x" + amount_wei.toString(16), "0x" + t_duration.toString(16), account);
      await stake_mc.wait();
      NotificationManager.success("Deposited successfully. See your result : " + stake_mc.hash.toString().slice(0, 10) + "..." + stake_mc.hash.toString().slice(-4), 
      "Hi.", 6000, () => {window.open(TRANSACTION_SCAN_URL + stake_mc.hash)});
      setTimeout(() => {
        get_total_stake();
        set_spin_load(false);
        get_rewards();
        get_balance();
        get_pools();
        // get_mc_apr();
        set_amount(0);
        set_locked(false);
        handleClose();
      }, 3000);
    } catch (err) {
      console.log(err);
      NotificationManager.error("Failed. Try it again.", "Hi.", 3000);
      set_spin_load(false);
      set_locked(false);
      set_amount(0);
      handleClose();
    }
  };

  // const stake_lp = async () => {
  //   try {
  //     set_spin_load(true);
  //     let amount_wei = amount * Math.pow(10, 18);
  //     const approve = await LP_Contract.approve(CONTRACTS.SMC_LP_Token, "0x" + amount_wei.toString(16));
  //     await approve.wait();
  //     var t_duration;
  //     if (locked === true) {
  //       t_duration = duration * 60 * 60 * 24 * 7;
  //     } else {
  //       t_duration = 0;
  //     }
  //     const stake_mc = await SMC_LP_Contract.deposit("0x" + amount_wei.toString(16), "0x" + t_duration.toString(16), account);
  //     await stake_mc.wait();
  //     NotificationManager.success("Successed. See your results.", "Hi.", 3000);
  //     setTimeout(() => {
  //       get_total_lp_stake();
  //       set_spin_load(false);
  //       get_mc_apr();
  //       set_amount(0);
  //       get_rewards();
  //       handleClose();
  //     }, 3000);
  //   } catch (err) {
  //     console.log(err);
  //     NotificationManager.error("Failed. Try it again.", "Hi.", 3000);
  //     set_spin_load(false);
  //     set_locked(false);
  //     set_amount(0);
  //     handleClose();
  //   }
  // };

  const get_balance = async () => {
    try{
      console.log(serverUrl, appId, masterKey)
      await Moralis.start({ serverUrl, appId, masterKey });
      const tokens = await Moralis.Web3API.account.getTokenBalances({chain: "bsc testnet", address: account});
      console.log("tokens", tokens);
      let token_balance = 0;
      tokens.map((token) => {
        if(token.symbol == "TRVL") token_balance = token.balance;
      })
      set_balance(parseInt(token_balance) / Math.pow(10, 18));
    } catch(err)
    {

    }
  }

  // const stake_free = async () => {
  //   try {
  //     set_spin_load(true);
  //     let amount_wei = amount * Math.pow(10, 18);
  //     const approve = await MC_Contract.approve(CONTRACTS.FREE_TRVL, "0x" + amount_wei.toString(16));
  //     await approve.wait();
  //     const stake_mc = await FREE_TRVL_CONTRACT.stake("0x" + amount_wei.toString(16));
  //     await stake_mc.wait();
  //     console.log("stake mc", stake_mc);
  //     NotificationManager.success("Deposited successfully.  See your result: " + stake_mc.hash.toString().slice(0, 10) + "..." + stake_mc.hash.toString().slice(-4), 
  //     "Hi.", 6000, () => {window.open(TRANSACTION_SCAN_URL + stake_mc.hash)});
  //     setTimeout(() => {
  //       handleClose();
  //       // get_free_trvl_staked_value();
  //       set_spin_load(false);
  //       set_amount(0);
  //       get_total_stake();
  //       // get_mc_apr();
  //     }, 3000);
  //   } catch (err) {
  //     console.log(err);
  //     NotificationManager.error("Failed. Try it again.", "Hi.", 3000);
  //     // get_free_trvl_staked_value();
  //     set_spin_load(false);
  //     set_amount(0);
  //     handleClose();
  //   }
  // };

  // const get_free_trvl_staked_value = async () => {
  //   try {
  //     let t_value = await FREE_TRVL_CONTRACT.balanceOf(account);
  //     set_user_free_trvl_stake((parseInt(t_value._hex) / Math.pow(10, 18).toFixed(2)));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const get_mc_apr = async () => {
    try {
      let apr = await requestAPICall(process.env.REACT_APP_API_URL + "staking/getAPR");
      console.log("apr", process.env.REACT_APP_API_URL + "staking/getAPR");
      if(apr.data)
      {
        set_mc_apr(parseInt(apr.data.data.trvlStaking));
        set_free_apr(parseInt(apr.data.data.freeTrvlStaking));
        set_lp_apr(parseInt(apr.data.data.lpTrvlStaking));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const get_rewards = async () => {
    try {
      let t_rewards = await SMC_Contract.withdrawableRewardsOf(account);
      // let free_rewards = await FREE_TRVL_CONTRACT.earned(account);
      // let t_lp_rewards = await SMC_LP_Contract.withdrawableRewardsOf(account);
      // set_user_total_rewards(((parseInt(t_rewards._hex) + parseInt(free_rewards)) / Math.pow(10, 18)).toFixed(2));
      set_user_total_rewards(((parseInt(t_rewards._hex)) / Math.pow(10, 18)).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  const get_total_stake = async () => {
    try {
      console.log(MC_Contract);
      const t_value = await MC_Contract.balanceOf(CONTRACTS.SMC_TOKEN);
      // const free_t_value = await FREE_TRVL_CONTRACT.totalSupply();

      const user_t_value = await SMC_Contract.getTotalDeposit(account);
      // const user_t_free_value = await FREE_TRVL_CONTRACT.balanceOf(account);
      console.log(user_t_value);
      // set_total_stake(((parseInt(t_value._hex) + parseInt(free_t_value))/ Math.pow(10, 18)).toFixed(2));
      set_total_stake(((parseInt(t_value._hex))/ Math.pow(10, 18)).toFixed(2));
      // set_total_free_trvl_stake((parseInt(free_t_value) / Math.pow(10, 18)).toFixed(2));
      set_total_trvl_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(2));
      set_user_total_trvl_stake((parseInt(user_t_value) / Math.pow(10, 18)).toFixed(2));
      // set_user_total_stake(((parseInt(user_t_value._hex) + parseInt(user_t_free_value)) / Math.pow(10, 18)).toFixed(2));
      set_user_total_stake(((parseInt(user_t_value._hex)) / Math.pow(10, 18)).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  // const get_total_lp_stake = async () => {
  //   try {
  //     let t_value = await SMC_LP_Contract.balanceOf(account);
  //     set_total_lp_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(2));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const unstake = async (index) => {
    try {
      const unstake_mc = await SMC_Contract.withdraw(index, account);
      await unstake_mc.wait();
      NotificationManager.success("Unstaked successfully.  See your result: " + unstake_mc.hash.toString().slice(0, 10) + "..." + unstake_mc.hash.toString().slice(-4), 
      "Hi.", 6000, () => {window.open(TRANSACTION_SCAN_URL + unstake_mc.hash)});
      get_total_stake();
      get_rewards();
      get_pools();
      // get_total_lp_stake();
    } catch (err) {
      console.log(err);
    }
  };

  // const unstake_lp = async (index) => {
  //   try {
  //     const unstake_mc = await SMC_LP_Contract.withdraw(index, account);
  //     await unstake_mc.wait();
  //     NotificationManager.success("Successed. See your results.", "Hi.", 3000);
  //     get_total_stake();
  //     get_rewards();
  //     // get_total_lp_stake();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const unstake_free = async () => {
  //   try {
  //     set_spin_load_free(true);
  //     const unstake_free1 = await FREE_TRVL_CONTRACT.withdraw("0x" + (amount_free * Math.pow(10, 18)).toString(16));
  //     await unstake_free1.wait();
  //     NotificationManager.success("Unstaked successfully.  See your result: " + unstake_free1.hash.toString().slice(0, 10) + "..." + unstake_free1.hash.toString().slice(-4), 
  //     "Hi.", 6000, () => {window.open(TRANSACTION_SCAN_URL + unstake_free1.hash)});
  //     setTimeout(() => {
  //       handleClose2();
  //       get_free_trvl_staked_value();
  //       set_spin_load_free(false);
  //       get_total_stake();
  //       set_amount_free(0);
  //     }, 3000);
  //   } catch (err) {
  //     console.log(err);
  //     NotificationManager.error("Failed. Try it again.", "Hi.", 3000);
  //     set_spin_load_free(false);
  //     get_free_trvl_staked_value();
  //     set_amount_free(0);
  //     handleClose2();
  //   }
  // };

  const get_claimRewads = async () => {
    try {
      let claim_rewards1 = await SMC_Contract.totalClaimReward();
      // let claim_rewards2 = await FREE_TRVL_CONTRACT.totalReward();
      // let lp_claim_rewards = await SMC_LP_Contract.totalClaimReward();
      // let total = ((parseInt(claim_rewards1._hex) + parseInt(lp_claim_rewards)) / Math.pow(10, 18)).toFixed(2);
      // let total = ((parseInt(claim_rewards1._hex) + parseInt(claim_rewards2)) / Math.pow(10, 18)).toFixed(2);
      let total = ((parseInt(claim_rewards1._hex)) / Math.pow(10, 18)).toFixed(2);
      set_total_trvl_reward((parseInt(claim_rewards1._hex) / Math.pow(10, 18)).toFixed(2));
      // set_total_free_trvl_reward((parseInt(claim_rewards2) / Math.pow(10, 18)).toFixed(2));
      set_total_claim_rewards(total);
    } catch (err) {
      console.log(err);
    }
  };

  const get_pools = async () => {
    try{
      const trvl_pools = await SMC_Contract.getDepositsOf(account);
      // const trvllp_pools = await SMC_LP_Contract.getDepositsOf(account);
      // console.log('mc_pools', trvl_pools);
      set_trvl_pools(trvl_pools);
    }
    catch(error){
      console.log(error);
    }
  };

  useEffect(() => {
    const effect = async() => {
      if (active === false) {
        set_user_total_stake(0);
        set_user_total_rewards(0);
      } else {
        console.log("window", window.ethereum);
        if(window.ethereum)
        {
          if(window.ethereum.networkVersion == chainId)
          {
            console.log("library", library);
            get_total_stake();
            get_balance();
            get_mc_apr();
            get_rewards();
            get_pools();
            get_claimRewads();
          }
        }
      }
    }
    effect();
    // get_total_staked_amount();
  }, [active, library]);
  const [detailInfor, setDetailInfor] = useState(null);
  return (
    <StyledComponent sx={{ marginTop: { xs: "64px", sm: "80px" } }}>
      {!detailInfor ? (
        <>
          <RewardsPart>
            <Box px={"40px"} borderLeft={"1px solid #0b2336"} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <LeftSector01Text width={"128px"}>REWARDS</LeftSector01Text>
            </Box>
            <CenterSector01>
              <RewardText>
                <LeftText01>Overview</LeftText01>
                <LeftText02>We offer staking pools for TRVL with various lock-up conditions.</LeftText02>
              </RewardText>
              <CenterPart sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}>
                <Left01>
                  <SmText01>Staked</SmText01>
                  <Box width={"100%"} display={"flex"} flexDirection={"column"} alignItems={"flex-start"} gridGap={"8px"}>
                    <BgText01>${(user_total_stake * price).toFixed(2)}</BgText01>
                    <SmText05 display={"flex"} alignItems={"center"} gridGap={"4px"}>
                      <LogoIcon size="32px" color="white" /> TRVL {user_total_stake}
                    </SmText05>
                  </Box>
                  <Box mt={"32px"} width="100%" display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    {active ? (
                      <>
                        <ConnectWalletBtn01
                          onClick={() => {
                            window.scrollTo(0, document.body.scrollHeight);
                          }}
                        >
                          Stake
                        </ConnectWalletBtn01>
                      </>
                    ) : (
                      <>
                        <ConnectWalletBtn01 onClick={() => connect_wallet()}>Connect Wallet</ConnectWalletBtn01>
                      </>
                    )}
                  </Box>
                </Left01>
                <Left01>
                  <SmText01>Unclaimed Rewards</SmText01>
                  <Box width={"100%"} display={"flex"} flexDirection={"column"} alignItems={"flex-start"} gridGap={"8px"}>
                    <BgText01>${(user_total_rewards * price).toFixed(2)}</BgText01>
                    <SmText05 display={"flex"} alignItems={"center"} gridGap={"4px"}>
                      <LogoIcon size="32px" color="white" /> TRVL {user_total_rewards}
                    </SmText05>
                  </Box>
                  <Box mt={"32px"} width="100%" display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    {active ? (
                      <>
                        <ConnectWalletBtn01
                          onClick={() => {
                            navigate("/reward");
                            window.scrollTo(0, 0);
                          }}
                        >
                          Claim
                        </ConnectWalletBtn01>
                      </>
                    ) : (
                      <>
                        <ConnectWalletBtn01 onClick={() => connect_wallet()}>Connect Wallet</ConnectWalletBtn01>
                      </>
                    )}
                  </Box>
                </Left01>
              </CenterPart>
              <CenterPart01 sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}>
                <Right01>
                  <Part01 display={"flex"} flex={"1"} justifyContent="center" alignItems={"center"} flexDirection={"column"} width="100%">
                    <SmText02 letterSpacing={"0.1em"}>TOTAL AMOUNT STAKED:</SmText02>
                    <Bgtext02>${(total_stake * price).toFixed(2)}</Bgtext02>
                    <SmText03 display={"flex"} alignItems={"center"} gridGap={"8px"}>
                      <LogoIcon size="32px" color="white" /> TRVL {total_stake}
                    </SmText03>
                  </Part01>
                </Right01>
                <Right01>
                  <Part01 display={"flex"} flex={"1"} justifyContent="center" alignItems={"center"} flexDirection={"column"} width="100%">
                    <SmText02 letterSpacing={"0.1em"}>TOTAL REWARDS CLAIMED:</SmText02>
                    <Bgtext02>${(total_claim_rewards * price).toFixed(2)}</Bgtext02>
                    <SmText03 display={"flex"} alignItems={"center"} gridGap={"8px"}>
                      <LogoIcon size="32px" color="white" /> TRVL {total_claim_rewards}
                    </SmText03>
                  </Part01>
                </Right01>
              </CenterPart01>
            </CenterSector01>
            <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" } }}></Box>
          </RewardsPart>
          {active ? (
            <PoolsPart>
              <Box px={"40px"} borderLeft={"1px solid #0b2336"} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                <LeftSector01Text width={"128px"}>Pools</LeftSector01Text>
              </Box>
              <CenterSector02>
                <>
                  <RewardText>
                    <LeftText01>Pools Information</LeftText01>
                    <LeftText03>
                    These are the available staking pools. Staking contracts have been audited by {" "}
                      <Box display={"inline"} style={{ textDecoration: "underline" }}>
                        PeckShield
                      </Box>
                      .
                    </LeftText03>
                  </RewardText>
                  <PoolsPart01>
                    <Row01 sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
                      <Box display={"flex"} flex="1" alignItems={"center"}>
                        Pools
                      </Box>
                      <Box display={"flex"} flex="1" alignItems={"center"}>
                        Total Value Locked
                      </Box>
                      <Box display={"flex"} flex="0.6" alignItems={"center"}>
                        APR
                      </Box>
                      <Box display={"flex"} flex="1" alignItems={"center"}></Box>
                    </Row01>
                    <Row02 sx={{ borderTop: { xs: "none", sm: "none", md: "1px solid #0b2336" }, flexDirection: { xs: "column", sm: "column", md: "row" } }}>
                      <Box display={"flex"} flex="1.4" alignItems={"center"}>
                        <Box mr={"8px"} display={"flex"}>
                          <Box display={"flex"}>
                            <LogoRoundedIcon size="32px" color="black" />
                          </Box>
                        </Box>
                        TRVL
                      </Box>
                      <Box display={"flex"} flex="1" alignItems={"center"}>
                        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>TVL :&nbsp;</Box>
                        $ {(total_trvl_stake * price).toFixed(2)}
                      </Box>
                      <Box display={"flex"} flex="0.6" alignItems={"center"}>
                        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>APR :&nbsp;</Box>
                        {mc_apr !== "NaN" ? mc_apr : 100}<PercentageText>%</PercentageText>
                      </Box>
                      <Box display={"flex"} flex="1.4" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Box display={"1"} width={"30%"}>
                          <CustomButton str={""} width={"100%"} height={""} color={""} bgcolor={""} fsize={""} fweight={""} bradius={""}></CustomButton>
                        </Box>
                        <Box
                          display={"1"}
                          width={"30%"}
                          onClick={() => {
                            setDetailInfor("trvl");
                            // handleOpen1();
                            // set_flag_staking_modal(0);
                          }}
                        >
                          <CustomButton str={"Details"} width={"100%"} height={"56px"} color={"#0B2336"} bgcolor={""} fsize={"16px"} fweight={"400"} bradius={"100px"} border={"1px solid #0B2336"}></CustomButton>
                        </Box>
                        <Box
                          display={"1"}
                          width={"30%"}
                          onClick={() => {
                            handleOpen();
                            set_flag_staking_modal(0);
                          }}
                        >
                          <CustomButton str={"Stake"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"}></CustomButton>
                        </Box>
                      </Box>
                    </Row02>
                    {/* <Row03 sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}>
                      <Box fontSize={"22px"} display={"flex"} flex="1.4" alignItems={"center"}>
                        <Box mr={"8px"} display={"flex"}>
                          <Box display={"flex"}>
                            <LogoRoundedIcon size="32px" color="black" />
                          </Box>
                          <Box ml={"-8px"} display={"flex"} zIndex={"-1"}>
                            <EtherIcon size="32px" color="#627EEA" />
                          </Box>
                        </Box>
                        TRVL/ETH Uniswap LP
                      </Box>
                      <Box display={"flex"} flex="1" alignItems={"center"}>
                        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>TVL :&nbsp;</Box>${total_lp_stake * 1}
                      </Box>
                      <Box display={"flex"} flex="0.6" alignItems={"center"}>
                        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>APR :&nbsp;</Box>
                        {lp_apr !== "NaN" ? lp_apr : 100}%
                      </Box>
                      <Box display={"flex"} flex="1.4" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Box display={"1"} width={"30%"}>
                          <a target="_blank" rel="noopener noreferrer" href="https://v2.info.uniswap.org/pair/0xccb63225a7b19dcf66717e4d40c9a72b39331d61">
                            <CustomButton str={"Buy LP"} width={"100%"} height={"56px"} color={"#0B2336"} bgcolor={""} fsize={"16px"} fweight={"400"} bradius={"100px"} border={"1px solid #0B2336"}></CustomButton>
                          </a>
                        </Box>
                        <Box
                          display={"1"}
                          width={"30%"}
                          onClick={() => {
                            setDetailInfor("sdf");
                            // handleOpen1();
                            // set_flag_staking_modal(1);
                          }}
                        >
                          <CustomButton str={"Details"} width={"100%"} height={"56px"} color={"#0B2336"} bgcolor={""} fsize={"16px"} fweight={"400"} bradius={"100px"} border={"1px solid #0B2336"}></CustomButton>
                        </Box>
                        <Box
                          display={"1"}
                          width={"30%"}
                          onClick={() => {
                            handleOpen();
                            set_flag_staking_modal(1);
                          }}
                        >
                          <CustomButton str={"Stake"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"}></CustomButton>
                        </Box>
                      </Box>
                    </Row03> */}
                    {/* <Row02 sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}>
                      <Box display={"flex"} flex="1.4" alignItems={"center"}>
                        <Box mr={"8px"} display={"flex"} zIndex={"-1"}>
                          <LogoRoundedIcon size="32px" color="black" />
                        </Box>
                        Free TRVL
                      </Box>
                      <Box display={"flex"} flex="1" alignItems={"center"}>
                        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>TVL :&nbsp;</Box>
                        $ {(total_free_trvl_stake * price).toFixed(2)}
                      </Box>
                      <Box display={"flex"} flex="0.6" alignItems={"center"}>
                        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>APR :&nbsp;</Box>
                        {free_apr !== "NaN" ? free_apr : 100}<PercentageText>%</PercentageText>
                      </Box>
                      <Box display={"flex"} flex="1.4" alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Box display={"1"} width={"30%"}>
                          <CustomButton str={""} width={"100%"} height={""} color={""} bgcolor={""} fsize={""} fweight={""} bradius={""}></CustomButton>
                        </Box>
                        <Box
                          display={"1"}
                          width={"30%"}
                          onClick={() => {
                            setDetailInfor("free_trvl");
                            // handleOpen1();
                            // set_flag_staking_modal(2);
                          }}
                        >
                          <CustomButton str={"Details"} width={"100%"} height={"56px"} color={"#0B2336"} bgcolor={""} fsize={"16px"} fweight={"400"} bradius={"100px"} border={"1px solid #0B2336"}></CustomButton>
                        </Box>
                        <Box
                          display={"1"}
                          width={"30%"}
                          onClick={() => {
                            handleOpen();
                            set_flag_staking_modal(2);
                          }}
                        >
                          <CustomButton str={"Stake"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"}></CustomButton>
                        </Box>
                      </Box>
                    </Row02> */}
                  </PoolsPart01>
                </>
              </CenterSector02>
            </PoolsPart>
          ) : (
            <></>
          )}
          {active ? (
            <DepositsPart>
              <Box px={"40px"} borderLeft={"1px solid #0b2336"} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                <LeftSector01Text width={"128px"}>Deposits</LeftSector01Text>
              </Box>
              <CenterSector02>
                <>
                  <RewardText>
                    <LeftText01>Deposit History</LeftText01>
                    <LeftText03>All your deposits will be listed here for the TRVL pools you're entered into.</LeftText03>
                  </RewardText>
                  <PoolsPart01>
                    <Row01 sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
                      <Box display={"flex"} flex="1.4" alignItems={"center"}>
                        Pools
                      </Box>
                      <Box display={"flex"} flex="1.6" alignItems={"center"} justifyContent={""}>
                        Staked Amount
                      </Box>
                      <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={""} marginRight={"1%"}>
                        Lock Time
                      </Box>
                      <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={""} marginRight={"1%"}>
                        Unlock Time
                      </Box>
                      <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={""} marginRight={"1%"}>
                        Available For Claim
                      </Box>
                      <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={""}>
                        APR
                      </Box>
                      <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"flex-end"}></Box>
                    </Row01>
                    {trvl_pools &&
                      trvl_pools.map((pool, index) => {
                        return (
                          <Row02 key={index} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}>
                            <Box display={"flex"} flex="1.4" alignItems={"center"} justifyContent={"space-between"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Pool</Box>
                              <Box mr={"8px"}  display={"flex"} alignItems={"center"}>
                                <Box mr={"8px"}><LogoRoundedIcon size="24px" /></Box>
                                <Box>TRVL</Box>
                              </Box>
                            </Box>
                            <Box display={"flex"} flex="1.6" alignItems={"center"} justifyContent={"space-between"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Staked Amount</Box>
                              {(parseInt(pool.amount._hex) / Math.pow(10, 18)).toFixed(2)} TRVL<br/>
                              ($ {(parseInt(pool.amount._hex) / Math.pow(10, 18) * price).toFixed(2)})
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={"space-between"} marginRight={"1%"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Lock Time</Box>
                              {new Date(parseInt(pool.start._hex) * 1000).toLocaleDateString("en-US")} <br/> {new Date(parseInt(pool.start._hex) * 1000).toLocaleTimeString("en-US")}
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={"space-between"} marginRight={"1%"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Unlock Time</Box>
                              {new Date(parseInt(pool.end._hex) * 1000).toLocaleDateString("en-US")} <br/> {new Date(parseInt(pool.end._hex) * 1000).toLocaleTimeString("en-US")}
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={"space-between"} marginRight={"1%"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Avaliable For Claim</Box>
                              {new Date(parseInt(pool.end._hex) * 1000).toLocaleDateString("en-US")} <br/> {new Date(parseInt(pool.end._hex) * 1000).toLocaleTimeString("en-US")}
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"space-between"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>APR</Box>
                              <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={""}>
                              {mc_apr}<PercentageText>%</PercentageText></Box>
                            </Box>
                            <Box display={"flex"} flex="1" alignItems={"center"} width={"100%"} justifyContent={"flex-end"}>
                              {Date.now() > parseInt(pool.end._hex) * 1000 ? (
                                <>
                                  <Box
                                    display={"1"}
                                    width={"100%"}
                                    onClick={() => {
                                      unstake(index);
                                    }}
                                  >
                                    <CustomButton str={"Unlock"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"}></CustomButton>
                                  </Box>
                                </>
                              ) : (
                                <></>
                              )}
                            </Box>
                          </Row02>
                        );
                      })}
                    {trvllp_pools &&
                      trvllp_pools.map((pool, index) => {
                        return (
                          <Row02 key={index}>
                            <Box display={"flex"} flex="0.8" alignItems={"center"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Pool</Box>
                              <Box mr={"8px"}  display={"flex"} alignItems={"center"}>
                                <LogoRoundedIcon size="24px" />
                                TRVL/LP
                              </Box>
                            </Box>
                            <Box display={"flex"} flex="1.5" alignItems={"center"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Staked Amount</Box>
                              {(parseInt(pool.amount._hex) / Math.pow(10, 18)).toFixed(2)} TRVL<br/>
                              ($ {(parseInt(pool.amount._hex) / Math.pow(10, 18) * price).toFixed(2)})
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} marginRight={"1%"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Lock Time</Box>
                              {new Date(parseInt(pool.start._hex) * 1000).toLocaleDateString("en-US") + " " + new Date(parseInt(pool.start._hex) * 1000).toLocaleTimeString("en-US")}
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} marginRight={"1%"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Unlock Time</Box>
                              {new Date(parseInt(pool.end._hex) * 1000).toLocaleDateString("en-US") + " " + new Date(parseInt(pool.end._hex) * 1000).toLocaleTimeString("en-US")}
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} marginRight={"1%"}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>Avaliable For Claim</Box>
                              {new Date(parseInt(pool.end._hex) * 1000).toLocaleDateString("en-US") + " " + new Date(parseInt(pool.end._hex) * 1000).toLocaleTimeString("en-US")}
                            </Box>
                            <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={""}>
                              <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>APR</Box>
                              <Box display={"flex"}>
                                {lp_apr}<PercentageText>%</PercentageText></Box>
                            </Box>
                            {/* <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={"flex-end"} width={"100%"}>
                              {Date.now() > parseInt(pool.end._hex) * 1000 ? (
                                <>
                                  <Box
                                    display={"1"}
                                    width={"100%"}
                                    onClick={() => {
                                      unstake_lp(index);
                                    }}
                                  >
                                    <CustomButton str={"Unlock"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"}></CustomButton>
                                  </Box>
                                </>
                              ) : (
                                <></>
                              )}
                            </Box> */}
                          </Row02>
                        );
                      })}
                    {/* {user_free_trvl_stake === 0 ? (
                      <></>
                    ) : (
                      <Row02>
                        <Box display={"flex"} flex="1.4" alignItems={"center"}>
                          <Box mr={"8px"}  display={"flex"} alignItems={"center"}>
                            <Box mr={"8px"}><LogoRoundedIcon size="24px" /></Box>
                            <Box>Free TRVL</Box>
                          </Box>
                        </Box>
                        <Box display={"flex"} flex="1.6" alignItems={"center"} justifyContent={""}>
                          {user_free_trvl_stake} TRVL<br/>
                          ($ {(user_free_trvl_stake * price).toFixed(2)})
                        </Box>
                        <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={""} marginRight={"1%"}>
                          No Lock Time
                        </Box>
                        <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={""} marginRight={"1%"}>
                          {new Date().toLocaleDateString("en-US")} <br/> {new Date().toLocaleTimeString("en-US")}
                        </Box>
                        <Box display={"flex"} flex="1.2" alignItems={"center"} justifyContent={""} marginRight={"1%"}>
                          {new Date().toLocaleDateString("en-US")} <br/> {new Date().toLocaleTimeString("en-US")}
                        </Box>
                        <Box display={"flex"} flex="1" alignItems={"center"} justifyContent={""}>
                          <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>APR</Box>
                          <Box display={"flex"}>
                            {free_apr}<PercentageText>%</PercentageText></Box>
                        </Box>
                        <Box display={"flex"} flex="1" alignItems={"center"} justifyContent="flex-end" width={"100%"}>
                          <Box
                            display={"1"}
                            width={"100%"}
                            onClick={() => {
                              handleOpen2();
                            }}
                          >
                            <CustomButton str={"Unlock"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"}></CustomButton>
                          </Box>
                        </Box>
                      </Row02>
                    )} */}
                    <Row03></Row03>
                  </PoolsPart01>
                </>
              </CenterSector02>
            </DepositsPart>
          ) : (
            <></>
          )}
        </>
      ) : (
        detailInfor == "trvl" ?
        <>
          <RewardsPart>
            <Box px={"40px"} borderLeft={"1px solid #0b2336"} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <LeftSector01Text width={"128px"}>TRVL</LeftSector01Text>
            </Box>
            <Box flex={4} display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
              <Box fontFamily={"Reckless Neue"} sx={{ fontSize: { xs: "56px", sm: "60px", md: "64px" } }}>
                Details
              </Box>
              <Box mt={"40px"} lineHeight={"36px"}>
                Stake your TRVL in our TRVL pool. You decide the locking duration and rewards are unlocked accordingly.
              </Box>
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>TRVL Contract:</Box>
                  <Box>{SMC_Contract.address.toString()}</Box>
                </Box>
              </Box>
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Total value locked:</Box>
                  <Box>${(total_trvl_stake * price).toFixed(2)}</Box>
                </Box>
              </Box>
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Pending rewards:</Box>
                  <Box>{total_trvl_reward} TRVL</Box>
                </Box>
              </Box>
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Pool APR:</Box>
                  <Box>{mc_apr}%</Box>
                </Box>
              </Box>
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Weight:</Box>
                  <Box>80.0%</Box>
                </Box>
              </Box>
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>My liquidity:</Box>
                  <Box>{user_total_trvl_stake} TRVL</Box>
                </Box>
              </Box>
              <Box width={"100%"} maxWidth={"416px"} display={"flex"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <CustomButton
                  str={"Go back"}
                  width={"100%"}
                  height={"56px"}
                  color={"#0B2336"}
                  bgcolor={""}
                  fsize={"16px"}
                  fweight={"400"}
                  bradius={"100px"}
                  border={"1px solid #0B2336"}
                  onClick={() => {
                    setDetailInfor(null);
                  }}
                />
                <CustomButton str={"Stake"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"} />
              </Box>
            </Box>
            <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" } }}></Box>
          </RewardsPart>
        </>
        :
        <>
          <RewardsPart>
            <Box px={"40px"} borderLeft={"1px solid #0b2336"} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <LeftSector01Text width={"128px"}>FREE TRVL</LeftSector01Text>
            </Box>
            <Box flex={4} display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
              <Box fontFamily={"Reckless Neue"} sx={{ fontSize: { xs: "56px", sm: "60px", md: "64px" } }}>
                Details
              </Box>
              <Box mt={"40px"} lineHeight={"36px"}>
                Stake your TRVL in our TRVL pool. You decide the locking duration and rewards are unlocked accordingly.
              </Box>
              {/* <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>TRVL Contract:</Box>
                  <Box>{FREE_TRVL_CONTRACT.address.toString()}</Box>
                </Box>
              </Box> */}
              {/* <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Total value locked:</Box>
                  <Box>${(total_free_trvl_stake * price).toFixed(2)}</Box>
                </Box>
              </Box> */}
              {/* <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Pending rewards:</Box>
                  <Box>{total_free_trvl_reward} TRVL</Box>
                </Box>
              </Box> */}
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Pool APR:</Box>
                  <Box>{free_apr}%</Box>
                </Box>
              </Box>
              <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>Weight:</Box>
                  <Box>20.0%</Box>
                </Box>
              </Box>
              {/* <Box fontSize={"22px"} display={"flex"} flexDirection={"column"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, gridGap: { xs: "4px", sm: "8px", md: "16px" } }} style={{ wordBreak: "break-word" }}>
                  <Box fontWeight={"bold"}>My liquidity:</Box>
                  <Box>{user_free_trvl_stake} TRVL</Box>
                </Box>
              </Box> */}
              <Box width={"100%"} maxWidth={"416px"} display={"flex"} gridGap={"16px"} sx={{ mt: { xs: "16px", sm: "24px", md: "32px" } }}>
                <CustomButton
                  str={"Go back"}
                  width={"100%"}
                  height={"56px"}
                  color={"#0B2336"}
                  bgcolor={""}
                  fsize={"16px"}
                  fweight={"400"}
                  bradius={"100px"}
                  border={"1px solid #0B2336"}
                  onClick={() => {
                    setDetailInfor(null);
                  }}
                />
                <CustomButton str={"Stake"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"} />
              </Box>
            </Box>
            <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" } }}></Box>
          </RewardsPart>        
        </>
      )}
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <ModalBox>
          <CancelBox01
            onClick={() => {
              handleClose();
              set_spin_load(false);
              set_locked(false);
              set_amount(0);
              set_duration(0);
            }}
          >
            <GiCancel></GiCancel>
          </CancelBox01>
          <TitleText01>
            <LogoRoundedIcon size="32px" />
            {"\u00a0"}
            {"\u00a0"}
            {flag_flag_staking_modal === 0 ? "TRVL Staking" : flag_flag_staking_modal === 1 ? "TRVL/ETH Uniswap LP Staking" : "Free TRVL Staking"}
          </TitleText01>
          {flag_flag_staking_modal === 2 ? (
            <></>
          ) : (
            <SelectDuration>
              <FlexibleBox
                onClick={() => {
                  if (flag_spin_load === true) {
                    NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                    return;
                  }
                  set_locked(false);
                }}
                locked={locked ? 1 : 0}
              >
                Flexible
              </FlexibleBox>
              <LockedBox
                onClick={() => {
                  if (flag_spin_load === true) {
                    NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                    return;
                  }
                  set_locked(true);
                }}
                locked={locked ? 1 : 0}
              >
                Locked
              </LockedBox>
            </SelectDuration>
          )}

          <SmText04>Amount</SmText04>
          <Box display={"flex"} alignItems={"center"} borderBottom={"1px solid #0b2336"}>
            <InputAmount
              flexGrow={1}
              width={"100%"}
              component={"input"}
              value={amount}
              type={"number"}
              onChange={(e) => {
                if (flag_spin_load === true) {
                  NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                  return;
                }
                set_amount(e.target.value);
              }}
            />
            <MaxBox01 onClick={() => {set_amount(balance)}}>max</MaxBox01>
          </Box>
          {locked ? (
            <>
              <SmText04>Duration (weeks)</SmText04>
              <Box display={"flex"} alignItems={"center"} borderBottom={"1px solid #0b2336"}>
                <InputAmount
                  flexGrow={1}
                  width={"100%"}
                  component={"input"}
                  value={duration}
                  type={"number"}
                  onChange={(e) => {
                    if (flag_spin_load === true) {
                      NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                      return;
                    }
                    set_duration(e.target.value);
                  }}
                />
                <MaxBox01 onClick={() => {set_amount(balance)}}>max</MaxBox01>
              </Box>
              <Box mt={"8px"} display={"flex"} fontFamily={"Radio Grotesk"} color={"#0B2336"}>
                <Box>APR Based:</Box>
                <Box display={"flex"}>{mc_apr}<PercentageText>%</PercentageText></Box>
              </Box>
              {/* <Box display={"flex"} width={"100%"}>
                <Box display={"flex"} flex="1" width={"100%"}>
                  <SmText04>Lock for : ({duration} weeks)</SmText04>
                </Box>
                <Box display={"flex"} flex="1" width={"100%"}>
                  <SmText04 justifyContent={"flex-end"}>Weight : ({(1 + duration / 52).toFixed(2)})</SmText04>
                </Box>
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
              /> */}
              {/* <InputAmount component={"input"} value={duration} type={'number'} onChange={(e) => {
                            set_duration(e.target.value);
                        }}></InputAmount> */}
            </>
          ) : (
            <>
              <Box mt={"8px"} display={"flex"} fontFamily={"Radio Grotesk"} color={"#0B2336"}>
                <Box>Balance:</Box>
                <Box>{balance} TRVL</Box>
              </Box>
              <Box mt={"8px"} display={"flex"} fontFamily={"Radio Grotesk"} color={"#0B2336"}>
                <Box>Est APR:</Box>
                <Box display={"flex"}>{free_apr}<PercentageText>%</PercentageText></Box>
              </Box>
            </>
          )}

          <Box
          display={"flex"}
          justifyContent={"flex-end"}
          gridGap={"16px"}
          width={"100%"}
          marginTop={"32px"}
          position={"relative"}>
            <Box>
              <CustomButton
                str={"Cancel"}
                width={"150px"}
                height={"56px"}
                color={"#0B2336"}
                bgcolor={"#D4EEE9"}
                border={"1px solid #0B2336"}
                fsize={"16px"}
                fweight={"600"}
                bradius={"100px"}
                onClick={() => {
                  handleClose();
                  set_spin_load(false);
                  set_locked(false);
                  set_amount(0);
                  set_duration(0);
                }}
              />
            </Box>
            <Box
              onClick={() => {
                if (flag_flag_staking_modal === 0) {
                  if (flag_spin_load === true) {
                    NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                    return;
                  }
                  if (amount <= 0)
                  {
                    NotificationManager.error("Staking amount should bigger than 0.", "Hi.", 2000);
                    return;
                  }
                  stake();
                } 
                // else if (flag_flag_staking_modal === 1) {
                //   if (flag_spin_load === true) {
                //     NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                //     return;
                //   }
                //   stake_lp();
                // } 
                // else if (flag_flag_staking_modal === 2) {
                //   if (flag_spin_load === true) {
                //     NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                //     return;
                //   }
                //   stake_free();
                // }
              }}
            >
              {flag_spin_load ? (
                flag_flag_staking_modal === 2?(
                  <Box display={"flex"} position={"absolute"} left={"50%"} justifyContent={"center"} alignItems={"center"} top="-200%">
                  <TailSpin color="#05070c" height={35} width={35} />
                  </Box>
                ) : (
                  <Box display={"flex"} position={"absolute"} left={"50%"} justifyContent={"center"} alignItems={"center"} top="-300%">
                    <TailSpin color="#05070c" height={35} width={35} />
                  </Box>
                )
              ) : (
                <></>
              )}
              <CustomButton str={"Stake"} width={"150px"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"600"} bradius={"100px"} />
            </Box>
          </Box>
        </ModalBox>
      </Modal>
      <Modal open={open1} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <ModalBox>
          <CancelBox01
            onClick={() => {
              handleClose1();
              set_spin_load(false);
            }}
          >
            <GiCancel></GiCancel>
          </CancelBox01>
          <TitleText01>
            <img src={Mark01} width={"30px"} height={"30px"} alt=""></img>
            {"\u00a0"}
            {"\u00a0"}
            {flag_flag_staking_modal === 0 ? "TRVL" : flag_flag_staking_modal === 1 ? "TRVL/ETH Uniswap LP" : "Free TRVL"}
          </TitleText01>
          <TitleText01 marginTop={"8%"}>Details</TitleText01>
          <TitleText02 marginTop={"5%"}>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>
              TVL
            </Box>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>
              $
            </Box>
          </TitleText02>
          <TitleText02 marginTop={"3%"}>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>
              Weight
            </Box>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>
              20%
            </Box>
          </TitleText02>
          <TitleText02 marginTop={"3%"}>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>
              Pending rewards
            </Box>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>
              0.00 MC
            </Box>
          </TitleText02>
          <TitleText02 marginTop={"3%"}>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>
              Pool APR
            </Box>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>
              %
            </Box>
          </TitleText02>
          <TitleText02 marginTop={"3%"}>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-start"}>
              My liquidity
            </Box>
            <Box display={"flex"} flex={"1"} justifyContent={"flex-end"}>
              0.00 MC
            </Box>
          </TitleText02>
          <Box
            display={"flex"}
            width={"100%"}
            marginTop={"5%"}
            position={"relative"}
            onClick={() => {
              if (flag_flag_staking_modal === false) {
                // stake();
              } else {
                // stake_lp();
              }
            }}
          >
            {flag_spin_load ? (
              <Box display={"flex"} position={"absolute"} left={"50%"} justifyContent={"center"} alignItems={"center"} top="-100%">
                <TailSpin color="#05070c" height={35} width={35} />
              </Box>
            ) : (
              <></>
            )}
            <CustomButton str={"Stake"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"600"} bradius={"100px"} />
          </Box>
        </ModalBox>
      </Modal>
      {/* <Modal open={open2} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <ModalBox>
          <CancelBox01
            onClick={() => {
              handleClose2();
              set_spin_load_free(false);
              set_amount_free(0);
            }}
          >
            <GiCancel></GiCancel>
          </CancelBox01>
          <TitleText01>
          <LogoRoundedIcon size="32px" />
            {"\u00a0"}
            {"\u00a0"}Free TRVL
          </TitleText01>
          <SmText04>Amount</SmText04>
          <Box display={"flex"} alignItems={"center"} borderBottom={"1px solid #0b2336"}>
            <InputAmount
              component={"input"}
              width={"100%"}
              value={amount_free}
              type={"number"}
              onChange={(e) => {
                if (flag_spin_load_free === true) {
                  NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                  return;
                }
                set_amount_free(e.target.value);
              }}
            />
            <MaxBox01 onClick={() => {set_amount_free(user_free_trvl_stake)}}>max</MaxBox01>
          </Box>
          <Box
            display={"flex"}
            width={"100%"}
            marginTop={"5%"}
            position={"relative"}
            onClick={() => {
              if (flag_spin_load_free === true) {
                NotificationManager.error("Please wait while processing.", "Hi.", 2000);
                return;
              }
              unstake_free();
            }}
          >
            {flag_spin_load_free ? (
              <Box display={"flex"} position={"absolute"} left={"50%"} justifyContent={"center"} alignItems={"center"} top="-150%">
                <TailSpin color="#05070c" height={35} width={35} />
              </Box>
            ) : (
              <></>
            )}
            <CustomButton str={"Unstake"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"400"} bradius={"100px"} />
          </Box>
        </ModalBox>
      </Modal> */}
      <NotificationContainer />
    </StyledComponent>
  );
};

const RewardsPart = styled(Box)`
  display: flex;
  width: 100%;
`;
const PoolsPart = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 10%;
`;
const LeftText03 = styled(Box)`
  margin-top: 40px;
  font-family: "Reckless Neue";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 36px;
  /* or 164% */
  color: #0b2336;
`;

const DepositsPart = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 10%;
`;

const CancelBox01 = styled(Box)`
  display: flex;
  position: absolute;
  right: 5%;
  top: 5%;
  font-size: 30px;
  color: #0b2336;
  opacity: 0.4;
  transition: 0.1s;
  &:hover {
    cursor: pointer;
    transition: 0.3s;
    color: #0b2336;
    opacity: 1;
  }
`;

const MaxBox01 = styled(Box)`
  display: flex;
  font-size: 18px;
  color: #0b2336;
  transition: 0.1s;
  &:hover {
    cursor: pointer;
    transition: 0.3s;
    color: #0b2336;
    opacity: 1;
  }
`;

const FlexibleBox = styled(Box)`
  display: flex;
  flex: 1;
  border-bottom: 1px solid #0b2336;
  opacity: ${({ locked }) => (locked ? 0.4 : 1)};
  border-bottom: ${({ locked }) => (locked ? "1px solid #0B2336" : "2px solid #0B2336")};
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0b2336;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  &:hover {
    cursor: pointer;
    opacity: 1;
    border-bottom: 2px solid #0b2336;
  }
`;

const LockedBox = styled(Box)`
  display: flex;
  flex: 1;
  opacity: ${({ locked }) => (locked ? 1 : 0.4)};
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0b2336;
  border-bottom: ${({ locked }) => (locked ? "2px solid #0B2336" : "1px solid #0B2336")};
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  &:hover {
    cursor: pointer;
    border-bottom: 2px solid #0b2336;
    opacity: 1;
  }
`;

const SelectDuration = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 40px;
  height: 50px;
  /* border-radius: 50px; */
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  /* border: 2px solid rgb(133, 133, 133); */
`;

const InputAmount = styled(Box)`
  display: flex;
  margin-top: 2%;
  height: 40px;
  outline: none;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #0b2336;
  border: none;
  background: none;
`;

const SmText04 = styled(Box)`
  display: flex;
  width: 100%;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0b2336;
  margin-top: 32px;
`;

const TitleText01 = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 28px;
  color: #0b2336;
`;

const TitleText02 = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  letter-spacing: -0.01em;
  font-weight: 400;
  font-size: 18px;
  line-height: 100%;
  color: #05070c;
`;

const ModalBox = styled(Box)`
  display: flex;
  width: calc(100vw - 32px);
  max-width: 480px;
  box-sizing: border-box;
  flex-direction: column;
  background-color: #d4eee9;
  border: none;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(100px) !important;
  border-radius: 24px !important;
  padding: 24px;
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
`;

const PoolsPart01 = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 40px;
  align-items: center;
`;
const Row01 = styled(Box)`
  flex: 1;
  width: 100%;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height, or 125% */
  letter-spacing: 0.1em;
  text-transform: uppercase;
  /* Main/Text */
  color: #0b2336;
`;

const Row02 = styled(Box)`
  display: flex;
  grid-gap: 16px;
  flex: 1;
  margin-top: 24px;
  width: 100%;
  padding-top: 24px;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #0b2336;
`;
Row02.defaultProps = {
  borderTop: "1px solid #0b2336",
};

const Row03 = styled(Box)`
  display: flex;
  grid-gap: 16px;
  flex: 1;
  margin-top: 24px;
  width: 100%;
  border-top: 1px solid #0b2336;
  padding-top: 24px;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #0b2336;
  /* margin-bottom: 5%; */
`;

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  margin-bottom: 5%;
  flex-direction: column;
`;

const RewardText = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const PercentageText = styled(Box)`
  font-family: "Reckless Neue";
  font-style: normal;
`

const LeftText01 = styled(Box)`
  display: flex;
  flex: 1;
  font-family: "Reckless Neue";
  font-style: normal;
  font-weight: 300;
  line-height: 68px;
  letter-spacing: -0.015em;
  color: #0b2336;
`;
LeftText01.defaultProps = {
  sx: {
    fontSize: ["56px", "60px", "64px"],
  },
};
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
  margin-top: 40px;
  grid-gap: 24px;
`;
const CenterPart01 = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 24px;
  grid-gap: 24px;
`;

const DownPart = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  background: #a32a2f;
  backdrop-filter: blur(100px);
  border-radius: 30px;
  transition: 0.3s;
  height: 200px;
  margin-bottom: 5%;
  &:hover {
    box-shadow: 0 29px 32px rgb(201 155 159 / 100%);
  }
`;

const Left01 = styled(Box)`
  display: flex;
  flex: 1;
  padding: 24px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: #0b2336;
  backdrop-filter: blur(100px);
  border-radius: 24px;
  transition: 0.3s;
  height: 290px;
  &:hover {
    box-shadow: 0 15px 15px rgb(0 0 0 / 30%);
  }
`;

const Center01 = styled(Box)`
  display: flex;
  width: 48%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #a32a2f;
  backdrop-filter: blur(100px);
  border-radius: 30px;
  transition: 0.3s;
  height: 414px;
  &:hover {
    box-shadow: 0 29px 32px rgb(201 155 159 / 100%);
  }
`;

const Right01 = styled(Box)`
  display: flex;
  flex: 1;
`;
const Part01 = styled(Box)`
  display: flex;
  background: #0b2336;
  backdrop-filter: blur(100px);
  border-radius: 24px;
  transition: 0.3s;
  padding: 24px 0px;
  &:hover {
    box-shadow: 0 15px 15px rgb(0 0 0 / 30%);
  }
`;

const SmText01 = styled(Box)`
  display: flex;
  width: 100%;
  padding-bottom: 16px;
  align-items: center;
  justify-content: flex-start;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height, or 125% */
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d4eee9;
  border-bottom: 1px solid #d4eee9;
`;

const BgText01 = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  font-family: "Reckless Neue";
  font-style: normal;
  font-weight: 300;
  font-size: 40px;
  line-height: 60px;
  /* identical to box height, or 150% */
  letter-spacing: -0.015em;
  color: #d4eee9;
`;
const Bgtext02 = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Reckless Neue";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 36px;
  /* identical to box height, or 164% */
  color: #d4eee9;
`;
const SmText03 = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 28px;
  /* identical to box height, or 127% */
  color: #d4eee9;
`;
const SmText05 = styled(Box)`
  display: flex;
  width: 100%;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 28px;
  /* identical to box height, or 127% */
  color: #d4eee9;
`;
// const GraphBox = styled(Box)`
//     display: flex;
//     flex: 2;

// `

const GraphInfoBox = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.01em;
  color: white;
`;

const ConnectWalletBtn01 = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 56px; */
  background: linear-gradient(0deg, #d4eee9, #d4eee9), #edf9cc;
  border-radius: 100px;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #0b2336;
  border: none;
  padding: 16px 24px;
  cursor: pointer;
  max-width: 240px;
  text-align: center;
  transition: 0.3s;
  white-space: nowrap;
  &:hover {
    cursor: pointer;
    box-shadow: 0 5px 5px rgb(255 255 255 / 30%);
    transition: 0.2s;
  }
`;
const SmText02 = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 24px;
  font-family: "Inter", sans-serif;
  font-style: normal;
  text-align: center;
  letter-spacing: -0.01em;
  color: #d4eee9;
`;

const LeftText02 = styled(Box)`
  display: flex;
  margin-top: 40px;
  font-family: "Reckless Neue";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 36px;
  color: #0b2336;
`;

const LeftSector01 = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  border-left: 1px solid #0b2336;
`;

const LeftSector01Text = styled(Box)`
  display: flex;
  margin-top: 15%;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height, or 125% */

  letter-spacing: 0.1em;
  text-transform: uppercase;

  color: #0b2336;
`;

const CenterSector01 = styled(Box)`
  display: flex;
  max-width: 100%;
  flex: 4;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CenterSector02 = styled(Box)`
  display: flex;
  max-width: 100%;
  flex: 5;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const RightSector01 = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;
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
