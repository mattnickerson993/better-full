import React from 'react'
import axiosAuthInstance from '../axios'
import axios from 'axios'
import { api } from '../api'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, CircularProgress, Dialog, DialogTitle, Grow, IconButton, Snackbar, TableSortLabel, Toolbar, Tooltip, Typography, useTheme } from '@material-ui/core';
import { AppointmentContext, PatientContext, AuthContext } from '../context'
import EditPatient from './EditPatient';
import ArchiveIcon from '@material-ui/icons/Archive';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { usePatientListStyles } from '../styles';
import TablePaginationActions from './TablePaginationActions';



const PatientList = ({patients, patientsLoading}) => {
    const { dispatchPatients } = React.useContext(PatientContext)
    const { dispatchAppointments } = React.useContext(AppointmentContext)
    const { state } = React.useContext(AuthContext)
    const [displayEditPatients, setDisplayEditPatients ] = React.useState(false)
    const [patientEditID, setPatientEditID] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [idTracker, setIdTracker] = React.useState(0)
    const [archive, setArchive ] = React.useState(true)
    // style
    const classes = usePatientListStyles()
    // snackbar
    const [snackopen, setSnackOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const snackRef = React.useRef(null)
    // sorting
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('last_name');
    // pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, patients.length - page * rowsPerPage);
    const theme = useTheme()
    
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
   
    // delete patients
    async function handleDelete(id){
      const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json',
        }
    }
        try{
            await axiosAuthInstance.delete(api.patients.delete(`${id}`), config)
            dispatchPatients({type:'DELETE_PATIENT', payload:{id}})
            setOpen(false)
        }
        catch(error){
            console.log('error deleting patient')
        }
        
    }

    // archive patients
    async function handleArchive(id){
      const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json',
        }
      }
        try{
            const result = await axiosAuthInstance.put(api.patients.archive(`${id}`), {
                id,
                archived: true
            }, config)
            dispatchPatients({type:'ARCHIVE_PATIENT', payload:{id}})
            dispatchAppointments({type:'UPDATE_APPOINTMENTS_PATIENT_ARCHIVE', payload:{id}})
            snackRef.current.click()
            setOpen(false)
        }
        catch(error){
            console.log(error.response)
            console.log('error archiving patient')
        }
        
    }

    // select appropriate patient for edit
    function handleEdit(id){
        setPatientEditID(id)
        setDisplayEditPatients(!displayEditPatients)
    }

    // snackbar and transitions
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

    

    // handle loading
    if (patientsLoading){
        return (
            <div className={classes.loading}>
                <CircularProgress color="primary" />
            </div>
        )
    }

    return (
        <>
        {displayEditPatients && <EditPatient id={patientEditID} handleEdit={handleEdit}/>}
        {patients && (
            <>
            <Button style={{display:'none'}} ref={snackRef} onClick={handleSnackClick(GrowTransition)}/>
            <Snackbar
                        open={snackopen}
                        onClose={handleSnackClose}
                        TransitionComponent={transition}
                        message="Patient Succesfully Archived!"
                        key={transition ? transition.name : ''}
                    />
            <TableContainer component={Paper}>
                <Toolbar className={classes.toolbar}>
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {state.userDetails ? `Active Patients for Dr. ${state.userDetails.last_name}`:
                  `Active Patients`}
                </Typography>
                </Toolbar>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead style={{backgroundColor: `${theme.palette.primary.main}`}}>
                    <TableRow hover>
                        <TableCell>
                          <TableSortLabel 
                            active={orderBy === 'first_name'}
                            direction={orderBy === 'first_name' ? order: 'asc'}
                            onClick={createSortHandler('first_name')}
                            >
                            First Name
                            </TableSortLabel>
                          </TableCell>
                        <TableCell >
                        <TableSortLabel 
                            active={orderBy === 'last_name'}
                            direction={orderBy === 'last_name' ? order: 'asc'}
                            onClick={createSortHandler('last_name')}
                            >
                            Last Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell >
                          <TableSortLabel 
                              active={orderBy === 'date_of_birth'}
                              direction={orderBy === 'date_of_birth' ? order: 'asc'}
                              onClick={createSortHandler('date_of_birth')}
                            >
                            Date of Birth
                            </TableSortLabel>
                        </TableCell>
                        <TableCell >Edit</TableCell>
                        <TableCell >Archive</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    
                    {stableSort(patients, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                     .map((patient) => (
                        <TableRow hover key={patient.id}>
                          <TableCell component="th" scope="row">
                              {patient.first_name}
                          </TableCell>
                          <TableCell >{patient.last_name}</TableCell>
                          <TableCell >{patient.date_of_birth}</TableCell>
                          <TableCell >
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEdit(patient.id)} className={classes.edit}>
                                <EditIcon/>
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell >
                            <Tooltip title="Archive">
                              <IconButton
                          onClick={() => {
                              setIdTracker(patient.id)
                              setOpen(true)
                              }} 
                          className={classes.archive}>
                                <ArchiveIcon/>
                              </IconButton>
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
                            colSpan={5}
                            count={patients.length}
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
            <Dialog onClose={() => setOpen(false)} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">{`Are you sure you want to ${archive? 'archive': 'delete' } this patient? This will delete any 
                appointments with this patient that have not been completed`}</DialogTitle>
                <div className={classes.btnContainer}>
                {archive ? (
                    <Button className={classes.archiveBtn} onClick={()=> handleArchive(idTracker)}variant="outlined"> Archive </Button> ):(
                    <Button className={classes.delBtn} onClick={()=> handleDelete(idTracker)}variant="outlined"> Delete </Button>
                    )}
                
                <Button onClick={()=>setOpen(false)} color="primary" variant="outlined"> Cancel </Button>
                </div>
            </Dialog>
            </>
        )}
        
        </>
    )
}

export default PatientList
