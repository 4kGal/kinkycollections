import React from 'react'
import {
  ListItemAvatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Tooltip
} from '@mui/material'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import HealingIcon from '@mui/icons-material/Healing'
import UpdateIcon from '@mui/icons-material/Update'
import PendingIcon from '@mui/icons-material/Pending'

const NEW = 'New'
const FIX = 'Fixed'
const IMPROVED = 'Improved'
const COMING = 'Coming Soon'

const changes = [
  {
    title: 'In Progress',
    state: COMING,
    primary: 'Download',
    secondary: [
      "Currently downloading the videos is not possible. I'm looking into enabling this feature"
    ]
  },
  {
    title: '2023-09-24',
    state: IMPROVED,
    primary: 'Filtering',
    secondary: [
      'Improved filtering on actress and tags while incorporating underage filter'
    ]
  },
  {
    title: '2023-09-21',
    state: IMPROVED,
    primary: 'Search',
    secondary: ['Improved functionality of searching']
  },
  {
    title: '2023-09-20',
    state: IMPROVED,
    primary: 'Improved Views',
    secondary: ['Improved functionality of how it caclulates video views']
  },
  {
    title: '2023-09-19',
    state: IMPROVED,
    primary:
      "Renamed Most Liked to Most Favorites and improved it's funcationality",
    secondary: [
      "Previously sorting by most favorites wasn't working correctly. It is now fixed"
    ]
  },
  {
    title: '2023-09-19',
    state: NEW,
    primary: 'Added the Most Viewed sort',
    secondary: ['Added in a new sort option for sorting by most liked videos']
  },
  {
    title: '2023-09-18',
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
                  <Tooltip title={state} placement="top">
                    {state === NEW ? (
                      <FiberNewIcon color="success" fontSize="large" />
                    ) : state === FIX ? (
                      <HealingIcon color="info" fontSize="large" />
                    ) : state === COMING ? (
                      <PendingIcon color="warning" fontSize="large" />
                    ) : (
                      <UpdateIcon color="primary" fontSize="large" />
                    )}
                  </Tooltip>
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
