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

function initServiceAccordions() {
  const items = document.querySelectorAll('.service-accordion');
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function initLeadForm() {
  const leadForm = document.querySelector('[data-lead-form]');
  if (!leadForm) return;

  const endpoint = leadForm.getAttribute('data-form-endpoint');
  const note = leadForm.querySelector('.form-note');
  const submitButton = leadForm.querySelector('button[type="submit"]');

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const type = String(formData.get('type') || '').trim();

    if (!name || !phone || !type) {
      if (note) note.textContent = 'Пожалуйста, заполните имя, телефон и тип объекта.';
      return;
    }

    if (!endpoint) {
      if (note) note.textContent = 'Форма временно недоступна. Позвоните нам по телефону на странице контактов.';
      return;
    }

    if (submitButton) submitButton.disabled = true;
    if (note) note.textContent = 'Отправляем заявку...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('request_failed');
      }

      if (note) {
        note.textContent = 'Заявка отправлена. Мы скоро свяжемся с вами.';
      }

      leadForm.reset();
    } catch (error) {
      if (note) {
        note.textContent = 'Не удалось отправить форму. Напишите на sales.s-c@bk.ru или позвоните нам.';
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await injectSharedLayout();
  initSmoothAnchors();
  initServiceAccordions();
  initLeadForm();
});
