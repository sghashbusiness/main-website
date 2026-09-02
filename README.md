# SGHASH Web Application — Frontend Handover & KT

Welcome to the SGHASH Web Application project! 

This document serves as a **Knowledge Transfer (KT)** guide for the incoming full-stack engineer. The frontend prototype of this application is **100% complete**. Your primary objective is to integrate this frontend with the actual backend APIs.

---

## 📌 Project Overview
SGHASH is a comprehensive retail management web application designed to handle:
- **Point of Sale (POS) & Checkout:** IMEI scanning, dynamic GST calculations, split payments, and invoice generation.
- **Inventory & Logistics:** Multi-branch stock tracking, inter-store transfers, bulk ingestion, and single-unit manual entry.
- **Executive Analytics:** Sales metrics, tender splits, and branch performance comparisons.
- **Staff & Compliance:** Staff directory, IAM (Identity and Access Management), and GSTR1 exports.

### Tech Stack
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid, custom responsive layouts)
- **Icons:** `lucide-react`
- **Routing:** `react-router-dom`
- **Charts:** `chart.js` & `react-chartjs-2`

---

## 🏗️ Architecture & Data Flow (Crucial for Integration)

To make backend integration as seamless as possible, the frontend strictly separates the UI layer from the data layer. 

**Data Flow:**
`React Components (UI)  →  Services (src/services/*.js)  →  Mock Database (src/mock-data/db.js)`

1. **The UI Components:** Do **NOT** contain any hardcoded business data. They simply call async functions and wait for data to render. You generally **do not need to edit component files** to integrate the backend.
2. **The Services Layer (`src/services/`):** This is the bridge. Right now, these files simulate network latency (`await delay()`) and return data structured like API responses `{ success: true, data: ..., error: null }`.
3. **The Mock Database (`src/mock-data/db.js`):** A single file containing all placeholder data for the entire application. 

---

## 🚀 Backend Integration Guide

As the full-stack engineer, you will wire up the frontend to your real backend. Follow these steps:

### Step 1: Understand the Data Contracts
Open `src/mock-data/db.js`. This file is extremely well-commented and is organized into 7 sections (Users, Branches, GST, Inventory, Sales, Staff, Transfers). 
- Look at the data structures (e.g., `inventory` arrays, `salesMetrics` objects). This is the exact JSON structure the frontend expects from your APIs.
- Each section has a comment like `// TODO (backend): Replace with GET /api/...` to give you an idea of the required endpoints.

### Step 2: Swap the Service Functions
Go into the `src/services/` directory. You will find files like:
- `authService.js`
- `inventoryService.js`
- `posService.js`
- `analyticsService.js`
- `staffService.js`

**Your Task:** 
Replace the internal logic of these functions with real HTTP requests (using `fetch` or `axios`). 

*Example: Changing `getInventory` in `inventoryService.js`*
```javascript
// OLD (Current Mock Logic)
export async function getInventory(branch = 'all') {
  await delay(400); // simulated latency
  const items = inventory.map(...); // pulling from mock db
  return { success: true, data: items, error: null };
}

// NEW (Real API Logic)
export async function getInventory(branch = 'all') {
  try {
    const response = await fetch(`/api/inventory?branch=${branch}`);
    const data = await response.json();
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}
```

### Step 3: Handle Authentication & Tokens
In `src/services/authService.js`, the `login` function currently fakes a JWT. 
- Implement your real login endpoint.
- Store the real JWT securely (e.g., `localStorage` or `httpOnly` cookies).
- Ensure that subsequent API calls in other services include this token in the `Authorization: Bearer <token>` header.

### Step 4: Delete the Mock Database
Once all services have been updated to call your real backend APIs, the mock database is no longer needed.
- Delete `src/mock-data/db.js`
- Delete the `src/mock-data/` folder entirely.

---

## 💻 Local Development Setup

To run the frontend locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *The app will typically run on `http://localhost:3111/` or whatever port Vite assigns.*

3. **Build for production:**
   ```bash
   npm run build
   ```

---
**Summary:** The frontend is beautiful, responsive, and ready to go. Your playground is exclusively inside `src/services/`. Good luck!
