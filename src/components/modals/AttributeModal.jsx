import React, { useState, useEffect } from 'react';
import { withStyles } from '@mui/styles';
import {
    TextField, Dialog, DialogActions, DialogContent, Grid,
    DialogTitle, Button
} from '@mui/material'

import { toast, ToastContainer } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { api } from '../../utils';

function AttributeModal({
    classes,
    handleClose,

    onSubmit,
    data,
    operation,
    attributeSkill 
}) {
    const [attribute, setAttribute] = useState({
        name: '',
        description: '',
        skill_id: ''
    });

    useEffect(() => {
        if(!data) {
            return;
        }

        setAttribute({
            name: data.name,
            description: data.description,
            skill_id: data.skill_id
        });
    }, [data]);
    
    const resetState = () => {
        return setAttribute({
            name: '',
            description: '', 
            skill_id: ''
        });
    }

    const submit = () => {
        if(!attribute.name) {
            return;
        }

        if(operation === 'create') {
            api.post('/attribute', attribute)
                .then(() => {
                    // Callback
                    onSubmit();

                    // Close modal
                    handleClose();

                    resetState();
                })
                .catch(() => {
                    toast.error('Erro ao criar o atributo!');
                });
        }
        else if (operation === 'edit') {
            api.put(`/attribute/${data.id}`, attribute)
                .then(() => {
                    // Callback
                    onSubmit();

                    // Close modal
                    handleClose();

                    resetState();
                })
                .catch(err => {
                    toast.error('Erro ao editar o atributo!');
                });
        }
    }

    return (
        <Dialog
            open={true}
            onClose={handleClose}
        >
            <DialogTitle>
                {
                    operation === 'create' ? 'Criar novo atributo' : 'Editar atributo'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {/* Nome do atributo */}
                        <TextField
                            style={{
                                marginTop: '15px'
                            }}
                            autoFocus
                            label="Nome"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={attribute.name}
                            onChange={
                                ({ target }) => {
                                    const value = target.value;

                                    setAttribute(prevState => ({
                                        ...prevState,
                                        name: value
                                    }));
                                }
                            }
                            spellCheck={false}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        {/* Descrição do atributo */}
                        <TextField
                            style={{
                                marginTop: '15px'
                            }}
                            autoFocus
                            label="Descrição"
                            type="text"
                            fullWidth
                            multiline
                            variant="standard"
                            value={attribute.description}
                            onChange={
                                ({ target }) => {
                                    const value = target.value;

                                    setAttribute(prevState => ({
                                        ...prevState,
                                        description: value
                                    }));
                                }
                            }
                            spellCheck={false}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Perícia</InputLabel>
                            <Select
                                labelId="skill_id"
                                id="skill_id"
                                value={attribute.skill_id}
                                label="Perícia"
                                onChange={
                                    ({ target }) => {
                                        const value = target.value;
    
                                        setAttribute(prevState => ({
                                            ...prevState,
                                            skill_id: value
                                        }));
                                    }
                                }
                                >

                                {attributeSkill.map((skill, index) => (
                                    <MenuItem key={skill.id} value={skill.id}>{skill.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="secondary"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={submit}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const styles = theme => ({

}) 

export default withStyles(styles)(AttributeModal);