# Campus & Hostel Issue Reporting Platform

A centralized platform enabling students in hostels and college campuses to report day-to-day problems (water, Wi-Fi, electricity, cleanliness, maintenance) and allowing college/hostel authorities to prioritize, assign, and track them through an admin dashboard.

---

## 📌 Problem Statement

Students frequently encounter maintenance and utility issues in hostels and academic blocks. When reported verbally or via informal messaging groups, complaints get lost, unresolved, or untracked. This project provides a single transparent system:
- **Students** log complaints, upload photos, and observe real-time resolution progress.
- **Authorities** view consolidated issues, filter by category/urgency, assign tasks to maintenance teams, and update statuses.

---

## 🚀 Core MVP Workflow

```text
Student reports issue
         ↓
Admin reviews & verifies complaint
         ↓
Admin assigns issue to department/team (e.g., IT, Plumbing, Electrical)
         ↓
Issue marked In Progress
         ↓
Issue Resolved with confirmation details
         ↓
Student receives in-app update & notification
```

---

## 🗂️ Project Structure

```text
campus-issue-tracker/
├── backend/
│   ├── config/
│   │   ├── db.js                   # Database connection configuration
│   │   └── upload.js               # File storage & upload configuration
│   ├── models/
│   │   ├── User.js                 # Student & Admin account schemas
│   │   ├── Issue.js                # Complaint data schema
│   │   ├── IssueHistory.js         # Audit log & timeline tracking
│   │   └── Notification.js         # In-app notifications
│   ├── controllers/
│   │   ├── authController.js       # Register & login authentication logic
│   │   ├── issueController.js      # Student issue creation & lookup
│   │   ├── adminController.js      # Issue triage, assignment, status updates
│   │   └── notificationController.js # Notification retrieval & read status
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── issueRoutes.js          # /api/issues
│   │   ├── adminRoutes.js          # /api/admin
│   │   └── notificationRoutes.js   # /api/notifications
│   ├── middlewares/
│   │   ├── authMiddleware.js       # JWT authentication & session verification
│   │   ├── roleMiddleware.js       # Admin authorization guard
│   │   └── uploadMiddleware.js     # Image attachment parser (multer/multipart)
│   ├── uploads/                    # Local storage for complaint photo attachments
│   ├── .env.example                # Backend environment configuration template
│   └── package.json
│
├── frontend/
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── assets/                 # Icons and styles
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx          # Header with user profile & navigation
│   │   │   │   ├── Sidebar.jsx         # Navigation sidebar for admin management
│   │   │   │   ├── StatusBadge.jsx     # Visual indicator for issue status
│   │   │   │   ├── NotificationBell.jsx# In-app notification bell & dropdown
│   │   │   │   └── ProtectedRoute.jsx  # Role-based route guard
│   │   │   ├── student/
│   │   │   │   ├── IssueCard.jsx       # Issue summary card
│   │   │   │   ├── IssueForm.jsx       # Issue creation form with image picker
│   │   │   │   └── IssueTimeline.jsx   # Visual audit trail of issue progress
│   │   │   └── admin/
│   │   │       ├── StatsOverview.jsx   # Metrics cards (Total, In Progress, Resolved)
│   │   │       ├── IssueTable.jsx      # Sortable/filterable issue table
│   │   │       ├── FilterBar.jsx       # Filter by category, location, priority
│   │   │       └── AssignModal.jsx     # Assignment & department allocation modal
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx# List of student's reported complaints
│   │   │   │   ├── ReportIssuePage.jsx # New complaint form page
│   │   │   │   └── IssueDetailsPage.jsx# Details, timeline, and photo view
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx  # Metrics and recent complaint activity
│   │   │       ├── ManageIssuesPage.jsx# Full complaint management interface
│   │   │       └── AdminIssueView.jsx  # Individual complaint admin action page
│   │   ├── services/
│   │   │   ├── apiClient.js        # Base API client
│   │   │   ├── authService.js      # Authentication endpoints
│   │   │   ├── issueService.js     # Issue endpoints
│   │   │   └── adminService.js     # Admin endpoints
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global authentication state
│   │   │   └── NotificationContext.jsx # Notification state
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx       # Application router
│   │   └── App.jsx                 # Root UI component
│   ├── .env.example                # Frontend environment configuration template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🏷️ Predefined Categories & Statuses

### Categories
- 🚿 Water
- 📶 Wi-Fi / Internet
- ⚡ Electricity
- 🛠️ Maintenance
- 🧹 Cleanliness
- 🚽 Washroom
- 🛏️ Hostel
- 🏫 Classroom
- 🔒 Security
- 📦 Other

### Status Pipeline
1. **Submitted**: Issue reported by student.
2. **Under Review**: Administrator has reviewed the submission.
3. **Assigned**: Delegated to responsible department (e.g., Plumbing, IT, Electrical).
4. **In Progress**: Work is actively underway.
5. **Resolved**: Maintenance complete and verified.
*(Or **Rejected** if not a valid complaint).*
