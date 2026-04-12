# My Portfolio / Social Media App

A full-stack web application built with React (frontend) and Node.js/Express (backend) with MongoDB.

## Features

- User authentication (register/login)
- Profile management with avatar upload
- Create and manage posts
- Dark mode toggle
- Responsive design
- Admin dashboard
- Contact form

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- CSS for styling
- Dark mode support

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-github-repo-url>
cd my-project
```

2. Install dependencies for both frontend and backend:
```bash
# Root dependencies (if any)
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in the `backend` directory:
```
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-jwt-secret-key
PORT=5000
```

4. Start the development servers:

```bash
# Backend (from backend directory)
npm start
# or with nodemon for development
npx nodemon server.js

# Frontend (from frontend directory)
npm start
```

The app will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```
This creates a `build` folder with the production build.

### Backend
The backend is ready for deployment as is, but ensure environment variables are set in your hosting platform.

## Deployment

### Frontend (Static Hosting)
- **Vercel**: Connect your GitHub repo, set build command to `npm run build` in `frontend` directory
- **Netlify**: Same as above
- **GitHub Pages**: Use `gh-pages` package for deployment

### Backend (Server Hosting)
- **Railway**: Connect GitHub repo, set start command to `node server.js`
- **Render**: Similar to Railway
- **Heroku**: Add a `Procfile` with `web: node server.js`

### Full-Stack Deployment
For full-stack deployment, you can:
1. Deploy backend to a server (Railway, Render, etc.)
2. Deploy frontend to static hosting
3. Update API URLs in frontend to point to deployed backend

## Environment Variables

### Backend (.env)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default 5000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/me/posts` - Get user's posts

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Contact
- `POST /api/contact` - Send contact message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.