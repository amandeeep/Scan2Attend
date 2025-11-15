import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import 'dotenv/config';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;

        const ext = localFilePath.split(".").pop().toLowerCase();
        let resourceType = "auto";
        if (["mp3", "wav", "m4a", "aac"].includes(ext)) {
            resourceType = "video";
        }
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
        })
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return res.secure_url;
    }catch(err){
        console.error("Cloudinary upload error:", err);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
}


export {uploadOnCloudinary}