/**
 * Leads Management Page - Complete Lead Pipeline
 * Features: Kanban board, lead scoring, tags, sources, activity tracking
 */

import { CRM_SIDEBAR_PERMISSION_SCRIPT } from '../components/crm-sidebar-permissions';

export const adminLeadsManagementHTML = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leads Management - DeepMine CRM</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100vh;
          width: 100vw;
        }
        
        :root {
          --primary: #2979FF;
          --primary-dark: #1565C0;
          --success: #00C853;
          --warning: #FF9800;
          --danger: #F44336;
          --dark-bg: #0B0F1E;
          --dark-card: #1A1F35;
          --dark-hover: #252B45;
          --text-primary: #E0E7FF;
          --text-secondary: #9CA3AF;
          --border-color: rgba(41, 121, 255, 0.2);
        }
        
        body {
          background: var(--dark-bg);
          color: var(--text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .pipeline-column {
          flex: 1;
          min-width: 0;
          background: var(--dark-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .pipeline-column-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .pipeline-column-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .pipeline-column-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .pipeline-column-content::-webkit-scrollbar-thumb {
          background: rgba(41, 121, 255, 0.3);
          border-radius: 3px;
        }
        
        .pipeline-column-content::-webkit-scrollbar-thumb:hover {
          background: rgba(41, 121, 255, 0.5);
        }
        
        .lead-card {
          background: var(--dark-hover);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .lead-card:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(41, 121, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .score-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .score-high { background: #dcfce7; color: #166534; }
        .score-medium { background: #fef3c7; color: #92400e; }
        .score-low { background: #fee2e2; color: #991b1b; }
        
        .tag-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin: 2px;
        }
        
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          overflow-y: auto;
        }
        
        .modal.active {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-content {
          background: var(--dark-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          margin: 20px;
        }
        
        .pipeline-container {
          display: flex;
          gap: 12px;
          overflow: hidden;
          padding: 8px;
          height: 100%;
        }
        
        .stage-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--border-color);
        }
        
        .activity-item {
          border-left: 3px solid #3b82f6;
          padding-left: 12px;
          margin-bottom: 12px;
        }
        
        .nav-link {
          padding: 12px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .nav-link:hover {
          background: var(--dark-hover);
          color: var(--text-primary);
        }
        
        .nav-link.active {
          background: rgba(41, 121, 255, 0.1);
          color: var(--primary);
          border-left: 3px solid var(--primary);
        }
        
        /* Form Elements */
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
        textarea,
        select {
          background: var(--dark-hover) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border-color) !important;
        }
        
        input::placeholder,
        textarea::placeholder {
          color: var(--text-secondary) !important;
        }
        
        label {
          color: var(--text-secondary) !important;
        }
        
        h3, h4 {
          color: var(--text-primary) !important;
        }
        
        .border-b {
          border-color: var(--border-color) !important;
        }
      </style>
    </head>
    <body>
      <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <div class="w-64 flex-shrink-0 shadow-lg overflow-hidden" style="background: var(--dark-card); border-right: 1px solid var(--border-color);">
          <div class="p-6">
            <h1 class="text-2xl font-bold flex items-center gap-2" style="color: var(--text-primary);">
              <i class="fas fa-chart-line" style="color: var(--primary);"></i>
              DeepMine CRM
            </h1>
          </div>
          
          <nav class="mt-6 px-4 space-y-2">
            <h3 class="px-4 text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--text-secondary);">Main</h3>
            <a href="/admin/crm/dashboard" class="nav-link">
              <i class="fas fa-home"></i>
              Dashboard
            </a>
            
            <h3 class="px-4 text-xs font-semibold uppercase tracking-wider mb-3 mt-6" style="color: var(--text-secondary);">CRM</h3>
            <a href="/admin/crm/leads" class="nav-link active">
              <i class="fas fa-funnel-dollar"></i>
              Leads
            </a>
            <a href="/admin/crm/staff" class="nav-link">
              <i class="fas fa-users"></i>
              Staff
            </a>
            <a href="/admin/crm/tasks" class="nav-link">
              <i class="fas fa-tasks"></i>
              Tasks
            </a>
            <a href="/admin/crm/activity-logs" class="nav-link">
              <i class="fas fa-history"></i>
              Activity Logs
            </a>
            
            <h3 class="px-4 text-xs font-semibold uppercase tracking-wider mb-3 mt-6" style="color: var(--text-secondary);">Admin</h3>
            <a href="/admin/kyc" class="nav-link">
              <i class="fas fa-id-card"></i>
              KYC Management
            </a>
            <a href="/admin/panel/withdrawals" class="nav-link">
              <i class="fas fa-money-bill-wave"></i>
              Withdrawals
            </a>
            <a href="/admin/reports" class="nav-link">
              <i class="fas fa-chart-bar"></i>
              Reports
            </a>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <div class="p-4 flex-shrink-0">
            <!-- Header -->
            <div class="rounded-lg shadow-md p-3 mb-3" style="background: var(--dark-card); border: 1px solid var(--border-color);">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-3xl font-bold flex items-center gap-3" style="color: var(--text-primary);">
                    <i class="fas fa-funnel-dollar" style="color: var(--primary);"></i>
                    Lead Pipeline
                  </h2>
                  <p class="mt-1" style="color: var(--text-secondary);">Manage and track your sales leads</p>
                </div>
                <button onclick="openAddLeadModal()" class="px-4 py-2 text-white rounded-lg transition flex items-center gap-2" style="background: var(--primary);" onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary)'">
                  <i class="fas fa-plus"></i>
                  Add Lead
                </button>
              </div>
              
              <!-- Filters -->
              <div class="flex flex-wrap gap-3 mt-4">
                <select id="filterAssignee" onchange="loadPipeline()" class="px-3 py-2 rounded-lg" style="background: var(--dark-hover); color: var(--text-primary); border: 1px solid var(--border-color);">
                  <option value="">All Assignees</option>
                </select>
                
                <select id="filterSource" onchange="loadPipeline()" class="px-3 py-2 rounded-lg" style="background: var(--dark-hover); color: var(--text-primary); border: 1px solid var(--border-color);">
                  <option value="">All Sources</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="cold_call">Cold Calling</option>
                  <option value="email">Email Campaign</option>
                  <option value="event">Events</option>
                  <option value="ads">Paid Ads</option>
                  <option value="seo">Organic SEO</option>
                  <option value="partner">Partner</option>
                  <option value="other">Other</option>
                </select>
                
                <select id="filterTag" onchange="filterByTag()" class="px-3 py-2 rounded-lg" style="background: var(--dark-hover); color: var(--text-primary); border: 1px solid var(--border-color);">
                  <option value="">All Tags</option>
                  <option value="hot">🔴 Hot</option>
                  <option value="warm">🟠 Warm</option>
                  <option value="cold">🔵 Cold</option>
                  <option value="high_value">🟢 High Value</option>
                  <option value="enterprise">🟣 Enterprise</option>
                  <option value="small_business">🔵 Small Business</option>
                  <option value="follow_up">🟠 Follow Up</option>
                  <option value="demo_requested">🟢 Demo Requested</option>
                  <option value="pricing_inquiry">🟣 Pricing Inquiry</option>
                  <option value="competitor">🔴 Competitor</option>
                </select>
                
                <input type="text" id="searchLeads" placeholder="Search leads..." onkeyup="searchLeads()" class="px-3 py-2 rounded-lg flex-1 min-w-[200px]" style="background: var(--dark-hover); color: var(--text-primary); border: 1px solid var(--border-color);">
                
                <button onclick="loadPipeline()" class="px-4 py-2 rounded-lg transition" style="background: var(--dark-hover); color: var(--text-primary); border: 1px solid var(--border-color);" onmouseover="this.style.background='var(--dark-card)'" onmouseout="this.style.background='var(--dark-hover)'">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
              
              <!-- Summary Stats -->
              <div class="grid grid-cols-4 gap-2 mt-3">
                <div class="rounded-lg p-2" style="background: var(--dark-hover); border: 1px solid var(--border-color);">
                  <div class="text-xs font-semibold" style="color: var(--primary);">Total Leads</div>
                  <div class="text-lg font-bold" style="color: var(--text-primary);" id="totalLeads">0</div>
                </div>
                <div class="rounded-lg p-2" style="background: var(--dark-hover); border: 1px solid var(--border-color);">
                  <div class="text-xs font-semibold" style="color: var(--success);">Qualified</div>
                  <div class="text-lg font-bold" style="color: var(--text-primary);" id="qualifiedLeads">0</div>
                </div>
                <div class="rounded-lg p-2" style="background: var(--dark-hover); border: 1px solid var(--border-color);">
                  <div class="text-xs font-semibold" style="color: #9333ea;">Avg Score</div>
                  <div class="text-lg font-bold" style="color: var(--text-primary);" id="avgScore">0</div>
                </div>
                <div class="rounded-lg p-2" style="background: var(--dark-hover); border: 1px solid var(--border-color);">
                  <div class="text-xs font-semibold" style="color: var(--warning);">Conversion Rate</div>
                  <div class="text-lg font-bold" style="color: var(--text-primary);" id="conversionRate">0%</div>
                </div>
              </div>
            </div>

            <!-- Pipeline Kanban Board -->
            <div class="flex-1 overflow-hidden">
              <div class="pipeline-container h-full" id="pipelineContainer">
                <!-- Columns will be dynamically added here -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Lead Modal -->
      <div id="addLeadModal" class="modal">
        <div class="modal-content">
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold">
                <i class="fas fa-user-plus mr-2" style="color: var(--primary);"></i>
                Add New Lead
              </h3>
              <button onclick="closeAddLeadModal()" style="color: var(--text-secondary);" onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-secondary)'">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          
          <form id="addLeadForm" class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <!-- Contact Information -->
              <div class="col-span-2">
                <h4 class="font-semibold mb-3">Contact Information</h4>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">
                  Full Name <span style="color: var(--danger);">*</span>
                </label>
                <input type="text" name="full_name" required class="w-full px-3 py-2 rounded-lg">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">
                  Email <span style="color: var(--danger);">*</span>
                </label>
                <input type="email" name="email" required class="w-full px-3 py-2 rounded-lg">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Phone</label>
                <input type="tel" name="phone" class="w-full px-3 py-2 rounded-lg">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Company</label>
                <input type="text" name="company" class="w-full px-3 py-2 rounded-lg">
              </div>
              
              <!-- Lead Details -->
              <div class="col-span-2 mt-4">
                <h4 class="font-semibold mb-3">Lead Details</h4>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">
                  Source <span style="color: var(--danger);">*</span>
                </label>
                <select name="source" required class="w-full px-3 py-2 rounded-lg">
                  <option value="">Select source...</option>
                  <option value="website">📝 Website Contact Form</option>
                  <option value="referral">👥 Customer Referral</option>
                  <option value="social_media">📱 Social Media</option>
                  <option value="cold_call">📞 Cold Calling</option>
                  <option value="email">📧 Email Campaigns</option>
                  <option value="event">🎪 Events & Trade Shows</option>
                  <option value="ads">💰 Paid Advertising</option>
                  <option value="seo">🔍 Organic Search (SEO)</option>
                  <option value="partner">🤝 Partner Referrals</option>
                  <option value="other">📋 Other Sources</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Lead Score</label>
                <input type="number" name="score" min="0" max="100" value="50" class="w-full px-3 py-2 rounded-lg">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Assign To</label>
                <select name="assigned_to" id="assigneeSelect" class="w-full px-3 py-2 rounded-lg">
                  <option value="">Unassigned</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Status</label>
                <select name="status" class="w-full px-3 py-2 rounded-lg">
                  <option value="new">📝 New</option>
                  <option value="qualified">✅ Qualified</option>
                  <option value="contacted">📞 Contacted</option>
                  <option value="proposal">💼 Proposal</option>
                  <option value="negotiation">🤝 Negotiation</option>
                </select>
              </div>
              
              <!-- Tags -->
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-2">Tags</label>
                <div class="flex flex-wrap gap-2">
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="hot" class="mr-2">
                    <span class="tag-badge" style="background: #fee2e2; color: #991b1b;">🔴 Hot</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="warm" class="mr-2">
                    <span class="tag-badge" style="background: #fed7aa; color: #9a3412;">🟠 Warm</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="cold" class="mr-2">
                    <span class="tag-badge" style="background: #dbeafe; color: #1e3a8a;">🔵 Cold</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="high_value" class="mr-2">
                    <span class="tag-badge" style="background: #dcfce7; color: #166534;">🟢 High Value</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="enterprise" class="mr-2">
                    <span class="tag-badge" style="background: #e9d5ff; color: #581c87;">🟣 Enterprise</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="small_business" class="mr-2">
                    <span class="tag-badge" style="background: #bfdbfe; color: #1e40af;">🔵 Small Business</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="follow_up" class="mr-2">
                    <span class="tag-badge" style="background: #fef3c7; color: #92400e;">🟠 Follow Up</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="demo_requested" class="mr-2">
                    <span class="tag-badge" style="background: #d1fae5; color: #065f46;">🟢 Demo Requested</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="pricing_inquiry" class="mr-2">
                    <span class="tag-badge" style="background: #ddd6fe; color: #5b21b6;">🟣 Pricing Inquiry</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="tags" value="competitor" class="mr-2">
                    <span class="tag-badge" style="background: #fecaca; color: #7f1d1d;">🔴 Competitor</span>
                  </label>
                </div>
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-2">Notes</label>
                <textarea name="notes" rows="3" class="w-full px-3 py-2 rounded-lg"></textarea>
              </div>
            </div>
            
            <div class="flex gap-3 mt-6">
              <button type="submit" class="flex-1 px-4 py-2 text-white rounded-lg transition" style="background: var(--primary);" onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary)'">
                <i class="fas fa-save mr-2"></i>
                Create Lead
              </button>
              <button type="button" onclick="closeAddLeadModal()" class="px-4 py-2 rounded-lg transition" style="background: var(--dark-hover); color: var(--text-primary); border: 1px solid var(--border-color);" onmouseover="this.style.background='var(--dark-card)'" onmouseout="this.style.background='var(--dark-hover)'">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lead Details Modal -->
      <div id="leadDetailsModal" class="modal">
        <div class="modal-content">
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-gray-800" id="leadDetailsTitle">
                <i class="fas fa-user text-blue-600 mr-2"></i>
                Lead Details
              </h3>
              <button onclick="closeLeadDetailsModal()" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          
          <div class="p-6" id="leadDetailsContent">
            <!-- Content will be dynamically loaded -->
          </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
      <script>
        let pipelineData = null;
        let staffList = [];
        
        // Pipeline stage configuration
        const stages = [
          { id: 'new', name: 'New', icon: '📝', color: '#3b82f6' },
          { id: 'qualified', name: 'Qualified', icon: '✅', color: '#10b981' },
          { id: 'contacted', name: 'Contacted', icon: '📞', color: '#8b5cf6' },
          { id: 'proposal', name: 'Proposal', icon: '💼', color: '#f59e0b' },
          { id: 'negotiation', name: 'Negotiation', icon: '🤝', color: '#ef4444' },
          { id: 'won', name: 'Won', icon: '✅', color: '#22c55e' },
          { id: 'lost', name: 'Lost', icon: '❌', color: '#6b7280' }
        ];
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
          loadStaff();
          loadPipeline();
        });
        
        // Load staff for assignment dropdown
        async function loadStaff() {
          try {
            const response = await axios.get('/api/crm/staff', {
              withCredentials: true
            });
            
            if (response.data.success) {
              staffList = response.data.data.staff || [];
              populateAssigneeDropdowns();
            }
          } catch (error) {
            console.error('Error loading staff:', error);
          }
        }
        
        function populateAssigneeDropdowns() {
          const assigneeSelect = document.getElementById('assigneeSelect');
          const filterAssignee = document.getElementById('filterAssignee');
          
          staffList.forEach(staff => {
            const option1 = document.createElement('option');
            option1.value = staff.id;
            option1.textContent = staff.full_name;
            assigneeSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = staff.id;
            option2.textContent = staff.full_name;
            filterAssignee.appendChild(option2);
          });
        }
        
        // Load pipeline data
        async function loadPipeline() {
          try {
            const assignee = document.getElementById('filterAssignee').value;
            const source = document.getElementById('filterSource').value;
            
            let url = '/api/crm/leads/pipeline?';
            if (assignee) url += \`assigned_to=\${assignee}&\`;
            if (source) url += \`source=\${source}&\`;
            
            const response = await axios.get(url, {
              withCredentials: true
            });
            
            if (response.data.success) {
              pipelineData = response.data.data;
              renderPipeline();
              updateStats();
            }
          } catch (error) {
            console.error('Error loading pipeline:', error);
            alert('Failed to load pipeline data');
          }
        }
        
        // Render pipeline columns
        function renderPipeline() {
          const container = document.getElementById('pipelineContainer');
          container.innerHTML = '';
          
          stages.forEach(stage => {
            const leads = pipelineData[stage.id] || [];
            
            const column = document.createElement('div');
            column.className = 'pipeline-column';
            column.innerHTML = \`
              <div class="stage-header">
                <div>
                  <span style="font-size: 20px;">\${stage.icon}</span>
                  <span class="font-bold text-gray-800 ml-2">\${stage.name}</span>
                </div>
                <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
                  \${leads.length}
                </span>
              </div>
              <div class="leads-container" id="leads-\${stage.id}">
                \${renderLeadCards(leads)}
              </div>
            \`;
            
            container.appendChild(column);
          });
        }
        
        // Render lead cards
        function renderLeadCards(leads) {
          if (leads.length === 0) {
            return '<div class="text-center text-gray-400 py-8">No leads</div>';
          }
          
          return leads.map(lead => {
            const scoreClass = lead.score >= 70 ? 'score-high' : lead.score >= 40 ? 'score-medium' : 'score-low';
            const tags = lead.tags ? lead.tags.split(',').map(t => t.trim()).filter(t => t) : [];
            
            return \`
              <div class="lead-card" onclick="viewLeadDetails(\${lead.id})">
                <div class="flex items-start justify-between mb-2">
                  <div class="font-semibold text-gray-800">\${lead.full_name || 'Unnamed Lead'}</div>
                  <span class="score-badge \${scoreClass}">\${lead.score || 0}</span>
                </div>
                
                <div class="text-sm text-gray-600 mb-2">
                  <div><i class="fas fa-envelope mr-1"></i>\${lead.email || 'No email'}</div>
                  \${lead.company ? '<div><i class="fas fa-building mr-1"></i>' + lead.company + '</div>' : ''}
                </div>
                
                <div class="flex flex-wrap gap-1 mb-2">
                  \${renderTags(tags)}
                </div>
                
                <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <span>
                    <i class="fas fa-user mr-1"></i>
                    \${lead.assigned_to_name || 'Unassigned'}
                  </span>
                  <span>
                    <i class="fas fa-clock mr-1"></i>
                    \${formatDate(lead.created_at)}
                  </span>
                </div>
              </div>
            \`;
          }).join('');
        }
        
        // Render tags
        function renderTags(tags) {
          const tagMap = {
            'hot': { emoji: '🔴', text: 'Hot', bg: '#fee2e2', color: '#991b1b' },
            'warm': { emoji: '🟠', text: 'Warm', bg: '#fed7aa', color: '#9a3412' },
            'cold': { emoji: '🔵', text: 'Cold', bg: '#dbeafe', color: '#1e3a8a' },
            'high_value': { emoji: '🟢', text: 'High Value', bg: '#dcfce7', color: '#166534' },
            'enterprise': { emoji: '🟣', text: 'Enterprise', bg: '#e9d5ff', color: '#581c87' },
            'small_business': { emoji: '🔵', text: 'Small Business', bg: '#bfdbfe', color: '#1e40af' },
            'follow_up': { emoji: '🟠', text: 'Follow Up', bg: '#fef3c7', color: '#92400e' },
            'demo_requested': { emoji: '🟢', text: 'Demo', bg: '#d1fae5', color: '#065f46' },
            'pricing_inquiry': { emoji: '🟣', text: 'Pricing', bg: '#ddd6fe', color: '#5b21b6' },
            'competitor': { emoji: '🔴', text: 'Competitor', bg: '#fecaca', color: '#7f1d1d' }
          };
          
          return tags.slice(0, 3).map(tag => {
            const config = tagMap[tag] || { emoji: '', text: tag, bg: '#e5e7eb', color: '#374151' };
            return \`<span class="tag-badge" style="background: \${config.bg}; color: \${config.color};">\${config.emoji} \${config.text}</span>\`;
          }).join('');
        }
        
        // Update statistics
        function updateStats() {
          let total = 0;
          let qualified = 0;
          let won = 0;
          let totalScore = 0;
          let scoreCount = 0;
          
          Object.values(pipelineData).forEach(leads => {
            total += leads.length;
            leads.forEach(lead => {
              if (lead.status === 'qualified') qualified++;
              if (lead.status === 'won') won++;
              if (lead.score) {
                totalScore += lead.score;
                scoreCount++;
              }
            });
          });
          
          document.getElementById('totalLeads').textContent = total;
          document.getElementById('qualifiedLeads').textContent = qualified;
          document.getElementById('avgScore').textContent = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
          document.getElementById('conversionRate').textContent = total > 0 ? Math.round((won / total) * 100) + '%' : '0%';
        }
        
        // Modal functions
        function openAddLeadModal() {
          document.getElementById('addLeadModal').classList.add('active');
        }
        
        function closeAddLeadModal() {
          document.getElementById('addLeadModal').classList.remove('active');
          document.getElementById('addLeadForm').reset();
        }
        
        function closeLeadDetailsModal() {
          document.getElementById('leadDetailsModal').classList.remove('active');
        }
        
        // Add lead form submission
        document.getElementById('addLeadForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const tags = Array.from(formData.getAll('tags'));
          
          // Split full name into first and last
          const fullName = formData.get('full_name') || '';
          const nameParts = fullName.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          const leadData = {
            first_name: firstName,
            last_name: lastName,
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            source: formData.get('source'),
            score: parseInt(formData.get('score')) || 50,
            assigned_to: formData.get('assigned_to') ? parseInt(formData.get('assigned_to')) : null,
            status: formData.get('status') || 'new',
            tags: tags.join(','),
            notes: formData.get('notes')
          };
          
          try {
            const response = await axios.post('/api/crm/leads/create', leadData, {
              withCredentials: true
            });
            
            if (response.data.success) {
              alert('Lead created successfully!');
              closeAddLeadModal();
              loadPipeline();
            }
          } catch (error) {
            console.error('Error creating lead:', error);
            alert('Failed to create lead: ' + (error.response?.data?.message || error.message));
          }
        });
        
        // View lead details
        async function viewLeadDetails(leadId) {
          try {
            const response = await axios.get(\`/api/crm/leads/\${leadId}\`, {
              withCredentials: true
            });
            
            if (response.data.success) {
              const lead = response.data.data;
              renderLeadDetails(lead);
              document.getElementById('leadDetailsModal').classList.add('active');
            }
          } catch (error) {
            console.error('Error loading lead details:', error);
            alert('Failed to load lead details');
          }
        }
        
        // Render lead details
        function renderLeadDetails(lead) {
          const tags = lead.tags ? lead.tags.split(',').map(t => t.trim()).filter(t => t) : [];
          const scoreClass = lead.score >= 70 ? 'score-high' : lead.score >= 40 ? 'score-medium' : 'score-low';
          
          document.getElementById('leadDetailsTitle').innerHTML = \`
            <i class="fas fa-user text-blue-600 mr-2"></i>
            \${lead.full_name || 'Unnamed Lead'}
          \`;
          
          document.getElementById('leadDetailsContent').innerHTML = \`
            <div class="grid grid-cols-3 gap-6">
              <!-- Contact Information -->
              <div class="col-span-2">
                <h4 class="font-semibold mb-3">Contact Information</h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-800">
                  <div><strong>Email:</strong> \${lead.email}</div>
                  <div><strong>Phone:</strong> \${lead.phone || 'N/A'}</div>
                  <div><strong>Company:</strong> \${lead.company || 'N/A'}</div>
                </div>
                
                <h4 class="font-semibold text-gray-700 mb-3 mt-6">Lead Details</h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-800">
                  <div><strong>Source:</strong> \${lead.source}</div>
                  <div><strong>Status:</strong> \${lead.status}</div>
                  <div>
                    <strong>Score:</strong> 
                    <span class="score-badge \${scoreClass} ml-2">\${lead.score || 0}</span>
                  </div>
                  <div><strong>Assigned to:</strong> \${lead.assigned_to_name || 'Unassigned'}</div>
                  <div><strong>Created:</strong> \${formatDate(lead.created_at)}</div>
                </div>
                
                <h4 class="font-semibold text-gray-700 mb-3 mt-6">Tags</h4>
                <div class="flex flex-wrap gap-2">
                  \${renderTags(tags)}
                </div>
                
                \${lead.notes ? '<h4 class="font-semibold text-gray-700 mb-3 mt-6">Notes</h4><div class="bg-gray-50 rounded-lg p-4 text-gray-800">' + lead.notes + '</div>' : ''}
              </div>
              
              <!-- Actions & Activities -->
              <div>
                <h4 class="font-semibold mb-3">Quick Actions</h4>
                <div class="space-y-2">
                  <button onclick="moveLeadStage(\${lead.id}, 'qualified')" class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    ✅ Mark Qualified
                  </button>
                  <button onclick="moveLeadStage(\${lead.id}, 'contacted')" class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    📞 Mark Contacted
                  </button>
                  <button onclick="moveLeadStage(\${lead.id}, 'won')" class="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    🎉 Mark Won
                  </button>
                  <button onclick="convertLead(\${lead.id})" class="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                    <i class="fas fa-user-check mr-1"></i>
                    Convert to User
                  </button>
                </div>
                
                <h4 class="font-semibold text-gray-700 mb-3 mt-6">Activity Log</h4>
                <div class="space-y-2 text-sm">
                  <div class="activity-item">
                    <div class="font-semibold">Lead Created</div>
                    <div class="text-gray-600">\${formatDate(lead.created_at)}</div>
                    <div class="text-gray-500 text-xs">by \${lead.created_by_name || 'System'}</div>
                  </div>
                </div>
              </div>
            </div>
          \`;
        }
        
        // Move lead to different stage
        async function moveLeadStage(leadId, newStage) {
          try {
            const response = await axios.put(\`/api/crm/leads/\${leadId}\`, {
              status: newStage
            }, {
              withCredentials: true
            });
            
            if (response.data.success) {
              alert('Lead status updated!');
              closeLeadDetailsModal();
              loadPipeline();
            }
          } catch (error) {
            console.error('Error updating lead:', error);
            alert('Failed to update lead status');
          }
        }
        
        // Convert lead to user
        async function convertLead(leadId) {
          if (!confirm('Are you sure you want to convert this lead to a user?')) return;
          
          try {
            const response = await axios.post(\`/api/crm/leads/\${leadId}/convert\`, {}, {
              withCredentials: true
            });
            
            if (response.data.success) {
              alert('Lead converted to user successfully!');
              closeLeadDetailsModal();
              loadPipeline();
            }
          } catch (error) {
            console.error('Error converting lead:', error);
            alert('Failed to convert lead: ' + (error.response?.data?.message || error.message));
          }
        }
        
        // Search leads
        function searchLeads() {
          const searchTerm = document.getElementById('searchLeads').value.toLowerCase();
          
          stages.forEach(stage => {
            const container = document.getElementById(\`leads-\${stage.id}\`);
            const cards = container.querySelectorAll('.lead-card');
            
            cards.forEach(card => {
              const text = card.textContent.toLowerCase();
              card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
          });
        }
        
        // Filter by tag
        function filterByTag() {
          const tag = document.getElementById('filterTag').value;
          
          if (!tag) {
            // Show all
            document.querySelectorAll('.lead-card').forEach(card => {
              card.style.display = 'block';
            });
            return;
          }
          
          // Filter by tag
          stages.forEach(stage => {
            const leads = pipelineData[stage.id] || [];
            const container = document.getElementById(\`leads-\${stage.id}\`);
            
            const filtered = leads.filter(lead => {
              const tags = lead.tags ? lead.tags.split(',').map(t => t.trim()).filter(t => t) : [];
              return tags.includes(tag);
            });
            
            container.innerHTML = renderLeadCards(filtered);
          });
        }
        
        // Utility functions
        function formatDate(dateString) {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          const now = new Date();
          const diff = now - date;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          
          if (days === 0) return 'Today';
          if (days === 1) return 'Yesterday';
          if (days < 7) return \`\${days}d ago\`;
          if (days < 30) return \`\${Math.floor(days / 7)}w ago\`;
          return date.toLocaleDateString();
        }
      </script>
      <!-- Permission-based Navigation Script -->
      <script>
      // Permission-based navigation visibility
      (async function() {
        try {
          // Fetch current staff's permissions
          const response = await fetch('/api/crm/permissions', {
            credentials: 'include',
            headers: {
              'X-Staff-ID': localStorage.getItem('crm_staff_id') || '1' // Get from session
            }
          });
          
          if (!response.ok) {
            console.error('Failed to fetch permissions');
            return;
          }
          
          const data = await response.json();
          if (!data.success) {
            console.error('Permission fetch failed:', data.error);
            return;
          }
          
          const perms = data.permissions;
          
          // Hide navigation links based on permissions
          const navRules = {
            // CRM links
            '/admin/crm/dashboard': perms.can_view_dashboard,
            '/admin/crm/leads': perms.can_view_leads,
            '/admin/crm/staff': perms.can_view_staff,
            '/admin/crm/tasks': perms.can_view_tasks,
            '/admin/crm/activity-logs': perms.can_view_activity_logs,
            
            // Admin links
            '/admin/kyc': perms.can_view_kyc,
            '/admin/panel/withdrawals': perms.can_view_withdrawals,
            '/admin/reports': perms.can_view_reports,
          };
          
          // Apply visibility rules
          Object.entries(navRules).forEach(([href, allowed]) => {
            const links = document.querySelectorAll(\`a[href="\${href}"]\`);
            links.forEach(link => {
              if (!allowed) {
                link.style.display = 'none';
                // Also hide the parent if it's a nav section
                const parent = link.closest('.nav-link, .menu-item');
                if (parent) parent.style.display = 'none';
              }
            });
          });
          
          // Store permissions in global for other scripts
          window.crmPermissions = perms;
          window.crmStaff = data.staff;
          
        } catch (error) {
          console.error('Error loading CRM permissions:', error);
        }
      })();
      </script>
        
      ${CRM_SIDEBAR_PERMISSION_SCRIPT}
  </body>
    </html>
  `;
};
