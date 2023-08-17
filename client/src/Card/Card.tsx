import React from 'react'
import { Grid, Typography, Button, IconButton, Badge } from '@mui/material'
import { styled } from '@mui/system'
import { Link } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFavoriteUpdater } from '../hooks/useFavoriteUpdater'
import { type MetaData } from '../Shared/types'

interface Video {
  collection?: string
  videos: MetaData[]
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

const Card = ({ videos, setSelectedTags, setCustomTags }: Video) => {
  const { user } = useAuthContext()
  const { updateFavorite } = useFavoriteUpdater()

  const tenDaysAgo = new Date()
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

  return (
    <Grid container alignItems="center" justifyContent="center">
      {videos?.map((video, index) => {
        const { name, _id, addedDate, likes, customName, actresses, videoId } =
          video
        const tags = (video.tags ?? []).filter(
          (tag: string) => tag !== 'mainstream' && tag !== 'ballbusting'
        )
        const handleFavorite = () => {
          updateFavorite(user?.username, video._id)
        }

        const isFavorited = Boolean(
          user?.favorites?.find((id: string) => id === video._id)
        )

        const apiCollection = video.collection

        const isNew = new Date(addedDate) >= tenDaysAgo
        return (
          <StyledCardGrid item xs={2} data-cy={`movie-${_id}`} key={index}>
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
                  <Grid>
                    <StyledCardImg
                      src={`https://vz-8c62cae6-fd0.b-cdn.net/${videoId}/thumbnail.jpg?v=1692248025$`}
                    />
                  </Grid>
                </Link>
                <StyledCardContent key={video?._id}>
                  <Typography>
                    {(customName ?? '').length > 0
                      ? customName
                      : name.replace('.mp4', '')}
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
                  <Grid item xs pr={1}>
                    <IconButton
                      onClick={handleFavorite}
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
      })}
    </Grid>
  )
}

export default Card
