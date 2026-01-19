/**
 * Standardized Top Navigation Bar for Admin Pages
 * This provides consistent navigation across all admin pages
 */

export interface TopNavConfig {
  activePage?: string; // Which page is currently active
  showLogo?: boolean;
  logoPath?: string;
}

export function getAdminTopNav(config: TopNavConfig = {}): string {
  const { 
    activePage = '', 
    showLogo = true,
    logoPath = '/static/dragon-logo-v2.png'
  } = config;

  const isActive = (page: string) => activePage === page ? 'active' : '';

  return `
    <nav class="nav-container">
        ${showLogo ? `
        <div class="logo">
            <img src="${logoPath}" alt="DeepMine AI">
            <span>DeepMine AI - Admin</span>
        </div>
        ` : '<div></div>'}
        <div class="nav-links">
            <a href="/admin/dashboard" class="${isActive('dashboard')}">
                <i class="fas fa-chart-line"></i> Dashboard
            </a>
            <a href="/admin/users" class="${isActive('users')}">
                <i class="fas fa-users"></i> Users
            </a>
            <a href="/admin/kyc" class="${isActive('kyc')}">
                <i class="fas fa-id-card"></i> KYC
            </a>
            <a href="/admin/machines" class="${isActive('machines')}">
                <i class="fas fa-server"></i> Machines
            </a>
            <a href="/admin/withdrawals" class="${isActive('withdrawals')}">
                <i class="fas fa-money-bill-wave"></i> Withdrawals
            </a>
            <a href="/admin/deposits" class="${isActive('deposits')}">
                <i class="fas fa-wallet"></i> Deposits
            </a>
            <a href="/admin/referrals" class="${isActive('referrals')}">
                <i class="fas fa-users-cog"></i> Referrals
            </a>
            <a href="/admin/reports" class="${isActive('reports')}">
                <i class="fas fa-chart-bar"></i> Reports
            </a>
            <a href="/admin/crm/dashboard" class="${isActive('crm')}" style="background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.5);">
                <i class="fas fa-headset"></i> CRM
            </a>
            <button id="logoutBtn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #F87171; cursor: pointer; padding: 8px 16px; border-radius: 8px; transition: all 0.3s;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    </nav>
  `;
}

export function getTopNavStyles(): string {
  return `
    .nav-container {
        background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(41, 121, 255, 0.2);
        padding: 16px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .logo { 
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 20px; 
        font-weight: 700; 
        color: #33F0FF;
    }
    
    .logo img {
        height: 40px;
        width: auto;
        filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
    }
    
    .nav-links { 
        display: flex; 
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
    }
    
    .nav-links a {
        color: #E0E7FF;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 8px;
        transition: all 0.3s;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    
    .nav-links a:hover {
        background: rgba(41, 121, 255, 0.1);
        color: #33F0FF;
        transform: translateY(-2px);
    }
    
    .nav-links a.active {
        background: rgba(41, 121, 255, 0.2);
        color: #33F0FF;
        border: 1px solid rgba(41, 121, 255, 0.5);
    }
    
    @media (max-width: 1200px) {
        .nav-links {
            gap: 4px;
        }
        .nav-links a {
            padding: 6px 12px;
            font-size: 13px;
        }
    }
  `;
}
