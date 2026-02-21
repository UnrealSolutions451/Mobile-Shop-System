// js/sidebar.js
import { logout, getCurrentUser } from './auth.js';

export function initSidebar(activePage) {
  const user = getCurrentUser();
  if (!user) return;

  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebarBackdrop');
  const mobileToggle = document.getElementById('mobileToggle');

  // Set user info
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarAvatar');
  if (nameEl) nameEl.textContent = user.displayName || user.email.split('@')[0];
  if (roleEl) roleEl.textContent = user.role;
  if (avatarEl) avatarEl.textContent = (user.displayName || user.email)[0].toUpperCase();

  // Hide admin-only nav items for staff
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = user.role === 'admin' ? 'flex' : 'none';
  });

  // Active page highlight
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    if (el.dataset.page === activePage) el.classList.add('active');
  });

  // Desktop toggle
  let collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (collapsed) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      collapsed = !collapsed;
      sidebar.classList.toggle('collapsed', collapsed);
      mainContent.classList.toggle('expanded', collapsed);
      localStorage.setItem('sidebarCollapsed', collapsed);
    });
  }

  // Mobile toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      backdrop.classList.add('open');
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('open');
    });
  }

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
}