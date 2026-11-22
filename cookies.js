/* Pet Paws: Monster Cookies add-on.
   Bake cookies, then feed them to three hungry monsters. Hot cookies burn their
   mouths and fingers; raw dough gets stuck in their teeth.
   Loaded after index.html's main script and kitchen.js (it reuses kitchen.css
   styles) and uses these globals: $, state, save, bump, addStars, sfx, tone, say,
   animate, bubble, confetti, show, goMode, SCREENS, ENTER, LEAVE, ROOT, MODE_OF, STAR_SVG. */
(() => {
const I = '#24324A';
const sk = `stroke="${I}" stroke-width="2.5" stroke-linejoin="round"`;
const sv = inner => `<svg viewBox="0 0 48 48">${inner}</svg>`;
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- ingredients ---------- */
const chip = (x, y, c = '#5A3324') => `<path d="M${x} ${y-7}Q${x-7} ${y+4} ${x} ${y+4}Q${x+7} ${y+4} ${x} ${y-7}Z" fill="${c}" stroke="${I}" stroke-width="1.6" stroke-linejoin="round"/>`;
const ING = {
  flour:    {label:'Flour', svg:sv(`<path d="M12 14Q24 8 36 14L40 42H8z" fill="#FFF7E8" ${sk}/><path d="M14 14Q24 20 34 14" fill="none" stroke="${I}" stroke-width="2"/><path d="M24 38V22M24 27l-4-3M24 27l4-3M24 33l-4-3M24 33l4-3" stroke="#C99A2E" stroke-width="2.2" stroke-linecap="round"/>`)},
  butter:   {label:'Butter', svg:sv(`<path d="M6 22l8-8h28v16l-8 8H6z" fill="#FFE07A" ${sk}/><path d="M6 22h28v16M34 22l8-8" fill="none" stroke="${I}" stroke-width="2.5" stroke-linejoin="round"/>`)},
  sugar:    {label:'Sugar', svg:sv(`<rect x="7" y="24" width="15" height="15" rx="2" fill="#fff" ${sk}/><rect x="26" y="24" width="15" height="15" rx="2" fill="#fff" ${sk}/><rect x="16.5" y="8" width="15" height="15" rx="2" fill="#fff" ${sk}/>`)},
  egg:      {label:'Egg', svg:sv(`<ellipse cx="24" cy="26" rx="13" ry="17" fill="#FFF7E8" ${sk}/><ellipse cx="19" cy="19" rx="3" ry="5" fill="#fff"/>`)},
  chips:    {label:'Chocolate chips', svg:sv([[14,32],[26,35],[36,28],[19,19],[31,16]].map(([x, y]) => chip(x, y)).join(''))},
  sprinkles:{label:'Sprinkles', svg:sv([[12,14,'#FF6F61',20],[24,10,'#4FB3F2',-30],[35,16,'#FFC93C',45],[15,27,'#7CCB5B',-10],[28,24,'#FF7FB0',30],[38,31,'#A974F2',-40],[20,37,'#4FB3F2',15],[32,39,'#FF6F61',-25]].map(([x, y, c, r]) => `<rect x="${x-6}" y="${y-2.5}" width="12" height="5" rx="2.5" fill="${c}" stroke="${I}" stroke-width="1.2" transform="rotate(${r} ${x} ${y})"/>`).join(''))},
  honey:    {label:'Honey', svg:sv(`<path d="M12 18h24v18a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z" fill="#F2A93B" ${sk}/><rect x="10" y="10" width="28" height="9" rx="3" fill="#A0704E" ${sk}/><path d="M18 26h12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`)},
  ginger:   {label:'Ginger', svg:sv(`<path d="M7 30c0-6 6-8 10-6 2-6 8-8 12-4 4-4 12 0 11 6 4 4 0 12-6 10-4 4-10 4-14 0-6 2-13 0-13-6z" fill="#E8C27E" ${sk}/><path d="M17 28q4 3 8 0M29 30q3 2 6 0" stroke="#B8733A" stroke-width="1.8" fill="none" stroke-linecap="round"/>`)},
  jam:      {label:'Jam', svg:sv(`<path d="M12 18h24v18a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z" fill="#D9304A" ${sk}/><rect x="10" y="10" width="28" height="9" rx="3" fill="#fff" ${sk}/><circle cx="21" cy="28" r="3" fill="#fff" opacity=".5"/>`)},
  cocoa:    {label:'Cocoa', svg:sv(`<rect x="12" y="13" width="24" height="29" rx="4" fill="#6B3E2A" ${sk}/><ellipse cx="24" cy="13" rx="12" ry="4" fill="#8A5A3B" ${sk}/><circle cx="24" cy="28" r="6" fill="#F3D6A4"/>`)},
  oats:     {label:'Oats', svg:sv([[14,30,20],[26,33,-30],[36,26,40],[20,19,-10],[31,16,30],[12,40,0],[30,41,15]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" transform="rotate(${r} ${x} ${y})" fill="#F1E2C0" stroke="${I}" stroke-width="1.8"/>`).join(''))},
  raisins:  {label:'Raisins', svg:sv([[14,30,20],[26,32,-30],[36,26,40],[20,19,-10],[31,16,30]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" transform="rotate(${r} ${x} ${y})" fill="#5B2E4A" stroke="${I}" stroke-width="2"/>`).join(''))}
};

/* ---------- cookies ---------- */
const COOKIES = [
  {id:'chocchip',   name:'Chocolate chip',     base:'#E0A45E', dough:'#F3D6A4', items:['flour','butter','sugar','egg','chips']},
  {id:'sprinkle',   name:'Rainbow sprinkle',   base:'#F6D9A8', dough:'#FBEBCB', items:['flour','butter','sugar','egg','sprinkles']},
  {id:'ginger',     name:'Gingerbread people', base:'#B8733A', dough:'#D9A06A', items:['flour','butter','honey','ginger'], shape:'person'},
  {id:'jam',        name:'Jam thumbprint',     base:'#E9B872', dough:'#F5DDAF', items:['flour','butter','sugar','jam']},
  {id:'doublechoc', name:'Double chocolate',   base:'#6B3E2A', dough:'#8A5A3B', items:['flour','butter','sugar','cocoa','chips']},
  {id:'oat',        name:'Oat and raisin',     base:'#C9965A', dough:'#E3C08A', items:['oats','flour','butter','sugar','raisins']},
  {id:'star',       name:'Star shortbread',    base:'#F2CF85', dough:'#FBE7BE', items:['flour','butter','sugar'], shape:'star'}
];

// Draw shapes twice (thick ink, then fill) so overlapping parts get one clean outline.
const outlined = (shapes, fill, w = 5) => `<g fill="${I}" stroke="${I}" stroke-width="${w}" stroke-linejoin="round">${shapes}</g><g fill="${fill}">${shapes}</g>`;
function starPts(x, y, r){ return Array.from({length:10}, (_, i) => { const a = -Math.PI/2 + i * Math.PI/5, rr = i % 2 ? r * .48 : r; return `${(x + Math.cos(a)*rr).toFixed(1)},${(y + Math.sin(a)*rr).toFixed(1)}`; }).join(' '); }
function shapeOf(t, x, y, r){
  if (t.shape === 'person') return `<circle cx="${x}" cy="${y - r*.55}" r="${r*.36}"/><ellipse cx="${x}" cy="${y + r*.12}" rx="${r*.42}" ry="${r*.5}"/><ellipse cx="${x}" cy="${y - r*.08}" rx="${r*.9}" ry="${r*.17}"/><ellipse cx="${x - r*.28}" cy="${y + r*.62}" rx="${r*.18}" ry="${r*.36}" transform="rotate(18 ${x - r*.28} ${y + r*.62})"/><ellipse cx="${x + r*.28}" cy="${y + r*.62}" rx="${r*.18}" ry="${r*.36}" transform="rotate(-18 ${x + r*.28} ${y + r*.62})"/>`;
  if (t.shape === 'star') return `<polygon points="${starPts(x, y, r * 1.1)}"/>`;
  return `<circle cx="${x}" cy="${y}" r="${r}"/>`;
}
const dots = (x, y, r, pts, c, s) => pts.map(([a, b]) => `<ellipse cx="${x + a*r}" cy="${y + b*r}" rx="${r*s}" ry="${r*s*.8}" fill="${c}"/>`).join('');
function deco(t, x, y, r, raw){
  switch (t.id) {
    case 'chocchip':   return dots(x, y, r, [[-.42,-.3],[.35,-.38],[0,.08],[-.32,.45],[.45,.3]], '#4A2A1B', .15);
    case 'doublechoc': return dots(x, y, r, [[-.42,-.3],[.35,-.38],[0,.08],[-.32,.45],[.45,.3]], '#2E1A10', .15) + dots(x, y, r, [[.05,-.5],[-.5,.1]], '#FFF3D6', .11);
    case 'sprinkle':   return [[-.45,-.25,'#FF6F61',20],[.3,-.45,'#4FB3F2',-40],[.05,.05,'#FFC93C',60],[-.3,.45,'#7CCB5B',-15],[.45,.25,'#FF7FB0',35],[-.05,-.6,'#A974F2',0],[.55,-.1,'#7CCB5B',80]].map(([a, b, c, rot]) => `<rect x="${x + a*r - r*.13}" y="${y + b*r - r*.05}" width="${r*.26}" height="${r*.1}" rx="${r*.05}" fill="${c}" transform="rotate(${rot} ${x + a*r} ${y + b*r})"/>`).join('');
    case 'oat':        return dots(x, y, r, [[-.4,-.3],[.3,.35],[.1,-.45],[-.45,.3]], '#F1E2C0', .17) + dots(x, y, r, [[.35,-.2],[-.1,.2],[-.15,-.6]], '#5B2E4A', .12);
    case 'jam':        return raw ? `<circle cx="${x}" cy="${y}" r="${r*.28}" fill="#D9304A" stroke="${I}" stroke-width="2"/>` : `<circle cx="${x}" cy="${y}" r="${r*.36}" fill="#D9304A" stroke="${I}" stroke-width="2.5"/><circle cx="${x - r*.12}" cy="${y - r*.12}" r="${r*.09}" fill="#fff" opacity=".5"/>`;
    case 'ginger':     return raw ? '' : `<circle cx="${x - r*.13}" cy="${y - r*.6}" r="${r*.06}" fill="#fff"/><circle cx="${x + r*.13}" cy="${y - r*.6}" r="${r*.06}" fill="#fff"/><path d="M${x - r*.14} ${y - r*.45}q${r*.14} ${r*.12} ${r*.28} 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y - r*.02}" r="${r*.08}" fill="#FF6F61"/><circle cx="${x}" cy="${y + r*.25}" r="${r*.08}" fill="#4FB3F2"/><path d="M${x - r*.75} ${y - r*.12}l${r*.12} ${r*.08}l${r*.1} ${-r*.08}M${x + r*.53} ${y - r*.12}l${r*.12} ${r*.08}l${r*.1} ${-r*.08}" stroke="#fff" stroke-width="1.8" fill="none"/>`;
    case 'star':       return raw ? '' : dots(x, y, r, [[0,-.3],[-.3,.1],[.3,.1],[0,.3],[-.55,-.2],[.55,-.2]], '#FFFFFF', .07);
  }
  return '';
}
// One cookie. raw: unbaked dough; heat: 0 (cool) to 1 (just out of the oven).
function cookieSVG(t, x, y, r, raw, heat = 0, extra = ''){
  let body;
  if (raw && !t.shape) {
    const lumps = `<circle cx="${x}" cy="${y + r*.05}" r="${r*.72}"/><circle cx="${x - r*.3}" cy="${y - r*.18}" r="${r*.48}"/><circle cx="${x + r*.28}" cy="${y - r*.12}" r="${r*.5}"/>`;
    body = outlined(lumps, t.dough, 4) + deco(t, x, y, r * .75, true);
  } else {
    body = outlined(shapeOf(t, x, y, r), raw ? t.dough : t.base, 4) + deco(t, x, y, r, raw);
  }
  let glow = '';
  if (heat > 0) {
    glow = `<circle data-heat cx="${x}" cy="${y}" r="${r + 8}" fill="#FF7A3D" opacity="${(heat * .45).toFixed(2)}"/>`;
  }
  const steam = heat > .25 ? `<g class="c-steam">${[-.4, 0, .4].map((d, j) => `<path d="M${x + d*r} ${y - r - 4}q-6 -8 0 -16q6 -8 0 -16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" style="animation-delay:${j*.35}s"/>`).join('')}</g>` : '';
  return glow + body + steam + extra;
}
function plateArt(t){
  return `<ellipse cx="60" cy="74" rx="56" ry="20" fill="#fff" stroke="${I}" stroke-width="3"/><ellipse cx="60" cy="72" rx="40" ry="12" fill="none" stroke="#DDE3EC" stroke-width="2"/>`
    + cookieSVG(t, 36, 60, 18) + cookieSVG(t, 84, 60, 18) + cookieSVG(t, 60, 50, 20);
}

/* ---------- monsters ---------- */
const MON = [
  {id:'gloop',  name:'Gloop',  color:'#6CCB6A', light:'#A8E6A0', fed:0, mood:'wait'},
  {id:'zip',    name:'Zip',    color:'#A974F2', light:'#D3B8FA', fed:0, mood:'wait'},
  {id:'fuzz',   name:'Fuzz',   color:'#FF9F43', light:'#FFCB94', fed:0, mood:'wait'}
];
const NEED = 3;
const EYES = {gloop:[[60, 44, 15]], zip:[[45, 50, 10], [75, 50, 10]], fuzz:[[42, 50, 8], [60, 42, 8], [78, 50, 8]]};
function body(m, tint){
  const c = tint || m.color;
  if (m.id === 'gloop') return `<path d="M60 22V10" stroke="${I}" stroke-width="3"/><circle cx="60" cy="9" r="6" fill="#FFC93C" stroke="${I}" stroke-width="3"/><path d="M18 106C8 72 16 22 60 22C104 22 112 72 102 106Z" fill="${c}" stroke="${I}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="32" cy="80" r="5" fill="${m.light}"/><circle cx="90" cy="70" r="4" fill="${m.light}"/>`;
  if (m.id === 'zip') return `<path d="M30 34L26 8L46 26ZM90 34L94 8L74 26Z" fill="#FFF1C2" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><rect x="20" y="22" width="80" height="86" rx="34" fill="${c}" stroke="${I}" stroke-width="3.5"/><circle cx="32" cy="88" r="5" fill="${m.light}"/><circle cx="88" cy="92" r="6" fill="${m.light}"/><circle cx="84" cy="32" r="4" fill="${m.light}"/>`;
  const pts = Array.from({length:28}, (_, i) => { const a = i * Math.PI / 14, r = i % 2 ? 46 : 52; return `${(60 + Math.cos(a)*r).toFixed(1)},${(64 + Math.sin(a)*r*.92).toFixed(1)}`; }).join(' ');
  return `<polygon points="${pts}" fill="${c}" stroke="${I}" stroke-width="3.5" stroke-linejoin="round"/>`;
}
function eyes(m, mood){
  return EYES[m.id].map(([x, y, r]) => {
    if (mood === 'chew' || mood === 'full' || mood === 'happy') return `<path d="M${x - r} ${y + 2}q${r} ${-r * 1.1} ${r * 2} 0" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (mood === 'hot') return `<path d="M${x - r*.8} ${y - r*.6}L${x + r*.5} ${y}L${x - r*.8} ${y + r*.6}" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const brow = mood === 'sticky' ? `<path d="M${x - r} ${y - r - 6}l${r * 2} 4" stroke="${I}" stroke-width="3" stroke-linecap="round"/>` : '';
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${I}" stroke-width="2.5"/><circle cx="${x + r*.15}" cy="${y + r*.15}" r="${r*.5}" fill="${I}"/><circle cx="${x + r*.3}" cy="${y - r*.05}" r="${r*.16}" fill="#fff"/>${brow}`;
  }).join('');
}
const TEETH = `<path d="M45 73h8l-4 7zM56 74h8l-4 7zM67 73h8l-4 7z" fill="#fff" stroke="${I}" stroke-width="1.5" stroke-linejoin="round"/>`;
function mouth(mood){
  switch (mood) {
    case 'chew':  return `<circle cx="36" cy="80" r="9" fill="#fff" opacity=".35"/><circle cx="84" cy="80" r="9" fill="#fff" opacity=".35"/><path d="M42 82q6 6 12 0q6 6 12 0q6 6 12 0" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="96" r="2.5" fill="#C98A4A"/><circle cx="66" cy="99" r="2" fill="#C98A4A"/><circle cx="74" cy="94" r="2.5" fill="#C98A4A"/>`;
    case 'full': case 'happy': return `<path d="M40 76Q60 100 80 76Z" fill="#5A1E2E" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="60" cy="88" rx="9" ry="4" fill="#FF7FB0"/>`;
    case 'hot':   return `<path d="M38 70Q60 108 82 70Z" fill="#5A1E2E" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>${TEETH}<path d="M52 88q8 26 16 0z" fill="#FF5A4E" stroke="${I}" stroke-width="2.5" stroke-linejoin="round"/><path d="M60 112q-7-8 0-18q7 10 0 18z" fill="#FFC93C" stroke="#FF6F3D" stroke-width="1.5"/>`;
    case 'sticky': return `<path d="M40 72Q60 102 80 72Z" fill="#5A1E2E" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>${TEETH}${[[48,78,6],[60,80,7],[71,77,6],[55,86,4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F3D6A4" stroke="${I}" stroke-width="2"/>`).join('')}`;
    case 'drink': return `<path d="M44 78q16 10 32 0" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M50 64h20l-3 34H53z" fill="#BFE6FF" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><path d="M52 74h16" stroke="#4FB3F2" stroke-width="6"/>`;
    case 'brush': return `<path d="M40 72Q60 100 80 72Z" fill="#5A1E2E" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>${TEETH}<rect x="22" y="78" width="54" height="8" rx="4" fill="#4FB3F2" stroke="${I}" stroke-width="2.5"/><rect x="64" y="70" width="16" height="9" rx="2" fill="#fff" stroke="${I}" stroke-width="2"/>${[[86,66],[92,76],[84,84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#4FB3F2" stroke-width="2"/>`).join('')}`;
  }
  return `<path d="M40 72Q60 104 80 72Z" fill="#5A1E2E" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>${TEETH}<ellipse cx="60" cy="90" rx="10" ry="5" fill="#FF7FB0"/>`;
}
function monsterSVG(m, mood = m.mood){
  const hot = mood === 'hot';
  const hand = hot ? '#FF5A4E' : m.color;
  const hands = `<circle cx="14" cy="88" r="10" fill="${hand}" stroke="${I}" stroke-width="3"/><circle cx="106" cy="88" r="10" fill="${hand}" stroke="${I}" stroke-width="3"/>`
    + (hot ? `<path d="M6 74l-4-6M14 72v-7M22 74l4-6M98 74l-4-6M106 72v-7M114 74l4-6" stroke="#FF6F3D" stroke-width="2.5" stroke-linecap="round"/>` : '');
  const blush = hot ? `<ellipse cx="60" cy="66" rx="42" ry="38" fill="#FF3B30" opacity=".35"/>` : '';
  const puff = hot ? `<g class="c-steam">${[34, 60, 86].map((x, j) => `<path d="M${x} 20q-6 -8 0 -14q6 -8 0 -14" stroke="#B8C0CF" stroke-width="5" fill="none" stroke-linecap="round" style="animation-delay:${j*.3}s"/>`).join('')}</g>` : '';
  return `<svg viewBox="-4 -16 128 140" aria-hidden="true"><g class="m-art ${mood === 'full' ? 'happy' : mood}">${hands}${body(m)}${blush}${eyes(m, mood)}${mouth(mood)}${puff}</g></svg>`;
}
const foodDots = m => Array.from({length:NEED}, (_, i) => i < m.fed
  ? `<svg viewBox="0 0 40 40">${cookieSVG(COOKIES[0], 20, 20, 15)}</svg>`
  : `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="${I}" stroke-width="2.5" stroke-dasharray="5 4"/></svg>`).join('');

/* ---------- screens ---------- */
document.querySelector('.app').insertAdjacentHTML('beforeend', `
  <section class="screen" id="scr-cookies" hidden>
    <div class="k-head"><h2 class="scene-title">Monster Cookies</h2><span class="pill" id="cEaten"></span></div>
    <div class="m-row" id="mPreview"></div>
    <p class="hint">The monsters are hungry! Pick a cookie to bake for them.</p>
    <div class="c-grid" id="cGrid"></div>
  </section>
  <section class="screen" id="scr-bake" hidden>
    <div class="k-top"><button class="btn small" id="cBack">All cookies</button><h2 class="scene-title" id="cTitle"></h2></div>
    <div class="m-row" id="mRow"></div>
    <div class="stage k-stage" id="cStage">
      <div id="cScene"></div>
      <div class="bubble" id="cBubble" hidden></div>
      <div class="k-tool" id="cTool"></div>
    </div>
    <div class="cue" aria-live="polite"><div class="big" id="cCueIcon"></div><div class="k-cue-text"><p id="cCue"></p><div class="k-prog" id="cProgWrap" hidden><i id="cProg"></i></div></div></div>
    <div class="k-tray" id="cTray"></div>
  </section>`);
SCREENS.push('cookies', 'bake');
MODE_OF.cookies = MODE_OF.bake = 'cookies';
ROOT.cookies = () => 'cookies';
ENTER.cookies = enterPicker;
ENTER.bake = enterBake;
LEAVE.push(name => { if (name !== 'bake') stopBake(); });

// Front-page card and switcher tab for this game.
const MONSTER_ICON = `<svg viewBox="-4 -16 128 140" aria-hidden="true">${body(MON[0])}${eyes(MON[0], 'wait')}${mouth('wait')}</svg>`;
document.querySelector('.start-grid').insertAdjacentHTML('beforeend', `
  <button class="start-card s-cookies" data-mode="cookies">
    <div class="pet c-start-art"><svg viewBox="0 0 120 120" aria-hidden="true"><g transform="translate(6 2) scale(.8)">${body(MON[0])}${eyes(MON[0], 'wait')}${mouth('wait')}</g>${cookieSVG(COOKIES[0], 92, 96, 18)}</svg></div>
    <b>Monster Cookies</b><small>Bake cookies for hungry monsters</small>
  </button>`);
document.querySelector('#modeNav').insertAdjacentHTML('beforeend', `<button class="mode" data-mode="cookies" aria-pressed="false">${MONSTER_ICON}Monster Cookies</button>`);
document.querySelectorAll('[data-mode="cookies"]').forEach(b => b.onclick = () => goMode('cookies'));

/* ---------- picker ---------- */
function enterPicker(){
  $('#cEaten').innerHTML = `${STAR_SVG}<span>${state.cookiesEaten || 0} cookies eaten</span>`;
  $('#mPreview').innerHTML = MON.map(m => `<div class="m-card"><div class="m-btn ${m.fed >= NEED ? 'full' : ''}">${monsterSVG(m, m.fed >= NEED ? 'full' : 'wait')}<b>${m.name}</b><span class="m-food">${foodDots(m)}</span></div></div>`).join('');
  $('#cGrid').innerHTML = COOKIES.map(t => `<button class="c-card" data-c="${t.id}"><svg viewBox="0 0 120 100" aria-hidden="true">${plateArt(t)}</svg><b>${t.name}</b><em>Bake 6</em></button>`).join('');
}
$('#cGrid').onclick = e => { const b = e.target.closest('[data-c]'); if (b) { sfx.pop(); startBake(b.dataset.c); } };
$('#cBack').onclick = () => { sfx.pop(); show('cookies'); };

/* ---------- baking ---------- */
const SLOTS = [[130, 186], [200, 186], [270, 186], [130, 238], [200, 238], [270, 238]];
const COOL_SECONDS = 14, BAKE_SECONDS = 6, HOT = .25;
let bk = null, rq = 0;

function stopBake(){ if (!bk) return; clearInterval(bk.timer); clearInterval(bk.coolTimer); bk = null; endDrag(); }
function startBake(id){
  stopBake();
  const t = COOKIES.find(c => c.id === id);
  bk = {t, phase:'add', added:new Set(), mix:0, cookies:[], oven:0, sel:null, timer:0, coolTimer:0, ovenOn:false};
  show('bake');
}
function enterBake(){
  if (!bk) return show('cookies');
  $('#cTitle').textContent = `${bk.t.name} cookies`;
  renderMonsters(); setPhase('add');
}
const live = () => bk ? bk.cookies.filter(c => !c.eaten) : [];

function setPhase(p){
  bk.phase = p; bk.sel = null;
  const t = bk.t;
  const cue = {
    add:   [`Put the ${listOf(t.items)} in the bowl.`, ING[t.items[0]].svg],
    mix:   ['Stir it into cookie dough. Rub round and round!', toolSVG('spoon')],
    shape: [t.shape ? `Tap the tray to cut out 6 ${t.shape === 'star' ? 'stars' : 'gingerbread people'}.` : 'Tap the tray to make 6 cookies.', cookieIcon(t, true)],
    oven:  ['Bake the cookies in the oven.', toolSVG('flame')],
    cool:  ['', cookieIcon(t, false)],
    done:  ['All the cookies are gone!', STAR_SVG]
  }[p];
  $('#cCueIcon').innerHTML = cue[1];
  if (p !== 'cool') $('#cCue').textContent = cue[0];
  $('#cTool').innerHTML = p === 'mix' ? toolSVG('spoon') : '';
  $('#cStage').classList.remove('show-tool');
  setProg(p === 'mix' ? bk.mix : 0, p === 'mix');
  if (p === 'add') bk.tray = shuffle([...t.items, ...shuffle(Object.keys(ING).filter(k => !t.items.includes(k))).slice(0, 2)]);
  if (p === 'cool') { updateCoolCue(true); startCooling(); }
  else if (cue[0]) say(cue[0]);
  renderTray(); renderScene(); renderMonsters();
}
function listOf(ids){ const n = ids.map(id => ING[id].label.toLowerCase()); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0]; }
function cookieIcon(t, raw){ return `<svg viewBox="0 0 48 48">${cookieSVG(t, 24, 25, 16, raw)}</svg>`; }
function toolSVG(name){
  if (name === 'flame') return `<svg viewBox="0 0 64 64"><path d="M32 6c4 12 16 16 16 32a16 16 0 0 1-32 0c0-8 6-12 8-20 4 6 4 10 8 12 0-8-2-16 0-24z" fill="#FF8A3D" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><path d="M32 34c3 6 8 8 8 14a8 8 0 0 1-16 0c0-4 4-8 8-14z" fill="#FFC93C"/></svg>`;
  if (name === 'water') return `<svg viewBox="0 0 48 48"><path d="M12 10h24l-3 32H15z" fill="#BFE6FF" stroke="${I}" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 22h20" stroke="#4FB3F2" stroke-width="7"/></svg>`;
  if (name === 'brush') return `<svg viewBox="0 0 48 48"><rect x="4" y="26" width="34" height="7" rx="3.5" fill="#4FB3F2" stroke="${I}" stroke-width="2.5"/><rect x="30" y="16" width="14" height="10" rx="2" fill="#fff" stroke="${I}" stroke-width="2.5"/></svg>`;
  if (name === 'wind') return `<svg viewBox="0 0 48 48"><path d="M6 18h24a6 6 0 1 0-6-6M6 26h32a6 6 0 1 1-6 6M6 34h14" stroke="${I}" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`;
  return `<svg viewBox="0 0 64 64"><g transform="rotate(25 32 32)"><ellipse cx="32" cy="15" rx="10" ry="13" fill="#D9A066" stroke="${I}" stroke-width="3"/><rect x="29" y="26" width="6" height="34" rx="3" fill="#D9A066" stroke="${I}" stroke-width="3"/></g></svg>`;
}
function setProg(p, visible){ $('#cProgWrap').hidden = !visible; $('#cProg').style.width = Math.round(p * 100) + '%'; }

/* ---------- drawing ---------- */
const bowlBack = `<ellipse cx="200" cy="170" rx="120" ry="30" fill="#BFE6FF" stroke="${I}" stroke-width="4"/>`;
const bowlFront = `<path d="M80 170Q84 262 200 264Q316 262 320 170A120 30 0 0 1 80 170Z" fill="#FF7FB0" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><path d="M110 215Q200 240 290 215" stroke="#fff" stroke-width="5" fill="none" opacity=".4" stroke-linecap="round"/>`;
const trayBase = `<rect x="66" y="150" width="268" height="126" rx="12" fill="#7D8AA3" stroke="${I}" stroke-width="4"/><rect x="76" y="158" width="248" height="110" rx="8" fill="#B8C0CF"/>`;
const rackBase = `<path d="M80 272v12M320 272v12" stroke="${I}" stroke-width="5" stroke-linecap="round"/><rect x="66" y="150" width="268" height="124" rx="10" fill="none" stroke="#7D8AA3" stroke-width="5"/>${Array.from({length:9}, (_, i) => `<line x1="${92 + i*27}" y1="152" x2="${92 + i*27}" y2="272" stroke="#9AA6BA" stroke-width="3"/>`).join('')}${[180, 212, 244].map(y => `<line x1="68" y1="${y}" x2="332" y2="${y}" stroke="#9AA6BA" stroke-width="3"/>`).join('')}`;
function cookiesOn(showEmpty){
  return SLOTS.map(([x, y], i) => {
    const c = bk.cookies[i];
    if (!c) return showEmpty ? `<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 5" opacity=".9"/>` : '';
    if (c.eaten) return `<circle cx="${x}" cy="${y + 8}" r="3" fill="#C98A4A" opacity=".7"/><circle cx="${x + 8}" cy="${y + 4}" r="2" fill="#C98A4A" opacity=".7"/>`;
    const sel = bk.sel === i;
    const ring = sel ? `<circle cx="${x}" cy="${y - 6}" r="32" fill="none" stroke="#FFC93C" stroke-width="5" stroke-dasharray="8 5"/>` : '';
    const ready = !c.raw && c.heat <= HOT && bk.phase === 'cool' && !sel ? `<circle class="c-ready" cx="${x}" cy="${y}" r="30" fill="none" stroke="#7CCB5B" stroke-width="3"/>` : '';
    return `<g data-c="${i}">${ring}${ready}${cookieSVG(bk.t, x, sel ? y - 6 : y, 24, c.raw, c.heat)}</g>`;
  }).join('');
}
function sceneSVG(){
  const p = bk.phase;
  if (p === 'add' || p === 'mix') {
    const items = [...bk.added].map((id, j) => { const x = 140 + (j % 4) * 40 + (j > 3 ? 20 : 0), y = 158 + (j % 2) * 10; return ING[id].svg.replace('<svg ', `<svg x="${x - 20}" y="${y - 20}" width="40" height="40" opacity="${(1 - bk.mix).toFixed(2)}" `); }).join('');
    const dough = bk.mix > 0 ? `<ellipse cx="200" cy="172" rx="114" ry="26" fill="${bk.t.dough}" opacity="${bk.mix.toFixed(2)}"/>` : '';
    return bowlBack + dough + items + bowlFront;
  }
  if (p === 'shape') return trayBase + cookiesOn(true);
  if (p === 'oven') {
    const on = bk.ovenOn;
    return `<rect x="70" y="24" width="260" height="240" rx="20" fill="#E4E8F0" stroke="${I}" stroke-width="4"/>${[110, 150, 190].map(x => `<circle cx="${x}" cy="50" r="10" fill="#fff" stroke="${I}" stroke-width="3"/>`).join('')}<circle cx="290" cy="50" r="7" fill="${on ? '#FF6F61' : '#B8C0CF'}" stroke="${I}" stroke-width="2"/><rect x="130" y="70" width="140" height="10" rx="5" fill="#9AA6BA" stroke="${I}" stroke-width="3"/><rect x="96" y="90" width="208" height="150" rx="14" fill="#3A3F4B" stroke="${I}" stroke-width="4"/>`
      + (on ? `<rect class="k-glow" x="100" y="94" width="200" height="142" rx="11" fill="#FFB25C" opacity=".9"/>` : '')
      + `<g transform="translate(200 168) scale(.62) translate(-200 -212)">${trayBase}${cookiesOn(false)}</g><rect x="100" y="94" width="200" height="40" rx="10" fill="#fff" opacity=".12"/>`;
  }
  return rackBase + cookiesOn(false);
}
function renderScene(){ if (bk) $('#cScene').innerHTML = `<svg viewBox="0 0 400 300" aria-hidden="true">${sceneSVG()}</svg>`; }
function requestRender(){ if (!rq) rq = requestAnimationFrame(() => { rq = 0; renderScene(); }); }

/* ---------- tray (buttons under the stage) ---------- */
function renderTray(){
  const t = $('#cTray'), p = bk.phase;
  if (p === 'add') t.innerHTML = `<div class="foods">${bk.tray.map(id => `<button class="food ${bk.added.has(id) ? 'used' : ''}" data-ing="${id}">${ING[id].svg}<span>${ING[id].label}</span></button>`).join('')}</div>`;
  else if (p === 'mix') t.innerHTML = `<p class="k-hint">Rub round and round on the bowl.</p>`;
  else if (p === 'shape') t.innerHTML = bk.cookies.length >= 6 ? `<button class="btn go k-big" id="cToOven">${toolSVG('flame')}Put them in the oven</button>` : `<p class="k-hint">Tap the tray. You can feed raw dough to a monster too… but what will happen?</p>`;
  else if (p === 'oven') t.innerHTML = !bk.ovenOn && bk.oven === 0 ? `<button class="btn go k-big" id="cBakeGo">${toolSVG('flame')}Turn on the oven</button>`
    : `<button class="btn ${bk.oven >= 1 ? 'go' : ''} k-big" id="cTakeOut">Take them out</button>`;
  else if (p === 'cool') t.innerHTML = (live().some(c => c.raw) ? `<button class="btn go k-big" id="cBackIn">${toolSVG('flame')}Put them back in the oven</button>` : '')
    + `<p class="k-hint">Tap or drag a cookie, then tap a monster. Rub over hot cookies to blow on them.</p>`;
  else t.innerHTML = `<div class="k-row"><button class="btn go" id="cAgain">Bake ${bk.t.name.toLowerCase()} again</button><button class="btn" id="cMore">Pick another cookie</button></div>`;
}
$('#cTray').onclick = e => {
  if (!bk) return;
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.ing) return addIng(b.dataset.ing, b);
  if (b.id === 'cToOven') { sfx.pop(); bk.oven = 0; bk.ovenOn = false; return setPhase('oven'); }
  if (b.id === 'cBakeGo') return ovenStart();
  if (b.id === 'cTakeOut') return takeOut();
  if (b.id === 'cBackIn') { sfx.pop(); clearInterval(bk.coolTimer); bk.ovenOn = false; setPhase('oven'); return ovenStart(); }
  if (b.id === 'cAgain') { sfx.pop(); return startBake(bk.t.id); }
  if (b.id === 'cMore') { sfx.pop(); return show('cookies'); }
};
function addIng(id, btn){
  if (bk.phase !== 'add' || bk.added.has(id)) return;
  if (!bk.t.items.includes(id)) {
    sfx.oops(); bubble('#cBubble', `Hmm, ${ING[id].label.toLowerCase()} doesn't go in these cookies!`, 2200);
    const want = bk.t.items.find(x => !bk.added.has(x)); const nb = want && $(`#cTray [data-ing="${want}"]`);
    if (nb) { nb.classList.remove('nudge'); void nb.offsetWidth; nb.classList.add('nudge'); }
    return;
  }
  bk.added.add(id); btn.classList.add('used'); sfx.pop(); renderScene();
  if (bk.t.items.every(x => bk.added.has(x))) setTimeout(() => { if (bk && bk.phase === 'add') { sfx.ding(); setPhase('mix'); } }, 700);
}

/* ---------- oven ---------- */
function ovenStart(){
  if (bk.ovenOn) return;
  bk.ovenOn = true; setProg(bk.oven, true); renderScene(); renderTray(); tone(180, .4, 'sawtooth', .04, 1.5);
  bubble('#cBubble', 'Baking… wait for the ding!', 2500); say('Baking! Wait for the ding.');
  let dinged = bk.oven >= 1;
  bk.timer = setInterval(() => {
    if (!bk) return;
    bk.oven = Math.min(1.5, bk.oven + .1 / BAKE_SECONDS);
    setProg(Math.min(1, bk.oven), true);
    if (Math.random() < .25) tone(120 + Math.random() * 60, .07, 'triangle', .03);
    if (!dinged && bk.oven >= 1) { dinged = true; tone(1320, .5, 'sine', .2); setTimeout(() => tone(1320, .6, 'sine', .2), 250); bubble('#cBubble', 'Ding! The cookies are baked!', 3000); say('Ding! The cookies are baked. Take them out!'); renderTray(); }
    if (bk.oven >= 1.5) takeOut();
  }, 100);
}
function takeOut(){
  clearInterval(bk.timer); bk.ovenOn = false;
  const baked = bk.oven >= 1;
  live().forEach(c => { if (baked) { if (c.raw) { c.raw = false; c.heat = 1; } } });
  sfx.pop();
  if (!baked) { sfx.oops(); bubble('#cBubble', "Oh no, they're still raw dough!", 2600); }
  setPhase('cool');
  if (!baked) say("Oh no! They're still raw dough. Put them back in the oven!");
  else say("They're very hot! Wait for the steam to stop, or blow on them. Then feed the monsters!");
}

/* ---------- cooling ---------- */
function startCooling(){
  clearInterval(bk.coolTimer);
  bk.coolTimer = setInterval(() => {
    if (!bk) return;
    let changed = false;
    live().forEach(c => { if (!c.raw && c.heat > 0) { const was = c.heat > HOT; c.heat = Math.max(0, c.heat - .1 / COOL_SECONDS); if (was !== (c.heat > HOT)) changed = true; } });
    if (changed) { renderScene(); updateCoolCue(); } else updateHeat();
  }, 100);
}
function updateHeat(){
  const els = document.querySelectorAll('#cScene [data-c]');
  els.forEach(g => { const c = bk.cookies[+g.dataset.c]; const h = g.querySelector('[data-heat]'); if (h && c) h.setAttribute('opacity', (c.heat * .45).toFixed(2)); });
}
function updateCoolCue(first){
  const l = live(); if (!l.length) return;
  const hot = l.filter(c => !c.raw && c.heat > HOT).length, raw = l.filter(c => c.raw).length;
  const text = raw ? 'These cookies are still raw dough. Put them back in the oven!' : hot ? `${hot === l.length ? 'They are' : 'Some are'} too hot! Wait until the steam stops, or rub over them to blow.` : 'Cool and ready! Feed the cookies to the monsters.';
  $('#cCue').textContent = text;
  $('#cCueIcon').innerHTML = raw ? cookieIcon(bk.t, true) : hot ? toolSVG('wind') : cookieIcon(bk.t, false);
  if (!first && !hot && !raw) { sfx.ding(); bubble('#cBubble', 'Cool! Ready to eat!', 1800); say('The cookies are cool and ready. Feed the monsters!'); }
}

/* ---------- stage gestures ---------- */
const stg = $('#cStage');
function toSvg(x, y){ const r = stg.getBoundingClientRect(); return {x:(x - r.left) / r.width * 400, y:(y - r.top) / r.height * 300}; }
function cookieAt(e){
  if (!['shape', 'cool'].includes(bk.phase)) return -1;
  const {x, y} = toSvg(e.clientX, e.clientY);
  let best = -1, bd = 40;
  bk.cookies.forEach((c, i) => { if (c.eaten) return; const d = Math.hypot(SLOTS[i][0] - x, SLOTS[i][1] - y); if (d < bd) { bd = d; best = i; } });
  return best;
}
let drag = null, last = null, lastWhoosh = 0;
stg.addEventListener('pointerdown', e => {
  if (!bk) return;
  last = {x:e.clientX, y:e.clientY, down:true};
  const i = cookieAt(e);
  if (i >= 0) { drag = {i, x0:e.clientX, y0:e.clientY, moved:false}; return; }
  if (bk.phase === 'shape' && bk.cookies.length < 6) {
    bk.cookies.push({raw:true, heat:0, eaten:false}); tone(300 + bk.cookies.length * 60, .12, 'sine', .15, 1.4);
    renderScene(); if (bk.cookies.length === 6) { renderTray(); $('#cCue').textContent = 'Six cookies! Put them in the oven.'; $('#cCueIcon').innerHTML = toolSVG('flame'); say('Six cookies! Put them in the oven.'); }
  }
});
stg.addEventListener('pointermove', e => {
  if (!bk || drag) return;
  if (bk.phase === 'mix' && (e.pointerType === 'mouse' || (last && last.down))) mixRub(e);
  if (bk.phase === 'cool' && (e.pointerType === 'mouse' || (last && last.down))) blow(e);
  if (last) { last.x = e.clientX; last.y = e.clientY; }
});
['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => stg.addEventListener(ev, () => { if (last) last.down = false; if (ev === 'pointerleave') stg.classList.remove('show-tool'); }));
function moveTool(e){ const r = stg.getBoundingClientRect(); $('#cTool').style.transform = `translate(${e.clientX - r.left - 38}px, ${e.clientY - r.top - 38}px)`; stg.classList.add('show-tool'); }
function mixRub(e){
  moveTool(e);
  if (!last) return;
  const d = Math.hypot(e.clientX - last.x, e.clientY - last.y);
  bk.mix = Math.min(1, bk.mix + d / (stg.clientWidth * 4));
  setProg(bk.mix, true); requestRender();
  const now = performance.now(); if (now - lastWhoosh > 90) { lastWhoosh = now; tone(220 + Math.random() * 120, .06, 'triangle', .05); }
  if (bk.mix >= 1) { last.down = false; sfx.ding(); bubble('#cBubble', 'Yummy cookie dough!', 1500); setTimeout(() => bk && setPhase('shape'), 700); bk.phase = 'shaping'; }
}
function blow(e){
  if (!last) return;
  const d = Math.hypot(e.clientX - last.x, e.clientY - last.y); if (!d) return;
  const p = toSvg(e.clientX, e.clientY);
  let any = false, changed = false;
  live().forEach(c => {
    const i = bk.cookies.indexOf(c);
    if (c.raw || c.heat <= 0 || Math.hypot(SLOTS[i][0] - p.x, SLOTS[i][1] - p.y) > 95) return;
    const was = c.heat > HOT; c.heat = Math.max(0, c.heat - d / (stg.clientWidth * 3.5)); any = true;
    if (was !== (c.heat > HOT)) changed = true;
  });
  const now = performance.now();
  if (any && now - lastWhoosh > 120) { lastWhoosh = now; tone(500 + Math.random() * 200, .12, 'sine', .03, .5); }
  if (changed) { renderScene(); updateCoolCue(); } else if (any) updateHeat();
}

/* dragging a cookie to a monster (tap-then-tap works too) */
document.addEventListener('pointermove', e => {
  if (!drag || !bk) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 12) {
    drag.moved = true;
    const c = bk.cookies[drag.i];
    drag.el = document.createElement('div'); drag.el.className = 'c-drag';
    drag.el.innerHTML = `<svg viewBox="0 0 70 70">${cookieSVG(bk.t, 35, 37, 24, c.raw, c.heat)}</svg>`;
    document.body.appendChild(drag.el);
    bk.sel = drag.i; renderScene(); $('#mRow').classList.add('picking');
  }
  if (drag.moved) {
    drag.el.style.left = e.clientX + 'px'; drag.el.style.top = e.clientY + 'px';
    const over = document.elementFromPoint(e.clientX, e.clientY);
    document.querySelectorAll('#mRow .m-btn').forEach(b => b.classList.toggle('drop', !!over && b.contains(over)));
  }
});
document.addEventListener('pointerup', e => {
  if (!drag || !bk) { drag = null; return; }
  const d = drag; endDrag();
  if (d.moved) {
    const over = document.elementFromPoint(e.clientX, e.clientY);
    const m = over && over.closest('#mRow [data-m]');
    if (m) return feed(+m.dataset.m, true);
    bk.sel = null; $('#mRow').classList.remove('picking'); renderScene(); return;
  }
  bk.sel = bk.sel === d.i ? null : d.i;
  sfx.pop(); renderScene();
  $('#mRow').classList.toggle('picking', bk.sel != null);
  if (bk.sel != null) bubble('#cBubble', 'Now tap a monster!', 1500);
});
function endDrag(){ if (drag && drag.el) drag.el.remove(); drag = null; document.querySelectorAll('#mRow .m-btn.drop').forEach(b => b.classList.remove('drop')); }

/* ---------- monsters ---------- */
function renderMonsters(){
  $('#mRow').innerHTML = MON.map((m, i) => `<div class="m-card"><button class="m-btn ${m.fed >= NEED ? 'full' : ''}" data-m="${i}" aria-label="${m.name}">${monsterSVG(m)}<b>${m.name}</b><span class="m-food">${foodDots(m)}</span></button>`
    + (m.mood === 'hot' ? `<button class="btn go m-help" data-help="${i}">${toolSVG('water')}Water</button>` : m.mood === 'sticky' ? `<button class="btn go m-help" data-help="${i}">${toolSVG('brush')}Brush</button>` : '') + `</div>`).join('');
  $('#mRow').classList.toggle('picking', bk != null && bk.sel != null);
}
$('#mRow').onclick = e => {
  if (!bk) return;
  const h = e.target.closest('[data-help]'); if (h) return help(+h.dataset.help);
  const m = e.target.closest('[data-m]'); if (!m) return;
  if (bk.sel == null) { bubble('#cBubble', `${MON[+m.dataset.m].name} says: give me a cookie!`, 1600); tone(200, .2, 'sawtooth', .05, 1.3); return; }
  feed(+m.dataset.m, false);
};
function flyCookie(c, m, done){
  const btn = $(`#mRow [data-m="${MON.indexOf(m)}"] svg`);
  const r = stg.getBoundingClientRect(), i = bk.cookies.indexOf(c);
  const sx = r.left + r.width * SLOTS[i][0] / 400, sy = r.top + r.height * SLOTS[i][1] / 300;
  const to = btn.getBoundingClientRect(), tx = to.left + to.width / 2, ty = to.top + to.height * .6;
  const f = document.createElement('div'); f.className = 'flyfood'; f.innerHTML = `<svg viewBox="0 0 70 70">${cookieSVG(bk.t, 35, 35, 24, c.raw, c.heat)}</svg>`;
  Object.assign(f.style, {left:(sx - 30) + 'px', top:(sy - 30) + 'px', width:'60px', height:'60px'});
  document.body.appendChild(f); f.getBoundingClientRect();
  f.style.transform = `translate(${tx - sx}px, ${ty - sy}px) scale(.6)`; f.style.opacity = '0';
  setTimeout(() => { f.remove(); done(); }, 480);
}
const YUM = ['Nom nom nom!', 'Yummy in my tummy!', 'Crunchy munchy!', 'Best cookie ever!', 'Mmm, delicious!'];
function feed(mi, dropped){
  const m = MON[mi], i = bk.sel, c = bk.cookies[i];
  $('#mRow').classList.remove('picking');
  if (c == null || c.eaten) return;
  if (m.mood === 'hot' || m.mood === 'sticky') { bubble('#cBubble', `Help ${m.name} first!`, 1800); say(`Help ${m.name} first!`); return; }
  if (m.fed >= NEED) { bubble('#cBubble', `${m.name}: I'm too full! Try another monster.`, 2000); sfx.oops(); return; }
  bk.sel = null; c.eaten = true; renderScene();
  flyCookie(c, m, () => {
    if (!bk) return;
    state.cookiesEaten = (state.cookiesEaten || 0) + 1; save();
    if (c.raw) {
      m.mood = 'sticky'; renderMonsters();
      tone(160, .5, 'sawtooth', .06, .7);
      const msg = `${m.name}: Mmmf! Raw dough is stuck in my teeth! Cookies need baking first.`;
      bubble('#cBubble', msg, 0); say(`Mmmf! The raw dough is stuck in my teeth! Cookies need to be baked first. Brush ${m.name}'s teeth!`);
    } else if (c.heat > HOT) {
      m.mood = 'hot'; renderMonsters();
      tone(900, .5, 'square', .06, .4);
      const msg = `${m.name}: Ouch! Too hot! I burned my mouth and fingers!`;
      bubble('#cBubble', msg, 0); say(`Ouch! Too hot! I burned my mouth and my fingers! Always let cookies cool down. Give ${m.name} some water!`);
    } else {
      m.fed++; m.mood = 'chew'; renderMonsters();
      [0, 1, 2, 3].forEach(k => setTimeout(() => tone(240 + Math.random() * 80, .07, 'square', .05), k * 150));
      bubble('#cBubble', `${m.name}: ${pick(YUM)}`, 1800);
      setTimeout(() => {
        if (!bk) return;
        if (m.fed >= NEED) {
          m.mood = 'full'; addStars(1); sfx.chime(); bubble('#cBubble', `${m.name} is full! You earned a star!`, 2600); say(`${m.name} is full and happy! You earned a star.`);
          if (MON.every(x => x.fed >= NEED)) allFull();
        } else m.mood = 'wait';
        renderMonsters();
      }, 1400);
    }
    checkBatch();
  });
}
function help(mi){
  const m = MON[mi];
  const hot = m.mood === 'hot';
  m.mood = hot ? 'drink' : 'brush'; renderMonsters();
  if (hot) { [0, 1, 2].forEach(k => setTimeout(() => tone(400 - k * 40, .12, 'sine', .1), k * 200)); bubble('#cBubble', 'Glug glug… ahh, much better!', 2000); }
  else { [0, 1, 2, 3, 4].forEach(k => setTimeout(() => tone(700 + (k % 2) * 200, .08, 'triangle', .06), k * 140)); bubble('#cBubble', 'Scrub scrub… all clean!', 2000); }
  setTimeout(() => {
    if (!bk) return;
    m.mood = 'happy'; renderMonsters(); sfx.ding();
    say(hot ? `Ahh, thank you! Next time I'll wait for the cookies to cool.` : `Thank you! Next time I'll wait until the cookies are baked.`);
    setTimeout(() => { if (bk && m.mood === 'happy') { m.mood = m.fed >= NEED ? 'full' : 'wait'; renderMonsters(); } }, 1000);
  }, 1500);
}
function allFull(){
  addStars(1); confetti(stg);
  setTimeout(() => { bubble('#cBubble', 'All the monsters are full! Bonus star!', 3000); say('All the monsters are full! You earned a bonus star!'); }, 900);
  setTimeout(() => { MON.forEach(m => { m.fed = 0; m.mood = 'wait'; }); if (bk) { renderMonsters(); bubble('#cBubble', 'Uh oh… the monsters are hungry again!', 2500); } }, 6000);
}
function checkBatch(){
  if (live().length) { if (bk.phase === 'cool') renderTray(); return; }
  clearInterval(bk.coolTimer);
  if (bk.phase === 'shape') { bk.cookies = []; renderScene(); renderTray(); bubble('#cBubble', 'All the dough is gone! Make more cookies.', 2200); return; }
  setTimeout(() => { if (bk && !live().length) setPhase('done'); }, 1500);
}
})();
