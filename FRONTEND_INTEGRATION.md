# Frontend-Backend Integration Guide

This guide helps you integrate your React frontend with the WorkNest backend.

## 🔗 API Configuration

### 1. Create API Configuration File

Create `src/config/api.js`:

```javascript
// API Base URL
export const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_ME: `${API_BASE_URL}/auth/me`,
  
  // Workshops
  GET_WORKSHOPS: `${API_BASE_URL}/workshops`,
  GET_WORKSHOP: (id) => `${API_BASE_URL}/workshops/${id}`,
  CREATE_WORKSHOP: `${API_BASE_URL}/workshops`,
  UPDATE_WORKSHOP: (id) => `${API_BASE_URL}/workshops/${id}`,
  DELETE_WORKSHOP: (id) => `${API_BASE_URL}/workshops/${id}`,
  ADD_REVIEW: (id) => `${API_BASE_URL}/workshops/${id}/reviews`,
  
  // Registrations
  REGISTER_WORKSHOP: `${API_BASE_URL}/registrations`,
  GET_USER_REGISTRATIONS: `${API_BASE_URL}/registrations/user`,
  GET_WORKSHOP_REGISTRATIONS: (id) => `${API_BASE_URL}/registrations/workshop/${id}`,
  CANCEL_REGISTRATION: (id) => `${API_BASE_URL}/registrations/${id}`,
  UPDATE_REGISTRATION_STATUS: (id) => `${API_BASE_URL}/registrations/${id}/status`,
  
  // Feedback
  CREATE_FEEDBACK: `${API_BASE_URL}/feedback`,
  GET_FEEDBACK: (id) => `${API_BASE_URL}/feedback/workshop/${id}`,
  GET_ALL_FEEDBACK: `${API_BASE_URL}/feedback/admin/all`,
  APPROVE_FEEDBACK: (id) => `${API_BASE_URL}/feedback/${id}/approve`,
  DELETE_FEEDBACK: (id) => `${API_BASE_URL}/feedback/${id}`,
  
  // Admin
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  GET_USERS: `${API_BASE_URL}/admin/users`,
  UPDATE_USER_STATUS: (id) => `${API_BASE_URL}/admin/users/${id}/status`,
  UPDATE_USER_ROLE: (id) => `${API_BASE_URL}/admin/users/${id}/role`,
  DELETE_USER: (id) => `${API_BASE_URL}/admin/users/${id}`,
  GET_ANALYTICS: `${API_BASE_URL}/admin/analytics`,
};

// Helper function to make API calls
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};
```

### 2. Update .env.local in Frontend

Create or update `front_work/.env.local`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔐 Authentication Integration

### Update AuthContext

Modify `src/context/AuthContext.jsx`:

```javascript
import React, { createContext, useState, useEffect } from 'react';
import { apiCall, API_ENDPOINTS } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await apiCall(API_ENDPOINTS.GET_ME);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, role = 'student') => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, role }),
      });
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🎓 Workshop Integration

### Get Workshops Example

```javascript
// In any component
import { useEffect, useState } from 'react';
import { apiCall, API_ENDPOINTS } from '../config/api';

export const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const data = await apiCall(API_ENDPOINTS.GET_WORKSHOPS);
      setWorkshops(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {workshops.map(workshop => (
        <div key={workshop._id}>
          <h3>{workshop.title}</h3>
          <p>{workshop.description}</p>
          <p>Instructor: {workshop.instructor.fullName}</p>
          <p>Participants: {workshop.currentParticipants}/{workshop.maxParticipants}</p>
        </div>
      ))}
    </div>
  );
};
```

### Register for Workshop Example

```javascript
const handleRegister = async (workshopId) => {
  try {
    const data = await apiCall(API_ENDPOINTS.REGISTER_WORKSHOP, {
      method: 'POST',
      body: JSON.stringify({ workshopId }),
    });
    alert('Successfully registered for workshop!');
  } catch (err) {
    alert('Registration failed: ' + err.message);
  }
};
```

---

## 💬 Feedback Integration

### Submit Feedback Example

```javascript
const handleSubmitFeedback = async (workshopId, feedback) => {
  try {
    const data = await apiCall(API_ENDPOINTS.CREATE_FEEDBACK, {
      method: 'POST',
      body: JSON.stringify({
        workshopId,
        rating: feedback.rating,
        comment: feedback.comment,
        categories: feedback.categories,
      }),
    });
    alert('Feedback submitted successfully!');
  } catch (err) {
    alert('Error submitting feedback: ' + err.message);
  }
};
```

### Get Feedback Example

```javascript
const fetchFeedback = async (workshopId) => {
  try {
    const data = await apiCall(API_ENDPOINTS.GET_FEEDBACK(workshopId));
    setFeedback(data.data);
  } catch (err) {
    console.error('Error fetching feedback:', err);
  }
};
```

---

## 📊 Admin Integration

### Dashboard Integration

```javascript
import { useEffect, useState } from 'react';
import { apiCall, API_ENDPOINTS } from '../config/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await apiCall(API_ENDPOINTS.ADMIN_DASHBOARD);
      setStats(data.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>No data</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Workshops: {stats.totalWorkshops}</p>
      <p>Total Registrations: {stats.totalRegistrations}</p>
      <p>Total Feedback: {stats.totalFeedback}</p>
    </div>
  );
};
```

---

## 🚨 Error Handling

### Global Error Handler

```javascript
// Create src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.message === 'Invalid token' || error.message === 'No token provided') {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.message === 'Not authorized for this resource') {
    // Show unauthorized message
    console.error('You are not authorized to perform this action');
  } else {
    // Show generic error
    console.error('An error occurred:', error.message);
  }
};
```

---

## 📝 Protected Routes

### Create Protected Route Component

```javascript
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

### Use in Routes

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/AdminDashboard';

<Routes>
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />
</Routes>
```

---

## 🔄 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (default Vite frontend)
- Production frontend URL

If using different port, update `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourfrontend.com']
    : 'http://localhost:YOUR_PORT',
  credentials: true,
}));
```

---

## 📦 Installation Steps

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd front_work
   npm install
   npm run dev
   ```

3. **Update Frontend API Config**
   - Copy configuration from this guide
   - Create `src/config/api.js`

4. **Update AuthContext**
   - Integrate backend API calls

5. **Test Integration**
   - Register new user via frontend
   - Login and verify token
   - Browse workshops from backend
   - Register for workshop

---

## ✅ Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] API configuration file created
- [ ] AuthContext updated with API calls
- [ ] Environment variables configured
- [ ] Can register and login
- [ ] Can fetch workshops
- [ ] Can register for workshops
- [ ] Can submit feedback
- [ ] Admin pages working

---

## 🆘 Troubleshooting

### CORS Error
**Issue:** "No 'Access-Control-Allow-Origin' header"
**Solution:** 
1. Backend is running on port 5000
2. Frontend port is in CORS whitelist
3. Check both servers are running

### 401 Unauthorized
**Issue:** "Invalid token" on protected routes
**Solution:**
1. Token stored in localStorage
2. Token passed in Authorization header
3. Token not expired

### 404 Not Found
**Issue:** "Cannot find endpoint"
**Solution:**
1. Check API_ENDPOINTS URLs match backend routes
2. Verify backend is running
3. Check API base URL configuration

---

## 📚 Additional Resources

- Backend README: `backend/README.md`
- API Testing Guide: `API_TESTING_GUIDE.md`
- Quick Start: `QUICK_START.md`
- Backend Setup: `BACKEND_SETUP.md`

---

**Integration Complete! 🎉**

Your frontend and backend are now ready to work together!
