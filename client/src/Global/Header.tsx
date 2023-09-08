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
  Radio
} from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import SideNav from './SideNav'
import { styled } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import {
  AMATEUR_BB_URL,
  GALLERY_PAGES,
  LOGIN_URL,
  MAINSTREAM_BB_URL,
  SEARCH_RESULTS_URL
} from '../utils/constants'
import { debounce } from 'lodash'
import { useAsyncFn } from '../hooks/useAsync'
import { getSearchResults } from '../services/videos'
import { type MetaData } from '../Shared/types'
import { useAuthContext } from '../hooks'

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
const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchWithin, setSearchWithin] = useState('category')
  const [searchTerm, setSearchTerm] = useState('')
  const [previousPage, setPreviousPage] = useState('')

  const { user } = useAuthContext()
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

  const handleSearch = () => {
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
        hideUnderage: user?.hideUnderage?.toString() || 'true'
      })
      .then((searchResults: MetaData[]) => {
        if (!onSearchPage && previousPage !== location.pathname) {
          setPreviousPage(location.pathname)
        }
        if (
          onSearchPage &&
          (searchResults?.length === 0 || searchTerm.length === 0)
        ) {
          navigate(previousPage)
        }
        // if not on search page, navigate to
        if (searchResults.length > 0) {
          navigate(SEARCH_RESULTS_URL, {
            ...(onSearchPage && { replace: true }),
            state: {
              searchResults
            }
          })
        }
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
            <Link to="/" data-cy="header-home-link">
              Kinky Collection
            </Link>
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
                  // value={searchTerm}
                  onChange={debouncedResults}
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
      <SideNav open={open} handleClose={() => setOpen(false)} />
    </Box>
  )
}

export default Header
