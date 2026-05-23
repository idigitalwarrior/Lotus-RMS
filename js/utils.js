// ============================================================
// LOTUS DASHBOARD — Shared Utilities
// ============================================================

// ── Toast Notifications ──
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ── Modal ──
export function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

// ── Tabs ──
export function initTabs(containerSelector) {
  const containers = document.querySelectorAll(containerSelector || '[data-tabs]');
  containers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        if (target) {
          document.getElementById(target)?.classList.add('active');
        } else {
          contents[i]?.classList.add('active');
        }
      });
    });
    buttons[0]?.classList.add('active');
    contents[0]?.classList.add('active');
  });
}

// ── Date Helpers ──
export function formatDate(date) {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function monthStr(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
}
export function yearStr(date = new Date()) {
  return `${date.getFullYear()}`;
}
export function getMonthName(dateStr) {
  const [y, m] = dateStr.split('-');
  return new Date(y, m-1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

// ── Confetti Animation ──
export function showConfetti(title = '🎉 Target Achieved!', subtitle = 'Congratulations! You\'ve smashed the target!') {
  let overlay = document.getElementById('confetti-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confetti-overlay';
    overlay.innerHTML = `
      <canvas id="confetti-canvas"></canvas>
      <div class="confetti-msg">
        <h2>${title}</h2>
        <p>${subtitle}</p>
        <button class="btn btn-primary mt-2" onclick="document.getElementById('confetti-overlay').remove()">Close</button>
      </div>`;
    document.body.appendChild(overlay);
  } else {
    overlay.querySelector('h2').textContent = title;
    overlay.querySelector('p').textContent = subtitle;
  }
  runConfettiCanvas();
  setTimeout(() => overlay?.remove(), 7000);
}

function runConfettiCanvas() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#002C5F','#00AAD2','#FFD700','#FF6B6B','#2DC653','#F4A261'];
  const particles = Array.from({length: 160}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 9 + 4,
    d: Math.random() * 160,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.floor(Math.random() * 10) - 10,
    tiltAngle: 0,
    tiltAngleDelta: (Math.random() * 0.1) + 0.05
  }));
  let frame;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleDelta;
      p.y += (Math.cos(p.d) + 2 + p.r/6);
      p.x += Math.sin(p.d) * 0.7;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      ctx.beginPath();
      ctx.lineWidth = p.r/2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r/4, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/4);
      ctx.stroke();
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random()*canvas.width; }
    });
    frame = requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => cancelAnimationFrame(frame), 6500);
}

// ── Danger Alert Animation ──
export function showDangerAlert(message = 'Target not achieved! Keep pushing!') {
  const existing = document.getElementById('danger-alert-popup');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'danger-alert-popup';
  el.style.cssText = `
    position:fixed;bottom:80px;right:24px;z-index:9990;
    background:#fff0f0;border:2px solid #e63946;border-radius:16px;
    padding:20px 28px;box-shadow:0 8px 32px rgba(230,57,70,0.3);
    max-width:340px;font-family:'Barlow',sans-serif;
  `;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="font-size:2rem;">⚠️</span>
      <div>
        <div style="font-weight:900;color:#e63946;font-size:1rem;">Target Not Achieved</div>
        <div style="font-weight:700;color:#5a6475;font-size:0.85rem;margin-top:4px;">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1.2rem;color:#5a6475;margin-left:auto;">✕</button>
    </div>`;
  el.classList.add('shake', 'pulse-danger');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 8000);
}

// ── Progress Bar Update ──
export function updateProgressBar(barEl, pctEl, current, target) {
  const pct = target > 0 ? Math.min(Math.round((current/target)*100), 100) : 0;
  if (barEl) barEl.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
  return pct;
}

// ── Auth Guard ──
export function requireAuth(roleRequired, redirectTo) {
  const user = JSON.parse(sessionStorage.getItem('lotus_user') || 'null');
  if (!user) { window.location.href = redirectTo || 'index.html'; return null; }
  if (roleRequired && user.role !== roleRequired && user.role !== 'admin') {
    window.location.href = redirectTo || 'index.html'; return null;
  }
  return user;
}

// ── Generate Initials ──
export function getInitials(name) {
  return (name || 'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
}

// ── Number Format ──
export function numFmt(n) {
  return Number(n || 0).toLocaleString('en-IN');
}

// ── Sidebar Toggle ──
export function initSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  hamburger?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('visible');
  });
  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('visible');
  });
}
