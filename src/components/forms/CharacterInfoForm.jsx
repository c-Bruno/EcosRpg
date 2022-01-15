import { Formik, Form } from 'formik';
import { Grid, TextField, Button } from '@mui/material';

import { CharacterInfoSchema } from '../../validations';

import Loader from '../Loader';

const CharacterInfoForm = ({
    initialValues,
    onSubmit
}) => (
    <Formik
        initialValues={{ 
            name: initialValues.name,
            player_name: initialValues.player_name,
            age: initialValues.age,
            gender: initialValues.gender,
            weight: initialValues.weight,
            occupation: initialValues.occupation,
            birth: initialValues.birth,
            birthplace: initialValues.birthplace,
            fear: initialValues.fear,
            background: initialValues.background
        }}
        onSubmit={(values, { setSubmitting }) => {
            onSubmit(values).then(() => setSubmitting(false));
        }}
        validationSchema={CharacterInfoSchema}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting
      }) => (
        // Formulario contendo os dados da ficha de um jogador
        <Form onSubmit={handleSubmit}>
            <Grid container item xs={12} spacing={3}>
                {/* Nome do jogador*/}
                <Grid item xs={12}>
                    <TextField variant="standard"
                        label="Nome do jogador(a)"
                        name="player_name"
                        value={values.player_name}
                        fullWidth
                        onChange={handleChange}
                        error={errors.player_name}
                    />
                </Grid>

                {/* Nome do personagem */}
                <Grid item xs={12}>
                    <TextField variant="standard"
                        label="Nome"
                        name="name"
                        value={values.name}
                        fullWidth
                        onChange={handleChange}
                        error={errors.name}
                    />
                </Grid>

                {/* Idade */}
                <Grid item xs={6}>
                    <TextField
                        type="number"
                        variant="standard"
                        label="Idade"
                        name="age"
                        value={values.age}
                        fullWidth
                        onChange={handleChange}
                        error={errors.age}
                    />
                </Grid>

                {/* Genero */}
                <Grid item xs={6}>
                    <TextField
                        variant="standard"
                        label="Gênero"
                        name="gender"
                        value={values.gender}
                        fullWidth
                        onChange={handleChange}
                        error={errors.gender}
                    />
                </Grid>

                {/* Peso */}
                <Grid item xs={6}>
                    <TextField
                        variant="standard"
                        label="Peso"
                        name="weight"
                        value={values.weight}
                        fullWidth
                        onChange={handleChange}
                        error={errors.weight}
                    />
                </Grid>
                
                {/* Profeissão */}
                <Grid item xs={6}>
                    <TextField
                        variant="standard"
                        label="Profissão"
                        name="occupation"
                        value={values.occupation}
                        fullWidth
                        onChange={handleChange}
                        error={errors.occupation}
                    />
                </Grid>

                {/* Quando nasceu */}
                <Grid item xs={6}>
                    <TextField
                        variant="standard"
                        label="Quando nasceu"
                        name="birth"
                        value={values.birth}
                        fullWidth
                        onChange={handleChange}
                        error={errors.birth}
                    />
                </Grid>

                {/* Onde nasceu */}
                <Grid item xs={6}>
                    <TextField
                        variant="standard"
                        label="Onde nasceu"
                        name="birthplace"
                        value={values.birthplace}
                        fullWidth
                        onChange={handleChange}
                        error={errors.birthplace}
                    />
                </Grid>

                {/* Maior medo */}
                <Grid item xs={12}>
                    <TextField
                        variant="standard"
                        label="Maior medo"
                        name="fear"
                        value={values.fear}
                        fullWidth
                        onChange={handleChange}
                        error={errors.fear}
                    />
                </Grid>

                {/* Background do personagem */}
                <Grid item xs={12}>
                    <TextField
                        variant="standard"
                        multiline
                        maxRows={4}
                        label="Sobre o personagem"
                        name="background"
                        value={values.background}
                        fullWidth
                        onChange={handleChange}
                        error={errors.background}
                    />
                </Grid>

                <Grid item xs={12}>
                    <div style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
                        {
                            isSubmitting && (
                                <Loader size={30} style={{ marginRight: '10px' }} />
                            )
                        }
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Salvar
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </Form>
      )}
    </Formik>
)


export default CharacterInfoForm;
