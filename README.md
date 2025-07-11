# 🌟 FMB Mini-App (Offline) – Prototype

[Live Prototype on Loveable ➡️](https://fmb-demo.lovable.app/)  
_User: `demo` | School UDISE: `12345678901`_

---

## 🧭 Overview

FMB is a next-gen, lightweight **mini-app for Swiftchat**, empowering field users to **download, complete, and submit surveys** — even in low or no-connectivity scenarios.  
Admin and field roles are clearly separated, with offline capabilities, encrypted local data, and seamless UX.

---

## 👥 Users & Access

- **Field User:**  
  - Login with User ID (+ optional PIN)  
  - See only their assigned surveys  
  - Download for offline, submit, view their history

- **Admin:**  
  - Manage user hierarchy, access, and parameters  
  - Configure what each field user can access

---

## 🚀 Core Features

### 1. Authentication  
- Secure login using User ID  
- Optional PIN for extra security

### 2. **My Surveys**  
- **Landing:** Paginated, filtered list of surveys  
- **Filters:**  
  - Type: Open / In School  
  - Access: Public / Private  
  - Status: Not Started / In Progress / Completed  
- **Card UI:** Shows survey ID, name, desc, languages, type, access  
- **Actions:**  
  - Download for Offline  
  - Start Survey (with UDISE check for "In School" surveys)

### 3. **My Response**  
- See all submitted responses  
- Filter/search by survey, date, status  
- Sync status for each response  
- Download (online-only)

### 4. **Add Survey**  
- Add private surveys by ID (online only)  
- Instantly appears in My Surveys

### 5. **Profile**  
- Top-right: user ID, name, role, logout

### 6. **Offline-First Magic**  
- **Download for Offline:** Store surveys locally  
- **Offline Mode:**  
  - Access only downloaded content  
  - No new survey addition  
  - See only latest (pending) responses  
- **Sync:** One-tap manual sync for responses, with status feedback

---

## 🔗 Edge Cases & User Guidance

- Empty lists: Friendly “No surveys available” or “No matches” messages  
- Download failure: Clear error & retry  
- Validation failure (school, UDISE): Up to 3 tries, then “Contact Admin”  
- Storage full: Warning and block further actions  
- Sync failure: Retry per survey  
- Offline start w/o download: Prompt to download first

---

## 🏗️ Technical Stack

- **Frontend:** Modern, modular mini-app, built for the Swiftchat ecosystem  
- **Offline Layer:** Encrypted local DB (surveys, responses)  
- **Sync:** Manual "Sync" button with last-write-wins conflict resolution  
- **Progressive UI:**  
  - Spinners, banners for online/offline status  
  - Toasts, modals for feedback  
- **Export:** Download response as PDF (online only)

**Hosted on:**  
[![Loveable](https://avatars.githubusercontent.com/u/131767289?s=48)](https://lovable.app) – All-in-one prototyping & hosting for rapid, secure deployments.

---

## ✨ Screens / Wireframes

> *Coming soon! Check the [Live Demo](https://fmb-demo.lovable.app/) for hands-on flow.*

---

## 📜 Product Requirement Doc (PRD) – Quick Glance

| **Module**     | **Online** | **Offline** |
|----------------|------------|-------------|
| My Surveys     | All features | Only downloaded surveys |
| Profile        | View & logout | View & logout |
| Filters        | All filters | All filters |
| Start Survey   | UDISE validation | UDISE validate on sync |
| My Response    | All, download response | Latest only, sync pending |
| Add Survey     | Search + add | Disabled |

**See full PRD below for detailed specs and user flows.**

---

## 🛠️ Developer Quickstart

1. **Clone & Install**  
   ```sh
   git clone https://github.com/<your-username>/fmb-mini-app-offline.git
   cd fmb-mini-app-offline
   npm install


2. **Run Locally**

   ```sh
   npm start
   ```
3. **Deploy on Loveable**

   * Push to main branch, link repo to your [Loveable](https://lovable.app) dashboard, and publish!

---

## 📖 Detailed PRD & User Flows

<details>
<summary>Click to expand – full PRD inline 👇</summary>

### 1. Login & Authentication

* User enters ID, optional PIN
* Authenticated session scoped to their hierarchy

### 2. Survey List & Download

* User sees only allowed surveys
* Filters for quick access (type, access, status)
* **Download for Offline:** Spinner → Downloaded state

### 3. Survey Taking

* In School: UDISE entry required, verified live or at sync
* Offline mode: Must pre-download

### 4. My Response

* All responses listed (filtered, paginated)
* Sync status visible per response (Synced / Pending)
* Downloadable as PDF (online only)

### 5. Add Survey

* Only online
* Disabled offline with modal prompt

### 6. Profile

* View user info, logout

### 7. Offline/Online UI

* Persistent banner
* Disabled actions as appropriate

### 8. Edge Cases

* Empty, error, storage, network, validation flows with user guidance

</details>

---

## 💡 Roadmap / Suggestions

* [ ] Deep-linking for survey sharing
* [ ] Push notification for sync reminders
* [ ] Multi-language support expansion

---

## 👩‍💻 Contributors

* **Product, Design, Dev:** [Sumit](https://www.linkedin.com/in/in-sumit) 
* **Prototype Hosting:** [Loveable](https://lovable.app)

---

> For feedback, suggestions, or access, drop a line at [inbox.sumitt@gmail.com](mailto:inbox.sumitt@gmail.com)
