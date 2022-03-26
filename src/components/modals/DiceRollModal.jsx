import React, { useState } from 'react';
import { withStyles } from '@mui/styles';
import Image from 'next/image';
import {
    TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material'

import { api } from '../../utils'

const styles = (theme) => ({
    dice: {
        transition: '-webkit-transform .8s ease-in-out',
        transform: 'transform .8s ease-in-out',
    }
})

function DiceRollModal({
    classes,
    handleClose,

    amount,
    valueAtribute,
    atribute,
    
    characterId,
    onDiceRoll
}) {
    var diceNumber = {number: ''}
    var diceTypeResult = {description: ''}

    function rollDamage(amountDamage) {            
        const diceRandomNumber = rollDice(amountDamage)
        diceNumber = {number: diceRandomNumber}

        if (atribute){
            const diceType = calcDice(atribute, amount, diceRandomNumber) 
            diceTypeResult = {description: diceType}
            console.log(diceType)
        }

        setTimeout(() => {      
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
        let [count, max] = dice.split('d')// Separar a quantidade de dados, para o valor do dado

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

    // Calcula qual o tipo do resultado do dado (Extremo, Bom, Normal, Fracasso)
    function calcDice(atribute, ability, dice) {
        const charisma = ['Lábia', 'Persuasão'] // CARISMA
        const dexterity = ['Arma de Fogo', 'Esquivar', 'Furtividade', 'Percepção Passiva'] // DESTREZA
        const force = ['Arma Branca', 'Atletismo', 'Nadar'] // FORÇA
        const intelligence = ['Arcanismo', 'Religião', 'Reparos', 'Medicina'] // INTELIGENCIA
        const wisdom = ['Encontrar', 'Percepção', 'Intuição', 'Rastrear', ] // SABEDORIA
    
        // if (charisma.indexOf(atribute) > -1){
        // ability += parseInt(data.expertise[0].amount) // CARISMA
        // } else if (dexterity.indexOf(atribute) > -1){
        // ability += parseInt(data.expertise[1].amount) // DESTREZA
        // } else if (force.indexOf(atribute) > -1){
        // ability += parseInt(data.expertise[2].amount) // FORÇA
        // } else if (intelligence.indexOf(atribute) > -1){
        // ability += parseInt(data.expertise[3].amount) // INTELIGENCIA
        // } else if (wisdom.indexOf(atribute) > -1){
        // ability += parseInt(data.expertise[4].amount) // SABEDORIA
        // } 
    
        // Constante contendo todas as variações com base no ATRIBUTO + PERICIA
        const table = [
        { extremeFail:10, normal: 20 }, // Atributos com valor = 1
        { extremeFail:10, normal: 19, good: 20 }, // Atributos com valor = 2
        { extremeFail:10, normal: 18, good: 20 }, // Atributos com valor = 3
        { extremeFail:10, normal: 17, good: 19 }, // Atributos com valor = 4
        { extremeFail:10, normal: 16, good: 19, extreme: 20 }, // Atributos com valor = 5
        { extremeFail:10, normal: 15, good: 19, extreme: 20 }, // Atributos com valor = 6
        { extremeFail:8,  normal: 14, good: 18, extreme: 20 }, // Atributos com valor = 7
        { extremeFail:8,  normal: 13, good: 18, extreme: 20 }, // Atributos com valor = 8
        { extremeFail:6,  normal: 12, good: 17, extreme: 20 }, // Atributos com valor = 9
        { extremeFail:6,  normal: 11, good: 17, extreme: 20 }, // Atributos com valor = 10
        { extremeFail:4,  normal: 10, good: 16, extreme: 20 }, // Atributos com valor = 11
        { extremeFail:4,  normal: 9,  good: 16, extreme: 19 }, // Atributos com valor = 12
        { extremeFail:3,  normal: 8,  good: 16, extreme: 19 }, // Atributos com valor = 13
        { extremeFail:3,  normal: 7,  good: 15, extreme: 19 }, // Atributos com valor = 14
        { extremeFail:3,  normal: 6,  good: 14, extreme: 19 }, // Atributos com valor = 15
        { extremeFail:2,  normal: 5,  good: 14, extreme: 18 }, // Atributos com valor = 16
        { extremeFail:2,  normal: 5,  good: 14, extreme: 18 }, // Atributos com valor = 17
        { extremeFail:2,  normal: 5,  good: 13, extreme: 18 }, // Atributos com valor = 18
        { extremeFail:2,  normal: 5,  good: 12, extreme: 18 }, // Atributos com valor = 19
        { extremeFail:2,  normal: 5,  good: 12, extreme: 18 }, // Atributos com valor = 20
        { extremeFail:2,  normal: 5,  good: 11, extreme: 17 }, // Atributos com valor iguais ou superiores a 21
        ]
    
        const type = (ability <= 20) ? table[ability - 1] : table[20] // Verificar a faixa de valor que vai ser utilizada 
        if (dice >= type.extreme) return 'Extremo'
        if (dice >= type.good) return 'Sucesso Bom'
        if (dice >= type.normal) return 'Sucesso Normal'
        if (dice >= type.extremeFail) return 'Fracasso'
        if (dice < type.extremeFail) return 'Fracasso extremo'
    }

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="100vh">
            <DialogContent onLoad={ rollDamage(amount) }>
                {
                    <Grid container>
                        <Grid item xs={12}
                            container spacing={0}
                            alignItems="center"
                            justifyContent="center">
                            <Image
                                src={'/assets/dice.png'}
                                alt="Dice roll"
                                className={ classes.dice }
                                width={40}
                                height={40}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{width: 500, maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2%'}}>
                                <TextField
                                    fullWidth
                                    inputProps={{min: 0, style: { textAlign: 'center' }}}
                                    type="text"
                                    variant="standard"
                                    value={ diceNumber.number }
                                    disabled
                                />
                            </Box>
                        </Grid>

                        { atribute ? (
                            <Grid item xs={12}>
                                <Box sx={{width: 500, maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2%'}}>
                                    <TextField
                                        fullWidth
                                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                                        type="text"
                                        variant="standard"
                                        value={ diceTypeResult.description }
                                        disabled
                                    />
                                </Box>
                            </Grid>)
                        : (atribute)}
                    </Grid>
                }
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="secondary"
                >
                    Fechar
                </Button>
                {/* <Button
                    onClick={() => {
                        return rollDamage('1d100')
                    }}
                    disabled={buttonDisabled}
                >
                    {result ? 'Rolar Outro Dado' : 'Rolar'}
                </Button> */}
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(DiceRollModal);