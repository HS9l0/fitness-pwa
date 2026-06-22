const WEIGHTS = [];
for (let w = 0; w <= 200; w = parseFloat((w + 2.5).toFixed(1))) WEIGHTS.push(w);
const REPS = Array.from({ length: 200 }, (_, i) => i + 1);
const ITEM_H = 44;

export function showDrumPicker({ weight, reps, label, onConfirm }) {
  document.querySelector('.drum-sheet')?.remove();

  const wIdx = Math.max(0, WEIGHTS.findIndex(v => v === weight));
  const rIdx = reps > 0 ? Math.min(reps - 1, REPS.length - 1) : 0;

  const sheet = document.createElement('div');
  sheet.className = 'drum-sheet';
  sheet.innerHTML = `
    <div class="drum-backdrop"></div>
    <div class="drum-panel">
      <div class="drum-hdr">
        <button class="drum-cancel-btn">Cancel</button>
        <span class="drum-hdr-title">${label}</span>
        <button class="drum-done-btn">Done</button>
      </div>
      <div class="drum-body">
        <div class="drum-col">
          <div class="drum-scroll" id="dp-weight">
            ${WEIGHTS.map(v => `<div class="drum-item">${v}</div>`).join('')}
          </div>
        </div>
        <div class="drum-x">×</div>
        <div class="drum-col">
          <div class="drum-scroll" id="dp-reps">
            ${REPS.map(v => `<div class="drum-item">${v}</div>`).join('')}
          </div>
        </div>
        <div class="drum-band"></div>
        <div class="drum-fade"></div>
      </div>
      <div class="drum-lbl-row">
        <div class="drum-col-lbl">kg</div>
        <div class="drum-col-lbl">reps</div>
      </div>
    </div>
  `;
  document.body.appendChild(sheet);

  const wScroll = sheet.querySelector('#dp-weight');
  const rScroll = sheet.querySelector('#dp-reps');

  // Jump to initial values without animation
  wScroll.scrollTop = wIdx * ITEM_H;
  rScroll.scrollTop = rIdx * ITEM_H;

  function getVal(scrollEl, arr) {
    const idx = Math.round(scrollEl.scrollTop / ITEM_H);
    return arr[Math.max(0, Math.min(idx, arr.length - 1))];
  }

  function close() {
    sheet.classList.add('drum-leaving');
    setTimeout(() => sheet.remove(), 280);
  }

  sheet.querySelector('.drum-cancel-btn').addEventListener('click', close);
  sheet.querySelector('.drum-backdrop').addEventListener('click', close);
  sheet.querySelector('.drum-done-btn').addEventListener('click', () => {
    const w = getVal(wScroll, WEIGHTS);
    const r = getVal(rScroll, REPS);
    onConfirm(w, r);
    close();
  });
}
