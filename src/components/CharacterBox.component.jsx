import {
  Delete as DeleteIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartIconNoLife,
  Link as LinkIcon,
  Chair as SanityIcon,
  ChairAltOutlined as SanityIconEmpty,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { withStyles } from "@mui/styles";
import Image from "next/image";
import React from "react";

const styles = (theme) => ({
  root: {
    gap: "20px",
    width: "100%",
    display: "flex",
    padding: "15px",
    minHeight: "121px",
    borderRadius: "5px",
    alignItems: "center",
    background: theme.palette.primary[900],
  },

  characterImage: {
    width: "75px",
    borderRadius: "50%",
  },

  characterName: {
    fontSize: "18px",
    marginTop: "8px",
    fontWeight: "bold",
  },

  characterLife: {
    gap: "3px",
    float: "left",
    display: "flex",
    color: "#E80A67",
    marginRight: "10px",
    alignItems: "center",
    justifyContent: "center",
  },

  characterSanity: {
    gap: "3px",
    display: "flex",
    color: "#1e45b6",
    alignItems: "center",
    justifyContent: "center",
  },

  hpInfo: {
    fontWeight: "bold",
  },

  mainInformations: {
    gap: "10px",
    display: "flex",
    alignItems: "start",
    justifyContent: "center",
    flexDirection: "column",
  },

  btn: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: "5px",
  },

  boxButtons: {
    gap: "10px",
    display: "flex",
    marginTop: "10px",
    alignItems: "center",
    justifyContent: "center",
  },
});

function CharacterBox({ classes, character, deleteCharacter, ...rest }) {
  const getCharacterPictureURL = () => {
    if (!character) {
      return null;
    }

    if (
      character.standard_character_picture_url &&
      character.injured_character_picture_url
    ) {
      if (character.current_hit_points > character.max_hit_points / 2) {
        return character.standard_character_picture_url;
      } else {
        return character.injured_character_picture_url;
      }
    } else {
      return `/assets/character.png`;
    }
  };

  return (
    <div className={classes.root} {...rest}>
      <Image
        src={getCharacterPictureURL()}
        alt="Character Portrait"
        className={classes.characterImage}
        width={70}
        height={70}
      />
      <div className={classes.mainInformations}>
        {/* Nome do personagem */}
        <span className={classes.characterName}>
          {character.name} (ID: {character.id})
        </span>

        <div>
          {/* Vida resumida */}
          <div className={classes.characterLife}>
            {character.current_hit_points === 0 ? (
              <HeartIconNoLife />
            ) : (
              <HeartIcon />
            )}
            <span className={classes.hpInfo}>
              {character.current_hit_points}/{character.max_hit_points}
            </span>
          </div>

          {/* Sanidade Resumida resumida */}
          <div className={classes.characterSanity}>
            {character.current_sanity_points === 0 ? (
              <SanityIconEmpty />
            ) : (
              <SanityIcon />
            )}
            <span className={classes.hpInfo}>
              {character.current_sanity_points}/{character.max_sanity_points}
            </span>
          </div>
        </div>

        <div className={classes.boxButtons}>
          {/* Adicionar novo personagem */}
          <div>
            <Button
              variant="outlined"
              href={`/sheet/${character.id}`}
              target="_blank"
              className={classes.btn}
            >
              <LinkIcon />
            </Button>
          </div>

          {/* Deletar personagem */}
          <div>
            <Button
              variant="outlined"
              onClick={() => deleteCharacter(character.id)}
              className={classes.btn}
            >
              <DeleteIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(CharacterBox);
