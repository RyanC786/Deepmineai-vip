/**
 * DeepMine AI - Support Tickets
 * Complete ticket management system
 */

import { CRM_SIDEBAR_PERMISSION_SCRIPT } from '../components/crm-sidebar-permissions';

export const adminTicketsHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Support Tickets - DeepMine Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .sidebar-link:hover { background-color: rgba(59, 130, 246, 0.1); }
        .sidebar-link.active { background-color: rgba(59, 130, 246, 0.2); border-left: 3px solid #3b82f6; }
        
        .ticket-row:hover {
            background-color: rgba(59, 130, 246, 0.1);
            cursor: pointer;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .status-open { background-color: #3b82f6; color: white; }
        .status-in_progress { background-color: #f59e0b; color: white; }
        .status-waiting { background-color: #8b5cf6; color: white; }
        .status-resolved { background-color: #10b981; color: white; }
        .status-closed { background-color: #6b7280; color: white; }
        
        .priority-urgent { color: #ef4444; }
        .priority-high { color: #f59e0b; }
        .priority-medium { color: #3b82f6; }
        .priority-low { color: #6b7280; }
        
        .modal { display: none; }
        .modal.active { display: flex; }
    </style>
</head>
<body class="bg-gray-900 text-gray-100">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
            <div class="p-6">
                <h1 class="text-2xl font-bold text-blue-400">
                    <i class="fas fa-gem mr-2"></i>DeepMine CRM
                </h1>
            </div>
            <nav class="mt-6">
                <div class="px-6 py-2 text-xs font-semibold text-gray-500 uppercase">Main</div>
                <a href="/admin/crm/dashboard" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-chart-line mr-3 w-5"></i>Dashboard
                </a>
                
                <div class="px-6 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">CRM</div>
                <a href="/admin/crm/staff" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-users mr-3 w-5"></i>Staff
                </a>
                <a href="/admin/crm/tasks" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-tasks mr-3 w-5"></i>Tasks
                </a>
                <a href="/admin/crm/tickets" class="sidebar-link active flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-ticket-alt mr-3 w-5"></i>Support Tickets
                </a>
                <a href="/admin/crm/activity-logs" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-history mr-3 w-5"></i>Activity Logs
                </a>
                
                <div class="px-6 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">Admin</div>
                <a href="/admin/kyc" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-id-card mr-3 w-5"></i>KYC
                </a>
                <a href="/admin/panel/withdrawals" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-money-bill-wave mr-3 w-5"></i>Withdrawals
                </a>
                <a href="/admin/reports" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-chart-bar mr-3 w-5"></i>Reports
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-hidden flex flex-col">
            <!-- Header -->
            <header class="bg-gray-800 border-b border-gray-700 px-8 py-4 flex-shrink-0">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-3xl font-bold text-white">Support Tickets</h2>
                        <p class="text-gray-400 mt-1">Manage customer support requests</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="showStats()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-chart-bar mr-2"></i>Stats
                        </button>
                        <button onclick="openCreateModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-plus mr-2"></i>New Ticket
                        </button>
                    </div>
                </div>
            </header>

            <!-- Filters -->
            <div class="bg-gray-800 border-b border-gray-700 px-8 py-4 flex-shrink-0">
                <div class="flex gap-4 items-center flex-wrap">
                    <div>
                        <select id="filterStatus" onchange="loadTickets()" class="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="waiting">Waiting</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <select id="filterPriority" onchange="loadTickets()" class="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                            <option value="">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div>
                        <select id="filterAssignee" onchange="loadTickets()" class="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                            <option value="">All Assignees</option>
                        </select>
                    </div>
                    <div class="flex-1">
                        <input type="text" id="searchInput" placeholder="Search tickets..." onkeyup="handleSearch()" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                    </div>
                </div>
            </div>

            <!-- Tickets Table -->
            <div class="flex-1 overflow-auto px-8 py-6">
                <div class="bg-gray-800 rounded-lg overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-700">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ticket</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Subject</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Priority</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Assigned To</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Messages</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Created</th>
                            </tr>
                        </thead>
                        <tbody id="ticketsTableBody" class="divide-y divide-gray-700">
                            <tr>
                                <td colspan="8" class="px-6 py-4 text-center text-gray-400">
                                    <i class="fas fa-spinner fa-spin mr-2"></i>Loading tickets...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="mt-6 flex items-center justify-between">
                    <div class="text-gray-400 text-sm" id="paginationInfo">
                        Showing 0 of 0 tickets
                    </div>
                    <div class="flex gap-2" id="paginationButtons">
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Create Ticket Modal -->
    <div id="createModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
        <div class="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-white">Create New Ticket</h3>
                <button onclick="closeCreateModal()" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="createForm" onsubmit="createTicket(event)">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-300 mb-2">Customer Email *</label>
                        <input type="email" id="customerEmail" required class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">Customer Name</label>
                        <input type="text" id="customerName" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-300 mb-2">Subject *</label>
                    <input type="text" id="subject" required class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                </div>

                <div class="mb-4">
                    <label class="block text-gray-300 mb-2">Description *</label>
                    <textarea id="description" required rows="4" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"></textarea>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-300 mb-2">Priority</label>
                        <select id="priority" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">Category</label>
                        <input type="text" id="category" placeholder="e.g. Technical, Billing" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">Assign To</label>
                        <select id="assignedTo" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                            <option value="">Unassigned</option>
                        </select>
                    </div>
                </div>

                <div class="flex gap-3 justify-end">
                    <button type="button" onclick="closeCreateModal()" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Create Ticket
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- View Ticket Modal -->
    <div id="viewModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
        <div class="bg-gray-800 rounded-lg max-w-4xl w-full mx-4 h-[90vh] flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-700">
                <div>
                    <h3 class="text-2xl font-bold text-white" id="viewTicketNumber">TKT-2024-0001</h3>
                    <p class="text-gray-400 mt-1" id="viewTicketSubject">Subject</p>
                </div>
                <button onclick="closeViewModal()" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Ticket Info -->
                <div class="bg-gray-700 rounded-lg p-4 mb-6">
                    <div class="grid grid-cols-2 gap-4" id="viewTicketInfo">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Description -->
                <div class="mb-6">
                    <h4 class="text-lg font-bold text-white mb-2">Description</h4>
                    <div class="bg-gray-700 rounded-lg p-4 text-gray-300" id="viewTicketDescription">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Messages Thread -->
                <div class="mb-6">
                    <h4 class="text-lg font-bold text-white mb-4">Messages</h4>
                    <div class="space-y-4" id="viewTicketMessages">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Add Message Form -->
                <div class="bg-gray-700 rounded-lg p-4">
                    <h4 class="text-lg font-bold text-white mb-4">Add Message</h4>
                    <form id="messageForm" onsubmit="addMessage(event)">
                        <textarea id="messageText" rows="3" required placeholder="Type your message..." class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 mb-3"></textarea>
                        <div class="flex items-center justify-between">
                            <label class="flex items-center text-gray-300">
                                <input type="checkbox" id="messageInternal" class="mr-2">
                                <span>Internal note (not visible to customer)</span>
                            </label>
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                                <i class="fas fa-paper-plane mr-2"></i>Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="border-t border-gray-700 p-6 flex gap-3 justify-between">
                <div class="flex gap-3">
                    <select id="updateStatus" onchange="updateTicketStatus()" class="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting">Waiting</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select id="updatePriority" onchange="updateTicketPriority()" class="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <select id="updateAssignee" onchange="updateTicketAssignee()" class="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
                        <option value="">Unassigned</option>
                    </select>
                </div>
                <button onclick="deleteTicket()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                    <i class="fas fa-trash mr-2"></i>Delete Ticket
                </button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        let currentTicket = null;
        let staffList = [];
        let currentPage = 1;
        let totalPages = 1;

        // Load on page load
        window.addEventListener('DOMContentLoaded', () => {
            loadStaff();
            loadTickets();
        });

        // Load staff for assignment dropdowns
        async function loadStaff() {
            try {
                const response = await axios.get('/api/crm/staff', {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    staffList = response.data.data.staff;
                    populateStaffDropdowns();
                }
            } catch (error) {
                console.error('Error loading staff:', error);
            }
        }

        function populateStaffDropdowns() {
            const dropdowns = ['filterAssignee', 'assignedTo', 'updateAssignee'];
            
            dropdowns.forEach(id => {
                const select = document.getElementById(id);
                if (!select) return;
                
                const currentValue = select.value;
                const options = select.querySelectorAll('option:not([value=""])');
                options.forEach(opt => opt.remove());
                
                staffList.forEach(staff => {
                    const option = document.createElement('option');
                    option.value = staff.id;
                    option.textContent = staff.full_name;
                    select.appendChild(option);
                });
                
                if (currentValue) select.value = currentValue;
            });
        }

        // Load tickets
        async function loadTickets(page = 1) {
            try {
                currentPage = page;
                const status = document.getElementById('filterStatus').value;
                const priority = document.getElementById('filterPriority').value;
                const assigned_to = document.getElementById('filterAssignee').value;
                const search = document.getElementById('searchInput').value;
                
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: '20'
                });
                
                if (status) params.append('status', status);
                if (priority) params.append('priority', priority);
                if (assigned_to) params.append('assigned_to', assigned_to);
                if (search) params.append('search', search);
                
                const response = await axios.get(\`/api/crm/tickets/list?\${params.toString()}\`, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    const { tickets, pagination } = response.data.data;
                    totalPages = pagination.totalPages;
                    renderTickets(tickets);
                    renderPagination(pagination);
                }
            } catch (error) {
                console.error('Error loading tickets:', error);
                document.getElementById('ticketsTableBody').innerHTML = \`
                    <tr>
                        <td colspan="8" class="px-6 py-4 text-center text-red-400">
                            Failed to load tickets. Please try again.
                        </td>
                    </tr>
                \`;
            }
        }

        function renderTickets(tickets) {
            const tbody = document.getElementById('ticketsTableBody');
            
            if (tickets.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="8" class="px-6 py-4 text-center text-gray-400">
                            No tickets found
                        </td>
                    </tr>
                \`;
                return;
            }
            
            tbody.innerHTML = tickets.map(ticket => \`
                <tr class="ticket-row" onclick="viewTicket(\${ticket.id})">
                    <td class="px-6 py-4">
                        <div class="font-medium text-blue-400">\${ticket.ticket_number}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-white">\${ticket.customer_name || 'N/A'}</div>
                        <div class="text-gray-400 text-sm">\${ticket.customer_email}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-white">\${ticket.subject}</div>
                        \${ticket.category ? \`<div class="text-gray-400 text-sm">\${ticket.category}</div>\` : ''}
                    </td>
                    <td class="px-6 py-4">
                        <span class="status-badge status-\${ticket.status}">\${formatStatus(ticket.status)}</span>
                    </td>
                    <td class="px-6 py-4">
                        <i class="fas fa-flag priority-\${ticket.priority}"></i>
                        <span class="text-gray-300 ml-1">\${formatPriority(ticket.priority)}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-300">
                        \${ticket.assigned_to_name || '<span class="text-gray-500">Unassigned</span>'}
                    </td>
                    <td class="px-6 py-4">
                        <span class="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
                            \${ticket.public_message_count || 0}
                        </span>
                        \${ticket.message_count > ticket.public_message_count ? 
                            \`<span class="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs ml-1">
                                +\${ticket.message_count - ticket.public_message_count} internal
                            </span>\` : ''
                        }
                    </td>
                    <td class="px-6 py-4 text-gray-400 text-sm">
                        \${formatDate(ticket.created_at)}
                    </td>
                </tr>
            \`).join('');
        }

        function renderPagination(pagination) {
            document.getElementById('paginationInfo').textContent = 
                \`Showing \${pagination.page * pagination.limit - pagination.limit + 1} - \${Math.min(pagination.page * pagination.limit, pagination.total)} of \${pagination.total} tickets\`;
            
            const buttons = [];
            
            if (pagination.page > 1) {
                buttons.push(\`<button onclick="loadTickets(\${pagination.page - 1})" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Previous</button>\`);
            }
            
            if (pagination.page < pagination.totalPages) {
                buttons.push(\`<button onclick="loadTickets(\${pagination.page + 1})" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Next</button>\`);
            }
            
            document.getElementById('paginationButtons').innerHTML = buttons.join('');
        }

        // View ticket details
        async function viewTicket(ticketId) {
            try {
                const response = await axios.get(\`/api/crm/tickets/\${ticketId}\`, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    currentTicket = response.data.data.ticket;
                    const messages = response.data.data.messages;
                    
                    document.getElementById('viewTicketNumber').textContent = currentTicket.ticket_number;
                    document.getElementById('viewTicketSubject').textContent = currentTicket.subject;
                    document.getElementById('viewTicketDescription').textContent = currentTicket.description;
                    
                    // Populate info grid
                    document.getElementById('viewTicketInfo').innerHTML = \`
                        <div>
                            <div class="text-gray-400 text-sm">Customer</div>
                            <div class="text-white">\${currentTicket.customer_name || 'N/A'}</div>
                            <div class="text-gray-400 text-sm">\${currentTicket.customer_email}</div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-sm">Status</div>
                            <span class="status-badge status-\${currentTicket.status}">\${formatStatus(currentTicket.status)}</span>
                        </div>
                        <div>
                            <div class="text-gray-400 text-sm">Priority</div>
                            <div class="text-white">\${formatPriority(currentTicket.priority)}</div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-sm">Assigned To</div>
                            <div class="text-white">\${currentTicket.assigned_to_name || 'Unassigned'}</div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-sm">Created</div>
                            <div class="text-white">\${formatDate(currentTicket.created_at)}</div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-sm">Last Updated</div>
                            <div class="text-white">\${formatDate(currentTicket.updated_at)}</div>
                        </div>
                    \`;
                    
                    // Populate messages
                    renderMessages(messages);
                    
                    // Set dropdown values
                    document.getElementById('updateStatus').value = currentTicket.status;
                    document.getElementById('updatePriority').value = currentTicket.priority;
                    document.getElementById('updateAssignee').value = currentTicket.assigned_to || '';
                    
                    document.getElementById('viewModal').classList.add('active');
                }
            } catch (error) {
                console.error('Error loading ticket:', error);
                alert('Failed to load ticket details');
            }
        }

        function renderMessages(messages) {
            const container = document.getElementById('viewTicketMessages');
            
            if (messages.length === 0) {
                container.innerHTML = '<div class="text-gray-400 text-center py-4">No messages yet</div>';
                return;
            }
            
            container.innerHTML = messages.map(msg => \`
                <div class="bg-gray-700 rounded-lg p-4 \${msg.is_internal ? 'border-l-4 border-yellow-500' : ''}">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <i class="fas fa-\${msg.author_type === 'staff' ? 'user-tie' : 'user'} text-white text-sm"></i>
                            </div>
                            <div>
                                <div class="text-white font-medium">\${msg.author_name}</div>
                                <div class="text-gray-400 text-xs">\${formatDate(msg.created_at)}</div>
                            </div>
                        </div>
                        \${msg.is_internal ? '<span class="bg-yellow-500 text-gray-900 text-xs px-2 py-1 rounded-full">Internal</span>' : ''}
                    </div>
                    <div class="text-gray-300 whitespace-pre-wrap">\${msg.message}</div>
                </div>
            \`).join('');
        }

        // Add message to ticket
        async function addMessage(event) {
            event.preventDefault();
            
            if (!currentTicket) return;
            
            const message = document.getElementById('messageText').value.trim();
            const is_internal = document.getElementById('messageInternal').checked;
            
            if (!message) {
                alert('Please enter a message');
                return;
            }
            
            try {
                const response = await axios.post(\`/api/crm/tickets/\${currentTicket.id}/messages\`, {
                    message,
                    is_internal
                }, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    document.getElementById('messageForm').reset();
                    // Reload ticket to get updated messages
                    viewTicket(currentTicket.id);
                }
            } catch (error) {
                console.error('Error adding message:', error);
                alert('Failed to add message');
            }
        }

        // Update ticket status
        async function updateTicketStatus() {
            if (!currentTicket) return;
            
            const status = document.getElementById('updateStatus').value;
            
            try {
                await axios.put(\`/api/crm/tickets/\${currentTicket.id}\`, {
                    status
                }, {
                    withCredentials: true
                });
                
                currentTicket.status = status;
                loadTickets(currentPage);
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Failed to update status');
            }
        }

        // Update ticket priority
        async function updateTicketPriority() {
            if (!currentTicket) return;
            
            const priority = document.getElementById('updatePriority').value;
            
            try {
                await axios.put(\`/api/crm/tickets/\${currentTicket.id}\`, {
                    priority
                }, {
                    withCredentials: true
                });
                
                currentTicket.priority = priority;
                loadTickets(currentPage);
            } catch (error) {
                console.error('Error updating priority:', error);
                alert('Failed to update priority');
            }
        }

        // Update ticket assignee
        async function updateTicketAssignee() {
            if (!currentTicket) return;
            
            const assigned_to = document.getElementById('updateAssignee').value || null;
            
            try {
                await axios.put(\`/api/crm/tickets/\${currentTicket.id}\`, {
                    assigned_to
                }, {
                    withCredentials: true
                });
                
                currentTicket.assigned_to = assigned_to;
                loadTickets(currentPage);
            } catch (error) {
                console.error('Error updating assignee:', error);
                alert('Failed to update assignee');
            }
        }

        // Delete ticket
        async function deleteTicket() {
            if (!currentTicket) return;
            
            const confirmed = confirm(\`Are you sure you want to delete ticket #\${currentTicket.ticket_number}?\n\nThis will permanently delete:\n- The ticket\n- All messages\n- All history\n\nThis action cannot be undone.\`);
            
            if (!confirmed) return;
            
            try {
                const response = await axios.delete(\`/api/crm/tickets/\${currentTicket.id}\`, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    alert('Ticket deleted successfully');
                    closeViewModal();
                    loadTickets(currentPage);
                } else {
                    alert(\`Failed to delete ticket: \${response.data.error}\`);
                }
            } catch (error) {
                console.error('Error deleting ticket:', error);
                alert(\`Failed to delete ticket: \${error.response?.data?.error || error.message}\`);
            }
        }

        // Create new ticket
        async function createTicket(event) {
            event.preventDefault();
            
            const ticketData = {
                customer_email: document.getElementById('customerEmail').value.trim(),
                customer_name: document.getElementById('customerName').value.trim() || null,
                subject: document.getElementById('subject').value.trim(),
                description: document.getElementById('description').value.trim(),
                priority: document.getElementById('priority').value,
                category: document.getElementById('category').value.trim() || null,
                assigned_to: document.getElementById('assignedTo').value || null
            };
            
            try {
                const response = await axios.post('/api/crm/tickets/create', ticketData, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    alert('Ticket created successfully!');
                    closeCreateModal();
                    loadTickets(1);
                }
            } catch (error) {
                console.error('Error creating ticket:', error);
                alert(\`Failed to create ticket: \${error.response?.data?.error || error.message}\`);
            }
        }

        // Stats
        async function showStats() {
            try {
                const response = await axios.get('/api/crm/tickets/stats', {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    const { byStatus, byPriority, avgResponseTime, avgResolutionTime } = response.data.data;
                    
                    const statusCounts = byStatus.map(s => \`\${formatStatus(s.status)}: \${s.count}\`).join(', ');
                    const priorityCounts = byPriority.map(p => \`\${formatPriority(p.priority)}: \${p.count}\`).join(', ');
                    
                    alert(\`Ticket Statistics\n\nBy Status:\n\${statusCounts}\n\nBy Priority (Open tickets):\n\${priorityCounts}\n\nAvg Response Time: \${avgResponseTime.toFixed(1)} hours\nAvg Resolution Time: \${avgResolutionTime.toFixed(1)} hours\`);
                }
            } catch (error) {
                console.error('Error loading stats:', error);
                alert('Failed to load statistics');
            }
        }

        // Search with debounce
        let searchTimeout;
        function handleSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => loadTickets(1), 500);
        }

        // Modal controls
        function openCreateModal() {
            document.getElementById('createForm').reset();
            document.getElementById('createModal').classList.add('active');
        }

        function closeCreateModal() {
            document.getElementById('createModal').classList.remove('active');
        }

        function closeViewModal() {
            document.getElementById('viewModal').classList.remove('active');
            currentTicket = null;
        }

        // Formatting helpers
        function formatStatus(status) {
            const map = {
                'open': 'Open',
                'in_progress': 'In Progress',
                'waiting': 'Waiting',
                'resolved': 'Resolved',
                'closed': 'Closed'
            };
            return map[status] || status;
        }

        function formatPriority(priority) {
            const map = {
                'urgent': 'Urgent',
                'high': 'High',
                'medium': 'Medium',
                'low': 'Low'
            };
            return map[priority] || priority;
        }

        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    </script>

    ${CRM_SIDEBAR_PERMISSION_SCRIPT}
</body>
</html>
`;
