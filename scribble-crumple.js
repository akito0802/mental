(()=>{
  const card=document.querySelector('.release-tool[data-tool="scribble"]');
  const canvas=document.querySelector('#scribbleCanvas');
  const clearBtn=document.querySelector('#clearCanvas');
  if(!card||!canvas||!clearBtn)return;

  const style=document.createElement('style');
  style.textContent=`
    .scribble-trash-button{margin-top:10px;background:#f5e6e5;color:#7a403e;border:0;border-radius:16px;padding:13px 16px;font-weight:800;width:100%}
    .scribble-trash-button:active{transform:scale(.985)}
    .scribble-trash-status{min-height:18px;margin:7px 0 0;text-align:center;font-size:11px;color:var(--muted,#66777f)}
    .scribble-modal{position:fixed;inset:0;z-index:99999;background:rgba(20,35,40,.74);display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
    .scribble-modal[hidden]{display:none!important}
    .scribble-modal-stage{position:relative;width:min(92vw,430px);height:min(68vh,520px);min-height:390px;max-height:520px;border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#fafaf7 0%,#eef3f1 100%);box-shadow:0 25px 80px rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.75)}
    .scribble-modal-title{position:absolute;z-index:10;top:16px;left:0;right:0;text-align:center;font-size:12px;font-weight:800;letter-spacing:.08em;color:#50656d}
    .scribble-paper{position:absolute;z-index:5;top:58px;left:50%;width:82%;height:44%;min-height:160px;transform:translateX(-50%);background:#fffdf7;border:1px solid #e8dfcf;border-radius:8px;box-shadow:0 10px 30px rgba(55,50,40,.14);overflow:hidden;transform-origin:center center}
    .scribble-paper img{width:100%;height:100%;display:block;object-fit:contain;background:#f5f7f6}
    .scribble-paper:after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;background:repeating-linear-gradient(37deg,transparent 0 11px,rgba(80,70,55,.1) 12px 13px)}
    .scribble-paper.wrinkle:after{animation:scribbleWrinkles .32s ease forwards}
    .scribble-bin{position:absolute;z-index:3;left:50%;bottom:42px;transform:translateX(-50%);width:118px;height:76px;background:#50656d;color:#fff;border-radius:13px 13px 22px 22px;text-align:center;font-size:31px;line-height:43px;box-shadow:0 10px 22px rgba(38,55,60,.18),inset 0 6px 0 rgba(255,255,255,.07)}
    .scribble-bin:before{content:'';position:absolute;left:-10px;right:-10px;top:-10px;height:13px;background:#41565e;border-radius:9px}
    .scribble-bin span{display:block;font-size:9px;letter-spacing:.2em;line-height:16px}
    .scribble-modal-message{position:absolute;left:16px;right:16px;bottom:12px;text-align:center;font-size:12px;font-weight:700;color:#5f7077}
    @keyframes scribbleWrinkles{from{opacity:0}to{opacity:.82}}
    @media(max-width:430px){
      .scribble-modal{padding:12px}
      .scribble-modal-stage{width:94vw;height:64vh;min-height:370px;border-radius:24px}
      .scribble-paper{top:52px;width:86%;height:42%;min-height:145px}
      .scribble-bin{bottom:38px;width:108px;height:70px}
    }
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
    const actions=clearBtn.closest('.row');
    actions.insertAdjacentElement('afterend',trashBtn);
  }
  if(!status){
    status=document.createElement('p');
    status.className='scribble-trash-status';
    status.setAttribute('aria-live','polite');
    status.textContent='描いたものを、画面中央で丸めて捨てられるよ。';
    trashBtn.insertAdjacentElement('afterend',status);
  }

  let modal=document.querySelector('#scribbleTrashModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='scribbleTrashModal';
    modal.className='scribble-modal';
    modal.hidden=true;
    modal.innerHTML=`
      <div class="scribble-modal-stage" role="dialog" aria-label="落書きを丸めて捨てる演出">
        <div class="scribble-modal-title">SCRIBBLE → CRUMPLE → BIN</div>
        <div class="scribble-paper" id="scribbleModalPaper"><img id="scribbleModalImage" alt="描いた落書き"></div>
        <div class="scribble-bin" id="scribbleModalBin">⌄<span>BIN</span></div>
        <div class="scribble-modal-message" id="scribbleModalMessage">ぐしゃっと丸めて捨てる</div>
      </div>`;
    document.body.appendChild(modal);
  }

  const ctx=canvas.getContext('2d');
  let running=false;

  function hasInk(){
    try{
      const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      for(let i=3;i<data.length;i+=16){if(data[i]>0)return true}
    }catch{}
    return false;
  }

  function clearDrawing(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    try{drawn=false}catch{}
  }

  trashBtn.onclick=async()=>{
    if(running)return;
    if(!hasInk()){
      status.textContent='まだ何も描かれてないよ。先に好きに描いてみて。';
      return;
    }

    running=true;
    trashBtn.disabled=true;
    clearBtn.disabled=true;

    const paper=modal.querySelector('#scribbleModalPaper');
    const img=modal.querySelector('#scribbleModalImage');
    const bin=modal.querySelector('#scribbleModalBin');
    const message=modal.querySelector('#scribbleModalMessage');

    img.src=canvas.toDataURL('image/png');
    modal.hidden=false;
    document.documentElement.style.overflow='hidden';
    paper.classList.add('wrinkle');
    message.textContent='ぐしゃっと丸めて…';
    status.textContent='画面中央で捨ててるよ。';

    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

    const stage=modal.querySelector('.scribble-modal-stage');
    const stageH=stage.getBoundingClientRect().height;
    const drop=Math.max(175,Math.min(265,stageH-225));

    const paperAnim=paper.animate([
      {offset:0,transform:'translateX(-50%) translateY(0) rotate(0deg) scale(1)',width:'82%',height:'44%',borderRadius:'8px',opacity:1},
      {offset:.16,transform:'translateX(-50%) translateY(1px) rotate(-8deg) scale(.95)',width:'72%',height:'39%',borderRadius:'16px 27px 18px 30px',opacity:1},
      {offset:.34,transform:'translateX(-50%) translateY(18px) rotate(48deg) scale(.88)',width:'132px',height:'108px',borderRadius:'42% 58% 38% 62%',opacity:1},
      {offset:.52,transform:'translateX(-50%) translateY(46px) rotate(152deg) scale(.92)',width:'82px',height:'76px',borderRadius:'47% 53% 45% 55%',opacity:1},
      {offset:.68,transform:'translateX(-50%) translateY(78px) rotate(270deg) scale(.88)',width:'62px',height:'61px',borderRadius:'50%',opacity:1},
      {offset:.84,transform:`translateX(-50%) translateY(${drop*.72}px) rotate(405deg) scale(.72)`,width:'56px',height:'56px',borderRadius:'50%',opacity:1},
      {offset:1,transform:`translateX(-50%) translateY(${drop}px) rotate(585deg) scale(.12)`,width:'48px',height:'48px',borderRadius:'50%',opacity:0}
    ],{duration:1250,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});

    const binAnim=bin.animate([
      {offset:0,transform:'translateX(-50%) translateY(0) scale(1)'},
      {offset:.78,transform:'translateX(-50%) translateY(0) scale(1)'},
      {offset:.9,transform:'translateX(-50%) translateY(4px) scale(1.08,.88)'},
      {offset:1,transform:'translateX(-50%) translateY(0) scale(1)'}
    ],{duration:1250,easing:'ease',fill:'forwards'});

    setTimeout(()=>message.textContent='ゴミ箱へ…',700);

    try{await paperAnim.finished;await binAnim.finished}catch{}
    clearDrawing();
    try{if(typeof markTool==='function')markTool('scribble')}catch{}
    if(navigator.vibrate)navigator.vibrate(30);
    message.textContent='捨てたよ。';
    status.textContent='捨てたよ。もう一回描いても、ここで終わってもいい。';

    await new Promise(r=>setTimeout(r,520));
    paperAnim.cancel();
    binAnim.cancel();
    paper.classList.remove('wrinkle');
    modal.hidden=true;
    document.documentElement.style.overflow='';
    trashBtn.disabled=false;
    clearBtn.disabled=false;
    running=false;
  };
})();