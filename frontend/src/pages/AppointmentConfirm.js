import { Button, ButtonBase, CircularProgress, Icon, IconButton, InputAdornment, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useHistory } from 'react-router'
import axios from 'axios'
import {api} from '../api'
import AddBoxIcon from '@material-ui/icons/AddBox'
import DeleteIcon from '@material-ui/icons/Delete'
import SEO from '../components/Seo'
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { useAppointmentConfirmStyles } from '../styles'


// speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'


const AppointmentConfirm = () => {
    const [loading, setLoading ] = React.useState(false)
    const [confirm, setConfirm] = React.useState(false)
    const [questionCount, setQuestionCount] = React.useState(1)
    const { token, appttoken } = useParams()
    const [isListening, setIsListening] = React.useState(false)
    const [currentQuestionListen, setCurrentQuestionListen] = React.useState(1)
    const [questions, setQuestions] = React.useState([
        {'1': ""}
    ])
    const { register, handleSubmit, formState, errors } = useForm({mode: 'onBlur'})
    const classes = useAppointmentConfirmStyles()
    const theme = useTheme()
    const matchesXs = useMediaQuery(theme.breakpoints.down('xs'))

    React.useEffect(() => {
        handleListen(currentQuestionListen)
      }, [isListening])

    // submit data
    async function onSubmit(data){
        const {question1, question2, question3, question4, question5, question6, question7 } = data

        try{
            setLoading(true)
            const res = await axios.post(api.appointments.patientconfirm, {question1, question2, question3, question4,
                question5, question6, question7, token, appttoken} )
            
            setTimeout(()=>{
                setLoading(false)
                setConfirm(true)
            },2000)
            
        }catch(error){
            setLoading(false)
            console.log(error)
        }
    }
    // update state for speech recognition
    const handleListen = (questionnum) => {
        if (isListening) {
          mic.start()
          mic.onend = () => {
            console.log('continue..')
            mic.start()
          }
        } else {
          mic.stop()
          mic.onend = () => {
            console.log('Stopped Mic on Click')
          }
        }
        mic.onstart = () => {
          console.log('Mics on')
        }
    
        mic.onresult = event => {
        const transcript = Array.from(event.results)
            .map(result => ({
                final: result.isFinal,
                transcript: result[0].transcript,
                confidence: result[0].confidence
            }))
            
         if (transcript[0].final && transcript[0].confidence > .7){
             
            setQuestions(prev => (
            prev.map( (question, i) => {
                if(i + 1 === questionnum){
                    if( question[questionnum] !== ""){
                        let value = question[questionnum]
                        return {
                        [`${questionnum}`]: `${value} ${transcript[0].transcript}`
                        }
                    }
                    else
                    return {
                    [`${questionnum}`]: `${transcript[0].transcript}`
                    }
                }
                else {
                    return question
                }
            })
            ))   
         }
          mic.onerror = event => {
            console.log(event.error)
          }
        }
      }

    //   update question text in state
    function handleQuestions(value, num){
        setQuestions(prev => (
         prev.map( (question, i) => {
            if(i + 1 === num){
                return {
                    [`${num}`]: value
                }
            }
            else {
                return question
            }
         })
        ))
    }
    // delete question from state when removed
    function handleRemoveQuestion(length){
        setQuestions(prev => (
            prev.filter( (question, i) => {
               if(i + 1 === length){
                   return false
                   
               }
               else {
                   return true
               }
            })
           ))
    }
   
    if (confirm){
        return (
            <Typography className={classes.confirm} align="center" variant="h4" component="h6">
                Thank you. Your List has been submitted. We look foward to seeing
                you at your appointment.
            </Typography>
        )
    }
    return (
        <>
        <SEO title="Confirm Appointment"/> 
        <Typography style={{marginTop: '16px', marginBottom: '16px'}}align="center" variant={matchesXs ? "h6": "h4"} component="h4">
            Questions or Concerns (You may list up to 7)
        </Typography>
        <div>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} action="">
            {questions.map((question, i) => (
                <TextField 
                key={i}
                autoFocus
                name={`question${i + 1}`}
                placeholder="Share Questions or Concerns Here..."
                value={questions[i][`${i+1}`]}
                onChange={(e) => handleQuestions(e.target.value, i+1)}
                inputRef={register(questionCount === 1? {
                    required: true,
                }:{
                    required: false,
                })}
                fullWidth
                multiline
                rows="8"
                rowsMax="20"
                variant="filled"
                label={`Question/Concern #${i+1}`}
                margin="dense"
                className={classes.text}
                InputProps={{
                   startAdornment: 
                   <InputAdornment style={{marginBottom:'auto', marginTop: '34px'}} position="start">
                       <Tooltip title="Use Your Voice">
                           <IconButton 
                           onClick={() => {
                               setCurrentQuestionListen(i+1)
                               setIsListening(prevState => !prevState)
                               }}>
                               {isListening && currentQuestionListen === i+1 ? <MicOffIcon/> : <MicIcon/>}  
                           </IconButton>
                       </Tooltip>
                   </InputAdornment>,
                   classes: {
                       input: classes.resize,
                       },
               }}
               InputLabelProps={{
                   classes:{
                       root: classes.labelRoot,
                       focused: classes.labelFocused
                   }
                   
               }}
                />

            ))}
            <Button
            disabled={!formState.isValid || formState.isSubmitting}
            variant="contained"
            fullWidth
            color="primary"
            type="submit"
            endIcon={loading && <CircularProgress/>}>
                Submit All Questions
            </Button>
        </form>
        </div>
        <div className={classes.buttons}>
        { questions.length < 7 && (
            <Button 
            variant="outlined" 
            color="primary"
            endIcon={<AddBoxIcon/>}
            onClick={() => setQuestions(prev => [...prev, {[`${questions.length+1}`]: ""}])}
            className={classes.button}
            >
                Click To Add Question
            </Button>
        ) }
        { questions.length> 1 && (
            <Button 
            variant="outlined" 
            color="secondary"
            endIcon={<DeleteIcon/>}
            onClick={() => handleRemoveQuestion(questions.length)}
            className={classes.button}
            >
                Click To Remove Question
            </Button>
            
        )}
        </div>
       
        </>
        
    )
}

export default AppointmentConfirm

