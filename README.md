# Event Management Platform (MERN)

A modern, full-stack event ticketing platform built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to seamlessly browse, register, and pay for events using Razorpay. It features a comprehensive administrative dashboard for event organizers to create and manage both free and paid events.

## 🚀 Key Features

- **User Authentication**: Secure login & registration with JWT and bcrypt.
- **Two-Factor OTP Verification**: 
  - Mandatory Email OTP to activate your account upon registration.
  - Mandatory Email OTP to authorize and secure event ticket booking.
- **Payment Gateway Integration (Razorpay)**:
  - Seamless checkout flow for paid events.
  - "Abandoned Cart" tracking (Failed payments remain in 'Pending' state for follow-up).
- **Role-Based Access Control**: 
  - **Admin**: Create, edit, and delete events. View revenue analytics, confirm pending bookings, and track paid clients.
  - **User**: Browse events, submit booking requests, complete payments, and view personal dashboard.
- **Event Management**: Create events with detailed descriptions, images, dates, categories, and seating capacity limits.
- **Automated Emails**: Real-time email delivery upon successful booking confirmation and OTP requests using Nodemailer.
- **Sleek UI/UX**: Built entirely with React, Tailwind CSS, and polished with micro-interactions.

---

## 💻 Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js
- **Payments**: Razorpay API
- **Mailing**: Nodemailer

---

## 🛠️ Setup Instructions

### 1. Environment Variables Configuration
Create a `.env` file inside the `server/` folder and fill in the necessary keys:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_test_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
```

### 2. Install Dependencies
Open a terminal in the root folder and run:
```bash
npm install
```

### 3. Run the Application (Concurrently)
You can start both the backend server and frontend Vite server together with a single command:
```bash
npm run dev
```
- Backend will run on `http://localhost:5000`
- Frontend will run on `http://localhost:5173` (or 5174)
