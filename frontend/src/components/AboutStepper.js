import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useAboutStepperStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  step: {
    "& $completed": {
      color: theme.palette.primary.main
    },
    "& $active": {
      color: theme.palette.primary.main
    },
  },
  completeStep: {
    "& $completed": {
      color: theme.palette.secondary.main
    },
    "& $active": {
      color: theme.palette.secondary.main
    },
  },
  active: {}, //needed so that the &$active tag works
  completed: {},


}));

function getSteps() {
  return ['Physician Signs Up for Free then Adds Patients and Appointments', 'Physician Sends Initial Email to Patient prior to Appointment', 'Patient provides questions and concerns',
          'Physician Reviews Questions and Concerns', 'Patient provides Feedback', 'Physician Reviews Feedback', 'Physician has option for further follow up'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `Physicians may create a free account and keep track of any number of patients and appointments`;
    case 1:
      return `Physicians can simply click a button to send an automated email prior to a patient's scheduled
              appointment. This email will provide appointment details and a simple link for patients to click 
              on.`
    case 2:
      return `By clicking the email link, patients will be taken to a form where they can list up to 7 questions 
              or concerns they hope to address at their upcoming appointment. They will not need to sign up with a 
              username or password to do so. As patients cogntive and physical condition may vary, they have the option
              to fill out forms with voice, text or both`;
    case 3:
        return `Once the patient submits their questions. Doctors may view them at anytime. This provides the physician with
                the ability to prepare prior to a visit as they know what to expect, rather than be surprised by questions
                they were not anticipating. Ideally the physician will review the questions with the patient during the visit.
                Upon completetion of the visit, the physician will click a button to verify the patients questions were reviewed.`
    case 4: 
        return `Upon conclusion of the visit. The patient will receive an automated email where they can review their questions. They
                will be provided with a checkbox by each question where they can let the physician know if they feel the question was sufficiently
                answered.`
    case 5: 
        return `Once the patient submits feedback. The physician will be provided with a visit report listing all the patient's questions and whether
                the patient feels they were addressed during the visit.`
    case 6:
        return `Inevitably, all concerns may not be addressed in one visit. The physician will have the option to send a quick email to provide reinforcement
                of their choosing.`
    
    default:
        return 'Unknown step';
  }
}

export default function AboutStepper() {
  const classes = useAboutStepperStyles();
  const [complete, setComplete] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length-1){
        console.log('here')
        setComplete(true)
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setComplete(false)
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step 
          classes={complete ? {
            root: classes.completeStep,
          } : {
            root: classes.step,
          }}
          key={label}>
            <StepLabel
                StepIconProps={ complete ? {
                    classes: {
                      root: classes.completeStep,
                      completed: classes.completed,
                      active: classes.active,
                    }
                  }:{
                    classes: {
                      root: classes.step,
                      completed: classes.completed,
                      active: classes.active,
                    }
                  }}
            >
                {label}
            </StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>{`That's It! Physicians will also have access to features such as score reports over various timeframes
                        and an archive page for long term patient data`}
            </Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}