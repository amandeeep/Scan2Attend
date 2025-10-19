// import { useState, useCallback } from 'react'
// import Cropper from 'react-easy-crop'

// const PhotoCrop = () => {
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     console.log(croppedArea, croppedAreaPixels)
//   }

//   return (
//     <>
//     <div>
        
//     </div>
//     <Cropper
//       image={yourImage}
//       crop={crop}
//       zoom={zoom}
//       aspect={4 / 3}
//       onCropChange={setCrop}
//       onCropComplete={onCropComplete}
//       onZoomChange={setZoom}
//     />
//     </>
//   )
// }

// export default PhotoCrop;


import { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Camera } from 'lucide-react';
const PhotoCrop = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [imageSrc, setImageSrc] = useState(null)

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log('Cropped area:', croppedArea)
    console.log('Cropped pixels:', croppedAreaPixels)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImageSrc(reader.result)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* File input */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Only show Cropper if an image is selected */}
      {imageSrc && (
        <div className="relative w-full max-w-md h-[400px] bg-base-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // square crop for profile pic
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}
    </div>
  )
}

export default PhotoCrop
