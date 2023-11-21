import { v2 as cloudinaryV2 } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinaryV2.config({
  secure: true,
});

export default cloudinaryV2;
