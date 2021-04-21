import React from 'react'
import { api } from '../api'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Chip, CircularProgress, Dialog, DialogTitle, Grow, IconButton, Snackbar, TableSortLabel, Toolbar, Tooltip, Typography, useTheme } from '@material-ui/core';
import { AppointmentContext, AuthContext } from '../context';
import axiosAuthInstance  from '../axios'
import EmailIcon from '@material-ui/icons/Email'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Link } from 'react-router-dom';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ArchiveIcon from '@material-ui/icons/Archive';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import { useAptListStyles } from '../styles';
import TablePaginationActions from './TablePaginationActions';





const AppointmentList = ({appointments, appointmentsLoading}) => {
    const { dispatchAppointments } = React.useContext(AppointmentContext)
    const { state } = React.useContext(AuthContext)
    const [open, setOpen] = React.useState(false)
    const [idTracker, setIdTracker] = React.useState(0)
    const [archive, setArchive] = React.useState(true)
    // snackbar
    const [snackopen, setSnackOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const snackRef = React.useRef(null)
    // styles and theme
    const theme = useTheme()
    const classes = useAptListStyles()
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

    // delete and archive appointments

    async function handleDelete(id){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        try{
            await axiosAuthInstance.delete(api.appointments.delete(`${id}`), config)
            dispatchAppointments({type:"DELETE_APPOINTMENT", payload : {id}})
            snackRef.current.click()
            setOpen(false)
        }
        catch(error){
            console.log('error deleting patient')
        }
    }

    async function handleArchive(id){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        try{
           const result = await axiosAuthInstance.put(api.appointments.archive(`${id}`), {
                id,
                archived: true,
            }, config)
            dispatchAppointments({type:"ARCHIVE_APPOINTMENT", payload : {id}})
            snackRef.current.click()
            setOpen(false)
        }
        catch(error){
            console.log('error archiving patient')
        }
    }

    // confirm appointment

    async function handleConfirm(id){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        
        try{
            const result = await axiosAuthInstance.post(api.appointments.confirm(`${id}`), {}, config)
            dispatchAppointments({type:"UPDATE_APPOINTMENT_STATUS", payload:{id, status:"Sent"}})
            
            
        }
        catch(error){
            console.log(error.response)
            console.log('error confirming appointment')
        }
    }

    // snackbar actions

    function GrowTransition(props) {
        return <Grow {...props} />;
      }
    
    const handleSnackClick = (Transition) => () => {
    setTransition(() => Transition);
    setSnackOpen(true);

    };

    const handleSnackClose = () => {
    
        setSnackOpen(false);
    
    };

    // loading

    if (appointmentsLoading){
        return (
            <div className={classes.loading}>
                <CircularProgress color="primary" />
            </div>
        )
    }
    
    return (
        <>
        {appointments && (
            <>
            <Button style={{display:'none'}} ref={snackRef} onClick={handleSnackClick(GrowTransition)}/>
            <Snackbar
                        open={snackopen}
                        onClose={handleSnackClose}
                        TransitionComponent={transition}
                        message={`Appointment Succesfully ${archive ? 'Archived': 'Deleted' }`}
                        key={transition ? transition.name : ''}
            />
            
             <TableContainer component={Paper}>
             <Toolbar className={classes.toolbar}>
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                  {state.userDetails ? `Active Appointments for Dr. ${state.userDetails.last_name}`:
                  `Active Appointments`}
                </Typography>
            </Toolbar>
             <Table className={classes.table} aria-label="simple table">
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
                     <TableCell >Archive/Delete</TableCell>
                     
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
                         {appointment.status === 'Pending' && (
                             <Button onClick={() => handleConfirm(appointment.id)} variant="contained" color="primary">Send Email</Button>
                         )}
                         {appointment.status === 'Sent' && (
                             <Chip avatar={<EmailIcon/>} label="Email Sent"/>
                         )}
                         {appointment.status === 'Confirmed' && (
                             <Link to={`/appointments/detail/${appointment.id}/`}style={{textDecoration:'none', color:'inherit'}}>
                                <Button variant="contained" color="secondary">View Details</Button>
                             </Link>
                             
                         )}
                         {appointment.status === 'Complete' && (
                             <Chip color="secondary" icon={<CheckCircleIcon />} label="Completed"/>
                         )}
                         {appointment.status === 'Feedback' && (
                             <Link to={`/appointments/doctor/review/${appointment.id}/`} style={{textDecoration:'none', color:'inherit'}}>
                                <Button color="primary" endIcon={<FeedbackIcon/>} variant="contained"> View Feedback</Button>
                             </Link>
                         )}
                         
                    </TableCell>
                     <TableCell >{appointment.status === 'Feedback' ? (
                         <Tooltip title="Archive">
                         <IconButton onClick={() => {
                             setIdTracker(appointment.id)
                             setArchive(true)
                            setOpen(true)}} 
                            className={classes.archive}><ArchiveIcon></ArchiveIcon></IconButton>
                        </Tooltip>
                     ) : (
                     <Tooltip title="Delete">
                     <IconButton onClick={() => {
                            setIdTracker(appointment.id)
                            setArchive(false)
                            setOpen(true)}} 
                        className={classes.delete}><DeleteIcon/>
                        </IconButton>
                        </Tooltip>)}
                         </TableCell>
                     
                     </TableRow>
                 ))}
                    {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                    </TableRow>
                    )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={6}
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
        <Dialog onClose={() => setOpen(false)} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{`Are you sure you want to ${archive? 'archive': 'delete' } this appointment?`}</DialogTitle>
            <div className={classes.btnContainer}>
            {archive ? (
                <Button className={classes.archiveBtn} onClick={()=> handleArchive(idTracker)}variant="outlined"> Archive </Button> ):(
                <Button className={classes.delBtn} onClick={()=> handleDelete(idTracker)}variant="outlined"> Delete </Button>
                )}
            
            <Button onClick={()=>setOpen(false)} color="primary" variant="outlined"> Cancel </Button>
            </div>
        </Dialog>
        </>
            
        
    )
}

export default AppointmentList
