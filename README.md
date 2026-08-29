# Student Management System


**Stack:** Java 8 · Spring Boot 2.7 · Spring Data JPA · MySQL 8 · React 18 ·
Axios · React Router · Postman (API collection included)

> **Note on "microservices":** this is built as a single, cleanly layered
> Spring Boot REST API (controller → service → repository), which is what
> real interview-ready CRUD projects at this scope normally look like. A true
> microservices split (separate deployable services, a config server, a
> Eureka/service registry, an API gateway, inter-service messaging) is
> significant extra infrastructure that doesn't add value for a single-domain
> CRUD app like this one — it would mean running 4–5 services to manage one
> `students` table. If you specifically want the microservices version (e.g.
> splitting Students, Courses, and Fees into independently deployable
> services behind a gateway, for a project that's meant to demonstrate that
> pattern), let me know and I'll build that as a variant.

---

## Project structure

```
student-management-system/
├── backend/                # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/pythonlife/sms/
│       ├── entity/          # Student, Course, Fee (JPA entities)
│       ├── repository/      # Spring Data JPA repositories
│       ├── service/         # Service interfaces + impl
│       ├── controller/      # REST controllers
│       ├── dto/              # Request/response DTOs
│       ├── exception/       # Custom exceptions + global handler
│       └── config/          # CORS config
├── frontend/                # React admin console ("The Ledger")
│   └── src/
│       ├── components/      # Sidebar, Topbar, StatCard, modals, toast
│       ├── pages/           # Dashboard, Students, Courses, Reports
│       └── services/        # Axios API clients
├── database/
│   └── schema.sql            # Table definitions + seed data
└── postman/
    └── Student-Management-System.postman_collection.json
```

---

## 1. Database setup (MySQL)

1. Make sure MySQL 8 is installed and running locally.
2. Run the schema script (creates the database, tables, and seed data):

   ```bash
   mysql -u root -p < database/schema.sql
   ```

   You'll be prompted for your MySQL root password.

   Alternatively, `spring.datasource.url` is already set with
   `createDatabaseIfNotExist=true`, so simply starting the backend (step 2)
   will create the empty `student_management_db` schema and tables for you —
   run `schema.sql` only if you also want the sample seed rows.

## 2. Backend setup (Spring Boot)

1. Open `backend/src/main/resources/application.properties` and set your
   real MySQL password:

   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
   ```

   **Do not commit your real password to git.** For anything beyond local
   practice, read it from an environment variable instead, e.g.:

   ```properties
   spring.datasource.password=${DB_PASSWORD}
   ```

   and run with `DB_PASSWORD=yourpassword ./mvnw spring-boot:run`.

2. Build and run:

   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   (No `mvnw` wrapper? Use your local Maven: `mvn clean install && mvn spring-boot:run`.)

3. The API starts on **http://localhost:8080/api**.
   Swagger UI: **http://localhost:8080/api/swagger-ui.html**

## 3. Frontend setup (React)

```bash
cd frontend
npm install
cp .env.example .env      # points the app at http://localhost:8080/api
npm start
```

The app opens on **http://localhost:3000**.

## 4. Testing the API with Postman

Import `postman/Student-Management-System.postman_collection.json` into
Postman. It includes requests for every endpoint, using a `{{baseUrl}}`
variable (defaults to `http://localhost:8080/api`).

---

## API Reference

| Method | Endpoint                              | Description                          |
|--------|----------------------------------------|---------------------------------------|
| POST   | `/api/v1/students`                     | Create a student                      |
| GET    | `/api/v1/students`                     | List all students                     |
| GET    | `/api/v1/students?search=`             | Search by first/last name             |
| GET    | `/api/v1/students?course=`             | Filter by course                      |
| GET    | `/api/v1/students?status=`             | Filter by status (ACTIVE/INACTIVE)    |
| GET    | `/api/v1/students/{id}`                | Get one student                       |
| PUT    | `/api/v1/students/{id}`                | Update a student                      |
| DELETE | `/api/v1/students/{id}`                | Delete a student                      |
| GET    | `/api/v1/students/dashboard/stats`     | Dashboard counts + course breakdown   |
| POST   | `/api/v1/courses`                      | Create a course                       |
| GET    | `/api/v1/courses`                      | List all courses                      |
| GET    | `/api/v1/courses/{id}`                 | Get one course                        |
| PUT    | `/api/v1/courses/{id}`                 | Update a course                       |
| DELETE | `/api/v1/courses/{id}`                 | Delete a course                       |

## Features implemented

- Add / update / delete students
- Course enrollment tracking
- Search & filter (by name, course, status)
- Dashboard with live stats (total / active / inactive / by-course)
- Reports page with a course-enrollment breakdown chart
- Form validation (required fields, email format, 10-digit phone)
- Global exception handling with clean JSON error responses
- CORS configured for local React dev server

## Frontend design notes

The UI uses a "registrar's ledger" visual identity — ink-navy sidebar with a
brass-gold accent, serif display type (Fraunces) for headings paired with
Inter for body text and JetBrains Mono for IDs/data, numbered ledger-style
table rows, and wax-seal-inspired branding — rather than a generic admin
template.

---

**Next up:** Project #2 — Employee Payroll System. Just say "next project" /
"give me 2nd project" and I'll build it the same way.
