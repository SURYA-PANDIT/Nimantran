/**
 * ========================================================
 * MADHU & ABHISHEK - ROYAL ENGAGEMENT INVITATION
 * PURE VANILLA JAVASCRIPT (ZERO FRAMEWORK DEPENDENCIES)
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
  const confettiContainer = document.getElementById('confettiContainer');
  const btnNavHome = document.getElementById('btnNavHome');
  const btnReplay = document.getElementById('btnReplay');
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const cardModal = document.getElementById('cardModal');
  const btnCardZoom = document.getElementById('btnCardZoom');
  const btnZoomAction = document.getElementById('btnZoomAction');
  const btnCloseModal = document.getElementById('btnCloseModal');

  // End of Page Closing Gate Elements
  const endGateOverlay = document.getElementById('endGateOverlay');
  const btnReopenGate = document.getElementById('btnReopenGate');
  const btnEndReplay = document.getElementById('btnEndReplay');
  const thankyouSection = document.getElementById('thankyou');
  const endGateNotice = document.getElementById('endGateNotice');
  const noticeProgressBar = document.getElementById('noticeProgressBar');
  const btnFloatingCloseGate = document.getElementById('btnFloatingCloseGate');

  let isOpening = false;
  let audioInitialized = false;
  let endGateShown = false;
  let endGateManuallyClosed = false;
  let endGateTimer = null;
  const END_GATE_DELAY_MS = 3500; // 3.5s delay after user arrives at the end

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
      bgMusic.onended = function() {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(() => {});
      };
      bgMusic.play().catch(() => {
        startIndianWeddingSynth();
      });
    } else {
      startIndianWeddingSynth();
    }
  }

  // ==================== CELEBRATION BALLOONS (18 Royal Balloons) ====================
  function launchBalloons() {
    if (!balloonsContainer) return;
    balloonsContainer.classList.remove('hidden');
    balloonsContainer.innerHTML = '';

    const colors = [
      { primary: '#F7E6B0', edge: '#8F6723' }, // Royal Gold
      { primary: '#D6B56D', edge: '#5C3E08' }, // Antique Gold
      { primary: '#C81E3B', edge: '#40030C' }, // Royal Crimson
      { primary: '#800020', edge: '#2B000B' }, // Velvet Burgundy
      { primary: '#F59E0B', edge: '#78350F' }, // Festive Amber
      { primary: '#EA580C', edge: '#7C2D12' }, // Saffron Orange
      { primary: '#E11D48', edge: '#4C0519' }, // Rose Ruby
      { primary: '#10B981', edge: '#064E3B' }, // Emerald Auspicious
      { primary: '#FFF7D6', edge: '#B48A3C' }, // Ivory Champagne
    ];

    const balloonCount = 18;
    for (let i = 0; i < balloonCount; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';

      const width = 36 + Math.floor(Math.random() * 26);
      const height = Math.floor(width * 1.28);
      const leftPercent = 3 + (i * 5.2) + (Math.random() * 4 - 2);
      const delay = (Math.random() * 1.6).toFixed(2);
      const duration = (3.6 + Math.random() * 1.6).toFixed(2);
      const theme = colors[i % colors.length];

      b.style.width = `${width}px`;
      b.style.height = `${height}px`;
      b.style.left = `${Math.min(95, Math.max(3, leftPercent))}%`;
      b.style.background = `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${theme.primary} 45%, ${theme.edge} 100%)`;
      b.style.animation = `floatUpwardRoyal ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;

      balloonsContainer.appendChild(b);
    }

    setTimeout(() => {
      balloonsContainer.classList.add('hidden');
      balloonsContainer.innerHTML = '';
    }, 4500);
  }

  // ==================== CELEBRATION CONFETTI & POPPERS (💥 🎊 🎉) ====================
  function launchConfetti() {
    if (!confettiContainer) return;
    confettiContainer.classList.remove('hidden');
    confettiContainer.innerHTML = '';

    const emojis = ['🎊', '🎉', '💥', '✨', '🪔', '⭐'];
    const foilColors = ['#FFF7D6', '#F7E6B0', '#D6B56D', '#EF4444', '#F59E0B', '#F43F5E', '#10B981'];

    for (let i = 0; i < 36; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';

      const size = 8 + Math.floor(Math.random() * 10);
      const left = Math.random() * 98;
      const delay = (Math.random() * 1.5).toFixed(2);
      const duration = (3.2 + Math.random() * 1.4).toFixed(2);
      const bg = foilColors[Math.floor(Math.random() * foilColors.length)];
      const isCircle = Math.random() > 0.5;

      piece.style.left = `${left}%`;
      piece.style.width = `${size}px`;
      piece.style.height = `${isCircle ? size : size * 1.8}px`;
      piece.style.borderRadius = isCircle ? '50%' : '2px';
      piece.style.backgroundColor = bg;
      piece.style.boxShadow = `0 0 6px ${bg}`;
      piece.style.animation = `confettiFall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;

      confettiContainer.appendChild(piece);
    }

    for (let i = 0; i < 14; i++) {
      const em = document.createElement('div');
      em.className = 'confetti-emoji';
      em.textContent = emojis[i % emojis.length];

      const left = 5 + Math.random() * 90;
      const delay = (0.2 + Math.random() * 1.5).toFixed(2);
      const duration = (3.0 + Math.random() * 1.3).toFixed(2);

      em.style.left = `${left}%`;
      em.style.animation = `emojiTumble ${duration}s ease-out ${delay}s forwards`;

      confettiContainer.appendChild(em);
    }

    setTimeout(() => {
      confettiContainer.classList.add('hidden');
      confettiContainer.innerHTML = '';
    }, 4500);
  }

  // ==================== FIREWORKS ON CANVAS (Multi-burst Patakha 💥) ====================
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas ? fwCanvas.getContext('2d') : null;
  let fireworks = [];
  let fireworksRunning = false;

  function resizeCanvas() {
    if (!fwCanvas) return;
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerFireworks() {
    if (!fwCanvas || !fwCtx) return;
    fireworksRunning = true;
    fireworks = [];
    const colors = ['#FFF7D6', '#F7E6B0', '#D6B56D', '#EF4444', '#F59E0B', '#F43F5E', '#10B981', '#A855F7'];

    function createBurst(x, y, count = 40, maxSpeed = 5) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.2);
        const speed = 1.8 + Math.random() * maxSpeed;
        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.012,
          radius: 1.5 + Math.random() * 2.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    createBurst(fwCanvas.width * 0.25, fwCanvas.height * 0.38, 38, 4.5);
    createBurst(fwCanvas.width * 0.75, fwCanvas.height * 0.38, 38, 4.5);

    setTimeout(() => {
      if (fireworksRunning) createBurst(fwCanvas.width * 0.5, fwCanvas.height * 0.26, 50, 5.5);
    }, 280);

    setTimeout(() => {
      if (fireworksRunning) {
        createBurst(fwCanvas.width * 0.35, fwCanvas.height * 0.48, 32, 4.0);
        createBurst(fwCanvas.width * 0.65, fwCanvas.height * 0.48, 32, 4.0);
      }
    }, 600);

    function animateFw() {
      if (!fireworksRunning) return;
      fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.vx *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          fireworks.splice(i, 1);
        } else {
          fwCtx.save();
          fwCtx.globalAlpha = p.alpha;
          fwCtx.fillStyle = p.color;
          fwCtx.shadowBlur = 6;
          fwCtx.shadowColor = p.color;
          fwCtx.beginPath();
          fwCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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

    setTimeout(() => {
      fireworksRunning = false;
      fireworks = [];
      if (fwCtx && fwCanvas) fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    }, 4500);
  }

  // ==================== GOLDEN PARTICLES BACKGROUND ====================
  const ptCanvas = document.getElementById('particlesCanvas');
  const ptCtx = ptCanvas ? ptCanvas.getContext('2d') : null;
  let particles = [];

  function resizePt() {
    if (!ptCanvas) return;
    ptCanvas.width = window.innerWidth;
    ptCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizePt);
  resizePt();

  if (ptCanvas && ptCtx) {
    const particleCount = 42;
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
        ptCtx.fillStyle = `rgba(214, 181, 109, ${p.alpha})`;
        ptCtx.beginPath();
        ptCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ptCtx.fill();
        ptCtx.restore();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==================== SYNCHRONIZED ROYAL OPENING SEQUENCE ====================
  let openingTimers = [];

  function clearOpeningTimers() {
    openingTimers.forEach((t) => clearTimeout(t));
    openingTimers = [];
  }

  function startOpeningSequence() {
    if (isOpening) return;
    isOpening = true;
    clearOpeningTimers();

    // Start background music loop
    playWeddingMusic();

    // Step 1 (t = 0): Envelope Flap unfolds slowly backward & Golden Letter glides up with easy-in and easy-out
    envelopeContainer.classList.add('opened');
    btnOpenText.innerText = 'सादर स्वागतम्...';

    // Launch celebration fireworks, balloons & confetti with gentle floating speeds
    triggerFireworks();
    launchBalloons();
    launchConfetti();

    // Step 2 (t = 1600ms): Slower, smooth cross-fade from envelope to Grand Palace Gate (easy-in-out)
    const t1 = setTimeout(() => {
      gateScene.classList.remove('hidden');
      requestAnimationFrame(() => {
        gateScene.classList.add('gate-entering');
        envelopeScene.classList.add('dissolving');
      });

      // Step 3 (t = 3100ms): Grand Palace doors swing open in 3D with easy-in and easy-out (3.0s duration)
      // As doors part, the names and texts emerge through the opening!
      const t2 = setTimeout(() => {
        gateScene.classList.add('gates-opening', 'gates-opened');
        gateLeft.classList.add('open-left');
        gateRight.classList.add('open-right');

        // Step 4 (t = 6500ms): As doors reach wide open and names have been fully revealed,
        // smoothly cross-fade to the main invitation content with easy-in and easy-out.
        const t3 = setTimeout(() => {
          mainContent.classList.remove('hidden');
          mainContent.classList.add('entering');
          window.scrollTo({ top: 0, behavior: 'instant' });

          gateScene.classList.add('gate-leaving');
          envelopeScene.classList.add('hidden');
          envelopeScene.classList.remove('dissolving');

          // Step 5 (t = 7900ms): Complete handoff and initialize end-of-page gate observer
          const t4 = setTimeout(() => {
            gateScene.classList.add('hidden');
            gateScene.classList.remove('gate-entering', 'gate-leaving', 'gates-opening', 'gates-opened');
            mainContent.classList.remove('entering');
            initEndGateObserver();
          }, 1400);
          openingTimers.push(t4);
        }, 3400);
        openingTimers.push(t3);
      }, 1500);
      openingTimers.push(t2);
    }, 1600);
    openingTimers.push(t1);
  }

  function skipDirectlyToMain() {
    clearOpeningTimers();
    playWeddingMusic();
    envelopeScene.classList.add('hidden');
    envelopeScene.classList.remove('dissolving');
    gateScene.classList.add('hidden');
    gateScene.classList.remove('gate-entering', 'gate-leaving', 'gates-opening', 'gates-opened');
    gateLeft.classList.remove('open-left');
    gateRight.classList.remove('open-right');
    mainContent.classList.remove('hidden', 'entering');
    window.scrollTo({ top: 0, behavior: 'instant' });
    initEndGateObserver();
  }

  // Click listeners for opening
  envelopeContainer.addEventListener('click', startOpeningSequence);
  if (waxSealBtn) waxSealBtn.addEventListener('click', startOpeningSequence);
  btnOpenEnvelope.addEventListener('click', startOpeningSequence);
  btnSkip.addEventListener('click', skipDirectlyToMain);

  // ==================== CLOSING PALACE GATE AT END OF PAGE ====================
  function scheduleEndGateClose() {
    if (endGateShown || endGateManuallyClosed || endGateTimer) return;

    // Show graceful notification badge with filling progress bar
    if (endGateNotice && noticeProgressBar) {
      endGateNotice.classList.remove('hidden', 'hiding');
      noticeProgressBar.classList.remove('running');
      // Trigger CSS reflow for smooth animation restart
      void noticeProgressBar.offsetWidth;
      noticeProgressBar.classList.add('running');
    }

    endGateTimer = setTimeout(() => {
      endGateTimer = null;
      hideEndGateNotice();
      closeEndGate();
    }, END_GATE_DELAY_MS);
  }

  function cancelEndGateClose() {
    if (endGateTimer) {
      clearTimeout(endGateTimer);
      endGateTimer = null;
    }
    hideEndGateNotice();
  }

  function hideEndGateNotice() {
    if (!endGateNotice) return;
    endGateNotice.classList.add('hiding');
    if (noticeProgressBar) noticeProgressBar.classList.remove('running');
    setTimeout(() => {
      endGateNotice.classList.add('hidden');
      endGateNotice.classList.remove('hiding');
    }, 400);
  }

  function closeEndGate() {
    if (!endGateOverlay || endGateShown) return;
    endGateShown = true;
    cancelEndGateClose();
    if (btnFloatingCloseGate) btnFloatingCloseGate.classList.add('hidden');

    // Step 1: Reveal overlay with doors wide open
    endGateOverlay.classList.remove('hidden', 'closed', 'closing', 'latched', 'show-card');
    endGateOverlay.classList.add('active');

    // Step 2 (t = 150ms): Swing double doors inward smoothly in 3D with easy-in and easy-out
    setTimeout(() => {
      endGateOverlay.classList.add('closing');

      // Step 3 (t = 2400ms): Double doors meet at 0deg -> trigger central golden latch
      setTimeout(() => {
        endGateOverlay.classList.add('closed', 'latched');

        // Step 4 (t = 2700ms): Ascend and reveal central royal card
        setTimeout(() => {
          endGateOverlay.classList.add('show-card');
        }, 300);
      }, 2400);
    }, 150);
  }

  function reopenEndGate() {
    if (!endGateOverlay) return;
    endGateManuallyClosed = true;

    // Step 1: Smoothly fade down center card & latch
    endGateOverlay.classList.remove('show-card', 'latched');

    // Step 2 (t = 300ms): Double doors smoothly swing back open to -105deg and 105deg
    setTimeout(() => {
      endGateOverlay.classList.remove('closing', 'closed');

      // Step 3 (t = 1800ms): Fade out dark overlay backdrop
      setTimeout(() => {
        endGateOverlay.classList.remove('active');
        setTimeout(() => {
          endGateOverlay.classList.add('hidden');
          // Show floating button so user can re-close whenever they wish
          if (btnFloatingCloseGate) {
            btnFloatingCloseGate.classList.remove('hidden');
          }
        }, 600);
      }, 1600);
    }, 300);
  }

  function initEndGateObserver() {
    if (!thankyouSection || !endGateOverlay) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !endGateShown && !endGateManuallyClosed) {
            scheduleEndGateClose();
          } else if (!entry.isIntersecting && !endGateShown) {
            cancelEndGateClose();
          }
        });
      }, {
        threshold: 0.25,
      });
      observer.observe(thankyouSection);
    }

    window.addEventListener('scroll', () => {
      if (endGateShown || endGateManuallyClosed) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 160;
      if (scrollPos >= threshold) {
        scheduleEndGateClose();
      } else if (!endGateShown) {
        const thankyouRect = thankyouSection ? thankyouSection.getBoundingClientRect() : null;
        const isAtEnd = thankyouRect && thankyouRect.top < window.innerHeight && thankyouRect.bottom >= 0;
        if (!isAtEnd) {
          cancelEndGateClose();
        }
      }
    }, { passive: true });
  }

  if (btnReopenGate) {
    btnReopenGate.addEventListener('click', reopenEndGate);
  }

  if (btnFloatingCloseGate) {
    btnFloatingCloseGate.addEventListener('click', () => {
      endGateShown = false;
      closeEndGate();
    });
  }

  // ==================== REPLAY INVITATION ====================
  function replayEntireInvitation() {
    clearOpeningTimers();
    window.scrollTo({ top: 0, behavior: 'instant' });
    isOpening = false;
    endGateShown = false;
    endGateManuallyClosed = false;
    cancelEndGateClose();

    if (btnFloatingCloseGate) btnFloatingCloseGate.classList.add('hidden');

    if (endGateOverlay) {
      endGateOverlay.classList.remove('active', 'closing', 'closed', 'latched', 'show-card');
      endGateOverlay.classList.add('hidden');
    }
    envelopeContainer.classList.remove('opened');
    btnOpenText.innerText = 'निमंत्रण खोलें ✨';
    mainContent.classList.add('hidden');
    mainContent.classList.remove('entering');
    gateScene.classList.add('hidden');
    gateScene.classList.remove('gate-entering', 'gate-leaving', 'gates-opening', 'gates-opened');
    gateLeft.classList.remove('open-left');
    gateRight.classList.remove('open-right');
    envelopeScene.classList.remove('hidden', 'dissolving');
  }

  btnReplay.addEventListener('click', replayEntireInvitation);
  if (btnEndReplay) {
    btnEndReplay.addEventListener('click', replayEntireInvitation);
  }

  if (btnNavHome) {
    btnNavHome.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== MOBILE MENU ====================
  btnMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // ==================== ORIGINAL CARD LIGHTBOX MODAL ====================
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
