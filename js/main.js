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

const leadForm = document.querySelector('[data-lead-form]');

if (leadForm) {
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
