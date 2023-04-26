import { Button, Grid, TextField } from "@mui/material";
import { Form, Formik } from "formik";

import { CharacterInfoSchema } from "../../validations";

import Loader from "../Loader.component";

const CharacterInfoForm = ({ classes, initialValues, onSubmit }) => (
  <Formik
    initialValues={{
      age: initialValues.age,
      name: initialValues.name,
      fear: initialValues.fear,
      birth: initialValues.birth,
      weight: initialValues.weight,
      gender: initialValues.gender,
      birthplace: initialValues.birthplace,
      background: initialValues.background,
      occupation: initialValues.occupation,
      player_name: initialValues.player_name,
    }}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values).then(() => setSubmitting(false));
    }}
    validationSchema={CharacterInfoSchema}
  >
    {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
      // Formulario contendo os dados da ficha de um jogador
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Grid container item xs={12} spacing={3}>
          {/* Nome do jogador*/}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="player_name"
              variant="standard"
              onChange={handleChange}
              label="Nome do jogador(a)"
              value={values.player_name}
              error={errors.player_name}
            />
          </Grid>

          {/* Nome do personagem */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Nome"
              variant="standard"
              value={values.name}
              error={errors.name}
              onChange={handleChange}
            />
          </Grid>

          {/* Idade */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="age"
              type="number"
              label="Idade"
              variant="standard"
              value={values.age}
              error={errors.age}
              onChange={handleChange}
            />
          </Grid>

          {/* Genero */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="gender"
              label="Gênero"
              variant="standard"
              value={values.gender}
              error={errors.gender}
              onChange={handleChange}
            />
          </Grid>

          {/* Peso */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Peso"
              type="number"
              name="weight"
              variant="standard"
              value={values.weight}
              error={errors.weight}
              onChange={handleChange}
            />
          </Grid>

          {/* Profissão */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Profissão"
              name="occupation"
              variant="standard"
              onChange={handleChange}
              value={values.occupation}
              error={errors.occupation}
            />
          </Grid>

          {/* Quando nasceu */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="birth"
              variant="standard"
              value={values.birth}
              error={errors.birth}
              label="Quando nasceu"
              onChange={handleChange}
            />
          </Grid>

          {/* Onde nasceu */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="birthplace"
              variant="standard"
              label="Onde nasceu"
              onChange={handleChange}
              value={values.birthplace}
              error={errors.birthplace}
            />
          </Grid>

          {/* Maior medo */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="fear"
              variant="standard"
              label="Maior medo"
              value={values.fear}
              error={errors.fear}
              onChange={handleChange}
            />
          </Grid>

          {/* Background do personagem */}
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              maxRows={4}
              name="background"
              variant="standard"
              onChange={handleChange}
              label="Sobre o personagem"
              value={values.background}
              error={errors.background}
            />
          </Grid>

          <Grid item xs={12}>
            <div className="save-button">
              {isSubmitting && <Loader className="loader-save-button" />}
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Salvar
              </Button>
            </div>
          </Grid>
        </Grid>
      </Form>
    )}
  </Formik>
);

export default CharacterInfoForm;
