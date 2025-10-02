# CrowdSolve

A community-driven problem-solving platform where users can post real-world problems and collaborate to find practical solutions.

## Features

- 🔐 **Authentication** - Secure JWT-based auth with httpOnly cookies
- 📝 **Problem Posting** - Share problems with images, descriptions, tags, and location
- 💡 **Solutions** - Propose and discuss solutions to community problems
- 🗳️ **Voting System** - Upvote/downvote solutions to surface the best answers
- ✅ **Accepted Solutions** - Mark solutions as accepted (similar to Stack Overflow)
- 👤 **User Profiles** - Track reputation, problems posted, and solutions provided
- 🎨 **Modern UI** - Dark/light mode with smooth animations
- 📱 **Responsive** - Mobile-first design that works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Image Storage**: Cloudinary
- **Authentication**: JWT with jose
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account for image hosting

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/crowdsolve
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crowdsolve

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
\`\`\`

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd crowdsolve
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your MongoDB URI, JWT secret, and Cloudinary credentials

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
crowdsolve/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth routes (login, register)
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── problems/       # Problem CRUD operations
│   │   ├── solutions/      # Solution operations
│   │   ├── upload/         # Image upload endpoint
│   │   └── users/          # User profile endpoints
│   ├── problems/           # Problem pages
│   ├── profile/            # User profile pages
│   ├── settings/           # User settings
│   └── admin/              # Admin dashboard
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
├── lib/                     # Utilities and configurations
│   ├── models/             # Mongoose models
│   ├── hooks/              # Custom React hooks
│   ├── auth.ts             # Auth utilities
│   ├── cloudinary.ts       # Cloudinary config
│   └── mongodb.ts          # MongoDB connection
└── public/                  # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - List all problems (with filters)
- `POST /api/problems` - Create new problem
- `GET /api/problems/[id]` - Get problem details
- `PUT /api/problems/[id]` - Update problem
- `DELETE /api/problems/[id]` - Delete problem

### Solutions
- `GET /api/problems/[id]/solutions` - Get solutions for a problem
- `POST /api/problems/[id]/solutions` - Create solution
- `PUT /api/solutions/[id]` - Update solution
- `DELETE /api/solutions/[id]` - Delete solution
- `POST /api/solutions/[id]/vote` - Vote on solution
- `POST /api/solutions/[id]/accept` - Accept solution

### Users
- `GET /api/users/[username]` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## Image Upload Flow

1. User selects image in the browser
2. Image is uploaded to `/api/upload` endpoint
3. Server saves image temporarily to `/tmp` directory
4. Image is uploaded to Cloudinary
5. Temporary file is deleted
6. Cloudinary URL is returned to client
7. URL is stored in database with problem/solution

## Database Models

### User
- username, email, password (hashed)
- bio, avatar, location
- reputation points
- timestamps

### Problem
- title, description, tags
- images (Cloudinary URLs)
- location
- author reference
- view count, status
- timestamps

### Solution
- content, images
- problem reference, author reference
- vote count, accepted status
- timestamps

### Vote
- user reference, solution reference
- vote type (upvote/downvote)
- timestamps

## Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@crowdsolve.com or open an issue in the repository.
