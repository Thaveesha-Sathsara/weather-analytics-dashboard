# Weather Analytics Dashboard

A full-stack MERN application developed for the Fidenz Technologies technical assessment. This dashboard provides real-time weather insights, data visualization, and a custom Comfort Index for selected cities.

## Features
- **Weather Data Visualization**: Interactive Bar Charts using Recharts.
- **Custom Comfort Index**: A proprietary formula to determine city livability.
- **Server-Side Caching**: Implemented `node-cache` with a 5-minute TTL for API optimization.
- **Security**: Auth0 integration with JWT verification and Multi-Factor Authentication (MFA).
- **UI/UX**: Responsive design with Dark Mode support and real-time search filtering.

## Tech Stack
- **Frontend**: React.js, Recharts, Auth0-React, Axios.
- **Backend**: Node.js, Express.js, Node-cache, OpenWeatherMap API.

### Test User Credentials

To test the Auth0 protected dashboard, please use the credentials provided for this assessment:

* **Email**: `careers@fidenz.com`
* **Password**: `Pass#fidenz`

## How to Set Up the Environment (.env)

To run this project locally, you must create a `.env` file in the **/server** directory. 

### Server Environment Variables (`/server/.env`)
Create a file named `.env` and add the following:

PORT=3001

OPENWEATHER_KEY=39f0b0edaf5a9014994a13a3ead31436

AUTH_DOMAIN=dev-b5yr0mxjii1hhmuo.us.auth0.com

AUTH_AUDIENCE=https://weather-api

## Technical Implementation

### Comfort Index Formula
The Comfort Index is calculated based on Temperature, Humidity, and Wind Speed to provide a score out of 100:
$$100 - (|Temp - 22| \times 2.5) - (Humidity \times 0.2) - (Wind \times 0.5)$$

### Installation
1. **Clone the repo**: `git clone https://github.com/Thaveesha-Sathsara/weather-analytics-dashboard.git`
2. **Backend**: 
   - `cd server`
   - `npm install`
   - `npm run dev`
3. **Frontend**:
   - `cd client`
   - `cd weather-app`
   - `npm install`
   - `npm start`
