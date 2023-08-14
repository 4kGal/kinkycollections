import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Grid } from '@mui/material'
import mainstreambbbIcon from '../assets/images/mainstreambb_folder.png'
import comingsoonIcon from '../assets/images/comingsoon_folder.png'
import { styled } from '@mui/system'
import { AMATEUR_BB_URL, MAINSTREAM_BB_URL } from '../utils/constants'

const StyledLabel = styled('label')({
  fontFamily: 'Ysabeau SC',
  color: 'white'
})

const Folders = [
  {
    link: MAINSTREAM_BB_URL,
    src: mainstreambbbIcon,
    alt: 'mainstream ballbusting',
    label: 'Mainstream Ballbusting',
    disabled: false
  },
  {
    link: AMATEUR_BB_URL,
    src: mainstreambbbIcon,
    alt: 'nutshots in real life',
    label: 'Nutshots IRL',
    disabled: false
  },
  {
    link: '/mainstreamCB',
    src: comingsoonIcon,
    alt: 'mainstream cuntbusting',
    label: 'Mainstream Cuntbusting',
    disabled: true
  },
  {
    link: '/amateurCB',
    src: comingsoonIcon,
    alt: 'cuntbusting in real life',
    label: 'Amateur Cuntbusting',
    disabled: true
  },
  {
    link: '/mainstreamPE',
    src: comingsoonIcon,
    alt: 'mainstream premature ejaculation',
    label: 'Mainstream Premature Ejaculation',
    disabled: true
  },
  {
    link: '/mainstreamMisc',
    src: comingsoonIcon,
    alt: 'mainstream miscellaneous',
    label: 'Mainstream Miscellaneous [i.e. boners, sph, etc]',
    disabled: true
  }
]
const Home = () => {
  const navigate = useNavigate()

  return (
    <Grid container justifyContent="space-around">
      {Folders.map((folder) => (
        <Grid item xs={1} sx={{ minWidth: 250 }} key={folder.label}>
          <Button
            variant="text"
            size="small"
            style={{ flexDirection: 'column' }}
            disabled={folder.disabled}
            onClick={() => navigate(folder.link)}
          >
            <img src={folder.src} height="100" alt={folder.alt} />
            <StyledLabel>{folder.label}</StyledLabel>
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}

export default Home
