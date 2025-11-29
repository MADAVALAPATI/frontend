# Backend Setup and Installation Guide

## ✅ Complete Backend Created Successfully

Your backend is now fully set up with MongoDB integration using the provided connection string.

## 📁 Backend Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection configuration
├── models/
│   ├── User.js                  # User schema with authentication
│   ├── Workshop.js              # Workshop catalog schema
│   ├── Registration.js          # Workshop registration tracking
│   └── Feedback.js              # User feedback and reviews
├── controllers/
│   ├── authController.js        # Login, register, user profile
│   ├── workshopController.js    # Workshop CRUD operations
│   ├── registrationController.js # Registration management
│   ├── feedbackController.js    # Feedback operations
│   └── adminController.js       # Admin dashboard & analytics
├── routes/
│   ├── auth.js                  # Authentication endpoints
│   ├── workshops.js             # Workshop endpoints
│   ├── registrations.js         # Registration endpoints
│   ├── feedback.js              # Feedback endpoints
│   └── admin.js                 # Admin endpoints
├── middleware/
│   ├── auth.js                  # JWT authentication & authorization
│   └── errorHandler.js          # Global error handling
├── utils/                       # Utility functions (expandable)
├── .env                         # Environment variables (configured)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies installed
├── server.js                    # Main server entry point
├── testConnection.js            # MongoDB connection tester
└── README.md                    # API documentation
```

## 🗄️ Database Configuration

**MongoDB Connection String (Encoded):**
```
mongodb+srv://workshop:Kl%402400030014@cluster0.glsdppd.mongodb.net/fedproject?appName=Cluster0
```

**Database Name:** `fedproject`
**Cluster:** `cluster0.glsdppd.mongodb.net`
**Username:** `workshop`

## 📦 Installed Dependencies

```json
{
  "express": "^4.18.2",           // Web framework
  "mongoose": "^7.5.0",           // MongoDB ODM
  "bcryptjs": "^2.4.3",           // Password hashing
  "jsonwebtoken": "^9.0.2",       // JWT authentication
  "dotenv": "^16.3.1",            // Environment variables
  "cors": "^2.8.5",               // Cross-origin requests
  "validator": "^13.11.0",        // Input validation
  "express-async-errors": "^3.1.1", // Async error handling
  "multer": "^1.4.5-lts.1",       // File uploads
  "mongodb": "^6.3.0",            // MongoDB driver
  "nodemon": "^3.0.2"             // Development server reload
}
```

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
cd backend
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on: **http://localhost:5000**

### Test MongoDB Connection
```bash
node testConnection.js
```

## 🔑 Environment Variables (.env)

```env
MONGODB_URI=mongodb+srv://workshop:Kl%402400030014@cluster0.glsdppd.mongodb.net/fedproject?appName=Cluster0
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

## 📡 API Endpoints Overview

### 1. Authentication (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Login and get JWT token
- `GET /me` - Get current user profile (protected)

### 2. Workshops (`/api/workshops`)
- `GET /` - List all workshops (with filters)
- `GET /:id` - Get workshop details
- `POST /` - Create new workshop (instructor/admin)
- `PUT /:id` - Update workshop (instructor/admin)
- `DELETE /:id` - Delete workshop (instructor/admin)
- `POST /:id/reviews` - Add review to workshop

### 3. Registrations (`/api/registrations`)
- `POST /` - Register user for workshop
- `GET /user` - Get user's registrations
- `GET /workshop/:workshopId` - Get workshop registrations (instructor/admin)
- `DELETE /:id` - Cancel registration
- `PUT /:id/status` - Update registration status

### 4. Feedback (`/api/feedback`)
- `POST /` - Submit feedback for workshop
- `GET /workshop/:workshopId` - Get workshop feedback
- `GET /admin/all` - Get all feedback (admin)
- `PUT /:id/approve` - Approve feedback (admin)
- `DELETE /:id` - Delete feedback

### 5. Admin (`/api/admin`)
- `GET /dashboard` - Dashboard statistics
- `GET /users` - Get all users
- `PUT /users/:id/status` - Change user status
- `PUT /users/:id/role` - Change user role
- `DELETE /users/:id` - Delete user
- `GET /analytics` - Get analytics data

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to Use Protected Endpoints:

1. **Register/Login** to get a token
2. **Include the token** in request headers:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### User Roles:
- **student** - Can register for workshops, leave feedback
- **instructor** - Can create/manage workshops
- **admin** - Full system access

## 📊 Database Schemas

### User Schema
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: String (student|instructor|admin),
  phone: String,
  bio: String,
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Workshop Schema
```javascript
{
  title: String,
  description: String,
  category: String,
  instructor: ObjectId (ref: User),
  startDate: Date,
  endDate: Date,
  duration: Number,
  maxParticipants: Number,
  currentParticipants: Number,
  price: Number,
  location: String,
  image: String,
  materials: Array,
  status: String (draft|published|completed|cancelled),
  rating: Number,
  reviews: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Registration Schema
```javascript
{
  userId: ObjectId (ref: User),
  workshopId: ObjectId (ref: Workshop),
  registrationDate: Date,
  status: String (registered|attended|completed|cancelled),
  paymentStatus: String (pending|completed|failed),
  paymentAmount: Number,
  certificateUrl: String,
  attendanceRecord: Boolean,
  notes: String
}
```

### Feedback Schema
```javascript
{
  userId: ObjectId (ref: User),
  workshopId: ObjectId (ref: Workshop),
  rating: Number (1-5),
  comment: String,
  categories: {
    contentQuality: Number,
    instructorQuality: Number,
    courseOrganization: Number,
    overallExperience: Number
  },
  isAnonymous: Boolean,
  approved: Boolean,
  createdAt: Date
}
```

## 🔗 Frontend Integration

Update your frontend API calls to point to the backend:

```javascript
// Example: Registering a user
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

## ⚙️ Configuration for Production

Before deploying:

1. **Update JWT_SECRET** in `.env` with a strong random key
2. **Set NODE_ENV** to `production`
3. **Configure CORS** origins in `server.js`
4. **Use environment-specific** MongoDB connections
5. **Enable HTTPS** on your server
6. **Add rate limiting** for API protection
7. **Set up proper logging** and monitoring
8. **Enable database backups** on MongoDB Atlas

## 🧪 Testing the API

Use Postman or cURL to test endpoints:

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

Common error codes:
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Server Error

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string is URL encoded
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure database credentials are correct

### Port Already in Use
```bash
# Find and kill process on port 5000
# Windows: Check Task Manager or use:
Get-NetTCPConnection -LocalPort 5000
```

### Dependencies Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -r node_modules
npm install
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [CORS Documentation](https://enable-cors.org/)

## ✨ Next Steps

1. **Start the server**: `npm run dev`
2. **Test MongoDB connection**: `node testConnection.js`
3. **Integrate with frontend**: Update API endpoints in React
4. **Add more features**: Extend models and routes as needed
5. **Deploy**: Choose hosting (Heroku, AWS, DigitalOcean, etc.)

---

**Backend Status:** ✅ **READY TO USE**

Your complete backend with MongoDB database is set up and ready to connect with your React frontend!
