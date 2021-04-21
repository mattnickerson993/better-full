import React from 'react'
import axiosAuthInstance from '../axios'
import { api } from '../api'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, CircularProgress, Dialog, DialogTitle, Grow, IconButton, Snackbar, TableSortLabel, Toolbar, Tooltip, Typography, useTheme } from '@material-ui/core';
import { AppointmentContext, PatientContext } from '../context'
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useInactivePatientsStyles } from '../styles';
import TablePaginationActions from './TablePaginationActions'



const InactivePatients = ({patients}) => {
    const {dispatchPatients} = React.useContext(PatientContext)
    const [open, setOpen] = React.useState(false)
    const [idTracker, setIdTracker] = React.useState("")
    const [patientData, setPatientData] = React.useState("")
    const [activatedIds, setActivatedIds ] = React.useState([])
    // styles and theme
    const theme = useTheme()
    const classes = useInactivePatientsStyles()
    // snackbar
    const [snackopen, setSnackOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const snackRef = React.useRef(null)
    // sorting
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    // pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, patients.length - page * rowsPerPage);
    
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

    // pagination
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
     
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    // switch patient status from archived to active
    async function handleActivate(id){
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
              archived: false
          }, config)
          dispatchPatients({type:"ADD_PATIENT", payload:patientData})
          setActivatedIds((prev)=> [...prev, id])
          snackRef.current.click()
          setOpen(false)
      }
      catch(error){
          console.log(error.response)
          console.log('error archiving patient')
      }
      
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
   
    if (patients.length === 0){
      return (
          <>
              <div className={classes.emptyContainer}>
                <Typography variant="h6" align="center">
                    You currently have no Inactive Patients
                </Typography>
              </div>
          </>
      )
  }

    return (
        <>
        {patients && (
            <>
            <Button style={{display:'none'}} ref={snackRef} onClick={handleSnackClick(GrowTransition)}/>
            <Snackbar
              open={snackopen}
              onClose={handleSnackClose}
              TransitionComponent={transition}
              message="Patient Succesfully Activated!"
              key={transition ? transition.name : ''}
            />
            <TableContainer className={classes.table} component={Paper}>
                <Toolbar className={classes.toolbar}>
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                  Inactive Patients
                </Typography>
                </Toolbar>
                <Table aria-label="simple table">
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
                        <TableCell >
                        <TableSortLabel 
                              active={orderBy === 'email'}
                              direction={orderBy === 'email' ? order: 'asc'}
                              onClick={createSortHandler('email')}
                            >
                            Email
                            </TableSortLabel>
                        </TableCell>
                        <TableCell >Set to Active</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    
                    {stableSort(patients, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .filter((patient) => !activatedIds.includes(patient.id))
                     .map((patient) => (
                        <TableRow hover key={patient.id}>
                        <TableCell component="th" scope="row">
                            {patient.first_name}
                        </TableCell>
                        <TableCell >{patient.last_name}</TableCell>
                        <TableCell >{patient.date_of_birth}</TableCell>
                        <TableCell >{patient.email}</TableCell>
                        <TableCell ><Tooltip title="Activate"><IconButton
                         onClick={() => {
                             setIdTracker(patient.id)
                             setPatientData({
                               id:patient.id,
                               last_name:patient.last_name,
                               first_name:patient.first_name,
                               date_of_birth:patient.date_of_birth,
                               email:patient.email,
                               archived: false
                             })
                             setOpen(true)
                            }} 
                         className={classes.archive}><CheckCircleOutlineIcon/></IconButton></Tooltip></TableCell>
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
                <DialogTitle id="simple-dialog-title">{`Are you sure you want to activate this patient?`}</DialogTitle>
                <div className={classes.btnContainer}>
                <Button className={classes.archiveBtn}onClick={()=> handleActivate(idTracker)} variant="outlined"> Set as Active </Button> 
                <Button onClick={()=>setOpen(false)} color="primary" variant="outlined"> Cancel </Button>
                </div>
            </Dialog>
            </>
        )}
        
        </>
    )
}

export default InactivePatients
