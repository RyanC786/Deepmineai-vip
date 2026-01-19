-- Support Tickets System
-- Main tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_number TEXT UNIQUE NOT NULL, -- e.g., "TKT-2024-0001"
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- User/Customer info
  user_id INTEGER, -- NULL if created by guest/non-registered user
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  
  -- Assignment
  assigned_to INTEGER, -- admin_users.id (CRM staff)
  assigned_at DATETIME,
  
  -- Status and Priority
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, waiting_customer, resolved, closed
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Category
  category TEXT, -- technical, billing, general, account, other
  
  -- Tracking
  created_by INTEGER, -- admin_users.id if created by staff, NULL if by customer
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  resolved_by INTEGER,
  closed_at DATETIME,
  closed_by INTEGER,
  
  -- Metadata
  tags TEXT, -- comma-separated tags
  internal_notes TEXT, -- staff-only notes
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id),
  FOREIGN KEY (created_by) REFERENCES admin_users(id),
  FOREIGN KEY (resolved_by) REFERENCES admin_users(id),
  FOREIGN KEY (closed_by) REFERENCES admin_users(id)
);

-- Ticket messages/replies table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  
  -- Message content
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT 0, -- internal messages visible only to staff
  
  -- Author info
  author_type TEXT NOT NULL, -- 'customer' or 'staff'
  author_id INTEGER, -- user_id or admin_user_id depending on author_type
  author_name TEXT,
  author_email TEXT,
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_email ON support_tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON ticket_messages(created_at);
