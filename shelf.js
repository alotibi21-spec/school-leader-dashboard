/*! لوحة قيادة المدرسة — © 2026 / 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة. */
/* «رف التقدير والتحفيز» — مولّد شهادات، مكتبة عبارات، شهادات جماعية، سجل التكريم (البيانات على الجهاز فقط ضمن DB.shelf) */
const SH_TYPES=[
 {k:'teacher',n:'شكر وتقدير لمعلم',t:'شهادة شكر وتقدير',ic:'🌟',lead:'تتقدّم إدارة المدرسة بخالص الشكر والتقدير إلى',def:'لجهوده المتميزة وعطائه المخلص في خدمة أبنائه الطلبة'},
 {k:'student',n:'تفوق طالب',t:'شهادة تفوق',ic:'🎓',lead:'تمنح إدارة المدرسة هذه الشهادة إلى',def:'لتفوقه الدراسي وتميّزه في التحصيل العلمي'},
 {k:'attend',n:'حضور مثالي',t:'شهادة الحضور المثالي',ic:'⏰',lead:'تمنح إدارة المدرسة هذه الشهادة إلى',def:'لانتظامه وحضوره المثالي وحرصه على الوقت'},
 {k:'init',n:'مبادرة متميزة',t:'شهادة مبادرة متميزة',ic:'💡',lead:'تتقدّم إدارة المدرسة بالشكر والتقدير إلى',def:'لمبادرته المتميزة وأثرها الإيجابي في البيئة المدرسية'},
 {k:'custom',n:'مخصّصة',t:'شهادة شكر وتقدير',ic:'✍️',lead:'تتقدّم إدارة المدرسة بالشكر والتقدير إلى',def:''}];
const SH_PH={
 'المعلمين':['عطاؤك يصنع الفرق، وأثرك باقٍ في عقول طلابك وقلوبهم؛ فشكرًا لك.','شكرًا لمن جعل من الفصل منارة علم، ومن الدرس رحلة شغف.','جهودك المخلصة تُترجم إلى نجاحات نفخر بها جميعًا؛ دمت معطاءً.','المعلم المتميز لا يُعلّم الدرس فحسب، بل يبني الإنسان؛ وأنت كذلك.','تقديرًا لإبداعك في التدريس وحرصك على كل طالب، لك منا أصدق الشكر.','بصمتك التربوية واضحة، وأثرك ممتد؛ شكرًا لعطائك الذي لا ينضب.','نثمّن تفانيك في تحسين نواتج التعلم، ونعتز بك شريكًا في النجاح.','شكرًا لصبرك الجميل، ولكلمتك الطيبة التي تصنع الأمل في طلابك.'],
 'الطلاب':['تفوقك ثمرة جدّك واجتهادك؛ فامضِ نحو القمة بثقة.','أنت مصدر فخر لمدرستك وأسرتك؛ دمت متألقًا متميزًا.','النجاح يبدأ بخطوة، وأنت خطوت بثبات نحو التميز؛ أحسنت.','انضباطك وحرصك قدوة لزملائك؛ بارك الله في جهدك.','كل إنجاز تحققه اليوم لبنة في مستقبلك المشرق؛ واصل التألق.','تقدّمك الملحوظ دليل على إصرارك؛ نفخر بك ونثق بقدرتك.','مبادرتك الرائعة تعكس روحك الإيجابية؛ شكرًا لك يا بطل.','طموحك يصنع الفرق، وعزيمتك تبلغك ما تريد.'],
 'أولياء الأمور':['شكرًا لشراكتكم الفاعلة التي تصنع نجاح أبنائنا.','تعاونكم المستمر مع المدرسة أساس التميز؛ لكم منا وافر التقدير.','حرصكم على متابعة أبنائكم يثمر نجاحًا نلمسه كل يوم.','نعتز بثقتكم ونثمّن دعمكم؛ فأنتم شركاؤنا في بناء الأجيال.','شكرًا لحضوركم ومشاركتكم الفاعلة في مناسبات المدرسة وبرامجها.','بتكاتف البيت والمدرسة تتحقق الأحلام؛ شكرًا لكونكم معنا.','دعمكم المتواصل حافز لنا لتقديم الأفضل لأبنائكم.'],
 'الإداريين':['خلف كل نجاح مدرسي جهود إدارية مخلصة؛ شكرًا لعطائكم.','دقتكم وتنظيمكم يصنعان بيئة تعليمية آمنة ومحفزة؛ دمتم متميزين.','شكرًا لتفانيكم في إنجاز المهام، وحرصكم على جودة العمل.','روح الفريق التي تحملونها هي سرّ تميز مدرستنا؛ لكم كل التقدير.','نثمّن مبادراتكم الإدارية التي يسّرت العمل وارتقت بالأداء.','عملكم الصامت يصنع أثرًا كبيرًا؛ شكرًا لكل لحظة بذلتموها.','إخلاصكم في أداء الأمانة محل اعتزاز وتقدير.','شكرًا لمرونتكم وسرعة استجابتكم التي يسّرت سير اليوم الدراسي.']};
const shE=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let shQ='',shF='',shTab='one';
const shLog=()=>{if(!Array.isArray(DB.shelf))DB.shelf=[];return DB.shelf};
const shType=k=>SH_TYPES.find(t=>t.k===k)||SH_TYPES[0];
const shToday=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function shHijri(s){try{const d=new Date(s+'T12:00:00');return d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-latn',{year:'numeric',month:'long',day:'numeric'})}catch(e){return s}}
function shOpts(sel){return SH_TYPES.map(t=>`<option value="${t.k}" ${t.k===sel?'selected':''}>${t.ic} ${t.n}</option>`).join('')}
function shForm(p,batch){const s=DB.settings||{};return `<div class="sh-grid">
 <label>نوع الشهادة<select id="${p}Type" data-shtype="${p}">${shOpts('teacher')}</select></label>
 <label class="sh-cus" id="${p}CusW" hidden>عنوان الشهادة المخصّص<input id="${p}Cus" placeholder="مثال: شهادة تميّز"></label>
 ${batch?`<label class="sh-wide">الأسماء (اسم في كل سطر)<textarea id="${p}Names" rows="6" placeholder="الاسم الأول&#10;الاسم الثاني&#10;الاسم الثالث"></textarea></label>`:`<label>الاسم<input id="${p}Name" placeholder="اسم المكرَّم"></label>`}
 <label class="sh-wide">السبب / نص التكريم<textarea id="${p}Reason" rows="2">${shE(SH_TYPES[0].def)}</textarea></label>
 <label>التاريخ<input type="date" id="${p}Date" value="${shToday()}"><span class="small muted" id="${p}Hj">${shHijri(shToday())}</span></label>
 <label>اسم قائد المدرسة<input id="${p}Prin" value="${shE(s.principal||'')}" placeholder="اسم القائد/ة"></label>
 <label class="row"><input type="checkbox" id="${p}HjOn" checked> عرض التاريخ بالهجري (أم القرى)</label></div>`}
function shRead(p){const g=id=>{const e=document.getElementById(p+id);return e?e.value.trim():''};const k=g('Type');
 return {type:k,title:k==='custom'?(g('Cus')||'شهادة شكر وتقدير'):shType(k).t,reason:g('Reason'),date:g('Date')||shToday(),prin:g('Prin'),hj:document.getElementById(p+'HjOn').checked,name:g('Name'),names:g('Names')}}
function shCert(c){const s=DB.settings||{},t=shType(c.type),dt=c.hj?shHijri(c.date):c.date;const fem=s.gender==='بنات';
 return `<section class="cert"><div class="cert-in"><div class="cert-c tl"></div><div class="cert-c tr"></div><div class="cert-c bl"></div><div class="cert-c br"></div>
 <header class="cert-hd"><div class="cert-ks">المملكة العربية السعودية<br>وزارة التعليم${s.region?'<br>'+shE(s.region):''}${s.school?'<br>'+shE(s.school):''}</div>${s.logo?`<img class="cert-logo" src="${s.logo}" alt="">`:'<div class="cert-seal">🏅</div>'}<div class="cert-ks l">${s.year?'العام الدراسي<br>'+shE(s.year):''}</div></header>
 <h1 class="cert-t">${shE(c.title||t.t)}</h1><div class="cert-orn">✦ ❖ ✦</div>
 <p class="cert-lead">${shE(t.lead)}</p><div class="cert-name">${shE(c.name)}</div>
 <p class="cert-reason">${shE(c.reason)}</p><p class="cert-wish">${fem?'متمنيةً':'متمنين'} له دوام التوفيق والنجاح</p>
 <footer class="cert-ft"><div><span>التاريخ</span><b>${shE(dt)}</b></div><div class="cert-sig"><span>${fem?'قائدة':'قائد'} المدرسة</span><b>${shE(c.prin||'')}</b><i></i><small>التوقيع</small></div></footer></div></section>`}
function shPrint(list){const pa=document.getElementById('printArea');pa.innerHTML=list.map(shCert).join('');document.body.classList.add('sh-printing');
 const imgs=[...pa.querySelectorAll('img')];Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))).then(()=>setTimeout(()=>window.print(),60))}
addEventListener('afterprint',()=>{if(document.body.classList.contains('sh-printing')){document.body.classList.remove('sh-printing');document.getElementById('printArea').innerHTML=''}});
function shIssue(list,doPrint){const L=shLog(),now=new Date().toISOString();list.forEach(c=>L.push({id:Math.random().toString(36).slice(2,10)+Date.now().toString(36),name:c.name,type:c.type,title:c.title,reason:c.reason,date:c.date,t:now}));
 if(typeof audit==='function')audit('إصدار شهادة','shelf',{title:list.length===1?list[0].name:list.length+' شهادة'});save();
 if(typeof confetti==='function')confetti();toast(list.length===1?'🏅 صدرت الشهادة وحُفظت في سجل التكريم':`🏅 صدرت ${list.length} شهادة وحُفظت في سجل التكريم`);
 shRenderLog();if(doPrint)shPrint(list)}
function shPhrases(){return Object.entries(SH_PH).map(([g,a])=>`<div class="sh-pg"><h4>${g==='المعلمين'?'👩‍🏫':g==='الطلاب'?'🎓':g==='أولياء الأمور'?'👪':'🗂️'} ${g} <span class="pill">${a.length}</span></h4><div class="sh-ph">${a.map(x=>`<button type="button" class="sh-p" data-shcopy="${shE(x)}" title="انسخ العبارة"><span>${shE(x)}</span><i>📋</i></button>`).join('')}</div></div>`).join('')}
function shLogHtml(){const L=shLog(),q=shQ,f=shF;const rows=L.filter(x=>(!f||x.type===f)&&(!q||(x.name+' '+x.reason+' '+x.title).includes(q))).slice().reverse();
 const cnt=SH_TYPES.map(t=>`<button type="button" class="sh-cnt ${f===t.k?'on':''}" data-shf="${t.k}">${t.ic} ${t.n}<b>${L.filter(x=>x.type===t.k).length}</b></button>`).join('');
 return `<div class="sh-cnts"><button type="button" class="sh-cnt ${!f?'on':''}" data-shf="">الكل<b>${L.length}</b></button>${cnt}</div>
 <div class="sh-bar"><input type="search" id="shQ" placeholder="ابحث بالاسم أو السبب…" value="${shE(q)}" aria-label="بحث في السجل"><button class="btn ghost sm" data-shb="csv">⬇️ تصدير CSV</button></div>
 ${rows.length?`<div class="tblw"><table class="sh-tbl"><thead><tr><th>الاسم</th><th>النوع</th><th>السبب</th><th>التاريخ</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${shE(x.name)}</b></td><td>${shE(shType(x.type).ic+' '+(x.type==='custom'?x.title:shType(x.type).n))}</td><td class="small">${shE(x.reason)}</td><td class="small">${shE(shHijri(x.date))}</td><td><button class="btn sm ghost" data-shre="${x.id}" title="إعادة الطباعة">🖨️</button> <button class="btn sm red" data-shdel="${x.id}" title="حذف">🗑️</button></td></tr>`).join('')}</tbody></table></div>`:`<p class="muted">لا توجد شهادات ${L.length?'مطابقة':'مصدرة بعد'}.</p>`}`}
function shRenderLog(){const el=document.getElementById('shLog');if(el){el.innerHTML=shLogHtml();const n=document.getElementById('shTotal');if(n)n.textContent=shLog().length}}
function shelfView(){const total=shLog().length;
 return `<div class="head"><div><h2>رف التقدير والتحفيز 🏅</h2><div class="muted small">شهادات أنيقة جاهزة للطباعة، وعبارات شكر، وسجل للتكريم — كل البيانات محفوظة على هذا الجهاز فقط.</div></div><div class="sh-kpi"><b id="shTotal">${total}</b><span>شهادة صادرة</span></div></div>
 <div class="card sh-card"><div class="sh-tabs" role="tablist"><button class="sh-tab ${shTab==='one'?'on':''}" data-shtab="one">🏅 مولّد الشهادات</button><button class="sh-tab ${shTab==='batch'?'on':''}" data-shtab="batch">📚 شهادات جماعية</button></div>
 <div class="sh-pane" data-pane="one" ${shTab==='one'?'':'hidden'}>${shForm('sh1',false)}<div class="btns"><button class="btn gold" data-shb="one">🏅 إصدار وطباعة / PDF</button><button class="btn ghost" data-shb="prev1">👁️ معاينة</button></div></div>
 <div class="sh-pane" data-pane="batch" ${shTab==='batch'?'':'hidden'}>${shForm('shb',true)}<div class="btns"><button class="btn gold" data-shb="batch">📚 إصدار الكل وطباعة / PDF</button><button class="btn ghost" data-shb="prevb">👁️ معاينة الأولى</button></div><p class="small muted">تُطبع كل شهادة في صفحة مستقلة (A4 أفقي) ضمن ملف واحد؛ اختر «حفظ بصيغة PDF» من نافذة الطباعة.</p></div>
 <div id="shPrev" class="sh-prev" hidden></div></div>
 <details class="card sh-card" open><summary class="sh-sum">💬 مكتبة عبارات الشكر <span class="pill">${Object.values(SH_PH).flat().length}</span> <span class="small muted">— اضغط على العبارة لنسخها</span></summary>${shPhrases()}</details>
 <div class="card sh-card"><h3 class="sh-h3">📜 سجل التكريم</h3><div id="shLog">${shLogHtml()}</div></div>`}
function shCsv(){const L=shLog();const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const h=['الاسم','النوع','عنوان الشهادة','السبب','التاريخ الميلادي','التاريخ الهجري'];
 const body=[h.map(q).join(',')].concat(L.map(x=>[x.name,shType(x.type).n,x.title,x.reason,x.date,shHijri(x.date)].map(q).join(','))).join('\r\n');
 if(typeof download==='function')download('سجل-التكريم-'+shToday()+'.csv','\ufeff'+body,'text/csv;charset=utf-8')}
function shPreview(c){const p=document.getElementById('shPrev');p.hidden=false;p.innerHTML=`<div class="sh-scale">${shCert(c)}</div>`;p.scrollIntoView({behavior:'smooth',block:'nearest'})}
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset)return;
 if(el.dataset.shtype){const p=el.dataset.shtype,t=shType(el.value);document.getElementById(p+'CusW').hidden=el.value!=='custom';const r=document.getElementById(p+'Reason');if(!r.value.trim()||SH_TYPES.some(x=>x.def===r.value.trim()))r.value=t.def}
 if(el.id==='sh1Date'||el.id==='shbDate'){const h=document.getElementById(el.id.replace('Date','Hj'));if(h)h.textContent=shHijri(el.value||shToday())}});
document.addEventListener('input',e=>{if(e.target.id==='shQ'){shQ=e.target.value.trim();const pos=e.target.selectionStart;shRenderLog();const n=document.getElementById('shQ');n.focus();try{n.setSelectionRange(pos,pos)}catch(_){}}});
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-shb],[data-shtab],[data-shcopy],[data-shf],[data-shdel],[data-shre]');if(!t)return;const d=t.dataset;
 if(d.shtab!=null){shTab=d.shtab;document.querySelectorAll('.sh-tab').forEach(b=>b.classList.toggle('on',b.dataset.shtab===shTab));document.querySelectorAll('.sh-pane').forEach(p=>p.hidden=p.dataset.pane!==shTab);document.getElementById('shPrev').hidden=true;return}
 if(d.shcopy!=null){const v=d.shcopy;const ok=()=>{toast('✓ نُسخت العبارة');t.classList.add('done');setTimeout(()=>t.classList.remove('done'),900)};
  if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(v).then(ok,()=>{shFallback(v);ok()});else{shFallback(v);ok()}return}
 if(d.shf!=null){shF=d.shf;shRenderLog();return}
 if(d.shdel){const L=shLog(),i=L.findIndex(x=>x.id===d.shdel);if(i>-1&&confirm('حذف «'+L[i].name+'» من سجل التكريم؟')){L.splice(i,1);save();shRenderLog();toast('حُذف السجل')}return}
 if(d.shre){const x=shLog().find(x=>x.id===d.shre);if(x){const s=DB.settings||{};shPrint([{...x,prin:s.principal||'',hj:true}])}return}
 const a=d.shb;
 if(a==='csv'){if(!shLog().length)return toast('السجل فارغ');shCsv();return}
 if(a==='one'||a==='prev1'){const c=shRead('sh1');if(!c.name){toast('أدخل اسم المكرَّم');document.getElementById('sh1Name').focus();return}if(a==='prev1')return shPreview(c);shIssue([c],true);return}
 if(a==='batch'||a==='prevb'){const c=shRead('shb');const names=[...new Set(c.names.split(/\r?\n/).map(s=>s.trim()).filter(Boolean))];if(!names.length){toast('أدخل الأسماء، اسمًا في كل سطر');document.getElementById('shbNames').focus();return}
  const list=names.map(n=>({...c,name:n,names:undefined}));if(a==='prevb')return shPreview(list[0]);if(list.length>200&&!confirm(list.length+' شهادة؟'))return;shIssue(list,true)}});
function shFallback(v){const ta=document.createElement('textarea');ta.value=v;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(_){}ta.remove()}
