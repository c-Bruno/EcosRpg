import React, { useState, useEffect } from 'react';
import { withStyles } from '@mui/styles';
import {
    TextField, Dialog, DialogActions, DialogContent, Grid,
    DialogTitle, Button
} from '@mui/material'

import { api } from '../../utils';
import TableBox from '../TableBox';

const styles = theme => ({

})

function CombatModal({
    classes,
    handleClose,

    onSubmit,
    data,
    operation,
    character
}) {
    const [inventory, setInventory] = useState({
        description: '',
        weight: null,
        character_id: character
    });

    useEffect(() => {
        if(!data) {
            return;
        }

        setInventory({
            description: data.inventory.description,
            weight: data.inventory.weight,
            character_id: character
        });
    }, [data]);
    
    const resetState = () => {
        return setInventory({
            description: '',
            weight: null,
            character_id: character
        });
    }

    const submit = () => {
        if(!inventory.description) {
            return;
        }

        // Se a operação for criar
        if(operation === 'create') {
            api.post('/inventory', inventory)
                .then(() => {
                    // Callback
                    onSubmit();

                    // Close modal
                    handleClose();

                    // Limpa aa informações
                    resetState();
                })
                .catch(() => {
                    alert('Erro ao criar o item!');
                });
        }  else if (operation === 'edit') { // Se a operação for editar
            api.put(`/inventory/${data.inventory.id}`, inventory)
                .then(() => {
                    // Callback
                    onSubmit();

                    // Close modal
                    handleClose();

                    resetState();
                })
                .catch(err => {
                    alert('Erro ao editar o item!');
                });
        }
    }

    return (
        <Dialog 
            fullWidth
            maxWidth="lg"
            open={true}
            onClose={handleClose}
        >
            <DialogTitle> { operation === 'create' ? 'Adicionar um novo item' : 'Editar item' }</DialogTitle>
            <DialogContent >
                <TableBox character={character} ></TableBox>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={submit}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(CombatModal);