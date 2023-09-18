import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Grid } from '@mui/material'
import mainstreambbIcon from '../assets/images/mainstreambb_folder.png'
import mainstreambcbIcon from '../assets/images/mainstreamcb_folder.png'
import amateurbbIcon from '../assets/images/amateurbb_folder.png'
import amateurcbIcon from '../assets/images/amateurcb_folder.png'
import mainstreampeIcon from '../assets/images/mainstreampe_folder.png'
import mainstreammiscIcon from '../assets/images/mainstreammisc_folder.png'
import comingsoonIcon from '../assets/images/comingsoon_folder.png'
import { styled } from '@mui/system'
import {
  AMATEUR_BB_COLLECTION,
  AMATEUR_BB_URL,
  AMATEUR_CB_COLLECTION,
  AMATEUR_CB_URL,
  MAINSTREAM_BB_COLLECTION,
  MAINSTREAM_BB_URL,
  MAINSTREAM_CB_COLLECTION,
  MAINSTREAM_CB_URL,
  MAINSTREAM_MISC_COLLECTION,
  MAINSTREAM_MISC_URL,
  MAINSTREAM_PE_COLLECTION,
  MAINSTREAM_PE_URL
} from '../utils/constants'

const StyledLabel = styled('label')({
  fontFamily: 'Ysabeau SC',
  color: 'white'
})

const Folders = [
  {
    link: MAINSTREAM_BB_URL,
    src: mainstreambbIcon,
    alt: 'mainstream ballbusting',
    label: 'Mainstream Ballbusting',
    disabled: false,
    cy: MAINSTREAM_BB_COLLECTION
  },
  {
    link: AMATEUR_BB_URL,
    src: amateurbbIcon,
    alt: 'nutshots in real life',
    label: 'Nutshots IRL',
    disabled: false,
    cy: AMATEUR_BB_COLLECTION
  },
  {
    link: MAINSTREAM_CB_URL,
    src: mainstreambcbIcon,
    alt: 'mainstream cuntbusting',
    label: 'Mainstream Cuntbusting',
    disabled: false,
    cy: MAINSTREAM_CB_COLLECTION
  },
  {
    link: AMATEUR_CB_URL,
    src: amateurcbIcon,
    alt: 'cuntbusting in real life',
    label: 'Amateur Cuntbusting',
    disabled: false,
    cy: AMATEUR_CB_COLLECTION
  },
  {
    link: MAINSTREAM_PE_URL,
    src: mainstreampeIcon,
    alt: 'mainstream premature ejaculation',
    label: 'Mainstream Premature Ejaculation',
    disabled: false,
    cy: MAINSTREAM_PE_COLLECTION
  },
  {
    link: MAINSTREAM_MISC_URL,
    src: mainstreammiscIcon,
    alt: 'mainstream miscellaneous',
    label: 'Mainstream Miscellaneous [i.e. boners, sph, cfnm, penises, etc]',
    disabled: false,
    cy: MAINSTREAM_MISC_COLLECTION
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
            <StyledLabel data-cy={`folder-link-${folder.cy}`}>
              {folder.label}
            </StyledLabel>
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}

export default Home
