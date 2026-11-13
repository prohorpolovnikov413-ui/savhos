'use strict';
const $=s=>document.querySelector(s);
const UP=[
 {id:'tape',ic:'🩹',n:'Изолента',d:'+1 к нажатию. Чинит всё!',c:15,tap:1},
 {id:'vol',ic:'🙋',n:'Волонтёры',d:'+0,5 дела/сек',c:25,ps:.5,pp:2},
 {id:'chairs',ic:'🪑',n:'Стулья',d:'+2 дела/сек',c:120,ps:2,pp:3},
 {id:'kit',ic:'🧰',n:'Набор инструментов',d:'+5 к нажатию',c:400,tap:5},
 {id:'coffee',ic:'☕',n:'Кухня и кофе-брейк',d:'+8 дел/сек',c:900,ps:8,pp:5},
 {id:'sound',ic:'🎛',n:'Звукорежиссёр',d:'+20 дел/сек',c:3000,ps:20,pp:4},
 {id:'youth',ic:'🔥',n:'Молодёжка «4.0»',d:'+55 дел/сек',c:11000,ps:55,pp:12},
 {id:'choir',ic:'🎶',n:'Хор',d:'+140 дел/сек',c:40000,ps:140,pp:10},
 {id:'light',ic:'💡',n:'Свет и экраны',d:'+40 к нажатию',c:90000,tap:40},
 {id:'home',ic:'🏠',n:'Домашние группы',d:'+400 дел/сек',c:200000,ps:400,pp:25},
 {id:'kvart',ic:'🎸',n:'Квартирники',d:'+1200 дел/сек',c:800000,ps:1200,pp:30},
];
const LOC=[
 {n:'Кабинет завхоза',bg:'office',at:0},
 {n:'Коридор',bg:'corridor',at:500},
 {n:'Фойе и кафе',bg:'cafe',at:5000},
 {n:'Зал: расставляем стулья',bg:'hall_empty',at:40000},
 {n:'Зал готов к служению',bg:'hall',at:300000},
 {n:'Полный зал в воскресенье',bg:'sunday',at:2000000},
];
const ACH=[
 {id:'t1',n:'Первое доброе дело',d:'Нажать 1 раз',f:s=>s.taps>=1},
 {id:'t1000',n:'Расставил 1000 стульев',d:'Нажать 1000 раз',f:s=>s.taps>=1000},
 {id:'tape',n:'Изолентой можно всё',d:'Купить 10 изолент',f:s=>(s.u.tape||0)>=10},
 {id:'vol10',n:'Команда мечты',d:'10 волонтёров',f:s=>(s.u.vol||0)>=10},
 {id:'p100',n:'Сотня гостей',d:'100 человек в церкви',f:s=>people(s)>=100},
 {id:'p1000',n:'Тысяча прихожан',d:'1000 человек в церкви',f:s=>people(s)>=1000},
 {id:'fuse',n:'Да будет свет!',d:'Починить пробки',f:s=>s.fix>=1},
 {id:'mic',n:'Раз-раз, проверка',d:'Починить микрофон',f:s=>s.mic>=1},
 {id:'youth',n:'Молодёжь горит',d:'Открыть «4.0»',f:s=>(s.u.youth||0)>=1},
 {id:'sun',n:'Воскресенье!',d:'Дойти до полного зала',f:s=>s.total>=LOC[5].at},
 {id:'m1',n:'Миллион добрых дел',d:'Всего 1 000 000 дел',f:s=>s.total>=1e6},
];
const VERSES=['«Всё у вас да будет с любовью» (1 Кор 16:14)','«Служите друг другу» (Гал 5:13)','«Делая добро, да не унываем» (Гал 6:9)','«Всё, что делаете, делайте от души» (Кол 3:23)'];
const KEY='zavhoz_sz_v1';
let S={d:0,total:0,taps:0,u:{},ach:{},fix:0,mic:0,t:Date.now(),loc:0};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY))||{})}catch(e){}
let ev=null; // {type,end,need,got}
const cnt=id=>S.u[id]||0;
const cost=u=>Math.ceil(u.c*Math.pow(1.15,cnt(u.id)));
const tapVal=()=>(1+UP.reduce((a,u)=>a+(u.tap||0)*cnt(u.id),0))*mult();
const psBase=()=>UP.reduce((a,u)=>a+(u.ps||0)*cnt(u.id),0);
const mult=()=>ev&&ev.type==='sunday'?2:1;
const ps=()=>(ev&&(ev.type==='fuse'||ev.type==='mic'))?0:psBase()*mult();
function people(s){return 3+UP.reduce((a,u)=>a+(u.pp||0)*((s.u||{})[u.id]||0),0)+Math.floor(Math.sqrt(s.total/50))}
function churchStage(s){const p=people(s);if(p>=500)return 5;if(p>=200)return 4;if(p>=80)return 3;if(p>=20)return 2;return 1}
let shownChurch=0;
function renderChurch(){
  const st=churchStage(S);
  if(st===shownChurch)return;
  const img=tapEl.querySelector('img');
  if(img)img.src='img/church'+st+'.webp';
  if(shownChurch&&st>shownChurch){
    tapEl.classList.remove('evolve');void tapEl.offsetWidth;
    tapEl.classList.add('evolve');
    setTimeout(()=>tapEl.classList.remove('evolve'),800);
    toast('⛪ Церковь преобразилась!');
    vib([30,40,30]);
  }
  shownChurch=st;
}
[1,2,3,4,5].forEach(n=>{const i=new Image();i.src='img/church'+n+'.webp'});
const fmt=n=>{n=Math.floor(n);if(n<1e4)return n.toLocaleString('ru-RU');const z=[[1e12,' трлн'],[1e9,' млрд'],[1e6,' млн'],[1e3,' тыс']];for(const[v,s]of z)if(n>=v)return(n/v).toFixed(n/v<100?1:0).replace('.',',')+s;};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),2600)}
function modal(t){$('#mtext').innerHTML=t;$('#modal').hidden=false}
$('#mok').onclick=()=>$('#modal').hidden=true;
function vib(ms){try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}
function save(){S.t=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function add(n){S.d+=n;S.total+=n}
// tap
const tapEl=$('#tap');
function onTap(x,y){
  if(ev&&(ev.type==='fuse'||ev.type==='mic')){ev.got++;float(x,y,ev.type==='fuse'?'⚡':'🎤');vib(8);if(ev.got>=ev.need)fixEvent();renderEvent();return}
  const v=tapVal();add(v);S.taps++;float(x,y,'+'+fmt(v));vib(10);
  tapEl.classList.add('hit');setTimeout(()=>tapEl.classList.remove('hit'),80);
}
tapEl.addEventListener('pointerdown',e=>{e.preventDefault();onTap(e.clientX,e.clientY)});
document.addEventListener('dblclick',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault());
function float(x,y,t){const f=document.createElement('div');f.className='fl';f.textContent=t;f.style.left=(x-20+Math.random()*30)+'px';f.style.top=(y-30)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),900)}
// events
function startEvent(){
  if(ev||S.total<100)return;
  const r=Math.random(),now=Date.now();
  if(r<.3){ev={type:'sunday',end:now+30000};vib([30,40,30])}
  else if(r<.55){const b=Math.max(50,Math.round(psBase()*60+tapVal()*20));add(b);toast('🎸 Квартирник «ДВИЖ»! Пришли друзья: +'+fmt(b)+' дел');return}
  else if(r<.8){ev={type:'fuse',end:now+15000,need:15+Math.min(25,cnt('vol')),got:0};vib(200)}
  else{ev={type:'mic',end:now+15000,need:10,got:0};vib(100)}
  renderEvent();
}
function fixEvent(){const t=ev.type;if(t==='fuse'){S.fix++;toast('💡 Свет есть! Можно продолжать служение')}else{S.mic++;toast('🎤 Микрофон работает. Раз-раз!')}add(Math.round(psBase()*15+10));ev=null;renderEvent()}
function renderEvent(){
  const e=$('#event');tapEl.classList.toggle('broken',!!ev&&ev.type!=='sunday');
  if(!ev){e.hidden=true;$('#hint').hidden=false;return}
  $('#hint').hidden=true;e.hidden=false;const left=Math.max(0,Math.ceil((ev.end-Date.now())/1000));
  if(ev.type==='sunday'){e.className='good';e.innerHTML='⛪ <b>Воскресное служение!</b><br>Все дела ×2 — ещё '+left+' с'}
  else if(ev.type==='fuse'){e.className='';e.innerHTML='⚡ <b>Выбило пробки!</b> Доход на паузе.<br>Быстро жми на церковь: '+ev.got+'/'+ev.need+' — '+left+' с<img src="img/panel.webp" alt="">'}
  else{e.className='';e.innerHTML='🎤 <b>Сломался микрофон!</b> Пастор ждёт.<br>Жми, чтобы починить: '+ev.got+'/'+ev.need+' — '+left+' с'}
}
// location
function curLoc(){let i=0;LOC.forEach((l,k)=>{if(S.total>=l.at)i=k});return i}
let shownLoc=-1;
function renderLoc(){
  const i=curLoc();
  if(i!==shownLoc){$('#bg').style.backgroundImage='url(img/'+LOC[i].bg+'.webp)';if(shownLoc>=0&&i>S.loc){modal('🎉 Открыта новая локация:<br><b>'+LOC[i].n+'</b><br><br><i>'+VERSES[i%VERSES.length]+'</i>');vib([40,60,40])}shownLoc=i;S.loc=Math.max(S.loc,i)}
  $('#locName').textContent='📍 '+LOC[i].n;
  const nx=LOC[i+1];
  if(nx){const p=(S.total-LOC[i].at)/(nx.at-LOC[i].at);$('#locBar i').style.width=Math.min(100,p*100)+'%';$('#locNext').textContent='Дальше: '+nx.n+' — '+fmt(nx.at)}
  else{$('#locBar i').style.width='100%';$('#locNext').textContent='Вы дошли до полного зала! Слава Богу 🙏'}
}
// panels
let panel=null;
function openP(p){panel=p;$('#panel').hidden=false;$('#ptitle').textContent={shop:'🛠 Улучшения',ach:'🏆 Достижения',info:'ℹ️ Об игре'}[p];renderP(true)}
$('#pclose').onclick=()=>{panel=null;$('#panel').hidden=true};
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>panel===b.dataset.p?$('#pclose').onclick():openP(b.dataset.p));
function renderP(full){
  const b=$('#pbody');
  if(panel==='shop'){
    if(full||b.children.length!==UP.length){b.innerHTML=UP.map((u,k)=>`<div class="it" id="u_${u.id}"><div class="ic">${u.ic}</div><div class="tx"><b>${u.n}</b> <span class="c"></span><br>${u.d}</div><button data-k="${k}"></button></div>`).join('');b.querySelectorAll('button').forEach(x=>x.onclick=()=>buy(UP[x.dataset.k]))}
    UP.forEach((u,k)=>{const el=$('#u_'+u.id),c=cost(u),lock=k>1&&cnt(UP[k-1].id)===0&&cnt(u.id)===0;el.classList.toggle('lock',lock);el.querySelector('.c').textContent=cnt(u.id)?'×'+cnt(u.id):'';const bt=el.querySelector('button');bt.textContent=fmt(c);bt.disabled=S.d<c||lock});
  }else if(panel==='ach'){
    if(full)b.innerHTML=ACH.map(a=>`<div class="it ach ${S.ach[a.id]?'ok':''}"><div class="ic">${S.ach[a.id]?'🏆':'🔒'}</div><div class="tx"><b>${a.n}</b><br>${a.d}</div></div>`).join('');
  }else if(panel==='info'&&full){
    b.innerHTML=`<div class="it"><div class="tx">Вы — завхоз церкви «Слово жизни» на Павла Корчагина, 2А. Нажимайте на церковь, делайте добрые дела, нанимайте волонтёров и запускайте молодёжку «4.0». Чем больше дел, тем больше людей приходит и тем больше залов открывается.<br><br>Иногда случается разное: воскресное служение удваивает дела, квартирник даёт бонус, а выбитые пробки и сломанный микрофон надо срочно чинить тапами.<br><br>Игра сохраняется сама. Пока вас нет, волонтёры трудятся (до 8 часов).<br><br>${VERSES[3]}</div></div><div class="it"><div class="tx">Всего дел: <b>${fmt(S.total)}</b><br>Нажатий: <b>${fmt(S.taps)}</b></div></div><button id="reset" style="background:#7a1f1f;width:100%;margin-top:6px">Начать заново</button>`;
    $('#reset').onclick=()=>{if(confirm('Стереть прогресс и начать заново?')){localStorage.removeItem(KEY);location.reload()}};
  }
}
function buy(u){const c=cost(u);if(S.d<c)return;S.d-=c;S.u[u.id]=cnt(u.id)+1;vib(15);toast(u.ic+' '+u.n+' — куплено!');renderP();save()}
function checkAch(){ACH.forEach(a=>{if(!S.ach[a.id]&&a.f(S)){S.ach[a.id]=1;toast('🏆 Достижение: '+a.n);if(panel==='ach')renderP(true)}})}
// offline
(function(){const dt=Math.min(8*3600,(Date.now()-(S.t||Date.now()))/1000);const g=Math.floor(psBase()*dt*.5);if(g>0&&dt>30){add(g);setTimeout(()=>modal('С возвращением! 👋<br>Пока вас не было, волонтёры сделали<br><b>'+fmt(g)+'</b> добрых дел.'),300)}})();
// loop
let last=performance.now(),acc=0,evTimer=Date.now()+45000;
function frame(now){
  const dt=Math.min(1,(now-last)/1000);last=now;add(ps()*dt);
  if(ev&&Date.now()>ev.end){if(ev.type!=='sunday')toast(ev.type==='fuse'?'Пробки починил электрик. Доход вернулся':'Микрофон заменили запасным');ev=null;renderEvent()}
  if(!ev&&Date.now()>evTimer){startEvent();evTimer=Date.now()+40000+Math.random()*50000}
  acc+=dt;
  $('#deeds').textContent=fmt(S.d);
  if(acc>.25){acc=0;$('#dps').textContent=fmt(ps());$('#dpt').textContent=fmt(tapVal());$('#people').textContent=fmt(people(S));renderLoc();renderChurch();if(panel==='shop')renderP();if(ev)renderEvent();checkAch()}
  requestAnimationFrame(frame);
}
renderChurch();
requestAnimationFrame(frame);
setInterval(save,5000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
window.addEventListener('pagehide',save);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
window.__game={S,startEvent,get ev(){return ev}};
