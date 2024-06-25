const button = document.getElementById('change-button');
const message = document.getElementById('message');

button.addEventListener('click', () => {
  message.textContent = 'Button Clicked!';
});
