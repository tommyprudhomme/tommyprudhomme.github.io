/* Toilettage M&M — application Vue */
(function () {
  'use strict';

  const { createApp, ref, reactive, computed, onMounted, onUnmounted } = Vue;

  createApp({
    setup() {
      /* ---------- Photos du salon (variantes générées par tools/convert.py) ---------- */
      const PHOTO_DATA = [
        { base: 'img_dogs/dog1', w: 1536, h: 2048, alt: 'Jeune chien beige au pelage soyeux avec un bandana rose, sur la table de toilettage' },
        { base: 'img_dogs/dog2', w: 2048, h: 1536, alt: 'Petit shih tzu gris et blanc avec son bandana' },
        { base: 'img_dogs/dog3', w: 1536, h: 2048, alt: 'Chat noir aux yeux ambrés avec son bandana, devant sa cage de transport' },
        { base: 'img_dogs/dog4', w: 1536, h: 2048, alt: 'Jeune chien noir et feu avec un bandana bleu, sur la table de toilettage' },
        { base: 'img_dogs/dog5', w: 2028, h: 2048, alt: 'Malamute allongé près de la porte du salon' },
        { base: 'img_dogs/dog6', w: 1805, h: 2048, alt: 'Un flat-coated retriever noir et un golden retriever côte à côte' },
        { base: 'img_dogs/dog7', w: 1946, h: 2048, alt: 'Chat maine coon roux avec son bandana, sur le comptoir du salon' },
        { base: 'img_dogs/dog8', w: 1536, h: 2048, alt: 'Petit shih tzu beige avec un bandana vert' },
        { base: 'img_dogs/dog9', w: 2048, h: 1536, alt: 'Chat persan gris après sa séance de démêlage, avec la fourrure retirée' },
        { base: 'img_dogs/dog10', w: 1536, h: 2048, alt: 'Petit spitz nain tout en rondeurs avec son bandana vert' },
        { base: 'img_dogs/dog11', w: 2048, h: 1536, alt: 'Jeune caniche golden tout sourire' },
        { base: 'img_dogs/dog12', w: 960, h: 640, alt: 'Shih tzu avec un bandana de fêtes sur la table de toilettage' }
      ];

      const photos = PHOTO_DATA.map((p) => {
        const variants = [480, 960, 1600].filter((v) => v < p.w).concat(p.w);
        const def = variants.find((v) => v >= 960) || variants[variants.length - 1];
        return {
          ...p,
          srcset: variants.map((v) => `${p.base}-${v}w.webp ${v}w`).join(', '),
          src: `${p.base}-${def}w.webp`,
          large: `${p.base}-${variants[variants.length - 1]}w.webp`,
          sizes: '(max-width: 900px) 45vw, 320px'
        };
      });

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
