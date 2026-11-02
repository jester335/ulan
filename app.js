/* ==========================================================
   Ulan Express — общий скрипт макета (все страницы)
   Шапка, меню, нижняя панель и модальное окно вставляются отсюда,
   чтобы не дублировать их в каждом HTML-файле. В WordPress это будут
   header.php / footer.php темы.
   ========================================================== */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (v) => parseFloat(String(v || '').replace(',', '.').replace(/\s/g, '')) || 0;
  const usd = (v) => '$' + v.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const rub = (v) => v.toLocaleString('ru-RU') + ' ₽';
  const plural = (n, f) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } }
  };

  const PAGE = document.body.dataset.page || '';
  const SECTION = { product: 'products', service: 'services' }[PAGE] || PAGE;
  const TG = 'https://t.me/ulanexpress_Logistics';

  /* ---------- Icons ---------- */
  const IC = {
    bolt: '<path d="M13.5 1 4 13.5h6.5L9 23l11-13.5h-7z"/>',
    home: '<path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z"/>',
    bag: '<path d="M7 7V6a5 5 0 0 1 10 0v1h3.5l-1 15h-15l-1-15zm2 0h6V6a3 3 0 0 0-6 0zm-2 3v2h2v-2zm8 0v2h2v-2z"/>',
    calc: '<path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 3v4h10V5zm0 7v2h2v-2zm4 0v2h2v-2zm4 0v6h2v-6zm-8 4v2h2v-2zm4 0v2h2v-2z"/>',
    cart: '<path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5.2 4H2V2h4.6l.9 2H22l-3.4 8.6A2 2 0 0 1 16.7 14H8.1l-.9 2H19v2H4l2.4-4.8z"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5zM12 5.3 17.6 8 12 10.8 6.4 8zM5 9.7l6 3v6.1l-6-3.3zm8 9.1v-6.1l6-3v5.8z"/>',
    support: '<path d="M12 2a9 9 0 0 0-9 9v6a3 3 0 0 0 3 3h2v-8H5v-1a7 7 0 0 1 14 0v1h-3v8h3v1h-6v2h6a2 2 0 0 0 2-2v-9a9 9 0 0 0-9-9z"/>'
  };
  const svg = (name, cls) => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" aria-hidden="true">${IC[name]}</svg>`;

  /* ---------- Shell: шапка, меню, подвал, нижняя панель ---------- */
  const NAV = [
    ['calc', 'calc.html', 'Калькулятор'],
    ['buyout', 'buyout.html', 'Выкуп и заказ'],
    ['products', 'products.html', 'Товары'],
    ['services', 'services.html', 'Услуги'],
    ['agents', 'agents.html', 'Агентам и закупки'],
    ['about', 'about.html', 'О компании']
  ];
  const navLinks = (extra = '') => NAV.map(([id, href, label]) =>
    `<a href="${href}"${id === SECTION ? ' class="is-active" aria-current="page"' : ''}>${label}</a>`).join('') + extra;
  const logo = `<a href="index.html" class="logo" aria-label="Ulan Express — на главную">${svg('bolt', 'logo__bolt')}<span class="logo__text">ULAN<span>EXPRESS</span></span></a>`;

  document.body.insertAdjacentHTML('afterbegin', `
<div class="bg-fx" aria-hidden="true">
  <i class="bg-fx__blob bg-fx__blob--a"></i><i class="bg-fx__blob bg-fx__blob--b"></i>
  <i class="bg-fx__streak" style="--y:22%;--t:11s;--d:1.5s"></i>
  <i class="bg-fx__streak" style="--y:55%;--t:14s;--d:5.5s"></i>
  <i class="bg-fx__streak" style="--y:78%;--t:17s;--d:9s"></i>
</div>
<header class="header">
  <div class="container header__inner">
    ${logo}
    <nav class="nav" aria-label="Основное меню">${navLinks()}</nav>
    <div class="header__actions">
      <a href="order.html" class="hdr-icon" aria-label="Мой заказ" title="Мой заказ">${svg('box')}</a>
      <div class="lang" role="group" aria-label="Язык сайта">
        <button class="lang__btn" data-lang="zh" type="button">中文</button>
        <button class="lang__btn is-active" data-lang="ru" type="button">RU</button>
      </div>
      <button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" hidden>
  <nav class="drawer__nav" aria-label="Мобильное меню">${navLinks(`<a href="order.html"${PAGE === 'order' ? ' class="is-active"' : ''}>Мой заказ / трек-номер</a>`)}</nav>
  <a class="btn btn--neon btn--block" href="${TG}" target="_blank" rel="noopener">Написать в Telegram</a>
</div>`);

  const TABS = [
    ['home', 'index.html', 'Главная', 'home'],
    ['products', 'products.html', 'Товары', 'bag'],
    ['calc', 'calc.html', 'Расчёт', 'calc'],
    ['buyout', 'buyout.html', 'Выкуп', 'cart'],
    ['order', 'order.html', 'Заказ', 'box']
  ];

  document.body.insertAdjacentHTML('beforeend', `
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        ${logo}
        <p>Доставка грузов из Китая в Россию: карго, «белая», контейнеры и выкуп товаров. Склады в Иу и Фошане.</p>
        <div class="pills">
          <a href="${TG}" target="_blank" rel="noopener" class="pill pill--tg">Telegram</a>
          <a href="#" class="pill pill--wa" data-toast="Ссылка на WhatsApp появится после согласования">WhatsApp</a>
          <a href="#" class="pill pill--wc" data-toast="Здесь будет WeChat ID">WeChat</a>
        </div>
      </div>
      <nav class="footer__col" aria-label="Разделы сайта">
        <span class="footer__title">Разделы</span>
        ${NAV.map(([, h, l]) => `<a href="${h}">${l}</a>`).join('')}
      </nav>
      <nav class="footer__col" aria-label="Клиентам">
        <span class="footer__title">Клиентам</span>
        <a href="order.html">Мой заказ</a>
        <a href="buyout.html#self">Адрес склада</a>
        <a href="calc.html#container">Контейнеры</a>
        <a href="agents.html#groups">Совместные закупки</a>
        <a href="about.html#contacts">Контакты</a>
      </nav>
    </div>
    <div class="footer__bottom">
      <span>© 2026 Ulan Express</span>
      <span class="footer__legal">
        <a href="#" data-toast="Демо: здесь будет политика конфиденциальности">Политика конфиденциальности</a>
        <a href="#" data-toast="Демо: здесь будет согласие на обработку ПДн">Согласие на обработку ПДн</a>
      </span>
    </div>
  </div>
</footer>

<a href="${TG}" class="fab" target="_blank" rel="noopener" aria-label="Связаться с поддержкой">${svg('support')}</a>

<nav class="tabbar" aria-label="Быстрая навигация">
  ${TABS.map(([id, href, label, icon]) => id === 'calc'
    ? `<a href="${href}" class="tabbar__item tabbar__item--main${id === SECTION ? ' is-active' : ''}"><span class="tabbar__main">${svg(icon)}</span><span>${label}</span></a>`
    : `<a href="${href}" class="tabbar__item${id === SECTION ? ' is-active' : ''}">${svg(icon)}<span>${label}</span></a>`).join('')}
</nav>

<div class="modal" id="modal" hidden>
  <div class="modal__backdrop" data-close></div>
  <div class="modal__sheet" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <span class="modal__grip" aria-hidden="true"></span>
    <button class="modal__close" type="button" aria-label="Закрыть" data-close>✕</button>
    <span class="eyebrow" id="modalEyebrow">Заявка</span>
    <h3 class="h3" id="modalTitle">Заявка</h3>
    <p class="muted small" id="modalSub" hidden></p>
    <form class="modal__form" id="modalForm" novalidate>
      <label class="field"><span class="field__label">Имя <span class="req">*</span></span><input class="field__input" type="text" name="name" placeholder="Как к вам обращаться" required autocomplete="given-name"></label>
      <label class="field"><span class="field__label">Телефон <span class="req">*</span></span><input class="field__input" type="tel" name="phone" placeholder="+7 999 123-45-67" required autocomplete="tel"></label>
      <label class="field"><span class="field__label">Где удобнее ответить</span>
        <span class="select"><select class="field__input" name="messenger"><option>Telegram</option><option>WhatsApp</option><option>WeChat</option><option>Звонок</option></select></span>
      </label>
      <label class="field"><span class="field__label">Комментарий</span><textarea class="field__input" rows="3" name="comment" id="modalComment" placeholder="Что нужно сделать"></textarea></label>
      <label class="consent"><input type="checkbox" name="consent" required><span>Согласен на <a href="#" data-toast="Демо: откроется согласие на обработку ПДн">обработку персональных данных</a></span></label>
      <button type="submit" class="btn btn--neon btn--block btn--lg">Отправить заявку</button>
    </form>
  </div>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`);

  /* ---------- Иконки мессенджеров (цвет берётся из класса кнопки: soc--tg, pill--wa…) ---------- */
  const DARK = '#0A0C0B';
  const SOCIAL = {
    tg: `<circle cx="12" cy="12" r="10"/><path fill="${DARK}" d="M5.6 11.7 16.7 7.4c.5-.2 1 .1.8.9l-1.9 9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.3-.1l-6.7 4.2-2.9-.9c-.6-.2-.6-.6.2-.9z"/>`,
    wa: `<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M9.1 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.1.7.5 0 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5.3-.4v-.5z"/>`,
    wc: `<path d="M9.5 4C5.4 4 2 6.7 2 10.1c0 1.9 1 3.6 2.7 4.7L4 17l2.6-1.3c.9.3 1.9.4 2.9.4h.4a5.4 5.4 0 0 1-.2-1.5c0-3.3 3.1-6 7-6h.4C16.4 5.9 13.3 4 9.5 4z"/><circle cx="7" cy="8.7" r="1" fill="${DARK}"/><circle cx="12" cy="8.7" r="1" fill="${DARK}"/><path stroke="${DARK}" stroke-width="1.2" paint-order="stroke" d="M16.6 10c-3.3 0-5.9 2.2-5.9 4.9s2.6 4.9 5.9 4.9c.7 0 1.4-.1 2-.3l2 1-.5-1.8c1.4-.9 2.4-2.3 2.4-3.8 0-2.7-2.6-4.9-5.9-4.9z"/><circle cx="14.6" cy="14" r=".85" fill="${DARK}"/><circle cx="18.6" cy="14" r=".85" fill="${DARK}"/>`,
    vk: `<rect x="2" y="2" width="20" height="20" rx="6"/><path fill="none" stroke="${DARK}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" d="M6 8.4c.5 4.6 2.9 7.3 6.4 7.3V8.4M12.4 12.6c2.5-.2 4.4-1.8 5.4-4.2M12.4 12.6c2.6.3 4.6 1.6 5.8 3.1"/>`,
    ph: `<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/>`
  };
  $$('.soc, .pill').forEach((el) => {
    const key = Object.keys(SOCIAL).find((k) => el.classList.contains('soc--' + k) || el.classList.contains('pill--' + k));
    if (key) el.insertAdjacentHTML('afterbegin', `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL[key]}</svg>`);
  });

  /* ---------- Блокировка прокрутки страницы, пока открыто меню, окно или список ---------- */
  new MutationObserver(() => {
    const c = document.body.classList;
    document.documentElement.classList.toggle('is-locked', c.contains('no-scroll') || c.contains('dd-lock'));
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2800);
  };

  /* ---------- Copy / share ---------- */
  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
  };
  const share = async (title, url) => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* пользователь закрыл меню */ }
      return;
    }
    await copyText(url);
    toast('Ссылка скопирована — отправьте её в Telegram или WhatsApp');
  };

  /* ---------- Modal ---------- */
  const modal = $('#modal');
  let modalTitle = '';
  let lastFocus = null;
  const openModal = (o) => {
    modalTitle = o.modal;
    $('#modalTitle').textContent = o.modal;
    $('#modalEyebrow').textContent = o.eyebrow || 'Заявка';
    $('#modalSub').textContent = o.sub || '';
    $('#modalSub').hidden = !o.sub;
    $('#modalComment').placeholder = o.placeholder || 'Что нужно сделать';
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('no-scroll');
    $('.modal__close', modal).focus({ preventScroll: true });
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { modal.hidden = true; }, 250);
    lastFocus?.focus?.({ preventScroll: true });
  };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* ---------- Validation + demo forms ---------- */
  const validate = (form) => {
    let ok = true;
    $$('[required]', form).forEach((el) => {
      const bad = el.type === 'checkbox' ? !el.checked
        : el.type === 'tel' ? el.value.replace(/\D/g, '').length < 10
        : !el.value.trim();
      el.closest('.field, .consent, .upload')?.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) toast('Заполните обязательные поля');
    return ok;
  };
  document.addEventListener('input', (e) => e.target.closest('.is-invalid')?.classList.remove('is-invalid'));
  document.addEventListener('change', (e) => e.target.closest('.is-invalid')?.classList.remove('is-invalid'));

  const formResets = new Map();
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.id === 'modalForm') {
      e.preventDefault();
      if (!validate(form)) return;
      closeModal();
      form.reset();
      toast(`Демо: заявка «${modalTitle}» уйдёт менеджеру в Telegram`);
      return;
    }
    if (!form.dataset.demo) return;
    e.preventDefault();
    if (!validate(form)) return;
    form.reset();
    $$('.thumbs', form).forEach((t) => { t.innerHTML = ''; });
    $$('[data-upload-label]', form).forEach((l) => { l.textContent = l.dataset.default; });
    formResets.get(form)?.();
    toast(form.dataset.demo);
  });

  /* ---------- Global clicks ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toast], [data-modal], [data-copy], [data-share], [data-close]');
    if (!t) return;
    if (t.tagName === 'A') e.preventDefault();
    if (t.dataset.close !== undefined) return closeModal();
    if (t.dataset.modal) return openModal(t.dataset);
    if (t.dataset.copy) return copyText(t.dataset.copy).then(() => toast(t.dataset.copied || 'Скопировано ✓'));
    if (t.dataset.share) return share(t.dataset.title || document.title, t.dataset.share);
    if (t.dataset.toast) toast(t.dataset.toast);
  });

  /* ---------- Просмотр картинки на весь экран: [data-lightbox="src"] (+ data-lightbox-full — оригинал для увеличения) ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lightbox]');
    if (!t) return;
    e.preventDefault();
    const full = t.dataset.lightboxFull || t.dataset.lightbox;
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', t.getAttribute('aria-label') || 'Просмотр');
    box.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Закрыть">✕</button>
      <img class="lightbox__img" src="${esc(t.dataset.lightbox)}" alt="${esc($('img', t)?.alt || '')}">
      <a class="btn btn--ghost btn--sm lightbox__full" href="${esc(full)}" target="_blank" rel="noopener">Открыть в полном размере</a>`;
    document.body.append(box);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => box.classList.add('is-open'));
    const close = () => {
      box.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => box.remove(), 250);
      t.focus({ preventScroll: true });
    };
    const onKey = (ev) => { if (ev.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    box.addEventListener('click', (ev) => { if (!ev.target.closest('.lightbox__full')) close(); });
    $('.lightbox__close', box).focus({ preventScroll: true });
  });

  /* ---------- Кнопка поддержки прячется над подвалом (там есть свои контакты) ---------- */
  const fab = $('.fab');
  new IntersectionObserver(([en]) => fab.classList.toggle('is-hidden', en.isIntersecting))
    .observe($('.footer'));

  /* ---------- Drawer ---------- */
  const burger = $('.burger'), drawer = $('#drawer');
  const setDrawer = (open) => {
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', open);
    burger.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
  };
  burger.addEventListener('click', () => setDrawer(drawer.hidden));
  $$('#drawer a').forEach((a) => a.addEventListener('click', () => setDrawer(false)));

  /* ---------- Language (демо) ---------- */
  $$('.lang__btn').forEach((b) => b.addEventListener('click', () => {
    $$('.lang__btn').forEach((x) => x.classList.toggle('is-active', x === b));
    if (b.dataset.lang === 'zh') toast('中文版本将在开发阶段上线 · Китайская версия появится на этапе разработки');
  }));

  /* ---------- Реферальные ссылки агентов (?ref=CODE) ---------- */
  const ref = new URLSearchParams(location.search).get('ref');
  if (ref && /^[\w-]{2,32}$/.test(ref)) {
    store.set('ulan_ref', ref);
    setTimeout(() => toast(`Вы пришли по ссылке агента ${ref}. Заявки будут закреплены за ним`), 700);
  }

  /* ---------- Раскрывающиеся блоки: плавно; внутри [data-accordion] открыт только один ---------- */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggleDetails = (d, open) => {
    d.classList.toggle('is-open', open);
    d._target = open;
    const from = d.getBoundingClientRect().height; // текущая высота, даже посреди анимации
    d._anim?.cancel();
    if (reduceMotion) { d.open = open; d._target = undefined; return; }
    d.open = true;
    const borders = d.offsetHeight - d.clientHeight;
    const to = open ? d.offsetHeight : $('summary', d).offsetHeight + borders;
    d.style.overflow = 'hidden';
    const anim = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: 320, easing: 'cubic-bezier(.2, .8, .2, 1)' });
    const body = $(':scope > :not(summary)', d);
    body?.animate({ opacity: open ? [0, 1] : [1, 0], transform: open ? ['translateY(-6px)', 'none'] : ['none', 'translateY(-6px)'] }, { duration: open ? 320 : 200, easing: 'ease' });
    d._anim = anim;
    anim.onfinish = () => { d.open = open; d.style.overflow = ''; d._anim = null; d._target = undefined; };
  };
  $$('details[open]').forEach((d) => d.classList.add('is-open'));
  // делегирование: работает и для блоков, которые скрипт отрисует позже (вопросы на странице услуги)
  document.addEventListener('click', (e) => {
    const sum = e.target.closest('details > summary');
    if (!sum) return;
    e.preventDefault();
    const d = sum.parentElement;
    const open = !(d._target ?? d.open);
    const group = d.closest('[data-accordion]');
    if (open && group) $$('details', group).forEach((o) => { if (o !== d && (o._target ?? o.open)) toggleDetails(o, false); });
    toggleDetails(d, open);
  });

  /* ---------- Выпадающие списки в стиле сайта ----------
     Настоящий <select> остаётся в форме (его выводит WordPress, из него уходят данные),
     поверх рисуется кнопка и список. Выбор синхронизируется в select и вызывает change. */
  let openDD = null;
  const closeDD = (focusBtn) => {
    if (!openDD) return;
    const { wrap, btn, panel, backdrop } = openDD;
    wrap.classList.remove('is-open', 'dd--up', 'dd--right');
    btn.setAttribute('aria-expanded', 'false');
    panel.remove(); backdrop.remove();
    document.body.classList.remove('dd-lock');
    if (focusBtn) btn.focus({ preventScroll: true });
    openDD = null;
  };
  $$('.select > select').forEach((sel) => {
    const wrap = sel.parentElement;
    const label = sel.closest('.field')?.querySelector('.field__label')?.textContent.replace('*', '').trim() || sel.getAttribute('aria-label') || '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = sel.className + ' dd__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    const sync = () => {
      const opt = sel.options[sel.selectedIndex];
      btn.innerHTML = `<span>${esc(opt ? opt.textContent : '')}</span>`;
      btn.setAttribute('aria-label', `${label ? label + ': ' : ''}${opt ? opt.textContent : ''}`);
    };
    sel.classList.add('dd-native');
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');
    wrap.insertBefore(btn, sel); // кнопка первой — клик по подписи поля открывает список
    sel.addEventListener('change', sync);
    sel.form?.addEventListener('reset', () => requestAnimationFrame(sync));
    sync();

    const open = () => {
      closeDD();
      const panel = document.createElement('div');
      panel.className = 'dd__panel';
      panel.setAttribute('role', 'listbox');
      if (label) panel.setAttribute('aria-label', label);
      let html = label ? `<div class="dd__head" aria-hidden="true">${esc(label)}</div>` : '';
      [...sel.children].forEach((node) => {
        const opts = node.tagName === 'OPTGROUP' ? [...node.children] : [node];
        if (node.tagName === 'OPTGROUP') html += `<div class="dd__group" role="presentation">${esc(node.label)}</div>`;
        opts.forEach((o) => { html += `<button type="button" class="dd__opt" role="option" data-i="${o.index}" aria-selected="${o.selected}">${esc(o.textContent)}</button>`; });
      });
      panel.innerHTML = html;
      const backdrop = document.createElement('div');
      backdrop.className = 'dd__backdrop';
      wrap.append(backdrop, panel); // в одном слое со списком — так работает и внутри окна заявки
      wrap.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      openDD = { wrap, btn, panel, backdrop };
      if (matchMedia('(max-width: 639px)').matches) document.body.classList.add('dd-lock');
      else {
        const r = btn.getBoundingClientRect(), h = panel.offsetHeight;
        if (r.bottom + h + 12 > innerHeight && r.top > h + 12) wrap.classList.add('dd--up');
        if (r.left + panel.offsetWidth > document.documentElement.clientWidth - 8) wrap.classList.add('dd--right');
      }
      const cur = $('[aria-selected="true"]', panel) || $('.dd__opt', panel);
      cur.focus({ preventScroll: true });
      cur.scrollIntoView({ block: 'nearest' });

      panel.addEventListener('click', (e) => {
        const o = e.target.closest('.dd__opt');
        if (!o) return;
        e.preventDefault();
        sel.selectedIndex = +o.dataset.i;
        sel.dispatchEvent(new Event('input', { bubbles: true }));
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        closeDD(true);
      });
      panel.addEventListener('keydown', (e) => {
        const all = $$('.dd__opt', panel), i = all.indexOf(document.activeElement);
        const go = (k) => { e.preventDefault(); all[Math.max(0, Math.min(all.length - 1, k))].focus(); };
        if (e.key === 'ArrowDown') go(i + 1);
        else if (e.key === 'ArrowUp') go(i - 1);
        else if (e.key === 'Home') go(0);
        else if (e.key === 'End') go(all.length - 1);
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeDD(true); }
        else if (e.key === 'Tab') closeDD();
      });
      // preventDefault: иначе клик внутри <label> снова «нажмёт» кнопку и откроет список
      backdrop.addEventListener('click', (e) => { e.preventDefault(); closeDD(true); });
    };
    btn.addEventListener('click', (e) => { e.preventDefault(); openDD?.wrap === wrap ? closeDD(true) : open(); });
    btn.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); open(); }
    });
  });
  document.addEventListener('pointerdown', (e) => { if (openDD && !openDD.wrap.contains(e.target) && e.target !== openDD.backdrop) closeDD(); });
  addEventListener('resize', () => closeDD());

  /* ---------- Tabs (data-tabs > data-tab / data-panel), открытие по #hash ---------- */
  $$('[data-tabs]').forEach((scope) => {
    const own = (el) => el.closest('[data-tabs]') === scope;
    const btns = $$('[data-tab]', scope).filter(own);
    const panels = $$('[data-panel]', scope).filter(own);
    const show = (id, remember) => {
      btns.forEach((b) => { const on = b.dataset.tab === id; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
      panels.forEach((p) => { p.hidden = p.dataset.panel !== id; });
      if (remember) history.replaceState(null, '', '#' + id);
    };
    btns.forEach((b) => b.addEventListener('click', () => show(b.dataset.tab, true)));
    const h = location.hash.slice(1);
    if (btns.some((b) => b.dataset.tab === h)) show(h);
  });

  /* ---------- Upload preview (фото до 10 шт. по 10 МБ) ---------- */
  document.addEventListener('change', (e) => {
    const inp = e.target;
    if (inp.type !== 'file') return;
    const wrap = inp.closest('.upload');
    const out = wrap?.nextElementSibling?.classList.contains('thumbs') ? wrap.nextElementSibling : null;
    const max = +inp.dataset.max || 10;
    const files = [...inp.files];
    const ok = files.slice(0, max).filter((f) => f.size <= 10 * 1024 * 1024);
    if (files.length > max) toast(`Можно приложить до ${max} файлов`);
    else if (ok.length < files.length) toast('Файлы больше 10 МБ пропущены');
    if (out) {
      out.innerHTML = '';
      ok.forEach((f) => {
        const t = document.createElement('span');
        t.className = 'thumb';
        if (/^image\/(jpeg|png|webp|gif)$/.test(f.type)) t.style.backgroundImage = `url("${URL.createObjectURL(f)}")`;
        else t.textContent = f.name.split('.').pop().toUpperCase();
        out.appendChild(t);
      });
    }
    const label = wrap?.querySelector('[data-upload-label]');
    if (label) label.textContent = ok.length ? `Выбрано файлов: ${ok.length}` : label.dataset.default;
  });

  /* ---------- Tip of the day ---------- */
  const tipEl = $('#tipText');
  if (tipEl) {
    const tips = [
      'Плотность от 100 кг/м³ — считаем по весу, меньше — по объёму',
      'Пишите маркировку (唛头) на каждой коробке',
      'От 7 т или 30 м³ — доставка до двери по Москве бесплатно*',
      'Без доп. страховки компенсация при утере — $3/кг',
      'Быстрая доставка 快陆 — 15–25 дней'
    ];
    let i = 0;
    setInterval(() => {
      tipEl.classList.add('is-out');
      setTimeout(() => { i = (i + 1) % tips.length; tipEl.textContent = tips[i]; tipEl.classList.remove('is-out'); }, 300);
    }, 4500);
  }

  /* ==========================================================
     Калькулятор Карго (логика из ТЗ заказчика)
     ========================================================== */
  // Авиадоставка: фиксированная ставка и расписание рейсов вносятся вручную в админке. Здесь демо-значения.
  const AIR_RATE = 9;
  const FLIGHTS = {
    'Пекин → Москва': ['2026-11-05', '2026-11-12', '2026-11-19', '2026-11-26', '2026-12-03', '2026-12-10'],
    'Москва → Пекин': ['2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28', '2026-12-05', '2026-12-12']
  };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = (route) => FLIGHTS[route].map((d) => new Date(d + 'T00:00:00')).filter((d) => d >= today);
  const fmtDay = (d) => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const nextFlight = (route) => { const d = upcoming(route)[0]; return d && fmtDay(d); };

  const flightsEl = $('#flightsList');
  if (flightsEl) {
    flightsEl.innerHTML = Object.keys(FLIGHTS).map((route) => {
      const list = upcoming(route).slice(0, 5);
      return `<div class="flights__route">
  <b class="flights__title">${route}</b>
  ${list.length ? `<ul class="flights__list">${list.map((d, i) => `<li${i ? '' : ' class="is-next"'}><span>${fmtDay(d)}</span><small>${d.toLocaleDateString('ru-RU', { weekday: 'short' })}${i ? '' : ' · ближайший'}</small></li>`).join('')}</ul>`
    : '<p class="muted small">Даты рейсов уточняйте у менеджера</p>'}
</div>`;
    }).join('');
  }

  const cargo = $('#cargoForm');
  if (cargo) {
    // Приложение 1: базовые цены для категории A (плотность ≥ 100)
    const TABLE_A = [[1000, 1], [800, 1.1], [600, 1.2], [500, 1.3], [400, 1.4], [300, 1.5], [250, 1.6], [200, 1.7],
                     [190, 1.8], [180, 1.9], [170, 2], [160, 2.1], [150, 2.2], [140, 2.3], [130, 2.4], [120, 2.5], [110, 2.6]];
    const rateA = (d) => { for (const [min, r] of TABLE_A) if (d > min) return r; return 2.7; };
    const KG_ADD = { A: 0, B: 0.1, V: 0.4, G: 0.5 };
    const M3_RATE = { A: 280, B: 290, V: 320, G: 330 };

    const calculate = () => {
      const fd = new FormData(cargo);
      const w = num(fd.get('weight')), v = num(fd.get('volume'));
      const cat = fd.get('category'), speed = fd.get('speed');
      const [destType, destName] = String(fd.get('destination')).split('|');
      const value = num(fd.get('cargoValue'));
      const alerts = [];

      if (cat === 'special') return { error: 'Свяжитесь с менеджером для расчёта специальных грузов (медицина, косметика, ювелирка, HDD, коммутаторы).' };

      // Авиа: фиксированная ставка за кг, без плотности и надбавок за категорию
      if (speed === 'air') {
        if (!w) return { error: 'Введите вес груза.' };
        const next = nextFlight('Пекин → Москва');
        alerts.push({ t: 'info', m: 'Авиа — для срочных документов, образцов и небольших грузов.' + (next ? ` Ближайший рейс Пекин → Москва: ${next}.` : '') });
        if (destType === 'region') alerts.push({ t: 'warn', m: `Авиарейс прилетает в Москву. Доставку до г. ${destName} уточнит менеджер.` });
        let ins = 0;
        if (fd.get('insurance') === 'on' && value > 0) {
          const perKg = value / w;
          const pct = perKg < 20 ? 0.01 : perKg <= 30 ? 0.02 : 0.03;
          ins = value * pct;
          alerts.push({ t: 'info', m: `Страховка ${pct * 100}% от стоимости груза. Максимальная выплата — $50/кг.` });
        }
        const ship = w * AIR_RATE;
        return { ship, ins, total: ship + ins, method: `авиа · фиксированная ставка $${AIR_RATE.toFixed(2)}/кг (демо — задаётся в админке)`, alerts, kind: 'Авиа' };
      }
      if (!w || !v) return { error: 'Введите вес и объём груза.' };

      const density = w / v;
      let ship, method;
      if (density >= 100) {
        const rate = rateA(density) + KG_ADD[cat];
        ship = w * rate;
        method = `по весу · плотность ${Math.round(density)} кг/м³ · $${rate.toFixed(2)}/кг`;
      } else {
        ship = v * M3_RATE[cat];
        method = `по объёму · плотность ${Math.round(density)} кг/м³ · $${M3_RATE[cat]}/м³`;
      }
      if (speed === 'express') ship += w * 0.2;

      if (destType === 'region') {
        if (cat === 'V' || cat === 'G') return { error: 'Доставка в регион доступна только для категорий А и Б.' };
        if (w < 5000) return { error: 'Минимальный вес для доставки в регион — 5000 кг.' };
        ship += w * 0.2;
        alerts.push({ t: 'warn', m: `Выдача груза на складе в г. ${destName}. Доставка по адресу оплачивается получателем через местную ТК.` });
      } else if (w >= 7000 || v >= 30) {
        alerts.push({ t: 'ok', m: 'Бесплатная доставка до двери включена (адрес в пределах 50 км от ТЯК «Южные Ворота» / 19-й км МКАД).' });
      } else {
        alerts.push({ t: 'warn', m: 'Груз менее 7 т или 30 м³. Доставка от ТЯК «Южные Ворота» до адреса оплачивается получателем через местную ТК.' });
      }

      let ins = 0;
      if (fd.get('insurance') === 'on' && value > 0) {
        const perKg = value / w;
        const pct = perKg < 20 ? 0.01 : perKg <= 30 ? 0.02 : 0.03;
        ins = value * pct;
        alerts.push({ t: 'info', m: `Страховка ${pct * 100}% от стоимости груза. Максимальная выплата — $50/кг.` });
      } else {
        alerts.push({ t: 'info', m: 'Без доп. страховки действует обязательное страхование: компенсация при утере — $3/кг.' });
      }
      return { ship, ins, total: ship + ins, method, alerts };
    };

    const render = () => {
      const r = calculate();
      $('#cargoResult').classList.toggle('is-error', !!r.error);
      $('#cargoSend').dataset.sub = r.error ? '' : `Предварительный расчёт ${r.kind || 'Карго'}: ${usd(r.total)} (${r.method})`;
      $('#cargoSend').dataset.modal = r.kind === 'Авиа' ? 'Расчёт Авиа' : 'Расчёт Карго';
      // для авиа объём не нужен — поле остаётся, но необязательное
      $('#cargoForm [name=volume]').closest('.field').classList.toggle('is-optional', new FormData(cargo).get('speed') === 'air');
      if (r.error) {
        ['#rShip', '#rIns', '#rTotal'].forEach((s) => { $(s).textContent = '—'; });
        $('#rMeta').textContent = '';
        $('#rAlerts').innerHTML = `<li class="alert alert--err">${r.error}</li>`;
        return;
      }
      $('#rShip').textContent = usd(r.ship);
      $('#rIns').textContent = usd(r.ins);
      $('#rTotal').textContent = usd(r.total);
      $('#rMeta').textContent = 'Расчёт ' + r.method;
      $('#rAlerts').innerHTML = r.alerts.map((a) => `<li class="alert alert--${a.t}">${a.m}</li>`).join('');
    };
    cargo.addEventListener('input', render);
    cargo.addEventListener('change', render);

    $('#insToggle').addEventListener('change', (e) => { $('#insValue').hidden = !e.target.checked; });

    // Помощник объёма
    const dims = () => { const g = (k) => num($(`[data-dim="${k}"]`).value); return g('l') * g('w') * g('h') / 1e6 * (g('n') || 1); };
    $$('[data-dim]').forEach((i) => i.addEventListener('input', () => {
      const v = dims(); $('#volumeOut').textContent = v ? `≈ ${v.toFixed(3)} м³` : '';
    }));
    $('#applyVolume').addEventListener('click', () => {
      const v = dims(); if (!v) return toast('Введите размеры коробки');
      cargo.volume.value = v.toFixed(3); render(); toast('Объём подставлен');
    });
    render();
  }

  /* ==========================================================
     Калькулятор «Белая» (официальное оформление до СВХ Москва)
     ========================================================== */
  const white = $('#whiteForm');
  if (white) {
    // Курсы задаются в админке (в «Полном» пакете — автоматически по ЦБ РФ). Здесь демо-значения.
    const FX = { USD: 1, CNY: 7.1, RUB: 92 };
    const SYM = { USD: '$', CNY: '¥', RUB: '₽' };
    const FIXED = [['Подготовка экспортных документов', 110], ['Операционная работа', 200], ['Подача экспортной декларации', 100]];
    const BROKER = 250;
    const deliveryRate = (d) => d <= 167 ? 1.85 : d <= 300 ? 1.70 : d <= 500 ? 1.55 : d <= 800 ? 1.45 : d <= 1000 ? 1.30 : 1.20;
    const r2 = (v) => Math.round(v * 100) / 100;
    const row = (label, value, cls = '') => `<div class="result__row ${cls}"><span>${label}</span><b>${value}</b></div>`;

    const renderWhite = () => {
      const fd = new FormData(white);
      const cur = fd.get('currency');
      const raw = num(fd.get('price')), w = num(fd.get('weight')), v = num(fd.get('volume'));
      const box = $('#whiteResult');
      if (!raw || !w || !v) {
        box.classList.add('is-error');
        box.innerHTML = '<ul class="alerts" style="margin:0"><li class="alert alert--err">Введите стоимость товара, вес и объём — все значения должны быть больше нуля.</li></ul>';
        $('#whiteSend').dataset.sub = '';
        return;
      }
      box.classList.remove('is-error');

      const price = r2(raw / FX[cur]);
      const vat = r2(price * 0.13);
      const withVat = r2(price + vat);
      const bank = r2(withVat * 0.025);
      const buyout = r2(withVat + bank);

      const d = w / v;
      const chargeable = d < 167 ? 167 * v : w;
      const rate = deliveryRate(d);
      const delivery = r2(chargeable * rate);
      const block2 = r2(FIXED.reduce((s, [, x]) => s + x, 0) + delivery);
      const total = r2(buyout + block2 + BROKER);

      const fx = cur === 'USD' ? '' : `<p class="result__fx">Стоимость ${raw.toLocaleString('ru-RU')} ${SYM[cur]} пересчитана в USD по курсу ${FX[cur]} (курс задаётся в админке, в рабочей версии — по ЦБ РФ).</p>`;
      box.innerHTML = `
        <div class="rblock">
          <div class="rblock__title"><b>1</b>Выкуп — ВТБ Шанхай</div>
          ${row('Закупочная цена', usd(price))}
          ${row('НДС 13% за экспорт', usd(vat))}
          ${row('Стоимость выкупа с НДС', usd(withVat))}
          ${row('Комиссия банка 2,5%', usd(bank))}
          ${row('Итого выкуп', usd(buyout), 'result__row--sum')}
        </div>
        <div class="rblock">
          <div class="rblock__title"><b>2</b>Экспорт и доставка</div>
          ${FIXED.map(([l, x]) => row(l, usd(x))).join('')}
          ${row(`Доставка до СВХ Москва · ${Math.round(d)} кг/м³${d < 167 ? `, расчётный вес ${Math.round(chargeable)} кг` : ''} · $${rate.toFixed(2)}/кг`, usd(delivery))}
          ${row('Расходы СВХ', 'по факту', 'result__row--fact')}
          ${row('Доставка по РФ до склада получателя', 'по факту', 'result__row--fact')}
          ${row('Итого блок 2', usd(block2), 'result__row--sum')}
        </div>
        <div class="rblock">
          <div class="rblock__title"><b>3</b>Таможенное оформление</div>
          ${row('Услуги брокера', usd(BROKER))}
          ${row('Таможенная пошлина', 'по факту', 'result__row--fact')}
          ${row('НДС 22%', 'по факту', 'result__row--fact')}
          ${row('Таможенный сбор', 'по факту', 'result__row--fact')}
        </div>
        <div class="result__total result__total--stack"><span>Предварительный итог</span><strong>${usd(total)}</strong></div>
        ${fx}`;
      const name = String(fd.get('product') || '').trim();
      $('#whiteSend').dataset.sub = `Расчёт «Белая»${name ? ` (${name})` : ''}: ${usd(total)}`;
    };
    white.addEventListener('input', renderWhite);
    white.addEventListener('change', renderWhite);
    white.addEventListener('submit', (e) => { e.preventDefault(); renderWhite(); $('#whiteResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    renderWhite();
  }

  /* ==========================================================
     Выкуп: розница / опт, маркировка, список товаров
     ========================================================== */
  const clientSeg = $('#clientSeg');
  if (clientSeg) {
    const apply = () => {
      const c = new FormData(clientSeg).get('client');
      $$('[data-client]').forEach((el) => { el.hidden = el.dataset.client !== c; });
      $$('input[name="clientType"]').forEach((i) => { i.value = c; });
    };
    clientSeg.addEventListener('change', apply);
    apply();
  }

  const markForm = $('#markForm');
  if (markForm) {
    // Склады (в WordPress — из админки). Данные заказчика от 02.11.
    const WH = {
      YW: { name: '骑兵081中俄物流义乌仓', addr: '浙江金华义乌市后宅街道后宅街道神舟路342号(同心圆日用品产业园南门)12号楼1层', who: '邱希', tel: '18511127787' },
      FS: { addr: '广东省佛山市南海区里水镇宏岗工业大道南4号A座4号之一', who: '小彭', tel: '18125719345' }
    };
    markForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(markForm)) return;
      const fd = new FormData(markForm);
      const phone = String(fd.get('phone')).replace(/\D/g, '');
      const wh = fd.get('wh');
      const code = `${wh}-${phone.slice(-4)}-${String(Math.floor(Math.random() * 900) + 100)}`;
      $('#markCode').textContent = code;
      const w = WH[wh];
      $('#markText').textContent = [
        w.name && `仓库：${w.name}`,
        `收货地址：${w.addr}`,
        `收货人：${w.who}`,
        `联系电话：${w.tel}`,
        `唛头：${code}`,
        '（请在每个箱子上写清楚唛头）'
      ].filter(Boolean).join('\n');
      store.set('ulan_mark', code);
      store.set('ulan_phone', String(fd.get('phone')));
      const box = $('#marking');
      box.hidden = false;
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    $('#copyBtn').addEventListener('click', () => copyText($('#markText').textContent).then(() => toast('Скопировано ✓ Отправьте текст поставщику')));
  }

  // Список товаров с кнопкой «+ Добавить товар»: <div data-items="idШаблона"> + кнопка [data-add-item] в той же форме
  $$('[data-items]').forEach((items) => {
    const tpl = document.getElementById(items.dataset.items);
    const form = items.closest('form');
    const renumber = () => {
      const all = $$('.item', items);
      all.forEach((it, i) => { $('.item__num', it).textContent = i + 1; $('.item__del', it).hidden = all.length === 1; });
    };
    const add = () => { items.appendChild(tpl.content.cloneNode(true)); renumber(); };
    $('[data-add-item]', form).addEventListener('click', () => {
      if ($$('.item', items).length >= 20) return toast('Не более 20 товаров в одной заявке');
      add();
      $$('.item', items).at(-1).querySelector('input').focus();
    });
    items.addEventListener('click', (e) => {
      const del = e.target.closest('.item__del');
      if (del) { del.closest('.item').remove(); renumber(); }
    });
    formResets.set(form, () => { items.innerHTML = ''; add(); });
    add();
  });

  /* ==========================================================
     Витрина товаров (в WordPress — тип записи «Товар»)
     ========================================================== */
  // 4 категории от заказчика; цены и характеристики — демо
  const CATS = { smarthome: 'Умный дом и мебель', energy: 'Энергия и зарядка', outdoor: 'Активный отдых', auto: 'Авто и транспорт' };
  const PRODUCTS = [
    { id: 1, name: 'Умная прикроватная тумбочка', cat: 'smarthome', icon: '🛏️', h: 190, retail: 18900, opt: 11500, moq: 10, tags: ['hot'],
      desc: 'Тумбочка с беспроводной зарядкой, подсветкой и датчиком движения. Ящик с доводчиком, управление касанием.',
      specs: [['Зарядка', 'Qi 15 Вт + USB-C'], ['Подсветка', 'LED, 3 режима'], ['Материал', 'МДФ, металл'], ['Размер', '50 × 40 × 55 см']] },
    { id: 2, name: 'Умный унитаз с подогревом', cat: 'smarthome', icon: '🚽', h: 200, retail: 64900, opt: 42000, moq: 5, tags: ['hot', 'deal'],
      desc: 'Подогрев сиденья и воды, биде, сушка, автоматическая крышка и смыв. Пульт и сенсорная панель.',
      specs: [['Питание', '220 В'], ['Функции', 'биде, сушка, автосмыв'], ['Управление', 'пульт, сенсор'], ['Сертификат', 'ЕАС по запросу']] },
    { id: 3, name: 'Умный сейф с отпечатком', cat: 'smarthome', icon: '🔐', h: 260, retail: 15900, opt: 9800, moq: 10, tags: [],
      desc: 'Открытие по отпечатку пальца, коду или ключу. Уведомления в приложении о попытках взлома.',
      specs: [['Замок', 'отпечаток, код, ключ'], ['Сталь', '3 мм'], ['Объём', '30 л'], ['Приложение', 'Wi-Fi']] },
    { id: 4, name: 'Портативная зарядная станция 2000 Вт', cat: 'energy', icon: '🔋', h: 95, retail: 79900, opt: 58000, moq: 5, tags: ['hot'],
      desc: 'Питание для дачи, кемпинга и работы без сети. Розетки 220 В, USB, автомобильный выход, зарядка от солнечных панелей.',
      specs: [['Ёмкость', '2048 Вт·ч, LiFePO4'], ['Мощность', '2000 Вт'], ['Выходы', '220 В ×4, USB ×6'], ['Вес', '22 кг']] },
    { id: 5, name: 'Солнечная панель складная 200 Вт', cat: 'energy', icon: '☀️', h: 50, retail: 21900, opt: 14500, moq: 10, tags: ['deal'],
      desc: 'Складная панель для зарядных станций. Монокристалл, защита от брызг, подставка в комплекте.',
      specs: [['Мощность', '200 Вт'], ['Тип', 'монокристалл'], ['Защита', 'IP67'], ['Вес', '7,5 кг']] },
    { id: 6, name: 'Дизельный генератор 6 кВт', cat: 'energy', icon: '⚡', h: 30, retail: 119000, opt: 89000, moq: 2, tags: [],
      desc: 'Генератор в шумозащитном кожухе для дома и стройки. Электростарт, автоматика запуска по запросу.',
      specs: [['Мощность', '6 кВт'], ['Фазы', '1 / 3'], ['Запуск', 'электростарт'], ['Бак', '15 л']] },
    { id: 7, name: 'Палатка кемпинговая 4-местная', cat: 'outdoor', icon: '⛺', h: 140, retail: 12900, opt: 7900, moq: 20, tags: ['hot'],
      desc: 'Быстросборная палатка с тамбуром и москитными сетками. Водостойкость 3000 мм.',
      specs: [['Мест', '4'], ['Водостойкость', '3000 мм'], ['Сборка', '1 минута'], ['Вес', '6,8 кг']] },
    { id: 8, name: 'Ящик для инструментов уличный', cat: 'outdoor', icon: '🧰', h: 10, retail: 6900, opt: 4200, moq: 30, tags: ['deal'],
      desc: 'Ударопрочный ящик для багажника, дачи и пикапа. Замок, уплотнитель, крепления.',
      specs: [['Материал', 'PP, ударопрочный'], ['Объём', '120 л'], ['Защита', 'от влаги и пыли'], ['Замок', 'есть']] },
    { id: 9, name: 'Зарядная станция для электромобиля 22 кВт', cat: 'auto', icon: '🔌', h: 165, retail: 54900, opt: 38000, moq: 5, tags: ['hot'],
      desc: 'Настенная зарядка для дома и бизнеса. Разъём Type 2 или GB/T, управление из приложения.',
      specs: [['Мощность', '7 / 11 / 22 кВт'], ['Разъём', 'Type 2, GB/T'], ['Защита', 'IP55'], ['Управление', 'приложение, RFID']] },
    { id: 10, name: 'Электросамокат 500 Вт', cat: 'auto', icon: '🛴', h: 280, retail: 34900, opt: 23500, moq: 10, tags: ['deal'],
      desc: 'Складной самокат с запасом хода до 45 км. Двойные тормоза, подвеска, приложение.',
      specs: [['Мотор', '500 Вт'], ['Запас хода', 'до 45 км'], ['Скорость', 'до 25 км/ч'], ['Колёса', '10"']] }
  ];
  const TAG = { hot: ['Хит продаж', 'lbl--hot'], deal: ['Выгодно', 'lbl--deal'] };
  const labels = (p) => p.tags.length ? `<div class="labels">${p.tags.map((t) => `<span class="lbl ${TAG[t][1]}">${TAG[t][0]}</span>`).join('')}</div>` : '';
  const requestAttrs = (p) => `data-modal="${esc(p.name)}" data-eyebrow="Запрос товара" data-sub="Розница ${rub(p.retail)} · опт ${rub(p.opt)} от ${p.moq} шт." data-placeholder="Количество, цвет, размер, город доставки"`;
  // Telegram-группа с товарами (заказчик пришлёт ссылку; в WordPress — настройка в админке, у товара можно указать ссылку на свой пост)
  const PRODUCTS_TG = TG;
  const tgIco = `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL.tg}</svg>`;
  const tgLink = (p) => p.tg || PRODUCTS_TG;
  const productCard = (p) => `
<article class="pcard" style="--h:${p.h}">
  <div class="pcard__media">
    <a href="product.html?id=${p.id}" class="pcard__img" aria-label="${esc(p.name)}"><span aria-hidden="true">${p.icon}</span>${labels(p)}</a>
    <a href="${tgLink(p)}" class="pcard__tg" target="_blank" rel="noopener" aria-label="${esc(p.name)} — смотреть в Telegram" title="Смотреть в Telegram">${tgIco}</a>
  </div>
  <div class="pcard__body">
    <span class="pcard__cat">${CATS[p.cat]}</span>
    <h3 class="pcard__name"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
    <span class="pcard__price">${rub(p.retail)}</span>
    <span class="pcard__opt">Опт: <b>${rub(p.opt)}</b> от ${p.moq} шт.</span>
    <button type="button" class="btn btn--ghost btn--block" ${requestAttrs(p)}>Запросить</button>
  </div>
</article>`;

  const CAT_ICO = { smarthome: '🏠', energy: '🔋', outdoor: '⛺', auto: '🚗' };
  $$('[data-product-cats]').forEach((el) => {
    el.innerHTML = Object.entries(CATS).map(([k, l]) => `<a class="fchip" href="products.html?cat=${k}"><span aria-hidden="true">${CAT_ICO[k]}</span> ${l}</a>`).join('');
  });

  $$('[data-products="popular"]').forEach((el) => {
    el.innerHTML = PRODUCTS.filter((p) => p.tags.includes('hot')).map(productCard).join('');
  });

  const grid = $('#productGrid');
  if (grid) {
    let filter = new URLSearchParams(location.search).get('cat') || 'all';
    let q = '';
    const chips = $('#productFilters');
    chips.innerHTML = [['all', 'Все'], ['hot', 'Хиты продаж'], ['deal', 'Выгодно'], ...Object.entries(CATS)]
      .map(([k, l]) => `<button type="button" class="fchip${k === filter ? ' is-active' : ''}" data-f="${k}" aria-pressed="${k === filter}">${l}</button>`).join('');
    const draw = () => {
      const list = PRODUCTS.filter((p) => (filter === 'all' || p.tags.includes(filter) || p.cat === filter)
        && (p.name + ' ' + CATS[p.cat]).toLowerCase().includes(q));
      grid.innerHTML = list.map(productCard).join('');
      $('#productEmpty').hidden = list.length > 0;
      $('#productCount').textContent = `${list.length} ${plural(list.length, ['товар', 'товара', 'товаров'])}`;
    };
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('.fchip');
      if (!b) return;
      filter = b.dataset.f;
      $$('.fchip', chips).forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); });
      draw();
    });
    $('#productSearch').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); draw(); });
    draw();
  }

  const view = $('#productView');
  if (view) {
    const id = +new URLSearchParams(location.search).get('id');
    const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
    document.title = `${p.name} — Ulan Express`;
    $('#crumbName').textContent = p.name;
    const slides = [p.icon, '📦', '🏷️', '🔍'];
    view.innerHTML = `
<div class="gallery" style="--h:${p.h}">
  <div class="gallery__track" id="galTrack" tabindex="0" aria-label="Фотографии товара">
    ${slides.map((s, i) => `<div class="gallery__slide"><span aria-hidden="true">${s}</span><small>Фото ${i + 1} из ${slides.length}</small></div>`).join('')}
  </div>
  <div class="gallery__dots">${slides.map((_, i) => `<button type="button" aria-label="Фото ${i + 1}"${i ? '' : ' class="is-active"'}></button>`).join('')}</div>
</div>
<div class="pinfo">
  ${labels(p)}
  <span class="pcard__cat">${CATS[p.cat]}</span>
  <h1 class="h1 h1--sm">${esc(p.name)}</h1>
  <div class="prices">
    <div class="price"><span>Розница</span><strong>${rub(p.retail)}</strong><small>от 1 шт.</small></div>
    <div class="price price--opt"><span>Опт</span><strong>${rub(p.opt)}</strong><small>от ${p.moq} шт. (MOQ)</small></div>
  </div>
  <p class="note note--ok" style="margin:0">Цена включает международную доставку до Москвы. Доставка по РФ оплачивается отдельно.</p>
  <button type="button" class="btn btn--neon btn--block btn--lg" ${requestAttrs(p)}>Запросить / заказать</button>
  <a href="${tgLink(p)}" class="btn btn--tg btn--block" target="_blank" rel="noopener">${tgIco}Больше фото и товаров в Telegram</a>
  <p class="pdesc">${esc(p.desc)}</p>
  <dl class="specs">${p.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
</div>`;

    const track = $('#galTrack');
    const dots = $$('.gallery__dots button', view);
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    }, { passive: true });
    dots.forEach((d, i) => d.addEventListener('click', () => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })));

    const similar = PRODUCTS.filter((x) => x.id !== p.id).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4);
    $('#similar').innerHTML = similar.map(productCard).join('');
  }

  /* ==========================================================
     Услуги (в WordPress — тип записи «Услуга» с категориями).
     Тексты демонстрационные — заказчик пришлёт свои.
     ========================================================== */
  const SCATS = { customs: 'Таможня и документы', goods: 'Товары и логистика', business: 'Бизнес в Китае', trip: 'Поездка в Китай' };
  const SERVICES = [
    { id: 'white', name: 'Официальное таможен­ное оформление', cat: 'customs', icon: '🛃', h: 270, hot: true,
      short: '«Белая» таможня: выкуп, экспорт, брокер и документы',
      desc: 'Официальный ввоз товара с полным пакетом документов — для маркетплейсов, юрлиц и тех, кому нужны закрывающие документы. Выкупаем товар через ВТБ Шанхай, оформляем экспорт в Китае, доставляем до СВХ в Москве и проводим таможенное оформление через брокера.',
      includes: ['Выкуп товара через ВТБ Шанхай', 'Экспортная декларация и документы в Китае', 'Доставка до СВХ Москва', 'Таможенное оформление и услуги брокера', 'Помощь с сертификацией ЕАС и образцами на испытания'],
      steps: ['Присылаете товар, стоимость, вес и объём', 'Считаем предварительную стоимость', 'Выкупаем и оформляем экспорт', 'Растаможиваем и передаём груз'],
      price: 'брокер от $250', term: 'по расчёту', link: ['calc.html#white', 'Рассчитать в калькуляторе'],
      faq: [['Сколько стоит «белая» доставка?', 'Предварительную сумму покажет калькулятор во вкладке «Белая». Пошлина, НДС 22% и таможенный сбор оплачиваются по факту.'], ['Чем «белая» отличается от Карго?', 'В «белой» вы получаете официальные документы на товар — это нужно для маркетплейсов и бухгалтерии юрлица.']] },
    { id: 'eac', name: 'Серти­фикация ЕАС', cat: 'customs', icon: '📜', h: 45, hot: true,
      short: 'Сертификаты и декларации соответствия для продажи в РФ',
      desc: 'Для продажи многих товаров в России и на маркетплейсах нужен сертификат или декларация ЕАС. Определим, какой документ нужен вашему товару, и оформим его через аккредитованную лабораторию.',
      includes: ['Определение типа документа: сертификат или декларация', 'Подготовка пакета документов', 'Испытания в аккредитованной лаборатории', 'Регистрация документа в реестре'],
      steps: ['Присылаете описание товара', 'Определяем нужный документ', 'Готовим документы и испытания', 'Передаём готовый сертификат'],
      faq: [['Нужен ли сертификат для Wildberries и Ozon?', 'Для большинства категорий — да, маркетплейсы проверяют документы при загрузке товара.'], ['Где взять образцы для испытаний?', 'Отправим их из Китая сами — см. услугу «Образцы на испытания».']] },
    { id: 'samples', name: 'Образцы на испытания', cat: 'customs', icon: '🧪', h: 170, hot: true,
      short: 'Отправим образцы в лабораторию для сертификации ЕАС',
      desc: 'Для сертификата или декларации ЕАС товар проходит испытания в аккредитованной лаборатории, а для них нужны образцы. Соберём образцы у поставщика, отправим их из Китая в лабораторию и передадим протоколы испытаний для оформления документов и «белого» таможенного оформления.',
      includes: ['Определяем, какие и сколько образцов нужно', 'Получаем образцы от поставщика на складе в Иу или Фошане', 'Отправляем образцы в аккредитованную лабораторию', 'Передаём протоколы испытаний для оформления ЕАС'],
      steps: ['Присылаете описание товара', 'Определяем требования лаборатории', 'Отправляем образцы на испытания', 'Оформляем сертификат или декларацию'],
      faq: [['Зачем нужны образцы на испытания?', 'Без испытаний в аккредитованной лаборатории нельзя получить сертификат или декларацию ЕАС, а без них — официально ввезти и продавать многие товары.'], ['Сколько образцов нужно?', 'Зависит от товара и требований лаборатории — подскажем после описания товара.']] },
    { id: 'tnved', name: 'Подбор кода ТН ВЭД', cat: 'customs', icon: '🔢', h: 210, hot: true,
      short: 'Правильный код — без штрафов и задержек на таможне',
      desc: 'От кода ТН ВЭД зависят пошлина, НДС и список документов. Ошибка в коде — это доплаты, задержка груза на таможне и штрафы. Подберём код по описанию и фото товара и заранее скажем, какие документы понадобятся.',
      includes: ['Анализ товара по описанию, фото и материалу', 'Подбор кода ТН ВЭД', 'Расчёт ставки пошлины и НДС', 'Список нужных разрешительных документов'],
      steps: ['Присылаете описание и фото товара', 'Изучаем состав, материал и назначение', 'Подбираем код и считаем платежи', 'Отправляем заключение'],
      faq: [['Можно ли подобрать код только по ссылке на товар?', 'Да, если на странице есть описание и характеристики. Иногда уточняем материал или назначение.'], ['Нужен ли код для доставки Карго?', 'Для Карго код не нужен. Он нужен для «белой» доставки с таможенным оформлением.']] },
    { id: 'ved', name: 'ВЭД-консультация', cat: 'customs', icon: '🤝', h: 260,
      short: 'Консультация и сопровождение сделки с Китаем',
      desc: 'Поможем разобраться, как выгоднее завезти товар: Карго или «белая» доставка, какие документы нужны и сколько это стоит. Сопровождаем сделку от поиска поставщика до получения груза.',
      includes: ['Разбор вашей задачи и выбор схемы доставки', 'Расчёт полной стоимости товара с доставкой', 'Проверка документов поставщика', 'Сопровождение сделки'],
      steps: ['Рассказываете о задаче', 'Предлагаем схему и считаем', 'Сопровождаем сделку', 'Груз у вас'],
      faq: [['Работаете с начинающими?', 'Да. Объясним всё простыми словами и поможем с первой поставкой.']] },
    { id: 'fulfillment', name: 'Фулфилмент', cat: 'goods', icon: '🏬', h: 120, hot: true,
      short: 'Упаковка и маркировка для маркетплейсов в Китае и Москве',
      desc: 'Подготовим товар к продаже на маркетплейсах: переупакуем, промаркируем и отправим на склады Wildberries и Ozon. Работаем на складах в Китае и в Москве.',
      includes: ['Приёмка и пересчёт товара', 'Упаковка и маркировка по требованиям маркетплейсов', 'Этикетки и штрихкоды', 'Отгрузка на склады маркетплейсов'],
      steps: ['Присылаете требования маркетплейса', 'Принимаем товар', 'Упаковываем и маркируем', 'Отгружаем'],
      faq: [['Где удобнее делать маркировку — в Китае или в Москве?', 'В Китае обычно дешевле, в Москве — быстрее исправить ошибки. Подскажем под ваш товар.']] },
    { id: 'company', name: 'Компания в Китае', cat: 'business', icon: '🏢', h: 280, hot: true,
      short: 'Регистрация компании под ключ',
      desc: 'Зарегистрируем компанию в Китае: подберём форму, подготовим документы, поможем с юридическим адресом и банковским счётом.',
      includes: ['Выбор формы компании', 'Подготовка и подача документов', 'Юридический адрес', 'Помощь с открытием счёта'],
      steps: ['Консультация', 'Сбор документов', 'Регистрация', 'Передача документов'],
      faq: [['Нужно ли приезжать в Китай?', 'Зависит от формы компании и банка. Расскажем на консультации.']] },
    { id: 'rent', name: 'Аренда помещения', cat: 'business', icon: '🏪', h: 300,
      short: 'Магазин, офис или торговое помещение в Китае',
      desc: 'Подберём помещение под магазин, шоурум или офис, проверим договор и поможем договориться с арендодателем.',
      includes: ['Подбор вариантов', 'Просмотр и видеообзор', 'Проверка договора', 'Переговоры с арендодателем'],
      steps: ['Задача и бюджет', 'Подбор', 'Просмотр', 'Договор'], faq: [] },
    { id: 'visa', name: 'Рабочая виза', cat: 'business', icon: '🛂', h: 200,
      short: 'Оформление документов для работы в Китае',
      desc: 'Подскажем, какой тип визы нужен, подготовим приглашение и пакет документов.',
      includes: ['Выбор типа визы', 'Приглашение', 'Пакет документов', 'Консультация по срокам'],
      steps: ['Консультация', 'Документы', 'Подача', 'Виза'], faq: [] },
    { id: 'exchange', name: 'Обмен валюты', cat: 'business', icon: '💱', h: 90,
      short: 'Оплата поставщикам и пополнение WeChat / Alipay',
      desc: 'Поможем оплатить поставщику в юанях и пополнить WeChat Pay или Alipay.',
      includes: ['Оплата поставщику в юанях', 'Пополнение WeChat Pay / Alipay', 'Подтверждение платежа'],
      steps: ['Заявка', 'Курс и сумма', 'Оплата', 'Подтверждение'], faq: [] },
    { id: 'tickets', name: 'Авиабилеты и отели', cat: 'trip', icon: '✈️', h: 195, hot: false,
      short: 'Подберём перелёт и проживание',
      desc: 'Подберём удобный перелёт и гостиницу рядом с рынками и фабриками, которые вы планируете посетить.',
      includes: ['Подбор перелёта', 'Бронирование гостиницы', 'Трансфер из аэропорта'],
      steps: ['Даты и город', 'Варианты', 'Бронирование'], faq: [] },
    { id: 'sim', name: 'SIM и WeChat', cat: 'trip', icon: '📶', h: 100,
      short: 'Связь, интернет, WeChat и Alipay с первого дня',
      desc: 'Китайская SIM-карта, регистрация и верификация WeChat и Alipay, чтобы вы были на связи и могли платить с первого дня.',
      includes: ['Китайская SIM-карта', 'Регистрация WeChat', 'Настройка Alipay'],
      steps: ['Заявка', 'Подготовка', 'Выдача'], faq: [] },
    { id: 'translator', name: 'Переводчик', cat: 'trip', icon: '🗣️', h: 330,
      short: 'Переговоры с поставщиками и встреча в аэропорту',
      desc: 'Русскоговорящий переводчик для переговоров, поездок на фабрики и рынки. Встретим в аэропорту и сопроводим.',
      includes: ['Перевод на переговорах', 'Поездки на фабрики и рынки', 'Встреча в аэропорту'],
      steps: ['Даты и задачи', 'Подбор переводчика', 'Работа'], faq: [] },
    { id: 'tourism', name: 'Туризм', cat: 'trip', icon: '🏯', h: 15,
      short: 'Экскурсии и маршруты по Китаю',
      desc: 'Экскурсии и маршруты по Китаю: совместим деловую поездку с отдыхом.',
      includes: ['Маршрут под ваши даты', 'Экскурсии', 'Сопровождение'],
      steps: ['Пожелания', 'Маршрут', 'Поездка'], faq: [] },
    { id: 'medical', name: 'Медицина', cat: 'trip', icon: '🩺', h: 170,
      short: 'Сопровождение в клиниках Китая',
      desc: 'Подберём клинику, запишем на приём и сопроводим с переводчиком.',
      includes: ['Подбор клиники', 'Запись на приём', 'Сопровождение и перевод'],
      steps: ['Запрос', 'Подбор клиники', 'Приём'], faq: [] }
  ];
  // ­ — мягкий перенос в длинных названиях: на узких экранах слово переносится по слогам
  const plain = (s) => s.name.replace(/­/g, '');
  const serviceAttrs = (s) => `data-modal="${esc(plain(s))}" data-eyebrow="Заявка на услугу" data-placeholder="Коротко опишите задачу"`;
  const serviceCard = (s) => `
<a href="service.html?id=${s.id}" class="scard" style="--h:${s.h}">
  <span class="scard__ic" aria-hidden="true">${s.icon}</span>
  <span class="scard__cat">${SCATS[s.cat]}</span>
  <h3 class="scard__name">${esc(s.name)}</h3>
  <p class="scard__text">${esc(s.short)}</p>
  <span class="scard__more">Подробнее <span aria-hidden="true">→</span></span>
</a>`;

  // Блоки услуг на страницах: data-services="hot" | "all" | "customs,goods"
  $$('[data-services]').forEach((el) => {
    const f = el.dataset.services;
    const list = f === 'all' ? SERVICES : f === 'hot' ? SERVICES.filter((s) => s.hot) : SERVICES.filter((s) => f.split(',').includes(s.cat));
    el.innerHTML = list.map(serviceCard).join('');
  });

  const sgrid = $('#serviceGrid');
  if (sgrid) {
    let filter = new URLSearchParams(location.search).get('cat') || 'all';
    let q = '';
    const chips = $('#serviceFilters');
    chips.innerHTML = [['all', 'Все'], ...Object.entries(SCATS)]
      .map(([k, l]) => `<button type="button" class="fchip${k === filter ? ' is-active' : ''}" data-f="${k}" aria-pressed="${k === filter}">${l}</button>`).join('');
    const draw = () => {
      const list = SERVICES.filter((s) => (filter === 'all' || s.cat === filter)
        && (plain(s) + ' ' + s.short + ' ' + SCATS[s.cat]).toLowerCase().includes(q));
      sgrid.innerHTML = list.map(serviceCard).join('');
      $('#serviceEmpty').hidden = list.length > 0;
      $('#serviceCount').textContent = `${list.length} ${plural(list.length, ['услуга', 'услуги', 'услуг'])}`;
    };
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('.fchip');
      if (!b) return;
      filter = b.dataset.f;
      $$('.fchip', chips).forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); });
      draw();
    });
    $('#serviceSearch').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); draw(); });
    draw();
  }

  const sview = $('#serviceView');
  if (sview) {
    const id = new URLSearchParams(location.search).get('id');
    const s = SERVICES.find((x) => x.id === id) || SERVICES[0];
    document.title = `${plain(s)} — Ulan Express`;
    $('#crumbName').textContent = plain(s);
    sview.innerHTML = `
<div class="svc-hero" style="--h:${s.h}">
  <span class="svc-hero__ic" aria-hidden="true">${s.icon}</span>
  <span class="eyebrow">${SCATS[s.cat]}</span>
  <h1 class="h1 h1--sm">${esc(s.name)}</h1>
  <p class="lead">${esc(s.short)}</p>
  <div class="hero__cta">
    <button type="button" class="btn btn--neon" ${serviceAttrs(s)}>Оставить заявку</button>
    ${s.link ? `<a href="${s.link[0]}" class="btn btn--ghost">${s.link[1]}</a>` : ''}
    <a href="${TG}" target="_blank" rel="noopener" class="btn btn--ghost">Спросить в Telegram</a>
  </div>
</div>
<div class="svc-body">
  <div class="stack">
    <p class="pdesc">${esc(s.desc)}</p>
    <div class="cmp">
      <h2 class="h3">Что входит</h2>
      <ul>${s.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>
  </div>
  <div class="stack">
    <div class="cmp">
      <h2 class="h3">Как проходит</h2>
      <ol class="flow">${s.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
    </div>
    <div class="kv">
      <div><span>Срок</span><b>${esc(s.term || 'от 1 дня')}</b></div>
      <div><span>Стоимость</span><b>${esc(s.price || 'по запросу')}</b></div>
    </div>
  </div>
</div>
${s.faq.length ? `<div class="cats faq" data-accordion>
  <h2 class="h3">Частые вопросы</h2>
  ${s.faq.map(([q, a]) => `<details class="cat"><summary><span>${esc(q)}</span></summary><p>${esc(a)}</p></details>`).join('')}
</div>` : ''}`;
    $('#similarServices').innerHTML = SERVICES.filter((x) => x.id !== s.id)
      .sort((a, b) => (b.cat === s.cat) - (a.cat === s.cat)).slice(0, 6).map(serviceCard).join('');
    $('#serviceCta').dataset.modal = plain(s);
  }

  /* ==========================================================
     Мой заказ (демо: в WordPress — поиск по телефону + маркировке)
     ========================================================== */
  const lookup = $('#orderLookup');
  if (lookup) {
    const mark = store.get('ulan_mark'), phone = store.get('ulan_phone');
    if (mark) lookup.mark.value = mark;
    if (phone) lookup.phone.value = phone;
    lookup.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(lookup)) return;
      $('#orderMark').textContent = lookup.mark.value.trim().toUpperCase();
      const v = $('#orderView');
      v.hidden = false;
      v.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#trackForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('#trackInput');
      const val = inp.value.trim().toUpperCase();
      if (val.length < 6) { inp.closest('.field').classList.add('is-invalid'); return toast('Введите трек-номер полностью'); }
      $('#trackList').insertAdjacentHTML('beforeend', `<li>${esc(val)}<small class="wait">ждём на складе</small></li>`);
      inp.value = '';
      toast('Демо: команда получит уведомление 提醒收货 в Telegram');
    });
  }
})();
