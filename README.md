# Library Management System

This is a full-stack Library Management System that I built using React, Node.js, Express and MySQL.

The main idea of the project is to allow users to register, login and manage their own books. There is also an admin role that can manage all users and books.

I also added a simple AI Library Assistant that can answer some questions based on the data stored in the database.

## Main features

- User registration and login
- JWT authentication
- Password encryption with bcrypt
- Normal user and admin roles
- Add, edit and delete books
- Users can see only their own books
- Admin can see all users and books
- Admin can delete users and books
- AI Assistant
- Simple book recommendation feature

## Technologies

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express
- MySQL
- JWT
- bcrypt
- dotenv

### Database

- MySQL

## AI Assistant

The AI Assistant is connected to the library database.

It can answer questions like:

- Who owns the most books?
- Which books are the most expensive?
- What is the most popular genre?
- Which book is the most popular?
- How many books are completed?
- What books are currently being read?
- How many books are in the library?
- Recommend me books

For the recommendation part, the system checks the user's most common genre and tries to recommend books from the same genre.

## How to run the project

First, make sure MySQL is running and the database is created.

Then open the backend folder:

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Then open another terminal and go to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

## Environment file

Inside the backend folder, create a `.env` file with values like:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management
JWT_SECRET=your_secret_key
```

The real `.env` file should not be uploaded to GitHub.

## Database

The project uses two main tables:

- users
- books

Each book belongs to one user.

If a user is deleted, their books are also deleted.

## What I learned

During this project I practiced:

- connecting React with a Node.js backend
- working with APIs
- using MySQL
- JWT authentication
- password hashing
- protected routes
- CRUD operations
- user roles
- Git and GitHub

## Future improvements

Some things I would like to improve later:

- better search and filtering
- pagination
- improved recommendation logic
- more tests
- deployment
- book cover images

## Author

Xhesika
