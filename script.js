(function () {
  const card = document.getElementById('appCard');
  const toggleBtn = document.getElementById('toggleBtn');
  const statusText = document.getElementById('statusText');
  const ipValue = document.getElementById('ipValue');
  const adsValue = document.getElementById('adsValue');
  const speedValue = document.getElementById('speedValue');
  const exposureIp = document.getElementById('exposureIp');
  const exposureIsp = document.getElementById('exposureIsp');
  const ctaSection = document.getElementById('cta');

  const FALLBACK_IP = '104.28.212.9';
  const FALLBACK_ISP = 'unknown';
  const MASKED_IP = '•.•.•.•';

  let realIp = FALLBACK_IP;
  let realIsp = FALLBACK_ISP;

  let on = false;
  let adsCount = 0;
  let tickInterval = null;

  // Best-effort live lookup of the visitor's real IP/ISP, shown in the top
  // exposure bar. This reflects the visitor's actual, unchanged status: it
  // is never touched by the demo toggle below, which only illustrates the
  // app's own UI and does not actually protect anything.
  fetch('https://ipapi.co/json/')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.ip) {
        realIp = data.ip;
        realIsp = (data.org || FALLBACK_ISP).replace(/^AS\d+\s*/, '');
        exposureIp.textContent = realIp;
        exposureIsp.textContent = realIsp;
        if (!on) ipValue.textContent = realIp;
      }
    })
    .catch(function () {
      exposureIp.textContent = FALLBACK_IP;
      exposureIsp.textContent = FALLBACK_ISP;
    });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startTicking() {
    stopTicking();
    tickInterval = setInterval(function () {
      adsCount += Math.floor(Math.random() * 3) + 1;
      adsValue.textContent = adsCount.toLocaleString();
    }, 700);
  }

  function stopTicking() {
    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  }

  function setState(next) {
    on = next;
    card.classList.toggle('on', on);
    toggleBtn.setAttribute('aria-checked', String(on));

    if (on) {
      statusText.textContent = 'PROTECTED';
      ipValue.textContent = MASKED_IP;
      speedValue.textContent = '−3%';
      adsCount = 0;
      adsValue.textContent = '0';
      if (!prefersReducedMotion) {
        startTicking();
      } else {
        adsCount = 128;
        adsValue.textContent = '128';
      }
      // This is a demo of the app's own UI, not a real connection, so the
      // exposure bar above (your actual IP/ISP/status) is left untouched.
      window.setTimeout(function () {
        if (ctaSection) ctaSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }, 500);
    } else {
      statusText.textContent = 'UNPROTECTED';
      ipValue.textContent = realIp;
      speedValue.textContent = 'N/A';
      adsValue.textContent = '0';
      stopTicking();
    }
  }

  toggleBtn.addEventListener('click', function () {
    setState(!on);
  });

  toggleBtn.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setState(!on);
    }
  });

  setState(false);
})();
