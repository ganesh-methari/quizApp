# 🔌 Quiz App API Documentation

## Base URL

**Development**: `http://localhost:5000/api`
**Production**: `/api` (relative path)

---

## 📚 Authentication Endpoints

### Register User

**Endpoint**: `POST /api/auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-03-14T10:00:00.000Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing fields or invalid data
- `400 Bad Request`: User already exists

---

### Login User

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate user and get user data

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-03-14T10:00:00.000Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing credentials
- `404 Not Found`: User not found
- `401 Unauthorized`: Invalid password

---

### Get All Users

**Endpoint**: `GET /api/auth/users`

**Description**: Retrieve all users (admin/debugging)

**Response** (200 OK):
```json
{
  "count": 2,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-03-14T10:00:00.000Z"
    }
  ]
}
```

---

## 📝 Quiz Endpoints

### Create Quiz

**Endpoint**: `POST /api/quiz/create`

**Description**: Create a new quiz

**Request Body**:
```json
{
  "title": "JavaScript Basics",
  "description": "Test your JavaScript knowledge",
  "questions": [
    {
      "question": "What is the output of typeof null?",
      "options": ["'null'", "'object'", "'undefined'", "'number'"],
      "correctAnswer": 1,
      "points": 1
    },
    {
      "question": "Which method adds an element to the end of an array?",
      "options": ["push()", "pop()", "shift()", "unshift()"],
      "correctAnswer": 0,
      "points": 1
    }
  ],
  "createdBy": "507f1f77bcf86cd799439011"
}
```

**Response** (201 Created):
```json
{
  "message": "Quiz created successfully",
  "quiz": {
    "_id": "507f191e810c19729de860ea",
    "title": "JavaScript Basics",
    "description": "Test your JavaScript knowledge",
    "questions": [...],
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2025-03-14T10:00:00.000Z",
    "totalPoints": 2
  }
}
```

**Validation Rules**:
- Title: 3-100 characters
- At least 1 question required
- Each question must have at least 2 options
- correctAnswer must be a valid index

---

### Get All Quizzes

**Endpoint**: `GET /api/quiz/all`

**Description**: Retrieve all quizzes

**Response** (200 OK):
```json
{
  "count": 1,
  "quizzes": [
    {
      "_id": "507f191e810c19729de860ea",
      "title": "JavaScript Basics",
      "description": "Test your JavaScript knowledge",
      "questions": [...],
      "category": "general",
      "difficulty": "medium",
      "timesTaken": 0,
      "averageScore": 0,
      "createdAt": "2025-03-14T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Quiz

**Endpoint**: `GET /api/quiz/:id`

**Description**: Retrieve a specific quiz by ID

**Response** (200 OK):
```json
{
  "quiz": {
    "_id": "507f191e810c19729de860ea",
    "title": "JavaScript Basics",
    "description": "Test your JavaScript knowledge",
    "questions": [
      {
        "question": "What is the output of typeof null?",
        "options": ["'null'", "'object'", "'undefined'", "'number'"],
        "correctAnswer": 1,
        "points": 1
      }
    ],
    "category": "general",
    "difficulty": "medium",
    "totalPoints": 2,
    "createdAt": "2025-03-14T10:00:00.000Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Quiz not found

---

### Update Quiz

**Endpoint**: `PUT /api/quiz/:id`

**Description**: Update an existing quiz

**Request Body**:
```json
{
  "title": "JavaScript Basics - Updated",
  "description": "Updated description",
  "questions": [...]
}
```

**Response** (200 OK):
```json
{
  "message": "Quiz updated successfully",
  "quiz": {
    "_id": "507f191e810c19729de860ea",
    "title": "JavaScript Basics - Updated",
    "description": "Updated description",
    "updatedAt": "2025-03-14T11:00:00.000Z"
  }
}
```

---

### Delete Quiz

**Endpoint**: `DELETE /api/quiz/:id`

**Description**: Delete a quiz

**Response** (200 OK):
```json
{
  "message": "Quiz deleted successfully"
}
```

---

### Submit Quiz Answers

**Endpoint**: `POST /api/quiz/:id/submit`

**Description**: Submit answers for a quiz and get results

**Request Body**:
```json
{
  "answers": [1, 0, 2, 3]
}
```

**Response** (200 OK):
```json
{
  "message": "Quiz submitted successfully",
  "score": {
    "correct": 3,
    "total": 4,
    "percentage": 75
  },
  "results": [
    {
      "question": "What is the output of typeof null?",
      "userAnswer": 1,
      "correctAnswer": 1,
      "isCorrect": true
    },
    {
      "question": "Which method adds an element to the end of an array?",
      "userAnswer": 0,
      "correctAnswer": 0,
      "isCorrect": true
    },
    {
      "question": "What does NaN stand for?",
      "userAnswer": 2,
      "correctAnswer": 1,
      "isCorrect": false
    }
  ]
}
```

---

## 🏥 Health Check

### Check API Health

**Endpoint**: `GET /api/health`

**Description**: Check if API and database are running

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2025-03-14T10:00:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

---

## 🔒 Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid password"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Detailed error message (development only)"
}
```

---

## 📝 Data Models

### User Model
```typescript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 6 chars),
  avatar: String (optional),
  role: String ('user' | 'admin', default: 'user'),
  isActive: Boolean (default: true),
  lastLogin: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz Model
```typescript
{
  _id: ObjectId,
  title: String (required, 3-100 chars),
  description: String (optional, max 500 chars),
  questions: Array [
    {
      question: String (required),
      options: Array[String] (min 2),
      correctAnswer: Number (required),
      points: Number (default: 1)
    }
  ] (required, min 1),
  category: String ('general' | 'science' | 'history' | 'technology' | 'sports' | 'other'),
  difficulty: String ('easy' | 'medium' | 'hard'),
  timeLimit: Number (optional, in minutes),
  createdBy: ObjectId (ref: User),
  isPublished: Boolean (default: true),
  timesTaken: Number (default: 0),
  averageScore: Number (0-100, default: 0),
  totalPoints: Number (virtual),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Authentication

Currently using basic authentication (email/password). JWT implementation coming soon.

### To Add JWT Authentication:

1. Install JWT package:
```bash
npm install jsonwebtoken
```

2. Generate token on login:
```javascript
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '30d'
});
```

3. Include token in requests:
```javascript
headers: {
  'Authorization': 'Bearer <token>'
}
```

---

## 📞 Support

For API issues or questions:
- Check server logs in Vercel Dashboard
- Review MongoDB Atlas logs
- Test endpoints using Postman or Thunder Client

---

**Version**: 1.0.0
**Last Updated**: March 2025
