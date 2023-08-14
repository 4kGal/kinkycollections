import { Avatar, Chip, Grid, Stack, Typography, Switch } from '@mui/material'
import React from 'react'
import { styled } from '@mui/system'

const StyledChip = styled(Chip)({
  backgroundColor: 'white',
  color: 'black',
  '&:hover': {
    backgroundColor: 'grey',
    color: 'white'
  }
})
interface Filter {
  availableTags:
    | [
        {
          key: string
          count: number
        }
      ]
    | undefined
  selectedTags?: string[]
  setSelectedTags: (tag: string[]) => void
  setCombineFilters: (combine: boolean) => void

  selectedCustomTags?: Array<string | undefined>
  handleSelectedCustomTags: (tag: string | undefined) => void
  // updateSelectedTags: (tag: string) => void
  // setAvailableTags: (tag: Array<string | undefined>) => void
  combineFilters: boolean
}
const FilterVideoButtons = ({
  availableTags,
  setSelectedTags,
  selectedTags,
  setCombineFilters,
  combineFilters,
  selectedCustomTags = [],
  handleSelectedCustomTags
}: Filter) => {
  const chipSelection = (tag: string) => {
    const index = selectedTags?.indexOf(tag)

    if (index === -1) {
      setSelectedTags((selectedTags ?? [])?.concat(tag))
    } else {
      setSelectedTags(
        (selectedTags ?? [])?.filter((currentTag) => currentTag !== tag)
      )
    }
  }

  return (
    <Grid container alignItems="center" justifyContent="center" direction="row">
      {availableTags?.map((tagObj) => (
        <StyledChip
          clickable
          avatar={
            selectedTags?.includes(tagObj.key ?? '') === true ? (
              <Avatar>X</Avatar>
            ) : undefined
          }
          key={tagObj.key}
          label={`${tagObj.key} (${tagObj.count})`}
          color="info"
          variant="outlined"
          onClick={() => chipSelection(tagObj.key)}
        />
      ))}
      {selectedCustomTags?.map((tag) => (
        <StyledChip
          clickable
          avatar={
            selectedCustomTags?.includes(tag ?? '') ? (
              <Avatar>X</Avatar>
            ) : undefined
          }
          key={tag}
          label={tag}
          color="info"
          variant="outlined"
          onClick={() => handleSelectedCustomTags(tag)}
        />
      ))}
      {/* <StyledChip
        label="all"
        color="info"
        variant="outlined"
        disabled={selectedTags?.length === 0}
        onClick={() => updateSelectedTags('')}
      /> */}

      <Stack direction="row" alignItems="center" paddingLeft={3}>
        <Typography color="primary">OR</Typography>
        <Switch
          value={combineFilters}
          checked={combineFilters}
          onChange={(e) => setCombineFilters(e.target.checked)}
          data-cy="switch"
        />
        <Typography color="primary">AND</Typography>
      </Stack>
      {/* <Stack direction="row" alignItems="center" paddingLeft={3}>
        <div>Sorting</div>
      </Stack> */}
    </Grid>
  )
}
export default FilterVideoButtons
