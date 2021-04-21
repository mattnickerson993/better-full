import { Button, TextField } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import { api } from '../api'
import axios from 'axios'
import { Redirect } from 'react-router'
import { resetPassword, AuthContext } from '../context'
import SEO from '../components/Seo'
import { usePasswordResetStyles } from '../styles'

const PasswordReset = () => {
    const classes = usePasswordResetStyles()
    const [requestSent, setRequestSent] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const { dispatch } = React.useContext(AuthContext)

    async function handleSubmit(event){
        event.preventDefault()
        try{
            const res = await resetPassword(dispatch, { email })
            setRequestSent(true)
        }
        catch(err){
            console.log(err)
        }
        
        
    
        

    }

    if(requestSent){
        return  <Redirect to="/password-message/" />
        
    }

    return (
        <>
        <SEO title="Reset Password"/> 
            <form onSubmit={handleSubmit}className={classes.form}> 
            <TextField 
                name="email"
                fullWidth
                variant="filled"
                label="Email"
                type="email"
                margin="dense"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
            />
            <Button
            variant="contained"
            fullWidth
            color="primary"
            type="submit">
                Send Password Reset Email
            </Button>

            </form>
        </>
    )
}

export default PasswordReset
