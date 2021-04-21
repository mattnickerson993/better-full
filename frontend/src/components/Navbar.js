import { AppBar, Avatar, Button, Fade, Grow, Hidden, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@material-ui/core'
import React from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import { AuthContext, logout } from '../context'
import { Link, useHistory } from 'react-router-dom'
import logopic from "../static/images/betternav.jpeg"
import ArchiveIcon from '@material-ui/icons/Archive';
import InfoIcon from '@material-ui/icons/Info';
import { useNavbarStyles } from '../styles'


const Navbar = () => {
    const classes = useNavbarStyles()
    const {state, dispatch } = React.useContext(AuthContext)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const history = useHistory()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
  
    const handleClose = () => {
        setAnchorEl(null)
    }
    function  handleDropMenuClick(path){
        history.push(`${path}`)
    }
    async function handlelogout(){
        await logout(dispatch)
        history.push('/login/')
    }

    return (
        <AppBar position="static" styles={{position: 'relative'}}>
            <Toolbar className={classes.tool}>
                <div className={classes.left}>
                    <Tooltip title="Home">
                        <IconButton onClick={() => history.push('/home/')}>
                            <Avatar alt="Logo" src={logopic} className={classes.medium} />
                        </IconButton>
                    </Tooltip>
                    
                    <Typography variant="h6" style={{marginLeft: '1em'}}>
                        BETTER
                    </Typography>
                    <Hidden only={['xs', 'sm']}>
                        <Typography variant="h6" style={{marginLeft: '1em'}}>
                            • Questions Answered | Patient Satisfied
                        </Typography>
                    </Hidden>
                    
                </div>
                <div>
                
                
                <Hidden only={["sm", "md", 'lg', 'xl']}>
                    <IconButton onClick={handleClick}>
                        <MenuIcon />
                    </IconButton>
                    
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        keepMounted
                        TransitionComponent={Grow}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{ 
                            vertical: "top", 
                            horizontal: "right" 
                        }}
                        transformOrigin={{ 
                            vertical: "top", 
                            horizontal: "right" 
                        }}
                        PopoverClasses={{
                            paper: classes.paper
                          }}
                        >
                        <MenuItem 
                        classes={{
                            root: classes.item, 
                          }}
                        onClick={() => handleDropMenuClick('/about/')}
                        >
                            About
                        </MenuItem>
                        <MenuItem 
                        classes={{
                            root: classes.item, 
                          }}
                          onClick={() => handleDropMenuClick('/archive/')}
                        >
                              Archive
                        </MenuItem>
                        <MenuItem 
                        onClick={handlelogout}
                        classes={{
                            root: classes.item, 
                          }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Hidden>
                <Hidden only={'xs'}>
                    <Tooltip title="About">
                        <IconButton onClick={() => history.push('/about/')}>
                            <InfoIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View Archives">
                        <IconButton style={{marginRight:'1em'}} onClick={() => history.push('/archive/')}>
                            <ArchiveIcon/>
                        </IconButton>
                    </Tooltip>
                {state.isAuthenticated ? (
                    <Button variant="contained" color="secondary" onClick={handlelogout}>
                        Logout
                    </Button>
                ): (
                    <Link className={classes.link} to="/login/">
                        <Button variant="contained" color="secondary">
                            Login
                        </Button>
                    </Link>
                )}
                </Hidden>
                
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
