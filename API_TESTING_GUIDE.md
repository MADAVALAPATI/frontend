# API Testing Guide

This guide helps you test the WorkNest backend API using curl, Postman, or any HTTP client.

## Base URL
```
http://localhost:5000/api
```

## Authentication Workflow

### 1. Register a New User
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

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Workshop Operations

### Get All Workshops
```bash
curl -X GET "http://localhost:5000/api/workshops"

# With filters
curl -X GET "http://localhost:5000/api/workshops?category=Technology&status=published"

# With search
curl -X GET "http://localhost:5000/api/workshops?search=Python"
```

### Get Single Workshop
```bash
curl -X GET http://localhost:5000/api/workshops/65abc123...
```

### Create Workshop (Instructor/Admin)
```bash
curl -X POST http://localhost:5000/api/workshops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Advanced React Patterns",
    "description": "Learn advanced patterns in React development",
    "category": "Technology",
    "startDate": "2024-01-15T09:00:00Z",
    "endDate": "2024-01-15T17:00:00Z",
    "duration": 8,
    "maxParticipants": 30,
    "price": 99.99,
    "location": "Online"
  }'
```

### Update Workshop
```bash
curl -X PUT http://localhost:5000/api/workshops/65abc123... \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Advanced React Patterns - Updated",
    "maxParticipants": 50
  }'
```

### Delete Workshop
```bash
curl -X DELETE http://localhost:5000/api/workshops/65abc123... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Review to Workshop
```bash
curl -X POST http://localhost:5000/api/workshops/65abc123.../reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 5,
    "comment": "Great workshop, learned a lot!"
  }'
```

---

## Registration Operations

### Register for Workshop
```bash
curl -X POST http://localhost:5000/api/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "workshopId": "65abc123..."
  }'
```

### Get User Registrations
```bash
curl -X GET http://localhost:5000/api/registrations/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Workshop Registrations (Instructor/Admin)
```bash
curl -X GET http://localhost:5000/api/registrations/workshop/65abc123... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Cancel Registration
```bash
curl -X DELETE http://localhost:5000/api/registrations/65abc123... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Registration Status
```bash
curl -X PUT http://localhost:5000/api/registrations/65abc123.../status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "attended"
  }'
```

---

## Feedback Operations

### Create Feedback
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "workshopId": "65abc123...",
    "rating": 4,
    "comment": "Good workshop",
    "categories": {
      "contentQuality": 5,
      "instructorQuality": 4,
      "courseOrganization": 4,
      "overallExperience": 4
    },
    "isAnonymous": false
  }'
```

### Get Workshop Feedback
```bash
curl -X GET http://localhost:5000/api/feedback/workshop/65abc123...
```

### Get All Feedback (Admin)
```bash
curl -X GET http://localhost:5000/api/feedback/admin/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Approve Feedback (Admin)
```bash
curl -X PUT http://localhost:5000/api/feedback/65abc123.../approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Feedback
```bash
curl -X DELETE http://localhost:5000/api/feedback/65abc123... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Admin Operations

### Get Dashboard Statistics
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get All Users
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# With filters
curl -X GET "http://localhost:5000/api/admin/users?role=instructor" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Update User Status
```bash
curl -X PUT http://localhost:5000/api/admin/users/65abc123.../status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "isActive": true
  }'
```

### Update User Role
```bash
curl -X PUT http://localhost:5000/api/admin/users/65abc123.../role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "role": "instructor"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/admin/users/65abc123... \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get Analytics
```bash
curl -X GET http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

---

## Using Postman

1. **Create a new collection** for WorkNest API
2. **Set up environment variables:**
   - `base_url` = `http://localhost:5000/api`
   - `token` = `your_jwt_token`

3. **Use variables in requests:**
   - URL: `{{base_url}}/workshops`
   - Header: `Authorization: Bearer {{token}}`

---

## Error Response Examples

### 400 Bad Request
```json
{
  "message": ["fullName is required", "email must be valid"]
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized for this resource"
}
```

### 404 Not Found
```json
{
  "message": "Workshop not found"
}
```

---

## Quick Test Script

Save as `test-api.sh` and run `bash test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# Register user
echo "=== Registering User ==="
REGISTER=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "test123456",
    "role": "student"
  }')

echo $REGISTER | jq .

# Extract token
TOKEN=$(echo $REGISTER | jq -r '.token')
echo "Token: $TOKEN"

# Get current user
echo -e "\n=== Getting Current User ==="
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# Get workshops
echo -e "\n=== Getting Workshops ==="
curl -s -X GET $BASE_URL/workshops | jq .
```

---

## Common Testing Scenarios

### Scenario 1: Complete User Journey
1. Register as student
2. Browse workshops
3. Register for workshop
4. Leave feedback
5. Check registration status

### Scenario 2: Instructor Workflow
1. Register as instructor
2. Create workshop
3. View registrations
4. Update participant status
5. Check analytics

### Scenario 3: Admin Tasks
1. Login as admin
2. View all users
3. Check dashboard stats
4. Approve feedback
5. Manage user roles

---

**Happy Testing! 🚀**
