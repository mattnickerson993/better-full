import { Button, Card, CardContent, CardHeader, CircularProgress, InputAdornment, TextField, Typography } from '@material-ui/core'
import React from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { api } from '../api'
import axios from 'axios'
import Layout from '../components/Layout'
import { signup, AuthContext } from '../context'
import isEmail from 'validator/lib/isEmail'
import { useForm } from 'react-hook-form'
import { CheckCircleOutline, HighlightOff } from '@material-ui/icons'
import {ErrorMessage} from '../components/Message'
import SEO from '../components/Seo'
import { useSignUpStyles } from '../styles'

const SignUp = () => {
    const classes = useSignUpStyles()
    const [loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState(null)
    const history = useHistory()
    const [accountCreated, setAccountCreated] = React.useState(false)
    const { register, handleSubmit, formState, errors  } = useForm({mode:"onBlur"})
    const { state, dispatch } = React.useContext(AuthContext)

    React.useEffect(()=>{
        dispatch({type:"RESET_ERROR"})
    },[])
    

    async function onSubmit(data){
        setLoading(true)
        setError("")
        const { email, firstname, lastname, password, confirmpassword} = data
        try{

            if (password !== confirmpassword){
                setError('Passwords must match')
                return
            }
            const res = await signup(dispatch, {email, first_name:firstname, last_name:lastname, password, re_password: confirmpassword})
            if (res.status !== 201){
                setLoading(false)
                return
            }
            setAccountCreated(true)
        }catch(err){
            setError('Sorry, there was an error signing up')
            setLoading(false)
            
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

    if(accountCreated){
        return <Redirect to="/verify-account-message/" />
    }
    return (
        <>
        <SEO title="Sign Up"/> 
        <section className={classes.section}>
            <article>
                <Card >
                    <CardContent>
                    <Typography variant="h2">
                        Please Sign Up Below
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} action="">
                    <TextField
                    name="email"
                    inputRef={register({
                        required: true,
                        minLength: 2,
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
                    autoComplete="email"
                    />
                    <TextField
                    name="firstname"
                    inputRef={register({
                        required: true,
                        minLength: 2,
                        maxLength: 30,
                    })}
                    InputProps={{
                        endAdornment: errors.firstname ? errorIcon : formState.touched.firstname && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="First Name"
                    margin="dense"
                    autoComplete="firstname"
                    />
                    <TextField
                    name="lastname"
                    inputRef={register({
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                    })}
                    InputProps={{
                        endAdornment: errors.lastname ? errorIcon : formState.touched.lastname && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Last Name"
                    margin="dense"
                    autoComplete="lastname"
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
                    autoComplete="current-password"
                    />
                    <TextField
                    name="confirmpassword"
                    inputRef={register({
                        required: true,
                        minLength: 5,
                    })}
                    InputProps={{
                        endAdornment: errors.confirmpassword ? errorIcon : formState.touched.confirmpassword && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Confirm Password"
                    type="password"
                    margin="dense"
                    autoComplete="current-password-confirm"
                    />
                    <Button
                    disabled={!formState.isValid || formState.isSubmitting}
                    variant="contained"
                    fullWidth
                    color="primary"
                    type="submit"
                    endIcon={loading && <CircularProgress/>}>
                        Sign up
                    </Button>
                    </form>
                    {error && <ErrorMessage variant="outlined" severity="error" message={error} />}
                    {state.errorMessage &&  <ErrorMessage variant="outlined" severity="error" message={state.errorMessage}/> }
                    </CardContent>
                </Card>
                <Card className={classes.bottomCard} >
                    <Typography className={classes.bottomCardItem} variant="body2">
                    Already have an account? 
                    </Typography>
                    <Link className={classes.bottomCardItem}  to="/login">
                    <Button color="primary">
                        Login
                    </Button>
                    </Link>
                </Card>
            </article>
        </section>
        </>
       
    )
}

export default SignUp
