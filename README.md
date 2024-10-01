# WeatherApp
This project is a Weather App build with react frontend and django backend, used openweather api for real time weather updation

## Table of Contents

- [Prerequisites](#prerequisites)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Running the Application](#running-the-application)
- [Development](#development)
- [Deployment](#deployment)


## Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- Python (v3.8 or later)
- pip
- virtualenv


## Frontend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Anuragk37/ChatApp.git
   cd ChatApp/frontend
   ```

2. **Install Dependencies**

   Navigate to the `frontend` directory and install the required Node.js packages:

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm run dev
   ```

   This will start the Vite development server at `http://localhost:3000`.

## Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd ChatApp/backend
   ```

2. **Create and Activate a Virtual Environment**

   ```bash
   virtualenv venv
   `venv\Scripts\activate`
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run Database Migrations**

   ```bash
   python manage.py migrate
   ```


5. **Start the Django Development Server**

   ```bash
   python manage.py runserver
   ```

   This will start the Django development server at `http://localhost:8000`.

## Running the Application

1. **Frontend**
   
   Open a browser and navigate to `http://localhost:3000` to access the React application.

2. **Backend**
   
   Ensure the Django server is running at `http://localhost:8000`.

## Development

### Frontend

- **Dependencies**: `react`, `react-dom`, `react-router-dom`, `axios`, `redux-toolkit`
- **Commands**:
  - `npm run dev` - Start the development server with Vite.
  - `npm run build` - Build the application for production.

### Backend

- **Dependencies**: `django`, `djangorestframework`,
- **Commands**:
  - `python manage.py runserver` - Start the Django server.
  - `python manage.py migrate` - Apply database migrations.

