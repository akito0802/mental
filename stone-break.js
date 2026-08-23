(()=>{
  const releasePage=document.querySelector('.page[data-page="release"]');
  const scribble=document.querySelector('.release-tool[data-tool="scribble"]');
  if(!releasePage||!scribble||document.querySelector('[data-tool="石割り"]'))return;

  const style=document.createElement('style');
  style.textContent=`
    .stone-break-card{overflow:hidden}
    .stone-stage{position:relative;min-height:290px;margin:14px 0;border:1px solid var(--line,#d8e3df);border-radius:22px;background:radial-gradient(circle at 50% 38%,#f9fbfa 0 12%,#edf3f1 55%,#e6ece9 100%);display:flex;align-items:center;justify-content:center;overflow:hidden;touch-action:manipulation;user-select:none;-webkit-user-select:none}
    .stone-ground{position:absolute;left:12%;right:12%;bottom:35px;height:18px;border-radius:50%;background:rgba(52,72,79,.09);filter:blur(3px)}
    .stone-object{position:relative;width:174px;height:142px;border:0;padding:0;background:linear-gradient(145deg,#7f8c91 0%,#66767c 44%,#4f6269 100%);clip-path:polygon(16% 18%,38% 4%,66% 8%,88% 28%,94% 60%,76% 88%,48% 97%,19% 86%,5% 58%,7% 34%);box-shadow:inset 20px 17px 22px rgba(255,255,255,.14),inset -20px -20px 25px rgba(24,38,44,.18),0 18px 28px rgba(38,55,60,.18);cursor:pointer;outline:none;transform-origin:center;will-change:transform,opacity}
    .stone-object:active{transform:scale(.97)}
    .stone-object.hit{animation:stoneHit .16s ease}
    @keyframes stoneHit{0%{transform:translate(0,0) rotate(0)}25%{transform:translate(-5px,2px) rotate(-2deg)}55%{transform:translate(5px,-2px) rotate(2deg)}100%{transform:translate(0,0) rotate(0)}}
    .stone-shine{position:absolute;inset:0;background:radial-gradient(circle at 32% 25%,rgba(255,255,255,.17),transparent 30%);pointer-events:none}
    .stone-cracks{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
    .stone-cracks path{fill:none;stroke:#263d45;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;opacity:0;filter:drop-shadow(0 1px 0 rgba(255,255,255,.15));transition:opacity .18s ease}
    .stone-object[data-level="1"] .c1,.stone-object[data-level="2"] .c1,.stone-object[data-level="3"] .c1{opacity:.9}
    .stone-object[data-level="2"] .c2,.stone-object[data-level="3"] .c2{opacity:.92}
    .stone-object[data-level="3"] .c3{opacity:.94}
    .stone-chip{position:absolute;width:14px;height:11px;background:#65757a;clip-path:polygon(12% 18%,80% 0,100% 60%,42% 100%,0 66%);pointer-events:none;z-index:6;animation:stoneChip .52s ease-out forwards}
    @keyframes stoneChip{0%{opacity:1;transform:translate(0,0) rotate(0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(.5)}}
    .stone-fragment{position:absolute;left:50%;top:50%;width:92px;height:76px;background:linear-gradient(145deg,#78878c,#53666d);pointer-events:none;z-index:7;transform:translate(-50%,-50%);box-shadow:inset 8px 7px 10px rgba(255,255,255,.08);animation:stoneFragment .85s cubic-bezier(.18,.67,.28,1) forwards}
    @keyframes stoneFragment{0%{opacity:1;transform:translate(-50%,-50%) translate(0,0) rotate(0) scale(1)}75%{opacity:1;transform:translate(-50%,-50%) translate(var(--fx),var(--fy)) rotate(var(--fr)) scale(.82)}100%{opacity:0;transform:translate(-50%,-50%) translate(var(--fx2),var(--fy2)) rotate(var(--fr2)) scale(.58)}}
    .stone-burst{position:absolute;width:42px;height:42px;border:2px solid rgba(79,98,105,.32);border-radius:50%;pointer-events:none;animation:stoneBurst .46s ease-out forwards}
    @keyframes stoneBurst{from{opacity:.8;transform:scale(.45)}to{opacity:0;transform:scale(3.7)}}
    .stone-message{text-align:center;min-height:22px;margin:5px 0 12px;color:var(--muted,#66777f);font-size:13px;font-weight:700}
    .stone-actions{display:none;grid-template-columns:1fr 1fr;gap:9px;margin-top:8px}.stone-actions.show{display:grid}
    .stone-break-card.broken{border-color:#a9c5bd}.stone-break-card.broken .tool-chip{background:var(--teal,#367d78);color:#fff}
    @media(max-width:420px){.stone-stage{min-height:260px}.stone-object{width:158px;height:130px}.stone-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const card=document.createElement('article');
  card.className='card release-tool stone-break-card';
  card.dataset.tool='石割り';
  card.innerHTML=`
    <div class="tool-head">
      <div><p class="eyebrow">STONE BREAK</p><h3>タップして石を壊す</h3></div><span class="tool-chip">タップ</span>
    </div>
    <p class="muted small">石をタップすると少しずつヒビが入る。スコアやランキングはなし。</p>
    <div class="stone-stage" id="stoneStage" aria-live="polite">
      <div class="stone-ground"></div>
      <button class="stone-object" id="stoneObject" type="button" aria-label="石をタップする" data-level="0">
        <span class="stone-shine"></span>
        <svg class="stone-cracks" viewBox="0 0 174 142" aria-hidden="true">
          <path class="c1" d="M88 26 L83 47 L94 58 L85 72 L92 91 L82 114 M84 48 L69 57 L58 54 M87 72 L105 78 L116 72"/>
          <path class="c2" d="M94 58 L112 48 L128 51 M85 72 L69 82 L59 99 M92 91 L109 102 L121 99 M69 82 L50 78"/>
          <path class="c3" d="M83 47 L75 32 L60 28 M105 78 L124 86 L137 82 M82 114 L68 124 L52 122 M109 102 L122 116 L136 116 M58 54 L45 63 L32 59"/>
        </svg>
      </button>
    </div>
    <p class="stone-message" id="stoneMessage">石を好きなペースでタップ。</p>
    <div class="stone-actions" id="stoneActions">
      <button class="soft" id="stoneReset" type="button">もう一度</button>
      <button class="primary" id="stoneCooldown" type="button">COOL DOWNへ</button>
    </div>
    <p class="tiny muted center">これは発散用の演出。落ち着かない・しんどくなるなら途中で止めて別の方法に切り替えてOK。</p>`;

  scribble.insertAdjacentElement('afterend',card);

  const stage=card.querySelector('#stoneStage');
  const stone=card.querySelector('#stoneObject');
  const message=card.querySelector('#stoneMessage');
  const actions=card.querySelector('#stoneActions');
  const resetBtn=card.querySelector('#stoneReset');
  const cooldownBtn=card.querySelector('#stoneCooldown');
  let taps=0;
  let broken=false;

  function setMessage(){
    if(taps<=1)message.textContent='小さなヒビが入った。';
    else if(taps<=3)message.textContent='ヒビが少しずつ広がってる。';
    else if(taps<=5)message.textContent='表面が欠けてきた。';
    else if(taps<=7)message.textContent='もうかなり割れてる。';
  }

  function chip(){
    const el=document.createElement('i');
    el.className='stone-chip';
    const angle=Math.random()*Math.PI*2;
    const dist=55+Math.random()*60;
    el.style.left=`${46+Math.random()*10}%`;
    el.style.top=`${44+Math.random()*12}%`;
    el.style.setProperty('--dx',`${Math.cos(angle)*dist}px`);
    el.style.setProperty('--dy',`${Math.sin(angle)*dist+15}px`);
    el.style.setProperty('--rot',`${Math.round((Math.random()-.5)*540)}deg`);
    stage.appendChild(el);
    setTimeout(()=>el.remove(),600);
  }

  function breakStone(){
    broken=true;
    stone.style.opacity='0';
    stone.style.pointerEvents='none';
    const burst=document.createElement('i');burst.className='stone-burst';stage.appendChild(burst);setTimeout(()=>burst.remove(),520);
    const shapes=[
      ['polygon(0 0,100% 10%,68% 100%,8% 74%)','-86px','-58px','-126px','80px','-48deg','-120deg'],
      ['polygon(12% 0,100% 0,88% 78%,30% 100%,0 48%)','62px','-72px','105px','70px','42deg','135deg'],
      ['polygon(0 10%,82% 0,100% 70%,46% 100%,4% 78%)','-74px','34px','-116px','142px','35deg','110deg'],
      ['polygon(18% 0,100% 20%,82% 100%,0 72%)','75px','38px','118px','148px','-34deg','-130deg'],
      ['polygon(0 0,100% 18%,78% 100%,12% 88%)','-10px','-84px','-30px','92px','76deg','180deg'],
      ['polygon(10% 0,100% 8%,86% 88%,24% 100%,0 44%)','16px','46px','35px','158px','-68deg','-210deg']
    ];
    shapes.forEach(([clip,fx,fy,fx2,fy2,fr,fr2],i)=>{
      const f=document.createElement('i');
      f.className='stone-fragment';f.style.clipPath=clip;
      f.style.setProperty('--fx',fx);f.style.setProperty('--fy',fy);f.style.setProperty('--fx2',fx2);f.style.setProperty('--fy2',fy2);f.style.setProperty('--fr',fr);f.style.setProperty('--fr2',fr2);
      f.style.animationDelay=`${i*18}ms`;stage.appendChild(f);setTimeout(()=>f.remove(),1050);
    });
    for(let i=0;i<8;i++)setTimeout(chip,i*25);
    if(navigator.vibrate)navigator.vibrate([25,25,55]);
    message.textContent='割れた。ここで終わってもいい。';
    actions.classList.add('show');
    card.classList.add('broken');
    try{if(typeof markTool==='function')markTool('石割り')}catch{}
  }

  stone.addEventListener('click',()=>{
    if(broken)return;
    taps++;
    stone.classList.remove('hit');void stone.offsetWidth;stone.classList.add('hit');
    if(navigator.vibrate)navigator.vibrate(12);
    if(taps>=2)stone.dataset.level='1';
    if(taps>=4)stone.dataset.level='2';
    if(taps>=6)stone.dataset.level='3';
    if(taps>=4)chip();
    if(taps>=8){breakStone();return}
    setMessage();
  });

  resetBtn.addEventListener('click',()=>{
    taps=0;broken=false;stone.dataset.level='0';stone.style.opacity='1';stone.style.pointerEvents='';message.textContent='石を好きなペースでタップ。';actions.classList.remove('show');card.classList.remove('broken');
  });

  cooldownBtn.addEventListener('click',()=>document.querySelector('#cooldownGate')?.scrollIntoView({behavior:'smooth',block:'start'}));
})();