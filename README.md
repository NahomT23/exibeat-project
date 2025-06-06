# Exibeat Task

A full-stack monorepo project built to mimic a **track submission and feedback flow**. Built using **NestJS**, **Next.js**, **TailwindCSS**, **TypeScript**, **MongoDB**, **Mongoose**, and **shadcn/ui**.

---

## 🗂 Project Structure

```
exibeat-task/
├── backend/     # NestJS API with Mongoose, Swagger, CORS, Validator
├── frontend/    # Next.js app using TailwindCSS and shadcn/ui
```

---

## 🚀 Installation

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/NahomT23/exibeat-project.git
cd exibeat-task
```

```bash
# Backend setup
cd backend
npm install
npm run start:dev
```

> ⚠️ Make sure the backend `PORT` is not `3000`, since Next.js uses it by default. Use something like `4000`.

### Frontend Setup

```bash
# Frontend setup
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`

```
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### Frontend `.env`

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
(For the two ID's below it can be any 24 digit hex code)
NEXT_PUBLIC_DJ_ID=507f1f77bcf86cd799439011
NEXT_PUBLIC_PRODUCER_ID=507f1f77bcf86cd799439012
```

---

## ⚙️ Features

- **NestJS** backend with:
  - Mongoose ODM
  - Class-validator decorators
  - CORS enabled
  - Swagger documentation (`/api`)
- **Next.js** frontend with:
  - TailwindCSS
  - shadcn/ui components
- Monorepo setup
- Dual dashboards for DJ & Producer

---

## 📘 Swagger API Docs

API documentation and examples available at:

```
http://localhost:4000/api
```

---

## 🧪 Endpoints (Examples)

### `POST /submissions`

**Submit a new track**

```json
{
  "producerId": "507f1f77bcf86cd799439012",
  "djId": "507f1f77bcf86cd799439011",
  "trackTitle": "Summer Vibes",
  "trackDescription": "Chill tropical house track",
  "initialMessage": "Hope you like this new track!"
}
```

---

### `GET /submissions/getAllTracks`

**Get all track submissions**

```http
GET http://localhost:4000/submissions/getAllTracks
```

---

### `GET /submissions/getMessages/{id}`

**Get messages for a submission**

```http
GET http://localhost:4000/submissions/getMessages/507f1f77bcf86cd799439099
```

---

### `POST /submissions/feedback/{id}`

**Send feedback for a submission**

```json
{
  "djId": "507f1f77bcf86cd799439011",
  "producerId": "507f1f77bcf86cd799439012",
  "content": "Great track but needs better mixing"
}
```

---

### `PUT /submissions/read/{id}`

**Mark submission as read**

```http
PUT http://localhost:4000/submissions/read/507f1f77bcf86cd799439099
```

---

## 🎛 Dashboards

- **Producer Dashboard:** `http://localhost:3000/producer`
- **DJ Dashboard:** `http://localhost:3000/dj`

---
