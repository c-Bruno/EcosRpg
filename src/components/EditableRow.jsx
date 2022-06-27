import React from 'react'
import { withStyles } from '@mui/styles'
import {
    Delete as DeleteIcon,
    Create as EditIcon
} from '@mui/icons-material'

import { Grid, Button, TextField, Tooltip } from '@mui/material'

const styles = theme => ({ })

const EditableRow = ({
    classes,
    data,

    editRow,
    deleteRow
}) => {
    return (
        <div className={classes.root}>
            {/* Inventario do personagem */}
            <Grid container>
                {/* Descrição do item no inventario */}
                <Grid item md={6} xs={12}>
                    <TextField
                        disabled
                        value={data.name || data.inventory.description}
                        variant="standard"
                        fullWidth
                    />
                </Grid>

                {/* Peso do item no inventario */}
                {data.inventory ? (
                    <Grid item md={2} xs={12}>
                        <TextField
                            disabled 
                            value={data.inventory.weight}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                ): ( console.log("Não possui peso"))}

                {/* Remover Item */}
                <Grid item md={2} xs={6}>
                    <Tooltip title="Remover item do inventario">
                        <Button variant="outlined" onClick={() => deleteRow(data)}>
                            <DeleteIcon />
                        </Button>
                    </Tooltip>
                </Grid>

                {/* Editar Item */}
                <Grid item md={2} xs={6}>
                <Tooltip title="Editar indormações do item ">
                    <Button variant="outlined" onClick={() => editRow(data)}>
                        <EditIcon />
                    </Button>
                    </Tooltip>
                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(styles)(EditableRow);