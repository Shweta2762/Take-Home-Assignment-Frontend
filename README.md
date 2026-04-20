# NGO Reporting Frontend

Frontend application for NGO monthly reporting and admin analytics.

## Features

- Report Submission Form
  - Fields: NGO ID, Month, People Helped, Events Conducted, Funds Utilized
  - Client-side validation and API submission
- Bulk Report Upload
  - CSV upload to backend
  - Returns Job ID and shows job progress with polling
  - Displays partial-failure details when available
- Admin Dashboard
  - Select month and view totals:
    - Total NGOs Reporting
    - Total People Helped
    - Total Events Conducted
    - Total Funds Utilized

## Tech Stack

- React + TypeScript (Create React App)
- Axios for API calls
- React Router for navigation

## Setup

1. Install dependencies:
   - `npm install`
2. Configure environment variables in `.env`:
   - `REACT_APP_HTTP_VALUE=http://`
   - `REACT_APP_API_ENDPOINTS=localhost`
   - `REACT_APP_PORT_NO=:9001`
3. Start the frontend:
   - `npm start`
4. Build for production:
   - `npm run build`

## API Contract Used by Frontend

Base URL is created from env values:

- `BASE_URL = REACT_APP_HTTP_VALUE + REACT_APP_API_ENDPOINTS + REACT_APP_PORT_NO`

Endpoints used:

- `POST /api/report` - submit single report
- `POST /reports/upload` - upload CSV and return `{ jobId }`
- `GET /api/reports/jobs/:jobId` - fetch bulk job progress/status
- `GET /dashboard?month=YYYY-MM` - fetch monthly dashboard totals

If your backend uses different routes or payload keys, update `src/config.ts`.

## Notes

- Bulk uploads are processed asynchronously in the backend.
- The frontend polls the job status endpoint every 2 seconds until completion/failure.
- The UI handles partial failures by showing failed row details when returned by API.
