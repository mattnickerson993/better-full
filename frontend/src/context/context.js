import React from 'react'
import { initialState, AuthReducer, initialMessageState, MessageReducer, initialPatientState, PatientReducer, initialAppointmentState, AppointmentReducer} from './reducer'

export const AuthContext = React.createContext()


export const AuthProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(AuthReducer, initialState)

    return (
    <AuthContext.Provider value={{ state, dispatch }}>
            {children}
     </AuthContext.Provider>
    )
}


export const MessageContext = React.createContext()

export const MessageProvider = ({children}) => {
    const [message, dispatchMessage] = React.useReducer(MessageReducer, initialMessageState)

    return (
        <MessageContext.Provider value={{message, dispatchMessage}}>
            {children}
        </MessageContext.Provider>
    )
}

export const PatientContext = React.createContext()

export const PatientProvider = ({children}) => {
    const [patients, dispatchPatients] = React.useReducer(PatientReducer, initialPatientState)

    return (
        <PatientContext.Provider value={{patients, dispatchPatients}}>
            {children}
        </PatientContext.Provider>
    )
}

export const AppointmentContext = React.createContext()

export const AppointmentProvider = ({children}) => {
    const [appointments, dispatchAppointments ] = React.useReducer(AppointmentReducer, initialAppointmentState)

    return (
        <AppointmentContext.Provider value = {{appointments, dispatchAppointments}}>
            {children}
        </AppointmentContext.Provider>
    )

}
    