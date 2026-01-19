/**
 * DeepMine AI - Task Board (Kanban)
 * Complete task management with drag-and-drop
 */

import { CRM_SIDEBAR_PERMISSION_SCRIPT } from '../components/crm-sidebar-permissions';

export const adminTaskBoardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Board - DeepMine Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .sidebar-link:hover { background-color: rgba(59, 130, 246, 0.1); }
        .sidebar-link.active { background-color: rgba(59, 130, 246, 0.2); border-left: 3px solid #3b82f6; }
        
        .kanban-column {
            min-height: 400px;
            transition: background-color 0.2s;
        }
        
        .kanban-column.drag-over {
            background-color: rgba(59, 130, 246, 0.1);
            border: 2px dashed #3b82f6;
        }
        
        .task-card {
            cursor: grab;
            transition: all 0.2s;
        }
        
        .task-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .task-card.dragging {
            opacity: 0.5;
            cursor: grabbing;
        }
        
        .priority-urgent { border-left: 4px solid #ef4444; }
        .priority-high { border-left: 4px solid #f59e0b; }
        .priority-medium { border-left: 4px solid #3b82f6; }
        .priority-low { border-left: 4px solid #6b7280; }
        
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
                <a href="/admin/crm/tasks" class="sidebar-link active flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-tasks mr-3 w-5"></i>Tasks
                </a>
                <a href="/admin/crm/tickets" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
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
                        <h2 class="text-3xl font-bold text-white">Task Board</h2>
                        <p class="text-gray-400 mt-1">Manage tasks with drag & drop</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="showStats()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-chart-bar mr-2"></i>Stats
                        </button>
                        <button onclick="openCreateModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-plus mr-2"></i>New Task
                        </button>
                    </div>
                </div>
            </header>

            <!-- Kanban Board -->
            <div class="flex-1 overflow-x-auto overflow-y-hidden p-8">
                <div class="flex gap-6 h-full min-w-max">
                    <!-- To Do Column -->
                    <div class="flex flex-col w-80 flex-shrink-0">
                        <div class="bg-gray-800 rounded-t-lg p-4 border-b border-gray-700">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-bold text-white flex items-center">
                                    <i class="fas fa-circle text-gray-400 mr-2 text-xs"></i>
                                    To Do
                                    <span class="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full" id="count-todo">0</span>
                                </h3>
                            </div>
                        </div>
                        <div class="kanban-column bg-gray-800 rounded-b-lg p-4 flex-1 overflow-y-auto space-y-3" 
                             data-status="todo" 
                             ondrop="drop(event)" 
                             ondragover="allowDrop(event)" 
                             ondragleave="dragLeave(event)">
                            <div class="text-center text-gray-400 py-8" id="empty-todo">
                                <i class="fas fa-inbox text-3xl mb-2"></i>
                                <p>No tasks</p>
                            </div>
                        </div>
                    </div>

                    <!-- In Progress Column -->
                    <div class="flex flex-col w-80 flex-shrink-0">
                        <div class="bg-gray-800 rounded-t-lg p-4 border-b border-gray-700">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-bold text-white flex items-center">
                                    <i class="fas fa-circle text-blue-400 mr-2 text-xs"></i>
                                    In Progress
                                    <span class="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full" id="count-in_progress">0</span>
                                </h3>
                            </div>
                        </div>
                        <div class="kanban-column bg-gray-800 rounded-b-lg p-4 flex-1 overflow-y-auto space-y-3" 
                             data-status="in_progress" 
                             ondrop="drop(event)" 
                             ondragover="allowDrop(event)" 
                             ondragleave="dragLeave(event)">
                            <div class="text-center text-gray-400 py-8" id="empty-in_progress">
                                <i class="fas fa-inbox text-3xl mb-2"></i>
                                <p>No tasks</p>
                            </div>
                        </div>
                    </div>

                    <!-- Review Column -->
                    <div class="flex flex-col w-80 flex-shrink-0">
                        <div class="bg-gray-800 rounded-t-lg p-4 border-b border-gray-700">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-bold text-white flex items-center">
                                    <i class="fas fa-circle text-yellow-400 mr-2 text-xs"></i>
                                    Review
                                    <span class="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full" id="count-review">0</span>
                                </h3>
                            </div>
                        </div>
                        <div class="kanban-column bg-gray-800 rounded-b-lg p-4 flex-1 overflow-y-auto space-y-3" 
                             data-status="review" 
                             ondrop="drop(event)" 
                             ondragover="allowDrop(event)" 
                             ondragleave="dragLeave(event)">
                            <div class="text-center text-gray-400 py-8" id="empty-review">
                                <i class="fas fa-inbox text-3xl mb-2"></i>
                                <p>No tasks</p>
                            </div>
                        </div>
                    </div>

                    <!-- Done Column -->
                    <div class="flex flex-col w-80 flex-shrink-0">
                        <div class="bg-gray-800 rounded-t-lg p-4 border-b border-gray-700">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-bold text-white flex items-center">
                                    <i class="fas fa-circle text-green-400 mr-2 text-xs"></i>
                                    Done
                                    <span class="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full" id="count-done">0</span>
                                </h3>
                            </div>
                        </div>
                        <div class="kanban-column bg-gray-800 rounded-b-lg p-4 flex-1 overflow-y-auto space-y-3" 
                             data-status="done" 
                             ondrop="drop(event)" 
                             ondragover="allowDrop(event)" 
                             ondragleave="dragLeave(event)">
                            <div class="text-center text-gray-400 py-8" id="empty-done">
                                <i class="fas fa-inbox text-3xl mb-2"></i>
                                <p>No tasks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Create/Edit Task Modal -->
    <div id="taskModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
        <div class="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-white" id="modalTitle">Create Task</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>

            <form id="taskForm" onsubmit="saveTask(event)">
                <input type="hidden" id="taskId">
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title *</label>
                        <input type="text" id="taskTitle" required 
                               class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                               placeholder="Enter task title">
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea id="taskDescription" rows="4" 
                                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                  placeholder="Describe the task..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Priority</label>
                            <select id="taskPriority" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Status</label>
                            <select id="taskStatus" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                <option value="todo" selected>To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Category</label>
                            <input type="text" id="taskCategory" 
                                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                   placeholder="e.g., Development, Support">
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Assign To</label>
                            <select id="taskAssignee" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                <option value="">Unassigned</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Due Date</label>
                            <input type="date" id="taskDueDate" 
                                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Estimated Hours</label>
                            <input type="number" id="taskEstimatedHours" min="0" step="0.5"
                                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                   placeholder="0">
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex gap-3">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        <i class="fas fa-save mr-2"></i>Save Task
                    </button>
                    <button type="button" onclick="closeModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Task Detail Modal -->
    <div id="taskDetailModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
        <div class="bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-white" id="detailTitle">Task Details</h3>
                <div class="flex gap-2">
                    <button onclick="editTaskFromDetail()" class="text-blue-400 hover:text-blue-300">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTask()" class="text-red-400 hover:text-red-300">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="closeDetailModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
            </div>

            <div id="taskDetailContent">
                <!-- Content loaded dynamically -->
            </div>
        </div>
    </div>

    <script>
        let currentBoard = {};
        let currentTaskId = null;
        let staffMembers = [];
        let currentUser = null;

        // Load board
        async function loadBoard() {
            try {
                // Get current user info first to determine filtering
                if (!currentUser) {
                    const authResponse = await fetch('/api/admin/auth/me', {
                        credentials: 'include'
                    });
                    const authData = await authResponse.json();
                    
                    if (authData.success && authData.admin) {
                        currentUser = authData.admin;
                        console.log('[TASK BOARD] Current user:', currentUser.full_name);
                        console.log('[TASK BOARD] Role:', currentUser.role_name);
                    }
                }
                
                // Build URL with filtering based on role
                let boardUrl = '/api/crm/tasks/board';
                
                // Filter tasks based on role:
                // - super_admin: See all tasks
                // - admin: See all tasks
                // - Other roles (kyc_specialist, support_agent, etc.): See only assigned tasks
                if (currentUser && currentUser.role_name !== 'super_admin' && currentUser.role_name !== 'admin') {
                    boardUrl += '?assigned_to=' + currentUser.id;
                    console.log('[TASK BOARD] Filtering tasks for user ID:', currentUser.id);
                } else {
                    console.log('[TASK BOARD] Loading all tasks (Admin access)');
                }
                
                const response = await fetch(boardUrl, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    currentBoard = data.data;
                    renderBoard();
                } else {
                    console.error('Failed to load board:', data.error);
                }
            } catch (error) {
                console.error('Error loading board:', error);
            }
        }

        // Render board
        function renderBoard() {
            ['todo', 'in_progress', 'review', 'done'].forEach(status => {
                const column = document.querySelector(\`[data-status="\${status}"]\`);
                const tasks = currentBoard[status] || [];
                
                // Update count
                document.getElementById(\`count-\${status}\`).textContent = tasks.length;
                
                // Hide/show empty state
                const emptyState = document.getElementById(\`empty-\${status}\`);
                if (tasks.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                }
                
                // Render tasks
                const tasksHtml = tasks.map(task => createTaskCard(task)).join('');
                
                // Find or create tasks container
                let tasksContainer = column.querySelector('.tasks-container');
                if (!tasksContainer) {
                    tasksContainer = document.createElement('div');
                    tasksContainer.className = 'tasks-container space-y-3';
                    column.appendChild(tasksContainer);
                }
                tasksContainer.innerHTML = tasksHtml;
            });
        }

        // Create task card HTML
        function createTaskCard(task) {
            const priorityClass = \`priority-\${task.priority}\`;
            const priorityColors = {
                'urgent': 'bg-red-900 text-red-200',
                'high': 'bg-orange-900 text-orange-200',
                'medium': 'bg-blue-900 text-blue-200',
                'low': 'bg-gray-700 text-gray-300'
            };
            const priorityBadge = priorityColors[task.priority] || priorityColors.low;

            const dueDate = task.due_date ? new Date(task.due_date) : null;
            const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';
            const dueDateHtml = task.due_date ? \`
                <span class="\${isOverdue ? 'text-red-400' : 'text-gray-400'} text-xs">
                    <i class="fas fa-calendar mr-1"></i>\${new Date(task.due_date).toLocaleDateString()}
                </span>
            \` : '';

            const assigneeHtml = task.assigned_to_name ? \`
                <div class="flex items-center gap-2 text-sm text-gray-400">
                    <i class="fas fa-user text-xs"></i>
                    <span>\${task.assigned_to_name}</span>
                </div>
            \` : '';

            const commentsHtml = task.comment_count > 0 ? \`
                <span class="text-gray-400 text-xs">
                    <i class="fas fa-comment mr-1"></i>\${task.comment_count}
                </span>
            \` : '';

            return \`
                <div class="task-card bg-gray-700 rounded-lg p-4 border-l-4 \${priorityClass}" 
                     draggable="true" 
                     ondragstart="dragStart(event)" 
                     ondragend="dragEnd(event)"
                     onclick="openTaskDetail(\${task.id})"
                     data-task-id="\${task.id}">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-white flex-1">\${task.title}</h4>
                        <span class="px-2 py-1 rounded text-xs \${priorityBadge} ml-2">\${task.priority}</span>
                    </div>
                    
                    \${task.description ? \`<p class="text-sm text-gray-400 mb-3 line-clamp-2">\${task.description}</p>\` : ''}
                    
                    \${task.category ? \`<span class="inline-block px-2 py-1 bg-gray-600 rounded text-xs text-gray-300 mb-2">\${task.category}</span>\` : ''}
                    
                    <div class="flex items-center justify-between mt-3 text-xs">
                        <div class="flex items-center gap-3">
                            \${dueDateHtml}
                            \${commentsHtml}
                        </div>
                    </div>
                    
                    \${assigneeHtml}
                </div>
            \`;
        }

        // Drag and drop functions
        function dragStart(event) {
            event.target.classList.add('dragging');
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
        }

        function dragEnd(event) {
            event.target.classList.remove('dragging');
        }

        function allowDrop(event) {
            event.preventDefault();
            event.currentTarget.classList.add('drag-over');
        }

        function dragLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }

        async function drop(event) {
            event.preventDefault();
            const column = event.currentTarget;
            column.classList.remove('drag-over');
            
            const taskId = event.dataTransfer.getData('text/plain');
            const newStatus = column.dataset.status;

            try {
                const response = await fetch(\`/api/crm/tasks/\${taskId}/status\`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });

                const data = await response.json();

                if (data.success) {
                    await loadBoard();
                } else {
                    alert('Failed to update task: ' + data.error);
                }
            } catch (error) {
                console.error('Error updating task:', error);
                alert('Failed to update task');
            }
        }

        // Modal functions
        function openCreateModal() {
            document.getElementById('taskModal').classList.add('active');
            document.getElementById('modalTitle').textContent = 'Create Task';
            document.getElementById('taskForm').reset();
            document.getElementById('taskId').value = '';
            currentTaskId = null;
        }

        function closeModal() {
            document.getElementById('taskModal').classList.remove('active');
        }

        function closeDetailModal() {
            document.getElementById('taskDetailModal').classList.remove('active');
        }

        // Save task
        async function saveTask(event) {
            event.preventDefault();

            const taskData = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                priority: document.getElementById('taskPriority').value,
                status: document.getElementById('taskStatus').value,
                category: document.getElementById('taskCategory').value,
                assigned_to: document.getElementById('taskAssignee').value || null,
                due_date: document.getElementById('taskDueDate').value || null,
                estimated_hours: document.getElementById('taskEstimatedHours').value || null
            };

            const isEdit = currentTaskId !== null;
            const url = isEdit ? \`/api/crm/tasks/\${currentTaskId}\` : '/api/crm/tasks/create';
            const method = isEdit ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });

                const data = await response.json();

                if (data.success) {
                    closeModal();
                    await loadBoard();
                    alert(isEdit ? 'Task updated successfully' : 'Task created successfully');
                } else {
                    alert('Failed to save task: ' + data.error);
                }
            } catch (error) {
                console.error('Error saving task:', error);
                alert('Failed to save task');
            }
        }

        // Open task detail
        async function openTaskDetail(taskId) {
            currentTaskId = taskId;
            
            try {
                const response = await fetch(\`/api/crm/tasks/\${taskId}\`, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    displayTaskDetail(data.data);
                    document.getElementById('taskDetailModal').classList.add('active');
                } else {
                    alert('Failed to load task: ' + data.error);
                }
            } catch (error) {
                console.error('Error loading task:', error);
                alert('Failed to load task');
            }
        }

        // Display task detail
        function displayTaskDetail(task) {
            document.getElementById('detailTitle').textContent = task.title;
            
            const content = \`
                <div class="space-y-4">
                    <div>
                        <h4 class="text-sm font-medium text-gray-400 mb-1">Description</h4>
                        <p class="text-white">\${task.description || 'No description'}</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-sm font-medium text-gray-400 mb-1">Status</h4>
                            <span class="px-3 py-1 bg-blue-900 text-blue-200 rounded">\${task.status}</span>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-400 mb-1">Priority</h4>
                            <span class="px-3 py-1 bg-orange-900 text-orange-200 rounded">\${task.priority}</span>
                        </div>
                    </div>
                    
                    \${task.assigned_to_name ? \`
                    <div>
                        <h4 class="text-sm font-medium text-gray-400 mb-1">Assigned To</h4>
                        <p class="text-white">\${task.assigned_to_name}</p>
                    </div>
                    \` : ''}
                    
                    \${task.due_date ? \`
                    <div>
                        <h4 class="text-sm font-medium text-gray-400 mb-1">Due Date</h4>
                        <p class="text-white">\${new Date(task.due_date).toLocaleDateString()}</p>
                    </div>
                    \` : ''}
                    
                    <div>
                        <h4 class="text-sm font-medium text-gray-400 mb-1">Created By</h4>
                        <p class="text-white">\${task.created_by_name || 'Unknown'}</p>
                        <p class="text-gray-400 text-sm">\${new Date(task.created_at).toLocaleString()}</p>
                    </div>
                </div>
            \`;
            
            document.getElementById('taskDetailContent').innerHTML = content;
        }

        // Edit from detail
        async function editTaskFromDetail() {
            closeDetailModal();
            
            try {
                // Fetch task data (currentTaskId is already set from openTaskDetail)
                const response = await fetch('/api/crm/tasks/' + currentTaskId, {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.success) {
                    const task = data.data;
                    
                    // Open modal manually (don't use openCreateModal which resets currentTaskId)
                    document.getElementById('taskModal').classList.add('active');
                    document.getElementById('modalTitle').textContent = 'Edit Task';
                    
                    // Populate form fields
                    document.getElementById('taskTitle').value = task.title || '';
                    document.getElementById('taskDescription').value = task.description || '';
                    document.getElementById('taskStatus').value = task.status || 'todo';
                    document.getElementById('taskPriority').value = task.priority || 'medium';
                    document.getElementById('taskAssignee').value = task.assigned_to || '';
                    document.getElementById('taskDueDate').value = task.due_date ? task.due_date.split('T')[0] : '';
                    document.getElementById('taskEstimatedHours').value = task.estimated_minutes ? (task.estimated_minutes / 60).toFixed(1) : '';
                    
                    // Keep currentTaskId so saveTask knows it's an edit
                    console.log('[EDIT] Editing task ID:', currentTaskId);
                } else {
                    alert('Failed to load task for editing: ' + data.error);
                }
            } catch (error) {
                console.error('Error loading task for edit:', error);
                alert('Failed to load task for editing');
            }
        }

        // Delete task
        async function deleteTask() {
            if (!confirm('Are you sure you want to delete this task?')) return;

            try {
                const response = await fetch(\`/api/crm/tasks/\${currentTaskId}\`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    closeDetailModal();
                    await loadBoard();
                    alert('Task deleted successfully');
                } else {
                    alert('Failed to delete task: ' + data.error);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task');
            }
        }

        // Show stats
        async function showStats() {
            try {
                const response = await fetch('/api/crm/tasks/stats', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    const stats = data.data;
                    let statsText = 'Task Statistics:\\n\\n';
                    
                    statsText += 'By Status:\\n';
                    stats.byStatus.forEach(s => {
                        statsText += \`- \${s.status}: \${s.count}\\n\`;
                    });
                    
                    statsText += \`\\nOverdue: \${stats.overdue}\\n\`;
                    
                    alert(statsText);
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        // Load staff members
        async function loadStaff() {
            try {
                const response = await fetch('/api/crm/staff?per_page=100', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    staffMembers = data.data.staff;
                    
                    const select = document.getElementById('taskAssignee');
                    staffMembers.forEach(staff => {
                        const option = document.createElement('option');
                        option.value = staff.id;
                        option.textContent = staff.full_name || staff.username;
                        select.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error loading staff:', error);
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Debug: Check if admin_token cookie exists
            const cookies = document.cookie;
            console.log('[TASK BOARD] All cookies:', cookies);
            const hasAdminToken = cookies.includes('admin_token');
            console.log('[TASK BOARD] Has admin_token:', hasAdminToken);
            
            if (!hasAdminToken) {
                alert('Not logged in! Redirecting to login page...');
                window.location.href = '/admin/crm/login';
                return;
            }
            
            loadBoard();
            loadStaff();
            
            // Refresh every 30 seconds
            setInterval(loadBoard, 30000);
        });
    </script>
    
      ${CRM_SIDEBAR_PERMISSION_SCRIPT}
  </body>
</html>
`;
