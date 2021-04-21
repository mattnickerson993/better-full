import { Button, Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import SEO from '../components/Seo'
import { usePasswordConfirmStyles } from '../styles'

const PasswordConfirmMessage = () => {
    const classes = usePasswordConfirmStyles()

    return (
      <>
      <SEO title="Password Reset"/> 
         
          <div className={classes.container}>
           <Typography variant="h6" style={{marginBottom:'2em', marginTop: '2em'}}>
             Your password has been reset.
           </Typography>
             <Link to="/login/" className={classes.link}>
               <Button className={classes.btn} variant="contained" color="secondary">
                Login
               </Button>
             </Link>
           
          </div>
      </>
    )
}

export default PasswordConfirmMessage