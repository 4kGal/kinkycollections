import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { isEmpty } from 'lodash'

const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (isEmpty(context)) {
    throw Error('useAuthContext must be used inside AuthContext')
  }

  return context
}
export default useAuthContext
