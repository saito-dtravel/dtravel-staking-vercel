import React, { useState, useEffect, useMemo } from "react";
import { Box, Modal, Tab } from "@material-ui/core";
import { TailSpin } from "react-loader-spinner";
import styled from "styled-components";
import Mark01 from "../../assets/dtravle_mark01.png";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { CONTRACTS } from "../../utils/constants";
import { MC_ABI, SMC_ABI, LP_MC_ABI, LP_SMC_ABI, FREE_TRVL_ABI, EMC_ABI } from "../../utils/abi";
import CustomButton from "../elements/buttons";
import { useGetPrice } from "../hooks/price";
import { GiCancel } from "react-icons/gi";
import { chainId } from "../../utils/connectors";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { EtherIcon, LogoRoundedIcon } from "../elements/icons";

const Reward = ({active}) => {
  const { account, library } = useWeb3React();
  const [total_stake, set_total_stake] = useState(0);
  const [user_total_stake, set_user_total_stake] = useState(0);
  const [mc_apr, set_mc_apr] = useState(0);
  // const [lp_token_flag, set_lp_token_flag] = useState(false);
  // const [total_lp_stake, set_total_lp_stake] = useState(0);
  const [flag_account, set_flag_account] = useState(false);
  const [rewards, set_rewards] = useState(0);
  const [escrows, set_escrows] = useState(null);
  const [escrows_count, set_escrows_count] = useState(0);
  const [current_tab, set_current_tab] = useState(0);
  // const [lp_rewards, set_lp_rewards] = useState(0);
  // const [claim_rewards, set_claim_rewards] = useState(0);
  // const [free_rewards, set_free_rewards] = useState(0);
  // const [free_trvl_staked_value, set_free_trvl_staked_value] = useState(0);
  const MC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.MC_TOKEN, MC_ABI, library.getSigner()) : null), [library]);
  const SMC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_TOKEN, SMC_ABI, library.getSigner()) : null), [library]);
  const EMC_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.EMC_TOKEN, EMC_ABI, library.getSigner()): null), [library]);
  // const LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.LP_TOKEN, LP_MC_ABI, library.getSigner()) : null), [library]);
  // const SMC_LP_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.SMC_LP_Token, LP_SMC_ABI, library.getSigner()) : null), [library]);
  // const FREE_TRVL_CONTRACT = useMemo(() => (library ? new ethers.Contract(CONTRACTS.FREE_TRVL, FREE_TRVL_ABI, library.getSigner()) : null), [library]);
  const price = useGetPrice();
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const TRANSACTION_SCAN_URL = "https://testnet.bscscan.com/tx/";

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerComponents, setTimerComponent] = useState();

  useEffect(() => {
    console.log("active",  active);
    if (active === false) {
      set_flag_account(false);
      set_user_total_stake(0);
      set_rewards(0);
    } else {
      console.log("window", window.ethereum);
      if(window.ethereum)
      {
        console.log("networkVersion1", window.ethereum.networkVersion);
        if(window.ethereum.networkVersion == chainId)
        {
          set_flag_account(true);
          get_total_stake();
          // get_total_lp_stake();
          get_mc_apr();
          get_rewards();
          get_escrow();
          get_pools();
          get_claimRewads();
          // get_free_trvl_staked_value();
        }
      }
    }
  }, [active, library]);

  useEffect(() =>{
    const timer = setTimeout(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const calculateTimeLeft = () => {
    var date = new Date();
    var dateNow = new Date(date.toUTCString('en-US', {
      timeZone: 'GMT'
    }));
    // add a day
    var dateOneDayAfter = new Date();
    dateOneDayAfter.setDate(dateNow.getDate() + 1);
    
    let difference = (dateOneDayAfter % ONE_DAY) * ONE_DAY - dateNow;
    setTimeLeft(difference);
    if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds =  Math.floor((difference / 1000) % 60);

        let component = hours + " Hours " + minutes + " Minutes " + seconds + "Seconds";
        setTimerComponent(component);
    }
  }

  const get_mc_apr = async () => {
    try {
      let locked1 = await SMC_Contract.getTotalDeposit(account);
      let total = await SMC_Contract.balanceOf(account);
      let apr = ((total / locked1) * 100).toFixed(2);
      set_mc_apr(apr);
    } catch (err) {
      console.log(err);
    }
  };

  const get_rewards = async () => {
    try {
      let t_rewards = await SMC_Contract.withdrawableRewardsOf(account);
      // let t_lp_rewards = await SMC_LP_Contract.withdrawableRewardsOf(account);
      // let free_rewards = await FREE_TRVL_CONTRACT.earned(account);
      set_rewards((parseInt(t_rewards._hex) / Math.pow(10, 18)).toFixed(2));
      // set_lp_rewards((parseInt(t_lp_rewards._hex) / Math.pow(10, 18)).toFixed(2));
      // set_free_rewards((parseInt(free_rewards) / Math.pow(10, 18)).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  const get_escrow = async () => {
    try{
      console.log("escrow", EMC_Contract);
      let _escrows = await EMC_Contract.getDepositsOf(account);
      // const trvllp_pools = await SMC_LP_Contract.getDepositsOf(account);
      console.log("_escrows", _escrows.length);
      set_escrows(_escrows);
      set_escrows_count(_escrows.length);

    } catch(err) {
      console.log(err);
    }
    
  }

  const get_total_stake = async () => {
    try {
      let t_value = await MC_Contract.balanceOf(CONTRACTS.SMC_TOKEN);
      let user_t_value = await SMC_Contract.getTotalDeposit(account);
      set_total_stake((parseInt(t_value._hex) / Math.pow(10, 18)).toFixed(2));
      set_user_total_stake((parseInt(user_t_value._hex) / Math.pow(10, 18)).toFixed(2));
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

  const claim = async () => {
    try {
      let t_claim = await SMC_Contract.claimRewards(account);
      let t_claim_mc = await t_claim.wait();
      get_total_stake();
      get_claimRewads();
      get_rewards();
      console.log(t_claim_mc);
      NotificationManager.success("Claim successfully. See your result : " + t_claim_mc.blockHash.toString().slice(0, 10) + "..." + t_claim_mc.blockHash.toString().slice(-4),
      "Hi.", 6000, () => {window.open(TRANSACTION_SCAN_URL + t_claim_mc.blockHash)});
    } catch (err) {
      console.log(err);
    }
  };

  const unlock = async () => {

  }

  // const claimLP = async () => {
  //   try {
  //     let t_claim = await SMC_LP_Contract.claimRewards(account);
  //     await t_claim.wait();
  //     NotificationManager.success("Successed. See your results.", "Hi.", 3000);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const claim_free = async () => {
  //   try {
  //     let t_claim = await FREE_TRVL_CONTRACT.getReward();
  //     await t_claim.wait();
  //     NotificationManager.success("Successed. See your results.", "Hi.", 3000);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const get_claimRewads = async () => {
    try {
      // let claim_rewards = await SMC_LP_Contract.totalClaimReward();
      // set_claim_rewards(claim_rewards);
    } catch (err) {
      console.log(err);
    }
  };

  const get_pools = async () => {
    try{
      const mc_pools = await SMC_Contract.getDepositsOf(account);
      console.log("mc_pools", mc_pools);
    }
    catch(err){
      console.log(err);
    }
  };

  // const get_free_trvl_staked_value = async () => {
  //   try {
  //     let t_value = await FREE_TRVL_CONTRACT.balanceOf(account);
  //     set_free_trvl_staked_value((parseInt(t_value._hex) / Math.pow(10, 18).toFixed(2)));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <StyledComponent>
      <RewardsPart>
        <Box px={"40px"} borderLeft={"1px solid #0b2336"} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
          <LeftSector01Text width={"128px"}>REWARDS</LeftSector01Text>
        </Box>
        <CenterSector01>
          <RewardText>
            <Box fontFamily={"Reckless Neue"} sx={{ fontSize: { xs: "56px", sm: "60px", md: "64px" } }}>
              Rewards Details
            </Box>
            <Box display={"flex"} marginTop={"20px"}>
              {current_tab === 0 ? 
                (<ActivedTabButton onClick={() => {set_current_tab(0)}}>LOCKED REWARDS</ActivedTabButton>) : 
                (<TabButton onClick={() => {set_current_tab(0)}}>LOCKED REWARDS</TabButton>)}
              {current_tab === 1 ?
                (<ActivedTabButton onClick={() => {set_current_tab(1)}}>UNLOCKED REWARD</ActivedTabButton>) :
                (<TabButton onClick={() => {set_current_tab(1)}}>UNLOCKED REWARD</TabButton>)}
            </Box>
            
            <RightText01 display={"flex"} marginTop={"40px"}>
              The claimable staking rewards can be claimed at any time you want.
            </RightText01>
            <RightText01 display={"flex"} marginTop={"40px"} sx={{ flexDirection: ["column", "column", "row"] }}>
              <Box display={"inline"} fontWeight={"bold"}>
                Next rewards released in:&nbsp;
              </Box>
              {timerComponents}
            </RightText01>
          </RewardText>
          {current_tab === 0 ? (
            <PoolsPart>
              <Row01 gridRowGap={"16px"} sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
                <Box display={"flex"} flex="1.4" alignItems={"center"}>
                  Care Pools
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  Amount Staked
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  Claimable Rewards
                </Box>
                <Box display={"flex"} flex="0.5" alignItems={"center"}></Box>
              </Row01>
              <Row02 gridRowGap={"16px"} sx={{ flexDirection: ["column", "column", "row"], borderTop: ["none", "none", "1px solid #0b2336"] }}>
                <Box display={"flex"} flex="1.4" alignItems={"center"}>
                  <Box mr={"8px"} display={"flex"}>
                    <Box display={"flex"}>
                      <LogoRoundedIcon size="32px" color="black" />
                    </Box>
                  </Box>
                  TRVL
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  {user_total_stake} TRVL <br/>
                  {user_total_stake > 0 && <>($ {(user_total_stake * price).toFixed(2)})</>}
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  {rewards} TRVL
                  {rewards > 0 && <>($ {(rewards * price).toFixed(2)})</>}
                </Box>
                {rewards > 0 &&
                  <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>
                    <Box
                      display={"1"}
                      width={"100%"}
                      minWidth={"85px"}
                      onClick={() => {
                        claim();
                      }}
                    >
                      {active && <CustomButton str={"Claim"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"600"} bradius={"100px"} />}
                    </Box>
                  </Box>}
              </Row02>
              {/* <Row03 gridRowGap={"16px"} sx={{ flexDirection: ["column", "column", "row"] }}>
                <Box display={"flex"} flex="1.4" alignItems={"center"}>
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
                  {total_lp_stake * 1}
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  {lp_rewards} TRVL
                </Box>
                <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>
                  <Box
                    display={"1"}
                    width={"100%"}
                    minWidth={"85px"}
                    onClick={() => {
                      claimLP();
                    }}
                  >
                    <CustomButton str={"Claim"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"600"} bradius={"100px"} />
                  </Box>
                </Box>
              </Row03> */}
              {/* <Row03 gridRowGap={"16px"} sx={{ flexDirection: ["column", "column", "row"] }} marginBottom={"5%"}>
                <Box display={"flex"} flex="1.4" alignItems={"center"}>
                  <Box mr={"8px"} display={"flex"}>
                    <Box display={"flex"}>
                      <LogoRoundedIcon size="32px" color="black" />
                    </Box>
                  </Box>
                  Free TRVL
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  {free_trvl_staked_value} TRVL <br/>
                  {free_trvl_staked_value > 0 && <>($ {(free_trvl_staked_value * price).toFixed(2)})</>}  
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  {free_rewards} TRVL <br/>
                  {free_rewards > 0 && <>($ {(free_rewards * price).toFixed(2)})</>}                
                </Box>
                {free_rewards > 0 &&
                  <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>
                    <Box
                      display={"1"}
                      width={"100%"}
                      minWidth={"85px"}
                      onClick={() => {
                        claim_free();
                      }}
                    >
                      {active && <CustomButton str={"Claim"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"600"} bradius={"100px"} />}
                    </Box>
                  </Box>}
              </Row03> */}
            </PoolsPart>            
          ):
          (          
            <PoolsPart>
              <Row01 gridRowGap={"16px"} sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
                <Box display={"flex"} flex="1.4" alignItems={"center"}>
                  Token
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  Amount
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  Dollar Value
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  Status
                </Box>
                <Box display={"flex"} flex="1" alignItems={"center"}>
                  Unlock Time
                </Box>
                <Box display={"flex"} flex="0.5" alignItems={"center"}></Box>
              </Row01>
              {escrows && escrows.map((escrow) => {
                return(
                  <Row02 gridRowGap={"16px"} sx={{ flexDirection: ["column", "column", "row"], borderTop: ["none", "none", "1px solid #0b2336"] }}>
                    <Box display={"flex"} flex="1.4" alignItems={"center"}>
                      <Box mr={"8px"} display={"flex"}>
                        <Box display={"flex"}>
                          <LogoRoundedIcon size="32px" color="black" />
                        </Box>
                      </Box>
                      ESCROW <br/>TOKEN
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"}>
                      {(parseInt(escrow.amount._hex) / Math.pow(10, 18)).toFixed(2)} ETRVL
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"}>
                      $ {(parseInt(escrow.amount._hex) / Math.pow(10, 18) * price).toFixed(2)}
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"}>
                      {Date.now() > new Date(parseInt(escrow.end._hex) * 1000) ? "Unlocked": "Locked"}
                    </Box>
                    <Box display={"flex"} flex="1" alignItems={"center"}>
                    {new Date(parseInt(escrow.end._hex) * 1000).toLocaleDateString("en-US") + " " + new Date(parseInt(escrow.end._hex) * 1000).toLocaleTimeString("en-US")}
                    </Box>
                    { Date.now() > new Date(parseInt(escrow.end._hex) * 1000) ? (
                      <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>
                        <Box
                          display={"1"}
                          width={"100%"}
                          minWidth={"85px"}
                          onClick={() => {
                            unlock();
                          }}
                        >
                          <CustomButton str={"Unlock"} width={"100%"} height={"56px"} color={"#D4EEE9"} bgcolor={"#0B2336"} fsize={"16px"} fweight={"600"} bradius={"100px"} />
                        </Box>
                      </Box>
                    ):(
                      <Box display={"flex"} flex="0.5" alignItems={"center"} justifyContent={"center"} width={"100%"}>
                      </Box>
                    )}
                    
                  </Row02>
                )
              })}
              
            </PoolsPart>
          )}

        </CenterSector01>
        <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" } }}></Box>
      </RewardsPart>
     
      <NotificationContainer />
    </StyledComponent>
  );
};

const RewardsPart = styled(Box)`
  display: flex;
  width: 100%;
`;

const LockRewardsPart = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 10%;
`;

const LeftSector01 = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  border-left: 1px solid #0b2336;
`;
const CenterSector01 = styled(Box)`
  display: flex;
  flex: 4;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const RightSector01 = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;
const LeftSector01Text = styled(Box)`
  display: flex;
  margin-top: 20%;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0b2336;
`;

const PoolsPart = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: -8px;
`;
const Row01 = styled(Box)`
  flex: 1;
  margin-top: 48px;
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
const Row03 = styled(Box)`
  display: flex;
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
`;

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 80px;
`;

const RewardText = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const LeftText01 = styled(Box)`
  display: flex;
  flex: 1;
  font-family: "Reckless Neue";
  font-style: normal;
  font-weight: 300;
  font-size: 64px;
  line-height: 68px;
  /* identical to box height, or 106% */

  letter-spacing: -0.015em;

  color: #000000;
`;
const RightText01 = styled(Box)`
  flex: 1;
  font-family: "Reckless Neue";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 36px;
  /* or 164% */

  color: #0b2336;
`;

const ActivedTabButton = styled(Box)`
  display: flex;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 42px;
  color: #0b2336;
  background: 0;
  border: none;
  padding: 8px 16px;
  /*border-radius: 8px;*/
  /* transition: .3s; */
  cursor: pointer;
  border-bottom: 3px solid #0b2336;
  &:hover {
    border-bottom: 3px solid #0b2336;

    /* background: rgba(0,0,0,.05); */
  }
`;

const TabButton = styled(Box)`
  display: flex;
  font-family: "Radio Grotesk";
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 42px;
  color: #0b2336;
  background: 0;
  border: none;
  padding: 8px 16px;
  /*border-radius: 8px;*/
  /* transition: .3s; */
  cursor: pointer;
  border-bottom: 1px solid #091316;
  &:hover {
    border-bottom: 1px solid #091316;

    /* background: rgba(0,0,0,.05); */
  }
`;

export default Reward;
