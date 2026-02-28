# QuickHire — QSL Technical Assessment

QuickHire is a simple job board application built with **Next.js (Frontend)**, **Node.js/Express (Backend)**, and **PostgreSQL (Database)** using **Sequelize ORM**.

---

## Features

### Public
- Job listings
- Search by **title/company**
- Filter by **category** and **location**
- Job details page
- Apply to a job (name, email, resume link (URL), cover note)

### Admin
- Create a job
- Delete a job

---

## Tech Stack
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: Node.js + Express.js
- Database: PostgreSQL
- ORM: Sequelize
- Validation: Zod

---

## Project Structure

```bash
quickhire/
  backend/
  frontend/
  README.md
```

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=4001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickhire
DB_USER=postgres
DB_PASSWORD=postgres

ADMIN_TOKEN=supersecret_admin_token
CORS_ORIGIN=http://localhost:3000
```

Create PostgreSQL database:
- Create a database named: `quickhire` (using pgAdmin or psql)

Run backend:

```bash
npm run dev
```

Backend will run on:
- `http://localhost:4001`

Health check:
- `http://localhost:4001/health`

---

### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4001
NEXT_PUBLIC_ADMIN_TOKEN=supersecret_admin_token
```

Run frontend:

```bash
npm run dev
```

Frontend will run on:
- `http://localhost:3000`

---

## API Endpoints

### Jobs
- `GET /api/jobs`
  - Optional query params: `search`, `category`, `location`
- `GET /api/jobs/:id`
- `POST /api/jobs` (Admin)
  - Header: `x-admin-token: <ADMIN_TOKEN>`
- `DELETE /api/jobs/:id` (Admin)
  - Header: `x-admin-token: <ADMIN_TOKEN>`

### Applications
- `POST /api/applications`

---

## Example Requests

### Create Job (Admin)

`POST http://localhost:4001/api/jobs`

Headers:
- `Content-Type: application/json`
- `x-admin-token: supersecret_admin_token`

Body:

```json
{
  "title": "Frontend Engineer",
  "company": "Qtec Solution Limited",
  "location": "Dhaka",
  "category": "Engineering",
  "description": "Build modern UI with Next.js."
}
```

### Apply for a Job

`POST http://localhost:4001/api/applications`

Body:

```json
{
  "job_id": "<JOB_ID>",
  "name": "Candidate Name",
  "email": "candidate@example.com",
  "resume_link": "https://drive.google.com/your-resume",
  "cover_note": "Short cover note..."
}
```

---

## Notes
- Tables are created automatically on backend start using:
  - `sequelize.sync({ alter: true })`
- Admin endpoints are protected using a simple token header for assessment purposes.

---

## Loom Demo (What to Show)
1. Open Home page (job listing)
2. Show search + filters working
3. Click a job → Job Details page
4. Submit Apply form (show success message)
5. Open Admin page `/admin`
6. Create a job
7. Delete a job
8. Back to Home → list updates


## Submission Notes
- Admin token is stored in `.env` (backend) and `.env.local` (frontend) for assessment simplicity.
- Database tables are auto-created via Sequelize sync on server start.