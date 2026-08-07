// PRODUCT MAIN SECTION SLIDER IMAGES POPUP CODE
document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
      GLOBAL PROGRESS BARS CREATION
     ============================================================ */

  function createGlobalProgressBars() {
    const slides = document.querySelectorAll(".kr--video_modal_item");
    const globalContainer = document.querySelector(".kr--all-progress-bars");

    if (!slides.length || !globalContainer) return;

    slides.forEach(() => {
      const bar = document.createElement("div");
      bar.className = "kr--global-bar";
      bar.innerHTML = `<span></span>`;
      globalContainer.appendChild(bar);
    });

    return document.querySelectorAll(".kr--global-bar span");
  }

  const globalBars = createGlobalProgressBars();


  /* ============================================================
      POPUP + SWIPER INIT
     ============================================================ */

  const videoItems = document.querySelectorAll(".lx-slider-image-item");
  const popup = document.querySelector(".kr--video-modal__carousel");
  const closeBtn = popup?.querySelector(".kr_modal_close-button");
  const popupVideos = popup?.querySelectorAll("video");

  if (!videoItems.length || !popup) return;

  const videoSwiper = new Swiper(".kr--video-modal__carousel_block", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false,
    navigation: {
      nextEl: ".kr_modal_next--button",
      prevEl: ".kr_modal_prev--button",
    },
    on: {
      slideChange: function () {
        const index = videoSwiper.activeIndex;

        popupVideos.forEach(v => {
          v.pause();
          v.currentTime = 0;
        });

        if (globalBars) {
          globalBars.forEach(b => b.style.width = "0%");
        }

        setTimeout(() => {
          const activeVideo = document.querySelector(
            ".kr--video-modal__carousel .swiper-slide-active video"
          );

          if (activeVideo) {
            activeVideo.muted = false;
            activeVideo.play();
            attachProgress(activeVideo, index);
          }

          const muteBtn = document.querySelector(
            ".swiper-slide-active .kr--video-carousel__mute-control"
          );
          if (muteBtn) $(muteBtn).addClass("active");

        }, 150);
      }
    }
  });


  /* ============================================================
      PROGRESS HANDLER
     ============================================================ */

  function attachProgress(video, index) {
    if (!globalBars || !globalBars[index]) return;

    const bar = globalBars[index];
    bar.style.width = "0%";

    video.addEventListener("timeupdate", () => {
      if (video.duration) {
        bar.style.width = (video.currentTime / video.duration) * 100 + "%";
      }
    });

    video.addEventListener("ended", () => {
      bar.style.width = "100%";
    });
  }


  /* ============================================================
      THUMBNAIL CLICK → OPEN POPUP
     ============================================================ */

  videoItems.forEach((item) => {
    item.addEventListener("click", () => {
      const metaIndex = item.getAttribute("meta__index");

      // ⛔ STOP ALL THUMBNAIL VIDEOS
      document.querySelectorAll(".lx-slider-image-item video").forEach(v => {
        v.pause();
        v.muted = true;
        v.currentTime = 0;
      });

      popup.classList.add("active");
      document.body.classList.add("no-scroll");

      popupVideos.forEach(v => {
        v.pause();
        v.currentTime = 0;
      });

      const slideEl = document.querySelector(
        `.kr--vm_card_item[video__index="${metaIndex}"]`
      );

      if (slideEl) {
        const slideNode = slideEl.closest(".swiper-slide");
        const index = [...slideNode.parentNode.children].indexOf(slideNode);

        videoSwiper.slideTo(index);

        setTimeout(() => {
          const video = slideEl.querySelector("video");
          if (video) {
            video.muted = false;
            video.play();
            attachProgress(video, index);
          }

          const muteControl = slideEl.querySelector(".kr--video-carousel__mute-control");
          if (muteControl) $(muteControl).addClass("active");

        }, 200);
      }
    });
  });


  /* ============================================================
      CLOSE POPUP (BUTTON)
     ============================================================ */

  closeBtn?.addEventListener("click", () => {
    closePopup();
  });

  /* ============================================================
      CLOSE POPUP (OVERLAY)
     ============================================================ */

  popup.addEventListener("click", (e) => {
    if (e.target.classList.contains("kr--video-modal__carousel")) {
      closePopup();
    }
  });


  function closePopup() {
    popup.classList.remove("active");
    document.body.classList.remove("no-scroll");

    popupVideos.forEach(v => {
      v.pause();
      v.currentTime = 0;
    });

    // ▶ RESUME THUMBNAIL AUTOPLAY (MUTED)
    document.querySelectorAll(".lx-slider-image-item video").forEach(v => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }


  /* ============================================================
      MUTE / UNMUTE CONTROL
     ============================================================ */

  $(document).on("click", ".kr--video-carousel__mute-control", function () {
    const video = $(this).closest(".kr--vm_card_item").find("video")[0];
    if (!video) return;

    video.muted = !video.muted;
    $(this).toggleClass("active", !video.muted);
  });


  /* ============================================================
      INITIAL PROGRESS (FIRST SLIDE)
     ============================================================ */

  setTimeout(() => {
    const first = document.querySelector(
      ".kr--video-modal__carousel .swiper-slide-active video"
    );
    if (first) attachProgress(first, 0);
  }, 350);

});
