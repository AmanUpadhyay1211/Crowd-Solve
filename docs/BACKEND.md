# CrowdSolve - Backend API Documentation

## Overview

The CrowdSolve backend is built using Next.js 14 API Routes with MongoDB as the database and Cloudinary for file storage. All APIs follow RESTful conventions and use JWT-based authentication.

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a valid JWT token in an httpOnly cookie named `token`.

### Authentication Flow
1. User logs in via `/api/auth/login`
2. Server returns JWT token in httpOnly cookie
3. Subsequent requests automatically include the token
4. Server validates token on protected routes

---

## API Endpoints

### Authentication APIs

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-30 chars, unique)",
  "email": "string (valid email, unique)",
  "password": "string (min 6 chars)"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "reputation": 0,
    "createdAt": "string"
  }
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error
- `409` - Username/email already exists
- `500` - Server error

**Usage in Frontend:**
```typescript
// components/auth-provider.tsx
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, email, password }),
})
```

---

#### POST `/api/auth/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "reputation": 0
  }
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `500` - Server error

**Usage in Frontend:**
```typescript
// lib/hooks/use-auth.ts
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})
```

---

#### POST `/api/auth/logout`
Logout user and clear session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**
- `200` - Logout successful
- `500` - Server error

---

#### GET `/api/auth/me`
Get current authenticated user information.

**Headers:**
- Cookie: `token=your-jwt-token`

**Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "bio": "string",
    "avatar": "string",
    "reputation": 0,
    "createdAt": "string"
  }
}
```

**Status Codes:**
- `200` - User found
- `401` - Not authenticated
- `500` - Server error

**Usage in Frontend:**
```typescript
// lib/hooks/use-auth.ts
const response = await fetch("/api/auth/me")
if (response.ok) {
  const data = await response.json()
  setUser(data.user)
}
```

---

### Problem APIs

#### GET `/api/problems`
Get paginated list of problems with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (`open`, `solved`, `closed`)
- `tag` (optional): Filter by tag
- `search` (optional): Search in title and description

**Response:**
```json
{
  "problems": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "images": ["string"],
      "tags": ["string"],
      "location": "string",
      "status": "open|solved|closed",
      "views": 0,
      "author": {
        "id": "string",
        "username": "string",
        "avatar": "string",
        "reputation": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

**Usage in Frontend:**
```typescript
// components/problem-list.tsx
const fetchProblems = async () => {
  const response = await fetch("/api/problems?page=1&limit=10")
  const data = await response.json()
  setProblems(data.problems)
}
```

---

#### POST `/api/problems`
Create a new problem.

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `application/json`

**Request Body:**
```json
{
  "title": "string (10-200 chars)",
  "description": "string (min 20 chars)",
  "images": ["string"] (optional),
  "tags": ["string"] (optional),
  "location": "string" (optional)
}
```

**Response:**
```json
{
  "problem": {
    "id": "string",
    "title": "string",
    "description": "string",
    "images": ["string"],
    "tags": ["string"],
    "location": "string",
    "status": "open",
    "views": 0,
    "author": {
      "id": "string",
      "username": "string",
      "avatar": "string",
      "reputation": 0
    },
    "createdAt": "string"
  }
}
```

**Status Codes:**
- `201` - Problem created successfully
- `400` - Validation error
- `401` - Not authenticated
- `500` - Server error

---

#### GET `/api/problems/[id]`
Get detailed information about a specific problem.

**Response:**
```json
{
  "problem": {
    "id": "string",
    "title": "string",
    "description": "string",
    "images": ["string"],
    "tags": ["string"],
    "location": "string",
    "status": "open|solved|closed",
    "views": 0,
    "author": {
      "id": "string",
      "username": "string",
      "avatar": "string",
      "reputation": 0
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Status Codes:**
- `200` - Problem found
- `404` - Problem not found
- `500` - Server error

---

#### PATCH `/api/problems/[id]`
Update a problem (author only).

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `application/json`

**Request Body:**
```json
{
  "title": "string" (optional),
  "description": "string" (optional),
  "images": ["string"] (optional),
  "tags": ["string"] (optional),
  "location": "string" (optional),
  "status": "open|solved|closed" (optional)
}
```

**Response:**
```json
{
  "problem": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "updatedAt": "string"
  }
}
```

**Status Codes:**
- `200` - Problem updated successfully
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not authorized (not the author)
- `404` - Problem not found
- `500` - Server error

---

### Solution APIs

#### GET `/api/problems/[id]/solutions`
Get all solutions for a specific problem.

**Response:**
```json
{
  "solutions": [
    {
      "id": "string",
      "content": "string",
      "images": ["string"],
      "upvotes": 0,
      "downvotes": 0,
      "isAccepted": false,
      "author": {
        "id": "string",
        "username": "string",
        "avatar": "string",
        "reputation": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Usage in Frontend:**
```typescript
// components/problem-detail.tsx
const fetchSolutions = async (problemId: string) => {
  const response = await fetch(`/api/problems/${problemId}/solutions`)
  const data = await response.json()
  setSolutions(data.solutions)
}
```

---

#### POST `/api/problems/[id]/solutions`
Create a new solution for a problem.

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `application/json`

**Request Body:**
```json
{
  "content": "string (min 10 chars)",
  "images": ["string"] (optional)
}
```

**Response:**
```json
{
  "solution": {
    "id": "string",
    "content": "string",
    "images": ["string"],
    "upvotes": 0,
    "downvotes": 0,
    "isAccepted": false,
    "author": {
      "id": "string",
      "username": "string",
      "avatar": "string",
      "reputation": 0
    },
    "createdAt": "string"
  }
}
```

**Status Codes:**
- `201` - Solution created successfully
- `400` - Validation error
- `401` - Not authenticated
- `404` - Problem not found
- `500` - Server error

---

#### GET `/api/solutions/[id]`
Get detailed information about a specific solution.

**Response:**
```json
{
  "solution": {
    "id": "string",
    "content": "string",
    "images": ["string"],
    "upvotes": 0,
    "downvotes": 0,
    "isAccepted": false,
    "problem": {
      "id": "string",
      "title": "string"
    },
    "author": {
      "id": "string",
      "username": "string",
      "avatar": "string",
      "reputation": 0
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

#### PATCH `/api/solutions/[id]`
Update a solution (author only).

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `application/json`

**Request Body:**
```json
{
  "content": "string" (optional),
  "images": ["string"] (optional)
}
```

**Response:**
```json
{
  "solution": {
    "id": "string",
    "content": "string",
    "images": ["string"],
    "updatedAt": "string"
  }
}
```

**Status Codes:**
- `200` - Solution updated successfully
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not authorized (not the author)
- `404` - Solution not found
- `500` - Server error

---

#### DELETE `/api/solutions/[id]`
Delete a solution (author only).

**Headers:**
- Cookie: `token=your-jwt-token`

**Response:**
```json
{
  "message": "Solution deleted successfully"
}
```

**Status Codes:**
- `200` - Solution deleted successfully
- `401` - Not authenticated
- `403` - Not authorized (not the author)
- `404` - Solution not found
- `500` - Server error

---

#### POST `/api/solutions/[id]/vote`
Vote on a solution (upvote or downvote).

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `application/json`

**Request Body:**
```json
{
  "type": "upvote|downvote"
}
```

**Response:**
```json
{
  "solution": {
    "id": "string",
    "upvotes": 0,
    "downvotes": 0
  },
  "userVote": "upvote|downvote|null"
}
```

**Status Codes:**
- `200` - Vote recorded successfully
- `400` - Invalid vote type
- `401` - Not authenticated
- `404` - Solution not found
- `500` - Server error

**Usage in Frontend:**
```typescript
// components/solution-card.tsx
const handleVote = async (solutionId: string, type: 'upvote' | 'downvote') => {
  const response = await fetch(`/api/solutions/${solutionId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  })
}
```

---

#### POST `/api/solutions/[id]/accept`
Accept a solution (problem author only).

**Headers:**
- Cookie: `token=your-jwt-token`

**Response:**
```json
{
  "solution": {
    "id": "string",
    "isAccepted": true
  },
  "problem": {
    "id": "string",
    "status": "solved"
  }
}
```

**Status Codes:**
- `200` - Solution accepted successfully
- `401` - Not authenticated
- `403` - Not authorized (not the problem author)
- `404` - Solution not found
- `500` - Server error

---

### User APIs

#### GET `/api/users/[username]`
Get user profile with problems, solutions, and statistics.

**Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "bio": "string",
    "avatar": "string",
    "reputation": 0,
    "createdAt": "string"
  },
  "problems": [
    {
      "id": "string",
      "title": "string",
      "status": "string",
      "views": 0,
      "createdAt": "string"
    }
  ],
  "solutions": [
    {
      "id": "string",
      "content": "string",
      "upvotes": 0,
      "isAccepted": false,
      "problem": {
        "title": "string"
      },
      "createdAt": "string"
    }
  ],
  "stats": {
    "problemCount": 0,
    "solutionCount": 0,
    "acceptedSolutionCount": 0
  }
}
```

**Usage in Frontend:**
```typescript
// components/user-profile.tsx
const fetchUserProfile = async (username: string) => {
  const response = await fetch(`/api/users/${username}`)
  const data = await response.json()
  setUser(data.user)
  setProblems(data.problems)
  setSolutions(data.solutions)
  setStats(data.stats)
}
```

---

#### PATCH `/api/users/profile`
Update current user's profile.

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `application/json`

**Request Body:**
```json
{
  "bio": "string" (optional, max 500 chars)
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "bio": "string",
    "avatar": "string",
    "reputation": 0,
    "updatedAt": "string"
  }
}
```

**Status Codes:**
- `200` - Profile updated successfully
- `400` - Validation error
- `401` - Not authenticated
- `500` - Server error

---

#### POST `/api/users/avatar`
Upload user avatar image.

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `multipart/form-data`

**Request Body:**
```
FormData with field "avatar" containing image file
```

**Response:**
```json
{
  "message": "Avatar updated successfully",
  "user": {
    "id": "string",
    "username": "string",
    "avatar": "string",
    "updatedAt": "string"
  }
}
```

**Status Codes:**
- `200` - Avatar updated successfully
- `400` - Invalid file type or size
- `401` - Not authenticated
- `500` - Upload failed

**File Requirements:**
- **Types**: JPEG, PNG, WebP, GIF
- **Max Size**: 2MB
- **Storage**: Cloudinary

---

#### DELETE `/api/users/avatar`
Remove user avatar.

**Headers:**
- Cookie: `token=your-jwt-token`

**Response:**
```json
{
  "message": "Avatar removed successfully",
  "user": {
    "id": "string",
    "username": "string",
    "avatar": null,
    "updatedAt": "string"
  }
}
```

**Status Codes:**
- `200` - Avatar removed successfully
- `401` - Not authenticated
- `500` - Server error

---

### File Upload APIs

#### POST `/api/upload`
Upload images to Cloudinary.

**Headers:**
- Cookie: `token=your-jwt-token`
- Content-Type: `multipart/form-data`

**Request Body:**
```
FormData with field "files" containing image files
```

**Response:**
```json
{
  "urls": ["string", "string"]
}
```

**Status Codes:**
- `200` - Upload successful
- `400` - Invalid file type or size
- `401` - Not authenticated
- `500` - Upload failed

**File Requirements:**
- **Types**: JPEG, PNG, WebP, GIF
- **Max Size**: 5MB per file
- **Storage**: Cloudinary folder "crowdsolve/problems"

**Usage in Frontend:**
```typescript
// components/image-upload.tsx
const uploadImages = async (files: File[]) => {
  const formData = new FormData()
  files.forEach(file => formData.append("files", file))
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
  
  const data = await response.json()
  return data.urls
}
```

---

### Admin APIs

#### GET `/api/admin/stats`
Get platform statistics (admin only).

**Headers:**
- Cookie: `token=your-jwt-token`

**Response:**
```json
{
  "stats": {
    "totalUsers": 0,
    "totalProblems": 0,
    "totalSolutions": 0,
    "solvedProblems": 0,
    "openProblems": 0
  },
  "recentProblems": [
    {
      "id": "string",
      "title": "string",
      "author": {
        "username": "string"
      },
      "createdAt": "string"
    }
  ],
  "recentSolutions": [
    {
      "id": "string",
      "content": "string",
      "author": {
        "username": "string"
      },
      "problem": {
        "title": "string"
      },
      "createdAt": "string"
    }
  ],
  "topUsers": [
    {
      "username": "string",
      "avatar": "string",
      "reputation": 0
    }
  ]
}
```

**Status Codes:**
- `200` - Stats retrieved successfully
- `401` - Not authenticated
- `500` - Server error

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message description"
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Error Handling in Frontend
```typescript
try {
  const response = await fetch("/api/endpoint")
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Request failed")
  }
  const data = await response.json()
  // Handle success
} catch (error) {
  // Handle error
  console.error("API Error:", error.message)
}
```

---

## Rate Limiting

Currently, there are no explicit rate limits implemented, but they should be added for production:

### Recommended Limits
- **Authentication**: 5 attempts per minute per IP
- **File Upload**: 10 uploads per minute per user
- **General API**: 100 requests per minute per user

### Implementation
```typescript
// Future implementation with Redis
const rateLimit = new Map()

const checkRateLimit = (key: string, limit: number, window: number) => {
  const now = Date.now()
  const userRequests = rateLimit.get(key) || []
  const validRequests = userRequests.filter((time: number) => now - time < window)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimit.set(key, validRequests)
  return true
}
```

---

## Database Models

### User Model
```typescript
interface IUser {
  username: string (unique, 3-30 chars)
  email: string (unique, valid email)
  password: string (hashed with bcrypt)
  bio?: string (max 500 chars)
  avatar?: string (Cloudinary URL)
  reputation: number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

### Problem Model
```typescript
interface IProblem {
  title: string (10-200 chars)
  description: string (min 20 chars)
  images: string[] (Cloudinary URLs)
  tags: string[]
  location?: string
  status: "open" | "solved" | "closed" (default: "open")
  views: number (default: 0)
  author: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Solution Model
```typescript
interface ISolution {
  content: string (min 10 chars)
  images: string[] (Cloudinary URLs)
  upvotes: number (default: 0)
  downvotes: number (default: 0)
  isAccepted: boolean (default: false)
  problem: ObjectId (ref: Problem)
  author: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Vote Model
```typescript
interface IVote {
  user: ObjectId (ref: User)
  solution: ObjectId (ref: Solution)
  type: "upvote" | "downvote"
  createdAt: Date
}
```

---

## Security Considerations

### 1. Input Validation
- All inputs are validated on the server side
- File uploads are validated for type and size
- SQL injection is prevented by using Mongoose ODM

### 2. Authentication Security
- JWT tokens are stored in httpOnly cookies
- Passwords are hashed with bcrypt and salt
- Tokens expire after 7 days

### 3. File Upload Security
- File type validation (whitelist approach)
- File size limits
- Direct upload to Cloudinary (no server storage)

### 4. CORS Configuration
- CORS is handled by Next.js
- Only same-origin requests are allowed by default

This backend API provides a complete foundation for the CrowdSolve platform with proper authentication, data validation, and error handling.
