import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useLandingLayoutStyles } from '../styles';

const LandingLayout = ({backgroundClassName, children}) => {
  const classes = useLandingLayoutStyles()

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
       
        {children}
        <div className={classes.backdrop} />
        <div className={clsx(classes.background, backgroundClassName)} />
       
      </Container>
    </section>
  );
}



export default LandingLayout