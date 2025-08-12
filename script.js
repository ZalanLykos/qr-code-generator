// Elements
const dataIn = document.getElementById('data');
const sizeIn = document.getElementById('size');
const fg = document.getElementById('fg');
const bg = document.getElementById('bg');
const genBtn = document.getElementById('gen');
const qrImg = document.getElementById('qrImg');
const sizeOut = document.getElementById('sizeOut');
const dataPreview = document.getElementById('dataPreview');
const format = document.getElementById('format');
const copyLink = document.getElementById('copyLink');
const downloadBtn = document.getElementById('download');
const openNew = document.getElementById('openNew');
const resetBtn = document.getElementById('reset');

// helpers
function encodeParam(s){ return encodeURIComponent(s); }

function makeApiUrl(text,size,foreground,background,fmt){
  if(fmt === 'svg'){
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeParam(text)}&size=${size}x${size}&color=${foreground.replace('#','')}&bgcolor=${background.replace('#','')}&format=svg`;
  } else {
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeParam(text)}&size=${size}x${size}&color=${foreground.replace('#','')}&bgcolor=${background.replace('#','')}&format=png`;
  }
}

function updatePreview(url){
  qrImg.src = url;
  qrImg.width = Number(sizeIn.value);
  qrImg.height = Number(sizeIn.value);
  dataPreview.textContent = dataIn.value || '(empty)';
  sizeOut.textContent = sizeIn.value;
}

function generate(){
  const text = dataIn.value.trim();
  if(!text){
    alert('Enter a link or text to encode.');
    return;
  }
  const s = sizeIn.value;
  const fgcol = fg.value;
  const bgcol = bg.value;
  const fmt = format.value;
  const url = makeApiUrl(text,s,fgcol,bgcol,fmt);
  updatePreview(url);
  qrImg.dataset.url = url;
  qrImg.dataset.text = text;
}

genBtn.addEventListener('click', generate);

copyLink.addEventListener('click', async ()=>{
  const url = qrImg.dataset.url;
  if(!url){ alert('Generate a QR first.'); return; }
  try{
    await navigator.clipboard.writeText(url);
    copyLink.textContent = 'Copied!';
    setTimeout(()=>copyLink.textContent='Copy image URL',1200);
  }catch(e){
    alert('Copy failed. Open image and copy manually.');
  }
});

downloadBtn.addEventListener('click', async ()=>{
  const url = qrImg.dataset.url;
  if(!url){ alert('Generate a QR first.'); return; }
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('fetch failed');
    const blob = await res.blob();
    const a = document.createElement('a');
    const ext = format.value === 'svg' ? 'svg' : 'png';
    a.href = URL.createObjectURL(blob);
    const safeName = (qrImg.dataset.text || 'qr').replace(/[^a-z0-9_\-\.]/ig,'_').slice(0,40);
    a.download = `${safeName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }catch(err){
    window.open(url, '_blank');
  }
});

openNew.addEventListener('click', ()=>{
  const url = qrImg.dataset.url;
  if(!url){ alert('Generate a QR first.'); return; }
  window.open(url, '_blank');
});

resetBtn.addEventListener('click', ()=>{
  dataIn.value = 'https://zalanlykos.github.io/web';
  sizeIn.value = 360;
  fg.value = '#111827';
  bg.value = '#ffffff';
  format.value = 'png';
  generate();
});

sizeIn.addEventListener('input', ()=>{
  sizeOut.textContent = sizeIn.value;
});

dataIn.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ generate(); } });

window.addEventListener('load', ()=>{ generate(); });
