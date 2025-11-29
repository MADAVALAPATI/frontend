# WorkNest Backend

A comprehensive backend API for the WorkNest workshop management platform built with Express.js, MongoDB, and Node.js.

## Features

- **Authentication & Authorization** - JWT-based authentication with role-based access control
- **User Management** - User registration, login, and profile management
- **Workshop Management** - Create, update, delete, and browse workshops
- **Registrations** - Handle workshop registrations and cancellations
- **Feedback System** - Collect and manage user feedback on workshops
- **Admin Dashboard** - Analytics, user management, and system statistics
- **Error Handling** - Comprehensive error handling and validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, CORS enabled
- **Development**: Nodemon for hot reload

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection setup
├── models/
│   ├── User.js               # User schema
│   ├── Workshop.js           # Workshop schema
│   ├── Registration.js       # Registration schema
│   └── Feedback.js           # Feedback schema
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── workshopController.js # Workshop operations
│   ├── registrationController.js  # Registration operations
│   ├── feedbackController.js      # Feedback operations
│   └── adminController.js    # Admin operations
├── routes/
│   ├── auth.js               # Auth routes
│   ├── workshops.js          # Workshop routes
│   ├── registrations.js      # Registration routes
│   ├── feedback.js           # Feedback routes
│   └── admin.js              # Admin routes
├── middleware/
│   ├── auth.js               # Authentication & authorization middleware
│   └── errorHandler.js       # Error handling middleware
├── utils/                    # Utility functions
├── .env                      # Environment variables
├── package.json              # Dependencies
└── server.js                 # Main server file
```

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://workshop:Kl@2400030014@cluster0.glsdppd.mongodb.net/fedproject?appName=Cluster0
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Workshops
- `GET /api/workshops` - Get all workshops
- `GET /api/workshops/:id` - Get single workshop
- `POST /api/workshops` - Create workshop (instructor/admin)
- `PUT /api/workshops/:id` - Update workshop (instructor/admin)
- `DELETE /api/workshops/:id` - Delete workshop (instructor/admin)
- `POST /api/workshops/:id/reviews` - Add review to workshop (protected)

### Registrations
- `POST /api/registrations` - Register for workshop (protected)
- `GET /api/registrations/user` - Get user registrations (protected)
- `GET /api/registrations/workshop/:workshopId` - Get workshop registrations (instructor/admin)
- `DELETE /api/registrations/:id` - Cancel registration (protected)
- `PUT /api/registrations/:id/status` - Update registration status (instructor/admin)

### Feedback
- `POST /api/feedback` - Create feedback (protected)
- `GET /api/feedback/workshop/:workshopId` - Get workshop feedback
- `GET /api/feedback/admin/all` - Get all feedback (admin)
- `PUT /api/feedback/:id/approve` - Approve feedback (admin)
- `DELETE /api/feedback/:id` - Delete feedback (protected)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:id/status` - Update user status (admin)
- `PUT /api/admin/users/:id/role` - Update user role (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `GET /api/admin/analytics` - Get analytics data (admin)

## Database Models

### User
- fullName, email, password, role, phone, bio, profileImage, isActive
- Roles: student, instructor, admin

### Workshop
- title, description, category, instructor, startDate, endDate, duration
- maxParticipants, currentParticipants, price, location, image
- materials, status, rating, reviews

### Registration
- userId, workshopId, registrationDate, status, paymentStatus
- paymentAmount, certificateUrl, attendanceRecord

### Feedback
- userId, workshopId, rating, comment, categories
- isAnonymous, approved

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - Token expiration time

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Not found errors
- Duplicate entry errors
- Server errors

All errors return appropriate HTTP status codes with descriptive messages.

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- CORS protection
- Input validation with Mongoose schemas
- Error message sanitization

## Development Notes

- Make sure MongoDB is running and accessible
- Update JWT_SECRET in production
- Configure CORS origins for production
- Use environment-specific configurations
- Never commit .env file to version control

## License

ISC
