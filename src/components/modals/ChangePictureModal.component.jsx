import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  TextField,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../utils";

const styles = () => ({
  inputCahngePicture: {
    marginTop: "15px",
  },
});

function ChangePictureModal({
  classes,
  character,
  handleClose,
  onPictureChange,
}) {
  const [pictureURLs, setPictureURLs] = useState({
    standard_character_picture_url: "",
    injured_character_picture_url: "",
  });

  useEffect(() => {
    setPictureURLs({
      standard_character_picture_url: character.standard_character_picture_url,
      injured_character_picture_url: character.injured_character_picture_url,
    });
  }, [character]);

  function validateImageURL(url) {
    return;

    if (
      !pictureURLs.standard_character_picture_url.includes("discord") ||
      !pictureURLs.standard_character_picture_url.includes("imgur")
    ) {
      toast.error("Preencha as duas artes com URLs validas!");
      return;
    }

    if (
      !pictureURLs.injured_character_picture_url.includes("discord") ||
      !pictureURLs.injured_character_picture_url.includes("imgur")
    ) {
      toast.error("Preencha as duas artes com URLs validas!");
      return;
    }
  }

  const submit = () => {
    if (
      !pictureURLs.injured_character_picture_url ||
      !pictureURLs.standard_character_picture_url
    ) {
      toast.error("Preencha as duas artes!");
      return;
    }

    const allowedWebsites = ["discord", "imgur"];

    if (
      !allowedWebsites.some((website) =>
        pictureURLs.injured_character_picture_url.includes(website)
      )
    ) {
      toast.error("Preencha as duas artes com URLs validas!");
      return;
    }

    if (
      !allowedWebsites.some((website) =>
        pictureURLs.standard_character_picture_url.includes(website)
      )
    ) {
      toast.error("Preencha as duas artes com URLs validas!");
      return;
    }

    if (
      !pictureURLs.injured_character_picture_url.endsWith(".png") &&
      !pictureURLs.standard_character_picture_url.endsWith(".png")
    ) {
      toast.error("As artes precisam estar em formato PNG.");
      return;
    }

    api
      .put(`/character/${character.id}`, {
        injured_character_picture_url:
          pictureURLs.injured_character_picture_url,
        standard_character_picture_url:
          pictureURLs.standard_character_picture_url,
      })
      .then(() => {
        // Callback
        onPictureChange();

        // Close modal
        handleClose();
      })
      .catch(() => {
        return window.alert("Erro ao salvar!");
      });
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Alterar imagens do personagem</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <p>
              {" "}
              Se posssivel utilize imagens de tamanho <strong>420x600</strong> e
              em formato <strong>PNG</strong>. Apenas são aceitos links de
              imagens upadas no site{" "}
              <Link href="https://imgur.com/" target="_blank">
                Imgur
              </Link>{" "}
              ou no Discord.
            </p>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.inputCahngePicture}
              autoFocus
              label="Imagem padrão"
              type="text"
              fullWidth
              variant="standard"
              value={pictureURLs.standard_character_picture_url}
              onChange={({ target }) => {
                const value = target.value;

                setPictureURLs((prevState) => ({
                  ...prevState,
                  standard_character_picture_url: value,
                }));
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.inputCahngePicture}
              autoFocus
              label="Imagem machucada"
              type="text"
              fullWidth
              variant="standard"
              value={pictureURLs.injured_character_picture_url}
              onChange={({ target }) => {
                const value = target.value;

                setPictureURLs((prevState) => ({
                  ...prevState,
                  injured_character_picture_url: value,
                }));
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={submit}>Alterar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(ChangePictureModal);
