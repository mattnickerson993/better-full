
import { CircularProgress, Typography } from '@material-ui/core'
import React from 'react'
import { useScorecardStyles } from '../styles'
import ScoreDetails from './ScoreDetails'



const Scorecard = ({questions}) => {
    const [loading, setLoading ] = React.useState(true)
    const [answered, setAnswered] = React. useState(0)
    const [score, setScore ] = React.useState("")
    const classes = useScorecardStyles()

    React.useEffect(() => {
       fetchStats()
        
    },[])
    
    function fetchStats(){
        if(questions){
            questions.forEach(question => {
            
                if(question.answered){
                    setAnswered(prev => prev + 1)
                }
            } )
            setLoading(false)
        }
        else{
            return
        }
        
    }

    return (

        <> 
        {questions.length > 0 ? (
            <div className={classes.main}>
                
            <Typography variant="h5" color="textPrimary" >
                Clinician Scorecard
            </Typography>
            {loading && (
                <div className={classes.loading}>
                <CircularProgress color="primary" />
                </div>
            )}
            {!loading && <ScoreDetails answered={answered} asked={questions.length}/>}
        
            
        </div>
        ):(
            <div className={classes.mainempty} >
                <Typography variant="h5" color="textPrimary" >
                Clinician Scorecard
                </Typography>
                <Typography variant="subtitle1"> You currently have no feedback to display </Typography>
                
            </div>
        )}
         
            
        </>
    )
}

export default Scorecard


