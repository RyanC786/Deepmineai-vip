/**
 * CRM Sidebar Permission-Based Navigation
 * Dynamically shows/hides sidebar links based on staff permissions
 */

// Raw script to be embedded in HTML pages
export const CRM_SIDEBAR_PERMISSION_SCRIPT = `
<script>
// Wait for DOM and fetch staff permissions
(async function() {
  try {
    // Get staff ID from session/localStorage
    const staffId = localStorage.getItem('crm_staff_id') || sessionStorage.getItem('crm_staff_id');
    
    if (!staffId) {
      console.warn('No staff ID found in session');
      return;
    }

    // Fetch permissions from API
    const response = await fetch('/api/crm/permissions', {
      headers: {
        'X-Staff-ID': staffId
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch permissions:', response.status);
      return;
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('Permission API error:', data.error);
      return;
    }

    const perms = data.permissions;
    console.log('Staff permissions loaded:', perms);

    // Define which links require which permissions
    const linkPermissions = {
      // CRM Section
      '/admin/crm/dashboard': perms.can_view_dashboard,
      // '/admin/crm/leads': perms.can_view_leads, // Moved to Go High Level
      '/admin/crm/staff': perms.can_view_staff,
      '/admin/crm/tasks': perms.can_view_tasks,
      '/admin/crm/activity-logs': perms.can_view_activity_logs,
      
      // Admin Section (stricter permissions)
      '/admin/kyc': perms.can_view_kyc,
      '/admin/panel/withdrawals': perms.can_view_withdrawals,
      '/admin/deposits': perms.can_view_deposits,
      '/admin/machines': perms.can_view_machines,
      '/admin/referrals': perms.can_view_referrals,
      '/admin/reports': perms.can_view_reports,
      '/admin/users': perms.can_view_users,
      '/admin/dashboard': perms.can_view_dashboard // Admin dashboard - typically restricted
    };

    // Hide links the staff doesn't have access to
    document.querySelectorAll('.nav-links a, a[href^="/admin"]').forEach(link => {
      const href = link.getAttribute('href');
      
      if (linkPermissions.hasOwnProperty(href)) {
        if (!linkPermissions[href]) {
          // Hide the entire nav-item parent if it exists
          const navItem = link.closest('.nav-item') || link.closest('a');
          if (navItem) {
            navItem.style.display = 'none';
            console.log('Hiding link:', href);
          }
        }
      }
    });

    // Also check sidebar specifically
    document.querySelectorAll('.sidebar a[href^="/admin"]').forEach(link => {
      const href = link.getAttribute('href');
      
      if (linkPermissions.hasOwnProperty(href)) {
        if (!linkPermissions[href]) {
          link.style.display = 'none';
          console.log('Hiding sidebar link:', href);
        }
      }
    });

    // Hide entire nav sections if all links are hidden
    document.querySelectorAll('.nav-section').forEach(section => {
      const visibleLinks = Array.from(section.querySelectorAll('a')).filter(
        link => link.style.display !== 'none'
      );
      
      if (visibleLinks.length === 0) {
        const sectionTitle = section.querySelector('.nav-section-title');
        if (sectionTitle) {
          sectionTitle.style.display = 'none';
        }
      }
    });

  } catch (error) {
    console.error('Error loading permissions:', error);
  }
})();
</script>
`;
