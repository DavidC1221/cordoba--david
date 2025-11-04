// Registro de Estudiantes - Laboratorio #7
// Requisitos: agregar, limpiar, eliminar individualmente y todo, validaciones.
// Autor: Generado para Marcos Córdoba

const form = document.getElementById('student-form');
const tbody = document.getElementById('tbody');
const badge = document.getElementById('badge-count');
const btnClear = document.getElementById('btn-clear');
const btnClearAll = document.getElementById('btn-clear-all');

// Estado en memoria (no persistente). Si se desea, se puede guardar en localStorage.
let students = [];
let seq = 1; // id incremental

// Helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function setBadge() {
  const n = students.length;
  badge.textContent = n === 1 ? '1 estudiante' : `${n} estudiantes`;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
}

function showEmptyRow() {
  if (students.length === 0) {
    tbody.innerHTML = '<tr class="empty"><td colspan="7">No hay resultados.</td></tr>';
  }
}

function render() {
  if (students.length === 0) {
    showEmptyRow();
    setBadge();
    return;
  }
  tbody.innerHTML = students.map((s, i) => `
    <tr data-id="${s.id}">
      <td>${i + 1}</td>
      <td>${s.firstName}</td>
      <td>${s.lastName}</td>
      <td>${s.email}</td>
      <td>${s.age}</td>
      <td>${s.career}</td>
      <td class="center">
        <button class="action-del" data-action="delete">Eliminar</button>
      </td>
    </tr>
  `).join('');
  setBadge();
}

// Validaciones
function validate(formData) {
  clearErrors();
  let ok = true;

  const setErr = (name, msg) => {
    const small = document.querySelector(`.error[data-for="${name}"]`);
    if (small) small.textContent = msg;
    ok = false;
  };

  const firstName = formData.get('firstName').trim();
  const lastName  = formData.get('lastName').trim();
  const email     = formData.get('email').trim();
  const ageStr    = formData.get('age').trim();
  const career    = formData.get('career').trim();

  if (!firstName) setErr('firstName', 'Requerido.');
  if (!lastName) setErr('lastName', 'Requerido.');

  if (!email) {
    setErr('email', 'Requerido.');
  } else if (!emailRegex.test(email)) {
    setErr('email', 'Formato inválido.');
  }

  const age = Number(ageStr);
  if (!ageStr) {
    setErr('age', 'Requerido.');
  } else if (Number.isNaN(age) || age < 18 || age > 100) {
    setErr('age', 'Debe estar entre 18 y 100.');
  }

  if (!career) setErr('career', 'Selecciona una opción.');

  return ok;
}

// Eventos
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (!validate(data)) return;

  const student = {
    id: seq++,
    firstName: data.get('firstName').trim(),
    lastName:  data.get('lastName').trim(),
    email:     data.get('email').trim(),
    age:       Number(data.get('age')),
    career:    data.get('career').trim(),
  };

  students.push(student);
  render();
  form.reset();                // limpiar formulario
  document.getElementById('age').value = 18; // valor por defecto
  clearErrors();
});

btnClear.addEventListener('click', () => {
  form.reset();
  document.getElementById('age').value = 18;
  clearErrors();
});

btnClearAll.addEventListener('click', () => {
  if (students.length === 0) return;
  const ok = confirm('¿Seguro que deseas eliminar todos los estudiantes?');
  if (!ok) return;
  students = [];
  render();
});

// Eliminar individual (delegación de eventos)
tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="delete"]');
  if (!btn) return;
  const tr = e.target.closest('tr');
  const id = Number(tr?.dataset.id);
  if (!id) return;
  students = students.filter(s => s.id !== id);
  render();
});

// Inicializar
showEmptyRow();
setBadge();
