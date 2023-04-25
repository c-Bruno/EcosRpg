import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) =>
    b.map((item) => {
      if (item.name) {
        item.name.indexOf(value) !== -1;
      }
    })
  );
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferAttributesList(props) {
  const [checked, setChecked] = React.useState([]);
  // Cria uma lista com todos os atributos que ainda não foram agrupados
  const [UngroupedAttributes, setLeft] = React.useState(
    props.attributes
      .filter((attribute) => !attribute.skill_id)
      .map((attribute, index) => {
        return {
          id: attribute.id,
          name: attribute.name,
          description: attribute.description,
          skill_id: attribute.skill_id,
        };
      })
  );

  const [right, setRight] = React.useState([
    "Charme",
    "Medicina",
    "Natação",
    "Religião",
  ]);

  const leftChecked = intersection(checked, UngroupedAttributes);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const changeList = (skill) => {
    console.log(skill);
  };

  const handleCheckedRight = () => {
    var attributeToUpdate, dividedItem;
    leftChecked.map(
      (item, index) => (
        (dividedItem = item.split(" - ")),
        // Atribui o novo valor de skill para os atributos necessarios
        (attributeToUpdate = UngroupedAttributes.filter(
          (attribute) => attribute.id == dividedItem[0]
        ).map((itemUngroupeded) => {
          itemUngroupeded.skill_id = 4;
          return itemUngroupeded;
        }))
      )
    );
  };

  const handleCheckedLeft = () => {
    setLeft(UngroupedAttributes.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1, mx: 0.5, fontSize: 10 }}
        title={title}
        subheader={`${items.length} no total`}
      />
      <Divider />
      <List
        sx={{
          width: 300,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem">
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {/* Primeira lista com atributos não classificados */}
      <Grid item>
        {customList(
          "Não classificadas",
          UngroupedAttributes.map((item) => {
            return item.name;
          })
        )}
      </Grid>

      {/* Lista de cada atributo agrupada por preicia */}
      {props.skills.map((skill) => (
        <Grid item key={skill.id}>
          {customList(
            skill.name,
            props.attributes
              .filter((attribute) => attribute.skill_id == skill.id)
              .map((attribute, index) => {
                return [attribute.name];
              })
          )}
        </Grid>
      ))}
    </Grid>
  );
}
