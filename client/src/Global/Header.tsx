import React, { useState } from 'react'
import { Box, AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import SideNav from './SideNav'

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            data-cy="open-nav-drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              width: '100%',
              display: { xs: 'none', sm: 'block' }
              // ml: onLoginPage ? 'initial' : '17%'
            }}
          >
            <Link to="/">Kinky Collection</Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <SideNav open={open} handleClose={() => setOpen(false)} />
    </Box>
  )
}

export default Header
