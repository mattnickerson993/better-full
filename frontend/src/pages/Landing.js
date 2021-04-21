import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LandingLayout from '../components/LandingLayout'
import { Button, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { useHistory } from 'react-router';
import SEO from '../components/Seo'
import { useLandingStyles } from '../styles';
import backgroundImage from "../static/images/betterlogo.jpeg"

const  Landing = (props) => {
  const classes = useLandingStyles({backgroundImage})
  const history = useHistory()
  const theme = useTheme()
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
    <SEO/>
    <LandingLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Lets Do It BETTER
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        Improve Your Outcomes, Satisfy Your Patients
      </Typography>
      <div className={matchesSm ? classes.buttonsSm: classes.buttons}>
        <Button
            color="secondary"
            variant="contained"
            size={matchesSm ? "small" : 'large'}
            className={classes.button}
            onClick={() => history.push('/signup/')}
        >
            Register
        </Button>
        <Button
            color="primary"
            variant="contained"
            size={matchesSm ? "small" : 'large'}
            className={classes.button}
            onClick={() => history.push('/login/')}
        >
            Log In
        </Button>
      </div>
      <div className={classes.more}>
      <Typography align="center" onClick={()=>history.push('/noauth/about/')} variant="body2" color="inherit" >
        Tell Me More
      </Typography>
      </div>
    </LandingLayout>
    </>
  );
  
}



export default Landing
