import { Button, Card, CardContent, CardHeader, CircularProgress, InputAdornment, TextField, Typography } from '@material-ui/core'
import { HighlightOff, CheckCircleOutline } from '@material-ui/icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, Redirect, useHistory } from 'react-router-dom'
import isEmail from 'validator/lib/isEmail'
import axios from "axios"
import { api } from '../api'
import Layout from '../components/Layout'
import { AuthContext, loginUser, checkAuthenticated, MessageContext } from '../context'
import { ErrorMessage } from '../components/Message'
import SEO from '../components/Seo'
import { useLoginStyles } from '../styles'


const Login = () => {
    const [loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState(null)
    const [loginSuccess, setLoginSuccess] = React.useState(false)
    const { register, handleSubmit, formState, errors } = useForm({mode: 'onBlur'})
    const { state, dispatch } = React.useContext(AuthContext)
    const classes = useLoginStyles()
    const history = useHistory()
    // const { message, dispatchMessage } = React.useContext(MessageContext)


    React.useEffect(()=>{
        dispatch({type:"RESET_ERROR"})
        // checkLoginAuth(dispatch)
    },[])

    // async function checkLoginAuth(dispatch){
    //     if(localStorage.getItem('access')){
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json',
    //             }
    //         }
    //         const body = JSON.stringify({token: localStorage.getItem('access')})
    //         try{
    //             const res = await axios.post(api.auth.verify, body, config)
    //             console.log(res)
    //             dispatch({
    //                 type:"AUTHENTICATED_SUCCESS"
    //             })
    //         }catch(error){
    //             console.log(error)
    
    //             dispatch({
    //                 type: 'AUTHENTICATED_FAIL'
    //             })
    //         }
    //     }
    // }

    async function onSubmit(data){
        setLoading(true)
        const {email, password } = data
        try{
            dispatch({type:"RESET_ERROR"})
            const res = await loginUser(dispatch, {email, password})
            if (res === "OK"){
                setTimeout(() => {
                    setLoading(false)
                    setLoginSuccess(true)
                },2000
                )
            
        }
            
        }catch(error){
            console.log(error)
            setError(error.message || error )
        }
        

    }

    const errorIcon = (
        <InputAdornment>
            <HighlightOff style={{color: 'red', height: 30, width: 30}} />
        </InputAdornment>
    )

    const validIcon = (
        <InputAdornment>
            <CheckCircleOutline style={{color: 'green', height: 30, width: 30}} />
        </InputAdornment>
    )

    
    if(loginSuccess){
        // dispatchMessage({ type:"SET_MESSAGE", payload:{contents: 'Welcome! You have successfully signed in.'}})
        return <Redirect to="/home/" />
    }
    return (
        <>
        <SEO title="Login"/> 
        <section className={classes.section}>
           { state.errorMessage &&  <ErrorMessage variant="outlined" severity="error" message={state.errorMessage}/> }
            <article>
                <Card >
                    <CardContent>
                    <Typography variant="h2">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} action="">
                    <TextField 
                    name="email"
                    inputRef={register({
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                        validate: (input) => isEmail(input),
                    })}
                    InputProps={{
                        endAdornment: errors.email ? errorIcon : formState.touched.email && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Email"
                    margin="dense"
                    />
                    <TextField 
                    name="password"
                    inputRef={register({
                        required: true,
                        minLength: 5,
                    })}
                    InputProps={{
                        endAdornment: errors.password ? errorIcon : formState.touched.password && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Password"
                    type="password"
                    margin="dense"
                    />
                    <Button
                    disabled={!formState.isValid || formState.isSubmitting}
                    variant="contained"
                    fullWidth
                    color="primary"
                    type="submit"
                    endIcon={loading && <CircularProgress/>}>
                        Login
                    </Button>
                    </form>

                    </CardContent>
                    <div className={classes.linkContainer}>
                        <Link className={classes.link} to="/password-reset/">
                        <Button fullWidth color="secondary">
                                <Typography variant="caption">
                                Forgot Password?
                                </Typography>
                        </Button>
                        </Link>
                    </div>
                    
                </Card>
                <Card className={classes.bottomCard} >
                    <Typography className={classes.bottomCardItem} variant="body2">
                    Don't have an account? 
                    </Typography>
                    <Link className={classes.bottomCardItem}  to="/signup/">
                    <Button color="primary">
                        Sign up
                    </Button>
                    </Link>
                </Card>
            </article>
        </section>
        </>
       
    )
}

export default Login