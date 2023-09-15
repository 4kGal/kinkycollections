import React from 'react'
import {
  ListItemAvatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider
} from '@mui/material'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import HealingIcon from '@mui/icons-material/Healing'
import UpdateIcon from '@mui/icons-material/Update'
import PendingIcon from '@mui/icons-material/Pending'

const NEW = 'NEW'
const FIX = 'FIX'
const IMPROVED = 'IMPROVED'

const changes = [
  {
    title: '2023-09-15',
    state: NEW,
    primary: 'Website Went Live',
    secondary: [
      ' This website went live for the first time. Check here for information on current and future improvements and fixes'
    ]
  }
]

const ChangeLogFutureUpdates = () => {
  return (
    <Grid container>
      <Grid item xs>
        <List>
          <ListItem>
            <Typography variant="h3" color="white">
              Changelog
            </Typography>
          </ListItem>
          {changes.map(({ title, state, primary, secondary }) => (
            <>
              <ListItem alignItems="flex-start">
                <Typography color="white" variant="h5">
                  {title}
                </Typography>
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemAvatar style={{ height: '100%', marginTop: 12 }}>
                  {state === NEW ? (
                    <FiberNewIcon color="success" fontSize="large" />
                  ) : state === FIX ? (
                    <HealingIcon color="info" fontSize="large" />
                  ) : (
                    <UpdateIcon color="primary" fontSize="large" />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography color="white" variant="h6">
                      {primary}
                    </Typography>
                  }
                  secondary={secondary.map((el, i) => (
                    <Typography key={i} color="white" variant="subtitle2">
                      {el}
                    </Typography>
                  ))}
                />
              </ListItem>
              <Divider component="li" />
            </>
          ))}
        </List>
      </Grid>
    </Grid>
  )
}
export default ChangeLogFutureUpdates
