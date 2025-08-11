import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Visibility from '@mui/icons-material/Visibility';
import Edit from '@mui/icons-material/Edit';
import Groups from '@mui/icons-material/Groups';
import Delete from '@mui/icons-material/Delete';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatter } from '@mui/x-data-grid';
import { ExpenseTableProps } from '@/dto/expense-table.dto';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { ExpenseTableDataGridProps } from '@/dto/datagrid-expenses-dto';
import { Box } from '@mui/system';

export default function ExpenseTableDataGrid({ expenses, onDeleteExpense }: ExpenseTableDataGridProps) {
  const [selectedExpenses, setSelectedExpenses] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedExpenseId, setSelectedExpenseId] = React.useState<string | null>(null);
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      valueFormatter: ((value: string) => formatDate(value)) as GridValueFormatter
    },
    { field: 'description', headerName: 'Merchant', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      valueFormatter: ((value: number) => formatCurrency(value)) as GridValueFormatter
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ExpenseTableProps['expenses'][number]>) => (
        <strong>
          <button onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setSelectedExpenseId(params.row.id);
          }}>More</button>
        </strong>
      ),
    },
  ];



  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpenseId(null);
  };
  return (
    <Box style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={expenses}
        columns={columns}
        pagination
        paginationModel={{ page, pageSize: rowsPerPage }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setRowsPerPage(model.pageSize);
        }}
        checkboxSelection
  rowSelectionModel={selectedExpenses as any}
        onRowSelectionModelChange={(newSelection) => {
          if (Array.isArray(newSelection)) {
            setSelectedExpenses(newSelection as string[]);
          }
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Groups fontSize="small" sx={{ mr: 1 }} />
          Split Bill
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (selectedExpenseId && onDeleteExpense) {
              onDeleteExpense(selectedExpenseId);
            }
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
