# RDBMS_Project_UniversityManagement

# University Management System

This is a University Management System project built with React (Frontend) and Node.js (Backend). The system allows three distinct user roles: **Student**, **Teacher**, and **Admin**. Each role has specific responsibilities and access to different features. 

## Key Features

- **Student Role**:  
  - Login to the system.
  - Enroll in courses under available teachers.
  - View their enrolled courses and related details.
  
- **Teacher Role**:  
  - Login to the system.
  - Take courses assigned to them.
  - Announce important information to their respective classes.
  
- **Admin Role**:  
  - Login to the system.
  - Assign students and teachers to different departments.
  - Manage departments, courses, and users (students and teachers).

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or any preferred database)
- **Authentication**: JWT (JSON Web Tokens)

## Project Setup

This project is divided into two main parts: the **Frontend** (React app) and the **Backend** (Node.js API).

### 1. Clone the repository

```bash
git clone <repository_url>
cd university-management-system

### Setting up the Backend (Node.js)

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file to store environment variables:

    ```bash
    touch .env
    ```

4. Add the following to the `.env` file:

    ```plaintext
    PORT=5000
    MONGO_URI=<your_mongo_database_connection_string>
    JWT_SECRET=<your_secret_key_for_jwt>
    ```

5. Start the backend server:

    ```bash
    npm start
    ```

The backend will run on `http://localhost:5000`.

---

## Setting up the Frontend (React)

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm start
    ```

The frontend will run on `http://localhost:3000`.
