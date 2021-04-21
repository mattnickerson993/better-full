import { createMuiTheme } from '@material-ui/core/styles'
import { blue, teal, red} from '@material-ui/core/colors'
 
export const darkTheme = createMuiTheme({
      palette: {
          type: "dark",
          primary: {
              main: blue[500],
          },
          secondary:{
            main: teal[500],
          },
          error:{
            main: red[500],
          },
      }
    })
