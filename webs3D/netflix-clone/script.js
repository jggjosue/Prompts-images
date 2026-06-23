document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    document.querySelectorAll('.faq-item.open').forEach(o => {
      if (o !== item) o.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

function handleStart(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  alert('¡Gracias! Continuaremos el registro con: ' + email);
}
