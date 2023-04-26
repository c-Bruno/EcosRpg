import { Add as AddIcon } from "@mui/icons-material";
import { Button, Container, Grid, TextField, Tooltip } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { withStyles } from "@mui/styles";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  EditableRow,
  Header,
  Section,
  SheetEditableRow,
  StatusBar,
  TableBox,
} from "../../components";
import { CharacterInfoForm } from "../../components/forms";
import {
  ChangePictureModal,
  CombatModal,
  ConfirmationModal,
  DiceRollModal,
  InventoryModal,
  StatusBarModal,
} from "../../components/modals";
import { prisma } from "../../database";
import useModal from "../../hooks/useModal.hook";
import { api } from "../../utils";
import socket from "../../utils/socket";

const styles = (theme) => ({
  characterImage: {
    width: "200px",
    borderRadius: "50%",
    cursor: "pointer",
  },

  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  bar: {
    marginBottom: "2px",
  },

  barTitle: {
    marginBottom: "2px",
    color: theme.palette.secondary.main,
    fontSize: "15px",
    fontWeight: "bold",
  },

  dice: {
    cursor: "pointer",
    transition: "-webkit-transform .8s ease-in-out",
    transform: "transform .8s ease-in-out",

    "&:hover": {
      transition: "rotate(360deg)",
      transform: "rotate(360deg)",
    },
  },
});

export const getServerSideProps = async ({ params }) => {
  const characterId = isNaN(params.id) ? null : Number(params.id);

  if (!characterId) {
    return {
      props: {
        character: null,
      },
    };
  }

  // Recupera o personagem no banco
  const character = await prisma.character.findUnique({
    where: {
      id: characterId,
    },
    include: {
      attributes: {
        include: {
          attribute: true,
        },
      },
      skills: {
        include: {
          skill: true,
        },
      },
      inventory: {
        include: {
          inventory: true,
        },
      },
      combat: {
        include: {
          combat: true,
        },
      },
    },
  });

  // Se não tiver, seta como null para notificar que não existe
  if (!character) {
    return {
      props: {
        character: null,
      },
    };
  }

  const serialized = JSON.parse(JSON.stringify(character));

  return {
    props: {
      rawCharacter: serialized,
    },
  };
};

function Sheet({ classes, rawCharacter }) {
  const router = useRouter();

  const refreshData = () => {
    return router.replace(router.asPath);
  };

  const [character, setCharacter] = useState(rawCharacter);

  const onCharacterInfoSubmit = async (values) => {
    return new Promise((resolve, reject) => {
      api
        .put(`/character/${character.id}`, values)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  };

  // Atualiza(update) o valor de VIDA no banco
  const onHitPointsModalSubmit = async (newData) => {
    return new Promise((resolve, reject) => {
      const data = {
        current_hit_points: Number(newData.current),
        max_hit_points: Number(newData.max),
      };

      api
        .put(`/character/${character.id}`, data)
        .then(() => {
          updateCharacterState(data);

          resolve();

          socket.emit("update_hit_points", {
            character_id: character.id,
            current: data.current_hit_points,
            max: data.max_hit_points,
          });
        })
        .catch((err) => {
          toast.error(`Erro ao atualizar a vida!`, err);

          reject();
        });
    });
  };

  // Atualiza(update) o valor de SANIDADE no banco
  const onSanityPointsModalSubmit = async (newData) => {
    return new Promise((resolve, reject) => {
      const data = {
        current_sanity_points: Number(newData.current),
        max_sanity_points: Number(newData.max),
      };

      api
        .put(`/character/${character.id}`, data)
        .then(() => {
          updateCharacterState(data);
          resolve();

          socket.emit("update_hit_points", {
            character_id: character.id,
            current: data.current_sanity_points,
            max: data.max_sanity_points,
          });
        })
        .catch((err) => {
          toast.error(`Erro ao atualizar a sanidade!`, err);
          reject();
        });
    });
  };

  useEffect(() => {
    setCharacter(rawCharacter);
  }, [rawCharacter]);

  const updateCharacterState = (data) => {
    return setCharacter((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  // Modal de confirmação
  const confirmationModal = useModal(({ close, custom }) => (
    <ConfirmationModal
      title={custom.title}
      text={custom.text}
      data={custom.data}
      handleClose={close}
      onConfirmation={(data) => {
        const { id, type } = data;

        api
          .delete(`/${type}/${id}`)
          .then(() => {
            window.location.reload(false);
          })
          .catch(() => {
            toast.error(`Erro ao apagar: ${type}`);
          });
      }}
    />
  ));

  // Modal de vida
  const hitPointsModal = useModal(({ close }) => (
    <StatusBarModal
      type="hp"
      onSubmit={async (newData) => {
        onHitPointsModalSubmit(newData).then(() => close());
      }}
      handleClose={close}
      data={{
        current: character.current_hit_points,
        max: character.max_hit_points,
      }}
    />
  ));

  // Modal de Sanidade
  const sanityPointsModal = useModal(({ close }) => (
    <StatusBarModal
      type="sn"
      onSubmit={async (newData) => {
        onSanityPointsModalSubmit(newData).then(() => close());
      }}
      handleClose={close}
      data={{
        current: character.current_sanity_points,
        max: character.max_sanity_points,
      }}
    />
  ));

  // Modal dos dados
  const diceRollModal = useModal(({ close }) => (
    <DiceRollModal
      amount={"1d100"}
      onDiceRoll={(rollData) => {
        const parsedData = {
          character_id: character.id,
          rolls: rollData.map((each) => ({
            rolled_number: each.rolled_number,
            max_number: each.max_number,
          })),
        };

        socket.emit("dice_roll", parsedData);
      }}
      handleClose={close}
      characterId={character.id}
    />
  ));

  // Alterar foto de personagem
  const changePictureModal = useModal(({ close }) => (
    <ChangePictureModal
      onPictureChange={() => refreshData()}
      handleClose={close}
      character={character}
    />
  ));

  // Aciona o modal de inventario
  const inventoryModal = useModal(({ close, custom }) => (
    <InventoryModal
      handleClose={close}
      data={custom.data || null}
      character={custom.character || custom.data.character_id}
      totalSpace={custom.space}
      onSubmit={() => {
        window.location.reload(false);
      }}
      operation={custom.operation}
    />
  ));

  // Aciona o modal de combate
  const combatModal = useModal(({ close, custom }) => (
    <CombatModal
      handleClose={close}
      data={custom.data || null}
      character={custom.character || custom.data.character_id}
      onSubmit={() => {
        window.location.reload(false);
      }}
      operation={custom.operation}
    />
  ));

  // Atualiza o valor do atributo ao digitar
  const updateCharacterAttributeValue = (attribute, value) => {
    const index = character.attributes.findIndex(
      (a) => a.attribute_id === attribute.attribute_id
    );
    const newArray = character.attributes;

    newArray[index] = {
      ...attribute,
      value,
    };

    setCharacter((prevState) => ({
      ...prevState,
      attributes: newArray,
    }));
  };

  // Atualiza o valor da pericia ao digitar
  const updateCharacterSkillValue = (skill, value) => {
    const index = character.skills.findIndex(
      (s) => s.skill_id === skill.skill_id
    );
    const newArray = character.skills;

    newArray[index] = {
      ...skill,
      value,
    };

    setCharacter((prevState) => ({
      ...prevState,
      skills: newArray,
    }));
  };

  var temporiza;
  // Atualiza o valor do item especial ao digitar
  const updateCharacterSpecialItem = (value) => {
    clearTimeout(temporiza);
    // Temporizador para que o usuario só seja salvo após 3 segundos sem digitar nada no campo
    temporiza = setTimeout(function () {
      api
        .put(`/character/${character.id}`, { specialItem: value.target.value })
        .then(() => {})
        .catch(() => {
          toast.error(`Erro ao atualizar o item especial!`);
        });
    }, 5000);
  };

  // Encontra no banco a imagem atual
  const getCharacterPictureURL = () => {
    if (!character) {
      return null;
    }

    if (
      character.standard_character_picture_url &&
      character.injured_character_picture_url
    ) {
      if (character.current_hit_points > character.max_hit_points / 2) {
        return character.standard_character_picture_url;
      } else {
        return character.injured_character_picture_url;
      }
    } else {
      return `/assets/character.png`;
    }
  };

  const calcSpaceInventory = () => {
    var totalSpace = 10; // Inicia com 10 espaços no inventario
    var ocupedSpaces = 0; // Inicializa espaços ocupados com 0

    if (!character) {
      return null;
    } else if (character.skills) {
      character.skills.map(function (item, i) {
        // Checar a carga maxima disponivel para o inventario
        if (
          item.skill.name.toUpperCase().match("FORÇA") ||
          item.skill.name.toUpperCase().match("FORCA")
        ) {
          totalSpace += Number(item.value) * 2; // Para cada ponto de força, o personagem ganha mais 2 espaços no invetario
        }
      });

      character.inventory.map(function (item, i) {
        // Verifica quanto já esta ocupado
        ocupedSpaces += Number(item.inventory.weight);
      });

      return totalSpace - ocupedSpaces;
    }
  };

  if (!rawCharacter) {
    return <div>Personagem não existe!</div>;
  }

  return (
    <Container style={{ marginBottom: "30px", maxWidth: "1400px" }}>
      <Head>
        <title>{character.name} | RPG</title>
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
                        label={`${character.current_hit_points}/${character.max_hit_points}`} // Valor exibido em tela
                        primaryColor="#640101"
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
                        label={`${character.current_sanity_points}/${character.max_sanity_points}`} // Valor exibido em tela
                        primaryColor="#011B64"
                        secondaryColor="#1b1517"
                        onClick={() => {
                          sanityPointsModal.appear();
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} className={classes.alignCenter}>
                  <FormControlLabel
                    control={<Switch color="secondary" />}
                    label="Traumatizado"
                  />
                  <FormControlLabel
                    control={<Switch color="secondary" />}
                    label="Morrendo"
                  />
                </Grid>

                {/* Dado para rolagem d100 */}
                <Grid item xs={6} className={classes.alignCenter}>
                  <Image
                    width={80}
                    height={80}
                    alt="Dice roll"
                    src={"/assets/dice.png"}
                    className={classes.dice}
                    onClick={() => diceRollModal.appear()}
                  />
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
            <Section
              title="Inventário   "
              image="/assets/Inventory.png"
              renderButton={() => (
                <Button
                  variant="outlined"
                  style={{
                    display: "flex",
                    alignSelf: "center",
                  }}
                  // Botão para criar novo item
                  onClick={() =>
                    inventoryModal.appear({
                      operation: "create",
                      character: character.id,
                      space: calcSpaceInventory(),
                    })
                  }
                >
                  <AddIcon />
                </Button>
              )}
            >
              {/* Cabeçalho das informações de inventario */}
              <Grid
                container
                style={{
                  paddingBottom: "16px",
                }}
              >
                {/* Item */}
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled
                    label="ITEM"
                    variant="standard"
                    fullWidth
                  />
                </Grid>

                {/* Espaço ocupado */}
                <Grid item md={3} xs={12}>
                  <TextField
                    disabled
                    label="ESPAÇOS"
                    variant="standard"
                    fullWidth
                  />
                </Grid>

                {/* Livre */}
                <Grid item md={3} xs={12}>
                  <TextField
                    disabled
                    label={`(${calcSpaceInventory()} LIVRE)`}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Mapeia cada item disponivel para este personagem */}
              <Grid
                item
                container
                xs={12}
                spacing={2}
                className={classes.scrollableBox}
              >
                {character.inventory.map((inventory, index) => (
                  <Grid item xs={12} key={index}>
                    <EditableRow
                      data={inventory}
                      // Atualizar informação do item do inventario
                      editRow={(data) => {
                        inventoryModal.appear({
                          operation: "edit",
                          data,
                          space: calcSpaceInventory(),
                        });
                      }}
                      // Deletar item do inventario
                      deleteRow={(data) => {
                        confirmationModal.appear({
                          title: "Apagar item do inventário",
                          text: "Deseja apagar este item?",
                          data: { id: data.inventory.id, type: "inventory" },
                        });
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Section>
          </Grid>

          {/* Atributos de habilidade */}
          <Grid item xs={12} md={8}>
            <Section title="Atributos   " image="/assets/atributes.png">
              <Grid
                container
                item
                xs={12}
                spacing={3}
                style={{
                  display: "flex",
                  flexFlow: "row wap",
                  justifyContent: "center",
                }}
              >
                {character.attributes.map((each, index) => (
                  <Grid item xs={2} key={index}>
                    <SheetEditableRow
                      avaliableSkills={character.skills}
                      image="/assets/dice.png"
                      data={{
                        name: each.attribute.name,
                        value: each.value,
                        description: each.attribute.description,
                        skill_id: each.attribute.skill_id,
                      }}
                      onValueChange={(newValue) => {
                        api
                          .put("/character/attribute", {
                            character_id: character.id,
                            attribute_id: each.attribute.id,
                            value: newValue,
                          })
                          .catch((err) => {
                            toast.error(
                              `Erro ao atualizar o valor! Erro: ${err.toString()}`
                            );
                          });
                      }}
                      onInput={(newValue) => {
                        updateCharacterAttributeValue(each, newValue);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Section>
          </Grid>

          {/* Combate */}
          <Grid item xs={12}>
            <Section
              title="Combate   "
              image="/assets/slash.png"
              renderButton={() => (
                <Tooltip title="Criar item">
                  <Button
                    variant="outlined"
                    style={{
                      display: "flex",
                      alignSelf: "center",
                    }}
                    onClick={() =>
                      combatModal.appear({
                        operation: "create",
                        character: character.id,
                      })
                    }
                  >
                    <AddIcon />
                  </Button>
                </Tooltip>
              )}
            >
              <TableBox character={character}></TableBox>
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
                  defaultValue={character.specialItem}
                  onKeyUp={(newValue) => {
                    updateCharacterSpecialItem(newValue);
                  }}
                />
              </Grid>
            </Section>
          </Grid>

          {/* Pericias */}
          <Grid item xs={8}>
            <Section title="Perícias   " image="/assets/expertise.png">
              <Grid
                container
                item
                xs={12}
                spacing={3}
                style={{
                  display: "flex",
                  flexFlow: "row wap",
                  justifyContent: "center",
                }}
              >
                {character.skills.map((each, index) => (
                  <Grid item xs={2} key={index}>
                    <SheetEditableRow
                      image="/assets/expertiseRoll.png"
                      data={{
                        name: each.skill.name,
                        value: each.value,
                        description: each.skill.description,
                      }}
                      onValueChange={(newValue) => {
                        api
                          .put("/character/skill", {
                            character_id: character.id,
                            skill_id: each.skill.id,
                            value: newValue,
                          })
                          .catch((err) => {
                            toast.error(
                              `Erro ao atualizar o valor! Erro: ${err.toString()}`
                            );
                          });
                      }}
                      onInput={(newValue) => {
                        updateCharacterSkillValue(each, newValue);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Section>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withStyles(styles)(Sheet);
