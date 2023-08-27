import React, { type ReactNode } from 'react'
import Header from './Global/Header'
import Footer from './Footer'
import { Box } from '@mui/material'

const Layout = (props: { children: ReactNode }) => {
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
