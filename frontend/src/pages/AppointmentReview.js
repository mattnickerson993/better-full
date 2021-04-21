import { Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, FormControlLabel, Paper, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React from 'react'
import axios from 'axios'
import { api } from '../api'
import { Redirect, useHistory, useParams } from 'react-router'
import Layout from '../components/Layout'
import { AppointmentContext, AuthContext } from '../context'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SEO from '../components/Seo'
import { useAppointmentReviewStyles } from '../styles'


const AppointmentReview = () => {
    const {dispatchAppointments} = React.useContext(AppointmentContext)
    const [loading, setLoading ] = React.useState(false)
    const [complete, setComplete ] = React.useState(false)
    const [submitLoading, setSubmitLoading ] = React.useState(false)
    const [details, setDetails ] = React.useState("")
    const [questions, setQuestions ] = React.useState([])
    const [checks, setChecks ] = React.useState({
        checked1: [false, ""],
        checked2: [false, ""],
        checked3: [false, ""],
        checked4: [false, ""],
        checked5: [false, ""],
        checked6: [false, ""],
        checked7: [false, ""],
    })
    const { token, appttoken} = useParams()
    const history = useHistory()
    // theme styles and media queries
    const classes = useAppointmentReviewStyles()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))
    const matchesXs = useMediaQuery(theme.breakpoints.down('xs'))
    
    React.useEffect(() => {
        fetchApptDetails()
        // fetch appointment data and set to state...using token and apptoken instead of patient having to login
        // as a result patient will not need to create an account
        async function fetchApptDetails(){
           
            try{
                setLoading(true)
                const response =  await axios.post(api.appointments.patientreview, {token, appttoken})
                setDetails(response.data)
                setLoading(false)
                setQuestions(response.data.questions)
                
            }catch(error){
                console.log('error fetching appointment details')
                setLoading(false)
            }
          
           
        }
    }, [])

    // patient submitting form
    async function handleConfirm(){
        
        try{
           setSubmitLoading(true)
           const res = axios.post(api.appointments.patientfinal, {checks, token, appttoken})
           setTimeout(() => {
               setComplete(true)
           }, 2000)
           
        }catch(error){
            console.log('error submitting')
            setSubmitLoading(false)
        }
    }
    function handleChange(event, id){
        setChecks( prev => ({
            ...prev,
            [event.target.name]:[event.target.checked, id ]
        }
        ))
    }

    if (complete) {
        return (
            <Typography className={classes.confirm} align="center" variant="h4" component="h6">
                {`Your input has been sent to Dr. ${details.doctor}. Thank you for your feedback`}
            </Typography>
        )
    }
    
    if (loading) {
        return (
                <div className={classes.loading}>
                <CircularProgress color="primary" />
                </div>
        )
    }
    
    return (
        <>
            <SEO title="Appointment Review"/> 
            <Paper className={matchesXs ? classes.paperXs : classes.paper} elevation={3}>
                <Typography style={{marginTop: '16px', marginBottom: '16px'}}align="center" variant={matchesXs ? "h6": "h4"} component="h4">
                    {`Please Let Dr. ${details.doctor} know if your questions were answered`}
                </Typography>
                <Typography style={{marginTop: '16px', marginBottom: '16px'}}align="center" variant={matchesXs ? "subtitle1": "h5"} component="p">
                    Click the small box below each question if it was addressed to your satisfaction
                </Typography>
                
            </Paper>
            {questions && questions.map( (question, i)  => (
                <Card className={classes.card} key={question.id}>
                    <CardContent>
                        <Typography variant="h6" align="center" color="primary" gutterBottom>
                        {`Question${i+1}`}
                        </Typography>
                        <div className={classes.cardContent}>
                        <Typography align="center" variant="subtitle1"> 
                            {question.content}
                        </Typography> 
                        <FormControlLabel 
                            className={classes.check}
                            control={
                            <Checkbox
                                checked={checks[`checked${i+1}`][0]}
                                onChange={(event) => handleChange(event, question.id)}
                                name={`checked${i+1}`}
                                color="secondary"
                            />
                            }
                            label="Answered"
                        />
                        </div>
                    </CardContent>
                </Card>
            ))}
            <div className={classes.bottom}>
            <Button 
            disabled={submitLoading} 
            endIcon = {submitLoading ? <CircularProgress/> : <CheckCircleIcon/>}
            onClick={handleConfirm} className={classes.button} color="primary" variant="outlined" size="large">
                Send to Dr. {details.doctor}
            </Button>
            </div>
        </>
    )
}

export default AppointmentReview

