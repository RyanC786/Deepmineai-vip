/**
 * DeepMine AI - CRM Type Definitions
 * Complete TypeScript types for CRM system
 */

// ============================================
// STAFF ROLES & PERMISSIONS
// ============================================

export interface StaffRole {
  id: number
  name: string
  display_name: string
  description: string | null
  permissions: string // JSON array
  is_system_role: number // 0 or 1
  created_at: string
  updated_at: string
}

export interface ParsedStaffRole extends Omit<StaffRole, 'permissions'> {
  permissions: string[]
}

// ============================================
// ADMIN USERS (ENHANCED)
// ============================================

export interface AdminUser {
  id: number
  username: string
  password_hash: string
  email: string | null
  full_name: string | null
  role: string
  permissions: string | null
  is_active: number
  last_login: string | null
  created_at: string
  updated_at: string
  // New CRM fields
  role_id: number | null
  department: string | null
  phone: string | null
  avatar_url: string | null
  login_count: number
  timezone: string
  notification_preferences: string | null // JSON
  two_factor_enabled: number
  created_by: number | null
}

export interface AdminUserWithRole extends AdminUser {
  role_name?: string
  role_display_name?: string
  role_permissions?: string[]
}

export interface NotificationPreferences {
  email: boolean
  telegram: boolean
  in_app: boolean
  kyc_submissions: boolean
  withdrawals: boolean
  tickets: boolean
  mentions: boolean
  quiet_hours?: {
    enabled: boolean
    start: string // "22:00"
    end: string // "08:00"
  }
}

// ============================================
// TASK MANAGEMENT
// ============================================

export type TaskType = 'kyc' | 'withdrawal' | 'ticket' | 'user_verification' | 'custom'
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface StaffTask {
  id: number
  task_type: TaskType
  reference_type: string
  reference_id: number
  title: string
  description: string | null
  assigned_to: number | null
  assigned_by: number | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  started_at: string | null
  completed_at: string | null
  estimated_minutes: number | null
  actual_minutes: number | null
  tags: string | null // JSON array
  metadata: string | null // JSON object
  created_at: string
  updated_at: string
}

export interface TaskWithDetails extends StaffTask {
  assigned_to_name?: string
  assigned_by_name?: string
  is_overdue?: boolean
  time_remaining?: number
}

// ============================================
// INTERNAL NOTES
// ============================================

export type NoteType = 'comment' | 'flag' | 'reminder' | 'decision'

export interface InternalNote {
  id: number
  reference_type: string
  reference_id: number
  note: string
  note_type: NoteType
  created_by: number
  is_private: number
  is_important: number
  mentioned_users: string | null // JSON array
  attachments: string | null // JSON array
  created_at: string
  updated_at: string
}

export interface NoteWithAuthor extends InternalNote {
  author_name: string
  author_avatar?: string
  mentioned_user_names?: string[]
}

// ============================================
// ACTIVITY LOGS
// ============================================

export type ActivityAction = 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'viewed' | 'assigned'
export type ActivityCategory = 'kyc' | 'user' | 'withdrawal' | 'staff' | 'system' | 'security'
export type ActivitySeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical'

export interface ActivityLog {
  id: number
  staff_id: number | null
  action: ActivityAction
  action_category: ActivityCategory
  resource_type: string
  resource_id: number | null
  resource_name: string | null
  description: string
  changes: string | null // JSON object
  metadata: string | null // JSON object
  ip_address: string | null
  user_agent: string | null
  session_id: string | null
  severity: ActivitySeverity
  created_at: string
}

export interface ActivityLogWithStaff extends ActivityLog {
  staff_name?: string
  staff_avatar?: string
}

export interface ActivityChanges {
  before?: Record<string, any>
  after?: Record<string, any>
  fields_changed?: string[]
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'task' | 'mention'
export type NotificationCategory = 'kyc' | 'withdrawal' | 'task' | 'system' | 'mention'
export type NotificationPriority = 'low' | 'normal' | 'high'

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: NotificationType
  category: NotificationCategory | null
  link: string | null
  icon: string | null
  reference_type: string | null
  reference_id: number | null
  is_read: number
  read_at: string | null
  priority: NotificationPriority
  expires_at: string | null
  action_required: number
  metadata: string | null // JSON object
  created_at: string
}

export interface NotificationWithDetails extends Notification {
  time_ago?: string
  is_expired?: boolean
}

// ============================================
// SUPPORT TICKETS
// ============================================

export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'
export type TicketCategory = 'kyc' | 'withdrawal' | 'account' | 'technical' | 'billing' | 'other'

export interface SupportTicket {
  id: number
  ticket_number: string
  user_id: number | null
  subject: string
  description: string
  category: TicketCategory | null
  status: TicketStatus
  priority: TicketPriority
  assigned_to: number | null
  assigned_at: string | null
  first_response_at: string | null
  resolved_at: string | null
  closed_at: string | null
  closed_by: number | null
  satisfaction_rating: number | null
  satisfaction_feedback: string | null
  tags: string | null // JSON array
  metadata: string | null // JSON object
  created_at: string
  updated_at: string
}

export interface TicketResponse {
  id: number
  ticket_id: number
  user_id: number | null
  staff_id: number | null
  message: string
  is_internal: number
  is_solution: number
  attachments: string | null // JSON array
  metadata: string | null // JSON object
  created_at: string
  updated_at: string
}

export interface TicketWithDetails extends SupportTicket {
  user_name?: string
  user_email?: string
  assigned_to_name?: string
  response_count?: number
  last_response_at?: string
  sla_status?: 'on_time' | 'at_risk' | 'breached'
}

// ============================================
// SAVED FILTERS
// ============================================

export type FilterType = 'users' | 'kyc' | 'withdrawals' | 'tickets' | 'tasks'

export interface SavedFilter {
  id: number
  user_id: number
  filter_name: string
  filter_type: FilterType
  filter_config: string // JSON object
  is_default: number
  is_shared: number
  usage_count: number
  created_at: string
  updated_at: string
}

export interface FilterConfig {
  status?: string[]
  priority?: string[]
  assigned_to?: number[]
  date_range?: {
    start: string
    end: string
  }
  search?: string
  [key: string]: any
}

// ============================================
// STAFF PERFORMANCE
// ============================================

export interface StaffPerformance {
  id: number
  staff_id: number
  metric_date: string // DATE
  tasks_assigned: number
  tasks_completed: number
  avg_completion_time_minutes: number
  kyc_approved: number
  kyc_rejected: number
  withdrawals_processed: number
  tickets_resolved: number
  avg_first_response_minutes: number
  total_work_minutes: number
  quality_score: number // 0-100
  efficiency_score: number // 0-100
  metadata: string | null // JSON object
  created_at: string
}

export interface PerformanceMetrics extends StaffPerformance {
  staff_name: string
  completion_rate?: number
  approval_rate?: number
  avg_response_time?: string
}

// ============================================
// ASSIGNMENT RULES
// ============================================

export type AssignmentStrategy = 'round_robin' | 'load_balanced' | 'skill_based' | 'random'

export interface AssignmentRule {
  id: number
  rule_name: string
  task_type: string
  conditions: string // JSON object
  assignment_strategy: AssignmentStrategy
  priority: number
  eligible_roles: string | null // JSON array
  is_active: number
  created_by: number | null
  created_at: string
  updated_at: string
}

export interface RuleConditions {
  status?: string
  priority?: string
  category?: string
  user_type?: string
  [key: string]: any
}

// ============================================
// SYSTEM HEALTH
// ============================================

export type HealthStatus = 'healthy' | 'warning' | 'critical'

export interface SystemHealthLog {
  id: number
  metric_name: string
  metric_value: number
  metric_unit: string | null
  status: HealthStatus
  threshold_warning: number | null
  threshold_critical: number | null
  metadata: string | null // JSON object
  recorded_at: string
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
  overview: {
    total_users: number
    active_users: number
    new_users_today: number
    new_users_this_week: number
  }
  kyc: {
    pending: number
    approved_today: number
    approved_this_week: number
    rejected_today: number
    avg_approval_time_minutes: number
  }
  withdrawals: {
    pending: number
    approved_today: number
    total_amount_pending: number
  }
  tickets: {
    open: number
    assigned: number
    resolved_today: number
    avg_response_time_minutes: number
  }
  tasks: {
    my_pending: number
    my_in_progress: number
    my_completed_today: number
    team_pending: number
  }
  staff: {
    total_active: number
    online_now: number
    top_performers: PerformanceMetrics[]
  }
}

export interface MyTasksSummary {
  urgent: StaffTask[]
  high_priority: StaffTask[]
  due_today: StaffTask[]
  overdue: StaffTask[]
  in_progress: StaffTask[]
}

export interface RecentActivity {
  activities: ActivityLogWithStaff[]
  unread_notifications: number
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    per_page?: number
    has_more?: boolean
  }
}

export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface FilterParams {
  status?: string | string[]
  priority?: string | string[]
  assigned_to?: number | number[]
  date_from?: string
  date_to?: string
  search?: string
  [key: string]: any
}

// ============================================
// PERMISSIONS
// ============================================

export type Permission = 
  | 'all'
  | 'users.view'
  | 'users.edit'
  | 'users.delete'
  | 'kyc.view'
  | 'kyc.approve'
  | 'kyc.reject'
  | 'withdrawals.view'
  | 'withdrawals.approve'
  | 'withdrawals.reject'
  | 'staff.view'
  | 'staff.create'
  | 'staff.edit'
  | 'staff.delete'
  | 'tasks.view'
  | 'tasks.assign'
  | 'tasks.complete'
  | 'tickets.view'
  | 'tickets.respond'
  | 'tickets.close'
  | 'reports.view'
  | 'reports.export'
  | 'analytics.view'
  | 'settings.view'
  | 'settings.edit'

export interface PermissionCheck {
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

export interface TimeRange {
  start: string | Date
  end: string | Date
}

export interface DateFilter {
  today?: boolean
  yesterday?: boolean
  last_7_days?: boolean
  last_30_days?: boolean
  custom?: TimeRange
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateTaskForm {
  task_type: TaskType
  reference_type: string
  reference_id: number
  title: string
  description?: string
  assigned_to?: number
  priority?: TaskPriority
  due_date?: string
  estimated_minutes?: number
  tags?: string[]
}

export interface CreateNoteForm {
  reference_type: string
  reference_id: number
  note: string
  note_type?: NoteType
  is_private?: boolean
  is_important?: boolean
  mentioned_users?: number[]
}

export interface CreateTicketForm {
  user_id?: number
  subject: string
  description: string
  category?: TicketCategory
  priority?: TicketPriority
}

export interface UpdateStaffForm {
  full_name?: string
  email?: string
  role_id?: number
  department?: string
  phone?: string
  is_active?: boolean
  notification_preferences?: NotificationPreferences
}

// ============================================
// EXPORTS
// ============================================

export type {
  AdminUser,
  AdminUserWithRole,
  StaffRole,
  ParsedStaffRole,
  StaffTask,
  TaskWithDetails,
  InternalNote,
  NoteWithAuthor,
  ActivityLog,
  ActivityLogWithStaff,
  Notification,
  NotificationWithDetails,
  SupportTicket,
  TicketResponse,
  TicketWithDetails,
  SavedFilter,
  FilterConfig,
  StaffPerformance,
  PerformanceMetrics,
  AssignmentRule,
  RuleConditions,
  SystemHealthLog,
  DashboardStats,
  MyTasksSummary,
  RecentActivity,
  ApiResponse,
  PaginationParams,
  FilterParams,
  NotificationPreferences,
  ActivityChanges,
}
