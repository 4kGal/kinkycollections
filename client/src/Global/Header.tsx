import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  AppBar,
  MenuItem,
  RadioGroup,
  InputBase,
  Tooltip,
  Menu,
  IconButton,
  Toolbar,
  Typography,
  FormControlLabel,
  Radio,
  LinearProgress,
  Grid
} from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import SideNav from './SideNav'
import { styled } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import {
  GALLERY_PAGES,
  LOGIN_URL,
  SEARCH_RESULTS_URL
} from '../utils/constants'
import { debounce, isEmpty } from 'lodash'
import { useAsyncFn } from '../hooks/useAsync'
import { getSearchResults } from '../services/videos'
import { type MetaData } from '../Shared/types'
import { useGalleryContext } from '../hooks'
import { usePrevious } from '../hooks/usePrevious'
import useMediaQuery from '@mui/material/useMediaQuery'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'gray',
  // marginLeft: 0,
  // width: '27%',
  minWidth: '140px'
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
    paddingLeft: 0,
    marginLeft: -80,
    // vertical padding + font size from searchIcon
    // transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '25ch',
      marginLeft: '0px',
      paddingLeft: 45
    }
  }
}))
const Header = () => {
  const mediumWidthScreen = useMediaQuery('(min-width:600px)')
  const largeWidthScreen = useMediaQuery('(min-width:1270px)')

  const location = useLocation()
  const prevLocationState = usePrevious(location?.state)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchWithin, setSearchWithin] = useState('category')
  const [searchTerm, setSearchTerm] = useState('')
  const [previousPage, setPreviousPage] = useState('')

  const { hideUnderage } = useGalleryContext()
  const getSearchResultsFn = useAsyncFn(getSearchResults)
  const menuOpen = Boolean(anchorEl)

  const onLoginPage = location.pathname === LOGIN_URL
  const onSearchPage = location.pathname === SEARCH_RESULTS_URL

  const onSearchablePage = GALLERY_PAGES.includes(location.pathname)

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  const handleChange = (e: { target: { value: string } }) => {
    setSearchTerm(e?.target?.value)
  }

  useEffect(() => {
    if (searchTerm.length > 3) {
      handleSearch()
    } else if (searchTerm.length === 0 && onSearchPage) {
      navigate(previousPage)
    }
  }, [searchTerm])

  useEffect(() => {
    // Force clearing when user navigates away from page
    if (!location.state && !isEmpty(prevLocationState)) {
      // @ts-expect-error manually clear the input
      document.getElementById('search-input').value = ''
      setSearchTerm('')
      debouncedResults.cancel()
    }
  }, [location.state])

  const handleSearch = () => {
    setIsSearching(true)
    let collection = ''
    if (searchWithin === 'category') {
      const currentPage = location.pathname.replace('/', '').toLowerCase()
      if (currentPage !== 'searchresults') {
        collection = currentPage
      } else if (previousPage.length > 1) {
        collection = previousPage
      }
    }
    getSearchResultsFn
      .execute({
        searchTerm,
        collection,
        hideUnderage: hideUnderage?.toString() || 'true'
      })
      .then((searchResults: MetaData[]) => {
        if (!onSearchPage && previousPage !== location.pathname) {
          setPreviousPage(location.pathname)
        }
        navigate(SEARCH_RESULTS_URL, {
          ...(onSearchPage && { replace: true }),
          state: {
            searchResults
          }
        })
      })
      .finally(() => {
        setIsSearching(false)
      })
  }

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300)
  }, [])

  const handleSearchMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleSearchMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSearchWithin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setSearchWithin(newValue === searchWithin ? '' : newValue)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container justifyContent="space-between" flexWrap="nowrap">
            <Grid item xs={3} display="flex">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setOpen(true)}
                edge="start"
                data-cy="open-nav-drawer"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={6} ml={-5}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  textOverflow: 'unset'
                  // display: { sm: 'block' },
                  // marginLeft: '50px'
                  // ml: onLoginPage ? 'initial' : '17%'
                }}
              >
                <Link to="/" data-cy="header-home-link">
                  Kinky Collection
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={!mediumWidthScreen ? 5 : 3}>
              {!onLoginPage && (
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <Tooltip title="Enter 4 or more characters">
                    <StyledInputBase
                      placeholder={mediumWidthScreen ? 'Search… ' : ''}
                      data-cy="search-bar"
                      inputProps={{ 'aria-label': 'search' }}
                      onClick={handleSearchMenuClick}
                      id="search-input"
                      // value={searchTerm}
                      onChange={debouncedResults}
                      style={{
                        marginLeft: largeWidthScreen ? '-50px' : 'inherit'
                      }}
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
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {isSearching && <LinearProgress />}
      <SideNav open={open} handleClose={() => setOpen(false)} />
    </Box>
  )
}

export default Header
