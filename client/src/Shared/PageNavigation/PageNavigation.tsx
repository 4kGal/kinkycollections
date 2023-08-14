import React from 'react'
import { Grid, IconButton, Typography } from '@mui/material'
import {
  FirstPage as FirstPageIcon,
  ArrowBackIosNewOutlined as ArrowBackIosNewOutlinedIcon,
  ArrowForwardIosOutlined as ArrowForwardIosOutlinedIcon,
  LastPage as LastPageIcon
} from '@mui/icons-material'
import { styled } from '@mui/system'

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isDisabled'
})<{ isDisabled: boolean }>(({ isDisabled }) => ({
  backgroundColor: 'white',
  marginRight: isDisabled ? '-5px' : '5px',
  marginLeft: isDisabled ? '-12px' : '4px'
}))

interface Navigation {
  page: number
  setPage: (page: number) => void
  perPage: number
  length: number
}

const PageNavigation = ({ page, setPage, perPage, length }: Navigation) => {
  const disableForward = page === ((length / perPage) | 0)
  const styleObj = (disabled: boolean | undefined) => ({
    width: '1em',
    margin: '4px',
    boxSizing: 'content-box',
    color: 'black',
    padding: disabled ?? false ? '12px' : 'initial',
    backgroundColor: disabled ?? false ? 'grey' : 'inherit',
    borderRadius: '50%'
  })
  const onFirstPage = page === 0
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item>
        <StyledIconButton
          disabled={onFirstPage}
          isDisabled={onFirstPage}
          onClick={() => setPage(0)}
          data-cy="first-page-button"
        >
          <FirstPageIcon
            sx={{
              ...styleObj(onFirstPage)
            }}
          />
        </StyledIconButton>
      </Grid>
      <Grid item>
        <StyledIconButton
          disabled={onFirstPage}
          isDisabled={onFirstPage}
          onClick={() => setPage(page - 1)}
          data-cy="previous-page-button"
        >
          <ArrowBackIosNewOutlinedIcon
            sx={{
              ...styleObj(onFirstPage)
            }}
          />
        </StyledIconButton>
      </Grid>
      <Grid item sx={{ paddingRight: '6px' }}>
        <Typography color="primary">
          {page + 1} of {Math.floor(length / perPage) + 1}
        </Typography>
      </Grid>
      <Grid item>
        <StyledIconButton
          disabled={disableForward}
          isDisabled={disableForward}
          onClick={() => setPage(page + 1)}
          data-cy="next-page-button"
        >
          <ArrowForwardIosOutlinedIcon
            sx={{
              ...styleObj(disableForward)
            }}
          />
        </StyledIconButton>
      </Grid>
      <Grid item>
        <StyledIconButton
          disabled={disableForward}
          onClick={() => setPage((length / perPage) | 0)}
          isDisabled={disableForward}
          data-cy="last-page-button"
        >
          <LastPageIcon
            sx={{
              ...styleObj(disableForward)
            }}
          />
        </StyledIconButton>
      </Grid>
    </Grid>
  )
}
export default PageNavigation
