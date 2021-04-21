import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, TableSortLabel, Toolbar, Typography, useTheme } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FeedbackIcon from '@material-ui/icons/Feedback';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import { useArchivedAptStyles } from '../styles';
import TablePaginationActions from './TablePaginationActions'


const ArchivedAppointments = ({appointments}) => {
    // styling and theme
    const classes = useArchivedAptStyles()
    const theme = useTheme()
    // sorting
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('last_name');
    // pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, appointments.length - page * rowsPerPage);

    // sorting functions
    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
      };
  
    const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    };
  
    function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
    }
      
    function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
      
    function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
    }
    
    // pagination functions

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
     
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    if (appointments.length === 0){
        return (
            <>
                <div className={classes.emptyContainer}>
                  <Typography variant="h6" align="center">
                      You currently have no archived appointments
                  </Typography>
                </div>
            </>
        )
    }
    
    return (
        <>
        {appointments && (
            <>
             <TableContainer className={classes.table} component={Paper}>
             <Toolbar className={classes.toolbar}>
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                  Archived Appointments
                </Typography>
            </Toolbar>
             <Table  aria-label="simple table">
                 <TableHead style={{backgroundColor: `${theme.palette.primary.main}`}}>
                 <TableRow hover>
                     <TableCell>
                         <TableSortLabel
                            active={orderBy === 'last_name'}
                            direction={orderBy === 'last_name' ? order: 'asc'}
                            onClick={createSortHandler('last_name')}
                         >
                             Name
                         </TableSortLabel>
                    </TableCell>
                     <TableCell >
                        <TableSortLabel
                            active={orderBy === 'date_time'}
                            direction={orderBy === 'date_time' ? order: 'asc'}
                            onClick={createSortHandler('date_time')}
                         >
                             Date
                        </TableSortLabel>
                     </TableCell>
                     <TableCell >Time</TableCell>
                     <TableCell >
                        <TableSortLabel
                            active={orderBy === 'status'}
                            direction={orderBy === 'status' ? order: 'asc'}
                            onClick={createSortHandler('status')}
                         >
                             Status
                        </TableSortLabel>
                     </TableCell>
                     <TableCell >Action</TableCell>    
                 </TableRow>
                 </TableHead>
                 <TableBody>
                 {stableSort(appointments, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appointment) => (
                     <TableRow hover key={appointment.id}>
                     <TableCell component="th" scope="row">
                        {`${appointment.last_name}, ${appointment.first_name} `}
                     </TableCell>
                     <TableCell >{`${new Date(appointment.date_time).toLocaleDateString()}`}</TableCell>
                     <TableCell >{`${new Date(appointment.date_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})}`}</TableCell>
                     <TableCell >{appointment.status}</TableCell>
                     <TableCell >
                     {appointment.status === 'Feedback' && (
                             <Link to={`/appointments/doctor/review/${appointment.id}/`} style={{textDecoration:'none', color:'inherit'}}>
                                <Button color="primary" endIcon={<FeedbackIcon/>} variant="contained"> View Feedback</Button>
                             </Link>
                         )}
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
                            colSpan={5}
                            count={appointments.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                 </Table>
            </TableContainer>
            </>
            
        )}
        </>
            
        
    )
}

export default ArchivedAppointments
