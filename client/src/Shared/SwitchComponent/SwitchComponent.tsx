import React from 'react'
import { Typography, Switch } from '@mui/material'

interface SComponent {
  left: string
  right: string
  call: (checked: boolean) => void
  checked: boolean
  color?: string
}
const SwitchComponent = ({
  left,
  right,
  call,
  checked,
  color = 'primary'
}: SComponent) => {
  return (
    <span style={{ paddingLeft: 20 }}>
      <Typography variant="caption" color={color}>
        {left}
      </Typography>
      <Switch
        checked={checked}
        onChange={({ target }) => call(target.checked)}
      />
      <Typography variant="caption" color={color}>
        {right}
      </Typography>
    </span>
  )
}

export default SwitchComponent
