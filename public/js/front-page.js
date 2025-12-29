"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$(function () {
  var controller = new ScrollMagic.Controller();
  var rem = parseInt($('html').css('font-size'));
  var isDesk = window.innerWidth >= 1280;
  var heroSwiper = undefined;
  document.fonts.ready.then(function () {
    setTimeout(function () {
      // Hero banner slider
      // =============================
      var $heroSlides = $('.hero__slider .swiper-slide');

      if ($heroSlides.length > 1) {
        heroSwiper = new Swiper($('.hero__slider .swiper-container'), {
          init: window.innerWidth > 1280,
          effect: 'fade',
          speed: 1000,
          autoplay: {
            delay: 5000
          },
          fadeEffect: {
            crossFade: true
          }
        });
      }

      $('.hero__cont__title__item').css('transition', '0s');
      $('.hero-section').addClass('opening-anim-ended');
    }, 2000);
  });

  var throttle = function throttle(fn, wait) {
    var time = Date.now();
    return function () {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    };
  };

  var header = document.querySelector('.header'),
      heroBannerHeight = $('.hero__track').height() - window.innerHeight,
      headerHeight = $('.header').height();
  var heroSliderStopped = false;
  var st = window.scrollY;
  var prevSt = st;

  var handleHeaderState = function handleHeaderState() {
    st = window.scrollY;

    if (heroSwiper) {
      if (window.scrollY > headerHeight && !heroSliderStopped) {
        heroSliderStopped = true;
        heroSwiper.autoplay.stop();
      }

      if (window.scrollY < headerHeight && heroSliderStopped) {
        heroSwiper.autoplay.start();
        heroSliderStopped = false;
      }
    }

    if (window.scrollY > heroBannerHeight) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }

    prevSt = st;
  };

  document.addEventListener('scroll', function () {
    throttle(handleHeaderState(), 100);
  }); // Hero banner leve scene
  // =============================

  var $heroSticky = $('.hero__sticky'),
      $heroSection = $('.hero-section'),
      $heroCont = $('.hero__cont'),
      $heroSlider = $('.hero__slider'),
      $heroFirstStroke = $('.hero__cont__title__item').eq(0),
      firstStrokeMoveDistance = window.innerWidth * 0.1;
  var heroBannerLeaveScene = new ScrollMagic.Scene({
    triggerElement: $('.hero__track'),
    triggerHook: 1,
    offset: $('.hero__track').height() - window.innerHeight,
    duration: window.innerHeight * (isDesk ? 0.7 : 1)
  }).on('progress', function (event) {
    gsap.to($heroSticky, {
      autoAlpha: 1 - event.progress
    });
    gsap.to($heroFirstStroke, {
      x: firstStrokeMoveDistance * event.progress
    });
    gsap.to($heroCont, {
      y: -window.innerHeight / 2 * event.progress
    });

    if (isDesk) {
      gsap.to($heroSlider, {
        scale: 1 + event.progress * 0.5
      });
    }
  }).on('enter', function () {
    if (isDesk) {
      $heroSection.css({
        'pointer-events': 'auto',
        'visibility': 'visible'
      });
    }
  }).on('leave', function () {
    if (isDesk) {
      $heroSection.css({
        'pointer-events': 'none',
        'visibility': 'hidden'
      });
    }
  }).addTo(controller); // Home gallery scenes scene
  // =============================

  var homeGalleries = _toConsumableArray(document.getElementsByClassName('home-gallery'));

  homeGalleries === null || homeGalleries === void 0 ? void 0 : homeGalleries.forEach(function (gallery) {
    var homeGalleryEnterScene = new ScrollMagic.Scene({
      triggerElement: gallery,
      triggerHook: 0.3,
      offset: -$(gallery).height() / 2,
      duration: $(gallery).height() * 0.7
    }).on('progress', function (event) {
      $(gallery).find('img').each(function (imgIndex, img) {
        gsap.to(img, {
          rotate: -15 * (1 - event.progress),
          y: 5 * rem - 5 * rem * event.progress,
          opacity: 1 * event.progress
        });
      });
    }).addTo(controller);
    var homeGalleryLeaveScene = new ScrollMagic.Scene({
      triggerElement: gallery,
      triggerHook: 0.3,
      offset: $(gallery).height() / 2,
      duration: $(gallery).height()
    }).on('progress', function (event) {
      $(gallery).find('img').each(function (imgIndex, img) {
        gsap.to(img, {
          rotate: 15 * event.progress,
          y: -10 * rem * event.progress,
          opacity: 1 - event.progress
        });
      });
    }).addTo(controller);
  }); // Quote words movement scenes
  // =============================

  var $coverTop = $('.quote__cover--top');
  var $coverTopLine = $coverTop.children('div');
  var $coverBot = $('.quote__cover--bot');
  var $vertialLine1 = $('.quote__vertical--1');
  var $vertialLine2 = $('.quote__vertical--2');
  var $horizontalLine = $('.quote__horizontal');
  var horizontalLineWidht = $horizontalLine.width() / 2;
  var coverTopWidth = window.innerWidth * 0.2;
  var coverTopLineMovementWidth = window.innerWidth * 0.08;

  if (!isDesk) {
    var wordsMovementMobileEnterScene = new ScrollMagic.Scene({
      triggerElement: '.quote',
      triggerHook: 0.5,
      duration: window.innerHeight / 2
    }).on('progress', function (event) {
      $('.quote__item:nth-child(odd)').each(function (i, elem) {
        gsap.to(elem, {
          x: (1 - event.progress) * (i + 1) * window.innerWidth
        });
      });
      $('.quote__item:nth-child(even)').each(function (i, elem) {
        gsap.to(elem, {
          x: (1 - event.progress) * (i + 1) * -window.innerWidth
        });
      });
      gsap.to($vertialLine1, {
        y: -5 * rem * event.progress
      });
      gsap.to($vertialLine2, {
        y: -10 * rem * event.progress
      });
    }).addTo(controller);
  } else {
    var wordsMovementDesktopEnterScene = new ScrollMagic.Scene({
      triggerElement: '.quote',
      triggerHook: 0.5,
      duration: window.innerHeight / 2,
      offset: -10 * rem
    }).on('progress', function (event) {
      gsap.to($('.quote__item:nth-child(2) .quote__item__inner'), {
        rotate: (1 - event.progress) * 25,
        y: (1 - event.progress) * 3 * rem
      });
      gsap.to($('.quote__item:nth-child(3)'), {
        x: (1 - event.progress) * 15 * rem
      });
      gsap.to($('.quote__item:nth-child(4)'), {
        x: (1 - event.progress) * 5 * rem
      });
      gsap.to($vertialLine1, {
        y: -5 * rem * event.progress
      });
      gsap.to($vertialLine2, {
        y: -20 * rem * event.progress
      });
      gsap.to($horizontalLine, {
        x: event.progress * horizontalLineWidht
      });
      gsap.to($coverBot, {
        marginRight: event.progress * -27 * rem
      });
      gsap.to($coverTop, {
        width: coverTopWidth * (1 - event.progress),
        marginLeft: (1 - event.progress) * window.innerWidth * 0.2
      });
      gsap.to($coverTopLine, {
        right: coverTopLineMovementWidth + coverTopLineMovementWidth * -event.progress
      });
    }).addTo(controller);
    var wordsMovementDesktopLeaveScene = new ScrollMagic.Scene({
      triggerElement: '.quote',
      triggerHook: 0.4,
      offset: $('.quote').height() / 2,
      duration: window.innerHeight / 2
    }).on('progress', function (event) {
      $('.quote__item').each(function (i, elem) {
        gsap.to(elem, {
          y: event.progress * ($('.quote__item').length - i) * -5 * rem
        });
      });
    }).addTo(controller);
  } // Work stages scene on desk 
  // =============================


  if (isDesk) {
    var $workStages = $('.work-stages');
    var $stagesToMove = $('.work-stages__item');
    var $rectBtn = $('.work-stages-section .btn-rect');
    $stagesToMove.each(function (stageIndex, stage) {
      if (stageIndex < 2) {
        var homeStagesScene = new ScrollMagic.Scene({
          triggerElement: $workStages[0],
          triggerHook: 0.3,
          offset: -window.innerHeight / 2,
          duration: window.innerHeight / 2
        }).on('progress', function (event) {
          gsap.to(stage, {
            y: 15 * rem - event.progress * 15 * rem
          });
          stageIndex == 0 && gsap.to($rectBtn, {
            y: 15 * rem - event.progress * 15 * rem
          });
        }).addTo(controller);
      }
    });
  } // Home owners scene
  // =============================


  var $ownersTitleItems = $('.home-owners__info .title__item span');
  var $ownersPhoto = $('.home-owners__photo img');
  var homeOwnersScene = new ScrollMagic.Scene({
    triggerElement: '.home-owners-section',
    triggerHook: 0.5,
    offset: -200,
    duration: window.innerHeight / 2
  }).on('progress', function (event) {
    gsap.to($ownersTitleItems, {
      y: (1 - event.progress) * 50,
      rotate: (1 - event.progress) * 15
    });
    gsap.to($ownersPhoto, {
      rotate: (1 - event.progress) * 45,
      y: 15 * rem - 15 * rem * event.progress,
      autoAlpha: event.progress
    });
  }).addTo(controller);

  var forms = _toConsumableArray(document.getElementsByClassName('form'));

  var titleMoveLength = isDesk ? window.innerWidth / 4 : window.innerWidth / 2;
  forms === null || forms === void 0 ? void 0 : forms.forEach(function (form) {
    if ($(form).closest('.popup').length == 0) {
      var titleItems = _toConsumableArray(form.getElementsByClassName('title__item'));

      new ScrollMagic.Scene({
        triggerElement: form,
        offset: -window.innerHeight / 4,
        duration: window.innerHeight / 2,
        triggerHook: 0.7 // reverse: false,

      }).on('progress', function (evt) {
        titleItems.forEach(function (title, titleIndex) {
          if (titleIndex % 2) {
            gsap.to(title, {
              x: (1 - evt.progress) * titleMoveLength
            });
          } else {
            gsap.to(title, {
              x: (1 - evt.progress) * -titleMoveLength
            });
          }
        });
      }) // .addIndicators()
      .addTo(controller);
    }
  });
});