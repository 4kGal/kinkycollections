import React from 'react'
import { Grid, BottomNavigation, Paper, Typography } from '@mui/material'
const Footer = () => {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          textAlign="center"
        >
          <Grid item xs={12}>
            <Typography variant="caption">
              &copy; 2023, Kinky Collection. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">
              Contact me for bugs/feedback/suggestions/etc: 4kgal98@gmail.com
            </Typography>
          </Grid>
        </Grid>
      </BottomNavigation>
    </Paper>
  )
}

export default Footer
