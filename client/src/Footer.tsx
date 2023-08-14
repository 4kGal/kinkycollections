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
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography>
              &copy; 2023, Kinky Collection. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Contact me for bugs/feedback/suggestions/etc: 4kgal98@gmail.com
            </Typography>
          </Grid>
        </Grid>
      </BottomNavigation>
    </Paper>
  )
}

export default Footer
