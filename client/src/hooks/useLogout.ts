import { useAuthContext } from './'

export const useLogout = () => {
  const { updateLocalUser } = useAuthContext()

  const logout = () => {
    localStorage.removeItem('user')
    updateLocalUser(null)
  }

  return { logout }
}
export default useLogout
