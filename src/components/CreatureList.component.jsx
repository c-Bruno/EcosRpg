import { Grid } from "@mui/material";

export default function CreatureList() {
  return (
    <Grid
      container
      spacing={2}
      marginTop={30}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <a
          alt="Mythrill"
          target="_blank"
          rel="noreferrer"
          href="https://www.mythrillfiction.com/the-dark-rider"
        >
          <div className="card">
            <div className="wrapper">
              <img
                className="cover-image"
                src="https://ggayane.github.io/css-experiments/cards/dark_rider-cover.jpg"
              />
            </div>
            <img
              className="title"
              src="https://ggayane.github.io/css-experiments/cards/dark_rider-title.png"
            />
            <img
              className="character"
              src="https://ggayane.github.io/css-experiments/cards/dark_rider-character.webp"
            />
          </div>
        </a>
      </Grid>

      <Grid item>
        <a
          alt="Mythrill"
          target="_blank"
          rel="noreferrer"
          href="https://www.mythrillfiction.com/force-mage"
        >
          <div className="card">
            <div className="wrapper">
              <img
                className="cover-image"
                src="https://ggayane.github.io/css-experiments/cards/force_mage-cover.jpg"
              />
            </div>
            <img
              className="title"
              src="https://ggayane.github.io/css-experiments/cards/force_mage-title.png"
            />
            <img
              className="character"
              src="https://ggayane.github.io/css-experiments/cards/force_mage-character.webp"
            />
          </div>
        </a>
      </Grid>
    </Grid>
  );
}
