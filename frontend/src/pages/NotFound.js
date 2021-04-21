import { Button, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/Seo'


const NotFound = () => {
    
    return (
        <>
        <SEO title="Not Found"/> 
          <div style={{ height:'50vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <Typography variant="h3" align="center" gutterBottom>
                404 NOT FOUND
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
                Sorry, your request page was not found
            </Typography>
            <Link style={{textDecoration:'none'}}to="/">
                <Button variant="contained" color="primary">
                    Return to Home Page
                </Button>
            </Link>
          </div>
        </>
    )

}

export default NotFound