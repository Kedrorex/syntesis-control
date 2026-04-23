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
  console.log('Форма найдена:', !!leadForm);

  if (!leadForm) return;

  const endpoint = leadForm.getAttribute('data-form-endpoint') || 'https://formsubmit.co/ajax/b1b3062adeb8a1a28dabea9c3d4b23d1';
  console.log('Endpoint:', endpoint);

  const note = leadForm.querySelector('.form-note');
  const submitButton = leadForm.querySelector('button[type="submit"]');

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Отправка формы началась');

    const formData = new FormData(leadForm);

    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const type = String(formData.get('type') || '').trim();
    const comment = String(formData.get('comment') || '').trim();

    console.log('Данные формы:', { name, phone, type, comment });

    if (!name || !phone || !type) {
      console.warn('Валидация не пройдена');
      if (note) note.textContent = 'Пожалуйста, заполните имя, телефон и тип объекта.';
      return;
    }

    if (!comment) {
      formData.set('comment', 'Без комментария');
    }

    if (submitButton) submitButton.disabled = true;
    if (note) note.textContent = 'Отправляем заявку...';

    try {
      console.log('Отправляем запрос...');

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      console.log('Ответ сервера:', response);

      const responseText = await response.text();
      console.log('Тело ответа:', responseText);

      if (!response.ok) {
        throw new Error('request_failed');
      }

      if (note) {
        note.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      }

      console.log('Успешно отправлено');
      leadForm.reset();

    } catch (error) {
      console.error('Ошибка при отправке:', error);

      if (note) {
        note.textContent = 'Не удалось отправить заявку. Позвоните нам или напишите на sales.s-c@bk.ru.';
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
      console.log('Завершение обработки формы');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await injectSharedLayout();
  initSmoothAnchors();
  initServiceAccordions();
  initLeadForm();
});

// document.getElementById('lead-form').addEventListener('submit', function(e) {
//   e.preventDefault();

//   const note = this.querySelector('.form-note');

//   emailjs.sendForm(
//     'YOUR_SERVICE_ID',
//     'YOUR_TEMPLATE_ID',
//     this
//   ).then(() => {
//     note.textContent = 'Заявка отправлена!';
//     this.reset();
//   }, (error) => {
//     note.textContent = 'Ошибка отправки';
//     console.error(error);
//   });
// });