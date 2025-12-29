"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$(function () {
  var isDesk = window.innerWidth >= 1280;
  var controller = new ScrollMagic.Controller();
  var rem = parseInt($('html').css('font-size'));
  document.fonts.ready.then(function () {
    $('.preloader__progress').css('width', '100vw');
    $('body').addClass('loaded');
    setTimeout(function () {
      $('body').addClass('show');
    }, 1000);
  });
  $('.header__burger').on('click', function () {
    $('.header').toggleClass('fullmenu-open');
  }); // Border buttons html generation
  // ==============================

  $(".btn--borderdraw").each(function (i, btn) {
    $(btn).append("\n            <div class='border'></div>\n            <div class='border'></div>\n            <div class='border'></div>\n            <div class='border'></div>\n        ");
  }); // Work stages scene on desk 
  // =============================

  if (isDesk) {
    var $workStages = $('.work-stages');
    var $stagesToMove = $('.work-stages__item');
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
        }).addTo(controller);
      }
    });
  }

  if (isDesk) {
    var footerEnterScene = new ScrollMagic.Scene({
      triggerElement: '.footer',
      triggerHook: 1
    }).on('enter leave', function (evt) {
      if (evt.type == 'enter') {
        $('.fixed-connect').addClass('stick-bottom');
      } else {
        $('.fixed-connect').removeClass('stick-bottom');
      }
    }).addTo(controller);
  }

  $('.fixed-connect').on('click', function () {
    $('[data-pop-name=contact-us]').fadeIn();
  });
  $('.popup__close').on('click', function () {
    $(this).closest('.popup').fadeOut();
  }); // Inputs labels and autofills
  // ==============================================

    $('.form-item:not(.menu-contact7):not(.form-item-calculator)').each(function (i, formItem) {
    // get input/textarea placeholder
    var $formItemLabel = $(formItem).find('input, textarea').attr('placeholder'); // create label element

    $formItemLabel = "<span class='form-item__label'>".concat($formItemLabel, "</span>"); // append label after input/textarea

    $(formItem).find('.wpcf7-form-control-wrap').append($formItemLabel); // set input/textarea attr autocomplete off

    $(formItem).find('input, textarea').attr('autocomplete', 'nope');
  }); // WPCF 7 Success msg event

  $('.menu-contact7').each(function (i, formItem) {
    // get input/textarea placeholder
    if (document.documentElement.lang === "ru-RU") {
        var $formItemLabel = 'Какая услуга интересует'; // create label element
    } 
    if (document.documentElement.lang === "en-US") {
        var $formItemLabel = 'Which service is of interest'; // create label element
    }

    $formItemLabel = "<span class='form-item__label'>".concat($formItemLabel, "</span>"); // append label after input/textarea

    $(formItem).find('.wpcf7-form-control-wrap').append($formItemLabel); // set input/textarea attr autocomplete off

    $(formItem).find('input, textarea').attr('autocomplete', 'nope');
  }); // WPCF 7 Success msg event
  // ==============================================

  document.addEventListener('wpcf7mailsent', function () {
    $('.form-success-modal').fadeIn();
    setTimeout(function () {
      $('.form-success-modal').fadeOut();
      $('.hustle-icon-close').trigger('click');
    }, 7000);
  }, false);
  $('.form-success-modal__close').on('click', function () {
    $('.form-success-modal').fadeOut();
    $('.hustle-icon-close').trigger('click');
  }); // Animation class adding by scroll
  // ==============================================

  window.applyScrollAnimOnPage = function () {
    var elemsToAnimate = _toConsumableArray(document.getElementsByClassName('js-scroll-anim'));

    elemsToAnimate === null || elemsToAnimate === void 0 ? void 0 : elemsToAnimate.forEach(function (elem) {
      if (!elem.matches('.animated')) {
        var scrollAnimScenes = new ScrollMagic.Scene({
          triggerElement: elem,
          triggerHook: 0.8,
          reverse: false
        }).on('enter', function () {
          var animDelay = elem.getAttribute('data-anim-delay');

          if (animDelay) {
            setTimeout(function () {
              elem.classList.add('animated');
            }, animDelay * 1000);
          } else {
            elem.classList.add('animated');
          }
        }).addTo(controller);
      }
    });
  };

  applyScrollAnimOnPage(); // Form titles animation by scroll
  // ======================================

  var forms = _toConsumableArray(document.getElementsByClassName('form'));

  var titleMoveLength = isDesk ? 15 * rem : window.innerWidth / 2;
  forms === null || forms === void 0 ? void 0 : forms.forEach(function (form) {
    if ($(form).closest('.popup').length == 0) {
      var titleItems = _toConsumableArray(form.getElementsByClassName('title__item'));

      new ScrollMagic.Scene({
        triggerElement: form,
        offset: -window.innerHeight / 4,
        duration: window.innerHeight / 2,
        triggerHook: 0.7
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
      }).addTo(controller);
    }
  }); // Form hidden input with pagename filling
  // ========================================

  var pageTitle = $('title').text();
  $('[name=user-name]').each(function (i, input) {
    $(input).closest('.form').find('[name=user-page]').val(pageTitle);
  }); // Form diamonds animation by scroll
  // ======================================

  var diamondsHolder = document.querySelector('.diamond-holder');

  var diamonds = _toConsumableArray(document.getElementsByClassName('diamond'));

  diamonds === null || diamonds === void 0 ? void 0 : diamonds.forEach(function (diamond, diamondIndex) {
    var needToParallax = $(diamond).closest('.popup').length == 0;

    if (needToParallax) {
      new ScrollMagic.Scene({
        triggerElement: diamondsHolder,
        offset: window.innerHeight / 4,
        duration: window.innerHeight,
        triggerHook: 0.7
      }).on('progress', function (evt) {
        switch (diamondIndex) {
          case 0:
            gsap.to(diamond, {
              y: -50 * evt.progress
            });
            break;

          case 1:
            gsap.to(diamond, {
              y: 50 * evt.progress
            });
            break;

          case 2:
            gsap.to(diamond, {
              y: 200 * evt.progress
            });
            break;
        }
      }).addTo(controller);
    }
  }); // Anchor Scroll Button
  // ========================

  $(".js-anchor-scroll").click(function (evt) {
    evt.preventDefault();
    var scrollTargetId = $(this).attr('href');

    if ($(this).attr('href').length > 0) {
      $('html').animate({
        scrollTop: $(scrollTargetId).offset().top
      });
    }
  }); // Facebook event listeners TODO
  // =============================
  // На все номера телефонов и почтовые ящики на сайте надо установить событие fbq('track', 'Contact');
  // На кнопку отправить в форме по кнопке связаться установить fbq('track', 'Lead');
  // При нажатии на кнопку связаться - fbq('track', 'InitiateCheckout');
  
  if(window.location.href === 'https://nkeyarchitects.com/us/home/' || window.location.href === 'https://nkeyarchitects.com/us/projects/' || window.location.href === 'https://nkeyarchitects.com/us/services/'){
    $(".wpcf7-validates-as-tel").intlTelInput({
      preferredCountries: ["us", "ae", "sa"],
      separateDialCode: true
    });
    $('.wpcf7-validates-as-tel').mask('(999) 999-99-99?9');
  } else {
    $(".wpcf7-validates-as-tel").intlTelInput({
      preferredCountries: ["ae", "us", "sa"],
      separateDialCode: true
    });
    $('.wpcf7-validates-as-tel').mask('(99) 999-999?9');
  };

  window.onresize = function() {onResize();};
    function onResize() {
        if($(window).width() < 1280) {
            //menu dropdown functionality
            $('.sub-menu').hide();
            $('.header .menu-item-has-children>a').addClass('mobile-click');
            $('.header .menu-item-has-children>a').off('click').on('click', function(e) {
                e.stopPropagation();
                if($(this).hasClass('mobile-click')) {
                  e.preventDefault();
                  $(this).next('.sub-menu').slideToggle();
                }
                $(this).toggleClass('mobile-click');
            });
            //fix body when open menu
        } else {
          $('.header .menu-item-has-children>a').removeClass('mobile-click');
        }
    }onResize();

  $(document).ready(function(){
    onResize();
    

      $('input.wpcf7-submit[type="submit"]').click(function() {
          var code_countryInput = $(this).parent().parent().find('.iti__selected-dial-code').text();
          $('input[name="code-country"]').val(code_countryInput);
      });

      var code_countryInput = $('.iti__selected-dial-code').text();
      //console.log(code_countryInput);
      
      $('.iti__selected-flag .iti__selected-dial-code').on('DOMSubtreeModified', function(){
        //console.log('changed');
          var valtext = $(this).text();
          if( $(this).parent().find('.iti__arrow').hasClass("iti__arrow--up") ) {
            //console.log( valtext);
            if ( valtext == '+380') {
              $('.wpcf7-validates-as-tel').mask('(99) 999-99-99?9');
            } else if ( valtext == '+971') {
              $('.wpcf7-validates-as-tel').mask('(99) 999-999?9');
            } else {
              $('.wpcf7-validates-as-tel').mask('(999) 999-99-99?9');
            }
          }        
      });

      $('li.iti__country').click(function() {
        var code_countryInput_activ =  $(this).data('dial-code');
        //console.log(code_countryInput_activ);
        if (code_countryInput_activ == '380') {
          $('.wpcf7-validates-as-tel').mask('(99) 999-99-99?9');
        } else if (code_countryInput_activ == '971')  {
          $('.wpcf7-validates-as-tel').mask('(99) 999-999?9')
        } else {
          $('.wpcf7-validates-as-tel').mask('(999) 999-99-99?9');
        }
      });

      
  });

  // Select the target inputs with type tel
  var targetInputs = $('input[type="tel"]');

  // Create a new observer instance
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Check if the target is one of the inputs we're interested in
      if (targetInputs.is(mutation.target)) {
        // Check if class attribute changed
        if (mutation.attributeName === 'class') {
          // Check if the class "wpcf7-not-valid" is added or removed
          var classList = $(mutation.target).attr('class').split(' ');
          if (classList.includes('wpcf7-not-valid')) {
            // Class "wpcf7-not-valid" added
            $(mutation.target).parent().addClass('wpcf7-not-valid');
          } else {
            // Class "wpcf7-not-valid" removed
            $(mutation.target).parent().removeClass('wpcf7-not-valid');
          }
        }
      }
    });
  });

  // Configuration of the observer
  var config = { attributes: true, attributeFilter: ['class'] };

  // Start observing the target inputs for changes in attributes
  targetInputs.each(function() {
    observer.observe(this, config);
  });
});