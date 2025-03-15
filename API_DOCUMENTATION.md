# Color-Tech API Documentation

## Overview

The Color-Tech API provides endpoints for managing vehicle service bookings, user accounts, vehicles, services, and content. This document outlines the available endpoints, request/response formats, and authentication requirements.

## Base URL

```
https://api.color-tech.com/v1
```

## Authentication

Most endpoints require authentication using JSON Web Tokens (JWT). To authenticate, include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Getting a Token

To obtain a token, use the login endpoint:

```
POST /auth/login
```

## Error Handling

All errors follow a standard format:

```json
{
  "message": "Error message describing what went wrong",
  "error": "Optional error code or details"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Endpoints

### Authentication

#### Register a new user

```
POST /auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "phone": "1234567890"
}
```

Response:
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "client"
  },
  "token": "jwt_token_here"
}
```

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "client"
  },
  "token": "jwt_token_here"
}
```

#### Logout

```
POST /auth/logout
```

Response:
```json
{
  "message": "Logout successful"
}
```

#### Get User Profile

```
GET /auth/profile
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "client",
  "phone": "1234567890",
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

#### Update User Profile

```
PUT /auth/profile
```

Request body:
```json
{
  "full_name": "John Smith",
  "phone": "0987654321"
}
```

Response:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Smith",
    "role": "client",
    "phone": "0987654321"
  }
}
```

### Bookings

#### Get All Bookings (Admin/Staff only)

```
GET /bookings
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (pending, confirmed, in_progress, completed, cancelled)
- `date`: Filter by date (YYYY-MM-DD)
- `staff_id`: Filter by staff ID

Response:
```json
{
  "bookings": [
    {
      "id": 1,
      "user_id": 1,
      "vehicle_id": 1,
      "booking_date": "2023-06-01",
      "start_time": "10:00:00",
      "end_time": "11:00:00",
      "status": "pending",
      "total_price": 50.00,
      "notes": "Please check brakes too",
      "client_name": "John Doe",
      "vehicle_make": "Toyota",
      "vehicle_model": "Camry",
      "license_plate": "ABC123",
      "services": [
        {
          "id": 1,
          "service_name": "Oil Change",
          "price": 50.00
        }
      ]
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### Get My Bookings

```
GET /bookings/my-bookings
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (pending, confirmed, in_progress, completed, cancelled)

Response: Same as Get All Bookings

#### Get Booking by ID

```
GET /bookings/:id
```

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "vehicle_id": 1,
  "booking_date": "2023-06-01",
  "start_time": "10:00:00",
  "end_time": "11:00:00",
  "status": "pending",
  "total_price": 50.00,
  "notes": "Please check brakes too",
  "client_name": "John Doe",
  "vehicle_make": "Toyota",
  "vehicle_model": "Camry",
  "license_plate": "ABC123",
  "services": [
    {
      "id": 1,
      "service_name": "Oil Change",
      "price": 50.00
    }
  ]
}
```

#### Create Booking

```
POST /bookings
```

Request body:
```json
{
  "vehicle_id": 1,
  "service_ids": [1, 2],
  "booking_date": "2023-06-01",
  "start_time": "10:00:00",
  "end_time": "11:00:00",
  "notes": "Please check brakes too"
}
```

Response:
```json
{
  "message": "Booking created successfully",
  "booking_id": 1
}
```

#### Update Booking

```
PUT /bookings/:id
```

Request body:
```json
{
  "booking_date": "2023-06-02",
  "start_time": "11:00:00",
  "end_time": "12:00:00",
  "notes": "Updated notes",
  "service_ids": [1, 3]
}
```

Response:
```json
{
  "message": "Booking updated successfully"
}
```

#### Cancel Booking

```
PUT /bookings/:id/cancel
```

Response:
```json
{
  "message": "Booking cancelled successfully"
}
```

#### Update Booking Status (Admin/Staff only)

```
PUT /bookings/:id/status
```

Request body:
```json
{
  "status": "confirmed"
}
```

Response:
```json
{
  "message": "Booking status updated successfully"
}
```

#### Delete Booking (Admin only)

```
DELETE /bookings/:id
```

Response:
```json
{
  "message": "Booking deleted successfully"
}
```

#### Get Available Time Slots

```
GET /bookings/available-slots/:date
```

Response:
```json
{
  "date": "2023-06-01",
  "available_slots": [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00"
  ]
}
```

#### Get Booking Statistics (Admin/Staff only)

```
GET /bookings/stats
```

Query parameters:
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)

Response:
```json
{
  "total": 50,
  "by_status": {
    "pending": 10,
    "confirmed": 15,
    "in_progress": 5,
    "completed": 15,
    "cancelled": 5
  },
  "by_date": [
    {
      "date": "2023-06-01",
      "count": 5
    },
    {
      "date": "2023-06-02",
      "count": 8
    }
  ],
  "revenue": {
    "total": 2500.00,
    "average_per_booking": 50.00
  }
}
```

### Vehicles

#### Get All Vehicles (Admin/Staff only)

```
GET /vehicles
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:
```json
{
  "vehicles": [
    {
      "id": 1,
      "user_id": 1,
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "color": "Blue",
      "license_plate": "ABC123",
      "vin": "1HGCM82633A123456",
      "notes": "Sedan",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### Get My Vehicles

```
GET /vehicles/my-vehicles
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response: Same as Get All Vehicles

#### Get Vehicle by ID

```
GET /vehicles/:id
```

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "color": "Blue",
  "license_plate": "ABC123",
  "vin": "1HGCM82633A123456",
  "notes": "Sedan",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

#### Create Vehicle

```
POST /vehicles
```

Request body:
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "color": "Blue",
  "license_plate": "ABC123",
  "vin": "1HGCM82633A123456",
  "notes": "Sedan"
}
```

Response:
```json
{
  "message": "Vehicle created successfully",
  "vehicle": {
    "id": 1,
    "user_id": 1,
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "color": "Blue",
    "license_plate": "ABC123",
    "vin": "1HGCM82633A123456",
    "notes": "Sedan",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Vehicle

```
PUT /vehicles/:id
```

Request body:
```json
{
  "color": "Red",
  "notes": "Updated notes"
}
```

Response:
```json
{
  "message": "Vehicle updated successfully",
  "vehicle": {
    "id": 1,
    "user_id": 1,
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "color": "Red",
    "license_plate": "ABC123",
    "vin": "1HGCM82633A123456",
    "notes": "Updated notes",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete Vehicle

```
DELETE /vehicles/:id
```

Response:
```json
{
  "message": "Vehicle deleted successfully"
}
```

### Services

#### Get All Services

```
GET /services
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category_id`: Filter by category ID
- `is_active`: Filter by active status (true/false)

Response:
```json
{
  "services": [
    {
      "id": 1,
      "name": "Oil Change",
      "description": "Full synthetic oil change service",
      "price": 50.00,
      "duration_minutes": 30,
      "category_id": 1,
      "category_name": "Maintenance",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### Get Service Categories

```
GET /services/categories
```

Response:
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Maintenance",
      "description": "Regular maintenance services",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Service by ID

```
GET /services/:id
```

Response:
```json
{
  "id": 1,
  "name": "Oil Change",
  "description": "Full synthetic oil change service",
  "price": 50.00,
  "duration_minutes": 30,
  "category_id": 1,
  "category_name": "Maintenance",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

#### Create Service (Admin only)

```
POST /services
```

Request body:
```json
{
  "name": "Oil Change",
  "description": "Full synthetic oil change service",
  "price": 50.00,
  "duration_minutes": 30,
  "category_id": 1,
  "is_active": true
}
```

Response:
```json
{
  "message": "Service created successfully",
  "service": {
    "id": 1,
    "name": "Oil Change",
    "description": "Full synthetic oil change service",
    "price": 50.00,
    "duration_minutes": 30,
    "category_id": 1,
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Service (Admin only)

```
PUT /services/:id
```

Request body:
```json
{
  "price": 55.00,
  "description": "Updated description"
}
```

Response:
```json
{
  "message": "Service updated successfully",
  "service": {
    "id": 1,
    "name": "Oil Change",
    "description": "Updated description",
    "price": 55.00,
    "duration_minutes": 30,
    "category_id": 1,
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete Service (Admin only)

```
DELETE /services/:id
```

Response:
```json
{
  "message": "Service deleted successfully"
}
```

#### Create Service Category (Admin only)

```
POST /services/categories
```

Request body:
```json
{
  "name": "Maintenance",
  "description": "Regular maintenance services"
}
```

Response:
```json
{
  "message": "Category created successfully",
  "category": {
    "id": 1,
    "name": "Maintenance",
    "description": "Regular maintenance services",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Service Category (Admin only)

```
PUT /services/categories/:id
```

Request body:
```json
{
  "name": "Regular Maintenance",
  "description": "Updated description"
}
```

Response:
```json
{
  "message": "Category updated successfully",
  "category": {
    "id": 1,
    "name": "Regular Maintenance",
    "description": "Updated description",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete Service Category (Admin only)

```
DELETE /services/categories/:id
```

Response:
```json
{
  "message": "Category deleted successfully"
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

When a rate limit is exceeded, the API will respond with a 429 Too Many Requests status code.

## Versioning

The API uses URL versioning (e.g., `/v1/bookings`). When breaking changes are introduced, a new version will be released. 