# Event Booking App API Documentation

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
$ npm run prisma migration
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

### Register a New User

**URL:** `/api/auth/register`

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

### Login a User

**URL:** `/api/auth/login`

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
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Author

[Alahira Jeffrey](<(https://github.com/alahirajeffrey)>)
