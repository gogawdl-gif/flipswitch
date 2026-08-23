(function () {
  const card = document.getElementById('appCard');
  const toggleBtn = document.getElementById('toggleBtn');
  const statusText = document.getElementById('statusText');
  const ipValue = document.getElementById('ipValue');
  const adsValue = document.getElementById('adsValue');
  const speedValue = document.getElementById('speedValue');

  const REAL_IP = '104.28.212.9';
  const MASKED_IP = '•.•.•.•';

  let on = false;
  let adsCount = 0;
  let tickInterval = null;

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
    } else {
      statusText.textContent = 'UNPROTECTED';
      ipValue.textContent = REAL_IP;
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
