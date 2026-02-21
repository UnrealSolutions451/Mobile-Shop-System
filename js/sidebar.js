// js/sidebar.js
import { logout } from './auth.js';

export function initSidebar(activePage) {
  const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
  if (!user) return;

  // Populate user info
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarAvatar');

  if (nameEl) nameEl.textContent = user.displayName || user.email?.split('@')[0] || 'User';
  if (roleEl) roleEl.textContent = user.role || 'staff';
  if (avatarEl) avatarEl.textContent = (user.displayName || user.email || 'U')[0].toUpperCase();

  // Show/hide admin-only items
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = user.role === 'admin' ? 'flex' : 'none';
  });

  // Set active page
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === activePage);
  });

  // Mobile toggle logic (Desktop collapse removed)
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar?.classList.add('mobile-open');
      backdrop?.classList.add('open');
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      sidebar?.classList.remove('mobile-open');
      backdrop?.classList.remove('open');
    });
  }

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}