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
const API='https://zavhoz-board.sj-polomki.workers.dev';
const net={online:null,total:null,top:[],me:null,ok:false,lastSend:0,lastPing:0};
function newPid(){return (crypto.randomUUID&&crypto.randomUUID())||('p-'+Date.now().toString(36)+Math.random().toString(36).slice(2,10))}
function ensurePid(){
  if(!S.pid){S.pid=newPid();save()}
  return S.pid;
}
function defaultNick(){return 'Завхоз-'+ensurePid().replace(/-/g,'').slice(-4)}
function ensureNick(){if(!S.nick){S.nick=defaultNick();save()}return S.nick}
const NICK_BAD=['хуй','хуя','хуе','хуё','пизд','бляд','блят','ебан','ёбан','ебат','ёбат','сука','суки','сучк','мудил','мудак','жопа','залуп','гандон','гондон','пидор','пидар','педик','чмо','падла','тварь','дерьм','срать','срал'];
function cleanNickClient(raw){
  if(typeof raw!=='string')return {ok:false,msg:'Введите ник'};
  let v=raw.replace(/[\u0000-\u001F\u007F\u00A0\u200B-\u200F\u202A-\u202E\u2060\u2800\u3164\uFEFF\uFFA0]/g,'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
  if(v.length<2||v.length>16)return {ok:false,msg:'Ник — от 2 до 16 символов'};
  if(!/^[0-9A-Za-zА-Яа-яЁёІіЇїЄєҐґ _-]+$/.test(v))return {ok:false,msg:'Можно буквы, цифры, пробел, _ и -'};
  if(!v.replace(/[\s_-]+/g,'').length)return {ok:false,msg:'Ник не должен быть пустым'};
  const low=v.toLowerCase();
  for(const w of NICK_BAD)if(low.includes(w))return {ok:false,msg:'Этот ник нельзя использовать, выберите другой'};
  return {ok:true,nick:v};
}
async function netNick(nick){
  const j=await api('/nick',{method:'POST',body:JSON.stringify({playerId:ensurePid(),nick})});
  applyNet(j);
  if(panel==='board')renderP(true,{skipFetch:true});
  if(panel==='info')renderP(true);
  return j;
}
const REF_PCT=5,REF_CAP=50,REF_CHEST=2000,REF_GIFT=500;
function refCode(){return ensurePid().replace(/-/g,'').slice(0,12)}
function inviteUrl(){return URL0.replace(/\/?$/,'/')+'?ref='+encodeURIComponent(refCode())}
const refMul=()=>1+Math.min(REF_CAP,REF_PCT*(S.refInvited||0))/100;
function friendsWord(n){const a=n%10,b=n%100;return a===1&&b!==11?'друг':a>=2&&a<=4&&(b<10||b>=20)?'друга':'друзей'}
function isQuotaErr(e){
  const err=e&&e.body&&e.body.error;
  return err==='quota'||e.status===503;
}
function netQuiet(){return Date.now()<((net.quietUntil)||0)}
function markQuota(e){
  if(!isQuotaErr(e))return false;
  const retry=(e.body&&e.body.retry)||10*60000;
  net.quietUntil=Date.now()+Math.max(60000,retry);
  return true;
}
async function api(path,opt){
  const ctl=new AbortController();
  const tmr=setTimeout(()=>ctl.abort(),8000);
  try{
    const r=await fetch(API+path,Object.assign({signal:ctl.signal,cache:'no-store'},opt||{},{headers:Object.assign({'content-type':'application/json'},(opt&&opt.headers)||{})}));
    const j=await r.json().catch(()=>null);
    if(!r.ok){const err=new Error((j&&j.error)||('http '+r.status));err.status=r.status;err.body=j;throw err}
    return j;
  }finally{clearTimeout(tmr)}
}
function applyNet(j){
  if(!j)return;
  if(typeof j.online==='number')net.online=j.online;
  if(typeof j.total==='number')net.total=j.total;
  if(Array.isArray(j.list))net.top=j.list;
  if(j.me)net.me=j.me;
  net.ok=true;
  renderLive();
}
function renderLive(){
  const el=$('#live');if(!el)return;
  el.hidden=false;
  const o=net.online==null?'—':net.online, tot=net.total==null?'—':net.total;
  if(!net.ok&&net.online==null){
    el.textContent='🟢 —';
    el.classList.add('off');
    el.title='Нет связи с таблицей мест';
    el.setAttribute('aria-label','Нет связи с таблицей мест');
    return;
  }
  el.classList.remove('off');
  el.textContent='🟢 '+o;
  el.title='Сейчас играют: '+o+' · Всего игроков: '+tot;
  el.setAttribute('aria-label','Сейчас играют: '+o+'. Всего игроков: '+tot+'. Открыть таблицу мест');
}
async function netPing(){
  if(netQuiet())return;
  try{
    const j=await api('/ping',{method:'POST',body:JSON.stringify({playerId:ensurePid(),refCode:refCode()})});
    net.lastPing=Date.now();applyNet(j);
  }catch(e){if(!markQuota(e))net.ok=false;renderLive()}
}
async function netScore(force){
  if(netQuiet())return;
  const now=Date.now();
  const score=Math.floor(S.total||0);
  if(!force&&net.lastSend&&now-net.lastSend<300000)return;
  if(net.lastScore!=null&&score<=net.lastScore&&!force)return;
  if(force&&net.lastScore!=null&&score<=net.lastScore&&net.lastSend&&now-net.lastSend<300000)return;
  try{
    const j=await api('/score',{method:'POST',body:JSON.stringify({playerId:ensurePid(),nick:ensureNick(),score,refCode:refCode()})});
    net.lastSend=now;
    if(j&&typeof j.score==='number')net.lastScore=j.score;
    else net.lastScore=score;
    applyNet(j);
    if(panel==='board')renderP(true,{skipFetch:true});
    return j;
  }catch(e){
    markQuota(e);
    if(e.status!==429&&!isQuotaErr(e))net.ok=false;
    renderLive();
    return e.body||null;
  }
}
async function netTop(){
  try{
    const j=await api('/top?limit=50&playerId='+encodeURIComponent(ensurePid()));
    applyNet(j);
    if(panel==='board')renderP(true,{skipFetch:true});
    return j;
  }catch(e){net.ok=false;renderLive();if(panel==='board')renderP(true,{skipFetch:true});return null}
}
async function applyIncomingRef(retries){
  const ref=S.pendingRef;
  if(!ref||S.refDone)return;
  if(ref===refCode()||ref===ensurePid()||ref===String(ensurePid()).replace(/-/g,'')){S.refDone=1;S.pendingRef='';save();return}
  const tries=Math.max(1,retries||5);
  for(let i=0;i<tries;i++){
    try{
      const j=await api('/ref',{method:'POST',body:JSON.stringify({newPlayerId:ensurePid(),ref})});
      S.refDone=1;S.pendingRef='';
      if(j&&j.ok&&j.newcomer&&j.gift){
        add(j.gift,true);S.starterGift=j.gift;
        toast('🎁 Подарок за приглашение: +'+fmt(j.gift)+' добрых дел!');
      }
      save();
      return;
    }catch(e){
      markQuota(e);
      const err=e&&e.body&&e.body.error;
      if(err==='exists'||err==='self'||(e&&e.body&&e.body.already)){S.refDone=1;S.pendingRef='';save();return}
      if(isQuotaErr(e))return;
      if(i<tries-1)await new Promise(r=>setTimeout(r,400));
    }
  }
}
async function netMeAndClaim(){
  try{
    const j=await api('/me?playerId='+encodeURIComponent(ensurePid()));
    if(j&&typeof j.invitedCount==='number'){S.refInvited=j.invitedCount;save();renderInvite()}
    if(j&&j.unclaimed>0){
      const c=await api('/claim',{method:'POST',body:JSON.stringify({playerId:ensurePid()})});
      if(c&&c.ok&&c.claimed>0){
        const amount=c.claimed*(c.chest||REF_CHEST);
        add(amount,true);
        S.refInvited=c.invitedCount||S.refInvited||0;
        const pct=c.bonusPct!=null?c.bonusPct:Math.min(REF_CAP,REF_PCT*(S.refInvited||0));
        const n=c.claimed;
        toast(n===1
          ?'🎁 Друг зашёл по вашей ссылке! Сундук: +'+fmt(amount)+' дел и +'+REF_PCT+'% к доходу навсегда'
          :'🎁 К вам пришли '+n+' '+friendsWord(n)+'! Сундук: +'+fmt(amount)+' дел и +'+pct+'% к доходу навсегда');
        snd('chime');save();renderInvite();
      }
    }
  }catch(e){markQuota(e)}
}
function startNet(){
  ensurePid();
  applyIncomingRef(5).finally(()=>{netPing();setTimeout(()=>netScore(true),1200);netMeAndClaim()});
  setInterval(netPing,60000);
  setInterval(()=>netScore(false),300000);
  setInterval(netMeAndClaim,180000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){netScore(true);save()}else{applyIncomingRef(3).finally(()=>{netPing();netMeAndClaim()})}});
  setTimeout(()=>syncPush(false),4000);
}
function boardHtml(){
  const list=net.top||[];
  const me=net.me;
  const nick=S.nick||defaultNick();
  let h='<p class="apro">По всем добрым делам за всё время</p>';
  h+='<div class="nickrow"><label>Ваш ник <input id="nickIn" maxlength="16" value="'+esc(nick)+'" aria-label="Ник" autocomplete="nickname"></label><button type="button" id="nickSave">Сменить ник</button></div>';
  h+='<p class="nickhint">От 2 до 16 символов: буквы, цифры, пробел, _ и -</p>';
  if(!net.ok&&!list.length){
    h+='<p class="board-off">Нет связи с таблицей. Проверьте интернет — места появятся, как только сервер ответит. Ваш прогресс никуда не денется, он хранится на устройстве.</p>';
    return h;
  }
  if(me)h+='<p id="myRank">Ваше место: <b>'+me.rank+'</b>'+(me.of?' из '+me.of:'')+' · '+fmt(me.score)+' дел</p>';
  else h+='<p id="myRank">Вас пока нет в таблице. Сохраните ник, и результат отправится сам.</p>';
  if(!list.length)h+='<p class="board-off">Пока никого нет в таблице. Будьте первым!</p>';
  else{
    h+='<ol class="board">'+list.map(e=>{
      const cls=e.me?' class="me"':'';
      const edit=e.me?'<button type="button" class="nickedit" data-nickedit="1" aria-label="Сменить ник">✏️</button>':'';
      return '<li'+cls+'><span class="rk">'+e.rank+'</span><span class="nm">'+(e.me?'Вы · ':'')+esc(e.nick||'Гость')+'</span>'+edit+'<span class="sc">'+fmt(e.score||0)+'</span></li>';
    }).join('')+'</ol>';
  }
  if(!net.ok)h+='<p class="board-off">Сейчас нет связи, показаны последние известные места.</p>';
  return h;
}
function focusNickEdit(){
  const inp=$('#nickIn');if(!inp)return;
  inp.focus();
  try{inp.select()}catch(e){}
  try{inp.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){try{inp.scrollIntoView()}catch(x){}}
}
async function saveNick(){
  const inp=$('#nickIn');if(!inp)return;
  const res=cleanNickClient(inp.value);
  if(!res.ok){toast(res.msg);return}
  const prev=S.nick;
  S.nick=res.nick;save();
  inp.value=res.nick;
  try{
    const j=await netNick(res.nick);
    if(j&&j.ok)toast('Ник сохранён: '+res.nick);
    else if(j&&j.error==='nick'){S.nick=prev;save();inp.value=prev||'';toast('Этот ник нельзя использовать, выберите другой')}
    else if(j&&j.error==='rate')toast('Ник можно сменить раз в минуту');
    else toast('Ник записан у вас, в таблицу попадёт при связи');
  }catch(e){
    const err=e&&e.body&&e.body.error;
    markQuota(e);
    if(err==='nick'){S.nick=prev;save();inp.value=prev||'';toast('Этот ник нельзя использовать, выберите другой')}
    else if(err==='rate')toast('Ник можно сменить раз в минуту');
    else toast('Ник записан у вас, в таблицу попадёт при связи');
  }
}
function bindNickUi(){
  const ns=$('#nickSave');if(ns)ns.onclick=()=>{snd('click');saveNick()};
  const ni=$('#nickIn');if(ni)ni.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveNick()}});
  document.querySelectorAll('[data-nickedit]').forEach(btn=>{
    btn.onclick=()=>{snd('click');focusNickEdit()};
  });
}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const KEY='zavhoz_sz_v1';
let S={d:0,total:0,taps:0,u:{},ach:{},fix:0,mic:0,t:Date.now(),loc:0};
let fresh=true;
try{const o=JSON.parse(localStorage.getItem(KEY));if(o){Object.assign(S,o);fresh=false}}catch(e){}
if(!S.u)S.u={};if(!S.ach)S.ach={};if(!S.b)S.b={};
// v6 migration
if(S.run==null)S.run=S.total;
if(!S.st)S.st={play:0,best:0,ev:0,q:0,pr:0};
if(!S.set)S.set={snd:1,mus:1,vib:1,tapsnd:1};
if(S.bl==null)S.bl=0;
if(S.intro==null)S.intro=fresh||!S.total?0:1;
if(!S.mg)S.mg={cd:{},n:{},best:{}};
if(!S.mg.cd)S.mg.cd={};if(!S.mg.n)S.mg.n={};if(!S.mg.best)S.mg.best={};
if(!S.mg.diff)S.mg.diff={};if(!S.mg.bestScore)S.mg.bestScore={};
if(S.tut==null)S.tut=(fresh||!S.total)?0:1;
if(S.set.svol==null)S.set.svol=.8;if(S.set.mvol==null)S.set.mvol=.45;if(S.set.tapsnd==null)S.set.tapsnd=1;
if(!S.pid)S.pid=newPid();
if(S.refInvited==null)S.refInvited=0;
let pendingSync='';
var persistLock=false;
(function adoptPidGuard(){
  const IDP=['pid','playerId','playerid','player_id','id','player','uid','user','save','data','state'];
  function params(){
    const out=[];
    try{
      const q=new URLSearchParams(location.search);
      IDP.forEach(k=>{const v=q.get(k);if(v)out.push(v)});
      const r=q.get('ref');if(r)out.push(r);
      if(location.hash){
        const h=new URLSearchParams(String(location.hash).replace(/^#/,''));
        IDP.concat(['ref']).forEach(k=>{const v=h.get(k);if(v)out.push(v)});
      }
    }catch(e){}
    return out;
  }
  function fromUrl(pid,list){
    if(!pid)return false;
    const compact=String(pid).replace(/-/g,'');
    return list.some(v=>{
      const t=String(v||''),c=t.replace(/-/g,'');
      return t===pid||t===compact||c===pid||c===compact;
    });
  }
  function clean(){
    try{
      const u=new URL(location.href);
      let ch=false;
      IDP.concat(['ref','sync']).forEach(k=>{if(u.searchParams.has(k)){u.searchParams.delete(k);ch=true}});
      if(u.hash&&/[?&#](pid|playerId|playerid|player_id|id|player|uid|user|save|data|state|ref|sync)=/i.test(u.hash)){u.hash='';ch=true}
      if(ch)history.replaceState(null,'',u.pathname+u.search+u.hash);
    }catch(e){}
  }
  const incoming=params();
  let ref='';
  try{ref=new URLSearchParams(location.search).get('ref')||''}catch(e){}
  try{
    const sy=new URLSearchParams(location.search).get('sync')||'';
    if(/^[A-Za-z0-9_-]{24,80}$/.test(sy))pendingSync=sy;
  }catch(e){}
  // If this device's playerId was taken from a URL param, keep local progress and mint a new id
  // so we stop writing to someone else's server account. Not destructive to the local save.
  if(S.pid&&fromUrl(S.pid,incoming)&&!S.pidAdoptedFixed){
    S.pid=newPid();
    S.pidAdoptedFixed=1;
  }
  try{
    if(ref&&!S.refDone){
      const own=ref===refCode()||ref===S.pid||ref===String(S.pid).replace(/-/g,'');
      if(own){S.refDone=1;S.pendingRef=''}
      else if(fresh||(!S.total&&!S.taps)){S.pendingRef=ref}
    }
  }catch(e){}
  save({keepTime:true});
  clean();
})();
const TITLE='Завхоз церкви';
const DAYV=[
 ['Возлюби ближнего твоего, как самого себя','Мф 22:39'],
 ['Блаженны милостивые, ибо они помилованы будут','Мф 5:7'],
 ['Вы — свет мира','Мф 5:14'],
 ['Да будет воля Твоя и на земле, как на небе','Мф 6:10'],
 ['Ищите же прежде Царства Божия','Мф 6:33'],
 ['Просите, и дано будет вам','Мф 7:7'],
 ['Итак во всём, как хотите, чтобы с вами поступали люди, так поступайте и вы с ними','Мф 7:12'],
 ['Придите ко Мне, все труждающиеся и обременённые','Мф 11:28'],
 ['Что вы хотите, чтобы Я сделал вам?','Мк 10:36'],
 ['Веруйте в Бога и в Меня веруйте','Ин 14:1'],
 ['Я есмь путь и истина и жизнь','Ин 14:6'],
 ['Да любите друг друга','Ин 13:34'],
 ['Мир оставляю вам, мир Мой даю вам','Ин 14:27'],
 ['Нет больше той любви, как если кто положит душу свою за друзей своих','Ин 15:13'],
 ['Всё могу в укрепляющем меня Иисусе Христе','Флп 4:13'],
 ['Радуйтесь всегда в Господе','Флп 4:4'],
 ['И мир Божий, который превыше всякого ума, соблюдёт сердца ваши','Флп 4:7'],
 ['Всё, что делаете, делайте от души, как для Господа','Кол 3:23'],
 ['Слово Христово да вселяется в вас обильно','Кол 3:16'],
 ['Всегда радуйтесь. Непрестанно молитесь. За всё благодарите','1 Фес 5:16–18'],
 ['Друг друга тяготы носите','Гал 6:2'],
 ['Делая добро, да не унываем','Гал 6:9'],
 ['Любовью служите друг другу','Гал 5:13'],
 ['Плод же духа: любовь, радость, мир','Гал 5:22'],
 ['Бог есть любовь','1 Ин 4:8'],
 ['Мы любим Его, потому что Он прежде возлюбил нас','1 Ин 4:19'],
 ['Будем любить не словом или языком, но делом и истиною','1 Ин 3:18'],
 ['Всё у вас да будет с любовью','1 Кор 16:14'],
 ['Любовь никогда не перестаёт','1 Кор 13:8'],
 ['Теперь пребывают сии три: вера, надежда, любовь; но любовь из них больше','1 Кор 13:13'],
 ['Посему, едите ли, пьёте ли, или иное что делаете, всё делайте в славу Божию','1 Кор 10:31'],
 ['Благодать вам и мир от Бога Отца нашего','Рим 1:7'],
 ['Любящим Бога, призванным по Его изволению, всё содействует ко благу','Рим 8:28'],
 ['Радуйтесь с радующимися и плачьте с плачущими','Рим 12:15'],
 ['Если возможно с вашей стороны, будьте в мире со всеми людьми','Рим 12:18'],
 ['Не будь побеждён злом, но побеждай зло добром','Рим 12:21'],
 ['Бог же надежды да исполнит вас всякой радости и мира в вере','Рим 15:13'],
 ['Благодать Господа нашего Иисуса Христа со всеми вами','Рим 16:24'],
 ['Господь — Пастырь мой; я ни в чём не буду нуждаться','Пс 22:1'],
 ['Вот, благословите Господа, все рабы Господни','Пс 133:1'],
 ['Хвалите Господа, ибо Он благ, ибо вовек милость Его','Пс 135:1'],
 ['Надейся на Господа всем сердцем твоим','Притч 3:5'],
 ['Во всех путях твоих познавай Его','Притч 3:6'],
 ['Доброе имя лучше большого богатства','Притч 22:1'],
 ['Кроткий ответ отвращает гнев','Притч 15:1'],
 ['Страх Господень — начало мудрости','Притч 9:10'],
 ['Блаженны слышащие слово Божие и соблюдающие его','Лк 11:28'],
 ['Какою мерою мерите, такою отмерено будет и вам','Лк 6:38'],
 ['Не бойся, только веруй','Лк 8:50'],
 ['Ибо у Бога не останется бессильным никакое слово','Лк 1:37'],
 ['Слава в вышних Богу, и на земле мир','Лк 2:14'],
 ['Так да светит свет ваш пред людьми','Мф 5:16'],
 ['Довольно для каждого дня своей заботы','Мф 6:34'],
 ['Невозможно служить Богу и маммоне','Мф 6:24'],
 ['Даром получили, даром давайте','Мф 10:8'],
 ['Где двое или трое собраны во имя Моё, там Я посреди них','Мф 18:20'],
 ['Се, Я с вами во все дни до скончания века','Мф 28:20'],
 ['Научитесь от Меня, ибо Я кроток и смирен сердцем','Мф 11:29'],
 ['Блаженнее давать, нежели принимать','Деян 20:35'],
 ['Вера же есть осуществление ожидаемого и уверенность в невидимом','Евр 11:1'],
 ['Иисус Христос вчера и сегодня и вовеки тот же','Евр 13:8'],
 ['Бог нам прибежище и сила','Пс 45:2'],
 ['Вкусите и увидите, как благ Господь','Пс 33:9']
];

function isoWeekKey(d){
  d=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const day=(d.getDay()+6)%7;
  d.setDate(d.getDate()-day+3);
  const first=new Date(d.getFullYear(),0,4);
  const week=1+Math.round((d-first)/86400000/7);
  return d.getFullYear()+'-W'+String(week).padStart(2,'0');
}
function easterWestern(Y){
  const a=Y%19,b=Math.floor(Y/100),c=Y%100,d=Math.floor(b/4),e=b%4;
  const f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
  const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4;
  const l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
  const month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
  return new Date(Y,month-1,day);
}
function easterOrthodox(Y){
  const a=Y%4,b=Y%7,c=Y%19,d=(19*c+15)%30,e=(2*a+4*b-d+34)%7;
  const month=Math.floor((d+e+114)/31),day=((d+e+114)%31)+1;
  const dt=new Date(Y,month-1,day);
  dt.setDate(dt.getDate()+(Y>=2100?14:13));
  return dt;
}
function nearDay(a,b,days){return Math.abs((a-b)/86400000)<=days}
function detectSeason(now){
  const q=(new URLSearchParams(location.search).get('season')||'').toLowerCase();
  if(q==='xmas'||q==='christmas')return 'xmas';
  if(q==='easter')return 'easter';
  if(q==='none'||q==='off')return '';
  now=now||new Date();
  const m=now.getMonth(),d=now.getDate();
  if(m===11||(m===0&&d<=14))return 'xmas';
  const Y=now.getFullYear();
  if(nearDay(now,easterWestern(Y),7)||nearDay(now,easterOrthodox(Y),7))return 'easter';
  if(m===0&&nearDay(now,easterWestern(Y-1),7))return 'easter';
  return '';
}
let season='';
function applySeason(force){
  season=(force!=null)?force:detectSeason();
  document.body.classList.toggle('season-xmas',season==='xmas');
  document.body.classList.toggle('season-easter',season==='easter');
  document.body.classList.toggle('night',isNight());
  renderSeasonDeco();
  if(shownChurch){shownChurch=0;renderChurch()}
  if(S.set.mus)musicSync();
}
function renderSeasonDeco(){
  const box=$('#seasons');if(!box)return;
  if(season==='xmas'){
    box.innerHTML='<div class="garland">'+xmasGarland()+'</div><div class="xmas-tree">'+xmasTree()+'</div><div class="snowman">'+snowmanSVG()+'</div>';
    fillSnow(18);
  }else if(season==='easter'){
    box.innerHTML='<div class="easter-fl l">'+easterFlowers()+'</div><div class="easter-fl r">'+easterFlowers()+'</div>';
    fillSnow(0);
  }else{box.innerHTML='';fillSnow(0)}
}
function xmasGarland(){
  let s='<svg viewBox="0 0 300 20" xmlns="http://www.w3.org/2000/svg">';
  s+='<path d="M0 6 Q75 18 150 6 T300 6" fill="none" stroke="#2f7d3a" stroke-width="3"/>';
  for(let i=0;i<13;i++){const x=12+i*22,y=6+((i%2)?8:-2),c=['#e23d3d','#ffc94a','#3dcc6a','#f4f4f4'][i%4];
    s+=`<circle cx="${x}" cy="${y}" r="4.2" fill="${c}"/>`}
  return s+'</svg>';
}
function xmasTree(){
  return `<svg viewBox="0 0 54 78" xmlns="http://www.w3.org/2000/svg">
    <rect x="23" y="62" width="8" height="14" rx="2" fill="#6a3a1a"/>
    <polygon points="27,4 50,34 4,34" fill="#2f7d3a"/>
    <polygon points="27,16 52,48 2,48" fill="#2a7034"/>
    <polygon points="27,30 53,66 1,66" fill="#25662e"/>
    <circle cx="20" cy="28" r="2.2" fill="#e23d3d"/>
    <circle cx="34" cy="36" r="2.2" fill="#ffc94a"/>
    <circle cx="18" cy="46" r="2.2" fill="#fff"/>
    <circle cx="36" cy="54" r="2.2" fill="#e23d3d"/>
    <polygon points="27,0 30,8 22,8" fill="#ffc94a"/>
  </svg>`;
}
function easterFlowers(){
  return `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="22" width="4" height="24" rx="2" fill="#3d8a4a"/>
    <ellipse cx="20" cy="16" rx="7" ry="10" fill="#f7d6ea" transform="rotate(-20 20 16)"/>
    <ellipse cx="20" cy="16" rx="7" ry="10" fill="#f4cfe8" transform="rotate(20 20 16)"/>
    <ellipse cx="20" cy="16" rx="7" ry="10" fill="#fff0f7" transform="rotate(60 20 16)"/>
    <circle cx="20" cy="16" r="3" fill="#ffc94a"/>
    <ellipse cx="8" cy="40" rx="5" ry="3.2" fill="#f3d27a"/>
    <ellipse cx="32" cy="42" rx="5" ry="3.2" fill="#f7efe4"/>
  </svg>`;
}
function fillSnow(n){
  const fx=$('#fx');if(!fx)return;
  fx.querySelectorAll('.flake').forEach(e=>e.remove());
  for(let i=0;i<n;i++){
    const e=document.createElement('i');e.className='flake';
    const sz=3+Math.random()*5;
    e.style.cssText=`left:${Math.random()*100}%;top:${-10-Math.random()*40}%;width:${sz}px;height:${sz}px;animation-duration:${7+Math.random()*8}s;animation-delay:${-Math.random()*8}s;opacity:${.5+Math.random()*.45}`;
    fx.appendChild(e);
  }
}
function fillSmoke(){
  const fx=$('#fx');if(!fx)return;
  fx.querySelectorAll('.puff').forEach(e=>e.remove());
  for(let i=0;i<3;i++){
    const e=document.createElement('i');e.className='puff';
    e.style.cssText=`left:49%;top:10%;width:${6+i*2}px;height:${6+i*2}px;animation-delay:${i*1.4}s`;
    fx.appendChild(e);
  }
}
function personSVG(skin,shirt,hair,kind){
  const pants=kind==='kid'?'#3d6aad':'#3d4a6b';
  const pants2=kind==='kid'?'#345c96':'#33405c';
  if(kind==='grandma'){
    return `<svg viewBox="0 0 28 48" xmlns="http://www.w3.org/2000/svg">
      <line class="cane" x1="24" y1="16" x2="26" y2="46" stroke="#6a3a1a" stroke-width="1.7" stroke-linecap="round"/>
      <rect class="leg back" x="10" y="30" width="3" height="13" rx="1.4" fill="#5a4060"/>
      <rect class="leg front" x="15" y="30" width="3" height="13" rx="1.4" fill="#4a3250"/>
      <path d="M8 20 Q14 16 20 20 L19 34 Q14 37 9 34 Z" fill="#6a4a8a"/>
      <circle cx="15" cy="10" r="5.6" fill="${skin}"/>
      <path d="M9.5 10 Q15 2 20.5 10 Q18 8 15 8 Q12 8 9.5 10" fill="${hair}"/>
      <circle cx="18" cy="8" r="2.1" fill="${hair}"/>
      <circle cx="17.6" cy="10" r=".7" fill="#2a2a2a"/>
      <path d="M14 12.4 Q16 13.4 18 12.4" fill="none" stroke="#c48a7a" stroke-width=".8"/>
      <path d="M20 18 L23 28" stroke="${skin}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }
  const hr=kind==='kid'?5.6:6.1, hx=kind==='kid'?15:15.2, hy=kind==='kid'?8:9;
  const by=kind==='kid'?20:22, brx=kind==='kid'?5:6, bry=kind==='kid'?7:9;
  const ly=kind==='kid'?26:29, lh=kind==='kid'?12:14;
  return `<svg viewBox="0 0 28 48" xmlns="http://www.w3.org/2000/svg">
    <rect class="leg back" x="10" y="${ly}" width="3.1" height="${lh}" rx="1.5" fill="${pants}"/>
    <ellipse cx="14" cy="${by}" rx="${brx}" ry="${bry}" fill="${shirt}"/>
    <rect class="leg front" x="15.2" y="${ly}" width="3.1" height="${lh}" rx="1.5" fill="${pants2}"/>
    <path d="M16 ${by-4} L21 ${by+6}" stroke="${skin}" stroke-width="2.1" stroke-linecap="round"/>
    <circle cx="${hx}" cy="${hy}" r="${hr}" fill="${skin}"/>
    <ellipse cx="${hx}" cy="${hy-3}" rx="${hr-.3}" ry="3" fill="${hair}"/>
    <circle cx="${hx+3}" cy="${hy}" r=".8" fill="#2a2a2a"/>
  </svg>`;
}
function bagSVG(){
  return `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M3 5 H11 L10 13 H4 Z" fill="#8a5a32" stroke="#6a3a1a" stroke-width=".8"/><path d="M5 5 Q7 2 9 5" fill="none" stroke="#6a3a1a" stroke-width="1.2"/></svg>`;
}
function flowerSVG(){
  return `<svg viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg"><path d="M7 16 V7" stroke="#2f7d3a" stroke-width="1.3"/><circle cx="7" cy="5" r="2.1" fill="#e23d3d"/><circle cx="4.6" cy="6.2" r="1.7" fill="#f3d27a"/><circle cx="9.4" cy="6.2" r="1.7" fill="#f7d6ea"/><circle cx="7" cy="5.2" r=".8" fill="#ffc94a"/></svg>`;
}

let walkers=[], walkForceN=null, walkReduce=null;
function walkWanted(){
  if(walkForceN!=null)return Math.max(0,Math.min(8,walkForceN|0));
  const st=churchStage(S),p=people(S);
  let n=3+Math.floor((st-1)/2);
  if(p>=200)n++;
  if(p>=1000)n++;
  return Math.max(2,Math.min(8,n));
}
function walkLayout(){
  const box=$('#walk'),tap=$('#tap');
  if(!box||!tap)return null;
  const b=box.getBoundingClientRect(),t=tap.getBoundingClientRect();
  if(b.width<8||b.height<8)return null;
  const dx=x=>(x-b.left)/b.width*100, dy=y=>(y-b.top)/b.height*100;
  return {
    door:{x:dx(t.left+t.width*.5), y:dy(t.top+t.height*.80)},
    front:{x:dx(t.left+t.width*.5), y:dy(t.top+t.height*.99)},
    groundY:dy(t.bottom)+1.6,
    leftX:1.5, rightX:98.5
  };
}
function polyAt(pts,t){
  t=Math.max(0,Math.min(1,t));
  let len=0;const seg=[];
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i],b=pts[i+1],l=Math.hypot(b.x-a.x,b.y-a.y)||.001;
    seg.push(l);len+=l;
  }
  let d=t*len;
  for(let i=0;i<seg.length;i++){
    if(d<=seg[i]||i===seg.length-1){
      const k=d/seg[i],a=pts[i],b=pts[i+1];
      return {x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k};
    }
    d-=seg[i];
  }
  return pts[pts.length-1];
}
function walkPath(L,side,lane,dir){
  const gy=L.groundY+lane*3.4;
  const edgeX=side<0?L.leftX:L.rightX;
  const mid={x:L.front.x+side*7, y:L.front.y+lane*2.1};
  const door={x:L.door.x+side*1.1, y:L.door.y};
  const start={x:edgeX, y:gy};
  return dir==='in'?[start,mid,door]:[door,mid,start];
}
function walkerKind(){
  const r=Math.random();
  if(r<.2)return 'kid';
  if(r<.36)return 'grandma';
  return 'adult';
}
function walkerItem(kind){
  if(kind==='grandma')return null;
  const r=Math.random();
  if(r<.22)return 'bag';
  if(r<.38)return 'flowers';
  return null;
}
function makeWalker(box,scatter){
  const skins=['#f3c7a3','#e8b48a','#c48a5a','#8d5a3a'];
  const shirts=['#4a7ec8','#c44a4a','#2f7d3a','#a8691a','#6b4a9a','#c47a3a'];
  const hair=['#3a2a1e','#6a3a1a','#d4c08a','#1a1a1a','#8a8a8a'];
  const kind=walkerKind();
  const item=walkerItem(kind);
  const skin=skins[Math.floor(Math.random()*skins.length)];
  const shirt=shirts[Math.floor(Math.random()*shirts.length)];
  const hr=hair[Math.floor(Math.random()*hair.length)];
  const el=document.createElement('div');
  el.className='walker '+kind+(item==='umb'?' has-umb':'');
  el.setAttribute('aria-hidden','true');
  const held=item==='bag'?bagSVG():item==='flowers'?flowerSVG():'';
  el.innerHTML='<div class="fig"><span class="umb">'+umbrellaSVG()+'</span>'+(held?'<span class="item '+item+'">'+held+'</span>':'')+personSVG(skin,shirt,hr,kind)+'</div>';
  box.appendChild(el);
  const base=kind==='kid'?0.26:kind==='grandma'?0.075:0.14;
  const w={
    el,kind,item,
    side:Math.random()<.5?-1:1,
    lane:(Math.random()*3|0)-1,
    speed:base*(.82+Math.random()*0.4),
    state:'in', t:0, wait:0,
    x:0,y:0,sc:1,op:1,face:1,prevX:null
  };
  if(scatter){
    const roll=Math.random();
    if(roll<.18){w.state='wait';w.t=1;w.wait=.4+Math.random()*3;w.op=0;w.sc=.3}
    else if(roll<.5){w.state='out';w.t=Math.random()*.85;w.side=Math.random()<.5?-1:1}
    else {w.state='in';w.t=Math.random()*.82}
  }
  return w;
}
function paintWalker(w){
  w.el.style.left=w.x+'%';
  w.el.style.top=w.y+'%';
  w.el.style.transform='translate(-50%,-100%) scale('+((w.face||1)*(w.sc||1))+','+(w.sc||1)+')';
  w.el.style.opacity=w.op;
  w.el.style.zIndex=String(20+Math.round(w.y||0));
  w.el.classList.toggle('idle',w.state==='wait'||w.op<0.12);
}
function advanceWalker(w,dt,L){
  if(w.state==='wait'){
    w.x=L.door.x;w.y=L.door.y;w.op=0;w.sc=.28;
    w.wait-=dt;
    if(w.wait<=0){
      w.state='out';w.t=0;
      w.side=Math.random()<.5?-1:1;
      w.lane=(Math.random()*3|0)-1;
    }
    return;
  }
  w.t+=w.speed*dt;
  const dir=w.state==='out'?'out':'in';
  const pts=walkPath(L,w.side,w.lane,dir);
  const p=polyAt(pts,Math.min(1,w.t));
  if(w.prevX==null)w.prevX=p.x;
  const dx=p.x-w.prevX;
  if(Math.abs(dx)>.02)w.face=dx>=0?1:-1;
  w.prevX=p.x;
  w.x=p.x;w.y=p.y;
  if(w.state==='in'){
    const fade=Math.max(0,(w.t-.72)/.28);
    w.sc=1-fade*.72;w.op=1-fade;
    if(w.t>=1){w.state='wait';w.wait=1.2+Math.random()*3.5;w.op=0;w.sc=.28;w.prevX=null}
  }else{
    const grow=Math.max(0,Math.min(1,w.t/.28));
    w.sc=.28+grow*.72;w.op=grow;
    if(w.t>=1){w.state='in';w.t=0;w.op=1;w.sc=1;w.prevX=null;w.lane=(Math.random()*3|0)-1}
  }
}
function spawnWalkers(){
  const box=$('#walk');if(!box)return;
  const n=walkWanted();
  while(walkers.length>n){const w=walkers.pop();if(w.el)w.el.remove()}
  while(walkers.length<n)walkers.push(makeWalker(box,true));
}
function tickWalkers(dt){
  if(mini||document.hidden)return;
  if(walkers.length!==walkWanted())spawnWalkers();
  const L=walkLayout();if(!L)return;
  if(walkReduce==null){
    try{walkReduce=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){walkReduce=false}
  }
  for(const w of walkers){
    if(!walkReduce)advanceWalker(w,dt,L);
    else if(!w.x&&!w.y){w.state='in';w.t=.4+.3*Math.random();advanceWalker(w,0,L)}
    paintWalker(w);
  }
}

function snowmanSVG(){
  return `<svg viewBox="0 0 48 70" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="54" r="14" fill="#f4f7fb"/>
    <circle cx="24" cy="32" r="11" fill="#eef3f8"/>
    <circle cx="24" cy="14" r="8" fill="#f7fafc"/>
    <rect x="16" y="2" width="16" height="6" rx="1" fill="#2a2a2a"/>
    <rect x="19" y="0" width="10" height="5" rx="1" fill="#1a1a1a"/>
    <circle cx="21" cy="13" r="1.1" fill="#2a2a2a"/>
    <circle cx="27" cy="13" r="1.1" fill="#2a2a2a"/>
    <polygon points="24,15 32,17 24,19" fill="#e07a2a"/>
    <circle cx="24" cy="32" r="1.3" fill="#2a2a2a"/>
    <circle cx="24" cy="38" r="1.3" fill="#2a2a2a"/>
    <circle cx="24" cy="52" r="1.5" fill="#2a2a2a"/>
    <rect x="10" y="30" width="8" height="2.2" rx="1" fill="#6a3a1a"/>
    <rect x="30" y="30" width="8" height="2.2" rx="1" fill="#6a3a1a"/>
    <path d="M16 22 Q24 28 32 22" fill="none" stroke="#c44a4a" stroke-width="2"/>
  </svg>`;
}
function catSVG(){
  return `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="16" rx="12" ry="6.5" fill="#c47a3a"/>
    <circle cx="10" cy="12" r="6" fill="#c47a3a"/>
    <polygon points="5,10 5,3 10,9" fill="#c47a3a"/>
    <polygon points="15,9 15,3 10,10" fill="#c47a3a"/>
    <polygon points="6,8 5.5,5 8,8" fill="#f3c7a3"/>
    <polygon points="14,8 14.5,5 12,8" fill="#f3c7a3"/>
    <circle cx="8" cy="12" r="1" fill="#2a2a2a"/>
    <ellipse cx="4.5" cy="13.5" rx="1.6" ry="0.8" fill="#e8a090"/>
    <path d="M32 16 Q40 2 36 16" fill="none" stroke="#c47a3a" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="14" y="20" width="2" height="4" rx="1" fill="#8a5a32"/>
    <rect x="24" y="20" width="2" height="4" rx="1" fill="#8a5a32"/>
  </svg>`;
}
function birdSVG(){
  return `<svg viewBox="0 0 28 16" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="14" cy="10" rx="6" ry="3.4" fill="#b8b4ae"/>
    <circle cx="8" cy="9" r="3.2" fill="#c8c4be"/>
    <polygon points="4,9 0,10 4,11" fill="#e0a040"/>
    <circle cx="7" cy="8.2" r=".7" fill="#2a2a2a"/>
    <path class="wing" d="M14 10 Q18 2 22 10" fill="#9a968e"/>
    <path d="M20 10 Q26 8 24 12" fill="#9a968e"/>
  </svg>`;
}
function benchSVG(){
  return `<svg viewBox="0 0 80 58" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="36" width="68" height="6" rx="1.5" fill="#8a5a32"/>
    <rect x="10" y="42" width="5" height="14" rx="1" fill="#6a3a1a"/>
    <rect x="65" y="42" width="5" height="14" rx="1" fill="#6a3a1a"/>
    <rect x="10" y="26" width="60" height="5" rx="1" fill="#8a5a32"/>
    <rect x="12" y="18" width="56" height="4" rx="1" fill="#7a4a28"/>
    <circle cx="40" cy="14" r="6" fill="#f0c8a8"/>
    <path d="M34 12 Q40 4 46 12" fill="#d8d0c8"/>
    <ellipse cx="40" cy="30" rx="10" ry="10" fill="#6a4a8a"/>
    <path d="M32 28 L28 40 L36 38" stroke="#f0c8a8" stroke-width="2.2" fill="none"/>
    <path d="M48 28 L52 40 L44 38" stroke="#f0c8a8" stroke-width="2.2" fill="none"/>
    <circle cx="38" cy="13.5" r=".7" fill="#2a2a2a"/>
    <circle cx="42.5" cy="13.5" r=".7" fill="#2a2a2a"/>
    <path d="M38 16 Q40 17.5 42 16" fill="none" stroke="#c48a7a" stroke-width="1"/>
    <circle cx="54" cy="40" r="4" fill="#c44a4a"/>
    <path d="M50 38 Q46 32 44 36" fill="none" stroke="#c44a4a" stroke-width="1"/>
  </svg>`;
}
function bellSVG(){
  return `<svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="0" width="4" height="6" fill="#c9a24a"/>
    <path d="M6 16 Q6 6 16 6 Q26 6 26 16 L28 28 Q16 34 4 28 Z" fill="#e6c15a" stroke="#b8862a" stroke-width="1"/>
    <ellipse cx="16" cy="28" rx="12" ry="3.2" fill="#d4a84a"/>
    <circle cx="16" cy="32" r="2.4" fill="#c9a24a"/>
  </svg>`;
}
function moonSVG(){
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <defs><mask id="mc"><rect width="36" height="36" fill="#fff"/><circle cx="22" cy="12" r="11" fill="#000"/></mask></defs>
    <circle cx="16" cy="18" r="12" fill="#ffe9a8" mask="url(#mc)"/>
  </svg>`;
}
function zawhozSVG(){
  return `<svg viewBox="0 0 40 70" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="8" width="3" height="58" fill="#8a5a32"/>
    <rect x="16" y="8" width="3" height="58" fill="#8a5a32"/>
    <rect x="2" y="16" width="17" height="2" fill="#a06a3a"/>
    <rect x="2" y="28" width="17" height="2" fill="#a06a3a"/>
    <rect x="2" y="40" width="17" height="2" fill="#a06a3a"/>
    <rect x="2" y="52" width="17" height="2" fill="#a06a3a"/>
    <circle cx="30" cy="18" r="5.5" fill="#e8b48a"/>
    <rect x="25" y="13" width="10" height="3" rx="1" fill="#3a5a8a"/>
    <rect x="26" y="11" width="8" height="3" fill="#3a5a8a"/>
    <ellipse cx="30" cy="34" rx="6.5" ry="11" fill="#4a7a4a"/>
    <rect x="24.5" y="44" width="4" height="16" rx="1.4" fill="#3d4a6b"/>
    <rect x="31.5" y="44" width="4" height="16" rx="1.4" fill="#3d4a6b"/>
    <rect x="22" y="30" width="7" height="5" rx="1" fill="#8a5a32"/>
    <circle cx="28.5" cy="17.5" r=".8" fill="#2a2a2a"/>
    <circle cx="32.2" cy="17.5" r=".8" fill="#2a2a2a"/>
  </svg>`;
}
function keySVG(){
  return `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="6" fill="none" stroke="#ffc94a" stroke-width="3"/>
    <rect x="14" y="8.5" width="12" height="3" fill="#ffc94a"/>
    <rect x="22" y="8.5" width="3" height="7" fill="#ffc94a"/>
    <rect x="18" y="8.5" width="3" height="5" fill="#ffc94a"/>
  </svg>`;
}
function bucketSVG(){
  return `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10 L9 24 Q14 27 19 24 L21 10 Z" fill="#4a8ac8" stroke="#2a5a8a" stroke-width="1"/>
    <rect x="6" y="8" width="16" height="3" rx="1" fill="#3a6aaa"/>
    <path d="M8 8 Q14 0 20 8" fill="none" stroke="#c9a24a" stroke-width="2"/>
    <path d="M10 16 H18" stroke="#fff8" stroke-width="1.2"/>
  </svg>`;
}
function umbrellaSVG(){
  return `<svg viewBox="0 0 34 22" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 14 Q17 0 32 14 Z" fill="#c44a4a"/>
    <path d="M17 14 V22" stroke="#6a3a1a" stroke-width="1.6"/>
    <path d="M2 14 Q9 10 17 14 Q25 10 32 14" fill="#a83a3a"/>
  </svg>`;
}
let shownNight=null,rainT=null,zavT=null,eggT=null,rainEndT=null,bellAt=0;
function syncNight(){
  const n=isNight();
  document.body.classList.toggle('night',n);
  if(shownNight!==n){shownNight=n;fillStars(n?14:0)}
}
function fillStars(n){
  const fx=$('#fx');if(!fx)return;
  fx.querySelectorAll('.star').forEach(e=>e.remove());
  for(let i=0;i<n;i++){
    const e=document.createElement('i');e.className='star';
    const sz=1.4+Math.random()*2.2;
    e.style.cssText=`left:${4+Math.random()*92}%;top:${3+Math.random()*38}%;width:${sz}px;height:${sz}px;animation-delay:${-Math.random()*2}s`;
    fx.appendChild(e);
  }
}
function startRain(ms){
  const fx=$('#fx');if(!fx)return;
  if(rainEndT){clearTimeout(rainEndT);rainEndT=null}
  document.body.classList.add('rain');
  fx.querySelectorAll('.drop').forEach(e=>e.remove());
  for(let i=0;i<20;i++){
    const e=document.createElement('i');e.className='drop';
    const h=10+Math.random()*12;
    e.style.cssText=`left:${Math.random()*100}%;top:${-10-Math.random()*30}%;height:${h}px;animation-duration:${.55+Math.random()*.7}s;animation-delay:${-Math.random()*2}s`;
    fx.appendChild(e);
  }
  rainEndT=setTimeout(()=>stopRain(true),ms||18000);
}
function stopRain(sched){
  document.body.classList.remove('rain');
  const fx=$('#fx');if(fx)fx.querySelectorAll('.drop').forEach(e=>e.remove());
  if(rainEndT){clearTimeout(rainEndT);rainEndT=null}
  if(sched)scheduleRain();
}
function scheduleRain(){
  if(rainT)clearTimeout(rainT);
  rainT=setTimeout(()=>startRain(),50000+Math.random()*90000);
}
function showZavhoz(ms){
  const box=$('#bits');if(!box)return;
  box.querySelectorAll('.zavh').forEach(e=>e.remove());
  const el=document.createElement('button');
  el.type='button';el.className='bit zavh';el.setAttribute('aria-label','Завхоз');
  el.innerHTML=zawhozSVG();
  let used=false;
  el.onclick=e=>{
    e.stopPropagation();
    if(used)return;used=true;
    const b=nice(Math.max(20,incomeEst()*12));
    add(b,true);toast('🧰 Завхоз нашёл запасной инструмент: +'+fmt(b));snd('buy');vib(12);
    el.classList.add('gone');
  };
  box.appendChild(el);
  setTimeout(()=>{if(el.parentNode)el.remove();scheduleZavhoz()},ms||14000);
}
function scheduleZavhoz(){
  if(zavT)clearTimeout(zavT);
  zavT=setTimeout(()=>showZavhoz(),45000+Math.random()*60000);
}
function spawnEgg(forceId,spot){
  const box=$('#bits');if(!box)return;
  box.querySelectorAll('.egg').forEach(e=>e.remove());
  const kinds=[{id:'key',svg:keySVG,txt:'🔑 Нашли потерянные ключи'},{id:'bucket',svg:bucketSVG,txt:'🪣 Ведро завхоза'}];
  const kind=forceId?kinds.find(x=>x.id===forceId)||kinds[0]:kinds[Math.floor(Math.random()*kinds.length)];
  const el=document.createElement('button');
  el.type='button';el.className='bit egg egg-'+kind.id+' '+(spot||['tl','tr','bl','br'][Math.floor(Math.random()*4)]);
  el.setAttribute('aria-label',kind.txt);
  el.innerHTML=kind.svg();
  let used=false;
  el.onclick=e=>{
    e.stopPropagation();
    if(used)return;used=true;
    const b=nice(Math.max(25,incomeEst()*18));
    add(b,true);toast(kind.txt+': +'+fmt(b));snd('chime');vib(15);
    el.remove();
  };
  box.appendChild(el);
  setTimeout(()=>{if(el.parentNode)el.remove();scheduleEgg()},12000);
}
function scheduleEgg(){
  if(eggT)clearTimeout(eggT);
  eggT=setTimeout(()=>spawnEgg(),40000+Math.random()*70000);
}
function ringBell(){
  const el=$('#bitBell');
  if(el){el.classList.remove('ring');void el.offsetWidth;el.classList.add('ring');setTimeout(()=>el.classList.remove('ring'),900)}
  snd('bell');vib(18);
  const now=Date.now();
  if(now-bellAt>45000){
    bellAt=now;
    const b=nice(Math.max(15,incomeEst()*8));
    add(b,true);toast('🔔 Колокол: +'+fmt(b));
  }
}
function mountBits(){
  const box=$('#bits');if(!box)return;
  box.innerHTML='<div class="bit cat" aria-hidden="true">'+catSVG()+'</div>'
    +'<div class="bit bench" aria-hidden="true">'+benchSVG()+'</div>'
    +'<button type="button" class="bit bell" id="bitBell" aria-label="Колокол">'+bellSVG()+'</button>'
    +'<div class="bit moon" aria-hidden="true">'+moonSVG()+'</div>';
  for(let i=0;i<3;i++){
    const b=document.createElement('div');
    b.className='bit bird';b.setAttribute('aria-hidden','true');
    b.innerHTML=birdSVG();
    b.style.top=(6+i*7)+'%';
    b.style.animationDuration=(10+i*2.4)+'s';
    b.style.animationDelay=(-i*3.5)+'s';
    box.appendChild(b);
  }
  const bell=$('#bitBell');if(bell)bell.onclick=e=>{e.stopPropagation();ringBell()};
  scheduleRain();scheduleZavhoz();scheduleEgg();
}

const TUTOR=[
 {ic:'⛪',t:'Добро пожаловать!',d:'Вы — завхоз церкви. Нажимайте на церковь, чтобы делать добрые дела.',hl:'tut-hl'},
 {ic:'🛠',t:'Улучшения',d:'За дела нанимайте волонтёров, ставьте стулья и зовите хор — церковь будет расти.',hl:'tut-hl2'},
 {ic:'📅',t:'Каждый день — новое',d:'В «Заданиях» три поручения на день, а в «Играх» — короткие мини-игры.',hl:'tut-hl3'},
 {ic:'🕊',t:'Готово!',d:'Загляните во вкладку «Приход», читайте стих дня и просто делайте добро. Слава Богу!',hl:''},
];
let tutI=0;
function showTutor(){
  tutI=0;renderTutor();$('#tutor').hidden=false;setInviteVisible();
}
function renderTutor(){
  const s=TUTOR[tutI];
  document.body.classList.remove('tut-hl','tut-hl2','tut-hl3');
  if(s.hl)document.body.classList.add(s.hl);
  $('#tstep').innerHTML='<span class="ic">'+s.ic+'</span><b>'+s.t+'</b>'+s.d+'<div class="dots">'+('●'.repeat(tutI+1))+('○'.repeat(TUTOR.length-tutI-1))+'</div>';
  $('#tnext').textContent=tutI===TUTOR.length-1?'Начать!':'Далее';
}
function closeTutor(){
  document.body.classList.remove('tut-hl','tut-hl2','tut-hl3');
  $('#tutor').hidden=true;S.tut=1;save({keepTime:true});setTimeout(bootModals,200);setTimeout(()=>applyOffline({delay:300}),250);setInviteVisible();
}
function bootModals(){
  showVerse();
  showSeasonBonus();
  if(!S.intro){S.intro=1;showStory(0,false)}
}

function verseOfDay(d){
  d=d||new Date();
  const start=new Date(d.getFullYear(),0,0);
  const day=Math.max(0,Math.floor((d-start)/86400000));
  return DAYV[day%DAYV.length];
}
function showVerse(force){
  if(!force&&S.verseDay===dayKey())return false;
  const vr=verseOfDay(),t=vr[0],r=vr[1];
  const bonus=nice(Math.max(50,incomeEst()*45));
  const give=S.verseDay!==dayKey();
  modal('📖 <b>Стих дня</b><br><div class="story">«'+t+'»</div><span class="verse-ref">('+r+')</span>'+(give?'<br>Награда: <b>+'+fmt(bonus)+'</b> добрых дел':''),
   [{t:'Аминь 🙏',f:()=>{if(give){add(bonus,true);S.verseDay=dayKey();S.st.verse=(S.st.verse||0)+1;toast('+'+fmt(bonus)+' за стих дня');save()}}}]);
  return true;
}
function seasonKey(){
  const s=season||detectSeason();if(!s)return '';
  const n=new Date(),y=n.getFullYear(),m=n.getMonth();
  return ((s==='xmas'&&m===0)?y-1:y)+'-'+s;
}
function showSeasonBonus(){
  if(!season||S.seasonClaim===seasonKey())return false;
  const bonus=nice(Math.max(80,incomeEst()*90));
  const title=season==='xmas'?'🎄 С Рождеством!':'🐣 Светлой Пасхи!';
  const d=season==='xmas'?'У церкви ёлка, гирлянды и снег. Примите праздничный дар.':'Церковь украшена к Пасхе. Примите праздничный дар.';
  modal(title+'<br><p>'+d+'</p>Награда: <b>+'+fmt(bonus)+'</b> добрых дел',
   [{t:'Слава Богу! 🙏',f:()=>{add(bonus,true);S.seasonClaim=seasonKey();toast('+'+fmt(bonus)+' к празднику');save()}}]);
  return true;
}

const PW_GOALS=[
 {ic:'🏠',n:'Ремонт крыши',d:'Собрать добрые дела на ремонт крыши'},
 {ic:'🪑',n:'Новые стулья',d:'Чтобы в зале никто не стоял в проходе'},
 {ic:'☕',n:'Чай для гостей',d:'Наполнить кухню чаем и печеньем'},
 {ic:'💡',n:'Свет во дворе',d:'Починить фонари у входа'},
 {ic:'🌿',n:'Цветник у крыльца',d:'Разбить клумбы у дверей церкви'},
 {ic:'🎸',n:'Вечер для молодёжи',d:'Подготовить зал к тёплому вечеру'},
 {ic:'🧺',n:'Помощь семьям',d:'Собрать наборы для семей прихода'},
];
function pwEnsure(){
  const w=isoWeekKey(new Date());
  if(!S.pw||S.pw.w!==w){
    const n=parseInt(w.replace(/\D/g,''),10)||0;
    const g=PW_GOALS[Math.abs(n)%PW_GOALS.length];
    const need=nice(Math.max(2500,incomeEst()*2400));
    S.pw={w,ic:g.ic,n:g.n,d:g.d,need,got:0,claimed:0};
  }
  return S.pw;
}
function pwAdd(n){if(!(n>0))return;pwEnsure();S.pw.got+=n}
function pwClaim(){
  const p=pwEnsure();if(p.claimed||p.got<p.need)return;
  const r=nice(Math.max(120,incomeEst()*180));
  p.claimed=1;add(r,true);toast('🕊 Цель недели выполнена! +'+fmt(r));vib([20,30,20]);snd('chime');save();renderP(true);
}
function parishHtml(){
  const p=pwEnsure(),pct=Math.min(100,p.got/p.need*100);
  const ready=p.got>=p.need&&!p.claimed;
  return '<p class="apro">Цель прихода на эту неделю</p>'
    +'<div class="it goal"><div class="ic">'+p.ic+'</div><div class="tx"><b>'+p.n+'</b><br>'+p.d+'</div></div>'
    +'<div class="pwbar"><i style="width:'+pct+'%"></i></div>'
    +'<p>Собрано: <b>'+fmt(p.got)+'</b> из <b>'+fmt(p.need)+'</b> дел</p>'
    +(p.claimed?'<p>Недельная цель уже закрыта. Слава Богу!</p>':'<button id="pwBtn" class="big" '+(ready?'':'disabled')+'>'+(ready?'Забрать награду':'Ещё '+fmt(Math.max(0,p.need-p.got)))+'</button>')
    +'<p class="parish-note">Общая таблица игроков — во вкладке «Места». Здесь цель вашего прихода на неделю: добрые дела, которые вы делаете, идут в копилку этой цели.</p>';
}

function makeShareCard(){
  return new Promise((res,rej)=>{
    const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;
    const g=c.getContext('2d');
    const grd=g.createLinearGradient(0,0,0,H);grd.addColorStop(0,'#4a3222');grd.addColorStop(1,'#1e140e');
    g.fillStyle=grd;g.fillRect(0,0,W,H);
    g.strokeStyle='#ffc94a';g.lineWidth=10;g.strokeRect(36,36,W-72,H-72);
    g.fillStyle='#ffc94a';g.fillRect(80,70,W-160,8);g.fillRect(80,H-80,W-160,8);
    g.fillStyle='#ffe27a';g.font='bold 64px system-ui,Segoe UI,sans-serif';g.textAlign='center';
    g.fillText(TITLE,W/2,160);
    const finish=()=>{
      g.fillStyle='#fff';g.font='bold 52px system-ui,Segoe UI,sans-serif';
      g.fillText(fmt(S.total)+' добрых дел',W/2,980);
      g.fillStyle='#ffc94a';g.font='36px system-ui,Segoe UI,sans-serif';
      g.fillText(LOC[curLoc()].n,W/2,1050);
      g.fillStyle='#fff';g.font='30px system-ui,Segoe UI,sans-serif';
      g.fillText('Достижений: '+achProg()+' · стадия '+churchStage(S),W/2,1110);
      g.fillStyle='#ffe27a';g.font='26px system-ui,Segoe UI,sans-serif';
      g.fillText(URL0.replace(/^https:\/\//,''),W/2,1220);
      c.toBlob(b=>res({canvas:c,blob:b,url:c.toDataURL('image/png')}),'image/png');
    };
    const img=new Image();
    img.onload=()=>{
      g.save();g.beginPath();g.arc(W/2,550,340,0,Math.PI*2);g.closePath();g.clip();
      g.drawImage(img,W/2-340,210,680,680);g.restore();
      g.strokeStyle='#ffc94a';g.lineWidth=12;g.beginPath();g.arc(W/2,550,340,0,Math.PI*2);g.stroke();
      finish();
    };
    img.onerror=finish;
    img.src='img/church'+churchStage(S)+'.webp';
  });
}

let ev=null; // {type,end,need,got}
let boost=null; // {n,ic,end}
const cnt=id=>S.u[id]||0;
const bcnt=(id,s)=>{s=s||S;return ((s.b)||{})[id]||0};
const bldOwned=s=>BLD.filter(b=>bcnt(b.id,s)>=1).length;
const cost=u=>Math.ceil(u.c*Math.pow(1.15,cnt(u.id)));
const bcost=(b,s)=>Math.ceil(b.c*Math.pow(3,bcnt(b.id,s)));
const blessMul=()=>1+.1*(S.bl||0);
const tapBld=()=>BLD.reduce((a,b)=>a+(b.tap||0)*bcnt(b.id),0);
const tapVal=()=>(1+UP.reduce((a,u)=>a+(u.tap||0)*cnt(u.id),0)+tapBld())*mult()*blessMul()*refMul();
const psBuildings=()=>BLD.reduce((a,b)=>a+(b.ps||0)*bcnt(b.id),0);
const bldMul=()=>1+(BLD.find(b=>b.mul)?(BLD.find(b=>b.mul).mul)*bcnt('camp'):0);
const psBase=()=>(UP.reduce((a,u)=>a+(u.ps||0)*cnt(u.id),0)+psBuildings())*bldMul()*blessMul()*refMul();
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
let nightForce=null;
function isNight(){
  if(nightForce!=null)return !!nightForce;
  const q=(new URLSearchParams(location.search).get('time')||'').toLowerCase();
  if(q==='night')return true;
  if(q==='day')return false;
  const h=new Date().getHours();return h>=22||h<6;
}
function setTime(mode){
  if(mode==='night')nightForce=true;
  else if(mode==='day')nightForce=false;
  else nightForce=null;
  syncNight();
}
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
  if(st!==shownChurch){
    const img=tapEl&&tapEl.querySelector('img');
    if(img)img.src='img/church'+st+'.webp';
    if(shownChurch&&st>shownChurch){
      tapEl.classList.remove('evolve');void tapEl.offsetWidth;
      tapEl.classList.add('evolve');
      setTimeout(()=>tapEl.classList.remove('evolve'),800);
      toast('⛪ Церковь преобразилась!');
      vib([30,40,30]);snd('chime');
      spawnWalkers();
    }
    shownChurch=st;
  }
  syncNight();
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
  const m=mq.shift();if(!m){mOpen=false;$('#modal').hidden=true;setInviteVisible();return}
  mOpen=true;$('#mtext').innerHTML=m.html;
  const bx=$('#mbtns');bx.innerHTML='';
  (m.btns||[{t:'Слава Богу! 🙏'}]).forEach(b=>{const e=document.createElement('button');e.textContent=b.t;if(b.cls)e.className=b.cls;if(b.dis)e.disabled=true;e.onclick=()=>{snd('click');const r=b.f&&b.f();if(r===false)return;if(r&&typeof r.then==='function'){e.disabled=true;Promise.resolve(r).then(v=>{if(v!==false)nextModal();else e.disabled=false}).catch(()=>{e.disabled=false;toast('Не получилось')});return}nextModal()};bx.appendChild(e)});
  $('#modal').hidden=false;setInviteVisible();
}
// ---------- audio ----------
let AC=null,master=null,musGain=null,musT=null,musStep=0,bgm=null,tapAud=null,audioUnlocked=false,lastTapSnd=0;
const HZ={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99};
// Old 100th (PD) / Silent Night (PD) / simple Easter chorale (PD-style)
const HYMN={
  main:{beat:.62,span:16,mel:[['G4',0,1],['E4',1,1],['F4',2,1],['G4',3,1],['G4',4,1],['A4',5,1],['B4',6,1],['C5',7,2],['C5',9,1],['B4',10,1],['A4',11,1],['G4',12,1],['A4',13,1],['G4',14,1],['F4',15,1],['E4',16,2]],ch:[['C4','E4','G4'],['C4','E4','G4'],['F4','A4','C5'],['C4','E4','G4']]},
  xmas:{beat:.7,span:16,mel:[['G4',0,1.5],['A4',1.5,.5],['G4',2,1],['E4',3,3],['G4',6,1.5],['A4',7.5,.5],['G4',8,1],['E4',9,3],['D5',12,2],['D5',14,2],['B4',16,3]],ch:[['C4','E4','G4'],['C4','F4','A4'],['G3','D4','G4'],['C4','E4','G4']]},
  easter:{beat:.5,span:12,mel:[['C4',0,1],['E4',1,1],['G4',2,1],['C5',3,2],['B4',5,1],['C5',6,1],['D5',7,2],['E5',9,1],['C5',10,1],['G4',11,1],['E4',12,2],['C4',14,2]],ch:[['C4','E4','G4'],['G3','B3','D4'],['C4','E4','G4'],['F3','A3','C4']]}
};
function hymnKind(){return season==='xmas'?'xmas':season==='easter'?'easter':'main'}
function canAac(){try{const a=document.createElement('audio');return !!(a.canPlayType&&(a.canPlayType('audio/mp4; codecs="mp4a.40.2"')||a.canPlayType('audio/mp4')))}catch(e){return true}}
function hymnSrc(kind){return 'audio/hymn-'+(kind||hymnKind())+'.'+(canAac()?'m4a':'mp3')}
function setPlaybackSession(){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}}
function ensureBgm(){
  if(bgm)return bgm;
  bgm=document.createElement('audio');
  bgm.id='bgm';
  bgm.setAttribute('playsinline','');
  bgm.setAttribute('webkit-playsinline','');
  bgm.playsInline=true;
  bgm.loop=true;
  bgm.preload='auto';
  bgm.volume=S.set.mvol??.45;
  const kind=hymnKind();
  bgm.src=hymnSrc(kind);
  bgm.dataset.kind=kind;
  document.body.appendChild(bgm);
  try{bgm.load()}catch(e){}
  return bgm;
}
function ensureTapAud(){
  if(tapAud)return tapAud;
  tapAud=document.createElement('audio');
  tapAud.id='tapAud';
  tapAud.setAttribute('playsinline','');
  tapAud.setAttribute('webkit-playsinline','');
  tapAud.playsInline=true;
  tapAud.preload='auto';
  tapAud.src='audio/tap.'+(canAac()?'m4a':'mp3');
  document.body.appendChild(tapAud);
  try{tapAud.load()}catch(e){}
  return tapAud;
}
function ac(fromGesture){
  if(!AC){
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
    AC=new C();
    master=AC.createGain();master.gain.value=.9;master.connect(AC.destination);
    musGain=AC.createGain();musGain.gain.value=S.set.mvol??.45;
    const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1600;
    musGain.connect(lp);lp.connect(master);
    try{AC.addEventListener('statechange',()=>{if(!document.hidden&&AC&&(AC.state==='suspended'||AC.state==='interrupted')){setPlaybackSession();AC.resume();if(S.set.mus&&audioUnlocked)startBgm()}})}catch(e){}
  }
  if(fromGesture&&AC.state!=='running'){
    try{const b=AC.createBuffer(1,1,AC.sampleRate||44100);const s=AC.createBufferSource();s.buffer=b;s.connect(AC.destination);s.start(0)}catch(e){}
  }
  if(AC.state==='suspended'||AC.state==='interrupted'){try{AC.resume()}catch(e){}}
  if(musGain)musGain.gain.value=S.set.mvol??.45;
  return AC;
}
function startBgm(fromGesture){
  const el=ensureBgm();
  if(!S.set.mus){try{el.pause()}catch(e){}return}
  const kind=hymnKind();
  if(el.dataset.kind!==kind){el.dataset.kind=kind;el.src=hymnSrc(kind);try{el.load()}catch(e){}}
  el.volume=S.set.mvol??.45;
  if(!audioUnlocked&&!fromGesture)return;
  try{const p=el.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}
}
function unlockAudio(){
  setPlaybackSession();
  ac(true);
  ensureBgm();
  ensureTapAud();
  audioUnlocked=true;
  startBgm(true);
}
function resumeAudio(){
  setPlaybackSession();
  if(AC&&(AC.state==='suspended'||AC.state==='interrupted'))try{AC.resume()}catch(e){}
  if(S.set.mus&&audioUnlocked)startBgm();
}
function tone(f,t0,dur,vol,type,dest){if(!AC||!f)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+Math.min(.03,dur/5));g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(dest||master);o.start(t0);o.stop(t0+dur+.05)}
function snd(k){
  if(!S.set.snd||!AC||AC.state!=='running')return;
  const t=AC.currentTime,v=S.set.svol??.8;
  if(k==='tap'){tone(740+Math.random()*80,t,.08,.1*v,'sine');tone(980,t,.05,.045*v,'triangle')}
  else if(k==='buy'){[523,659,784].forEach((f,i)=>tone(f,t+i*.05,.18,.1*v,'triangle'))}
  else if(k==='click')tone(520,t,.05,.07*v,'sine');
  else if(k==='chime'){[523,659,784,1046,1318].forEach((f,i)=>tone(f,t+i*.1,.55,.08*v,'sine'))}
  else if(k==='bell'){[392,523,659,784].forEach((f,i)=>tone(f,t+i*.03,.7,.11*v,'sine'));tone(196,t,.9,.07*v,'triangle')}
  else if(k==='bad'){tone(196,t,.22,.11*v,'triangle');tone(165,t+.08,.28,.08*v,'sine')}
}
function musicSync(){
  clearInterval(musT);musT=null;
  if(bgm||audioUnlocked||S.set.mus)startBgm(audioUnlocked);
}
document.addEventListener('touchend',unlockAudio,true);
document.addEventListener('click',unlockAudio,true);
document.addEventListener('pointerdown',unlockAudio,true);
function vib(ms){if(S.set.vib){try{if(navigator.vibrate)navigator.vibrate(ms)}catch(e){}}}
function playTapClick(){
  if(!S.set.tapsnd)return;
  const now=performance.now();
  if(now-lastTapSnd<50)return;
  lastTapSnd=now;
  try{
    const a=ensureTapAud();
    a.volume=Math.min(.4,(S.set.svol??.8)*.35);
    try{a.currentTime=0}catch(e){}
    const p=a.play();if(p&&p.catch)p.catch(()=>{});
  }catch(e){}
}
function save(opt){if(persistLock)return;if(!(opt&&opt.keepTime))S.t=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function safeNum(n,d){n=Number(n);return Number.isFinite(n)?n:(d||0)}
function add(n,noQ){
  n=safeNum(n);
  if(!n)return;
  S.d=safeNum(S.d)+n;S.total=safeNum(S.total)+n;S.run=safeNum(S.run)+n;
  if(S.d>1e18)S.d=1e18;if(S.total>1e18)S.total=1e18;if(S.run>1e18)S.run=1e18;
  if(S.d<0)S.d=0;if(S.total<0)S.total=0;if(S.run<0)S.run=0;
  if(!noQ)qProg('earn',n);if(n>0)pwAdd(n)
}
function fmtRate(n){
  n=safeNum(n);
  if(n<=0)return '0';
  if(n<100){const r=Math.round(n*10)/10;return r.toLocaleString('ru-RU',{maximumFractionDigits:1})}
  return fmt(n);
}
// ---------- tap ----------
function onTap(x,y){
  if(ev&&(ev.type==='fuse'||ev.type==='mic')){ev.got++;float(x,y,ev.type==='fuse'?'⚡':'🎤');vib(8);snd('click');if(ev.got>=ev.need)fixEvent();renderEvent();return}
  const v=tapVal();add(v);S.taps++;qProg('tap',1);float(x,y,'+'+fmt(v));vib(10);playTapClick();
  tapEl.classList.add('hit');setTimeout(()=>tapEl.classList.remove('hit'),80);
}
tapEl.addEventListener('pointerdown',e=>{unlockAudio();e.preventDefault();onTap(e.clientX,e.clientY)});
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
function renderInvite(){
  const btn=$('#inviteBtn');
  if(btn){
    const next=S.refInvited>=10?'бонус максимум +50%':'+5% навсегда + сундук';
    btn.innerHTML='🎁 Пригласи друга<small>'+next+'</small>';
  }
  if($('#ish')&&!$('#ish').hidden)renderInviteSheet();
  setInviteVisible();
}
function setInviteVisible(){
  const btn=$('#inviteBtn');if(!btn)return;
  const overlay=!!panel||($('#ish')&&!$('#ish').hidden)||($('#modal')&&!$('#modal').hidden)||($('#mini')&&!$('#mini').hidden)||($('#tutor')&&!$('#tutor').hidden);
  btn.hidden=!!overlay;
}
function renderInviteSheet(){
  const box=$('#ishbox');if(!box)return;
  const n=S.refInvited||0,pct=Math.min(REF_CAP,REF_PCT*n),url=inviteUrl();
  box.innerHTML=`<div class="ishh"><b>🎁 Пригласи друга</b><button type="button" id="ishx" aria-label="Закрыть">✕</button></div>
<div class="ishbody">
  <div class="ishcard you"><b>Вы получите</b><p>За каждого нового игрока по вашей ссылке — <b>сундук с ${fmt(REF_CHEST)} добрых дел</b> и постоянные <b>+${REF_PCT}% к доходу</b> (максимум +${REF_CAP}%).</p></div>
  <div class="ishcard pal"><b>Друг получит</b><p>Стартовый подарок — <b>${fmt(REF_GIFT)} добрых дел</b> сразу после входа по вашей ссылке.</p></div>
  <div class="ishprog">Приглашено: <b>${n}</b> ${friendsWord(n)} · бонус: <b>+${pct}%</b></div>
  <div class="ishlink"><input id="ishurl" readonly value="${esc(url)}" aria-label="Ссылка-приглашение"><button type="button" id="ishcopy">Копировать</button></div>
  <button type="button" id="ishshare" class="big">📤 Поделиться</button>
</div>`;
  $('#ishx').onclick=()=>{snd('click');closeInvite()};
  $('#ishcopy').onclick=()=>{snd('click');copyInviteLink()};
  $('#ishshare').onclick=()=>{snd('click');shareInvite()};
}
function openInvite(){
  const sh=$('#ish');if(!sh)return;
  sh.hidden=false;renderInviteSheet();setInviteVisible();
}
function closeInvite(){
  const sh=$('#ish');if(sh)sh.hidden=true;setInviteVisible();
}
async function copyInviteLink(){
  const url=inviteUrl();
  try{await navigator.clipboard.writeText(url);toast('📋 Ссылка скопирована — отправьте её другу!');return}catch(e){}
  try{const ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('📋 Ссылка скопирована — отправьте её другу!')}catch(e){toast(url)}
}
async function shareInvite(){
  const url=inviteUrl();
  const text='Играю в «'+TITLE+'». Заходи по моей ссылке — получишь подарок в 500 добрых дел, а я немного укреплю приход!';
  try{
    if(navigator.share){
      await navigator.share({title:TITLE,text,url});
      return;
    }
  }catch(e){if(e&&e.name==='AbortError')return}
  await copyInviteLink();
}
async function share(){
  const text='Я сделал '+fmt(S.total)+' добрых дел в игре «'+TITLE+'»! Заходи по моей ссылке — получишь стартовый подарок:';
  S.shared=1;save();
  let card=null;try{card=await makeShareCard()}catch(e){}
  try{
    if(navigator.share){
      const opts={title:TITLE,text,url:inviteUrl()};
      if(card&&card.blob){
        const file=new File([card.blob],'zavhoz-card.png',{type:'image/png'});
        if(!navigator.canShare||navigator.canShare({files:[file]}))opts.files=[file];
      }
      await navigator.share(opts);return;
    }
  }catch(e){if(e&&e.name==='AbortError')return}
  if(card&&card.url){const a=document.createElement('a');a.href=card.url;a.download='zavhoz-card.png';document.body.appendChild(a);a.click();a.remove();toast('🖼 Карточка сохранена — отправьте её друзьям!')}
  const full=text+' '+inviteUrl();
  try{await navigator.clipboard.writeText(full);if(!card)toast('📋 Ссылка скопирована — отправьте друзьям!');return}catch(e){}
  try{const ta=document.createElement('textarea');ta.value=full;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();if(!card)toast('📋 Ссылка скопирована — отправьте друзьям!')}catch(e){toast(full)}
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
  $('#mini').hidden=false;setInviteVisible();
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
  $('#mini').hidden=true;setInviteVisible();
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
function setTitle(p){$('#ptitle').textContent={shop:'🛠 Улучшения',bld:'🏛 Здания',quest:'📅 Задания на сегодня',mini:'🎮 Мини-игры',parish:'🕊 Приход',board:'🏅 Таблица мест',ach:'🏆 Достижения · '+achProg(),info:'ℹ️ Об игре'}[p]}
function syncTab(p){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',!!p&&b.dataset.p===p));const bb=$('#boardBtn');if(bb)bb.classList.toggle('on',p==='board')}
function openP(p){closeInvite();panel=p;$('#panel').hidden=false;setTitle(p);renderP(true);syncTab(p);setInviteVisible()}
$('#pclose').onclick=()=>{panel=null;$('#panel').hidden=true;syncTab(null);setInviteVisible()};
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{snd('click');panel===b.dataset.p?$('#pclose').onclick():openP(b.dataset.p)});
function untilMidnight(){const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);return (m-n)/1000}
function statsHtml(){
  return `Время в игре: <b>${fmtT(S.st.play)}</b><br>Всего нажатий: <b>${fmt(S.taps)}</b><br>Лучший доход: <b>${fmtRate(S.st.best)}</b> дел/сек<br>Добрых дел за всё время: <b>${fmt(S.total)}</b><br>В этом приходе: <b>${fmt(S.run)}</b><br>Новых приходов: <b>${S.st.pr}</b> · благословений: <b>${S.bl}</b><br>Поймано праздников: <b>${S.st.ev}</b><br>Выполнено заданий: <b>${S.st.q}</b><br>Сыграно мини-игр: <b>${mgPlayed()}</b><br>Стихов дня: <b>${S.st.verse||0}</b><br>Достижений: <b>${achProg()}</b>`;
}
function prestHtml(){
  const g=blessGain();
  let t='Начните заново с постоянным бонусом: каждое благословение даёт <b>+10%</b> ко всем делам.<br>Сейчас: <b>'+S.bl+'</b> '+blessWord(S.bl)+' (×'+blessMul().toFixed(1).replace('.',',')+').';
  if(canPrestige())t+='<br>Можно получить: <b>+'+g+'</b>';
  else if(S.run<PR_RUN)t+='<br>Откроется после <b>'+fmt(PR_RUN)+'</b> дел в текущем приходе (сейчас '+fmt(S.run)+').';
  else t+='<br>Сделайте ещё больше дел, чтобы получить новое благословение.';
  return t;
}
function renderP(full,opt){
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
      el.querySelector('.inc').textContent=lv?('+'+fmtRate(x.ps*lv*blessMul())+' дел/сек · +'+(x.pp*lv)+' прихожан'+bBonus(x,lv)):(lock?'Сначала: '+BLD[k-1].n:'Ещё не построено');
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
  }else if(panel==='board'){
    if(full){
      const ni0=$('#nickIn');
      const typing=!!(ni0&&document.activeElement===ni0);
      const draft=ni0?ni0.value:null;
      b.innerHTML=boardHtml();bindNickUi();
      const ni=$('#nickIn');
      if(ni&&draft!=null&&(typing||draft!==(S.nick||defaultNick()))){
        ni.value=draft;
        if(typing){try{ni.focus();const n=draft.length;ni.setSelectionRange(n,n)}catch(e){}}
      }
      if(!(opt&&opt.skipFetch))netTop();
    }
  }else if(panel==='parish'){
    if(full){b.innerHTML=parishHtml();const pb=$('#pwBtn');if(pb)pb.onclick=pwClaim}
    else{
      const p=pwEnsure(),bar=b.querySelector('.pwbar i'),btn=$('#pwBtn');
      if(bar)bar.style.width=Math.min(100,p.got/p.need*100)+'%';
      if(btn&&!p.claimed){btn.disabled=p.got<p.need;btn.textContent=p.got>=p.need?'Забрать награду':'Ещё '+fmt(Math.max(0,p.need-p.got))}
    }
  }else if(panel==='ach'){
    if(full)b.innerHTML=ACH.map(a=>`<div class="it ach ${S.ach[a.id]?'ok':''}"><div class="ic">${S.ach[a.id]?'🏆':'🔒'}</div><div class="tx"><b>${a.n}</b><br>${a.d}</div></div>`).join('');
    setTitle('ach');
  }else if(panel==='info'){
    if(full){
      const tg=(k,n)=>`<button class="tg ${S.set[k]?'on':''}" data-k="${k}">${n}: ${S.set[k]?'вкл':'выкл'}</button>`;
      b.innerHTML=`<div class="nickrow info-nick"><label>Ваш ник <input id="nickIn" maxlength="16" value="${esc(S.nick||defaultNick())}" aria-label="Ник" autocomplete="nickname"></label><button type="button" id="nickSave">Сменить ник</button></div>
<div class="it col syncbox"><div class="tx"><b>📱 Играть на другом устройстве</b><br>Откройте эту ссылку на телефоне или компьютере, чтобы войти в этот же аккаунт.</div>
<div class="synclink"><input id="syncIn" readonly value="" placeholder="Сначала создайте ссылку" aria-label="Ссылка для входа с другого устройства"><button type="button" id="syncCopy">Копировать</button></div>
<p class="syncwarn">Не отправляйте эту ссылку другим — это ваш аккаунт.</p>
<button type="button" id="syncMake" class="big">Создать ссылку</button>
<button type="button" id="syncNew">Создать новую ссылку</button></div>
<button id="shareBtn" class="big">📤 Поделиться игрой</button>
<div class="it col"><div class="tx"><b>🙏 Новый приход</b><br><span id="prest">${prestHtml()}</span></div><button id="prBtn" class="warn">Начать новый приход</button></div>
<div class="it col"><div class="tx"><b>⚙️ Настройки</b></div><div class="tgs">${tg('snd','🔊 Звук')}${tg('mus','🎵 Музыка')}${tg('vib','📳 Вибрация')}${tg('tapsnd','🔔 Звук нажатия')}</div>
<div class="vol">🔊 <input id="svol" type="range" min="0" max="100" value="${Math.round((S.set.svol??.8)*100)}" aria-label="Громкость звуков"></div>
<div class="vol">🎵 <input id="mvol" type="range" min="0" max="100" value="${Math.round((S.set.mvol??.45)*100)}" aria-label="Громкость музыки"></div></div>
<div class="it"><div class="tx"><b>📊 Статистика</b><br><span id="statsBox">${statsHtml()}</span></div></div>
<div class="it col"><div class="tx"><b>📖 Истории завхоза</b> · ${Math.min(S.loc+1,LOC.length)}/${LOC.length}</div><div class="stl">${LOC.map((l,i)=>i<=S.loc?`<button class="st" data-i="${i}">${i+1}. ${l.n}</button>`:`<button class="st" disabled>${i+1}. 🔒 ???</button>`).join('')}</div></div>
<div class="it"><div class="tx">Вы — завхоз церкви. Нажимайте на церковь, делайте добрые дела, нанимайте волонтёров и запускайте молодёжку «4.0». К Рождеству и Пасхе церковь наряжается сама, а каждый день вас встречает стих из Писания. Покупайте здания для богослужений и улучшайте их: от молитвенного дома до летнего лагеря.<br><br>Во вкладке «Места» — таблица лучших игроков по добрым делам и счётчик тех, кто играет сейчас. В разделе «Мини-игры» — три испытания по три уровня: уборка в зале, поиск микрофона и помощь бабушке. Каждую игру можно проходить раз в 3 часа. За три звезды сложность растёт, а награда становится больше.<br><br>Каждый день — 3 новых задания с наградой. Ловите праздничные значки на экране: они дают ×7 ко всем делам на 30 секунд. После ${fmt(PR_RUN)} дел можно начать «Новый приход» и получить благословения навсегда.<br><br>Игра сохраняется сама. Пока вас нет, волонтёры трудятся (до 8 часов).<br><br>${VERSES[3]}</div></div>
<button id="reset" style="background:#7a1f1f;width:100%;margin-top:6px">Стереть всё и начать с нуля</button>`;
      $('#shareBtn').onclick=share;bindNickUi();bindSyncUi();
      $('#prBtn').onclick=askPrestige;
      const sv=$('#svol'),mv=$('#mvol');
      if(sv)sv.oninput=()=>{S.set.svol=sv.value/100;S.set.snd=S.set.svol>0?1:0;save()};
      if(mv)mv.oninput=()=>{S.set.mvol=mv.value/100;if(musGain)musGain.gain.value=S.set.mvol;if(bgm)bgm.volume=S.set.mvol;S.set.mus=S.set.mvol>0?1:0;musicSync();save()};

      b.querySelectorAll('.tg').forEach(x=>x.onclick=()=>{const k=x.dataset.k;S.set[k]=S.set[k]?0:1;if(k==='mus')musicSync();if(k==='vib'&&S.set.vib)vib(30);if(k==='tapsnd'&&S.set.tapsnd)playTapClick();save();renderP(true)});
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

// ---------- cross-device sync (secret ?sync= token, never from ?ref=) ----------
function newSecret(n){
  const a=new Uint8Array(n||24);
  if(crypto&&crypto.getRandomValues)crypto.getRandomValues(a);
  else for(let i=0;i<a.length;i++)a[i]=Math.floor(Math.random()*256);
  let bin='';for(let i=0;i<a.length;i++)bin+=String.fromCharCode(a[i]);
  try{return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'')}catch(e){
    return (Date.now().toString(36)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+'xxxxxxxxxxxxxxxx').replace(/[^A-Za-z0-9]/g,'').slice(0,32);
  }
}
function validSecret(s){return typeof s==='string'&&/^[A-Za-z0-9_-]{24,80}$/.test(s)}
function ensureSyncKey(){
  if(!validSecret(S.syncKey)){S.syncKey=newSecret(32);save({keepTime:true})}
  return S.syncKey;
}
function syncUrl(){return validSecret(S.syncToken)?(URL0+'?sync='+S.syncToken):''}
function packSave(){
  S.syncAt=Date.now();
  let raw;
  try{raw=JSON.parse(JSON.stringify(S))}catch(e){return null}
  return raw;
}
function saveSig(s){
  s=s||S;
  try{
    const st=s.st&&typeof s.st==='object'?Object.assign({},s.st):s.st;
    if(st&&typeof st==='object')delete st.play;
    return JSON.stringify({d:Math.floor(safeNum(s.d)),total:Math.floor(safeNum(s.total)),taps:s.taps,u:s.u,b:s.b,nick:s.nick,bl:s.bl,ach:s.ach,run:s.run,mg:s.mg,q:s.q,st});
  }catch(e){return ''}
}
function sanitizeIncomingSave(src,pid){
  let o;
  try{o=JSON.parse(JSON.stringify(src||{}))}catch(e){return null}
  if(!o||typeof o!=='object')return null;
  if(pid)o.pid=pid;
  if(!o.u||typeof o.u!=='object')o.u={};
  if(!o.b||typeof o.b!=='object')o.b={};
  if(!o.ach||typeof o.ach!=='object')o.ach={};
  if(!o.st||typeof o.st!=='object')o.st={play:0,best:0,ev:0,q:0,pr:0};
  if(!o.set||typeof o.set!=='object')o.set={snd:1,mus:1,vib:1,tapsnd:1,svol:.8,mvol:.45};
  o.d=Math.max(0,safeNum(o.d));o.total=Math.max(0,safeNum(o.total));o.run=Math.max(0,safeNum(o.run));
  o.taps=Math.max(0,safeNum(o.taps));
  o.pidAdoptedFixed=1;
  return o;
}
let syncBusy=false,lastPush=0,lastPushSig='',lastHidePush=0;
async function issueSyncToken(rotate){
  ensurePid();ensureSyncKey();
  try{await netPing()}catch(e){}
  const packed=packSave();
  const body={playerId:ensurePid(),syncKey:ensureSyncKey(),rotate:!!rotate,save:packed,syncAt:S.syncAt||Date.now()};
  let j;
  async function issueOnce(){
    return api('/sync/issue',{method:'POST',body:JSON.stringify(body)});
  }
  try{
    j=await issueOnce();
  }catch(e){
    const err=e&&e.body&&e.body.error;
    if(err==='player'){
      try{await netPing()}catch(err2){}
      j=await issueOnce();
    }else if(err==='rate'){
      await new Promise(r=>setTimeout(r,Math.min(8000,Math.max(500,(e.body&&e.body.retry)||2000))));
      j=await issueOnce();
    }else throw e;
  }
  if(!j||!j.token||!validSecret(j.token))throw new Error((j&&j.error)||'token');
  S.syncToken=j.token;save({keepTime:true});
  try{await syncPush(true)}catch(e){}
  return j.token;
}
async function syncPush(force){
  if(netQuiet())return;
  if(!S.syncKey||!S.pid||!validSecret(S.syncKey))return;
  const now=Date.now();
  const sig=saveSig();
  if(sig&&sig===lastPushSig)return;
  if(!force&&lastPush&&now-lastPush<300000)return;
  if(force&&lastHidePush&&now-lastHidePush<60000)return;
  if(syncBusy)return;
  const packed=packSave();if(!packed)return;
  syncBusy=true;
  try{
    let j,attempt=0;
    while(attempt<3){
      try{
        j=await api('/sync/push',{method:'POST',body:JSON.stringify({playerId:S.pid,syncKey:S.syncKey,syncAt:S.syncAt||now,save:packed,force:!!force})});
        break;
      }catch(e){
        if(markQuota(e))break;
        const err=e&&e.body&&e.body.error;
        if((err==='key'||err==='player')&&attempt<2){await new Promise(r=>setTimeout(r,400));attempt++;continue}
        throw e;
      }
    }
    lastPush=now;
    if(force)lastHidePush=now;
    if(j&&j.ok&&!j.older)lastPushSig=sig;
    if(j&&j.older&&j.save&&safeNum(j.syncAt)>safeNum(S.syncAt)+2000)await applyRemoteSave(j.save,j.playerId||S.pid,j.syncAt);
  }catch(e){markQuota(e)}
  finally{syncBusy=false}
}
async function syncPullMerge(){
  if(!S.syncKey||!S.pid||!validSecret(S.syncKey))return false;
  try{
    const j=await api('/sync/pull',{method:'POST',body:JSON.stringify({playerId:S.pid,syncKey:S.syncKey})});
    if(j&&j.ok&&j.save&&safeNum(j.syncAt)>safeNum(S.syncAt)+2000){
      await applyRemoteSave(j.save,j.playerId||S.pid,j.syncAt);
      return true;
    }
  }catch(e){}
  return false;
}
function applyRemoteSave(remote,pid,syncAt){
  const keepSet=S.set;
  const next=sanitizeIncomingSave(remote,pid);
  if(!next)return;
  const keys=Object.keys(S);
  keys.forEach(k=>{if(k!=='set')delete S[k]});
  Object.assign(S,next);
  if(keepSet)S.set=keepSet;
  if(syncAt)S.syncAt=syncAt;
  if(pid)S.pid=pid;
  S.pidAdoptedFixed=1;
  save({keepTime:true});
  try{renderChurch();spawnWalkers();renderInvite();renderLoc();if(panel)renderP(true);$('#deeds').textContent=fmt(S.d);$('#dps').textContent=fmtRate(ps());$('#dpt').textContent=fmtRate(tapVal());$('#people').textContent=fmt(people(S))}catch(e){}
}
async function resumeSync(){
  if(pendingSync)return;
  try{if(S.syncKey)await syncPullMerge()}catch(e){markQuota(e)}
  applyOffline({delay:400});
  if(S.syncKey)syncPush(false);
}
async function askSyncLoad(){
  const tok=pendingSync;
  if(!validSecret(tok)){pendingSync='';applyOffline({delay:300});return}
  try{
    const j=await api('/sync/info?token='+encodeURIComponent(tok));
    if(!j||!j.ok)throw new Error('token');
    const nick=esc(j.nick||'Завхоз');
    modal('📱 <b>Загрузить аккаунт «'+nick+'»?</b><br>Текущий прогресс на этом устройстве будет заменён.',
      [{t:'Загрузить',f:()=>doSyncPull(tok)},{t:'Отмена',cls:'ghost',f:()=>{pendingSync='';applyOffline({delay:200})}}]);
  }catch(e){
    pendingSync='';
    if(isQuotaErr(e)||markQuota(e))toast('Сейчас не получается, попробуйте позже');
    else toast('Ссылка для входа недействительна или устарела');
    applyOffline({delay:200});
  }
}
async function doSyncPull(tok){
  try{
    const j=await api('/sync/pull',{method:'POST',body:JSON.stringify({token:tok})});
    if(!j||!j.ok||!j.save||!j.playerId){toast('Не удалось загрузить аккаунт');return false}
    const keepSet=S.set;
    const next=sanitizeIncomingSave(j.save,j.playerId);
    if(!next){toast('Не удалось загрузить аккаунт');return false}
    if(keepSet)next.set=keepSet;
    next.pid=j.playerId;
    next.pidAdoptedFixed=1;
    if(j.syncAt)next.syncAt=j.syncAt;
    persistLock=true;
    pendingSync='';
    Object.keys(S).forEach(k=>delete S[k]);
    Object.assign(S,next);
    try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){persistLock=false;toast('Не удалось сохранить аккаунт');return false}
    location.reload();
    return false;
  }catch(e){
    persistLock=false;
    if(isQuotaErr(e)||markQuota(e))toast('Сейчас не получается, попробуйте позже');
    else toast('Не удалось загрузить аккаунт');
    return false;
  }
}
function fillSyncUi(){
  const inp=$('#syncIn');if(!inp)return;
  const url=syncUrl();
  inp.value=url;
  const mk=$('#syncMake'),nw=$('#syncNew');
  if(mk)mk.hidden=!!url;
  if(nw)nw.hidden=!url;
}
async function onIssueSync(rotate){
  try{
    if(rotate&&S.syncToken&&!confirm('Старая ссылка перестанет работать. Создать новую?'))return;
    toast(rotate?'Создаю новую ссылку…':'Создаю ссылку…');
    await issueSyncToken(true);
    fillSyncUi();
    toast('Ссылка готова. Не отправляйте её другим.');
  }catch(e){
    const err=e&&e.body&&e.body.error;
    markQuota(e);
    if(err==='rate')toast('Подождите немного и нажмите ещё раз');
    else if(isQuotaErr(e))toast('Сейчас не получается, попробуйте позже');
    else toast('Не удалось создать ссылку. Проверьте интернет.');
  }
}
function bindSyncUi(){
  fillSyncUi();
  const cp=$('#syncCopy');
  if(cp)cp.onclick=async()=>{
    snd('click');
    const url=syncUrl()||($('#syncIn')&&$('#syncIn').value)||'';
    if(!url){toast('Сначала создайте ссылку');return}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(url);
      else{const inp=$('#syncIn');if(inp){inp.focus();inp.select();document.execCommand('copy')}}
      toast('Ссылка скопирована. Не отправляйте её другим.');
    }catch(e){toast('Скопируйте ссылку вручную')}
  };
  const mk=$('#syncMake');if(mk)mk.onclick=()=>{snd('click');onIssueSync(false)};
  const nw=$('#syncNew');if(nw)nw.onclick=()=>{snd('click');onIssueSync(true)};
}

// ---------- offline («Пока вас не было») ----------
const DBL_CD=4*3600*1000;
const OFF_CAP=8*3600;
const OFF_POPUP_SEC=30;
let offModalQueued=false;
function lastAccounted(){
  const t=safeNum(S.t);
  const now=Date.now();
  if(!t||t<=0||t>now+60000)return now;
  return t;
}
function offGainFor(dt){
  dt=Math.min(OFF_CAP,Math.max(0,safeNum(dt)));
  const rate=Math.max(0,safeNum(psBase())*safeNum(offRate()));
  const g=Math.floor(rate*dt);
  return Number.isFinite(g)&&g>0?g:0;
}
function offlineModal(g){
  g=Math.floor(safeNum(g));
  if(g<=0)return;
  const canD=Date.now()-(S.dblT||0)>=DBL_CD;
  const wait=Math.ceil((DBL_CD-(Date.now()-(S.dblT||0)))/60000);
  modal('👋 <b>Пока вас не было: +'+fmt(g)+' дел</b><br>волонтёры сделали<br><span class="big-n">+'+fmt(g)+'</span><br>добрых дел.'+(canD?'':'<br><small>Удвоить можно раз в 4 часа (через '+(wait>=60?Math.floor(wait/60)+' ч '+(wait%60)+' мин':wait+' мин')+').</small>'),
   [{t:'✨ Удвоить ×2',dis:!canD,f:()=>{S.dblT=Date.now();claimOff(g*2)}},{t:'Забрать',cls:'ghost',f:()=>claimOff(g)}]);
}
function claimOff(n){add(n,true);S.offPend=0;offModalQueued=false;S.offN=(S.offN||0)+1;toast('+'+fmt(n)+' добрых дел');snd('buy');save();syncPush(true)}
function showOffModal(g,delay){
  g=Math.floor(safeNum(g));
  if(g<=0||offModalQueued)return;
  offModalQueued=true;
  const go=()=>offlineModal(g);
  if(delay>0)setTimeout(go,delay);else go();
}
function applyOffline(opt){
  opt=opt||{};
  if(pendingSync)return 0;
  const now=Date.now();
  const prev=lastAccounted();
  const dt=Math.min(OFF_CAP,Math.max(0,(now-prev)/1000));
  S.t=now;
  if(typeof last==='number')last=performance.now();
  let fresh=0;
  if(dt>1)fresh=offGainFor(dt);
  if(dt<=OFF_POPUP_SEC){
    if(fresh>0)add(fresh,true);
    save({keepTime:true});
    if(S.offPend>0)showOffModal(S.offPend,opt.delay||0);
    return fresh;
  }
  const g=fresh+safeNum(S.offPend);
  if(g>0){S.offPend=g;save({keepTime:true});showOffModal(g,opt.delay==null?400:opt.delay)}
  else save({keepTime:true});
  return g;
}
// ---------- loop ----------
qCheckDay();
let last=performance.now(),acc=0,evTimer=Date.now()+45000;
if(!pendingSync&&S.tut)applyOffline({delay:800});
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
  if(!mini)tickWalkers(dt);
  acc+=dt;
  $('#deeds').textContent=fmt(S.d);
  if(acc>.25){acc=0;const p=ps();if(p>S.st.best)S.st.best=p;
    $('#dps').textContent=fmtRate(p);$('#dpt').textContent=fmtRate(tapVal());$('#people').textContent=fmt(people(S));
    const bl=$('#blessS');bl.hidden=!S.bl;$('#bless').textContent=S.bl;
    qCheckDay();$('#qdot').hidden=!qReady();$('#mgdot').hidden=!mgAnyReady();
    renderLoc();renderChurch();renderBoost();if(panel)renderP();if(ev)renderEvent();checkAch()}
  requestAnimationFrame(frame);
}
applySeason();
if($('#tskip'))$('#tskip').onclick=()=>{snd('click');closeTutor()};
if($('#tnext'))$('#tnext').onclick=()=>{snd('click');if(tutI<TUTOR.length-1){tutI++;renderTutor()}else closeTutor()};
renderChurch();spawnWalkers();mountBits();startNet();
if($('#live'))$('#live').onclick=()=>{snd('click');panel==='board'?$('#pclose').onclick():openP('board')};
if($('#boardBtn'))$('#boardBtn').onclick=()=>{snd('click');panel==='board'?$('#pclose').onclick():openP('board')};
if($('#inviteBtn'))$('#inviteBtn').onclick=()=>{snd('click');openInvite()};
const ish=$('#ish');if(ish)ish.addEventListener('click',e=>{if(e.target===ish)closeInvite()});
try{ensureBgm();ensureTapAud()}catch(e){}
renderInvite();
if(!S.tut)setTimeout(showTutor,350);
else setTimeout(bootModals,400);
if(pendingSync)setTimeout(askSyncLoad,500);
requestAnimationFrame(frame);
setInterval(save,5000);
setInterval(()=>syncPush(false),300000);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
    save();
    syncPush(true);
    if(AC)try{AC.suspend()}catch(e){};
    if(bgm)try{bgm.pause()}catch(e){};
  }else{
    resumeSync();
    resumeAudio();
  }
});
window.addEventListener('pageshow',()=>{resumeAudio();if(!document.hidden)resumeSync()});
window.addEventListener('pagehide',()=>{save();syncPush(true)});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
window.__game={S,TITLE,API,net,startEvent,openP,spawnBadge,offlineModal,applyOffline,showStory,askPrestige,startMini,closeMini,showTutor,showVerse,showSeasonBonus,applySeason,makeShareCard,pwEnsure,setTime,startRain,stopRain,showZavhoz,spawnEgg,ringBell,spawnWalkers,tickWalkers,setWalkN:n=>{walkForceN=n==null?null:n;spawnWalkers()},getWalkers:()=>walkers.map(w=>({x:w.x,y:w.y,state:w.state,t:w.t,kind:w.kind,item:w.item,op:w.op,side:w.side})),netPing,netScore,netTop,netMeAndClaim,ensurePid,ensureNick,cleanNickClient,saveNick,netNick,refCode,inviteUrl,openInvite,closeInvite,shareInvite,unlockAudio,getAudio:()=>({ac:AC&&AC.state,unlocked:audioUnlocked,bgm:!!(bgm&&!bgm.paused),bgmSrc:bgm&&bgm.src}),syncUrl,issueSyncToken,syncPush,syncPullMerge,askSyncLoad,get pendingSync(){return pendingSync},get ev(){return ev},get badge(){return badge},get mini(){return mini},get season(){return season}};
