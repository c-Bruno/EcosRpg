import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import theme from "../themes/Default.theme";
import { ModalProvider } from "../contexts/ModalContext";

import store from "../store";
import { Provider } from "react-redux";

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
