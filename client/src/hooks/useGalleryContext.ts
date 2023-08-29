import { GalleryContext } from '../context/GalleryContext'
import { useContext } from 'react'

const useGalleryContext = () => {
  const context = useContext(GalleryContext)
  if (!context) {
    throw Error('useGalleryContext must be used inside GalleryProvider')
  }

  return context
}
export default useGalleryContext
