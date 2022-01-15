import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Grid, Container, Button, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';

import { api } from '../../utils';

import socket from '../../utils/socket';

import {
  Header, Section, StatusBar, SheetEditableRow,
  DiceRollModal, StatusBarModal, ChangePictureModal
} from '../../components';

import {
  CharacterInfoForm
} from '../../components/forms';

import useModal from '../../hooks/useModal';

import { prisma } from '../../database';

export const getServerSideProps = async ({ params }) => {
  const characterId = isNaN(params.id) ? null : Number(params.id);

  if(!characterId) {
    return {
      props: {
        character: null
      }
    }
  }

  const character = await prisma.character.findUnique({
    where: {
      id: characterId
    },
    include: {
        attributes: {
            include: {
                attribute: true
            }
        },
        skills: {
            include: {
                skill: true
            }
        }
    }
  });

  if(!character) {
    return {
      props: {
        character: null
      }
    }
  }

  const serialized = JSON.parse(JSON.stringify(character));

  return {
    props: {
      rawCharacter: serialized
    }
  }
}

function Sheet({
  classes,
  rawCharacter
}) {
  const router = useRouter();

  const refreshData = () => {
    return router.replace(router.asPath);
  }

  const [character, setCharacter] = useState(rawCharacter);

  const onCharacterInfoSubmit = async values => {
    return new Promise((resolve, reject) => {
      api.put(`/character/${character.id}`, values)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
    });
  }

  // Atualiza(update) o valor de VIDA no banco
  const onHitPointsModalSubmit = async newData => {
    return new Promise((resolve, reject) => {
      const data = {
        current_hit_points: Number(newData.current),
        max_hit_points: Number(newData.max)
      }

      api
        .put(`/character/${character.id}`, data)
        .then(() => {
          updateCharacterState(data);

          resolve();

          socket.emit('update_hit_points', { character_id: character.id, current: data.current_hit_points, max: data.max_hit_points });
        })
        .catch(err => {
          alert(`Erro ao atualizar a vida!`, err);

          reject();
        });
    });
  }

  // Atualiza(update) o valor de SANIDADE no banco
  const onSanityPointsModalSubmit = async newData => {
    return new Promise((resolve, reject) => {
      const data = {
        current_sanity_points: Number(newData.current),
        max_sanity_points: Number(newData.max)
      }

      api
        .put(`/character/${character.id}`, data)
        .then(() => {
          updateCharacterState(data);

          resolve();

          socket.emit('update_hit_points', { character_id: character.id, current: data.current_sanity_points, max: data.max_sanity_points });
        })
        .catch(err => {
          alert(`Erro ao atualizar a sanidade!`, err);

          reject();
        });
    });
  }
  
  useEffect(() => {
    setCharacter(rawCharacter);
  }, [rawCharacter]);

  const updateCharacterState = data => {
    return setCharacter(prevState => ({
      ...prevState,
      ...data
    }));
  }

  // Modal de vida
  const hitPointsModal = useModal(({ close }) => (
    <StatusBarModal
      type="hp"
      onSubmit={async newData => {
        onHitPointsModalSubmit(newData).then(() => close());
      }}
      handleClose={close}
      data={{
        current: character.current_hit_points,
        max: character.max_hit_points
      }}
    />
  ));

  // Modal de Sanidade
  const sanityPointsModal = useModal(({ close }) => (
    <StatusBarModal
      type="sn"
      onSubmit={async newData => {
        onSanityPointsModalSubmit(newData).then(() => close());
      }}
      handleClose={close}
      data={{
        current: character.current_sanity_points,
        max: character.max_sanity_points
      }}
    />
  ));

  const diceRollModal = useModal(({ close }) => (
    <DiceRollModal
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
      characterId={character.id}
    />
  ));

  const changePictureModal = useModal(({ close }) => (
    <ChangePictureModal
      onPictureChange={() => refreshData()}
      handleClose={close}
      character={character}
    />
  ));

  const updateCharacterAttributeValue = (attribute, value) => {
    const index = character.attributes.findIndex(a => a.attribute_id === attribute.attribute_id);

    const newArray = character.attributes;

    newArray[index] = {
      ...attribute,
      value
    }

    setCharacter(prevState => ({
      ...prevState,
      attributes: newArray
    }));
  }

  const updateCharacterSkillValue = (skill, value) => {
    const index = character.skills.findIndex(s => s.skill_id === skill.skill_id);

    const newArray = character.skills;

    newArray[index] = {
      ...skill,
      value
    }

    setCharacter(prevState => ({
      ...prevState,
      skills: newArray
    }));
  }

  const getCharacterPictureURL = () => {
    if(!character) {
      return null;
    }

    if(character.standard_character_picture_url && character.injured_character_picture_url) {
      if(character.current_hit_points > (character.max_hit_points / 2)) {
        return character.standard_character_picture_url;
      }
      else {
        return character.injured_character_picture_url;
      }
    } else {
      return `/assets/character.png`
    }
  }

  if(!rawCharacter) {
    return (
      <div>Personagem não existe!</div>
    );
  }

  return (
    <Container style={{ marginBottom: '30px', maxWidth:'90%' }}>
        <Head>
          <title>{character.name}</title>
        </Head>

        <Grid container item spacing={3}>
          <Header title={`${character.name}`} />

          <Grid container item xs={12} spacing={3}>
            {/* Grid de imagem, vida e sanidade de personagem */}
            <Grid item xs={12} md={4}>
              <Section>
                <Grid container item spacing={3} className={classes.alignCenter}>
                  {/* Imagem do personagem */}
                  <Grid item xs={6} className={classes.alignCenter}>
                    <Image
                      src={getCharacterPictureURL()}
                      alt="Imagem de jogador"
                      className={classes.characterImage}
                      width={122}
                      height={122}
                      onClick={() => changePictureModal.appear()}
                    />
                  </Grid>

                  {/* Vida do personagem*/}
                  <Grid item xs={12} className={classes.alignCenter}>
                    <Grid container item xs={12} className={classes.bar}>
                      <Grid item xs={12} className={classes.barTitle}>
                        <span>Vida</span>
                      </Grid>
                      <Grid item xs={12}>
                        <StatusBar
                          current={character.current_hit_points} // Vida Atual
                          max={character.max_hit_points} // Vida Total
                          label={`${character.current_hit_points}/${character.max_hit_points}`}
                          primaryColor={`${'#640101'}`}
                          secondaryColor="#1b1517"
                          onClick={() => {
                            hitPointsModal.appear();
                          }}
                        />
                      </Grid>                      
                    </Grid>
                    
                  </Grid>

                  {/* Sanidade do personagem*/}
                  <Grid item xs={12} className={classes.alignCenter}>
                    <Grid container item xs={12} className={classes.bar}>
                      <Grid item xs={12} className={classes.barTitle}>
                        <span>Sanidade</span>
                      </Grid>
                      <Grid item xs={12}>
                        <StatusBar
                          current={character.current_sanity_points} // Sanidade Atual
                          max={character.max_sanity_points} // Sanidade Total
                          label={`${character.current_sanity_points}/${character.max_sanity_points}`}
                          primaryColor={`${'#011B64'}`}
                          secondaryColor="#1b1517"
                          onClick={() => {
                            sanityPointsModal.appear();
                          }}
                        />
                      </Grid>                      
                    </Grid>
                  </Grid>

                  {/* Dado para rolagem d100 */}
                  <Grid item xs={6} className={classes.alignCenter}>
                    <Image
                      src={'/assets/dice.png'}
                      alt="Dice roll"
                      className={classes.dice}
                      width={80}
                      height={80}

                      onClick={() => diceRollModal.appear()}
                    />
                    {/* <Button
                      variant="contained"
                      onClick={() => diceRollModal.appear()}
                    >
                      ROLAR DADOS
                    </Button> */}
                  </Grid>

                </Grid>
              </Section>
            </Grid>

            {/* Grid contendo todos os dados pessoais do personagem */}
            <Grid item xs={12} md={8}>
              <Section title="Ficha de personagem">
                <Grid container item xs={12}>
                  <Grid item xs={12}>
                    <CharacterInfoForm
                      initialValues={character}
                      onSubmit={onCharacterInfoSubmit}
                    />
                  </Grid>
                </Grid>
              </Section>
            </Grid>

            {/* Inventario */}
            <Grid item xs={12} md={4}>
              <Section title="Inventário   " image="/assets/Inventory.png">
              </Section>
            </Grid>

            {/* Atributos de habilidade */}
            <Grid item xs={12} md={8}>
              <Section title="Atributos   " image="/assets/atributes.png">
                <Grid container item xs={12} spacing={3} style={{display: 'flex', flexFlow: 'row wap', justifyContent: 'center'}}>
                  {
                    character.attributes.map((each, index) => (
                      <Grid item xs={2} key={index}>
                        <SheetEditableRow image="/assets/dice.png"
                          data={{
                            name: each.attribute.name,
                            value: each.value,
                            description: each.attribute.description
                          }}
                          onValueChange={newValue => {
                            api.put('/character/attribute', {
                              character_id: character.id,
                              attribute_id: each.attribute.id,
                              value: newValue
                            })
                            .catch(err => {
                              alert(`Erro ao atualizar o valor! Erro: ${err.toString()}`);
                            })
                          }}
                          onInput={newValue => {
                            updateCharacterAttributeValue(each, newValue);
                          }}
                        />
                      </Grid>
                    ))
                  }
                </Grid>
              </Section>
            </Grid>

            {/* Combate */}
            <Grid item xs={12}>
              <Section title="Combate   " image="/assets/slash.png">

              </Section>
            </Grid>
            
            {/* Item especial */}
            <Grid item xs={12} md={4}>
              <Section title="Item especial   " image="/assets/specialItem.png">
              <Grid item xs={12}>
                    <TextField
                        variant="standard"
                        multiline
                        rows={6}
                        name="specialItem"
                        fullWidth
                    />
                </Grid>
              </Section>
            </Grid>

            {/* Pericias */}
            <Grid item xs={8}>
              <Section title="Perícias   " image="/assets/expertise.png">
                <Grid container item xs={12} spacing={3} style={{display: 'flex', flexFlow: 'row wap', justifyContent: 'center'}}>
                  {
                    character.skills.map((each, index) => (
                      <Grid item xs={2} key={index}>
                        <SheetEditableRow image="/assets/expertiseRoll.png"
                          data={{
                            name: each.skill.name,
                            value: each.value,
                            description: each.skill.description
                          }}
                          onValueChange={newValue => {
                            api.put('/character/skill', {
                              character_id: character.id,
                              skill_id: each.skill.id,
                              value: newValue
                            })
                            .catch(err => {
                              alert(`Erro ao atualizar o valor! Erro: ${err.toString()}`);
                            })
                          }}
                          onInput={newValue => {
                            updateCharacterSkillValue(each, newValue);
                          }}
                        />
                      </Grid>
                    ))
                  }
                </Grid>
              </Section>
            </Grid>
          </Grid>
        </Grid>
      </Container>
  )
}

const styles = (theme) => ({
  characterImage: {
    width: '200px',
    borderRadius: '50%',
    cursor: 'pointer'
  },

  alignCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  bar: {
    marginBottom: '2px'
  },

  barTitle: {
    marginBottom: '2px',
    color: theme.palette.secondary.main,
    // textTransform: 'uppercase',
    fontSize: '15px',
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
});

export default withStyles(styles)(Sheet);
