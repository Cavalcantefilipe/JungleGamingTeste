export function renderStartupError(): void {
  const root = document.getElementById('root');
  if (!root) return;
  const container = document.createElement('div');
  container.className =
    'bootstrap-pending grid min-h-screen place-content-center gap-6 p-6 text-center text-text-secondary';
  const message = document.createElement('p');
  message.setAttribute('role', 'alert');
  message.textContent = 'Não foi possível iniciar Kurio. Tente novamente.';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className =
    'min-h-11 rounded-md bg-primary px-6 py-3 font-bold text-ink hover:bg-primary-light active:bg-primary-dark disabled:opacity-50';
  retry.textContent = 'Tentar novamente';
  retry.addEventListener('click', () => {
    location.reload();
  });
  container.append(message, retry);
  root.replaceChildren(container);
}
