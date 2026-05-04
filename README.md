# Save a Life

Save a Life is a full-stack blood donation platform that connects available donors with urgent blood requests nearby.

## Stack

- Mobile: Expo + React Native + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT

## Features

- User registration and login
- Confirm-password registration flow
- Email OTP verification with local OTP preview for development
- Nearby urgent blood requests
- Create blood requests with urgency and location
- Donor discovery filtered by blood type and city
- Verified hospitals and blood banks with phone numbers and addresses
- Profile management with availability toggle
- Donation history tracking
- Donor points, certificate progress, reputation score, and 90-day cooldown countdown
- Multi-language support for English, French, and Arabic
- Matching logic based on blood compatibility, availability, proximity, and 90-day donation rule

## Project Structure

```text
.
|-- app/                  Expo Router routes
|-- components/           Reusable mobile UI components
|-- screens/              Screen-level mobile views
|-- services/             API and storage services
|-- navigation/           Navigation constants
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   `-- database/schema.sql
```

## Environment Variables

Frontend `.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

Backend `backend/.env`

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/save_a_life
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8081
DEFAULT_SEARCH_RADIUS_KM=50
```

Templates are included in [`.env.example`](/c:/Users/joseph/Save_a_Life/.env.example) and [`backend/.env.example`](/c:/Users/joseph/Save_a_Life/backend/.env.example).

## Setup

1. Install root dependencies:

   ```bash
   npm install
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create PostgreSQL database:

   ```sql
   CREATE DATABASE save_a_life;
   ```

4. Run the schema from [`backend/database/schema.sql`](/c:/Users/joseph/Save_a_Life/backend/database/schema.sql).
   If you already created the database earlier, rerun this file because it now adds new user columns and the `verified_facilities` table.

5. Copy env templates and adjust values.

6. Start the backend:

   ```bash
   npm run api
   ```

7. In a second terminal, start Expo:

   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `GET /api/users`
- `GET /api/users/me`
- `PUT /api/users/:id`
- `POST /api/requests`
- `GET /api/requests`
- `PUT /api/requests/:id`
- `POST /api/donations`
- `GET /api/donations/user/:id`
- `GET /api/facilities`

## Validation

- Frontend type check: `cmd /c .\node_modules\.bin\tsc.cmd --noEmit`
- Frontend lint: `npm run lint`
- Backend load check: `node -e "require('./src/app'); console.log('backend ok')"`

## Notes

- Push notifications and a production email provider are not wired yet.
- OTP verification works locally using the preview code returned by the backend after registration or resend.
