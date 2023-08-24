import { useAuthContext } from './'

export const useLogout = () => {
  const { updateUser } = useAuthContext()

  const logout = () => {
    localStorage.removeItem('user')
    updateUser(null)
  }

  return { logout }
}
export default useLogout
