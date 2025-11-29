# 🚀 Quick Start Guide - Backend Setup

## ⚡ 5-Minute Quick Start

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start the Server
```bash
npm run dev
```

Server running at: `http://localhost:5000`

### Step 3: Test Connection
```bash
node testConnection.js
```

---

## 📋 Complete Setup Checklist

- ✅ Backend folder structure created
- ✅ MongoDB connection configured with your credentials
- ✅ All dependencies installed
- ✅ Models created (User, Workshop, Registration, Feedback)
- ✅ Controllers implemented for all features
- ✅ Routes configured with authentication
- ✅ Middleware for auth and error handling setup
- ✅ Environment variables configured (.env)
- ✅ Server ready to run

---

## 📁 What Was Created

### Backend Structure
```
backend/
├── config/           → Database configuration
├── models/           → MongoDB schemas
├── controllers/      → Business logic
├── routes/           → API endpoints
├── middleware/       → Auth & error handling
├── .env              → MongoDB credentials
├── package.json      → Dependencies
└── server.js         → Server entry point
```

### Documentation
- `BACKEND_SETUP.md` - Complete setup guide
- `API_TESTING_GUIDE.md` - How to test endpoints
- `backend/README.md` - API documentation

---

## 🔌 API Features

| Feature | Endpoints | Auth Required |
|---------|-----------|----------------|
| **Authentication** | /api/auth | Register, Login |
| **Workshops** | /api/workshops | Browse, Create, Update, Delete |
| **Registrations** | /api/registrations | Register, View, Cancel |
| **Feedback** | /api/feedback | Submit, View, Approve |
| **Admin** | /api/admin | Dashboard, Users, Analytics |

---

## 🗄️ Database Connection

**Connection String (Configured):**
```
mongodb+srv://workshop:Kl%402400030014@cluster0.glsdppd.mongodb.net/fedproject
```

**Database:** `fedproject`
**Collections Auto-Created:**
- users
- workshops
- registrations
- feedbacks

---

## 🔐 Default User Roles

1. **Student** - Browse workshops, register, leave feedback
2. **Instructor** - Create/manage workshops, view registrations
3. **Admin** - Full system access, manage users, analytics

---

## 💡 Testing Endpoints

### Quick Test
```bash
# Get all workshops
curl http://localhost:5000/api/workshops

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "student"
  }'
```

See `API_TESTING_GUIDE.md` for detailed testing examples.

---

## 🎯 Next Steps

1. **Start Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Connect Frontend**
   - Update API base URL in React to `http://localhost:5000/api`
   - Example: `fetch('http://localhost:5000/api/workshops')`

3. **Test Endpoints**
   - Use Postman or curl commands from `API_TESTING_GUIDE.md`

4. **Deploy** (Later)
   - Deploy backend to Heroku, AWS, or DigitalOcean
   - Deploy MongoDB Atlas (already configured)
   - Update frontend API URL

---

## ⚙️ Environment Variables

Located in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://workshop:Kl%402400030014@cluster0.glsdppd.mongodb.net/fedproject?appName=Cluster0
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in .env or kill process on port 5000 |
| MongoDB connection fails | Check internet connection, IP whitelist on MongoDB Atlas |
| Dependencies error | `npm cache clean --force` then `npm install` |
| Module not found | Run `npm install` in backend directory |

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point |
| `config/database.js` | MongoDB connection setup |
| `models/*.js` | Database schemas |
| `controllers/*.js` | Business logic for endpoints |
| `routes/*.js` | API route definitions |
| `middleware/*.js` | Authentication, error handling |
| `.env` | Configuration variables |
| `testConnection.js` | MongoDB connection tester |

---

## 🔗 Frontend Integration Example

```javascript
// React component example
useEffect(() => {
  // Get workshops from backend
  fetch('http://localhost:5000/api/workshops')
    .then(res => res.json())
    .then(data => setWorkshops(data.data))
    .catch(err => console.error(err));
}, []);

// Register for workshop
const handleRegister = async (workshopId) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/registrations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ workshopId })
  });
  const data = await response.json();
  console.log(data);
};
```

---

## 🚀 Ready to Go!

Your backend is **fully configured** and **ready to use**!

```bash
# Start development server
cd backend && npm run dev

# Server URL: http://localhost:5000
# API Base: http://localhost:5000/api
```

**Questions?** Check:
- `BACKEND_SETUP.md` - Detailed setup guide
- `API_TESTING_GUIDE.md` - API documentation
- `backend/README.md` - Complete reference

---

**Happy Coding! 💻**
