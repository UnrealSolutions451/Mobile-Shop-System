// js/utils.js

export function toast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }
  const icons = {
    success: '✅', error: '❌', warning: '⚠️'
  };
  const colors = {
    success: '#10B981', error: '#EF4444', warning: '#F59E0B'
  };
  const t = document.createElement('div');
  t.style.cssText = `display:flex;align-items:center;gap:12px;padding:14px 18px;
    background:#1E293B;color:#fff;border-radius:12px;min-width:280px;max-width:380px;
    box-shadow:0 20px 25px -5px rgba(0,0,0,.2);
    border-left:4px solid ${colors[type] || colors.success};
    animation:slideInToast .3s ease;font-family:Inter,sans-serif;`;
  t.innerHTML = `<span style="font-size:18px;">${icons[type]||icons.success}</span>
                 <span style="font-size:13px;font-weight:500;">${msg}</span>`;
  container.appendChild(t);
  // Add animation keyframe once
  if (!document.getElementById('toastStyle')) {
    const s = document.createElement('style');
    s.id = 'toastStyle';
    s.textContent = '@keyframes slideInToast{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}';
    document.head.appendChild(s);
  }
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transition = 'opacity .3s';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

export function showLoading(msg = 'Please wait...') {
  let el = document.getElementById('globalLoadingOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'globalLoadingOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,.85);backdrop-filter:blur(4px);z-index:9998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;font-family:Inter,sans-serif;';
    el.innerHTML = `<div style="width:48px;height:48px;border:4px solid #E2E8F0;border-top-color:#4F46E5;border-radius:50%;animation:spin .8s linear infinite;"></div>
                    <p style="font-size:14px;color:#64748B;font-weight:500;">${msg}</p>
                    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
    document.body.appendChild(el);
  }
}

export function hideLoading() {
  document.getElementById('globalLoadingOverlay')?.remove();
}

export function formatCurrency(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(ts) {
  if (!ts) return '—';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
export function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

export async function generateBillNumber(db) {
  const { doc, getDoc, setDoc } =
    await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
  const ref = doc(db, 'counters', 'bills');
  try {
    const snap = await getDoc(ref);
    const next = snap.exists() ? (snap.data().count + 1) : 1001;
    await setDoc(ref, { count: next });
    return `BILL-${next}`;
  } catch(e) {
    return `BILL-${Date.now()}`;
  }
}