import React from 'react'
import Layout from '../components/Layout'
import PatientCreate from '../components/PatientCreate'
import PatientList from '../components/PatientList'
import AppointmentCreate from '../components/AppointmentCreate'
import AppointmentList from '../components/AppointmentList'
import {api} from '../api'
import axios from 'axios'
import { AppointmentContext, PatientContext } from '../context'
import { Grid, useMediaQuery, useTheme } from '@material-ui/core'
import Scorecard from '../components/Scorecard'
import SEO from '../components/Seo'
import ThirtyScorecard from '../components/ThirtyScoreCard'
import { useHomeStyles } from '../styles'
import axiosAuthInstance from '../axios'


const Home = () => {
    const {patients, dispatchPatients} = React.useContext(PatientContext)
    const {appointments, dispatchAppointments} = React.useContext(AppointmentContext)
    const [questions, setQuestions] = React.useState("")
    const [loadingQuestions, setLoadingQuestions ] = React.useState(true)
    const [thirtyDayQuestions, setThirtyDayQuestions] = React.useState("")
    const [loadingThirtyDayQuestions, setLoadingThirtyDayQuestions] = React.useState(true)
    // stlyes and media queries
    const classes = useHomeStyles()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))
    const matchesXs = useMediaQuery(theme.breakpoints.down('xs'))

    React.useEffect(() => {
        fetchPatients()
        fetchAppointments()
        fetchStats()
        fetch30DayStats()
    },[])

    // fetch patients to set initial context
    async function fetchPatients(){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        const response  = await axiosAuthInstance(api.patients.list, config)
        dispatchPatients({type: 'ADD_PATIENTS', payload:response.data})
        
    }
    // fetch appointments to set initial context
    async function fetchAppointments(){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        const response  = await axiosAuthInstance(api.appointments.list, config)
        dispatchAppointments({type:'ADD_APPOINTMENTS', payload:response.data})
        
    }
    // fetch question stats
    async function fetchStats(){
        setQuestions("")
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        const response  = await axiosAuthInstance(api.appointments.feedbacklist, config)
        
        await response.data.forEach(item => {
                setQuestions(prev => (
                    [...prev, ...item.questions]
                ))
            
            }
        )
        setLoadingQuestions(false)
    }
    // fetch question stats over last 30 days
    async function fetch30DayStats(){
        setThirtyDayQuestions("")
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        const response  = await axiosAuthInstance(api.appointments.thirtyfeedbacklist, config)
        await response.data.forEach(item => {
            setThirtyDayQuestions(prev => (
                [...prev, ...item.questions]
            ))
        
        })
        setLoadingThirtyDayQuestions(false)  
    }

    
    return (
        <>
        <SEO title="Home"/>  
        <Layout>
            <div className={matchesXs ? classes.rootSm: classes.root}>
                <Grid container spacing={3}>
                    
                    <Grid item xs={12} md={8}>
                        <AppointmentCreate patients={patients.patients} patientsLoading={patients.loading}/>
                        {!appointments.loading && <AppointmentList appointments={appointments.appointments} appointmentsLoading={appointments.loading} />}
                        
                        <PatientCreate/>
                        {!patients.loading && <PatientList patients={patients.patients} patientsLoading={patients.loading}/>}
                        
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {!loadingQuestions && 
                            <Scorecard questions={questions} />
                        }   
                        {!loadingThirtyDayQuestions &&
                            <ThirtyScorecard questions={thirtyDayQuestions}/>
                        }
                    </Grid>
                    
                </Grid>
            </div>
        </Layout>
        </>
    )
}

export default Home
