# 🚀 CrowdSolve

<div align="center">

**A community-driven problem-solving platform where users collaborate to find practical solutions to real-world challenges.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://crowd-solve-three.vercel.app) • [Documentation](docs/) • [Report Bug](https://github.com/yourusername/crowdsolve/issues) • [Request Feature](https://github.com/yourusername/crowdsolve/issues)

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**
- **JWT-based authentication** with httpOnly cookies
- **Password hashing** with bcryptjs and salt rounds
- **Route protection** with Next.js middleware
- **Session management** with automatic token refresh

### 📝 **Problem Management**
- **Rich problem posting** with images, descriptions, tags, and location
- **Image upload** with Cloudinary integration (5MB limit)
- **Problem status tracking** (open, solved, closed)
- **Search and filtering** by tags, status, and content
- **View counting** and engagement metrics

### 💡 **Solution System**
- **Collaborative solutions** with voting mechanism
- **Upvote/downvote system** to surface best answers
- **Solution acceptance** (problem author can mark solutions as accepted)
- **Rich text support** with image attachments
- **Real-time vote counting**

### 👤 **User Experience**
- **User profiles** with reputation system
- **Avatar upload** with Cloudinary (2MB limit)
- **Bio and profile customization**
- **Activity tracking** (problems posted, solutions provided)
- **Reputation points** based on community engagement

### 🎨 **Modern UI/UX**
- **Dark/light mode** with system preference detection
- **Responsive design** - mobile-first approach
- **Smooth animations** with Tailwind CSS
- **Accessible components** with shadcn/ui
- **Toast notifications** for user feedback

### 🛠️ **Admin Features**
- **Admin dashboard** with platform statistics
- **User management** and activity monitoring
- **Problem and solution moderation**
- **Analytics and insights**

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner (Toast)

### **Backend**
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with jose
- **File Storage**: Cloudinary
- **Password Hashing**: bcryptjs

### **Development**
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **MongoDB database** (local or MongoDB Atlas)
- **Cloudinary account** for image hosting
- **Git** for version control

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/crowdsolve
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crowdsolve

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
\`\`\`

> **⚠️ Important**: Never commit your `.env.local` file to version control. It contains sensitive information.

## 🚀 Quick Start

### 1. **Clone the Repository**
\`\`\`bash
git clone https://github.com/yourusername/crowdsolve.git
cd crowdsolve
\`\`\`

### 2. **Install Dependencies**
\`\`\`bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
\`\`\`

### 3. **Set Up Environment Variables**
\`\`\`bash
# Copy the example environment file
cp .env.example .env.local

# Edit the file with your credentials
nano .env.local
\`\`\`

### 4. **Run the Development Server**
\`\`\`bash
pnpm dev
# or
npm run dev
# or
yarn dev
\`\`\`

### 5. **Open Your Browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📚 Documentation

For detailed information about the application, please refer to our comprehensive documentation:

### 📖 [Architecture Documentation](docs/ARCHITECTURE.md)
- System architecture and design patterns
- Technology stack decisions
- Security and performance considerations
- Scalability and deployment strategies

### 🔧 [Backend API Documentation](docs/BACKEND.md)
- Complete API reference with examples
- Authentication and authorization flows
- Database models and relationships
- Error handling and validation patterns

### 🎨 [Frontend Documentation](docs/FRONTEND.md)
- Component architecture and usage
- State management with Zustand
- Routing and middleware implementation
- Styling and theming system

> **💡 Tip**: Start with the [Architecture Documentation](docs/ARCHITECTURE.md) to understand the overall system design, then dive into specific areas based on your needs.

## 📁 Project Structure

\`\`\`
crowdsolve/
├── 📁 app/                      # Next.js App Router
│   ├── 📁 (auth)/              # Auth route group
│   │   ├── 📄 login/page.tsx   # Login page
│   │   └── 📄 register/page.tsx # Registration page
│   ├── 📁 api/                 # API Routes
│   │   ├── 📁 auth/            # Authentication endpoints
│   │   ├── 📁 problems/        # Problem CRUD operations
│   │   ├── 📁 solutions/       # Solution operations
│   │   ├── 📁 upload/          # Image upload endpoint
│   │   └── 📁 users/           # User profile endpoints
│   ├── 📁 problems/            # Problem pages
│   ├── 📁 profile/             # User profile pages
│   ├── 📁 settings/            # User settings
│   ├── 📁 admin/               # Admin dashboard
│   ├── 📄 layout.tsx           # Root layout
│   └── 📄 page.tsx             # Home page
├── 📁 components/              # React Components
│   ├── 📁 ui/                  # shadcn/ui components
│   ├── 📄 navbar.tsx           # Navigation bar
│   ├── 📄 problem-list.tsx     # Problem list component
│   ├── 📄 problem-detail.tsx   # Problem detail component
│   ├── 📄 solution-form.tsx    # Solution form component
│   ├── 📄 user-profile.tsx     # User profile component
│   ├── 📄 settings-form.tsx    # Settings form
│   ├── 📄 avatar-upload.tsx    # Avatar upload component
│   └── 📄 admin-dashboard.tsx  # Admin dashboard
├── 📁 docs/                    # Documentation
│   ├── 📄 ARCHITECTURE.md      # System architecture
│   ├── 📄 BACKEND.md           # API documentation
│   └── 📄 FRONTEND.md          # Frontend documentation
├── 📁 lib/                     # Utilities & Configurations
│   ├── 📁 models/              # Mongoose models
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📄 auth.ts              # Auth utilities
│   ├── 📄 cloudinary.ts        # Cloudinary config
│   └── 📄 mongodb.ts           # MongoDB connection
├── 📁 public/                  # Static assets
├── 📄 middleware.ts            # Next.js middleware
└── 📄 package.json             # Dependencies
\`\`\`

## 🔌 API Endpoints

> **📖 For detailed API documentation with examples, see [Backend Documentation](docs/BACKEND.md)**

### 🔐 **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### 📝 **Problems**
- `GET /api/problems` - List all problems (with filters)
- `POST /api/problems` - Create new problem
- `GET /api/problems/[id]` - Get problem details
- `PATCH /api/problems/[id]` - Update problem
- `DELETE /api/problems/[id]` - Delete problem

### 💡 **Solutions**
- `GET /api/problems/[id]/solutions` - Get solutions for a problem
- `POST /api/problems/[id]/solutions` - Create solution
- `GET /api/solutions/[id]` - Get solution details
- `PATCH /api/solutions/[id]` - Update solution
- `DELETE /api/solutions/[id]` - Delete solution
- `POST /api/solutions/[id]/vote` - Vote on solution
- `POST /api/solutions/[id]/accept` - Accept solution

### 👤 **Users**
- `GET /api/users/[username]` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload user avatar
- `DELETE /api/users/avatar` - Remove user avatar

### 📁 **File Upload**
- `POST /api/upload` - Upload images to Cloudinary

### 🛠️ **Admin**
- `GET /api/admin/stats` - Get platform statistics

## 🗄️ Database Models

> **📖 For detailed database schema, see [Backend Documentation](docs/BACKEND.md)**

### 👤 **User**
- `username` - Unique username (3-30 chars)
- `email` - Unique email address
- `password` - Hashed with bcryptjs
- `bio` - User biography (max 500 chars)
- `avatar` - Cloudinary URL
- `reputation` - Community reputation points
- `createdAt`, `updatedAt` - Timestamps

### 📝 **Problem**
- `title` - Problem title (10-200 chars)
- `description` - Detailed description (min 20 chars)
- `images` - Array of Cloudinary URLs
- `tags` - Array of problem tags
- `location` - Optional location string
- `status` - open, solved, or closed
- `views` - View count
- `author` - Reference to User
- `createdAt`, `updatedAt` - Timestamps

### 💡 **Solution**
- `content` - Solution content (min 10 chars)
- `images` - Array of Cloudinary URLs
- `upvotes` - Upvote count
- `downvotes` - Downvote count
- `isAccepted` - Whether solution is accepted
- `problem` - Reference to Problem
- `author` - Reference to User
- `createdAt`, `updatedAt` - Timestamps

### 🗳️ **Vote**
- `user` - Reference to User
- `solution` - Reference to Solution
- `type` - upvote or downvote
- `createdAt` - Timestamp

## 🛠️ Development

### **Available Scripts**
\`\`\`bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm add <pkg>    # Add new dependency
pnpm remove <pkg> # Remove dependency
\`\`\`

### **Code Quality**
- **ESLint** - Code linting and formatting
- **TypeScript** - Strict type checking
- **Prettier** - Code formatting (via ESLint)
- **Git Hooks** - Pre-commit validation (recommended)

### **Development Workflow**
1. Create feature branch: \`git checkout -b feature/amazing-feature\`
2. Make changes and test locally
3. Run linting: \`pnpm lint\`
4. Commit changes: \`git commit -m "Add amazing feature"\`
5. Push to remote: \`git push origin feature/amazing-feature\`
6. Create Pull Request

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy with Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables**
   Set these in your Vercel dashboard:
   \`\`\`env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret
   CLOUDINARY_CLOUD_NAME=your-cloud
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   \`\`\`

### **Other Platforms**
- **Netlify** - Similar to Vercel
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment
- **AWS** - Enterprise deployment

> **📖 For detailed deployment instructions, see [Architecture Documentation](docs/ARCHITECTURE.md#deployment)**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation if needed
4. **Commit your changes**
   \`\`\`bash
   git commit -m "Add amazing feature"
   \`\`\`
5. **Push to your branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
6. **Open a Pull Request**

### **Contribution Guidelines**
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: Check our [comprehensive docs](docs/)
- **Issues**: [Report bugs](https://github.com/yourusername/crowdsolve/issues) or [request features](https://github.com/yourusername/crowdsolve/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/crowdsolve/discussions)
- **Email**: support@crowdsolve.com

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **MongoDB** for the database
- **Cloudinary** for image storage
- **All contributors** who help improve this project

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/crowdsolve?style=social)](https://github.com/yourusername/crowdsolve)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/crowdsolve?style=social)](https://github.com/yourusername/crowdsolve)

Made with ❤️ by the CrowdSolve team

</div>
