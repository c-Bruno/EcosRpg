import { Add as AddIcon } from "@mui/icons-material";
import { withStyles } from "@mui/styles";
import React from "react";

const styles = (theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    padding: "15px",
    cursor: "pointer",
    borderRadius: "3px",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    background: theme.palette.primary[900],
  },

  icon: {
    fontSize: "65px",
    color: theme.palette.primary.main,
  },
});

const AddBox = ({ classes, ...rest }) => {
  return (
    <div className={classes.root} {...rest}>
      <AddIcon className={classes.icon} />
    </div>
  );
};

export default withStyles(styles)(AddBox);
