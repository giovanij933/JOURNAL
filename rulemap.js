'use strict';
// JOURNAL's rule pictures: each focus rule of the pre-market plan drawn as a small chart (a loser cut at the winner's
// hold, a pause after a loss, a stop placed before the entry, a cap on the day's trades...) with how to keep it. The
// picture sits beside the day's focus in the plan and the daily review; the ⓘ by the rule opens the guide.
// n: numbers from the rule's own words (the winners' and losers' hold, the trade cap, the worst hour, the markets, the
// weekday), so the picture shows your numbers.
window.RLG=(()=>{
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const HOW={
    hold:'Know your average winner’s hold before the open. If a losing trade is still open at that mark, close it: it has had its chance.',
    fast:'After a red trade, hands off: set a 5-minute timer, read the plan again, and only then look for the next setup.',
    streak:'Two red trades in a row: stand up and walk away for 15 minutes before you look at a chart again.',
    give:'Keep an eye on the day’s high in P&L. Give back half of it and you’re done: the green day stays green.',
    over:'Count your trades as you go. At the cap you stop for the day, whatever the market does next.',
    big:'Place the stop with the entry (a bracket order), before you’re in. Move it closer to lock in profit, never further away.',
    hour:'Set an alarm for the start of that hour and step away until it ends. Close or protect open trades before it starts.',
    inst:'Take that market off your screen for the day, so its setups don’t tempt you.',
    wd:'On that weekday, take only your A+ setups, at a smaller size.',
    p1:'Place the stop with the entry (a bracket order), before you’re in. Move it closer to lock in profit, never further away.',
    p2:'Write your setups down before the open. A trade that doesn’t match one of them is a pass.',
    p3:'After a red trade, hands off: set a 5-minute timer, read the plan again, and only then look for the next setup.',
    p4:'Pick the size before the open and keep it for every trade, win or lose.',
    p5:'When the day’s loss reaches your line, close the platform. The next trade can wait for tomorrow.'
  };
  // the numbers in a rule's words: rule, why
  const nums=(k,rule='',why='')=>{const n={};
    if(k==='hold'){const w=why.match(/winners (\d+) min/),l=why.match(/losers lasted (\d+) min/);if(w)n.win=+w[1];if(l)n.loss=+l[1]}
    if(k==='over'){const c=rule.match(/No more than (\d+)/);if(c)n.cap=+c[1]}
    if(k==='hour'){const h=rule.match(/(\d{1,2})\s*(AM|PM)/);if(h)n.h=(+h[1]%12)+(h[2]==='PM'?12:0)}
    if(k==='inst'){const b=rule.match(/^No (\S+) today/),g=rule.match(/stick to (\S+?)\.?$/);if(b)n.bad=b[1];if(g)n.good=g[1]}
    if(k==='wd'){const d=['Monday','Tuesday','Wednesday','Thursday','Friday'].findIndex(x=>rule.startsWith(x));if(d>=0)n.d=d}
    return n};
  // the picture, on a 300 × 120 grid; small: no words, thicker lines
  const pic=(k,n={},big)=>{
    const tx=(x,y,t,c='')=>big?`<text x="${x}" y="${y}" class="rl-t ${c}">${esc(t)}</text>`:'';let b='';
    if(k==='hold'){const wv=n.win||6,lv=n.loss||9,mx=Math.max(wv,lv)*1.12,X=v=>14+260*v/mx;
      b=`<rect x="14" y="28" width="${X(wv)-14}" height="20" rx="4" class="rl-win"/><rect x="14" y="80" width="${X(lv)-14}" height="20" rx="4" class="rl-loss rl-faint"/><rect x="14" y="80" width="${X(wv)-14}" height="20" rx="4" class="rl-loss"/>
        <line x1="${X(wv)}" x2="${X(wv)}" y1="18" y2="110" class="rl-cap"/>${tx(14,20,`Winners · ${wv} min`)}${tx(14,72,`Losers · ${lv} min`)}${tx(Math.min(X(wv)+6,292),118,'out here','rl-acc'+(X(wv)>230?' rl-end':''))}`}
    else if(k==='fast'||k==='p3'||k==='streak'){const two=k==='streak',gap=two?15:5,a=two?96:74,w=two?146:130,e=a+w+18;
      b=`<line x1="8" x2="292" y1="62" y2="62" class="rl-axis"/>${two?'<circle cx="36" cy="62" r="9" class="rl-lossf"/>':''}<circle cx="${two?72:52}" cy="62" r="9" class="rl-lossf"/>
        <rect x="${a}" y="40" width="${w}" height="44" rx="6" class="rl-wait"/>${tx(a+w/2,67,`wait ${gap} min`,'rl-mid')}<circle cx="${e}" cy="62" r="9" class="rl-winf"/>
        ${tx(two?54:52,104,two?'2 losses':'a loss','rl-mid')}${tx(e,104,'next entry','rl-mid')}`}
    else if(k==='give'){const P=[[10,100],[60,74],[100,56],[140,26],[180,44],[215,61]];
      b=`<line x1="8" x2="292" y1="61" y2="61" class="rl-cap"/>${tx(12,52,'half the high','rl-acc')}<path d="M${P.map(p=>p.join(' ')).join('L')}" class="rl-eq"/>
        <circle cx="215" cy="61" r="${big?6:13}" class="rl-lossf"/>${tx(215,88,'stop','rl-err rl-mid')}${tx(140,16,'day high','rl-mid')}`}
    else if(k==='p5'){const P=[[10,34],[50,46],[90,40],[130,64],[170,80],[205,96]];
      b=`<line x1="8" x2="292" y1="96" y2="96" class="rl-cap"/>${tx(292,114,'max loss','rl-acc rl-end')}<path d="M${P.map(p=>p.join(' ')).join('L')}" class="rl-eq"/>
        <circle cx="205" cy="96" r="${big?6:13}" class="rl-lossf"/>${tx(205,80,'done','rl-err rl-mid')}`}
    else if(k==='over'){const N=Math.min(n.cap||4,5),x=i=>22+i*(256/(N+1));
      b=[...Array(N+2)].map((_,i)=>`<circle cx="${x(i)}" cy="56" r="${big?12:16}" class="${i<N?'rl-dot':'rl-off'}"/>`).join('')+`<line x1="${(x(N-1)+x(N))/2}" x2="${(x(N-1)+x(N))/2}" y1="26" y2="88" class="rl-cap"/>${tx((x(N-1)+x(N))/2,108,`max ${n.cap||N}`,'rl-acc rl-mid')}`}
    else if(k==='big'||k==='p1'){
      b=`<line x1="8" x2="292" y1="94" y2="94" class="rl-stop"/>${tx(292,112,'1 · stop in first','rl-err rl-end')}<path d="M10 70L50 58 80 66 120 44 150 52" class="rl-eq"/>
        <circle cx="150" cy="52" r="${big?7:13}" class="rl-dot"/>${tx(150,32,'2 · enter','rl-mid')}<path d="M150 52L190 40 230 48 270 26" class="rl-eq rl-faint"/>
        <path d="M60 104v-18m-6 7 6-7 6 7" class="rl-up"/>${tx(74,112,'only closer','rl-acc')}`}
    else if(k==='hour'){const h0=Math.max(0,Math.min(17,(n.h??11)-3)),lab=h=>`${h%12||12}${big?(h<12?'a':'p'):''}`;
      b=[...Array(7)].map((_,i)=>`<rect x="${8+i*41.5}" y="36" width="37" height="44" rx="5" class="${h0+i===(n.h??11)?'rl-lossf':'rl-off'}"/>${tx(26.5+i*41.5,100,lab(h0+i),'rl-mid')}`).join('')+tx(26.5+((n.h??11)-h0)*41.5,28,'no trades','rl-err rl-mid')}
    else if(k==='inst'){b=`<rect x="20" y="34" width="120" height="52" rx="10" class="rl-off"/>${tx(80,66,n.bad||'GC','rl-big rl-mid')}<path d="M26 40l108 40" class="rl-x rl-xs"/>
        <rect x="160" y="34" width="120" height="52" rx="10" class="rl-chip"/>${tx(220,66,n.good||'today’s','rl-big rl-mid')}${tx(80,106,'not today','rl-err rl-mid')}${tx(220,106,'stick to','rl-acc rl-mid')}`}
    else if(k==='wd'){const d=n.d??2;b=[...Array(5)].map((_,i)=>`<rect x="${12+i*57}" y="28" width="50" height="56" rx="6" class="${i===d?'rl-dot':'rl-off'}"/>${tx(37+i*57,61,'MTWTF'[i],'rl-mid'+(i===d?' rl-on':''))}`).join('')+tx(37+d*57,106,'A+ only, smaller','rl-acc rl-mid')}
    else if(k==='p2'){b=[0,1,2].map(i=>`<rect x="20" y="${10+i*34}" width="200" height="26" rx="5" class="${i<2?'rl-chip':'rl-off rl-dash'}"/>${i<2?`<path d="M32 ${23+i*34}l6 6 10-12" class="rl-tick"/>`:`<path d="M30 ${17+i*34}l12 12m0-12-12 12" class="rl-x rl-xs"/>`}${tx(58,28+i*34,i<2?`Setup ${'AB'[i]}`:'Not on my list',i<2?'':'rl-err')}`).join('')+tx(232,96,'pass','rl-err')}
    else if(k==='p4'){b=[0,1,2,3,4].map(i=>`<rect x="${20+i*56}" y="30" width="40" height="56" rx="5" class="rl-dot"/>`).join('')+tx(150,108,'same size, every trade','rl-mid')}
    return `<svg class="rl-svg${big?'':' rl-sm'}" viewBox="0 0 300 120" aria-hidden="true">${b}</svg>`;
  };
  const has=k=>!!HOW[k];
  // beside the rule
  const mini=(k,rule,why)=>has(k)?`<span class="rl-mini" aria-hidden="true">${pic(k,nums(k,rule,why))}</span>`:'';
  // the guide: the picture, the rule, why (your numbers) and how to keep it
  const html=(k,rule,why)=>has(k)?`<div class="rl"><div class="rl-pic">${pic(k,nums(k,rule,why),true)}</div><dl class="rl-l"><dt>Rule</dt><dd>${esc(rule)}</dd><dt>Why</dt><dd>${esc(why||'A process rule: it keeps every trade inside the plan.')}</dd><dt>How</dt><dd>${esc(HOW[k])}</dd></dl></div>`:'';
  return {has,mini,html,nums};
})();
