-- Insert test leads (using admin_users ID 1 and 2)
INSERT INTO leads (
  first_name, last_name, email, phone, company, job_title,
  source, status, stage, score, assigned_to, estimated_value,
  currency, tags, notes, created_by
) VALUES
  ('John', 'Smith', 'john.smith@example.com', '+1-555-0101', 'Acme Corp', 'CEO', 
   'website', 'new', 'new', 75, 1, 50000.00, 'USD', 
   'vip,hot-lead', 'High priority lead from website contact form', 1),
  
  ('Sarah', 'Johnson', 'sarah.j@techstart.io', '+1-555-0102', 'TechStart', 'CTO',
   'referral', 'contacted', 'contacted', 85, 1, 75000.00, 'USD',
   'hot-lead,technical', 'Referred by existing client, very interested', 1),
  
  ('Michael', 'Brown', 'mbrown@startup.com', '+1-555-0103', 'Startup Inc', 'Founder',
   'linkedin', 'qualified', 'qualified', 90, 2, 100000.00, 'USD',
   'vip,high-value', 'Qualified lead, ready for proposal', 1),
  
  ('Emily', 'Davis', 'emily@smallbiz.com', '+1-555-0104', 'Small Business', 'Owner',
   'google_ads', 'proposal', 'proposal', 65, 1, 25000.00, 'USD',
   'small-business', 'Proposal sent, awaiting response', 1),
  
  ('David', 'Wilson', 'david.w@enterprise.com', '+1-555-0105', 'Enterprise Co', 'Director',
   'email', 'negotiation', 'negotiation', 95, 2, 150000.00, 'USD',
   'vip,enterprise,hot-lead', 'Final negotiations, very likely to close', 1),
  
  ('Lisa', 'Anderson', 'lisa@midsize.com', '+1-555-0106', 'MidSize Corp', 'Manager',
   'phone', 'won', 'won', 100, 1, 80000.00, 'USD',
   'closed,customer', 'Successfully converted to customer!', 1),
  
  ('Robert', 'Taylor', 'robert@notinterested.com', '+1-555-0107', 'No Interest LLC', 'VP',
   'cold_call', 'lost', 'lost', 20, 2, 30000.00, 'USD',
   'not-interested', 'Not interested at this time, follow up in 6 months', 1),
  
  ('Jennifer', 'Martinez', 'jennifer@newlead.com', '+1-555-0108', 'New Lead Inc', 'COO',
   'website', 'new', 'new', 60, NULL, 40000.00, 'USD',
   'unassigned', 'New lead, needs assignment', 1);
