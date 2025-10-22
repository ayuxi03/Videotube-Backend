# 🎬 Videotube Backend

**Videotube** is a backend REST API for a video sharing platform (YouTube inspired) built using **Node.js**, **Express.js**, and **MongoDB**.  
It provides all core backend functionalities like user authentication, video management, subscriptions, likes, comments, tweets and channel analytics.

---

## Features

### Authentication
- Register, login, and logout users  
- Passwords securely hashed with **bcrypt**
- JWT-based authentication system   
- Cookie support with **cookie-parser**

### Video Management
- Upload, update, and delete videos  
- Cloud storage integration via **Cloudinary**  
- Thumbnails and metadata management  
- Public/private video visibility

### Engagement System
- Like and unlike videos  
- Subscribe/unsubscribe to channels  
- Comment and reply system  
- Create tweet-like posts  
- View tracking and analytics

### Channel Dashboard
- Fetch total videos, subscribers, likes, and views  
- Summary statistics per user/channel  
- Real-time data from MongoDB aggregation

### Utility Features
- Centralized error and success responses using `ApiError` and `ApiResponse`  
- Async error handling middleware  
- Health check endpoint for API status  
- Environment variable configuration via `.env`

---

## Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Language** | JavaScript (ES6+) |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT, bcrypt |
| **Cloud Storage** | Cloudinary |
| **Utilities** | Multer, dotenv, nodemon |
| **Testing Tools** | Postman |

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ayuxi03/videotube-backend.git
cd videotube-backend
```

### 2. Install dependencies, set up `.env`, and start the server:
```bash
npm install
npm run dev
```

---

## Testing
Use Postman to try out the API routes for login, upload, likes, etc.

---

## Contribution
Contributions to the project are welcome! If you have suggestions or find any issues, please open an issue or submit a pull request.