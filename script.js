'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

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
/////         Tabbed Components             ////
////////////////////////////////////////////////
// Lecture 13-13

// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));
// Use event deligation to prevent processing slowdown

tabsContainer.addEventListener('click', function (e) {
  // !!! Important solution:
  const clicked = e.target.closest('.operations__tab');
  // Clicked tab will stored in 'clicked'
  // console.log(clicked);

  // Guard Class - Ignore if clicked on empty area, to prevent returning null
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Active Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////////
/////       Nav links fade animation        ////
////////////////////////////////////////////////

// no more need to pass opacity in this function
const handleHover = function (e, opacity) {
  // console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      // if (el !== link) el.style.opacity = opacity;
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = opacity;
    logo.style.opacity = this;
  }
};

// Here js expects a function, not a function that returns a value,
// so we can't call handleHover(e, 0.5)
// nav.addEventListener('mouseover', handleHover);

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////
/////          Sticky Navigation            ////
////////////////////////////////////////////////

// Scroll event
// Using scroll event makes performance issues
const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   // console.log(window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky Navigation using intersection observer

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entires) {
  const [entry] = entires;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

////////////////////////////////////////////////
/////           Reveal Sections             ////
////////////////////////////////////////////////

const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  // Stop observing after first time
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(function (section) {
  sectionObserver.observe(section);

  // We add hodden class using js, because if user disabled js in their browser, then website is no mpre visible to them
  // section.classList.add('section--hidden');
});

////////////////////////////////////////////////
/////        Lazy loading iamges            ////
////////////////////////////////////////////////

// img[data-src] => select all img with data-scr attribute
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  // Replace the souece with data-src
  entry.target.src = entry.target.dataset.src;

  // It's not good idea to remove image blur immediately. In slow networks it's take too long to replace image. So user may see the old low res image
  // entry.target.classList.remove('lazy-img');

  // New event listener that waits for images to load, then remove blur effect
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////
/////               Slider                  ////
////////////////////////////////////////////////
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length; // length of slides nodelist

  const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  // This code reolaced with goToSlide(0);
  // slides.forEach(
  //   (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
  // );

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );

    // slides.forEach((s, i) => console.log(100 * (i - slide)));
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  };

  init();

  // Event hadlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset; // get data-slide

      goToSlide(slide);
      activateDot(slide);
    }
  });
};

sliders();
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

////////////////////////////////////////////////
/////          Select and Remove            ////
////////////////////////////////////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

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
// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true)); //clone element and use it multipy times

// header.before(message);
// header.after(message);

// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     message.remove(); //remove el
//   });

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
// logo.className = 'Ramtin';

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

////////////////////////////////////////////////
/////       Intersection Observer API       ////
////////////////////////////////////////////////

/*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  // set root to null, because we want to check entire viewport
  root: null, //target element to intersect

  // Percentage of intersection at which the observer callback will be called
  // 0.1 means intersect when 10% of item is in the viewport
  // threshold: 0.1,
  threshold: [0, 0.2], // callback function just when go to into or out of the viewport
  rootMargin: '-90px',  // Apply a box of 90px outside of a target element

};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

////////////////////////////////////////////////
/////               Slider                  ////
////////////////////////////////////////////////

/*
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length; // length of slides nodelist

const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.5)';
// slider.style.overflow = 'visible';

// This code reolaced with goToSlide(0);
// slides.forEach(
//   (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
// );

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );

  // slides.forEach((s, i) => console.log(100 * (i - slide)));
};
goToSlide(0);

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
};

// Prev slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

*/
// _________________________________________________________

// We can pass string instead of a obj to bind method
let obj = {
  name: 'Ramtin',
};

let hi = function () {
  return `Hello ${this}`; // convrt this.name => thios
};

// let greeting2 = hi.bind(obj);
let greeting = hi.bind('Ramtin');

// console.log(greeting());
// _________________________________________________________
