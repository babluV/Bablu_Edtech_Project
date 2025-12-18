# House of Edtech - CRUD Application

A full-featured CRUD (Create, Read, Update, Delete) application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ Create new courses
- ✅ View all courses in a beautiful grid layout
- ✅ Update existing courses
- ✅ Delete courses with confirmation
- ✅ Responsive design with dark mode support
- ✅ Type-safe with TypeScript
- ✅ Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database installed and running

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your PostgreSQL database:

   - Create a database named `edTech` (or update the database name in `.env.local`)
   - The database will be automatically initialized with the required schema on first run

3. Configure environment variables:

   Create a `.env.local` file in the root directory with the following:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=edTech
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── courses/
│   │   │       ├── route.ts          # GET, POST endpoints
│   │   │       └── [id]/route.ts     # GET, PUT, DELETE endpoints
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Main page with CRUD UI
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── CourseList.tsx            # Course listing component
│   │   └── CourseForm.tsx             # Create/Edit form component
│   ├── lib/
│   │   ├── data.ts                   # Database operations
│   │   ├── db.ts                     # PostgreSQL connection pool
│   │   └── schema.sql                # Database schema
│   └── types/
│       └── course.ts                  # TypeScript interfaces
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## API Endpoints

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/[id]` - Get a specific course
- `PUT /api/courses/[id]` - Update a course
- `DELETE /api/courses/[id]` - Delete a course

## Course Model

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: number;
  createdAt: string;
}
```

## Data Storage

The application uses **PostgreSQL** for persistent data storage. All CRUD operations (Create, Read, Update, Delete) are performed directly on the database, ensuring data persistence across server restarts.

### Database Schema

The `courses` table is automatically created on first run with the following structure:

- `id` (VARCHAR) - Primary key
- `title` (VARCHAR) - Course title
- `description` (TEXT) - Course description
- `instructor` (VARCHAR) - Instructor name
- `duration` (VARCHAR) - Course duration
- `price` (DECIMAL) - Course price
- `createdAt` (TIMESTAMP) - Creation timestamp

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

## License

MIT
