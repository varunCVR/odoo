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

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd expense-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/expense_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed the database (optional):
   ```bash
   npm run prisma:seed
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd expense-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Expenses
- `GET /expenses` - Get user's expenses
- `POST /expenses` - Create new expense
- `GET /expenses/company` - Get company expenses (admin)
- `POST /expenses/:id/receipt` - Upload receipt

### Approvals
- `GET /approvals` - Get pending approvals
- `POST /approvals/:id/decide` - Approve/reject expense

### Users
- `GET /users` - Get company users (admin)
- `POST /users` - Create new user (admin)

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Company**: Organization information
- **User**: User accounts with role-based access
- **Expense**: Expense records with multi-currency support
- **ExpenseApproval**: Approval workflow tracking
- **ApprovalRule**: Configurable approval rules
- **FxRate**: Foreign exchange rates
- **AuditLog**: Complete audit trail

## Development

### Running Tests

Backend:
```bash
npm run test
npm run test:e2e
```

Frontend:
```bash
npm run test
```

### Building for Production

Backend:
```bash
npm run build
npm run start:prod
```

Frontend:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
