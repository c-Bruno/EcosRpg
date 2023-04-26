import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";

import { ModalProvider } from "../contexts/ModalContext";
import theme from "../themes/Default.theme";
import "../themes/global.scss";

import { Provider } from "react-redux";
import store from "../store";

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ModalProvider>
            <CssBaseline />
            <Component {...pageProps} />
          </ModalProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
