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
  handleTagSelection: (tag: string) => void
  setCombineFilters: (combine: boolean) => void
  selectedCustomTags?: Array<string | undefined>
  handleSelectedCustomTags: (tag: string | undefined) => void
  combineFilters: boolean
  handleMultipleActresses: () => void
  displayMultipleActresses: boolean
  multipleActresses: boolean
}

const FilterVideoButtons = ({
  availableTags,
  selectedTags,
  combineFilters,
  setCombineFilters,
  selectedCustomTags = [],
  handleTagSelection,
  handleSelectedCustomTags,
  handleMultipleActresses,
  multipleActresses,
  displayMultipleActresses
}: Filter) => {
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
          data-cy={`tag-chip-${tagObj.key}-${
            selectedTags?.includes(tagObj.key ?? '') === true
          }`}
          key={tagObj.key}
          label={`${tagObj.key} (${tagObj.count})`}
          color="info"
          variant="outlined"
          onClick={() => handleTagSelection(tagObj.key)}
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
          data-cy={`custom-tag-chip-${tag}`}
          key={tag}
          label={tag}
          color="info"
          variant="outlined"
          onClick={() => handleSelectedCustomTags(tag)}
        />
      ))}
      {displayMultipleActresses && (
        <StyledChip
          label="Multiple Actresses"
          color="info"
          variant="outlined"
          onClick={handleMultipleActresses}
          avatar={multipleActresses ? <Avatar>X</Avatar> : undefined}
        />
      )}
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
    </Grid>
  )
}
export default FilterVideoButtons
