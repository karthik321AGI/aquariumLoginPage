const loginBox = document.querySelector('.login-box');
const registerBox = document.querySelector('.register-box');
const pond = document.querySelector('.pond');
const pondRect = pond.getBoundingClientRect();
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const bubbles = document.querySelectorAll('.bubble');
const loginLink = document.querySelector('.login-form a');
const registerLink = document.querySelector('.register-form a');

const stoneTakeoffAudio = new Audio('components/audio/stone_takeoff.mp3');
const stoneSplashAudio = new Audio('components/audio/stone_splash.mp3');

// Preload the audio files
stoneTakeoffAudio.preload = 'auto';
stoneSplashAudio.preload = 'auto';

// Function to create bubbles
function createBubbles() {
  bubbles.forEach((bubble) => {
    const duration = Math.random() * 5 + 3;
    const left = Math.random() * 90 + 5;
    const transform = `translateX(${Math.random() * 100 - 50}%)`;

    bubble.style.animationDuration = `${duration}s`;
    bubble.style.left = `${left}%`;
    bubble.style.transform = transform;
  });
}

// Function to animate stone
function animateStone(stone, clickedBox) {
  // Play the stone takeoff sound when the animation starts
  stoneTakeoffAudio.play();

  // Remove the 'disappear' class before the next animation
  stone.classList.remove('disappear');

  const stoneRect = stone.getBoundingClientRect();
  const stoneX = stoneRect.left + stoneRect.width / 2;
  const stoneY = stoneRect.top + stoneRect.height / 2;
  const pondX = pondRect.left + pondRect.width / 2;
  const pondY = pondRect.top + pondRect.height / 2;
  const distanceX = pondX - stoneX; // Absolute distance calculation for X
  const distanceY = pondY - stoneY; // Absolute distance calculation for Y
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
  let angle;
  if (clickedBox === loginBox) {
    angle = Math.PI / 3; // 60 degrees for login
  } else {
    angle = (2 * Math.PI) / 3; // 120 degrees for register
  }
  const initialSpeed = 600; // Increased initial speed
  const gravity = 800; // Reduced gravity for smoother trajectory
  const velocityX = initialSpeed * Math.cos(angle);
  const velocityY = initialSpeed * Math.sin(angle);
  const totalTime = (2 * velocityY) / gravity; // Time taken for the full trajectory
  const keyframes = [];
  let time = 0;
  const steps = 60; // Increased steps for smoother animation
  const stepTime = totalTime / steps;
  for (let i = 0; i < steps; i++) {
    const x = velocityX * time;
    const y = velocityY * time - 0.5 * gravity * time ** 2;
    keyframes.push({ transform: `translate(${x}px, ${-y}px)` });
    time += stepTime;
  }
  // Add a final keyframe to make the stone disappear when reaching the pond surface
  keyframes.push({ transform: `translate(${pondX - stoneX}px, ${pondY - stoneY}px) scale(0)` });
  const options = {
    duration: totalTime * 1000, // Duration in milliseconds
    easing: 'linear', // Linear easing for smooth animation
    fill: 'forwards'
  };

  stone.animate(keyframes, options)
    .onfinish = () => {
      // Play the stone splash sound when the animation finishes
      stoneSplashAudio.play();

      // Check if the respective form is already visible
      if (clickedBox === registerBox && registerForm.classList.contains('show-form')) {
        // If the register form is already visible, do nothing
        return;
      } else if (clickedBox === loginBox && loginForm.classList.contains('show-form')) {
        // If the login form is already visible, do nothing
        return;
      }

      // Show the respective form
      loginForm.classList.remove('show-form'); // Reset the login form
      registerForm.classList.remove('show-form'); // Reset the register form

      if (clickedBox === loginBox) {
        loginForm.classList.add('show-form'); // Show the login form
      } else {
        registerForm.classList.add('show-form'); // Show the register form
      }

      // Add the 'disappear' class after the animation finishes
      stone.classList.add('disappear');
    };
}

// Event Listeners
loginBox.addEventListener('click', () => {
  const stone = loginBox.querySelector('.stone');
  animateStone(stone, loginBox); // Pass the clicked login box
});

registerBox.addEventListener('click', () => {
  const stone = registerBox.querySelector('.stone');
  animateStone(stone, registerBox); // Pass the clicked register box
});

loginLink.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent the default link behavior
  const stone = registerBox.querySelector('.stone');
  animateStone(stone, registerBox); // Pass the clicked login box
});

registerLink.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent the default link behavior
  const stone = loginBox.querySelector('.stone');
  animateStone(stone, loginBox); // Pass the clicked register box
});

const stones = document.querySelectorAll('.stone');
stones.forEach(stone => {
  stone.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
  });
});

const fishes = document.querySelectorAll('.fish');
fishes.forEach(fish => {
  const randomX = (pond.offsetWidth - fish.offsetWidth);
  const randomY = (pond.offsetHeight - fish.offsetHeight);
  fish.style.left = `${randomX}px`;
  fish.style.top = `${randomY}px`;
});

// Create bubbles
createBubbles();