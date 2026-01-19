# DeepMine AI CRM - Testing Checklist

## 🔐 Authentication & Access

### Login Tests
- [ ] Login with super admin credentials: `admin@deepmineai.vip`
- [ ] Verify successful redirect to dashboard
- [ ] Check that admin token is set in cookies
- [ ] Verify session persists after page refresh
- [ ] Test logout functionality

### CRM Access
- [ ] Access CRM dashboard: `/admin/crm/dashboard`
- [ ] Verify CRM staff can access allowed pages
- [ ] Verify proper role-based restrictions

---

## 📊 CRM Dashboard (`/admin/crm/dashboard`)

### Page Load
- [ ] Dashboard loads without errors
- [ ] All statistics display correctly
- [ ] Charts/graphs render properly
- [ ] No console errors

### Statistics Verification
- [ ] **Users**: Total, Active, New Today, New This Week
- [ ] **KYC**: Pending count, Approved today/week
- [ ] **Withdrawals**: Pending count and total amount
- [ ] **Tickets**: Open count, Assigned count, Resolved today
- [ ] **Tasks**: My pending, In progress, Completed today
- [ ] **Staff**: Total active, Online now

### Navigation Links
- [ ] All sidebar links work correctly
- [ ] Quick action cards (if any) navigate properly
- [ ] Ticket badge shows correct count (should show 2 open tickets from test data)
- [ ] Task badge shows correct count
- [ ] KYC badge shows correct count

---

## 👥 Staff Management (`/admin/crm/staff`)

### View Staff List
- [ ] Staff list loads correctly
- [ ] Shows both test staff members (Aleena, Rayhan)
- [ ] Displays full name, email, role
- [ ] Shows active/inactive status
- [ ] Permission badges visible

### Create New Staff
- [ ] Click "+ Add Staff Member" button
- [ ] Fill in all required fields (name, email, password)
- [ ] Select role (Super Admin / CRM Staff)
- [ ] Toggle permissions checkboxes
- [ ] Submit form successfully
- [ ] Verify new staff appears in list
- [ ] Check activity log for creation entry

### Edit Staff
- [ ] Click on existing staff member
- [ ] Modify details (name, email, permissions)
- [ ] Save changes successfully
- [ ] Verify changes reflected in list
- [ ] Check activity log for update entry

### Staff Profile Page
- [ ] Click "View Profile" on staff member
- [ ] Profile page loads at `/admin/crm/staff/:id`
- [ ] All staff details display correctly
- [ ] Navigation includes Support Tickets link
- [ ] Activity history shows staff actions

### Staff Permissions
- [ ] Verify 17 permission checkboxes available:
  - can_view_dashboard
  - can_view_staff, can_create_staff, can_edit_staff, can_delete_staff
  - can_view_tasks, can_create_tasks, can_edit_tasks, can_delete_tasks
  - can_view_kyc, can_approve_kyc, can_reject_kyc
  - can_view_withdrawals, can_approve_withdrawals
  - can_view_deposits
  - can_view_referrals
  - can_view_activity_logs
  - can_view_reports

---

## 📋 Task Management (`/admin/crm/tasks`)

### Kanban Board
- [ ] Page loads with Kanban columns
- [ ] 4 columns visible: To Do, In Progress, Review, Done
- [ ] Task cards display correctly
- [ ] Empty states show when columns are empty

### View Tasks
- [ ] Tasks display with all details:
  - Title and description
  - Priority indicator (color-coded)
  - Assigned staff member
  - Due date
  - Status
- [ ] Task count badges show correct numbers

### Create New Task
- [ ] Click "+ New Task" button
- [ ] Fill in task details:
  - Title (required)
  - Description
  - Priority (Urgent/High/Medium/Low)
  - Status (To Do/In Progress/Review/Done)
  - Assigned to (staff dropdown)
  - Due date
  - Estimated hours
- [ ] Submit successfully
- [ ] Verify task appears in correct column
- [ ] Check activity log

### Edit Task
- [ ] Click on task card to open details
- [ ] Modify any field
- [ ] Save changes
- [ ] Verify updates reflected immediately

### Drag & Drop
- [ ] Drag task card from one column to another
- [ ] Verify visual feedback during drag
- [ ] Drop in target column
- [ ] Verify task moves successfully
- [ ] Check that status updates automatically
- [ ] Confirm activity logged

### Task Filters
- [ ] Filter by priority
- [ ] Filter by assigned staff
- [ ] Filter by status
- [ ] Search by task title/description

### Task Statistics
- [ ] Click "Stats" button
- [ ] Verify counts by status
- [ ] Verify counts by priority
- [ ] Check completion rates

---

## 🎫 Support Tickets (`/admin/crm/tickets`)

### View Tickets List
- [ ] Tickets page loads successfully
- [ ] Table displays all 6 test tickets
- [ ] Columns show: Ticket #, Customer, Subject, Status, Priority, Assigned To, Messages, Created
- [ ] Status badges color-coded correctly:
  - Open (blue)
  - In Progress (orange)
  - Waiting (purple)
  - Resolved (green)
  - Closed (gray)
- [ ] Priority flags color-coded correctly:
  - Urgent (red)
  - High (orange)
  - Medium (blue)
  - Low (gray)

### Test Data Verification
Verify these 6 tickets are visible:
- [ ] **TKT-2024-0001**: "Cannot login to account" (Open, Urgent)
- [ ] **TKT-2024-0002**: "Withdrawal pending for 3 days" (In Progress, High)
- [ ] **TKT-2024-0003**: "Question about Gold package benefits" (Waiting, Medium)
- [ ] **TKT-2024-0004**: "How to change email address?" (Resolved, Low)
- [ ] **TKT-2024-0005**: "KYC documents rejected" (Open, High)
- [ ] **TKT-2024-0006**: "Referral bonus not received" (Closed, Medium, 5-star rating)

### Filters & Search
- [ ] Filter by Status (try "Open", "In Progress", etc.)
- [ ] Filter by Priority (try "Urgent", "High", etc.)
- [ ] Filter by Assignee (select staff member)
- [ ] Search by ticket number (e.g., "TKT-2024-0001")
- [ ] Search by subject (e.g., "withdrawal")
- [ ] Search by customer email
- [ ] Verify results update correctly
- [ ] Clear filters work

### Create New Ticket
- [ ] Click "+ New Ticket" button
- [ ] Fill in form:
  - Customer Email (required)
  - Customer Name
  - Subject (required)
  - Description (required)
  - Priority (Low/Medium/High/Urgent)
  - Category (e.g., Technical, Billing, KYC)
  - Assign To (staff dropdown)
- [ ] Submit successfully
- [ ] Verify unique ticket number generated (TKT-YYYY-####)
- [ ] Ticket appears in list
- [ ] Check activity log

### View Ticket Details
- [ ] Click on any ticket row
- [ ] Modal opens with full details
- [ ] Ticket number and subject displayed
- [ ] Customer info visible
- [ ] Description shows completely
- [ ] All metadata displayed (status, priority, dates, assignee)
- [ ] Created and updated timestamps shown

### Message Thread
- [ ] Messages display in chronological order
- [ ] Public messages clearly visible
- [ ] Internal notes have yellow border/badge
- [ ] Author name and timestamp shown
- [ ] Staff icon vs. customer icon differentiated
- [ ] Empty state shows if no messages

### Test Message Thread Examples
Check these tickets have messages:
- [ ] **TKT-2024-0002**: 2 messages (1 public, 1 internal note)
- [ ] **TKT-2024-0003**: 2 messages (staff reply + customer response)
- [ ] **TKT-2024-0004**: 3 messages (complete resolved conversation)
- [ ] **TKT-2024-0006**: 2 messages (staff resolution + customer thanks)

### Add Message/Reply
- [ ] Type message in text area
- [ ] Check "Internal note" checkbox
- [ ] Click "Send" button
- [ ] Message appears in thread immediately
- [ ] Internal note has yellow border
- [ ] Public message has no special marking
- [ ] Activity logged

### Update Ticket
- [ ] Change status dropdown (Open → In Progress)
- [ ] Change priority dropdown (Medium → High)
- [ ] Change assignee dropdown
- [ ] Verify updates save automatically
- [ ] Check timestamps update
- [ ] Verify activity logged
- [ ] First response timestamp set correctly
- [ ] Resolution timestamp set when resolved
- [ ] Closed timestamp set when closed

### Delete Ticket
- [ ] Click red "Delete Ticket" button
- [ ] Confirmation dialog appears with warning
- [ ] Warning text clearly states what will be deleted
- [ ] Click "OK" to confirm
- [ ] Success message shows
- [ ] Ticket removed from list
- [ ] Modal closes automatically
- [ ] Activity log shows deletion with 'warning' severity

### Ticket Statistics
- [ ] Click "Stats" button
- [ ] View counts by status
- [ ] View counts by priority
- [ ] Check average response time
- [ ] Check average resolution time

### Pagination
- [ ] Create more than 20 tickets (if needed for testing)
- [ ] Verify pagination controls appear
- [ ] Click "Next" to go to page 2
- [ ] Click "Previous" to go back
- [ ] Page numbers display correctly
- [ ] "Showing X-Y of Z tickets" text correct

---

## 📜 Activity Logs (`/admin/crm/activity-logs`)

### View Activity Logs
- [ ] Page loads successfully
- [ ] Recent activities display in table
- [ ] Columns: Date/Time, Staff, Action, Resource, Description, Severity

### Activity Types
Verify these activities are logged:
- [ ] Staff created/updated/deleted
- [ ] Tasks created/updated/status changed
- [ ] Tickets created/updated/deleted
- [ ] Messages added to tickets
- [ ] Status changes logged
- [ ] Assignment changes logged

### Filters
- [ ] Filter by date range
- [ ] Filter by staff member
- [ ] Filter by action type
- [ ] Filter by severity (info/warning/error)
- [ ] Search in description

### Activity Details
- [ ] Click on activity row
- [ ] View full details
- [ ] Metadata shows correctly
- [ ] Timestamps accurate

---

## 🔗 Navigation Consistency

### Sidebar Navigation (All Pages)
Verify navigation is consistent on:
- [ ] `/admin/crm/dashboard`
- [ ] `/admin/crm/staff`
- [ ] `/admin/crm/staff/:id` (profile page)
- [ ] `/admin/crm/tasks`
- [ ] `/admin/crm/tickets`
- [ ] `/admin/crm/activity-logs`

### Navigation Links Present
On EVERY CRM page, verify these links exist:
- [ ] **Main Section**:
  - Dashboard
- [ ] **CRM Section**:
  - Staff
  - Tasks
  - Support Tickets ← NEW!
  - Activity Logs
- [ ] **Admin Section**:
  - KYC
  - Withdrawals
  - Reports

### Active State
- [ ] Current page link is highlighted/active
- [ ] Active indicator (border/background) visible
- [ ] Non-active links have hover effect

---

## 📱 UI/UX Polish

### Visual Consistency
- [ ] All pages use same color scheme (gray-900 dark theme)
- [ ] Buttons have consistent styling
- [ ] Font sizes are readable
- [ ] Icons load correctly (FontAwesome)
- [ ] Spacing is consistent
- [ ] Cards/panels have same border radius

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Sidebar doesn't overlap content
- [ ] Tables scroll horizontally if needed
- [ ] Modals are centered and sized appropriately

### Loading States
- [ ] Spinners show while data loads
- [ ] "Loading..." text visible
- [ ] No blank screens during load
- [ ] No layout shift after load

### Error States
- [ ] Error messages display in red
- [ ] Helpful error text shown
- [ ] 404 pages work correctly
- [ ] API errors handled gracefully
- [ ] No unhandled promise rejections

### Empty States
- [ ] "No items found" messages clear
- [ ] Empty table states have icons
- [ ] Suggestions to create items shown
- [ ] Empty states are not confusing

### Success Feedback
- [ ] Success alerts/toasts appear
- [ ] Green checkmarks or indicators
- [ ] Confirmation messages clear
- [ ] Auto-dismiss after few seconds

---

## 🐛 Bug Checks

### Console Errors
- [ ] Open browser DevTools Console
- [ ] Navigate through all pages
- [ ] No red errors in console
- [ ] No failed API calls (except expected 401/404)
- [ ] No JavaScript errors

### Network Tab
- [ ] Check Network tab in DevTools
- [ ] All API calls return 200 or expected status
- [ ] No 500 Internal Server Errors
- [ ] API responses have correct structure
- [ ] No CORS errors

### Common Issues to Check
- [ ] "Cannot read property of undefined" errors
- [ ] "Failed to fetch" network errors
- [ ] Infinite loading spinners
- [ ] Buttons that don't work
- [ ] Forms that don't submit
- [ ] Dropdowns that don't populate
- [ ] Images/icons that don't load
- [ ] Tailwind CSS warning in production

---

## 🔒 Security & Permissions

### Authentication
- [ ] Unauthenticated users redirected to login
- [ ] Expired tokens handled correctly
- [ ] Session timeout works
- [ ] Re-login required after timeout

### Role-Based Access
- [ ] Super Admin can access all features
- [ ] CRM Staff restricted appropriately
- [ ] Permissions enforced on backend
- [ ] UI hides restricted features

### Data Privacy
- [ ] Sensitive data not exposed in console
- [ ] API tokens not visible in Network tab
- [ ] Customer PII handled appropriately
- [ ] Internal notes truly internal

---

## ⚡ Performance

### Page Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] Staff list loads < 1 second
- [ ] Task board loads < 2 seconds
- [ ] Tickets list loads < 2 seconds
- [ ] No excessive API calls

### Optimization
- [ ] Images optimized (if any)
- [ ] CDN resources load quickly
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Drag & drop responsive

---

## 📊 Data Integrity

### Database Consistency
- [ ] Created records persist correctly
- [ ] Updates save properly
- [ ] Deletes remove data completely
- [ ] Foreign keys maintained
- [ ] No orphaned records

### Activity Logging
- [ ] All CRUD operations logged
- [ ] Correct staff ID in logs
- [ ] Accurate timestamps
- [ ] Severity levels correct
- [ ] Log entries readable

---

## 🎯 User Workflows

### Scenario 1: Handle New Support Ticket
1. [ ] Customer submits ticket (create one manually)
2. [ ] Ticket appears in "Open" status
3. [ ] Admin assigns to staff member
4. [ ] Staff member views ticket
5. [ ] Staff adds internal note about issue
6. [ ] Staff sends public reply to customer
7. [ ] Status changed to "In Progress"
8. [ ] Issue resolved, status changed to "Resolved"
9. [ ] Later, ticket closed
10. [ ] All activity logged correctly

### Scenario 2: Staff Management
1. [ ] Create new CRM staff member
2. [ ] Set limited permissions
3. [ ] Login as new staff member
4. [ ] Verify restricted access
5. [ ] Super admin edits permissions
6. [ ] Staff member gains new access
7. [ ] All changes logged

### Scenario 3: Task Workflow
1. [ ] Create new task (To Do)
2. [ ] Assign to staff member
3. [ ] Staff drags to "In Progress"
4. [ ] Staff adds comments/updates
5. [ ] Complete task (drag to "Done")
6. [ ] Verify activity logged
7. [ ] Task visible in completed tasks

---

## 🔍 Edge Cases

### Empty Data
- [ ] New installation with no data
- [ ] Deleted all tickets
- [ ] No staff members
- [ ] No tasks created yet

### Large Data
- [ ] 100+ tickets
- [ ] 50+ staff members
- [ ] 200+ tasks
- [ ] Performance still good

### Special Characters
- [ ] Names with apostrophes
- [ ] Emails with special chars
- [ ] Messages with emojis
- [ ] HTML/script tags in input (should be sanitized)

### Boundary Values
- [ ] Very long ticket descriptions
- [ ] Maximum message length
- [ ] Invalid email formats
- [ ] Future dates in filters
- [ ] Negative numbers in forms

---

## ✅ Final Production Check

### Pre-Launch
- [ ] All test data reviewed
- [ ] Real admin accounts created
- [ ] Database backed up
- [ ] Error monitoring enabled
- [ ] Activity logs working

### Production URL Tests
- [ ] Access: `https://www.deepmineai.vip/admin/crm/dashboard`
- [ ] All features work on production
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Custom domain working

### Post-Launch Monitoring
- [ ] Check error logs daily
- [ ] Monitor performance metrics
- [ ] Review activity logs
- [ ] Gather user feedback
- [ ] Track ticket resolution times

---

## 📝 Bug Report Template

If you find any issues, use this format:

**Issue Title**: [Brief description]

**Page/Feature**: [e.g., Support Tickets - Create Form]

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. Enter...
4. See error

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Console Errors**: [Copy any error messages]

**Screenshot**: [If applicable]

**Priority**: [High/Medium/Low]

---

## 🎉 Sign-Off Checklist

Once all tests pass:
- [ ] All critical features work
- [ ] No blocking bugs found
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Ready for production use

---

**Testing Date**: _______________  
**Tested By**: _______________  
**Environment**: Production / Staging / Local  
**Browser**: Chrome / Firefox / Safari / Edge  
**Status**: ✅ Pass / ❌ Fail / ⚠️ Issues Found
