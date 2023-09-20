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
import { useAuthContext, useGalleryContext } from '../hooks'
import { type User, type MetaData } from '../Shared/types'
import Image from 'react-image-webp'
import { useAsyncFn } from '../hooks/useAsync'
import {
  updateFavorites,
  updateVideoAdmin,
  deleteVideoAdmin
} from '../services/user'
import { UPDATE_FAVORITE } from '../utils/constants'
import { isArray, isBoolean } from 'lodash'

interface Video {
  collection?: string
  video: MetaData
  setCustomTags?: (tag: string) => void
  setSelectedTags?: (tag: string) => void
  index: number
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

const Card = ({ video, index, setSelectedTags, setCustomTags }: Video) => {
  const updateFavoritesFn = useAsyncFn(updateFavorites)
  const updateVideoAdminFn = useAsyncFn(updateVideoAdmin)
  const deleteVideoAdminFn = useAsyncFn(deleteVideoAdmin)
  const { selectedDecades } = useGalleryContext()
  const { user, isAdmin, displayAdminControls, dispatch } = useAuthContext()

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [key, setKey] = useState('')
  const [value, setValue] = useState<
    string | number | string[] | boolean | undefined
  >('')
  const [hover, setHover] = useState(false)
  const [favoriteError, setFavoriteError] = useState('')

  const {
    name,
    year,
    _id,
    addedDate,
    likes,
    customName = '',
    actresses = [],
    videoId,
    views,
    customViews = 0,
    tags = []
  } = video

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

  const adminSubmit = (video: MetaData) => {
    let newValue = value
    if (isArray(video[key])) {
      newValue = (video[key] as string[]).concat(value as string)
    } else if (isBoolean(video[key])) {
      newValue = Boolean(value)
    }
    updateVideoAdminFn.execute({
      collection: video.collection,
      key,
      value: newValue,
      _id: video._id,
      user
    })
    setAnchorEl(null)
  }

  const adminDelete = (video: MetaData) => {
    deleteVideoAdminFn.execute(video.collection, video._id, user)
  }

  const popoverOpen = Boolean(anchorEl)

  const tenDaysAgo = new Date()
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
  const isNew = new Date(addedDate) >= tenDaysAgo

  const displayName =
    customName.length > 0 ? customName : name?.replace('.mp4', '')

  const nameContainsYear = displayName?.search(/[1-2][0-9][0-9][0-9]/) > -1

  const handleFavorite = () => {
    setFavoriteError('')
    return updateFavoritesFn
      .execute(user?.username, video._id)
      .then((res: User) => {
        dispatch({ type: UPDATE_FAVORITE, payload: res })
      })
      .catch(setFavoriteError)
  }

  return (
    <StyledCardGrid item xs={2} data-cy={`card-${_id}`}>
      <Badge
        badgeContent={'New'}
        color="primary"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        invisible={!isNew}
      >
        <StyledGrid container data-cy={`card-index-${index}`}>
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
                {customViews > views ? customViews : views} Overall Plays
              </Typography>
            </Grid>
          </Link>
          <StyledCardContent key={video?._id}>
            <Typography>
              {displayName}
              {selectedDecades?.length > 0 && !nameContainsYear && ` (${year})`}
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
                actresses.length > 0 &&
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
            {isAdmin && displayAdminControls === true && (
              <Grid item xs>
                <Button
                  size="small"
                  onClick={(e) => handleAdminControls(e)}
                  data-cy="admin-card-controls-btn"
                >
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
            {favoriteError.length > 0 && (
              <Typography color="error" data-cy={`${video._id}-error-message`}>
                {favoriteError.toString()}
              </Typography>
            )}

            <Grid item xs pr={1}>
              <IconButton onClick={handleFavorite} disabled={user === null}>
                <Typography variant="h6">{likes} </Typography>
                {isFavorited ? (
                  <FavoriteIcon data-cy={`${video._id}-favorited`} />
                ) : (
                  <FavoriteBorderIcon data-cy={`${video._id}-not-favorited`} />
                )}
              </IconButton>
            </Grid>
          </Grid>
        </StyledGrid>
      </Badge>
    </StyledCardGrid>
  )
}

export default Card
