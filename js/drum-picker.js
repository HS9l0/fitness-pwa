const WEIGHTS  = Array.from({ length: 201 }, (_, i) => i);
const KG_FRAC  = [0, 0.5];
const REPS     = Array.from({ length: 200 }, (_, i) => i + 1);
const ITEM_H   = 44;

export function showDrumPicker({ weight, reps, label, onConfirm }) {
  document.querySelector('.drum-sheet')?.remove();

  const wholeKg = Math.floor(weight);
  const fracKg  = (weight % 1 >= 0.25) ? 0.5 : 0;
  const wIdx    = Math.max(0, Math.min(wholeKg, WEIGHTS.length - 1));
  const fIdx    = fracKg === 0.5 ? 1 : 0;
  const rIdx    = reps > 0 ? Math.min(reps - 1, REPS.length - 1) : 0;

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
        <div class="drum-col drum-col-frac">
          <div class="drum-scroll" id="dp-frac">
            ${KG_FRAC.map(v => `<div class="drum-item">.${v === 0 ? '0' : '5'}</div>`).join('')}
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
        <div class="drum-col-lbl drum-col-lbl-frac"></div>
        <div class="drum-x drum-x-phantom"></div>
        <div class="drum-col-lbl">reps</div>
      </div>
    </div>
  `;
  document.body.appendChild(sheet);

  const wScroll = sheet.querySelector('#dp-weight');
  const fScroll = sheet.querySelector('#dp-frac');
  const rScroll = sheet.querySelector('#dp-reps');

  wScroll.scrollTop = wIdx * ITEM_H;
  fScroll.scrollTop = fIdx * ITEM_H;
  rScroll.scrollTop = rIdx * ITEM_H;

  function getIdx(scrollEl, len) {
    return Math.max(0, Math.min(Math.round(scrollEl.scrollTop / ITEM_H), len - 1));
  }

  function close() {
    sheet.classList.add('drum-leaving');
    setTimeout(() => sheet.remove(), 280);
  }

  sheet.querySelector('.drum-cancel-btn').addEventListener('click', close);
  sheet.querySelector('.drum-backdrop').addEventListener('click', close);
  sheet.querySelector('.drum-done-btn').addEventListener('click', () => {
    const w = WEIGHTS[getIdx(wScroll, WEIGHTS.length)] + KG_FRAC[getIdx(fScroll, KG_FRAC.length)];
    const r = REPS[getIdx(rScroll, REPS.length)];
    onConfirm(w, r);
    close();
  });
}
