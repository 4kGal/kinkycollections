import React from 'react'
import { Grid, Typography } from '@mui/material'

const InfoBox = () => {
  return (
    <Grid
      container
      sx={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 255, 60, 0.3) , rgba(0, 157, 255, 0.3))`,
        padding: '20px',
        display: {
          xs: 'none',
          sm: 'none',
          md: 'flex',
          lg: 'flex',
          xl: 'flex'
        },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100%',
        borderRadius: '0px 30px 30px 0',
        width: '40%'
      }}
    >
      <Grid
        item
        xs={0}
        sm={0}
        md={6}
        lg={6}
        xl={6}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Typography variant="h4" fontWeight="bold" color="whitesmoke" mb={3}>
          Join Our <br /> Community
        </Typography>
        <Typography variant="body1" fontWeight="" color="whitesmoke">
          By having an account, you can save videos to your favorites collection
          for quick and easy viewing
        </Typography>
      </Grid>
    </Grid>
  )
}

export default InfoBox
