(function () {
  const form = document.getElementById("form");
  const input = document.getElementById("colorInput");
  const status = document.getElementById("status");
  const paletteEl = document.getElementById("palette");

  function setStatus(msg) {
    status.textContent = msg;
  }
  function clear() {
    paletteEl.innerHTML = "";
  }

  function cssColorToHex(color) {
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = color;
      const v = ctx.fillStyle; 
      if (typeof v === "string" && v[0] === "#")
        return v.slice(1).toUpperCase();
    } catch (e) {}
    return null;
  }

  function renderSwatch(c) {
    const card = document.createElement("div");
    card.className = "card";
    const sw = document.createElement("div");
    sw.className = "swatch";
    sw.style.background = c.hex.value;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent =
      c.hex.value + (c.name && c.name.value ? " — " + c.name.value : "");
    card.appendChild(sw);
    card.appendChild(meta);
    return card;
  }

  async function getPalette(hex) {
    clear();
    setStatus("Loading palette…");
    const url = `https://www.thecolorapi.com/scheme?hex=${hex}&mode=analogic&count=5`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      const data = await res.json();
      if (
        !data.colors ||
        !Array.isArray(data.colors) ||
        data.colors.length === 0
      ) {
        setStatus("No palette returned");
        return;
      }
      setStatus("");
      data.colors.forEach((c) => paletteEl.appendChild(renderSwatch(c)));
    } catch (err) {
      setStatus("Error: " + err.message);
      console.error(err);
    }
  }

  //error handling and form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) {
      setStatus("Enter a color");
      return;
    }
    const hex = cssColorToHex(raw);
    if (!hex) {
      setStatus(
        'Invalid CSS color. Try a name or hex like "teal" or "#24b1e0".'
      );
      return;
    }
    getPalette(hex);
  });

  input.placeholder = "e.g. teal or #24b1e0";
})();
