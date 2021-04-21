import { Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/Seo'

const PasswordMessage = () => {
    
    return (
        <>
        <SEO title="Password Email Sent"/> 
           <Typography variant="h4" align="center" style={{marginTop: '2em'}}>
             A Password Reset Email has been sent. Please check your email
           </Typography>
        </>
    )
}

export default PasswordMessage