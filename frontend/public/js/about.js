window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  setTimeout(() => {
    heroContent.classList.add('show');
  }, 200); // small delay for smooth pop-up
});
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.service-cards .card');

  // Assign different directions
  cards[0].classList.add('from-left');
  cards[1].classList.add('from-bottom');
  cards[2].classList.add('from-right');

  // Create Intersection Observer
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(card => card.classList.add('show'));
        obs.unobserve(entry.target); // Stop observing after triggered
      }
    });
  }, { threshold: 0.3 }); // Trigger when 30% visible

  // Observe the section
  const section = document.querySelector('#services');
  observer.observe(section);
});
