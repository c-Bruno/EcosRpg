import { Grid } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";

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
