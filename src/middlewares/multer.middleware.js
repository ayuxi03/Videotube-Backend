import multer from "multer";

/*
  Multer Setup — Handles file uploads in Node.js
-------------------------------------------------
 - Using `diskStorage` to save files temporarily on the server.
 - Files will be stored inside the `./public/temp` directory.
 - The uploaded file will keep its original name.
*/

const storage = multer.diskStorage({

  /* destination:
    -------------
    - This function defines where to store uploaded files.
    - This function takes `req`, `file`, and a callback `cb`.
    - `cb(null, "./public/temp")` (callback) takes two arguments: error (null if none) and folder path.
    - We're saving them to a local folder called `./public/temp`. */

  destination: function(req, file, cb) {
    cb(null, "./public/temp")
  },
  
  // Filename configuration
  filename: function(req, file, cb) {

  /* 💡 Optional: add unique suffix to avoid duplicate filenames
      - const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      - cb(null, file.fieldname + '-' + uniqueSuffix) */
    
    cb(null, file.originalname) // Keeps original filename
  }
})

/*
  Setting Up Multer Upload
  - `multer({ storage })` initializes Multer with our custom storage options.
  - We can later use `upload.single("fileFieldName")` in our routes to handle single-file uploads.
*/
export const upload = multer({ 
  storage: storage
})

/*
  Multer Storage System - Notes:

  🧠 Why use multer?
     - Express alone cannot parse file uploads.
     - Multer makes it easy to handle and access uploaded files.
     - It can store files temporarily or in memory depending on use case.

  👉 Why use `multer.diskStorage()` instead of default storage?
     - Default storage saves files in memory (RAM), which is temporary.
     - Disk storage keeps files in a specific directory, making them persist longer.

  👉 Why use `file.originalname`?
     - It keeps the original filename, making it recognizable for users.
     - If you want unique names, consider appending `Date.now()` to the filename.

*/