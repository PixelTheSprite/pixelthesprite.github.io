// Photo carousel. Builds itself inside any element with a data-carousel attribute,
// using the photo list at the URL in its data-src attribute (assets/data/photos.json).
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    fetch(root.getAttribute('data-src'))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (photos) {
        if (photos.length) build(root, photos);
      })
      .catch(function (err) {
        console.error('Could not load the photo list:', err);
      });
  });

  function el(tag, attrs) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (name) { node.setAttribute(name, attrs[name]); });
    return node;
  }

  function build(root, photos) {
    var track = el('div', { 'class': 'carousel-track', tabindex: '0' });

    photos.forEach(function (photo, i) {
      var slide = el('figure', {
        'class': 'carousel-slide',
        role: 'group',
        'aria-roledescription': 'slide',
        'aria-label': (i + 1) + ' of ' + photos.length
      });
      var img = el('img', { src: 'assets/images/instagram/' + photo.image, alt: photo.alt || '', loading: 'lazy' });

      if (photo.link) {
        var link = el('a', { href: photo.link, target: '_blank', rel: 'noopener', title: 'View on Instagram' });
        link.appendChild(img);
        slide.appendChild(link);
      } else {
        slide.appendChild(img);
      }
      track.appendChild(slide);
    });

    root.appendChild(track);
    if (photos.length > 1) addControls(root, track, photos.length);
  }

  function addControls(root, track, count) {
    var prev = el('button', { type: 'button', 'class': 'carousel-btn carousel-prev', 'aria-label': 'Previous photo' });
    var next = el('button', { type: 'button', 'class': 'carousel-btn carousel-next', 'aria-label': 'Next photo' });
    prev.textContent = '‹';
    next.textContent = '›';

    var dotBox = el('div', { 'class': 'carousel-dots' });
    var dots = [];
    for (var i = 0; i < count; i++) {
      var dot = el('button', { type: 'button', 'class': 'carousel-dot', 'aria-label': 'Show photo ' + (i + 1) });
      dots.push(dot);
      dotBox.appendChild(dot);
    }
    root.appendChild(prev);
    root.appendChild(next);
    root.appendChild(dotBox);

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0;
    var timer = null;
    var stopped = reduceMotion; // autoplay stops for good once the visitor takes control

    function goTo(index) {
      current = (index + count) % count;
      track.scrollTo({ left: current * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    function markCurrent() {
      current = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === current ? 'true' : 'false'); });
    }

    function play() { if (!stopped && !timer) timer = setInterval(function () { goTo(current + 1); }, 5000); }
    function pause() { clearInterval(timer); timer = null; }
    function takeControl(index) { stopped = true; pause(); goTo(index); }

    prev.addEventListener('click', function () { takeControl(current - 1); });
    next.addEventListener('click', function () { takeControl(current + 1); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { takeControl(i); }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(markCurrent); });

    // Hold still while the visitor is looking at or interacting with it.
    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', play);
    track.addEventListener('touchstart', pause, { passive: true });

    markCurrent();
    play();
  }
})();
