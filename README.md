# 🏕️ Project-Camp-Website (YelpCamp Inspired)

A full-stack campground web application inspired by **YelpCamp (The Web Developer Bootcamp by Colt Steele - Udemy)**.  
Built while following the course.
---
![Campground](https://res.cloudinary.com/do71ozwtk/image/upload/v1779286968/Project-camp-website_z9agkg.png)
---

## ⚠️ Installation Note

If `npm install` fails due to Cloudinary dependency conflicts, run:

```bash
npm install --legacy-peer-deps
```




## 🌐 Live Features

- User authentication (register/login/logout)
- Create, edit, delete campgrounds
- Upload images (Cloudinary)
- Interactive map (MapTiler)
- Clustering campgrounds on map
- Reviews system with star ratings
- Flash messages for feedback
- Secure sessions with Passport.js
- Input sanitization (MongoDB injection protection)
- Security headers (Helmet)


## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose

### Authentication
- Passport.js
- Passport-Local
- express-session

### Frontend
- EJS templates
- Bootstrap 5
- EJS-Mate layout engine

### APIs / Services
- Cloudinary (image storage)
- MapTiler (maps)

### Security
- Helmet
- express-mongo-sanitize
- custom sanitization middleware

---

### 🗄️ MongoDB Atlas vs Local MongoDB (IMPORTANT)

This project works with **either MongoDB Atlas (cloud database)** or a **local MongoDB installation**.

You only need ONE of the two options below.

---

##  Using MongoDB Atlas (Cloud Database)

If you want to use MongoDB Atlas:

### 1. Create a cluster
Go to: https://www.mongodb.com/atlas

- Create a free cluster
- Create a database user
- Get your connection string

---

### 2. Add Atlas connection string to `.env`


DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/project-camp

---
# env file
You MUST create a .env file in the root of the project and add the following variables:

### MongoDB Database
- DB_URL=mongodb+srv://first-user:<db_password>@cluster0.yxv52jj.mongodb.net/?appName=Cluster0 


### MapTiler API Key (for map rendering)
- MAPTILER_API_KEY=your_maptiler_api_key_here

### Cloudinary (image upload service)
- CLOUDINARY_CLOUD_NAME=your_cloud_name_here
- CLOUDINARY_KEY=your_api_key_here
- CLOUDINARY_SECRET=your_api_secret_here
