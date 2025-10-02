# CrowdSolve - Frontend Documentation

## Overview

The CrowdSolve frontend is built with Next.js 14, TypeScript, and modern React patterns. It features a responsive design with dark/light mode support, real-time state management, and a component-based architecture.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner (Toast)

## Project Structure

```
app/
├── (auth)/                 # Auth route group
│   ├── login/page.tsx     # Login page
│   └── register/page.tsx  # Registration page
├── admin/page.tsx         # Admin dashboard
├── api/                   # API routes (see BACKEND.md)
├── globals.css           # Global styles
├── layout.tsx            # Root layout
├── page.tsx              # Home page
├── problems/             # Problem pages
│   ├── [id]/page.tsx    # Problem detail
│   ├── new/page.tsx     # Create problem
│   └── page.tsx         # Problems list
├── profile/              # User profiles
│   └── [username]/page.tsx
├── settings/page.tsx     # User settings
└── solutions/page.tsx    # Solutions list

components/
├── ui/                   # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── admin-dashboard.tsx   # Admin dashboard component
├── auth-provider.tsx     # Auth context provider
├── avatar-upload.tsx     # Avatar upload component
├── image-upload.tsx      # Image upload component
├── navbar.tsx           # Navigation bar
├── problem-detail.tsx   # Problem detail component
├── problem-list.tsx     # Problem list component
├── settings-form.tsx    # Settings form
├── solution-card.tsx    # Solution card component
├── solution-form.tsx    # Solution form component
├── theme-provider.tsx   # Theme context provider
└── user-profile.tsx     # User profile component

lib/
├── hooks/
│   └── use-auth.ts      # Authentication hook
├── models/              # TypeScript interfaces
│   ├── Problem.ts
│   ├── Solution.ts
│   ├── User.ts
│   └── Vote.ts
├── auth.ts              # Auth utilities
├── cloudinary.ts        # Cloudinary config
├── mongodb.ts           # Database connection
└── utils.ts             # Utility functions

hooks/
├── use-mobile.ts        # Mobile detection hook
└── use-toast.ts         # Toast notification hook
```

---

## Core Components

### 1. Layout Components

#### Root Layout (`app/layout.tsx`)
The root layout provides the base structure for all pages.

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Features:**
- Font configuration (Inter)
- Theme provider for dark/light mode
- Authentication provider
- Hydration warning suppression

#### Navbar (`components/navbar.tsx`)
The main navigation component with user authentication state.

```typescript
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      {/* Navigation content */}
    </nav>
  )
}
```

**Features:**
- Responsive design
- User authentication state
- Dropdown menu for user actions
- Logo and navigation links
- Search functionality (placeholder)

**Usage:**
```typescript
// Automatically included in layout
<Navbar />
```

---

### 2. Authentication Components

#### Auth Provider (`components/auth-provider.tsx`)
Context provider for authentication state management.

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth initialization is now handled in the useAuth hook
  return <>{children}</>
}
```

**Features:**
- Simplified provider (auth logic moved to useAuth hook)
- Prevents duplicate API calls
- Centralized auth state management

#### Auth Hook (`lib/hooks/use-auth.ts`)
Zustand-based authentication state management.

```typescript
export function useAuth() {
  const store = useAuthStore()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!store.hasInitialized && !hasFetched.current) {
      hasFetched.current = true
      store.fetchUser()
    }
  }, [store.hasInitialized, store.fetchUser])

  return store
}
```

**Features:**
- JWT-based authentication
- Automatic token refresh
- User state management
- Login/logout functionality
- Prevents infinite API calls

**Usage:**
```typescript
const { user, isAuthenticated, login, logout, isLoading } = useAuth()

// Check authentication
if (isAuthenticated) {
  // User is logged in
}

// Login user
await login(email, password)

// Logout user
await logout()
```

---

### 3. Problem Components

#### Problem List (`components/problem-list.tsx`)
Displays a paginated list of problems with filtering.

```typescript
export function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/problems")
      const data = await response.json()
      setProblems(data.problems)
    } catch (error) {
      console.error("Fetch problems error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  )
}
```

**Features:**
- Pagination support
- Loading states
- Error handling
- Responsive grid layout
- Problem status indicators

#### Problem Detail (`components/problem-detail.tsx`)
Displays detailed problem information with solutions.

```typescript
export function ProblemDetail({ problemId }: { problemId: string }) {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch problem and solutions
  useEffect(() => {
    fetchProblemDetail()
  }, [problemId])

  return (
    <div className="space-y-6">
      {/* Problem content */}
      {/* Solutions list */}
      {/* Solution form */}
    </div>
  )
}
```

**Features:**
- Problem information display
- Solutions list with voting
- Solution creation form
- Author information
- Status management

#### Solution Form (`components/solution-form.tsx`)
Form for creating new solutions.

```typescript
export function SolutionForm({ problemId, onSuccess }: SolutionFormProps) {
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Submit solution
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
    </form>
  )
}
```

**Features:**
- Rich text input
- Image upload support
- Form validation
- Loading states
- Success callbacks

---

### 4. User Components

#### User Profile (`components/user-profile.tsx`)
Displays user profile with statistics and activity.

```typescript
export function UserProfile({ username }: { username: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`)
      const data = await response.json()
      // Update state
    } catch (error) {
      console.error("Fetch user profile error:", error)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Profile header */}
      {/* Statistics */}
      {/* Activity tabs */}
    </main>
  )
}
```

**Features:**
- User information display
- Statistics (problems, solutions, reputation)
- Activity tabs (problems/solutions)
- Responsive design
- Loading states

#### Settings Form (`components/settings-form.tsx`)
Form for updating user profile settings.

```typescript
export function SettingsForm() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [bio, setBio] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Update profile
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Avatar upload */}
          {/* Bio input */}
          {/* Submit button */}
        </form>
      </CardContent>
    </Card>
  )
}
```

**Features:**
- Avatar upload integration
- Bio editing
- Form validation
- Success/error feedback
- Protected route

#### Avatar Upload (`components/avatar-upload.tsx`)
Component for uploading and managing user avatars.

```typescript
export function AvatarUpload({ currentAvatar, username, onAvatarUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const { setUser } = useAuth()

  const handleUpload = async (file: File) => {
    // Upload avatar
  }

  const handleRemove = async () => {
    // Remove avatar
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar display */}
      {/* Upload/remove buttons */}
      {/* File input */}
    </div>
  )
}
```

**Features:**
- File type validation
- Size limits (2MB)
- Cloudinary integration
- Real-time UI updates
- Error handling

---

### 5. Admin Components

#### Admin Dashboard (`components/admin-dashboard.tsx`)
Administrative dashboard with platform statistics.

```typescript
export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentProblems, setRecentProblems] = useState<Problem[]>([])
  const [recentSolutions, setRecentSolutions] = useState<Solution[]>([])
  const [topUsers, setTopUsers] = useState<TopUser[]>([])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      // Update state
    } catch (error) {
      console.error("Fetch stats error:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics cards */}
      {/* Recent activity */}
      {/* Top users */}
    </div>
  )
}
```

**Features:**
- Platform statistics
- Recent activity feed
- Top users by reputation
- Responsive charts
- Real-time data

---

## State Management

### Zustand Store Structure

```typescript
interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  hasInitialized: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}
```

### State Management Patterns

#### 1. Global State (Zustand)
```typescript
// Authentication state
const { user, isAuthenticated, login, logout } = useAuth()
```

#### 2. Local State (useState)
```typescript
// Component-specific state
const [isLoading, setIsLoading] = useState(false)
const [data, setData] = useState(null)
```

#### 3. Server State (Direct API calls)
```typescript
// Direct API calls with loading states
const fetchData = async () => {
  setIsLoading(true)
  try {
    const response = await fetch("/api/endpoint")
    const data = await response.json()
    setData(data)
  } finally {
    setIsLoading(false)
  }
}
```

---

## Routing and Navigation

### App Router Structure

#### Route Groups
- `(auth)` - Authentication routes (login, register)
- `api` - API routes

#### Dynamic Routes
- `[id]` - Dynamic problem IDs
- `[username]` - Dynamic usernames

#### Route Protection
```typescript
// middleware.ts
const protectedRoutes = ["/problems/new", "/settings", "/admin"]
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value
  
  // Check authentication
  let isAuthenticated = false
  if (token) {
    const payload = await verifyToken(token)
    isAuthenticated = !!payload
  }
  
  // Redirect logic
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
  
  return NextResponse.next()
}
```

### Navigation Patterns

#### 1. Programmatic Navigation
```typescript
import { useRouter } from "next/navigation"

const router = useRouter()

// Navigate to page
router.push("/problems")

// Navigate with query params
router.push("/problems?status=open")

// Replace current page
router.replace("/login")
```

#### 2. Link Components
```typescript
import Link from "next/link"

// Basic link
<Link href="/problems">Problems</Link>

// Link with styling
<Link href="/problems">
  <Button variant="ghost">Problems</Button>
</Link>
```

#### 3. Conditional Navigation
```typescript
// Redirect based on auth state
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push("/login")
  }
}, [isAuthenticated, isLoading, router])
```

---

## Styling and Theming

### Tailwind CSS Configuration

#### Custom Classes
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other CSS variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

#### Component Styling
```typescript
// Using Tailwind classes
<div className="flex items-center gap-4 p-4 bg-background border border-border rounded-lg">
  <Avatar className="h-10 w-10" />
  <div className="flex-1">
    <h3 className="font-semibold">{user.username}</h3>
    <p className="text-sm text-muted-foreground">{user.bio}</p>
  </div>
</div>
```

### Theme System

#### Theme Provider
```typescript
// components/theme-provider.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

#### Theme Toggle
```typescript
// Theme toggle component
const { theme, setTheme } = useTheme()

<Button
  variant="outline"
  size="icon"
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
>
  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</Button>
```

---

## Form Handling

### React Hook Form Integration

#### Basic Form
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(20),
  tags: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof formSchema>

export function ProblemForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  })

  const onSubmit = (data: FormData) => {
    // Handle form submission
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

#### Form Validation
```typescript
// Real-time validation
<Input
  {...form.register("title")}
  placeholder="Problem title"
  className={form.formState.errors.title ? "border-destructive" : ""}
/>

{form.formState.errors.title && (
  <p className="text-sm text-destructive">
    {form.formState.errors.title.message}
  </p>
)}
```

---

## Error Handling

### Error Boundaries
```typescript
// Error boundary component
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return <div>Something went wrong. Please refresh the page.</div>
  }

  return <>{children}</>
}
```

### API Error Handling
```typescript
const handleApiCall = async () => {
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
    console.error("API Error:", error)
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  }
}
```

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(false)

const fetchData = async () => {
  setIsLoading(true)
  try {
    // API call
  } finally {
    setIsLoading(false)
  }
}

return (
  <div>
    {isLoading ? (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    ) : (
      // Content
    )}
  </div>
)
```

---

## Performance Optimizations

### 1. Code Splitting
```typescript
// Dynamic imports for heavy components
const AdminDashboard = dynamic(() => import("@/components/admin-dashboard"), {
  loading: () => <div>Loading dashboard...</div>,
})
```

### 2. Image Optimization
```typescript
import Image from "next/image"

<Image
  src={user.avatar || "/placeholder.svg"}
  alt={user.username}
  width={40}
  height={40}
  className="rounded-full"
  priority={false}
/>
```

### 3. Memoization
```typescript
import { memo, useMemo, useCallback } from "react"

// Memoized component
const ProblemCard = memo(({ problem }: { problem: Problem }) => {
  return <div>{/* Component content */}</div>
})

// Memoized calculations
const expensiveValue = useMemo(() => {
  return problems.reduce((acc, problem) => acc + problem.views, 0)
}, [problems])

// Memoized callbacks
const handleClick = useCallback((id: string) => {
  // Handle click
}, [])
```

### 4. Lazy Loading
```typescript
// Lazy load components
const LazyComponent = lazy(() => import("./heavy-component"))

<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

---

## Testing

### Component Testing
```typescript
// Example test with Jest and React Testing Library
import { render, screen, fireEvent } from "@testing-library/react"
import { ProblemCard } from "@/components/problem-card"

test("renders problem card with title", () => {
  const problem = {
    id: "1",
    title: "Test Problem",
    description: "Test Description",
    // ... other props
  }

  render(<ProblemCard problem={problem} />)
  
  expect(screen.getByText("Test Problem")).toBeInTheDocument()
})
```

### Integration Testing
```typescript
// Test API integration
test("fetches problems on mount", async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ problems: [] }),
  })
  
  global.fetch = mockFetch
  
  render(<ProblemList />)
  
  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith("/api/problems")
  })
})
```

---

## Deployment

### Build Process
```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Start production server
pnpm start
```

### Environment Variables
```env
# Frontend environment variables
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Vercel Deployment
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install"
}
```

---

## Best Practices

### 1. Component Design
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error boundaries
- Use semantic HTML elements

### 2. State Management
- Use local state for component-specific data
- Use global state only for shared data
- Implement proper loading and error states
- Avoid prop drilling

### 3. Performance
- Implement proper memoization
- Use dynamic imports for code splitting
- Optimize images and assets
- Monitor bundle size

### 4. Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### 5. Code Quality
- Use ESLint and Prettier
- Write meaningful commit messages
- Implement proper error handling
- Write tests for critical functionality

This frontend documentation provides a comprehensive guide to understanding and working with the CrowdSolve frontend codebase.
