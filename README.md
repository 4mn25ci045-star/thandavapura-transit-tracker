🚌 Thandavapura Transit Tracker

Smart • Secure • Real-Time College Bus Tracking Platform

Thandavapura Transit Tracker is a secure web-based college transportation platform designed for MIT Thandavapura. It connects students, teachers, drivers, and authorized college administrators through a centralized system for real-time bus tracking, college information, academic schedules, and issue reporting.

«🚀 Built with Lovable • Designed for real-world campus transportation»

---

🌐 Project Overview

Thandavapura Transit Tracker provides a unified digital platform for managing and tracking college transportation.

Students can securely access their account, search for their assigned bus or route, view its live location, calculate the remaining distance and ETA, receive stop-near notifications, and contact the driver.

Administrators can manage academic and college information, while teachers have a dedicated secure access system.

🎯 Core Goals

- 📍 Real-time college bus tracking
- 🔐 Secure authenticated access
- 🚌 Bus and route management
- ⏱️ Dynamic ETA calculation
- 🔔 Stop-near notifications
- 📢 College announcements and updates
- 📅 Academic calendars
- 🕐 Class timetables
- 📝 Exam timetables
- 🚨 Student issue reporting
- 👨‍🏫 Dedicated teacher access
- 👨‍💼 Secure administration controls

---

✨ Key Features

🔐 Secure Authentication

The application uses authenticated access to protect private transportation and college information.

Student Login

Students authenticate using:

- Unique USN
- USN validation beginning with "4MN"
- One-Time Password (OTP)
- Linked phone/email verification
- Optional Google authentication

Only authenticated users can access their private dashboard.

---

🚌 Real-Time Bus Tracking

The Travel section provides live transportation information.

Features

- 🔎 Search by bus number
- 🔎 Search by route number
- 📍 Real-time bus location
- 🗺️ Interactive map
- 📏 Remaining distance
- ⏱️ Estimated arrival time
- 📌 Current user location
- 🔄 Automatic position updates
- 📞 Direct driver call
- 🎙️ Driver voice messaging
- 🔌 Connect/disconnect bus tracking

Bus locations can be updated using polling or WebSocket communication, allowing the marker to move continuously while the ETA is recalculated automatically.

---

🔔 Stop-Near Notification

Students can configure a preferred distance from their stop.

For example:

«Your bus is 500 meters away from your stop.»

The system monitors the live bus position and triggers a notification when the bus enters the configured distance range.

---

📚 College Information

The dashboard contains separate sections so users can access only the information relevant to that section.

📢 College Updates

Administrators can publish:

- Announcements
- Notices
- Important information
- Photos
- PDFs
- Documents

Content can be organized according to:

Year → Branch → Information

---

📅 Calendars

Academic calendars can be organized by:

- Academic year
- Branch
- Semester

---

🕐 Time Table

Students can access their class timetable according to:

Year → Branch → Semester

---

📝 Exam Time Table

Exam schedules can be published and organized by:

- Year
- Branch
- Semester
- Examination type

---

🚨 Issues

All authenticated users can report college or transportation-related problems.

Possible issue categories include:

- 🚌 Bus problems
- 🛣️ Route problems
- ⏰ Timing issues
- 📍 GPS/tracking problems
- 🏫 College-related issues
- 🔧 Other issues

Users can submit an issue and administrators can review and manage reported problems.

---

👨‍💼 Administration

Administrators have exclusive permissions for managing official college content.

Admin capabilities

- ➕ Upload documents
- 📷 Upload images
- 📄 Upload PDFs
- 📢 Publish college updates
- 📅 Manage calendars
- 🕐 Manage timetables
- 📝 Manage exam timetables
- 🚌 Manage bus information
- 👨‍🏫 Manage teacher accounts
- 🚨 Review reported issues

Students cannot upload or modify official college content.

---

👨‍🏫 Teacher Access

Teachers have a separate authentication system.

Teacher accounts use:

- Unique Teacher ID
- Biometric authentication
- Secure authorization

Adding a new teacher requires authorized biometric approval from the designated system administrator.

---

🛡️ GPS Security

Sensitive GPS and transportation-management functionality is protected using biometric authentication.

The system is designed to support up to five authorized biometric identities for protected GPS administration.

«⚠️ Biometric verification should be implemented through the device's secure authentication APIs. The application should never store raw fingerprint or Face ID data.»

---

🗺️ Private Bus Dashboard

After successful authentication, users receive a private transportation dashboard.

Users can:

1. Enter a unique GPS/Bus ID
2. Connect to a specific bus
3. View the bus on the map
4. Monitor distance
5. Monitor ETA
6. Receive stop-near notifications
7. Disconnect the bus
8. Manage connected buses

Each dashboard is protected by authentication so unauthorized users cannot access another user's transportation information.

---

🔄 Real-Time Tracking Architecture

The application supports continuous bus position updates.

GPS Device
    │
    ▼
Bus Location Service
    │
    ├── Polling
    │
    └── WebSocket
          │
          ▼
     Backend Server
          │
          ▼
   Real-Time Dashboard
          │
          ▼
     Interactive Map
          │
          ├── Bus Position
          ├── Distance
          └── ETA

When a new GPS position is received:

New GPS Position
       ↓
Update Bus Marker
       ↓
Calculate Remaining Distance
       ↓
Recalculate ETA
       ↓
Check Stop Distance
       ↓
Trigger Notification

---

🏗️ Application Structure

Thandavapura Transit Tracker
│
├── 🔐 Authentication
│   ├── Student Login
│   ├── Teacher Login
│   ├── Admin Login
│   ├── OTP Authentication
│   └── Biometric Authentication
│
├── 🚌 Travel
│   ├── Bus Search
│   ├── Route Search
│   ├── Live Map
│   ├── Distance
│   ├── ETA
│   ├── Driver Call
│   └── Stop Notification
│
├── 📢 College Updates
│
├── 📅 Calendars
│
├── 🕐 Time Table
│
├── 🚨 Issues
│
├── 📝 Exam Time Table
│
└── ⚙️ Administration
    ├── Content Management
    ├── Bus Management
    ├── Teacher Management
    └── Issue Management

---

🔐 Role-Based Access

Role| Travel| Updates| Calendar| Timetable| Issues| Admin
Student| ✅| 👁️| 👁️| 👁️| ✅| ❌
Teacher| ✅| 👁️| 👁️| 👁️| ✅| ❌
Admin| ✅| ✏️| ✏️| ✏️| ✅| ✅

👁️ View
✏️ Manage
❌ Restricted

---

💻 Technology

The project is developed as a modern web application.

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Responsive UI

Backend / Services

- Authentication
- Database
- Real-time communication
- GPS tracking
- File/document management

Maps & Location

- Interactive map
- GPS coordinates
- Distance calculation
- ETA calculation
- Real-time marker updates

Development

- Git
- GitHub
- Lovable
- npm
- Node.js

---

🎨 UI Design

The application opens with an animated MIT Thandavapura identity screen.

┌──────────────────────────────┐
│                              │
│            MIT               │
│        Thandavapura          │
│                              │
│      Secure • Connected      │
│                              │
└──────────────────────────────┘

Design Direction

- 🖤 Black background
- 🟠 Orange MIT branding
- ⚪ White typography
- ✨ Smooth animations
- 📱 Mobile-friendly interface
- 💻 Responsive desktop dashboard

---

📸 Screenshots

«Add your actual application screenshots here.»

🔐 Login

/screenshots/login.png

🏠 Dashboard

/screenshots/dashboard.png

🚌 Live Bus Tracking

/screenshots/live-tracking.png

📢 College Updates

/screenshots/college-updates.png

📅 Calendar

/screenshots/calendar.png

🕐 Timetable

/screenshots/timetable.png

🚨 Issues

/screenshots/issues.png

---

🚀 Getting Started

Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

---

Clone the Repository

git clone <your-repository-url>
cd thandavapura-transit-tracker

Install Dependencies

npm install

Start Development Server

npm run dev

The application will be available through the local development URL shown by Vite.

---

🌐 Live Demo

🚀 Live Demo: Coming Soon

📦 GitHub Repository: This repository

---

🔮 Future Improvements

Planned improvements include:

- 📱 Android application
- 🍎 iOS application
- 📡 Dedicated GPS hardware integration
- 🚌 Driver mobile application
- 🔔 Push notifications
- 🗺️ Advanced route visualization
- 📊 Admin analytics dashboard
- 🚌 Multiple bus tracking
- 📈 Transportation statistics
- ☁️ Cloud deployment
- 🔒 Advanced security monitoring

---

👨‍💻 Project

Thandavapura Transit Tracker

A college transportation and information management platform designed for MIT Thandavapura.

Built with ❤️ for smarter campus transportation.

---

📜 License

This project is intended for educational and institutional use.

---

⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

<img width="2560" height="1440" alt="1000098400" src="https://github.com/user-attachments/assets/aa67e589-cd0b-4fd8-9ea0-6c18a764035a" />

