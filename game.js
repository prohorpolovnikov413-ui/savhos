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
const BLD=[
 {id:'prayer',n:'Молитвенный дом',d:'Тихое место для молитвы. +2 к нажатию за уровень.',c:1500,ps:3,pp:8,tap:2},
 {id:'youthc',n:'Молодёжный центр «4.0»',d:'Дом молодёжки. События приходят чаще.',c:18000,ps:25,pp:15,ev:.08},
 {id:'school',n:'Воскресная школа',d:'Занятия для детей. Приходит больше семей.',c:75000,ps:80,pp:25,fam:.05},
 {id:'hall',n:'Большой зал богослужений',d:'Главный зал. Воскресное служение сильнее.',c:450000,ps:350,pp:40,sun:.2},
 {id:'conf',n:'Конференц-центр',d:'Зал для встреч. Волонтёры трудятся лучше без вас.',c:2100000,ps:1500,pp:60,off:.08},
 {id:'camp',n:'Летний лагерь',d:'Лагерь за городом. Все дела идут веселее.',c:10500000,ps:6000,pp:100,mul:.08},
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
 {id:'t100',n:'Только размялся',d:'Нажать 100 раз',f:s=>s.taps>=100},
 {id:'t1000',n:'Расставил 1000 стульев',d:'Нажать 1000 раз',f:s=>s.taps>=1000},
 {id:'t10k',n:'Руки завхоза не знают покоя',d:'Нажать 10 000 раз',f:s=>s.taps>=10000},
 {id:'m10k',n:'Десять тысяч добрых дел',d:'Всего 10 000 дел',f:s=>s.total>=1e4},
 {id:'m100k',n:'Изоленты уже мало',d:'Всего 100 000 дел',f:s=>s.total>=1e5},
 {id:'m1',n:'Миллион добрых дел',d:'Всего 1 000 000 дел',f:s=>s.total>=1e6},
 {id:'m10m',n:'Десять миллионов. Слава Богу!',d:'Всего 10 000 000 дел',f:s=>s.total>=1e7},
 {id:'p50',n:'Полсотни гостей',d:'50 человек в церкви',f:s=>people(s)>=50},
 {id:'p100',n:'Сотня гостей',d:'100 человек в церкви',f:s=>people(s)>=100},
 {id:'p500',n:'Даже на ступеньках сидят',d:'500 человек в церкви',f:s=>people(s)>=500},
 {id:'p1000',n:'Тысяча прихожан',d:'1000 человек в церкви',f:s=>people(s)>=1000},
 {id:'p5000',n:'Пять тысяч прихожан',d:'5000 человек в церкви',f:s=>people(s)>=5000},
 {id:'st2',n:'Церковь ожила',d:'Дойти до 2-й стадии церкви',f:s=>churchStage(s)>=2},
 {id:'st3',n:'Свет в окнах',d:'Дойти до 3-й стадии церкви',f:s=>churchStage(s)>=3},
 {id:'st4',n:'Дом наполняется',d:'Дойти до 4-й стадии церкви',f:s=>churchStage(s)>=4},
 {id:'st5',n:'Храм сияет',d:'Дойти до 5-й стадии церкви',f:s=>churchStage(s)>=5},
 {id:'st6',n:'Двор полон гостей',d:'Дойти до 6-й стадии церкви',f:s=>churchStage(s)>=6},
 {id:'st8',n:'Парковка и площадка',d:'Дойти до 8-й стадии церкви',f:s=>churchStage(s)>=8},
 {id:'st10',n:'Салют над храмом',d:'Дойти до 10-й стадии церкви',f:s=>churchStage(s)>=10},
 {id:'tape',n:'Изолентой можно всё',d:'Купить 10 изолент',f:s=>(s.u.tape||0)>=10},
 {id:'vol10',n:'Команда мечты',d:'10 волонтёров',f:s=>(s.u.vol||0)>=10},
 {id:'youth',n:'Молодёжь горит',d:'Открыть «4.0»',f:s=>(s.u.youth||0)>=1},
 {id:'b1',n:'Первое здание',d:'Построить любое здание',f:s=>bldOwned(s)>=1},
 {id:'b3',n:'Целый квартал',d:'Построить 3 здания',f:s=>bldOwned(s)>=3},
 {id:'ball',n:'Все здания',d:'Построить все 6 зданий',f:s=>bldOwned(s)>=BLD.length},
 {id:'b5',n:'Здание 5 уровня',d:'Улучшить любое здание до 5 уровня',f:s=>BLD.some(b=>bcnt(b.id,s)>=5)},
 {id:'fuse',n:'Да будет свет!',d:'Починить пробки',f:s=>s.fix>=1},
 {id:'fuse5',n:'Опять эти пробки!',d:'Починить пробки 5 раз',f:s=>s.fix>=5},
 {id:'mic',n:'Раз-раз, проверка',d:'Починить микрофон',f:s=>s.mic>=1},
 {id:'mic5',n:'Вечно этот микрофон',d:'Починить микрофон 5 раз',f:s=>s.mic>=5},
 {id:'sun',n:'Воскресенье!',d:'Дойти до полного зала',f:s=>s.total>=LOC[5].at},
 {id:'sun5',n:'Пять воскресений',d:'Провести 5 воскресных служений',f:s=>(s.sunN||0)>=5},
 {id:'sun20',n:'Служение как по расписанию',d:'Провести 20 воскресных служений',f:s=>(s.sunN||0)>=20},
 {id:'kv1',n:'Первый квартирник «ДВИЖ»',d:'Провести квартирник',f:s=>(s.kvN||0)>=1},
 {id:'kv10',n:'ДВИЖ не смолкает',d:'Провести 10 квартирников',f:s=>(s.kvN||0)>=10},
 {id:'off1',n:'С возвращением!',d:'Получить дела, пока вас не было',f:s=>(s.offN||0)>=1},
 {id:'night',n:'Ночной завхоз',d:'Играть ночью (с 22:00 до 6:00)',f:s=>!!s.night},
];
const VERSES=['«Всё у вас да будет с любовью» (1 Кор 16:14)','«Служите друг другу» (Гал 5:13)','«Делая добро, да не унываем» (Гал 6:9)','«Всё, что делаете, делайте от души» (Кол 3:23)'];
const KEY='zavhoz_sz_v1';
let S={d:0,total:0,taps:0,u:{},ach:{},fix:0,mic:0,t:Date.now(),loc:0};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY))||{})}catch(e){}
if(!S.u)S.u={};if(!S.ach)S.ach={};if(!S.b)S.b={};
let ev=null; // {type,end,need,got}
const cnt=id=>S.u[id]||0;
const bcnt=(id,s)=>{s=s||S;return ((s.b)||{})[id]||0};
const bldOwned=s=>BLD.filter(b=>bcnt(b.id,s)>=1).length;
const cost=u=>Math.ceil(u.c*Math.pow(1.15,cnt(u.id)));
const bcost=(b,s)=>Math.ceil(b.c*Math.pow(3,bcnt(b.id,s)));
const tapBld=()=>BLD.reduce((a,b)=>a+(b.tap||0)*bcnt(b.id),0);
const tapVal=()=>(1+UP.reduce((a,u)=>a+(u.tap||0)*cnt(u.id),0)+tapBld())*mult();
const psBuildings=()=>BLD.reduce((a,b)=>a+(b.ps||0)*bcnt(b.id),0);
const bldMul=()=>1+(BLD.find(b=>b.mul)?(BLD.find(b=>b.mul).mul)*bcnt('camp'):0);
const psBase=()=>(UP.reduce((a,u)=>a+(u.ps||0)*cnt(u.id),0)+psBuildings())*bldMul();
const sundayMul=()=>2+((BLD.find(b=>b.sun)||{}).sun||0)*bcnt('hall');
const mult=()=>ev&&ev.type==='sunday'?sundayMul():1;
const offRate=()=>.5+((BLD.find(b=>b.off)||{}).off||0)*bcnt('conf');
const evWait=()=>(40000+Math.random()*50000)*(1-((BLD.find(b=>b.ev)||{}).ev||0)*bcnt('youthc'));
const ps=()=>(ev&&(ev.type==='fuse'||ev.type==='mic'))?0:psBase()*mult();
function people(s){
  const u=s.u||{},bb=s.b||{};
  let p=3+UP.reduce((a,u0)=>a+(u0.pp||0)*(u[u0.id]||0),0)+Math.floor(Math.sqrt(s.total/50));
  p+=BLD.reduce((a,b)=>a+(b.pp||0)*(bb[b.id]||0),0);
  const sch=bb.school||0,fam=(BLD.find(b=>b.fam)||{}).fam||0;
  if(sch&&fam)p=Math.floor(p*(1+fam*sch));
  return p;
}
function churchStage(s){const p=people(s);if(p>=12000)return 10;if(p>=7000)return 9;if(p>=4000)return 8;if(p>=2000)return 7;if(p>=1000)return 6;if(p>=500)return 5;if(p>=200)return 4;if(p>=80)return 3;if(p>=30)return 2;return 1}
function isNight(){const h=new Date().getHours();return h>=22||h<6}
function bBonus(b,lv){
  if(!lv)return '';
  if(b.tap)return ' · +'+(b.tap*lv)+' к нажатию';
  if(b.ev)return ' · события быстрее на '+Math.round(b.ev*100*lv)+'%';
  if(b.fam)return ' · прихожан +'+Math.round(b.fam*100*lv)+'%';
  if(b.sun)return ' · служение ×'+(2+b.sun*lv).toFixed(1).replace('.',',');
  if(b.off)return ' · офлайн '+Math.round((.5+b.off*lv)*100)+'%';
  if(b.mul)return ' · все дела +'+Math.round(b.mul*100*lv)+'%';
  return '';
}
function stars(lv){return '★'.repeat(lv)+'☆'.repeat(Math.max(0,5-lv))}
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
for(let n=1;n<=10;n++){const i=new Image();i.src='img/church'+n+'.webp'}
BLD.forEach(b=>{const i=new Image();i.src='img/b_'+b.id+'.webp'});
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
  if(r<.3){ev={type:'sunday',end:now+30000};S.sunN=(S.sunN||0)+1;vib([30,40,30])}
  else if(r<.55){const b=Math.max(50,Math.round(psBase()*60+tapVal()*20));add(b);S.kvN=(S.kvN||0)+1;toast('🎸 Квартирник «ДВИЖ»! Пришли друзья: +'+fmt(b)+' дел');return}
  else if(r<.8){ev={type:'fuse',end:now+15000,need:15+Math.min(25,cnt('vol')),got:0};vib(200)}
  else{ev={type:'mic',end:now+15000,need:10,got:0};vib(100)}
  renderEvent();
}
function fixEvent(){const t=ev.type;if(t==='fuse'){S.fix++;toast('💡 Свет есть! Можно продолжать служение')}else{S.mic++;toast('🎤 Микрофон работает. Раз-раз!')}add(Math.round(psBase()*15+10));ev=null;renderEvent()}
function renderEvent(){
  const e=$('#event');tapEl.classList.toggle('broken',!!ev&&ev.type!=='sunday');
  if(!ev){e.hidden=true;$('#hint').hidden=false;return}
  $('#hint').hidden=true;e.hidden=false;const left=Math.max(0,Math.ceil((ev.end-Date.now())/1000));
  if(ev.type==='sunday'){const m=sundayMul();const ms=m%1?m.toFixed(1).replace('.',','):String(m);e.className='good';e.innerHTML='⛪ <b>Воскресное служение!</b><br>Все дела ×'+ms+' — ещё '+left+' с'}
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
function achProg(){return ACH.filter(a=>S.ach[a.id]).length+'/'+ACH.length}
function setTitle(p){$('#ptitle').textContent={shop:'🛠 Улучшения',bld:'🏛 Здания',ach:'🏆 Достижения · '+achProg(),info:'ℹ️ Об игре'}[p]}
function openP(p){panel=p;$('#panel').hidden=false;setTitle(p);renderP(true)}
$('#pclose').onclick=()=>{panel=null;$('#panel').hidden=true};
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>panel===b.dataset.p?$('#pclose').onclick():openP(b.dataset.p));
function renderP(full){
  const b=$('#pbody');
  if(panel==='shop'){
    if(full||b.children.length!==UP.length){b.innerHTML=UP.map((u,k)=>`<div class="it" id="u_${u.id}"><div class="ic">${u.ic}</div><div class="tx"><b>${u.n}</b> <span class="c"></span><br>${u.d}</div><button data-k="${k}"></button></div>`).join('');b.querySelectorAll('button').forEach(x=>x.onclick=()=>buy(UP[x.dataset.k]))}
    UP.forEach((u,k)=>{const el=$('#u_'+u.id),c=cost(u),lock=k>1&&cnt(UP[k-1].id)===0&&cnt(u.id)===0;el.classList.toggle('lock',lock);el.querySelector('.c').textContent=cnt(u.id)?'×'+cnt(u.id):'';const bt=el.querySelector('button');bt.textContent=fmt(c);bt.disabled=S.d<c||lock});
  }else if(panel==='bld'){
    if(full||b.children.length!==BLD.length){b.innerHTML=BLD.map((x,k)=>`<div class="it bld" id="b_${x.id}"><img class="bp" src="img/b_${x.id}.webp" alt=""><div class="tx"><b>${x.n}</b> <span class="stars"></span><br>${x.d}<br><span class="inc"></span></div><button data-k="${k}"></button></div>`).join('');b.querySelectorAll('button').forEach(x=>x.onclick=()=>buyB(BLD[+x.dataset.k]))}
    BLD.forEach((x,k)=>{
      const el=$('#b_'+x.id),lv=bcnt(x.id),c=bcost(x),lock=k>0&&bcnt(BLD[k-1].id)===0,max=lv>=5;
      el.classList.toggle('lock',lock);el.classList.toggle('max',max&&!lock);
      el.querySelector('.stars').textContent=stars(lv);
      el.querySelector('.inc').textContent=lv?('+'+fmt(x.ps*lv)+' дел/сек · +'+(x.pp*lv)+' прихожан'+bBonus(x,lv)):(lock?'Сначала: '+BLD[k-1].n:'Ещё не построено');
      const bt=el.querySelector('button');
      bt.textContent=max?'Макс':fmt(c);bt.disabled=max||lock||S.d<c;
    });
  }else if(panel==='ach'){
    if(full)b.innerHTML=ACH.map(a=>`<div class="it ach ${S.ach[a.id]?'ok':''}"><div class="ic">${S.ach[a.id]?'🏆':'🔒'}</div><div class="tx"><b>${a.n}</b><br>${a.d}</div></div>`).join('');
    setTitle('ach');
  }else if(panel==='info'&&full){
    b.innerHTML=`<div class="it"><div class="tx">Вы — завхоз церкви «Слово жизни» на Павла Корчагина, 2А. Нажимайте на церковь, делайте добрые дела, нанимайте волонтёров и запускайте молодёжку «4.0». Покупайте здания для богослужений и улучшайте их: от молитвенного дома до летнего лагеря. Каждое здание приносит дела, прихожан и свой бонус. Чем больше дел, тем больше людей приходит и тем больше залов открывается.<br><br>Иногда случается разное: воскресное служение усиливает дела, квартирник даёт бонус, а выбитые пробки и сломанный микрофон надо срочно чинить тапами.<br><br>Игра сохраняется сама. Пока вас нет, волонтёры трудятся (до 8 часов).<br><br>${VERSES[3]}</div></div><div class="it"><div class="tx">Всего дел: <b>${fmt(S.total)}</b><br>Нажатий: <b>${fmt(S.taps)}</b><br>Достижений: <b>${achProg()}</b></div></div><button id="reset" style="background:#7a1f1f;width:100%;margin-top:6px">Начать заново</button>`;
    $('#reset').onclick=()=>{if(confirm('Стереть прогресс и начать заново?')){localStorage.removeItem(KEY);location.reload()}};
  }
}
function buy(u){const c=cost(u);if(S.d<c)return;S.d-=c;S.u[u.id]=cnt(u.id)+1;vib(15);toast(u.ic+' '+u.n+' — куплено!');renderP();save()}
function buyB(b){
  const lv=bcnt(b.id);if(lv>=5)return;
  const c=bcost(b);if(S.d<c)return;
  const i=BLD.indexOf(b);if(i>0&&bcnt(BLD[i-1].id)===0)return;
  S.d-=c;S.b=S.b||{};S.b[b.id]=lv+1;vib(15);
  if(lv===0)toast('🏛 '+b.n+' построен!');
  else if(lv+1===5)toast('🌟 '+b.n+' достиг 5 уровня!');
  else toast('✨ '+b.n+' улучшен до '+(lv+1)+' уровня!');
  renderP();save();
}
function checkAch(){
  if(isNight())S.night=1;
  ACH.forEach(a=>{if(!S.ach[a.id]&&a.f(S)){S.ach[a.id]=1;toast('🏆 Достижение: '+a.n);if(panel==='ach')renderP(true)}});
  if(panel==='ach')setTitle('ach');
}
// offline
(function(){const dt=Math.min(8*3600,(Date.now()-(S.t||Date.now()))/1000);const g=Math.floor(psBase()*dt*offRate());if(g>0&&dt>30){add(g);S.offN=(S.offN||0)+1;setTimeout(()=>modal('С возвращением! 👋<br>Пока вас не было, волонтёры сделали<br><b>'+fmt(g)+'</b> добрых дел.'),300)}})();
// loop
let last=performance.now(),acc=0,evTimer=Date.now()+45000;
function frame(now){
  const dt=Math.min(1,(now-last)/1000);last=now;add(ps()*dt);
  if(ev&&Date.now()>ev.end){if(ev.type!=='sunday')toast(ev.type==='fuse'?'Пробки починил электрик. Доход вернулся':'Микрофон заменили запасным');ev=null;renderEvent()}
  if(!ev&&Date.now()>evTimer){startEvent();evTimer=Date.now()+evWait()}
  acc+=dt;
  $('#deeds').textContent=fmt(S.d);
  if(acc>.25){acc=0;$('#dps').textContent=fmt(ps());$('#dpt').textContent=fmt(tapVal());$('#people').textContent=fmt(people(S));renderLoc();renderChurch();if(panel==='shop'||panel==='bld')renderP();if(ev)renderEvent();checkAch()}
  requestAnimationFrame(frame);
}
renderChurch();
requestAnimationFrame(frame);
setInterval(save,5000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
window.addEventListener('pagehide',save);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
window.__game={S,startEvent,openP,get ev(){return ev}};
