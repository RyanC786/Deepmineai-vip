/**
 * CRM Navigation Permission Script
 * Add this script to CRM pages to hide/show navigation links based on staff permissions
 */

export function getCRMNavPermissionScript(): string {
  return `
<script>
// Permission-based navigation visibility
(async function() {
  try {
    // Fetch current staff's permissions
    const response = await fetch('/api/crm/permissions', {
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
      '/admin/dashboard': perms.can_view_dashboard, // Usually admin-only
      '/admin/users': perms.can_view_users,
      '/admin/kyc': perms.can_view_kyc,
      '/admin/machines': perms.can_view_machines,
      '/admin/withdrawals': perms.can_view_withdrawals,
      '/admin/deposits': perms.can_view_deposits,
      '/admin/referrals': perms.can_view_referrals,
      '/admin/reports': perms.can_view_reports,
    };
    
    // Apply visibility rules
    Object.entries(navRules).forEach(([href, allowed]) => {
      const links = document.querySelectorAll(\`a[href="\${href}"]\`);
      links.forEach(link => {
        if (!allowed) {
          link.style.display = 'none';
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
  `;
}
