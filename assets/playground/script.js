const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('perf-theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.dataset.theme = savedTheme || systemTheme;
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('perf-theme', next);
});

const feedData = [
  ['Maya Chen', 'I tried optimistic UI. The button really does respond immediately.'],
  ['Jon Bell', 'A restrained shimmer keeps the skeleton from feeling stuck.'],
  ['Amara Okafor', 'The virtual list renders only what is visible and saves thousands of DOM nodes.']
];
let skeletonTimer;
function renderSkeleton() {
  clearTimeout(skeletonTimer);
  const list = $('#feedList');
  list.classList.add('loading');
  $('#skeletonState').textContent = 'Loading';
  list.innerHTML = Array.from({length: 3}, () => `<div class="feed-row"><div class="feed-avatar"></div><div><div class="skeleton-line short"></div><div class="skeleton-line"></div><div class="skeleton-line mid"></div></div></div>`).join('');
  skeletonTimer = setTimeout(() => {
    list.classList.remove('loading');
    list.innerHTML = feedData.map(([name,text]) => `<div class="feed-row"><div class="feed-avatar"></div><div class="feed-text"><strong>${name}</strong><p>${text}</p></div></div>`).join('');
    $('#skeletonState').textContent = 'Ready';
  }, 1800);
}
$('[data-action="reload-skeleton"]').addEventListener('click', renderSkeleton);
renderSkeleton();

let liked = false;
let likeBusy = false;
$('#likeButton').addEventListener('click', () => {
  if (likeBusy) return;
  const previous = liked;
  liked = !liked;
  likeBusy = true;
  updateLike();
  $('#likeStatus').className = 'request-status';
  $('#likeStatus').textContent = 'UI updated. Syncing in the background...';
  setTimeout(() => {
    likeBusy = false;
    if ($('#forceFail').checked) {
      liked = previous;
      updateLike();
      $('#likeStatus').className = 'request-status error';
      $('#likeStatus').textContent = 'The API failed, so the interface rolled back.';
    } else {
      $('#likeStatus').textContent = 'Confirmed by the server';
    }
  }, 1400);
});
function updateLike() {
  $('#likeButton').setAttribute('aria-pressed', String(liked));
  $('#likeCount').textContent = liked ? '129' : '128';
}

let blurTimer;
function replayBlur() {
  clearTimeout(blurTimer);
  const stage = $('#blurStage');
  stage.classList.remove('loaded');
  $('#blurBadge').textContent = 'LOW RES · 1 KB';
  blurTimer = setTimeout(() => {
    stage.classList.add('loaded');
    $('#blurBadge').textContent = 'FULL RES';
  }, 1450);
}
$('[data-action="replay-blur"]').addEventListener('click', replayBlur);
replayBlur();

let prefetchDone = false;
let prefetching = false;
let prefetchInterval;
function startPrefetch() {
  if (prefetchDone || prefetching) return;
  prefetching = true;
  const consoleEl = $('.prefetch-console');
  consoleEl.className = 'prefetch-console prefetching';
  $('#prefetchStatus').textContent = 'PREFETCH: /full-report';
  let elapsed = 0;
  prefetchInterval = setInterval(() => {
    elapsed += 45;
    $('#prefetchTime').textContent = `${elapsed} ms`;
    $('#prefetchProgress').style.width = `${Math.min(100, elapsed / 4.5)}%`;
    if (elapsed >= 450) {
      clearInterval(prefetchInterval);
      prefetching = false;
      prefetchDone = true;
      consoleEl.className = 'prefetch-console prefetched';
      $('#prefetchStatus').textContent = 'READY: served from cache';
      $('#prefetch-result').textContent = 'The next page is ready before you even click.';
    }
  }, 45);
}
['pointerenter','focus'].forEach(event => $('#prefetchLink').addEventListener(event, startPrefetch));
$('#prefetchLink').addEventListener('click', event => {
  if (!prefetchDone) event.preventDefault();
  startPrefetch();
});

const ROW_HEIGHT = 44;
const TOTAL_ROWS = 10000;
const virtualWindow = $('#virtualWindow');
$('#virtualSpacer').style.height = `${ROW_HEIGHT * TOTAL_ROWS}px`;
function renderVirtual() {
  const visibleCount = Math.ceil(virtualWindow.clientHeight / ROW_HEIGHT);
  const start = Math.max(0, Math.floor(virtualWindow.scrollTop / ROW_HEIGHT) - 3);
  const end = Math.min(TOTAL_ROWS, start + visibleCount + 7);
  const items = [];
  for (let i = start; i < end; i++) {
    items.push(`<div class="virtual-row" style="transform:translateY(${i * ROW_HEIGHT}px)"><span>#${String(i + 1).padStart(5,'0')}</span><b>Performance record ${i + 1}</b><i></i></div>`);
  }
  $('#virtualItems').innerHTML = items.join('');
  $('#renderedCount').textContent = String(end - start);
}
virtualWindow.addEventListener('scroll', renderVirtual, {passive: true});
window.addEventListener('resize', renderVirtual);
renderVirtual();

let debounceTimer;
let keys = 0;
let calls = 0;
$('#searchInput').addEventListener('input', event => {
  keys++;
  $('#keyCount').textContent = keys;
  $('#searchResult').textContent = 'Waiting for typing to pause...';
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    calls++;
    $('#apiCount').textContent = calls;
    const query = event.target.value.trim();
    $('#searchResult').textContent = query ? `Sent one API request for “${query}”` : 'No query yet';
  }, 300);
});

let streamTimers = [];
function startStream() {
  streamTimers.forEach(clearTimeout);
  streamTimers = [];
  const content = $('#streamContent');
  content.innerHTML = '<div class="stream-block skeleton-line mid"></div><div class="stream-block skeleton-line"></div><div class="stream-block skeleton-line"></div>';
  const blocks = [
    [350, '<div class="stream-block title">Why a fast website can still feel slow</div>'],
    [900, '<div class="stream-block image"></div>'],
    [1450, '<div class="stream-block text">The first section is ready. People can start reading without waiting for the entire page.</div>'],
    [2050, '<div class="stream-block text">The remaining sections arrive in the order the server completes them.</div>']
  ];
  blocks.forEach(([delay, html], index) => streamTimers.push(setTimeout(() => {
    if (index === 0) content.innerHTML = '';
    content.insertAdjacentHTML('beforeend', html);
  }, delay)));
}
$('[data-action="start-stream"]').addEventListener('click', startStream);
startStream();

function runSpring() {
  const easeTrack = $('#easeBall').parentElement;
  const springTrack = $('#springBall').parentElement;
  easeTrack.classList.remove('run-ease');
  springTrack.classList.remove('run-spring');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    easeTrack.classList.add('run-ease');
    springTrack.classList.add('run-spring');
  }));
}
$('[data-action="run-spring"]').addEventListener('click', runSpring);

const sheet = $('#bottomSheet');
const stage = $('.phone-stage');
let dragStartY = 0;
let dragStartTime = 0;
let lastY = 0;
let lastTime = 0;
$('#openSheet').addEventListener('click', () => sheet.classList.add('open'));
function sheetPointerDown(event) {
  if (!sheet.classList.contains('open')) return;
  dragStartY = lastY = event.clientY;
  dragStartTime = lastTime = performance.now();
  sheet.classList.add('dragging');
  sheet.setPointerCapture(event.pointerId);
}
function sheetPointerMove(event) {
  if (!sheet.classList.contains('dragging')) return;
  const raw = event.clientY - dragStartY;
  const distance = raw < 0 ? raw * .18 : raw;
  const now = performance.now();
  const velocity = (event.clientY - lastY) / Math.max(1, now - lastTime) * 1000;
  $('#velocityReadout').textContent = `velocity ${Math.round(velocity)} px/s`;
  sheet.style.transform = `translateY(${distance}px)`;
  lastY = event.clientY;
  lastTime = now;
}
function sheetPointerUp(event) {
  if (!sheet.classList.contains('dragging')) return;
  const distance = event.clientY - dragStartY;
  const velocity = distance / Math.max(1, performance.now() - dragStartTime) * 1000;
  sheet.classList.remove('dragging');
  sheet.style.transform = '';
  if (distance > stage.clientHeight * .34 || velocity > 650) sheet.classList.remove('open');
}
sheet.addEventListener('pointerdown', sheetPointerDown);
sheet.addEventListener('pointermove', sheetPointerMove);
sheet.addEventListener('pointerup', sheetPointerUp);
sheet.addEventListener('pointercancel', sheetPointerUp);

const commands = [
  {label:'Open Skeleton screen', meta:'Speed', target:'#skeletonLab'},
  {label:'Try Optimistic UI', meta:'Speed', target:'#optimisticLab'},
  {label:'Open Virtual list', meta:'Speed', target:'#virtualLab'},
  {label:'Try Spring physics', meta:'Feel', target:'.spring-lab'},
  {label:'Open Toast feedback', meta:'Feel', target:'.toast-card-lab'},
  {label:'Toggle color theme', meta:'Display', action:() => themeToggle.click()}
];
let filteredCommands = commands;
let activeCommand = 0;
function renderCommands() {
  $('#commandList').innerHTML = filteredCommands.map((command,index) => `<li role="option" aria-selected="${index === activeCommand}" class="${index === activeCommand ? 'active' : ''}" data-index="${index}"><span>${command.label}</span><span>${command.meta}</span></li>`).join('');
}
function openPalette() {
  $('#paletteBackdrop').hidden = false;
  $('#commandInput').value = '';
  filteredCommands = commands;
  activeCommand = 0;
  renderCommands();
  setTimeout(() => $('#commandInput').focus(), 0);
}
function closePalette() { $('#paletteBackdrop').hidden = true; $('#commandTrigger').focus(); }
function executeCommand(index = activeCommand) {
  const command = filteredCommands[index];
  if (!command) return;
  $('#paletteBackdrop').hidden = true;
  if (command.action) command.action();
  if (command.target) $(command.target).scrollIntoView({behavior:'smooth',block:'start'});
}
$('#commandTrigger').addEventListener('click', openPalette);
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#paletteBackdrop').hidden ? openPalette() : closePalette(); }
  if (!$('#paletteBackdrop').hidden) {
    if (event.key === 'Escape') closePalette();
    if (event.key === 'ArrowDown') { event.preventDefault(); activeCommand = (activeCommand + 1) % filteredCommands.length; renderCommands(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); activeCommand = (activeCommand - 1 + filteredCommands.length) % filteredCommands.length; renderCommands(); }
    if (event.key === 'Enter') { event.preventDefault(); executeCommand(); }
  }
});
$('#commandInput').addEventListener('input', event => {
  const query = event.target.value.toLowerCase();
  filteredCommands = commands.filter(command => command.label.toLowerCase().includes(query));
  activeCommand = 0;
  renderCommands();
});
$('#commandList').addEventListener('click', event => {
  const item = event.target.closest('li');
  if (item) executeCommand(Number(item.dataset.index));
});
$('#paletteBackdrop').addEventListener('pointerdown', event => { if (event.target === $('#paletteBackdrop')) closePalette(); });

$$('[data-shadow]').forEach(button => button.addEventListener('click', () => {
  $$('[data-shadow]').forEach(item => item.classList.toggle('active', item === button));
  $('#shadowObject').className = `shadow-object ${button.dataset.shadow}`;
}));
$('#shadowObject').classList.add('layered');

$('#noiseSlider').addEventListener('input', event => {
  const value = `${event.target.value}%`;
  $('.noise-side.clean').style.clipPath = `inset(0 ${100 - event.target.value}% 0 0)`;
  $('.noise-side.textured').style.left = value;
});

$('#noteInput').addEventListener('input', () => $('#inlineSaveStatus').textContent = 'There are unsaved changes');
$('#saveButton').addEventListener('click', () => {
  $('#inlineSaveStatus').textContent = 'Saving...';
  setTimeout(() => {
    $('#inlineSaveStatus').textContent = 'Saved a moment ago';
    showToast('Saved', 'Your changes are safe');
  }, 520);
});
function showToast(title, detail) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i>✓</i><strong>${title}</strong><span>${detail}</span>`;
  $('#toastRegion').append(toast);
  setTimeout(() => toast.remove(), 3200);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.matches('.lab,.feel-card,.spring-lab')) entry.target.classList.add('seen');
  });
}, {threshold:.08});
$$('.lab,.feel-card,.spring-lab').forEach(item => observer.observe(item));
