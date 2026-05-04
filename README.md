# Save a Life

Save a Life is a full-stack blood donation platform that connects available donors with urgent blood requests nearby.

Blood donation often depends on speed, trust, and access to the right people at the right time. Save a Life was created to make that coordination easier by helping requesters reach nearby compatible donors quickly.

## Status

This project is currently in development. It is functional as a prototype, but it is not ready for real medical emergency use without production security, request verification, hospital partnerships, and compliance review.

## Stack

- Mobile: Expo + React Native + TypeScript
- Navigation: Expo Router + React Navigation
- Location: Expo Location
- Maps: React Native Maps
- Backend: Node.js + Express REST API
- Database: PostgreSQL
- Auth: JWT
- Configuration: `.env` files for frontend and backend settings

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

## App Flow

- Register or log in with a donor profile
- Add blood type, city, availability, and location details
- Browse nearby urgent blood requests
- Create an emergency blood request with urgency and location
- Find compatible donors by blood type and city
- Browse verified hospitals and blood banks
- Track donation history, donor points, reputation score, and certificate progress

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
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/save_a_life
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

## Possible Future Features

- Interactive map view for nearby donors, hospitals, blood banks, and urgent requests
- Push notifications for compatible donors when a new urgent request is created nearby
- SMS or WhatsApp contact flow for faster emergency communication
- Donor availability schedules
- Hospital or blood bank admin dashboard
- Request verification system to reduce fake or duplicate requests
- Live request status tracking
- In-app chat between requesters and donors with privacy protections
- Appointment booking with partner hospitals and blood banks
- Advanced donor eligibility checks
- Improved badges, certificates, leaderboards, and milestones
- Offline-friendly access to important facility contact information
- Admin moderation tools for users, requests, facilities, and reports

## Validation

- Frontend type check: `cmd /c .\node_modules\.bin\tsc.cmd --noEmit`
- Frontend lint: `npm run lint`
- Backend load check: `node -e "require('./src/app'); console.log('backend ok')"`

## Notes

- Push notifications and a production email provider are not wired yet.
- OTP verification works locally using the preview code returned by the backend after registration or resend.

## Disclaimer

Save a Life is a software prototype and should not be used as a replacement for official emergency medical services, verified hospital systems, or professional medical advice.
