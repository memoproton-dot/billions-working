const STEP_DATA = [
  { id: 1, title: 'Start / Setup', caption: 'You (or your AI agent) start by installing or connecting to the Billions app or system. This is where the digital identity process begins.', graphic: 'agent-initialization' },
  { id: 2, title: 'Create a Digital ID', caption: 'The system makes a unique digital identity (DID) for you or your AI. It’s like a digital fingerprint, backed by a private key stored safely so nobody else can pretend to be you.', graphic: 'identity-creation' },
  { id: 3, title: 'Lock Identity to the Real Thing', caption: 'For AI agents, the app records a fingerprint of the actual model, including its code, version, and environment. That fingerprint gets tied to the digital ID so no one can swap models and still claim to be the same AI.', graphic: 'architecture-fingerprint' },
  { id: 4, title: '(Optional) Check Real Behavior', caption: 'If needed, the system checks that the AI’s behavior matches what it claims to be, like running test prompts or using zkML proofs. If the AI starts behaving differently, its verified status can be revoked or updated.', graphic: 'behavioral-alignment' },
  { id: 5, title: 'Get Verified by Trusted Sources', caption: 'Organizations, owners, or auditors give verifiable credentials to confirm things like “This AI was made by Company X.” These credentials are cryptographically signed so they can’t be faked.', graphic: 'attestation-issuance' },
  { id: 6, title: 'Prove Ownership', caption: 'The first person or group who connects the AI to the system becomes its registered owner. This foundational proof links the human (or company) DID to the AI’s DID, like a digital birth certificate.', graphic: 'foundational-ownership' },
  { id: 7, title: 'Store Proofs Safely', caption: 'Sensitive data stays off the blockchain in an identity wallet for private storage. Short public proofs, like “This AI is verified,” are saved on-chain in a public registry that everyone can check.', graphic: 'hybrid-storage' },
  { id: 8, title: 'Protect Privacy with Zero-Knowledge Proofs', caption: 'Whenever the system needs to prove something, it uses zero-knowledge proofs (ZKPs). You can prove facts without revealing the underlying data, keeping information private.', graphic: 'zk-privacy' },
  { id: 9, title: 'Work Across Any Blockchain', caption: 'The registry is built to work across multiple blockchains, so your identity and proofs can be checked by different apps, AI systems, or smart contracts on any network.', graphic: 'cross-chain-verification' },
  { id: 10, title: 'Show Proof When Asked', caption: 'When another person, app, or AI asks to verify you, the system shares only what’s needed, not your full identity. It sends a cryptographic proof that can be instantly verified.', graphic: 'verifier-interaction' },
  { id: 11, title: 'Build a Reputation Graph', caption: 'Every verified connection, whether owner, developer, trainer, user, or reviewer, adds to your reputation network. This builds trust and makes relationships visible.', graphic: 'reputation-graph' },
  { id: 12, title: 'Manage the Life Cycle', caption: 'Over time, you can update, renew, or revoke credentials. All changes are securely recorded, and governance ensures fair rules and transparency.', graphic: 'lifecycle-governance' }
];

class SoundscapeManager {
  constructor() {
    this.audioEnabled = false;
    this.muted = false;
    this.currentStep = null;
    this.activeTrackId = null;
    this.stepAudio = null;
    this.backgroundAudio = null;
    this.stepStartTimeout = null;
    this.defaultStepDelayMs = 1000;
    this.soundLibrary = this.buildLibrary();
    this.backgroundConfig = this.buildBackgroundConfig();
    this.navConfig = this.buildNavConfig();

    this.unlockAudio = this.unlockAudio.bind(this);
    this.visibilityHandler = this.handleVisibilityChange.bind(this);

    document.addEventListener('pointerdown', this.unlockAudio, { once: true, passive: true });
    document.addEventListener('visibilitychange', this.visibilityHandler);

    // Attempt to start background audio immediately; browsers that block autoplay will retry on first pointer.
    this.unlockAudio();
  }

  buildLibrary() {
    return {
      1: { label: 'Start / Setup', track: { id: 'step-01_theme', loop: false, volume: 0.62, delayMs: 1500, src: './audio/step-01_theme.mp3' } },
      2: { label: 'Create a Digital ID', track: { id: 'step-02_theme', loop: false, volume: 0.6, delayMs: 1700, src: './audio/step-02_theme.mp3' } },
      3: { label: 'Lock Identity to the Real Thing', track: { id: 'step-03_theme', loop: false, volume: 0.6, delayMs: 1700, src: './audio/step-03_theme.mp3' } },
      4: { label: '(Optional) Check Real Behavior', track: { id: 'step-04_theme', loop: false, volume: 0.6, delayMs: 1500, src: './audio/step-04_theme.mp3' } },
      5: { label: 'Get Verified by Trusted Sources', track: { id: 'step-05_theme', loop: false, volume: 0.6, delayMs: 1900, src: './audio/step-05_theme.mp3' } },
      6: { label: 'Prove Ownership', track: { id: 'step-06_theme', loop: false, volume: 0.6, delayMs: 1500, src: './audio/step-06_theme.mp3' } },
      7: { label: 'Store Proofs Safely', track: { id: 'step-07_theme', loop: false, volume: 0.6, delayMs: 1000, src: './audio/step-07_theme.mp3' } },
      8: { label: 'Protect Privacy with Zero-Knowledge Proofs', track: { id: 'step-08_theme', loop: false, volume: 0.6, delayMs: 1200, src: './audio/step-08_theme.mp3' } },
      9: { label: 'Work Across Any Blockchain', track: { id: 'step-09_theme', loop: false, volume: 0.6, delayMs: 1500, src: './audio/step-09_theme.mp3' } },
      10: { label: 'Show Proof When Asked', track: { id: 'step-10_theme', loop: false, volume: 0.6, delayMs: 1600, src: './audio/step-10_theme.mp3' } },
      11: { label: 'Build a Reputation Graph', track: { id: 'step-11_theme', loop: false, volume: 0.6, delayMs: 1700, src: './audio/step-11_theme.mp3' } },
      12: { label: 'Manage the Life Cycle', track: { id: 'step-12_theme', loop: false, volume: 0.6, delayMs: 1900, src: './audio/step-12_theme.mp3' } }
    };
  }

  buildBackgroundConfig() {
    return { id: 'background-bed', loop: true, volume: 0.28, src: './audio/background-bed.mp3' };
  }

  buildNavConfig() {
    return { id: 'nav-toggle', loop: false, volume: 0.65, src: './audio/nav-toggle.mp3' };
  }

  unlockAudio() {
    this.audioEnabled = true;
    const targetStep = this.currentStep ?? 1;
    this.startBackground(true);
    this.handleStepChange(targetStep, { forceRestart: true });
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseAll();
      return;
    }

    if (!this.audioEnabled || this.muted) {
      return;
    }

    this.startBackground();

    if (this.stepAudio) {
      this.stepAudio.play().catch(() => {});
    } else if (this.currentStep) {
      this.handleStepChange(this.currentStep, { forceRestart: true });
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted) {
      this.pauseAll();
      return;
    }

    if (!this.audioEnabled) {
      return;
    }

    this.startBackground();
    if (this.stepAudio) {
      this.stepAudio.play().catch(() => {});
    } else if (this.currentStep) {
      this.handleStepChange(this.currentStep, { forceRestart: true });
    }
  }

  handleStepChange(stepId, { forceRestart = false } = {}) {
    if (typeof stepId !== 'number' || Number.isNaN(stepId)) {
      return;
    }

    this.currentStep = stepId;

    if (!this.audioEnabled || this.muted) {
      return;
    }

    const config = this.soundLibrary[stepId];
    if (!config || !config.track?.src) {
      this.stopStepTrack();
      return;
    }

    if (!forceRestart && this.activeTrackId === config.track.id) {
      return;
    }

    this.stopStepTrack();

    this.stepAudio = this.createAudio(config.track);
    this.activeTrackId = config.track.id;

    const delay = typeof config.track.delayMs === 'number' && config.track.delayMs >= 0
      ? config.track.delayMs
      : this.defaultStepDelayMs;

    this.stepStartTimeout = setTimeout(() => {
      this.stepAudio?.play().catch(() => {});
    }, delay);
  }

  startBackground(forceRestart = false) {
    if (!this.backgroundConfig.src) {
      return;
    }

    if (!this.backgroundAudio) {
      this.backgroundAudio = this.createAudio(this.backgroundConfig);
    }

    if (forceRestart) {
      this.backgroundAudio.currentTime = 0;
    }

    if (this.muted) {
      return;
    }

    this.backgroundAudio.play().catch(() => {});
  }

  playNavToggle() {
    if (!this.audioEnabled || this.muted || !this.navConfig.src) {
      return;
    }

    const navAudio = this.createAudio(this.navConfig);
    navAudio.play().catch(() => {});
  }

  pauseAll() {
    if (this.stepStartTimeout) {
      clearTimeout(this.stepStartTimeout);
      this.stepStartTimeout = null;
    }
    if (this.stepAudio) {
      this.stepAudio.pause();
    }
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
    }
  }

  stopStepTrack() {
    if (this.stepStartTimeout) {
      clearTimeout(this.stepStartTimeout);
      this.stepStartTimeout = null;
    }
    if (this.stepAudio) {
      this.stepAudio.pause();
      this.stepAudio.currentTime = 0;
    }
    this.stepAudio = null;
    this.activeTrackId = null;
  }

  stopAll() {
    this.stopStepTrack();
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
      this.backgroundAudio = null;
    }
  }

  setStepDelay(delayMs) {
    const parsed = Number(delayMs);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }

    this.defaultStepDelayMs = parsed;

    if (this.stepAudio && this.activeTrackId !== null) {
      this.stopStepTrack();
      this.handleStepChange(this.activeTrackId, { forceRestart: true });
    }
  }

  setTrackDelay(stepId, delayMs) {
    const parsedStep = Number(stepId);
    const parsedDelay = Number(delayMs);
    if (!Number.isInteger(parsedStep) || parsedStep < 1) {
      return;
    }

    if (!Number.isFinite(parsedDelay) || parsedDelay < 0) {
      return;
    }

    const config = this.soundLibrary[parsedStep];
    if (!config?.track) {
      return;
    }

    config.track.delayMs = parsedDelay;

    if (this.activeTrackId === config.track.id) {
      this.stopStepTrack();
      this.handleStepChange(parsedStep, { forceRestart: true });
    }
  }

  createAudio({ src, loop, volume }) {
    const audio = new Audio(src);
    audio.loop = Boolean(loop);
    audio.volume = volume ?? 0.5;

    if (audio.loop) {
      audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      });
    }

    return audio;
  }

  cleanup() {
    this.stopAll();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }
}

class BillionsFlow {
  constructor() {
    this.activeStep = 1;
    this.reducedMotion = false;
    this.stepsRefs = [];
    this.observer = null;
    this.scrollAnimationFrame = null;
    this.scrollDebounceTimeout = null;
    this.observerFrame = null;
    this.pendingStep = null;

    this.soundscape = new SoundscapeManager();

    this.init();
  }

  init() {
    this.checkReducedMotion();
    this.setupStepsRefs();
    this.setupIntersectionObserver();
    this.setupKeyboardNavigation();
    this.initializeAnimations();
  }

  checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = mediaQuery.matches;
    
    if (this.reducedMotion) {
      document.querySelector('.app').classList.add('reduced-motion');
    }

    mediaQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (e.matches) {
        document.querySelector('.app').classList.add('reduced-motion');
      } else {
        document.querySelector('.app').classList.remove('reduced-motion');
      }
    });
  }

  setupStepsRefs() {
    this.stepsRefs = Array.from(document.querySelectorAll('.step'));
  }

  toggleStepAnimations(stepNum, shouldPlay) {
    const stepEl = document.querySelector(`.step[data-step="${stepNum}"]`);
    if (!stepEl) {
      return;
    }

    const selector = '.animated-box, [data-animated]';
    let targets = Array.from(stepEl.querySelectorAll(selector));

    if (shouldPlay) {
      targets = this.restartStepAnimations(stepEl, targets);
    }

    targets.forEach((el) => {
      el.style.animationPlayState = shouldPlay ? 'running' : 'paused';
    });
  }

  restartStepAnimations(stepEl, initialTargets = []) {
    const selector = '.animated-box, [data-animated]';
    const nodesToRefresh = initialTargets.length ? initialTargets : Array.from(stepEl.querySelectorAll(selector));
    const refreshed = [];

    nodesToRefresh.forEach((node) => {
      const clone = node.cloneNode(true);
      node.replaceWith(clone);
      refreshed.push(clone);
    });

    return refreshed;
  }

  initializeAnimations() {
    STEP_DATA.forEach((step) => {
      this.toggleStepAnimations(step.id, step.id === this.activeStep);
    });

    this.soundscape.handleStepChange(this.activeStep, { forceRestart: true });
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -35% 0px',
      threshold: [0.25, 0.4, 0.6]
    };

    this.observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (!visibleEntries.length) {
        return;
      }

      const mostVisible = visibleEntries.reduce((prev, current) => (
        current.intersectionRatio > prev.intersectionRatio ? current : prev
      ));

      const stepNum = Number(mostVisible.target.dataset.step);
      if (isNaN(stepNum) || stepNum === this.activeStep) {
        return;
      }

      this.pendingStep = stepNum;

      if (this.observerFrame) {
        cancelAnimationFrame(this.observerFrame);
      }

      this.observerFrame = requestAnimationFrame(() => {
        this.observerFrame = null;
        const nextStep = this.pendingStep;
        if (typeof nextStep !== 'number' || nextStep === this.activeStep) {
          return;
        }

        this.toggleStepAnimations(this.activeStep, false);

        // Remove is-active from all steps
        document.querySelectorAll('.step').forEach(step => {
          step.classList.remove('is-active');
        });
        
        // Add is-active to current step
        const currentStepEl = document.querySelector(`.step[data-step="${nextStep}"]`);
        if (currentStepEl) {
          currentStepEl.classList.add('is-active');
        }

        this.toggleStepAnimations(nextStep, true);
        this.soundscape.playNavToggle();

        this.activeStep = nextStep;
        this.updateNavigation();
        this.soundscape.handleStepChange(nextStep, { forceRestart: true });

        const nextHash = `#step-${nextStep}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(null, '', nextHash);
        }
      });
    }, options);

    this.stepsRefs.forEach(ref => {
      if (ref) this.observer.observe(ref);
    });
  }

  updateNavigation() {
    document.querySelectorAll('.progress-nav a').forEach(link => {
      const stepNum = parseInt(link.dataset.step);
      if (stepNum === this.activeStep) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    this.updateBackgroundScene();
  }

  updateBackgroundScene() {
    const scenes = document.querySelectorAll('.background-scene');
    scenes.forEach(scene => {
      const sceneStep = Number(scene.dataset.step);
      if (sceneStep === this.activeStep) {
        scene.classList.add('is-visible');
      } else {
        scene.classList.remove('is-visible');
      }
    });
  }

  scrollToStepInternal(stepNum) {
    const element = this.stepsRefs[stepNum - 1];
    if (!element) return;

    if (this.reducedMotion) {
      element.scrollIntoView({ behavior: 'instant', block: 'center' });
      return;
    }

    if (this.scrollAnimationFrame) {
      cancelAnimationFrame(this.scrollAnimationFrame);
    }

    const headerHeight = document.querySelector('.site-header')?.offsetHeight ?? 0;
    const marginOffset = 40;
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const rawTarget = elementTop - headerHeight - marginOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const targetY = Math.max(0, Math.min(rawTarget, maxScroll));
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = Math.min(1800, Math.max(650, Math.abs(distance) * 0.5));
    const startTime = performance.now();

    const easeInOutBack = (t) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    };

    const stepFrame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutBack(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        this.scrollAnimationFrame = requestAnimationFrame(stepFrame);
      }
    };

    this.scrollAnimationFrame = requestAnimationFrame(stepFrame);
  }

  scrollToStep(stepNum) {
    if (this.scrollDebounceTimeout) {
      clearTimeout(this.scrollDebounceTimeout);
    }

    this.scrollDebounceTimeout = setTimeout(() => {
      this.scrollDebounceTimeout = null;
      this.scrollToStepInternal(stepNum);
    }, 60);
  }

  setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.activeStep < STEP_DATA.length) {
          this.scrollToStep(this.activeStep + 1);
        }
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.activeStep > 1) {
          this.scrollToStep(this.activeStep - 1);
        }
      }
    });
  }

  cleanup() {
    if (this.scrollAnimationFrame) {
      cancelAnimationFrame(this.scrollAnimationFrame);
    }
    if (this.observerFrame) {
      cancelAnimationFrame(this.observerFrame);
    }
    if (this.scrollDebounceTimeout) {
      clearTimeout(this.scrollDebounceTimeout);
    }
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.soundscape) {
      this.soundscape.cleanup();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new BillionsFlow();
    
    // Set initial active step
    const initialStep = document.querySelector('.step[data-step="1"]');
    if (initialStep) {
      initialStep.classList.add('is-active');
    }
    app.updateBackgroundScene();
    
    // Setup navigation click handlers
    document.querySelectorAll('.progress-nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const stepNum = parseInt(link.dataset.step);
        const appInstance = window.__billionsAppInstance;
        appInstance?.soundscape.playNavToggle();
        app.scrollToStep(stepNum);
      });
    });
  });
} else {
  const app = new BillionsFlow();
  window.__billionsAppInstance = app;
  
  // Set initial active step
  const initialStep = document.querySelector('.step[data-step="1"]');
  if (initialStep) {
    initialStep.classList.add('is-active');
  }
  app.updateBackgroundScene();
  
  // Setup navigation click handlers
  document.querySelectorAll('.progress-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const stepNum = parseInt(link.dataset.step);
      app.soundscape.playNavToggle();
      app.scrollToStep(stepNum);
    });
  });
}