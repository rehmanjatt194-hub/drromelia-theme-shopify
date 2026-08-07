class SwiperComponent extends HTMLElement {
  constructor() {
    super();
    this.swiperInstance = null;
    this.currentMode = null;
    this._resizeHandler = this.handleResize.bind(this); // store once
  }

  connectedCallback() {
    this.initSlider();
    window.addEventListener("resize", this._resizeHandler);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._resizeHandler);
    this.destroySlider();
  }

  handleResize() {
    const newMode = this.getMode();
    if (newMode !== this.currentMode) {
      this.destroySlider();
      this.initSlider();
    }
  }

  getMode() {
    // Example breakpoint: 768px
    return window.innerWidth >= 850 ? "desktop" : "tablet";
  }

  // 🔹 Desktop config
  getDesktopConfig(list) {
    
    return {
      slidesPerView: Number(this.dataset.desktopSlides) || "auto",
      spaceBetween: Number(this.dataset.desktopSpacebetween) || 20,
      centeredSlides: this.dataset.desktopCenteredslides === "true",
      loop: this.dataset.desktopLoop === "true",
      navigation:
        this.dataset.desktopArrows === "true"
          ? this.dataset.desktopCustomArrows === "true"
            ? {
                nextEl: this.closest(".page-width").querySelector(".next-custom"),
                prevEl: this.closest(".page-width").querySelector(".prev-custom"),
              }
            : {
                nextEl: list.querySelector(".swiper-button-next"),
                prevEl: list.querySelector(".swiper-button-prev"),
              }
          : {},
      pagination:
        this.dataset.desktopPagination === "true"
          ? {
              el: list.querySelector(".swiper-pagination"),
              type: "progressbar",
            }
          : {},
    };

  }

  // 🔹 Tablet/Mobile config
  getTabletConfig(list) {
    return {
      slidesPerView: Number(this.dataset.mobileSlides) || "auto",
      spaceBetween: Number(this.dataset.mobileSpacebetween) || 10,
      centeredSlides: this.dataset.mobileCenteredslides === "true",
      loop: this.dataset.mobileLoop === "true",
      navigation:
        this.dataset.mobileArrows === "true"
          ? this.dataset.mobileCustomArrows === "true"
            ? {
                nextEl: this.closest(".page-width").querySelector(".next-custom"),
                prevEl: this.closest(".page-width").querySelector(".prev-custom"),
              }
            : {
                nextEl: list.querySelector(".swiper-button-next"),
                prevEl: list.querySelector(".swiper-button-prev"),
              }
          : {},
      pagination:
        this.dataset.mobilePagination === "true"
          ? {
              el: list.querySelector(".swiper-pagination"),
              type: "progressbar",
            }
          : {},
    };

  }

  initSlider() {
    const mode = this.getMode();
    this.currentMode = mode;

    

    let list = null;
    if (
      (mode === "desktop" && this.classList.contains("swiper--desktop")) ||
      (mode !== "desktop" && this.classList.contains("swiper--tablet"))
    ) {
      list = this;
    }
    

    if (!list) {
      console.warn(`No swiper element found for mode: ${mode}`);
      return;
    }
    


    // Choose config based on mode
    const config =
      mode === "desktop"
        ? this.getDesktopConfig(list)
        : this.getTabletConfig(list);
    

    this.swiperInstance = new Swiper(list, config);
  }

  destroySlider() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }
}

customElements.define("swiper-component", SwiperComponent);




$(document).ready(function() {
  $("details.mega-menu").each(function() {
    const $detail = $(this);
    const $summary = $detail.find("summary.header__menu-item");
    const $content = $detail.find(".mega-menu__content");

    // Hover in
    $summary.add($content).on("mouseenter", function() {
      $detail.attr("open", true);
      $detail.closest(".template-index sticky-header")
        .removeClass("header-wrapper--transparent")
        .addClass("open-mega");
    });

    // Hover out
    $summary.add($content).on("mouseleave", function(e) {
      if (!$(e.relatedTarget).closest($detail).length) {
        $detail.removeAttr("open");
        $detail.closest(".template-index sticky-header")
          .removeClass("open-mega")
          .addClass("header-wrapper--transparent");
      }
    });
  });
});




// FOOTER MOBILE TAB
$(document).ready(function () {
  if ($(window).width() <= 750) {
    $(".footer-block--link_list-lx.accordion--wrapper h2.footer-block__heading").click(function () {
      $(this)
        .parent(".footer-block--link_list-lx.accordion--wrapper")
        .toggleClass("open");
      $(this)
        .parent(".footer-block--link_list-lx.accordion--wrapper")
        .find(".footer-block__details-content")
        .slideToggle();
    });
  }
});



// document.addEventListener("DOMContentLoaded", function () {
//   const wrapper = document.querySelector(".featured-payments-wrapper");
//   const icons = wrapper.querySelectorAll(".payment-icon-items img");
//   const loadMoreBtn = wrapper.querySelector(".payment-icons-load-more");

//   loadMoreBtn.addEventListener("click", function () {
//     icons.forEach((icon) => {
//       icon.style.display = "inline-block";
//     });

//     loadMoreBtn.style.display = "none"; 
//   });
// });
$(".lx-pro-faq-question").click(function(){
  $(this).parent().toggleClass('active');
  $(this).parent().find('.lx-pro-faq-answer').slideToggle();
});

// PRODUCT SLIDER IMAGE'S
// document.addEventListener("DOMContentLoaded", function () {
//   new Swiper(".lxMetafieldSwiperImages", {
//     slidesPerView: 5,
//     spaceBetween: 10,
//     loop: true,
//     navigation: {
//       nextEl: ".lx-meta-next",
//       prevEl: ".lx-meta-prev",
//     },

//     breakpoints: {
//       750: {
//         slidesPerView: 5,
//       },
//       0: {
//         slidesPerView: 3,
//       }
//     }
//   });
// });


// Swiper template
class MaSlider extends HTMLElement {
  constructor() {
    super();
    this.observer = null;
    this.swiper = null;
  }

  connectedCallback() {
    this.init();
    this.observeChanges();
  }

  disconnectedCallback() {
    if (this.observer) this.observer.disconnect();
    if (this.swiper) this.swiper.destroy();
  }

  observeChanges() {
    this.observer = new MutationObserver((mutations) => {
      const swiperEl = this.querySelector('.js-swiper-template');
      if (swiperEl && !swiperEl.classList.contains('swiper-initialized')) {
        this.init();
      }
    });
    this.observer.observe(this, { childList: true, subtree: true });
  }

  init() {
    const swiperEl = this.querySelector('.js-swiper-template');
    if (!swiperEl || swiperEl.classList.contains('swiper-initialized')) return;

    if (typeof Swiper === 'undefined') {
        console.warn('Swiper JS not loaded');
        return;
    }

    const config = this.getConfig(swiperEl);
    if (!config) return;

    const params = {
      slidesPerView: config.mobileSlides,
      spaceBetween: config.mobileSpacing,
      loop: false,
      breakpoints: {
        768: {
          slidesPerView: config.tabletSlides,
          spaceBetween: config.desktopSpacing,
        },
        1024: {
          slidesPerView: config.desktopSlides,
          spaceBetween: config.desktopSpacing,
        }
      },
      navigation: {
        nextEl: this.querySelector('.swiper-custom-next'),
        prevEl: this.querySelector('.swiper-custom-prev')
      },
      on: {
        init: (swiper) => this.updateProgress(swiper),
        slideChange: (swiper) => this.updateProgress(swiper),
        progress: (swiper) => this.updateProgress(swiper)
      }
    };

    // --- NEW: Add Pagination Config ---
    const paginationEl = this.querySelector('.swiper-custom-pagination');
    if (paginationEl) {
        params.pagination = {
            el: paginationEl,
            clickable: true,
            type: 'bullets', // Change to 'fraction' if you want numbers
        };
    }

    // Scrollbar Config
    const scrollbarEl = this.querySelector('.swiper-custom-scrollbar');
    if (scrollbarEl) {
      params.scrollbar = {
        el: scrollbarEl,
        draggable: true,
        hide: false
      };
    }

    if (config.autoplay) {
      params.autoplay = {
        delay: config.autoplayInterval,
        disableOnInteraction: false
      };
    }

    this.swiper = new Swiper(swiperEl, params);
  }

  getConfig(el) {
    try {
      return JSON.parse(el.dataset.swiperConfig || '{}');
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  updateProgress(swiper) {
    const progressFill = this.querySelector('.swiper-progress-fill');
    if (!progressFill) return;
    
    const percentage = Math.max(0, Math.min(100, swiper.progress * 100));
    progressFill.style.width = `${percentage}%`;
  }
}

customElements.define('ma-slider', MaSlider);
// End Swiper template