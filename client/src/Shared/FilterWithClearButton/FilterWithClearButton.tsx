import React from 'react'

import {
  ListItem,
  ListItemButton,
  Button,
  IconButton,
  ListItemText,
  Divider
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

interface ClearComponent {
  display: boolean
  handleClick: () => void
  displayClear: boolean
  handleClear: (event: React.MouseEvent<HTMLElement>) => void
  text: string
  isOpen: boolean
  dataCy: string
}

const FilterWithClearComponent = ({
  display,
  handleClick,
  displayClear,
  handleClear,
  text,
  isOpen,
  dataCy
}: ClearComponent) => (
  <>
    <ListItem
      disablePadding
      sx={{
        backgroundColor: display ? '#81acd6' : 'initial',
        border: display ? '1px solid black' : 'initial'
      }}
      data-cy={dataCy}
    >
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={text} />
        {displayClear && (
          <Button
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: 'white'
            }}
            data-cy={`${text.toLowerCase().replace(/[ ]/g, '-')}-clear-btn`}
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
        {isOpen ? (
          <IconButton size="small">
            <ExpandLess />
          </IconButton>
        ) : (
          <IconButton size="small">
            <ExpandMore />
          </IconButton>
        )}
      </ListItemButton>
    </ListItem>
    <Divider />
  </>
)
export default FilterWithClearComponent
