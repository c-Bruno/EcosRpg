import React, { useState } from 'react';
import { withStyles } from '@mui/styles';
import Image from 'next/image';
import {
    TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button, Grid, Select, MenuItem, FormControl, InputLabel
} from '@mui/material'

import { api } from '../../utils'

const styles = theme => ({
    dice: {
        transition: 'rotate(360deg)',
        transform: 'rotate(360deg)'    
    }
})

function DiceRollModal({
    classes,
    handleClose,

    characterId,
    onDiceRoll
}) {
    const [timesToRoll, setTimesToRoll] = useState(1);
    const [facesNumber, setFacesNumber] = useState(6);

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [result, setResult] = useState(null);

    // const rollDice = () => {
    //     setButtonDisabled(true);

    //     if(!timesToRoll || !facesNumber) {
    //         return window.alert('É necessário escolher todos os campos!');
    //     }

    //     if(timesToRoll < 1) {
    //         return window.alert('O número de dados precisa ser maior que 1.');
    //     }

    //     api.post('roll', {
    //         character_id: characterId,
    //         max_number: facesNumber,
    //         times: timesToRoll
    //     })
    //     .then(res => {
    //         setResult(res.data);

    //         setButtonDisabled(false);

    //         onDiceRoll(res.data);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // }

    function rollDamage(amount) {            
        setTimeout(() => {
          const diceNumber = rollDice(amount)
          console.log(diceNumber)
        //   $('#diceNumber').text(diceNumber)
      
        //   setTimeout(() => {
        //     diceModal.css('display', 'none')
        //     $('#diceNumber').text('')
        //     $('#diceType').text('')
      
        //     $('.modalDice').css('transform', 'rotate(0deg)')
        //     $('.modalDice').css('-webkit-transform', 'rotate(0deg)')
        //   }, 20000)
        }, 2000)
      }

    // Rolador de dados
    function rollDice(dice) {
        let [count, max] = dice.split('d')

        if (Number(count) && Number(max)) {
            count = Number(count) // Verifica quantas vezes vai rolar o dado
            max = Number(max) // Verifica qual o tipo de dado

            let total = 0

            for (let i = 0; i < count; i++) { 
            total += Math.floor(Math.random() * max + 1) // Sorteia um numero entre 1 e o valor do atributo
            }

            return total
        } else {
            return null
        }
    }

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogContent onLoad={rollDamage('1d100')}>
                {
                    result ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <ul
                                    style={{
                                        margin: 0, 
                                        padding: 0, 
                                        paddingLeft: '16px', 
                                        marginBottom: '16px', 
                                        listStyleType: 'square' 
                                    }}
                                >
                                    {
                                        result.map((each, index) => (
                                            <li key={index}>
                                                {each.rolled_number}
                                            </li>
                                        ))
                                    }
                                </ul>

                                {
                                    result.length > 1 && (
                                        <span>
                                            <strong>Total:</strong>
                                            <span>&nbsp;</span>
                                            {result.reduce((acc, curr) => acc + curr.rolled_number, 0)}
                                        </span>
                                    )
                                }
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                            <Image
                                src={'/assets/dice.png'}
                                alt="Dice roll"
                                className={classes.dice}
                                width={30}
                                height={30}
                            />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    label="Número de dados"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={timesToRoll}
                                    onChange={
                                        ({ target }) => {
                                            const value = target.value;

                                            setTimesToRoll(Number(value));
                                        }
                                    }
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Número de faces</InputLabel>
                                    <Select
                                        value={facesNumber}
                                        label="Número de faces"
                                        onChange={
                                            ({ target }) => {
                                                const value = target.value;
            
                                                setFacesNumber(Number(value));
                                            }
                                        }
                                    >
                                        <MenuItem value={3}>D3</MenuItem>
                                        <MenuItem value={4}>D4</MenuItem>
                                        <MenuItem value={6}>D6</MenuItem>
                                        <MenuItem value={8}>D8</MenuItem>
                                        <MenuItem value={10}>D10</MenuItem>
                                        <MenuItem value={12}>D12</MenuItem>
                                        <MenuItem value={16}>D16</MenuItem>
                                        <MenuItem value={20}>D20</MenuItem>
                                        <MenuItem value={30}>D30</MenuItem>
                                        <MenuItem value={100}>D100</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="secondary"
                >
                    Fechar
                </Button>
                    <Button
                        onClick={() => {
                            return rollDamage('1d100')
                        }}
                        disabled={buttonDisabled}
                    >
                        {result ? 'Rolar Outro Dado' : 'Rolar'}
                    </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(DiceRollModal);