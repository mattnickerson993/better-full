import { Button, Card, CardContent, CardHeader, CircularProgress, Paper, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React from 'react'
import axiosAuthInstance from '../axios'
import { api } from '../api'
import { Redirect, useHistory, useParams } from 'react-router'
import Layout from '../components/Layout'
import { AppointmentContext } from '../context'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SEO from '../components/Seo'
import { useAppointmentDetailStyles } from '../styles'

const AppointmentDetail = () => {
    const [loading, setLoading ] = React.useState(false)
    const [complete, setComplete ] = React.useState(false)
    const [submitLoading, setSubmitLoading ] = React.useState(false)
    const [details, setDetails ] = React.useState("")
    const [questions, setQuestions ] = React.useState([])
    const {dispatchAppointments} = React.useContext(AppointmentContext)
    const classes = useAppointmentDetailStyles()
    const {appointmentId} = useParams()
    const history = useHistory()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))
    const matchesXs = useMediaQuery(theme.breakpoints.down('xs'))

    React.useEffect(() => {
        fetchApptDetails()

        async function fetchApptDetails(){
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json',
                }
            }
            try{
                setLoading(true)
                const response =  await axiosAuthInstance(api.appointments.detail(`${appointmentId}`), config)
                setDetails(response.data)
                setLoading(false)
                setQuestions(response.data.questions)
                
            }catch(error){
                console.error(error)
                console.log('error fetching appointment details')
                setLoading(false)
            }
          
           
        }
    }, [])

    async function handleConfirm(){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        try{
            setSubmitLoading(true)
           const res = await axiosAuthInstance.post(api.appointments.doctorreview(`${appointmentId}`), {}, config)
           dispatchAppointments({type:"UPDATE_APPOINTMENT_STATUS", payload:{id: appointmentId, status:"Complete"}})
           setTimeout(() => setComplete(true), 2000)
           
        }catch(error){
            console.log('error submitting')
            setSubmitLoading(false)
        }
    }

    if (complete) {
        return (
            <Redirect to="/home/"/> 
        )
    }
    
    if (loading) {
        return (
            <Layout>
                <div className={classes.loading}>
                <CircularProgress color="primary" />
                </div>
            </Layout>
            
        )
    }
    return (
        <>
        <SEO title="Appointment Details"/> 
        <Layout>
             <Paper className={matchesXs ? classes.paperXs : classes.paper} elevation={3}>
                
                <Typography className={classes.typography} variant={matchesSm ? 'h5': 'h2'} align="center">
                    Appointment Details
                </Typography>
                <div className={classes.container}>
                <Typography className={classes.typography} variant={matchesSm ? 'subtitle1': 'h5'}>
                  <strong>Name:</strong> {` ${details.first_name} ${details.last_name}`}
                </Typography>
                <Typography className={classes.typography} variant={matchesSm ? 'subtitle1': 'h5'}>
                <strong>Date of Birth:</strong> {` ${details.date_of_birth}`}
                </Typography>
                <Typography className={classes.typography} variant={matchesSm ? 'subtitle1': 'h5'}>
                <strong>Appointment Date:</strong>{` ${new Date(details.date_time).toLocaleDateString()}`} 
                </Typography>
                <Typography className={classes.typography} variant={matchesSm ? 'subtitle1': 'h5'}>
                <strong>Appointment Time:</strong>{` ${new Date(details.date_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})}`}
                </Typography>
                </div>
                
            </Paper>

            {questions && questions.map( (question, i)  => (
                <Card className={classes.card} key={question.id}>
                    <CardContent>
                        <Typography variant="h6" align="center" color="primary" gutterBottom>
                        {`Question${i+1}`}
                        </Typography>
                        <Typography align="center" variant="subtitle1"> 
                            {question.content}
                        </Typography> 
                    </CardContent>
                </Card>
            ))}
            <div className={classes.bottom}>
            <Button 
            disabled={submitLoading} 
            endIcon = {submitLoading ? <CircularProgress/> : <CheckCircleIcon/>}
            onClick={handleConfirm} className={classes.button} color="primary" variant="outlined" size="large">
                Confirm Review With Patient

            </Button>
            </div>
           
        </Layout>
        </>
        
    )
}

export default AppointmentDetail
