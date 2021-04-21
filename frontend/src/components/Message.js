import Alert from '@material-ui/lab/Alert'

export const Message = ({message, severity, variant}) => {
    
    return (
        <Alert
          variant={variant} 
          severity={severity}
        >
          {message}
        </Alert>
        
    )
  }

  export const ErrorMessage = ({message, severity, variant}) => {
    
    return (
        <Alert
          variant={variant} 
          severity={severity}
        >
          {message}
        </Alert>
        
    )
  }