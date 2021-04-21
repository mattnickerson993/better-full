import { TextField, Typography, Button, Paper, Snackbar, Grow, useTheme, useMediaQuery } from '@material-ui/core'
import React from 'react'
import axiosAuthInstance from '../axios'
import { api } from '../api'
import { useForm } from 'react-hook-form'
import { AppointmentContext, PatientContext } from '../context'
import isEmail from 'validator/lib/isEmail'
import {ErrorMessage} from './Message'
import { useEditPatientStyles } from '../styles'


const EditPatient = ({id, handleEdit}) => {
    const { dispatchPatients } = React.useContext(PatientContext)
    const { dispatchAppointments } = React.useContext(AppointmentContext)
    const [error, setError ] = React.useState("")
    const [ patientDetails, setPatientDetails ] = React.useState("")
    const { register, handleSubmit, formState, errors } = useForm({mode: 'onBlur'})
    // snackbar
    const [snackopen, setSnackOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const snackRef = React.useRef(null)
    // styles theme and media queries
    const classes = useEditPatientStyles()
    const theme = useTheme()
    const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))
    


    React.useEffect(() => {
        fetchPatientDetail()
    },[])

    // get patients current details
    async function fetchPatientDetail(){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        const result = await axiosAuthInstance(api.patients.detail(`${id}`), config)
        setPatientDetails(result.data)  
    }

    // form submission
    async function onSubmit(data){
        const {firstname, lastname, email, date} = data
        const body = {
            first_name: firstname,
            last_name: lastname,
            email: email,
            date_of_birth: date,
            id,
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        
        try{
            const result = await axiosAuthInstance.put(api.patients.update(`${id}`), JSON.stringify(body), config)
            dispatchPatients({type:"UPDATE_PATIENT", payload:result.data})
            dispatchAppointments({type: "UPDATE_APPOINTMENT_STATUS_AFTER_EDIT_PATIENT", payload: result.data})
            snackRef.current.click()
            setTimeout(() => handleEdit(), 2000)  
        }catch(error){
            setError(`Error updating patient. ${error.name} ${error.message}`)  
        }
        
    }

    // snackbar
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
    // close form
    function handleEditClose(){
        handleEdit()
    }

    
    return (
        <>
        
        {patientDetails &&(
            <>
                <Button style={{display:'none'}} ref={snackRef} onClick={handleSnackClick(GrowTransition)}/>

                <Snackbar
                        open={snackopen}
                        onClose={handleSnackClose}
                        TransitionComponent={transition}
                        message="Patient Succesfully Updated!"
                        key={transition ? transition.name : ''}
                    />
                <div>
                <Paper variant="outlined" className={matchesSm ? classes.papersm: classes.paper}>
                {error && <ErrorMessage severity="error" variant="outlined" message={error}/>}
                <Typography variant="h6" align="center">
                    Edit Patient
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                    <SectionItem
                     name="firstname"
                     inputRef={register({
                        required: true,
                        minLength: 2,
                        maxLength: 30,
                    })}
                    label="First Name"
                    formItem={patientDetails.first_name}
                    autoFocus={true}
    
                     />
                     <SectionItem
                     name="lastname"
                     inputRef={register({
                        required: true,
                        minLength: 2,
                        maxLength: 30,
                    })}
                    label="Last Name"
                    formItem={patientDetails.last_name}
    
                     />
                     <SectionItem
                     name="email"
                     inputRef={register({
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                        validate: (input) => isEmail(input),
                    })}
                    label="Email"
                    formItem={patientDetails.email}
    
                     />
                     <SectionItem
                     name="date"
                     inputRef={register({
                        required: true,
                    })}
                    label="Date of Birth"
                    type="date"
                    formItem={patientDetails.date_of_birth}
    
                     />
                    
                    <Button 
                    style={{marginTop:'1em', marginBottom:'1em'}}
                    variant="outlined"
                    color="primary"
                    type="submit"
                    size="large"
                    disabled={!formState.isValid || formState.isSubmitting}
                    >
                        Save
                    </Button>
                    <Button 
                    style={{marginTop:'1em', marginBottom:'1em'}}
                    variant="outlined"
                    color="primary"
                    type="button"
                    size="large"
                    onClick={handleEditClose}
                    >
                        Cancel
                    </Button>
                    
    
                </form>
                </Paper>
            </div>
            </>
            )}
        </>
    )
}

export default EditPatient

// allows default value to be displayed
function SectionItem({ type = "text", formItem, inputRef, name, label, error, autoFocus}) {
    const classes = useEditPatientStyles()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('md'))
  
    return (
      < >
        <TextField
          autoFocus={autoFocus}
          className={matches ? classes.textFieldSm : classes.textField}
          name={name}
          inputRef={inputRef}
          helperText={error?.type === name && error.message}
          variant="filled"
          label={label}
          defaultValue={formItem}
          type={type}
          margin="dense"
        />
      </>
    );
  }