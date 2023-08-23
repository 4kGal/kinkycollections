import { GallerySettingsContext } from '../context/GallerySettingsContext'
import { useContext } from 'react'

const useGallerySettingsContext = () => {
  const context = useContext(GallerySettingsContext)
  if (!context) {
    throw Error(
      'useGallerySettingsContext must be used inside GallerySettingsProvider'
    )
  }

  return context
}
export default useGallerySettingsContext
