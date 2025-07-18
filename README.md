# 📱 FMB Mini App (Offline) — School Monitoring Reimagined 🚀

> Empowering school inspectors to collect accurate, real-time data — even from the remotest corners of the country 🌄

![SwiftChat](https://img.shields.io/badge/Built_on-SwiftChat-00bfff?style=flat-square)
![Offline Support](https://img.shields.io/badge/Offline--First-Enabled-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-orange?style=flat-square)

---

[Live Prototype](https://fmb-demo.lovable.app/)  
[Figma design](https://www.figma.com/design/VoNQ5U0erDfiTZzi5xgvto/FMB-mini-App?node-id=0-1&t=QF2AohzSSJnLkTUi-1)

---

_User: `demo` | School UDISE: `12345678901`, `22446688001`, `22446688002`, 22446688003`, `22446688004`, `22446688005`,  `22446688006`, `22446688007`, `22446688008`, `22446688009`_

## 🎯 Overview

The **FMB Mini App** is a mobile-first, offline-capable survey tool designed for field inspectors (CRC/BRC) to conduct **In-School** and **Open** surveys with ease, even in areas with poor or no network.

Built on the 🧠 **SwiftChat** Mini App platform, it combines real-time syncing, registry-based validation, and modern UX to streamline education monitoring workflows.

---

## 🧭 Key Features

### 🗂️ My Surveys
- View, filter, and search surveys (Open/In-School)
- Supports **Public** and **Private** surveys
- Offline support with manual download per survey
- Start survey directly, even without network (if downloaded)

### 🏫 Offline School UDISE Selection (NEW 🚀)
> Seamless school validation in offline mode
- When downloading an **In-School** survey, users can search and **cache schools** they plan to visit offline
- Locally saved school metadata enables:
  - Auto-validation offline
  - Smooth start of surveys in offline mode
- School cache auto-clears **weekly** in background

### 📋 Start Survey
- UDISE entry required for In-School surveys
- Online: Validated with registry 🟢
- Offline: Validated via format or cached record 🟡
- Supports single or multiple responses based on survey config

### 💾 Save & Sync Responses
- Offline survey entries are stored securely
- Manual sync when back online
- Conflict handling (last-write-wins or user decides)

### 🧾 Download Survey Response as PDF (NEW 🧨)
- After saving a response, users can download a **PDF**
- Works in both offline and online modes
- Shows survey metadata, UDISE, and filled answers

### 🔍 My Responses
- View all completed surveys (Synced / Pending)
- Filter by type, access, or date
- Sync pending responses manually

### ➕ Add Survey
- Add **Private Surveys** by ID (online only)
- Preview before adding

### 👤 Profile
- Displays User ID, Name, Designation
- Secure Logout option

---

## 💡 Offline Mode: What Works and What Doesn’t

| Feature                    | Online ✅ | Offline 🚫 |
|---------------------------|----------|------------|
| View downloaded surveys   | ✅       | ✅         |
| Start survey              | ✅       | ✅ (if downloaded) |
| Validate UDISE            | ✅ (registry) | ✅ (cached/format only) |
| Add new survey            | ✅       | ❌         |
| Download PDF              | ✅       | ✅ (local copy) |
| Sync responses            | ✅       | ❌         |

---

## ⚙️ Tech Stack

| Layer              | Technology                        |
|--------------------|------------------------------------|
| 💬 Platform         | [SwiftChat Mini App](https://swiftchat.ai) |
| ⚙️ Frontend Shell   | HTML, CSS, SwiftChat Components    |
| 🧠 Form Engine      | Embedded WebView (existing FMB form UI) |
| 📦 Local Storage    | Encrypted local storage (IndexedDB / SQLite) |
| 📡 Networking       | Fetch/XHR with offline fallback & sync queue |
| 🛠️ PDF Generation   | jsPDF or Native Export (platform dependent) |
| 🔐 Auth             | Tokenless UID validation `/auth/validate` |
| ☁️ Backend          | SwiftChat backend + Survey Registry API |

---

## 🔄 Weekly Cache Maintenance

Every 7 days, cached UDISE school data is:
- 🧹 Auto-cleared in background (silent)
- ⏱ Triggered on app launch when online

Users are prompted to re-add expected schools if cache is empty during offline use.

---

## 🧪 Edge Case Handling

- ❗ **UDISE not found offline**: Prompt user to reconnect or use a saved UDISE
- 🔐 **Multiple device conflict**: Server prompts to “Resume” or “Start New”
- ⚠️ **Sync race conditions**: Conflict modal with options to overwrite or discard
- 🧨 **Version mismatch**: Auto-migrate or force new download
- 📉 **Storage full**: Prevent save/download with clear user alerts

---

## 🖼️ Screenshots (Preview)

> Add these to the GitHub repo:

- `screenshots/survey_download_with_school_add.png`
- `screenshots/start_survey_offline_validation.png`
- `screenshots/response_saved_confirmation.png`
- `screenshots/download_response_pdf_button.png`

---

## 👥 Contributors

| Name             | Role            |
|------------------|-----------------|
| Aditya Chaudhari | Product Manager |
| Sumit Kumar      | PM/Design Lead  |
| Engineering Team | To be Assigned  |
| Rishabh / Prateek| Inform/Review   |

---

## 🚧 Upcoming Enhancements

- ✅ Automatic school suggestion based on visit history
- 🔁 Background sync trigger (optional)
- 📲 Native push notification for stale cache
- 🧠 AI hints for data anomalies in survey response

---

## 📄 License

MIT License © [Your Organization]

---

> _Built with ❤️ by the SwiftChat + FMB Team — ensuring quality data reaches the system, no matter how far the school is!_



## 🛠️ Developer Quickstart

1. **Clone & Install**  
   ```sh
   git clone https://github.com/<your-username>/fmb-mini-app-offline.git
   cd fmb-mini-app-offline
   npm install


2. **Run Locally**

   ```sh
   npm run dev
   ```
3. **Deploy on Loveable**

   * Push to main branch, link repo to your [Loveable](https://lovable.app) dashboard, and publish!

---

> For feedback, suggestions, or access, drop a line at [inbox.sumitt@gmail.com](mailto:inbox.sumitt@gmail.com)
