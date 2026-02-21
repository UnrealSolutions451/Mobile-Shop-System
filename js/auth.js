// js/auth.js
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from '../firebase-config.js';

export function requireAuth(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = getRoot() + 'index.html'; return; }
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists() || !snap.data().isActive) {
        await signOut(auth);
        window.location.href = getRoot() + 'index.html';
        return;
      }
      const userData = { uid: user.uid, email: user.email, ...snap.data() };
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      callback(userData);
    } catch (err) {
      console.error('Auth error:', err);
      window.location.href = getRoot() + 'index.html';
    }
  });
}

export function requireAdmin(callback) {
  requireAuth((user) => {
    if (user.role !== 'admin') { window.location.href = 'dashboard.html'; return; }
    callback(user);
  });
}

export function getCurrentUser() {
  const u = sessionStorage.getItem('currentUser');
  return u ? JSON.parse(u) : null;
}

export async function logout() {
  await signOut(auth);
  sessionStorage.clear();
  window.location.href = getRoot() + 'index.html';
}

// Works whether called from /pages/ or root
function getRoot() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}