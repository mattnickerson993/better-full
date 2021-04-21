import { TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper, useTheme, useMediaQuery, Grow, Snackbar } from '@material-ui/core'
import React from 'react'
import axiosAuthInstance from '../axios'
import { api } from '../api'
import { AppointmentContext } from '../context'
import {ErrorMessage} from './Message'
import {useAptCreateStyles} from '../styles'



const AppointmentCreate = ({patients, patientsLoading}) => {
    const { dispatchAppointments } = React.useContext(AppointmentContext)
    const [displayCreate, setDisplayCreate] = React.useState(false)
    const [patient, setPatient] = React.useState("")               
    const [datetime, setDateTime] = React.useState(`${Date.now()}`)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [snackopen, setSnackOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const snackRef = React.useRef(null)
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useAptCreateStyles()

    // submit appointment
    async function handleSubmit(event){
        event.preventDefault()
        setError("")
        setLoading(true)
        const formData = new FormData()
        formData.append('patient', patient)
        formData.append('date_time', datetime)
        const config = {
            headers: {
                'Content-Type': 'mulitpart/form-data',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        
        try{
            const result = await axiosAuthInstance.post(api.appointments.create, formData, config)
            dispatchAppointments({type:"ADD_APPOINTMENT", payload:result.data})
            setLoading(false)
            toggleForm()
            snackRef.current.click()
        }catch(error){
            if (error.response.data['date_time']){
                setError(`${error.response.data['date_time']}`)
            }
            else{
                setError(`Error creating appointment. ${error.name} ${error.message}`)
            }
            setLoading(false)
        }
        
        
    }
    // toggleform
    function toggleForm(){
        setDisplayCreate(prev => !prev)
        setError("")
    }

    // change patients in select menu
    function handlePatientChange(e){
        setPatient(e.target.value)
    }

    // snackbar and transition
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
    // handleloading

    if (patientsLoading) {
        return (
            <div className={classes.loading}>
                <CircularProgress color="primary" />
            </div>
        )
    }

    return (
        <>
        <Button style={{display:'none'}} ref={snackRef} onClick={handleSnackClick(GrowTransition)}/>

        <Snackbar
                open={snackopen}
                onClose={handleSnackClose}
                TransitionComponent={transition}
                message="Appointment Succesfully Created!"
                key={transition ? transition.name : ''}
            />
        <Button onClick={toggleForm} variant="contained" color="secondary" className={classes.createbtn}>
            {displayCreate ? "Close Form": "Add Appointment"}
        </Button>
        {displayCreate && (
            <div>
            <Paper variant="outlined" className={matchesSm ? classes.papersm: classes.paper}>
            {error && <ErrorMessage severity="error" variant="outlined" message={error}/>}
            <Typography variant="h6" align="center">
                Add New Appointment
            </Typography>
            <form onSubmit={handleSubmit} className={classes.form}>
                <FormControl className={matches ? classes.formControlSm :classes.formControl}>
                    <InputLabel id="status-label">Select Patient</InputLabel>
                    <Select
                        labelId="patient-label"
                        id="patient-select"
                        value={patient}
                        onChange={handlePatientChange}
                        name="patient"
                        
                    >   
                    {patients.map((patient) => (
                        <MenuItem key ={patient.id} value={`${patient.id}`}>{`${patient.last_name}, ${patient.first_name}  ${patient.date_of_birth}`}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                    className={matches ? classes.textFieldSm : classes.textField}
                    name="date"
                    id="datetime-local"
                    label="Date and Time"
                    type="datetime-local"
                    value={datetime}
                    onChange={(e)=> setDateTime(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button 
                style={{marginTop:'1em'}}
                variant="outlined"
                color="primary"
                type="submit"
                disabled={loading}
                >
                    Add
                </Button>
                

            </form>
        </Paper>
        </div>
        )}
        
        </>
    )
}

export default AppointmentCreate
