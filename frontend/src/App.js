
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import routes from './config/routes'
import { AuthProvider, MessageProvider, PatientProvider, AppointmentProvider } from './context'

function App() {
  
  return (
    <>
      <MessageProvider>
      <AuthProvider>
      <PatientProvider>
      <AppointmentProvider>
        <Router >
          <Switch>
            {routes.map(route => (
              (
                <Route
                key={route.path}
                path={route.path}
                component={route.component}
                exact={route.exact}
                  />
              )
            ))}  
          </Switch>
        </Router>
      </AppointmentProvider>
      </PatientProvider>
      </AuthProvider>
      </MessageProvider>
    </>
  );
}

export default App;
