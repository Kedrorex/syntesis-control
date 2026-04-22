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
  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const type = String(formData.get('type') || '').trim();
    const comment = String(formData.get('comment') || '').trim();
    const note = leadForm.querySelector('.form-note');

    if (!name || !phone || !type) {
      if (note) note.textContent = 'Пожалуйста, заполните имя, телефон и тип объекта.';
      return;
    }

    const payload = new FormData();
    payload.append('name', name);
    payload.append('phone', phone);
    payload.append('type', type);
    payload.append('comment', comment || 'Без комментария');
    payload.append('_subject', 'Новая заявка с сайта Синтез Контроль');
    payload.append('_captcha', 'false');
    payload.append('_template', 'table');

    try {
      const response = await fetch('https://formsubmit.co/ajax/sales.s-c@bk.ru', {
        method: 'POST',
        body: payload,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      if (note) {
        note.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      }

      leadForm.reset();
    } catch (error) {
      if (note) {
        note.textContent = 'Не удалось отправить заявку. Позвоните нам или напишите на sales.s-c@bk.ru.';
      }
    }
  });
}
