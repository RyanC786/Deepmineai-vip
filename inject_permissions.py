import re

# Pages that need permission-based navigation
crm_pages = [
    'src/pages/admin-crm-dashboard.html.ts',
    'src/pages/admin-leads-management.html.ts',
    'src/pages/admin-staff-management.html.ts',
    'src/pages/admin-task-board.html.ts',
    'src/pages/admin-activity-logs.html.ts',
    'src/pages/admin-staff-profile.html.ts'
]

# Import statement to add
import_line = "import { getCRMSidebarPermissionScript } from '../components/crm-sidebar-permissions';"

# Script injection (add before closing </body> tag)
script_injection = "${getCRMSidebarPermissionScript()}"

for page_file in crm_pages:
    try:
        with open(page_file, 'r') as f:
            content = f.read()
        
        # Check if already has the import
        if 'getCRMSidebarPermissionScript' in content:
            print(f"✓ {page_file} - already has permission script")
            continue
        
        # Add import at the top (after first import)
        first_import_match = re.search(r"^import.*?;$", content, re.MULTILINE)
        if first_import_match:
            insert_pos = first_import_match.end()
            content = content[:insert_pos] + "\n" + import_line + content[insert_pos:]
        
        # Add script before </body>
        if '</body>' in content:
            content = content.replace('</body>', f'    {script_injection}\n  </body>')
            
        with open(page_file, 'w') as f:
            f.write(content)
        
        print(f"✓ {page_file} - permission script added")
        
    except Exception as e:
        print(f"✗ {page_file} - ERROR: {e}")

print("\nPermission scripts injected into all CRM pages!")
