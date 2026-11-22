/* 照片集燈箱：可左右切換、Esc 關閉 */
(function () {
  "use strict";
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-gallery]"));
  if (!items.length) return;

  var box = document.createElement("div");
  box.className = "lb";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "照片預覽");
  box.innerHTML =
    '<button type="button" class="lb-btn lb-close" aria-label="關閉">×</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="上一張">‹</button>' +
    '<img alt="">' +
    '<button type="button" class="lb-btn lb-next" aria-label="下一張">›</button>' +
    '<p class="lb-cap"></p>';
  document.body.appendChild(box);

  var img = box.querySelector("img");
  var cap = box.querySelector(".lb-cap");
  var i = 0;

  function srcOf(el) {
    if (el.tagName === "A") return el.getAttribute("href") || "";
    return el.currentSrc || el.src || "";
  }

  function altOf(el) {
    return el.getAttribute("data-caption") || (el.querySelector && el.querySelector("img") && el.querySelector("img").alt) || el.alt || "";
  }

  function show(index) {
    i = (index + items.length) % items.length;
    var el = items[i];
    img.src = srcOf(el);
    img.alt = altOf(el);
    cap.textContent = altOf(el);
  }

  function open(index) {
    show(index);
    box.classList.add("is-open");
    document.body.classList.add("lb-on");
  }

  function close() {
    box.classList.remove("is-open");
    document.body.classList.remove("lb-on");
    img.src = "";
  }

  items.forEach(function (el, idx) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      open(idx);
    });
  });

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function (e) {
    e.stopPropagation();
    show(i - 1);
  });
  box.querySelector(".lb-next").addEventListener("click", function (e) {
    e.stopPropagation();
    show(i + 1);
  });
  box.addEventListener("click", function (e) {
    if (e.target === box || e.target === img) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
})();
