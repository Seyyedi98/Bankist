'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////
/////           Page Navigation             ////
////////////////////////////////////////////////

// Button Smooth Scrolling

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

////////////////////////////////////////////////
/////          Event Delegation             ////
////////////////////////////////////////////////

// -- Nav link smooth scrolling without Event Delegation:
// ! It's not a clean solution if we have large amount of elements to apply

document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault(); // prevent jump to id from HTML code

    const id = this.getAttribute('href'); // Get each nav link href
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  });
}); // Returns a node list

// -- Using Event Delegation
// In Event Delegation we use the fact that the event bubbles up
// 1. Add enent listener to common parent element
// 2. Determine what elemnt originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Matching strategy
  // console.log(e.target);
  // e.target is element that clicked

  if (e.target.classList.contains('nav__link')) {
    // console.log(e.target);
    e.preventDefault();

    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

////////////////////////////////////////////////
/////          Select and Remove            ////
////////////////////////////////////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
// console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

document.getElementsByClassName('btn');

// Creatin and insetting elemnts

// .insertAdjacentHTML;
const message = document.createElement('div'); // create div element
message.classList.add('cookie-message'); // add class to element
message.textContent =
  'We use cookiess for improved functionality and analytics';
message.innerHTML =
  'We use cookiess for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// insert created element to header
// prepend add el as a first child, but append add as a last child
header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true)); //clone element and use it multipy times

// header.before(message);
// header.after(message);

document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove(); //remove el
  });

/////////////////////////////////////////////////
/////                Styles                  ////
/////////////////////////////////////////////////

message.style.backgroundColor = '#37363d';
message.style.width = '120%';

// console.log(getComputedStyle(message).color); // Access to styles

// Used parseFloat to select number part in 43.6px
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// access root: to change css variables
// document.documentElement.style.setProperty('--color-primary', 'orangered');

const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';
// console.log(logo.alt);

// console.log(logo.getAttribute('designer'));
logo.setAttribute('compant', 'Bankist');

// - Data attributes
// Used to store data in UI
// Add this attribute in html file:
// data-version-number="3.0"
// console.log(logo.dataset.versionNumber);

// - Classes
logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't Use, Overwrite existing classes and allow us to use only one class
logo.className = 'Ramtin';

////////////////////////////////////////////////
/////          Smooth scrolling             ////
////////////////////////////////////////////////

/*
// - Old way (get all cords manually)
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sectoin1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // Get target cords
  const s1coords = sectoin1.getBoundingClientRect();

  // e stands fot element that we clicked
  console.log(e.target.getBoundingClientRect());

  // Window W/H
  console.log('Current scroll (X/Y):', window.pageXOffset, window.pageYOffset);

  // Page W/H
  console.log(
    'Viewport Width/Height',
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );

  // Scrolling

  // -- Solid Scroll
  // window.scrollTo(s1coords);
  // window.scrollTo(
  //   // + window.pageYOffset Used to finx scroll issue when were not at the top of the page
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // -- Smooth Scroll
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // - New way
  sectoin1.scrollIntoView({
    behavior: 'smooth',
  });
});

*/
////////////////////////////////////////////////
/////               Events                  ////
////////////////////////////////////////////////

const h1 = document.querySelector('h1');

// mouseenter is just like hover event in css
h1.addEventListener('mouseenter', function (e) {
  // alert('hover');
});

// - remove event listner, first must export the function
const colorH1 = function (e) {
  h1.style.color = 'red';
};

// add event
h1.addEventListener('mouseenter', colorH1);

// remove event after 1s
setTimeout(() => h1.removeEventListener('mouseenter', colorH1), 1000);

// old way
h1.onmouseenter = function (e) {
  // alert('hover');
};

////////////////////////////////////////////////
/////          Event Propagation            ////
////////////////////////////////////////////////

// Random Color
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  // this.style.backgroundColor = randomColor();
  // Extremely Important!!!!!!
  // Stop propagatoin
  // This line prevents parents from changing color
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    // this.style.backgroundColor = randomColor();
    // console.log(e.target, e.currentTarget);
  }
  // false
);

////////////////////////////////////////////////
/////           DOM Traversing              ////
////////////////////////////////////////////////
// Select an elemnt based another element
// Most of the time, we use the method with 'element' in it

// const h1 = document.querySelector('h1');

// ------- 1. Going downwards: child -------
// Choice only direct childs of h1
// console.log(h1.querySelectorAll('.highlight'));

// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

//  ------- 2. Going upwards: parents -------
// Direct parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// Select closest parent element with .header class
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-secondary)';

// ------- 3. Going sideways: siblings -------
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// To get all siblings, go to parrent and then selecet all childrens
// console.log(h1.parentElement.children);

// Select all the siblings of h1 (not h1 itself)
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    // el.style.transform = 'scale(0.5)';
  }
});

// _________________________________________________________
