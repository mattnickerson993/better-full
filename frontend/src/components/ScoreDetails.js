import { Box, CardContent, CircularProgress, Typography, useTheme } from '@material-ui/core'
import { Score } from '@material-ui/icons'
import React from 'react'
import { useScoreDetailsStyles } from '../styles' 
import CircularProgressWithLabel from './CircularProgressWithLabel'

const ScoreDetails = ({answered, asked}) => {
    const [loading, setLoading] = React.useState(true)
    const [score, setScore] = React.useState(0)
    const [progress, setProgress] = React.useState(0)
    const [color, setColor] = React.useState('primary')
    const classes = useScoreDetailsStyles()

    React.useEffect(() => {
        setProgress(0)
        calcScore()
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= score ? score : prevProgress + 5));
            }, 100);

        async function calcScore(){
            await setScore(Math.round((answered/asked * 100)))
            handleColor(score)
            setLoading(false)
        }
        
        return () => {
            clearInterval(timer)
        }
    },[score])

    function handleColor(score){
        if(score <=25){
            setColor('red')
        }
        else if(score > 25 && score <=50 ){
            setColor('orange')
        }
        else if(score > 50 && score <=75 ){
            setColor('yellow')
        }
        else{
            setColor('green')
        }

    }
    
    

    return (
        <>
         {!loading &&  <CardContent style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <Typography  className={classes.stat} variant="h5" align="center" gutterBottom>
                    Total Score
                </Typography>
                <CircularProgressWithLabel iconcolor={color} value={progress}/>  
                <Typography className={classes.stat} variant="subtitle2"  gutterBottom>
                    {`Questions Answered: ${answered}`} 
                </Typography>
                <Typography className={classes.stat} variant="subtitle2"  gutterBottom>
                    {`Questions asked: ${asked}`}
                </Typography>

            </CardContent>
            }
            
        </>
    )
}

export default ScoreDetails