// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  
// export const upload = multer({ 
//     storage, 
// })


import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Allowed MIME groups
const allowedMimeTypes = {
  image: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a"],
  video: ["video/mp4", "video/mov", "video/webm", "application/octet-stream"],
  document: ["application/pdf", "application/zip"],
};

// Generic file filter
const fileFilter = (allowedGroups) => (req, file, cb) => {
  const isValid = allowedGroups.some((group) =>
    allowedMimeTypes[group]?.includes(file.mimetype)
  );

  if (isValid) cb(null, true);
  else cb(new Error("File type not allowed"), false);
};

// EXPORT uploaders

// IMAGE ONLY (for profile pics)
export const uploadImage = multer({
  storage,
  fileFilter: fileFilter(["image"]),
});

// AUDIO ONLY (mp3/wav)
export const uploadAudio = multer({
  storage,
  fileFilter: fileFilter(["audio"]),
});

// VIDEO ONLY
export const uploadVideo = multer({
  storage,
  fileFilter: fileFilter(["video"]),
});

// PDF / ZIP documents
export const uploadDocument = multer({
  storage,
  fileFilter: fileFilter(["document"]),
});

// MULTI-TYPE (image + audio + video + pdf + zip)
export const uploadAny = multer({
  storage,
  fileFilter: fileFilter(["image", "audio", "video", "document"]),
});
