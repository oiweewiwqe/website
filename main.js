(function () {
  var nav = document.querySelector(".tabs");
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      var on = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
      if (on && nav.scrollWidth > nav.clientWidth) {
        nav.scrollLeft = link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2;
      }
    });
  }

  function scrollToSection(section) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var header = document.querySelector(".site-header");
    var offset = header ? header.offsetHeight + 8 : 0;
    var target = section.getBoundingClientRect().top + window.pageYOffset - offset;
    if (reduce) {
      window.scrollTo(0, target);
      return;
    }
    var start = window.pageYOffset;
    var change = target - start;
    var duration = Math.min(1000, Math.max(520, Math.abs(change) * 0.4));
    var t0 = null;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / duration, 1);
      var ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      window.scrollTo(0, start + change * ease);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      event.preventDefault();
      scrollToSection(section);
      setActive(id);
      history.replaceState(null, "", "#" + id);
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
