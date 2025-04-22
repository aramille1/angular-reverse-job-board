# Admin Dashboard Module

This module provides an admin dashboard for managing recruiter profiles with approval functionality.

## Features

- Admin login
- Dashboard with navigation
- Recruiter management (view, approve, reject)
- Status filtering (pending, approved, rejected)
- Pagination

## Go Backend Integration

This admin module is designed to work with your existing Go backend. The following API endpoints are expected to be available:

### Authentication

- `POST /api/admin/login`: Admin login endpoint
  - Request body: `{ username: string, password: string }`
  - Response: `{ admin: AdminObject, token: string }`

### Recruiter Management

- `GET /api/admin/recruiters`: Get recruiters with filters
  - Query params: `page`, `limit`, `status` (pending, approved, rejected)
  - Response: Either an array of recruiters or an object with metadata like:
    ```
    {
      "recruiters": [...],
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
    ```

- `PATCH /api/admin/recruiters/:id/approve`: Approve a recruiter
  - Response: Updated recruiter object

- `PATCH /api/admin/recruiters/:id/reject`: Reject a recruiter
  - Request body: `{ reason: string }`
  - Response: Updated recruiter object

## Go Backend Requirements

Your Go backend should:

1. Implement JWT authentication for admin users
2. Support the approval status enum: 'pending', 'approved', 'rejected'
3. Have an admin collection with fields:
   - username
   - password (hashed)
   - email
   - firstName
   - lastName
   - isSuper (boolean)

4. Update the Recruiter model to include:
   - Status (enum: pending, approved, rejected)
   - adminVerified (boolean)
   - rejectionReason (string)
   - approvedBy (admin ID)
   - approvalDate (timestamp)

## Customizing for Your Go API

If your Go backend uses different endpoints or data structures:

1. Update the `AdminService` methods in `src/app/services/admin.service.ts`
2. Adjust the response handling in the components, particularly in `recruiter-list.component.ts`
3. Modify the templates to match your data structure

## Access

The admin dashboard is available at the `/adminski` route with the following sub-routes:
- `/adminski/login`: Admin login
- `/adminski/recruiters`: Recruiter management
