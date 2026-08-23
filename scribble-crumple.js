(()=>{
  const card=document.querySelector('.release-tool[data-tool="scribble"]');
  const canvas=document.querySelector('#scribbleCanvas');
  const clearBtn=document.querySelector('#clearCanvas');
  if(!card||!canvas||!clearBtn)return;

  const VERSION='v8';
  const style=document.createElement('style');
  style.textContent=`
    .scribble-trash-button{margin-top:10px;background:#f5e6e5;color:#7a403e;border:0;border-radius:16px;padding:13px 16px;font-weight:800;width:100%}
    .scribble-trash-button:active{transform:scale(.985)}
    .scribble-trash-status{min-height:18px;margin:7px 0 0;text-align:center;font-size:11px;color:var(--muted,#66777f)}
    #scribbleTrashModal.scribble-modal{position:fixed!important;inset:0!important;width:100vw!important;width:100dvw!important;height:100vh!important;height:100dvh!important;z-index:2147483647!important;background:rgba(17,29,33,.86)!important;display:grid!important;place-items:center!important;padding:16px!important;box-sizing:border-box!important;overflow:hidden!important;overscroll-behavior:none!important;-webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px)}
    #scribbleTrashModal[hidden]{display:none!important}
    .scribble-modal-stage{position:relative!important;width:min(90vw,390px)!important;height:min(64vh,500px)!important;min-height:360px!important;max-height:500px!important;margin:0!important;border-radius:26px!important;overflow:hidden!important;background:linear-gradient(180deg,#fbfbf8 0%,#edf2f0 100%)!important;box-shadow:0 24px 70px rgba(0,0,0,.38)!important;border:1px solid rgba(255,255,255,.8)!important}
    .scribble-modal-title{position:absolute;top:14px;left:0;right:0;text-align:center;font-size:11px;font-weight:900;letter-spacing:.12em;color:#50656d;z-index:20}
    .scribble-modal-version{position:absolute;top:13px;right:15px;font-size:9px;font-weight:900;color:#809096;z-index:21}
    .scribble-paper{position:absolute!important;z-index:8!important;top:50px!important;left:50%!important;width:82%!important;height:42%!important;min-height:145px!important;transform:translateX(-50%)!important;background:#fffdf7!important;border:1px solid #e8dfcf!important;border-radius:8px!important;box-shadow:0 10px 28px rgba(55,50,40,.14)!important;overflow:hidden!important;transform-origin:center center!important;margin:0!important;padding:0!important;will-change:transform,width,height,clip-path,border-radius}
    .scribble-paper img{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;background:#f5f7f6!important;will-change:transform,filter}
    .scribble-paper:after{content:'';position:absolute;inset:-10%;pointer-events:none;opacity:0;background:repeating-linear-gradient(37deg,transparent 0 11px,rgba(74,64,50,.18) 12px 13px),repeating-linear-gradient(143deg,transparent 0 17px,rgba(255,255,255,.72) 18px 19px);mix-blend-mode:multiply}
    .scribble-paper.crushing:after{animation:scribbleWrinkles 1.02s steps(5,end) forwards}
    .scribble-crease{position:absolute;z-index:12;pointer-events:none;opacity:0;background:linear-gradient(90deg,transparent,rgba(72,63,52,.34),rgba(255,255,255,.75),transparent);transform-origin:center}
    .scribble-crease.c1{left:-8%;top:30%;width:116%;height:3px;transform:rotate(19deg)}
    .scribble-crease.c2{left:-5%;top:55%;width:110%;height:3px;transform:rotate(-27deg)}
    .scribble-crease.c3{left:49%;top:-12%;width:3px;height:124%;transform:rotate(8deg)}
    .scribble-paper.crushing .scribble-crease{animation:creaseFlash 1s steps(6,end) forwards}
    .scribble-bin{position:absolute!important;z-index:5!important;left:50%!important;bottom:48px!important;transform:translateX(-50%)!important;width:112px!important;height:74px!important;background:#50656d!important;color:#fff!important;border-radius:13px 13px 22px 22px!important;text-align:center!important;font-size:30px!important;line-height:42px!important;box-shadow:0 10px 22px rgba(38,55,60,.18),inset 0 6px 0 rgba(255,255,255,.07)!important;margin:0!important}
    .scribble-bin:before{content:'';position:absolute;left:-10px;right:-10px;top:-10px;height:13px;background:#41565e;border-radius:9px}
    .scribble-bin span{display:block;font-size:9px;letter-spacing:.2em;line-height:16px}
    .scribble-modal-message{position:absolute;left:14px;right:14px;bottom:13px;text-align:center;font-size:12px;font-weight:800;color:#5f7077;z-index:10}
    .scribble-modal-close{position:absolute;top:10px;left:10px;z-index:30;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.88);color:#50656d;font-size:20px;line-height:34px;padding:0}
    @keyframes scribbleWrinkles{0%{opacity:0;transform:scale(1)}15%{opacity:.35;transform:scale(1.06) rotate(2deg)}35%{opacity:.72;transform:scale(1.12) rotate(-3deg)}60%{opacity:.9;transform:scale(1.2) rotate(5deg)}100%{opacity:.95;transform:scale(1.28) rotate(-4deg)}}
    @keyframes creaseFlash{0%{opacity:0}12%{opacity:.85}24%{opacity:.2}37%{opacity:.95}50%{opacity:.35}66%{opacity:.95}82%{opacity:.45}100%{opacity:.8}}
    @media(max-width:430px){.scribble-modal-stage{width:92vw!important;height:58vh!important;min-height:350px!important}.scribble-paper{top:48px!important;width:84%!important;height:39%!important;min-height:138px!important}.scribble-bin{bottom:46px!important;width:104px!important;height:68px!important}}
  `;
  document.head.appendChild(style);

  let trashBtn=document.querySelector('#crumpleScribble');
  let status=document.querySelector('.scribble-trash-status');
  if(!trashBtn){
    trashBtn=document.createElement('button');
    trashBtn.id='crumpleScribble';
    trashBtn.className='scribble-trash-button';
    trashBtn.type='button';
    trashBtn.textContent='描いたものをぐちゃぐちゃにして捨てる';
    clearBtn.closest('.row').insertAdjacentElement('afterend',trashBtn);
  }else{
    trashBtn.textContent='描いたものをぐちゃぐちゃにして捨てる';
  }
  if(!status){
    status=document.createElement('p');
    status.className='scribble-trash-status';
    status.setAttribute('aria-live','polite');
    trashBtn.insertAdjacentElement('afterend',status);
  }
  status.textContent='描いた紙を、折って・ねじって・潰してから捨てる。';

  document.querySelector('#scribbleTrashModal')?.remove();
  const modal=document.createElement('div');
  modal.id='scribbleTrashModal';
  modal.className='scribble-modal';
  modal.hidden=true;
  modal.innerHTML=`<div class="scribble-modal-stage" role="dialog" aria-modal="true" aria-label="落書きをぐちゃぐちゃにして捨てる演出"><button class="scribble-modal-close" type="button" aria-label="閉じる">×</button><div class="scribble-modal-title">SCRIBBLE → CRUSH → CRUMPLE → BIN</div><div class="scribble-modal-version">${VERSION}</div><div class="scribble-paper"><img alt="描いた落書き"><i class="scribble-crease c1"></i><i class="scribble-crease c2"></i><i class="scribble-crease c3"></i></div><div class="scribble-bin">⌄<span>BIN</span></div><div class="scribble-modal-message">ぐちゃぐちゃに潰す</div></div>`;
  document.body.appendChild(modal);

  const ctx=canvas.getContext('2d');
  let running=false;
  const closeBtn=modal.querySelector('.scribble-modal-close');

  function hasInk(){
    try{const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;for(let i=3;i<data.length;i+=16){if(data[i]>0)return true}}catch{}
    return false;
  }
  function clearDrawing(){ctx.clearRect(0,0,canvas.width,canvas.height)}
  function unlock(){modal.hidden=true;document.documentElement.style.overflow='';document.body.style.overflow='';trashBtn.disabled=false;clearBtn.disabled=false;running=false}
  closeBtn.addEventListener('click',()=>{if(!running)unlock()});

  trashBtn.onclick=async()=>{
    if(running)return;
    if(!hasInk()){status.textContent='まだ何も描かれてないよ。先に好きに描いてみて。';return}
    running=true;trashBtn.disabled=true;clearBtn.disabled=true;

    const paper=modal.querySelector('.scribble-paper');
    const img=paper.querySelector('img');
    const bin=modal.querySelector('.scribble-bin');
    const message=modal.querySelector('.scribble-modal-message');
    img.src=canvas.toDataURL('image/png');
    modal.hidden=false;
    document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
    paper.classList.add('crushing');
    message.textContent='まず、ぐしゃぐしゃに…';
    status.textContent='紙をぐちゃぐちゃにしてるよ。';
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

    const stageH=modal.querySelector('.scribble-modal-stage').clientHeight;
    const startTop=50;
    const binTop=stageH-48-74;
    const drop=Math.max(150,binTop-startTop-36);

    const paperAnim=paper.animate([
      {offset:0,transform:'translateX(-50%) translateY(0) rotate(0deg) skew(0deg) scale(1,1)',width:'82%',height:'42%',borderRadius:'8px',clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',opacity:1},
      {offset:.09,transform:'translateX(-50%) translateY(1px) rotate(-7deg) skewX(-11deg) scale(.93,1.03)',width:'76%',height:'40%',borderRadius:'8px 20px 7px 22px',clipPath:'polygon(3% 0,96% 4%,100% 92%,8% 100%,0 20%)',opacity:1},
      {offset:.18,transform:'translateX(-50%) translateY(4px) rotate(12deg) skewY(13deg) scale(1.01,.82)',width:'70%',height:'34%',borderRadius:'19px 7px 25px 8px',clipPath:'polygon(8% 3%,100% 11%,91% 100%,3% 91%,0 31%)',opacity:1},
      {offset:.27,transform:'translateX(-50%) translateY(8px) rotate(-18deg) skewX(18deg) scale(.8,.92)',width:'61%',height:'31%',borderRadius:'8px 31px 13px 28px',clipPath:'polygon(0 17%,13% 0,97% 8%,88% 94%,19% 100%,5% 70%)',opacity:1},
      {offset:.36,transform:'translateX(-50%) translateY(14px) rotate(28deg) skew(-10deg,8deg) scale(.82,.68)',width:'50%',height:'27%',borderRadius:'30px 9px 34px 13px',clipPath:'polygon(15% 0,100% 18%,88% 87%,57% 100%,5% 78%,0 22%)',opacity:1},
      {offset:.45,transform:'translateX(-50%) translateY(21px) rotate(-41deg) skew(13deg,-9deg) scale(.71,.76)',width:'40%',height:'24%',borderRadius:'22% 38% 16% 42%',clipPath:'polygon(18% 1%,88% 8%,100% 51%,77% 96%,19% 88%,0 42%)',opacity:1},
      {offset:.54,transform:'translateX(-50%) translateY(31px) rotate(63deg) skew(-8deg,11deg) scale(.65,.62)',width:'150px',height:'108px',borderRadius:'38% 54% 31% 58%',clipPath:'polygon(21% 0,83% 12%,100% 44%,78% 100%,17% 88%,0 37%)',opacity:1},
      {offset:.63,transform:'translateX(-50%) translateY(43px) rotate(-92deg) skew(6deg,-8deg) scale(.7,.66)',width:'105px',height:'87px',borderRadius:'47% 39% 55% 41%',clipPath:'polygon(24% 3%,73% 0,100% 34%,83% 83%,53% 100%,10% 80%,0 41%)',opacity:1},
      {offset:.71,transform:'translateX(-50%) translateY(58px) rotate(145deg) scale(.74,.69)',width:'78px',height:'70px',borderRadius:'48% 52% 45% 55%',clipPath:'polygon(20% 4%,75% 0,100% 36%,89% 78%,58% 100%,16% 89%,0 47%)',opacity:1},
      {offset:.79,transform:`translateX(-50%) translateY(${drop*.46}px) rotate(260deg) scale(.72)`,width:'62px',height:'60px',borderRadius:'50%',clipPath:'circle(48% at 50% 50%)',opacity:1},
      {offset:.9,transform:`translateX(-50%) translateY(${drop*.78}px) rotate(430deg) scale(.56)`,width:'56px',height:'56px',borderRadius:'50%',clipPath:'circle(48% at 50% 50%)',opacity:1},
      {offset:1,transform:`translateX(-50%) translateY(${drop}px) rotate(650deg) scale(.08)`,width:'48px',height:'48px',borderRadius:'50%',clipPath:'circle(48% at 50% 50%)',opacity:0}
    ],{duration:1900,easing:'cubic-bezier(.2,.65,.18,1)',fill:'forwards'});

    const imageAnim=img.animate([
      {offset:0,transform:'scale(1,1) rotate(0deg)',filter:'contrast(1)'},
      {offset:.12,transform:'scale(1.15,.88) rotate(3deg)',filter:'contrast(1.08)'},
      {offset:.24,transform:'scale(.9,1.18) rotate(-5deg)',filter:'contrast(1.12)'},
      {offset:.37,transform:'scale(1.25,.78) rotate(8deg)',filter:'contrast(1.15)'},
      {offset:.51,transform:'scale(.82,1.28) rotate(-12deg)',filter:'contrast(1.18)'},
      {offset:.64,transform:'scale(1.3,.72) rotate(16deg)',filter:'contrast(1.2)'},
      {offset:.78,transform:'scale(.72,1.25) rotate(-18deg)',filter:'contrast(1.2)'},
      {offset:1,transform:'scale(1.4,.65) rotate(24deg)',filter:'contrast(1.2)'}
    ],{duration:1500,easing:'ease-in-out',fill:'forwards'});

    const binAnim=bin.animate([
      {offset:0,transform:'translateX(-50%) translateY(0) scale(1)'},
      {offset:.86,transform:'translateX(-50%) translateY(0) scale(1)'},
      {offset:.95,transform:'translateX(-50%) translateY(5px) scale(1.1,.86)'},
      {offset:1,transform:'translateX(-50%) translateY(0) scale(1)'}
    ],{duration:1900,easing:'ease',fill:'forwards'});

    setTimeout(()=>message.textContent='折って、ねじって…',360);
    setTimeout(()=>message.textContent='もっと潰す…',760);
    setTimeout(()=>message.textContent='紙玉にして…',1180);
    setTimeout(()=>message.textContent='ゴミ箱へ…',1510);

    try{await Promise.all([paperAnim.finished,imageAnim.finished,binAnim.finished])}catch{}
    clearDrawing();
    try{if(typeof markTool==='function')markTool('scribble')}catch{}
    if(navigator.vibrate)navigator.vibrate([20,30,35]);
    message.textContent='捨てたよ。';
    status.textContent='ぐちゃぐちゃにして捨てたよ。';
    await new Promise(r=>setTimeout(r,520));
    paperAnim.cancel();imageAnim.cancel();binAnim.cancel();paper.classList.remove('crushing');unlock();
  };
})();