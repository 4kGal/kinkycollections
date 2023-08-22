import React, { useEffect, useState } from 'react'
import { useAuthenticator } from '../hooks/useAuthenticator'
import { useEmailUpdater } from '../hooks/useEmailUpdater'
import {
  // Box,
  Grid,
  Typography,
  // Checkbox,
  Button,
  InputBase,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { styled } from '@mui/system'
import InfoBox from './InfoBox'
import { useLocation } from 'react-router-dom'

const StyledLink = styled(Link)({
  '&:hover': {
    color: 'white'
  }
})

const Login = () => {
  const location: {
    state: {
      isLoginPage: boolean
      updateEmail: boolean
      username: string
      from: string
    }
  } = useLocation()
  const { state } = location

  const [isLoginPage, setIsLoginPage] = useState(state?.isLoginPage ?? true)
  const [dynamicLoginText, setDynamicLoginText] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [isVisibilityOn, setIsVisibilityOn] = useState(false)

  const updateEmailPage = state?.updateEmail
  const emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

  const { authenticate, error, isLoading } = useAuthenticator()
  const { updateEmail } = useEmailUpdater()

  const switchPage = () => {
    setEmail('')
    setUsername('')
    setPassword('')
    setDynamicLoginText('')
    setIsLoginPage(!isLoginPage)
  }

  useEffect(() => {
    handleLoginText()
  }, [dynamicLoginText])

  const handleLoginText = () => {
    if (emailReg.test(dynamicLoginText)) {
      setEmail(dynamicLoginText)
      setUsername('')
    } else {
      setUsername(dynamicLoginText)
    }
  }
  const handleSubmit = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    e.preventDefault()

    if (updateEmailPage) {
      updateEmail(email, state?.username, state?.from)
    } else {
      authenticate(isLoginPage, email, password, username)
    }
  }

  const disableButton =
    isLoading ||
    (!updateEmailPage &&
      (isLoginPage
        ? password === '' || (username === '' && email === '')
        : username === '' || password === '')) ||
    (updateEmailPage && !emailReg.test(email))

  const onKeyUp = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (!disableButton && event.key === 'Enter') {
      handleSubmit(event)
    }
  }
  return (
    <>
      <Grid
        container
        justifyContent="center"
        sx={{
          minWidth: 310,
          width: 'auto'
        }}
      >
        <Grid
          item
          xs={5}
          sx={{
            backgroundColor: 'rgba(0, 24, 57, 0.2)',
            boxShadow: {
              xs: '',
              sm: '',
              md: '15px 2px 5px -5px',
              lg: '15px 2px 5px -5px',
              xl: '15px 2px 5px -5px'
            },
            borderRadius: {
              xs: '30px',
              sm: '30px',
              md: '30px 0 0 30px',
              lg: '30px 0 0 30px',
              xl: '30px 0 0 30px'
            },

            minWidth: 310
          }}
        >
          {!updateEmailPage && (
            <Typography pt={2} pr={3} sx={{ textAlign: 'right' }}>
              <StyledLink href="/">Skip</StyledLink>
            </Typography>
          )}
          <Typography
            color="white"
            fontWeight="bold"
            sx={{
              textAlign: 'center',
              marginTop: 2,
              marginBottom: 3,
              paddingLeft: 3,
              paddingRight: 3
            }}
            mt={7}
            mb={1}
          >
            {!updateEmailPage && isLoginPage
              ? 'Sign in'
              : updateEmailPage
              ? 'Add an email '
              : 'Register '}{' '}
            to save/view your favorite videos
          </Typography>
          <Grid
            container
            justifyContent="center"
            direction="column"
            pl={3}
            pr={3}
          >
            {(!isLoginPage || updateEmailPage) && (
              <Grid item xs={6}>
                <Typography color="white" pb={1}>
                  Email {!updateEmailPage && '(optional)'}
                </Typography>
                <InputBase
                  placeholder="Enter your email"
                  fullWidth
                  onKeyUp={(e) => onKeyUp(e)}
                  value={email}
                  inputProps={{
                    'data-cy': 'email-field'
                  }}
                  sx={{
                    bgcolor: '#233447',
                    p: 1,
                    borderRadius: '5px',
                    marginBottom: 2
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
            )}
            {!updateEmailPage && (
              <>
                <Grid item xs={6}>
                  <Typography color="white" pb={1}>
                    {isLoginPage ? 'Login' : 'Username (required)'}
                  </Typography>
                  <InputBase
                    placeholder="Username or Email..."
                    fullWidth
                    value={dynamicLoginText}
                    onKeyUp={(e) => onKeyUp(e)}
                    sx={{
                      bgcolor: '#233447',
                      p: 1,
                      borderRadius: '5px'
                    }}
                    inputProps={{
                      'data-cy': 'username-field'
                    }}
                    onChange={(e) => setDynamicLoginText(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography color="white" pb={1} mt={3}>
                    Password
                  </Typography>
                  <InputBase
                    placeholder="Password"
                    fullWidth
                    type={isVisibilityOn ? 'text' : 'password'}
                    sx={{
                      bgcolor: '#233447',
                      p: 1,
                      borderRadius: '5px'
                    }}
                    inputProps={{
                      'data-cy': 'password-field'
                    }}
                    onKeyUp={(e) => onKeyUp(e)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" sx={{ pr: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => setIsVisibilityOn(!isVisibilityOn)}
                        >
                          {isVisibilityOn ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
          {/* <Grid
                container
                direction="row"
                justifyContent="center"
                mt={2}
                fullWidth
                alignItems="center"
                color="white"
              >
                <Grid item xs={7}>
                  <Typography>
                    <Checkbox disableRipple sx={{ p: 0, pr: 1 }} />
                    Remember me
                  </Typography>
                  <a
                      href="#yoyo"
                      style={{
                        color: 'green',
                        textDecoration: 'none'
                      }}
                    >
                      Forget password?
                    </a>
                </Grid>
              </Grid> */}
          <Grid container mb={7} alignItems="center" justifyContent="center">
            <Grid item xs={10} mt={4}>
              <Button
                onClick={handleSubmit}
                disabled={disableButton}
                variant="contained"
                fullWidth
                data-cy="submit-button"
                sx={{ boxShadow: `0 0 20px gray` }}
              >
                {!updateEmailPage && isLoginPage
                  ? 'Login'
                  : updateEmailPage
                  ? 'Update'
                  : 'Signup'}
              </Button>
              {!updateEmailPage && (
                <Typography pt={4} color="white" fontSize={12}>
                  {isLoginPage ? "Don't " : 'Already '} have an account?{' '}
                  <u
                    onClick={switchPage}
                    color="inherit"
                    style={{ cursor: 'pointer' }}
                  >
                    Click here
                  </u>
                </Typography>
              )}
              {error !== null && <Typography color="red">{error}</Typography>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <InfoBox />
    </>
  )
}

export default Login
