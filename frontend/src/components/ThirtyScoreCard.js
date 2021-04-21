
import { CircularProgress, Typography } from '@material-ui/core'
import React from 'react'
import { useThirtyScorecardStyles } from '../styles'
import ScoreDetails from './ScoreDetails'
import ThirtyScoreDetails from './ThirtyScoreDetails'


const ThirtyScorecard = ({questions}) => {
    const [loading, setLoading ] = React.useState(true)
    const [answered, setAnswered] = React. useState(0)
    const [score, setScore ] = React.useState("")
    const classes = useThirtyScorecardStyles()

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
                
               {loading && (
                   <div className={classes.loading}>
                   <CircularProgress color="primary" />
                   </div>
               )}
               {!loading && <ThirtyScoreDetails answered={answered} asked={questions.length}/>}
           
               
           </div>
         ): (
            <div className={classes.main}>
                <Typography variant="h5" color="textPrimary" >
                 30 Day Scorecard
                </Typography>
                
                <Typography variant="subtitle1"> You currently have no feedback to display </Typography>
        
            
             </div>


         )}
       
            
        </>
    )
}

export default ThirtyScorecard
