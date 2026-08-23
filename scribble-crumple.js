(()=>{
  const card=document.querySelector('.release-tool[data-tool="scribble"]');
  const canvas=document.querySelector('#scribbleCanvas');
  const clearBtn=document.querySelector('#clearCanvas');
  if(!card||!canvas||!clearBtn)return;

  const style=document.createElement('style');
  style.textContent=`
    .scribble-trash-button{margin-top:10px;background:#f5e6e5;color:#7a403e;border:0;border-radius:16px;padding:13px 16px;font-weight:800;width:100%}
    .scribble-trash-button:active{transform:scale(.985)}
    .scribble-canvas-wrap{position:relative;width:100%;margin:12px 0;border-radius:18px;overflow:hidden}
    .scribble-canvas-wrap #scribbleCanvas{margin:0!important}
    .scribble-trash-stage{position:absolute;inset:0;z-index:8;background:linear-gradient(180deg,#f8f8f5,#eef2f0);border:1px solid var(--line,#d8e3df);border-radius:18px;overflow:hidden;display:flex;align-items:flex-start;justify-content:center;padding:12px;pointer-events:none}
    .scribble-trash-stage[hidden]{display:none!important}
    .scribble-paper{position:relative;width:88%;height:64%;min-height:120px;background:#fffdf7;border:1px solid #e8dfcf;border-radius:5px;box-shadow:0 8px 20px rgba(55,50,40,.10);overflow:hidden;transform-origin:center center;z-index:2}
    .scribble-paper img{width:100%;height:100%;object-fit:contain;display:block;background:#f5f7f6}
    .scribble-bin{position:absolute;z-index:1;bottom:10px;width:92px;height:54px;background:#50656d;color:#fff;border-radius:10px 10px 17px 17px;text-align:center;font-size:25px;line-height:30px;box-shadow:inset 0 5px 0 rgba(255,255,255,.08)}
    .scribble-bin:before{content:'';position:absolute;left:-7px;right:-7px;top:-7px;height:10px;background:#435961;border-radius:8px}
    .scribble-bin span{display:block;font-size:8px;letter-spacing:.18em;line-height:12px}
    .scribble-trash-status{min-height:18px;margin:7px 0 0;text-align:center;font-size:11px;color:var(--muted,#66777f)}
    .scribble-paper::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;background:repeating-linear-gradient(35deg,transparent 0 12px,rgba(80,70,55,.09) 13px 14px)}
    .scribble-paper.is-crumpling::after{animation:scribbleWrinkles .34s ease forwards}
    @keyframes scribbleWrinkles{0%{opacity:0}100%{opacity:.72}}
    @media(max-width:420px){.scribble-paper{width:92%;height:62%;min-height:110px}.scribble-bin{bottom:8px}}
  `;
  document.head.appendChild(style);

  const trashBtn=document.createElement('button');
  trashBtn.id='crumpleScribble';
  trashBtn.className='scribble-trash-button';
  trashBtn.type='button';
  trashBtn.textContent='描いたものを丸めて捨てる';

  const status=document.createElement('p');
  status.className='scribble-trash-status';
  status.setAttribute('aria-live','polite');
  status.textContent='描いたら、その場で丸めて捨てられるよ。';

  const wrapper=document.createElement('div');
  wrapper.className='scribble-canvas-wrap';
  canvas.parentNode.insertBefore(wrapper,canvas);
  wrapper.appendChild(canvas);

  const stage=document.createElement('div');
  stage.className='scribble-trash-stage';
  stage.hidden=true;
  stage.innerHTML='<div class="scribble-paper" id="scribblePaper"><img id="scribbleSnapshot" alt="描いた落書き" /></div><div class="scribble-bin" id="scribbleBin">⌄<span>BIN</span></div>';
  wrapper.appendChild(stage);

  const actions=clearBtn.closest('.row');
  actions.insertAdjacentElement('afterend',trashBtn);
  trashBtn.insertAdjacentElement('afterend',status);

  const ctx=canvas.getContext('2d');
  let running=false;

  function hasInk(){
    try{
      const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      for(let i=3;i<data.length;i+=32){if(data[i]>0)return true}
    }catch{}
    return false;
  }

  function clearDrawing(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    try{drawn=false}catch{}
  }

  trashBtn.addEventListener('click',async()=>{
    if(running)return;
    if(!hasInk()){
      status.textContent='まだ何も描かれてないよ。先に好きに描いてみて。';
      return;
    }

    running=true;
    trashBtn.disabled=true;
    clearBtn.disabled=true;

    const paper=stage.querySelector('#scribblePaper');
    const img=stage.querySelector('#scribbleSnapshot');
    const bin=stage.querySelector('#scribbleBin');
    img.src=canvas.toDataURL('image/png');
    stage.hidden=false;
    status.textContent='ぐしゃっと丸めて…';

    requestAnimationFrame(()=>wrapper.scrollIntoView({behavior:'smooth',block:'center'}));

    const h=Math.max(210,wrapper.getBoundingClientRect().height);
    const drop=Math.max(115,Math.min(165,h*.55));
    const paperAnim=paper.animate([
      {offset:0,transform:'translateY(0) rotate(0deg) scale(1)',width:'88%',borderRadius:'5px',opacity:1},
      {offset:.18,transform:'translateY(2px) rotate(-9deg) scale(.94)',width:'76%',borderRadius:'14px 28px 19px 31px',opacity:1},
      {offset:.38,transform:'translateY(14px) rotate(48deg) scale(.86)',width:'118px',height:'92px',borderRadius:'43% 57% 39% 61%',opacity:1},
      {offset:.58,transform:'translateY(32px) rotate(155deg) scale(.9)',width:'70px',height:'66px',borderRadius:'48% 52% 46% 54%',opacity:1},
      {offset:.78,transform:`translateY(${drop*.62}px) rotate(330deg) scale(.82)`,width:'57px',height:'57px',borderRadius:'50%',opacity:1},
      {offset:1,transform:`translateY(${drop}px) rotate(540deg) scale(.18)`,width:'46px',height:'46px',borderRadius:'50%',opacity:0}
    ],{duration:900,easing:'cubic-bezier(.22,.74,.18,1)',fill:'forwards'});

    const binAnim=bin.animate([
      {offset:0,transform:'translateY(0) scale(1)'},
      {offset:.72,transform:'translateY(0) scale(1)'},
      {offset:.86,transform:'translateY(3px) scale(1.07,.9)'},
      {offset:1,transform:'translateY(0) scale(1)'}
    ],{duration:900,easing:'ease',fill:'forwards'});

    try{await paperAnim.finished;await binAnim.finished}catch{}
    clearDrawing();
    try{if(typeof markTool==='function')markTool('scribble')}catch{}
    if(navigator.vibrate)navigator.vibrate(30);
    status.textContent='捨てたよ。もう一回描いても、ここで終わってもいい。';

    setTimeout(()=>{
      paperAnim.cancel();
      binAnim.cancel();
      paper.classList.remove('is-crumpling');
      stage.hidden=true;
      trashBtn.disabled=false;
      clearBtn.disabled=false;
      running=false;
    },260);
  });
})();