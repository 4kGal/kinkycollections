import React, { useState, useEffect } from 'react'
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
  MenuItem,
  Select
} from '@mui/material'
import { styled } from '@mui/system'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import SwitchComponent from '../Shared/SwitchComponent/SwitchComponent'
import { useAuthContext, useGalleryContext } from '../hooks'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FAVORITES_URL,
  GALLERY_PAGES,
  LOGIN_URL,
  UPDATE_USER
} from '../utils/constants'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { updateUserSettings } from '../services/user'
import { useAsyncFn } from '../hooks/useAsync'
import { type User } from '../Shared/types'
import FilterWithClearComponent from '../Shared/FilterWithClearButton/FilterWithClearButton'
import { isEmpty } from 'lodash'

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
        selected={selectedActresses?.includes(current.actress)}
        data-cy={`actress-name-${index}`}
      >
        <ListItemText primary={current.actress} />
        <br />
      </ListItemButton>
    </ListItem>
  )
}

function renderDecadeRow(props: ListChildComponentProps) {
  const { index, data, style } = props
  const { availableDecades, handleDecadeSelection, selectedDecades } = data
  const keys: string[] = Object.keys(availableDecades[index])
  const values: string[] = Object.values(availableDecades[index])

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton
        onClick={() => handleDecadeSelection(keys[0])}
        selected={selectedDecades.includes(keys[0])}
        data-cy={`decade-${index}`}
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

  const {
    availableActresses,
    availableDecades,
    minDecade,
    handleSetSortBy,
    handleRandomize,
    handleYearAscending,
    handleAddedAscending,
    handleVidsPerPageChange,
    handleActressSelection,
    handleDecadeSelection,
    handleDisplayUnderageSwitch,
    hideUnderage,
    sortBy,
    yearAsc,
    addedAsc,
    selectedActresses,
    selectedDecades,
    numOfVidsPerPage,
    handleDisplayAdminSwitch,
    galleryLength
  } = useGalleryContext()

  const navigate = useNavigate()
  const { user, isAdmin, handleLogout, displayAdminControls, dispatch } =
    useAuthContext()

  const updateUserSettingsFn = useAsyncFn(updateUserSettings)

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isDecadeOpen, setIsDecadeOpen] = useState(false)
  const [isActressOpen, setIsActressOpen] = useState(false)

  const onSearchablePage = GALLERY_PAGES.includes(location.pathname)

  const navigateToSignInPage = () => {
    navigate(LOGIN_URL, { state: null })
    handleClose()
  }

  const navigateToFavoritesPage = () => {
    navigate(FAVORITES_URL)
    handleClose()
  }

  useEffect(() => {
    if (!isEmpty(user)) {
      onUserSettingsUpdate({ hideUnderage })
    }
  }, [hideUnderage])

  const onUserSettingsUpdate = (param: UserSetting) => {
    return updateUserSettingsFn
      .execute({ username: user.username, ...param })
      .then((user: User) => {
        dispatch({ type: UPDATE_USER, payload: user })
      })
  }

  const updateEmail = () => {
    navigate(LOGIN_URL, {
      state: { updateEmail: true, from: location }
    })
    handleClose()
  }

  const handleSignout = () => {
    handleLogout()
    navigate('.', { replace: true })
    handleClose()
  }

  let startingYear = Math.floor(minDecade / 10) * 10
  const decades = [startingYear]
  do {
    startingYear += 10
    decades.push(startingYear)
  } while (startingYear + 10 < new Date().getFullYear())

  const pageArray: number[] = []
  for (let i = 1; i * 9 < 50 || i * 9 < galleryLength / 9; i++) {
    pageArray.push(i * 9)
  }

  return (
    <Drawer anchor="left" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleClose} data-cy="close-side-nav-btn">
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ minWidth: 272, paddingTop: 0 }}>
        {isAdmin && (
          <ListItemWithDivider data-cy="display-admin-control-menu-item">
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
        {isEmpty(user) && (
          <ListItemWithDivider disablePadding>
            <ListItemButton
              onClick={navigateToSignInPage}
              data-cy="login-signup-menu-item"
            >
              <ListItemText>Log In/Sign Up</ListItemText>
            </ListItemButton>
          </ListItemWithDivider>
        )}
        {!isEmpty(user) && (
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
                call={handleDisplayUnderageSwitch}
                checked={hideUnderage}
              />
            </ListItemText>
          </ListItemWithDivider>
        )}
        {!isEmpty(user) && !user?.email && (
          <ListItemWithDivider disablePadding>
            <ListItemButton onClick={updateEmail} data-cy="add-email-menu-item">
              <ListItemText>Add email address</ListItemText>
            </ListItemButton>
          </ListItemWithDivider>
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
              </List>
            </Collapse>
            <Divider />
          </>
        )}
        {onSearchablePage && availableActresses?.length > 0 && (
          <FilterWithClearComponent
            display={isActressOpen || selectedActresses?.length > 0}
            text="Filter By Actress"
            handleClick={() => setIsActressOpen(!isActressOpen)}
            displayClear={selectedActresses?.length > 0}
            handleClear={() => handleActressSelection(null)}
            isOpen={isActressOpen}
            dataCy="filter-actress-menu-item"
          />
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
        {onSearchablePage && availableDecades?.length > 0 && (
          <FilterWithClearComponent
            display={isDecadeOpen || selectedDecades?.length > 0}
            text="Filter By Decade"
            handleClick={() => setIsDecadeOpen(!isDecadeOpen)}
            displayClear={selectedDecades.length > 0}
            handleClear={() => handleDecadeSelection(null)}
            isOpen={isDecadeOpen}
            dataCy="filter-decade-menu-item"
          />
        )}
        <Collapse in={isDecadeOpen} timeout="auto" unmountOnExit>
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
            {renderDecadeRow}
          </FixedSizeList>
        </Collapse>
        {onSearchablePage && (
          <>
            <ListItemWithDivider disablePadding>
              <ListItemButton
                onClick={handleRandomize}
                data-cy="sort-button-randomize"
              >
                <ListItemText primary="Randomize" />
              </ListItemButton>
            </ListItemWithDivider>
            <ListItemWithDivider data-cy="num-videos-per-page">
              <ListItemText primary="# Videos Per Page" />
              <Select
                value={numOfVidsPerPage}
                onChange={(event) =>
                  handleVidsPerPageChange(event.target.value)
                }
                defaultValue="9"
                size="small"
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
            </ListItemWithDivider>
          </>
        )}
        {!isEmpty(user) && (
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
