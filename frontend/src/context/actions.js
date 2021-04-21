import React from 'react'
import { api } from '../api'
import axios from 'axios'
import axiosAuthInstance from '../axios'
import { Redirect } from 'react-router'





export async function loginUser(dispatch, loginPayload){
    const body = JSON.stringify(loginPayload)
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }
    try{
        const res = await axios.post(api.auth.login, body, config)
        dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data
        })
        return res.statusText
    }catch(error) {
            console.log(error.response)
            dispatch({
                type: "LOGIN_FAIL",
                payload: {
                    errorMessage: error.response.data.detail
                }
            })
        }
}

export async function logout(dispatch){
    dispatch({type: 'LOGOUT'})
}



export async function checkAuthenticated(dispatch) {
    if(localStorage.getItem('access')){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }
        const body = JSON.stringify({token: localStorage.getItem('access')})
        try{
            const res = await axiosAuthInstance.post(api.auth.verify, body, config)
            console.log(res)
            dispatch({
                type:"AUTHENTICATED_SUCCESS"
            })
        }catch(error){
            console.log(error)

            dispatch({
                type: 'AUTHENTICATED_FAIL'
            })
        }

    }

    
}

export async function load_user(dispatch){
    if(localStorage.getItem('access')){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }
    
        try{
            const res = await axiosAuthInstance.get(api.auth.getuser, config)
            console.log(res)
            dispatch({
                type: "USER_LOADED_SUCCESS",
                payload: res.data
            })
            
            
        }catch(error) {
                console.log(error)
                
                dispatch({
                    type: "USER_LOADED_FAIL",
                })
        }
    }
    else{
        dispatch({
            type:"USER_LOADED_FAIL",
        })
    }
}

export async function signup (dispatch, signupPayload){
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(signupPayload)
    
    try{
        const res = await axios.post(api.auth.register, body, config)
        dispatch({
            type: "SIGNUP_SUCCESS",
            payload: res.data
        })
        return res
    }catch(err){
        console.log(err.response)
        let message
        if(err.response.data.email){
            message = err.response.data.email.map(item => item).join("")

        }
        else if (err.response.data.password){
            message = err.response.data.password.map(item => item).join("")
            
            
        }
        else{
            message = err.response.statusText
        }
        dispatch({
            type: "SIGNUP_FAIL",
            payload: {
                errorMessage:message
            }

        })
        return err
        
        
    }

}

export async function verify(dispatch, activatePayload) {
      
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(activatePayload)
    try{
        await axios.post(api.auth.activate, body, config)
        dispatch({
            type: "ACTIVATION_SUCCESS",
        }) 

    }catch(err){
        console.log(err)
        dispatch({
            type: "ACTIVATION_FAIL",
        })
    }

    
}

export async function resetPassword(dispatch, emailPayload ){
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(emailPayload)
    try{
        await axios.post(api.auth.resetpassword, body, config)
        dispatch({type: "PASSWORD_RESET_SUCCESS"})
        
    }catch(err){
        dispatch({type: "PASSWORD_RESET_FAIL"})
    }
    

}

export async function confirmPassword(dispatch, passwordPayload) {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(passwordPayload)
    try{
        await axios.post(api.auth.resetpasswordconfirm, body, config)
        dispatch({type: "PASSWORD_RESET_CONFIRM_SUCCESS"})
    }catch(err){
        dispatch({type: "PASSWORD_RESET_CONFIRM_FAIL"})
    }
    

}