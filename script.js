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

  // ==================== MEGA CELEBRATION ENGINE ====================
  // Balloons 🎈 | Crackers & Fireworks 💥 | Confetti & Poppers 🎊🎉 | Sparkles 💫 | Falling Leaves 🍁
  const CEL_EMOJIS = ['🎊', '🎉', '💥', '💫', '🍁', '✨', '🎈', '🪔', '🌸', '⭐'];
  const CEL_COLORS = ['#FFF7D6', '#F7E6B0', '#FFD700', '#F59E0B', '#FB923C', '#EF4444', '#F43F5E', '#EC4899', '#A855F7', '#38BDF8', '#10B981', '#FFFFFF'];
  const CEL_STYLES = ['peony', 'ring', 'star', 'heart', 'willow', 'double', 'crackle'];
  const CEL_MAX_PARTS = 1300;
  const CEL_EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  let celCanvas = null;
  let celCtx = null;
  let celW = 0;
  let celH = 0;
  let celParts = [];
  let celRunning = false;
  let celLastTs = 0;
  let celActiveUntil = 0;
  let celTimers = [];

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function resizeCel() {
    if (!celCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    celW = window.innerWidth;
    celH = window.innerHeight;
    celCanvas.width = Math.floor(celW * dpr);
    celCanvas.height = Math.floor(celH * dpr);
    celCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ensureCelCanvas() {
    if (celCanvas) return;
    celCanvas = document.createElement('canvas');
    celCanvas.id = 'celebrationCanvas';
    document.body.appendChild(celCanvas);
    celCtx = celCanvas.getContext('2d');
    resizeCel();
    window.addEventListener('resize', resizeCel);
  }

  function celAt(fn, ms) {
    celTimers.push(setTimeout(fn, ms));
  }

  function celBegin(durationMs) {
    ensureCelCanvas();
    celTimers.forEach((t) => clearTimeout(t));
    celTimers = [];
    celActiveUntil = performance.now() + durationMs;
    if (!celRunning) {
      celRunning = true;
      celLastTs = performance.now();
      requestAnimationFrame(celStep);
    }
  }

  // ---------- spawners ----------
  function celSpark(x, y, vx, vy, color, o = {}) {
    if (celParts.length > CEL_MAX_PARTS) return;
    celParts.push({
      t: 's', x, y, vx, vy, color,
      a: 1,
      decay: o.decay || (0.011 + Math.random() * 0.01),
      r: o.r || (1.3 + Math.random() * 1.5),
      g: o.g !== undefined ? o.g : 0.05,
      drag: o.drag || 0.985,
      tw: !!o.tw,
    });
  }

  function celEmojiParticle(x, y, vx, vy, o = {}) {
    if (celParts.length > CEL_MAX_PARTS) return;
    celParts.push({
      t: 'e', x, y, vx, vy,
      ch: o.ch || (Math.random() < 0.3 ? '🍁' : pick(CEL_EMOJIS)),
      size: o.size || rnd(20, 34),
      rot: rnd(0, 6.28), vr: rnd(-0.08, 0.08),
      drag: o.drag || 0.985, g: o.g !== undefined ? o.g : 0.05,
      maxVy: o.maxVy || rnd(1.6, 2.6),
      ph: rnd(0, 6.28), vph: rnd(0.03, 0.08), sw: o.sw !== undefined ? o.sw : 0.7,
    });
  }

  function celBurst(x, y, style) {
    const s = Math.max(0.85, Math.min(1.6, Math.min(celW, celH) / 400));
    const c1 = pick(CEL_COLORS);
    const c2 = pick(CEL_COLORS);
    let n;

    switch (style) {
      case 'ring':
        n = 54;
        for (let i = 0; i < n; i++) {
          const a = (Math.PI * 2 * i) / n;
          celSpark(x, y, Math.cos(a) * 4.4 * s, Math.sin(a) * 4.4 * s, c1, { g: 0.03, drag: 0.982 });
        }
        for (let i = 0; i < 26; i++) {
          const a = (Math.PI * 2 * i) / 26;
          celSpark(x, y, Math.cos(a) * 2.2 * s, Math.sin(a) * 2.2 * s, c2, { g: 0.03, drag: 0.982 });
        }
        break;

      case 'star': {
        const verts = [];
        for (let i = 0; i < 10; i++) {
          const ang = (Math.PI * i) / 5 - Math.PI / 2;
          const rad = i % 2 === 0 ? 5.2 : 2.2;
          verts.push([Math.cos(ang) * rad, Math.sin(ang) * rad]);
        }
        for (let i = 0; i < 10; i++) {
          const a = verts[i];
          const b = verts[(i + 1) % 10];
          for (let j = 0; j < 7; j++) {
            const f = j / 7;
            celSpark(x, y, (a[0] + (b[0] - a[0]) * f) * s, (a[1] + (b[1] - a[1]) * f) * s, '#FFD700', { g: 0.025, drag: 0.98, r: 1.8 });
          }
        }
        break;
      }

      case 'heart':
        n = 64;
        for (let i = 0; i < n; i++) {
          const t = (Math.PI * 2 * i) / n;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          celSpark(x, y, hx * 0.27 * s, hy * 0.27 * s, '#FF4D6D', { g: 0.022, drag: 0.98, r: 1.9 });
        }
        break;

      case 'willow':
        n = 46;
        for (let i = 0; i < n; i++) {
          const a = rnd(0, Math.PI * 2);
          const sp = rnd(1.4, 4.6) * s;
          celSpark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, '#FFD27A', { decay: 0.0065, g: 0.065, drag: 0.984, r: 1.3, tw: true });
        }
        break;

      case 'double':
        for (let i = 0; i < 52; i++) {
          const a = rnd(0, Math.PI * 2);
          const sp = rnd(3.2, 5.2) * s;
          celSpark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, c1);
        }
        for (let i = 0; i < 30; i++) {
          const a = rnd(0, Math.PI * 2);
          const sp = rnd(1.2, 3) * s;
          celSpark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, c2);
        }
        break;

      case 'crackle':
        for (let i = 0; i < 42; i++) {
          const a = rnd(0, Math.PI * 2);
          const sp = rnd(2, 5) * s;
          celSpark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, '#FFFFFF', { tw: true, decay: 0.01 });
        }
        celAt(() => {
          for (let k = 0; k < 7; k++) {
            const px = x + rnd(-60, 60) * s;
            const py = y + rnd(-40, 70) * s;
            for (let i = 0; i < 9; i++) {
              const a = rnd(0, Math.PI * 2);
              const sp = rnd(0.8, 2.2);
              celSpark(px, py, Math.cos(a) * sp, Math.sin(a) * sp, pick(CEL_COLORS), { tw: true, decay: 0.03, r: 1.3 });
            }
          }
        }, 380);
        break;

      case 'peony':
      default:
        n = 74;
        for (let i = 0; i < n; i++) {
          const a = (Math.PI * 2 * i) / n + rnd(-0.06, 0.06);
          const sp = rnd(2.2, 5.6) * s;
          celSpark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, c1);
        }
        break;
    }

    // Emoji pop flung out of the burst (🎊 🎉 💥 💫 🍁)
    if (Math.random() < 0.35) {
      const cnt = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < cnt; i++) {
        const a = rnd(0, Math.PI * 2);
        const sp = rnd(2, 4.2) * s;
        celEmojiParticle(x, y, Math.cos(a) * sp, Math.sin(a) * sp, { g: 0.05, drag: 0.972, sw: 0.3, size: rnd(20, 30) });
      }
    }
  }

  function celRocket(x, ty, style) {
    const g = 0.12;
    const vy = -Math.sqrt(2 * g * Math.max(60, celH - ty));
    celParts.push({ t: 'r', x, y: celH + 10, vx: rnd(-0.6, 0.6), vy, ty, style: style || pick(CEL_STYLES) });
  }

  function celVolley(n) {
    for (let i = 0; i < n; i++) {
      celAt(() => celRocket(celW * rnd(0.1, 0.9), celH * rnd(0.13, 0.42), pick(CEL_STYLES)), i * 140 + rnd(0, 90));
    }
  }

  // Party-popper cannon: angle 0 = straight up, + leans right, - leans left
  function celCannon(x, y, angle, count) {
    for (let i = 0; i < count; i++) {
      if (celParts.length > CEL_MAX_PARTS) return;
      const a = ((angle + rnd(-20, 20)) * Math.PI) / 180;
      const sp = rnd(8, 19);
      const vx = Math.sin(a) * sp;
      const vy = -Math.cos(a) * sp;
      const roll = Math.random();

      if (roll < 0.14) {
        celEmojiParticle(x, y, vx * 0.75, vy * 0.75, { g: 0.07, drag: 0.972, sw: 0.5, maxVy: rnd(2, 3) });
      } else if (roll < 0.3) {
        celParts.push({
          t: 'w', x, y, vx: vx * 0.9, vy: vy * 0.9,
          len: rnd(34, 64), amp: rnd(4, 8), lw: rnd(2, 3.2),
          rot: rnd(-0.5, 0.5), vr: rnd(-0.04, 0.04),
          color: pick(CEL_COLORS), drag: 0.975, g: 0.08, maxVy: rnd(2.2, 3),
          ph: rnd(0, 6.28), vph: rnd(0.1, 0.22), sw: 0.3,
        });
      } else {
        celParts.push({
          t: 'p', x, y, vx, vy,
          w: rnd(6, 11), h: rnd(9, 18),
          rot: rnd(0, 6.28), vr: rnd(-0.3, 0.3),
          flip: rnd(0, 6.28), vf: rnd(0.08, 0.3),
          color: pick(CEL_COLORS), drag: 0.972, g: 0.09, maxVy: rnd(2.4, 3.4),
          ph: rnd(0, 6.28), vph: rnd(0.04, 0.1), sw: rnd(0.2, 0.8),
        });
      }
    }
  }

  function celCannons(n) {
    celCannon(celW * 0.03, celH + 6, 24, n);
    celCannon(celW * 0.97, celH + 6, -24, n);
  }

  function celRain(count) {
    for (let i = 0; i < count; i++) {
      if (celParts.length > CEL_MAX_PARTS) return;
      celParts.push({
        t: 'p', x: rnd(0, celW), y: -rnd(10, 520),
        vx: rnd(-0.5, 0.5), vy: rnd(1, 2.4),
        w: rnd(6, 10), h: rnd(9, 16),
        rot: rnd(0, 6.28), vr: rnd(-0.12, 0.12),
        flip: rnd(0, 6.28), vf: rnd(0.06, 0.2),
        color: pick(CEL_COLORS), drag: 0.99, g: 0.02, maxVy: rnd(2, 3.2),
        ph: rnd(0, 6.28), vph: rnd(0.03, 0.08), sw: rnd(0.4, 1),
      });
    }
  }

  function celEmojiRain(count) {
    for (let i = 0; i < count; i++) {
      celEmojiParticle(rnd(0, celW), -rnd(20, 420), rnd(-0.4, 0.4), rnd(0.8, 1.8), { g: 0.015, drag: 0.995, sw: 0.9, size: rnd(22, 36), maxVy: rnd(1.4, 2.4) });
    }
  }

  function celGrandFinale() {
    for (let i = 0; i < 7; i++) {
      celAt(() => celRocket(celW * (0.08 + i * 0.14), celH * rnd(0.12, 0.45), pick(CEL_STYLES)), i * 90);
    }
    celCannons(70);
    celCannon(celW * 0.5, celH + 6, 0, 60);
    celRain(50);
    celEmojiRain(14);
    launchBalloons(30);
  }

  // ---------- main loop ----------
  function celStep(ts) {
    if (!celRunning) return;
    const dt = Math.min(Math.max(ts - celLastTs, 1), 50);
    celLastTs = ts;
    const k = dt / 16.667;

    celCtx.clearRect(0, 0, celW, celH);

    // update
    for (let i = celParts.length - 1; i >= 0; i--) {
      const p = celParts[i];
      let dead = false;

      if (p.t === 's') {
        const d = Math.pow(p.drag, k);
        p.vx *= d;
        p.vy = p.vy * d + p.g * k;
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.a -= p.decay * k;
        if (p.a <= 0) dead = true;
      } else if (p.t === 'r') {
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.vy += 0.12 * k;
        celSpark(p.x, p.y, rnd(-0.4, 0.4), rnd(0.4, 1.4), '#FFD27A', { decay: 0.055, r: 1.2, g: 0.02 });
        celSpark(p.x, p.y, rnd(-0.3, 0.3), rnd(0.2, 1), '#FFFFFF', { decay: 0.08, r: 0.9, g: 0.02 });
        if (p.vy >= -0.5 || p.y <= p.ty) {
          celBurst(p.x, p.y, p.style);
          dead = true;
        }
      } else {
        // paper / streamer / emoji
        const d = Math.pow(p.drag, k);
        p.vx *= d;
        p.vy = p.vy * d + p.g * k;
        if (p.vy > p.maxVy) p.vy = p.maxVy;
        p.ph += p.vph * k;
        p.x += (p.vx + Math.sin(p.ph) * p.sw) * k;
        p.y += p.vy * k;
        p.rot += p.vr * k;
        if (p.t === 'p') p.flip += p.vf * k;
        if (p.y > celH + 70 || p.x < -90 || p.x > celW + 90) dead = true;
      }

      if (dead) {
        celParts[i] = celParts[celParts.length - 1];
        celParts.pop();
      }
    }

    // draw: solid pieces first
    celCtx.globalCompositeOperation = 'source-over';
    celCtx.globalAlpha = 1;
    celCtx.textAlign = 'center';
    celCtx.textBaseline = 'middle';
    for (let i = 0; i < celParts.length; i++) {
      const p = celParts[i];
      if (p.t === 'p') {
        celCtx.save();
        celCtx.translate(p.x, p.y);
        celCtx.rotate(p.rot);
        celCtx.scale(1, Math.cos(p.flip));
        celCtx.fillStyle = p.color;
        celCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        celCtx.restore();
      } else if (p.t === 'w') {
        celCtx.save();
        celCtx.translate(p.x, p.y);
        celCtx.rotate(p.rot);
        celCtx.strokeStyle = p.color;
        celCtx.lineWidth = p.lw;
        celCtx.lineCap = 'round';
        celCtx.beginPath();
        for (let j = 0; j <= 8; j++) {
          const yy = (j / 8) * p.len;
          const xx = Math.sin(p.ph + j * 0.9) * p.amp;
          if (j === 0) celCtx.moveTo(xx, yy);
          else celCtx.lineTo(xx, yy);
        }
        celCtx.stroke();
        celCtx.restore();
      } else if (p.t === 'e') {
        celCtx.save();
        celCtx.translate(p.x, p.y);
        celCtx.rotate(p.rot);
        celCtx.font = `${Math.round(p.size)}px ${CEL_EMOJI_FONT}`;
        celCtx.fillText(p.ch, 0, 0);
        celCtx.restore();
      }
    }

    // draw: glowing sparks & rockets (additive)
    celCtx.globalCompositeOperation = 'lighter';
    celCtx.lineCap = 'round';
    for (let i = 0; i < celParts.length; i++) {
      const p = celParts[i];
      if (p.t === 's') {
        celCtx.globalAlpha = p.tw ? p.a * (0.55 + Math.random() * 0.45) : p.a;
        celCtx.strokeStyle = p.color;
        celCtx.lineWidth = p.r * 1.6;
        celCtx.beginPath();
        celCtx.moveTo(p.x - p.vx * 1.9, p.y - p.vy * 1.9);
        celCtx.lineTo(p.x, p.y);
        celCtx.stroke();
      } else if (p.t === 'r') {
        celCtx.globalAlpha = 1;
        celCtx.strokeStyle = '#FFF3C4';
        celCtx.lineWidth = 2.6;
        celCtx.beginPath();
        celCtx.moveTo(p.x - p.vx * 3, p.y - p.vy * 3);
        celCtx.lineTo(p.x, p.y);
        celCtx.stroke();
      }
    }
    celCtx.globalAlpha = 1;
    celCtx.globalCompositeOperation = 'source-over';

    // finish when everything has faded & no more scheduled waves
    if (celParts.length === 0 && performance.now() > celActiveUntil) {
      celCtx.clearRect(0, 0, celW, celH);
      celRunning = false;
      return;
    }
    requestAnimationFrame(celStep);
  }

  // ==================== CELEBRATION BALLOONS (🎈 big colourful waves) ====================
  function launchBalloons(count = 26) {
    if (!balloonsContainer) return;
    balloonsContainer.classList.remove('hidden');

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
      { primary: '#EC4899', edge: '#831843' }, // Festive Pink
      { primary: '#A855F7', edge: '#4C1D95' }, // Royal Violet
      { primary: '#38BDF8', edge: '#0C4A6E' }, // Sky Blue
    ];

    for (let i = 0; i < count; i++) {
      const isEmoji = Math.random() < 0.16;
      const b = document.createElement('div');
      const left = 2 + Math.random() * 94;
      const delay = (Math.random() * 2.2).toFixed(2);
      const duration = (5.2 + Math.random() * 3.2).toFixed(2);
      const sway = Math.round((Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 46));

      b.style.left = `${left}%`;
      b.style.setProperty('--sway', `${sway}px`);

      if (isEmoji) {
        b.className = 'balloon-emoji';
        b.textContent = '🎈';
        b.style.fontSize = `${Math.round(34 + Math.random() * 24)}px`;
      } else {
        const width = 38 + Math.floor(Math.random() * 32);
        const theme = colors[Math.floor(Math.random() * colors.length)];
        b.className = 'balloon';
        b.style.width = `${width}px`;
        b.style.height = `${Math.floor(width * 1.28)}px`;
        b.style.background = `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${theme.primary} 45%, ${theme.edge} 100%)`;
      }

      b.style.animation = `balloonRise ${duration}s linear ${delay}s both`;
      b.addEventListener('animationend', () => {
        b.remove();
        if (!balloonsContainer.childElementCount) balloonsContainer.classList.add('hidden');
      });
      balloonsContainer.appendChild(b);
    }
  }

  // ==================== CONFETTI CANNONS & POPPERS (💥 🎊 🎉) ====================
  function launchConfetti() {
    ensureCelCanvas();
    celCannons(80);
    celCannon(celW * 0.5, celH + 6, 0, 40);
    celRain(70);
    celEmojiRain(14);
  }

  // ==================== FIREWORKS / CRACKERS — GRAND OPENING TIMELINE ====================
  // Synced with the opening sequence: envelope (0s) -> gate fades in (1.6s) -> doors open (3.1s) -> invitation reveals (6.5s)
  function triggerFireworks() {
    celBegin(11000);
    celVolley(4);
    celAt(() => celVolley(3), 900);
    celAt(() => { celCannons(60); launchBalloons(24); celVolley(2); }, 1600);
    celAt(() => celVolley(3), 2600);
    celAt(celGrandFinale, 3100);
    celAt(() => { celVolley(4); celCannons(50); }, 4300);
    celAt(() => { celVolley(3); celEmojiRain(16); }, 5500);
    celAt(celGrandFinale, 6500);
    celAt(() => { celVolley(3); launchBalloons(20); }, 7800);
  }

  // Lighter celebration when the visitor skips straight to the details
  function celebrateQuick() {
    celBegin(6500);
    celVolley(3);
    launchBalloons(22);
    celCannons(55);
    celRain(50);
    celEmojiRain(10);
    celAt(() => celVolley(3), 1500);
    celAt(celGrandFinale, 2800);
  }

  // ==================== ENDING CELEBRATION (when the palace gate closes) ====================
  // Synced with the closing gate: doors swing (0.15s) -> doors meet (2.55s) -> royal card appears (2.85s)
  function startEndCelebration() {
    celBegin(12500);
    celVolley(2);
    celCannons(40);
    launchBalloons(24);
    celAt(() => { celVolley(3); celEmojiRain(12); }, 1200);
    celAt(celGrandFinale, 2550);
    celAt(() => { celCannons(80); celVolley(5); launchBalloons(30); }, 3300);
    celAt(() => { celVolley(4); celRain(60); }, 4800);
    celAt(celGrandFinale, 6200);
    celAt(() => { celVolley(3); celCannons(50); launchBalloons(18); }, 8000);
    celAt(() => { celVolley(3); celEmojiRain(14); }, 9800);
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
    celebrateQuick();
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
    startEndCelebration();
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

  // ==================== SLOW AUTO SCROLL ====================
  (function () {
    const SPEED =70;          // pixels per second (lower = slower)
    const START_DELAY = 2500;  // wait after invitation opens (ms)
    const RESUME_DELAY = 4000; // resume after user stops touching (ms)

    let running = false, last = 0, pos = 0, resumeTimer = null, started = false;

    function atBottom() {
      return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    }

    function blocked() {
      const modalOpen = cardModal && !cardModal.classList.contains('hidden');
      const gateOpen = endGateOverlay && !endGateOverlay.classList.contains('hidden');
      return modalOpen || gateOpen;
    }

    function step(t) {
      if (!running) return;
      if (!last) last = t;
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;

      if (!blocked()) {
        pos += SPEED * dt;
        const whole = Math.floor(pos);
        if (whole >= 1) {
          window.scrollBy({ top: whole, behavior: 'instant' });
          pos -= whole;
        }
      }

      if (atBottom()) { stopScroll(); return; }
      requestAnimationFrame(step);
    }

    function startScroll() {
      if (running || atBottom() || mainContent.classList.contains('hidden')) return;
      running = true; last = 0;
      requestAnimationFrame(step);
    }

    function stopScroll() { running = false; }

    function pauseThenResume() {
      stopScroll();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startScroll, RESUME_DELAY);
    }

    window.addEventListener('touchstart', () => { stopScroll(); clearTimeout(resumeTimer); }, { passive: true });
    window.addEventListener('touchend', pauseThenResume, { passive: true });
    window.addEventListener('wheel', pauseThenResume, { passive: true });

    const scrollObserver = new MutationObserver(() => {
      if (mainContent.classList.contains('hidden')) {
        started = false;
        stopScroll();
        clearTimeout(resumeTimer);
      } else if (!started) {
        started = true;
        setTimeout(startScroll, START_DELAY);
      }
    });
    scrollObserver.observe(mainContent, { attributes: true, attributeFilter: ['class'] });
  })();
});
