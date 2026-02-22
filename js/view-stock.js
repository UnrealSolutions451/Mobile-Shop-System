import { requireAuth } from './auth.js';
import { initSidebar } from './sidebar.js';
import { db } from '../firebase-config.js';
import { formatCurrency } from './utils.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allPhones = [];
let filtered = [];
const PAGE_SIZE = 5;
let currentPage = 1;

// Global accessible functions
window.applyFilters = function () {
    const term = document.getElementById('searchInput').value.trim().toLowerCase();
    const brand = document.getElementById('brandFilter').value;
    const owner = document.getElementById('ownerFilter').value;
    
    filtered = allPhones.filter(p => {
        if (p.status !== 'Available') return false;
        if (brand && p.brand !== brand) return false;
        if (owner === 'shop' && p.isThirdParty) return false;
        if (owner === 'third' && !p.isThirdParty) return false;
        if (term && !(p.brand?.toLowerCase().includes(term) ||
            p.model?.toLowerCase().includes(term) ||
            p.imei?.includes(term))) return false;
        return true;
    });
    currentPage = 1;
    renderTable();
};

window.goPage = function (p) {
    if (p < 1 || p > Math.ceil(filtered.length / PAGE_SIZE)) return;
    currentPage = p; 
    renderTable();
};

function renderTable() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);
    const tbody = document.getElementById('stockBody');
    document.getElementById('stockCount').textContent = `${filtered.length} phones`;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:40px;color:#94A3B8;">No phones found</td></tr>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = page.map((p, i) => `
    <tr>
      <td style="color:#94A3B8;font-size:12px;">${start + i + 1}</td>
      <td><strong>${p.brand}</strong></td>
      <td>${p.model}</td>
      <td style="font-family:monospace;font-size:12px;">${p.imei}</td>
      <td>${p.ram}</td>
      <td>${p.storage}</td>
      <td>${p.color || '—'}</td>
      <td style="color:#64748B;">${formatCurrency(p.purchasePrice)}</td>
      <td style="font-weight:700;color:#4F46E5;">${formatCurrency(p.sellingPrice)}</td>
      <td>${p.isThirdParty ?
        `<span class="badge badge-warning">${p.supplierName}</span>` :
        '<span class="badge badge-info">Shop</span>'}
      </td>
      <td><span class="badge badge-success"><i class="fas fa-circle" style="font-size:8px;"></i> Available</span></td>
    </tr>
  `).join('');

    renderPagination();
}

function renderPagination() {
    const total = Math.ceil(filtered.length / PAGE_SIZE);
    if (total <= 1) { 
        document.getElementById('pagination').innerHTML = ''; 
        return; 
    }
    
    let html = `<div class="page-info">Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}</div>
    <div class="page-btns">
      <button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - currentPage) <= 1)
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
        else if (Math.abs(i - currentPage) === 2) 
            html += '<span style="padding:6px 4px;color:#94A3B8;">...</span>';
    }
    
    html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === total ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>`;
    document.getElementById('pagination').innerHTML = html;
}

function debounce(fn, d) { 
    let t; 
    return (...a) => { 
        clearTimeout(t); 
        t = setTimeout(() => fn(...a), d); 
    }; 
}

// Initialization code
requireAuth(async (user) => {
    initSidebar('view-stock');
    try {
        const snap = await getDocs(query(collection(db, 'phones'), orderBy('createdAt', 'desc')));
        allPhones = [];
        snap.forEach(d => allPhones.push({ id: d.id, ...d.data() }));
        filtered = allPhones.filter(p => p.status === 'Available');
        renderTable();

        document.getElementById('searchInput').addEventListener('input', debounce(window.applyFilters, 300));
        document.getElementById('brandFilter').addEventListener('change', window.applyFilters);
        document.getElementById('ownerFilter').addEventListener('change', window.applyFilters);
    } catch (error) {
        console.error("Error loading stock:", error);
    }
});
