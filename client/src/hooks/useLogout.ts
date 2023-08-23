import { LOGOUT } from '../utils/constants'
import { useAuthContext } from './'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    localStorage.removeItem('user')

    dispatch({ type: LOGOUT })
  }

  return { logout }
}
