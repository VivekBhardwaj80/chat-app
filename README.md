# Chat App

A real-time chat application built with React, Node.js/Express, MongoDB, and Socket.io. Users can chat, send images, and see who is online.

## Features

- Real-time messaging with Socket.io
- Send and receive text and image messages
- Online/offline status of users
- Search users by name or username
- Responsive UI for desktop and mobile
- Authentication with JWT tokens
- Cloud storage for images using Cloudinary

## Tech Stack

- Frontend: React, TailwindCSS
- Backend: Node.js, Express
- Database: MongoDB
- Real-time: Socket.io
- File Storage: Cloudinary

## Project Structure
chatApp/
├─ frontend/ # React frontend
├─ backend/ # Express backend
├─ README.md # Project documentation

## Installation

### Backend

1. Go to backend folder:
2. Install dependencies:  
3. Create a `.env` file with:  

PORT="your port"
MONGO_URI=your_mongodb_uri
CLOUDINARY_URL=your_cloudinary_url
JWT_SECRET=your_jwt_secret

4. Start the server: 


### Frontend

1. Go to frontend folder:  
2. Install dependencies:  
3. Start the frontend: 

The app will run at `http://localhost:5173`.

## Usage

- Register/Login to start chatting  
- Search for other users  
- Send text or image messages  
- See online users  
- Message reactions (emoji support)  

## Future Features

- Group chats  
- Push notifications  
- Dark mode  
- File sharing beyond images