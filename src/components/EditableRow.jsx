import React from 'react'
import { withStyles } from '@mui/styles'
import {
    Delete as DeleteIcon,
    Create as EditIcon
} from '@mui/icons-material'

import { Grid, Button, TextField } from '@mui/material'

const styles = theme => ({ })

const EditableRow = ({
    classes,
    data,

    editRow,
    deleteRow
}) => {
    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <TextField
                        disabled
                        value={data.name || data.inventory.description}
                        variant="standard"
                        fullWidth
                    />
                </Grid>

                {/* Peso em caso de exibir as informações de inventario */}
                {data.inventory ? (
                    <Grid item md={2} xs={12}>
                        <TextField
                            disabled
                            value={data.inventory.weight + " kg"}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                ): ( console.log("Não possui peso"))}
                <Grid item md={2} xs={6}>
                    <Button variant="outlined" onClick={() => deleteRow(data)}>
                        <DeleteIcon />
                    </Button>
                </Grid>
                <Grid item md={2} xs={6}>
                    <Button variant="outlined" onClick={() => editRow(data)}>
                        <EditIcon />
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(styles)(EditableRow);