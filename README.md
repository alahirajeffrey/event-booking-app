# Event Booking App API Documentation

Backend for an event planning and booking website. Built using a microservice architecture i.e with three seperate services

- [Core service](https://github.com/alahirajeffrey/event-booking-app/tree/master/core-service): This service is responsible for performing the core operations of the app. It is built using express, typescript, prisma and postgres
- [Notification service](https://github.com/alahirajeffrey/event-booking-app/tree/master/notification-microservice): This is responsible for handling email notifications and would probably be setup to handle push notifications in the future. It is being built using nestjs.
- [Authentication service](): As of now, authentication is handled by the core service. However, I am working on decoupling the authentication endpoints from the core service and making the auth service a standalone service.

## Requirements

- [Nodejs](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [PostgreSQL](https://www.postgresql.org/) is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.
- [Typescript](https://www.typescriptlang.org/) is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Express](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [Prisma](https://www.prisma.io/) Prisma is a server-side library that helps developers read and write data to the database in an intuitive, efficient and safe way. It is easy to integrate into your framework of choice, Prisma simplifies database access, saves repetitive CRUD boilerplate and increases type safety. Its the perfect companion for building production-grade, robust and scalable web applications
- [Nestjs](https://nestjs.com/) is aprogressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Rabbitmq](https://rabbitmq.com) is one of the most popular open source message brokers and is used worldwide by both startups and large enterprises. It is lightweight and supports multiple messaging protocols.

## Features

- **Authentication Service:**

  - **User registration:** Registers a new user
  - **User login:** Logs in a registered user
  - **Password change:** Change password while logged in
  - **Forgot password:** Change password when user forgets
  - **Email verification:** Verify user via email
  - **OTP generation:** Generate OTP for users

- **Core Service:**

  - **Event:** Create, Update, Read and Cancel events
  - **Bookings:** Create, Update, Read, Cancel bookings and integrate details on google calender.

- **Notification Service:**

  - **OTP:** send details of generated OTP to user via email
  - **Booking notification:** send QR code containing details of booking confirmation or cancellation via email
  - **Event notification:** send QR code containing details of event creattion or cancellation via email

## Getting Started
