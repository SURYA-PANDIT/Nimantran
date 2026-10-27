/**
 * ========================================================
 * MADHU & ABHISHEK - ROYAL ENGAGEMENT INVITATION
 * PURE VANILLA JAVASCRIPT (ZERO DEPENDENCIES)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const envelopeScene = document.getElementById('envelopeScene');
  const gateScene = document.getElementById('gateScene');
  const mainContent = document.getElementById('mainContent');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
  const btnOpenText = document.getElementById('btnOpenText');
  const btnSkip = document.getElementById('btnSkip');
  const gateLeft = document.getElementById('gateLeft');
  const gateRight = document.getElementById('gateRight');
  const bgMusic = document.getElementById('bgMusic');
  const balloonsContainer = document.getElementById('balloonsContainer');
  const btnNavHome = document.getElementById('btnNavHome');
  const btnReplay = document.getElementById('btnReplay');
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const cardModal = document.getElementById('cardModal');
  const btnCardZoom = document.getElementById('btnCardZoom');
  const btnZoomAction = document.getElementById('btnZoomAction');
  const btnCloseModal = document.getElementById('btnCloseModal');

  let isOpening = false;
  let audioInitialized = false;

  // ==================== BACKGROUND MUSIC & SYNTH ====================
  let audioCtx = null;

  function startIndianWeddingSynth() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const master = audioCtx.createGain();
      master.gain.setValueAtTime(0.25, audioCtx.currentTime);
      master.connect(audioCtx.destination);

      // Tanpura Drone
      const droneGain = audioCtx.createGain();
      droneGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      droneGain.connect(master);

      const pitches = [138.59, 207.65, 277.18]; // Sa, Pa, Sa
      pitches.forEach((f) => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);
        osc.connect(filter);
        filter.connect(droneGain);
        osc.start();
      });

      // Melodic Bansuri / Shehnai notes (Raag Yaman)
      const scale = [277.18, 311.13, 349.23, 391.99, 415.3, 466.16, 523.25, 554.37];
      setInterval(() => {
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const noteOsc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(scale[Math.floor(Math.random() * scale.length)], now);

        // Vibrato
        const vib = audioCtx.createOscillator();
        vib.frequency.setValueAtTime(5.2, now);
        const vibGain = audioCtx.createGain();
        vibGain.gain.setValueAtTime(6.0, now);
        vib.connect(vibGain);
        vibGain.connect(noteOsc.frequency);
        vib.start(now);
        vib.stop(now + 2.5);

        // Envelope
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.28, now + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        noteOsc.connect(noteGain);
        noteGain.connect(master);
        noteOsc.start(now);
        noteOsc.stop(now + 2.3);
      }, 1600);
    } catch {
      // Audio not supported
    }
  }

  function playWeddingMusic() {
    if (audioInitialized) return;
    audioInitialized = true;
    if (bgMusic) {
      bgMusic.loop = true;
      bgMusic.play().catch(() => {
        startIndianWeddingSynth();
      });
    } else {
      startIndianWeddingSynth();
    }
  }

  // ==================== CELEBRATION BALLOONS ====================
  function launchBalloons() {
    balloonsContainer.classList.remove('hidden');
    balloonsContainer.innerHTML = '';
    const colors = ['#D6B56D', '#F7E6B0', '#800020', '#C5A059', '#F59E0B', '#FFF7D6'];

    for (let i = 0; i < 8; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      const leftPercent = 10 + Math.random() * 80;
      const delay = Math.random() * 1.2;
      const color = colors[i % colors.length];

      balloon.style.left = `${leftPercent}%`;
      balloon.style.background = `radial-gradient(circle at 35% 35%, #fff 0%, ${color} 60%, #35030c 100%)`;
      balloon.style.animationDelay = `${delay}s`;

      balloonsContainer.appendChild(balloon);
    }

    setTimeout(() => {
      balloonsContainer.classList.add('hidden');
      balloonsContainer.innerHTML = '';
    }, 4500);
  }

  // ==================== FIREWORKS ON CANVAS ====================
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas.getContext('2d');
  let fireworks = [];
  let fireworksRunning = false;

  function resizeCanvas() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerFireworks() {
    fireworksRunning = true;
    fireworks = [];
    const colors = ['#F7E6B0', '#D6B56D', '#EF4444', '#F59E0B', '#FFF7D6'];

    function createBurst(x, y) {
      const count = 35;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 4;
        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    // Multiple bursts
    createBurst(fwCanvas.width * 0.25, fwCanvas.height * 0.35);
    createBurst(fwCanvas.width * 0.75, fwCanvas.height * 0.35);
    setTimeout(() => createBurst(fwCanvas.width * 0.5, fwCanvas.height * 0.25), 400);

    function animateFw() {
      if (!fireworksRunning) return;
      fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= 0.015;

        if (p.alpha <= 0) {
          fireworks.splice(i, 1);
        } else {
          fwCtx.save();
          fwCtx.globalAlpha = p.alpha;
          fwCtx.fillStyle = p.color;
          fwCtx.beginPath();
          fwCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          fwCtx.fill();
          fwCtx.restore();
        }
      }

      if (fireworks.length > 0) {
        requestAnimationFrame(animateFw);
      } else {
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
        fireworksRunning = false;
      }
    }
    requestAnimationFrame(animateFw);
  }

  // ==================== GOLDEN PARTICLES BACKGROUND ====================
  const ptCanvas = document.getElementById('particlesCanvas');
  const ptCtx = ptCanvas.getContext('2d');
  let particles = [];

  function resizePt() {
    ptCanvas.width = window.innerWidth;
    ptCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizePt);
  resizePt();

  const particleCount = 40;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * ptCanvas.width,
      y: Math.random() * ptCanvas.height,
      radius: 0.8 + Math.random() * 2,
      vy: 0.2 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: 0.2 + Math.random() * 0.6,
    });
  }

  function animateParticles() {
    ptCtx.clearRect(0, 0, ptCanvas.width, ptCanvas.height);
    for (const p of particles) {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < 0) {
        p.y = ptCanvas.height;
        p.x = Math.random() * ptCanvas.width;
      }
      ptCtx.save();
      ptCtx.fillStyle = 'rgba(214, 181, 109, ' + p.alpha + ')';
      ptCtx.beginPath();
      ptCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ptCtx.fill();
      ptCtx.restore();
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==================== OPENING SEQUENCE ====================
  function startOpeningSequence() {
    if (isOpening) return;
    isOpening = true;

    // Start background music
    playWeddingMusic();

    // Animate envelope
    envelopeContainer.classList.add('opened');
    btnOpenText.innerText = 'निमंत्रण खुल रहा है...';

    // Launch celebration fireworks & balloons
    triggerFireworks();
    launchBalloons();

    // After flap and letter rise (1200ms), show Gate Scene
    setTimeout(() => {
      envelopeScene.classList.add('hidden');
      gateScene.classList.remove('hidden');

      // Grand gate swing open
      setTimeout(() => {
        gateLeft.classList.add('open-left');
        gateRight.classList.add('open-right');
      }, 300);

      // Transition to Main Invitation Content
      setTimeout(() => {
        gateScene.classList.add('hidden');
        mainContent.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Smooth cinematic tour to couple section
        setTimeout(() => {
          const coupleEl = document.getElementById('couple');
          if (coupleEl) coupleEl.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
      }, 1900);
    }, 1200);
  }

  function skipDirectlyToMain() {
    playWeddingMusic();
    envelopeScene.classList.add('hidden');
    gateScene.classList.add('hidden');
    mainContent.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Click listeners for opening
  envelopeContainer.addEventListener('click', startOpeningSequence);
  if (waxSealBtn) waxSealBtn.addEventListener('click', startOpeningSequence);
  btnOpenEnvelope.addEventListener('click', startOpeningSequence);
  btnSkip.addEventListener('click', skipDirectlyToMain);

  // Replay
  btnReplay.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    isOpening = false;
    envelopeContainer.classList.remove('opened');
    btnOpenText.innerText = 'निमंत्रण खोलें ✨';
    mainContent.classList.add('hidden');
    gateScene.classList.add('hidden');
    gateLeft.classList.remove('open-left');
    gateRight.classList.remove('open-right');
    envelopeScene.classList.remove('hidden');
  });

  if (btnNavHome) {
    btnNavHome.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu toggle
  btnMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Modal Card Zoom Lightbox
  function openModal() {
    cardModal.classList.remove('hidden');
  }
  function closeModal() {
    cardModal.classList.add('hidden');
  }

  btnCardZoom.addEventListener('click', openModal);
  btnZoomAction.addEventListener('click', openModal);
  btnCloseModal.addEventListener('click', closeModal);
  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) closeModal();
  });
});
