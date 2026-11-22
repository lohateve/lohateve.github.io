/* 天母的優格｜首頁篩選：區域、總價、房數、車位、已售 */
(function () {
  "use strict";
  var form = document.getElementById("filter-panel");
  if (!form) return;
  var toggle = document.querySelector(".filter-toggle");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-listing]"));
  var empty = document.querySelector(".filter-empty");
  var result = document.querySelector("[data-filter-result]");
  var count = document.querySelector("[data-filter-count]");
  var showSold = document.getElementById("show-sold");

  function inRange(v, range) {
    if (!range) return true;
    var p = range.split("-");
    var lo = p[0] === "" ? -Infinity : Number(p[0]);
    var hi = p[1] === "" || p[1] === undefined ? Infinity : Number(p[1]);
    if (hi === Infinity) return v >= lo;
    return v >= lo && v <= hi;
  }

  function apply() {
    var area = form.area.value;
    var price = form.price.value;
    var rooms = form.rooms.value;
    var parking = form.parking.value;
    var soldOk = showSold ? showSold.checked : false;
    var shown = 0;
    cards.forEach(function (c) {
      var ok = true;
      if ((c.dataset.status || "sale") === "sold" && !soldOk) ok = false;
      if (ok && area && c.dataset.area !== area) ok = false;
      if (ok && !inRange(Number(c.dataset.price), price)) ok = false;
      if (ok && rooms) {
        var r = Number(c.dataset.rooms);
        ok = rooms === "4" ? r >= 4 : r === Number(rooms);
      }
      if (ok && parking) {
        if (!c.dataset.parking) ok = false;
        else ok = c.dataset.parking === parking;
      }
      c.classList.toggle("is-hidden", !ok);
      c.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) {
      empty.hidden = shown !== 0;
      empty.classList.toggle("is-visible", shown === 0);
    }
    if (result) result.textContent = "共 " + shown + " 間";
    if (count) count.textContent = shown + " 間";
    var active = area || price || rooms || parking || soldOk;
    form.classList.toggle("is-active", !!active);
    if (toggle) toggle.classList.toggle("is-active", !!active);
  }

  form.addEventListener("change", apply);
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  form.addEventListener("reset", function () {
    if (showSold) showSold.checked = false;
    setTimeout(apply, 0);
  });
  if (showSold) showSold.addEventListener("change", apply);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      form.classList.toggle("is-open", !open);
    });
  }
  apply();
})();
