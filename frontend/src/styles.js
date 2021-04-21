import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import logopic from "./static/images/betterlogo.jpeg"

export const useAptCreateStyles = makeStyles(theme => ({
    paper:{
        margin:'3em' , 
        padding:'2em'
    },
    papersm:{
        marginBottom:'1em',
        paddingTop: '1em',
        paddingBottom: '1em',
    },
    form:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "75%",
    },
    textFieldSm:{
        width:'90%',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
      formControl: {
        margin: theme.spacing(1),
        marginLeft: '0',
        width: '75%',
        
    },
     formControlSm:{
        margin: theme.spacing(1),
        marginLeft: '0',
        width: '90%'
     },
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    },
    createbtn:{
        marginBottom:theme.spacing(2),
        marginTop:theme.spacing(2),
    }
}))

export const useAptListStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
      },
    table: {
      minWidth: 650,
    },
    edit:{
        color:'green',
    },
    delete:{
        color:"red",
    },
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',

    },
    delete:{
        color:"red",
    },
    archive:{
        color:"orange",
    },
    check:{
        backgroundColor:'inherit'
    },
    delBtn:{
        color:"red",
        border:"1px solid red"
    },
    archiveBtn:{
        color:"orange",
        border:"1px solid orange"
    },
    btnContainer:{
        display:'flex',
        alignItems:'center',
        justifyContent:'space-evenly',
        margin:theme.spacing(4),
    },
    title: {
        flex: '1 1 100%',
      },
      toolbar:{
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        marginTop: theme.spacing(2),
      },
   
  }));

 export const useArchivedAptStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
      },
      table: {
        marginTop:theme.spacing(4),
        marginBottom:theme.spacing(4)
      },
    edit:{
        color:'green',
    },
    delete:{
        color:"red",
    },
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',

    },
    delete:{
        color:"red",
    },
    archive:{
        color:"orange",
    },
    check:{
        backgroundColor:'inherit'
    },
    delBtn:{
        color:"red",
        border:"1px solid red"
    },
    archiveBtn:{
        color:"orange",
        border:"1px solid orange"
    },
    btnContainer:{
        display:'flex',
        alignItems:'center',
        justifyContent:'space-evenly',
        margin:theme.spacing(4),
    },
    title: {
        flex: '1 1 100%',
      },
      toolbar:{
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        marginTop: theme.spacing(2),
      },

      emptyContainer:{
        marginTop:theme.spacing(5),
        marginBottom:theme.spacing(5),
      }
   
  }));

  export const useEditPatientStyles = makeStyles(theme => ({
    paper:{
        margin:'3em' , 
        padding:'2em'
    },
    papersm:{
        marginBottom:'1em',
        paddingTop: '1em',
        paddingBottom: '1em',
    },
    form:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "75%",
    },
    textFieldSm:{
        width:'90%',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    
}))

export const useInactivePatientsStyles = makeStyles( theme => ({
  
    footerroot: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
    table: {
      marginTop:theme.spacing(4),
      marginBottom:theme.spacing(4)
    },
    edit:{
        color:'green',
    },
    delete:{
        color:"red",
    },
    archive:{
        color:"orange",
    },
    loading:{
      display:'flex',
      width:'100%',
      margin: '1em auto',
      alignItems:'center',
      justifyContent:'center',
  
  },
  delBtn:{
      color:"red",
      border:"1px solid red"
  },
  archiveBtn:{
      color:"orange",
      border:"1px solid orange"
  },
  btnContainer:{
      display:'flex',
      alignItems:'center',
      justifyContent:'space-evenly',
      margin:theme.spacing(4),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  title: {
    flex: '1 1 100%',
  },
  toolbar:{
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  emptyContainer:{
    marginTop:theme.spacing(5),
    marginBottom:theme.spacing(5),
  },
  
  }));

export  const useNavbarStyles = makeStyles(theme => ({
    tool:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    left: {
        display:'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        
    },
    link: {
        textDecoration:'none',
        color: 'inherit',
    },
    medium: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        objectPosition: 'center',
        
      },
    paper: {
        width:'50%',
    },
    item:{
        justifyContent: "center"
    },
    
}))

export const usePatientCreateStyles = makeStyles(theme => ({
    paper:{
        margin:'3em' , 
        padding:'2em'
    },
    papersm:{
        marginBottom:'1em',
        paddingTop: '1em',
        paddingBottom: '1em',
    },
    form:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "75%",
    },
    textFieldSm:{
        width:'90%',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    createbtn:{
        marginBottom:theme.spacing(2),
        marginTop:theme.spacing(2),
    }
    
}))

export const usePaginationStyles = makeStyles ( theme => ({
    root:{
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    }
}))

export const usePatientListStyles = makeStyles( theme => ({
  
    footerroot: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
    table: {
      minWidth: 650,
    },
    edit:{
        color:'green',
    },
    delete:{
        color:"red",
    },
    archive:{
        color:"orange",
    },
    loading:{
      display:'flex',
      width:'100%',
      margin: '1em auto',
      alignItems:'center',
      justifyContent:'center',
  
  },
  delBtn:{
      color:"red",
      border:"1px solid red"
  },
  archiveBtn:{
      color:"orange",
      border:"1px solid orange"
  },
  btnContainer:{
      display:'flex',
      alignItems:'center',
      justifyContent:'space-evenly',
      margin:theme.spacing(4),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  title: {
    flex: '1 1 100%',
  },
  toolbar:{
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  
  }));

  export const useScorecardStyles = makeStyles(theme => ({
    main: {
        marginTop: '2em',
        textAlign: 'center',
        
    },

    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    
    },
    mainempty:{
        marginTop: '2em',
        textAlign: 'center',
        marginBottom: '100px',
    }
    
}))

export const useScoreDetailsStyles = makeStyles(theme => ({
    stat: {
        margin: '1em',
    },
}))

export const useThirtyScorecardStyles = makeStyles(theme => ({
    main: {
        marginTop: '2em',
        textAlign: 'center',
        
    },

    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    
    },
    
}))

export const useThirtyScoreDetailsStyles = makeStyles(theme => ({
    stat: {
        margin: '1em',
    },
}))

export const useAboutStyles = makeStyles(theme => ({
    root:{
        margin:'1em auto',
        width: '90%',
        maxWidth:"900px",
        padding:'1em',
    },
    bold: {
        fontWeight:600,
        marginTop:theme.spacing(5)
    },
    button: {
        minWidth: 200,
        margin:theme.spacing(2),
    },

}))

export const useActivateAccountStyles = makeStyles(theme => ({
    form:{
        margin:'4em auto',
        width:'60%',
    },

}))

export const useAppointmentConfirmStyles = makeStyles(theme => ({
    root:{
        fontsize:'2rem'
    },
    form: {
        maxWidth: '900px',
        margin: 'auto',
    },
    text: {
        marginBottom:theme.spacing(2),
        
    },
    buttons:{
        maxWidth: '900px',
        margin: 'auto',
    },
    button:{
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    confirm:{
        marginTop: "2em"
    },
    resize:{
        fontSize:'1.5rem',
        paddingTop: theme.spacing(2),
        lineHeight: '1.6'
    },
    labelRoot:{
        fontSize: '1.5rem'
    },
    labelFocused:{
        fontSize:'1.5rem',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },  
}))

export const useAppointmentDetailStyles = makeStyles(theme => ({

    paper: {
        maxWidth:'80%',
        margin: '1em auto',
        padding:'2em',
    },
    paperXs: {
        width:'100%',
        marginTop: '1em',
        marginBottom: '1em',
        paddingTop: '1em',
        paddingBottom: '1em',
    },
    
    container:{
        display:'flex',
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection: 'column',
        paddding:'2em',
        marginTop: theme.spacing(3),
    },
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    },
    card:{
        maxWidth: '600px',
        margin: '1em auto',
    },
    button:{
        margin:'auto',
    },
    bottom:{
        display:'flex',
        width:'100%',
    },
    typography:{
        marginBottom: theme.spacing(2)
    },
}))

export const useAppointmentReviewStyles = makeStyles(theme => ({

    paper: {
        maxWidth:'80%',
        margin: '1em auto',
        padding:'2em',
    },
    paperXs: {
        width:'100%',
        marginTop: '1em',
        marginBottom: '1em',
        paddingTop: '1em',
        paddingBottom: '1em',
    },
    container:{
        display:'flex',
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection: 'column',
        paddding:'2em',
        marginTop: theme.spacing(3),
    },
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    },
    card:{
        maxWidth: '600px',
        margin: '1em auto',
    },
    button:{
        margin:'auto',
    },
    bottom:{
        display:'flex',
        width:'100%',
    },
    check:{
        alignSelf:'center',
    },
    cardContent:{
        display: 'flex',
        flexDirection: 'column',
    },
    confirm:{
        marginTop: "2em"
    }
}))


export const useArchiveStyles = makeStyles(theme => ({
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    },
}))

export const useDoctorFeedbackStyles = makeStyles(theme => ({

    paper: {
        maxWidth:'80%',
        margin: '1em auto',
        padding:'2em',
    },
    paperXs: {
        width:'100%',
        marginTop: '1em',
        marginBottom: '1em',
        paddingTop: '1em',
        paddingBottom: '1em',
    },
    container:{
        display:'flex',
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection: 'column',
        paddding:'2em',
        marginTop: theme.spacing(3),
    },
    loading:{
        display:'flex',
        width:'100%',
        margin: '1em auto',
        alignItems:'center',
        justifyContent:'center',
    },
    card:{
        maxWidth: '600px',
        margin: '1em auto',
    },
    button:{
        margin:'auto',
    },
    bottom:{
        display:'flex',
        width:'100%',
    },
    check:{
        alignSelf:'center',
    },
    cardContent:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    confirm:{
        marginTop: "2em"
    },
    answered:{
        border: '5px solid green',
        maxWidth: '600px',
        margin: '1em auto',
    },
    notanswered:
    {
        border: `5px solid ${theme.palette.error.main}`,
        maxWidth: '600px',
        margin: '1em auto',
    },
    typography:{
        marginBottom: theme.spacing(2)
    },
    
}))

export const useHomeStyles = makeStyles(theme => ({
    root:{
        flexGrow:1,
        padding:theme.spacing(4)
    },
    rootSm:{
        flexGrow:1,
        padding:0,
    }
}))

export const useLoginStyles = makeStyles(theme => ({
    section: {
        margin: 'auto',
        width: '70%',
        marginTop: theme.spacing(4),
    },
    bottomCard: {
        display:'flex',
        flexDirection:'column',
        minHeight: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomCardItem:{
        margin: theme.spacing(1),
        textDecoration: 'none',
    },
    passwordresetBtn:{
        display: 'inline-block',
    },
    link:{
        textDecoration:'none',
    },
    linkContainer:{
        margin:'auto',
        display:'block',
        width:'40%',
    }
}))

export const usePasswordConfirmStyles = makeStyles(theme => ({
    container:{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
     link:{
       textDecoration: 'none',
       color: 'inherit'
     },
     btn:{
       display:'block'
     }
  
  }))

export const usePasswordResetStyles = makeStyles(theme => ({
    form:{
        margin:'2em auto',
        width:'80%',
    },

}))

export const usePasswordResetConfirmStyles = makeStyles(theme => ({
    form:{
        margin:'2em auto',
        width:'80%',
    },

}))

export const useSignUpStyles = makeStyles(theme => ({
    section: {
        margin: 'auto',
        width: '70%',
        marginTop: theme.spacing(4),
    },
    bottomCard: {
        display:'flex',
        flexDirection:'column',
        minHeight: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomCardItem:{
        margin: theme.spacing(1),
        textDecoration: 'none',
    },
}))

  

export const useLandingStyles = makeStyles(theme => ({

    background: {
        backgroundImage: ({backgroundImage}) => `url(${backgroundImage})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
    },
    buttons:{
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems: 'center'
    },
    buttonsSm:{
        display:'flex',
        flexDirection: 'column',
        justifyContent:'space-evenly',
        alignItems: 'center',
    },
    button: {
        minWidth: 200,
        margin:theme.spacing(2),
    },
    h5: {
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(10),
        },
    },
    more: {
        marginTop: theme.spacing(2),
        marginRight:'auto',
        marginLeft:'auto',
        cursor:'pointer',
        maxWidth:'140px',
        border: '2px solid transparent',
        "&:hover": {
            borderBottom: `2px solid ${theme.palette.secondary.main}`
        },
    },

}))

export const useLandingLayoutStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.common.white,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
      },
      container: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(14),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      backdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.5,
        zIndex: -1,
      },
      background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        zIndex: -2,
      },
     
}))