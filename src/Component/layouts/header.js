import { Box } from "@material-ui/core";
import styled from "styled-components";
import Mark01 from "../../assets/dtravle_mark01.png";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiExit } from "react-icons/bi";
import { LogoIcon, LogoRoundedIcon, ListIcon } from "../elements/icons";
import { useGetPrice } from "../hooks/price";

const Header = ({ setModal, wConnect, active, setActive }) => {
  let navigate = useNavigate();
  const [flag_drop, set_drop] = useState(false);
  const { account, deactivate } = useWeb3React();
  const [menuVisible, setMenuVisible] = useState(false);
  const [current_tab, set_current_tab] = useState(0);
  const price = useGetPrice();
  return (
    <StyledComponent>
      <Mark
        display={"flex"}
        alignItems={"center"}
        gridGap={"10px"}
        onClick={() => {
          navigate("/");
          window.scrollTo(0, 0);
          set_current_tab(0);
        }}
      >
        <LogoIcon size={"40px"} color="#0B2336" />
        <Box fontSize={"20px"}>TRVL</Box>
      </Mark>
      <HambergerMenu bgcolor={"#d4eeea"} width={"100%"} flex={1} display={"flex"} alignItems={"center"} gridColumnGap={"56px"} gridRowGap={"16px"} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" }, position: { xs: "absolute", sm: "absolute", md: "static" }, top: "100%" }} zIndex={11} p={"16px"} borderRadius={"0px 0px 10px 10px"} visible={menuVisible} boxSizing={"border-box"}>
        {current_tab == 0 ? <>
          <ActivedLinkButton
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
              set_current_tab(0);
            }}
          >
            Overview
          </ActivedLinkButton>          
        </> :
        <>
          <LinkButton
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
              set_current_tab(0);
            }}
          >
            Overview
          </LinkButton>
        </>}

        {current_tab == 1 ? <>
          <ActivedLinkButton
            onClick={() => {
              navigate("/reward");
              window.scrollTo(0, 0);
              set_current_tab(1);
            }}
          >
            Rewards
          </ActivedLinkButton>       
        </> :
        <>
          <LinkButton
            onClick={() => {
              navigate("/reward");
              window.scrollTo(0, 0);
              set_current_tab(1);
            }}
          >
            Rewards
          </LinkButton>
        </>}
        <Box display={"flex"} alignItems={"center"} gridGap={"8px"} sx={{ ml: ["unset", "unset", "auto"] }}>
          TRVL Price:
          <Box>
            <LogoRoundedIcon size="32px" color="#0B2336" />
          </Box>
          ${price}
        </Box>
        <Box display={"flex"} position={"relative"}>
          <ConnectWallet
            onClick={() => {
              if (active === false) {
                setModal(true);
              } else {
                setModal(false);
                set_drop(!flag_drop);
              }
            }}
          >
            {account ? (active === false ? "Connect Wallet" : account.slice(0, 6) + "..." + account.slice(-4)) : "Connect Wallet"}
          </ConnectWallet>
          {flag_drop ? (
            <DropBox
              onMouseLeave={() => {
                set_drop(false);
              }}
              onClick={async () => {
                // setModal(true);
                setActive(false);
                set_drop(false);
                await deactivate(wConnect);
                window.localStorage.removeItem("CurrentWalletConnect");
              }}
            >
              <BiExit />
              Disconnect
            </DropBox>
          ) : (
            <></>
          )}
        </Box>
      </HambergerMenu>
      <Box
        ml={"auto"}
        sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}
        style={{ cursor: "pointer" }}
        onClick={() => {
          setMenuVisible(!menuVisible);
        }}
      >
        <ListIcon size="32px" />
      </Box>
    </StyledComponent>
  );
};

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
  background: hsla(0, 30%, 100%, 0.8);
  border: none;
  transition: 0.5s;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 32px;
  letter-spacing: -0.01em;
  color: black;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 10px 10px rgb(0 0 0 / 20%), inset 2px 2px 2px #fff;
    background: white;
    transition: 0.5s;
  }
`;

const StyledComponent = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  grid-gap: 56px;
  width: 100%;
  /* height: 150px; */
  padding: 16px 0px;
  border-bottom: 1px solid #0b2336;
`;

const Leftmark = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;
`;
const RightPart01 = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
  justify-content: flex-end;
  align-items: center;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 32px;
  color: #0b2336;
`;

const Link01 = styled(Box)`
  display: flex;
  flex: 2;
  margin-left: 2%;
  /* justify-content: space-between; */
`;

const Mark = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 38px;
  line-height: 32px;
  color: #0b2336;
  &:hover {
    cursor: pointer;
  }
`;

const LinkButton = styled(Box)`
  display: flex;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 32px;
  color: #0b2336;
  background: 0;
  border: none;
  /* padding: 8px 16px;
    border-radius: 8px; */
  /* transition: .3s; */
  cursor: pointer;
  border-bottom: 2px solid rgba(0, 0, 0, 0);

  &:hover {
    border-bottom: 2px solid #0b2336;

    /* background: rgba(0,0,0,.05); */
  }
`;

const ActivedLinkButton = styled(Box)`
  display: flex;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 17px;
  line-height: 32px;
  color: #0b2336;
  background: 0;
  border: none;
  /* padding: 8px 16px;
    border-radius: 8px; */
  /* transition: .3s; */
  cursor: pointer;
  border-bottom: 2px solid rgba(0, 0, 0, 0);

  &:hover {
    border-bottom: 2px solid #0b2336;

    /* background: rgba(0,0,0,.05); */
  }
`;

const ConnectWallet = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 149px;
  /* height: 56px; */
  padding: 16px 24px;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 32px;
  letter-spacing: -0.01em;
  color: #d4eee9;
  border-radius: 100px;
  background: #0b2336;
  border: none;
  /* transition: 0.3s; */
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    box-shadow: 0 5px 5px rgb(0 0 0 / 30%);
    /* background: white; */
    transition: 0.5s;
  }
`;

const HambergerMenu = styled(Box)`
  visibility: ${(p) => (p.visible ? "visible" : "hidden")};
  @media only screen and (min-width: 960px) {
    visibility: visible !important;
  }
`;

export default Header;
