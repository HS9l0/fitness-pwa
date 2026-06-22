const WEIGHTS  = Array.from({ length: 201 }, (_, i) => i);
// 40-item loop so the .0/.5 wheel scrolls like the alarm clock minute wheel
const KG_FRACS = Array.from({ length: 40 },  (_, i) => i % 2 === 0 ? 0 : 0.5);
const REPS     = Array.from({ length: 200 }, (_, i) => i + 1);
const ITEM_H   = 44;

function buildSheet(label, bodyHtml, lblHtml) {
  document.querySelector('.drum-sheet')?.remove();
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
      ${bodyHtml}
      ${lblHtml}
    </div>
  `;
  document.body.appendChild(sheet);
  return sheet;
}

function close(sheet) {
  sheet.classList.add('drum-leaving');
  setTimeout(() => sheet.remove(), 280);
}

function getIdx(scrollEl, len) {
  return Math.max(0, Math.min(Math.round(scrollEl.scrollTop / ITEM_H), len - 1));
}

export function showWeightPicker({ weight, label, onConfirm }) {
  const wholeKg = Math.floor(weight);
  const fracKg  = (weight % 1 >= 0.25) ? 0.5 : 0;
  const wIdx    = Math.max(0, Math.min(wholeKg, WEIGHTS.length - 1));
  // Start fraction wheel near middle (item 20=.0, item 21=.5) so user can scroll both ways
  const fIdx    = fracKg === 0.5 ? 21 : 20;

  const sheet = buildSheet(label, `
    <div class="drum-body">
      <div class="drum-col">
        <div class="drum-scroll" id="dp-weight">
          ${WEIGHTS.map(v => `<div class="drum-item">${v}</div>`).join('')}
        </div>
      </div>
      <div class="drum-col drum-col-frac">
        <div class="drum-scroll" id="dp-frac">
          ${KG_FRACS.map(v => `<div class="drum-item">.${v === 0 ? '0' : '5'}</div>`).join('')}
        </div>
      </div>
      <div class="drum-band"></div>
      <div class="drum-fade"></div>
    </div>`,
    `<div class="drum-lbl-row"><div class="drum-col-lbl">kg</div></div>`
  );

  const wScroll = sheet.querySelector('#dp-weight');
  const fScroll = sheet.querySelector('#dp-frac');
  wScroll.scrollTop = wIdx * ITEM_H;
  fScroll.scrollTop = fIdx * ITEM_H;

  sheet.querySelector('.drum-cancel-btn').addEventListener('click', () => close(sheet));
  sheet.querySelector('.drum-backdrop').addEventListener('click',   () => close(sheet));
  sheet.querySelector('.drum-done-btn').addEventListener('click', () => {
    const w = WEIGHTS[getIdx(wScroll, WEIGHTS.length)] + KG_FRACS[getIdx(fScroll, KG_FRACS.length)];
    onConfirm(w);
    close(sheet);
  });
}

export function showRepsPicker({ reps, label, onConfirm }) {
  const rIdx = reps > 0 ? Math.min(reps - 1, REPS.length - 1) : 4;

  const sheet = buildSheet(label, `
    <div class="drum-body drum-body-single">
      <div class="drum-col">
        <div class="drum-scroll" id="dp-reps">
          ${REPS.map(v => `<div class="drum-item">${v}</div>`).join('')}
        </div>
      </div>
      <div class="drum-band"></div>
      <div class="drum-fade"></div>
    </div>`,
    `<div class="drum-lbl-row"><div class="drum-col-lbl">reps</div></div>`
  );

  const rScroll = sheet.querySelector('#dp-reps');
  rScroll.scrollTop = rIdx * ITEM_H;

  sheet.querySelector('.drum-cancel-btn').addEventListener('click', () => close(sheet));
  sheet.querySelector('.drum-backdrop').addEventListener('click',   () => close(sheet));
  sheet.querySelector('.drum-done-btn').addEventListener('click', () => {
    onConfirm(REPS[getIdx(rScroll, REPS.length)]);
    close(sheet);
  });
}
