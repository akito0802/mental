(()=>{
  const card=document.querySelector('.release-tool[data-tool="scribble"]');
  const canvas=document.querySelector('#scribbleCanvas');
  const clearBtn=document.querySelector('#clearCanvas');
  if(!card||!canvas||!clearBtn)return;

  const VERSION='v9';

  const style=document.createElement('style');
  style.textContent=`
    .scribble-trash-button{margin-top:10px;background:#f5e6e5;color:#7a403e;border:0;border-radius:16px;padding:13px 16px;font-weight:800;width:100%}
    .scribble-trash-button:active{transform:scale(.985)}
    .scribble-trash-status{min-height:18px;margin:7px 0 0;text-align:center;font-size:11px;color:var(--muted,#66777f)}
    #scribbleExactModal{position:fixed!important;inset:0!important;z-index:2147483647!important;background:rgba(18,31,35,.78)!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;box-sizing:border-box!important;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
    #scribbleExactModal[hidden]{display:none!important}
    #scribbleExactModal .scribble-exact-wrap{width:min(92vw,390px);margin:0}
    #scribbleExactModal .paper-bin-stage{width:100%;min-height:230px;margin:0!important;background:linear-gradient(180deg,#f7f8f6,#eef2f0)}
    #scribbleExactModal .paper-sheet{height:104px;min-height:104px;padding:0!important;overflow:hidden!important}
    #scribbleExactModal .paper-sheet img{display:block;width:100%;height:100%;object-fit:contain;background:#f5f7f6}
    #scribbleExactModal .scribble-exact-title{text-align:center;color:#fff;font-size:12px;font-weight:800;letter-spacing:.08em;margin:0 0 10px}
    #scribbleExactModal .scribble-exact-version{text-align:center;color:rgba(255,255,255,.6);font-size:9px;font-weight:900;margin:8px 0 0}
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
    trashBtn.insertAdjacentElement('afterend',status);
  }
  status.textContent='PAPER CRUMPLEと同じ動きで、そのまま捨てられる。';

  document.querySelector('#scribbleTrashModal')?.remove();
  document.querySelector('#scribbleExactModal')?.remove();

  const modal=document.createElement('div');
  modal.id='scribbleExactModal';
  modal.hidden=true;
  modal.innerHTML=`
    <div class="scribble-exact-wrap">
      <div class="scribble-exact-title">描いた紙を丸めて捨てる</div>
      <div class="paper-bin-stage">
        <div class="paper-sheet" id="scribbleExactPaper"><img id="scribbleExactImage" alt="描いた落書き"></div>
        <div class="bin">⌄<span>BIN</span></div>
      </div>
      <div class="scribble-exact-version">${VERSION} · SAME AS PAPER CRUMPLE</div>
    </div>`;
  document.body.appendChild(modal);

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

  function lock(){
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
  }
  function unlock(){
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
  }

  trashBtn.onclick=()=>{
    if(running)return;
    if(!hasInk()){
      status.textContent='まだ何も描かれてないよ。先に好きに描いてみて。';
      return;
    }

    running=true;
    trashBtn.disabled=true;
    clearBtn.disabled=true;

    const paper=modal.querySelector('#scribbleExactPaper');
    const img=modal.querySelector('#scribbleExactImage');

    img.src=canvas.toDataURL('image/png');
    modal.hidden=false;
    lock();
    status.textContent='PAPER CRUMPLEと同じ動きで丸めてる…';

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>paper.classList.add('crumpling'));
    });

    setTimeout(()=>{
      clearDrawing();
      try{if(typeof markTool==='function')markTool('scribble')}catch{}
      if(navigator.vibrate)navigator.vibrate(30);
      status.textContent='捨てたよ。';
    },680);

    setTimeout(()=>{
      paper.classList.remove('crumpling');
      modal.hidden=true;
      unlock();
      trashBtn.disabled=false;
      clearBtn.disabled=false;
      running=false;
    },1050);
  };
})();