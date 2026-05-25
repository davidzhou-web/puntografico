/* ─────────────── Navbar Mobile ─────────────── */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-links a');

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

/* ─────────────── Navbar Scroll ─────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ─────────────── Form Validation ───────────── */
const form = document.getElementById('contactForm') || document.getElementById('contacto-form');

if (form) {
  const formSuccess = form.querySelector('.form-success');
  const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');

  const validationRules = {
    nombre: {
      required: true,
      minLength: 3,
      messages: {
        required: 'El nombre es obligatorio',
        minLength: 'El nombre debe tener al menos 3 caracteres'
      }
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      messages: {
        required: 'El email es obligatorio',
        pattern: 'Ingresa un email válido (ejemplo: tu@email.com)'
      }
    },
    telefono: {
      required: true,
      pattern: /^\+?[\d\s\-\(\)]{9,}$/,
      messages: {
        required: 'El teléfono es obligatorio',
        pattern: 'Ingresa un teléfono válido'
      }
    },
    servicio: {
      required: true,
      messages: {
        required: 'Selecciona un tipo de servicio'
      }
    },
    mensaje: {
      required: true,
      minLength: 10,
      messages: {
        required: 'Cuéntanos tu proyecto',
        minLength: 'Describe tu proyecto con más detalles (mínimo 10 caracteres)'
      }
    },
    privacidad: {
      required: true,
      messages: {
        required: 'Debes aceptar la política de privacidad'
      }
    }
  };

  function getErrorElement(field) {
    return document.getElementById(`error-${field.name}`);
  }

  function validateField(field) {
    const name = field.name;
    const rules = validationRules[name];
    const errorElement = getErrorElement(field);
    const fieldGroup = field.closest('.form-group, .form-field');

    if (!rules) return true;

    let isValid = true;
    let errorMessage = '';

    if (name === 'privacidad') {
      if (!field.checked) {
        isValid = false;
        errorMessage = rules.messages.required;
      }
    } else {
      const value = field.value.trim();

      if (rules.required && !value) {
        isValid = false;
        errorMessage = rules.messages.required;
      } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = rules.messages.minLength;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = rules.messages.pattern;
      }
    }

    if (!isValid) {
      fieldGroup.classList.add('error');
      if (errorElement) errorElement.textContent = errorMessage;
    } else {
      fieldGroup.classList.remove('error');
      if (errorElement) errorElement.textContent = '';
    }

    return isValid;
  }

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('change', () => validateField(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      console.log('Formulario enviado:', data);

      form.style.opacity = '0.6';
      form.style.pointerEvents = 'none';

      setTimeout(() => {
        formSuccess.classList.remove('hidden');
        form.reset();
        inputs.forEach(input => {
          const fieldGroup = input.closest('.form-group, .form-field');
          if (fieldGroup) fieldGroup.classList.remove('error');
          const errorElement = getErrorElement(input);
          if (errorElement) errorElement.textContent = '';
        });

        setTimeout(() => {
          form.style.opacity = '1';
          form.style.pointerEvents = 'auto';
          formSuccess.classList.add('hidden');
        }, 3000);
      }, 800);
    } else {
      const firstError = form.querySelector('.form-group.error');
      if (firstError) firstError.querySelector('input, textarea, select').focus();
    }
  });
}
