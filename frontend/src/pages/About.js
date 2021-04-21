import { Paper, Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/Seo'
import { useAboutStyles } from '../styles'
import AboutStepper from '../components/AboutStepper'



const About = () => {
    const classes = useAboutStyles()
    
    return (
          <>
          <SEO title="About"/> 
          <Layout>
           <Paper className={classes.root}>
               <Typography className={classes.bold} align="center" variant="h3" gutterBottom color="textPrimary">
                  The Problem
               </Typography>
               <Typography>
                 {" "}
                 {" "}
                 {" "}
               </Typography>
               <Typography align="center" variant="body1" gutterBottom color="textSecondary">
                    Both Patients and Doctors are overwhelmed by the demands of standard primary care visits. Patients often forget their questions and concerns
                    or may hesitate to share them while physicians are incentivized not to linger and hear them. It is very difficult for a patient to get back 
                    in touch with their doctor following a visit. This may promote poor outcomes and experience.
               </Typography>
               <Typography className={classes.bold} align="center" variant="h3" gutterBottom color="textPrimary">
                  The Solution
               </Typography>
               <Typography>
                 {" "}
                 {" "}
                 {" "}
               </Typography>
               <Typography align="center" variant="body1" gutterBottom color="textSecondary">
                    BETTER is a web app designed to allow patients to prepare and organize questions and concerns ahead of a visit with their doctor. The
                    treating physican can access these questions before and during the patient's visit to ensure both are on the same page.
                    Following the visit, the patient will recieve an email providing a link to verify whether they feel each question was answered.
                    The physican will have access to this feedback and can quickly respond to the patient's feedback if anything was not addressed sufficiently.
               </Typography>
               <Typography>
                 {" "}
                 {" "}
                 {" "}
               </Typography>
               <Typography align="center" variant="body1" gutterBottom color="textSecondary">
                    Simplicity is the goal. Patients will simply need to click on email links and fill out simple forms. They do NOT need to create an account.
                    The Physician will need to create a free account, providing the ability to manage patients, appointments, and receive feedback.

               </Typography>
               <Typography className={classes.bold} align="center" variant="h3" gutterBottom color="textPrimary">
                  The Steps
               </Typography>
               <AboutStepper/>
           </Paper>
           </Layout>
          </>
          
    )
}

export default About