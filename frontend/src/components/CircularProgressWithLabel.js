import { Box, CircularProgress, Typography, useTheme } from "@material-ui/core";


export default function CircularProgressWithLabel(props) {
    const theme = useTheme()
    const {iconcolor} = props
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress size={80} style={iconcolor? {color: `${iconcolor}`}: {color: `${theme.palette.primary}`}} variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" component="div" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }