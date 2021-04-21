import { CardActionArea } from "@material-ui/core"
import React from "react"



// authentication/user info/password reset

export const initialState = {
    userDetails: "",
    isAuthenticated: false,
    errorMessage:"",
    loading:false,
}

export const AuthReducer = (state, action ) => {
    switch(action.type){
        case "LOGIN_SUCCESS":{
            localStorage.setItem('access', action.payload.access)
            localStorage.setItem('refresh', action.payload.refresh)
    
            return {
                ...state,
                isAuthenticated: true,
                    
            }
        }
        case "USER_LOADED_SUCCESS":
            return{
                ...state,
                userDetails: action.payload,
            }
        case "USER_LOADED_FAIL":
            return{
                ...state,
                userDetails: null 
            }
        
        case "LOGOUT":
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: false,
                userDetails:null,
                
            }
    
        case "LOGIN_FAIL":{
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: false,
                errorMessage:action.payload.errorMessage
                
            }
        }
    
        case "AUTHENTICATED_SUCCESS":{
            return{
                ...state,
                isAuthenticated: true,
            }
        }
    
        case "AUTHENTICATED_FAIL":{
           return {
            ...state,
            isAuthenticated: false,
           } 
        }
    
        case "PASSWORD_RESET_SUCCESS":{
            return{
                ...state,
            }
        }
    
        case "PASSWORD_RESET_FAIL":{
            return{
                ...state,
            }
        }
    
        case "PASSWORD_RESET_CONFIRM_SUCCESS":{
            return{
                ...state,
            }
        }
    
        case "PASSWORD_RESET_CONFIRM_FAIL":{
            return{
                ...state,
            }
        }
    
        case "SIGNUP_SUCCESS":{
            return {
                ...state,
                isAuthenticated: false,
            }
        }
    
        case "SIGNUP_FAIL":{
            return {
                ...state,
                errorMessage:action.payload.errorMessage
            }
        }
    
        case "ACTIVATION_SUCCESS":{
            return {
                ...state
            }
        }
    
        case "ACTIVATION_FAIL":{
            return {
                ...state
            }
        }

        case "UPDATE_ACCESS":{
            return {
                ...state,
            }
        }
        case "RESET_ERROR":{
            return {
                ...state,
                errorMessage:""
            }
        }
        case "MESSAGE_CLEAR":{
            return {
                ...state,
            }
        }
    
        default:{
            return state
        }
    }
    
}


// messaging 

export const initialMessageState = {
    contents:""
}

export const MessageReducer = (state, action) => {

    switch(action.type){
        case "SET_MESSAGE":{
            return{
                contents:action.payload.contents
            }
        }
        case "CLEAR_MESSAGE": {
            return{
                ...initialMessageState,
            }
            
        }

        default:{
            return state
        }
    }
}


// patients

export const initialPatientState = {
    patients: null,
    loading: true
}


export const PatientReducer = (state, action) => {

    switch(action.type){
        case "ADD_PATIENTS":{
            return{
                patients:action.payload,
                loading: false
            }
        }
        case "ADD_PATIENT":{
            return{
                ...state,
                patients:[action.payload, ...state.patients]
            }
        }
        case "UPDATE_PATIENT":{
            return{
                ...state,
                patients:state.patients.map((patient) => {
                    if(patient.id == action.payload.id){
                        return action.payload
                    }
                    return patient
                })
            }
        }
        case "DELETE_PATIENT": {
            return{
                ...state,
                patients:state.patients.filter((patient) => patient.id !== action.payload.id)
            }
            
        }
        case "ARCHIVE_PATIENT": {
            return{
                ...state,
                patients:state.patients.filter((patient) => patient.id !== action.payload.id)
            }
            
        }

        default:{
            return state
        }
    }
}

// appointments

export const initialAppointmentState = {
    appointments: null,
    loading: true,
}

export const AppointmentReducer = (state, action) => {

    switch(action.type){
        case "ADD_APPOINTMENTS":{
            return{
                appointments:action.payload,
                loading:false,
            }
        }
        case "ADD_APPOINTMENT":{
            return{
                ...state,
                appointments: [action.payload, ...state.appointments]
                
            }
        }
        case "UPDATE_APPOINTMENT_STATUS":{
            return{
                ...state, 
                appointments: state.appointments.map(appointment => {
                    if(appointment.id === action.payload.id){
                        appointment.status = "Sent"
                        return appointment
                    }
                    return appointment
                })
                    
                    
            }
        }
        case "UPDATE_APPOINTMENT_STATUS_AFTER_EDIT_PATIENT":{
            return{
                ...state, 
                appointments: state.appointments.map(appointment => {
                    if(appointment.patient === action.payload.id){
                        return { 
                            ...appointment,
                            email: action.payload.email,
                            first_name: action.payload.first_name,
                            last_name: action.payload.last_name,
                            date_of_birth: action.payload.date_of_birth,
                        }
                    }
                    return appointment
                })
                    
                    
            }
        }
        case "UPDATE_APPOINTMENTS_PATIENT_ARCHIVE":{
            return{
                ...state, 
                appointments: state.appointments.filter( (appointment) => appointment.patient !== action.payload.id)
                          
            }
        }
        case "DELETE_APPOINTMENT": {
            return{
                ...state,
                appointments: state.appointments.filter((appointment) => appointment.id !== action.payload.id)
            }
            
        }

        case "ARCHIVE_APPOINTMENT": {
            return{
                ...state,
                appointments: state.appointments.filter((appointment) => appointment.id !== action.payload.id)
            }
            
        }

        default:{
            return state
        }
    }
}