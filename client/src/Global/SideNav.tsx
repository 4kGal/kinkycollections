import React from 'react'
import {
  Divider,
  Drawer,
  IconButton,
  ListItemText,
  List,
  ListItem,
  Typography,
  ListItemButton
} from '@mui/material'
import { styled } from '@mui/system'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SwitchComponent from '../Shared/SwitchComponent/SwitchComponent'
import { useAuthContext } from '../hooks'
import { useNavigate, useLocation } from 'react-router-dom'
import { AMATEUR_BB_URL, MAINSTREAM_BB_URL } from '../utils/constants'

const DrawerHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end'
}))

const SideNav = ({
  open,
  handleClose
}: {
  open: boolean
  handleClose: () => void
}) => {
  const location = useLocation()

  const navigate = useNavigate()

  const {
    user,
    displayAdminControls,
    handleDisplayAdminSwitch,
    handleHideUnderageSwitch,
    hideUnderage
  } = useAuthContext()
  // const { availableActresses = [] } = useGallerySettingsContext()

  const onSearchablePage =
    location.pathname === MAINSTREAM_BB_URL ||
    location.pathname === AMATEUR_BB_URL

  const navigateToSignInPage = () => {
    navigate('/login', { state: null })
    handleClose()
  }

  const navigateToFavoritesPage = () => {
    navigate('/favorites')
    handleClose()
  }

  console.log('hideUnderage', hideUnderage)

  return (
    <Drawer anchor="left" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ minWidth: 272 }}>
        {/* {isAdmin() && ( */}
        <ListItem>
          <ListItemText>
            <Typography variant="body1" display="inline">
              Display Admin Controls
            </Typography>
            <SwitchComponent
              left="No"
              right="Yes"
              call={handleDisplayAdminSwitch}
              checked={displayAdminControls}
            />
          </ListItemText>
        </ListItem>
        {/* )} */}
        {!user && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={navigateToSignInPage}
              data-cy="login-signup-menu-item"
            >
              <ListItemText>Log In/Sign Up</ListItemText>
            </ListItemButton>
          </ListItem>
        )}
        {user && (
          <ListItem disablePadding>
            <ListItemButton
              data-cy="favorites-menu-item"
              onClick={navigateToFavoritesPage}
            >
              <ListItemText>Favorites</ListItemText>
            </ListItemButton>
          </ListItem>
        )}
        {onSearchablePage && (
          <ListItem>
            <ListItemText>
              <Typography variant="body1" display="inline">
                Display Underage
              </Typography>
              <SwitchComponent
                left="Yes"
                right="18+ Only"
                call={handleHideUnderageSwitch}
                checked={hideUnderage ?? true}
              />
            </ListItemText>
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}
export default SideNav
