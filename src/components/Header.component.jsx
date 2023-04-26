import { Grid } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";

const styles = (theme) => ({
  header: {
    textAlign: "center",
    fontFamily: "Lacquer, cursive",
  },

  title: {
    color: "#FFFFFF",
    marginTop: 40,
  },
});

const Header = ({ title, classes }) => {
  return (
    <Grid item xs={12} justifyContent="center" className={classes.header}>
      <h1 className={classes.title}>{title}</h1>
    </Grid>
  );
};

export default withStyles(styles)(Header);
