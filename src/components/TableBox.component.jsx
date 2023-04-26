import { Delete as DeleteIcon, Create as EditIcon } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Button,
  Tooltip
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import { toast } from "react-toastify";
import useModal from "../hooks/useModal.hook";
import { api } from "../utils";
import { CombatModal, ConfirmationModal, DiceRollModal } from "./modals";
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="primeira página"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="página anterior"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="próxima página"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="ultima página"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

// Cria cada linha da coluna
function createData(id, weapon, type, damage, current_load, total_load) {
  return { id, weapon, type, damage, current_load, total_load };
}

// Definir dados do cabeçalho da tabela
const columns = [
  { id: "weapon", label: "ARMA", minWidth: 150 },
  { id: "type", label: "TIPO", minWidth: 100, align: "right" },
  { id: "damage", label: "DANO", minWidth: 100, align: "right" },
  { id: "current_load", label: "CARGA ATUAL", minWidth: 70, align: "right" },
  { id: "total_load", label: "CARGA MÁXIMA", minWidth: 70, align: "right" },
  { id: "options", label: "", minWidth: 100, align: "right" },
];

export default function TableBox(props) {
  // Define as linhas da tabela
  var rows = [].sort((a, b) => (a.weapon < b.weapon ? -1 : 1)); // Ordena alfabeticamente

  // Mapeia os itens que vem do banco
  const combatItems = props.character.combat;
  combatItems.map(function (nome, i) {
    rows.push(
      createData(
        nome.combat_id,
        nome.combat.weapon,
        nome.combat.type,
        nome.combat.damage,
        nome.combat.current_load,
        nome.combat.total_load
      )
    );
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const diceRollModal = useModal(
    ({ close, custom }) => (
      console.log(custom),
      (
        <DiceRollModal
          amount={custom.amount}
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
        />
      )
    )
  );

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 500 }}
        aria-label="custom pagination table"
        stickyHeader
      >
        {/* Cabeçalho da tabela */}
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Caso possua dados do personagem */}
        {/* // Caso não tenha */}
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id}>
              {/* Descrição da arma */}
              <TableCell component="th" scope="row">
                {row.weapon}
              </TableCell>

              {/* Tipo */}
              <TableCell style={{ minWidth: 100 }} align="right">
                {row.type}
              </TableCell>

              {/* Dano */}
              <TableCell style={{ minWidth: 100 }} align="right">
                <Image
                  src={"/assets/dice.png"}
                  alt="Dice roll"
                  width={25}
                  height={25}
                  align={"center"}
                  style={{
                    cursor: "pointer",
                    transition: "-webkit-transform .8s ease-in-out",
                    transform: "transform .8s ease-in-out",
                    marginRight: "5px",

                    "&:hover": {
                      transition: "rotate(360deg)",
                      transform: "rotate(360deg)",
                    },
                  }}
                  onClick={() => diceRollModal.appear({ amount: row.damage })}
                />
                {row.damage}
              </TableCell>

              {/* Carga atual */}
              <TableCell style={{ minWidth: 70 }} align="right">
                {row.current_load}
              </TableCell>

              {/* Capacidade */}
              <TableCell style={{ minWidth: 70 }} align="right">
                {row.total_load}
              </TableCell>

              {/* Deletar e Editar cadastro */}
              <TableCell style={{ minWidth: 70 }} align="right">
                <Tooltip title="Remover item de combate">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      confirmationModal.appear({
                        title: "Apagar item de combate",
                        text: "Deseja apagar este item?",
                        data: { id: row.id, type: "combat" },
                      });
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>

                <Tooltip title="Editar indormações do item de combate">
                  <Button
                    variant="outlined"
                    style={{ marginLeft: "5px" }}
                    onClick={() =>
                      combatModal.appear({
                        operation: "edit",
                        character: props.character.id,
                        data: row,
                      })
                    }
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={5} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
              colSpan={6}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "Linhas por página",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
