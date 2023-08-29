import { PlayerContext } from '../context/PlayerContext'
import { useContext } from 'react'
import { isEmpty } from 'lodash'

const usePlayerContext = () => {
  const context = useContext(PlayerContext)
  if (isEmpty(context)) {
    throw Error('usePlayerContext must be used inside PlayerContext')
  }

  return context
}

export default usePlayerContext
