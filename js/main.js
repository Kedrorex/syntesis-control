async function injectSharedLayout() {
  const headerMount = document.querySelector('[data-site-header]');
  const footerMount = document.querySelector('[data-site-footer]');

  const tasks = [];

  if (headerMount) {
    tasks.push(
      fetch('includes/header.html')
        .then((response) => response.ok ? response.text() : '')
        .then((html) => {
          if (!html) return;
          headerMount.outerHTML = html;
        })
    );
  }

  if (footerMount) {
    tasks.push(
      fetch('includes/footer.html')
        .then((response) => response.ok ? response.text() : '')
        .then((html) => {
          if (!html) return;
          footerMount.outerHTML = html;
        })
    );
  }

  if (tasks.length) {
    await Promise.all(tasks);
  }

  const currentPage = document.body?.dataset.page;
  if (!currentPage) return;

  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === currentPage) {
      link.classList.add('active');
    }
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initLeadForm() {
  const leadForm = document.querySelector('[data-lead-form]');
  if (!leadForm) return;

  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const type = String(formData.get('type') || '').trim();
    const note = leadForm.querySelector('.form-note');

    if (!name || !phone || !type) {
      if (note) note.textContent = 'Пожалуйста, заполните имя, телефон и тип объекта.';
      return;
    }

    if (note) {
      note.textContent = 'Заявка принята. Мы свяжемся с вами в ближайшее время.';
    }

    leadForm.reset();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await injectSharedLayout();
  initSmoothAnchors();
  initLeadForm();
});
