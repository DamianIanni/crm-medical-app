# Tech Case Frontend

# Deployment

The project is deployed and accessible here:
🔗 https://tech-case-xbk8.vercel.app/

The deployed version runs on Vercel, using the latest build from the master branch.

This project is a Next.js + React + Tailwind + Shadcn UI application for patient management. The backend is simulated; all data interactions are handled locally or via mock APIs.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DamianIanni/tech-case.git
cd tech-case
```

### 2. Install Dependencies

Make sure you have Node.js (v18+) and npm installed.

```bash
npm install
```

### 3. Run the Application Locally

Start the development server:

```bash
npm run dev
```

To simulate the real behavior of the app as it would run in production (e.g. proper routing, loading states, and performance optimizations), you can run the project in production mode locally:

```bash
npm run preview
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Credentials:

emai: admin@aisel.com,
password: admin123,
role: admin,

email: employee@aisel.com,
password: employee123,
role: employee,

email: manager@aisel.com,
password: manager123",
role: manager,

### 4. Simulated Backend

No backend setup is required. All API calls are simulated using local mocks and utilities. You can find mock API logic in `src/app/api/simulatedAPI/` and related files.

### 5. Running Tests

Unit tests are written with Jest and React Testing Library:

```bash
npm test
```

### 6. Project Structure

- `src/` — Main application code
- `src/components/` — Reusable UI components
- `src/app/` — Next.js app routes and pages
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utilities and test helpers
- `src/constants/` — Route and table constants

### 7. Customization

You can modify UI components, forms, and hooks to fit your needs. All logic is frontend-only and easy to extend.

---

### 8. Note on Data Persistence

This project uses local .json files to simulate a database.
All write operations (create, edit, delete) work correctly in the development environment. However, in production, the file system is read-only, so changes will not be persisted.

### Future Improvements

- Implement a real backend to support data persistence in production.
- Add user authentication and role-based access with real API integration.
- Extend the **Team** section:
  - Only admins will be able to delete team members.
  - Admins will be able to invite new team members via email.
- Add functionality to manage **Centers**:
  - Each user will be associated with a specific center.
  - Based on the selected center and user role, corresponding patients and team members will be fetched.
- Expand the **Profile** section:
  - Add fully functional settings for billing, account management, and notifications.
- Include a **Registration flow** for new users (currently login-only).

---

# tech-case
# crm-medical-app
