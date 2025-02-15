import { CircularProgress, Grid, Stack } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Suspense, useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import BannerMessages from "./components/BannerMessages";
import NavBar from "./components/navbar";
import Sidebar from "./components/sidebar";
import { isMobileState, profileFlagsState } from "./data/atoms";

const menuItems = [
  {
    key: "1",
    label: "Playground",
    link: "/playground",
  },
  {
    key: "7",
    label: "Data",
    link: "/data",
  },
  {
    key: "8",
    label: "Jobs",
    link: "/jobs",
  },
  {
    key: "3",
    label: "History",
    link: "/history",
  },
  {
    key: "5",
    label: "Settings",
    link: "/settings",
  },
];

export default function App({ children }) {
  const location = useLocation();
  let allMenuItems = menuItems;

  useEffect(() => {
    ReactGA.initialize(
      process.env.REACT_APP_GA_MEASUREMENT_ID || "G-WV60HC9CHD",
    );
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
      title: location.pathname,
    });
  }, [location]);

  const [isMobile, setIsMobile] = useRecoilState(isMobileState);
  const profileFlags = useRecoilValue(profileFlagsState);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  if (process.env.REACT_APP_ENABLE_APP_STORE === "true") {
    allMenuItems = [
      {
        key: "2",
        label: "Home",
        link: "/",
      },
      {
        key: "4",
        label: "Apps",
        link: "/apps",
      },
      ...menuItems,
    ];
  } else {
    allMenuItems = [
      {
        key: "4",
        label: "Apps",
        link: "/",
      },
      ...menuItems,
    ];
  }

  if (profileFlags.IS_ORGANIZATION_OWNER) {
    allMenuItems.push({
      key: "8",
      label: "Organization",
      link: "/organization",
    });
  }

  if (isMobile) {
    allMenuItems.push({
      key: "9",
      label: "Docs",
      link: "https://docs.trypromptly.com",
    });
  }

  return (
    <div id="app-container">
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      />
      {isMobile && <NavBar menuItems={allMenuItems} />}
      <Stack direction={"row"}>
        {!isMobile && <Sidebar menuItems={allMenuItems} />}
        <Suspense
          fallback={
            <Grid
              sx={{
                margin: "auto",
              }}
            >
              <CircularProgress />
            </Grid>
          }
        >
          <Grid
            sx={{
              textAlign: "center",
              height: "100vh",
              width: "100%",
              paddingLeft: isMobile ? 0 : "65px",
              backgroundColor: "#fff",
              overflow: "auto",
            }}
          >
            <BannerMessages />
            {children}
          </Grid>
        </Suspense>
      </Stack>
      <div
        dangerouslySetInnerHTML={{
          __html:
            '<promptly-app-embed published-app-id="f4d7cb50-1805-4add-80c5-e30334bce53c" width="100px" chat-bubble="true"></promptly-app-embed>',
        }}
      ></div>
    </div>
  );
}
