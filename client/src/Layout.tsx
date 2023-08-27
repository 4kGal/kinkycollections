import React, { type ReactNode, useEffect } from 'react'
import Header from './Global/Header'
import Footer from './Footer'
import { Box } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

const Layout = (props: { children: ReactNode }) => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location?.pathname.includes('BB')) {
      navigate(location.pathname.toLowerCase(), { replace: true })
    }
  }, [location?.pathname])

  return (
    <div>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
          borderRadius: 1,
          paddingBottom: '50px'
        }}
      >
        {props.children}
      </Box>
      <Footer />
    </div>
  )
}

export default Layout
