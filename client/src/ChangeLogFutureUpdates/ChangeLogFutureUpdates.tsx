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

export const CHANGES = [
  {
    title: 'In Progress',
    state: COMING,
    primary: 'Download',
    secondary: [
      "Currently downloading the videos is not possible. I'm looking into enabling this feature"
    ]
  },
  {
    title: 'In Progress',
    state: COMING,
    primary: 'Video Quality on mobile',
    secondary: [
      "Currently you can not change the video quality of videos on mobile. The server I'm using doesn't allow this. I'm looking into an alternative"
    ]
  },
  {
    title: 'In Progress',
    state: COMING,
    primary: 'New category of youtube nutshot reactions',
    secondary: [
      "I'm working on a new category that features girls on youtube reacting to nutshots"
    ]
  },
  {
    title: '02/07/2024',
    state: NEW,
    primary: 'Link for low-blow.net',
    secondary: ['Added a link on mainstreamcb to navigate to low-blow.net']
  },
  {
    title: '12/20/2023',
    state: FIX,
    primary: 'Description text overflowing',
    secondary: [
      "I've fixed the description text under each video so it no longer overflows outside of the white box"
    ]
  },
  {
    title: '12/1/2023',
    state: FIX,
    primary: 'Added message about reddit ban'
  },
  {
    title: '12/1/2023',
    state: FIX,
    primary: 'Fix alignment of folders on mobile',
    secondary: [
      "I've fixed the horizontal alignment of folders when viewing on mobile.",
      "It's now a straight line"
    ]
  },
  {
    title: '10/29/2023',
    state: NEW,
    primary: 'Added Porn Balls',
    secondary: [
      'Added a new category for porn videos that figure accidental ballbusts, ballbusting in non-ballbusting porn, actresses being concerned about hurting balls, etc'
    ]
  },
  {
    title: '10/19/2023',
    state: FIX,
    primary: 'Search Bar and header styling on Mobile',
    secondary: [
      'Easier to access and use the search bar on mobile and minor styling updates'
    ]
  },
  {
    title: '09/27/2023',
    state: FIX,
    primary: 'Home Link Visible on Mobile',
    secondary: [
      'Previously on mobile, you had to manually swipe back to the home dashboard. Now the link is visible in the header'
    ]
  },
  {
    title: '09/25/2023',
    state: IMPROVED,
    primary: 'NEW Icon Badge',
    secondary: [
      'The NEW icon now only appears when a video has been added since the user has last logged in',
      'Added the NEW icon to the changes log to indicate when something new or improve has been release'
    ]
  },
  {
    title: '09/24/2023',
    state: NEW,
    primary: 'Actress Video Count',
    secondary: [
      'Added the ability to sort the actress filter by how many videos they have'
    ]
  },
  {
    title: '09/24/2023',
    state: IMPROVED,
    primary: 'Filtering',
    secondary: [
      'Improved filtering on actress and tags while incorporating underage filter',
      'Styling updates'
    ]
  },
  {
    title: '09/21/2023',
    state: IMPROVED,
    primary: 'Search',
    secondary: ['Improved functionality of searching']
  },
  {
    title: '09/20/2023',
    state: IMPROVED,
    primary: 'Improved Views',
    secondary: ['Improved functionality of how it caclulates video views']
  },
  {
    title: '09/19/2023',
    state: IMPROVED,
    primary:
      "Renamed Most Liked to Most Favorites and improved it's funcationality",
    secondary: [
      "Previously sorting by most favorites wasn't working correctly. It is now fixed"
    ]
  },
  {
    title: '09/19/2023',
    state: NEW,
    primary: 'Added the Most Viewed sort',
    secondary: ['Added in a new sort option for sorting by most liked videos']
  },
  {
    title: '09/18/2023',
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
          {CHANGES.map(({ title, state, primary, secondary }) => (
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
                  secondary={secondary?.map((el, i) => (
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
