-- Update Mobile Attendance App project to be more comprehensive and trustworthy.
-- This script safely updates the project if it exists.

UPDATE "Project"
SET
  description = 'An internal, RFID-integrated mobile attendance ecosystem built for high reliability and real-time tracking, resolving manual data entry bottlenecks.',
  content = '### Problem Statement
Prior to this system, the organization relied on manual, paper-based tracking which led to data discrepancies, lost records, and wasted hours during the recap process at the end of each month. There was no real-time visibility into attendance status.

### The Solution
We developed a comprehensive Mobile Attendance Application integrated with an RFID hardware system. It provides an intuitive interface for users to clock in/out, view their history, and submit leave requests, while the admin dashboard offers real-time analytics and one-click monthly reports.

### Tech Stack
- **Frontend:** Next.js (Admin Dashboard), Kotlin (Mobile App)
- **Backend:** Golang (Clean Architecture)
- **Database & Auth:** PostgreSQL, Supabase
- **Hardware Integration:** RFID Scanners via REST APIs

### Concrete Impact
- **100% Elimination of Paper Waste:** Completely digitalized the tracking process.
- **Time Saved:** Saved 10+ hours per week for the HR/Admin team in manual data entry and recap.
- **Improved Accuracy:** Increased attendance tracking accuracy by eliminating "buddy punching" through secure authentication.'
WHERE title ILIKE '%attendance%';
