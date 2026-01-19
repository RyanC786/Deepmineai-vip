import re

crm_pages = [
    'src/pages/admin-crm-dashboard.html.ts',
    'src/pages/admin-leads-management.html.ts',
    'src/pages/admin-staff-management.html.ts',
    'src/pages/admin-task-board.html.ts',
    'src/pages/admin-activity-logs.html.ts',
    'src/pages/admin-staff-profile.html.ts'
]

for page_file in crm_pages:
    try:
        with open(page_file, 'r') as f:
            content = f.read()
        
        # Remove old import
        content = re.sub(
            r"import \{ getCRMSidebarPermissionScript \} from '../components/crm-sidebar-permissions';?\n?",
            "",
            content
        )
        
        # Remove old script injection
        content = re.sub(
            r"\$\{getCRMSidebarPermissionScript\(\)\}",
            "",
            content
        )
        
        # Add new import after first line
        if "import { CRM_SIDEBAR_PERMISSION_SCRIPT }" not in content:
            # Find the export line
            export_match = re.search(r"^export const \w+HTML = `", content, re.MULTILINE)
            if export_match:
                insert_pos = export_match.start()
                content = (content[:insert_pos] + 
                          "import { CRM_SIDEBAR_PERMISSION_SCRIPT } from '../components/crm-sidebar-permissions';\n\n" +
                          content[insert_pos:])
        
        # Add script before </body>
        if '${CRM_SIDEBAR_PERMISSION_SCRIPT}' not in content:
            content = content.replace('</body>', '    ${CRM_SIDEBAR_PERMISSION_SCRIPT}\n  </body>')
        
        with open(page_file, 'w') as f:
            f.write(content)
        
        print(f"✓ {page_file} - updated")
        
    except Exception as e:
        print(f"✗ {page_file} - ERROR: {e}")

print("\nAll CRM pages updated!")
