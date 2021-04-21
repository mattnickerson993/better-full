import { Button, TextField } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import { api } from '../api'
import axios from 'axios'
import { useParams, useHistory } from 'react-router'
import { confirmPassword, AuthContext } from '../context'
import SEO from '../components/Seo'
import { usePasswordResetConfirmStyles } from '../styles'

const PasswordResetConfirm = () => {
    const classes = usePasswordResetConfirmStyles()
    const [newpassword, setnewpassword] = React.useState("")
    const [newpasswordconfirm, setnewpasswordconfirm] = React.useState("")
    const { dispatch } = React.useContext(AuthContext)
    const { uid, token } = useParams()
    const history = useHistory()

    async function handleSubmit(event){
        event.preventDefault()
        try{
            const res = await confirmPassword(dispatch, {uid, token, new_password: newpassword, re_new_password: newpasswordconfirm})
            console.log(res)
            history.push("/password-confirm/message")
        }catch(error){
            console.log(error)
        }
        
        

    }

    return (
        <>
        <SEO title="New Password"/> 
            <form onSubmit={handleSubmit}className={classes.form}> 
            <TextField 
                name="new_password"
                fullWidth
                variant="filled"
                label="New Password"
                type="password"
                margin="dense"
                value={newpassword}
                onChange={(e)=> setnewpassword(e.target.value)}
            />
            <TextField 
                name="re_new_password"
                fullWidth
                variant="filled"
                label="Confirm New Password"
                type="password"
                margin="dense"
                value={newpasswordconfirm}
                onChange={(e)=> setnewpasswordconfirm(e.target.value)}
            />
            <Button
            variant="contained"
            fullWidth
            color="primary"
            type="submit">
                Submit New Password
            </Button>

            </form>
        </>
    )
}

export default PasswordResetConfirm