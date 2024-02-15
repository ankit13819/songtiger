import React, { useEffect, useState, useContext } from "react";
import { makeStyles, styled } from "@mui/styles";
import {
  Typography,
  useMediaQuery,
  Divider,
  Box,
  List,
  ListItem,
  Modal,
  Button,
} from "@mui/material";
// import SongTiger from "../../Icons/SongTiger";
import MenuIcon from "@mui/icons-material/Menu";
// import LoginScreen from "./LoginScreen";
import auth from "./util/auth";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import logout from "../Layout/util/logout";
import eventBus from "../../util/eventBus";
import Link from "next/link";
import { useRouter } from "next/router";
import { padding } from "@mui/system";
import Drawer from "@mui/material/Drawer";
import LoginOrSignupModal from "../../src/components/feature/auth/LoginOrSignupModal";
import IdentityCheck from "../../src//components/feature/identity-check";
import {
  KYC_MODULE_STATUS,
  GEOLOCATION_URL,
  WEB_URL,
} from "../../src/constant/appConstants";
import { CommonContext } from "../helper/commonContext";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import fetcher from "../../src/dataProvider";
import { setCountryCode } from "../../src/redux/slices/layout";
import { useSelector } from "react-redux";
import get from "loadsh/get";
import CapturePhoneModal from "../../src/components/feature/auth/CapturePhoneModal";
import { InputBase } from "@mui/material";
import Select from "@mui/material/Select";
import TagManager from "react-gtm-module";
import { isEmpty } from "lodash";
import { setToken, setUserDetail } from "../../src/redux/actions";
import { setUserData } from "../../src/redux/slices/user";
import { songPageGTMCTAClick } from "../../util/gtmutil";

import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";
import { IoCopyOutline } from "react-icons/io5";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "fit-content",
    width: "100%",
    fontFamily: "'Inter', sans-serif",
    background:
      "top right/60% 500px no-repeat url(/images/home/ellipse.png),#0c091b",
    display: "flex",
    color: "white",
    // borderBottom: "0.5px solid #FFFFFF",
    alignItems: "center",
    padding: "13px 0",
    position: "relative",
    top: "0",
    overflow: "hidden",
    zIndex: "1",
    justifyContent: "space-between",
    "@media (max-width:480px)": {
      padding: "7px 5px",
    },
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    top: "0",
    left: "0",
  },
  logoImg: {
    width: "180px",
    height: "auto",
    margin: "26px 24px",
    [theme.breakpoints.down("sm")]: {
      margin: "15px",
    },
  },
  hamburger: {
    marginLeft: "5px",
  },
  login: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    // width: "200px",
    // height: "auto",
    cursor: "pointer",
    color: "white",
    borderRadius: "8px",
    border: "solid 1px white",
    padding: "5px",
    marginLeft: "0",
    marginBottom: "0",
    "& h6": {
      fontSize: "14px",
    },
    "@media(max-width:480px)": {
      "& img": {
        width: "35px",
      },
    },
  },
  loginWithGif: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    width: "100px",
    height: "35px",
    background: "linear-gradient(90.78deg, #B237F6 3.91%, #E94177 96.03%)",
    borderRadius: "10px",
    color: "white",
    borderRadius: "8px",
    padding: "5px 5px 5px 10px",
    marginLeft: "0",
    marginRight: "20px",
    marginBottom: "0",
    "& h6": {
      fontSize: "14px",
      fontWeight: "600",
    },
    "& img": {
      marginLeft: "-10px",
    },
    "@media(max-width:480px)": {
      padding: "5px 10px 5px 10px",
      width: "auto",
      marginRight: "0px",
      "& img": {
        display: "none",
      },
    },
  },

  wallet: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    // width: "200px",
    // height: "auto",
    color: "white",
    borderRadius: "10px",
    border: "solid 1px white",
    padding: "5px",
    fontSize: "14px",
    marginLeft: "0",
    marginBottom: "0",
    "@media(max-width:480px)": {
      "& img": {
        width: "35px",
      },
    },
  },
  mobWallet: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    color: "white",
    padding: "5px",
    fontSize: "14px",
    marginLeft: "0",
    marginBottom: "0",
  },
  drawer: {
    width: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    fontSize: "20px",
    color: "#FFFFFF",
    background: "#19132A",
    height: "100vh",
    overflowY: "scroll",
    position: "relative",
    "& h6 img": {
      width: "40px",
      height: "22px",
      objectFit: "cover",
      marginLeft: "5px",
    },
  },
  closeIcon: {
    background: "#FFFFFF",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    border: "1px solid #ffffff",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    lineHeight: "26px",
    position: "relative",
    display: "inline-block",
    textAlign: "center",
    fontSize: "27px",
  },
  linkText: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: " 500",
    fontSize: "16px !important",
    lineHeight: "19px !important",
    color: "#FFFFFF",
    cursor: "pointer",
    padding: "0px 20px !important",
    margin: "20px 0px !important",
  },
  mobilelogo: {
    width: "100%",
    textAlign: "left",
    margin: "20px 10px",
  },
  closeButton: {
    float: "right",
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: 1,
    color: "#000",
    textAlign: "right",
    padding: "10px",
    marginTop: "10px",
    opacity: 1,
    backgroundColor: "transparent",
    border: 0,
    webkitAppearance: "none",
  },
  mobilelogoImg: {
    height: "auto",
    verticalAlign: "middle",
    maxWidth: "200px",
  },
  divider: {
    background: "rgba(192, 192, 192, 0.2)",
  },
  versionText: {
    padding: "30px 0px",
    position: "absolute",
    bottom: "0",
    fontFamily: "Avenir",
    fontSize: "12px",
    color: "#FFFFFF",
    textAlign: "center",
    width: "100%",
  },
  comingSoon: {
    width: "76px",
    height: "20px",
    borderRadius: "4px",
    background: "#3454FA",
    color: "#fff",
    padding: "4px 6px",
    fontSize: "11px !important",
    marginLeft: "7px !important",
    position: "relative",
    top: "-3px",
  },
  menuItems: {
    display: "flex",
    width: "100%",
    maxWidth: "640px",
    justifyContent: "flex-end",
    alignItems: "center",
    "& h6 img": {
      width: "40px",
      height: "22px",
      objectFit: "cover",
      marginLeft: "5px",
    },
  },
  dropDownToggle: {
    "& .MuiPaper-root": {
      right: "24px",
      background: "#130d24",
      color: "#fff",
      border: "3px solid #564972",
      left: "initial !important",
      width: "100%",
      maxWidth: "190px",
      top: "55px !important",
    },
  },
  btnPopup: {
    color: "#fff !important",
    borderColor: "#fff !important",
    height: "44px",
    textTransform: "capitalize !important",
    borderRadius: "10px !important",
  },
  websiteLogo: {
    minWidth: "220px",
    "@media(max-width:480px)": {
      minWidth: "140px",
    },
  },
  logoContainer: {
    marginLeft: "23px",
    display: "flex",
    alignItems: "center",
    "@media(max-width:480px)": {
      marginLeft: "0",
    },
  },
  headerTopNotice: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "52px",
    background: "linear-gradient(90.78deg, #B237F6 3.91%, #E94177 96.03%)",
    color: "#fff",
    padding: "0 12px",
    "& p": {
      fontSize: "18px",
    },
    "& a": {
      textDecoration: "underline",
      color: "#fff !important",
    },
    "& img": {
      marginLeft: "15px",
      width: "24px",
      cursor: "pointer",
    },
    "@media(max-width:480px)": {
      "& p": {
        fontSize: "12px",
        lineHeight: "15px",
      },
    },
  },
  INRdropdown: {
    "@media(max-width:480px)": {
      "& #select-country-select-one": {
        paddingRight: "20px",
      },
    },
  },
  INRdropdownContainer: {
    maxWidth: "120px",
    marginLeft: "50px",
    "@media(max-width:480px)": {
      maxWidth: "120px",
      marginLeft: "20px",
    },
  },

  INRdropdownContainerMobileView: {
    maxWidth: "100%",
    marginLeft: "20px",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    marginTop: "15px",
  },

  topLeaderborad: {
    textAlign: "center",
    fontWeight: "600",
    width: "100%",
    marginRight: "10px !important",
    fontSize: "14px",
    background: "linear-gradient(90.78deg, #B237F6 3.91%, #E94177 96.03%)",
    borderRadius: "8px !important",
    height: "40px",
    color: "#fff !important",
    textDecoration: "none",
    textTransform: "none !important",
    display: "block",
    position: "relative",
    "& img": {
      marginRight: "2px",
      width: "15px !important",
      height: "16px !important",
    },
  },
  invitePopupBox: {
    position: "relative",
    display: "block",
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    margin: "auto",
    borderRadius: "20px",
    top: "50%",
    padding: "15px 30px 0",
    transform: "translateY(-50%)",
    "& > a": {
      position: "absolute",
      top: "15px",
      right: "15px",
      zIndex: "3",
      "@media(max-width:480px)": {
        position: "relative",
        display: "block",
        // marginBottom: "30px",
        left: "93%",
      },
    },
    "@media(max-width:767px)": {
      width: "90%",
      // padding: "15px",
    },
  },
  inviteHeader: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    // marginBottom: "32px",
    padding: "0 25px 10px",
    "& h4": {
      fontSize: "24px",
      fontWeight: "700",
    },
    "& p": {
      paddingTop: "8px",
      fontSize: "14px",
      fontWeight: "400",
      color: "#E14084",
    },
    "@media(max-width:480px)": {
      // marginBottom: "15px",
      padding: "0 0px 10px",
    },
  },
  inviteBody: {
    position: "relative",
    padding: "0 30px",
    "& > div": {
      position: "relative",
      background: "#e9edfe",
      borderRadius: "10px",
      padding: "18px 20px",
      fontWeight: "500",
      marginBottom: "20px",
      "& span": {
        fontWeight: "600",
        fontSize: "16px",
      },
      "& ul": {
        listStyle: "none",
        fontWeight: "500",
        fontSize: "14px",
        "& li": {
          padding: "2.5px 0 2.5px 23px",
          "&:before": {
            content: "''",
            position: "absolute",
            width: "11px",
            height: "11px",
            top: "10px",
            borderRadius: "50%",
            background: "rgba(52, 84, 250, 0.5)",
            border: "1px solid #3454FA",
            left: "0",
          },
          // "&:after": {
          //   content: "''",
          //   position: "absolute",
          //   height: "13px",
          //   borderLeft: "1px dashed #3454FA",
          //   left: "5px",
          //   top: "19px",
          // },
        },
        // "& li:last-child": {
        //   fontSize: "16px",
        //   fontWeight: "500",
        // },
        "& li:last-child::after": {
          display: "none",
        },
        "& li:last-child::before": {
          background: "none",
        },
      },
      "@media(max-width:480px)": {
        padding: "10px",
        marginBottom: "10px",
        "& li": {
          "&:after": {
            height: "38px !important",
          },
        },
        // "& li:last-child": {
        //   fontSize: "14px",
        // },
      },
    },
    "@media(max-width:480px)": {
      padding: "0",
    },
  },
  inviteFooter: {
    position: "relative",
    padding: "0 30px",
    "& span": {
      color: "rgba(0, 0, 0, 0.54)",
      marginBottom: "8px",
      position: "relative",
      display: "block",
    },
    "@media(max-width:480px)": {
      padding: "0",
    },
  },
  linkContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    border: "1px dashed rgba(0, 0, 0, 0.9)",
    borderRadius: "10px",
    marginBottom: "20px",
    cursor: "pointer",
    "& a": {
      color: "#E14084",
      textDecoration: "underline",
    },
  },
  socialContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    "& > button": {
      marginRight: "5%",
      textAlign: "center",
      marginBottom: "25px",
    },
    "& p": {
      fontSize: "12px",
      color: "rgba(0, 0, 0, 0.75)",
    },
  },

  copied: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "14px",
    linHeight: "17px",
    color: "#E14084",
    textAlign: "center",
  },
  mobileINR: {
    marginRight: "15px",
    "& button": {
      backgroundColor: "#19132b",
      border: "none",
      padding: "7px 15px",
      borderRadius: "100px",
      fontSize: "14px",
      fontWeight: "400",
      color: "#0C091B",
      border: "2px solid #fff",
      color: "#fff",
      marginLeft: "-1px",
    },
    "& .activeBtn": {
      color: "#000",
      backgroundColor: "#fff",
    },
  },
  tradingActivitymarket: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    width: "100px",
    height: "35px",
    background:
      "linear-gradient(90.48deg, #E14084 3.73%, #3454FA 53.09%, #54B5BB 96.58%)",
    borderRadius: "6px",
    color: "white",
    borderRadius: "8px",
    padding: "5px 5px 5px 10px",
    marginLeft: "0",
    marginRight: "20px",
    marginBottom: "0",
    "& h6": {
      fontSize: "14px",
      fontWeight: "600",
    },
    "& img": {
      display: "block !important",
      marginLeft: "0",
      width: "45px !important",
    },
    "@media(max-width:480px)": {
      padding: "5px 10px 5px 10px",
      width: "auto",
      marginRight: "0px",
      "& img": {
        display: "none",
      },
    },
  },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: "transparent",
    border: "solid 1px white",
    padding: "5px",
    fontSize: 14,
    borderRadius: "8px !important",
    width: "30px",
    marginRight: "4px !important",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    color: "white",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
}));

export default function Header({ color, borderBottom }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const commonContext = useContext(CommonContext);
  const router = useRouter();
  const [show, setShow] = React.useState(true);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [capturePhoneOpen, setCapturePhoneOpen] = React.useState(false);
  const socket = commonContext.socket;
  const [callBackName, setCallBackName] = React.useState("");
  const [copied, setCopied] = useState(false);
  const [identityCheck, setIdentityCheck] = React.useState(false);
  const [isClick, setIsClick] = useState(1);
  const handleOpen = () => {
    setOpen(true);
    const tagManagerArgs = {
      dataLayer: {
        event: "topNavigation",
        userStatus: "Guest",
        tabName: "LoginBtn",
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  };
  const handleCapturePhoneOpen = () => setCapturePhoneOpen(true);

  // const hideNotification = () => setShow(false);
  const hideNotification = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("click", "clicked");
    }
    setShow(false);
  };

  const handleClose = () => {
    // console.log("loginsignup modal close brn", router);

    // if (router?.asPath == "/community") {
    //   router.push("/");
    // }
    setOpen(false);
    // router.push("/");
  };

  const handleCapturePhoneClose = () => {
    setCapturePhoneOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
    const tagManagerArgs = {
      dataLayer: {
        event: "topNavigation",
        userStatus: "loggedIn",
        tabName: "myProfile",
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  };
  const initialState = {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    userData: null,
    profile: {
      email: null,
      name: null,
      profilePic: null,
      id: null,
      mobile: null,
      referralId: {},
    },
    id: null,
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    dispatch(setToken(initialState));
    dispatch(setUserDetail(initialState));
    dispatch(setUserData(initialState));
  };

  const handleCloseMenuV2 = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    eventBus.on("openLoginModal", (cb) => {
      if (!open) {
        setCallBackName(cb.function_name);
        handleOpen();
      }
    });
    return () => {
      eventBus.remove("openLoginModal");
    };
  }, []);

  // const headerTopNoticeClicker = typeof window !== "undefined"? localStorage?.getItem("click"):null;
  const headerTopNoticeClicker =
    typeof window !== "undefined"
      ? window?.sessionStorage.getItem("click")
      : null;
  useEffect(() => {
    eventBus.on("openCapturePhoneModal", (cb) => {
      if (!capturePhoneOpen) {
        setCallBackName(cb.function_name);
        handleCapturePhoneOpen();
      }
    });
    return () => {
      eventBus.remove("openCapturePhoneModal");
    };
  }, []);

  const r = auth();
  const isMobile = useMediaQuery("(max-width:768px)");
  const onClickCommunity = () => {
    if (r.token) {
      router.push("/community");
    } else {
      eventBus.dispatch("openLoginModal", { function_name: "uniqueCommunity" });
    }
  };
  useEffect(() => {
    eventBus.on("uniqueCommunity", () => {
      router.push("/community");
      router.push("/giftflow");
    });
    return () => {
      eventBus.remove("unique");
    };
  }, []);

  const MUpperMenus = [
    { path: "/tradeactivity", title: "Market" },
    { path: "/community", title: "Community" },
    { path: "/artistsubmission", title: "Artist" },
    { path: "/influencers", title: "Influencer" },
    // { path: "/giftflow", title: "Gift Flow" },
    // { path: "/#JoinEarlyAccess", title: "Sign up for Early Access" },
  ];
  const LogedInMUpperMenus = [
    { path: "/profile?type=collections", title: "Profile" },
    { path: "/profile?type=portfolio", title: "My Portfolio" },
    { path: "/tradeactivity", title: "Market" },
    { path: "/community", title: "Community" },
    { path: "/artistsubmission", title: "Artist" },
    { path: "/influencers", title: "Influencer" },
    { path: "/wallet", title: "Wallet" },
    // { path: "/giftflow", title: "Gift NFTs" },
    // { path: "/#JoinEarlyAccess", title: "Sign up for Early Access" },
  ];
  const MLowerMenus = [];

  const { mutate: getUserLocation } = useMutation(
    () => fetcher.get(GEOLOCATION_URL),
    {
      onSuccess: (result) => {
        // setLocation(result);
        let countryCode = get(result, "country_code", "OTHER");
        if (countryCode != "IN") {
          dispatch(setCountryCode("OTHER"));
        } else {
          dispatch(setCountryCode("IN"));
        }
      },
      onError: (error) => {
        console.log("location Error: ", error);
        dispatch(setCountryCode("IN"));
      },
    }
  );
  const { country_code } = useSelector((state) => state.layout);
  const { profile, isLoggedIn, id } = useSelector((state) => state.user);
  const [refLink, setRefLink] = useState("");

  const handleChange = (event) => {
    setPayMethod(event.target.value);
    if (event.target.value == 1) {
      dispatch(setCountryCode("IN"));
    }
    if (event.target.value == 2) {
      dispatch(setCountryCode("OTHER"));
    }
    console.log("payment method: ", event.target.value);
  };

  const handleChangeMobileView = (event) => {
    console.log(
      "Print  handleChangeMobileView",
      event?.target?.dataset?.paymethod
    );
    setIsClick(event?.target?.dataset?.paymethod);
    setPayMethod(event?.target?.dataset?.paymethod);
    if (event?.target?.dataset?.paymethod == 1) {
      dispatch(setCountryCode("IN"));
    }
    if (event?.target?.dataset?.paymethod == 2) {
      dispatch(setCountryCode("OTHER"));
    }
  };

  useEffect(() => {
    if (country_code != "IN" && country_code != "OTHER") {
      getUserLocation();
    }
  }, [country_code]);

  const [payMethod, setPayMethod] = React.useState(1);

  useEffect(() => {
    if (country_code == "IN") {
      setPayMethod(1);
    } else {
      setPayMethod(2);
    }
  }, [country_code]);

  const handleReferNow = () => {
    // router.push("/#Refer");
    setReferPopup(true);
    const tagManagerArgs = {
      dataLayer: {
        event: "Referrallinkheader",
        path: "/#Refer",
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  };

  const handlePortfolio = (link) => {
    handleCloseMenuV2();
    songPageGTMCTAClick(
      r,
      "ctaClicks",
      "Profile icon",
      "My Portfolio",
      "loggedIn",
      "Guest",
      "Header"
    );
    router.push(link);
  };

  const handleReferAndEarn = () => {
    setOpenDrawer(false);
    handleCloseMenuV2();
    setReferPopup(true);
  };

  const [referPopup, setReferPopup] = useState(false);
  const handleClose2 = () => {
    setReferPopup(false);
  };

  const { mutate: getProfile } = useMutation(
    (id) => fetcher.get(`/v1/user/${profile?.id || id}`),
    {
      onSuccess: (response) => {
        console.log("Print user deytails", response);
        dispatch(setUserData(response?.result));
        setRefLink(`${WEB_URL}/?ic=${response?.result?.referralId?.refCode}`);
      },
      onError: (error) => {
        setNameUpdateError(true);
      },
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      let userId = localStorage.getItem("userId");
      if (isEmpty(userId)) {
        setRefLink("Please login to get referal link");
      } else {
        getProfile(userId);
      }
    }
  }, [r?.userId]);

  // console.log("setRefLink :", refLink);

  const copyToClipboard = () => {
    songPageGTMCTAClick(
      r,
      "ctaClicks",
      "refer and earn Popup",
      "copy link",
      "loggedIn",
      "Guest",
      "Home Page"
    );

    navigator.clipboard.writeText(
      refLink +
        "\n" +
        "Get ₹25 on Signup and 10% Cashback using my referral link | Invest in Songs and Own Music | Earn multifold returns \n"
    );
    setCopied(true);
    if (r.token) {
      const tagManagerArgs = {
        dataLayer: {
          event: "refralLinkCopied",
          refLink: refLink,
          userStatus: "loggedIn",
        },
      };
      TagManager.dataLayer(tagManagerArgs);
    } else {
      const tagManagerArgs = {
        dataLayer: {
          event: "refralLinkCopied",
          refLink: refLink,
          userStatus: "Guest",
        },
      };
      TagManager.dataLayer(tagManagerArgs);
      handleLogin();
    }
  };

  const handleLogin = () => {
    songPageGTMCTAClick(
      r,
      "ctaClicks",
      "refer and earn popup",
      "share link",
      "loggedIn",
      "Guest",
      "Home Page"
    );

    eventBus.dispatch("openLoginModal", { function_name: "uniqueCommunity" });
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 500);
    }
  }, [copied]);

  const buttonPropsSecond = {
    url:
      refLink +
      "\n" +
      "Get ₹25 on Signup and 10% Cashback using my referral link | Invest in Songs and Own Music | Earn multifold returns \n",
  };

  const iconProps = {
    size: 46,
    round: true,
  };

  const buttonProps = {
    url: refLink,
    quote: " Own music and earn Royalty Income on FanTiger",
    hashtag: "#FanTiger",
  };

  return (
    <div style={{ width: "100%" }}>
      {/* {show && headerTopNoticeClicker != "clicked" && (
        <>
          <div
            className={classes.headerTopNotice}
            onClick={() => handleReferNow()}
            style={{ cursor: "pointer" }}
          > */}
      {/* <Typography component="p"> */}
      {/* Earn upto 10 Million FanTiger Coins by referring your friends and
              get a chance to win 1 Free song NFT.{" "} */}
      {/* Earn Referral Bonus upto ₹500.{" "}
              <span style={{ textDecoration: "underline" }}>Refer Now</span>
            </Typography> */}
      {/* <Typography component="p">India&#39;s Largest Music NFT marketplace platform FanTiger raises $5.5 million. <a href="https://economictimes.indiatimes.com/tech/funding/nft-music-platform-fantiger-raises-5-5-m/articleshow/91795626.cms" rel="noopner noreferrer" target="_blank">Read the Article on ET</a></Typography> */}
      {/* <Box
              component="img"
              onClick={hideNotification}
              src="/images/home/close.svg"
              sx={{ zIndex: "9999" }}
            />
          </div>
        </>
      )} */}

      <header
        className={classes.root}
        style={{ borderBottom: "1px solid #2f2b3c" }}>
        {/* <LoginScreen
        open={open}
        callBackName={callBackName}
        onClose={handleClose}
      /> */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}>
          <LoginOrSignupModal
            callBackName={"uniqueCommunity"}
            open={open}
            handleModalClose={() => handleClose()}
          />
          <CapturePhoneModal
            callBackName={"capturePhone"}
            capturePhoneOpen={capturePhoneOpen}
            handleModalClose={() => handleCapturePhoneClose()}
          />

          {isMobile && (
            <>
              <MenuIcon
                className={classes.hamburger}
                onClick={() => setOpenDrawer(!openDrawer)}
              />
              <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}>
                <div className={`${classes.drawer} hidden-scroll-bar`}>
                  <button
                    type="button"
                    className={classes.closeButton}
                    aria-label="Close"
                    onClick={() => setOpenDrawer(false)}>
                    <span aria-hidden="true" className={classes.closeIcon}>
                      &times;
                    </span>
                  </button>
                  <div className={classes.mobilelogo}>
                    <img
                      src="./images/home/logo1.svg"
                      alt=""
                      className={classes.mobilelogoImg}
                    />
                  </div>
                  <Divider variant="fullWidth" className={classes.divider} />
                  <div className={classes.INRdropdownContainerMobileView}>
                    <Typography component="span">Currency</Typography>
                    <div className={classes.mobileINR}>
                      <button
                        className={payMethod == 1 ? "activeBtn" : ""}
                        style={{ borderRadius: "100px 0 0 100px" }}
                        data-payMethod="1"
                        onClick={(e) => {
                          handleChangeMobileView(e);
                        }}>
                        INR
                      </button>
                      <button
                        className={payMethod == 2 ? "activeBtn" : ""}
                        data-payMethod="2"
                        style={{ borderRadius: "0px 100px 100px 0px" }}
                        onClick={(e) => {
                          handleChangeMobileView(e);
                        }}>
                        USD
                      </button>
                    </div>
                  </div>
                  <div className={classes.mobileMenus}>
                    {r.userName ? (
                      <>
                        {" "}
                        {LogedInMUpperMenus &&
                          LogedInMUpperMenus?.length > 0 &&
                          LogedInMUpperMenus?.map((item, i) =>
                            item?.title == "Market" ? (
                              <Link href={item?.path} key={i}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color:
                                      router.pathname === item?.path
                                        ? "#E14084"
                                        : "inherit",
                                  }}
                                  className={classes.linkText}
                                  onClick={() => {
                                    songPageGTMCTAClick(
                                      r,
                                      "ctaClicks",
                                      "Header",
                                      "Market",
                                      "loggedIn",
                                      "Guest",
                                      "Home Page"
                                    );
                                  }}>
                                  <Box
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      marginRight: "10px",
                                      marginLeft: "0px",
                                    }}
                                    component="img"
                                    src="/images/home/marketMob.svg"
                                    alt="Trade Market icon "
                                  />
                                  Market
                                  <Box
                                    component="img"
                                    src="/images/home/market.gif"
                                    style={{
                                      width: "40pxpx",
                                      height: "31px",
                                      marginRight: "10px",
                                    }}
                                  />
                                </Typography>
                              </Link>
                            ) : (
                              <Link href={item?.path} key={i}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color:
                                      router.pathname === item?.path
                                        ? "#E14084"
                                        : "inherit",
                                  }}
                                  className={classes.linkText}
                                  onClick={() => {
                                    songPageGTMCTAClick(
                                      r,
                                      "ctaClicks",
                                      "Header",
                                      item?.title,
                                      "loggedIn",
                                      "Guest",
                                      "Home Page"
                                    );
                                  }}>
                                  {item?.title}
                                </Typography>
                              </Link>
                            )
                          )}
                        {LogedInMUpperMenus &&
                          LogedInMUpperMenus?.length > 0 && (
                            <Box onClick={() => handleReferAndEarn()}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#FFF",
                                }}
                                className={classes.linkText}
                                onClick={() => {
                                  songPageGTMCTAClick(
                                    r,
                                    "ctaClicks",
                                    "Header",
                                    "Refer & Earn",
                                    "loggedIn",
                                    "Guest",
                                    "Home Page"
                                  );
                                }}>
                                Refer & Earn
                              </Typography>
                            </Box>
                          )}
                      </>
                    ) : (
                      <>
                        {" "}
                        {MUpperMenus &&
                          MUpperMenus?.length > 0 &&
                          MUpperMenus?.map((item, i) =>
                            item?.title == "Market" ? (
                              <Link href={item?.path} key={i}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color:
                                      router.pathname === item?.path
                                        ? "#E14084"
                                        : "inherit",
                                  }}
                                  className={classes.linkText}
                                  onClick={() => {
                                    songPageGTMCTAClick(
                                      r,
                                      "ctaClicks",
                                      "Header",
                                      "Market",
                                      "loggedIn",
                                      "Guest",
                                      "Home Page"
                                    );
                                  }}>
                                  <Box
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      marginRight: "10px !important",
                                      marginLeft: "0px",
                                    }}
                                    component="img"
                                    src="/images/home/marketMob.svg"
                                    alt="Trade Market icon "
                                  />
                                  Market
                                  <Box
                                    component="img"
                                    src="/images/home/market.gif"
                                    style={{
                                      width: "40pxpx",
                                      height: "31px",
                                      marginRight: "10px",
                                    }}
                                  />
                                </Typography>
                              </Link>
                            ) : (
                              <Link href={item?.path} key={i}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color:
                                      router.pathname === item?.path
                                        ? "#E14084"
                                        : "inherit",
                                  }}
                                  className={classes.linkText}
                                  onClick={() => {
                                    songPageGTMCTAClick(
                                      r,
                                      "ctaClicks",
                                      "Header",
                                      item?.title,
                                      "loggedIn",
                                      "Guest",
                                      "Home Page"
                                    );
                                  }}>
                                  {item?.title}
                                </Typography>
                              </Link>
                            )
                          )}
                      </>
                    )}
                    {r.userName && (
                      <MenuItem
                        style={{ fontSize: "16px" }}
                        onClick={() => {
                          handleCloseMenu();
                          logout();
                          const tagManagerArgs = {
                            dataLayer: {
                              event: "topNavigation",
                              userStatus: "loggedIn",
                              tabName: "Logout",
                            },
                          };
                          TagManager.dataLayer(tagManagerArgs);
                        }}>
                        Logout
                      </MenuItem>
                    )}
                  </div>
                </div>
              </Drawer>
            </>
          )}
          <div className={classes.logoContainer}>
            <Link href="/">
              <img
                src="/images/home/logo1.svg"
                alt="Song Tiger"
                style={{ cursor: "pointer" }}
                className={classes.websiteLogo}
              />
            </Link>
            {!isMobile && (
              <div className={classes.INRdropdownContainer}>
                <Select
                  className={classes.INRdropdown}
                  labelId="select-country-label-one"
                  id="select-country-select-one"
                  value={payMethod}
                  onChange={handleChange}
                  input={<BootstrapInput />}>
                  <MenuItem value={1}>INR</MenuItem>
                  <MenuItem value={2}>USD</MenuItem>
                </Select>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            padding: "0 15px",
            alignItems: "center",
          }}>
          <div className={classes.menuItems}>
            {!isMobile && (
              <>
                <Link href="/tradeactivity">
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "Inter",
                      paddingRight: "20px",
                      whiteSpace: "nowrap",
                      fontWeight: router?.pathname?.includes("/tradeactivity")
                        ? "bold"
                        : "none",
                      color: router.pathname.includes("/tradeactivity")
                        ? "#E14084"
                        : "inherit",
                    }}
                    style={{ cursor: "pointer" }}
                    variant="h6"
                    onClick={() => {
                      songPageGTMCTAClick(
                        r,
                        "ctaClicks",
                        "Header",
                        "Market",
                        "loggedIn",
                        "Guest",
                        "Home Page"
                      );
                    }}>
                    <Box
                      style={{
                        width: "14px",
                        height: "10px",
                        marginRight: "10px",
                      }}
                      component="img"
                      src="/images/tradinggainer.svg"
                      alt="Trade Market icon "
                    />
                    Market
                    <Box
                      component="img"
                      src="/images/home/market.gif"
                      style={{
                        width: "40pxpx",
                        height: "31px",
                        marginRight: "10px",
                      }}
                    />
                  </Typography>
                </Link>
                <Link href="/community">
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "Inter",
                      paddingRight: "20px",
                      whiteSpace: "nowrap",
                      fontWeight: router?.pathname?.includes("/community")
                        ? "bold"
                        : "none",
                      color: router.pathname.includes("/community")
                        ? "#E14084"
                        : "inherit",
                    }}
                    style={{ cursor: "pointer" }}
                    variant="h6"
                    onClick={() => {
                      songPageGTMCTAClick(
                        r,
                        "ctaClicks",
                        "Header",
                        "Community",
                        "loggedIn",
                        "Guest",
                        "Home Page"
                      );
                    }}>
                    Community
                    {/* <Box component="img" src="/images/home/live-reduced.gif" /> */}
                  </Typography>
                </Link>

                <Link href="/artistsubmission">
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "Inter",
                      paddingRight: "20px",
                      whiteSpace: "nowrap",
                      fontWeight:
                        router.pathname === "/artistsubmission"
                          ? "bold"
                          : "none",
                      color:
                        router.pathname === "/artistsubmission"
                          ? "#E14084"
                          : "inherit",
                    }}
                    style={{ cursor: "pointer" }}
                    variant="h6"
                    onClick={() => {
                      songPageGTMCTAClick(
                        r,
                        "ctaClicks",
                        "Header",
                        "For Artist",
                        "loggedIn",
                        "Guest",
                        "Home Page"
                      );
                    }}>
                    For Artist
                  </Typography>
                </Link>
                <Link href="/influencers">
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "Inter",
                      paddingRight: "20px",
                      whiteSpace: "nowrap",
                      fontWeight: [
                        "/influencers",
                        "/campaign/listing",
                        "/campaign/[slug]",
                      ].includes(router.pathname)
                        ? "bold"
                        : "none",
                      color: [
                        "/influencers",
                        "/campaign/listing",
                        "/campaign/[slug]",
                      ].includes(router.pathname)
                        ? "#E14084"
                        : "inherit",
                    }}
                    style={{ cursor: "pointer" }}
                    variant="h6"
                    onClick={() => {
                      songPageGTMCTAClick(
                        r,
                        "ctaClicks",
                        "Header",
                        "For Influencers",
                        "loggedIn",
                        "Guest",
                        "Home Page"
                      );
                    }}>
                    For Influencers
                  </Typography>
                </Link>
                {/* <Link href="/giftflow">
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "Inter",
                      paddingRight: "15px",
                      whiteSpace: "nowrap",
                      fontWeight: router?.pathname?.includes("/giftflow")
                        ? "bold"
                        : "none",
                      color: router?.pathname?.includes("/giftflow")
                        ? "#E14084"
                        : "inherit",
                    }}
                    style={{ cursor: "pointer" }}
                    variant="h6"
                  >
                    <Button
                      className={classes.topLeaderborad}
                      onClick={() => {
                        router.push("/giftflow");
                      }}
                    >
                      <img src="/images/gift/giftfill-white.svg" /> Gift NFTs
                    </Button>
                  </Typography>
                </Link> */}

                {r.userName &&
                process.env.NEXT_PUBLIC_PAYMENT_ENABLED != "false" ? (
                  <div
                    onClick={() => {
                      const tagManagerArgs = {
                        dataLayer: {
                          event: "topNavigation",
                          userStatus: "loggedIn",
                          tabName: "Wallet",
                        },
                      };
                      TagManager.dataLayer(tagManagerArgs);
                      router.push(`/wallet`);
                    }}
                    className={classes.wallet}
                    style={{ marginRight: "40px", cursor: "pointer" }}>
                    <Box
                      style={{ width: "24px", height: "24px" }}
                      component="img"
                      src="/images/wallet.svg"
                    />{" "}
                    {country_code == "IN" && (
                      <span>
                        ₹{Math.round(commonContext?.walletBalance * 80)}
                      </span>
                    )}
                    {country_code == "OTHER" && (
                      <span>${commonContext?.walletBalance}</span>
                    )}
                  </div>
                ) : (
                  <> </>
                )}

                {/* <Link href="/influencers">
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontFamily: "Inter",
                    color:
                      router.pathname === "/influencers"
                        ? "#E14084"
                        : "inherit",
                  }}
                  style={{ cursor: "pointer" }}
                  variant="h6"
                >
                  Influencers
                </Typography>
              </Link> */}
                {/* <Link href="/#JoinEarlyAccess">
                <Button className={classes.btnPopup} variant="outlined">
                  Sign up for Early Access
                </Button>
              </Link> */}
              </>
            )}
          </div>
          {isMobile && (
            <div
              onClick={() => {
                const tagManagerArgs = {
                  dataLayer: {
                    event: "topNavigation",
                    userStatus: "loggedIn",
                    tabName: "Trade Activity",
                  },
                };
                TagManager.dataLayer(tagManagerArgs);
                router.push(`/tradeactivity`);
              }}
              className={classes.tradingActivitymarket}
              style={{ marginRight: "20px" }}>
              <Box
                style={{
                  width: "14px",
                  height: "10px",
                  marginRight: "10px",
                }}
                component="img"
                src="/images/tradinggainer.svg"
                alt="Trade Market icon "
              />
            </div>
          )}
          {r.userName ? (
            <>
              {isMobile ? (
                <div
                  onClick={() => {
                    const tagManagerArgs = {
                      dataLayer: {
                        event: "topNavigation",
                        userStatus: "loggedIn",
                        tabName: "Wallet",
                      },
                    };
                    TagManager.dataLayer(tagManagerArgs);
                    router.push(`/wallet`);
                  }}
                  className={classes.mobWallet}
                  style={{ marginRight: "20px" }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "500",
                      display: "flex",
                    }}>
                    <Box
                      style={{ width: "24px", height: "24px" }}
                      component="img"
                      src="/images/wallet.svg"
                    />
                    &nbsp;
                    {country_code == "IN" && (
                      <span>
                        {" "}
                        ₹{Math.round(commonContext?.walletBalance * 80)}
                      </span>
                    )}
                    {country_code == "OTHER" && (
                      <span>${commonContext?.walletBalance}</span>
                    )}
                  </Typography>
                </div>
              ) : (
                <p
                  className={classes.login}
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClickMenu}
                  style={{ cursor: "pointer" }}>
                  <AccountCircle />
                </p>
              )}
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open1}
                style={{ marginTop: "40px" }}
                onClose={handleCloseMenuV2}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}>
                <MenuItem style={{ fontSize: "14px" }}>
                  <Link
                    href="/profile?type=collections"
                    style={{ color: "#fff", textDecoration: "none" }}
                    onClick={handleCloseMenuV2}>
                    {/* {r.userName} */} My Profile
                  </Link>
                </MenuItem>
                <MenuItem style={{ fontSize: "14px" }}>
                  <Box
                    onClick={() => handlePortfolio("/profile?type=portfolio")}
                    // href="/profile?type=portfolio"
                    style={{ textDecoration: "none" }}>
                    {/* {r.userName} */} My Portfolio
                  </Box>
                </MenuItem>
                <MenuItem style={{ fontSize: "14px" }}>
                  <Box
                    onClick={() => handleReferAndEarn("")}
                    style={{ textDecoration: "none" }}>
                    Refer & Earn
                  </Box>
                </MenuItem>
                <MenuItem
                  style={{ fontSize: "14px" }}
                  onClick={() => {
                    if (socket != null) {
                      try {
                        socket.close();
                      } catch {}
                      commonContext.setSocket(null);
                      commonContext.setSocketId("");
                    }
                    handleCloseMenu();
                    logout();
                    const tagManagerArgs = {
                      dataLayer: {
                        event: "topNavigation",
                        userStatus: "loggedIn",
                        tabName: "Logout",
                      },
                    };
                    TagManager.dataLayer(tagManagerArgs);
                  }}>
                  Logout
                </MenuItem>
                {/* {KYC_MODULE_STATUS == "true" && (
                  <MenuItem
                    style={{ fontSize: "14px" }}
                    onClick={() => {
                      handleCloseMenu();
                      setIdentityCheck(true);
                      const tagManagerArgs = {
                        dataLayer: {
                          event: "topNavigation",
                          userStatus: "loggedIn",
                          tabName: "Identity Check",
                        },
                      };
                      TagManager.dataLayer(tagManagerArgs);
                    }}
                  >
                    Identity Check
                  </MenuItem>
                )} */}
              </Menu>

              {/* {identityCheck && (
                <IdentityCheck
                  openModal={identityCheck}
                  handleModalClose={() => setIdentityCheck(false)}
                />
              )} */}
            </>
          ) : (
            <>
              <div onClick={handleOpen} className={classes.loginWithGif}>
                <Typography variant="h6">Login</Typography>
                <Box
                  component="img"
                  src="/images/wallet/login-reducedgift.gif"></Box>
              </div>
            </>
          )}
        </div>
      </header>

      <Modal open={referPopup} onClose={handleClose2} disableScrollLock={true}>
        <Box className={classes.invitePopupBox}>
          <Box
            style={{ float: "right", cursor: "pointer" }}
            component="img"
            src="/images/community/close.svg"
            onClick={handleClose2}
          />
          <Box className={classes.inviteHeader}>
            <Box
              component="img"
              src="/images/community/invitecommunity1.gif"
              style={{ width: "80px", height: "80px" }}
            />
            <Box>
              <Typography variant="h4">Refer & Earn!</Typography>
              <Typography component="p">
                {/* Refer Friends to Join FanTiger & Earn Referel Bonus <br></br>{" "} */}
                Earn Referral Bonus upto ₹500
              </Typography>
            </Box>
          </Box>
          <Box className={classes.inviteBody}>
            <Box>
              <Typography component="span">Referral Incentive</Typography>
              <List>
                <ListItem>
                  You will get 10% Referral Cashback upto ₹50 every time on the
                  first NFT purchase of your friends when they sign up using
                  your referral link. Your friend will also get 10% Cashback
                  upto ₹50.
                </ListItem>
                {/* <ListItem>
                  You will also get 10% Referral Bonus every time on the first
                  NFT purchase of your friends when they sign up using your
                  referral link. Your friend will also get 10% Cashback.
                </ListItem> */}
              </List>
              <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                * Earn maximum upto ₹500
              </p>
            </Box>
          </Box>
          <Box className={classes.inviteFooter}>
            <Box>
              <Typography component="span">Share Link</Typography>
              <Box className={classes.linkContainer} onClick={copyToClipboard}>
                <Link href="#">{refLink}</Link>
                {r.userName ? (
                  <>
                    {copied ? (
                      <Typography variant="h6" className={classes.copied}>
                        Copied
                      </Typography>
                    ) : (
                      <IoCopyOutline size={24} color="#E14084" />
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Box>
              <Typography component="span">Share Via</Typography>
              <Box className={classes.socialContainer}>
                <WhatsappShareButton {...buttonPropsSecond}>
                  <WhatsappIcon {...iconProps} />
                  <Typography component="p">Whatsapp</Typography>
                </WhatsappShareButton>

                <TwitterShareButton
                  {...buttonPropsSecond}
                  style={{ marginLeft: "20px", cursor: "pointer" }}>
                  <TwitterIcon {...iconProps} />
                  <Typography component="p">Twitter</Typography>
                </TwitterShareButton>

                <FacebookShareButton
                  {...buttonPropsSecond}
                  style={{ marginLeft: "20px", cursor: "pointer" }}>
                  <FacebookIcon {...iconProps} />
                  <Typography component="p">Facebook</Typography>
                </FacebookShareButton>

                <TelegramShareButton
                  {...buttonPropsSecond}
                  style={{ marginLeft: "15px", cursor: "pointer" }}>
                  <TelegramIcon {...iconProps} />
                  <Typography component="p">Telegram</Typography>
                </TelegramShareButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
