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
 {n:'Чаепитие после служения',bg:'cafe',at:10000000},
 {n:'Молодёжный вечер «4.0»',bg:'cafe',at:40000000},
 {n:'Воскресная школа открыта',bg:'hall_empty',at:150000000},
 {n:'Собрание служителей',bg:'office',at:500000000},
 {n:'Конференция в церкви',bg:'hall',at:2000000000},
 {n:'Двор полон гостей',bg:'exterior',at:7000000000},
 {n:'Летний лагерь собран',bg:'exterior',at:15000000000},
 {n:'Служение под открытым небом',bg:'exterior',at:30000000000},
 {n:'Праздничное служение',bg:'sunday',at:55000000000},
 {n:'Юбилей церкви',bg:'sunday',at:90000000000},
 {n:'Город едет на служение',bg:'sunday',at:140000000000},
 {n:'Зал не вмещает всех',bg:'sunday',at:200000000000},
 {n:'Великое собрание',bg:'sunday',at:280000000000},
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
 {id:'sun',n:'Воскресенье!',d:'Дойти до полного зала',f:s=>s.total>=LOC.find(l=>l.n==='Полный зал в воскресенье').at},
 {id:'sun5',n:'Пять воскресений',d:'Провести 5 воскресных служений',f:s=>(s.sunN||0)>=5},
 {id:'sun20',n:'Служение как по расписанию',d:'Провести 20 воскресных служений',f:s=>(s.sunN||0)>=20},
 {id:'kv1',n:'Первый квартирник «ДВИЖ»',d:'Провести квартирник',f:s=>(s.kvN||0)>=1},
 {id:'kv10',n:'ДВИЖ не смолкает',d:'Провести 10 квартирников',f:s=>(s.kvN||0)>=10},
 {id:'off1',n:'С возвращением!',d:'Получить дела, пока вас не было',f:s=>(s.offN||0)>=1},
 {id:'night',n:'Ночной завхоз',d:'Играть ночью (с 22:00 до 6:00)',f:s=>!!s.night},
 {id:'q1',n:'Задание выполнено!',d:'Выполнить ежедневное задание',f:s=>(s.st&&s.st.q||0)>=1},
 {id:'q10',n:'Исполнительный завхоз',d:'Выполнить 10 ежедневных заданий',f:s=>(s.st&&s.st.q||0)>=10},
 {id:'ev1',n:'Успел на служение',d:'Поймать праздничный значок',f:s=>(s.st&&s.st.ev||0)>=1},
 {id:'ev10',n:'Ни одного праздника мимо',d:'Поймать 10 праздничных значков',f:s=>(s.st&&s.st.ev||0)>=10},
 {id:'pr1',n:'Новый приход',d:'Начать «Новый приход»',f:s=>(s.st&&s.st.pr||0)>=1},
 {id:'stor10',n:'Летописец',d:'Открыть 10 историй завхоза',f:s=>(s.loc||0)>=9},
 {id:'share',n:'Расскажи друзьям',d:'Поделиться игрой',f:s=>!!s.shared},
];
const VERSES=['«Всё у вас да будет с любовью» (1 Кор 16:14)','«Служите друг другу» (Гал 5:13)','«Делая добро, да не унываем» (Гал 6:9)','«Всё, что делаете, делайте от души» (Кол 3:23)'];
const STORIES=[
 'Первый день на посту. В кабинете завхоз нашёл ключи от всех дверей, три рулона изоленты и записку: «Стулья не трогать — они сами знают, где стоять». Пора за дело!',
 'В коридоре скрипит одна половица — ровно на ноте «ля». Бабушка из хора теперь распевается, наступая на неё каждое воскресенье. Чинить её завхоз пока не будет.',
 'Кофемашина в фойе заработала с третьей попытки и первой молитвы. Теперь у кафе очередь, а у завхоза — почётная кружка «Главный по кофе».',
 'Сто стульев, ровные ряды, линейка и нитка. Молодёжь помогала так усердно, что один ряд получился по диагонали. Решили оставить — «для динамики».',
 'Свет настроен, ковёр пропылесосен, звукорежиссёр сказал своё любимое «раз-раз». Завхоз сел в последний ряд и просто порадовался: зал готов встречать людей.',
 'В воскресенье пришло столько людей, что стулья закончились. Дети сидели на ступеньках сцены, а завхоз впервые за год стоял и улыбался, а не чинил что-нибудь.',
 'После служения на кухне закончились чашки, потом сахар, потом печенье. Бабушки из хора достали из сумок запасы, которые носили «на всякий случай» с прошлой осени.',
 'Молодёжь попросила «немного света». Завхоз выдал гирлянду, прожектор и дым-машину. Теперь «немного света» видно с соседней улицы, а вечер запомнили надолго.',
 'Дети нарисовали Ноев ковчег прямо на двери кладовки. Завхоз хотел расстроиться, но жираф получился слишком добрым. Теперь эта дверь — главная достопримечательность.',
 'На собрании служителей час обсуждали, кто отвечает за ключи от кладовки. Единогласно решили — завхоз. Как, впрочем, и последние десять лет.',
 'Гости конференции приехали из трёх городов. За ночь завхоз нашёл 200 стульев, 3 удлинителя и одного потерявшегося гостя — тот искал зал в соседнем подъезде.',
 'Во дворе стало тесно, и завхоз расчертил парковку мелом. Дети тут же превратили разметку в классики, а взрослые парковались очень аккуратно, чтобы не испортить игру.',
 'Палатки, котелки, гитара и сорок пар резиновых сапог. Завхоз научил молодёжь ставить палатку за пять минут, а молодёжь его — петь у костра на два голоса.',
 'Служение под открытым небом: ветер унёс листок с объявлениями, но прихожане поймали его всем двором. Звукорежиссёр сказал, что лучше акустики, чем небо, не бывает.',
 'К празднику хор выучил новую песню, кухня испекла пять пирогов, а завхоз повесил шарики. Один улетел под самый потолок и висит там до сих пор — как символ радости.',
 'На юбилее показывали старые фото: вот первые стулья, вот первая изолента. Все смеялись и плакали одновременно. Завхоз тихо посчитал: стульев стало в тридцать раз больше.',
 'Водитель автобуса спросил: «Это та церковь, где всех встречают с чаем?» Завхоз кивнул и поставил ещё один чайник. О церкви рассказывают уже по всему городу.',
 'Люди стояли в фойе, в коридоре и даже в кабинете завхоза. Он не возражал — только попросил не садиться на ящик с изолентой. Пора думать о новом зале!',
 'Тысячи людей поют вместе, и даже скрипучая половица звучит в тон. Завхоз смотрит на зал и понимает: каждое маленькое доброе дело было не зря. Слава Богу!',
];
const HOLI=[['⛪','Воскресное служение'],['🕊','Пасха'],['⭐','Рождество'],['🔥','Молодёжный вечер'],['🌿','Троица'],['🎶','Вечер хвалы'],['💧','Крещение'],['🍎','Праздник урожая']];
const URL0='https://prohorpolovnikov413-ui.github.io/savhos/';
const KEY='zavhoz_sz_v1';
let S={d:0,total:0,taps:0,u:{},ach:{},fix:0,mic:0,t:Date.now(),loc:0};
let fresh=true;
try{const o=JSON.parse(localStorage.getItem(KEY));if(o){Object.assign(S,o);fresh=false}}catch(e){}
if(!S.u)S.u={};if(!S.ach)S.ach={};if(!S.b)S.b={};
// v6 migration
if(S.run==null)S.run=S.total;
if(!S.st)S.st={play:0,best:0,ev:0,q:0,pr:0};
if(!S.set)S.set={snd:1,mus:1,vib:1};
if(S.bl==null)S.bl=0;
if(S.intro==null)S.intro=fresh||!S.total?0:1;
let ev=null; // {type,end,need,got}
let boost=null; // {n,ic,end}
const cnt=id=>S.u[id]||0;
const bcnt=(id,s)=>{s=s||S;return ((s.b)||{})[id]||0};
const bldOwned=s=>BLD.filter(b=>bcnt(b.id,s)>=1).length;
const cost=u=>Math.ceil(u.c*Math.pow(1.15,cnt(u.id)));
const bcost=(b,s)=>Math.ceil(b.c*Math.pow(3,bcnt(b.id,s)));
const blessMul=()=>1+.1*(S.bl||0);
const tapBld=()=>BLD.reduce((a,b)=>a+(b.tap||0)*bcnt(b.id),0);
const tapVal=()=>(1+UP.reduce((a,u)=>a+(u.tap||0)*cnt(u.id),0)+tapBld())*mult()*blessMul();
const psBuildings=()=>BLD.reduce((a,b)=>a+(b.ps||0)*bcnt(b.id),0);
const bldMul=()=>1+(BLD.find(b=>b.mul)?(BLD.find(b=>b.mul).mul)*bcnt('camp'):0);
const psBase=()=>(UP.reduce((a,u)=>a+(u.ps||0)*cnt(u.id),0)+psBuildings())*bldMul()*blessMul();
const sundayMul=()=>2+((BLD.find(b=>b.sun)||{}).sun||0)*bcnt('hall');
const boostOn=()=>!!boost&&boost.end>Date.now();
const mult=()=>(ev&&ev.type==='sunday'?sundayMul():1)*(boostOn()?7:1);
const offRate=()=>.5+((BLD.find(b=>b.off)||{}).off||0)*bcnt('conf');
const evWait=()=>(40000+Math.random()*50000)*(1-((BLD.find(b=>b.ev)||{}).ev||0)*bcnt('youthc'));
const badgeWait=()=>(120000+Math.random()*120000)*(1-((BLD.find(b=>b.ev)||{}).ev||0)*bcnt('youthc')*.5);
const ps=()=>(ev&&(ev.type==='fuse'||ev.type==='mic'))?0:psBase()*mult();
// prestige
const PR_RUN=2e9;
const blessTotal=()=>Math.floor(Math.sqrt(S.total/1e8));
const blessGain=()=>Math.max(0,blessTotal()-(S.bl||0));
const canPrestige=()=>S.run>=PR_RUN&&blessGain()>=1;
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
const tapEl=$('#tap');
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
    vib([30,40,30]);snd('chime');
  }
  shownChurch=st;
}
for(let n=1;n<=10;n++){const i=new Image();i.src='img/church'+n+'.webp'}
BLD.forEach(b=>{const i=new Image();i.src='img/b_'+b.id+'.webp'});
const fmt=n=>{n=Math.floor(n);if(n<1e4)return n.toLocaleString('ru-RU');const z=[[1e12,' трлн'],[1e9,' млрд'],[1e6,' млн'],[1e3,' тыс']];for(const[v,s]of z)if(n>=v)return(n/v).toFixed(n/v<100?1:0).replace('.',',')+s;};
const fmtT=sec=>{sec=Math.floor(sec);const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return h?h+' ч '+m+' мин':m?m+' мин':sec+' с'};
function nice(n){if(n<100)return Math.ceil(n);const p=Math.pow(10,Math.floor(Math.log10(n))-1);return Math.ceil(n/p)*p}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),2600)}
// modal with queue
const mq=[];let mOpen=false;
function modal(html,btns){mq.push({html,btns});if(!mOpen)nextModal()}
function nextModal(){
  const m=mq.shift();if(!m){mOpen=false;$('#modal').hidden=true;return}
  mOpen=true;$('#mtext').innerHTML=m.html;
  const bx=$('#mbtns');bx.innerHTML='';
  (m.btns||[{t:'Слава Богу! 🙏'}]).forEach(b=>{const e=document.createElement('button');e.textContent=b.t;if(b.cls)e.className=b.cls;if(b.dis)e.disabled=true;e.onclick=()=>{snd('click');if(b.f&&b.f()===false)return;nextModal()};bx.appendChild(e)});
  $('#modal').hidden=false;
}
// ---------- audio ----------
let AC=null,master=null,musGain=null,musT=null,musStep=0;
function ac(){
  if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();master=AC.createGain();master.gain.value=.9;master.connect(AC.destination);musGain=AC.createGain();musGain.gain.value=.05;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;musGain.connect(lp);lp.connect(master)}
  if(AC.state==='suspended')AC.resume();
  return AC;
}
function tone(f,t0,dur,vol,type,dest){const a=AC,o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+Math.min(.02,dur/4));g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(dest||master);o.start(t0);o.stop(t0+dur+.05)}
function snd(k){
  if(!S.set.snd||!AC||AC.state!=='running')return;
  const t=AC.currentTime;
  if(k==='tap')tone(620+Math.random()*120,t,.09,.12,'triangle');
  else if(k==='buy'){tone(523,t,.12,.12,'triangle');tone(784,t+.07,.18,.12,'triangle')}
  else if(k==='click')tone(440,t,.06,.08,'sine');
  else if(k==='chime'){[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.09,.5,.1,'sine'))}
  else if(k==='bad'){tone(180,t,.25,.15,'square')}
}
const CH=[[261.6,329.6,392],[196,246.9,293.7],[220,261.6,329.6],[174.6,220,261.6]]; // C G Am F
function musTick(){
  if(!S.set.mus||!AC||AC.state!=='running'||document.hidden)return;
  const t=AC.currentTime+.05,c=CH[musStep%4];
  c.forEach(f=>{tone(f,t,3.6,.5,'sine',musGain);tone(f/2,t,3.6,.25,'triangle',musGain)});
  [0,1,2,1].forEach((k,i)=>{if(Math.random()<.7)tone(c[k]*2,t+i*.9,.9,.18,'sine',musGain)});
  musStep++;
}
function musicSync(){clearInterval(musT);musT=null;if(S.set.mus&&AC){musTick();musT=setInterval(musTick,3600)}}
document.addEventListener('pointerdown',()=>{const first=!AC;ac();if(first)setTimeout(musicSync,50)},true);
function vib(ms){if(!S.set.vib)return;try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}
function save(){S.t=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function add(n,noQ){S.d+=n;S.total+=n;S.run+=n;if(!noQ)qProg('earn',n)}
// ---------- tap ----------
function onTap(x,y){
  if(ev&&(ev.type==='fuse'||ev.type==='mic')){ev.got++;float(x,y,ev.type==='fuse'?'⚡':'🎤');vib(8);snd('click');if(ev.got>=ev.need)fixEvent();renderEvent();return}
  const v=tapVal();add(v);S.taps++;qProg('tap',1);float(x,y,'+'+fmt(v));vib(10);snd('tap');
  tapEl.classList.add('hit');setTimeout(()=>tapEl.classList.remove('hit'),80);
}
tapEl.addEventListener('pointerdown',e=>{e.preventDefault();onTap(e.clientX,e.clientY)});
document.addEventListener('dblclick',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault());
function float(x,y,t){const f=document.createElement('div');f.className='fl';f.textContent=t;f.style.left=(x-20+Math.random()*30)+'px';f.style.top=(y-30)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),900)}
// ---------- random events ----------
function startEvent(){
  if(ev||S.total<100)return;
  const r=Math.random(),now=Date.now();
  if(r<.3){ev={type:'sunday',end:now+30000};S.sunN=(S.sunN||0)+1;vib([30,40,30]);snd('chime')}
  else if(r<.55){const b=Math.max(50,Math.round(psBase()*60+tapVal()*20));add(b);S.kvN=(S.kvN||0)+1;toast('🎸 Квартирник «ДВИЖ»! Пришли друзья: +'+fmt(b)+' дел');snd('chime');return}
  else if(r<.8){ev={type:'fuse',end:now+15000,need:15+Math.min(25,cnt('vol')),got:0};vib(200);snd('bad')}
  else{ev={type:'mic',end:now+15000,need:10,got:0};vib(100);snd('bad')}
  renderEvent();
}
function fixEvent(){const t=ev.type;if(t==='fuse'){S.fix++;toast('💡 Свет есть! Можно продолжать служение')}else{S.mic++;toast('🎤 Микрофон работает. Раз-раз!')}qProg('fix',1);snd('chime');add(Math.round(psBase()*15+10));ev=null;renderEvent()}
function renderEvent(){
  const e=$('#event');tapEl.classList.toggle('broken',!!ev&&ev.type!=='sunday');
  if(!ev){e.hidden=true;$('#hint').hidden=false;return}
  $('#hint').hidden=true;e.hidden=false;const left=Math.max(0,Math.ceil((ev.end-Date.now())/1000));
  if(ev.type==='sunday'){const m=sundayMul();const ms=m%1?m.toFixed(1).replace('.',','):String(m);e.className='good';e.innerHTML='⛪ <b>Воскресное служение!</b><br>Все дела ×'+ms+' — ещё '+left+' с'}
  else if(ev.type==='fuse'){e.className='';e.innerHTML='⚡ <b>Выбило пробки!</b> Доход на паузе.<br>Быстро жми на церковь: '+ev.got+'/'+ev.need+' — '+left+' с<img src="img/panel.webp" alt="">'}
  else{e.className='';e.innerHTML='🎤 <b>Сломался микрофон!</b> Звукорежиссёр в панике.<br>Жми, чтобы починить: '+ev.got+'/'+ev.need+' — '+left+' с'}
}
// ---------- holiday badge (×7) ----------
let badge=null,badgeAt=Date.now()+90000;
function spawnBadge(){
  if(badge||S.total<100)return;
  const h=HOLI[Math.floor(Math.random()*HOLI.length)];
  const el=document.createElement('button');el.id='badge';el.innerHTML='<span>'+h[0]+'</span><b>'+h[1]+'</b><small>Жми! ×7</small>';
  const W=innerWidth,H=innerHeight;
  el.style.left=Math.round(10+Math.random()*Math.max(10,W-190))+'px';
  el.style.top=Math.round(Math.max(190,H*.28)+Math.random()*Math.max(10,H*.3))+'px';
  el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();catchBadge(h)});
  document.body.appendChild(el);badge={el,end:Date.now()+10000};vib(20);
}
function catchBadge(h){
  if(!badge)return;badge.el.remove();badge=null;
  boost={ic:h[0],n:h[1],end:Date.now()+30000};S.st.ev++;qProg('ev',1);
  toast(h[0]+' '+h[1]+'! Все дела ×7 на 30 секунд');vib([30,30,60]);snd('chime');
}
function renderBoost(){
  const b=$('#boost');
  if(boostOn()){b.hidden=false;const l=Math.ceil((boost.end-Date.now())/1000);b.innerHTML=boost.ic+' <b>'+boost.n+'</b>: все дела ×7 — '+l+' с<i style="width:'+(l/30*100)+'%"></i>'}
  else{b.hidden=true;boost=null}
}
// ---------- daily quests ----------
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
function incomeEst(){return psBase()+tapVal()/mult()*2}
function genQuests(){
  const inc=incomeEst(),pool=[];
  pool.push({k:'tap',g:[300,500,800][Math.floor(Math.random()*3)]});
  pool.push({k:'up',g:[2,3,5][Math.floor(Math.random()*3)]});
  pool.push({k:'earn',g:nice(Math.max(500,inc*900))});
  if(S.total>=1500)pool.push({k:'bld',g:1});
  if(S.total>=100){pool.push({k:'ev',g:1});pool.push({k:'fix',g:1})}
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const list=pool.slice(0,3).map(q=>({k:q.k,g:q.g,p:0,c:0,r:nice(Math.max(150,inc*300))}));
  S.q={day:dayKey(),list};
}
function qText(q){return {tap:'Нажать на церковь '+fmt(q.g)+' раз',up:'Купить улучшений: '+q.g,earn:'Сделать '+fmt(q.g)+' добрых дел',bld:'Построить или улучшить здание',ev:'Поймать праздничный значок на экране',fix:'Починить пробки или микрофон'}[q.k]}
function qIcon(k){return {tap:'👆',up:'🛠',earn:'✨',bld:'🏛',ev:'🕊',fix:'🔧'}[k]}
function qCheckDay(){if(!S.q||S.q.day!==dayKey())genQuests()}
function qProg(k,n){if(!S.q)return;S.q.list.forEach(q=>{if(q.k===k&&q.p<q.g){q.p=Math.min(q.g,q.p+n);if(q.p>=q.g){toast('📅 Задание выполнено! Заберите награду');snd('chime')}}})}
function qClaim(i){const q=S.q.list[i];if(!q||q.c||q.p<q.g)return;q.c=1;add(q.r,true);S.st.q++;toast('🎁 Награда: +'+fmt(q.r)+' добрых дел');vib([20,30,20]);snd('buy');renderP(true);save()}
const qReady=()=>!!S.q&&S.q.list.some(q=>q.p>=q.g&&!q.c);
// ---------- location & stories ----------
function curLoc(){let i=0;LOC.forEach((l,k)=>{if(S.total>=l.at)i=k});return i}
function storyHtml(i,isNew){return (isNew?'🎉 Новая цель достигнута!<br>':'')+'<b>'+LOC[i].n+'</b><div class="story">'+STORIES[i]+'</div><i>'+VERSES[i%VERSES.length]+'</i>'}
function showStory(i,isNew){modal(storyHtml(i,isNew),i===LOC.length-1&&isNew?[{t:'📤 Поделиться',f:()=>{share();return true}},{t:'Слава Богу! 🙏'}]:null)}
let shownLoc=-1;
function renderLoc(){
  const i=curLoc();
  if(i!==shownLoc){$('#bg').style.backgroundImage='url(img/'+LOC[i].bg+'.webp)';if(shownLoc>=0&&i>S.loc){showStory(i,true);vib([40,60,40]);snd('chime')}shownLoc=i;S.loc=Math.max(S.loc,i)}
  $('#locName').textContent='📍 '+LOC[i].n;
  const nx=LOC[i+1];
  if(nx){const p=(S.total-LOC[i].at)/(nx.at-LOC[i].at);$('#locBar i').style.width=Math.min(100,p*100)+'%';$('#locNext').textContent='Дальше: '+nx.n+' — '+fmt(nx.at)}
  else{$('#locBar i').style.width='100%';$('#locNext').textContent='Вы дошли до великого собрания! Слава Богу 🙏'}
}
// ---------- share ----------
async function share(){
  const text='Я сделал '+fmt(S.total)+' добрых дел в игре «Завхоз Слова жизни»! Попробуй и ты:';
  S.shared=1;save();
  try{if(navigator.share){await navigator.share({title:'Завхоз Слова жизни',text,url:URL0});return}}catch(e){if(e&&e.name==='AbortError')return}
  const full=text+' '+URL0;
  try{await navigator.clipboard.writeText(full);toast('📋 Ссылка скопирована — отправьте друзьям!');return}catch(e){}
  try{const ta=document.createElement('textarea');ta.value=full;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('📋 Ссылка скопирована — отправьте друзьям!')}catch(e){toast(full)}
}
// ---------- prestige ----------
function askPrestige(){
  if(!canPrestige())return;
  const g=blessGain();
  modal('🙏 <b>Новый приход</b><br><br>Добрые дела, улучшения и здания обнулятся.<br>Вы получите <b>'+g+'</b> '+blessWord(g)+': доход станет <b>×'+(1+.1*(S.bl+g)).toFixed(1).replace('.',',')+'</b> навсегда.<br><br>Достижения, истории и путь в жёлтой полосе сохранятся.',
   [{t:'Начать новый приход',cls:'warn',f:doPrestige},{t:'Отмена',cls:'ghost'}]);
}
function blessWord(n){const a=n%10,b=n%100;return a===1&&b!==11?'благословение':a>=2&&a<=4&&(b<10||b>=20)?'благословения':'благословений'}
function doPrestige(){
  const g=blessGain();if(g<1)return;
  S.bl+=g;S.d=0;S.run=0;S.u={};S.b={};ev=null;S.st.pr++;
  renderEvent();save();renderP(true);
  toast('🙏 Новый приход! Благословений: '+S.bl+' (×'+blessMul().toFixed(1).replace('.',',')+' к доходу)');vib([40,60,40]);snd('chime');
}
// ---------- panels ----------
let panel=null;
function achProg(){return ACH.filter(a=>S.ach[a.id]).length+'/'+ACH.length}
function setTitle(p){$('#ptitle').textContent={shop:'🛠 Улучшения',bld:'🏛 Здания',quest:'📅 Задания на сегодня',ach:'🏆 Достижения · '+achProg(),info:'ℹ️ Об игре'}[p]}
function openP(p){panel=p;$('#panel').hidden=false;setTitle(p);renderP(true);document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===p))}
$('#pclose').onclick=()=>{panel=null;$('#panel').hidden=true;document.querySelectorAll('#tabs button').forEach(b=>b.classList.remove('on'))};
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{snd('click');panel===b.dataset.p?$('#pclose').onclick():openP(b.dataset.p)});
function untilMidnight(){const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);return (m-n)/1000}
function statsHtml(){
  return `Время в игре: <b>${fmtT(S.st.play)}</b><br>Всего нажатий: <b>${fmt(S.taps)}</b><br>Лучший доход: <b>${fmt(S.st.best)}</b> дел/сек<br>Добрых дел за всё время: <b>${fmt(S.total)}</b><br>В этом приходе: <b>${fmt(S.run)}</b><br>Новых приходов: <b>${S.st.pr}</b> · благословений: <b>${S.bl}</b><br>Поймано праздников: <b>${S.st.ev}</b><br>Выполнено заданий: <b>${S.st.q}</b><br>Достижений: <b>${achProg()}</b>`;
}
function prestHtml(){
  const g=blessGain();
  let t='Начните заново с постоянным бонусом: каждое благословение даёт <b>+10%</b> ко всем делам.<br>Сейчас: <b>'+S.bl+'</b> '+blessWord(S.bl)+' (×'+blessMul().toFixed(1).replace('.',',')+').';
  if(canPrestige())t+='<br>Можно получить: <b>+'+g+'</b>';
  else if(S.run<PR_RUN)t+='<br>Откроется после <b>'+fmt(PR_RUN)+'</b> дел в текущем приходе (сейчас '+fmt(S.run)+').';
  else t+='<br>Сделайте ещё больше дел, чтобы получить новое благословение.';
  return t;
}
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
      el.querySelector('.inc').textContent=lv?('+'+fmt(x.ps*lv*blessMul())+' дел/сек · +'+(x.pp*lv)+' прихожан'+bBonus(x,lv)):(lock?'Сначала: '+BLD[k-1].n:'Ещё не построено');
      const bt=el.querySelector('button');
      bt.textContent=max?'Макс':fmt(c);bt.disabled=max||lock||S.d<c;
    });
  }else if(panel==='quest'){
    if(full){
      const done=S.q.list.filter(q=>q.c).length;
      b.innerHTML='<p class="apro">Выполнено сегодня: '+done+'/3 · новые через <span id="qtime"></span></p>'+S.q.list.map((q,i)=>`<div class="it quest ${q.c?'ok':''}"><div class="ic">${qIcon(q.k)}</div><div class="tx"><b>${qText(q)}</b><br>Награда: +${fmt(q.r)} дел<div class="qbar"><i style="width:${Math.min(100,q.p/q.g*100)}%"></i></div><span class="qp">${fmt(q.p)} / ${fmt(q.g)}</span></div><button data-i="${i}" ${q.c||q.p<q.g?'disabled':''}>${q.c?'✓ Готово':'Забрать'}</button></div>`).join('');
      b.querySelectorAll('button').forEach(x=>x.onclick=()=>qClaim(+x.dataset.i));
      renderP.qsig=qSig();
    }else if(renderP.qsig!==qSig())return renderP(true);
    const t=$('#qtime');if(t)t.textContent=fmtT(untilMidnight());
  }else if(panel==='ach'){
    if(full)b.innerHTML=ACH.map(a=>`<div class="it ach ${S.ach[a.id]?'ok':''}"><div class="ic">${S.ach[a.id]?'🏆':'🔒'}</div><div class="tx"><b>${a.n}</b><br>${a.d}</div></div>`).join('');
    setTitle('ach');
  }else if(panel==='info'){
    if(full){
      const tg=(k,n)=>`<button class="tg ${S.set[k]?'on':''}" data-k="${k}">${n}: ${S.set[k]?'вкл':'выкл'}</button>`;
      b.innerHTML=`<button id="shareBtn" class="big">📤 Поделиться игрой</button>
<div class="it col"><div class="tx"><b>🙏 Новый приход</b><br><span id="prest">${prestHtml()}</span></div><button id="prBtn" class="warn">Начать новый приход</button></div>
<div class="it col"><div class="tx"><b>⚙️ Настройки</b></div><div class="tgs">${tg('snd','🔊 Звук')}${tg('mus','🎵 Музыка')}${tg('vib','📳 Вибрация')}</div></div>
<div class="it"><div class="tx"><b>📊 Статистика</b><br><span id="statsBox">${statsHtml()}</span></div></div>
<div class="it col"><div class="tx"><b>📖 Истории завхоза</b> · ${Math.min(S.loc+1,LOC.length)}/${LOC.length}</div><div class="stl">${LOC.map((l,i)=>i<=S.loc?`<button class="st" data-i="${i}">${i+1}. ${l.n}</button>`:`<button class="st" disabled>${i+1}. 🔒 ???</button>`).join('')}</div></div>
<div class="it"><div class="tx">Вы — завхоз церкви «Слово жизни» на Павла Корчагина, 2А. Нажимайте на церковь, делайте добрые дела, нанимайте волонтёров и запускайте молодёжку «4.0». Покупайте здания для богослужений и улучшайте их: от молитвенного дома до летнего лагеря.<br><br>Каждый день — 3 новых задания с наградой. Ловите праздничные значки на экране: они дают ×7 ко всем делам на 30 секунд. После ${fmt(PR_RUN)} дел можно начать «Новый приход» и получить благословения навсегда.<br><br>Игра сохраняется сама. Пока вас нет, волонтёры трудятся (до 8 часов).<br><br>${VERSES[3]}</div></div>
<button id="reset" style="background:#7a1f1f;width:100%;margin-top:6px">Стереть всё и начать с нуля</button>`;
      $('#shareBtn').onclick=share;
      $('#prBtn').onclick=askPrestige;
      b.querySelectorAll('.tg').forEach(x=>x.onclick=()=>{const k=x.dataset.k;S.set[k]=S.set[k]?0:1;if(k==='mus')musicSync();if(k==='vib'&&S.set.vib)vib(30);save();renderP(true)});
      b.querySelectorAll('.st[data-i]').forEach(x=>x.onclick=()=>showStory(+x.dataset.i,false));
      $('#reset').onclick=()=>{if(confirm('Стереть весь прогресс, благословения и достижения?')){localStorage.removeItem(KEY);location.reload()}};
    }
    const sb=$('#statsBox');if(sb)sb.innerHTML=statsHtml();
    const pr=$('#prest');if(pr)pr.innerHTML=prestHtml();
    const pb=$('#prBtn');if(pb)pb.disabled=!canPrestige();
  }
}
function qSig(){return S.q.day+S.q.list.map(q=>q.p+'/'+q.c).join(',')}
function buy(u){const c=cost(u);if(S.d<c)return;S.d-=c;S.u[u.id]=cnt(u.id)+1;vib(15);snd('buy');qProg('up',1);toast(u.ic+' '+u.n+' — куплено!');renderP();save()}
function buyB(b){
  const lv=bcnt(b.id);if(lv>=5)return;
  const c=bcost(b);if(S.d<c)return;
  const i=BLD.indexOf(b);if(i>0&&bcnt(BLD[i-1].id)===0)return;
  S.d-=c;S.b=S.b||{};S.b[b.id]=lv+1;vib(15);snd('buy');qProg('bld',1);
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
// ---------- offline («Пока вас не было») ----------
const DBL_CD=4*3600*1000;
function offlineModal(g){
  const canD=Date.now()-(S.dblT||0)>=DBL_CD;
  const wait=Math.ceil((DBL_CD-(Date.now()-(S.dblT||0)))/60000);
  modal('👋 <b>Пока вас не было</b><br>волонтёры сделали<br><span class="big-n">'+fmt(g)+'</span><br>добрых дел.'+(canD?'':'<br><small>Удвоить можно раз в 4 часа (через '+(wait>=60?Math.floor(wait/60)+' ч '+(wait%60)+' мин':wait+' мин')+').</small>'),
   [{t:'✨ Удвоить ×2',dis:!canD,f:()=>{S.dblT=Date.now();claimOff(g*2)}},{t:'Забрать',cls:'ghost',f:()=>claimOff(g)}]);
}
function claimOff(n){add(n,true);S.offPend=0;S.offN=(S.offN||0)+1;toast('+'+fmt(n)+' добрых дел');snd('buy');save()}
(function(){
  const dt=Math.min(8*3600,(Date.now()-(S.t||Date.now()))/1000);
  let g=Math.floor(psBase()*dt*offRate());if(dt<=30)g=0;
  g+=S.offPend||0;
  if(g>0){S.offPend=g;setTimeout(()=>offlineModal(g),300)}
})();
// ---------- loop ----------
qCheckDay();
let last=performance.now(),acc=0,evTimer=Date.now()+45000;
function frame(now){
  const dt=Math.min(1,(now-last)/1000);last=now;add(ps()*dt);
  if(!document.hidden)S.st.play+=dt;
  if(ev&&Date.now()>ev.end){if(ev.type!=='sunday')toast(ev.type==='fuse'?'Пробки починил электрик. Доход вернулся':'Микрофон заменили запасным');ev=null;renderEvent()}
  if(!ev&&Date.now()>evTimer){startEvent();evTimer=Date.now()+evWait()}
  if(badge&&Date.now()>badge.end){badge.el.classList.add('gone');const e=badge.el;setTimeout(()=>e.remove(),400);badge=null}
  if(!badge&&!mOpen&&Date.now()>badgeAt){spawnBadge();badgeAt=Date.now()+badgeWait()}
  acc+=dt;
  $('#deeds').textContent=fmt(S.d);
  if(acc>.25){acc=0;const p=ps();if(p>S.st.best)S.st.best=p;
    $('#dps').textContent=fmt(p);$('#dpt').textContent=fmt(tapVal());$('#people').textContent=fmt(people(S));
    const bl=$('#blessS');bl.hidden=!S.bl;$('#bless').textContent=S.bl;
    qCheckDay();$('#qdot').hidden=!qReady();
    renderLoc();renderChurch();renderBoost();if(panel)renderP();if(ev)renderEvent();checkAch()}
  requestAnimationFrame(frame);
}
if(!S.intro){S.intro=1;setTimeout(()=>showStory(0,false),400)}
renderChurch();
requestAnimationFrame(frame);
setInterval(save,5000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();if(AC)AC.suspend()}else if(AC&&(S.set.mus||S.set.snd))AC.resume()});
window.addEventListener('pagehide',save);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
window.__game={S,startEvent,openP,spawnBadge,offlineModal,showStory,askPrestige,get ev(){return ev},get badge(){return badge}};
