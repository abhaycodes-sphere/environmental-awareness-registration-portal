# 🌿 Environmental Awareness Registration Portal

> A full-stack student registration web app built from scratch using HTML, CSS, JavaScript, and Google Apps Script — as part of a real-world community initiative.

---

## 🔥 Live Demo

🌐 **[View Live Site →]( )**
 
---

## 💡 About This Project

I built this project as part of the **Times of India — Tree Championship Campaign (TCTC)**, an environmental awareness initiative at my college. The goal was simple: create a fast, mobile-friendly registration portal where students could sign up for the campaign — and have their data automatically saved to a Google Sheet in real time, without any paid backend or server.

This was my first end-to-end project where I handled everything myself — UI design, form validation, backend integration, error debugging, and deployment.

---

## 🛠️ What I Built

A **3-page single-page application** with:

- **Landing Page** — Hero section with animated blobs, campaign stats, and CTA button
- **Registration Form** — Real-time validation, error handling, loading spinner
- **Success Page** — Confirmation screen with redirect to TCTC Quiz

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend | Google Apps Script (serverless) |
| Database | Google Sheets (as a live database) |
| Hosting | GitHub Pages |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts — Inter + Playfair Display |

---

## 🧠 What I Learned Building This

This project taught me things no tutorial ever explained clearly:

**CORS & fetch() behavior**
I ran into a real-world bug where `mode: "no-cors"` was silently blocking my requests from reaching Google Apps Script. The form showed "success" but zero data was being saved. I debugged it by reading execution logs, identified that `no-cors` prevents redirect-following, and fixed it by switching to `redirect: "follow"`.

**Standalone vs Bound Apps Script**
`SpreadsheetApp.getActiveSpreadsheet()` only works when a script is directly bound to a Sheet. My script was standalone — so it returned `undefined` and crashed silently. I fixed it using `SpreadsheetApp.openById()` with the Sheet ID from the URL.

**Serverless Architecture**
I used Google Apps Script as a free serverless backend. It receives GET requests, parses URL parameters, and writes rows to a Google Sheet — no Node.js, no Express, no database setup needed.

**Form UX Design**
Built inline error messages, live blur-based validation, a loading spinner that disables the submit button during network calls, and a global error banner — all without any UI library.

---

## 📁 Project Structure

```
toi-registration/
├── index.html       → Full SPA (Landing + Form + Success pages)
├── style.css        → Custom CSS with animations, glassmorphism, responsive design
├── script.js        → Form logic, validation, fetch() to Google Apps Script
└── Code.gs          → Google Apps Script backend (not deployed here, runs on Google)
```

---

## 🚀 Features

- ✅ Real-time field validation with custom error messages
- ✅ Mobile responsive design
- ✅ Animated hero section with glassmorphism cards
- ✅ Loading spinner with disabled state during submission
- ✅ Auto-styled header row in Google Sheets on first submission
- ✅ IST timestamp on every entry
- ✅ XSS sanitization on backend before saving
- ✅ Graceful error handling for network failures

---

## 🔗 How the Backend Works

```
Student fills form
       ↓
JavaScript collects data → builds URL query string
       ↓
fetch() sends GET request to Google Apps Script Web App URL
       ↓
Apps Script doGet(e) receives parameters
       ↓
Opens Google Sheet by ID → appends new row
       ↓
Returns JSON: { "status": "success" }
       ↓
Frontend shows Success Page ✅
```

No database. No server. No monthly cost. Just Google's free infrastructure.

---

## 🐛 Bugs I Fixed (Real Debugging Experience)

**Bug 1 — Data not saving despite "success" response**

The fetch was using `mode: "no-cors"` which returns an opaque response. Google Apps Script redirects requests before executing — `no-cors` silently drops that redirect. Fixed by removing `no-cors` and adding `redirect: "follow"`.

**Bug 2 — `TypeError: Cannot read properties of undefined (reading 'getSheetByName')`**

`getActiveSpreadsheet()` returned `undefined` because my Apps Script was standalone (not created from inside the Sheet). Fixed by replacing it with `openById("SHEET_ID")`.

Both of these took hours to debug. Now I know exactly how fetch modes and Apps Script deployment work under the hood.

---

## 📊 Data Collected

Each submission saves:

| Column | Field |
|---|---|
| Timestamp | Auto-generated (IST) |
| Student Name | Required |
| Class | Required |
| School Name | Required |
| City | Required |
| State | Required |
| Parent Name | Optional |
| Instagram ID | Optional |

---

## 🙏 Acknowledgements

Built for the **Times of India Tree Championship Campaign** — an environmental awareness drive organized through our college's Community Development Project.

---

*Made with focus, frustration, and a lot of console.log() — by Abhay* 🌱