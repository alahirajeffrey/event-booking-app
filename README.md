# Event Booking App API Documentation
Backend for an event planning and booking website. Built using a microservice architecture i.e with three seperate services
- [Core service](https://github.com/alahirajeffrey/event-booking-app): This service is responsible for performing the core operations of the app. It is being built using express, typescript, prisma and postgres
- [Notification service](https://github.com/alahirajeffrey/event-booking-microservices/tree/main/notification_microservice): This is responsible for handling email notifications and would probably be setup to handle push notifications in the future. It is being built using nestjs.
- [Payment service](https://github.com/alahirajeffrey/event-booking-microservices/tree/main/payment_microservice): This service would be responsible for handling payment. It would be build using django, postres and prisma


## Features

- Authentication
- Authorization
- Stripe payment integration
- Email notification
- Google calender integration
- Qr code generation
- Rate limiting

## Requirements

- [Nodejs](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [PostgreSQL](https://www.postgresql.org/) is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.
- [Typescript](https://www.typescriptlang.org/) is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Express](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [Prisma](https://www.prisma.io/) Prisma is a server-side library that helps developers read and write data to the database in an intuitive, efficient and safe way. It is easy to integrate into your framework of choice, Prisma simplifies database access, saves repetitive CRUD boilerplate and increases type safety. Its the perfect companion for building production-grade, robust and scalable web applications

## How to Setup

### Installation

```
$ npm install
```

### Running migrations

```
# development
$ npm run migrate-dev
```

```
# development
$ npm run migrate-prod
```

### Running the app

```
# development
$ npm run dev
```

```
# build
$ npm run build
```

```
# prod
$ npm run start
```

```
# test
$ npm run test
```

## Authentication Endpoints

### **Register a New User**

**URL:** `/api/v1/auth/register`

**Method:** `POST`

**Description:** Register a new user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "user registered successfully"
}
```

### **Login a User**

**URL:** `/api/v1/auth/login`

**Method:** `POST`

**Description:** Login a user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Change user password**

**URL:** `/api/v1/auth/change-password/:userId`

**Method:** `POST`

**Description:** Change user password.

**Request Body:**

```json
{
  "oldPassword": "password123",
  "newPassword": "password1234",
  "userId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e"
}
```

**Response:**

```json
{
  "message": "password changed"
}
```

### **Send email verification otp**

**URL:** `/api/v1/auth/send-verification-otp/`

**Method:** `POST`

**Description:** Send email verification otp.

**Request Body:**

```json
{
  "email": "alahirajeffrey@gmail.com"
}
```

**Response:**

```json
{
  "message": "verification otp sent"
}
```

### **Verify user email**

**URL:** `/api/v1/auth/verify-user/`

**Method:** `PATCH`

**Description:** Verify user.

**Request Body:**

```json
{
  "userId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e",
  "otpProvided": "5543"
}
```

**Response:**

```json
{
  "message": "user verified"
}
```

### **Send reset password otp**

**URL:** `/api/v1/auth/send-reset-password-otp/`

**Method:** `PATCH`

**Description:** Send reset password otp.

**Request Body:**

```json
{
  "email": "alahirajeffrey@gmail.com"
}
```

**Response:**

```json
{
  "message": "reset otp sent"
}
```

### **Reset password**

**URL:** `/api/v1/auth/reset-password/`

**Method:** `POST`

**Description:** Reset password.

**Request Body:**

```json
{
  "email": "alahirajeffrey@gmail.com",
  "otpProvided:"5432",
  "newPassword":"newPassword"
}
```

**Response:**

```json
{
  "message": "password reset"
}
```

## Event Endpoints

### **Create a new event**

**URL:** `/api/v1/event/register`

**Method:** `POST`

**Description:** Create a new event.

**Request Body:**

```json
{
  "title": "test event",
  "description": "test description",
  "date": "1970-01-01T00:00:00.000Z",
  "location": "test location",
  "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e",
  "organizerEmail": "alahirajeffrey@gmail.com"
}
```

**Response:**

```json
{
  "message": "event created"
}
```

### **Get events by an organizer id**

**URL:** `/api/v1/event/organizer/:organizerId`

**Method:** `GET`

**Description:** Get all events by an organizer.

**Request Params:**

```json
{
  "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e"
}
```

**Response:**

```json
[
  {
    "id": "5a3f8efe-d5aa-41a8-9f9b-69d65fc6673b",
    "title": "test event",
    "description": "test description",
    "date": "1970-01-01T00:00:00.000Z",
    "location": "test location",
    "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e",
    "createdAt": "2023-05-26T17:44:42.929Z",
    "updatedAt": "2023-05-26T17:44:42.929Z",
    "review": null
  },
  {
    "id": "3e3af82e-e8e7-43c8-9641-5421c135bda0",
    "title": "test event",
    "description": "test description",
    "date": "1970-01-01T00:00:00.000Z",
    "location": "test location",
    "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e",
    "createdAt": "2023-05-26T17:45:06.988Z",
    "updatedAt": "2023-05-26T17:45:06.988Z",
    "review": null
  }
]
```

### **Get events by event id**

**URL:** `/api/v1/event/:eventId`

**Method:** `GET`

**Description:** Get event by id.

**Request Params:**

```json
{
  "eventId": "3e3af82e-e8e7-43c8-9641-5421c135bda0"
}
```

**Response:**

```json
{
  "id": "3e3af82e-e8e7-43c8-9641-5421c135bda0",
  "title": "test event",
  "description": "test description",
  "date": "1970-01-01T00:00:00.000Z",
  "location": "test location",
  "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e",
  "createdAt": "2023-05-26T17:45:06.988Z",
  "updatedAt": "2023-05-26T17:45:06.988Z",
  "review": null
}
```

### **Delete event by id**

**URL:** `/api/v1/event/:eventId/:organizerId`

**Method:** `DELETE`

**Description:** Delete event by id.

**Request Params:**

```json
{
  "eventId": "3e3af82e-e8e7-43c8-9641-5421c135bda0",
  "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e"
}
```

**Response:**

```json
{
  "message": "event deleted"
}
```

### **Update event by id**

**URL:** `/api/v1/event/:eventId/:organizerId`

**Method:** `PATCH`

**Description:** Update event by id.

**Request Params:**

```json
{
  "eventId": "3e3af82e-e8e7-43c8-9641-5421c135bda0",
  "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e"
}
```

**Request Body:**

```json
{
  "title": "test event 2",
  "description": "test description 2",
  "date": "1970-01-01T00:00:00.000Z",
  "location": "test location 2",
  "email": "alahirajeffrey@gmail.com"
}
```

**Response:**

```json
{
  "message": "event updated"
}
```

### **Add or update event seat price**

**URL:** `/api/v1/event/price/:eventId/:organizerId`

**Method:** `PATCH`

**Description:** Add or update event seat price.

**Request Params:**

```json
{
  "eventId": "3e3af82e-e8e7-43c8-9641-5421c135bda0",
  "organizerId": "a0b5ed8d-8400-4ee1-a325-cf19ddeed82e"
}
```

**Request Body:**

```json
{
  "seatPrice": 15000,
  "email": "alahirajeffrey@gmail.com"
}
```

**Response:**

```json
{
  "message": "price added",
  "email": "alahirajeffrey@gmail.com"
}
```

## Author

[Alahira Jeffrey](<(https://github.com/alahirajeffrey)>)
