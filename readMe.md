# Job Portal Node.js Application

This is a Node.js application for a job portal called "KaamKhoj". It includes features such as fetching job data, filtering jobs, and user authentication.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Middleware and Constants](#middleware-and-constants)
- [Routes](#routes)
- [Error Handling](#error-handling)

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/anishjoshi1999/KaamKhojPortal.git
   cd KaamKhojPortal
   ```

2. Install all the dependencies

   ```bash
   npm install
   ```

3. Create a .env file in the root of the project and add the following: Set up environment variables:

```bash
JWT_SECRET=your-secret-key
PORT=3000
MONGODB_URI=your-mongodb-uri
```

Replace your JWT_SECRET and your MONGODB_URI with your actual values.

Run the application:npm start

1.  The application should be running at `http://localhost:3000`.

## Project Structure

The project follows a modular structure:

- Middleware: Contains middleware functions such as authentication middleware.
- Routes: Contains route definitions for different parts of the application.
- Constants: Stores constant values used across the application.
- Utils: Includes utility functions used in the application.

## Usage

Describe how to use or interact with the application. Include any relevant details about endpoints, functionality, and user authentication.

## Middleware and Constants

Middleware functions and constants are separated for better organization and modularity.

## Routes

Routes are organized into separate files, each handling specific parts of the application (e.g., fetching jobs, API routes).

## Error Handling

Centralized error handling middleware is included to handle internal server errors.
