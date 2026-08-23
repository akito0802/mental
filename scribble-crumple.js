(()=>{
  const card=document.querySelector('.release-tool[data-tool="scribble"]');
  const canvas=document.querySelector('#scribbleCanvas');
  const clearBtn=document.querySelector('#clearCanvas');
  if(!card||!canvas||!clearBtn)return;

  const VERSION='v7';
  const style=document.createElement('style');
  style.textContent=`
    .scribble-trash-button{margin-top:10px;background:#f5e6e5;color:#7a403e;border:0;border-radius:16px;padding:13px 16px;font-weight:800;width:100%}
    .scribble-trash-button:active{transform:scale(.985)}
    .scribble-trash-status{min-height:18px;margin:7px 0 0;text-align:center;font-size:11px;color:var(--muted,#66777f)}
    #scribbleTrashModal.scribble-modal{position:fixed!important;inset:0!important;top:0!important;right:0!important;bottom:0!important;left:0!important;width:100vw!important;width:100dvw!important;height:100vh!important;height:100dvh!important;z-index:2147483647!important;background:rgba(17,29,33,.84)!important;display:grid!important;place-items:center!important;padding:16px!important;box-sizing:border-box!important;overflow:hidden!important;overscroll-behavior:none!important;-webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px)}
    #scribbleTrashModal[hidden]{display:none!important}
    .scribble-modal-stage{position:relative!important;width:min(90vw,390px)!important;height:min(64vh,500px)!important;min-height:360px!important;max-height:500px!important;margin:0!important;border-radius:26px!important;overflow:hidden!important;background:linear-gradient(180deg,#fbfbf8 0%,#edf2f0 100%)!important;box-shadow:0 24px 70px rgba(0,0,0,.38)!important;border:1px solid rgba(255,255,255,.8)!important;transform:none!important}
    .scribble-modal-title{position:absolute;top:14px;left:0;right:0;text-align:center;font-size:11px;font-weight:900;letter-spacing:.12em;color:#50656d;z-index:20}
    .scribble-modal-version{position:absolute;top:13px;right:15px;font-size:9px;font-weight:900;color:#809096;z-index:21}
    .scribble-paper{position:absolute!important;z-index:8!important;top:50px!important;left:50%!important;width:82%!important;height:42%!important;min-height:145px!important;transform:translateX(-50%)!important;background:#fffdf7!important;border:1px solid #e8dfcf!important;border-radius:8px!important;box-shadow:0 10px 28px rgba(55,50,40,.14)!important;overflow:hidden!important;transform-origin:center center!important;margin:0!important;padding:0!important}
    .scribble-paper img{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;background:#f5f7f6!important}
    .scribble-paper:after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;background:repeating-linear-gradient(37deg,transparent 0 11px,rgba(80,70,55,.11) 12px 13px)}
    .scribble-paper.wrinkle:after{animation:scribbleWrinkles .3s ease forwards}
    .scribble-bin{position:absolute!important;z-index:5!important;left:50%!important;bottom:48px!important;transform:translateX(-50%)!important;width:112px!important;height:74px!important;background:#50656d!important;color:#fff!important;border-radius:13px 13px 22px 22px!important;text-align:center!important;font-size:30px!important;line-height:42px!important;box-shadow:0 10px 22px rgba(38,55,60,.18),inset 0 6px 0 rgba(255,255,255,.07)!important;margin:0!important}
    .scribble-bin:before{content:'';position:absolute;left:-10px;right:-10px;top:-10px;height:13px;background:#41565e;border-radius:9px}
    .scribble-bin span{display:block;font-size:9px;letter-spacing:.2em;line-height:16px}
    .scribble-modal-message{position:absolute;left:14px;right:14px;bottom:13px;text-align:center;font-size:12px;font-weight:800;color:#5f7077;z-index:10}
    .scribble-modal-close{position:absolute;top:10px;left:10px;z-index:30;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.88);color:#50656d;font-size:20px;line-height:34px;padding:0}
    @keyframes scribbleWrinkles{from{opacity:0}to{opacity:.82}}
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
    trashBtn.textContent='描いたものを丸めて捨てる';
    clearBtn.closest('.row').insertAdjacentElement('afterend',trashBtn);
  }
  if(!status){
    status=document.createElement('p');
    status.className='scribble-trash-status';
    status.setAttribute('aria-live','polite');
    status.textContent='描いたものを、画面中央で丸めて捨てられるよ。';
    trashBtn.insertAdjacentElement('afterend',status);
  }

  document.querySelector('#scribbleTrashModal')?.remove();
  const modal=document.createElement('div');
  modal.id='scribbleTrashModal';
  modal.className='scribble-modal';
  modal.hidden=true;
  modal.innerHTML=`<div class="scribble-modal-stage" role="dialog" aria-modal="true" aria-label="落書きを丸めて捨てる演出"><button class="scribble-modal-close" type="button" aria-label="閉じる">×</button><div class="scribble-modal-title">SCRIBBLE → CRUMPLE → BIN</div><div class="scribble-modal-version">${VERSION}</div><div class="scribble-paper"><img alt="描いた落書き"></div><div class="scribble-bin">⌄<span>BIN</span></div><div class="scribble-modal-message">ぐしゃっと丸めて捨てる</div></div>`;
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
    paper.classList.add('wrinkle');message.textContent='ぐしゃっと丸めて…';status.textContent='画面中央で捨ててるよ。';
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

    const stage=modal.querySelector('.scribble-modal-stage');
    const stageH=stage.clientHeight;
    const startTop=50;
    const binTop=stageH-48-74;
    const drop=Math.max(150,binTop-startTop-38);
    const paperAnim=paper.animate([
      {offset:0,transform:'translateX(-50%) translateY(0) rotate(0deg) scale(1)',width:'82%',height:'42%',borderRadius:'8px',opacity:1},
      {offset:.18,transform:'translateX(-50%) translateY(2px) rotate(-8deg) scale(.94)',width:'72%',height:'37%',borderRadius:'16px 27px 18px 30px',opacity:1},
      {offset:.38,transform:'translateX(-50%) translateY(18px) rotate(52deg) scale(.88)',width:'128px',height:'102px',borderRadius:'42% 58% 38% 62%',opacity:1},
      {offset:.58,transform:'translateX(-50%) translateY(44px) rotate(165deg) scale(.9)',width:'78px',height:'72px',borderRadius:'48% 52% 45% 55%',opacity:1},
      {offset:.76,transform:`translateX(-50%) translateY(${drop*.58}px) rotate(330deg) scale(.78)`,width:'58px',height:'58px',borderRadius:'50%',opacity:1},
      {offset:.92,transform:`translateX(-50%) translateY(${drop*.88}px) rotate(500deg) scale(.55)`,width:'52px',height:'52px',borderRadius:'50%',opacity:1},
      {offset:1,transform:`translateX(-50%) translateY(${drop}px) rotate(620deg) scale(.08)`,width:'48px',height:'48px',borderRadius:'50%',opacity:0}
    ],{duration:1350,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});
    const binAnim=bin.animate([
      {offset:0,transform:'translateX(-50%) translateY(0) scale(1)'},
      {offset:.84,transform:'translateX(-50%) translateY(0) scale(1)'},
      {offset:.94,transform:'translateX(-50%) translateY(4px) scale(1.08,.88)'},
      {offset:1,transform:'translateX(-50%) translateY(0) scale(1)'}
    ],{duration:1350,easing:'ease',fill:'forwards'});
    setTimeout(()=>message.textContent='ゴミ箱へ…',760);
    try{await Promise.all([paperAnim.finished,binAnim.finished])}catch{}
    clearDrawing();
    try{if(typeof markTool==='function')markTool('scribble')}catch{}
    if(navigator.vibrate)navigator.vibrate(30);
    message.textContent='捨てたよ。';status.textContent='捨てたよ。もう一回描いても、ここで終わってもいい。';
    await new Promise(r=>setTimeout(r,500));
    paperAnim.cancel();binAnim.cancel();paper.classList.remove('wrinkle');unlock();
  };
})();