import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLogout } from './hooks/useLogout'
import { useAuthContext } from './hooks/useAuthContext'
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  InputBase,
  Collapse,
  Tooltip,
  Menu,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Switch
  //  Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { styled } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import { useSearchWithin } from './hooks/useSeachWithin'
import { debounce, isEmpty } from 'lodash'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import {
  FILTER_DECADES,
  SELECTED_ACTRESSES,
  SORT_BY,
  HIDE_UNDERAGE,
  AMATEUR_BB_URL,
  MAINSTREAM_BB_URL,
  SHOW_ADMIN_CONTROLS
} from './utils/constants'
import { useAuthenticator } from './hooks/useAuthenticator'

const DrawerHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'gray',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: 45,
    // transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '25ch'
    }
  }
}))

function renderActressRow(props: ListChildComponentProps) {
  const { index, data, style } = props
  const { availableActresses, handleActressSelection, selectedActresses } = data

  const current = availableActresses[index]
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton
        onClick={() => handleActressSelection(current.actress)}
        selected={selectedActresses.includes(current.actress)}
      >
        <ListItemText>
          <Typography variant="body1" display="inline">
            {current.actress}
          </Typography>
          <br />
          {/* {current.tags.map((tag: string, i: number) => (
            <Button
              sx={{ fontSize: 10 }}
              size="small"
              variant="text"
              key={i}
              //    onClick={() => setSelectedTags(tag)}
            >
              #{tag}{' '}
            </Button>
          ))} */}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

function renderRow(props: ListChildComponentProps) {
  const { index, data, style } = props
  const { availableDecades, handleDecadeSelection, filterDecades } = data
  const keys: string[] = Object.keys(availableDecades[index])
  const values: string[] = Object.values(availableDecades[index])

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton
        onClick={() => handleDecadeSelection(keys[0])}
        selected={filterDecades.includes(keys[0])}
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

const Header = () => {
  const { search } = useSearchWithin()
  const { logout } = useLogout()
  const authContext = useAuthContext()
  const { updateUserSettings, isAdmin } = useAuthenticator()

  const {
    user,
    searchResults,
    minDecade,
    availableDecades,
    dispatch,
    availableActresses,
    selectedActresses
  } = authContext
  const [open, setOpen] = useState(false)
  const [isYearOpen, setYearOpen] = useState(false)
  const [filterDecades, setFilterDecades] = useState<number[]>([])
  const [searchWithin, setSearchWithin] = useState('category')
  const [searchTerm, setSearchTerm] = useState('')
  const [previousPage, setPreviousPage] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [isActressOpen, setIsActressOpen] = useState(false)
  const init: boolean =
    typeof user?.username !== 'undefined' ? user?.underage : false
  const [hideUnderage, setHideUnderage] = useState(init != null && !init)
  const [adminSwitch, setAdminSwitch] = useState(false)
  // ascending = smallest or first or earliest
  const [ascending, setAscending] = useState(true)

  const menuOpen = Boolean(anchorEl)

  const navigate = useNavigate()
  const location = useLocation()

  const onLoginPage = location.pathname === '/login'
  const onSearchPage = location.pathname === '/searchResults'

  const handleSearch = (text: string) => {
    let collection = ''
    if (searchWithin === 'category') {
      collection = location.pathname.replace('/', '').toLowerCase()
    }
    search(text, collection)
  }

  useEffect(() => {
    if (
      onSearchPage &&
      (searchResults?.length === 0 || searchTerm.length === 0)
    ) {
      navigate(previousPage)
    }
  }, [searchResults, filterDecades, searchTerm])

  useEffect(() => {
    let sortParam = 'recent'
    if (sortBy === 'recent' && !ascending) {
      sortParam = 'oldest'
    } else if (sortBy === 'year') {
      sortParam = `year${ascending ? 'Asc' : 'Desc'}`
    } else if (sortBy === 'likes') {
      sortParam = 'likes'
    } else if (sortBy === 'views') {
      sortParam = 'views'
    }
    dispatch({ type: SORT_BY, payload: sortParam })
  }, [sortBy, ascending])

  useEffect(() => {
    dispatch({ type: HIDE_UNDERAGE, payload: hideUnderage })

    if (user?.username.length > 0) {
      updateUserSettings(user.username, !hideUnderage)
    }
  }, [hideUnderage])

  useEffect(() => {
    dispatch({ type: SHOW_ADMIN_CONTROLS, payload: adminSwitch })
  }, [adminSwitch])

  const debounceSearch = useCallback(debounce(handleSearch, 300), [])

  const handleSearchMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleSearchMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!onSearchPage && previousPage !== location.pathname) {
      setPreviousPage(location.pathname)
    }
    searchTerm.length > 0 && debounceSearch(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    dispatch({ type: FILTER_DECADES, payload: filterDecades })
  }, [filterDecades])

  const navigateToSignInPage = () => {
    navigate('/login', { state: null })
    setOpen(false)
  }

  const navigateToFavoritesPage = () => {
    navigate('/favorites')
    setOpen(false)
  }

  const handleSignout = () => {
    logout()
    navigate('.', { replace: true })
    setOpen(false)
  }

  const updateEmail = () => {
    navigate('/login', {
      state: { updateEmail: true, username: user.username, from: location }
    })
    setOpen(false)
  }

  const handleDecadeSelection = (decade: number) => {
    const exists = filterDecades.includes(decade)

    if (exists) {
      setFilterDecades(
        filterDecades.filter((c) => {
          return c !== decade
        })
      )
    } else {
      setFilterDecades(filterDecades.concat(decade))
    }
  }
  let startingYear = Math.floor(minDecade / 10) * 10
  const decades = [startingYear]
  do {
    startingYear += 10
    decades.push(startingYear)
  } while (startingYear + 10 < new Date().getFullYear())

  const handleSearchWithin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setSearchWithin(newValue === searchWithin ? '' : newValue)
  }

  const handleActressSelection = (actress: string | undefined) => {
    const index = selectedActresses?.indexOf(actress)

    if (index === -1) {
      dispatch({
        type: SELECTED_ACTRESSES,
        payload: (selectedActresses ?? [])?.concat(actress)
      })
      // setSelectedActresses((selectedActresses ?? [])?.concat(actress))
    } else {
      dispatch({
        type: SELECTED_ACTRESSES,
        payload: (selectedActresses ?? [])?.filter(
          (current: string) => current !== actress
        )
      })
    }
  }
  const onSearchablePage =
    location.pathname === MAINSTREAM_BB_URL ||
    location.pathname === AMATEUR_BB_URL

  const SwitchComponent = ({
    left,
    right,
    call,
    checked
  }: {
    left: string
    right: string
    call: (checked: boolean) => void
    checked: boolean
  }) => (
    <span style={{ paddingLeft: 20 }}>
      <Typography variant="caption">{left}</Typography>
      <Switch
        checked={checked}
        onChange={({ target }) => call(target.checked)}
      />
      <Typography variant="caption">{right}</Typography>
    </span>
  )
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
              display: { xs: 'none', sm: 'block' },
              ml: onLoginPage ? 'initial' : '17%'
            }}
          >
            <Link to="/">Kinky Collection</Link>
          </Typography>
          {!onLoginPage && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <Tooltip title="Enter 4 or more characters">
                <StyledInputBase
                  placeholder="Search… "
                  data-cy="search-bar"
                  inputProps={{ 'aria-label': 'search' }}
                  onClick={handleSearchMenuClick}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Tooltip>
              {onSearchablePage && (
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleSearchMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  disableAutoFocus
                >
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={searchWithin}
                    name="radio-buttons-group"
                    onChange={handleSearchWithin}
                    defaultValue="category"
                  >
                    <MenuItem>
                      <FormControlLabel
                        value="category"
                        control={<Radio data-cy="category" />}
                        label="Search This Category"
                      />
                    </MenuItem>
                    <MenuItem>
                      <FormControlLabel
                        value="site"
                        control={<Radio data-cy="site" />}
                        label="Search Whole Site"
                      />
                    </MenuItem>
                  </RadioGroup>
                </Menu>
              )}
            </Search>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <List sx={{ minWidth: 272 }}>
            {isAdmin() && (
              <ListItem>
                <ListItemText>
                  <Typography variant="body1" display="inline">
                    Display Admin Controls
                  </Typography>
                  <SwitchComponent
                    left="No"
                    right="Yes"
                    call={setAdminSwitch}
                    checked={adminSwitch}
                  />
                </ListItemText>
              </ListItem>
            )}
            {isEmpty(user) && (
              <ListItem>
                <ListItemButton
                  onClick={navigateToSignInPage}
                  data-cy="login-signup-menu-item"
                >
                  <ListItemText>Log In/Sign Up</ListItemText>
                </ListItemButton>
              </ListItem>
            )}
            {!isEmpty(user) && (
              <>
                <ListItem>
                  <ListItemButton
                    onClick={navigateToFavoritesPage}
                    data-cy="favorites-menu-item"
                  >
                    <ListItemText>Favorites</ListItemText>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
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
                    call={setHideUnderage}
                    checked={hideUnderage}
                  />
                </ListItemText>
              </ListItem>
            )}
            {!isEmpty(user) &&
              (user.email === undefined || user.email === null) && (
                <ListItem>
                  <ListItemButton
                    onClick={updateEmail}
                    data-cy="add-email-menu-item"
                  >
                    <ListItemText>Add email address</ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            {onSearchablePage && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setIsSortOpen(!isSortOpen)}>
                    <ListItemText primary={`Sort`} />
                    {isSortOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isSortOpen} timeout="auto" unmountOnExit>
                  <Divider />
                  <List
                    style={{ marginLeft: '5px', padding: 0 }}
                    component="div"
                  >
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => setSortBy('likes')}
                        selected={sortBy === 'likes'}
                      >
                        <ListItemText>
                          <Typography variant="body1" display="inline">
                            Most Liked
                          </Typography>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => setSortBy('views')}
                        selected={sortBy === 'views'}
                      >
                        <ListItemText>
                          <Typography variant="body1" display="inline">
                            Most Viewed
                          </Typography>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => setSortBy('recent')}
                        selected={sortBy === 'recent'}
                      >
                        <ListItemText>
                          <Typography variant="body1" display="inline">
                            Added
                          </Typography>
                        </ListItemText>
                        {sortBy === 'recent' && (
                          <SwitchComponent
                            left="Desc"
                            right="Asc"
                            call={setAscending}
                            checked={ascending}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => setSortBy('year')}
                        selected={sortBy === 'year'}
                      >
                        <ListItemText>
                          <Typography variant="body1" display="inline">
                            Year Released
                          </Typography>
                        </ListItemText>
                        {sortBy === 'year' && (
                          <SwitchComponent
                            left="Desc"
                            right="Asc"
                            call={setAscending}
                            checked={ascending}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {/* <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => setSortBy('oldest')}
                            selected={sortBy === 'oldest'}
                          >
                            <ListItemText>
                              <Typography variant="body1" display="inline">
                                Least Recently Added
                              </Typography>
                            </ListItemText>
                          </ListItemButton>
                        </ListItem> */}
                    {/* <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => setSortBy('alphabetical')}
                            selected={sortBy === 'alphabetical'}
                          >
                            <ListItemText>
                              <Typography variant="body1" display="inline">
                                Alphabetical
                              </Typography>
                            </ListItemText>
                          </ListItemButton>
                        </ListItem> */}
                  </List>
                </Collapse>
              </>
            )}
            <Divider />
            {onSearchablePage && availableActresses?.length > 0 && (
              <ListItemButton onClick={() => setIsActressOpen(!isActressOpen)}>
                <ListItemText primary="Filter By Actress" />
                {isYearOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            )}
            <Collapse in={isActressOpen} timeout="auto" unmountOnExit>
              <FixedSizeList
                height={500}
                width={262}
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
            </Collapse>
            {onSearchablePage && availableDecades?.length > 0 && (
              <ListItemButton onClick={() => setYearOpen(!isYearOpen)}>
                <ListItemText primary="Filter By Decade" />
                {isYearOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            )}
            <Collapse in={isYearOpen} timeout="auto" unmountOnExit>
              <FixedSizeList
                height={300}
                width={262}
                itemData={{
                  availableDecades,
                  handleDecadeSelection,
                  filterDecades
                }}
                itemSize={46}
                itemCount={availableDecades?.length}
                overscanCount={5}
                style={{ border: '1px solid lightgrey' }}
              >
                {renderRow}
              </FixedSizeList>
            </Collapse>
            <Divider />
            <ListItem>
              <ListItemButton
                onClick={handleSignout}
                data-cy="signout-menu-item"
              >
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </ListItem>
          </List>
        </ClickAwayListener>
      </Drawer>
    </Box>
  )
}

export default Header
