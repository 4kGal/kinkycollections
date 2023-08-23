import React, { type ReactNode } from 'react'
import Header from './Global/Header'
import Footer from './Footer'
import { Box } from '@mui/material'
import { GallerySettingsProvider } from './context/GallerySettingsContext'
const Layout = (props: { children: ReactNode }) => {
  return (
    <div>
      <GallerySettingsProvider>
        <Header />
      </GallerySettingsProvider>
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
