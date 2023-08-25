import React, { type MouseEvent, useState } from 'react'
import {
  Divider,
  Drawer,
  IconButton,
  ListItemText,
  List,
  ListItem,
  Typography,
  ListItemButton,
  Collapse,
  Button,
  MenuItem,
  Select
} from '@mui/material'
import { styled } from '@mui/system'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import SwitchComponent from '../Shared/SwitchComponent/SwitchComponent'
import { useAuthContext, useLogout, useGallerySettingsContext } from '../hooks'
import { useNavigate, useLocation } from 'react-router-dom'
import { AMATEUR_BB_URL, MAINSTREAM_BB_URL } from '../utils/constants'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { updateUserSettings } from '../services/user'
import { useAsyncFn } from '../hooks/useAsync'
import { type User } from '../Shared/types'

interface UserSetting {
  hideUnderage: boolean
}
const DrawerHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end'
}))

const ListItemWithDivider = styled(ListItem)({
  borderWidth: '0px 0px thin',
  borderStyle: 'solid',
  borderColor: 'rgba(0, 0, 0, 0.12)'
})
function renderActressRow(props: ListChildComponentProps) {
  const { index, data, style } = props
  const { availableActresses, handleActressSelection, selectedActresses } = data

  const current = availableActresses[index]
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton
        onClick={() => handleActressSelection(current.actress)}
        selected={selectedActresses.includes(current.actress)}
        data-cy={`actress-name-${index}`}
      >
        <ListItemText primary={current.actress} />
        <br />
      </ListItemButton>
    </ListItem>
  )
}

function renderYearRow(props: ListChildComponentProps) {
  const { index, data, style } = props
  const { availableDecades, handleDecadeSelection, selectedDecades } = data
  const keys: string[] = Object.keys(availableDecades[index])
  const values: string[] = Object.values(availableDecades[index])

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton
        onClick={() => handleDecadeSelection(keys[0])}
        selected={selectedDecades.includes(keys[0])}
      >
        <ListItemText>
          <Typography variant="body1" display="inline">
            {keys[0]}s{' '}
            <Typography variant="subtitle2" display="inline">
              ({values[0]})
            </Typography>
          </Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

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
    isAdmin,
    displayAdminControls,
    handleDisplayAdminSwitch,
    updateLocalUser
  } = useAuthContext()
  const updateUserSettingsFn = useAsyncFn(updateUserSettings)

  const { hideUnderage } = user || { hideUnderage: true }

  const { logout } = useLogout()

  const {
    availableActresses,
    availableDecades,
    minDecade,
    handleSetSortBy,
    handleRandomize,
    handleYearAscending,
    handleAddedAscending,
    handleActressSelection,
    handleDecadeSelection,
    handleVidsPerPageChange,
    sortBy,
    yearAsc,
    addedAsc,
    selectedActresses,
    selectedDecades,
    numOfVidsPerPage
  } = useGallerySettingsContext()

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)
  const [isActressOpen, setIsActressOpen] = useState(false)

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

  const updateHideUnderage = () => {
    onUserSettingsUpdate({ hideUnderage: !hideUnderage })
  }

  const onUserSettingsUpdate = (param: UserSetting) => {
    return updateUserSettingsFn
      .execute({ username: user.username, ...param })
      .then((user: User) => {
        updateLocalUser(user)
      })
  }

  const updateEmail = () => {
    navigate('/login', {
      state: { updateEmail: true, username: user.username, from: location }
    })
    handleClose()
  }

  const resetActressSelection = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    handleActressSelection(null)
  }

  const handleSignout = () => {
    logout()
    navigate('.', { replace: true })
    handleClose()
  }

  const pageArray: string[] = []
  //   for (let i = 1; i * 9 < 50 || i * 9 < videoLength; i++) {
  //     pageArray.push(i * 9)
  //   }

  return (
    <Drawer anchor="left" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ minWidth: 272 }}>
        {isAdmin && (
          <ListItemWithDivider>
            <ListItemText>
              <Typography variant="body1" display="inline">
                Display Admin Controls
              </Typography>
              <SwitchComponent
                left="No"
                right="Yes"
                call={handleDisplayAdminSwitch}
                checked={displayAdminControls ?? false}
              />
            </ListItemText>
          </ListItemWithDivider>
        )}
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
          <ListItemWithDivider disablePadding>
            <ListItemButton
              data-cy="favorites-menu-item"
              onClick={navigateToFavoritesPage}
            >
              <ListItemText>Favorites</ListItemText>
            </ListItemButton>
          </ListItemWithDivider>
        )}
        {onSearchablePage && (
          <ListItemWithDivider>
            <ListItemText data-cy="display-underage-option">
              <Typography variant="body1" display="inline">
                Display Underage
              </Typography>
              <SwitchComponent
                left="Yes"
                right="18+ Only"
                call={updateHideUnderage}
                checked={hideUnderage}
              />
            </ListItemText>
          </ListItemWithDivider>
        )}
        {user && !user?.email && (
          <ListItem disablePadding sx={{ borderBottom: '2px solid black' }}>
            <ListItemButton onClick={updateEmail} data-cy="add-email-menu-item">
              <ListItemText>Add email address</ListItemText>
            </ListItemButton>
          </ListItem>
        )}
        {onSearchablePage && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setIsSortOpen((prev) => !prev)}>
                <ListItemText primary="Sort" />
                {isSortOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={isSortOpen} timeout="auto" unmountOnExit>
              <Divider />
              <List sx={{ marginLeft: '5px' }} component="div">
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSetSortBy('likes')}
                    selected={sortBy === 'likes'}
                    data-cy="sort-button-likes"
                  >
                    <ListItemText primary="Most Liked" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSetSortBy('recent')}
                    selected={sortBy === 'recent'}
                    data-cy="sort-button-recent"
                  >
                    <ListItemText primary="Added" />
                    {sortBy === 'recent' && (
                      <SwitchComponent
                        left="Desc"
                        right="Asc"
                        call={handleAddedAscending}
                        checked={addedAsc}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSetSortBy('year')}
                    selected={sortBy === 'year'}
                    data-cy="sort-button-year"
                  >
                    <ListItemText primary="Year Released" />
                    {sortBy === 'year' && (
                      <SwitchComponent
                        left="Desc"
                        right="Asc"
                        call={handleYearAscending}
                        checked={yearAsc}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleRandomize}
                    data-cy="sort-button-randomize"
                  >
                    <ListItemText primary="Randomize" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
            <Divider />
          </>
        )}
        {onSearchablePage && availableActresses.length > 0 && (
          <ListItemWithDivider disablePadding>
            <ListItemButton
              onClick={() => setIsActressOpen(!isActressOpen)}
              data-cy="filter-actress-menu-item"
            >
              <ListItemText primary="Filter By Actress" />
              {selectedActresses.length > 0 && (
                <Button
                  data-cy="filter-by-actress-clear-btn"
                  onClick={(e) => resetActressSelection(e)}
                  variant="outlined"
                  sx={{
                    marginRight: 1
                  }}
                >
                  Reset
                </Button>
              )}
              {isActressOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItemWithDivider>
        )}
        <Collapse in={isActressOpen} timeout="auto" unmountOnExit>
          <FixedSizeList
            height={500}
            width="100%"
            itemData={{
              availableActresses,
              handleActressSelection,
              selectedActresses
            }}
            itemSize={55}
            itemCount={availableActresses?.length}
            overscanCount={5}
            style={{ border: '1px solid lightgrey' }}
          >
            {renderActressRow}
          </FixedSizeList>
          <Divider />
        </Collapse>
        {onSearchablePage && availableDecades.length > 0 && (
          <ListItemWithDivider disablePadding>
            <ListItemButton onClick={() => setIsYearOpen(!isYearOpen)}>
              <ListItemText primary="Filter By Decade" />
              {isYearOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItemWithDivider>
        )}
        <Collapse in={isYearOpen} timeout="auto" unmountOnExit>
          <FixedSizeList
            height={300}
            width="100%"
            itemData={{
              availableDecades,
              handleDecadeSelection,
              selectedDecades
            }}
            itemSize={46}
            itemCount={availableDecades?.length}
            overscanCount={5}
            style={{ border: '1px solid lightgrey' }}
          >
            {renderYearRow}
          </FixedSizeList>
        </Collapse>
        {onSearchablePage && (
          <ListItem data-cy="num-videos-per-page">
            <ListItemText primary="# Videos Per Page" />
            <Select
              value={numOfVidsPerPage}
              onChange={(event) => handleVidsPerPageChange(event.target.value)}
              defaultValue="9"
              inputProps={{
                'data-cy': 'videos-per-page-select'
              }}
            >
              {pageArray.map((page) => (
                <MenuItem key={page} value={page}>
                  {page}
                </MenuItem>
              ))}
            </Select>
          </ListItem>
        )}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignout} data-cy="signout-menu-item">
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}
export default SideNav
