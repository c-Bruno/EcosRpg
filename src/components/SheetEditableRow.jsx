import React from 'react'
import { withStyles } from '@mui/styles'
import Image from 'next/image';

import { Grid, TextField, Alert } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify';
import { render } from 'react-dom';
import 'react-toastify/dist/ReactToastify.min.css'; 

import useModal from '../hooks/useModal';

import { InfoModal, DiceRollModal } from '../components';

const styles = theme => ({
    name: {
        display: 'flex',
        alignItems: 'center',
    },

    textName: {
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: 'bold'
    },

    dice: {
        cursor: 'pointer',
        transition: '-webkit-transform .8s ease-in-out',
        transform: 'transform .8s ease-in-out',
    
        "&:hover":{
          transition: 'rotate(360deg)',
          transform: 'rotate(360deg)'
        }
    },

    marginAuto: {
        marginLeft: 'auto', 
        marginRight: 'auto'
    }
});

const SheetEditableRow = ({
    classes,
    data,
    image,
    onValueChange,
    onInput,

    avaliableSkills
}) => {
    // console.log(data)
    const infoModal = useModal(({ close }) => (
        <InfoModal
            title={data.name}
            text={data.description}
            handleClose={close}
        />
    ));

    const diceRollModal = useModal(({ close }) => (
        <DiceRollModal
            amount={'1d20'}
            // character={character}
            atribute={data.name}
            valueAtribute={data.value}
            skillAttibute={data.skill_id}
            avaliableSkills={avaliableSkills}
            onDiceRoll={rollData => {
                const parsedData = {
                character_id: character.id,
                rolls: rollData.map(each => ({
                    rolled_number: each.rolled_number,
                    max_number: each.max_number
                }))
                }

                socket.emit('dice_roll', parsedData);
            }}
            handleClose={close}
        />
    ));

    return (
        <div className={classes.root}>
            <Grid container direction="column" alignItems="center" justify="center">
                {/* Imagem do dado para rolagem no atributo */}
                <Grid item xs={7}>
                    <Image
                        src={image}
                        alt="Dice roll"
                        className={[classes.dice].join(" ")}
                        width={40}
                        height={40}

                        onClick={() => {data.value ? diceRollModal.appear() : toast.error('Primeiro preencha o valor do atributo')}}
                    />
                </Grid>

                {/* Nome do atributo com acionamento para o modal de informação */}
                <Grid item xs={7} className={classes.name}>
                    <span className={classes.textName} onClick={() => infoModal.appear()}>
                        {data.name}
                    </span>
                </Grid>

                {/* Text para digitar o valor do atributo */}
                <Grid xs={7}>
                    <TextField
                        value={data.value}
                        variant="standard"
                        fullWidth
                        inputProps={{
                            style: {
                                padding: 8,
                                textAlign: 'center'
                            }
                        }}
                        onBlur={event => onValueChange(event.target.value)}
                        onChange={event => onInput(event.target.value)}
                    />
                </Grid>
            </Grid>
            <ToastContainer />
        </div>
    )
}

//render(<SheetEditableRow/>);

export default withStyles(styles)(SheetEditableRow);