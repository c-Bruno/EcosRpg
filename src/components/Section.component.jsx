import { Button } from "@mui/material";
import { withStyles } from "@mui/styles";
import Image from "next/image";
import React from "react";

const styles = (theme) => ({
  root: {
    height: "100%",
    padding: "15px",
    border: "solid",
    overflow: "auto",
    borderRadius: "3px",
    borderWidth: "0.1px",
    borderColor: "#4e4e4e",
    background: theme.palette.primary[600],
  },

  title: {
    color: theme.palette.primary.main,
  },

  subtitle: {
    color: theme.palette.secondary.main,
  },

  textMargin: {
    margin: 0,
    marginTop: "10px",
    marginLeft: "auto",
    marginBottom: "10px",
  },

  textsAlign: {
    textAlign: "center",
  },

  paddingBox: {
    padding: "20px",
  },

  sectionButton: {
    alignSelf: "center",
    float: "right",
  },
});

const Section = ({
  image,
  title,
  classes,
  children,
  subtitle,
  renderButton,
}) => {
  return (
    <div className={classes.root}>
      <div>
        <div className={classes.textsAlign}>
          <h2 className={[classes.title, classes.textMargin]}>
            {title}
            {image ? (
              <Image
                src={image}
                alt="Character Portrait"
                width={30}
                height={30}
              ></Image>
            ) : (
              image
            )}

            {renderButton && (
              <Button className={classes.sectionButton}>
                {renderButton()}
              </Button>
            )}
          </h2>

          <span className={[classes.subtitle, classes.textMargin, classes.textsAlign]}>
            {subtitle}
          </span>
        </div>
      </div>

      <div className={classes.paddingBox}>{children}</div>
    </div>
  );
};

export default withStyles(styles)(Section);
