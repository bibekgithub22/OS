// ====== Mobile menu ======
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ====== Load code from .txt files ======
async function loadCodeBlocks() {
  const blocks = document.querySelectorAll('code[data-src]');
  await Promise.all([...blocks].map(async (el) => {
    const src = el.getAttribute('data-src');
    try {
      const res = await fetch(src, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      el.textContent = text; // textContent auto-escapes < > &
    } catch (err) {
      el.textContent = `// Failed to load ${src}\n// ${err.message}\n// If you opened this file directly (file://), run a local server:\n//   python -m http.server\n// then open http://localhost:8000`;
      el.classList.add('load-error');
    }
  }));
}
loadCodeBlocks();

// ====== Active nav link on scroll ======
const sections = document.querySelectorAll('.algo-section');
const navItems = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const scrollPos = window.scrollY + 120;
  let current = '';
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) current = sec.id;
  });
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ====== Copy code buttons ======
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const targetId = btn.dataset.target;
    const codeEl = document.getElementById(targetId);
    if (!codeEl) return;
    const text = codeEl.innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1600);
  });
});

// ====== Fade-in on scroll ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ====== Footer year ======
document.getElementById('year').textContent = new Date().getFullYear();
