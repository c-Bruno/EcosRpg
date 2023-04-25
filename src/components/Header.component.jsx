import React from "react";
import { withStyles } from "@mui/styles";
import { Grid } from "@mui/material";

const Header = ({ title, classes }) => {
  return (
    <Grid
      item
      xs={12}
      justifyContent="center"
      style={{
        textAlign: "center",
        fontFamily: "Lacquer, cursive",
      }}
    >
      <h1 className={classes.title}>{title}</h1>
    </Grid>
  );
};

const styles = (theme) => ({
  title: {
    color: "#FFFFFF",
    marginTop: 40,
  },
});

export default withStyles(styles)(Header);
