import React, { useState } from 'react'
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Badge,
  Popover,
  TextField,
  Stack,
  Select,
  MenuItem,
  type SelectChangeEvent
} from '@mui/material'
import { styled } from '@mui/system'
import { Link } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useAuthContext, useGallerySettingsContext } from '../hooks'
import { useFavoriteUpdater } from '../hooks/useFavoriteUpdater'
import { type User, type MetaData } from '../Shared/types'
import { useAuthenticator } from '../hooks/useAuthenticator'
import Image from 'react-image-webp'
import { useAsyncFn } from '../hooks/useAsync'
import { updateFavorites } from '../services/user'

interface Video {
  collection?: string
  video: MetaData
  setCustomTags?: (tag: string) => void
  setSelectedTags?: (tag: string) => void
}

const StyledCardGrid = styled(Grid)({
  backgroundColor: 'white',
  height: '370px',
  minWidth: '400px',
  borderRadius: '15px',
  color: '#333',
  margin: '10px',
  border: '1px solid #ddd',
  '& img:hover': {
    boxShadow: '0 0 4em 0px rgba(0, 0, 0, 0.4)',
    transform: 'scale(1.03)'
  },
  '& img': {
    transition: 'all 0.2s ease-out',
    position: 'relative',
    top: '-25%',
    width: '100%'
  }
})

const StyledCardImg = styled('img')({
  height: '200px',
  borderRadius: '15px',
  cursor: 'pointer'
})

const StyledGrid = styled(Grid)({
  height: '370px'
})
const StyledCardContent = styled(Grid)({
  padding: '0.8em',
  fontFamily: 'Georgia',
  height: 'auto',
  maxHeight: 126,
  '& > h3': {
    margin: 0,
    padding: 0,
    width: 'calc(100% - 4px)'
  }
})

const KEYS = [
  'tags',
  'name',
  'actresses',
  'year',
  'title',
  'collection',
  'videoId',
  'dateUploaded',
  'underage',
  'customName'
]

const Card = ({ video, setSelectedTags, setCustomTags }: Video) => {
  const updateFavoritesFn = useAsyncFn(updateFavorites)

  const { selectedDecades } = useGallerySettingsContext()
  const { user, isAdmin, updateLocalUser, showAdminControls } = useAuthContext()
  const { updateVideoAdmin, deleteVideoAdmin } = useAuthenticator()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [key, setKey] = useState('')
  const [value, setValue] = useState<
    string | number | string[] | boolean | undefined
  >('')
  const [hover, setHover] = useState(false)

  const {
    name,
    year,
    _id,
    addedDate,
    likes,
    customName = '',
    actresses,
    videoId,
    views
  } = video
  const tags = (video.tags ?? []).filter(
    (tag: string) => tag !== 'mainstream' && tag !== 'ballbusting'
  )
  const handleFavorite = () => {
    updateFavorite(user?.username, user?.userRoles, video._id)
  }

  const isFavorited = Boolean(
    user?.favorites?.find((id: string) => id === video._id)
  )

  const apiCollection = video.collection

  const handleAdminControls = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleAdminKeyChange = (video: MetaData, event: SelectChangeEvent) => {
    setKey(event.target.value)
    setValue(video[event.target.value])
  }

  const adminSubmit = (movie: MetaData) => {
    updateVideoAdmin(movie.collection, key, value, movie._id)
    setAnchorEl(null)
  }

  const adminDelete = (movie: MetaData) => {
    deleteVideoAdmin(movie.collection, movie._id)
  }

  const onUserFavoriteUpdate = () => {
    return updateFavoritesFn
      .execute(user?.username, user?.userRoles, video._id)
      .then((userResp: User) => {
        console.log('resp', userResp)
        // updateLocalGallery(null, user?.favorites)
        updateLocalUser(userResp)
      })
  }

  console.log(user?.favorites)
  const popoverOpen = Boolean(anchorEl)

  const { updateFavorite } = useFavoriteUpdater()

  const tenDaysAgo = new Date()
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
  const isNew = new Date(addedDate) >= tenDaysAgo

  const displayName =
    customName.length > 0 ? customName : name?.replace('.mp4', '')

  const nameContainsYear = displayName?.search(/[1-2][0-9][0-9][0-9]/) > -1

  return (
    <StyledCardGrid item xs={2} data-cy={`movie-${_id}`}>
      <Badge
        badgeContent={'New'}
        color="primary"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        invisible={!isNew}
      >
        <StyledGrid container>
          <Link
            to={`/player/${apiCollection}/${_id}`}
            style={{
              width: '100%'
            }}
          >
            <Grid
              item
              xs={12}
              sx={{ textAlign: 'center' }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {hover ? (
                <Image
                  src={`https://vz-8c62cae6-fd0.b-cdn.net/${videoId}/thumbnail.jpg?v=1692248025`}
                  webp={`https://vz-8c62cae6-fd0.b-cdn.net/${videoId}/preview.webp?v=1692467633`}
                />
              ) : (
                <StyledCardImg
                  src={`https://vz-8c62cae6-fd0.b-cdn.net/${videoId}/thumbnail.jpg?v=1692248025$`}
                />
              )}
              <Typography variant="caption" fontSize=".65rem">
                {views} Overall Plays
              </Typography>
            </Grid>
          </Link>
          <StyledCardContent key={video?._id}>
            <Typography>
              {displayName}
              {selectedDecades?.length > 0 && !nameContainsYear && ` (${year})`}
              <br /> {video?._id}
            </Typography>
          </StyledCardContent>
          <Grid
            container
            alignContent="end"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="nowrap"
          >
            <Grid item xs={11}>
              {typeof setSelectedTags !== 'undefined' &&
                tags?.map((tag, i) => (
                  <Button
                    sx={{ fontSize: 10 }}
                    size="small"
                    variant="text"
                    key={i}
                    onClick={() => setSelectedTags(tag)}
                  >
                    #{tag}{' '}
                  </Button>
                ))}
              {typeof setCustomTags !== 'undefined' &&
                actresses?.map((actress, i) => (
                  <Button
                    sx={{ fontSize: 10 }}
                    size="small"
                    variant="text"
                    key={i}
                    onClick={() => setCustomTags(actress)}
                  >
                    #{actress}{' '}
                  </Button>
                ))}
            </Grid>
            {isAdmin && showAdminControls === true && (
              <Grid item xs>
                <Button size="small" onClick={(e) => handleAdminControls(e)}>
                  ADM
                </Button>
                <Popover
                  open={popoverOpen}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                >
                  <Stack
                    component="form"
                    spacing={2}
                    noValidate
                    sx={{ width: '400px' }}
                    autoComplete="off"
                  >
                    <Select
                      value={key}
                      onChange={(e) => handleAdminKeyChange(video, e)}
                    >
                      {KEYS.map((key, index) => (
                        <MenuItem key={index} value={key}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField
                      size="small"
                      fullWidth
                      label="value"
                      value={value}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setValue(event.target.value)
                      }}
                    />
                    <Button onClick={() => adminDelete(video)}>DELETE</Button>
                    <Button onClick={() => adminSubmit(video)}>Submit</Button>
                  </Stack>
                </Popover>
              </Grid>
            )}
            <Grid item xs pr={1}>
              <IconButton
                onClick={onUserFavoriteUpdate}
                disabled={user === null}
              >
                <Typography variant="h6">{likes} </Typography>
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </StyledGrid>
      </Badge>
    </StyledCardGrid>
  )
}

export default Card
