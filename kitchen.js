/* Paw Pals: World Kitchen add-on.
   Loaded after the main script in index.html and uses its helpers:
   $, state, save, bump, addStars, sfx, tone, say, petSVG, animate, bubble, confetti,
   show, SCREENS, ENTER, LEAVE, ART, STAR_SVG, HEART_SVG, petName. */
(() => {
const I = '#24324A';
const sk = `stroke="${I}" stroke-width="2.5" stroke-linejoin="round"`;
const sv = inner => `<svg viewBox="0 0 48 48">${inner}</svg>`;
const pile = (pts, rx, ry, fill) => pts.map(([x, y, r = 0]) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="${fill}" stroke="${I}" stroke-width="2"/>`).join('');
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/* ---------- ingredients ---------- */
const ING = {
  flour:    {label:'Flour', color:'#F3E2B8', svg:sv(`<path d="M12 14Q24 8 36 14L40 42H8z" fill="#FFF7E8" ${sk}/><path d="M14 14Q24 20 34 14" fill="none" stroke="${I}" stroke-width="2"/><path d="M24 38V22M24 27l-4-3M24 27l4-3M24 33l-4-3M24 33l4-3" stroke="#C99A2E" stroke-width="2.2" stroke-linecap="round"/>`)},
  water:    {label:'Water', color:'#BFE6FF', svg:ART.water},
  oil:      {label:'Olive oil', color:'#E8D44D', svg:sv(`<path d="M20 6h8v7l4 6v23a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V19l4-6z" fill="#E8D44D" ${sk}/><rect x="19" y="2" width="10" height="5" rx="1.5" fill="#5BAE3F" ${sk}/><circle cx="24" cy="31" r="5" fill="#9ACD4F" stroke="${I}" stroke-width="1.8"/>`)},
  egg:      {label:'Eggs', color:'#FFE08A', svg:sv(`<ellipse cx="24" cy="26" rx="13" ry="17" fill="#FFF7E8" ${sk}/><ellipse cx="19" cy="19" rx="3" ry="5" fill="#fff"/>`)},
  milk:     {label:'Milk', color:'#FFFFFF', svg:sv(`<path d="M14 16L24 6l10 10v26H14z" fill="#fff" ${sk}/><rect x="15.5" y="24" width="17" height="10" fill="#4FB3F2"/><path d="M14 16h20" stroke="${I}" stroke-width="2.5"/>`)},
  tomato:   {label:'Tomato', color:'#E2483D', svg:sv(`<circle cx="24" cy="27" r="16" fill="#FF5A4E" ${sk}/><path d="M24 10l-3 5-6-1 4 4-1 5 6-4 6 4-1-5 4-4-6 1z" fill="#5BAE3F" stroke="${I}" stroke-width="1.8" stroke-linejoin="round"/>`)},
  cheese:   {label:'Cheese', color:'#FFD84D', svg:sv(`<path d="M6 34L40 14l2 20z" fill="#FFD84D" ${sk}/><path d="M6 34h36v7H6z" fill="#F2C230" ${sk}/><circle cx="30" cy="27" r="3" fill="#F2C230"/><circle cx="21" cy="31" r="2" fill="#F2C230"/>`)},
  basil:    {label:'Basil', color:'#3FA34D', svg:sv(`<path d="M24 43C10 34 8 18 24 5c16 13 14 29 0 38z" fill="#3FA34D" ${sk}/><path d="M24 40V12" stroke="#2A7A36" stroke-width="2" stroke-linecap="round"/>`)},
  rice:     {label:'Rice', color:'#FFFFFF', svg:sv(`<path d="M8 32c0-10 7-16 16-16s16 6 16 16z" fill="#fff" ${sk}/><path d="M6 32h36v4a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="#FF7FB0" ${sk}/><path d="M16 26l2-1M24 22l2 1M30 27l2-1M21 29h2" stroke="#C9CED8" stroke-width="2" stroke-linecap="round"/>`)},
  cucumber: {label:'Cucumber', color:'#7CC86A', svg:sv(`<g transform="rotate(-30 24 24)"><rect x="5" y="17" width="38" height="14" rx="7" fill="#4E9E3A" ${sk}/><path d="M12 22h4M22 26h4M31 21h4" stroke="#8ED36B" stroke-width="2" stroke-linecap="round"/></g>`)},
  avocado:  {label:'Avocado', color:'#C9E27A', svg:sv(`<path d="M24 4c-7 0-9 10-12 18-3 9 2 20 12 20s15-11 12-20C33 14 31 4 24 4z" fill="#3F7D2C" ${sk}/><path d="M24 9c-5 0-7 9-9 15-2 7 2 14 9 14s11-7 9-14c-2-6-4-15-9-15z" fill="#C9E27A"/><circle cx="24" cy="28" r="6" fill="#8A5A3B" stroke="${I}" stroke-width="2"/>`)},
  fish:     {label:'Fish', color:'#FF9E7A', svg:ART.fish},
  chicken:  {label:'Chicken', color:'#E0954A', svg:ART.chicken},
  beans:    {label:'Beans', color:'#9E3B33', svg:sv(pile([[15, 31, -30], [31, 31, 25], [23, 20, 0]], 9, 6.5, '#9E3B33'))},
  onion:    {label:'Onion', color:'#E3C1EA', svg:sv(`<path d="M24 8c-2 4-14 10-14 22a14 14 0 0 0 28 0C38 18 26 12 24 8z" fill="#C88AD8" ${sk}/><path d="M24 8V3M20 4l4 4 4-4" stroke="#5BAE3F" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M24 14c-3 6-6 10-6 16M24 14c3 6 6 10 6 16" stroke="#9A5AAE" stroke-width="1.8" fill="none"/>`)},
  carrot:   {label:'Carrot', color:'#F28C3B', svg:ART.carrot},
  peas:     {label:'Peas', color:'#7CCB5B', svg:sv(`<path d="M6 30C14 16 34 12 42 18 36 30 18 36 6 30z" fill="#6CC04A" ${sk}/><g fill="#A6E07A" stroke="${I}" stroke-width="1.6"><circle cx="16" cy="27" r="4"/><circle cx="24" cy="24" r="4"/><circle cx="32" cy="21" r="4"/></g>`)},
  spices:   {label:'Spices', color:'#F28C3B', svg:sv(`<rect x="12" y="14" width="24" height="28" rx="5" fill="#F28C3B" ${sk}/><rect x="10" y="7" width="28" height="8" rx="3" fill="#A0704E" ${sk}/><circle cx="24" cy="28" r="6" fill="#FFE08A" stroke="${I}" stroke-width="1.8"/>`)},
  cabbage:  {label:'Cabbage', color:'#B9E08A', svg:sv(`<circle cx="24" cy="26" r="17" fill="#B9E08A" ${sk}/><path d="M24 10c-8 6-8 26 0 32M24 10c8 6 8 26 0 32M8 24c8 4 24 4 32 0" stroke="#6DAA45" stroke-width="2" fill="none"/>`)},
  soy:      {label:'Soy sauce', color:'#6B3E2A', svg:sv(`<path d="M19 6h10v7l5 6v23H14V19l5-6z" fill="#5A3324" ${sk}/><rect x="18" y="2" width="12" height="5" rx="1.5" fill="#FF6F61" ${sk}/><rect x="17" y="25" width="14" height="10" rx="2" fill="#fff"/>`)},
  couscous: {label:'Couscous', color:'#F1D38A', svg:sv(`<path d="M5 40c2-14 10-22 19-22s17 8 19 22z" fill="#F1D38A" ${sk}/>${[[14,34],[20,28],[26,33],[32,27],[35,36],[24,24],[18,37],[29,38]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#C99A2E"/>`).join('')}`)},
  chickpeas:{label:'Chickpeas', color:'#E8C27E', svg:sv([[15,32],[27,33],[21,22],[33,22],[38,33]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#E8C27E" stroke="${I}" stroke-width="2"/><circle cx="${x-2}" cy="${y-2}" r="2" fill="#fff" opacity=".5"/>`).join(''))},
  raisins:  {label:'Raisins', color:'#5B2E4A', svg:sv(pile([[14, 30, 20], [26, 32, -30], [36, 26, 40], [20, 19, -10], [31, 16, 30]], 6, 4.5, '#5B2E4A'))},
  pepper:   {label:'Pepper', color:'#FF6F61', svg:sv(`<path d="M14 16c-6 4-6 18 0 24 4 4 8 2 10 0 2 2 6 4 10 0 6-6 6-20 0-24-4-3-8-1-10 1-2-2-6-4-10-1z" fill="#FF6F61" ${sk}/><path d="M24 15c0-5 2-8 6-9" stroke="#5BAE3F" stroke-width="3" stroke-linecap="round" fill="none"/>`)},
  olive:    {label:'Olives', color:'#3D3A4A', svg:sv(`<ellipse cx="17" cy="26" rx="8" ry="10" fill="#3D3A4A" stroke="${I}" stroke-width="2.2"/><ellipse cx="31" cy="24" rx="8" ry="10" fill="#6B8E23" stroke="${I}" stroke-width="2.2"/><circle cx="31" cy="24" r="3" fill="#FF6F61"/>`)},
  feta:     {label:'Feta', color:'#FFFFFF', svg:sv(`<path d="M10 18l14-8 14 8v16l-14 8-14-8z" fill="#fff" ${sk}/><path d="M10 18l14 8 14-8M24 26v16" stroke="${I}" stroke-width="2" fill="none"/>`)},
  lemon:    {label:'Lemon', color:'#FFE04D', svg:sv(`<ellipse cx="24" cy="25" rx="16" ry="12" fill="#FFE04D" ${sk}/><path d="M8 25H4M40 25h4" stroke="${I}" stroke-width="2.5" stroke-linecap="round"/><path d="M18 20q6-3 12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`)},
  strawberry:{label:'Strawberry', color:'#FF4D5E', svg:sv(`<path d="M24 44C12 36 8 26 10 18c4-6 24-6 28 0 2 8-2 18-14 26z" fill="#FF4D5E" ${sk}/><path d="M14 16l4-8 6 5 6-5 4 8z" fill="#5BAE3F" stroke="${I}" stroke-width="2" stroke-linejoin="round"/>${[[18,24],[29,24],[24,31],[18,32],[30,32]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2" fill="#FFE08A"/>`).join('')}`)},
  banana:   {label:'Banana', color:'#FFD84D', svg:sv(`<path d="M8 12c2 18 14 28 32 24-2 4-8 7-14 6C14 40 6 28 6 12z" fill="#FFD84D" ${sk}/><path d="M7 12l1-5" stroke="#8A5A3B" stroke-width="3" stroke-linecap="round"/>`)},
  chocolate:{label:'Chocolate', color:'#6B3E2A', svg:sv(`<rect x="8" y="10" width="32" height="28" rx="4" fill="#6B3E2A" ${sk}/><path d="M8 24h32M19 10v28M29 10v28" stroke="#4A2A1B" stroke-width="2"/>`)},
  apple:    {label:'Apple', color:'#FF6F61', svg:ART.apple},
  lettuce:  {label:'Lettuce', color:'#86CF63', svg:ART.lettuce}
};
const UNSAFE_FOR_PETS = ['chocolate', 'onion'];

/* ---------- cooking tools (64 x 64) ---------- */
const TOOL = {
  knife: `<svg viewBox="0 0 64 64"><g transform="rotate(20 32 32)"><path d="M28 4h10v38l-10 6z" fill="#E4E8F0" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><rect x="27" y="42" width="11" height="18" rx="4" fill="#A0704E" stroke="${I}" stroke-width="3"/></g></svg>`,
  spoon: `<svg viewBox="0 0 64 64"><g transform="rotate(25 32 32)"><ellipse cx="32" cy="15" rx="10" ry="13" fill="#D9A066" stroke="${I}" stroke-width="3"/><rect x="29" y="26" width="6" height="34" rx="3" fill="#D9A066" stroke="${I}" stroke-width="3"/></g></svg>`,
  whisk: `<svg viewBox="0 0 64 64"><g transform="rotate(25 32 32)"><path d="M32 38C18 30 20 4 32 4s14 26 0 34zM32 38C26 30 26 6 32 4M32 38c6-8 6-32 0-34" fill="none" stroke="${I}" stroke-width="2.5"/><rect x="29" y="37" width="6" height="23" rx="3" fill="#FF6F61" stroke="${I}" stroke-width="3"/></g></svg>`,
  fork:  `<svg viewBox="0 0 64 64"><g transform="rotate(25 32 32)"><path d="M22 4v14a10 10 0 0 0 20 0V4M32 4v18M27 4v16M37 4v16" fill="none" stroke="${I}" stroke-width="3" stroke-linecap="round"/><rect x="29" y="28" width="6" height="32" rx="3" fill="#B8C0CF" stroke="${I}" stroke-width="3"/></g></svg>`,
  pin:   `<svg viewBox="0 0 64 64"><rect x="14" y="24" width="36" height="16" rx="8" fill="#E8C27E" stroke="${I}" stroke-width="3"/><rect x="2" y="28" width="14" height="8" rx="4" fill="#D9A066" stroke="${I}" stroke-width="3"/><rect x="48" y="28" width="14" height="8" rx="4" fill="#D9A066" stroke="${I}" stroke-width="3"/></svg>`,
  flame: `<svg viewBox="0 0 64 64"><path d="M32 6c4 12 16 16 16 32a16 16 0 0 1-32 0c0-8 6-12 8-20 4 6 4 10 8 12 0-8-2-16 0-24z" fill="#FF8A3D" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><path d="M32 34c3 6 8 8 8 14a8 8 0 0 1-16 0c0-4 4-8 8-14z" fill="#FFC93C"/></svg>`,
  hand:  ART.paw
};
const POTS = {
  bowl:  {label:'Bowl', svg:sv(`<path d="M4 20h40c0 12-9 20-20 20S4 32 4 20z" fill="#4FB3F2" ${sk}/>`)},
  pot:   {label:'Pot', svg:sv(`<rect x="8" y="16" width="32" height="24" rx="4" fill="#9AA6BA" ${sk}/><rect x="4" y="12" width="40" height="6" rx="3" fill="#7D8AA3" ${sk}/>`)},
  pan:   {label:'Pan', svg:sv(`<rect x="32" y="23" width="14" height="6" rx="3" fill="#3A3F4B" ${sk}/><ellipse cx="20" cy="26" rx="17" ry="11" fill="#3A3F4B" ${sk}/>`)},
  pizza: {label:'Pizza', svg:sv(`<circle cx="24" cy="24" r="18" fill="#E8C27E" ${sk}/><circle cx="24" cy="24" r="13" fill="#E2483D"/>`)},
  plate: {label:'Plate', svg:sv(`<ellipse cx="24" cy="28" rx="20" ry="10" fill="#fff" ${sk}/><ellipse cx="24" cy="27" rx="13" ry="6" fill="none" stroke="#DDE3EC" stroke-width="2"/>`)}
};

/* ---------- recipes ---------- */
const RECIPES = [
  {id:'pizza', country:'Italy', dish:'Pizza Margherita', short:'pizza',
   fact:"Pizza Margherita comes from Naples in Italy. Its red, white and green toppings look like the Italian flag!",
   steps:[
     {t:'add', c:'bowl', items:['flour','water','oil']},
     {t:'mix', c:'bowl', blob:'#F3E2B8', say:'Stir it all together to make dough.'},
     {t:'roll', c:'board', base:'pizza', say:'Roll the dough flat with the rolling pin.'},
     {t:'spread', c:'board', layer:'sauce', say:'Spread the tomato sauce all over.'},
     {t:'top', c:'board', items:['cheese','basil','tomato'], min:6},
     {t:'cook', c:'oven'}
   ]},
  {id:'sushi', country:'Japan', dish:'Sushi rolls', short:'sushi rolls', plural:true,
   fact:"In Japan, sushi is often eaten with chopsticks, but using your fingers is fine too!",
   steps:[
     {t:'spread', c:'mat', base:'nori', layer:'rice', say:'Spread sticky rice on the seaweed.'},
     {t:'chop', item:'cucumber'},
     {t:'add', c:'mat', items:['cucumber','fish','avocado']},
     {t:'roll', c:'mat', to:'sushiroll', say:'Roll it up tight with the bamboo mat.'},
     {t:'chop', item:'dish', to:'sushi', say:'Slice the roll into pieces. Tap it with the knife!'}
   ]},
  {id:'tacos', country:'Mexico', dish:'Tacos', short:'tacos', plural:true,
   fact:"In Mexico, tacos are often made with soft corn tortillas.",
   steps:[
     {t:'chop', item:'tomato'},
     {t:'chop', item:'lettuce'},
     {t:'cook', c:'pan', base:'tortilla', say:'Warm the tortilla in the pan.'},
     {t:'add', c:'plate', items:['beans','tomato','lettuce','cheese']},
     {t:'fold', c:'plate', to:'taco', count:1, say:'Tap the tortilla to fold your taco!'}
   ]},
  {id:'curry', country:'India', dish:'Vegetable curry', short:'curry',
   fact:"In India, many families eat curry with rice, or with a flatbread called roti.",
   steps:[
     {t:'chop', item:'onion'},
     {t:'chop', item:'carrot'},
     {t:'add', c:'pot', items:['onion','carrot','peas','tomato','spices']},
     {t:'mix', c:'pot', blob:'#F2A33A'},
     {t:'cook', c:'pot', say:'Let the curry bubble in the pot.'}
   ]},
  {id:'dumplings', country:'China', dish:'Dumplings', short:'dumplings', plural:true,
   fact:"In China, families often make dumplings together for Lunar New Year.",
   steps:[
     {t:'chop', item:'cabbage'},
     {t:'chop', item:'carrot'},
     {t:'add', c:'bowl', items:['cabbage','carrot','chicken','soy']},
     {t:'mix', c:'bowl', blob:'#C9D8A0', say:'Mix up the filling.'},
     {t:'fold', c:'board', base:'wrappers', count:4, say:'Tap each wrapper to fill it and fold it into a dumpling.'},
     {t:'cook', c:'steamer'}
   ]},
  {id:'crepes', country:'France', dish:'Crêpes', short:'crêpes', plural:true,
   fact:"In France, people eat crêpes on Candlemas, the 2nd of February.",
   steps:[
     {t:'add', c:'bowl', items:['flour','egg','milk']},
     {t:'mix', c:'bowl', blob:'#F7E3A1', tool:'whisk', say:'Whisk it into a smooth batter.'},
     {t:'cook', c:'pan', base:'crepe', flip:true, say:'Cook the crêpe in the pan. Flip it when it says flip!'},
     {t:'top', c:'plate', items:['strawberry','banana','chocolate'], min:5}
   ]},
  {id:'couscous', country:'Morocco', dish:'Vegetable couscous', short:'couscous',
   fact:"In Morocco, families often share couscous from one big plate on Fridays.",
   steps:[
     {t:'add', c:'pot', items:['couscous','water']},
     {t:'cook', c:'pot', blob:'#F1D38A', say:'Heat it up so the couscous soaks up the water.'},
     {t:'mix', c:'pot', tool:'fork', say:'Fluff it up with a fork.'},
     {t:'chop', item:'carrot'},
     {t:'chop', item:'pepper'},
     {t:'add', c:'pot', items:['carrot','pepper','chickpeas','raisins']}
   ]},
  {id:'salad', country:'Greece', dish:'Greek salad', short:'Greek salad',
   fact:"In Greece this salad is called horiatiki, which means village salad.",
   steps:[
     {t:'chop', item:'tomato'},
     {t:'chop', item:'cucumber'},
     {t:'add', c:'bowl', items:['tomato','cucumber','olive','feta']},
     {t:'add', c:'bowl', items:['oil','lemon'], say:'Drizzle on olive oil and a squeeze of lemon.'},
     {t:'mix', c:'bowl', toss:true, say:'Toss the salad.'}
   ]}
];
const FREE = {id:'free', dish:'My own dish', steps:[{t:'pick'}, {t:'free'}]};

/* ---------- stage layout (viewBox 400 x 300) ---------- */
const VIEW = {
  bowl:   {cx:200, cy:165, irx:78, iry:12, bx:200, by:172, brx:114, bry:26},
  pot:    {cx:200, cy:136, irx:76, iry:10, bx:200, by:142, brx:108, bry:22},
  pan:    {cx:200, cy:192, irx:72, iry:20, bx:200, by:194, brx:100, bry:30, baseRx:92, k:.34},
  board:  {cx:190, cy:208, irx:72, iry:26, baseRx:110, k:.42},
  plate:  {cx:200, cy:212, irx:78, iry:22, baseRx:100, k:.3},
  mat:    {cx:200, cy:210, irx:85, iry:6, k:.3},
  steamer:{cx:200, cy:148, irx:80, iry:14, baseRx:84, k:.25}
};
const DEFS = `<defs><filter id="kToast"><feColorMatrix type="matrix" values="1 0.08 0 0 0  0.02 0.86 0 0 0  0 0 0.62 0 0  0 0 0 1 0"/></filter></defs>`;

function icon(id, x, y, s, r = 0){
  return `<g transform="rotate(${r} ${x.toFixed(1)} ${y.toFixed(1)})">${ING[id].svg.replace('<svg ', `<svg x="${(x - s/2).toFixed(1)}" y="${(y - s/2).toFixed(1)}" width="${s}" height="${s}" `)}</g>`;
}
function itemSVG(it, P, a){
  const x = P.cx + it.ux * P.irx, y = P.cy + it.uy * P.iry, s = 40;
  const g = it.ch ? [[-10, -3, 0], [9, -6, 70], [1, 6, 140]].map(([ox, oy, rr]) => icon(it.id, x + ox, y + oy, s * .5, it.r + rr)).join('') : icon(it.id, x, y, s, it.r);
  return a < 1 ? `<g opacity="${a.toFixed(2)}">${g}</g>` : g;
}
function dots(d, x, y, r){
  const cols = [...new Set(d.items.map(i => ING[i.id].color))].slice(0, 3);
  return cols.map((c, j) => `<circle cx="${x + [-r, r, 0][j]}" cy="${y + [1, 1, -r][j]}" r="${r * .8}" fill="${c}"/>`).join('');
}
function dumpling(x, y){
  return `<path d="M${x-30} ${y+8}Q${x} ${y-34} ${x+30} ${y+8}Q${x} ${y+16} ${x-30} ${y+8}Z" fill="#FBF6EC" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><path d="M${x-10} ${y-10}q2 8 0 14M${x} ${y-13}q2 9 0 16M${x+10} ${y-10}q2 8 0 14" stroke="#D8CFBF" stroke-width="2" fill="none"/>`;
}
function baseSVG(d, P){
  const cx = P.cx, cy = P.cy, k = P.k || .4;
  switch (d.base) {
    case 'pizza': {
      const rx = 45 + 65 * d.roll, ry = rx * k;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#E8C27E" stroke="${I}" stroke-width="3"/><ellipse cx="${cx}" cy="${cy-2}" rx="${rx-9}" ry="${Math.max(4, ry-7)}" fill="#F7E3B5"/>`
        + (d.sauce ? `<ellipse cx="${cx}" cy="${cy-2}" rx="${rx-13}" ry="${Math.max(3, ry-10)}" fill="#E2483D" opacity="${d.sauce.toFixed(2)}"/>` : '');
    }
    case 'nori':
      return `<rect x="${cx-115}" y="${cy-30}" width="230" height="56" rx="6" fill="#27402E" stroke="${I}" stroke-width="3"/>`
        + (d.rice ? `<rect x="${cx-107}" y="${cy-24}" width="214" height="44" rx="5" fill="#FFFFFF" opacity="${d.rice.toFixed(2)}"/>` : '');
    case 'sushiroll':
      return `<rect x="${cx-120}" y="${cy-24}" width="240" height="46" rx="23" fill="#27402E" stroke="${I}" stroke-width="3"/><ellipse cx="${cx+104}" cy="${cy-1}" rx="15" ry="21" fill="#fff" stroke="${I}" stroke-width="3"/>${dots(d, cx + 104, cy - 1, 5)}`;
    case 'sushi':
      return [0, 1, 2, 3, 4, 5].map(i => { const x = cx - 100 + i * 40, y = cy + (i % 2 ? 5 : -5);
        return `<ellipse cx="${x}" cy="${y}" rx="18" ry="16" fill="#27402E" stroke="${I}" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="13" ry="11" fill="#fff"/>${dots(d, x, y, 4)}`; }).join('');
    case 'tortilla': case 'crepe': {
      const rx = P.baseRx || 95, ry = rx * k, crepe = d.base === 'crepe';
      const spots = (d.cooked || d.flipped) ? [[-.5, -.3], [.3, .2], [.1, -.5], [-.2, .45], [.6, -.1]].map(([a, b]) =>
        `<ellipse cx="${cx + a*rx}" cy="${cy + b*ry}" rx="${rx*.07}" ry="${ry*.14}" fill="${crepe ? '#E0AE55' : '#C99A55'}" opacity=".7"/>`).join('') : '';
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${crepe ? '#F4CF7E' : '#F2D49B'}" stroke="${I}" stroke-width="3"/>${spots}`;
    }
    case 'taco': {
      const fill = d.items.slice(0, 6).map((it, j) => `<circle cx="${cx-62+j*25}" cy="${cy-30-(j%2)*7}" r="15" fill="${ING[it.id].color}" stroke="${I}" stroke-width="2.5"/>`).join('');
      return fill + `<path d="M${cx-100} ${cy-32}A100 74 0 0 0 ${cx+100} ${cy-32}Z" fill="#F2D49B" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><circle cx="${cx-40}" cy="${cy+5}" r="5" fill="#C99A55" opacity=".7"/><circle cx="${cx+30}" cy="${cy+15}" r="6" fill="#C99A55" opacity=".7"/>`;
    }
    case 'wrappers': {
      const w = P.baseRx || 90;
      return [-.78, -.26, .26, .78].map((f, j) => { const x = cx + f * w * 1.15, y = cy + (j % 2 ? 6 : -4);
        return j < d.folded ? dumpling(x, y) : `<ellipse cx="${x}" cy="${y}" rx="28" ry="${Math.max(8, 28 * k * 1.6)}" fill="#FBF6EC" stroke="${I}" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="${d.fill || '#C9D8A0'}"/>`; }).join('');
    }
  }
  return '';
}
function contents(d, v){
  const P = VIEW[v]; let o = '';
  if (d.blob && P.brx) o += `<ellipse cx="${P.bx}" cy="${P.by}" rx="${P.brx}" ry="${P.bry}" fill="${d.blob}" opacity="${d.blobA.toFixed(2)}"/>`;
  if (d.base) o += baseSVG(d, P);
  if (!['taco', 'sushi', 'sushiroll', 'wrappers'].includes(d.base))
    o += d.items.map(it => { const a = it.mixing ? 1 - d.blobA : 1; return a > .02 ? itemSVG(it, P, a) : ''; }).join('');
  if (run && run.flipAnim) o = `<g class="k-flip">${o}</g>`;
  return d.cooked ? `<g filter="url(#kToast)">${o}</g>` : o;
}
const steam = (x, y) => `<g class="k-steam">${[-30, 0, 30].map((dx, j) => `<circle cx="${x+dx}" cy="${y}" r="13" fill="#fff" opacity="0" style="animation-delay:${j*.7}s"/>`).join('')}</g>`;
const burner = (y, on) => `<ellipse cx="200" cy="${y}" rx="105" ry="10" fill="#3A3F4B"/>` + (on ? [135, 168, 200, 232, 265].map(x => `<path class="k-flame" d="M${x} ${y}q-9-10 0-26q9 14 0 26z" fill="#FF8A3D" stroke="#E0592A" stroke-width="1.5"/>`).join('') : '');
const boardSVG = () => `<rect x="50" y="168" width="290" height="88" rx="22" fill="#D9A066" stroke="${I}" stroke-width="4"/><circle cx="318" cy="212" r="8" fill="#B07C46" stroke="${I}" stroke-width="3"/>`;

function containerSVG(v){
  const d = run.dish, on = !!(run.cook && run.cook.on), hot = on || d.cooked;
  switch (v) {
    case 'bowl':
      return `<ellipse cx="200" cy="170" rx="120" ry="30" fill="#BFE6FF" stroke="${I}" stroke-width="4"/>${contents(d, 'bowl')}<path d="M80 170Q84 262 200 264Q316 262 320 170A120 30 0 0 1 80 170Z" fill="#4FB3F2" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><path d="M110 215Q200 240 290 215" stroke="#fff" stroke-width="5" fill="none" opacity=".4" stroke-linecap="round"/>`;
    case 'pot':
      return burner(274, on) + `<rect x="58" y="150" width="32" height="14" rx="7" fill="#7D8AA3" stroke="${I}" stroke-width="3"/><rect x="310" y="150" width="32" height="14" rx="7" fill="#7D8AA3" stroke="${I}" stroke-width="3"/><ellipse cx="200" cy="140" rx="115" ry="26" fill="#3A3F4B" stroke="${I}" stroke-width="4"/>${contents(d, 'pot')}`
        + (on ? `<g class="k-bubbles">${[[150, 142], [200, 146], [245, 138], [180, 134], [228, 148]].map(([x, y], j) => `<circle cx="${x}" cy="${y}" r="6" fill="#fff" opacity=".6" style="animation-delay:${j*.2}s"/>`).join('')}</g>` : '')
        + `<path d="M85 140L92 250Q200 268 308 250L315 140A115 26 0 0 1 85 140Z" fill="#9AA6BA" stroke="${I}" stroke-width="4" stroke-linejoin="round"/>${hot ? steam(200, 110) : ''}`;
    case 'pan':
      return burner(264, on) + `<rect x="318" y="188" width="78" height="16" rx="8" fill="#3A3F4B" stroke="${I}" stroke-width="3"/><ellipse cx="200" cy="200" rx="125" ry="44" fill="#3A3F4B" stroke="${I}" stroke-width="4"/><ellipse cx="200" cy="194" rx="108" ry="34" fill="#59606E"/>${contents(d, 'pan')}${hot ? steam(200, 160) : ''}`;
    case 'board':
      return boardSVG() + contents(d, 'board');
    case 'plate':
      return `<ellipse cx="200" cy="222" rx="150" ry="46" fill="#fff" stroke="${I}" stroke-width="4"/><ellipse cx="200" cy="218" rx="112" ry="32" fill="none" stroke="#DDE3EC" stroke-width="3"/>${contents(d, 'plate')}`;
    case 'mat':
      return `<rect x="50" y="175" width="300" height="80" rx="8" fill="#D9BE84" stroke="${I}" stroke-width="4"/>${Array.from({length:17}, (_, j) => `<line x1="${66+j*17}" y1="177" x2="${66+j*17}" y2="253" stroke="#B89A5E" stroke-width="2"/>`).join('')}${contents(d, 'mat')}`;
    case 'oven':
      return `<rect x="70" y="24" width="260" height="240" rx="20" fill="#E4E8F0" stroke="${I}" stroke-width="4"/>${[110, 150, 190].map(x => `<circle cx="${x}" cy="50" r="10" fill="#fff" stroke="${I}" stroke-width="3"/>`).join('')}<circle cx="290" cy="50" r="7" fill="${on ? '#FF6F61' : '#B8C0CF'}" stroke="${I}" stroke-width="2"/>`
        + `<rect x="130" y="70" width="140" height="10" rx="5" fill="#9AA6BA" stroke="${I}" stroke-width="3"/><rect x="96" y="90" width="208" height="150" rx="14" fill="#3A3F4B" stroke="${I}" stroke-width="4"/>`
        + (on ? `<rect class="k-glow" x="100" y="94" width="200" height="142" rx="11" fill="#FFB25C" opacity=".9"/>` : '')
        + `<g transform="translate(200 175) scale(.62) translate(-190 -208)">${contents(d, 'board')}</g><rect x="100" y="94" width="200" height="40" rx="10" fill="#fff" opacity=".12"/>${hot ? steam(200, 30) : ''}`;
    case 'steamer':
      return burner(270, on) + `<ellipse cx="200" cy="150" rx="120" ry="30" fill="#F7EBD0" stroke="${I}" stroke-width="4"/>${contents(d, 'steamer')}<path d="M80 150L86 240Q200 258 314 240L320 150A120 30 0 0 1 80 150Z" fill="#D9B26F" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><path d="M84 190Q200 212 316 190M86 220Q200 240 314 220" stroke="#B08A48" stroke-width="3" fill="none"/>`
        + (on ? `<path d="M76 152Q200 30 324 152Z" fill="#E2C080" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><rect x="186" y="78" width="28" height="14" rx="6" fill="#B08A48" stroke="${I}" stroke-width="3"/>${steam(200, 70)}` : (hot ? steam(200, 110) : ''));
  }
  return '';
}
function chopSVG(){
  const s = cur(); let o = boardSVG();
  if (s.item === 'dish') o += contents(run.dish, 'board');
  else if (run.pieces) o += run.pieces.map(p => icon(s.item, p.x, p.y, 38, p.r)).join('');
  else o += icon(s.item, 195, 200, 120, 0);
  if (run.taps < 5) for (let k = 0; k < run.taps; k++) o += `<line x1="${132+k*30}" y1="150" x2="${124+k*30}" y2="252" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
  return o;
}

/* ---------- finished dishes for cards and serving (viewBox 120 x 100) ---------- */
const PLATE = `<ellipse cx="60" cy="74" rx="56" ry="20" fill="#fff" stroke="${I}" stroke-width="3"/><ellipse cx="60" cy="72" rx="40" ry="12" fill="none" stroke="#DDE3EC" stroke-width="2"/>`;
const BOWL_BACK = top => `<ellipse cx="60" cy="54" rx="42" ry="12" fill="${top}" stroke="${I}" stroke-width="3"/>`;
const BOWL_FRONT = `<path d="M18 54Q22 88 60 90Q98 88 102 54A42 12 0 0 1 18 54Z" fill="#4FB3F2" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`;
const smallDumpling = (x, y) => `<path d="M${x-11} ${y+3}Q${x} ${y-13} ${x+11} ${y+3}Q${x} ${y+6} ${x-11} ${y+3}Z" fill="#FBF6EC" stroke="${I}" stroke-width="2" stroke-linejoin="round"/>`;
const bits = (pts, shape) => pts.map(p => shape(...p)).join('');
function dishArt(id){
  switch (id) {
    case 'pizza': return PLATE + `<ellipse cx="60" cy="66" rx="46" ry="19" fill="#E8C27E" stroke="${I}" stroke-width="3"/><ellipse cx="60" cy="65" rx="38" ry="14" fill="#E2483D"/>`
      + bits([[46,62,8,4],[70,68,9,4],[62,58,7,3],[42,70,6,3],[80,62,6,3]], (x, y, a, b) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#FFF1C2"/>`)
      + bits([[56,68,30],[74,58,-20],[38,63,10]], (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" transform="rotate(${r} ${x} ${y})" fill="#3FA34D"/>`);
    case 'sushi': return PLATE + bits([[36,64],[60,60],[84,64],[47,77],[73,77]], (x, y) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="10" fill="#27402E" stroke="${I}" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="8.5" ry="6.5" fill="#fff"/><circle cx="${x-2}" cy="${y}" r="3" fill="#FF9E7A"/><circle cx="${x+3}" cy="${y-1}" r="2" fill="#7CC86A"/>`);
    case 'tacos': return PLATE + bits([[40,68],[80,68]], (x, y) => `<circle cx="${x-12}" cy="${y-10}" r="6.5" fill="#86CF63" stroke="${I}" stroke-width="2"/><circle cx="${x}" cy="${y-13}" r="6.5" fill="#E2483D" stroke="${I}" stroke-width="2"/><circle cx="${x+12}" cy="${y-10}" r="6.5" fill="#FFD84D" stroke="${I}" stroke-width="2"/><path d="M${x-24} ${y-8}A24 20 0 0 0 ${x+24} ${y-8}Z" fill="#F2D49B" stroke="${I}" stroke-width="2.5" stroke-linejoin="round"/>`);
    case 'curry': return PLATE + BOWL_BACK('#F2A33A') + bits([[46,52,'#F28C3B'],[60,56,'#7CCB5B'],[72,51,'#F28C3B'],[56,49,'#7CCB5B'],[82,55,'#E2483D'],[38,56,'#7CCB5B']], (x, y, c) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>`) + BOWL_FRONT;
    case 'dumplings': return PLATE + `<ellipse cx="60" cy="56" rx="42" ry="12" fill="#F7EBD0" stroke="${I}" stroke-width="3"/>` + bits([[42,55],[78,55],[60,51],[60,61]], smallDumpling)
      + `<path d="M18 56L22 80Q60 92 98 80L102 56A42 12 0 0 1 18 56Z" fill="#D9B26F" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><path d="M22 70Q60 80 98 70" stroke="#B08A48" stroke-width="2" fill="none"/>`;
    case 'crepes': return PLATE + `<ellipse cx="60" cy="66" rx="44" ry="17" fill="#F4CF7E" stroke="${I}" stroke-width="3"/>`
      + bits([[46,58],[66,56],[80,64]], (x, y) => `<path d="M${x} ${y+8}c-6-4-6-10 0-10s6 6 0 10z" fill="#FF4D5E" stroke="${I}" stroke-width="1.5"/>`)
      + bits([[56,70],[72,70],[40,67]], (x, y) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#FFF1B0" stroke="${I}" stroke-width="1.5"/>`)
      + `<path d="M30 62q7-6 14 0t14 0 14 0 14 0" stroke="#6B3E2A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 'couscous': return PLATE + `<path d="M20 72Q60 24 100 72Z" fill="#F1D38A" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`
      + bits([[48,58,'#F28C3B'],[62,49,'#FF6F61'],[72,62,'#E8C27E'],[56,66,'#5B2E4A'],[38,67,'#E8C27E'],[82,68,'#F28C3B'],[66,58,'#5B2E4A']], (x, y, c) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}" stroke="${I}" stroke-width="1"/>`);
    case 'salad': return PLATE + BOWL_BACK('#86CF63') + bits([[44,50,'#E2483D'],[58,54,'#7CC86A'],[72,49,'#fff'],[82,55,'#3D3A4A'],[50,57,'#fff'],[66,46,'#E2483D'],[36,55,'#3D3A4A']], (x, y, c) => `<rect x="${x-4}" y="${y-4}" width="8" height="8" rx="2" fill="${c}" stroke="${I}" stroke-width="1.5"/>`) + BOWL_FRONT;
    case 'free': return PLATE + BOWL_BACK('#FFB3C7') + bits([[44,52,'#FFD84D'],[60,50,'#7CC86A'],[76,53,'#FF4D5E'],[52,56,'#4FB3F2']], (x, y, c) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`) + BOWL_FRONT
      + bits([[22,22,6],[98,16,5],[86,34,4]], (x, y, r) => `<path d="M${x} ${y-r*2}L${x+r*.6} ${y-r*.6}L${x+r*2} ${y}L${x+r*.6} ${y+r*.6}L${x} ${y+r*2}L${x-r*.6} ${y+r*.6}L${x-r*2} ${y}L${x-r*.6} ${y-r*.6}Z" fill="#FFC93C" stroke="${I}" stroke-width="1.5"/>`);
  }
  return PLATE;
}

/* ---------- screens ---------- */
document.querySelector('.app').insertAdjacentHTML('beforeend', `
  <section class="screen" id="scr-kitchen" hidden>
    <div class="k-head"><h2 class="scene-title">World Kitchen</h2><span class="pill" id="kPassport"></span></div>
    <p class="hint">Cook a dish from around the world, or invent your very own!</p>
    <div class="k-grid" id="kGrid"></div>
  </section>
  <section class="screen" id="scr-cook" hidden>
    <div class="k-top"><button class="btn small" id="kBack">All recipes</button><h2 class="scene-title" id="kTitle"></h2></div>
    <div class="counter" id="kSteps" aria-label="Recipe steps"></div>
    <div class="stage k-stage" id="kStage">
      <div id="kScene"></div>
      <div class="bubble" id="kBubble" hidden></div>
      <div class="pet k-pet" id="kPet"></div>
      <div class="k-tool" id="kTool"></div>
    </div>
    <div class="cue" aria-live="polite"><div class="big" id="kCueIcon"></div><div class="k-cue-text"><p id="kCue"></p><div class="k-prog" id="kProgWrap" hidden><i id="kProg"></i></div></div></div>
    <div class="k-tray" id="kTray"></div>
  </section>`);
SCREENS.push('kitchen', 'cook');
MODE_OF.kitchen = MODE_OF.cook = 'kitchen';
ROOT.kitchen = () => 'kitchen';
ENTER.kitchen = enterKitchen;
ENTER.cook = enterCook;
LEAVE.push(name => { if (name !== 'cook') stopCook(); });

// Without a pet yet, a stand-in chef cooks along.
const chef = () => state.pet || {type:'cat', color:'ginger', name:'Chef Pip'};
const cookedLog = () => (state.cooked = state.cooked || {});
let run = null, rq = 0;
const cur = () => run && run.r.steps[run.i];

function enterKitchen(){
  const log = cookedLog(), countries = RECIPES.filter(r => log[r.id]).length;
  $('#kPassport').innerHTML = `${STAR_SVG}<span>${countries} of ${RECIPES.length} countries cooked</span>`;
  $('#kGrid').innerHTML = RECIPES.map(r => { const n = log[r.id] || 0;
    return `<button class="k-card" data-r="${r.id}"><svg viewBox="0 0 120 100" aria-hidden="true">${dishArt(r.id)}</svg><b>${r.country}</b><span>${r.dish}</span><em class="${n ? 'done' : 'new'}">${n ? `Cooked ${n === 1 ? 'once' : n + ' times'}` : 'New!'}</em></button>`; }).join('')
    + `<button class="k-card k-free" data-r="free"><svg viewBox="0 0 120 100" aria-hidden="true">${dishArt('free')}</svg><b>Make your own</b><span>Use any food you like</span><em class="new">Invent!</em></button>`;
}
$('#kGrid').onclick = e => { const b = e.target.closest('[data-r]'); if (b) { sfx.pop(); startRecipe(b.dataset.r); } };
$('#kBack').onclick = () => { sfx.pop(); show('kitchen'); };

function stopCook(){
  if (!run) return;
  clearInterval(run.timer); clearTimeout(run.next);
  run = null;
}
function startRecipe(id){
  stopCook();
  const r = id === 'free' ? FREE : RECIPES.find(x => x.id === id);
  run = {r, i:0, free: id === 'free', dish:newDish(), chopped:new Set(), used:new Set(), view:'empty'};
  show('cook');
}
function newDish(){ return {base:null, roll:0, sauce:0, rice:0, items:[], blob:null, blobA:0, cooked:false, folded:0, fill:null, flipped:false}; }
function enterCook(){
  if (!run) return show('kitchen');
  $('#kTitle').textContent = run.free ? 'Make your own dish' : `${run.r.dish} from ${run.r.country}`;
  $('#kPet').innerHTML = petSVG(chef(), {acc:Object.assign({}, state.acc, {hat:false, chef:true})});
  $('#kStage').classList.remove('serving');
  startStep();
}

/* ---------- steps ---------- */
const listOf = ids => { const n = ids.map(id => ING[id].label.toLowerCase()); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0]; };
const BASE_NAME = {tortilla:'tortilla', nori:'rice', pizza:'pizza', crepe:'crêpe'};
const COOK_TEXT = {oven:'Bake it in the hot oven.', pot:'Cook it in the pot.', pan:'Cook it in the pan.', steamer:'Steam the dumplings.'};
const HINT = {chop:'Tap the food to chop it.', mix:'Rub round and round on the food.', spread:'Rub all over the food to spread it.', roll:'Slide left and right across the food.', fold:'Tap the food.'};
const PRAISE = ['Great job, chef!', 'Yummy!', 'You did it!', 'Wow!', 'Super cooking!', 'Smells good!'];

function stepText(s){
  if (s.say) return s.say;
  const d = run.dish;
  switch (s.t) {
    case 'chop': return `Chop the ${ING[s.item].label.toLowerCase()}. Tap it with the knife!`;
    case 'add': return d.base ? `Put the ${listOf(s.items)} on the ${BASE_NAME[d.base] || 'food'}.` : `Put the ${listOf(s.items)} in the ${s.c}.`;
    case 'mix': return 'Stir it round and round.';
    case 'cook': return COOK_TEXT[s.c];
    case 'top': return `Add ${listOf(s.items)}. Tap the food to put them on!`;
    case 'pick': return 'What will you cook in? Pick one!';
    case 'free': return 'Add any food you like. Then chop, mix, cook and serve it!';
  }
  return '';
}
function cueIcon(s){
  switch (s.t) {
    case 'chop': return TOOL.knife;
    case 'mix': return TOOL[s.tool || 'spoon'];
    case 'spread': return TOOL.spoon;
    case 'roll': return TOOL.pin;
    case 'cook': return TOOL.flame;
    case 'fold': return TOOL.hand;
    case 'add': case 'top': return ING[s.items[0]].svg;
    case 'pick': return POTS.pot.svg;
    case 'free': return TOOL.spoon;
  }
  return STAR_SVG;
}
function allRecipeItems(r){ const out = new Set(); r.steps.forEach(s => { (s.items || []).forEach(i => out.add(i)); if (s.item && s.item !== 'dish') out.add(s.item); }); return out; }

function startStep(){
  const s = cur();
  if (!s) return serveStep();
  Object.assign(run, {prog:0, taps:0, placed:0, added:new Set(), sel:null, done:false, pieces:null, cook:null, flipAnim:false, serving:false, served:false});
  const d = run.dish;
  if (s.t === 'chop') run.view = 'board';
  else if (s.c) run.view = s.c;
  if (s.base && d.base !== s.base) {
    if (d.blob) d.fill = d.blob;
    Object.assign(d, {base:s.base, items:[], blob:null, blobA:0, cooked:false, folded:0, roll: s.t === 'roll' ? 0 : 1});
  }
  if (s.t === 'mix') { d.items.forEach(it => it.mixing = !!s.blob); if (s.blob) { d.blob = s.blob; d.blobA = 0; } }
  if (s.t === 'spread') d[s.layer] = 0;
  if (s.t === 'add') { const used = allRecipeItems(run.r); run.tray = shuffle([...s.items, ...shuffle(Object.keys(ING).filter(k => !used.has(k))).slice(0, 2)]); }
  else if (s.t === 'top') run.tray = s.items;
  else if (s.t === 'free') run.tray = Object.keys(ING);
  else run.tray = null;
  setTool({chop:'knife', mix:s.tool || 'spoon', spread:'spoon', roll:'pin'}[s.t] || null);
  run.text = stepText(s);
  $('#kCue').textContent = run.text;
  $('#kCueIcon').innerHTML = cueIcon(s);
  setProg(0, ['chop', 'mix', 'spread', 'roll', 'cook'].includes(s.t));
  renderSteps(); renderTray(); renderScene();
  if (run.i === 0 && run.r.fact) { bubble('#kBubble', run.r.fact, 6500); say(`${run.r.fact} ${run.text}`); }
  else say(run.text);
}
function completeStep(delay = 1100){
  if (run.done) return;
  run.done = true; setTool(null); setProg(1, $('#kProgWrap').hidden === false);
  sfx.ding(); bubble('#kBubble', pick(PRAISE), 1400); animate($('#kPet'), 'do-happy', 900);
  run.next = setTimeout(() => { if (!run) return; run.i++; startStep(); }, delay);
}

/* ---------- drawing ---------- */
function renderScene(){
  if (!run) return;
  let body = '';
  if (run.serving) body = serveSVG();
  else if (cur() && cur().t === 'chop') body = chopSVG();
  else if (run.view !== 'empty') body = containerSVG(run.view);
  $('#kScene').innerHTML = `<svg viewBox="0 0 400 300" aria-hidden="true">${DEFS}${body}</svg>`;
}
function requestRender(){ if (!rq) rq = requestAnimationFrame(() => { rq = 0; renderScene(); }); }
function renderSteps(serving){
  const box = $('#kSteps');
  if (run.free) { box.hidden = true; return; }
  box.hidden = false;
  const n = run.r.steps.length + 1, at = serving ? n - 1 : run.i;
  box.innerHTML = Array.from({length:n}, (_, i) => `<i class="${i < at || (serving && i === at) ? 'on' : ''}"></i>`).join('');
  box.setAttribute('aria-label', `Step ${Math.min(at + 1, n)} of ${n}`);
}
function setProg(p, visible){
  $('#kProgWrap').hidden = !visible;
  $('#kProg').style.width = Math.round(p * 100) + '%';
}
function setTool(name){
  run.tool = name;
  $('#kTool').innerHTML = name ? TOOL[name] : '';
  $('#kStage').classList.toggle('show-tool', false);
}

/* ---------- tray ---------- */
const ingBtn = (id, used, on) => `<button class="food ${used ? 'used' : ''}" data-ing="${id}" ${on ? 'aria-pressed="true"' : ''}>${ING[id].svg}<span>${ING[id].label}</span></button>`;
function renderTray(){
  const t = $('#kTray'), s = cur();
  if (run.serving) return renderServeTray();
  if (!s) { t.innerHTML = ''; return; }
  switch (s.t) {
    case 'add':
      t.innerHTML = `<div class="foods">${run.tray.map(id => ingBtn(id, run.added.has(id), false)).join('')}</div>`; break;
    case 'top':
      t.innerHTML = `<div class="foods">${run.tray.map(id => ingBtn(id, false, run.sel === id)).join('')}</div>`
        + (run.placed >= (s.min || 4) && !run.done ? `<button class="btn go k-big" id="kDone">All done!</button>` : ''); break;
    case 'cook': {
      const lbl = {oven:'Turn on the oven', pot:'Turn on the heat', pan:'Turn on the heat', steamer:'Start steaming'}[s.c];
      t.innerHTML = run.cook && run.cook.wait ? `<button class="btn go k-big" id="kFlip">Flip!</button>`
        : run.cook || run.done ? `<p class="k-hint">Cooking… nearly ready!</p>`
        : `<button class="btn go k-big" id="kCook">${TOOL.flame}${lbl}</button>`; break;
    }
    case 'pick':
      t.innerHTML = `<div class="foods">${Object.entries(POTS).map(([k, v]) => `<button class="food" data-pick="${k}">${v.svg}<span>${v.label}</span></button>`).join('')}</div>`; break;
    case 'free':
      t.innerHTML = `<div class="k-tools">
          <button class="btn" data-tool="chop">${TOOL.knife}Chop</button>
          <button class="btn" data-tool="mix">${TOOL.spoon}Mix</button>
          <button class="btn" data-tool="cook">${TOOL.flame}Cook</button>
          <button class="btn go" data-tool="serve">${STAR_SVG}Serve</button>
        </div><div class="k-free-ings"><div class="foods">${run.tray.map(id => ingBtn(id, false, run.sel === id)).join('')}</div></div>`; break;
    default:
      t.innerHTML = `<p class="k-hint">${HINT[s.t] || ''}</p>`;
  }
}
$('#kTray').onclick = e => {
  if (!run) return;
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.ing) return trayIngredient(b.dataset.ing, b);
  if (b.dataset.pick) return pickPot(b.dataset.pick);
  if (b.dataset.tool) return freeTool(b.dataset.tool);
  if (b.id === 'kDone') { sfx.pop(); return completeStep(); }
  if (b.id === 'kCook') return cookStart();
  if (b.id === 'kFlip') return flip();
  if (b.id === 'kAgain') { sfx.pop(); return startRecipe(run.r.id); }
  if (b.id === 'kMore') { sfx.pop(); return show('kitchen'); }
  if (b.id === 'kServe') return serveIt();
};

function randomSpot(){ const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * .9; return {ux:Math.cos(a) * r, uy:Math.sin(a) * r}; }
function placeItem(id, spot){
  run.dish.items.push({id, ux:spot.ux, uy:spot.uy, r:Math.round(Math.random() * 40 - 20), ch:run.chopped.has(id)});
  run.used.add(id); sfx.pop(); renderScene();
}
function flyTo(btn, id, done){
  const from = btn.querySelector('svg').getBoundingClientRect(), r = $('#kStage').getBoundingClientRect();
  const P = VIEW[run.view] || {cx:200, cy:180};
  const tx = r.left + r.width * P.cx / 400, ty = r.top + r.height * P.cy / 300;
  const f = document.createElement('div'); f.className = 'flyfood'; f.innerHTML = ING[id].svg;
  Object.assign(f.style, {left:from.left + 'px', top:from.top + 'px', width:from.width + 'px', height:from.height + 'px'});
  document.body.appendChild(f); f.getBoundingClientRect();
  f.style.transform = `translate(${tx - from.left - from.width/2}px, ${ty - from.top - from.height/2}px) scale(.7)`;
  f.style.opacity = '0';
  setTimeout(() => { f.remove(); if (run) done(); }, 480);
}
function trayIngredient(id, btn){
  const s = cur(); if (!s || run.done) return;
  if (s.t === 'add') {
    if (!s.items.includes(id)) {
      sfx.oops(); animate($('#kPet'), 'do-tilt', 1400);
      bubble('#kBubble', `Hmm, ${ING[id].label.toLowerCase()} isn't in this recipe!`, 2200);
      const want = s.items.find(x => !run.added.has(x));
      const nb = want && $(`#kTray [data-ing="${want}"]`); if (nb) { nb.classList.remove('nudge'); void nb.offsetWidth; nb.classList.add('nudge'); }
      return;
    }
    if (run.added.has(id)) return;
    run.added.add(id); btn.classList.add('used');
    flyTo(btn, id, () => { placeItem(id, randomSpot()); if (s.items.every(x => run.added.has(x))) completeStep(900); });
  } else if (s.t === 'top' || s.t === 'free') {
    if (run.cook) return;
    if (run.dish.items.length >= 30) { bubble('#kBubble', "It's full! Try chopping, mixing or cooking.", 2200); return; }
    run.sel = id;
    document.querySelectorAll('#kTray [data-ing]').forEach(x => x.toggleAttribute('aria-pressed', x.dataset.ing === id));
    flyTo(btn, id, () => { placeItem(id, randomSpot()); if (s.t === 'top') { run.placed++; if (run.placed === (s.min || 4)) renderTray(); } });
  }
}

/* ---------- stage gestures ---------- */
const stg = $('#kStage');
function toSvg(e){ const r = stg.getBoundingClientRect(); return {x:(e.clientX - r.left) / r.width * 400, y:(e.clientY - r.top) / r.height * 300}; }
function moveTool(e){
  if (!run || !run.tool) return;
  const r = stg.getBoundingClientRect();
  $('#kTool').style.transform = `translate(${e.clientX - r.left - 38}px, ${e.clientY - r.top - 38}px)`;
  stg.classList.add('show-tool');
}
stg.addEventListener('pointerdown', e => {
  if (!run || run.serving) return;
  run.down = true; run.lx = e.clientX; run.ly = e.clientY;
  try { stg.setPointerCapture(e.pointerId); } catch (_) {}
  moveTool(e); tapAt(e);
});
stg.addEventListener('pointermove', e => {
  if (!run) return;
  moveTool(e);
  if (run.down || e.pointerType === 'mouse') rub(e);
  run.lx = e.clientX; run.ly = e.clientY;
});
['pointerup', 'pointercancel'].forEach(ev => stg.addEventListener(ev, () => { if (run) run.down = false; }));
stg.addEventListener('pointerleave', () => { if (run) run.down = false; stg.classList.remove('show-tool'); });

let lastScrub = 0, tossDist = 0;
function rub(e){
  const s = cur(); if (!s || run.done || !['mix', 'spread', 'roll'].includes(s.t)) return;
  if (run.lx == null) return;
  const dx = e.clientX - run.lx, dy = e.clientY - run.ly, w = stg.clientWidth;
  const add = s.t === 'roll' ? Math.abs(dx) : Math.hypot(dx, dy);
  if (!add) return;
  run.prog = Math.min(1, run.prog + add / (w * (s.t === 'roll' ? 3 : 4.5)));
  const d = run.dish;
  if (s.t === 'mix') {
    if (s.blob) d.blobA = run.prog;
    if (s.toss || !s.blob) { tossDist += add; if (tossDist > 60) { tossDist = 0; d.items.forEach(it => { it.ux = Math.max(-.95, Math.min(.95, it.ux + (Math.random() - .5) * .5)); it.uy = Math.max(-.9, Math.min(.9, it.uy + (Math.random() - .5) * .6)); it.r += Math.round((Math.random() - .5) * 60); }); } }
  } else if (s.t === 'spread') d[s.layer] = run.prog;
  else if (s.t === 'roll' && !s.to) d.roll = run.prog;
  const now = performance.now();
  if (now - lastScrub > 90) { lastScrub = now; tone(s.t === 'roll' ? 140 : 220 + Math.random() * 120, .06, 'triangle', .05); }
  setProg(run.prog, true); requestRender();
  if (run.prog >= 1) {
    if (s.t === 'mix' && s.blob) d.items = d.items.filter(it => !it.mixing);
    if (s.t === 'roll' && s.to) d.base = s.to;
    renderScene(); completeStep();
  }
}
function tapAt(e){
  const s = cur(); if (!s || run.done) return;
  if (s.t === 'chop') return chopTap();
  if (s.t === 'fold') return foldTap();
  if (s.t === 'cook' && run.cook && run.cook.wait) return flip();
  if ((s.t === 'top' || s.t === 'free') && run.sel && !run.cook) {
    const P = VIEW[run.view]; if (!P) return;
    const {x, y} = toSvg(e);
    let ux = (x - P.cx) / P.irx, uy = (y - P.cy) / P.iry;
    const m = Math.hypot(ux, uy); if (m > 1.6) return;
    if (m > 1) { ux /= m; uy /= m; }
    placeItem(run.sel, {ux, uy});
    if (s.t === 'top') { run.placed++; if (run.placed === (s.min || 4)) renderTray(); }
  }
}
function knifeHit(){
  const k = $('#kTool'); k.classList.remove('chop'); void k.offsetWidth; k.classList.add('chop');
  tone(900 + Math.random() * 200, .05, 'square', .06);
}
function chopTap(){
  const s = cur(); if (run.taps >= 5) return;
  run.taps++; knifeHit(); setProg(run.taps / 5, true);
  if (run.taps >= 5) {
    if (s.item === 'dish') run.dish.base = s.to;
    else { run.chopped.add(s.item); run.pieces = Array.from({length:9}, (_, j) => ({x:110 + (j % 3) * 85 + (Math.random() - .5) * 30, y:190 + Math.floor(j / 3) * 22 + (Math.random() - .5) * 10, r:Math.round(Math.random() * 360)})); }
    renderScene(); completeStep(1000);
  } else renderScene();
}
function foldTap(){
  const s = cur(), d = run.dish;
  if (s.to) { d.base = s.to; sfx.boing(); renderScene(); return completeStep(); }
  d.folded++; sfx.pop(); setProg(d.folded / s.count, true); renderScene();
  if (d.folded >= s.count) completeStep();
}

/* ---------- cooking ---------- */
function cookStart(seconds = 5, onDone = cookDone){
  if (!run || run.cook) return;
  run.cook = {p:0, on:true, wait:false};
  setProg(0, true); renderScene(); renderTray(); tone(180, .4, 'sawtooth', .04, 1.5);
  const s = cur();
  run.timer = setInterval(() => {
    const c = run && run.cook; if (!c || c.wait) return;
    c.p = Math.min(1, c.p + .05 / seconds);
    setProg(c.p, true);
    if (Math.random() < .3) tone(120 + Math.random() * 80, .07, 'triangle', .03);
    if (s && s.flip && !run.dish.flipped && c.p >= .5) {
      c.wait = true; bubble('#kBubble', 'Flip it!', 0); say('Flip it now!'); renderTray(); return;
    }
    if (c.p >= 1) { clearInterval(run.timer); onDone(); }
  }, 50);
}
function flip(){
  if (!run.cook || !run.cook.wait) return;
  run.dish.flipped = true; run.flipAnim = true; sfx.boing(); $('#kBubble').hidden = true;
  renderScene(); renderTray();
  setTimeout(() => { if (!run || !run.cook) return; run.flipAnim = false; run.cook.wait = false; renderScene(); renderTray(); }, 650);
}
function cookDone(){
  const s = cur(), d = run.dish;
  run.cook = null; d.cooked = true;
  if (s.blob) { d.blob = s.blob; d.blobA = 1; d.items = []; }
  renderScene(); renderTray(); completeStep(1300);
}

/* ---------- make your own ---------- */
function pickPot(k){
  sfx.pop();
  run.pot = k;
  if (k === 'pizza') { run.view = 'board'; Object.assign(run.dish, {base:'pizza', roll:1, sauce:1}); }
  else run.view = k;
  run.i++; startStep();
}
function avgColor(ids){
  const c = ids.map(id => ING[id].color).map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
  const m = [0, 1, 2].map(j => Math.round(c.reduce((a, v) => a + v[j], 0) / c.length));
  return '#' + m.map(v => v.toString(16).padStart(2, '0')).join('');
}
function freeTool(tool){
  const d = run.dish;
  if (run.cook) return;
  if (!d.items.length && !d.blob) { sfx.oops(); bubble('#kBubble', 'Add some food first!', 1800); return; }
  if (tool === 'serve') return serveStep();
  if (tool === 'chop') {
    const raw = d.items.filter(it => !it.ch);
    if (!raw.length) { bubble('#kBubble', 'Everything is chopped!', 1600); return; }
    setTool('knife'); stg.classList.add('show-tool');
    const r = stg.getBoundingClientRect(); $('#kTool').style.transform = `translate(${r.width / 2 - 38}px, ${r.height * .45}px)`;
    [0, 1, 2, 3].forEach(j => setTimeout(() => { if (run) knifeHit(); }, j * 160));
    setTimeout(() => { if (!run) return; raw.forEach(it => { it.ch = true; run.chopped.add(it.id); }); setTool(null); renderScene(); bubble('#kBubble', 'Chop chop!', 1400); }, 700);
  } else if (tool === 'mix') {
    if (['bowl', 'pot', 'pan'].includes(run.view)) {
      const mixing = d.items.filter(it => !it.mixing);
      if (!mixing.length) { bubble('#kBubble', 'All mixed up!', 1600); return; }
      d.items.forEach(it => it.mixing = true);
      const target = avgColor([...(d.blob ? [] : []), ...mixing.map(i => i.id)]);
      d.blob = d.blob ? avgColor2(d.blob, target) : target; d.blobA = 0;
      const t0 = performance.now();
      const stepMix = now => { if (!run) return; d.blobA = Math.min(1, (now - t0) / 700); renderScene(); if (d.blobA < 1) requestAnimationFrame(stepMix); else { d.items = d.items.filter(it => !it.mixing); renderScene(); } };
      requestAnimationFrame(stepMix); tone(220, .5, 'triangle', .08, 1.6);
      bubble('#kBubble', 'Swirl swirl!', 1400);
    } else {
      d.items.forEach(it => { const p = randomSpot(); it.ux = p.ux; it.uy = p.uy; it.r = Math.round(Math.random() * 360); });
      renderScene(); tone(260, .3, 'triangle', .08, 1.5); bubble('#kBubble', 'All tossed!', 1400);
    }
  } else if (tool === 'cook') {
    if (d.cooked) { bubble('#kBubble', "It's already cooked!", 1600); return; }
    const back = run.view;
    if (run.view === 'board' || run.view === 'plate') run.view = 'oven';
    cookStart(3, () => { run.cook = null; d.cooked = true; run.view = back; renderScene(); renderTray(); setProg(0, false); sfx.ding(); bubble('#kBubble', 'Cooked! Ready to serve?', 1800); });
  }
}
function avgColor2(a, b){ return '#' + [1, 3, 5].map(i => Math.round((parseInt(a.slice(i, i + 2), 16) + parseInt(b.slice(i, i + 2), 16)) / 2).toString(16).padStart(2, '0')).join(''); }
const ADJ = ['Super', 'Magic', 'Rainbow', 'Yummy', 'Giant', 'Happy', 'Crunchy', 'Twinkly', 'Wobbly', 'Marvellous', 'Dancing', 'Sparkly'];
function freeName(){
  const ids = [...run.used];
  const d = run.dish;
  const noun = {bowl:d.blob ? 'Pudding' : 'Salad', pot:'Soup', pan:d.blob ? 'Pancake' : 'Stir-fry', pizza:'Pizza', plate:'Platter'}[run.pot] || 'Surprise';
  const a = ids[0] && ING[ids[0]].label, b = ids[1] && ING[ids[1]].label;
  return b ? `${pick(ADJ)} ${a} and ${b} ${noun}` : `${pick(ADJ)} ${a} ${noun}`;
}

/* ---------- serving ---------- */
function serveSVG(){
  if (run.free) return `<g transform="translate(-10 40) scale(.82)">${containerSVG(run.view)}</g>`;
  return `<g transform="translate(20 50) scale(2.2)">${dishArt(run.r.id)}</g>`;
}
function serveStep(){
  run.serving = true; run.served = false; run.cook = null; setTool(null); setProg(0, false);
  run.name = run.free ? freeName() : run.r.dish;
  stg.classList.add('serving');
  const ready = run.free ? '' : `Your ${run.r.short} ${run.r.plural ? 'are' : 'is'} ready!`;
  $('#kCue').textContent = run.free ? `You made: ${run.name}!` : ready;
  $('#kCueIcon').innerHTML = STAR_SVG;
  renderSteps(true); renderScene(); renderTray();
  sfx.chime(); confetti(stg);
  say(run.free ? `You made ${run.name}!` : `${ready} Show ${run.r.plural ? 'them' : 'it'} to ${chef().name}.`);
}
function renderServeTray(){
  const t = $('#kTray');
  if (!run.served) { t.innerHTML = `<button class="btn go k-big" id="kServe">${HEART_SVG}Show it to ${chef().name}</button>`; return; }
  const unsafe = [...run.used].filter(id => UNSAFE_FOR_PETS.includes(id));
  t.innerHTML = (unsafe.length ? `<p class="k-tip">Did you know? ${listOf(unsafe).replace(/^./, c => c.toUpperCase())} ${unsafe.length > 1 ? 'are' : 'is'} not safe for pets to eat, so this dish is just for people.</p>` : '')
    + `<div class="k-row"><button class="btn go" id="kAgain">Cook it again</button><button class="btn" id="kMore">More recipes</button></div>`;
}
function serveIt(){
  if (run.served) return;
  run.served = true;
  const log = cookedLog(), first = !run.free && !log[run.r.id];
  if (!run.free) log[run.r.id] = (log[run.r.id] || 0) + 1;
  else state.chefMade = (state.chefMade || 0) + 1;
  addStars(first ? 2 : 1); bump('happy', 10);
  const pet = $('#kPet'); animate(pet, 'do-happy', 900);
  const r = stg.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const h = document.createElement('div'); h.className = 'heart'; h.innerHTML = HEART_SVG;
    h.style.left = (r.width * .82 - 17 + (i - 1) * 30) + 'px'; h.style.top = (r.height * .45) + 'px'; h.style.animationDelay = i * .12 + 's';
    stg.appendChild(h); setTimeout(() => h.remove(), 1600);
  }
  const line = pick(['Mmm, it smells amazing!', 'Wow, five stars, chef!', 'That looks so yummy!', 'You are a super chef!']);
  const msg = first ? `${line} New passport stamp!` : line;
  bubble('#kBubble', msg, 0); sfx.chime();
  say(`${msg} You earned ${first ? 'two stars' : 'a star'}.`);
  renderTray();
}
})();
