# Expense Management System

A full-stack expense management application built with NestJS (backend) and React (frontend).

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Expense Management**: Create, submit, and track expenses
- **Approval Workflow**: Multi-level approval system with configurable rules
- **Multi-currency Support**: Automatic currency conversion using external APIs
- **Receipt Management**: Upload and manage expense receipts
- **Audit Logging**: Complete audit trail for all actions
- **Role-based Access**: Admin, Manager, and Employee roles with different permissions

## Tech Stack

### Backend
- **NestJS**: Node.js framework
- **Prisma**: Database ORM
- **MySQL**: Database
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Multer**: File uploads

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **TanStack Query**: Data fetching
- **Axios**: HTTP client

## Project Structure

```
odoo/
├── expense-backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management
│   │   ├── expenses/        # Expense management
│   │   ├── approvals/       # Approval workflow
│   │   ├── audit/           # Audit logging
│   │   ├── fx/              # Foreign exchange
│   │   └── prisma/          # Database service
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── package.json
└── expense-frontend/         # React frontend
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/     # Reusable components
    │   ├── auth/           # Authentication context
    │   ├── api/            # API client
    │   └── routes/         # Routing configuration
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn
