import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { Button, Grid, Tooltip } from '@mui/material'
import { Delete as DeleteIcon, Create as EditIcon } from '@mui/icons-material'


import {
    EditableRow, ConfirmationModal
  } from '../components';

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
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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

function createData(weapon, type, damage, current, capacity) {
  return { weapon, type, damage, current, capacity };
}

// Definir dados do cabeçalho da tabela
const columns = [
    { id: 'weapon', label: 'ARMA', minWidth: 150 },
    { id: 'type', label: 'TIPO', minWidth: 100, align: 'right'},
    { id: 'damage', label: 'DANO', minWidth: 100, align: 'right'},
    { id: 'current', label: 'CARGA ATUAL', minWidth: 70, align: 'right'},
    { id: 'capacity', label: 'CARGA MÁXIMA', minWidth: 70, align: 'right'},
    { id: 'options', label: '', minWidth: 100, align: 'right'},
];  

const rows = [
  createData('Cupcake', 305, 3.7, 25, 72),
  createData('Donut', 452, 25.0, 15, 40),
  createData('Eclair', 262, 16.0, 0, 0),
  createData('Frozen yoghurt', 159, 6.0, 12, 19),
  createData('Gingerbread', 356, 16.0, 0, 0),
  createData('Honeycomb', 408, 3.2, 15, 16),
  createData('Ice cream sandwich', 237, 9.0, 7, 12),
  createData('Jelly Bean', 375, 0.0, 0, 0),
  createData('KitKat', 518, 26.0, 1, 9),
  createData('Lollipop', 392, 0.2, 6, 10),
  createData('Marshmallow', 318, 0, 1, 2),
  createData('Nougat', 360, 19.0, 0, 0),
  createData('Oreo', 437, 18.0, 0, 0),
].sort((a, b) => (a.weapon < b.weapon ? -1 : 1));

export default function CustomPaginationActionsTable() {
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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" stickyHeader >

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

        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.weapon}>
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
                {row.damage}
              </TableCell>

              {/* Carga atual */}
              <TableCell style={{ minWidth: 70 }} align="right">
                {row.current}
              </TableCell>
              
              {/* Capacidade */}
              <TableCell style={{ minWidth: 70 }} align="right">
                {row.capacity}
              </TableCell>

              {/* Deletar e Editar cadastro */}
                <TableCell style={{ minWidth: 70 }} align="right">
                    <Tooltip title="Remover item de combate">
                        <Button variant="outlined">
                            <DeleteIcon />
                        </Button>
                    </Tooltip>
                    
                    <Tooltip title="Editar indormações do item de combate">
                        <Button variant="outlined">
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
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={6}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
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
