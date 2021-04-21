import { Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Icon, Paper, Slide, Snackbar, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React from 'react'
import axiosAuthInstance from '../axios'
import { api } from '../api'
import { Redirect, useHistory, useParams } from 'react-router'
import Layout from '../components/Layout'
import { AppointmentContext, AuthContext, MessageContext } from '../context'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import clsx from 'clsx'
import SEO from '../components/Seo'
import { useDoctorFeedbackStyles } from '../styles'
import CircularProgressWithLabel from '../components/CircularProgressWithLabel'


const DoctorFeedback = () => {
    const {dispatchAppointments} = React.useContext(AppointmentContext)
    const {dispatchMessage} = React.useContext(MessageContext)
    const [loading, setLoading ] = React.useState(false)
    const [complete, setComplete ] = React.useState(false)
    const [submitLoading, setSubmitLoading ] = React.useState(false)
    const [details, setDetails ] = React.useState("")
    const [questions, setQuestions ] = React.useState([])
    const [score, setScore ] = React.useState(null)
    const [progress, setProgress] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const { id } = useParams()
    const history = useHistory()
    // snackbar
    const [snackopen, setSnackOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const snackref = React.useRef(null)
    // theme, styles, media queries
    const theme = useTheme()
    const classes = useDoctorFeedbackStyles()
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))
    const matchesXs = useMediaQuery(theme.breakpoints.down('xs'))
    // color for circular progress
    const [color, setColor] = React.useState('primary')
    
    
    React.useEffect(() => {
        // handling of circular progress display
        if (!score ){
            fetchApptDetails() 
            return
        }
        handleColor(score)
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= score ? score : prevProgress + 5));
            }, 100);
            
        return () => {
            clearInterval(timer)
        }
    
    }, [score])

    // get appointment details
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
            const response =  await axiosAuthInstance(api.appointments.doctorfeedback(`${id}`), config)
            setDetails(response.data)
            setLoading(false)
            setQuestions(response.data.questions)
            // handling of score
            let scoreCount = 0
            response.data.questions.forEach(question => {
                if (question.answered){
                    scoreCount += 1
                }
            })
            setScore(Math.round((scoreCount/response.data.questions.length) * 100))   
        }catch(error){
            console.log('error fetching appointment details')
            setLoading(false)
        }
       
    }
    // dialog display
    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
    setOpen(false);
    };

    // send email to patient through dialog
    async function handleSubmit(e){
        e.preventDefault()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        try{
            const result = await axiosAuthInstance.post(api.appointments.doctorfeedbackemail(`${id}`), {email}, config)
            snackref.current.click()
            setOpen(false)
        }
        catch(error){
            console.log('error sending email')
        }

    }
    // snackbar
    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
      }
    
    const handleSnackClick = (Transition) => () => {
    setTransition(() => Transition);
    setSnackOpen(true);
    };

    const handleSnackClose = () => {
    setSnackOpen(false);
    };
    // set color of circular progress
    function handleColor(score){
        if(score <=25){
            setColor('red')
        }
        else if(score > 25 && score <=50 ){
            setColor('orange')
        }
        else if(score > 50 && score <=75 ){
            setColor('yellow')
        }
        else{
            setColor('green')
        }

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
        <SEO title="Feedback"/> 
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
            {score && (
                <CardContent style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Total Score
                    </Typography>
                    <CircularProgressWithLabel iconcolor={color} value={progress}/>  
                </CardContent>
            )}
            {questions && questions.map( (question, i)  => (
                <>
                <Card className={question.answered ? classes.answered: classes.notanswered} key={question.id}>
                    <CardContent>
                        <Typography variant="h6" align="center" color="primary" gutterBottom>
                        {`Question${i+1}`}
                        </Typography>
                        <div className={classes.cardContent}>
                        <Typography align="center" variant="subtitle1"> 
                            {question.content}
                        </Typography> 
                        {question.answered ? (
                            <Icon fontSize="large" color="secondary">
                                <CheckCircleIcon/>
                            </Icon>
                        ): (
                            <Icon fontSize="large" color="error">
                                <CancelIcon/>
                            </Icon>
                        )}
                        
                        </div>
                    </CardContent>
                </Card>
                
                </>
            ))}
            <div className={classes.bottom}>
            <Snackbar
                open={snackopen}
                onClose={handleSnackClose}
                TransitionComponent={transition}
                message="Email Sent!"
                key={transition ? transition.name : ''}
            />
                <Button ref={snackref} style={{display:'none'}} onClick={handleSnackClick(TransitionDown)}>

                </Button>
                <Button  
                onClick={handleClickOpen}
                endIcon = {<CheckCircleIcon/>}
                className={classes.button} color="primary" variant="outlined" size="large">
                   Send email
                </Button>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{`Send email to ${details.first_name} ${details.last_name}`}</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Consider getting in touch if you are unsatisfied with the results of the visit.
                    </DialogContentText>
                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        variant="filled"
                        margin="normal"
                        multiline
                        rows="8"
                        rowsMax="20"
                        id="email"
                        label="Email Content"
                        type="text"
                        fullWidth
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={(event) => {
                        handleSubmit(event)
                        }} color="primary">
                        Send
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
            
        </Layout>
        </>
    )
}

export default DoctorFeedback


 

  