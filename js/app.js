/* Toilettage M&M — application Vue */
(function () {
  'use strict';

  const { createApp, ref, reactive, computed, onMounted, onUnmounted } = Vue;

  createApp({
    setup() {
      /* ---------- Photos du salon ---------- */
      const photos = [
        { src: 'img_dogs/husky.webp', alt: 'Husky souriant pendant son bain' },
        { src: 'img_dogs/Untitled.jpg', alt: 'Petit shih tzu gris et blanc avec son bandana' },
        { src: 'img_dogs/Untitled2.jpg', alt: 'Chat noir aux yeux ambrés avec son bandana, devant sa cage de transport' },
        { src: 'img_dogs/Untitled3.jpg', alt: 'Jeune chien noir et feu avec un bandana bleu, sur la table de toilettage' },
        { src: 'img_dogs/Untitled4.jpg', alt: 'Malamute allongé près de la porte du salon' },
        { src: 'img_dogs/Untitled5.jpg', alt: 'Un flat-coated retriever noir et un golden retriever côte à côte' },
        { src: 'img_dogs/Untitled6.jpg', alt: 'Chat maine coon roux avec son bandana, sur le comptoir du salon' },
        { src: 'img_dogs/Untitled7.jpg', alt: 'Petit shih tzu beige avec un bandana vert' },
        { src: 'img_dogs/Untitled8.jpg', alt: 'Chat persan gris après sa séance de démêlage, avec la fourrure retirée' },
        { src: 'img_dogs/Untitle9d.jpg', alt: 'Petit spitz nain tout en rondeurs avec son bandana vert' },
        { src: 'img_dogs/Untitled10.jpg', alt: 'Jeune caniche golden tout sourire' },
        { src: 'img_dogs/zoro.webp', alt: 'Shih tzu avec un bandana de fêtes sur la table de toilettage' }
      ];

      /* ---------- Visionneuse ---------- */
      const lightbox = reactive({ open: false, index: 0 });
      const currentPhoto = computed(() => photos[lightbox.index]);

      function openLightbox(i) {
        lightbox.index = i;
        lightbox.open = true;
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.open = false;
        document.body.style.overflow = '';
      }

      function next() { lightbox.index = (lightbox.index + 1) % photos.length; }
      function prev() { lightbox.index = (lightbox.index - 1 + photos.length) % photos.length; }

      /* ---------- Détection téléphone / desktop ---------- */
      const isTouch = ref(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
      let mqList = null;
      let mqHandler = null;

      /* ---------- Copier le numéro (desktop) ---------- */
      const copied = ref(false);
      let copiedTimer = null;

      function copyPhone() {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText('579-960-2902').then(() => {
          copied.value = true;
          clearTimeout(copiedTimer);
          copiedTimer = setTimeout(() => { copied.value = false; }, 2000);
        });
      }

      function onPhoneCardClick(e) {
        if (!isTouch.value) {
          e.preventDefault();
          copyPhone();
        }
      }

      /* ---------- Navigation mobile ---------- */
      const menuOpen = ref(false);
      function closeMenu() { menuOpen.value = false; }

      /* ---------- Apparition au défilement ---------- */
      let observer;
      onMounted(() => {
        mqList = window.matchMedia('(hover: none) and (pointer: coarse)');
        mqHandler = (e) => { isTouch.value = e.matches; };
        mqList.addEventListener('change', mqHandler);
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      });
      onUnmounted(() => {
        observer && observer.disconnect();
        if (mqList && mqHandler) mqList.removeEventListener('change', mqHandler);
        clearTimeout(copiedTimer);
      });

      /* ---------- Clavier pour la visionneuse ---------- */
      function onKey(e) {
        if (!lightbox.open) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
      }
      onMounted(() => window.addEventListener('keydown', onKey));
      onUnmounted(() => window.removeEventListener('keydown', onKey));

      const year = new Date().getFullYear();

      return {
        photos,
        lightbox,
        currentPhoto,
        openLightbox,
        closeLightbox,
        next,
        prev,
        menuOpen,
        closeMenu,
        isTouch,
        copied,
        onPhoneCardClick,
        year
      };
    }
  }).mount('#app');
})();
