import { Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/Seo'


const VerifyMessage = () => {
    
    return (
        <>
        <SEO title="Confirm Account"/> 
            <Typography variant="h4" align="center" style={{marginTop: '2em'}}>
                Please check your email to confirm your account
            </Typography>
        </>
    )

}

export default VerifyMessage
