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
 {id:'mg1',n:'Чистота — залог служения',d:'Провести уборку в зале',f:s=>!!(s.mg&&s.mg.n&&s.mg.n.clean)},
 {id:'mg2',n:'Микрофон на месте',d:'Найти микрофон до проповеди',f:s=>!!(s.mg&&s.mg.n&&s.mg.n.mic)},
 {id:'mg3',n:'Доброе сердце',d:'Помочь бабушке в церкви',f:s=>!!(s.mg&&s.mg.n&&s.mg.n.granny)},
 {id:'mgAll',n:'Завхоз на все руки',d:'Сыграть во все три мини-игры',f:s=>!!(s.mg&&s.mg.n&&s.mg.n.clean&&s.mg.n.mic&&s.mg.n.granny)},
 {id:'mgPerf',n:'Идеальный порядок',d:'Идеально пройти любую мини-игру',f:s=>!!(s.mg&&s.mg.perf)},
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
const URL0='https://prohorpolovnikov413-ui.github.io/tap-church/';
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
if(!S.mg)S.mg={cd:{},n:{},best:{}};
if(!S.mg.cd)S.mg.cd={};if(!S.mg.n)S.mg.n={};if(!S.mg.best)S.mg.best={};
if(!S.mg.diff)S.mg.diff={};if(!S.mg.bestScore)S.mg.bestScore={};
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
// ---------- mini-games ----------
const MG_CD=3*3600*1000;
const MGAMES=[
 {id:'clean',ic:'🧹',n:'Уборка в церкви',d:'Три уровня за заход: стирайте пятна и пыль, не трогайте цветы и знак «мокрый пол». За стойкие пятна нужно несколько движений, а грязь появляется снова.'},
 {id:'mic',ic:'🎤',n:'Найди микрофон',d:'На сцене спрятаны микрофон, батарейка, кабель и стойка. Открывайте вещи, заглядывайте под них и не перепутайте с бутафорией. На третьем уровне сцена темнеет.'},
 {id:'granny',ic:'👵',n:'Помоги бабушке',d:'Проводите бабушку между рядами: препятствия двигаются, вещи нужно собирать по порядку, жизней три. На третьем уровне — узкий проход и ступени.'},
];
const MIC_HIDE=[{id:'mic',ic:'🎤',n:'Микрофон'},{id:'batt',ic:'🔋',n:'Батарейка'},{id:'cable',ic:'🔌',n:'Кабель'},{id:'stand',ic:'🎚️',n:'Стойка'}];
const MIC_OBJS=[
 {ic:'🧥',n:'Пальто'},{ic:'📦',n:'Коробка'},{ic:'🎸',n:'Гитара'},{ic:'📖',n:'Сборник'},
 {ic:'🎧',n:'Наушники'},{ic:'🌿',n:'Цветок'},{ic:'🎒',n:'Рюкзак'},{ic:'🕯️',n:'Свеча'},
 {ic:'🪑',n:'Стул'},{ic:'☕',n:'Кружка'},{ic:'🧣',n:'Шарф'},{ic:'☂️',n:'Зонт'},
 {ic:'👟',n:'Туфли'},{ic:'🧢',n:'Кепка'},{ic:'📝',n:'Блокнот'},{ic:'🔑',n:'Ключи'},
 {ic:'🥁',n:'Барабан'},{ic:'📗',n:'Библия'},{ic:'🧴',n:'Антисептик'},{ic:'🧸',n:'Игрушка'},
 {ic:'📷',n:'Фотоаппарат'},{ic:'🧳',n:'Сумка'},{ic:'📁',n:'Папка'},{ic:'🧹',n:'Швабра'},
 {ic:'🍼',n:'Бутылка'},{ic:'👓',n:'Очки'},{ic:'📿',n:'Чётки'},{ic:'📯',n:'Горн'},
 {ic:'🧻',n:'Салфетки'},{ic:'🔌',n:'Удлинитель'}
];
const MIC_DECOY=[{ic:'🎙️',n:'Бутафория'},{ic:'🎤',n:'Сломанный микрофон'},{ic:'🔋',n:'Севшая батарейка'}];
let mini=null;
const mgLeft=id=>Math.max(0,(S.mg.cd[id]||0)+MG_CD-Date.now());
const mgReady=id=>mgLeft(id)<=0;
const mgAnyReady=()=>MGAMES.some(g=>mgReady(g.id));
const mgPlayed=()=>MGAMES.reduce((a,g)=>a+(S.mg.n[g.id]||0),0);
const mgDiff=id=>Math.max(1,Math.min(5,S.mg.diff[id]||1));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function mgMaxSec(id){return Math.round(Math.min(480,300*(1+0.18*(mgDiff(id)-1))*1.15))}
function waveTime(id,wave,d){
  const b={clean:[40,36,32],mic:[44,38,34],granny:[42,38,36]}[id][wave-1];
  return Math.max(22,b-(d-1)*2);
}
function startMini(id){
  const g=MGAMES.find(x=>x.id===id);if(!g||!mgReady(id)||mini)return;
  if(panel){$('#pclose').onclick()}
  const d=mgDiff(id);
  mini={id,g,phase:'intro',score:0,wave:1,wavesDone:0,diff:d,combo:0,maxCombo:0,hp:3,penalties:0,got:0,need:0};
  $('#mtitle').textContent=g.ic+' '+g.n;
  $('#mtimer').textContent='';
  $('#mhint').textContent='';
  $('#mstatus').textContent='';
  $('#mhud').hidden=true;
  const cap=fmt(nice(Math.max(80,incomeEst()*mgMaxSec(id))));
  const how={
    clean:'Три уровня подряд. Нажимайте и проводите пальцем по пятнам: стойкие нужно потереть несколько раз, а грязь появляется снова. Не трогайте цветы и знак «мокрый пол» — за это штраф. Быстрая уборка даёт комбо.',
    mic:'На каждом уровне найдите полный набор: микрофон, батарейку, кабель и стойку. Заглядывайте под вещи. Бутафория отнимает время. На третьем уровне сцена почти тёмная — светите фонариком.',
    granny:'Бабушка идёт не спеша, а люди, дети и ведро двигаются сами. Собирайте вещи по порядку: очки, затем сумку, затем сборник. Три сердца. На третьем уровне — узкий проход и ступени.'
  }[id];
  $('#mstage').innerHTML=`<div class="mg-intro"><div class="ic">${g.ic}</div><b>${g.n}</b><p>${how}</p><p>3 уровня · сложность ${d} · награда до ${cap} дел</p><button class="mg-go" type="button">Начать</button></div>`;
  $('#mstage').querySelector('.mg-go').onclick=()=>{snd('click');runMini(id)};
  $('#mini').hidden=false;
  snd('click');
}
function runMini(id){
  if(!mini||(mini.phase!=='intro'&&mini.phase!=='wave'))return;
  mini.phase='play';
  mini.end=Date.now()+waveTime(id,mini.wave,mini.diff)*1000;
  $('#mtimer').textContent=waveTime(id,mini.wave,mini.diff)+' с';
  if(id==='clean')setupClean();
  else if(id==='mic')setupMic();
  else setupGranny();
  renderHud();
}
function renderHud(){
  if(!mini||mini.phase==='intro'||mini.phase==='res'){$('#mhud').hidden=true;return}
  $('#mhud').hidden=false;
  const p=['<span>Ур. '+mini.wave+'/3</span>','<span>Сложн. '+mini.diff+'</span>'];
  p.push('<span class="hearts">'+'❤'.repeat(mini.hp)+'♡'.repeat(Math.max(0,3-mini.hp))+'</span>');
  if(mini.combo>1)p.push('<span class="combo">комбо ×'+mini.combo+'</span>');
  p.push('<span>'+fmt(mini.score)+' оч.</span>');
  $('#mhud').innerHTML=p.join('');
}
function addScore(n,x,y){
  mini.score+=n;
  if(x!=null){const f=document.createElement('div');f.className='fl';f.textContent='+'+n;f.style.left=(x-10)+'px';f.style.top=(y-20)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),800)}
  renderHud();
}
function bumpCombo(){
  const now=Date.now();
  mini.combo=(now-(mini.comboAt||0)<900)?mini.combo+1:1;
  mini.comboAt=now;
  if(mini.combo>mini.maxCombo)mini.maxCombo=mini.combo;
  return mini.combo;
}
function resetCombo(){mini.combo=0;mini.comboAt=0;renderHud()}
function showBanner(t,cb){
  let b=$('#mbanner');if(!b){b=document.createElement('div');b.id='mbanner';$('#mini').appendChild(b)}
  b.textContent=t;b.className='on';
  setTimeout(()=>{b.classList.remove('on');if(cb)cb()},900);
}
function nextWave(){
  if(!mini||mini.phase!=='play')return;
  mini.wavesDone++;
  if(mini.wave>=3){finishMini(true);return}
  mini.wave++;
  mini.phase='wave';
  mini.combo=0;
  showBanner('Уровень '+mini.wave+'!',()=>{if(mini&&mini.phase==='wave')runMini(mini.id)});
}
function hitPenalty(why){
  if(!mini||mini.phase!=='play')return;
  mini.penalties++;mini.hp--;mini.end-=5000;resetCombo();
  snd('bad');vib(30);toast(why);
  renderHud();
  if(mini.hp<=0)finishMini(false);
}
function miniTick(){
  if(!mini||mini.phase!=='play')return;
  if(mini.id==='clean')cleanTick();
  if(mini.id==='granny')grannyTick();
  const left=Math.max(0,mini.end-Date.now());
  $('#mtimer').textContent=Math.ceil(left/1000)+' с';
  if(left<=0)finishMini(false);
}
function closeMini(){
  if(!mini)return;
  if(mini.phase==='res'&&mini.reward!=null&&!mini.claimed)claimMini();
  mini=null;
  $('#mini').hidden=true;
  $('#mstage').innerHTML='';
  $('#mhud').hidden=true;
  const b=$('#mbanner');if(b)b.remove();
}
$('#mclose').onclick=()=>{snd('click');closeMini()};
function mgQuality(){
  if(!mini)return 0;
  const w=mini.wavesDone/3;
  const hp=mini.hp/3;
  const pen=Math.max(0,1-mini.penalties*0.12);
  let obj=1;
  if(mini.id==='clean')obj=mini.totalGot?Math.min(1,mini.totalGot/mini.totalNeed):w;
  if(mini.id==='mic')obj=mini.totalGot?Math.min(1,mini.totalGot/12):w;
  if(mini.id==='granny'){
    const items=mini.itemsGot/3;
    obj=.55*w+.45*items;
    if(mini.wavesDone>=3&&mini.itemsGot===3&&!mini.hits)return 1;
  }
  let q=.62*w+.2*obj+.12*hp+.06*pen;
  if(mini.wavesDone>=3&&mini.penalties<=1&&mini.hp>0)q=Math.max(q,.99);
  if(mini.wavesDone>=3)q=Math.max(q,.62);
  return Math.min(1,q);
}
function starsOf(q){return q>=0.99?3:q>=0.6?2:q>=0.25?1:0}
function finishMini(win){
  if(!mini||(mini.phase!=='play'&&mini.phase!=='wave'))return;
  if(mini.phase==='play'&&win&&mini.wave===3&&mini.wavesDone<3)mini.wavesDone=3;
  if(mini.phase==='play'&&!win){/* keep wavesDone as completed waves */}
  mini.phase='res';
  const q=mgQuality(),stars=starsOf(q),d=mini.diff;
  const seconds0=stars===3?300:stars===2?Math.round(150+50*q):stars===1?Math.round(60+30*q):Math.round(40*q);
  const seconds=Math.round(Math.min(480,seconds0*(1+0.18*(d-1))*(0.75+0.1*mini.wavesDone)));
  const reward=nice(Math.max(seconds>0?40:0,incomeEst()*seconds));
  mini.reward=reward;mini.stars=stars;mini.q=q;mini.claimed=false;
  S.mg.n[mini.id]=(S.mg.n[mini.id]||0)+1;
  S.mg.cd[mini.id]=Date.now();
  if(stars>(S.mg.best[mini.id]||0))S.mg.best[mini.id]=stars;
  const rec=S.mg.bestScore[mini.id]||0;
  mini.newRec=mini.score>rec;
  if(mini.newRec)S.mg.bestScore[mini.id]=mini.score;
  if(stars===3){
    S.mg.perf=1;
    if((S.mg.diff[mini.id]||1)<5){S.mg.diff[mini.id]=mgDiff(mini.id)+1;mini.diffUp=S.mg.diff[mini.id]}
  }
  const title={
    clean:stars===3?'Зал блестит!':stars>=1?'Уже гораздо чище':'Время вышло',
    mic:stars===3?'Всё на месте!':mini.totalGot? 'Часть вещей нашлась':'Микрофон так и не нашёлся',
    granny:stars===3?'Бабушка на месте и всем довольна!':mini.wavesDone>=3||(mini.step>=(mini.need||0)&&mini.wave>=3)?'Бабушка дошла до своего места':'Не успели проводить бабушку'
  }[mini.id];
  const det={
    clean:'Убрано: '+(mini.totalGot||0)+' · уровни: '+mini.wavesDone+'/3'+(mini.penalties?' · штрафы: '+mini.penalties:''),
    mic:'Найдено: '+(mini.totalGot||0)+'/12 · уровни: '+mini.wavesDone+'/3'+(mini.penalties?' · ошибки: '+mini.penalties:''),
    granny:'Уровни: '+mini.wavesDone+'/3 · вещи: '+(mini.itemsGot||0)+'/3'+(mini.hits?' · ударов: '+mini.hits:'')
  }[mini.id];
  const ic=stars===3?'✨':stars?'🙏':'⌛';
  const recLine=mini.score?('Очки: <b>'+fmt(mini.score)+'</b>'+(mini.newRec?' · новый рекорд!':' · рекорд: '+fmt(Math.max(rec,mini.score)))):'';
  const extra=(mini.maxCombo>1?'Макс. комбо ×'+mini.maxCombo+' · ':'')+'сложность '+d+(mini.diffUp?' → '+mini.diffUp+' ⬆':'');
  $('#mtimer').textContent='';
  $('#mhint').textContent='';
  $('#mstatus').textContent='';
  $('#mhud').hidden=true;
  $('#mstage').innerHTML=`<div class="mg-res"><div class="ic">${ic}</div><b>${title}</b><div class="mg-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>${det}</p><p class="mg-rec">${recLine}</p><p class="mg-extra">${extra}</p>${reward?`<div>Награда</div><span class="big-n">+${fmt(reward)}</span><div>добрых дел</div>`:'<p>В этот раз без награды — попробуйте ещё через 3 часа.</p>'}<button type="button">${reward?'Забрать':'Закрыть'}</button></div>`;
  $('#mstage').querySelector('button').onclick=()=>{snd('buy');claimMini();closeMini()};
  vib(stars>=2?[30,40,30]:20);if(stars)snd('chime');else snd('click');
  checkAch();save();
}
function claimMini(){
  if(!mini||mini.claimed)return;
  mini.claimed=true;
  if(mini.reward){add(mini.reward,true);toast('+'+fmt(mini.reward)+' добрых дел'+(mini.diffUp?' · сложность теперь '+mini.diffUp:''));}
  save();
}

function randPos(used,extra){
  let x,y,g=0;
  do{x=8+Math.random()*78;y=(extra&&extra.y)?extra.y():(20+Math.random()*70);g++}while(g<24&&used.some(p=>Math.hypot(p.x-x,p.y-y)<(extra&&extra.gap||11)));
  used.push({x,y});return {x,y};
}
function setupClean(){
  const d=mini.diff,w=mini.wave;
  const pews=[22,34,46,58,70,82];
  const need=Math.min(22,(w===1?8:w===2?12:16)+d);
  const stubbornN=w+(d>2?1:0);
  const hazardsN=w===1?2:w===2?3:3;
  mini.got=0;mini.need=need;mini.totalGot=mini.totalGot||0;mini.totalNeed=(mini.totalNeed||0)+need;
  mini.respawnMs=Math.max(1400,(w===1?4200:w===2?3000:2200)-d*180);
  mini.spawnAt=Date.now()+mini.respawnMs;
  mini.live=0;mini.maxLive=Math.min(16,need);
  mini._used=[];
  $('#mstage').innerHTML='<div class="hall" id="hall"><div class="altar">⛪ Сцена</div><div class="carpet"></div>'+pews.map(t=>'<div class="pew" style="top:'+t+'%"></div>').join('')+'</div>';
  const hall=$('#hall');
  mini._pews=pews;mini._hall=hall;
  for(let i=0;i<Math.min(need,8+w+d);i++)spawnMess(i<stubbornN?'stubborn':null);
  for(let i=0;i<hazardsN;i++)spawnHazard();
  $('#mhint').textContent=w===3?'Грязь появляется быстро — не зевайте':'Стирайте пятна, не трогайте цветы и знак «мокрый пол»';
  $('#mstatus').textContent='Убрано: 0/'+need;
  const hit=e=>{
    const t=document.elementFromPoint(e.clientX,e.clientY);
    const it=t&&t.closest?t.closest('.mess,.hazard'):null;
    if(!it||it.classList.contains('gone'))return;
    if(it.classList.contains('hazard')){if(!it.dataset.hit){it.dataset.hit='1';hitPenalty(it.dataset.why);it.classList.add('flash');setTimeout(()=>{it.dataset.hit='';it.classList.remove('flash')},300)}return}
    cleanOne(it,e.clientX,e.clientY);
  };
  let down=false;
  hall.addEventListener('pointerdown',e=>{e.preventDefault();down=true;try{hall.setPointerCapture(e.pointerId)}catch(err){}hit(e)});
  hall.addEventListener('pointermove',e=>{if(down)hit(e)});
  hall.addEventListener('pointerup',()=>{down=false});
  hall.addEventListener('pointercancel',()=>{down=false});
  function spawnMess(force){
    if(!mini||mini.phase!=='play'&&mini.phase!=='wave')return;
    if(mini.live>=mini.maxLive)return;
    const types=force? [force] : (Math.random()<.28?'stubborn':Math.random()<.28?'paper':Math.random()<.25?'dust':Math.random()<.2?'web':'dirt');
    const tp=typeof types==='string'?types:(Math.random()<.5?'paper':'dirt');
    const kind=force||tp;
    const pos=randPos(mini._used,{y:kind==='dust'?()=>pews[Math.floor(Math.random()*pews.length)]+1+Math.random()*3:kind==='web'?()=>8+Math.random()*14:null,gap:10});
    const el=document.createElement('div');
    const typ=kind==='stubborn'?'dirt stubborn':kind;
    el.className='mess '+typ;
    el.style.left=pos.x+'%';el.style.top=pos.y+'%';
    el.dataset.hp=kind==='stubborn'?String(2+(d>3||w===3?1:0)):'1';
    if(kind==='paper'||typ.indexOf('paper')>=0){el.textContent=['📄','📃','📰'][Math.floor(Math.random()*3)];el.style.setProperty('--r',(Math.random()*40-20)+'deg');el.className='mess paper'}
    else if(kind==='dust')el.textContent='💨';
    else if(kind==='web')el.textContent='🕸️';
    else if(kind==='stubborn'){el.className='mess dirt stubborn';el.dataset.kind='stubborn'}
    hall.appendChild(el);mini.live++;
    return el;
  }
  function spawnHazard(){
    const kinds=[{ic:'⚠️',why:'Осторожно, мокрый пол!'},{ic:'🌸',why:'Ой, цветы! Не трогайте их.'}];
    const k=kinds[Math.floor(Math.random()*kinds.length)];
    const pos=randPos(mini._used,{gap:13});
    const el=document.createElement('div');
    el.className='hazard';el.textContent=k.ic;el.dataset.why=k.why;
    el.style.left=pos.x+'%';el.style.top=pos.y+'%';
    hall.appendChild(el);
  }
  function cleanOne(it,x,y){
    if(!mini||mini.phase!=='play'||it.classList.contains('gone'))return;
    let hp=(+it.dataset.hp||1)-1;it.dataset.hp=String(hp);
    if(hp>0){it.classList.add('half','pop');snd('click');vib(6);addScore(2,x,y);return}
    it.classList.add('gone');mini.live=Math.max(0,mini.live-1);
    mini.got++;mini.totalGot=(mini.totalGot||0)+1;
    const c=bumpCombo();
    const pts=10*c*(it.dataset.kind==='stubborn'||it.classList.contains('stubborn')?2:1);
    addScore(pts,x,y);snd('click');vib(8);
    $('#mstatus').textContent='Убрано: '+mini.got+'/'+mini.need+(c>1?' · ×'+c:'');
    renderHud();
    if(mini.got>=mini.need)nextWave();
  }
  mini._cleanOne=it=>cleanOne(it);
  mini._spawnMess=spawnMess;
}
function cleanTick(){
  if(!mini||Date.now()<mini.spawnAt)return;
  mini.spawnAt=Date.now()+mini.respawnMs;
  if(mini.got<mini.need&&mini.live<mini.maxLive)mini._spawnMess();
}

function setupMic(){
  const d=mini.diff,w=mini.wave;
  const nObj=Math.min(30,w===1?20:w===2?25:30);
  const nCover=w===1?4:w===2?6:8;
  const nDecoy=Math.min(MIC_DECOY.length,w+(d>2?1:0));
  const dark=w>=3||d>=5;
  mini.got=0;mini.need=4;mini.found={};mini.totalGot=mini.totalGot||0;
  $('#mhint').innerHTML='<div class="need">'+MIC_HIDE.map(h=>'<span id="need_'+h.id+'">'+h.ic+'</span>').join('')+'</div>';
  $('#mstatus').textContent='Найдено: 0/4';
  const pool=MIC_OBJS.map(o=>({...o,role:'empty'}));
  shuffle(pool);
  const objs=pool.slice(0,nObj);
  const leftover=pool.slice(nObj).concat(MIC_OBJS.map(o=>({...o})));
  const hides=MIC_HIDE.slice();
  hides.forEach((h,i)=>{objs[i].role='item';objs[i].hide=h});
  for(let i=0;i<nDecoy;i++){const o=objs[4+i];if(!o)break;o.role='decoy';o.decoy=MIC_DECOY[i%MIC_DECOY.length]}
  const itemSlots=objs.filter(o=>o.role==='item');
  let covers=0;
  const takeCover=avoid=>{let c;do{c=leftover.length?leftover.pop():MIC_OBJS[covers%MIC_OBJS.length]}while(c&&avoid&&c.n===avoid.n&&leftover.length);return c};
  itemSlots.forEach((o,i)=>{if(covers<nCover&&(i<2||Math.random()<.7)){o.cover=takeCover(o);covers++}});
  while(covers<nCover){const o=objs.find(x=>x.role!=='item'&&!x.cover);if(!o)break;o.cover=takeCover(o);covers++}
  shuffle(objs);
  const box=document.createElement('div');box.className='micg cols5'+(dark?' dark':'');
  objs.forEach(o=>{
    const b=document.createElement('button');
    b.className='ob'+(o.cover?' stacked':'');b.type='button';
    b.dataset.role=o.role;
    if(o.hide)b.dataset.hide=o.hide.id;
    const inner=o.role==='item'?o.hide:o.role==='decoy'?o.decoy:o;
    const under='<span class="under"><span class="ei">'+(o.role==='empty'?o.ic:inner.ic)+'</span><small>'+(o.role==='empty'?o.n:inner.n)+'</small></span>';
    if(o.cover){b.innerHTML='<span class="top"><span class="ei">'+o.cover.ic+'</span><small>'+o.cover.n+'</small></span>'+under;b.dataset.covered='1'}
    else{b.innerHTML=under;b.dataset.covered='0'}
    b.onclick=e=>{
      if(!mini||mini.phase!=='play'||b.classList.contains('open')||b.classList.contains('empty')||b.classList.contains('decoy-gone'))return;
      if(b.dataset.covered==='1'){
        b.dataset.covered='0';b.classList.add('shifted');b.classList.remove('stacked');
        snd('click');return;
      }
      if(o.role==='item'){
        b.classList.add('open');
        mini.got++;mini.found[o.hide.id]=1;mini.totalGot++;
        const n=$('#need_'+o.hide.id);if(n)n.classList.add('got');
        const c=bumpCombo();addScore(50*c,e.clientX,e.clientY);
        snd('buy');vib(15);
        $('#mstatus').textContent='Найдено: '+mini.got+'/4';
        renderHud();
        if(mini.got>=4)nextWave();
      }else if(o.role==='decoy'){
        b.classList.add('decoy-gone');
        b.querySelector('small').textContent='Не то!';
        mini.end-=6000;mini.penalties++;resetCombo();
        snd('bad');vib(25);toast('Это '+o.decoy.n+' — не то! −6 с');
        renderHud();
      }else{
        b.classList.add('empty');
        b.querySelector('small').textContent='Пусто';
        snd('click');
      }
    };
    box.appendChild(b);
  });
  $('#mstage').innerHTML='';
  if(dark){
    const fl=document.createElement('div');fl.id='flash';
    const wrap=document.createElement('div');wrap.className='micwrap';
    wrap.appendChild(box);wrap.appendChild(fl);
    $('#mstage').appendChild(wrap);
    const move=e=>{const r=wrap.getBoundingClientRect();fl.style.setProperty('--x',(e.clientX-r.left)+'px');fl.style.setProperty('--y',(e.clientY-r.top)+'px')};
    wrap.addEventListener('pointermove',move);
    wrap.addEventListener('pointerdown',move);
    fl.style.setProperty('--r',(d>=4?70:d>=3?82:96)+'px');
    fl.style.setProperty('--x','50%');fl.style.setProperty('--y','40%');
  }else $('#mstage').appendChild(box);
}

function setupGranny(){
  const d=mini.diff,w=mini.wave;
  const lanes=w>=3?2:3;
  const steps=w===1?6:w===2?7:8;
  const loot=[{id:'glasses',ic:'👓',n:'Очки'},{id:'bag',ic:'👜',n:'Сумка'},{id:'book',ic:'📖',n:'Сборник'}][w-1];
  const obs=[{ic:'🧹',n:'Ведро',move:true},{ic:'🪑',n:'Стулья',move:false},{ic:'🧒',n:'Ребёнок',move:true},{ic:'🚶',n:'Прохожий',move:true},{ic:'📦',n:'Коробка',move:false}];
  const rows=[];
  const lootRow=1+Math.floor(Math.random()*Math.max(1,steps-3));
  for(let r=0;r<steps;r++){
    const cells=[...Array(lanes)].map((_,lane)=>({lane,kind:'safe',ic:'',n:'Проход',move:false}));
    if(r===steps-1){
      cells.forEach(c=>{c.kind='safe';c.ic='⭐';c.n='Место'});
      const seat=cells[Math.min(1,lanes-1)];seat.ic='🪑';seat.n='Её место';seat.kind='seat';
    }else{
      const nBad=Math.min(lanes-1,w===1?(Math.random()<.4?1:1):(Math.random()<.5?2:1));
      shuffle([...Array(lanes).keys()]).slice(0,nBad).forEach(i=>{
        const o=obs[Math.floor(Math.random()*obs.length)];
        cells[i].kind='bad';cells[i].ic=o.ic;cells[i].n=o.n;cells[i].move=!!o.move;cells[i].dir=Math.random()<.5?1:-1;
      });
      if(w>=3&&r>0&&r<steps-1&&Math.random()<.45){
        const free=cells.filter(c=>c.kind==='safe');
        if(free.length){const c=free[0];c.kind='stairs';c.ic='🪜';c.n='Ступени'}
      }
      if(r===lootRow){
        const free=cells.filter(c=>c.kind==='safe'||c.kind==='stairs');
        const c=free[Math.floor(Math.random()*free.length)]||cells[0];
        if(c.kind==='bad'){c.kind='safe'}
        c.kind='item';c.item=loot;c.ic=loot.ic;c.n=loot.n;c.move=false;
      }
    }
    rows.push(cells);
  }
  mini.step=0;mini.need=steps;mini.lanes=lanes;mini.hits=mini.hits||0;
  mini.itemsGot=mini.itemsGot||0;mini.foundItems=mini.foundItems||{};
  mini.needItem=loot;mini.orderOk=mini.orderOk!==false;
  mini.rows=rows;mini.lane=Math.min(mini.lane||0,lanes-1);
  if(mini.lane==null||mini.lane>=lanes)mini.lane=0;
  mini.lockUntil=0;
  mini.autoAt=Date.now()+Math.max(1100,1800-(w-1)*80+d*40);
  mini.moveEvery=Math.max(520,1000-w*80-d*40);
  mini.moveAt=Date.now()+mini.moveEvery;
  mini.stepMs=Math.max(260,420-(w-1)*30);
  $('#mhint').textContent=w===1?'Соберите очки, обходите движущиеся препятствия':w===2?'Теперь нужна сумка — только после очков':'Узкий проход и ступени. Соберите сборник';
  renderGranny();
}
function renderGranny(){
  if(!mini||mini.id!=='granny'||mini.phase!=='play')return;
  const L=mini.lanes,wid=(100/L);
  const order=['glasses','bag','book'];
  const gathered=order.map(id=>mini.foundItems[id]?({glasses:'👓',bag:'👜',book:'📖'}[id]):'·').join(' ');
  $('#mstatus').textContent='Ряд '+(mini.step+1)+'/'+mini.need+' · вещи: '+gathered;
  const rowHtml=(row,ri)=>'<div class="row lanes'+L+'" data-r="'+ri+'">'+row.map(c=>'<button type="button" class="cell '+c.kind+(c.move?' mov':'')+'" data-lane="'+c.lane+'" data-preview="'+ri+'">'+(c.ic||'')+'<small>'+c.n+'</small></button>').join('')+'</div>';
  const nxt=mini.rows[mini.step+1],cur=mini.rows[mini.step];
  const rowsHtml=(nxt?rowHtml(nxt,1):'')+rowHtml(cur,0);
  const seatTxt=mini.step>=mini.need-1?(mini.wave>=3?'⭐ Любимое место бабушки':'⭐ Дальше, на уровень '+(mini.wave+1)):'⛪ Вперёд, к её месту';
  $('#mstage').innerHTML='<div class="grw lanes'+L+'"><div class="aisle"><div class="seat">'+seatTxt+'</div><div class="rows">'+rowsHtml+'</div><div class="gma" id="gma" style="width:'+wid+'%;left:'+(mini.lane*wid)+'%">👵</div></div></div>';
  $('#mstage').querySelectorAll('.cell[data-preview="0"]').forEach(bt=>bt.onclick=()=>grannyStep(+bt.dataset.lane,true));
  renderHud();
}
function grannyTick(){
  if(!mini||mini.phase!=='play')return;
  const now=Date.now();
  if(now>=mini.moveAt){slideObstacles();mini.moveAt=now+mini.moveEvery}
  if(now>=mini.autoAt&&now>=mini.lockUntil){grannyStep(mini.lane,false);mini.autoAt=Date.now()+Math.max(1100,1800-(mini.wave-1)*80+mini.diff*40)}
}
function slideObstacles(){
  if(!mini||!mini.rows)return;
  const vis=[mini.step,mini.step+1].filter(r=>mini.rows[r]);
  vis.forEach(ri=>{
    const row=mini.rows[ri],L=row.length;
    const movers=row.map((c,i)=>c.kind==='bad'&&c.move?i:-1).filter(i=>i>=0);
    movers.forEach(i=>{
      const c=row[i];if(!c||c.kind!=='bad')return;
      let n=i+(c.dir||1);
      if(n<0||n>=L){c.dir=-(c.dir||1);n=i+c.dir}
      if(n<0||n>=L)return;
      const t=row[n];
      if(t.kind==='item'||t.kind==='seat'){c.dir=-(c.dir||1);return}
      // swap
      row[n]=c;c.lane=n;
      row[i]={lane:i,kind:t.kind,ic:t.ic,n:t.n,move:t.move,dir:t.dir,item:t.item};
    });
    row.forEach((c,i)=>c.lane=i);
  });
  // if a mover entered granny's current target lane and auto is imminent, just redraw
  renderGranny();
  // collision if a bad cell slid into granny's lane on current row and she's "waiting" — check on auto/tap instead
}
function grannyStep(lane,byUser){
  if(!mini||mini.phase!=='play'||mini.id!=='granny')return;
  const now=Date.now();
  if(byUser&&now<mini.lockUntil)return;
  if(lane<0||lane>=mini.lanes)return;
  const cell=mini.rows[mini.step][lane];
  const gma=$('#gma');
  mini.lane=lane;
  if(gma){const wid=100/mini.lanes;gma.style.width=wid+'%';gma.style.left=(lane*wid)+'%';gma.classList.remove('bob');void gma.offsetWidth;gma.classList.add('bob')}
  if(cell.kind==='bad'){
    mini.hits++;mini.penalties++;mini.hp--;mini.end-=4000;resetCombo();
    snd('bad');vib(30);
    const el=$('#mstage').querySelector('.cell[data-preview="0"][data-lane="'+lane+'"]');
    if(el){el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),250)}
    toast('Ой! '+cell.n);
    renderHud();
    if(mini.hp<=0||mini.end<=Date.now()){finishMini(false);return}
    mini.lockUntil=now+400;
    mini.autoAt=now+Math.max(1100,1600);
    return;
  }
  if(cell.kind==='item'&&cell.item&&!mini.foundItems[cell.item.id]){
    const order=['glasses','bag','book'];
    const next=order.find(id=>!mini.foundItems[id]);
    if(cell.item.id!==next){
      toast('Сначала найдите: '+(next==='glasses'?'очки':next==='bag'?'сумку':'сборник'));
      snd('bad');
    }else{
      mini.foundItems[cell.item.id]=1;mini.itemsGot++;
      if(cell.item.id==='glasses')mini.hasGlasses=1;
      toast(cell.item.ic+' Нашли: '+cell.item.n);snd('buy');vib(12);
      addScore(80);
    }
  }else if(byUser)snd('click');
  if(cell.kind==='stairs'){addScore(5);mini.lockUntil=now+mini.stepMs+180}
  else mini.lockUntil=now+mini.stepMs;
  mini.step++;
  addScore(15);
  if(mini.step>=mini.need){nextWave();return}
  mini.autoAt=now+Math.max(1100,1800-(mini.wave-1)*80+mini.diff*40);
  renderGranny();
}


// ---------- panels ----------
let panel=null;
function achProg(){return ACH.filter(a=>S.ach[a.id]).length+'/'+ACH.length}
function setTitle(p){$('#ptitle').textContent={shop:'🛠 Улучшения',bld:'🏛 Здания',quest:'📅 Задания на сегодня',mini:'🎮 Мини-игры',ach:'🏆 Достижения · '+achProg(),info:'ℹ️ Об игре'}[p]}
function openP(p){panel=p;$('#panel').hidden=false;setTitle(p);renderP(true);document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===p))}
$('#pclose').onclick=()=>{panel=null;$('#panel').hidden=true;document.querySelectorAll('#tabs button').forEach(b=>b.classList.remove('on'))};
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{snd('click');panel===b.dataset.p?$('#pclose').onclick():openP(b.dataset.p)});
function untilMidnight(){const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);return (m-n)/1000}
function statsHtml(){
  return `Время в игре: <b>${fmtT(S.st.play)}</b><br>Всего нажатий: <b>${fmt(S.taps)}</b><br>Лучший доход: <b>${fmt(S.st.best)}</b> дел/сек<br>Добрых дел за всё время: <b>${fmt(S.total)}</b><br>В этом приходе: <b>${fmt(S.run)}</b><br>Новых приходов: <b>${S.st.pr}</b> · благословений: <b>${S.bl}</b><br>Поймано праздников: <b>${S.st.ev}</b><br>Выполнено заданий: <b>${S.st.q}</b><br>Сыграно мини-игр: <b>${mgPlayed()}</b><br>Достижений: <b>${achProg()}</b>`;
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
  }else if(panel==='mini'){
    if(full){
      const inc=incomeEst();
      b.innerHTML='<p class="apro">Три уровня за заход, играть можно раз в 3 часа. Чем выше сложность, тем больше награда.</p>'+MGAMES.map(g=>{
        const left=mgLeft(g.id),ready=!left,n=S.mg.n[g.id]||0,best=S.mg.best[g.id]||0,diff=mgDiff(g.id),rec=S.mg.bestScore[g.id]||0;
        const cap=fmt(nice(Math.max(80,inc*mgMaxSec(g.id))));
        const sub='Сложность: '+diff+'/5 · сыграно: '+n+(best?' · '+best+'★':'')+(rec?' · рекорд: '+fmt(rec)+' оч.':'')+'<span class="cd">'+(ready?'Можно играть · до '+cap+' дел':'Следующая попытка через '+fmtT(left/1000))+'</span>';
        return `<div class="it mg" id="mg_${g.id}"><div class="ic">${g.ic}</div><div class="tx"><b>${g.n}</b><br>${g.d}<br>${sub}</div><button data-id="${g.id}" ${ready?'':'disabled'}>${ready?'Играть':'Ждём'}</button></div>`;
      }).join('');
      b.querySelectorAll('button[data-id]').forEach(x=>x.onclick=()=>startMini(x.dataset.id));
    }else{
      MGAMES.forEach(g=>{
        const el=$('#mg_'+g.id);if(!el)return;
        const left=mgLeft(g.id),bt=el.querySelector('button'),cd=el.querySelector('.cd');
        if(cd)cd.textContent=left?'Следующая попытка через '+fmtT(left/1000):'Можно играть';
        if(bt){bt.disabled=!!left;bt.textContent=left?'Ждём':'Играть'}
      });
    }
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
<div class="it"><div class="tx">Вы — завхоз церкви «Слово жизни» на Павла Корчагина, 2А. Нажимайте на церковь, делайте добрые дела, нанимайте волонтёров и запускайте молодёжку «4.0». Покупайте здания для богослужений и улучшайте их: от молитвенного дома до летнего лагеря.<br><br>В разделе «Мини-игры» — три испытания по три уровня: уборка в зале, поиск микрофона и помощь бабушке. Каждую игру можно проходить раз в 3 часа. За три звезды сложность растёт, а награда становится больше.<br><br>Каждый день — 3 новых задания с наградой. Ловите праздничные значки на экране: они дают ×7 ко всем делам на 30 секунд. После ${fmt(PR_RUN)} дел можно начать «Новый приход» и получить благословения навсегда.<br><br>Игра сохраняется сама. Пока вас нет, волонтёры трудятся (до 8 часов).<br><br>${VERSES[3]}</div></div>
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
  if(mini)miniTick();
  if(!mini){
    if(ev&&Date.now()>ev.end){if(ev.type!=='sunday')toast(ev.type==='fuse'?'Пробки починил электрик. Доход вернулся':'Микрофон заменили запасным');ev=null;renderEvent()}
    if(!ev&&Date.now()>evTimer){startEvent();evTimer=Date.now()+evWait()}
    if(badge&&Date.now()>badge.end){badge.el.classList.add('gone');const e=badge.el;setTimeout(()=>e.remove(),400);badge=null}
    if(!badge&&!mOpen&&Date.now()>badgeAt){spawnBadge();badgeAt=Date.now()+badgeWait()}
  }
  acc+=dt;
  $('#deeds').textContent=fmt(S.d);
  if(acc>.25){acc=0;const p=ps();if(p>S.st.best)S.st.best=p;
    $('#dps').textContent=fmt(p);$('#dpt').textContent=fmt(tapVal());$('#people').textContent=fmt(people(S));
    const bl=$('#blessS');bl.hidden=!S.bl;$('#bless').textContent=S.bl;
    qCheckDay();$('#qdot').hidden=!qReady();$('#mgdot').hidden=!mgAnyReady();
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
window.__game={S,startEvent,openP,spawnBadge,offlineModal,showStory,askPrestige,startMini,closeMini,get ev(){return ev},get badge(){return badge},get mini(){return mini}};
