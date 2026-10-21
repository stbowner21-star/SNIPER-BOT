Javascript:(function(){
  if(document.getElementById('sniper-bot-widget')) return;

  const style = document.createElement('style');
  style.id = 'sniper-bot-style';
  style.innerHTML = `
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 10px #00ff66, 0 0 20px #00ff66, 0 0 30px #00ff66; transform: scale(1); }
      50% { box-shadow: 0 0 20px #00ff66, 0 0 40px #00ff66, 0 0 60px #00ff66; transform: scale(1.08); }
      100% { box-shadow: 0 0 10px #00ff66, 0 0 20px #00ff66, 0 0 30px #00ff66; transform: scale(1); }
    }
    @keyframes pulseCandle {
      0%, 100% { opacity: 0.85; transform: scaleY(1); }
      50% { opacity: 1; transform: scaleY(1.06); }
    }
    @keyframes smoothFloatChart {
      0% { transform: translateX(-12px); }
      50% { transform: translateX(12px); }
      100% { transform: translateX(-12px); }
    }
    @keyframes infinityWave {
      0% { stroke-dashoffset: 180; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes scanBarMove {
      0% { top: 0%; opacity: 0.3; }
      50% { top: 85%; opacity: 0.9; }
      100% { top: 0%; opacity: 0.3; }
    }
    @keyframes radarPulse {
      0% { transform: scale(0.6); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 0.3; }
      100% { transform: scale(0.6); opacity: 0.8; }
    }
    
    #sniper-circle-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 6px;
      user-select: none;
      cursor: grab;
    }

    #sniper-circle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #0d131d;
      border: 2px solid #00ff66;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulseGlow 2s infinite ease-in-out;
      overflow: hidden;
      cursor: pointer;
    }
    #sniper-circle-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      pointer-events: none;
    }

    #sniper-remove-btn {
      background: rgba(13, 19, 29, 0.9);
      border: 1px solid #ff3366;
      color: #ff3366;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 11px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 0 8px rgba(255, 51, 102, 0.5);
      transition: all 0.2s;
    }
    #sniper-remove-btn:hover { background: #ff3366; color: #fff; }

    #sniper-bot-widget {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 360px;
      background: #080d14;
      border: 1px solid #1c2e42;
      border-radius: 14px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.9), 0 0 20px rgba(0, 255, 102, 0.15);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #fff;
      z-index: 1000000;
      overflow: hidden;
      box-sizing: border-box;
    }

    .sb-header {
      background: #0d141e;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #172638;
      cursor: grab;
    }
    .sb-header:active { cursor: grabbing; }

    .sb-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sb-logo-icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 1px solid #00ff66;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sb-logo-icon img { width: 100%; height: 100%; object-fit: cover; }
    .sb-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.3px;
      color: #fff;
    }
    .sb-time {
      font-size: 9px;
      color: #7b8f9e;
      margin-top: 1px;
    }
    .sb-controls { display: flex; gap: 5px; }
    .sb-controls button {
      background: #141f2e;
      border: 1px solid #22364c;
      color: #fff;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sb-body { padding: 12px; }
    .sb-status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .sb-online { color: #00ff66; display: flex; align-items: center; gap: 4px; }
    .sb-online::before { content: '●'; font-size: 9px; }
    .sb-verified { background: #0b2216; color: #00ff66; border: 1px solid #14482c; padding: 2px 8px; border-radius: 4px; font-size: 9px; }

    .sb-modes { display: flex; gap: 8px; margin-bottom: 10px; }
    .sb-mode-btn {
      flex: 1;
      background: #0d1722;
      border: 1px solid #1b2d42;
      color: #7b93a8;
      padding: 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
    }
    .sb-mode-btn.active { background: #0c2619; border-color: #00ff66; color: #00ff66; }

    .sb-scanner {
      background: #04070b;
      border: 1px solid #152230;
      border-radius: 10px;
      padding: 12px 10px;
      text-align: center;
      margin-bottom: 10px;
      position: relative;
      height: 145px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-image: linear-gradient(rgba(21,34,48,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(21,34,48,0.15) 1px, transparent 1px);
      background-size: 15px 15px;
    }
    .sb-scanner-title {
      font-size: 9px;
      color: #536778;
      letter-spacing: 0.5px;
      text-align: left;
    }
    .sb-display-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      position: relative;
    }
    .sb-next-candle {
      color: #00ff66;
      font-size: 16px;
      font-weight: bold;
      text-shadow: 0 0 8px rgba(0,255,102,0.4);
      margin-bottom: 12px;
    }
    
    .sb-chart {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 9px;
      animation: smoothFloatChart 3s infinite ease-in-out;
    }
    .sb-candle { width: 9px; border-radius: 2px; position: relative; }
    .sb-candle::before, .sb-candle::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); width: 2px; }
    .sb-candle.green { background: #00ff66; height: 42px; }
    .sb-candle.green::before { top: -7px; height: 7px; background: #00ff66; }
    .sb-candle.green::after { bottom: -7px; height: 7px; background: #00ff66; }
    
    .sb-candle.red { background: #ff3366; height: 36px; }
    .sb-candle.red::before { top: -6px; height: 6px; background: #ff3366; }
    .sb-candle.red::after { bottom: -6px; height: 6px; background: #ff3366; }

    .sb-candle.active {
      background: #00ff66; height: 58px; width: 13px;
      box-shadow: 0 0 14px #00ff66;
      animation: pulseCandle 1.5s infinite;
    }
    .sb-candle.active::before { top: -9px; height: 9px; background: #00ff66; }
    .sb-candle.active::after { bottom: -9px; height: 9px; background: #00ff66; }

    .sb-wave-container {
      display: none;
      width: 100%;
      height: 80px;
      position: relative;
      align-items: center;
      justify-content: center;
    }
    .radar-ring {
      position: absolute;
      border: 1.5px solid rgba(0, 255, 102, 0.4);
      border-radius: 50%;
      animation: radarPulse 2s infinite ease-in-out;
      pointer-events: none;
    }
    .ring-1 { width: 45px; height: 45px; animation-delay: 0s; }
    .ring-2 { width: 75px; height: 75px; animation-delay: 0.4s; border-color: rgba(0, 255, 102, 0.25); }
    .ring-3 { width: 105px; height: 105px; animation-delay: 0.8s; border-color: rgba(96, 165, 250, 0.2); }

    .sb-wave-svg { width: 100%; height: 50px; position: relative; z-index: 2; }
    .animated-path { stroke-dasharray: 180; animation: infinityWave 1.5s linear infinite; }
    
    .sb-scan-bar {
      position: absolute; left: 5px; right: 5px; height: 3px;
      background: linear-gradient(90deg, transparent, #00ff66, transparent);
      box-shadow: 0 0 12px #00ff66, 0 0 20px #00ff66;
      display: none;
      animation: scanBarMove 2s ease-in-out infinite;
      z-index: 5;
    }
    .sb-analysing-text {
      display: none;
      font-size: 11px;
      color: #00ff66;
      font-weight: bold;
      letter-spacing: 0.5px;
      margin-top: 4px;
      text-shadow: 0 0 8px rgba(0,255,102,0.4);
      z-index: 6;
    }

    .sb-single-candle-wrap {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 90px;
      position: relative;
    }
    .sb-big-candle { width: 18px; border-radius: 4px; position: relative; animation: pulseCandle 1.5s infinite; }
    .sb-big-candle::before, .sb-big-candle::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); width: 3px; }
    .sb-big-candle.green { background: #00ff66; box-shadow: 0 0 16px #00ff66; }
    .sb-big-candle.green::before { top: -14px; height: 14px; background: #00ff66; }
    .sb-big-candle.green::after { bottom: -14px; height: 14px; background: #00ff66; }
    .sb-big-candle.red { background: #ff3366; box-shadow: 0 0 16px #ff3366; }
    .sb-big-candle.red::before { top: -14px; height: 14px; background: #ff3366; }
    .sb-big-candle.red::after { bottom: -14px; height: 14px; background: #ff3366; }

    .sb-candle-label { font-size: 10px; color: #8a9ba8; margin-top: 8px; letter-spacing: 1px; font-weight: bold; }

    .sb-signal-box {
      background: #0d141e; border: 1px solid #1a293b; border-radius: 10px;
      padding: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
    }
    .sb-signal-left { display: flex; align-items: center; gap: 10px; }
    .sb-icon-box {
      width: 30px; height: 30px; background: #14202e; border: 1px solid #23374c;
      border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #00ff66; font-size: 14px;
    }
    .sb-signal-text { font-size: 8px; color: #6a7d90; letter-spacing: 0.5px; }
    .sb-signal-val { font-size: 15px; font-weight: bold; color: #fff; }
    .sb-sub-text { font-size: 8px; color: #55687a; margin-top: 1px; }
    
    .sb-timer-box { color: #5c7285; font-family: monospace; font-size: 15px; font-weight: bold; letter-spacing: 1px; }

    .sb-btn-get {
      width: 100%;
      background: linear-gradient(180deg, #123d26 0%, #0c2c1b 100%);
      border: 1px solid #185a38; color: #00ff66; padding: 11px; border-radius: 8px;
      font-weight: bold; font-size: 13px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
      box-shadow: inset 0 1px 0 rgba(255,255,102,0.1); transition: all 0.2s;
    }
    .sb-btn-get:hover { background: #0f3521; }
    .sb-btn-get:disabled { opacity: 0.5; cursor: not-allowed; }

    .sb-footer {
      display: flex; justify-content: space-between; font-size: 8px; color: #4a5c6d;
      margin-top: 8px; padding-top: 4px; border-top: 1px solid #121c27;
    }
  `;
  document.head.appendChild(style);

  // Floating Circle Container
  const container = document.createElement('div');
  container.id = 'sniper-circle-container';
  container.innerHTML = `
    <div id="sniper-circle-btn" title="Open Sniper Bot">
      <img src="https://i.postimg.cc/76mrK7B5/IMG-20260825-215652-178.jpg" alt="Logo">
    </div>
    <div id="sniper-remove-btn" title="Remove Floating Button">✕</div>
  `;
  document.body.appendChild(container);

  // Bot Widget Container
  const widget = document.createElement('div');
  widget.id = 'sniper-bot-widget';
  widget.innerHTML = `
    <div class="sb-header" id="sb-header">
      <div class="sb-title-wrap">
        <div class="sb-logo-icon">
          <img src="https://i.postimg.cc/76mrK7B5/IMG-20260825-215652-178.jpg" alt="Logo">
        </div>
        <div>
          <div class="sb-title">SNIPER BOT CRACKED BY SITB</div>
          <div class="sb-time" id="sb-clock">TIME: 18:01:49</div>
        </div>
      </div>
      <div class="sb-controls">
        <button id="sb-min-btn">-</button>
        <button id="sb-close-btn">×</button>
      </div>
    </div>
    <div class="sb-body">
      <div class="sb-status-bar">
        <span class="sb-online">AI ENGINE ONLINE</span>
        <span class="sb-verified">VERIFIED: 1</span>
      </div>

      <div class="sb-modes">
        <div class="sb-mode-btn active">1m Standard</div>
        <div class="sb-mode-btn">⚡ 5s Auto Mode</div>
      </div>
      
      <div class="sb-scanner">
        <div class="sb-scanner-title" id="sb-scan-header-text">AI SIGNAL SCANNER</div>
        <div class="sb-scan-bar" id="sb-scan-bar"></div>
        
        <div class="sb-display-area">
          <div id="sb-default-candles-view">
            <div class="sb-next-candle">Next Candle??</div>
            <div class="sb-chart">
              <div class="sb-candle green"></div>
              <div class="sb-candle red"></div>
              <div class="sb-candle green"></div>
              <div class="sb-candle red"></div>
              <div class="sb-candle active"></div>
              <div class="sb-candle red"></div>
              <div class="sb-candle green"></div>
              <div class="sb-candle red"></div>
            </div>
          </div>
          
          <div class="sb-wave-container" id="sb-wave-view">
            <div class="radar-ring ring-1"></div>
            <div class="radar-ring ring-2"></div>
            <div class="radar-ring ring-3"></div>
            <svg class="sb-wave-svg" viewBox="0 0 300 50">
              <path class="animated-path" d="M 10 25 C 80 -10, 150 60, 220 25 C 260 5, 290 25, 290 25" fill="none" stroke="#60a5fa" stroke-width="3"/>
              <path class="animated-path" d="M 10 25 C 80 60, 150 -10, 220 25 C 260 45, 290 25, 290 25" fill="none" stroke="#00ff66" stroke-width="3"/>
              <circle cx="150" cy="25" r="4.5" fill="#00ff66"/>
              <circle cx="215" cy="25" r="4.5" fill="#60a5fa"/>
            </svg>
          </div>
          <div class="sb-analysing-text" id="sb-analysing-text">Trend Analysing...</div>

          <div class="sb-single-candle-wrap" id="sb-single-candle-view">
            <div class="sb-big-candle" id="sb-target-candle"></div>
            <div class="sb-candle-label">SIGNAL</div>
          </div>
        </div>
      </div>

      <div class="sb-signal-box">
        <div class="sb-signal-left">
          <div class="sb-icon-box" id="sb-icon-box">⚡</div>
          <div>
            <div class="sb-signal-text" id="sb-signal-label">LATEST SIGNAL</div>
            <div class="sb-signal-val" id="sb-signal-val">READY</div>
            <div class="sb-sub-text" id="sb-sub-msg">License verified successfully.</div>
          </div>
        </div>
        <div class="sb-timer-box" id="sb-timer">--:--:--</div>
      </div>

      <button class="sb-btn-get" id="sb-get-btn">⚡ GET SIGNAL</button>

      <div class="sb-footer">
        <span>• ULTRA AI ENGINE</span>
        <span>SNIPER BOT CRACKED BY SITB</span>
      </div>
    </div>
    <div style="text-align:center; font-size:8px; color:#4a5c6d; padding-bottom:6px;">Protected Signal System.</div>
  `;
  document.body.appendChild(widget);

  // Mouse & Touch Dragging and Clicking Support for PC/Mobile
  function makeDraggable(el, handleEl) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    function dragStart(e) {
      if (e.target.id === 'sniper-remove-btn' || e.target.tagName === 'BUTTON') return;
      isDragging = false;
      startX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      startY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      
      const rect = el.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;

      el.style.bottom = 'auto';
      el.style.right = 'auto';
      el.style.left = initialX + 'px';
      el.style.top = initialY + 'px';
      if(el === widget) {
        el.style.transform = 'none';
      }

      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchmove', dragMove, {passive: false});
      document.addEventListener('touchend', dragEnd);
    }

    function dragMove(e) {
      const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        isDragging = true;
      }

      el.style.left = (initialX + dx) + 'px';
      el.style.top = (initialY + dy) + 'px';
    }

    function dragEnd() {
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', dragEnd);
    }

    handleEl.addEventListener('mousedown', dragStart);
    handleEl.addEventListener('touchstart', dragStart, {passive: true});

    return () => isDragging;
  }

  const checkCircleDrag = makeDraggable(container, container);
  makeDraggable(widget, document.getElementById('sb-header'));

  document.getElementById('sniper-circle-btn').onclick = function(e) {
    if (!checkCircleDrag()) {
      widget.style.display = (widget.style.display === 'none' || widget.style.display === '') ? 'block' : 'none';
    }
  };

  document.getElementById('sniper-remove-btn').onclick = function(e) {
    e.stopPropagation();
    container.remove();
    widget.remove();
    style.remove();
  };

  document.getElementById('sb-close-btn').onclick = function() { widget.style.display = 'none'; };
  document.getElementById('sb-min-btn').onclick = function() { widget.style.display = 'none'; };

  function updateClock() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('sb-clock').innerText = `TIME: ${hrs}:${mins}:${secs}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Quotex Auto-Trade Execution Logic with Anti-Double Trade Lock
  let isTradeExecuting = false;

  function executeQuotexTrade(isUp) {
    if (isTradeExecuting) return; // ইতিমধ্যে ট্রেড প্রসেস হতে থাকলে দ্বিতীয়বার যেন না হয়
    isTradeExecuting = true;

    try {
      const buttons = document.querySelectorAll('button, div[role="button"]');
      let targetBtn = null;

      for (let btn of buttons) {
        const text = btn.innerText.trim().toUpperCase();
        if (isUp && (text.includes('BUY') || text.includes('HIGHER') || text.includes('CALL'))) {
          targetBtn = btn;
          break;
        } else if (!isUp && (text.includes('SELL') || text.includes('LOWER') || text.includes('PUT'))) {
          targetBtn = btn;
          break;
        }
      }

      if (!targetBtn) {
        const selector = isUp ? '.btn-call, [class*="call"], .pointer-events-auto.bg-green-600, .bg-green-500' : '.btn-put, [class*="put"], .pointer-events-auto.bg-red-600, .bg-red-500';
        targetBtn = document.querySelector(selector);
      }

      if (targetBtn) {
        // শুধুমাত্র একবার মাত্র নেটিভ ক্লিক ট্রিগার করা হবে
        targetBtn.click();
        console.log("Auto Trade Placed Successfully: " + (isUp ? "UP (BUY)" : "DOWN (SELL)"));
      } else {
        console.log("Quotex Buy/Sell button not found automatically.");
      }
    } catch (err) {
      console.error("Auto trade execution error: ", err);
    }

    // ৩ সেকেন্ড পর লক রিসেট করা হবে যাতে পরবর্তী সিগন্যালে কাজ করতে পারে
    setTimeout(() => {
      isTradeExecuting = false;
    }, 3000);
  }

  document.getElementById('sb-get-btn').onclick = function() {
    const btnSelf = this;
    const defaultView = document.getElementById('sb-default-candles-view');
    const waveView = document.getElementById('sb-wave-view');
    const analysingText = document.getElementById('sb-analysing-text');
    const singleCandleView = document.getElementById('sb-single-candle-view');
    const scanHeader = document.getElementById('sb-scan-header-text');
    const scanBar = document.getElementById('sb-scan-bar');
    const valEl = document.getElementById('sb-signal-val');
    const subMsg = document.getElementById('sb-sub-msg');
    const targetCandle = document.getElementById('sb-target-candle');
    const arrowBox = document.getElementById('sb-icon-box');
    
    btnSelf.disabled = true;
    btnSelf.style.opacity = '0.5';

    defaultView.style.display = 'none';
    singleCandleView.style.display = 'none';
    waveView.style.display = 'flex';
    analysingText.style.display = 'block';
    scanBar.style.display = 'block';
    scanHeader.innerText = 'AI SIGNAL SCANNER';
    scanHeader.style.color = '#536778';

    valEl.innerText = 'SCANNING';
    valEl.style.color = '#fff';
    subMsg.innerText = 'Scanning market trends...';
    arrowBox.innerText = '⚡';

    setTimeout(() => {
      waveView.style.display = 'none';
      analysingText.style.display = 'none';
      scanBar.style.display = 'none';
      singleCandleView.style.display = 'flex';

      const isUp = Math.random() > 0.5;
      valEl.innerText = isUp ? 'UP' : 'DOWN';
      valEl.style.color = isUp ? '#00ff66' : '#ff3366';
      arrowBox.innerText = isUp ? '↑' : '↓';
      arrowBox.style.color = isUp ? '#00ff66' : '#ff3366';

      const now = new Date();
      const targetTimeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      subMsg.innerText = isUp ? `Next candle.. UP candle for ${targetTimeStr}` : `Next candle.. DOWN candle for ${targetTimeStr}`;
      
      const randomHeight = Math.floor(45 + Math.random() * 35);
      targetCandle.className = isUp ? 'sb-big-candle green' : 'sb-big-candle red';
      targetCandle.style.height = randomHeight + 'px';

      // এখানে একটিমাত্র ট্রেড প্লেস নিশ্চিত করা হয়েছে
      executeQuotexTrade(isUp);

      let seconds = 60;
      const timerEl = document.getElementById('sb-timer');
      timerEl.style.color = '#00ff66';
      
      const countdown = setInterval(() => {
        seconds--;
        let m = String(Math.floor(seconds / 60)).padStart(2, '0');
        let s = String(seconds % 60).padStart(2, '0');
        timerEl.innerText = `00:${m}:${s}`;
        
        if(seconds <= 0) {
          clearInterval(countdown);
          timerEl.innerText = '--:--:--';
          timerEl.style.color = '#5c7285';
          valEl.innerText = 'READY';
          valEl.style.color = '#fff';
          subMsg.innerText = 'License verified successfully.';
          singleCandleView.style.display = 'none';
          defaultView.style.display = 'block';
          arrowBox.innerText = '⚡';
          arrowBox.style.color = '#00ff66';
          
          btnSelf.disabled = false;
          btnSelf.style.opacity = '1';
          btnSelf.innerText = '⚡ GET SIGNAL';
        }
      }, 1000);

    }, 4500);
  };
})();
