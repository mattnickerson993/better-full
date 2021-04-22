import React from 'react'
import { api } from '../api'
import axios from 'axios'
import { Button } from '@material-ui/core'
import Layout from '../components/Layout'
import { Redirect, useParams } from 'react-router'
import { verify, AuthContext} from '../context'
import SEO from '../components/Seo'
import { useActivateAccountStyles } from '../styles'

const ActivateAccount = () => {
    const [verified, setVerified] = React.useState(false)
    const classes = useActivateAccountStyles()
    const { uid, token } = useParams()
    const { dispatch } = React.useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const res = await verify(dispatch, { uid, token })
            setVerified(true)
        }catch(err){
            console.log(err)
        }
        
    }
 
    
    if(verified){
        return <Redirect to="/login/"/>
    }
    return (
        <>
        <SEO title="Activate Account"/> 
        <form onSubmit={handleSubmit} className={classes.form}> 
        <Button
        variant="contained"
        fullWidth
        color="primary"
        type="submit">
            Confirm Account Activation
        </Button>

        </form>
        
    </>
    )
}

export default ActivateAccount
