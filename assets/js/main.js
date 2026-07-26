(() => {
  "use strict";

  /* ============ WhatsApp links ============ */
  const WA_NUMBER = "5561982533524";
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  const waTargets = [
    ["headerWaBtn", "Olá! Quero enviar meu caso para avaliação sobre reconhecimento de vínculo empregatício."],
    ["heroWaBtn", "Olá! Quero enviar meu caso para avaliação sobre reconhecimento de vínculo empregatício."],
    ["checklistWaBtn", "Olá! Respondi ao checklist da página e quero enviar meu caso para avaliação."],
    ["finalWaBtn", "Olá! Vim pela página sobre reconhecimento de vínculo empregatício e quero falar com um advogado."],
    ["floatWaBtn", "Olá! Quero falar com um advogado sobre reconhecimento de vínculo empregatício."],
    ["mobileNavWaBtn", "Olá! Quero enviar meu caso para avaliação sobre reconhecimento de vínculo empregatício."]
  ];
  waTargets.forEach(([id, msg]) => {
    const el = document.getElementById(id);
    if (el) el.href = waLink(msg);
  });

  /* ============ Header scroll state ============ */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============ Mobile nav ============ */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("is-open");
    mobileNav.classList.toggle("is-open");
  });
  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navToggle.classList.remove("is-open");
      mobileNav.classList.remove("is-open");
    });
  });

  /* ============ FAQ accordion ============ */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      item.classList.toggle("is-open");
    });
  });

  /* ============ Scroll reveal ============ */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ============ Word-cascade reveal (Bloco 3 — Aurora Editorial) ============ */
  const cascadeParas = document.querySelectorAll("[data-reveal-words]");
  if (!reduceMotion) {
    cascadeParas.forEach((p) => {
      const text = p.textContent.trim();
      const words = text.split(/\s+/);

      const srText = document.createElement("span");
      srText.className = "sr-only";
      srText.textContent = text;

      const visual = document.createElement("span");
      visual.setAttribute("aria-hidden", "true");
      visual.innerHTML = words
        .map((w, i) => `<span class="reveal-word" style="--i:${Math.min(i, 60)}">${w}</span>`)
        .join(" ");

      p.textContent = "";
      p.append(srText, visual);
    });

    const wordIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            wordIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    cascadeParas.forEach((p) => wordIo.observe(p));
  }
  // reduceMotion === true: parágrafos ficam como texto simples, 100% visível, sem wrap nem observer.

  /* ============ 3D tilt on hover (cards & photos) ============ */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      let rect = null;
      const strength = el.classList.contains("check-card") || el.classList.contains("right-card") ? 6 : 10;

      const onMove = (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateY(-4px)`;
      };
      const onEnter = () => { rect = el.getBoundingClientRect(); };
      const onLeave = () => {
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
        rect = null;
      };
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    });
  }

  /* ============ Hero 3D chain scene (Three.js) ============ */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && window.THREE && !reduceMotion) {
    try {
      const THREE = window.THREE;
      const heroSection = canvas.closest(".hero");

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 11);

      const goldLight = 0xf2e0b8;

      const ambient = new THREE.AmbientLight(0x2a3a5e, 1.4);
      scene.add(ambient);
      const key = new THREE.PointLight(goldLight, 3.2, 40);
      key.position.set(6, 5, 9);
      scene.add(key);
      const rim = new THREE.PointLight(0x4a6fb0, 2, 40);
      rim.position.set(-8, -4, 4);
      scene.add(rim);

      /* Floating particles for depth */
      const particleCount = 90;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({
        color: goldLight,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      let targetX = 0, targetY = 0, curX = 0, curY = 0;
      window.addEventListener("pointermove", (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      function resize() {
        const rect = heroSection.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener("resize", resize);

      const clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        curX += (targetX - curX) * 0.03;
        curY += (targetY - curY) * 0.03;

        particles.rotation.y = t * 0.015;

        camera.position.x = curX * 0.4;
        camera.position.y = -curY * 0.25;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
      animate();
    } catch (err) {
      canvas.style.display = "none";
    }
  } else if (canvas) {
    canvas.style.display = "none";
  }
})();
