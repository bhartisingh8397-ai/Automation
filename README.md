# Digigyapan | Social Media Automation System

Complete full-stack social media automation web application built strictly according to your specifications:
- **Frontend**: Next.js (TypeScript, App Router)
- **Backend**: Python Flask (REST API, Background Post Scheduler)
- **Database**: MySQL (`digiauto_db`) with PyMySQL & SQLAlchemy, with auto-fallback to SQLite
- **Color Palette**: Sleek, high-contrast **Black, Grey, and White** monochrome design
- **Social Media Icons**: Authentic official brand colors for Instagram, Facebook, YouTube, and LinkedIn
- **Typography**: Clean, simple sans-serif typography (`Inter`, system-ui)

---

## Architecture & Workflow

1. **Step 1: Login to Dashboard** — Team authentication modal with secure credential handling.
2. **Step 2: Select Client** — Switch between hospital/clinic clients (Keshav Hospital, Roshni Dental, Noble Hospital, Dermatrixx, + Add Client) with live connection status for Facebook, Instagram, YouTube, and LinkedIn.
3. **Step 3: Upload Video** — Drag & drop or browse video files (MP4, MOV, etc.) with file size (e.g. 85 MB), duration (e.g. 2:15), and preview.
4. **Step 4: Add Caption & Details** — Tabs for General, Instagram, Facebook, YouTube, and LinkedIn with character limits, **AI Caption Generation**, and hashtag management.
5. **Step 5: Choose Platforms** — Checkboxes for Instagram Reels, Facebook Video/Reel, YouTube Video, and LinkedIn Video featuring their genuine brand colors.
6. **Step 6: Schedule Post** — Instant "Publish Now" or "Schedule for Later" with Date, Time, and Time Zone picker.
7. **Step 7: Backend Automation Engine** — 8-step execution pipeline (Webhook Trigger → Save DB → Wait → Media Processing → Official API Publish → Response → DB Update → Dashboard Sync) with live MySQL log stream.
8. **Step 8: Official Platform APIs & Live Previews** — Real-time interactive mockups simulating Instagram Reel, Facebook Video, YouTube Video, and LinkedIn Post.
9. **Step 9: Post Status & Logs Table** — Real-time tracking table displaying Video, Client, Time, Platform Icons, Status badges (`Published`, `Scheduled`, `Partially Failed`, `Failed`), View Links modal, and Retry/Cancel actions.

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v24+
- **Python**: 3.10+ or 3.11+
- **MySQL Server**: (MySQL 8.0 running locally on port 3306)

### 2. Backend Setup (Python Flask)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure your MySQL credentials in .env (if different from root/root)
# MYSQL_USER=root
# MYSQL_PASSWORD=your_password
# MYSQL_DATABASE=digiauto_db

# Run the Flask backend
python run.py
```
> The backend server starts at **`http://localhost:5000`** and automatically initializes the MySQL database `digiauto_db` (or SQLite fallback if MySQL is offline).

### 3. Frontend Setup (Next.js)
```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
> Open **`http://localhost:3000`** in your browser.

---

## Database Configuration
The MySQL schema is provided in `backend/schema.sql`.
To import manually into MySQL via command line:
```bash
mysql -u root -p < backend/schema.sql
```
Or simply start the backend with `python run.py` — it will automatically create and seed all tables for you!
