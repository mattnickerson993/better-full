import { CircularProgress } from '@material-ui/core'
import React from 'react'
import { api } from '../api'
import axiosAuthInstance from '../axios'
import ArchivedAppointments from '../components/ArchivedAppointments'
import InactivePatients from '../components/InactivePatients'
import Layout from '../components/Layout'
import SEO from '../components/Seo'
import { useArchiveStyles } from '../styles'

const Archive = () => {
    const [appointments, setAppointments] = React.useState("")
    const [appointmentsLoading, setAppointmentsLoading ] = React.useState(true)
    const [patients, setPatients ] = React.useState("")
    const [patientsLoading, setPatientsLoading] = React.useState(true)
    const classes = useArchiveStyles()

    React.useEffect(() => {
        fetchArchivedAppointments()
        fetchInactivePatients()
    },[])

    // fetch all archived appts
    async function fetchArchivedAppointments(){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        try{
            const response = await axiosAuthInstance(api.appointments.archivedlist, config)
            setAppointments(response.data)
            setAppointmentsLoading(false)
        }catch(error){
            console.log(error.response)
        }
        
    }
    // fetch all inactive patients
    async function fetchInactivePatients(){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        }
        try {
            const response = await axiosAuthInstance(api.patients.inactivelist, config)
            setPatients(response.data)
            setPatientsLoading(false)
        }catch(error){
            console.log(error.response)
        }
    }
    return (
        <Layout>
            <SEO title="Archive"/> 
           {appointmentsLoading && (
               <div className={classes.loading}>
               <CircularProgress color="primary" />
           </div>
           )}
           {appointments && <ArchivedAppointments appointments={appointments}/>}
           {patientsLoading && (
               <div className={classes.loading}>
               <CircularProgress color="primary" />
           </div>
           )}
           {patients && <InactivePatients patients={patients}/>}
        </Layout>
    )
}

export default Archive
