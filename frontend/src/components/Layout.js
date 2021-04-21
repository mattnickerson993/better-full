import React from 'react'
import Navbar from './Navbar'
import {load_user, checkAuthenticated, loginUser, AuthContext, MessageContext} from '../context'
import {Message} from "./Message"
import { Redirect } from 'react-router'
import { CircularProgress, makeStyles, Typography } from '@material-ui/core'

const useLayoutStyles = makeStyles(theme => ({
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    
    },
}))
const Layout = ({children}) => {
    const { state, dispatch } = React.useContext(AuthContext)
    const { message, dispatchMessage } = React.useContext(MessageContext)
    const [loading, setLoading ] = React.useState(true)
    const classes= useLayoutStyles()
    React.useEffect(() => {
        async function checkAuthAndUser(){
            try{
                await checkAuthenticated(dispatch)
                await load_user(dispatch)
            }catch(error){
                console.log('error loading user data')
            }
            
        }
        dispatch({type:"RESET_ERROR"})
        checkAuthAndUser()
        setLoading(false)
        
    },[])

   

    if (loading ){
        return (
            <div className={classes.loading}>
                <CircularProgress/>
            </div>
        )
    }
    if ( !loading && state.isAuthenticated){
        return (
            <>
               <Navbar/> 
               {children}
               
            </>
        )
    }
    else if (!loading && !state.isAuthenticated){
        // return (
        // <Redirect to="/login/"/>
        // )
        return (
            <>
            <Navbar/>
            <div className={classes.loading}>
                <CircularProgress/>
            </div>
            </>
        )
    }
    else return 
    
}

export default Layout
