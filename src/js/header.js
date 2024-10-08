const navButton = document.querySelector('.btn-nav');
const navMenu = document.querySelector('nav');

// Toggle navigation menu and animate the bars
navButton.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        navMenu.classList.add('closing');
        setTimeout(() => {
            navMenu.classList.remove('active', 'closing');
        }, 500); // El tiempo debe coincidir con la duración de la animación
    } else {
        navMenu.classList.add('active');
    }
    navButton.classList.toggle('active');
});
