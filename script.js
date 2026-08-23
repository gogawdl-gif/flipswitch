(function () {
  const card = document.getElementById('appCard');
  const toggleBtn = document.getElementById('toggleBtn');
  const statusText = document.getElementById('statusText');
  const ipValue = document.getElementById('ipValue');
  const adsValue = document.getElementById('adsValue');
  const speedValue = document.getElementById('speedValue');
  const exposureIp = document.getElementById('exposureIp');
  const exposureIsp = document.getElementById('exposureIsp');
  const exposureStatus = document.getElementById('exposureStatus');

  const FALLBACK_IP = '104.28.212.9';
  const FALLBACK_ISP = 'unknown';
  const MASKED_IP = '•.•.•.•';
  const MASKED_ISP = 'hidden';

  let realIp = FALLBACK_IP;
  let realIsp = FALLBACK_ISP;

  let on = false;
  let adsCount = 0;
  let tickInterval = null;

  // Best-effort live lookup of the visitor's real IP/ISP. Falls back to a
  // placeholder if the request is blocked (an ad blocker will do this) or fails.
  fetch('https://ipapi.co/json/')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.ip) {
        realIp = data.ip;
        realIsp = (data.org || FALLBACK_ISP).replace(/^AS\d+\s*/, '');
        if (!on) {
          exposureIp.textContent = realIp;
          exposureIsp.textContent = realIsp;
          ipValue.textContent = realIp;
        }
      }
    })
    .catch(function () {
      if (!on) {
        exposureIp.textContent = FALLBACK_IP;
        exposureIsp.textContent = FALLBACK_ISP;
      }
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
      exposureIp.textContent = MASKED_IP;
      exposureIsp.textContent = MASKED_ISP;
      exposureStatus.textContent = 'Protected';
      exposureStatus.classList.remove('status-unprotected');
      exposureStatus.classList.add('status-protected');
    } else {
      statusText.textContent = 'UNPROTECTED';
      ipValue.textContent = realIp;
      speedValue.textContent = 'N/A';
      adsValue.textContent = '0';
      stopTicking();
      exposureIp.textContent = realIp;
      exposureIsp.textContent = realIsp;
      exposureStatus.textContent = 'Unprotected';
      exposureStatus.classList.remove('status-protected');
      exposureStatus.classList.add('status-unprotected');
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
