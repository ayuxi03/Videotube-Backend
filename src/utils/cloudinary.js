import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    // file has been uploaded successfully
    // console.log("File uploaded successfully on Cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
}

const deleteFromCloudinary = async (imgPath, resourceType) => {
  try {
    if (!imgPath) {
      console.log("No public id passed")
      return null;
    }

    const publicId = imgPath.split("/").pop().split(".")[0];
    
    const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    // console.log("cloudinary delete response: ",response)
    return response;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {result: "error", message: error.message}
  }
}


export {uploadOnCloudinary, deleteFromCloudinary}