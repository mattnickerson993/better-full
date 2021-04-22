import { TextField, Typography, Button, CircularProgress, Paper, Slide, Snackbar, Grow, useMediaQuery, useTheme } from '@material-ui/core'
import React from 'react'
import axiosAuthInstance from '../axios'
import { api } from '../api'
import { useForm } from 'react-hook-form'
import { PatientContext } from '../context'
import isEmail from 'validator/lib/isEmail'
import {ErrorMessage} from './Message'
import { usePatientCreateStyles } from '../styles'

const PatientCreate = () => {
    const [displayCreate, setDisplayCreate ] = React.useState(false)
    const { dispatchPatients } = React.useContext(PatientContext)
    const [error, setError ] = React.useState("")
    const { register, handleSubmit, formState, errors } = useForm({mode: 'onBlur'})
    // snackbar
    const [snackopen, setSnackOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const snackRef = React.useRef(null)
    // media queries and styles
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = usePatientCreateStyles()

    // create patient
    async function onSubmit(data){
        const {firstname, lastname, email, date} = data
        const body = {
            first_name: firstname,
            last_name: lastname,
            email: email,
            date_of_birth: date,
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        try{
            const result = await axiosAuthInstance.post(api.patients.create, JSON.stringify(body), config)
            dispatchPatients({type:"ADD_PATIENT", payload:result.data})
            toggleForm()
            snackRef.current.click()
            
        }catch(error){
            
            if (error.response.data['date_of_birth']){
                setError(`${error.response.data['date_of_birth']}`)
            }
            else{
                setError(`Error creating patient. ${error.name} ${error.message}`)
            }
            
        }
        
    }

    // toggle form display
    function toggleForm(){
        setError("")
        setDisplayCreate(prev => !prev)
    }

    //  snackbar
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

    
    return (
        <>
        <Button onClick={toggleForm} variant="contained" color="secondary" className={classes.createbtn} >
            {displayCreate ? "Close Form": "Add Patient"}
        </Button>
        <Button style={{display:'none'}} ref={snackRef} onClick={handleSnackClick(GrowTransition)}/>
        <Snackbar
            open={snackopen}
            onClose={handleSnackClose}
            TransitionComponent={transition}
            message="Patient Created!"
            key={transition ? transition.name : ''}
        />
        {displayCreate && (

            <div>
            <Paper variant="outlined" className={matchesSm ? classes.papersm: classes.paper}>
            {error && <ErrorMessage severity="error" variant="outlined" message={error}/>}
            <Typography variant="h6" align="center">
                Add New Patient
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <TextField
                autoFocus
                className={matches ? classes.textFieldSm : classes.textField}
                name="firstname"
                inputRef={register({
                    required: true,
                    minLength: 2,
                    maxLength: 30,
                })}
                variant="filled"
                label="First Name"
                type="text"
                margin="dense"
                />
                <TextField
                className={matches ? classes.textFieldSm : classes.textField}
                name="lastname"
                inputRef={register({
                    required: true,
                    minLength: 2,
                    maxLength: 30,
                })}
                variant="filled"
                label="Last Name"
                type="text"
                margin="dense"
                />
                <TextField 
                    className={matches ? classes.textFieldSm : classes.textField}
                    name="email"
                    inputRef={register({
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                        validate: (input) => isEmail(input),
                    })}
                    variant="filled"
                    label="Email"
                    margin="dense"
                    />
                <TextField
                    className={matches ? classes.textFieldSm : classes.textField}
                    name="date"
                    inputRef={register({
                        required: true,
                    })}
                    id="date"
                    label="Date of Birth"
                    type="date"
                    defaultValue="1980-01-01"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button 
                style={{marginTop:'1em', marginBottom:'1em'}}
                variant="outlined"
                color="primary"
                type="submit"
                size="large"
                disabled={!formState.isValid || formState.isSubmitting}
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

export default PatientCreate
