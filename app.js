/*! لوحة قيادة المدرسة — © 2026 / 1448هـ عبدالله خالد العتيبي (Abdullah Khalid Alotaibi). جميع الحقوق محفوظة — All Rights Reserved.
    يُمنع النسخ أو التعديل أو إعادة النشر أو الاستخدام التجاري للكود أو التصميم دون إذن كتابي مسبق. انظر ملف LICENSE. */
'use strict';
const WA_SVG='<svg class="waic" viewBox="0 0 32 32" width="18" height="18" aria-hidden="true"><path fill="#25D366" d="M16 2.9A13 13 0 0 0 4.8 22.6L3 29l6.6-1.7A13 13 0 1 0 16 2.9z"/><path fill="#fff" d="M23.3 19.6c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2l-1.2 1.5c-.2.3-.4.3-.8.1a10.6 10.6 0 0 1-5.3-4.6c-.4-.7.4-.6 1.1-2 .1-.3 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.2 2.7 4.2 6.6 5.9 2.5 1.1 3.5 1.2 4.7 1 .8-.1 2.3-.9 2.6-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5z"/></svg>',CONTACT='للتواصل: 0504153442';
const CREDIT='فكرة وتصميم: عضو الفريق التنفيذي بمحافظة الدوادمي - قطاع السر - عبدالله خالد العتيبي';
const COPYRIGHT='© ١٤٤٨هـ عبدالله خالد العتيبي – جميع الحقوق محفوظة، يُمنع النسخ أو إعادة النشر دون إذن';
const APP_VERSION='1.22.2';
const KEY='sld-data-v1';
const DOMAINS=['الإدارة المدرسية','التعليم والتعلم','نواتج التعلم','البيئة المدرسية'];
const PERIODS=['يومي','أسبوعي','شهري','فصلي','نهاية العام'];
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>iso(new Date());
const addDays=(s,n)=>{const d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return iso(d)};
const parseD=s=>new Date(s+'T00:00:00');
function fmtDate(s,withHijri=true){if(!s)return'—';const d=parseD(s);if(isNaN(d))return esc(s);
  const g=d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{year:'numeric',month:'short',day:'numeric'});
  if(!withHijri)return g;
  let h='';try{h=d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-latn',{year:'numeric',month:'short',day:'numeric'})}catch(e){}
  return g+(h?' <span class="muted small">('+h+')</span>':'')}
function fmtPlain(s){if(!s)return'';const d=parseD(s);if(isNaN(d))return s;let h='';try{h=d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-latn',{year:'numeric',month:'2-digit',day:'2-digit'})}catch(e){}return s+(h?' ('+h+')':'')}

/* ---------- Feminine labels for girls' schools ---------- */
const FEM=[['قائد/مدير','قائدة/مديرة'],['قائد المدرسة','قائدة المدرسة'],['مدير المدرسة','مديرة المدرسة'],['المعلمين','المعلمات'],['المعلمون','المعلمات'],['معلمو','معلمات'],['المدرب','المدربة'],['معلمين','معلمات'],['للمعلمين','للمعلمات'],['المعلم','المعلمة'],['معلم','معلمة'],['للمعلم','للمعلمة'],['الطلاب','الطالبات'],['للطلاب','للطالبات'],['طلاب','طالبات'],['الطالب','الطالبة'],['طالب','طالبة'],['المتفوقين','المتفوقات'],['الموجه الطلابي','الموجهة الطلابية'],['رائد النشاط','رائدة النشاط'],['المكرَّم','المكرَّمة'],['المكلف','المكلفة'],['لمدير المدرسة','لمديرة المدرسة'],['الإداريين','الإداريات'],['للمعلمين','للمعلمات'],['الإداريون','الإداريات'],['ولمدير المدرسة','ولمديرة المدرسة'],['وكلاء','وكيلات'],['وكيل','وكيلة'],['مساعد إداري','مساعدة إدارية'],['رئيس اللجنة','رئيسة اللجنة'],['ولرئيس اللجنة','ولرئيسة اللجنة'],['لرئيس اللجنة','لرئيسة اللجنة'],['الموجه الطلابي','الموجهة الطلابية'],['المرشد الطلابي','المرشدة الطلابية'],['المرشد','المرشدة'],['المستفيدين','المستفيدات'],['الوكلاء','الوكيلات'],['المحتاجين','المحتاجات'],['منسوبين','منسوبات'],['المنسوبين','المنسوبات'],['إداري','إدارية']];
const FEMRX=FEM.map(([a,b])=>[new RegExp('(?<![\u0600-\u06FF])'+a.replace('/','\\/')+'(?![\u0600-\u06FF])','g'),b]);
const isGirls=()=>DB&&DB.settings.gender==='بنات';
const fem=h=>{if(!isGirls())return h;FEMRX.forEach(([r,b])=>h=h.replace(r,b));return h};
const STAGES=['ابتدائي','متوسط','ثانوي'];
const schoolMeta=()=>{const s=DB.settings;return [s.stages&&s.stages.length?'المرحلة: '+s.stages.join(' / '):'',s.gender?'مدرسة '+s.gender:''].filter(Boolean).join(' — ')};
const supLbl=()=>isGirls()?'المشرفة المتابعة للمدرسة':'المشرف المتابع للمدرسة';
const supInfo=()=>{const s=DB.settings;return s.supervisor?supLbl()+': '+s.supervisor+(s.supervisorMobile?' ('+s.supervisorMobile+')':''):''};
const leaderLbl=()=>isGirls()?'قائدة المدرسة':'قائد المدرسة';

/* ---------- Schemas ---------- */
const ST_TASK=['جديدة','قيد التنفيذ','مكتملة','مؤجلة'];
const S={
 tasks:{t:'المهام',one:'مهمة',f:[
  {k:'title',l:'عنوان المهمة',req:1,full:1,max:200},{k:'domain',l:'المجال',type:'select',opts:DOMAINS,req:1},{k:'period',l:'التكرار',type:'select',opts:PERIODS,req:1},
  {k:'due',l:'تاريخ الاستحقاق',type:'date',req:1},{k:'priority',l:'الأولوية',type:'select',opts:['عالية','متوسطة','منخفضة'],def:'متوسطة'},
  {k:'status',l:'الحالة',type:'select',opts:ST_TASK,def:'جديدة'},{k:'owner',l:'المسؤول',def:'مدير المدرسة'},{k:'recur',l:'التكرار التلقائي عند الإنجاز',type:'select',opts:['لا يتكرر','يومي','أسبوعي','شهري','فصلي'],def:'لا يتكرر'},{k:'remind',l:'وقت التذكير (اختياري)',type:'time'},{k:'notes',l:'ملاحظات/شواهد',type:'textarea',full:1}],
  cols:['title','domain','period','due','priority','status'],date:'due'},
 attendance:{t:'حضور الطلاب',one:'سجل حضور',f:[
  {k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'cls',l:'الصف/الفصل',req:1,ph:'مثال: الأول المتوسط / 1'},
  {k:'enrolled',l:'عدد المقيدين',type:'number',req:1,min:1},{k:'absent',l:'عدد الغائبين',type:'number',req:1,min:0},
  {k:'late',l:'عدد المتأخرين',type:'number',min:0,def:0},{k:'excused',l:'غياب بعذر (من الغائبين)',type:'number',min:0,def:0},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['date','cls','enrolled','absent','late','rate'],date:'date'},
 visits:{t:'الزيارات الصفية',one:'زيارة صفية',f:[
  {k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'teacher',l:'المعلم',req:1},{k:'subject',l:'المادة',req:1},{k:'cls',l:'الصف/الفصل'},
  {k:'type',l:'نوع الزيارة',type:'select',opts:['إشرافية','تطويرية','تبادلية','متابعة'],def:'إشرافية'},
  {k:'rating',l:'التقدير العام (1-5)',type:'number',min:1,max:5},{k:'strengths',l:'نقاط القوة',type:'textarea',full:1},{k:'improve',l:'فرص التحسين',type:'textarea',full:1},{k:'followup',l:'التوصيات/المتابعة',type:'textarea',full:1}],
  cols:['date','teacher','subject','cls','type','rating'],date:'date'},
 followups:{t:'متابعة المعلمين',one:'متابعة',f:[
  {k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'teacher',l:'المعلم',req:1},
  {k:'area',l:'مجال المتابعة',type:'select',opts:['التخطيط والتحضير','الواجبات والتقويم','الانضباط والحضور','التطوير المهني','سجلات الطلاب','أخرى'],req:1},
  {k:'domain',l:'المجال',type:'select',opts:DOMAINS,def:'التعليم والتعلم'},{k:'status',l:'الحالة',type:'select',opts:['مفتوحة','قيد المعالجة','مغلقة'],def:'مفتوحة'},{k:'notes',l:'الملاحظات والإجراء',type:'textarea',full:1}],
  cols:['date','teacher','area','status'],date:'date'},
 incidents:{t:'السلوك والحوادث',one:'حالة سلوك/حادثة',f:[
  {k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'student',l:'الطالب/المعني',req:1},{k:'cls',l:'الصف'},
  {k:'type',l:'النوع',type:'select',opts:['مخالفة سلوكية','تأخر متكرر','غياب متكرر','إصابة/حادث','تنمر','سلوك إيجابي','أخرى'],req:1},
  {k:'degree',l:'الدرجة',type:'select',opts:['الأولى','الثانية','الثالثة','الرابعة','الخامسة','لا ينطبق'],def:'لا ينطبق'},
  {k:'status',l:'الحالة',type:'select',opts:['مفتوحة','قيد المعالجة','مغلقة'],def:'مفتوحة'},{k:'action',l:'الإجراء المتخذ',type:'textarea',full:1}],
  cols:['date','student','cls','type','degree','status'],date:'date'},
 meetings:{t:'الاجتماعات والمحاضر',one:'اجتماع',f:[
  {k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'title',l:'عنوان الاجتماع',req:1},
  {k:'type',l:'النوع',type:'select',opts:['مجلس المدرسة','المعلمين','لجنة التميز','الإرشاد','أولياء الأمور','أخرى'],def:'المعلمين'},
  {k:'committee',l:'اللجنة (اختياري)',type:'select',optsFn:()=>['',...DB.committees.map(c=>c.name)]},{k:'domain',l:'المجال',type:'select',opts:DOMAINS,def:'الإدارة المدرسية'},{k:'attendees',l:'الحضور',type:'textarea',full:1},{k:'minutes',l:'المحضر/ما نوقش',type:'textarea',full:1},{k:'decisions',l:'القرارات والتوصيات',type:'textarea',full:1}],
  cols:['date','title','committee','type','domain'],date:'date'},
 events:{t:'تقويم المناسبات',one:'مناسبة/فعالية',f:[
  {k:'title',l:'المناسبة',req:1},{k:'date',l:'التاريخ',type:'date'},{k:'kind',l:'التصنيف',type:'select',opts:['مناسبة وطنية','مناسبة عالمية/توعوية','فعالية مدرسية','اختبارات','إجازة','أخرى'],def:'فعالية مدرسية'},
  {k:'owner',l:'المسؤول'},{k:'status',l:'الحالة',type:'select',opts:['مخطط','منفذ','ملغى'],def:'مخطط'},{k:'notes',l:'ملاحظات/الشواهد',type:'textarea',full:1}],
  cols:['date','title','kind','owner','status'],date:'date'},
 activities:{t:'النشاط الطلابي',one:'نشاط',f:[
  {k:'title',l:'النشاط',req:1},{k:'type',l:'النوع',type:'select',opts:['ثقافي','علمي','رياضي','اجتماعي','فني','تطوعي','كشفي','أخرى'],req:1},
  {k:'date',l:'التاريخ',type:'date',req:1},{k:'owner',l:'المسؤول',req:1},{k:'participants',l:'عدد المشاركين',type:'number',min:0},
  {k:'status',l:'الحالة',type:'select',opts:['مخطط','منفذ','ملغى'],def:'مخطط'},{k:'evidence',l:'الشواهد والملاحظات',type:'textarea',full:1},{k:'report',l:'تقرير النشاط',type:'textarea',full:1}],
  cols:['date','title','type','owner','participants','status'],date:'date'},
 parents:{t:'تواصل أولياء الأمور',one:'تواصل',f:[
  {k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'parent',l:'ولي الأمر',req:1},{k:'student',l:'الطالب'},
  {k:'channel',l:'الوسيلة',type:'select',opts:['زيارة','اتصال','رسالة','اجتماع أولياء أمور','منصة إلكترونية'],def:'اتصال'},
  {k:'topic',l:'الموضوع',req:1},{k:'status',l:'الحالة',type:'select',opts:['مفتوحة','مغلقة'],def:'مغلقة'},{k:'notes',l:'الملخص والإجراء',type:'textarea',full:1}],
  cols:['date','parent','student','channel','topic','status'],date:'date'},
 committees:{t:'اللجان والتكليفات',one:'لجنة/تكليف',f:[
  {k:'name',l:'اسم اللجنة/التكليف',req:1},{k:'kind',l:'النوع',type:'select',opts:['لجنة','تكليف فردي'],def:'لجنة'},{k:'head',l:'الرئيس/المكلف',req:1},
  {k:'members',l:'أسماء الأعضاء',type:'textarea',full:1},{k:'freq',l:'دورية اجتماعات اللجنة',type:'select',optsFn:()=>['','أسبوعي','كل أسبوعين','شهري','اجتماعان على الأقل كل فصل','فصلي','عند الحاجة']},{k:'tasks',l:'مهام/ملاحظات إضافية',type:'textarea',full:1},{k:'date',l:'تاريخ التكليف',type:'date',def:'today'},{k:'end',l:'تاريخ الانتهاء',type:'date'},{k:'status',l:'الحالة',type:'select',opts:['سارية','منتهية'],def:'سارية'}],
  cols:['name','kind','head','date','end','status'],date:'date'},
 duty:{t:'المناوبة والإشراف',one:'مناوبة/إشراف',f:[
  {k:'day',l:'اليوم',type:'select',opts:['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'],req:1},{k:'kind',l:'النوع',type:'select',opts:['مناوبة صباحية','إشراف الفسحة','مناوبة نهاية الدوام','إشراف الصلاة','أخرى'],req:1},
  {k:'staff',l:'المكلف',req:1},{k:'place',l:'الموقع'},{k:'from',l:'من تاريخ',type:'date'},{k:'to',l:'إلى تاريخ',type:'date'},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['day','kind','staff','place','from','to'],date:'from'},
 recognitions:{t:'تكريم المنسوبين',one:'تكريم',f:[
  {k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'name',l:'المكرَّم',req:1},{k:'role',l:'الصفة',type:'select',opts:['معلم','إداري','طالب','ولي أمر','شريك'],def:'معلم'},
  {k:'reason',l:'سبب التكريم',req:1,full:1},{k:'kind',l:'نوع التكريم',type:'select',opts:['شهادة شكر','درع','خطاب شكر','إشادة في الطابور','أخرى'],def:'شهادة شكر'},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['date','name','role','reason','kind'],date:'date'},
 actions:{t:'إجراءات خطة التحسين',one:'إجراء تحسيني',f:[
  {k:'action',l:'الإجراء',req:1,full:1},{k:'domain',l:'المجال',type:'select',opts:DOMAINS,req:1},{k:'owner',l:'المسؤول',req:1},
  {k:'deadline',l:'الموعد النهائي',type:'date',req:1},{k:'status',l:'الحالة',type:'select',opts:['لم يبدأ','قيد التنفيذ','منجز','متعثر'],def:'لم يبدأ'},
  {k:'progress',l:'نسبة الإنجاز %',type:'number',min:0,max:100,def:0},{k:'indicator',l:'مؤشر التحقق',full:1},{k:'evidence',l:'الشواهد',type:'textarea',full:1}],
  cols:['action','domain','owner','deadline','status','progress'],date:'deadline'}
};
const GFIELDS=['سلوكي','تربوي','مهني','وقائي','أسري','نفسي','اجتماعي','صحي','دراسي'];
Object.assign(S,{
 guidance:{t:'برامج التوجيه الطلابي',one:'برنامج توجيه',f:[
  {k:'title',l:'اسم البرنامج',req:1,full:1},{k:'field',l:'المجال',type:'select',opts:GFIELDS,req:1},{k:'date',l:'تاريخ التنفيذ',type:'date',req:1,def:'today'},
  {k:'target',l:'الفئة المستهدفة',req:1,ph:'مثال: طلاب الصف الأول'},{k:'beneficiaries',l:'عدد المستفيدين',type:'number',min:0},{k:'executor',l:'المنفذ',def:'المرشد الطلابي'},
  {k:'objectives',l:'الأهداف',type:'textarea',full:1},{k:'outcome',l:'النتائج والأثر',type:'textarea',full:1}],
  cols:['date','title','field','target','beneficiaries','executor'],date:'date'},
 gcases:{t:'الحالات الفردية والإحالات',one:'حالة فردية',f:[
  {k:'date',l:'تاريخ الفتح',type:'date',req:1,def:'today'},{k:'student',l:'الطالب',req:1},{k:'cls',l:'الصف'},
  {k:'kind',l:'نوع الحالة',type:'select',opts:['دراسية','سلوكية','نفسية','اجتماعية','أسرية','صحية','أخرى'],req:1},
  {k:'referral',l:'الإحالة إلى',type:'select',opts:['لا يوجد','ولي الأمر','وكيل شؤون الطلاب','لجنة التوجيه','الوحدة الصحية','مكتب/إدارة التعليم','جهة خارجية'],def:'لا يوجد'},
  {k:'status',l:'الحالة',type:'select',opts:['مفتوحة','قيد المتابعة','مغلقة'],def:'مفتوحة'},{k:'next',l:'موعد المتابعة القادم',type:'date'},
  {k:'desc',l:'وصف الحالة (بسرية)',type:'textarea',full:1},{k:'action',l:'الإجراءات والمتابعة',type:'textarea',full:1}],
  cols:['date','student','cls','kind','referral','status','next'],date:'date'},
 gplan:{t:'خطة برامج التوجيه',one:'برنامج مخطط',f:[
  {k:'title',l:'البرنامج',req:1,full:1},{k:'field',l:'المجال',type:'select',opts:GFIELDS,req:1},{k:'date',l:'الموعد المخطط',type:'date',req:1},
  {k:'target',l:'الفئة المستهدفة'},{k:'executor',l:'المنفذ',def:'المرشد الطلابي'},{k:'status',l:'الحالة',type:'select',opts:['مخطط','منفذ','مؤجل','ملغى'],def:'مخطط'},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['date','title','field','target','executor','status'],date:'date'}
});
S.oplan={t:'الخطة التشغيلية للمدرسة',one:'بند في الخطة',f:[
  {k:'domain',l:'المجال',type:'select',opts:DOMAINS,req:1},{k:'goal',l:'الهدف',req:1,full:1,max:300},{k:'program',l:'البرنامج/المبادرة',req:1,full:1,max:300},
  {k:'actions',l:'الإجراءات',type:'textarea',full:1},{k:'owner',l:'المسؤول',req:1},{k:'start',l:'تاريخ البداية',type:'date'},{k:'end',l:'تاريخ النهاية',type:'date',req:1},
  {k:'kpi',l:'مؤشر الأداء'},{k:'target',l:'المستهدف'},{k:'status',l:'الحالة',type:'select',opts:['لم يبدأ','قيد التنفيذ','منجز','متعثر'],def:'لم يبدأ'},
  {k:'progress',l:'نسبة الإنجاز %',type:'number',min:0,max:100,def:0},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['domain','goal','program','owner','end','kpi','target','status','progress'],date:'end'};
const PDTYPES=['دورة','ورشة','مجتمع تعلم مهني','زيارة تبادلية','قراءة موجهة','درس تطبيقي','أخرى'];
Object.assign(S,{
 pd:{t:'برامج النمو المهني',one:'برنامج نمو مهني',f:[
  {k:'title',l:'اسم البرنامج',req:1,full:1},{k:'type',l:'النوع',type:'select',opts:PDTYPES,req:1},{k:'date',l:'التاريخ',type:'date',req:1,def:'today'},
  {k:'hours',l:'عدد الساعات',type:'number',min:0,max:500},{k:'count',l:'عدد المستفيدين',type:'number',min:0},{k:'beneficiaries',l:'أسماء المستفيدين',type:'textarea',full:1},
  {k:'provider',l:'الجهة المقدِّمة',ph:'مثال: إدارة التعليم / المدرسة'},{k:'executor',l:'المنفذ/المدرب'},
  {k:'domain',l:'المجال',type:'select',opts:DOMAINS,def:'التعليم والتعلم'},{k:'status',l:'الحالة',type:'select',opts:['مخطط','منفذ','ملغى'],def:'منفذ'},{k:'impact',l:'الأثر والملاحظات',type:'textarea',full:1}],
  cols:['date','title','type','hours','count','provider','status'],date:'date'},
 pdplan:{t:'خطة النمو المهني',one:'احتياج/برنامج مخطط',f:[
  {k:'title',l:'البرنامج/الاحتياج التدريبي',req:1,full:1},{k:'type',l:'النوع',type:'select',opts:PDTYPES,req:1},{k:'target',l:'الفئة المستهدفة',ph:'مثال: معلمو الرياضيات'},
  {k:'date',l:'الموعد المخطط',type:'date',req:1},{k:'hours',l:'الساعات المخططة',type:'number',min:0,max:500},{k:'owner',l:'المسؤول'},
  {k:'status',l:'الحالة',type:'select',opts:['مخطط','منفذ','مؤجل','ملغى'],def:'مخطط'},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['date','title','type','target','hours','owner','status'],date:'date'}
});
const EXAREAS=[['nafs','الاختبارات الوطنية (نافس)','📊'],['qiyas','اختبار القدرات والتحصيلي','🎯'],['intl','الاختبارات الدولية (TIMSS، PIRLS، PISA…)','🌍']];
const EXL=EXAREAS.map(a=>a[1]);const exArea=k=>EXAREAS.find(a=>a[0]===k);const exKey=l=>(EXAREAS.find(a=>a[1]===l)||[])[0];
Object.assign(S,{
 exmeet:{t:'اجتماعات الاختبارات',one:'اجتماع اختبارات',f:[
  {k:'area',l:'المجال',type:'select',opts:EXL,req:1},{k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'title',l:'جدول الأعمال/الموضوع',req:1,full:1},
  {k:'attendees',l:'الحضور',type:'textarea',full:1},{k:'minutes',l:'المحضر',type:'textarea',full:1},{k:'decisions',l:'القرارات والتوصيات',type:'textarea',full:1}],
  cols:['date','area','title'],date:'date'},
 exact:{t:'إجراءات وبرامج الاختبارات',one:'إجراء/برنامج',f:[
  {k:'area',l:'المجال',type:'select',opts:EXL,req:1},{k:'date',l:'التاريخ',type:'date',req:1,def:'today'},{k:'title',l:'الإجراء/البرنامج',req:1,full:1},
  {k:'type',l:'النوع',type:'select',opts:['برنامج إعداد وتهيئة','اختبار تجريبي','تحليل نتائج','خطة علاجية/إثرائية','ورشة للمعلمين','توعية أولياء الأمور','أخرى'],def:'برنامج إعداد وتهيئة'},
  {k:'target',l:'الفئة المستهدفة',ph:'مثال: طلاب الصف الثالث المتوسط'},{k:'count',l:'عدد المستفيدين',type:'number',min:0},{k:'owner',l:'المسؤول/المنفذ'},
  {k:'status',l:'الحالة',type:'select',opts:['مخطط','منفذ','ملغى'],def:'منفذ'},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['date','area','title','type','target','status'],date:'date'},
 exres:{t:'نتائج الاختبارات',one:'نتيجة',f:[
  {k:'area',l:'المجال',type:'select',opts:EXL,req:1},{k:'title',l:'الاختبار',req:1,ph:'مثال: نافس – الرياضيات'},{k:'year',l:'العام الدراسي',ph:'مثال: 1447هـ'},
  {k:'grade',l:'الصف/الفئة'},{k:'subject',l:'المادة/المجال'},{k:'score',l:'النتيجة',ph:'كما وردت في التقرير الرسمي'},{k:'level',l:'المستوى/التصنيف'},
  {k:'date',l:'تاريخ صدور النتيجة',type:'date'},{k:'notes',l:'ملاحظات وتحليل',type:'textarea',full:1}],
  cols:['year','area','title','grade','subject','score','level'],date:'date'}
});
/* ---------- Shared: base64url + compression ---------- */
const b64u={enc:u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')},
 dec:t=>{t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const s=atob(t),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}};
async function packJSON(o){const u=new TextEncoder().encode(JSON.stringify(o));if(window.CompressionStream){try{const z=new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());return 'z.'+b64u.enc(z)}catch(e){}}return 'j.'+b64u.enc(u)}
async function unpackJSON(t){const [p,d]=[t.slice(0,2),t.slice(2)];let u=b64u.dec(d);if(p==='z.'){u=new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}else if(p!=='j.')throw new Error('bad');return JSON.parse(new TextDecoder().decode(u))}

/* ---------- Impact measurement (قياس الأثر) ---------- */
const IMP_N=3;
function impInds(x){const r=[];for(let i=1;i<=IMP_N;i++){const n=String(x['i'+i+'n']||'').trim();if(!n)continue;const num=v=>v===''||v==null||isNaN(+v)?null:+v;
 const b=num(x['i'+i+'b']),t=num(x['i'+i+'t']),a=num(x['i'+i+'a']),low=x['i'+i+'d']==='الأقل أفضل';let p=null;
 if(a!=null&&t!=null){if(b==null||b===t)p=(low?a<=t:a>=t)?100:Math.max(0,Math.round((low?t/Math.max(a,1e-9):a/Math.max(t,1e-9))*100));else p=Math.max(0,Math.round((low?(b-a)/(b-t):(a-b)/(t-b))*100))}
 r.push({n,u:x['i'+i+'u']||'',b,t,a,low,p})}return r}
function impScore(x){const m=impInds(x).filter(i=>i.p!=null);return m.length?Math.round(m.reduce((s,i)=>s+Math.min(100,i.p),0)/m.length):null}
const impLevel=p=>p==null?'لم يُقس بعد':p>=85?'مرتفع':p>=60?'متوسط':'منخفض';
const impCls=l=>l==='مرتفع'?'green':l==='متوسط'?'amber':l==='منخفض'?'red':'gray';
function impOpps(x){const o=[];impInds(x).forEach(i=>{if(i.p==null)o.push(`استكمال قياس مؤشر «${i.n}» بعد التنفيذ وتسجيل القيمة المتحققة.`);else if(i.p<85)o.push(`مؤشر «${i.n}»: المتحقق ${i.a}${i.u?' '+i.u:''} مقابل المستهدف ${i.t}${i.u?' '+i.u:''} (نسبة التحقق ${i.p}%) — يُقترح مراجعة آليات التنفيذ وتكثيف الإجراءات الداعمة وإعادة القياس.`)});
 if(!impInds(x).length)o.push('تحديد مؤشرات قياس (القيمة الأساسية والمستهدفة) قبل التنفيذ.');String(x.opp||'').split('\n').map(s=>s.trim()).filter(Boolean).forEach(s=>o.push(s));return o}
const impLinkOpts=()=>['',...DB.guidance.map(x=>'التوجيه الطلابي: '+itemTitle('guidance',x)),...DB.pd.map(x=>'النمو المهني: '+itemTitle('pd',x)),...DB.exact.map(x=>'الاختبارات: '+itemTitle('exact',x)),...DB.activities.map(x=>'النشاط الطلابي: '+itemTitle('activities',x)),...DB.committees.map(c=>'اللجان: '+comName(c)),...DB.oplan.map(x=>'الخطة التشغيلية: '+itemTitle('oplan',x))].filter((v,i,a)=>a.indexOf(v)===i);
const IMPF=[];for(let i=1;i<=IMP_N;i++)IMPF.push({k:'h'+i,l:'المؤشر '+i+(i===1?' (يُحدَّد قبل التنفيذ)':' (اختياري)'),type:'head'},{k:'i'+i+'n',l:'اسم المؤشر',full:1,req:i===1?1:0,ph:i===1?'مثال: نسبة الطلاب المتقنين لمهارات القراءة':''},{k:'i'+i+'u',l:'الوحدة',ph:'% / درجة / عدد'},{k:'i'+i+'d',l:'اتجاه التحسن',type:'select',opts:['الأعلى أفضل','الأقل أفضل'],def:'الأعلى أفضل'},{k:'i'+i+'b',l:'القيمة الأساسية (قبل)',type:'number',dec:1},{k:'i'+i+'t',l:'القيمة المستهدفة',type:'number',dec:1,req:i===1?1:0},{k:'i'+i+'a',l:'القيمة المتحققة (بعد)',type:'number',dec:1});
Object.assign(S,{impact:{t:'قياس الأثر',one:'برنامج/مبادرة لقياس أثرها',f:[
  {k:'title',l:'البرنامج/المبادرة/النشاط',req:1,full:1},{k:'kind',l:'النوع',type:'select',opts:['برنامج','مبادرة','نشاط','مشروع'],def:'برنامج'},
  {k:'link',l:'مرتبط بـ (اختياري)',type:'select',optsFn:impLinkOpts},{k:'domain',l:'المجال',type:'select',opts:DOMAINS,def:'التعليم والتعلم'},{k:'owner',l:'المسؤول'},
  {k:'start',l:'بداية التنفيذ',type:'date',def:'today'},{k:'end',l:'موعد القياس البعدي',type:'date'},{k:'target_grp',l:'الفئة المستهدفة'},
  {k:'goal',l:'الأهداف',type:'textarea',full:1,req:1},...IMPF,
  {k:'h9',l:'التوثيق والمتابعة',type:'head'},{k:'status',l:'الحالة',type:'select',opts:['مخطط (قبل التنفيذ)','قيد التنفيذ','تم القياس'],def:'مخطط (قبل التنفيذ)'},
  {k:'opp',l:'فرص تحسين إضافية (سطر لكل فرصة)',type:'textarea',full:1},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['start','title','kind','domain','status','_ach','_lvl'],date:'start',
  vl:{_ach:'نسبة تحقق المؤشرات',_lvl:'مستوى الأثر'},
  vc:{_ach:(x,h)=>{const p=impScore(x);return p==null?'—':h?`<div class="bar" style="min-width:70px"><i style="width:${p}%"></i></div><span class="small">${p}%</span>`:p+'%'},_lvl:(x,h)=>{const l=impLevel(impScore(x));return h?`<span class="pill ${impCls(l)}">${l}</span>`:l}}}});
function impHowto(){return `<details class="card howto" ${DB.impact.length?'':'open'}><summary><b>📘 تعليمات الاستخدام — قياس الأثر</b></summary><ol class="offl" style="list-style:decimal">
 <li><b>أضف البرنامج:</b> اضغط «＋ إضافة» واكتب اسم البرنامج أو المبادرة أو النشاط ونوعه والمسؤول، ويمكنك ربطه بسجل قائم (برنامج توجيه، نمو مهني، إجراء اختبارات، لجنة…).</li>
 <li><b>قبل التنفيذ:</b> حدِّد الأهداف ومؤشرات القياس (حتى ${IMP_N} مؤشرات) لكل مؤشر: القيمة الأساسية الحالية، والقيمة المستهدفة، واتجاه التحسن (الأعلى أفضل أو الأقل أفضل)، والحالة «مخطط».</li>
 <li><b>بعد التنفيذ:</b> افتح «تعديل» وسجِّل القيمة المتحققة لكل مؤشر، وغيِّر الحالة إلى «تم القياس».</li>
 <li><b>أرفق الشواهد:</b> زر 📎 في كل سجل (كشوف النتائج، الصور، التقارير)، وملفات القسم العامة في أعلى الصفحة.</li>
 <li><b>اطّلع على المقارنة:</b> تُحسب نسبة التحقق آلياً لكل مؤشر = (المتحقق − الأساسي) ÷ (المستهدف − الأساسي)، ويُحدَّد مستوى الأثر: <span class="pill green">مرتفع</span> 85% فأكثر، <span class="pill amber">متوسط</span> 60–84%، <span class="pill red">منخفض</span> أقل من 60%.</li>
 <li><b>اطبع التقرير:</b> زر «طباعة» في البطاقة أو «التقارير والتصدير ← قياس الأثر» لعرض مستوى الأثر وفرص التحسين المقترحة آلياً (مع إمكانية إضافة فرصك).</li></ol>
 <div class="small" style="background:var(--bg);border-radius:10px;padding:10px;margin-top:6px"><b>مثال:</b> برنامج «القراءة المكثفة» للصف الثالث — المؤشر: نسبة الطلاب المتقنين للقراءة الجهرية — الأساسي 55% — المستهدف 80% — المتحقق بعد التنفيذ 75% ⇐ نسبة التحقق <bdi dir="ltr" style="unicode-bidi:isolate">(75 − 55) ÷ (80 − 55) = 80%</bdi> ⇐ أثر <b>متوسط</b>، وفرصة التحسين: تكثيف الحصص العلاجية للطلاب غير المتقنين وإعادة القياس.</div></details>`}
function impCards(){if(!DB.impact.length)return'';return `<div class="comgrid">${DB.impact.map(x=>{const p=impScore(x),l=impLevel(p),ind=impInds(x);
 return `<div class="comcard" style="border-top-color:var(--${impCls(l)==='green'?'ok':impCls(l)==='red'?'bad':impCls(l)==='amber'?'warn':'line'})"><div class="row"><b class="grow">📈 ${esc(x.title)}</b>${chip(l,impCls(l))}</div>
 <div class="small muted">${esc(x.kind||'')}${x.link?' — '+esc(x.link):''}</div>
 ${ind.map(i=>`<div class="small" style="margin-top:6px"><div class="row"><span class="grow">${esc(i.n)}</span><span class="muted">${i.b??'—'} ← ${i.a??'؟'} / ${i.t??'—'}${i.u?' '+esc(i.u):''}</span></div><div class="row"><div class="bar grow"><i style="width:${Math.min(100,i.p||0)}%"></i></div><b>${i.p==null?'—':i.p+'%'}</b></div></div>`).join('')}
 <div class="row" style="margin-top:8px"><b class="grow">${p==null?'لم يُقس بعد':'نسبة التحقق '+p+'%'}</b>${evBtn('impact',x.id)}<button class="btn sm ghost" data-act="edit" data-c="impact" data-id="${x.id}">تعديل</button><button class="btn sm ghost" data-act="impprint" data-id="${x.id}">طباعة</button></div></div>`}).join('')}</div>`}
function impPrintOne(x){const ind=impInds(x),p=impScore(x),l=impLevel(p);
 return `<section><h3>${esc(x.title)} — مستوى الأثر: ${l}${p!=null?' ('+p+'%)':''}</h3><p class="small">${esc(x.kind||'')}${x.link?' — مرتبط بـ: '+esc(x.link):''}${x.owner?' — المسؤول: '+esc(x.owner):''}${x.start?' — البداية: '+fmtPlain(x.start):''}${x.end?' — القياس البعدي: '+fmtPlain(x.end):''}</p>
 ${x.goal?`<p><b>الأهداف:</b> <span style="white-space:pre-line">${esc(x.goal)}</span></p>`:''}
 <table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>المؤشر</th><th>الاتجاه</th><th>القيمة الأساسية</th><th>المستهدف</th><th>المتحقق</th><th>نسبة التحقق</th></tr>${ind.map(i=>`<tr><td>${esc(i.n)}${i.u?' ('+esc(i.u)+')':''}</td><td>${i.low?'الأقل أفضل':'الأعلى أفضل'}</td><td>${i.b??''}</td><td>${i.t??''}</td><td>${i.a??''}</td><td>${i.p==null?'—':i.p+'%'}</td></tr>`).join('')}</table>
 <p><b>فرص التحسين (مقترحة آلياً — للمراجعة):</b></p><ul>${impOpps(x).map(o=>`<li>${esc(o)}</li>`).join('')}</ul>${evPrint('impact',x.id)?`<p><b>الشواهد:</b></p>${evPrint('impact',x.id)}`:''}</section>`}
function impPrint(id){const rows=id?DB.impact.filter(x=>x.id===id):DB.impact;let h=printHead(id?'تقرير قياس أثر':'تقرير قياس الأثر',id?(rows[0]||{}).title||'':rows.length+' برنامج/مبادرة');
 if(!id){const c={};rows.forEach(x=>{const l=impLevel(impScore(x));c[l]=(c[l]||0)+1});h+=`<section><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr>${['مرتفع','متوسط','منخفض','لم يُقس بعد'].map(l=>`<th>${l}</th>`).join('')}</tr><tr>${['مرتفع','متوسط','منخفض','لم يُقس بعد'].map(l=>`<td>${c[l]||0}</td>`).join('')}</tr></table></section>`}
 return h+rows.map(impPrintOne).join('')+(id?'':secPrint('impact'))}

/* ---------- Surveys (الاستبانات) ---------- */
const SV_GROUPS=['الطلاب','أولياء الأمور','المعلمين','الإداريين','أخرى'];
const LIK=['','غير موافق بشدة','غير موافق','محايد','موافق','موافق بشدة'];
const QT={mc:'اختيار من متعدد',likert:'مقياس ليكرت (1–5)',yn:'نعم / لا',text:'نص حر'};
Object.assign(S,{evals:{t:'تحليل نتائج التقويم المدرسي',one:'تقويم',f:[
  {k:'type',l:'نوع التقويم',type:'select',opts:['تقويم ذاتي','تقويم خارجي'],req:1},{k:'date',l:'تاريخ التقويم',type:'date',def:'today',req:1},{k:'year',l:'العام الدراسي',defFn:()=>DB.settings.year||'',max:40},
  {k:'overall',l:'النسبة العامة %',type:'number',dec:1,min:0,max:100},{k:'cls',l:'التصنيف (كما ورد في التقرير)',max:120,listFn:()=>[...new Set(DB.evals.map(x=>x.cls).filter(Boolean))]},
  {k:'hd',l:'نسب المجالات (كما وردت في التقرير)',type:'head'},
  {k:'d1',l:'الإدارة المدرسية %',type:'number',dec:1,min:0,max:100},{k:'d2',l:'التعليم والتعلم %',type:'number',dec:1,min:0,max:100},{k:'d3',l:'نواتج التعلم %',type:'number',dec:1,min:0,max:100},{k:'d4',l:'البيئة المدرسية %',type:'number',dec:1,min:0,max:100},
  {k:'weak',l:'المؤشرات الأضعف',type:'rows',full:1,rc:[{k:'code',l:'رمز المؤشر',w:'7em'},{k:'text',l:'نص المؤشر'},{k:'pct',l:'النسبة %',num:1,w:'6em'}]},
  {k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['date','type','year','overall','_wd','cls'],date:'date',vl:{_wd:'المجال الأضعف'},
  vc:{overall:(x,h)=>evNum(x.overall)==null?'—':x.overall+'%',_wd:(x,h)=>{const w=evGaps(x).find(o=>o.weak);return w?w.d+' ('+w.v+'%)':'—'}}}});
Object.assign(S,{plans:{t:'الخطط العلاجية',one:'خطة علاجية',f:[
  {k:'date',l:'التاريخ',type:'date',def:'today'},{k:'domain',l:'المجال',type:'select',opts:DOMAINS},{k:'problem',l:'المشكلة',type:'textarea',full:1,req:1},{k:'causes',l:'الأسباب',type:'textarea',full:1},{k:'target',l:'الهدف (قابل للقياس)',type:'textarea',full:1},
  {k:'acts',l:'الإجراءات (الإجراء — المسؤول — الموعد)',type:'rows',full:1,rc:[{k:'a',l:'الإجراء'},{k:'o',l:'المسؤول',w:'8em'},{k:'d',l:'الموعد',w:'9.5em',date:1}]},
  {k:'measure',l:'طريقة القياس',type:'textarea',full:1},{k:'evidence',l:'الشواهد',type:'textarea',full:1}],cols:['date','problem','domain','target'],date:'date'},
 heatv:{t:'قيم الخريطة الحرارية',one:'قيمة',f:[
  {k:'metric',l:'المقياس',type:'select',opts:['نسبة الغياب %','متوسط الاختبار','مخصص'],req:1},{k:'custom',l:'اسم المقياس المخصص (عند اختيار «مخصص»)',max:80,listFn:()=>[...new Set(DB.heatv.map(x=>x.custom).filter(Boolean))]},
  {k:'row',l:'الفصل/المادة',req:1,max:80,listFn:()=>[...new Set([...DB.heatv.map(x=>x.row),...DB.attendance.map(x=>x.cls)].filter(Boolean))]},{k:'period',l:'الفترة (مثل: محرم 1448 أو الأسبوع 3)',req:1,max:60,listFn:()=>[...new Set(DB.heatv.map(x=>x.period).filter(Boolean))]},
  {k:'value',l:'القيمة',type:'number',dec:1,req:1},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],cols:['metric','custom','row','period','value']},
 journal:{t:'اليوميات (التقرير الصوتي)',one:'يومية',f:[{k:'date',l:'التاريخ',type:'date',def:'today'},{k:'text',l:'الملاحظة',type:'textarea',full:1,req:1},{k:'items',l:'التصنيف',type:'textarea',full:1}],cols:['date','text'],date:'date'},
 drills:{t:'سجل تمارين الإخلاء',one:'تمرين',f:[{k:'date',l:'التاريخ',type:'date',def:'today',req:1},{k:'kind',l:'نوع التمرين',type:'select',opts:['إخلاء','أخرى'],def:'إخلاء'},{k:'duration',l:'المدة (دقيقة)',type:'number',dec:1,min:0},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],cols:['date','kind','duration','notes'],date:'date'}});
Object.assign(S,{honors:{t:'لوحة الشرف',one:'مكرَّم',f:[
  {k:'date',l:'التاريخ (أي يوم من الشهر)',type:'date',def:'today',req:1},{k:'cat',l:'الفئة',type:'select',optsFn:()=>HON_CATS(),req:1},{k:'name',l:'الاسم (أو الفصل)',req:1,max:120},
  {k:'reason',l:'سبب التكريم',type:'textarea',full:1},{k:'notes',l:'ملاحظات',type:'textarea',full:1}],
  cols:['date','cat','name','reason'],date:'date'},
 inits:{t:'بنك المبادرات',one:'مبادرة مخصصة',f:[
  {k:'title',l:'المبادرة',req:1,max:200},{k:'domain',l:'المجال',type:'select',opts:DOMAINS,req:1},{k:'desc',l:'وصف مختصر',type:'textarea',full:1}],
  cols:['title','domain','desc']}});
Object.assign(S,{surveys:{t:'الاستبانات',one:'استبانة',f:[
  {k:'title',l:'عنوان الاستبانة',req:1,full:1},{k:'group',l:'الفئة المستهدفة',type:'select',opts:SV_GROUPS,req:1},{k:'target',l:'عدد المستهدفين',type:'number',min:0,max:100000},
  {k:'date',l:'تاريخ البدء',type:'date',def:'today',req:1},{k:'end',l:'تاريخ الإغلاق',type:'date'},{k:'phone',l:'رقم واتساب لاستقبال الردود (اختياري)',ph:'9665xxxxxxxx'},
  {k:'status',l:'الحالة',type:'select',opts:['مسودة','منشورة','مغلقة'],def:'مسودة'},{k:'domain',l:'المجال',type:'select',opts:DOMAINS,def:'الإدارة المدرسية'},
  {k:'intro',l:'مقدمة للمستجيبين',type:'textarea',full:1,ph:'مثال: نشكر مشاركتكم، ولا يُطلب ذكر الاسم.'}],
  cols:['date','title','group','status','_n','_rate'],date:'date',vl:{_n:'عدد الردود',_rate:'نسبة الاستجابة'},
  vc:{_n:x=>String((x.resp||[]).length),_rate:(x,h)=>{const r=svRate(x);return r==null?'—':h?`<div class="bar" style="min-width:70px"><i style="width:${Math.min(100,r)}%"></i></div><span class="small">${r}%</span>`:r+'%'}}}});
const svRate=s=>+s.target>0?Math.round((s.resp||[]).length/(+s.target)*100):null;
const svQs=s=>(s.q=Array.isArray(s.q)?s.q:[]);
function svAnalyze(s){const R=s.resp||[],n=R.length,rate=svRate(s);const qs=svQs(s).map(q=>{const vals=R.map(r=>r.a&&r.a[q.id]).filter(v=>v!==undefined&&v!==null&&v!=='');const o={q,cnt:vals.length};
  if(q.type==='likert'){const nums=vals.map(Number).filter(v=>v>=1&&v<=5);o.dist=[5,4,3,2,1].map(k=>[LIK[k],nums.filter(v=>v===k).length]);o.mean=nums.length?Math.round(nums.reduce((a,b)=>a+b,0)/nums.length*100)/100:null;o.agree=nums.length?Math.round(nums.filter(v=>v>=4).length/nums.length*100):null}
  else if(q.type==='yn'){o.dist=[['نعم',vals.filter(v=>v==='نعم').length],['لا',vals.filter(v=>v==='لا').length]];o.yes=vals.length?Math.round(o.dist[0][1]/vals.length*100):null}
  else if(q.type==='mc'){const m={};(q.o||[]).forEach(x=>m[x]=0);vals.forEach(v=>String(v).split(/\s*[;؛]\s*/).forEach(x=>{if(x)m[x]=(m[x]||0)+1}));o.dist=Object.entries(m).sort((a,b)=>b[1]-a[1])}
  else o.texts=vals.map(String);return o});
 const lk=qs.filter(o=>o.mean!=null),idx=lk.length?Math.round(lk.reduce((a,o)=>a+o.mean,0)/lk.length*100)/100:null;
 const recs=[];if(!n)recs.push({k:'info',t:'لا توجد ردود بعد — شارك رابط الاستبانة ثم استورد الردود.'});
 if(n&&n<5)recs.push({k:'info',t:`عدد الردود قليل (${n}) — تُعدّ النتائج استرشادية.`});
 if(rate!=null&&n&&rate<50)recs.push({k:'imp',t:`نسبة الاستجابة ${rate}% أقل من 50% — يُقترح تذكير الفئة المستهدفة وتمديد مدة الاستبانة قبل تعميم النتائج.`,q:'رفع نسبة الاستجابة لاستبانة '+s.title});
 qs.forEach(o=>{const t=o.q.t;if(o.mean!=null){if(o.mean<3)recs.push({k:'imp',t:`«${t}»: المتوسط ${o.mean} من 5 — مجال يحتاج إلى تحسين؛ يُقترح دراسة أسبابه ووضع إجراء في خطة التحسين.`,q:t});else if(o.mean<3.5)recs.push({k:'watch',t:`«${t}»: المتوسط ${o.mean} من 5 — يحتاج إلى متابعة.`,q:t});else if(o.mean>=4)recs.push({k:'str',t:`«${t}»: المتوسط ${o.mean} من 5 — نقطة قوة يُقترح تعزيزها.`})}
  if(o.yes!=null&&o.cnt){if(o.yes<50)recs.push({k:'imp',t:`«${t}»: ${100-o.yes}% أجابوا «لا» — يُقترح معالجة هذا الجانب.`,q:t});else if(o.yes>=80)recs.push({k:'str',t:`«${t}»: ${o.yes}% أجابوا «نعم» — نقطة قوة.`})}
  if(o.q.type==='mc'&&o.cnt&&o.dist.length){const [a,b]=o.dist[0];recs.push({k:'info',t:`«${t}»: الخيار الأكثر اختياراً «${a}» (${Math.round(b/o.cnt*100)}%).`})}});
 return {n,rate,idx,qs,recs}}
const RECK={imp:['🔻 مجال تحسين','red'],watch:['⚠️ متابعة','amber'],str:['✅ نقطة قوة','green'],info:['ℹ️ معلومة','gray']};
function hbars(dist,tot){const mx=Math.max(1,...dist.map(d=>d[1]));return `<div class="hb">${dist.map(([l,v])=>`<div class="hbr"><span class="hbl">${esc(l)}</span><span class="hbt"><i style="width:${Math.round(v/mx*100)}%"></i></span><span class="hbv">${v}${tot?' ('+Math.round(v/tot*100)+'%)':''}</span></div>`).join('')}</div>`}
function svAnalysisHTML(s,print){const A=svAnalyze(s);
 let h=`<div class="chips" style="margin-bottom:8px">${chip('📨 '+A.n+' رد','blue')}${chip('🎯 نسبة الاستجابة: '+(A.rate==null?'— (حدِّد عدد المستهدفين)':A.rate+'%'),A.rate==null?'gray':A.rate>=50?'green':'amber')}${A.idx!=null?chip('📊 المؤشر العام (ليكرت): '+A.idx+' / 5',A.idx>=3.5?'green':A.idx>=3?'amber':'red'):''}</div>`;
 h+=A.qs.map((o,i)=>`<div class="svq"><b>${i+1}. ${esc(o.q.t)}</b> <span class="small muted">(${QT[o.q.type]} — ${o.cnt} إجابة${o.mean!=null?' — المتوسط '+o.mean+' — الموافقة '+o.agree+'%':''})</span>
  ${o.dist?hbars(o.dist,o.cnt):`<ul class="small">${(o.texts||[]).slice(0,print?100:30).map(t=>`<li>${esc(t)}</li>`).join('')||'<li class="muted">لا إجابات</li>'}</ul>`}</div>`).join('');
 h+=`<h3>التوصيات المقترحة آلياً <span class="small muted">(اقتراحات تحتاج إلى مراجعة ${fem('قائد المدرسة')} قبل اعتمادها)</span></h3><ul class="recs">${A.recs.map((r,i)=>`<li><span class="pill ${RECK[r.k][1]}">${RECK[r.k][0]}</span> ${esc(r.t)}${!print&&r.k==='imp'?` <button class="btn sm ghost" data-act="sv2act" data-id="${s.id}" data-c="${i}">＋ خطة التحسين</button>`:''}</li>`).join('')}</ul>`;return h}
function svHowto(){return `<details class="card howto" ${DB.surveys.length?'':'open'}><summary><b>📘 تعليمات الاستخدام — الاستبانات</b></summary><ol class="offl" style="list-style:decimal">
 <li>أنشئ استبانة («＋ إضافة»)، ثم افتحها وأضف الأسئلة: اختيار من متعدد، ليكرت 1–5، نعم/لا، نص حر.</li>
 <li>اضغط «إنشاء رابط الاستبانة» وأرسل الرابط عبر واتساب أو انسخه أو اعرض رمز QR. الأسئلة محفوظة داخل الرابط نفسه، ولا تُرفع بيانات المدرسة إلى أي خادم.</li>
 <li>يفتح المستجيب الرابط ويجيب، ثم يضغط «إرسال الرد عبر واتساب» فيصلك رمز قصير يبدأ بـ SLDj.</li>
 <li>انسخ رسائل الردود (أو صدّر محادثة واتساب كملف نصي) والصقها في «استيراد الردود» — تُستخرج الرموز آلياً ويُتجاهل المكرر.</li>
 <li>بديل: إن جمعت الردود عبر Google Forms أو Microsoft Forms فصدّرها CSV/Excel واستوردها هنا للتحليل الآلي.</li>
 <li>اطّلع على التحليل (التوزيعات، المتوسطات، نسبة الاستجابة) والتوصيات المقترحة، وأضف مجالات التحسين إلى خطة التحسين، واطبع التقرير.</li></ol></details>`}
function svCards(){if(!DB.surveys.length)return'';return `<div class="comgrid">${DB.surveys.map(s=>{const A=svAnalyze(s);return `<a class="comcard" href="#survey?${s.id}"><div class="row"><b class="grow">📋 ${esc(s.title)}</b>${chip(esc(s.status||'مسودة'),s.status==='منشورة'?'green':s.status==='مغلقة'?'gray':'amber')}</div>
 <div class="small muted">${esc(s.group||'')} — ${svQs(s).length} سؤال</div><div class="chips" style="margin-top:6px">${chip('📨 '+A.n+' رد','blue')}${A.idx!=null?chip('📊 '+A.idx+'/5','gray'):''}${A.recs.filter(r=>r.k==='imp').length?chip(A.recs.filter(r=>r.k==='imp').length+' مجال تحسين','red'):''}</div>
 ${A.rate!=null?`<div class="row small" style="margin-top:6px"><span>الاستجابة</span><div class="bar grow"><i style="width:${Math.min(100,A.rate)}%"></i></div><b>${A.rate}%</b></div>`:''}</a>`}).join('')}</div>`}
let svLink={};
function surveyView(id){const s=DB.surveys.find(x=>x.id===id);if(!s)return '<div class="card empty">الاستبانة غير موجودة. <a href="#surveys">العودة</a></div>';const qs=svQs(s),nR=(s.resp||[]).length;
 const qrow=(q,i)=>`<div class="svb" data-qi="${i}"><div class="row"><b>${i+1}.</b><select data-svq="${s.id}|${q.id}|type" aria-label="نوع السؤال">${Object.entries(QT).map(([k,l])=>`<option value="${k}" ${q.type===k?'selected':''}>${l}</option>`).join('')}</select>
  <span class="grow"></span><button class="btn sm ghost" data-act="svmv" data-id="${s.id}" data-c="${q.id}|-1" aria-label="أعلى">▲</button><button class="btn sm ghost" data-act="svmv" data-id="${s.id}" data-c="${q.id}|1" aria-label="أسفل">▼</button><button class="btn sm ghost" data-act="svqdel" data-id="${s.id}" data-c="${q.id}" aria-label="حذف">🗑️</button></div>
  <input data-svq="${s.id}|${q.id}|t" value="${esc(q.t||'')}" placeholder="نص السؤال" maxlength="300" style="width:100%;margin-top:6px">
  ${q.type==='mc'?`<textarea data-svq="${s.id}|${q.id}|o" placeholder="الخيارات (سطر لكل خيار)" style="width:100%;margin-top:6px;min-height:70px">${esc((q.o||[]).join('\n'))}</textarea>`:q.type==='likert'?`<div class="small muted">${LIK.slice(1).reverse().join(' — ')}</div>`:q.type==='yn'?'<div class="small muted">نعم — لا</div>':'<div class="small muted">إجابة نصية قصيرة</div>'}</div>`;
 return `<div class="head"><div><a href="#surveys" class="small">→ الاستبانات</a><h2>📋 ${esc(s.title)}</h2><div class="muted small">${esc(s.group||'')} — ${chip(esc(s.status||'مسودة'),'gray')} — ${qs.length} سؤال — ${nR} رد${s.target?' من '+s.target+' مستهدف':''}</div></div>
 <div class="btns"><button class="btn gold" data-act="edit" data-c="surveys" data-id="${s.id}">تعديل البيانات</button>${evBtn('surveys',s.id)}<button class="btn ghost" data-act="svprint" data-id="${s.id}">طباعة التقرير</button></div></div>
 <div class="card"><h3>① الأسئلة</h3>${nR?'<div class="small" style="color:var(--warn)">تنبيه: توجد ردود مستوردة؛ تعديل الأسئلة لا يغيّر الردود السابقة، والرابط القديم يبقى بأسئلته القديمة.</div>':''}
  ${qs.map(qrow).join('')||'<div class="empty">لا توجد أسئلة بعد — أضف السؤال الأول</div>'}
  <div class="btns" style="margin-top:8px">${Object.entries(QT).map(([k,l])=>`<button class="btn sm ghost" data-act="svqadd" data-id="${s.id}" data-c="${k}">＋ ${l}</button>`).join('')}</div></div>
 <div class="card"><h3>② الإرسال</h3><p class="small muted">الأسئلة تُحفظ داخل الرابط نفسه، ولا تُرفع بيانات المدرسة إلى أي خادم. يصلك كل رد كرمز قصير عبر واتساب.</p>
  <div class="btns"><button class="btn gold" data-act="svlink" data-id="${s.id}" ${qs.length?'':'disabled'}>🔗 إنشاء رابط الاستبانة</button></div>
  <div id="svShare">${svLink[s.id]?svShareHTML(s,svLink[s.id]):''}</div></div>
 <div class="card"><h3>③ استيراد الردود</h3>
  <textarea id="svPaste" placeholder="الصق هنا رسالة رد أو أكثر (أو محادثة واتساب كاملة) — تُستخرج الرموز SLDj. آلياً" style="width:100%;min-height:90px"></textarea>
  <div class="btns" style="margin-top:6px"><button class="btn gold" data-act="svpaste" data-id="${s.id}">استيراد الرموز الملصقة</button><button class="btn ghost" data-act="svfile" data-id="${s.id}">📂 ملف: محادثة واتساب (.txt) أو Google/Microsoft Forms (CSV/Excel)</button>${nR?`<button class="btn ghost red" data-act="svclear" data-id="${s.id}">حذف جميع الردود (${nR})</button>`:''}</div>
  <details class="small" style="margin-top:8px"><summary>استخدام Google Forms أو Microsoft Forms بدلاً من الرابط</summary><ol style="list-style:decimal;padding-inline-start:22px;line-height:1.9">
  <li>أنشئ النموذج بالأسئلة نفسها (يُفضّل نص السؤال مطابقاً). لأسئلة ليكرت استخدم خيارات: موافق بشدة، موافق، محايد، غير موافق، غير موافق بشدة (أو 1–5).</li>
  <li>بعد جمع الردود: Google Forms ← الردود ← تنزيل CSV (أو ربط بجدول ثم تنزيل Excel). Microsoft Forms ← الردود ← فتح في Excel.</li>
  <li>اضغط زر «📂 ملف» أعلاه واختر الملف. إن كانت الاستبانة بلا أسئلة تُنشأ الأسئلة آلياً من عناوين الأعمدة، وإلا تُطابق الأعمدة مع نصوص الأسئلة.</li></ol></details></div>
 <div class="card"><h3>④ التحليل والتوصيات</h3>${svAnalysisHTML(s,false)}</div>`}
function svShareHTML(s,url){const msg=`${s.title}\n${DB.settings.school||''}\nنأمل التكرم بتعبئة الاستبانة عبر الرابط:\n${url}`;let qr='';
 try{if(window.qrcode&&url.length<=2300){const q=qrcode(0,url.length>1200?'L':'M');q.addData(url);q.make();qr=`<div class="svqr">${q.createSvgTag({cellSize:3,margin:2,scalable:true})}</div>`}else qr='<div class="small muted">الرابط طويل على رمز QR — استخدم مشاركة الرابط (قلّل الأسئلة أو اختصر نصوصها لإظهار الرمز).</div>'}catch(e){qr=''}
 return `<div class="row" style="margin-top:8px"><input id="svUrl" readonly value="${esc(url)}" style="flex:1;min-width:0;direction:ltr"><button class="btn sm" data-act="svcopy">نسخ</button></div>
 <div class="btns" style="margin-top:6px"><a class="btn gold" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg)}">مشاركة عبر واتساب</a><a class="btn ghost" target="_blank" rel="noopener" href="${esc(url)}">معاينة كمستجيب</a></div>${qr}
 <div class="small muted">طول الرابط ${url.length} حرفاً.</div>`}
async function svBuildLink(s){const st=DB.settings;const p={v:1,i:s.id,t:s.title,s:st.school||'',g:isGirls()?1:0,gr:fem(s.group||''),n:s.intro||'',e:s.end||'',ph:String(s.phone||'').replace(/\D/g,''),q:svQs(s).filter(q=>q.t).map(q=>q.type==='mc'?[q.id,q.type,q.t,q.o||[]]:[q.id,q.type,q.t])};
 return new URL('survey.html',location.href.split('#')[0]).href+'#'+await packJSON(p)}
async function svImportCodes(text){const codes=[...new Set(String(text).match(/SLDj\.[jz]\.[A-Za-z0-9_-]{8,}/g)||[])];let add=0,dup=0,other=0,bad=0;
 for(const c of codes){try{const o=await unpackJSON(c.slice(5));const s=DB.surveys.find(x=>x.id===o.i);if(!s){other++;continue}s.resp=s.resp||[];if(s.resp.some(r=>r.r===o.r)){dup++;continue}
  s.resp.push({r:String(o.r),at:o.at||today(),a:o.a||{},src:'link'});add++}catch(e){bad++}}
 if(add){audit('استيراد ردود استبانة','surveys',{title:add+' رد'});save()}return {codes:codes.length,add,dup,other,bad}}
const LIKMAP={'موافق بشدة':5,'موافق':4,'محايد':3,'غير موافق':2,'غير موافق بشدة':1,'strongly agree':5,'agree':4,'neutral':3,'disagree':2,'strongly disagree':1,'أوافق بشدة':5,'أوافق':4,'لا أوافق':2,'لا أوافق بشدة':1};
const ynNorm=v=>{v=String(v).trim().toLowerCase();return /^(نعم|yes|y|true|صح)$/.test(v)?'نعم':/^(لا|no|n|false|خطأ)$/.test(v)?'لا':null};
const likNorm=v=>{const t=String(v).trim();if(/^[1-5]$/.test(t))return +t;const k=LIKMAP[t.toLowerCase()];return k||null};
async function svImportForms(s,file){let rows;if(/\.(xlsx|xls|ods)$/i.test(file.name)){const X=await loadXLSX();const wb=X.read(await file.arrayBuffer(),{cellDates:true});rows=X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:false,defval:''})}else rows=parseCSV(await file.text());
 rows=rows.filter(r=>r.some(c=>String(c).trim()));if(rows.length<2)throw new Error('الملف لا يحتوي على ردود');const H=rows[0].map(h=>String(h).trim()),data=rows.slice(1);
 const META=/timestamp|الطابع الزمني|التوقيت|^id$|^المعرف|start time|completion time|وقت البدء|وقت الإكمال|email|البريد|^name$|^الاسم$|last modified/i;const nz=t=>String(t).replace(/[\s\u200f\u200e]+/g,' ').replace(/[؟?:.]+$/,'').trim();
 const cols=[];let created=0;const qs=svQs(s);
 H.forEach((h,ci)=>{if(!h||META.test(h))return;let q=qs.find(x=>nz(x.t)===nz(h))||qs.find(x=>nz(h).includes(nz(x.t))||nz(x.t).includes(nz(h)));
  if(!q&&!qs.length||(!q&&s._autoQ)){const vals=data.map(r=>r[ci]).filter(v=>String(v).trim());let type='text';
   if(vals.length&&vals.every(v=>likNorm(v)))type='likert';else if(vals.length&&vals.every(v=>ynNorm(v)))type='yn';else if(!/اقتراح|ملاحظ|رأي|رأيك|تعليق|اذكر|اكتب|comment|suggest|why|لماذا/i.test(h)&&vals.length&&vals.reduce((x,v)=>x+String(v).length,0)/vals.length<=25&&new Set(vals).size<=Math.max(8,Math.ceil(vals.length/3)))type='mc';
   q={id:'q'+(s.qn=(s.qn||0)+1),type,t:h};if(type==='mc')q.o=[...new Set(vals.flatMap(v=>String(v).split(/\s*[;؛]\s*/)))].slice(0,20);s._autoQ=1;created++;s.q.push(q)}
  if(q)cols.push([ci,q])});delete s._autoQ;
 s.resp=s.resp||[];let add=0,dup=0;const tsi=H.findIndex(h=>/timestamp|الطابع الزمني|completion time|وقت الإكمال/i.test(h));
 data.forEach(r=>{const key='f'+hashStr(r.join('|'));if(s.resp.some(x=>x.r===key)){dup++;return}const a={};
  cols.forEach(([ci,q])=>{const v=r[ci];if(v==null||String(v).trim()==='')return;if(q.type==='likert'){const n=likNorm(v);if(n)a[q.id]=n}else if(q.type==='yn'){const y=ynNorm(v);if(y)a[q.id]=y}else a[q.id]=String(v).trim()});
  s.resp.push({r:key,at:normDate(tsi>=0?r[tsi]:'')||today(),a,src:'forms'});add++});
 audit('استيراد ردود Forms','surveys',{title:s.title+' — '+add+' رد'});save();return {add,dup,created,matched:cols.length,skipped:H.filter(Boolean).length-cols.length}}
function hashStr(t){let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
function svPrint(id){const ss=id?DB.surveys.filter(x=>x.id===id):DB.surveys;let h=printHead(id?'تقرير استبانة':'تقرير الاستبانات',id?(ss[0]||{}).title||'':ss.length+' استبانة');
 if(!id)h+=`<section>${ptable('surveys',ss)}</section>`;
 ss.forEach(s=>{h+=`<section><h2>${esc(s.title)}</h2><p class="small">الفئة: ${esc(s.group||'')} — الفترة: ${fmtPlain(s.date)}${s.end?' — '+fmtPlain(s.end):''} — الحالة: ${esc(s.status||'')}</p>${svAnalysisHTML(s,true)}</section>`;const ef=evPrint('surveys',s.id);if(ef)h+=`<section><h3>الشواهد</h3>${ef}</section>`});
 return h+(id?'':secPrint('surveys'))}



/* ---------- تحليل نتائج التقويم المدرسي (manual entry; no thresholds or weights invented — only differences of entered numbers) ---------- */
const EVD=['d1','d2','d3','d4'];
const evNum=v=>v===''||v==null||!Number.isFinite(+v)?null:+v;
const evR=v=>Math.round(v*10)/10;
const evSorted=()=>DB.evals.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.created||'').localeCompare(b.created||''));
const evLatest=()=>{const a=evSorted();return a[a.length-1]||null};
function evDoms(x){return DOMAINS.map((d,i)=>({d,v:evNum(x[EVD[i]])}))}
function evGaps(x){const ds=evDoms(x),have=ds.filter(o=>o.v!=null);const mx=have.length?Math.max(...have.map(o=>o.v)):null,mn=have.length?Math.min(...have.map(o=>o.v)):null;
 return ds.map(o=>({...o,g100:o.v==null?null:evR(100-o.v),gTop:o.v==null||mx==null?null:evR(mx-o.v),weak:o.v!=null&&have.length>1&&o.v===mn&&mn!==mx,top:o.v!=null&&have.length>1&&o.v===mx&&mn!==mx}))}
function evWeak(x){return (Array.isArray(x.weak)?x.weak:[]).filter(w=>w&&(w.code||w.text)).map((w,i)=>({...w,p:evNum(w.pct),i})).sort((a,b)=>(a.p==null)-(b.p==null)||(a.p??0)-(b.p??0)||a.i-b.i)}
function evBars(rows,opt={}){/* rows:[{l,v,cls}] horizontal bars 0..100, labels on the right */const nar=!opt.print&&innerWidth<600,W=nar?360:560,lh=nar?30:34,H=rows.length*lh+24,lab=nar?118:150,bw=W-lab-(nar?44:60);
 return `<svg class="evsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opt.aria||'رسم بياني')}" preserveAspectRatio="xMidYMid meet">${[0,25,50,75,100].map(t=>{const xx=W-lab-bw*t/100;return `<line x1="${xx}" y1="4" x2="${xx}" y2="${H-18}" class="evgrid"/><text x="${xx}" y="${H-4}" class="evtick" text-anchor="middle">${t}</text>`}).join('')}
 ${rows.map((r,i)=>{const y=8+i*lh,w=r.v==null?0:bw*Math.max(0,Math.min(100,r.v))/100;return `<text x="${W-4}" y="${y+17}" class="evlab" text-anchor="end">${esc(r.l)}</text><rect x="${W-lab-w}" y="${y+3}" width="${w}" height="20" rx="4" class="evbar ${r.cls||''}"/><text x="${W-lab-w-6}" y="${y+18}" class="evval" text-anchor="end">${r.v==null?'—':r.v+'%'}</text>`}).join('')}</svg>`}
function evGroupBars(a,b){/* self vs external per domain */const rows=[];DOMAINS.forEach((d,i)=>{rows.push({l:d+' — ذاتي',v:evNum(a[EVD[i]]),cls:'s'});rows.push({l:'خارجي',v:evNum(b[EVD[i]]),cls:'e'})});return evBars(rows,{aria:'مقارنة التقويم الذاتي والخارجي'})}
function evLine(list){const pts=list.filter(x=>evNum(x.overall)!=null);if(pts.length<2)return'';const W=560,H=170,p=34,n=pts.length,vs=pts.map(x=>+x.overall),lo=Math.max(0,Math.floor((Math.min(...vs)-5)/5)*5),hi=Math.min(100,Math.ceil((Math.max(...vs)+5)/5)*5)||100;
 const X=i=>W-p-(W-2*p)*(n===1?0:i/(n-1)),Y=v=>H-p-(H-2*p)*((v-lo)/((hi-lo)||1));
 return `<svg class="evsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="تطور النسبة العامة"><line x1="${p}" y1="${H-p}" x2="${W-p}" y2="${H-p}" class="evgrid"/><text x="${W-4}" y="${Y(hi)+4}" class="evtick" text-anchor="end">${hi}</text><text x="${W-4}" y="${Y(lo)+4}" class="evtick" text-anchor="end">${lo}</text>
 <polyline fill="none" class="evln" points="${pts.map((x,i)=>X(i)+','+Y(+x.overall)).join(' ')}"/>${pts.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(+x.overall)}" r="5" class="evpt ${x.type==='تقويم خارجي'?'e':'s'}"/><text x="${X(i)}" y="${Y(+x.overall)-10}" class="evval" text-anchor="middle">${+x.overall}%</text><text x="${X(i)}" y="${H-p+16}" class="evtick" text-anchor="middle">${esc((x.date||'').slice(0,7))}</text>`).join('')}</svg>`}
const evSel=()=>{const id=flt.evsel;return DB.evals.find(x=>x.id===id)||evLatest()};
function evPair(x){if(!x||!x.year)return null;const same=evSorted().filter(y=>y.year===x.year);const s=same.filter(y=>y.type==='تقويم ذاتي').pop(),e=same.filter(y=>y.type==='تقويم خارجي').pop();return s&&e?{s,e}:null}
const evD=v=>v==null?'—':'<bdi dir="ltr">'+(v>0?'+':v<0?'\u2212':'')+evR(Math.abs(v))+'</bdi>';
function evHowto(){return `<details class="card howto" ${DB.evals.length?'':'open'}><summary><b>📘 تعليمات الاستخدام — تحليل نتائج التقويم المدرسي</b></summary><ol class="offl" style="list-style:decimal">
 <li><b>أضف التقويم:</b> اضغط «＋ إضافة» واختر النوع (تقويم ذاتي / تقويم خارجي) والتاريخ والعام الدراسي، ثم انقل من تقرير التقويم النسبة العامة ونسب المجالات الأربعة والتصنيف كما وردت فيه.</li>
 <li><b>أضف المؤشرات الأضعف:</b> في «المؤشرات الأضعف» اكتب رمز المؤشر ونصه ونسبته إن وُجدت، واضغط «＋ إضافة مؤشر» لكل مؤشر.</li>
 <li><b>أرفق التقرير:</b> زر 📎 لحفظ ملف التقرير (PDF) شاهداً على هذا الجهاز.</li>
 <li><b>اقرأ التحليل:</b> يحسب القسم الفجوة = 100 − نسبة المجال، والفرق عن أقوى مجال، ويُبرز المجال الأضعف، ويرتّب المؤشرات الأضعف أولويات (الأقل نسبة أولاً). لا يضيف القسم أي أوزان أو حدود رسمية؛ كل الحسابات فروق بين الأرقام التي تُدخلها.</li>
 <li><b>أرسل الأولويات:</b> «إرسال إلى خطة التحسين» ينشئ لكل مؤشر إجراءً مقترحاً في «إجراءات خطة التحسين» وبرنامجاً في «قياس الأثر» (القيمة الأساسية = نسبة المؤشر)، لتكمل المسؤول والموعد والقيمة المستهدفة.</li>
 <li><b>قارن وتابع:</b> عند وجود تقويم ذاتي وخارجي للعام نفسه تظهر المقارنة والفرق لكل مجال، ويعرض «السجل» تغيّر النسب عبر التقويمات. اطبع التقرير من زر «طباعة التحليل».</li></ol></details>`}
function evAnalysis(x,print){if(!x)return'';const g=evGaps(x),wk=evWeak(x),wd=g.find(o=>o.weak);
 const tbl=`<div class="tbl-wrap"><table class="evt" border="1" cellspacing="0" cellpadding="4"><tr><th>المجال</th><th>النسبة</th><th>الفجوة إلى <bdi>100%</bdi></th><th>الفرق عن أقوى مجال</th></tr>${g.map(o=>`<tr class="${o.weak?'evweak':''}"><td>${o.weak?'⚠️ ':o.top?'⭐ ':''}${esc(o.d)}</td><td>${o.v==null?'—':o.v+'%'}</td><td>${o.g100==null?'—':o.g100}</td><td>${o.gTop==null?'—':o.gTop}</td></tr>`).join('')}</table></div>`;
 const pr=wk.length?`<ol class="evpri">${wk.map(w=>`<li><b><bdi dir="ltr">${esc(w.code||'')}</bdi></b> ${esc(w.text||'')}${w.p!=null?` — <b>${w.p}%</b> (الفجوة ${evR(100-w.p)})`:''}</li>`).join('')}</ol>`:'<p class="small muted">لم تُسجَّل مؤشرات أضعف لهذا التقويم.</p>';
 return `<div class="evhead"><b>${esc(x.type||'')}</b> — ${esc(fmtPlain(x.date))}${x.year?' — العام '+esc(x.year):''}${evNum(x.overall)!=null?` — النسبة العامة <b>${+x.overall}%</b>`:''}${x.cls?` — التصنيف: <b>${esc(x.cls)}</b>`:''}</div>
 ${evBars(g.map(o=>({l:o.d,v:o.v,cls:o.weak?'w':o.top?'t':''})),{aria:'نسب المجالات'})}
 ${wd?`<p class="evnote">المجال الأضعف: <b>${esc(wd.d)}</b> (${wd.v}%) — الفجوة إلى 100%: ${wd.g100}، والفرق عن أقوى مجال: ${wd.gTop}.</p>`:''}${tbl}
 <h4 style="margin:12px 0 4px">الأولويات (المؤشرات الأضعف مرتبة من الأقل نسبة)</h4>${pr}${x.notes?`<p class="small"><b>ملاحظات:</b> <span style="white-space:pre-line">${esc(x.notes)}</span></p>`:''}${print&&evPrint('evals',x.id)?`<p><b>الشواهد:</b></p>${evPrint('evals',x.id)}`:''}`}
function evCompare(pp){if(!pp)return'';const{s,e}=pp;const rows=[['النسبة العامة',evNum(s.overall),evNum(e.overall)],...DOMAINS.map((d,i)=>[d,evNum(s[EVD[i]]),evNum(e[EVD[i]])])];
 return `<div class="tbl-wrap"><table class="evt" border="1" cellspacing="0" cellpadding="4"><tr><th>المجال</th><th>التقويم الذاتي (${esc(fmtPlain(s.date))})</th><th>التقويم الخارجي (${esc(fmtPlain(e.date))})</th><th>الفرق (خارجي − ذاتي)</th></tr>${rows.map(([l,a,b])=>`<tr><td>${esc(l)}</td><td>${a==null?'—':a+'%'}</td><td>${b==null?'—':b+'%'}</td><td><b>${a==null||b==null?'—':evD(b-a)}</b></td></tr>`).join('')}</table></div>`}
function evHistory(){const a=evSorted();if(!a.length)return'';let prev=null;
 return `<div class="tbl-wrap"><table class="evt evh" border="1" cellspacing="0" cellpadding="4"><tr><th>التاريخ</th><th>النوع</th><th>العام</th><th>النسبة العامة</th>${DOMAINS.map(d=>`<th>${esc(d)}</th>`).join('')}</tr>${a.map(x=>{const cell=(k)=>{const v=evNum(x[k]),p=prev?evNum(prev[k]):null;return `<td>${v==null?'—':v+'%'}${v!=null&&p!=null?` <span class="small ${v>p?'up':v<p?'down':''}">(${evD(v-p)})</span>`:''}</td>`};const r=`<tr><td>${esc(fmtPlain(x.date))}</td><td>${esc(x.type||'')}</td><td>${esc(x.year||'')}</td>${cell('overall')}${EVD.map(cell).join('')}</tr>`;prev=x;return r}).join('')}</table></div><p class="small muted">بين القوسين: التغيّر عن التقويم السابق في الجدول.</p>`}
function evView(){if(!DB.evals.length)return evHowto();const x=evSel(),pp=evPair(x),a=evSorted();
 return evHowto()+`<div class="card evcard"><div class="row" style="flex-wrap:wrap;gap:8px"><h3 class="grow" style="margin:0">📊 تحليل التقويم</h3>
 <select data-evsel aria-label="اختر التقويم">${a.slice().reverse().map(y=>`<option value="${y.id}" ${y.id===x.id?'selected':''}>${esc((y.type||'')+' — '+fmtPlain(y.date)+(y.year?' — '+y.year:''))}</option>`).join('')}</select></div>
 ${evAnalysis(x)}<div class="btns" style="margin-top:10px"><button class="btn gold" data-act="evsend" data-id="${x.id}" ${evWeak(x).length?'':'disabled'}>🎯 إرسال إلى خطة التحسين</button>${evBtn('evals',x.id)}<button class="btn ghost" data-act="edit" data-c="evals" data-id="${x.id}">تعديل</button><button class="btn ghost" data-act="evprint" data-id="${x.id}">🖨️ طباعة التحليل</button></div></div>
 ${pp?`<div class="card"><h3>⚖️ مقارنة التقويم الذاتي والخارجي — العام ${esc(x.year)}</h3>${evGroupBars(pp.s,pp.e)}<div class="small muted evlegend"><span class="lg s"></span> ذاتي <span class="lg e"></span> خارجي</div>${evCompare(pp)}</div>`:''}
 ${a.length>1?`<div class="card"><h3>📈 سجل التقويمات وتطور النسب</h3>${evLine(a)}${evHistory()}</div>`:''}`}
function evSend(id){const x=DB.evals.find(y=>y.id===id);if(!x)return;const wk=evWeak(x);if(!wk.length)return;const wd=evGaps(x).find(o=>o.weak);
 const tag=w=>'eval:'+x.id+':'+(w.code||w.text);const fresh=wk.filter(w=>!DB.actions.some(a=>a.src===tag(w))&&!DB.impact.some(a=>a.src===tag(w)));
 if(!fresh.length){toast('أُرسلت هذه الأولويات سابقاً');return}
 if(!confirm(`سيُضاف ${fresh.length} إجراء مقترح إلى «إجراءات خطة التحسين» و${fresh.length} برنامج إلى «قياس الأثر» (للمراجعة والإكمال). متابعة؟`))return;
 const src=`مقترح من تحليل ${x.type||'التقويم'} ${fmtPlain(x.date)}`;const now=new Date().toISOString();
 fresh.forEach(w=>{const ind=[w.code?'\u2066'+w.code+'\u2069':'',w.text].filter(Boolean).join(' — ');const dom=w.domain&&DOMAINS.includes(w.domain)?w.domain:(wd?wd.d:DOMAINS[0]);
  const a={id:uid(),created:now,src:tag(w),action:'معالجة المؤشر: '+ind,domain:dom,owner:'',deadline:'',status:'لم يبدأ',progress:0,indicator:ind,evidence:src+(w.p!=null?` — نسبة المؤشر ${w.p}%`:'')};DB.actions.push(a);audit('إضافة',  'actions',a);
  const m={id:uid(),created:now,src:tag(w),title:'تحسين المؤشر: '+ind,kind:'برنامج',domain:dom,start:today(),goal:'رفع نسبة تحقق المؤشر «'+ind+'»',i1n:ind,i1u:'%',i1d:'الأعلى أفضل',i1b:w.p??'',i1t:'',i1a:'',status:'مخطط (قبل التنفيذ)',notes:src+' — حدِّد القيمة المستهدفة والمسؤول.'};DB.impact.push(m);audit('إضافة','impact',m)});
 save();render();toast(`أُضيف ${fresh.length} إجراء و${fresh.length} برنامج قياس أثر`)}
function evPrintAll(id){const rows=id?DB.evals.filter(x=>x.id===id):evSorted();const x=id?rows[0]:evLatest();let h=printHead('تحليل نتائج التقويم المدرسي',x?(x.type||'')+' — '+fmtPlain(x.date)+(x.year?' — العام '+x.year:''):'');
 if(!x)return h+'<p>لا توجد تقويمات.</p>';h+=`<section>${evAnalysis(x,true)}</section>`;const pp=evPair(x);if(pp)h+=`<section><h3>مقارنة التقويم الذاتي والخارجي — العام ${esc(x.year)}</h3>${evGroupBars(pp.s,pp.e)}${evCompare(pp)}</section>`;
 if(DB.evals.length>1)h+=`<section><h3>سجل التقويمات</h3>${evLine(evSorted())}${evHistory()}</section>`;return h+secPrint('evals')}

/* ---------- Backup reminder ---------- */
const dDiff=(a,b)=>Math.round((Date.parse(a)-Date.parse(b))/864e5);
function bkHide(){const el=$('#bkRem');if(el)el.remove()}
function bkHasData(){return COLS.some(c=>DB[c].some(x=>!x.sample))||FILES.length>0}
function bkDue(){const s=DB.settings,ev=+s.backupEvery;if(s.lastAutoBk&&dDiff(today(),String(s.lastAutoBk).slice(0,10))<Math.max(8,ev||8))return false;if(!ev||!s.setupDone||!bkHasData())return false;const t=today();
 if(!s.lastBackup&&!s.bkSince){s.bkSince=t;save();return false}
 if(s.backupSnooze&&t<s.backupSnooze)return false;return dDiff(t,s.lastBackup||s.bkSince)>=ev}
function bkCheck(){try{if(document.querySelector('dialog[open]')||!bkDue()){if(document.querySelector('dialog[open]'))bkHide();return}if($('#bkRem'))return;
 const s=DB.settings,n=s.lastBackup?dDiff(today(),s.lastBackup):null;const el=document.createElement('div');el.id='bkRem';el.setAttribute('role','status');
 el.innerHTML=`<div class="grow"><b>💾 تذكير بالنسخ الاحتياطي</b><div class="small">${n!=null?`مرّ ${n} يوماً على آخر نسخة احتياطية (<bdi dir="ltr">${s.lastBackup}</bdi>).`:'لم تُؤخذ نسخة احتياطية بعد.'} البيانات محفوظة على هذا الجهاز فقط، ويُنصح بحفظ نسخة منها.</div></div><div class="btns"><button type="button" class="btn sm gold" data-act="export">نسخ احتياطي الآن</button><button type="button" class="btn sm ghost" data-act="bksnooze">ذكّرني لاحقًا</button></div>`;
 document.body.appendChild(el)}catch(e){}}

/* ---------- Teacher professional growth models (bundled from the shared Drive folder) ---------- */
const TPD_DRIVE='https://drive.google.com/drive/folders/13FvTLxA6vXNh_HiVGRojwlrqXOOosFLg?usp=sharing';
const TPD_BASE='models/teacher-pd/';const TPD_CACHE='sld-models-1';
const TPD_MODELS=[{"g":"تحليل نواتج التعلم","t":"رابط تحليل النتائج من موقع تحضيري","f":"g0-01.txt","s":25,"d":"(رابط)","id":"1bl8wnUCvRFzXyhKF28hO73bv_EWWl4jq","u":"https://q.tahdiri.com/ta/"},{"g":"تحليل نواتج التعلم","t":"شرح طريقة تحليل النتائج من موقع تحضيري.mp4","f":"g0-02.mp4","s":7075049,"d":"","id":"1NCngkVBOUkyyuh7R_JHGIXe2XuuIzQ55","u":null},{"g":"تحليل نواتج التعلم","t":"شرح طريقة تحليل النتائج من نظام نور.txt","f":"g0-03.txt","s":38,"d":"(رابط)","id":"1PnH75sUJLqSI4y7sa-XN2Oqq6aBbW7lZ","u":"https://share.google/2SmBv6n0hNJb7tcG2"},{"g":"خطط واحتياج التطوير المهني/خطة التطوير المهني","t":"قالب بناء خطة التطوير المهني.docx","f":"g1-01.docx","s":24506,"d":"استمارة بناء خطة التطوير المهني داخل المدرسة","id":"1fw6XOmh1QKGxDYc9vOQnOuXJkhPila58","u":null},{"g":"خطط واحتياج التطوير المهني/خطة التطوير المهني","t":"مثال تطبيقي لبناء خطة التطوير المهني.pdf","f":"g1-02.pdf","s":78731,"d":"","id":"1wP8GpHotpUQNNalYrP6dT9jPEWsC2_HY","u":null},{"g":"خطط واحتياج التطوير المهني/خطة المبادرات التعليمية","t":"خطاب تكلليف مبادرة تعليمية.docx","f":"g1-03.docx","s":302998,"d":"تكليف معلم بإعداد مبادرة تعليمية","id":"15y4gsnJabWn_TvzqAXLm2_0EVcGWAdow","u":null},{"g":"خطط واحتياج التطوير المهني/خطة المبادرات التعليمية","t":"قالب تقرير خطة مبادرة تعليمية.docx","f":"g1-04.docx","s":299355,"d":"تقرير خطة مبادرة تعليمية","id":"1vH6547DrILgs2g1HVxeQUyG2I6KBPKXR","u":null},{"g":"خطط واحتياج التطوير المهني/خطة المبادرات التعليمية","t":"قالب تقرير مبادرة تعليمية.pdf","f":"g1-05.pdf","s":130952,"d":"","id":"1O7yQ3IaGDzzLpNR11BtDFj36HYjSWb--","u":null},{"g":"خطط واحتياج التطوير المهني/خطة تحليل فجوة أداء نواتج التعلم","t":"قالب تقرير خطة تحليل فجوة الأداء.docx","f":"g1-06.docx","s":301597,"d":"تقرير خطة تحليل فجوة الأداء","id":"1GJKqMwFViklyGpai4FnaGIjzxwhhmoCR","u":null},{"g":"خطط واحتياج التطوير المهني/خطة تحليل فجوة أداء نواتج التعلم","t":"مثال تطبيقي لخطة تحليل فجوة الأداء.docx","f":"g1-07.docx","s":303079,"d":"تقرير خطة تحليل فجوة الأداء","id":"1QW3LXk59U3MOi3WuQeGLgCvQ8I67JW2-","u":null},{"g":"خطط واحتياج التطوير المهني/خطة تحليل فجوة أداء نواتج التعلم","t":"مثال تطبيقي لخطة تحليل فجوة الأداء.pdf","f":"g1-08.pdf","s":149272,"d":"","id":"1sfl7m2dfHZcqKc_bLTtamub8cyR_6164","u":null},{"g":"خطط واحتياج التطوير المهني/خطة تحليل فجوة أداء نواتج التعلم","t":"ملف اكسل لنموذج الرصد اليدوي.xlsx","f":"g1-09.xlsx","s":8814,"d":"","id":"1rXGv2usEKmq0ZNF3pM9s67EfHns9EBIe","u":null},{"g":"خطط واحتياج التطوير المهني/خطة تدريب الأقران","t":"خطاب تكلليف تدريب الأقران.docx","f":"g1-10.docx","s":303772,"d":"تكليف معلمين بتنفيذ تدريب الأقران","id":"1QLUbIGMeG4pU0XDQVSjrOtUEKqcZNIDS","u":null},{"g":"خطط واحتياج التطوير المهني/خطة تدريب الأقران","t":"قالب بناء خطة تدريب الأقران.docx","f":"g1-11.docx","s":23461,"d":"استمارة بناء خطة تدريب الأقران بين معلمي المدرسة","id":"1Jh2t96eqwoTx_emnAuz4uc44O_RCAlDl","u":null},{"g":"خطط واحتياج التطوير المهني/خطة تدريب الأقران","t":"قالب بناء خطة تدريب الأقران.pdf","f":"g1-12.pdf","s":96784,"d":"","id":"1yCmN4wnXfJFnAAczxDDIuR25HK2d90P9","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"استمارة تقييم نشاط الدرس التطبيثس.docx","f":"g2-01.docx","s":306257,"d":"استمارة تقييم نشاط الدرس التطبيقي","id":"1oiNom0p0a6r2wXtTs3cDyfDqCvP6-d96","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"تقرير خطة الدرس التطبيقي.docx","f":"g2-02.docx","s":301087,"d":"","id":"1BxOSe250LqrSeZegaqm30xcjh-QPqfZ4","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"خطاب تكلليف تنفيذ نشاط التطوير المهني.docx","f":"g2-03.docx","s":303368,"d":"تكليف معلم بتنفيذ نشاط تطوير مهني بالمدرسة","id":"1KW1to1hpJ24gTwXw5a53BKUUfGkjT9fS","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"غلاف ملف النشاط.docx","f":"g2-04.docx","s":300146,"d":"تنفيذ نشاط تطوير مهني","id":"1oIY47ubo9o0ZiEVGoXPdFhvxQBnByaNH","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"منظم تنقيذ الدرس التطبيفي.docx","f":"g2-05.docx","s":298495,"d":"منظم تنفيذ نشاط الدرس التطبيقي","id":"1jRswbefzAi5X_HTFtLVAJwXUL4xQUJxu","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"نموذج تقرير درس تطبيقي.docx","f":"g2-06.docx","s":168100,"d":"نموذج رقم (4): نموذج تقرير درس تطبيقي","id":"1GHNI0n5L7-w3QQJUBNMg1X48H57c-a_C","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"مشهد تنفيذ نشاط تطوير مهني -.docx","f":"g2-07.docx","s":303253,"d":"مشهد تنفيذ نشاط تطوير مهني","id":"14Wpw0-FMW4iefDpD7msXDFqtN1KtC7o2","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط الدرس التطبيقي","t":"مشهد حضور نشاط تطوير مهني.docx","f":"g2-08.docx","s":303621,"d":"مشهد حضور نشاط تطوير مهني","id":"1ZoyLs1vEE2tpsuLK0LeDmir7NBhE38mz","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط القراءة الموجهة","t":"استمارة اعتماد لجنة التمي بالمدرسة لنشاط القراءة الموجهة.docx","f":"g2-09.docx","s":303560,"d":"استمارة اعتماد لجنة التميز بالمدرسة لنشاط القراءة الموجهة","id":"1J0jgkeVfGb3BzYl0NReHrsDdZUJmC3wL","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط القراءة الموجهة","t":"تقرير خطة نشاط القراءة الموجهة.docx","f":"g2-10.docx","s":300446,"d":"","id":"1xAU8p0107WF_AQB_lCUkqplxTcXUCrKz","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط القراءة الموجهة","t":"خطاب تكلليف تنفيذ نشاط التطوير المهني.docx","f":"g2-11.docx","s":303093,"d":"تكليف تنفيذ نشاط تطوير مهني بالمدرسة","id":"1gBGzbaV9f9JIQQLTAsQgz2KdjzzJNIO-","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط القراءة الموجهة","t":"غلاف ملف النشاط.docx","f":"g2-12.docx","s":300146,"d":"تنفيذ نشاط تطوير مهني","id":"1jdIJtv7usvpneZGlHINpIEWZYJnTohnQ","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط القراءة الموجهة","t":"مشهد تنفيذ نشاط تطوير مهني.docx","f":"g2-13.docx","s":303187,"d":"","id":"1cNsF7f2xe0a4KZck86uvkPiNGbpiX_te","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط القراءة الموجهة","t":"منظم تنقيذ القراءة الموجهة.docx","f":"g2-14.docx","s":301098,"d":"منظم تنفيذ نشاط القراءة الموجهة","id":"1F73xTSuEJVIMP6aMo0sEU-xdigvGaZV3","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط القراءة الموجهة","t":"نموذج طلب اعتماد القراءة الموجهة.docx","f":"g2-15.docx","s":164015,"d":"نموذج رقم (2): نموذج طلب اعتماد نشاط القراءة الموجهة","id":"1jckdxGlhfwNn7nVtvt57UMqcczQByLo5","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"استمارة اعتماد لجنة التمي بالمدرسة لنشاط ورشة العمل.docx","f":"g2-16.docx","s":304811,"d":"استمارة اعتماد لجنة التميز بالمدرسة لنشاط ورشة العمل","id":"1jvzL3eN8QKW-WAtURUw362kI9FZJ5X5I","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"استمارة قياس رضا المستفيدين.docx","f":"g2-17.docx","s":299204,"d":"","id":"1lcNQl9OcCgi7SjaEyHc3osrEoZNvhQ3C","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"الإعلان عن تنفيذ ورشة العمل.docx","f":"g2-18.docx","s":304046,"d":"الإعلان عن تنفيذ نشاط ورشة عمل","id":"1rdFaVW1KnhH3o0d8qOD9zIXWLEPtJNuV","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"تقرير خطة ورسة العمل.docx","f":"g2-19.docx","s":299798,"d":"تقرير خطة ورشة العمل","id":"1F0ogkDR3Y6UCgA9ff0oUt6c-K4vKOSJ0","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"خطاب تكلليف تنفيذ نشاط التطوير المهني.docx","f":"g2-20.docx","s":303231,"d":"تكليف معلم بتنفيذ نشاط تطوير مهني بالمدرسة","id":"1Uu20GxmHE5wNlKpjoblkTlIvZ8gL0DS_","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"غلاف ملف النشاط.docx","f":"g2-21.docx","s":301384,"d":"تنفيذ نشاط تطوير مهني","id":"1o_MWNeHAbsrUxNSCc_2beTZ3NtwMn-BD","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"كشف حضور نشاط تطوير مهني.docx","f":"g2-22.docx","s":298285,"d":"كشف حضور نشاط ورشة العمل","id":"1iJnzBOarncIm1XXeGlp2wxH3ANES5COf","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"مشهد تنفيذ نشاط تطوير مهني.docx","f":"g2-23.docx","s":303259,"d":"","id":"133nFSyWarXcGvM-zEF02uoYcBENFT11j","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"منظم تنقيذ ورسة العمل.docx","f":"g2-24.docx","s":299097,"d":"منظم تنفيذ نشاط ورشة العمل","id":"11tDm2Oi6Rf0vhuBv6INYcX-IU_FYzGPO","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"نموذج طلب اعتماد ورشة العمل.docx","f":"g2-25.docx","s":164246,"d":"نموذج رقم (1): إجراءات تنفيذ نشاط ورشة عمل","id":"1MDGTqQpVJMENG_O9KS5LrYZE_3q_uhS2","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة/نشاط ورشة العمل","t":"مشهد حضور نشاط تطوير مهني.docx","f":"g2-26.docx","s":303455,"d":"مشهد حضور نشاط تطوير مهني","id":"1CmQ0NKQG0fhXoGfZwJm1AzFETgPvjTwl","u":null},{"g":"نماذج اعتماد تنفيذ أنشطة التطوير المهني داخل المدرسة","t":"الدليل التوثيقي لنماذج اعتماد تنفيذ أنشطة التطوير المهني.pdf","f":"g2-27.pdf","s":624140,"d":"المرجع المدرسي في توثيق أنشطة التطوير المهني واعتماد تنفيذها (معدة وفق الدليل المعتمد للمعهد الوطني للتطوير المهني التعليمي) — إعداد: بندر عبيد العصيمي","id":"1P_FmLbi7UdvjlxRLzOKVnPWfLVwwF3qP","u":null},{"g":"","t":"مصفوفة أنشطة التطوير المهني.pdf","f":"g3-01.pdf","s":166096,"d":"مصفوفة أنشطة التطوير المهني التعليمي ومستويات الاعتماد — معدة وفق أدلة ونماذج اعتماد أنشطة التطوير المهني من المعهد الوطني للتطوير المهني التعليمي","id":"1kFrwyGxCl0wXsHwvevegHpEBY9TScGUV","u":null},{"g":"","t":"نموذج التواصل.txt","f":"g3-02.txt","s":130,"d":"(رابط)","id":"1e4hSGIZWfwN8JAfSsSzlDbupO_iK6AlP","u":"https://forms.gle/ndYLeuukJcbDKeB97"}];
const TPD_TYPES=['ورشة عمل','القراءة الموجهة','الدرس التطبيقي','تدريب الأقران','مبادرة تعليمية','تحليل فجوة أداء نواتج التعلم','خطة التطوير المهني','أخرى'];
const tpdName=m=>m.t.replace(/\.(docx|pdf|xlsx|mp4|txt)$/i,'');
Object.assign(S,{tpd:{t:'النمو المهني للمعلمين ونماذج تطبيقه',one:'تطبيق نموذج',f:[
  {k:'teacher',l:'اسم المعلم',req:1},{k:'type',l:'نوع النشاط',type:'select',opts:TPD_TYPES,req:1},
  {k:'model',l:'النموذج المستخدم',type:'select',optsFn:()=>['',...[...new Set(TPD_MODELS.filter(m=>!m.u).map(m=>(m.g?m.g.split('/').pop()+' — ':'')+tpdName(m)))]]},
  {k:'date',l:'التاريخ',type:'date',def:'today',req:1},{k:'title',l:'موضوع النشاط',full:1},
  {k:'status',l:'الحالة',type:'select',opts:['مخطط','قيد التنفيذ','منفذ','معتمد'],def:'مخطط'},
  {k:'impact',l:'الأثر والملاحظات',type:'textarea',full:1}],cols:['date','teacher','type','model','status'],date:'date'}});
const fsz=b=>b>1048576?(b/1048576).toFixed(1)+' م.ب':Math.max(1,Math.round(b/1024))+' ك.ب';
const tpdIcon=m=>m.u?'🔗':/\.pdf$/i.test(m.f)?'📕':/\.docx$/i.test(m.f)?'📘':/\.xlsx$/i.test(m.f)?'📗':/\.mp4$/i.test(m.f)?'🎬':'📄';
let tpdCached=null,tpdQ='';
function tpdCheck(){if(!('caches' in window))return;caches.open(TPD_CACHE).then(c=>c.keys().then(k=>{const keep=new Set(TPD_MODELS.map(m=>m.f));k=k.filter(r=>{const ok=keep.has(new URL(r.url).pathname.split('/').pop());if(!ok)c.delete(r);return ok});return k})).then(k=>{const set=new Set(k.map(r=>new URL(r.url).pathname.split('/').pop()));const n=TPD_MODELS.filter(m=>!m.u&&set.has(m.f)).length;const ch=tpdCached==null||tpdCached.size!==set.size;tpdCached=set;if(ch&&view()==='tpd'&&!searchQ)render();return n}).catch(()=>{})}
function tpdLibrary(){const groups={};TPD_MODELS.forEach(m=>{(groups[m.g||'ملفات عامة']=groups[m.g||'ملفات عامة']||[]).push(m)});const files=TPD_MODELS.filter(m=>!m.u),tot=files.reduce((a,m)=>a+m.s,0),noVid=files.filter(m=>!/\.mp4$/i.test(m.f));
 const off=tpdCached?files.filter(m=>tpdCached.has(m.f)).length:0;const q=tpdQ.trim();
 const row=m=>{const url=TPD_BASE+m.f,inl=/\.(pdf|mp4)$/i.test(m.f),cached=tpdCached&&tpdCached.has(m.f);
  return `<div class="tpdi"><span class="tpdic">${tpdIcon(m)}</span><div class="grow" style="min-width:0"><b>${esc(tpdName(m))}</b>${m.d?`<div class="small muted">${esc(m.d)}</div>`:''}<div class="small muted">${m.u?esc(m.u):(m.f.split('.').pop().toUpperCase()+' — '+fsz(m.s))}${cached?' — <span style="color:var(--ok)">✓ متاح دون اتصال</span>':''}</div></div>
  <div class="btns">${m.u?`<a class="btn sm gold" href="${esc(m.u)}" target="_blank" rel="noopener noreferrer">فتح الرابط</a>`:`<a class="btn sm gold" href="${url}" ${inl?'target="_blank" rel="noopener"':`download="${esc(m.t)}"`}>${inl?'فتح':'فتح/تنزيل'}</a>${inl?`<a class="btn sm ghost" href="${url}" download="${esc(m.t)}">تنزيل</a>`:''}`}<a class="btn sm ghost" href="https://drive.google.com/file/d/${m.id}/view" target="_blank" rel="noopener noreferrer" title="فتح من Google Drive">Drive</a></div></div>`};
 const gs=Object.entries(groups).map(([g,a])=>{const f=q?a.filter(m=>(m.t+' '+m.d+' '+g).includes(q)):a;if(!f.length)return '';
  return `<details class="tpdg" ${q||Object.keys(groups).length<=1?'open':''}><summary><b>📁 ${esc(g.split('/').join(' › '))}</b> <span class="small muted">(${f.length})</span></summary>${f.map(row).join('')}</details>`}).join('');
 return `<div class="card tpdlib"><div class="row" style="align-items:flex-start"><div class="grow"><h3 style="margin:0">📚 مكتبة نماذج التطوير المهني (${TPD_MODELS.length})</h3><div class="small muted">المستودع الرقمي للممارسات الإشرافية داخل المدرسة — النماذج محفوظة داخل اللوحة (<bdi>${fsz(tot)}</bdi>). ${off?`متاح دون اتصال: ${off}/${files.length}`:'افتح أي نموذج ليُحفظ دون اتصال، أو احفظها جميعاً.'}</div></div>
 <div class="btns"><button class="btn gold" data-act="tpdsave">⬇️ حفظ النماذج للعمل دون اتصال (${fsz(noVid.reduce((a,m)=>a+m.s,0))})</button><button class="btn ghost" data-act="tpdsavevid">🎬 + الفيديو (${fsz(tot-noVid.reduce((a,m)=>a+m.s,0))})</button><a class="btn ghost" href="${TPD_DRIVE}" target="_blank" rel="noopener noreferrer">📂 فتح مجلد النماذج (Google Drive)</a></div></div>
 <input id="tpdQ" data-novoice placeholder="ابحث في النماذج…" value="${esc(q)}" style="width:100%;margin:10px 0 4px">${gs||'<div class="empty">لا نتائج</div>'}</div>`}
async function tpdSave(withVid){if(!('caches' in window)){toast('المتصفح لا يدعم الحفظ دون اتصال');return}if(!navigator.onLine){toast('يلزم اتصال بالإنترنت لحفظ النماذج');return}
 const list=TPD_MODELS.filter(m=>!m.u&&(withVid||!/\.mp4$/i.test(m.f))).map(m=>TPD_BASE+m.f);const c=await caches.open(TPD_CACHE);let ok=0,bad=0;
 for(let i=0;i<list.length;i++){const u=list[i];try{if(!(await c.match(u))){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw 0;await c.put(u,r)}ok++}catch(e){bad++}if(i%5===4)toast(`جارٍ الحفظ… ${i+1}/${list.length}`)}
 tpdCached=null;tpdCheck();toast(bad?`حُفظ ${ok} وتعذّر ${bad}`:`✓ حُفظت ${ok} ملفات للعمل دون اتصال`)}

const DONE={tasks:'مكتملة',actions:'منجز',oplan:'منجز'};
const lbl=(c,k)=>k==='rate'?'نسبة الحضور':S[c].vl&&S[c].vl[k]?S[c].vl[k]:(S[c].f.find(x=>x.k===k)||{}).l||k;

/* ---------- Ready-made templates (editable) ---------- */
const T=(p,d,t)=>({period:p,domain:d,title:t});
const TPL_V2=[
 T('يومي','الإدارة المدرسية','متابعة تفعيل الإشراف (الطابور – الفسحة – الصلاة)'),
 T('يومي','الإدارة المدرسية','متابعة تعاميم نور'),
 T('يومي','الإدارة المدرسية','متابعة بريد المدرسة'),
 T('يومي','الإدارة المدرسية','متابعة برنامج حضوري'),
 T('أسبوعي','الإدارة المدرسية','متابعة برنامج فارس والاعتمادات'),
 T('أسبوعي','الإدارة المدرسية','متابعة عمل اللجان والفرق')];
const DEFAULT_TEMPLATES=[...TPL_V2,
 T('يومي','الإدارة المدرسية','متابعة حضور وانصراف المنسوبين وانتظام الطابور الصباحي'),
 T('يومي','الإدارة المدرسية','مراجعة البريد والتعاميم الواردة عبر الأنظمة الرسمية وإحالتها'),
 T('يومي','البيئة المدرسية','جولة تفقدية على المرافق ودورات المياه والمقصف والفناء'),
 T('يومي','البيئة المدرسية','متابعة المناوبة والإشراف اليومي وانصراف الطلاب الآمن'),
 T('يومي','نواتج التعلم','متابعة غياب الطلاب وتأخرهم والتواصل مع أولياء الأمور'),
 T('يومي','التعليم والتعلم','متابعة حصص الانتظار وسد الحصص الشاغرة'),
 T('أسبوعي','التعليم والتعلم','تنفيذ زيارات صفية وفق الجدول وتقديم التغذية الراجعة'),
 T('أسبوعي','التعليم والتعلم','متابعة تحضير الدروس وتنفيذ الخطط الفصلية'),
 T('أسبوعي','الإدارة المدرسية','اجتماع أسبوعي مع الوكلاء والموجه الطلابي'),
 T('أسبوعي','نواتج التعلم','مراجعة حالات السلوك والمواظبة مع لجنة التوجيه'),
 T('أسبوعي','البيئة المدرسية','متابعة تنفيذ برامج الأمن والسلامة والصيانة'),
 T('شهري','الإدارة المدرسية','عقد اجتماع المعلمين الشهري وتوثيق المحضر'),
 T('شهري','نواتج التعلم','تحليل نتائج التقويم المستمر وتحديد الطلاب المحتاجين للدعم'),
 T('شهري','التعليم والتعلم','متابعة خطط مجتمعات التعلم المهنية والتطوير المهني'),
 T('شهري','البيئة المدرسية','تنفيذ خطة إخلاء/تدريب سلامة أو مراجعة جاهزيتها'),
 T('شهري','الإدارة المدرسية','مراجعة سجل العهد والمستودع والميزانية التشغيلية'),
 T('فصلي','الإدارة المدرسية','تحديث خطة التحسين المدرسية ومتابعة مؤشراتها'),
 T('فصلي','نواتج التعلم','تحليل نتائج الاختبارات الفصلية وإعداد الخطط العلاجية والإثرائية'),
 T('فصلي','التعليم والتعلم','تقييم أداء المعلمين ومناقشة النتائج معهم'),
 T('فصلي','البيئة المدرسية','قياس رضا الطلاب وأولياء الأمور عن البيئة المدرسية'),
 T('فصلي','الإدارة المدرسية','اجتماع مجلس المدرسة وأولياء الأمور'),
 T('نهاية العام','الإدارة المدرسية','إعداد التقرير الختامي للعام الدراسي'),
 T('نهاية العام','نواتج التعلم','تحليل نواتج التعلم السنوية ومقارنتها بمستهدفات الخطة'),
 T('نهاية العام','التعليم والتعلم','تحديد احتياجات التطوير المهني للعام القادم'),
 T('نهاية العام','البيئة المدرسية','حصر احتياجات الصيانة والتجهيز للعام القادم'),
 T('نهاية العام','الإدارة المدرسية','تسليم العهد وإعداد التشكيلات والجداول المبدئية')
];
/* Occasions: dates only where fixed and well-known; others left blank for the user to set */
const OCCASIONS=[
 {title:'اليوم الوطني السعودي',kind:'مناسبة وطنية',md:'09-23'},
 {title:'يوم المعلم العالمي',kind:'مناسبة عالمية/توعوية',md:'10-05'},
 {title:'اليوم العالمي للغة العربية',kind:'مناسبة عالمية/توعوية',md:'12-18'},
 {title:'يوم التأسيس',kind:'مناسبة وطنية',md:'02-22'},
 {title:'يوم العلم',kind:'مناسبة وطنية',md:'03-11'},
 {title:'اليوم العالمي للصحة',kind:'مناسبة عالمية/توعوية',md:'04-07'},
 {title:'ذكرى البيعة',kind:'مناسبة وطنية'},
 {title:'أسبوع الموهبة والإبداع',kind:'مناسبة عالمية/توعوية'},
 {title:'أسبوع المرور / السلامة المرورية',kind:'مناسبة عالمية/توعوية'},
 {title:'اجتماع أولياء الأمور',kind:'فعالية مدرسية'},
 {title:'حفل تكريم المتفوقين',kind:'فعالية مدرسية'},
 {title:'الاختبارات النهائية',kind:'اختبارات'}
];
/* Self-review indicators per domain */
const REVIEW={
 'الإدارة المدرسية':['توجد خطة تشغيلية/تحسين معتمدة ومعلنة','تُعقد الاجتماعات الدورية وتُوثّق محاضرها وقراراتها','توزيع الأعمال والتكليفات واضح ومكتوب','تُتابع التعاميم وتُنفّذ في مواعيدها','الشراكة مع الأسرة والمجتمع مفعّلة وموثقة','تُستخدم البيانات في اتخاذ القرار'],
 'التعليم والتعلم':['تُنفّذ زيارات صفية منتظمة بتغذية راجعة مكتوبة','خطط الدروس متوافقة مع المناهج ومنفذة','تُستخدم استراتيجيات تدريس متنوعة','التقويم المستمر يُنفّذ ويُوظّف في التحسين','مجتمعات التعلم المهنية فاعلة','برامج التطوير المهني مبنية على الاحتياج'],
 'نواتج التعلم':['تُحلل نتائج الطلاب دورياً','توجد خطط علاجية وإثرائية مفعّلة','نسبة المواظبة والحضور مرتفعة ومتابعة','يُرصد تقدم الطلاب في المهارات الأساسية','تُقاس القيم والسلوك الإيجابي','يُحتفى بالإنجازات والمتفوقين'],
 'البيئة المدرسية':['المبنى والمرافق نظيفة وآمنة','خطة الأمن والسلامة معتمدة ومُدرّبة','المناوبة والإشراف منتظمة','الأنشطة الطلابية متنوعة ومنفذة','مناخ مدرسي إيجابي ومحفز','الموارد والتجهيزات متوفرة وتُصان']
};

/* ---------- Store ---------- */
const COLS=Object.keys(S);
/* =================== v1.16.0 =================== */
const nAr=s=>String(s||'').replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').toLowerCase();
const toks=s=>[...new Set(nAr(s).split(/[^\u0600-\u06FFa-z0-9]+/).map(w=>w.replace(/^(وال|بال|فال|كال|لل|ال|و)(?=..)/,'')).filter(w=>w.length>=3))];
const tokHit=(t,txt)=>{const n=nAr(txt);return t.filter(w=>n.includes(w)).length};

/* ---------- 1) Decision helper ---------- */
const DKW={'الإدارة المدرسية':['اداره','تخطيط','خطه','لجنه','لجان','اجتماع','تواصل','اولياء','اسره','تفويض','متابعه','توثيق','شواهد','تقارير','منسوب','موظف','جدول','تكليف','مهام','قرار'],
 'التعليم والتعلم':['تدريس','استراتيج','درس','دروس','تحضير','واجب','تقويم بنائي','تقنيه','معلم','صف','زياره صفيه','نمو مهني','تدريب','اداء','تعلم نشط','وسائل','مناهج','فاقد'],
 'نواتج التعلم':['تحصيل','نتائج','نتيجه','اختبار','درجات','نافس','قدرات','تحصيلي','رسوب','ضعف','مهار','قراءه','كتابه','رياضيات','علوم','اتقان','تعثر','متعثر','مستوي'],
 'البيئة المدرسية':['غياب','تاخر','تأخر','سلوك','عنف','تنمر','نظافه','سلامه','امن','اخلاء','صيانه','مرافق','نشاط','اذاعه','قيم','صحه','مقصف','انضباط','حضور','هروب']};
function decMatch(text,forceD){const n=nAr(text),t=toks(text);const sc=DOMAINS.map(d=>({d,s:DKW[d].filter(k=>n.includes(nAr(k))).length}));const top=sc.slice().sort((a,b)=>b.s-a.s)[0];const d=forceD||(top.s?top.d:'');
 const ind=[];DB.evals.forEach(e=>(Array.isArray(e.weak)?e.weak:[]).forEach(w=>{const h=tokHit(t,w.text||'');if(h)ind.push({h,t:(w.code?w.code+' — ':'')+(w.text||''),src:'تقويم '+(e.type||'')+' '+(e.date||''),href:'#evals'})}));
 DB.committees.forEach(c=>((c.off&&c.off.tasks)||[]).forEach(k=>{const h=tokHit(t,k.t);if(h)ind.push({h,t:k.t,src:comName(c),href:'#committee?'+c.id})}));
 ind.sort((a,b)=>b.h-a.h);
 const ini=[];DOMAINS.forEach((dd,di)=>INIT_BANK[dd].forEach((x,i)=>ini.push({key:'b:'+di+':'+i,t:x,d:dd,h:tokHit(t,x)})));DB.inits.forEach(x=>ini.push({key:'u:'+x.id,t:x.title,d:x.domain,h:tokHit(t,x.title+' '+(x.desc||''))}));
 let mi=ini.filter(x=>x.h&&(!d||x.d===d)).sort((a,b)=>b.h-a.h).slice(0,6);if(mi.length<3&&d)mi=mi.concat(ini.filter(x=>x.d===d&&!mi.includes(x)).slice(0,3-mi.length));
 return {sc,d,auto:top.s?top.d:'',ind:ind.slice(0,6),ini:mi}}
function decView(){const q=flt.decQ||'',r=q.trim()?decMatch(q,flt.decD):null;
 return `<div class="head"><div><h2>🧭 مساعد القرار</h2><div class="muted small">اقتراحات استرشادية محلية (بدون إنترنت أو ذكاء اصطناعي) تعتمد على كلمات مفتاحية وبيانات اللوحة.</div></div><div class="btns"><a class="btn ghost" href="#plans">📁 الخطط العلاجية (${DB.plans.length})</a></div></div>
 ${howto('مساعد القرار',['اكتب المشكلة بكلماتك أو أملِها بزر 🎤 ثم اضغط «تحليل».','يقترح المساعد المجال الأقرب بحسب كلمات مفتاحية، ويمكنك تغييره من القائمة.','تُعرض مؤشرات مرتبطة من بيانات اللوحة (المؤشرات الأضعف في التقويمات المسجلة ومهام اللجان) ومبادرات من بنك المبادرات.','اختر المبادرات المناسبة واضغط «إنشاء خطة علاجية» لفتح قالب قابل للتعبئة (الأسباب، الهدف، الإجراءات والمسؤول والموعد، طريقة القياس، الشواهد).','من «الخطط العلاجية» يمكنك إرسال الإجراءات إلى خطة التحسين أو إنشاء برنامج في قياس الأثر.','جميع الاقتراحات <b>استرشادية</b> والقرار النهائي لك.'],!q)}
 <div class="card"><label class="small">وصف المشكلة</label><textarea id="decQ" rows="3" placeholder="مثال: تدنّي نتائج الرياضيات في الصف الثاني وكثرة الغياب يوم الخميس">${esc(q)}</textarea><div class="btns" style="margin-top:6px"><button class="btn gold" data-act="decgo">🔍 تحليل</button>${q?'<button class="btn ghost" data-act="decclr">مسح</button>':''}</div></div>
 ${r?`<div class="card"><div class="row" style="flex-wrap:wrap;gap:8px"><b>المجال المقترح:</b><select id="decD" aria-label="المجال">${['',...DOMAINS].map(d=>`<option value="${d}" ${d===r.d?'selected':''}>${d||'— اختر المجال —'}</option>`).join('')}</select><span class="pill amber">استرشادي</span>${r.auto?'':'<span class="small muted">لم يتضح المجال من الكلمات — اختره يدوياً</span>'}</div>
 <div class="small muted" style="margin-top:4px">مطابقة الكلمات: ${r.sc.map(x=>esc(x.d)+' ('+x.s+')').join(' — ')}</div></div>
 <div class="card"><h3>📌 مؤشرات مرتبطة من بيانات اللوحة</h3>${r.ind.length?`<ul>${r.ind.map(i=>`<li><a href="${i.href}">${esc(i.t)}</a> <span class="small muted">(${esc(i.src)})</span></li>`).join('')}</ul>`:'<div class="empty small">لا توجد مؤشرات مطابقة في التقويمات أو مهام اللجان المسجلة</div>'}</div>
 <div class="card"><h3>💡 مبادرات مقترحة (استرشادية)</h3>${r.ini.length?r.ini.map((x,i)=>`<label class="row decini"><input type="checkbox" data-decini="${esc(x.key)}" ${i<3?'checked':''}> <span class="grow">${esc(x.t)} <span class="small muted">— ${esc(x.d)}</span></span></label>`).join(''):'<div class="empty small">اختر المجال لعرض المبادرات</div>'}
 <div class="btns" style="margin-top:8px"><button class="btn gold" data-act="decplan">📝 إنشاء خطة علاجية</button></div></div>`:''}`}
function decPlan(){const q=flt.decQ||'',r=decMatch(q,flt.decD);const keys=$$('[data-decini]:checked').map(e=>e.dataset.decini);const acts=r.ini.filter(x=>keys.includes(x.key)).map(x=>({a:x.t,o:'',d:''}));
 openForm('plans',{_new:1,problem:q,domain:r.d||'',acts:acts.length?acts:[{}],date:today()})}
function plansCards(){if(!DB.plans.length)return '';return `<div class="card"><h3>إجراءات سريعة</h3>${DB.plans.slice().reverse().map(p=>{const na=(p.acts||[]).filter(a=>a&&a.a).length,sent=DB.actions.some(a=>String(a.src||'').startsWith('plan:'+p.id+':')),si=DB.impact.some(x=>x.src==='plan:'+p.id);return `<div class="row" style="flex-wrap:wrap;gap:6px;border-bottom:1px solid var(--line);padding:6px 0"><b class="grow">${esc(String(p.problem||'').slice(0,90))}</b><span class="pill">${esc(p.domain||'')}</span>${sent?'<span class="pill green">✓ في خطة التحسين</span>':`<button class="btn sm gold" data-act="plansend" data-id="${p.id}" ${na?'':'disabled'}>➕ إرسال ${na} إجراء إلى خطة التحسين</button>`}${si?'<span class="pill green">✓ في قياس الأثر</span>':`<button class="btn sm ghost" data-act="planimp" data-id="${p.id}">📈 إنشاء برنامج في قياس الأثر</button>`}<button class="btn sm ghost" data-act="planprint" data-id="${p.id}">🖨️</button></div>`}).join('')}</div>`}
function planSend(id){const p=DB.plans.find(x=>x.id===id);if(!p)return;let n=0;(p.acts||[]).forEach((a,i)=>{if(!a||!a.a)return;const src='plan:'+p.id+':'+i;if(DB.actions.some(x=>x.src===src))return;const x={id:uid(),created:new Date().toISOString(),src,action:a.a,domain:p.domain||'',owner:a.o||'',deadline:a.d||'',status:'لم يبدأ',progress:0,indicator:p.measure||'',evidence:p.evidence||''};DB.actions.push(x);audit('إضافة','actions',x);n++});save();render();toast('أُرسل '+n+' إجراء إلى خطة التحسين')}
function planImp(id){const p=DB.plans.find(x=>x.id===id);if(!p||DB.impact.some(x=>x.src==='plan:'+id))return;const x={id:uid(),created:new Date().toISOString(),src:'plan:'+id,title:'معالجة: '+String(p.problem||'').slice(0,80),kind:'',domain:p.domain||'',goal:p.target||'',status:'مخطط (قبل التنفيذ)',notes:(p.measure?'طريقة القياس: '+p.measure:'')};DB.impact.push(x);audit('إضافة','impact',x);save();render();toast('أُنشئ برنامج في قياس الأثر — أكمل مؤشراته')}
function planPrint(id){const p=DB.plans.find(x=>x.id===id);if(!p)return;const tr=(k,v)=>`<tr><th style="width:22%;text-align:right">${k}</th><td style="white-space:pre-line">${esc(v||'—')}</td></tr>`;
 printHTML(printHead('خطة علاجية',esc(String(p.problem||'').slice(0,100)))+`<section><table border="1" cellspacing="0" cellpadding="6" style="width:100%;border-collapse:collapse">${tr('المشكلة',p.problem)}${tr('المجال',p.domain)}${tr('الأسباب',p.causes)}${tr('الهدف',p.target)}${tr('طريقة القياس',p.measure)}${tr('الشواهد',p.evidence)}</table><h3>الإجراءات</h3><table border="1" cellspacing="0" cellpadding="6" style="width:100%;border-collapse:collapse"><tr><th>#</th><th>الإجراء</th><th>المسؤول</th><th>الموعد</th></tr>${(p.acts||[]).filter(a=>a&&a.a).map((a,i)=>`<tr><td>${i+1}</td><td>${esc(a.a)}</td><td>${esc(a.o||'')}</td><td>${a.d?fmtPlain(a.d):''}</td></tr>`).join('')}</table><p class="small">الاقتراحات الواردة من «مساعد القرار» استرشادية.</p></section>`)}

/* ---------- 2) Heatmap ---------- */
const HM_AUTO='نسبة الغياب % (من سجل الغياب — شهري)';
const HM_DEF={'نسبة الغياب %':{g:5,r:10,hb:false},'متوسط الاختبار':{g:85,r:65,hb:true}};HM_DEF[HM_AUTO]=HM_DEF['نسبة الغياب %'];
const hmS=()=>{const h=DB.hm&&typeof DB.hm==='object'?DB.hm:(DB.hm={});h.thr=h.thr&&typeof h.thr==='object'?h.thr:{};return h};
const hmKey=x=>x.metric==='مخصص'?(x.custom||'مقياس مخصص'):x.metric;
function hmMetrics(){const m=[...new Set(DB.heatv.map(hmKey))];if(DB.attendance.length)m.unshift(HM_AUTO);return m}
function hmThr(m){return hmS().thr[m]||HM_DEF[m]||{g:80,r:50,hb:true,def:1}}
function hmCells(m){const cells={},rows=[],pers=[];const add=(r,p,v,src)=>{if(!rows.includes(r))rows.push(r);if(!pers.includes(p))pers.push(p);const k=r+'\u0001'+p;(cells[k]=cells[k]||[]).push({v,src})};
 if(m===HM_AUTO){const g={};DB.attendance.forEach(a=>{if(!a.cls||!a.date||!(+a.enrolled))return;const k=a.cls+'\u0001'+a.date.slice(0,7);const o=g[k]=g[k]||{e:0,a:0,n:0};o.e+=+a.enrolled;o.a+=+a.absent||0;o.n++});Object.entries(g).sort((a,b)=>a[0].split('\u0001')[1].localeCompare(b[0].split('\u0001')[1])).forEach(([k,o])=>{const[r,p]=k.split('\u0001');add(r,p,Math.round(o.a/o.e*1000)/10,o.n+' يوم مسجل — غياب '+o.a+' من '+o.e)})}
 else DB.heatv.filter(x=>hmKey(x)===m).sort((a,b)=>String(a.created||'').localeCompare(String(b.created||''))).forEach(x=>add(x.row||'—',x.period||'—',+x.value,x));
 rows.sort((a,b)=>a.localeCompare(b,'ar'));return {cells,rows,pers}}
function hmColor(v,t){if(v==null||isNaN(v))return '';let p;const g=+t.g,r=+t.r;if(t.hb)p=g===r?(v>=g?1:0):(v-r)/(g-r);else p=g===r?(v<=g?1:0):(r-v)/(r-g);p=Math.max(0,Math.min(1,p));return `hsl(${Math.round(p*120)},70%,${isDark()?32:72}%)`}
const isDark=()=>document.documentElement.dataset.theme==='dark';
const perLbl=(m,p)=>m===HM_AUTO&&/^\d{4}-\d{2}$/.test(p)?parseD(p+'-15').toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{month:'short',year:'numeric'}):p;
function hmGrid(m,print){const{cells,rows,pers}=hmCells(m),t=hmThr(m);if(!rows.length)return '<div class="empty">لا توجد قيم لهذا المقياس بعد</div>';const avg=a=>Math.round(a.reduce((s,x)=>s+x.v,0)/a.length*10)/10;
 return `<div class="tbl-wrap"><table class="hmt"><thead><tr><th>الفصل/المادة</th>${pers.map(p=>`<th>${esc(perLbl(m,p))}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r)}</th>${pers.map(p=>{const a=cells[r+'\u0001'+p];if(!a)return '<td class="hme">—</td>';const v=avg(a);return `<td style="background:${hmColor(v,t)}" title="${esc(r+' — '+perLbl(m,p)+': '+v)}" ${print?'':`data-hmc="${esc(r)}\u0001${esc(p)}" tabindex="0" role="button"`}><bdi>${v}</bdi></td>`}).join('')}</tr>`).join('')}</tbody></table></div>`}
function hmLegend(m){const t=hmThr(m);return `<div class="hmleg"><span style="background:${hmColor(t.hb?t.g:t.g,t)}">جيد ${t.hb?'≥ ':'≤ '}${t.g}</span><span style="background:${hmColor((+t.g+ +t.r)/2,t)}">متوسط</span><span style="background:${hmColor(t.r,t)}">يحتاج تدخل ${t.hb?'≤ ':'≥ '}${t.r}</span></div>`}
function heatView(){const ms=hmMetrics(),m=ms.includes(flt.hmM)?flt.hmM:ms[0],t=m?hmThr(m):null,isDef=m&&!hmS().thr[m];
 return `<div class="head"><div><h2>🌡️ الخريطة الحرارية</h2><div class="muted small">شبكة ملوّنة للفصول/المواد عبر الفترات.</div></div><div class="btns"><button class="btn gold" data-act="add" data-c="heatv">＋ إضافة قيمة</button>${m?'<button class="btn ghost" data-act="hmprint">🖨️ طباعة</button>':''}<a class="btn ghost" href="#heatv">📋 السجلات (${DB.heatv.length})</a></div></div>
 ${howto('الخريطة الحرارية',['أضف قيمة لكل فصل أو مادة في فترة (مثل: «محرم 1448» أو «الأسبوع 3») واختر المقياس: نسبة الغياب %، أو متوسط الاختبار، أو مقياس مخصص بالاسم الذي تريده.','إن كان سجل الغياب مستخدماً يظهر تلقائياً مقياس «نسبة الغياب من سجل الغياب» شهرياً لكل فصل دون إدخال إضافي.','الألوان من الأخضر (جيد) إلى الأحمر (يحتاج تدخل) وفق حدود يمكنك تعديلها؛ الحدود الافتراضية مقترحة فقط.','اضغط أي خلية لعرض التفاصيل وزر «إضافة إجراء» إلى خطة التحسين.'],!ms.length)}
 ${ms.length?`<div class="card"><div class="filters"><label class="small">المقياس <select id="hmM">${ms.map(x=>`<option ${x===m?'selected':''}>${esc(x)}</option>`).join('')}</select></label></div>
 <div class="hmthr small"><b>الحدود${isDef?' <span class="pill amber">افتراضية — قابلة للتعديل</span>':''}:</b> <label>جيد ${t.hb?'≥':'≤'} <input type="number" step="0.1" data-hmthr="g" value="${t.g}" data-novoice></label> <label>يحتاج تدخل ${t.hb?'≤':'≥'} <input type="number" step="0.1" data-hmthr="r" value="${t.r}" data-novoice></label> <label><input type="checkbox" data-hmthr="hb" ${t.hb?'checked':''}> القيمة الأعلى أفضل</label>${isDef?'':' <button class="btn sm ghost" data-act="hmreset">استعادة الافتراضي</button>'}</div>
 ${hmLegend(m)}${hmGrid(m)}</div>`:'<div class="card empty">لا توجد بيانات بعد — اضغط «＋ إضافة قيمة» أو سجّل الغياب اليومي.</div>'}`}
function hmCell(key){const m=flt.hmM&&hmMetrics().includes(flt.hmM)?flt.hmM:hmMetrics()[0];const[r,p]=key.split('\u0001');const a=hmCells(m).cells[key]||[];const f=$('#dlgForm');
 f.innerHTML=fem(`<div class="dlg-h"><span>🌡️ ${esc(r)} — ${esc(perLbl(m,p))}</span><button type="button" class="iconbtn" data-x aria-label="إغلاق">✕</button></div><div class="dlg-b" style="grid-template-columns:1fr"><div><b>${esc(m)}</b></div><ul>${a.map(x=>`<li><b><bdi>${x.v}</bdi></b> — ${typeof x.src==='string'?esc(x.src):esc((x.src.notes||'')+' ')+'<span class="small muted">'+fmtPlain(String(x.src.created||'').slice(0,10))+'</span>'}</li>`).join('')}</ul></div><div class="dlg-f"><button type="button" class="btn gold" data-hmact>➕ إضافة إجراء</button><button type="button" class="btn ghost" data-x>إغلاق</button></div>`);
 f.onsubmit=e=>e.preventDefault();$$('[data-x]',f).forEach(b=>b.onclick=()=>$('#dlg').close());$('[data-hmact]',f).onclick=()=>{$('#dlg').close();openForm('actions',{_new:1,action:'معالجة '+m+' — '+r+' ('+perLbl(m,p)+')',status:'لم يبدأ',indicator:m})};if(!$('#dlg').open)$('#dlg').showModal()}
function hmPrint(){const m=flt.hmM&&hmMetrics().includes(flt.hmM)?flt.hmM:hmMetrics()[0];if(!m)return;printHTML(printHead('الخريطة الحرارية',esc(m))+`<section class="hmprint">${hmLegend(m)}${hmGrid(m,true)}</section>`)}

/* ---------- 3) School portfolio ---------- */
const PF_SEC=[['evals','نتائج التقويم المدرسي'],['coms','اللجان: الإنجاز والاجتماعات'],['tests','الاختبارات'],['impact','قياس الأثر'],['actions','إجراءات خطة التحسين'],['inits','المبادرات'],['honors','لوحة الشرف'],['badges','أوسمة الإنجاز'],['wsum','الملخصات الأسبوعية'],['evid','قائمة الشواهد']];
const pfSel=()=>{try{const a=JSON.parse(localStorage.getItem('sld_pf')||'null');if(Array.isArray(a))return a}catch(e){}return PF_SEC.map(x=>x[0])};
const PT=(h,rows)=>rows.length?`<table border="1" cellspacing="0" cellpadding="5" style="width:100%;border-collapse:collapse"><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`:'<p>لا يوجد</p>';
function pfBody(k){const e=esc;switch(k){
 case 'evals':{const a=evSorted();if(!a.length)return '<p>لا يوجد</p>';const x=a[a.length-1];return PT(['التاريخ','النوع','العام','النسبة العامة','التصنيف'],a.map(v=>[fmtPlain(v.date),e(v.type),e(v.year||''),evNum(v.overall)!=null?v.overall+'%':'—',e(v.cls||'')]))+`<h4>نسب المجالات — آخر تقويم (${e(x.type)} ${fmtPlain(x.date)})</h4>`+evBars(evDoms(x).map(o=>({l:o.d,v:o.v})).filter(o=>o.v!=null),{print:true})}
 case 'coms':return PT(['اللجنة','نسبة إنجاز المهام','عدد الاجتماعات','آخر اجتماع'],DB.committees.map(c=>{const p=comPct(c),ms=comMeetings(c);return [e(comName(c)),p?p.pct+'% ('+p.done+'/'+p.total+')':'—',ms.length,ms[0]?fmtPlain(ms[0].date)+' — '+e(ms[0].title):'—']}));
 case 'tests':return EXAREAS.map(a=>`<h4>${a[2]} ${e(a[1])}</h4>`+PT(['اجتماعات','إجراءات منفذة','نتائج مسجلة'],[[DB.exmeet.filter(x=>x.area===a[1]).length,DB.exact.filter(x=>x.area===a[1]&&x.status==='منفذ').length,DB.exres.filter(x=>x.area===a[1]).length]])).join('');
 case 'impact':return PT(['البرنامج/المبادرة','المجال','الحالة','تحقق المؤشرات'],DB.impact.map(x=>{let s=null;try{s=impScore(x)}catch(_){}return [e(x.title),e(x.domain||''),e(x.status||''),s==null?'—':s+'%']}));
 case 'actions':return PT(['الإجراء','المجال','المسؤول','الموعد','الحالة'],DB.actions.map(a=>[e(a.action),e(a.domain||''),e(a.owner||''),a.deadline?fmtPlain(a.deadline):'',e(a.status||'')]));
 case 'inits':{const a=DB.actions.filter(x=>String(x.src||'').startsWith('init:'));return '<p class="small">مبادرات أُضيفت إلى خطة التحسين من بنك المبادرات (مقترحات استرشادية) والمبادرات المخصصة.</p>'+PT(['المبادرة','المجال','الحالة'],a.map(x=>[e(x.action),e(x.domain||''),e(x.status||'')]))+(DB.inits.length?'<h4>المبادرات المخصصة</h4>'+PT(['المبادرة','المجال'],DB.inits.map(x=>[e(x.title),e(x.domain||'')])):'')}
 case 'honors':return PT(['الشهر','الفئة','الاسم','السبب'],DB.honors.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(x=>[e(honMonth(x)),e(x.cat||''),e(x.name),e(x.reason||'')]));
 case 'badges':{const s=gmState(),eb=s.list.filter(b=>b.earned);return `<p>المستوى: <b>${s.lvl}</b> — ${s.pts} نقطة — ${eb.length} من ${s.list.length} وساماً</p>`+PT(['الوسام','الوصف','تاريخ الاكتساب'],eb.map(b=>[b.ic+' '+e(b.n),e(b.d),fmtPlain(b.earned.slice(0,10))]))}
 case 'wsum':{const w=[...new Set(gmS().ws)].sort().slice(-6);if(!w.length)return '<p>لا يوجد (تُسجَّل الأسابيع عند طباعة «ملخص الأسبوع» أو مشاركته)</p>';return w.map(s=>{const d=wsData(s);return `<h4>الأسبوع: ${wsRange(d)}</h4>`+wsHTML(d)}).join('')}
 case 'evid':{const by={};FILES.forEach(f=>{const n=secName(f.col);by[n]=(by[n]||0)+1});const r=Object.entries(by).sort((a,b)=>b[1]-a[1]);return `<p>إجمالي الشواهد: <b>${FILES.length}</b> ملف</p>`+PT(['القسم','عدد الملفات'],r.map(([n,c])=>[e(n),c]))}}return ''}
function pfView(){const sel=pfSel();return `<div class="head"><div><h2>📚 ملف إنجاز المدرسة</h2><div class="muted small">ملف منظَّم قابل للطباعة يُجمع آلياً من بيانات اللوحة الفعلية.</div></div><div class="btns"><button class="btn gold" data-act="pfprint">🖨️ إنشاء الملف / PDF</button></div></div>
 ${howto('ملف إنجاز المدرسة',['اختر الأقسام التي تريد تضمينها (يُحفظ اختيارك على الجهاز).','اضغط «إنشاء الملف / PDF» ثم اختر «حفظ كـ PDF» من نافذة الطباعة لحفظه ملفاً.','يتضمن غلافاً باسم المدرسة والعام الدراسي، وفهرساً، ثم الأقسام المختارة؛ وما لا توجد له بيانات يظهر «لا يوجد».'],false)}
 <div class="card"><h3>أقسام الملف</h3><div class="pfsel">${PF_SEC.map(([k,l],i)=>`<label class="row"><input type="checkbox" data-pf="${k}" ${sel.includes(k)?'checked':''}> ${i+1}. ${l}</label>`).join('')}</div></div>`}
function pfPrint(){const sel=pfSel(),s=DB.settings,secs=PF_SEC.filter(x=>sel.includes(x[0]));if(!secs.length)return toast('اختر قسماً واحداً على الأقل');
 const cover=`<div class="pfcover">${s.logo?`<img src="${s.logo}" alt="" style="max-height:110px">`:''}<div>المملكة العربية السعودية — وزارة التعليم${s.region?' — '+esc(s.region):''}</div><h1>📚 ملف إنجاز المدرسة</h1><h2>${esc(s.school||'')}</h2><div>${s.year?'العام الدراسي '+esc(s.year):''}</div><div>${s.principal?esc(leaderLbl())+': '+esc(s.principal):''}</div><div class="small">تاريخ الإنشاء: ${fmtPlain(today())}</div></div>`;
 const toc=`<section class="pftoc"><h2>الفهرس</h2><ol>${secs.map(x=>`<li>${x[1]}</li>`).join('')}</ol></section>`;
 printHTML(`<div class="pfdoc">${cover}${toc}${secs.map((x,i)=>`<section class="pfsec"><h2>${i+1}. ${x[1]}</h2>${pfBody(x[0])}</section>`).join('')}</div>`)}

/* ---------- 4) Voice daily report ---------- */
const VR_K=['مهمة','اجتماع','ملاحظة','غياب'];
function vrClass(s){const n=nAr(s);if(/(اجتمع|اجتماع|التقيت|لقاء|التقينا)/.test(n))return 'اجتماع';if(/(غياب|غائب|تغيب|غاب|متغيب)/.test(n))return 'غياب';if(/(سوف|سا[كنعتب]|يجب|مطلوب|لابد|لا بد|ينبغي|نحتاج|ضروره|متابعه|يلزم)/.test(n))return 'مهمة';return 'ملاحظة'}
function vrSplit(t){return String(t||'').split(/[.!؟?\n]+|،\s*ثم\s+|\s+ثم\s+/).map(x=>x.trim()).filter(x=>x.length>2)}
function vrView(){const it=flt.vr||null;return `<div class="head"><div><h2>🗣️ التقرير الصوتي</h2><div class="muted small">أملِ ملاحظات يومك، فتُقسَّم وتُصنَّف محلياً ثم تُحفظ في السجلات المناسبة.</div></div><div class="btns"><a class="btn ghost" href="#journal">📔 اليوميات (${DB.journal.length})</a></div></div>
 ${howto('التقرير الصوتي',['اضغط 🎤 وتحدّث بجمل قصيرة، أو اكتب ملاحظاتك.','اضغط «تحليل»: تُقسَّم الملاحظة إلى جمل وتُصنَّف آلياً: «مهمة» (سوف/يجب/مطلوب…)، «اجتماع» (اجتمعت/اجتماع…)، «غياب»، أو «ملاحظة».','راجع التصنيف وعدّل النص أو النوع لكل جملة، ثم اضغط «حفظ».','المهام تُحفظ في «المهام» بتاريخ اليوم، والاجتماعات في «الاجتماعات والمحاضر»، وتُحفظ الملاحظة كاملة في «اليوميات». جمل الغياب تُحفظ في اليوميات مع تذكير بتسجيل الأرقام في «سجل الغياب».'],!it)}
 <div class="card"><textarea id="vrText" rows="5" placeholder="اكتب أو أملِ ملاحظات اليوم">${esc(flt.vrText||'')}</textarea><div class="btns" style="margin-top:6px"><button class="btn gold" data-act="vrgo">🔍 تحليل</button></div></div>
 ${it?`<div class="card"><h3>مراجعة التصنيف (${it.length})</h3>${it.length?it.map((x,i)=>`<div class="vrrow"><select data-vrk="${i}" aria-label="النوع">${VR_K.map(k=>`<option ${k===x.k?'selected':''}>${k}</option>`).join('')}</select><input data-vrt="${i}" value="${esc(x.t)}" aria-label="النص"><button class="btn sm ghost" data-act="vrdel" data-id="${i}" aria-label="حذف">🗑</button></div>`).join(''):'<div class="empty">لا توجد جمل</div>'}
 <div class="btns" style="margin-top:8px"><button class="btn gold" data-act="vrsave">💾 حفظ في السجلات</button></div></div>`:''}`}
function vrSave(){const it=flt.vr||[],raw=flt.vrText||'';if(!raw.trim()&&!it.length)return;const t=today(),n=new Date().toISOString();let c={مهمة:0,اجتماع:0,ملاحظة:0,غياب:0};
 it.forEach(x=>{if(!x.t.trim())return;c[x.k]++;if(x.k==='مهمة'){const r={id:uid(),created:n,title:x.t.slice(0,200),domain:'الإدارة المدرسية',period:'يومي',due:t,priority:'متوسطة',status:'جديدة',owner:leaderLbl(),recur:'لا يتكرر',notes:'من التقرير الصوتي'};DB.tasks.push(r);audit('إضافة','tasks',r)}
  else if(x.k==='اجتماع'){const r={id:uid(),created:n,date:t,title:x.t.slice(0,80),type:'أخرى',committee:'',domain:'الإدارة المدرسية',attendees:'',minutes:x.t,decisions:''};DB.meetings.push(r);audit('إضافة','meetings',r)}});
 const j={id:uid(),created:n,date:t,text:raw,items:it.filter(x=>x.t.trim()).map(x=>'['+x.k+'] '+x.t).join('\n')};DB.journal.push(j);audit('إضافة','journal',j);save();flt.vr=null;flt.vrText='';render();
 toast(`حُفظ: ${c['مهمة']} مهمة، ${c['اجتماع']} اجتماع، ${c['ملاحظة']+c['غياب']} ملاحظة في اليوميات`+(c['غياب']?' — سجّل أرقام الغياب في «سجل الغياب»':''))}

/* ---------- 5) Emergency mode ---------- */
const EMG_DEF=[['الطوارئ الموحد','911'],['الدفاع المدني','998'],['الإسعاف (الهلال الأحمر)','997'],['الشرطة','999']];
const emgS=()=>{const e=DB.emg&&typeof DB.emg==='object'?DB.emg:(DB.emg={});if(!Array.isArray(e.contacts))e.contacts=EMG_DEF.map(([n,t])=>({id:uid(),n,t,gen:1}));e.plan=e.plan||'';e.points=e.points||'';if(!Array.isArray(e.check))e.check=[];return e};
const telHref=t=>'tel:'+String(t||'').replace(/[^\d+]/g,'');
function emgView(){const e=emgS(),ims=filesOf('emgmap','plan');return `<div class="head emghead"><div><h2>🚨 وضع الطوارئ</h2><div class="muted small">يعمل دون اتصال. اضغط الرقم للاتصال مباشرة.</div></div><div class="btns"><button class="btn ghost" data-act="emgprint">🖨️ طباعة</button></div></div>
 ${howto('وضع الطوارئ',['أرقام الطوارئ العامة مضافة مبدئياً — <b>تحقق من الأرقام</b> وأضف أرقام الجهات المعنية والمسؤولين في مدرستك.','اكتب خطة الإخلاء ونقاط التجمع، وارفع صورة المخطط/الخريطة من 📎.','قائمة التحقق تُستخدم أثناء تمارين الإخلاء: أضف بنودها، وأشّر عليها أثناء التمرين، ثم «تصفير» للتمرين التالي.','سجّل كل تمرين في «سجل التمارين» مع التاريخ والمدة والملاحظات والشواهد.','زر 🚨 الأحمر في أعلى الشاشة يفتح هذه الصفحة من أي مكان.'],false)}
 <div class="card emgcall"><h3>📞 أرقام الطوارئ <span class="pill amber">تحقق من الأرقام</span></h3><div class="emglist">${e.contacts.map(c=>`<div class="emgc">${c.t?`<a class="emgtel" href="${telHref(c.t)}">📞 <bdi dir="ltr">${esc(c.t)}</bdi></a>`:'<span class="emgtel off">—</span>'}<input data-emgc="${c.id}" data-k="n" value="${esc(c.n||'')}" placeholder="الجهة/الاسم" aria-label="الجهة"><input data-emgc="${c.id}" data-k="t" value="${esc(c.t||'')}" placeholder="الرقم" inputmode="tel" dir="ltr" data-novoice aria-label="الرقم"><button class="btn sm ghost" data-act="emgdel" data-id="${c.id}" aria-label="حذف">🗑</button></div>`).join('')}</div><button class="btn sm ghost" data-act="emgadd">＋ إضافة رقم</button></div>
 <div class="card"><h3>🗺️ خطة الإخلاء</h3><textarea data-emg="plan" rows="5" placeholder="اكتب خطوات الإخلاء والمسؤوليات">${esc(e.plan)}</textarea><div class="row" style="margin-top:6px;gap:8px;flex-wrap:wrap"><span class="small">صورة المخطط/الخريطة:</span>${evBtn('emgmap','plan')}</div>${ims.filter(isImg).map(f=>`<img class="emgimg" src="${furl(f)}" alt="مخطط الإخلاء">`).join('')}</div>
 <div class="card"><h3>📍 نقاط التجمع</h3><textarea data-emg="points" rows="3" placeholder="مثال: الساحة الأمامية — بجوار البوابة الرئيسية">${esc(e.points)}</textarea></div>
 <div class="card"><div class="row"><h3 class="grow" style="margin:0">☑️ قائمة التحقق للتمارين (${e.check.filter(x=>x.d).length}/${e.check.length})</h3>${e.check.length?'<button class="btn sm ghost" data-act="emgreset">تصفير</button>':''}</div>${e.check.map(x=>`<div class="row emgck"><input type="checkbox" data-emgk="${x.id}" ${x.d?'checked':''} aria-label="تم"><input data-emgkt="${x.id}" value="${esc(x.t)}" aria-label="البند"><button class="btn sm ghost" data-act="emgkdel" data-id="${x.id}" aria-label="حذف">🗑</button></div>`).join('')||'<div class="empty small">لا توجد بنود — أضف بنود قائمتك</div>'}<button class="btn sm ghost" data-act="emgkadd">＋ بند</button></div>
 <div class="card"><div class="row"><h3 class="grow" style="margin:0">📝 سجل التمارين (${DB.drills.length})</h3><button class="btn sm gold" data-act="add" data-c="drills">＋ تمرين</button></div>${DB.drills.length?table('drills',DB.drills.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))),S.drills.cols,''):'<div class="empty">لا توجد تمارين مسجلة</div>'}</div>`}
function emgPrint(){const e=emgS();printHTML(printHead('خطة الطوارئ والإخلاء','')+`<section><h3>أرقام الطوارئ (تحقق من الأرقام)</h3>${PT(['الجهة','الرقم'],e.contacts.map(c=>[esc(c.n||''),`<bdi dir="ltr">${esc(c.t||'')}</bdi>`]))}<h3>خطة الإخلاء</h3><p style="white-space:pre-line">${esc(e.plan)||'لا يوجد'}</p>${filesOf('emgmap','plan').filter(isImg).map(f=>`<img src="${furl(f)}" style="max-width:100%;max-height:420px">`).join('')}<h3>نقاط التجمع</h3><p style="white-space:pre-line">${esc(e.points)||'لا يوجد'}</p><h3>قائمة التحقق</h3>${e.check.length?'<ul>'+e.check.map(x=>`<li>☐ ${esc(x.t)}</li>`).join('')+'</ul>':'<p>لا يوجد</p>'}<h3>سجل التمارين</h3>${PT(['التاريخ','النوع','المدة (دقيقة)','ملاحظات'],DB.drills.map(d=>[fmtPlain(d.date),esc(d.kind||''),esc(d.duration||''),esc(d.notes||'')]))}</section>`)}

/* ---------- 6) Self comparison ---------- */
function cmpRanges(){const t=today(),c=flt.cmp||{};const b2=c.b2||t,b1=c.b1||addDays(t,-89),len=Math.round((parseD(b2)-parseD(b1))/864e5);const a2=c.a2||addDays(b1,-1),a1=c.a1||addDays(a2,-len);return {a1,a2,b1,b2}}
function cmpCalc(f,t){const n=(arr,k)=>arr.filter(x=>inR(dpart(x[k]),f,t)).length;const at=DB.attendance.filter(a=>inR(a.date,f,t));const e=at.reduce((s,a)=>s+(+a.enrolled||0),0),ab=at.reduce((s,a)=>s+(+a.absent||0),0);const ev=DB.evals.filter(x=>inR(x.date,f,t)&&evNum(x.overall)!=null);
 return [['الاجتماعات (عامة واختبارات)',n(DB.meetings,'date')+n(DB.exmeet,'date'),1],['الشواهد المرفوعة',FILES.filter(x=>inR(dpart(x.added),f,t)).length,1],['المهام المكتملة',DB.tasks.filter(x=>x.status==='مكتملة'&&inR(x.doneAt||'',f,t)).length,1],['مهام اللجان المنجزة',DB.committees.reduce((s,c)=>s+Object.values(c.tdone||{}).filter(d=>typeof d==='string'&&inR(d,f,t)).length,0),1],
  ['إدخالات الغياب',at.length,1],['متوسط نسبة الغياب %',e?Math.round(ab/e*1000)/10:null,-1],['برامج قياس الأثر المضافة',n(DB.impact,'created'),1],['إجراءات خطة التحسين المضافة',n(DB.actions,'created'),1],['التقويمات المسجلة',ev.length,1],['متوسط النسبة العامة للتقويم %',ev.length?Math.round(ev.reduce((s,x)=>s+ +x.overall,0)/ev.length*10)/10:null,1],['الأوسمة المكتسبة',Object.values(gmS().badges).filter(d=>inR(dpart(d),f,t)).length,1],['الزيارات الصفية',n(DB.visits,'date'),1],['تكريم لوحة الشرف',n(DB.honors,'date'),1]]}
function cmpTable(print){const r=cmpRanges(),A=cmpCalc(r.a1,r.a2),B=cmpCalc(r.b1,r.b2);const emptyA=A.every(x=>!x[1]);
 const rows=A.map((x,i)=>{const a=x[1],b=B[i][1];let d='—',cl='';if(a!=null&&b!=null){const df=Math.round((b-a)*10)/10;d=df===0?'= 0':(df>0?'▲ ':'▼ ')+'<bdi dir="ltr">'+(df>0?'+':'−')+Math.abs(df)+'</bdi>';cl=df===0?'':(df>0)===(x[2]>0)?'up':'down'}return `<tr><th>${x[0]}</th><td>${a==null?'—':a}</td><td>${b==null?'—':b}</td><td class="cmpd ${cl}">${d}</td></tr>`}).join('');
 return `${emptyA?'<div class="pill amber" style="white-space:normal;margin-bottom:8px">لا توجد بيانات في الفترة السابقة — المقارنة غير ممكنة لها</div>':''}<div class="tbl-wrap"><table class="cmpt" ${print?'border="1" cellspacing="0" cellpadding="5" style="width:100%;border-collapse:collapse"':''}><thead><tr><th>المؤشر</th><th>الفترة السابقة<br><span class="small">${fmtPlain(r.a1)} — ${fmtPlain(r.a2)}</span></th><th>الفترة الحالية<br><span class="small">${fmtPlain(r.b1)} — ${fmtPlain(r.b2)}</span></th><th>الفرق</th></tr></thead><tbody>${rows}</tbody></table></div><p class="small muted">▲ زيادة ▼ نقص. اللون الأخضر تحسّن والأحمر تراجع (في نسبة الغياب يكون النقص تحسناً).</p>`}
function cmpView(){const r=cmpRanges();const inp=(k,l)=>`<label class="small">${l} <input type="date" data-cmp="${k}" value="${r[k]}"></label>`;
 return `<div class="head"><div><h2>📈 مقارنة مع الذات</h2><div class="muted small">قارن أداء المدرسة بين فترتين من بيانات اللوحة.</div></div><div class="btns"><button class="btn ghost" data-act="cmpprint">🖨️ طباعة</button></div></div>
 ${howto('مقارنة مع الذات',['اختر فترتين (افتراضياً: آخر 90 يوماً مقابل الـ90 يوماً التي قبلها) أو استخدم الأزرار السريعة.','لمقارنة فصل دراسي بالسابق أدخل تاريخي بداية ونهاية كل فصل.','تُحسب الأرقام من سجلات اللوحة حسب تواريخها؛ إن لم توجد بيانات في الفترة السابقة يظهر تنبيه.'],false)}
 <div class="card"><div class="filters">${inp('a1','السابقة من')}${inp('a2','إلى')}</div><div class="filters">${inp('b1','الحالية من')}${inp('b2','إلى')}</div>
 <div class="btns"><button class="btn sm ghost" data-act="cmpq" data-id="30">آخر 30 يوماً</button><button class="btn sm ghost" data-act="cmpq" data-id="90">آخر 90 يوماً</button><button class="btn sm ghost" data-act="cmpq" data-id="m">هذا الشهر مقابل السابق</button></div></div>
 <div class="card">${cmpTable()}</div>`}
function cmpPrint(){const r=cmpRanges();printHTML(printHead('مقارنة مع الذات',`${fmtPlain(r.a1)} — ${fmtPlain(r.a2)} مقابل ${fmtPlain(r.b1)} — ${fmtPlain(r.b2)}`)+`<section>${cmpTable(true)}</section>`)}

/* =================== v1.15.0: أوسمة الإنجاز، رحلة التميز، بطاقة صباح القائد =================== */
const gmS=()=>{const g=DB.gm&&typeof DB.gm==='object'?DB.gm:(DB.gm={});g.badges=g.badges&&typeof g.badges==='object'?g.badges:{};g.ws=Array.isArray(g.ws)?g.ws:[];g.hc=+g.hc||0;g.mm=+g.mm||0;return g};
const isSchoolDay=s=>{const d=parseD(s).getDay();return d>=0&&d<=4};
function attEarlyStreak(){/* best run of consecutive school days (Sun–Thu) where absence was entered the same day before 08:00 (from the record's creation time) */
 const days=new Set();DB.attendance.forEach(a=>{if(!a.created||!a.date)return;const c=new Date(a.created);if(isNaN(c))return;if(iso(c)===a.date&&c.getHours()<8)days.add(a.date)});
 const ds=[...days].filter(isSchoolDay).sort();let best=0,cur=0,prev='';ds.forEach(d=>{let p=addDays(d,-1);while(!isSchoolDay(p))p=addDays(p,-1);cur=prev===p?cur+1:1;prev=d;best=Math.max(best,cur)});return best}
function wsStreak(){const w=[...new Set(gmS().ws)].sort();let best=0,cur=0,prev='';w.forEach(d=>{cur=prev&&addDays(prev,7)===d?cur+1:1;prev=d;best=Math.max(best,cur)});return best}
function comsWithTasks(){return DB.committees.filter(c=>c.status!=='منتهية'&&comPct(c))}
const BADGES=[
 ['att5','🌅','وسام الصباح المبكر','تسجيل الغياب قبل الساعة 8 صباحاً في 5 أيام دراسية متتالية',20,()=>[attEarlyStreak(),5]],
 ['att10','⏰','وسام الانضباط الصباحي','تسجيل الغياب قبل الساعة 8 صباحاً في 10 أيام دراسية متتالية',40,()=>[attEarlyStreak(),10]],
 ['att20','🌟','وسام الصباح الذهبي','تسجيل الغياب قبل الساعة 8 صباحاً في 20 يوماً دراسياً متتالياً',80,()=>[attEarlyStreak(),20]],
 ['com1','🤝','وسام اللجنة المكتملة','إنجاز جميع مهام لجنة واحدة',30,()=>[Math.max(0,...comsWithTasks().map(c=>comPct(c).pct))>=100?1:0,1]],
 ['comAll','🏛️','وسام اللجان الأربع','إنجاز جميع مهام اللجان الرسمية الأربع',100,()=>{const cs=comsWithTasks();return [cs.filter(c=>comPct(c).pct>=100).length,Math.max(4,cs.length)]}],
 ['ev10','📎','وسام التوثيق','رفع 10 شواهد',15,()=>[FILES.length,10]],
 ['ev50','🗂️','وسام التوثيق المتقدم','رفع 50 شاهداً',40,()=>[FILES.length,50]],
 ['ev100','📚','وسام أرشيف التميز','رفع 100 شاهد',80,()=>[FILES.length,100]],
 ['imp1','📈','وسام قياس الأثر','إضافة أول برنامج في قياس الأثر',20,()=>[DB.impact.length,1]],
 ['eval1','📊','وسام تحليل التقويم','تحليل أول نتيجة تقويم مدرسي',20,()=>[DB.evals.length,1]],
 ['meetAll','🗓️','وسام شهر الاجتماعات','عقد اجتماع لكل لجنة سارية خلال الشهر الحالي',40,()=>{const m=today().slice(0,7),cs=DB.committees.filter(c=>c.status!=='منتهية');return [cs.filter(c=>comMeetings(c).some(x=>String(x.date).slice(0,7)===m)).length,Math.max(1,cs.length)]}],
 ['ws4','📄','وسام المتابعة الأسبوعية','طباعة أو مشاركة «ملخص الأسبوع» 4 أسابيع متتالية',40,()=>[wsStreak(),4]],
 ['hon1','🖼️','وسام لوحة الشرف','إنشاء أول بطاقة في لوحة الشرف',15,()=>[gmS().hc,1]],
 ['mm1','🎙️','وسام الاجتماع المركّز','حفظ أول اجتماع من «وضع الاجتماع»',15,()=>[gmS().mm,1]],
 ['act5','✅','وسام الإنجاز','إنجاز 5 إجراءات في خطة التحسين',30,()=>[DB.actions.filter(a=>a.status==='منجز').length,5]],
 ['act15','🚀','وسام الإنجاز المتقدم','إنجاز 15 إجراءً في خطة التحسين',60,()=>[DB.actions.filter(a=>a.status==='منجز').length,15]],
 ['init3','💡','وسام المبادرة','إضافة 3 مبادرات من بنك المبادرات إلى خطة التحسين',20,()=>[DB.actions.filter(a=>String(a.src||'').startsWith('init:')).length,3]],
 ['ready80','🎯','وسام الجاهزية','بلوغ 80% في مؤشر جاهزية الزيارة (مؤشر داخلي)',50,()=>{const r=readyCalc();return [r.pct||0,80]}]];
const LEVELS=[[0,'مبتدئ','مبتدئة'],[120,'متقدم','متقدمة'],[300,'متميز','متميزة'],[500,'رائد','رائدة']];
function gmState(){const g=gmS();const list=BADGES.map(([id,ic,n,d,pts,fn])=>{let p=[0,1];try{p=fn()}catch(e){}const cur=Math.min(p[0],p[1]);return {id,ic,n,d,pts,cur,goal:p[1],earned:g.badges[id]||'',ok:p[0]>=p[1]}});
 const pts=list.filter(b=>b.earned).reduce((s,b)=>s+b.pts,0);let li=0;LEVELS.forEach((l,i)=>{if(pts>=l[0])li=i});const L=LEVELS[li],N=LEVELS[li+1];
 const last=list.filter(b=>b.earned).sort((a,b)=>b.earned.localeCompare(a.earned))[0]||null;return {list,pts,lvl:isGirls()?L[2]:L[1],li,next:N?{at:N[0],n:isGirls()?N[2]:N[1]}:null,last}}
function confetti(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const c=document.createElement('canvas');c.className='confetti';c.width=innerWidth;c.height=innerHeight;c.setAttribute('aria-hidden','true');document.body.appendChild(c);const g=c.getContext('2d');
 const cols=isGirls()?['#e98fbc','#8a1f5a','#f9d5e7','#b03a7a','#ffd166']:['#c9a227','#0f2747','#e9d48a','#1b3a63','#15803d'];const P=Array.from({length:110},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.4,vx:(Math.random()-.5)*3,vy:2+Math.random()*3.5,r:Math.random()*6.3,s:5+Math.random()*6,c:cols[Math.random()*cols.length|0]}));
 const t0=performance.now();const step=t=>{g.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.r+=.1;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);g.restore()});if(t-t0<2200)requestAnimationFrame(step);else c.remove()};requestAnimationFrame(step)}catch(e){}}
let gmBusy=false;
function gmCheck(){if(gmBusy||!DB.settings.setupDone&&!DB.settings.school)return;if(hasSample())return;gmBusy=true;try{const g=gmS();const st=gmState();const nw=st.list.filter(b=>b.ok&&!b.earned);if(nw.length){const now=new Date().toISOString();nw.forEach(b=>g.badges[b.id]=now);save();
 setTimeout(()=>{toast(nw.length===1?`🏆 وسام جديد: ${nw[0].ic} ${nw[0].n}`:`🏆 حصلت على ${nw.length} أوسمة جديدة — افتح «أوسمة الإنجاز»`);confetti();if(view()==='badges'||view()==='dashboard')render()},300)}}finally{gmBusy=false}}
function badgesView(){const st=gmState(),e=st.list.filter(b=>b.earned).length;const nx=st.next;const pr=nx?Math.round((st.pts-LEVELS[st.li][0])/(nx.at-LEVELS[st.li][0])*100):100;
 return `<div class="head"><div><h2>🏆 أوسمة الإنجاز</h2><div class="muted small">تُحسب من بيانات اللوحة الفعلية فقط، وتُمنح مرة واحدة وتبقى محفوظة.</div></div><div class="btns"><button class="btn gold" data-act="gmpng">🖼️ صورة الأوسمة (PNG)</button></div></div>
 ${howto('أوسمة الإنجاز',['كل وسام يُمنح آلياً عند تحقق شرطه من بيانات اللوحة نفسها (الغياب، اللجان، الشواهد، قياس الأثر، التقويم، الاجتماعات، ملخص الأسبوع، لوحة الشرف، خطة التحسين).','الأوسمة غير المكتسبة تظهر باهتة مع مقدار التقدم (مثل 7/10).','لكل وسام نقاط تتجمع في مستويات: '+LEVELS.map(l=>isGirls()?l[2]:l[1]).join(' ← ')+'.','وسام «الصباح» يعتمد على وقت إدخال الغياب في اللوحة (قبل 8 صباحاً في اليوم نفسه) لأيام الأحد–الخميس المتتالية.','اضغط «صورة الأوسمة» لتنزيل صورة بالأوسمة المكتسبة لمشاركتها.'],!e)}
 <div class="card gmhead"><div class="row" style="flex-wrap:wrap;gap:14px"><div class="gmlvl">${['🌱','🥉','🥈','🥇'][st.li]}</div><div class="grow"><div class="small muted">المستوى الحالي</div><div class="gmlvn">${st.lvl}</div><div><b>${st.pts}</b> نقطة — ${e} من ${st.list.length} وساماً</div></div></div>
 <div class="bar" style="margin-top:8px"><i style="width:${pr}%"></i></div><div class="small muted">${nx?`${nx.at-st.pts} نقطة للوصول إلى مستوى «${nx.n}»`:'بلغت أعلى مستوى 🎉'}</div></div>
 <div class="gmgrid">${st.list.map(b=>`<div class="gmb ${b.earned?'on':'off'}"><div class="gmi">${b.ic}</div><b>${b.n}</b><div class="small">${b.d}</div><div class="small muted">${b.pts} نقطة</div>${b.earned?`<span class="pill green">✓ مكتسب ${fmtPlain(b.earned.slice(0,10))}</span>`:`<div class="bar"><i style="width:${Math.round(b.cur/b.goal*100)}%"></i></div><div class="small"><bdi dir="ltr">${b.cur}/${b.goal}</bdi></div>`}</div>`).join('')}</div>`}
async function gmPNG(){const st=gmState(),eb=st.list.filter(b=>b.earned);if(!eb.length)return toast('لا توجد أوسمة مكتسبة بعد');const G=isGirls(),W=1080,cols=3,cw=300,ch=250,rows=Math.ceil(eb.length/cols),H=520+rows*ch+180;
 try{await Promise.all(['800 60px Tajawal','700 30px Tajawal'].map(f=>document.fonts.load(f)))}catch(e){}
 const C=G?{a:'#8a1f5a',b:'#b03a7a',ac:'#e98fbc',p:'#fffafc',ink:'#4a0d2f'}:{a:'#0f2747',b:'#1b3a63',ac:'#c9a227',p:'#fffdf6',ink:'#0f2747'};const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,C.a);gr.addColorStop(1,C.b);g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle=C.p;g.fillRect(50,50,W-100,H-100);g.strokeStyle=C.ac;g.lineWidth=8;g.strokeRect(72,72,W-144,H-144);
 g.direction='rtl';g.textAlign='center';g.fillStyle=C.ink;g.font='700 34px Tajawal, sans-serif';g.fillText(DB.settings.school||'',W/2,160);g.fillStyle=G?C.b:C.ac;g.font='800 80px Tajawal, sans-serif';g.fillText('🏆 أوسمة الإنجاز',W/2,270);
 g.fillStyle=C.ink;g.font='700 40px Tajawal, sans-serif';g.fillText(`المستوى: ${st.lvl} — ${st.pts} نقطة`,W/2,350);g.font='400 28px Tajawal, sans-serif';g.fillStyle='#6b7280';g.fillText(hjFmt(today())+' — '+eb.length+' وساماً',W/2,400);
 eb.forEach((b,i)=>{const col=i%cols,row=Math.floor(i/cols),x=W-90-cw/2-col*cw-(W-180-cols*cw)/2,y=470+row*ch;g.fillStyle=G?'#fdf0f6':'#f8f3e3';g.beginPath();g.arc(x,y+70,64,0,7);g.fill();g.strokeStyle=C.ac;g.lineWidth=5;g.stroke();g.font='64px sans-serif';g.fillStyle='#000';g.fillText(b.ic,x,y+92);g.fillStyle=C.ink;g.font='700 26px Tajawal, sans-serif';honWrap(g,b.n,cw-30).slice(0,2).forEach((l,j)=>g.fillText(l,x,y+175+j*32))});
 
 const url=c.toDataURL('image/png'),f=$('#dlgForm'),fn=`أوسمة-الإنجاز-${today()}.png`;
 f.innerHTML=`<div class="dlg-h"><span>🏆 صورة أوسمة الإنجاز</span><button type="button" class="iconbtn" data-x aria-label="إغلاق">✕</button></div><div class="dlg-b" style="grid-template-columns:1fr"><img src="${url}" alt="صورة أوسمة الإنجاز" style="width:100%;max-width:420px;margin:auto;border-radius:12px;box-shadow:0 4px 16px #0003"></div><div class="dlg-f"><a class="btn gold" href="${url}" download="${fn}">⬇️ تنزيل الصورة PNG</a><button type="button" class="btn ghost" data-x>إغلاق</button></div>`;
 f.onsubmit=e=>e.preventDefault();$$('[data-x]',f).forEach(b=>b.onclick=()=>$('#dlg').close());if(!$('#dlg').open)$('#dlg').showModal()}

/* ---------- Journey ---------- */
function jData(){const ev=evLatest(),start=ev?evNum(ev.overall):null,tg=evNum(gmS().target);const acts=DB.actions.slice().sort((a,b)=>(a.status==='منجز')-(b.status==='منجز')||0).sort((a,b)=>String(a.deadline||'9999').localeCompare(String(b.deadline||'9999'))||String(a.created||'').localeCompare(String(b.created||'')));
 const done=acts.filter(a=>a.status==='منجز').length,pct=acts.length?Math.round(done/acts.length*100):0;const t=today();
 const next=acts.filter(a=>a.status!=='منجز').sort((a,b)=>(a.deadline?0:1)-(b.deadline?0:1)||String(a.deadline).localeCompare(String(b.deadline))).slice(0,3);return {ev,start,tg,acts,done,pct,next,imp:DB.impact,t}}
function jStations(j,print){return j.acts.map((a,i)=>{const on=a.status==='منجز',over=!on&&a.deadline&&a.deadline<j.t;return `<li class="jst ${on?'on':''} ${over?'over':''}"><span class="jdot">${on?'✅':over?'⏳':i+1}</span><div class="jtx"><b>${esc(a.action)}</b><div class="small muted">${esc(a.domain||'')}${a.owner?' — '+esc(a.owner):''}${a.deadline?' — '+fmtPlain(a.deadline):''} — ${esc(a.status||'')}</div>${print?'':`<button class="btn sm ghost" data-act="edit" data-c="actions" data-id="${a.id}">فتح</button>`}</div></li>`}).join('')}
function journeyView(){const j=jData();const empty=!j.ev||j.start==null||!j.acts.length;
 const hw=howto('رحلة التميز',['نقطة البداية هي «النسبة العامة» لآخر تقويم في «تحليل نتائج التقويم المدرسي».','حدِّد بنفسك النسبة المستهدفة في الحقل أدناه (لا يوجد حد رسمي مفروض).','محطات الطريق هي إجراءات خطة التحسين؛ كل إجراء «منجز» يضيء محطة، ونسبة التقدم = الإجراءات المنجزة ÷ جميع الإجراءات. وتظهر برامج قياس الأثر محطاتٍ مساندة.','«الخطوات التالية» تعرض أقرب 3 إجراءات غير منجزة مع رابط لفتحها.','التقدم في الرحلة يقيس إنجاز الخطة ولا يتنبأ بنتيجة التقويم القادم.'],empty);
 const tgIn=`<label class="small">النسبة المستهدفة % <input type="number" min="0" max="100" step="0.1" data-jtarget value="${esc(gmS().target||'')}" placeholder="مثال: 90" style="width:7em" data-novoice></label>`;
 if(empty)return `<div class="head"><div><h2>🛤️ رحلة التميز</h2></div></div>${hw}<div class="card empty jempty"><div style="font-size:44px">🛤️</div><b>لنبدأ الرحلة!</b><p>تحتاج الرحلة إلى:</p><ul style="text-align:right;display:inline-block">${!j.ev||j.start==null?'<li>نتيجة آخر تقويم (النسبة العامة) — <a href="#evals">أضفها في تحليل نتائج التقويم المدرسي</a></li>':'<li>✓ آخر تقويم: '+j.start+'%</li>'}${!j.acts.length?'<li>إجراءات في خطة التحسين — <a href="#actions">أضف إجراءات</a> أو <a href="#inits">اختر من بنك المبادرات</a></li>':'<li>✓ '+j.acts.length+' إجراء في الخطة</li>'}</ul><div>${tgIn}</div></div>`;
 const tg=j.tg,fin=j.pct>=100;
 return `<div class="head"><div><h2>🛤️ رحلة التميز</h2><div class="muted small">من نتيجة آخر تقويم إلى الهدف الذي تحدده، عبر محطات خطة التحسين.</div></div><div class="btns"><button class="btn ghost" data-act="jprint">🖨️ طباعة</button></div></div>${hw}
 ${fin?`<div class="card jfin">🎉 <b>اكتملت محطات الرحلة!</b> أُنجزت جميع إجراءات خطة التحسين (${j.acts.length}). وقت تحديث الهدف أو إضافة مرحلة جديدة.</div>`:''}
 <div class="card"><div class="filters">${tgIn}${tg!=null&&tg<=j.start?'<span class="pill amber">الهدف أقل من نقطة البداية أو يساويها</span>':''}</div>
 <div class="jroad" role="img" aria-label="تقدم الرحلة ${j.pct}%"><div class="jflag js"><b>${j.start}%</b><span class="small">البداية (${esc(j.ev.type||'')})</span></div><div class="jtrack"><i style="width:${j.pct}%"></i><span class="jcar" style="inset-inline-start:calc(${j.pct}% - 16px)">🚗</span></div><div class="jflag je"><b>${tg!=null?tg+'%':'؟'}</b><span class="small">${tg!=null?'الهدف':'حدِّد الهدف'}</span></div></div>
 <div class="row" style="justify-content:center;margin-top:6px"><b>${j.pct}%</b>&nbsp;من الرحلة — ${j.done} من ${j.acts.length} محطة مضاءة</div></div>
 <div class="card"><h3>👣 الخطوات التالية</h3>${j.next.length?`<ol class="jnext">${j.next.map(a=>`<li><a href="#actions" data-act="edit" data-c="actions" data-id="${a.id}">${esc(a.action)}</a> <span class="small muted">${a.deadline?fmtPlain(a.deadline):'بلا موعد'}${a.owner?' — '+esc(a.owner):' — بلا مسؤول'}</span></li>`).join('')}</ol>`:'<div class="empty">لا يوجد</div>'}</div>
 <div class="card"><h3>🚏 محطات الطريق (${j.acts.length})</h3><ol class="jpath">${jStations(j)}</ol>
 ${j.imp.length?`<h4>🎯 محطات مساندة: برامج قياس الأثر</h4><div class="jimp">${j.imp.map(x=>`<a href="#impact" class="pill ${x.status==='تم القياس'?'green':''}">${x.status==='تم القياس'?'✓ ':''}${esc(x.title)}</a>`).join(' ')}</div>`:''}</div>`}
function jCheck(){const j=jData();if(!j.acts.length||j.pct<100)return;const key=j.acts.length+'|'+(gmS().target||'');if(gmS().jdone===key)return;gmS().jdone=key;save();setTimeout(()=>{toast('🎉 اكتملت رحلة التميز!');confetti()},200)}
function jPrint(){const j=jData();if(!j.ev||!j.acts.length)return;printHTML(printHead('رحلة التميز',`من ${j.start}% إلى ${j.tg!=null?j.tg+'%':'—'} — التقدم ${j.pct}% (${j.done} من ${j.acts.length})`)+`<section><h3>الخطوات التالية</h3><ol>${j.next.map(a=>`<li>${esc(a.action)} — ${a.deadline?fmtPlain(a.deadline):'بلا موعد'}${a.owner?' — '+esc(a.owner):''}</li>`).join('')||'<li>لا يوجد</li>'}</ol><h3>محطات الطريق</h3><ol class="jpath jprint">${jStations(j,true)}</ol>${j.imp.length?`<h3>برامج قياس الأثر</h3><ul>${j.imp.map(x=>`<li>${esc(x.title)} — ${esc(x.status||'')}</li>`).join('')}</ul>`:''}</section>`)}

/* ---------- Morning card ---------- */
const MORNING=['القيادة الحقيقية تبدأ بالإصغاء قبل التوجيه.','كل يوم دراسي فرصة جديدة لصناعة أثر لا يُنسى.','المدرسة الناجحة تُبنى بالخطوات الصغيرة المتكررة.','الوضوح في الهدف يختصر نصف الطريق.','الفريق المتحمس أثمن من الخطة المثالية.','ما يُقاس يُحسَّن، وما يُتابَع يُنجَز.','ابدأ يومك بأهم أولوية، والباقي يتبعها.','التقدير الصادق يضاعف العطاء.','بيئة آمنة ومحفزة هي أول درس يتعلمه الطالب.','النجاح المدرسي ثمرة شراكة بين المدرسة والأسرة.','القائد الملهم يرى في كل تحدٍّ فرصة للتعلم.','القرار المبني على البيانات أقرب إلى الصواب.','ابتسامة الصباح تصنع يوماً أفضل للجميع.','التحسين المستمر رحلة لا محطة وصول.','ثقة الفريق تُكسب بالقدوة لا بالتعليمات.','الأثر الحقيقي يظهر في نمو الطالب لا في كثرة الأوراق.','وقت قصير للتخطيط يوفّر ساعات من المعالجة.','احتفِ بالإنجازات الصغيرة؛ فهي وقود الإنجازات الكبيرة.','المتابعة الهادئة المنتظمة أقوى من الحماس المتقطع.','كل معلم متميز يحتاج من يرى تميزه ويدعمه.','الطالب يتعلم من المناخ المدرسي بقدر ما يتعلم من الدرس.','التواصل الواضح يمنع كثيراً من سوء الفهم.','اجعل الأولوية اليوم لما يخدم تعلم الطلاب.','القيادة خدمة قبل أن تكون موقعاً.','الشواهد الجيدة تحكي قصة العمل بصدق.','التغيير يبدأ بخطوة يؤمن بها الفريق.','الاستماع إلى الطلاب يكشف ما لا تكشفه التقارير.','النظام والانضباط أساس كل إبداع داخل المدرسة.','التميز عادة يومية قبل أن يكون نتيجة سنوية.','تفويض المهام بثقة يصنع قادة جدداً.','العمل بروح الفريق يحوّل الصعب إلى ممكن.','كل اجتماع ناجح ينتهي بقرار واضح ومسؤول محدد.','الطموح العالي مع الخطوات الواقعية معادلة النجاح.','المدرسة المتعلمة تتطور بتجارب أبنائها ومعلميها.','التشجيع في الوقت المناسب يصنع فارقاً كبيراً.','الجودة تفاصيل صغيرة يُعتنى بها كل يوم.','الصبر على البدايات يثمر نتائج تستحق.','اجعل قيم المدرسة حاضرة في كل قرار.','ما تزرعه اليوم في طلابك يحصده الوطن غداً.','يوم منظَّم يبدأ بقائمة أولويات قصيرة وواضحة.'];
function mcPriorities(){const t=today(),out=[],now=new Date();
 if(now.getHours()<8&&!DB.attendance.some(a=>a.date===t))out.push({t:'لم يُسجَّل غياب اليوم بعد',href:'#attendance',ic:'🚸'});
 DB.actions.filter(a=>a.status!=='منجز'&&a.deadline&&a.deadline<t).sort((a,b)=>a.deadline.localeCompare(b.deadline)).forEach(a=>out.push({t:'متأخر: '+a.action,href:'#actions',ic:'⏳'}));
 DB.actions.filter(a=>a.status!=='منجز'&&a.deadline===t).forEach(a=>out.push({t:'مستحق اليوم: '+a.action,href:'#actions',ic:'📌'}));
 calItems(t,t).filter(i=>i.kind!=='خطة').forEach(i=>out.push({t:'اليوم: '+i.t,href:i.href,ext:i.ext,ic:'📅'}));return out.slice(0,3)}
function mcShow(){if(DB.settings.morning===false||!DB.settings.school)return false;const t=today(),d=parseD(t).getDay();if(d===5||d===6)return false;
 if(localStorage.getItem('sld_mc_x')===t)return false;const sh=localStorage.getItem('sld_mc_day');if(sh===t&&!sessionStorage.getItem('sld_mc_s'))return false;
 localStorage.setItem('sld_mc_day',t);sessionStorage.setItem('sld_mc_s','1');return true}
function mcCard(){if(!mcShow())return'';const s=DB.settings,t=today(),G=isGirls(),pr=mcPriorities();const doy=Math.floor((parseD(t)-new Date(parseD(t).getFullYear(),0,0))/864e5);const q=MORNING[doy%MORNING.length];
 const day=parseD(t).toLocaleDateString('ar-SA',{weekday:'long'});
 return `<div class="card mcard" id="mcard"><div class="row"><div class="grow"><div class="mchi">☀️ صباح الخير${s.principal?'، '+esc(s.principal):''}</div><div class="small">${day} ${hjFmt(t)} — ${gFmt(t)}${s.school?' — '+esc(s.school):''}</div></div><button type="button" class="iconbtn" data-act="mcx" aria-label="إخفاء بطاقة الصباح">✕</button></div>
 <h4>أهم أولويات اليوم</h4>${pr.length?`<ol class="mcpr">${pr.map(p=>`<li>${p.ic} ${calLink(p,esc(p.t))}</li>`).join('')}</ol>`:'<p class="small">لا توجد أولويات عاجلة مسجلة لليوم ✨</p>'}
 <div class="mcq">«${q}»</div><details class="small"><summary>📘 تعليمات الاستخدام — بطاقة صباح ${G?'القائدة':'القائد'}</summary>تظهر مرة واحدة يومياً عند أول فتح للتطبيق (عدا الجمعة والسبت). الأولويات تُجمع من إجراءات الخطة المتأخرة أو المستحقة اليوم، ومواعيد اليوم في التقويم، وتنبيه «لم يُسجَّل غياب اليوم» قبل الساعة 8. أخفِها بزر ✕، ويمكن إيقافها من «الإعدادات».</details></div>`}

/* =================== أدوات ذكية (v1.14.0) =================== */
const hjFmt=(s,o)=>{try{return parseD(s).toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-latn',o||{year:'numeric',month:'long',day:'numeric'})}catch(e){return ''}};
const hjParts=s=>{try{const p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(parseD(s));const g=t=>+((p.find(x=>x.type===t)||{}).value||0);return {d:g('day'),m:g('month'),y:g('year')}}catch(e){const d=parseD(s);return {d:d.getDate(),m:d.getMonth()+1,y:d.getFullYear()}}};
const gFmt=s=>parseD(s).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{year:'numeric',month:'short',day:'numeric'});
const weekSun=s=>addDays(s,-parseD(s).getDay());
const inR=(d,a,b)=>!!d&&d>=a&&d<=b;
const dpart=t=>String(t||'').slice(0,10);
function howto(title,items,open){return `<details class="card howto" ${open?'open':''}><summary><b>📘 تعليمات الاستخدام — ${title}</b></summary><ol class="offl" style="list-style:decimal">${items.map(i=>`<li>${i}</li>`).join('')}</ol></details>`}

/* ---------- 3) Calendar aggregation (shared by weekly summary, reminders, home) ---------- */
function calItems(from,to){const out=[],add=(date,t,kind,href,ext)=>{if(inR(date,from,to))out.push({date,t,kind,href,ext})};
 try{TICKER.forEach(x=>{if(x.until){const r=tkResolve(x);add(x.until,'آخر موعد: '+String(r.t||'').replace(/^[^\p{L}\d]+/u,''),'تنبيه',r.url||'',!!r.url)}});
  if(TICKER.some(x=>x.qiyam)){const r=tkResolve(TICKER.find(x=>x.qiyam));let d=parseD(from);d.setDate(1);for(let i=0;i<14;i++){const s=iso(new Date(d.getFullYear(),d.getMonth()+i,21));if(s>to)break;add(s,'نموذج مشروع ترسيخ القيم وتعزيز الهوية الوطنية (٢١ من كل شهر)','تنبيه',r.url||'',!!r.url)}}}catch(e){}
 DB.actions.forEach(a=>{if(a.status!=='منجز')add(a.deadline,'إجراء خطة التحسين: '+a.action,'خطة','#actions')});
 DB.meetings.forEach(m=>{const cm=m.committee&&DB.committees.find(c=>c.name===m.committee);add(m.date,'اجتماع: '+m.title+(m.committee?' ('+m.committee+')':''),'اجتماع',cm?'#committee?'+cm.id:'#meetings')});
 DB.exmeet.forEach(m=>{const a=EXAREAS.find(x=>x[1]===m.area);add(m.date,'اجتماع اختبارات: '+m.title,'اجتماع',a?'#exam?'+a[0]:'#exams')});
 DB.events.forEach(e=>{if(e.status!=='ملغى')add(e.date,e.title,'مناسبة','#events')});
 return out.sort((a,b)=>a.date.localeCompare(b.date)||a.t.localeCompare(b.t))}
const KCLS={'تنبيه':'red','خطة':'amber','اجتماع':'blue','مناسبة':'green'};
function calLink(i,txt){return i.href?(i.ext?`<a href="${esc(i.href)}" target="_blank" rel="noopener noreferrer">${txt}</a>`:`<a href="${i.href}">${txt}</a>`):txt}
function hMonth(ref){const p=hjParts(ref);const start=addDays(ref,-(p.d-1));let end=start;for(let i=1;i<31;i++){const n=addDays(start,i);if(hjParts(n).m!==p.m)break;end=n}return {start,end,name:hjFmt(start,{month:'long',year:'numeric'})}}
function calView(){const t=today(),tm=addDays(t,1),ref=flt.calRef||t,M=hMonth(ref),it=calItems(M.start,M.end);const lead=parseD(M.start).getDay();const days=[];for(let d=M.start;d<=M.end;d=addDays(d,1))days.push(d);
 const cell=d=>{const its=it.filter(i=>i.date===d),p=hjParts(d);return `<div class="calc ${d===t?'today':d===tm?'tmrw':''}" data-cal="${d}"><div class="row"><b class="hd">${p.d}</b><span class="gd small muted">${parseD(d).getDate()}/${parseD(d).getMonth()+1}</span></div>${d===t?'<span class="pill red">اليوم</span>':d===tm?'<span class="pill amber">غدًا</span>':''}${its.slice(0,3).map(i=>`<div class="cali ${KCLS[i.kind]||''}" title="${esc(i.t)}">${calLink(i,esc(i.t))}</div>`).join('')}${its.length>3?`<div class="small muted">+${its.length-3}</div>`:''}</div>`};
 return `<div class="head"><div><h2>📅 تقويم المهام</h2><div class="muted small">يجمع مواعيد الشريط الإخباري، وإجراءات خطة التحسين، والاجتماعات، والمناسبات المضافة.</div></div><div class="btns"><button class="btn gold" data-act="caladd">＋ إضافة مناسبة</button><button class="btn ghost" data-act="calnotif">${'Notification' in window&&Notification.permission==='granted'?'🔔 الإشعارات مفعّلة':'🔔 تفعيل إشعارات المتصفح (اختياري)'}</button></div></div>
 ${howto('تقويم المهام',['يعرض الشهر الهجري، وتحت كل يوم التاريخ الميلادي بخط صغير.','تُجمع المواعيد آلياً: مواعيد الشريط الإخباري (ومنها نموذج يوم ٢١ من كل شهر)، ومواعيد إجراءات خطة التحسين غير المنجزة، والاجتماعات المسجلة، والمناسبات.','لإضافة موعد خاص اضغط «＋ إضافة مناسبة» (يُحفظ في «تقويم المناسبات»).','يُبرز اليوم وغدًا، وعند فتح التطبيق قبل الموعد بيوم يظهر تنبيه أعلى الصفحة. إشعارات المتصفح اختيارية ولا تُطلب إلا بضغطك.'],false)}
 <div class="card"><div class="row" style="flex-wrap:wrap"><button class="btn ghost sm" data-act="calprev" aria-label="الشهر السابق">→ السابق</button><h3 class="grow" style="margin:0;text-align:center">${esc(M.name)}<div class="small muted">${gFmt(M.start)} — ${gFmt(M.end)}</div></h3><button class="btn ghost sm" data-act="caltoday">اليوم</button><button class="btn ghost sm" data-act="calnext" aria-label="الشهر التالي">التالي ←</button></div>
 <div class="calg">${['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'].map(d=>`<div class="calh">${d}</div>`).join('')}${'<div class="calc empty"></div>'.repeat(lead)}${days.map(cell).join('')}</div>
 <div class="small muted" style="margin-top:6px"><span class="pill red">تنبيه</span> <span class="pill amber">خطة</span> <span class="pill blue">اجتماع</span> <span class="pill green">مناسبة</span></div></div>
 <div class="card"><h3>مواعيد الشهر (${it.length})</h3>${it.length?`<ul class="callist">${it.map(i=>`<li class="${i.date===t?'today':i.date===tm?'tmrw':''}"><b>${hjFmt(i.date,{day:'numeric',month:'long'})}</b> <span class="small muted">(${gFmt(i.date)})</span> — <span class="pill ${KCLS[i.kind]||''}">${i.kind}</span> ${calLink(i,esc(i.t))}${i.date===t?' <b class="red-t">اليوم</b>':i.date===tm?' <b class="amber-t">غدًا</b>':''}</li>`).join('')}</ul>`:'<div class="empty">لا يوجد</div>'}</div>`}
function calNext3(){return calItems(today(),addDays(today(),120)).slice(0,3)}
function calRemind(){try{if(document.querySelector('dialog[open]'))return;const t=today(),tm=addDays(t,1);const its=calItems(t,tm);const key='sld_calrem';if(!its.length||localStorage.getItem(key)===t||$('#calRem'))return;
 const el=document.createElement('div');el.id='calRem';el.className='card calrem';el.setAttribute('role','status');
 el.innerHTML=`<div class="row"><b class="grow">⏰ مواعيد قريبة</b><button type="button" class="iconbtn" data-calx aria-label="إخفاء">✕</button></div><ul>${its.map(i=>`<li>${i.date===t?'<b>اليوم</b>':'<b>غدًا</b>'} — ${calLink(i,esc(i.t))}</li>`).join('')}</ul>`;
 el.querySelector('[data-calx]').onclick=()=>{localStorage.setItem(key,t);el.remove()};el.innerHTML=fem(el.innerHTML);el.querySelector('[data-calx]').onclick=()=>{localStorage.setItem(key,t);el.remove()};$('header.top').after(el);
 if('Notification' in window&&Notification.permission==='granted'&&localStorage.getItem('sld_calnot')!==t){localStorage.setItem('sld_calnot',t);try{new Notification('مواعيد قريبة — لوحة قيادة المدرسة',{body:its.map(i=>(i.date===t?'اليوم: ':'غدًا: ')+i.t).join('\n').slice(0,300),icon:'icon-192.png'})}catch(e){}}}catch(e){}}

/* ---------- 1) Weekly summary ---------- */
function wsData(sun){const thu=addDays(sun,4),S1=[];const L=(t,items)=>S1.push({t,items});
 const ms=[...DB.meetings.filter(m=>inR(m.date,sun,thu)).map(m=>m.date+'|'+fmtPlain(m.date)+' — '+m.title+(m.committee?' ('+m.committee+')':'')),...DB.exmeet.filter(m=>inR(m.date,sun,thu)).map(m=>m.date+'|'+fmtPlain(m.date)+' — اجتماع اختبارات: '+m.title)].sort().map(x=>x.split('|')[1]);L('🗓️ الاجتماعات المنعقدة',ms);
 const fs=FILES.filter(f=>inR(dpart(f.added),sun,thu));const by={};fs.forEach(f=>{const n=secName(f.col);by[n]=(by[n]||0)+1});L('📎 الشواهد المرفوعة'+(fs.length?' ('+fs.length+' ملف)':''),Object.entries(by).map(([n,c])=>n+': '+c+' ملف'));
 const ct=[];DB.committees.forEach(c=>{const ts=(c.off&&c.off.tasks)||[];ts.forEach(t=>{const d=c.tdone&&c.tdone[t.id];if(typeof d==='string'&&inR(d,sun,thu))ct.push(comName(c)+': '+t.t)})});L('✅ مهام اللجان المنجزة',ct);
 const up=[];const ch=(arr,lbl,title)=>arr.forEach(x=>{const c=inR(dpart(x.created),sun,thu),u=inR(dpart(x.updated),sun,thu);if(c||u)up.push(lbl+': '+title(x)+(c?' (أُضيف)':' (حُدِّث)'))});
 ch(DB.impact,'قياس الأثر',x=>x.title);ch(DB.actions,'إجراء خطة التحسين',x=>x.action+(x.status?' — '+x.status:''));ch(DB.oplan||[],'الخطة التشغيلية',x=>itemTitle('oplan',x)||'بند');ch(DB.evals,'التقويم المدرسي',x=>x.type+(evNum(x.overall)!=null?' '+x.overall+'%':''));L('📈 تحديثات قياس الأثر والخطة',up);
 const at=DB.attendance.filter(a=>inR(a.date,sun,thu));const days={};at.forEach(a=>{const d=days[a.date]=days[a.date]||{e:0,a:0};d.e+=+a.enrolled||0;d.a+=+a.absent||0});
 const ab=Object.keys(days).sort().map(d=>fmtPlain(d)+': غياب '+days[d].a+' من '+days[d].e+(days[d].e?' ('+Math.round(days[d].a/days[d].e*1000)/10+'%)':''));if(ab.length){const te=Object.values(days).reduce((s,d)=>s+d.e,0),ta=Object.values(days).reduce((s,d)=>s+d.a,0);ab.push('الإجمالي: '+ta+' غياب من '+te+(te?' ('+Math.round(ta/te*1000)/10+'%)':''))}L('🚸 الغياب (حسب ما سُجِّل)',ab);
 const from=sun>today()?sun:today();L('⏰ المواعيد القادمة (14 يوماً)',calItems(from,addDays(from,13)).map(i=>fmtPlain(i.date)+' — '+i.t));return {sun,thu,secs:S1}}
function wsRange(w){return `${hjFmt(w.sun)} — ${hjFmt(w.thu)} (${gFmt(w.sun)} — ${gFmt(w.thu)})`}
function wsView(){const sun=weekSun(flt.wsDay||today()),w=wsData(sun);
 return `<div class="head"><div><h2>📄 ملخص الأسبوع بضغطة</h2><div class="muted small">ملخص من بيانات اللوحة فقط للأسبوع من الأحد إلى الخميس.</div></div><div class="btns"><button class="btn gold" data-act="wsprint">🖨️ طباعة / PDF</button><a class="btn ghost" data-wslog href="https://wa.me/?text=${encodeURIComponent(fem(wsText(w)))}" target="_blank" rel="noopener noreferrer">💬 مشاركة واتساب</a></div></div>
 ${howto('ملخص الأسبوع',['اختر أي يوم من الأسبوع المطلوب (الافتراضي الأسبوع الحالي) فيُحسب الأسبوع من الأحد إلى الخميس.','يُجمع الملخص آلياً من الاجتماعات والشواهد ومهام اللجان المنجزة وتحديثات قياس الأثر والخطة والغياب المسجل والمواعيد القادمة. يظهر «لا يوجد» لما لم يُسجَّل.','اطبعه أو احفظه PDF من «طباعة / PDF»، أو أرسله نصاً عبر «مشاركة واتساب».'],false)}
 <div class="card"><div class="filters"><label class="small">يوم من الأسبوع <input type="date" data-wsday value="${esc(flt.wsDay||today())}"></label><button class="btn ghost sm" data-act="wsprev">→ الأسبوع السابق</button><button class="btn ghost sm" data-act="wsnext">الأسبوع التالي ←</button></div>
 <h3 style="margin:6px 0">الأسبوع: ${wsRange(w)}</h3>${wsHTML(w)}</div>`}
function wsHTML(w){return `<div class="wsgrid">${w.secs.map(s=>`<div class="wss"><h4>${s.t}</h4>${s.items.length?`<ul>${s.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`:'<p class="muted">لا يوجد</p>'}</div>`).join('')}</div>`}
function wsText(w){const s=DB.settings;return `📄 ملخص الأسبوع — ${s.school||'المدرسة'}\n${hjFmt(w.sun)} — ${hjFmt(w.thu)}\n\n`+w.secs.map(x=>`*${x.t}*\n`+(x.items.length?x.items.slice(0,15).map(i=>'• '+i).join('\n')+(x.items.length>15?`\n… و${x.items.length-15} أخرى`:''):'لا يوجد')).join('\n\n')}
function wsLog(){const g=gmS(),w=weekSun(flt.wsDay||today());if(!g.ws.includes(w)){g.ws.push(w);g.ws=g.ws.slice(-200);save()}}
function wsPrint(){wsLog();const w=wsData(weekSun(flt.wsDay||today()));printHTML(printHead('ملخص الأسبوع','الأسبوع: '+wsRange(w))+`<section class="wsprint">${wsHTML(w)}</section>`)}

/* ---------- 2) Visit readiness (transparent, app-data only) ---------- */
function readyCalc(){const t=today(),d60=addDays(t,-59),y1=addDays(t,-365),areas=[],miss=[];
 const coms=DB.committees.filter(c=>c.status!=='منتهية');
 const withT=coms.filter(c=>comPct(c));const tp=withT.length?Math.round(withT.reduce((s,c)=>s+comPct(c).pct,0)/withT.length):null;areas.push({k:'مهام اللجان المنجزة',p:tp,d:withT.length?`متوسط نسبة إنجاز المهام في ${withT.length} لجنة`:'لا توجد لجان بمهام',href:'#committees'});
 withT.filter(c=>comPct(c).pct<100).forEach(c=>{const p=comPct(c);miss.push({t:`${comName(c)}: ${p.total-p.done} مهمة غير منجزة`,href:'#committee?'+c.id})});
 const hasEv=c=>FILES.some(f=>f.col==='com:'+c.id||(f.col==='comtask'&&String(f.rid).startsWith(c.id+':'))||(f.col==='committees'&&f.rid===c.id));const ev=coms.filter(hasEv);areas.push({k:'شواهد اللجان',p:coms.length?Math.round(ev.length/coms.length*100):null,d:`${ev.length} من ${coms.length} لجنة لديها شاهد واحد على الأقل`,href:'#committees'});
 coms.filter(c=>!hasEv(c)).forEach(c=>miss.push({t:`${comName(c)}: لا توجد شواهد مرفوعة`,href:'#committee?'+c.id}));
 const rec=coms.filter(c=>comMeetings(c).some(m=>m.date>=d60));areas.push({k:'اجتماعات حديثة (آخر 60 يوماً)',p:coms.length?Math.round(rec.length/coms.length*100):null,d:`${rec.length} من ${coms.length} لجنة عقدت اجتماعاً خلال 60 يوماً`,href:'#committees'});
 coms.filter(c=>!rec.includes(c)).forEach(c=>miss.push({t:`${comName(c)}: لا يوجد اجتماع خلال آخر 60 يوماً`,href:'#committee?'+c.id}));
 const ac=DB.actions,full=ac.filter(a=>a.owner&&a.deadline);areas.push({k:'إجراءات خطة التحسين مكتملة البيانات',p:ac.length?Math.round(full.length/ac.length*100):0,d:ac.length?`${full.length} من ${ac.length} إجراء له مسؤول وموعد`:'لا توجد إجراءات في خطة التحسين',href:'#actions'});
 if(!ac.length)miss.push({t:'أضف إجراءات خطة التحسين',href:'#actions'});else{const n=ac.length-full.length;if(n)miss.push({t:`${n} إجراء بلا مسؤول أو موعد`,href:'#actions'})}
 const le=evSorted().filter(x=>x.date>=y1).pop();areas.push({k:'تقويم مدرسي حديث (آخر 12 شهراً)',p:le?100:0,d:le?`آخر تقويم: ${le.type} ${fmtPlain(le.date)}`:'لا يوجد تقويم مسجل خلال 12 شهراً',href:'#evals'});if(!le)miss.push({t:'سجّل نتائج آخر تقويم مدرسي',href:'#evals'});
 const vals=areas.filter(a=>a.p!=null);return {areas,miss,pct:vals.length?Math.round(vals.reduce((s,a)=>s+a.p,0)/vals.length):null}}
function readyView(){const r=readyCalc();const cls=p=>p==null?'':p>=80?'green':p>=50?'amber':'red';
 return `<div class="head"><div><h2>🎯 مؤشر جاهزية الزيارة</h2><div class="muted small">مؤشر داخلي من بيانات اللوحة فقط — ليس تقديراً رسمياً.</div></div></div>
 ${howto('مؤشر جاهزية الزيارة',['يُحسب المؤشر آلياً من بيانات اللوحة نفسها؛ أكمل البيانات في الأقسام المرتبطة لترتفع النسبة.','اضغط أي بند في قائمة «الناقص» للانتقال إلى القسم الذي يعالجه.','المؤشر استرشادي لتنظيم الاستعداد ولا يمثل درجة رسمية لأي زيارة أو تقويم.'],false)}
 <div class="card"><div class="row" style="flex-wrap:wrap;gap:14px"><div class="rdbig ${cls(r.pct)}">${r.pct==null?'—':r.pct+'%'}</div><div class="grow"><b>نسبة الجاهزية</b><div class="small muted">متوسط بسيط لنسب المحاور أدناه (أوزان متساوية)، ويُستبعد المحور غير المنطبق.</div></div></div>
 ${r.areas.map(a=>`<div class="rdrow"><div class="row"><a class="grow" href="${a.href}"><b>${a.k}</b></a><b>${a.p==null?'غير منطبق':a.p+'%'}</b></div><div class="bar"><i style="width:${a.p||0}%"></i></div><div class="small muted">${esc(a.d)}</div></div>`).join('')}
 <p class="small rdinfo">ℹ️ <b>طريقة الحساب:</b> (1) مهام اللجان = متوسط نسبة المهام المؤشَّر عليها «تم» في اللجان السارية؛ (2) الشواهد = نسبة اللجان التي رُفع لها شاهد واحد على الأقل؛ (3) الاجتماعات = نسبة اللجان التي عقدت اجتماعاً خلال 60 يوماً؛ (4) خطة التحسين = نسبة الإجراءات التي لها مسؤول وموعد (0% إن لم توجد إجراءات)؛ (5) التقويم = 100% إن وُجد تقويم مسجل خلال 12 شهراً وإلا 0%. النسبة العامة = متوسط المحاور المنطبقة.</p></div>
 <div class="card"><h3>📋 الناقص (${r.miss.length})</h3>${r.miss.length?`<ul class="rdmiss">${r.miss.map(m=>`<li><a href="${m.href}">☐ ${esc(m.t)}</a></li>`).join('')}</ul>`:'<div class="empty">لا يوجد ناقص 🎉</div>'}</div>`}

/* ---------- 4) Honor board ---------- */
const HON_CATS=()=>isGirls()?['معلمة متميزة','الفصل الأعلى حضورًا','طالبة متميزة']:['معلم متميز','الفصل الأعلى حضورًا','طالب متميز'];
const honMonth=x=>hjFmt(x.date,{month:'long',year:'numeric'});
function honWrap(ctx,text,maxW){const words=String(text).split(/\s+/),lines=[];let l='';words.forEach(w=>{const tt=l?l+' '+w:w;if(ctx.measureText(tt).width>maxW&&l){lines.push(l);l=w}else l=tt});if(l)lines.push(l);return lines}
async function honCanvas(x){const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),G=isGirls();
 try{await Promise.all(['800 60px Tajawal','700 40px Tajawal','400 30px Tajawal'].map(f=>document.fonts.load(f)))}catch(e){}
 const C=G?{bg1:'#8a1f5a',bg2:'#b03a7a',ac:'#e98fbc',ac2:'#f9d5e7',ink:'#4a0d2f',paper:'#fffafc'}:{bg1:'#0f2747',bg2:'#1b3a63',ac:'#c9a227',ac2:'#e9d48a',ink:'#0f2747',paper:'#fffdf6'};
 const gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,C.bg1);gr.addColorStop(1,C.bg2);g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle=C.paper;g.beginPath();g.roundRect?g.roundRect(60,60,W-120,H-120,36):g.rect(60,60,W-120,H-120);g.fill();
 g.strokeStyle=C.ac;g.lineWidth=10;g.beginPath();g.roundRect?g.roundRect(84,84,W-168,H-168,28):g.rect(84,84,W-168,H-168);g.stroke();g.lineWidth=2;g.strokeStyle=C.ac2;g.strokeRect(104,104,W-208,H-208);
 g.direction='rtl';g.textAlign='center';g.fillStyle=C.ink;const s=DB.settings;
 g.font='700 34px Tajawal, sans-serif';g.fillText(s.school||'',W/2,190);
 g.fillStyle=G?C.bg2:C.ac;g.font='800 92px Tajawal, sans-serif';g.fillText('🏅 لوحة الشرف',W/2,320);
 g.fillStyle=C.ink;g.font='700 40px Tajawal, sans-serif';g.fillText(fem(honMonth(x)),W/2,390);g.font='400 28px Tajawal, sans-serif';g.fillStyle='#6b7280';g.fillText(parseD(x.date).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{month:'long',year:'numeric'}),W/2,432);
 let y=480;const ph=FILES.filter(f=>f.col==='honors'&&f.rid===x.id&&isImg(f)).pop();
 if(ph){try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=furl(ph)});const r=125,cx=W/2,cy=y+r;g.save();g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.closePath();g.clip();const sc=Math.max(2*r/img.width,2*r/img.height);g.drawImage(img,cx-img.width*sc/2,cy-img.height*sc/2,img.width*sc,img.height*sc);g.restore();g.strokeStyle=C.ac;g.lineWidth=8;g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.stroke();y+=2*r+40}catch(e){}}else y+=20;
 g.fillStyle=C.bg1;g.font='700 44px Tajawal, sans-serif';g.fillText(fem(x.cat||''),W/2,y+40);
 g.fillStyle=C.ink;{let fs=76,nl;for(fs of [76,66,58,50]){g.font='800 '+fs+'px Tajawal, sans-serif';nl=honWrap(g,x.name||'',W-260);if(nl.length<=2)break}if(nl.length>2){nl=nl.slice(0,2);nl[1]+=' …'}const lh=Math.round(fs*1.13);nl.forEach((l,i)=>g.fillText(l,W/2,y+140+i*lh));y+=140+lh*nl.length-(86-Math.min(86,lh))*0}
 g.font='400 32px Tajawal, sans-serif';g.fillStyle='#374151';{const rl=honWrap(g,x.reason||'',W-300),mx=Math.max(1,Math.min(5,Math.floor((H-260-(y+30))/48)+1));const sh=rl.slice(0,mx);if(rl.length>mx)sh[mx-1]=sh[mx-1].replace(/\s*\S*$/,'')+' …';sh.forEach((l,i)=>g.fillText(l,W/2,y+30+i*48))}
 g.fillStyle=C.ink;g.font='700 30px Tajawal, sans-serif';g.fillText(fem((s.principal?'قائد المدرسة: '+s.principal:'إدارة المدرسة')),W/2,H-150);
 return c}
async function honShow(id){const x=DB.honors.find(y=>y.id===id);if(!x)return;gmS().hc++;save();const c=await honCanvas(x);const url=c.toDataURL('image/png');const f=$('#dlgForm');const fn=`لوحة-الشرف-${(x.date||'').slice(0,7)}-${String(x.name||'').replace(/[\\/:*?"<>|\s]+/g,'-')}.png`;
 f.innerHTML=`<div class="dlg-h"><span>🏅 بطاقة لوحة الشرف</span><button type="button" class="iconbtn" data-x aria-label="إغلاق">✕</button></div><div class="dlg-b" style="grid-template-columns:1fr"><img src="${url}" alt="بطاقة لوحة الشرف" style="width:100%;max-width:420px;margin:auto;border-radius:12px;box-shadow:0 4px 16px #0003"></div><div class="dlg-f"><a class="btn gold" href="${url}" download="${esc(fn)}">⬇️ تنزيل الصورة PNG</a><button type="button" class="btn ghost" data-x>إغلاق</button></div>`;
 f.onsubmit=e=>e.preventDefault();$$('[data-x]',f).forEach(b=>b.onclick=()=>$('#dlg').close());if(!$('#dlg').open)$('#dlg').showModal()}
function honView(){const a=DB.honors.slice().sort((p,q)=>(q.date||'').localeCompare(p.date||''));const by={};a.forEach(x=>{const k=(x.date||'').slice(0,7);(by[k]=by[k]||[]).push(x)});
 return howto('لوحة الشرف',['كل شهر اضغط «＋ إضافة» واختر الفئة (المعلم المتميز، الفصل الأعلى حضورًا، الطالب المتميز) والاسم وسبب التكريم وتاريخاً من الشهر.','لإضافة صورة اضغط 📎 في البطاقة وارفع صورة (اختياري).','اضغط «🖼️ بطاقة الشرف» لإنشاء صورة جاهزة للنشر بألوان المدرسة واسمها والشهر، ثم «تنزيل الصورة PNG».','يُحفظ الأرشيف حسب الشهر ويُضمَّن في النسخة الاحتياطية.'],!a.length)+
 (a.length?Object.entries(by).map(([k,xs])=>`<div class="card"><h3>🗓️ ${esc(honMonth(xs[0]))} <span class="small muted">(${k})</span></h3><div class="comgrid">${xs.map(x=>`<div class="comcard honc"><div class="row"><b class="grow">🏅 ${esc(x.name)}</b><span class="pill">${esc(x.cat||'')}</span></div><div class="small">${esc(x.reason||'')}</div><div class="btns" style="margin-top:8px"><button class="btn sm gold" data-act="honpng" data-id="${x.id}">🖼️ بطاقة الشرف</button>${evBtn('honors',x.id)}<button class="btn sm ghost" data-act="edit" data-c="honors" data-id="${x.id}">تعديل</button></div></div>`).join('')}</div></div>`).join(''):'')}

/* ---------- 5) Initiatives bank (guidance suggestions, not official content) ---------- */
const INIT_BANK={
 'الإدارة المدرسية':['لوحة متابعة أسبوعية للمهام والتكليفات تُراجع في اجتماع قصير بداية كل أسبوع','توزيع اللجان والتكليفات توزيعاً متوازناً مع وصف مكتوب لمهام كل لجنة','جدول زمني لاجتماعات اللجان مع محاضر موحدة تُحفظ في ملف واحد','مبادرة «تواصل شهري» مع أولياء الأمور برسالة إنجازات وملاحظات','نظام بسيط لاستقبال مقترحات المنسوبين ومتابعة الرد عليها','تكريم شهري للمنسوبين المتميزين وفق معايير معلنة','مراجعة دورية لملفات الشواهد كل نهاية شهر لاستكمال الناقص'],
 'التعليم والتعلم':['مجتمع تعلم مهني أسبوعي لتبادل الاستراتيجيات بين المعلمين','زيارات تبادلية بين المعلمين مع نموذج ملاحظة مختصر','دروس تطبيقية نموذجية في استراتيجيات التعلم النشط','بنك أسئلة مشترك لكل مادة يُراجع ويُحدَّث دورياً','خطة لتوظيف التقنية في الدروس مع مشاركة أفضل الممارسات','متابعة الواجبات والتغذية الراجعة المكتوبة للطلاب','برنامج تدريب الأقران في مهارات التقويم البنائي'],
 'نواتج التعلم':['تحليل نتائج الاختبارات وتحديد المهارات الأقل إتقاناً لكل صف','خطط علاجية قصيرة للطلاب غير المتقنين مع إعادة قياس','برنامج إثرائي للطلاب المتفوقين','اختبارات تجريبية دورية بنمط الاختبارات الوطنية مع تحليل النتائج','حصص تقوية في القراءة والكتابة والحساب للصفوف المستهدفة','متابعة فردية لتقدم الطلاب المتعثرين بالتنسيق مع الأسرة','لوحة صفية لتتبع إتقان المهارات وتحفيز الطلاب'],
 'البيئة المدرسية':['حملة دورية للنظافة وتجميل المرافق بمشاركة الطلاب','خطة إخلاء وتدريب عملي على الأمن والسلامة كل فصل','برنامج لتعزيز الانضباط والحضور المبكر مع تحفيز الفصول','تفعيل الإذاعة المدرسية والأنشطة اللاصفية وفق خطة معلنة','ركن للقراءة أو مكتبة صفية في كل فصل','برنامج لتعزيز القيم والسلوك الإيجابي مع إشراك الأسرة','صيانة دورية للفصول والمعامل مع سجل متابعة']};
function initAdded(key){return DB.actions.some(a=>a.src==='init:'+key)}
function initView(){let ev=null;try{const x=evLatest();ev=x&&evGaps(x).find(o=>o.weak)}catch(e){}const order=ev?[ev.d,...DOMAINS.filter(d=>d!==ev.d)]:DOMAINS;
 const card=(key,t,d,mine)=>`<div class="inic"><div class="grow"><b>${esc(t)}</b>${mine?' <span class="pill gray">مخصصة</span>':''}${d?`<div class="small muted">${esc(d)}</div>`:''}</div><div class="btns">${initAdded(key)?'<span class="pill green">✓ أُضيفت للخطة</span>':`<button class="btn sm gold" data-act="initadd" data-id="${esc(key)}">＋ إضافة إلى خطة التحسين</button>`}${mine?`<button class="btn sm ghost" data-act="edit" data-c="inits" data-id="${key.slice(2)}">تعديل</button>`:''}</div></div>`;
 return howto('بنك المبادرات',['المبادرات هنا <b>مقترحات استرشادية عامة</b> لمساعدتك في بناء خطة التحسين، وليست محتوى رسمياً معتمداً.','اضغط «＋ إضافة إلى خطة التحسين» لإنشاء إجراء في «إجراءات خطة التحسين» بالمجال نفسه، ثم أكمل المسؤول والموعد.','أضف مبادراتك الخاصة من «＋ إضافة» أعلى الصفحة لتظهر ضمن مجالها.','إذا سجّلت نتائج تقويم في «تحليل نتائج التقويم المدرسي» تظهر مبادرات المجال الأضعف أولاً.'],!DB.inits.length)+
 `<div class="card"><div class="row"><h3 class="grow" style="margin:0">💡 مقترحات استرشادية</h3>${ev?`<span class="pill red">المجال الأضعف حسب آخر تقويم: ${esc(ev.d)}</span>`:''}</div>${order.map(d=>`<div class="inig"><h4>${ev&&d===ev.d?'⚠️ ':''}${esc(d)}</h4>${INIT_BANK[d].map((t,i)=>card('b:'+DOMAINS.indexOf(d)+':'+i,t,'')).join('')}${DB.inits.filter(x=>x.domain===d).map(x=>card('u:'+x.id,x.title,x.desc,true)).join('')}</div>`).join('')}</div>`}
function initAdd(key){let t,d,desc='';if(key.startsWith('b:')){const[,di,i]=key.split(':');d=DOMAINS[+di];t=INIT_BANK[d]&&INIT_BANK[d][+i]}else{const x=DB.inits.find(y=>y.id===key.slice(2));if(x){t=x.title;d=x.domain;desc=x.desc||''}}
 if(!t||initAdded(key))return;const a={id:uid(),created:new Date().toISOString(),src:'init:'+key,action:t,domain:d,owner:'',deadline:'',status:'لم يبدأ',progress:0,indicator:'',evidence:'من بنك المبادرات (مقترح استرشادي)'+(desc?' — '+desc:'')};DB.actions.push(a);audit('إضافة','actions',a);save();render();toast('أُضيفت إلى إجراءات خطة التحسين — أكمل المسؤول والموعد')}

/* ---------- 6) Meeting mode ---------- */
let MM=null,MMT=null;const MMK='sld_mm_draft';
function mmTargets(){return [['g','الاجتماعات والمحاضر (عام)'],...DB.committees.filter(c=>c.status!=='منتهية').map(c=>['c:'+c.id,'لجنة: '+comName(c)]),...EXAREAS.map(a=>['x:'+a[0],'اجتماعات الاختبارات: '+a[1]])]}
function mmPeople(tg){const s=new Set(),addL=t=>String(t||'').split(/[\n،,]+/).map(x=>x.trim()).filter(x=>x&&x.length<60).forEach(x=>s.add(x));
 if(tg&&tg.startsWith('c:')){const c=DB.committees.find(x=>x.id===tg.slice(2));if(c){addL(c.head);addL(c.members)}}else DB.committees.forEach(c=>{addL(c.head);addL(c.members)});return [...s].slice(0,60)}
function mmView(){const d=localStorage.getItem(MMK);return `<div class="head"><div><h2>🎙️ وضع الاجتماع</h2><div class="muted small">شاشة مركّزة لإدارة الاجتماع وتدوين المحضر بالصوت، ثم حفظه في سجل الاجتماعات.</div></div></div>
 ${howto('وضع الاجتماع',['اختر السجل الذي سيُحفظ فيه الاجتماع (عام، أو لجنة، أو أحد مجالات الاختبارات) واضغط «بدء الاجتماع». يمكن أيضاً البدء من زر «🎙️ وضع الاجتماع» في صفحة اللجنة أو سجل الاجتماعات.','حدِّد الحضور بالضغط على الأسماء (من أعضاء اللجان) أو اكتبها، وأضف بنود جدول الأعمال.','اضغط زر 🎤 الكبير لإملاء النقاش بالصوت، وأضف التوصيات مع المسؤول والموعد لكل توصية.','«إنهاء وحفظ» يحفظ الاجتماع سجلاً عادياً يمكن طباعته محضراً، ويمكن اختيارياً إرسال التوصيات إلى خطة التحسين. تُحفظ المسودة تلقائياً على الجهاز حتى الحفظ.'],true)}
 <div class="card"><div class="filters"><select id="mmTarget" aria-label="سجل الاجتماع">${mmTargets().map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join('')}</select><button class="btn gold" data-act="mmstart">▶️ بدء الاجتماع</button>${d?'<button class="btn ghost" data-act="mmresume">↩️ استكمال المسودة المحفوظة</button>':''}</div></div>`}
function mmOpen(tg,draft){MM=draft||{tg,title:'',start:new Date().toISOString(),att:[],extra:'',agenda:[''],disc:'',recs:[{t:'',o:'',d:''}],push:false,type:'المعلمين'};
 if(!draft){if(tg.startsWith('c:')){const c=DB.committees.find(x=>x.id===tg.slice(2));MM.title=c?'اجتماع '+comName(c):''}else if(tg.startsWith('x:')){const a=exArea(tg.slice(2));MM.title=a?'اجتماع '+a[1]:''}}
 let d=$('#mmDlg');if(!d){d=document.createElement('dialog');d.id='mmDlg';d.className='mmode';document.body.appendChild(d);d.addEventListener('cancel',e=>{e.preventDefault();mmClose()})}
 mmRender();if(!d.open)d.showModal();clearInterval(MMT);MMT=setInterval(mmTick,1000);mmTick()}
function mmLbl(){const tg=MM.tg;return (mmTargets().find(x=>x[0]===tg)||[0,'الاجتماعات والمحاضر'])[1]}
function mmRender(){const d=$('#mmDlg'),ppl=mmPeople(MM.tg);
 d.innerHTML=fem(`<div class="mmwrap"><div class="mmtop"><div><div class="small">🎙️ وضع الاجتماع — ${esc(mmLbl())}</div><input id="mmTitle" class="mmtitle" placeholder="عنوان الاجتماع" value="${esc(MM.title)}" aria-label="عنوان الاجتماع"></div><div class="mmclock"><div id="mmNow">--:--</div><div class="small">المدة <b id="mmEl">00:00</b></div></div></div>
 <div class="mmgrid"><section class="mmcol"><h3>👥 الحضور (<span id="mmAttN">${MM.att.length}</span>)</h3>${ppl.length?`<div class="mmchips">${ppl.map(p=>`<button type="button" class="chipb ${MM.att.includes(p)?'on':''}" data-mmp="${esc(p)}">${esc(p)}</button>`).join('')}</div>`:'<p class="small muted">لا توجد أسماء أعضاء محفوظة — اكتب الحضور.</p>'}
 <textarea id="mmExtra" rows="2" placeholder="حضور آخرون (اسم في كل سطر)">${esc(MM.extra)}</textarea>
 <h3>📌 جدول الأعمال</h3><div id="mmAg">${MM.agenda.map((a,i)=>`<div class="row mmrow"><span>${i+1}.</span><input data-mmag="${i}" value="${esc(a)}" placeholder="بند ${i+1}"><button type="button" class="btn sm ghost" data-mmagdel="${i}" aria-label="حذف البند">🗑</button></div>`).join('')}</div><button type="button" class="btn sm ghost" data-mmagadd>＋ بند</button></section>
 <section class="mmcol"><h3>🗣️ النقاش</h3><div class="mmdisc"><textarea id="mmDisc" data-novoice rows="8" placeholder="اضغط 🎤 وتحدّث، أو اكتب">${esc(MM.disc)}</textarea><button type="button" class="mmmic" id="mmMic" aria-label="إملاء النقاش بالصوت">🎤</button></div>
 <h3>✅ التوصيات</h3><div id="mmRecs">${MM.recs.map((r,i)=>`<div class="mmrec"><input data-mmr="${i}" data-mf="t" value="${esc(r.t)}" placeholder="التوصية"><input data-mmr="${i}" data-mf="o" value="${esc(r.o)}" placeholder="المسؤول"><input type="date" data-mmr="${i}" data-mf="d" value="${esc(r.d)}" aria-label="الموعد"><button type="button" class="btn sm ghost" data-mmrdel="${i}" aria-label="حذف التوصية">🗑</button></div>`).join('')}</div><button type="button" class="btn sm ghost" data-mmradd>＋ توصية</button>
 <label class="row small" style="margin-top:8px"><input type="checkbox" id="mmPush" ${MM.push?'checked':''}> إرسال التوصيات أيضاً إلى «إجراءات خطة التحسين»</label></section></div>
 <div class="mmfoot"><button type="button" class="btn gold" data-mmsave>💾 إنهاء وحفظ</button><button type="button" class="btn ghost" data-mmclose>إغلاق (تبقى المسودة)</button><button type="button" class="btn red" data-mmdiscard>تجاهل المسودة</button></div></div>`);
 voiceWire(d);const dd=d;setTimeout(()=>{try{updSync()}catch(e){}},0);
 dd.oninput=e=>{const el=e.target;if(el.id==='mmTitle')MM.title=el.value;else if(el.id==='mmExtra')MM.extra=el.value;else if(el.id==='mmDisc')MM.disc=el.value;else if(el.dataset.mmag!=null)MM.agenda[+el.dataset.mmag]=el.value;else if(el.dataset.mmr!=null)MM.recs[+el.dataset.mmr][el.dataset.mf]=el.value;mmDraft()};
 dd.onchange=e=>{if(e.target.id==='mmPush'){MM.push=e.target.checked;mmDraft()}else dd.oninput(e)};
 dd.onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.mmp!=null){const p=b.dataset.mmp,i=MM.att.indexOf(p);i<0?MM.att.push(p):MM.att.splice(i,1);b.classList.toggle('on');$('#mmAttN').textContent=MM.att.length;mmDraft()}
  else if(b.hasAttribute('data-mmagadd')){MM.agenda.push('');mmRender();$$('#mmAg input').pop().focus()}else if(b.dataset.mmagdel!=null){MM.agenda.splice(+b.dataset.mmagdel,1);if(!MM.agenda.length)MM.agenda=[''];mmRender()}
  else if(b.hasAttribute('data-mmradd')){MM.recs.push({t:'',o:'',d:''});mmRender();$$('#mmRecs input[data-mf=t]').pop().focus()}else if(b.dataset.mmrdel!=null){MM.recs.splice(+b.dataset.mmrdel,1);if(!MM.recs.length)MM.recs=[{t:'',o:'',d:''}];mmRender()}
  else if(b.id==='mmMic'){voiceStart($('#mmDisc'),b)}else if(b.hasAttribute('data-mmsave'))mmSave();else if(b.hasAttribute('data-mmclose'))mmClose();else if(b.hasAttribute('data-mmdiscard')){if(confirm('تجاهل مسودة الاجتماع وعدم حفظها؟')){localStorage.removeItem(MMK);mmClose(true)}}};
 mmDraft()}
function mmDraft(){try{localStorage.setItem(MMK,JSON.stringify(MM))}catch(e){}}
const p2=n=>String(n).padStart(2,'0');
function mmTick(){if(!MM||!$('#mmNow'))return clearInterval(MMT);const n=new Date(),s=Math.max(0,Math.floor((n-new Date(MM.start))/1000));$('#mmNow').textContent=p2(n.getHours())+':'+p2(n.getMinutes())+':'+p2(n.getSeconds());$('#mmEl').textContent=(s>=3600?Math.floor(s/3600)+':':'')+p2(Math.floor(s/60)%60)+':'+p2(s%60)}
function mmClose(){try{voiceStop()}catch(e){}clearInterval(MMT);const d=$('#mmDlg');if(d&&d.open)d.close();MM=null;render()}
function mmSave(){if(!MM.title.trim()){alert('اكتب عنوان الاجتماع');$('#mmTitle').focus();return}try{voiceStop()}catch(e){}
 const st=new Date(MM.start),en=new Date(),mins=Math.max(1,Math.round((en-st)/60000)),hm=d=>p2(d.getHours())+':'+p2(d.getMinutes());
 const att=[...MM.att,...MM.extra.split(/\n+/).map(x=>x.trim()).filter(Boolean)];const ag=MM.agenda.map(x=>x.trim()).filter(Boolean),recs=MM.recs.filter(r=>r.t.trim());
 const minutes=(ag.length?'جدول الأعمال:\n'+ag.map((a,i)=>(i+1)+'. '+a).join('\n')+'\n\n':'')+(MM.disc.trim()?'النقاش:\n'+MM.disc.trim()+'\n\n':'')+`مدة الاجتماع: ${mins} دقيقة (من ${hm(st)} إلى ${hm(en)})`;
 const decisions=recs.map((r,i)=>(i+1)+'. '+r.t.trim()+(r.o?' — المسؤول: '+r.o.trim():'')+(r.d?' — الموعد: '+r.d:'')).join('\n');const date=iso(st),now=en.toISOString();let rec,c,href;
 if(MM.tg.startsWith('x:')){const a=exArea(MM.tg.slice(2));c='exmeet';rec={id:uid(),created:now,area:a?a[1]:'',date,title:MM.title.trim(),attendees:att.join('\n'),minutes,decisions};href='#exam?'+MM.tg.slice(2)}
 else{const cm=MM.tg.startsWith('c:')&&DB.committees.find(x=>x.id===MM.tg.slice(2));c='meetings';rec={id:uid(),created:now,date,title:MM.title.trim(),type:cm?(cm.name==='لجنة التميز'?'لجنة التميز':cm.name==='لجنة التوجيه الطلابي'?'الإرشاد':'أخرى'):'المعلمين',committee:cm?cm.name:'',domain:'الإدارة المدرسية',attendees:att.join('\n'),minutes,decisions};href=cm?'#committee?'+cm.id:'#meetings'}
 DB[c].push(rec);audit('إضافة',c,rec);let np=0;
 if(MM.push)recs.forEach(r=>{const a={id:uid(),created:now,src:'mm:'+rec.id,action:r.t.trim(),domain:rec.domain||'الإدارة المدرسية',owner:r.o.trim(),deadline:r.d||'',status:'لم يبدأ',progress:0,indicator:'',evidence:'من توصيات اجتماع: '+rec.title+' ('+date+')'};DB.actions.push(a);audit('إضافة','actions',a);np++});
 gmS().mm++;save();localStorage.removeItem(MMK);try{clearInterval(MMT);$('#mmDlg').close()}catch(e){}MM=null;location.hash=href;render();toast('تم حفظ الاجتماع'+(np?' وإرسال '+np+' توصية إلى خطة التحسين':''));
 setTimeout(()=>{if(confirm('تم الحفظ. طباعة المحضر الآن؟'))printHTML(mmMinutes(c,rec))},300)}
function mmMinutes(c,r){return printHead('محضر اجتماع',esc(r.title)+' — '+fmtPlain(r.date))+`<section><table border="1" cellspacing="0" cellpadding="6" style="width:100%;border-collapse:collapse">${[['السجل',c==='exmeet'?'اجتماعات الاختبارات — '+(r.area||''):(r.committee?'لجنة: '+r.committee:'الاجتماعات والمحاضر')],['التاريخ',fmtPlain(r.date)],['الحضور',r.attendees],['المحضر',r.minutes],['القرارات والتوصيات',r.decisions]].map(([k,v])=>`<tr><th style="width:22%;text-align:right">${k}</th><td style="white-space:pre-line">${esc(v||'—')}</td></tr>`).join('')}</table></section>`}

function blank(){const d={app:'school-leader-dashboard',schema:1,settings:{school:'',principal:'',region:'',year:'',logo:'',remindTime:'07:30',mute:false,theme:'',hijri:true,stages:[],gender:'',supervisor:'',supervisorMobile:'',setupDone:false,backupEvery:14,lastBackup:'',backupSnooze:'',bkSince:'',morning:true,autoBk:'daily',lastAutoBk:'',lastAutoHow:''},gm:{},templates:DEFAULT_TEMPLATES.map(t=>({id:uid(),...t})),tplMerged:TPL_V2.map(t=>t.period+'|'+t.title),review:{},audit:[],notified:{}};COLS.forEach(c=>d[c]=[]);return d}
let DB;
function load(){try{const r=localStorage.getItem(KEY);DB=r?normalize(JSON.parse(r)):blank()}catch(e){console.warn(e);DB=blank()}}
function normalize(d){const b=blank();if(!d||typeof d!=='object')return b;
 const o={...b,...d,settings:{...b.settings,...(d.settings||{})}};
 COLS.forEach(c=>{o[c]=Array.isArray(d[c])?d[c].filter(x=>x&&typeof x==='object').map(x=>({...x,id:String(x.id||uid())})):[]});
 o.templates=Array.isArray(d.templates)?d.templates.filter(t=>t&&t.title):b.templates;
 o.comMerged=Array.isArray(d.comMerged)?d.comMerged.map(String):[];o.tplMerged=Array.isArray(d.tplMerged)?d.tplMerged.map(String):[];o.review=d.review&&typeof d.review==='object'?d.review:{};o.audit=Array.isArray(d.audit)?d.audit.slice(-1000):[];o.notified=d.notified||{};o.gm=d.gm&&typeof d.gm==='object'&&!Array.isArray(d.gm)?d.gm:{};['hm','emg'].forEach(k=>{if(!(d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k])))delete o[k]});delete o.wkr;o.audit=o.audit.filter(a=>a&&a.col!=='wkr');if(![0,7,14,30].includes(+o.settings.backupEvery))o.settings.backupEvery=14;else o.settings.backupEvery=+o.settings.backupEvery;return o}
let saveT,savePend=false;
function flushSave(){if(!savePend)return;try{localStorage.setItem(KEY,JSON.stringify(DB));savePend=false}catch(e){}}
['pagehide','beforeunload','blur'].forEach(ev=>addEventListener(ev,flushSave));document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushSave()});document.addEventListener('focusout',()=>setTimeout(flushSave,0));
function save(){const ind=$('#saveInd');ind.textContent='… جارٍ الحفظ';ind.className='save saving';clearTimeout(saveT);savePend=true;
 saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(DB));savePend=false;ind.textContent='✓ محفوظ '+new Date().toLocaleTimeString('ar-SA-u-nu-latn',{hour:'2-digit',minute:'2-digit'});ind.className='save'}
 catch(e){ind.textContent='✗ تعذّر الحفظ';ind.className='save';toast('تعذّر الحفظ: قد تكون مساحة التخزين ممتلئة (قلّل حجم الشعار أو صدّر نسخة احتياطية).')}},250)}
function audit(op,col,item){DB.audit.push({t:new Date().toISOString(),op,col,title:itemTitle(col,item)});if(DB.audit.length>1000)DB.audit.splice(0,DB.audit.length-1000)}
function itemTitle(c,x){if(!x)return'';return String(x.title||x.action||x.name||x.program||x.goal||x.teacher||x.student||x.parent||x.cls||x.staff||x.day||(c==='evals'&&x.type?x.type+' '+(x.date||''):'')||'').slice(0,80)}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3200)}
const hasSample=()=>COLS.some(c=>DB[c].some(x=>x.sample));

/* One-time merge of new built-in templates into existing data: adds only missing titles, never edits or re-adds deleted ones */

function mergeTemplates(){const done=new Set(DB.tplMerged||[]);let n=0;const norm=t=>String(t).replace(/\s+/g,' ').trim();
 TPL_V2.forEach(t=>{const key=t.period+'|'+t.title;if(done.has(key))return;if(!DB.templates.some(x=>norm(x.title)===norm(t.title))){DB.templates.push({id:uid(),...t});n++}done.add(key)});
 DB.tplMerged=[...done];if(n){audit('إضافة قوالب جديدة','templates',{title:n+' قالب'});save()}return n}
const OFFICIAL_COMS={"excel": {"name": "لجنة التميز", "display": "لجنة التميز", "tasks": ["إعداد الخطة التشغيلية للمدرسة، وربطها بمؤشرات القياس المؤسسي والتخصصي المعتمدة لها، ووضع توصيات دورية مرتبطة بمؤشرات القياس لضمان التحسين المستمر.", "تشجيع المعلمين على تبادل أفضل الممارسات لرفع المستوى التخصصي لدى الطلاب واقتراح التوصيات اللازمة في تطوير طرق التدريس وأساليب التقويم.", "إعداد استطلاعات قياس رضا المستفيدين من خدمات المدرسة، باستثناء استطلاعات التحصيل الدراسي للطلاب، وتحليل النتائج، ووضع التوصيات التحسينية.", "رصد اتجاهات الطلاب نحو المدرسة، وتقديم التوصيات اللازمة لمدير المدرسة.", "تقديم الاقتراحات والدعم نحو تحول المدرسة إلى مؤسسة متعلمة ذاتيا.", "دراسة الملاحظات على برامج التعليم والتعلم، وتقديم التوصيات اللازمة بشأنها.", "دراسة بيئة المدرسة وتقديم المقترحات التطويرية اللازمة بشأنها.", "دراسة الصعوبات والتحديات التي تواجه سير العمل في المدرسة وتقديم التوصيات.", "المساهمة في نشر ثقافة التميز في المدرسة، وفي دعم وتشجيع المتميزين من منسوبي المدرسة من هيئة تعليمية وإدارية وطلابية.", "العمل على إعداد وتطوير معايير جوائز التميز وجوائز منسوبي المدرسة.", "دراسة تسمية بعض مرافق المدرسة بأسماء أصحاب الإنجازات من منسوبيها.", "الإشراف على إدارة عمليات التقويم الذاتي والتدقيق الداخلي في المدرسة والعمل على تحسينها وفق معايير التقويم والاعتماد المعتمدة.", "دراسة تقارير تقويم الأداء المؤسسي وتعميمها واستثمار نتائجها في التخطيط لتطوير الأداء.", "ترشيح المدرسة/منسوبيها لجوائز التميز على المستوى المحلي والإقليمي والعالمي، والرفع لمدير المدرسة لعرض ما يلزم على اللجنة الإدارية."], "members": ["مدير المدرسة", "وكلاء المدرسة", "الموجه الطلابي", "رائد النشاط", "ثلاثة معلمين"], "formation": ["يصدر مدير المدرسة قراراً بتشكيل اللجنة.", "اختيار معلمين خبراء يتم من قبل مدير المدرسة، أو معلمين متقدمين في حال عدم توفر الخبراء، أو معلمين ممارسين في حال عدم توفر المعلمين الخبراء والمتقدمين."], "meetings": ["تعقد اللجنة اجتماعاتها مرة كل شهر وتسجل اجتماعاتها في محاضر يوقعها الأعضاء، ولمدير المدرسة دعوة اللجنة إلى اجتماعات طارئة وفق الحاجة، على أن لا تسبب هذه الاجتماعات إرباك/تعطيل اليوم الدراسي.", "توثيق اجتماعات اللجنة بمحاضر تدون في سجل خاص متضمن التوصيات ومتابعة القرارات.", "يتم اتخاذ التوصية في أي موضوع يطرح للنقاش من خلال التصويت بالأغلبية وعند تساوي الأصوات يغلب الطرف الذي فيه الرئيس."], "goal": "إعداد الخطة التشغيلية للمدرسة، وتشجيع أفضل الممارسات بين منسوبيها لضمان التميز المؤسسي والتخصصي بما يسهم في تجويد العمليات التربوية والتعليمية والتنظيمية في المدرسة، والارتقاء بكفاءة الأداء المؤسسي.", "freq": "شهري"}, "admin": {"name": "اللجنة الإدارية", "display": "اللجنة الإدارية (الجهة الإدارية للمدرسة)", "tasks": ["مناقشة الخطة التشغيلية للمدرسة المعدة من قبل لجنة التميز وإقرارها، ومتابعة تنفيذها بعد اعتمادها.", "متابعة تنفيذ الخطة التشغيلية المعتمدة، وفقاً لمؤشرات الأداء.", "مناقشة تقارير التحصيل الدراسي وتقارير نواتج تعلم الطلاب، وإقرار التوصيات المناسبة لها.", "إقرار توزيع الموارد المالية للمدرسة بمختلف أنواعها ومواردها، والمناقلة بين بنود الميزانية التشغيلية وفق الضوابط المنظمة لذلك وإقرار التقارير المالية، والتنسيق مع الإدارة المالية بالمنطقة أو المحافظة في إجراءات صرف المبالغ المخصصة.", "مناقشة الجوانب التطويرية للمدرسة وإقرار التوصيات المناسبة.", "مناقشة التحديات التي تواجه تحقيق أهداف المدرسة واتخاذ التوصيات اللازمة حيالها.", "مناقشة الاستعداد المدرسي للعام القادم، وإقرار احتياجات المدرسة من الموارد (البشرية والمادية) ومتابعة توفيرها.", "مناقشة القضايا والظواهر السلوكية في المدرسة واتخاذ التوصيات اللازمة حيالها.", "إقرار الأنشطة والفعاليات السنوية للمدرسة.", "إقرار الشراكات مع القطاعين الحكومي و الخاص وغير الربحي لدعم أو رعاية برامج المدرسة بما ينسجم مع الأهداف التربوية، ووفق الأنظمة واللوائح والتعليمات المنظمة لذلك.", "إقرار الشراكات مع مؤسسات المجتمع المحلي المحيط بالمدرسة، واقتراح الأنشطة المناسبة لدعم التواصل معها.", "مراجعة التقارير الدورية عن برامج وأنشطة الشراكة المجتمعية التي تم تنفيذها وإقرار التوصيات اللازمة."], "members": ["مدير المدرسة (رئيس اللجنة)", "وكلاء المدرسة (أعضاء)", "الموجه الطلابي (عضو)", "رائد النشاط (عضو)", "ثلاثة معلمين (أعضاء)", "مساعد إداري (مقرر اللجنة)"], "formation": ["يصدر مدير المدرسة قراراً بتشكيل اللجنة.", "يختار مدير المدرسة المعلمين، ويكون من بينهم معلم خبير على الأقل، أو معلم متقدم على الأقل في حال عدم توفر المعلم الخبير، أو معلمون ممارسون في حال عدم توفر المعلمين الخبراء والمتقدمين."], "meetings": ["تعقد اللجنة اجتماعاتها بدعوة من رئيسها مرة واحدة شهرياً، ولرئيس اللجنة أن يدعو لاجتماع طارئ عند الحاجة، على أن لا تتسبب هذه الاجتماعات بإرباك اليوم الدراسي.", "لرئيس اللجنة دعوة من يراه من غير الأعضاء للمشاركة في مناقشة أحد الموضوعات في جدول أعمال اللجنة، وفق الضوابط المنظمة لذلك.", "توثيق اجتماعات اللجنة بمحاضر رسمية وتدون في سجل خاص متضمن المناقشات والتوصيات والقرارات."], "goal": "إقرار خطة المدرسة التشغيلية، ومتابعة سير العملية التربوية والتعليمية، وتشجيع أوجه الإبداع والتميّز المدرسي بما يعزز التحصيل الدراسي للطالب ويحقق رسالة المدرسة، ومناقشة التحديات التي تواجه المدرسة واتخاذ التوصيات اللازمة بشأنها، للارتقاء بمستوى التعليم والتعلم.", "freq": "شهري"}, "achieve": {"name": "لجنة التحصيل الدراسي", "display": "لجنة التحصيل الدراسي", "tasks": ["متابعة المستوى التحصيلي للطلاب بشكل دوري وتحليله، ودراسة نتائج الطلاب للعام الدراسي السابق من جميع الجوانب، وإعداد التقارير اللازمة، ورفعها لمدير المدرسة لمناقشتها مع اللجنة الإدارية.", "تزويد معلمي المواد الدراسية بالتقارير المعتمدة لتحليل نتائج التحصيل للاختبارات بمختلف أنواعها والمتعلقة بتخصصية موادهم، وتوصيات اللجنة بشأنها.", "مراجعة نتائج الاختبارات الوطنية الخاصة بالمدرسة وتقديم المقترحات لتعزيز نقاط القوة ومعالجة نقاط الضعف.", "اقتراح البرامج التعليمية والأنشطة الطلابية المناسبة لرفع مستوى التحصيل الدراسي للطلاب في خطة المدرسة، وقياس مدى فاعليتها بعد تنفيذها.", "تقديم الدعم للهيئة التعليمية حول المفاهيم والأسس والآليات التي تُبنى عليها الاختبارات الوطنية والدولية، وتوفير جميع المتطلبات اللازمة للطلاب قبل تنفيذ الاختبارات الوطنية والدولية.", "تشكيل فرق العمل/اللجان الفرعية للاختبارات الفصلية والنهائية وتحديد مهام ومسؤوليات جميع أعضائها وفقاً للإجراءات المتبعة.", "إعداد جداول الاختبارات الفصلية والسجلات والملفات المتعلقة بالاختبارات في المدرسة.", "استلام مظاريف أوراق الأسئلة والإجابات الخاصة بها، وحفظها في الأماكن الآمنة المخصصة لها.", "إعداد الكشوفات وأرقام الجلوس للطلاب وتسليمها للفرق الفرعية المسؤولة عن عملية تنظيم الاختبارات.", "توضيح التعليمات للتعامل مع الحالات الطارئة (المرضية، مخالفة الأنظمة والتعليمات...) أثناء الاختبارات وتهيئة الأدوات والمكان المناسب.", "الإشراف على سير الاختبارات والبرامج التنفيذية المتعلقة بها بمختلف أنواعها بالمدرسة ومتابعتها، والتأكد من مدى سلامتها.", "متابعة عمليات التصحيح والمراجعة للاختبارات وتدقيق النتائج في المدرسة، ومتابعة أعمال الرصد وإخراج النتائج وتسليمها وحفظها.", "تقديم المقترحات التطويرية لآلية الاختبار وتقديمها للجهات المعنية، ومتابعة ومراجعة جميع التعديلات على آليات الاختبارات وتطبيقها.", "إعداد وتوثيق تقارير دورية عن أعمال اللجنة والمعوقات التي تواجهها ورفعها إلى مدير المدرسة لاتخاذ الإجراء اللازم.", "اقتراح برامج معالجة التأخر الدراسي واعتماد الحصص الإضافية لها وتكليف المعلمين وإشعار أولياء الأمور بالبرنامج.", "اقتراح البرامج والأنشطة اللاصفية التي تدعم نواتج التعليم والتعلم.", "قياس رضا أولياء الأمور عن التحصيل الدراسي ونتائجه، وإشراكهم في معالجات ضعف التحصيل الدراسي لأبنائهم.", "متابعة وقياس مدى فاعلية تطبيق معايير وإجراءات برنامج تحسين الأداء الكتابي والقرائي لدى الطلاب والطالبات في المرحلة الابتدائية، بما يسهم في رفع مستوى التحصيل الدراسي للطلاب بعد تنفيذ هذه الإجراءات."], "members": ["مدير المدرسة", "وكيل الشؤون التعليمية", "وكيل شؤون الطلاب", "الموجه الطلابي", "رائد النشاط", "ثلاثة معلمين (مقدم/خبير)"], "formation": ["المعلمين يتم اختيارهم من قبل مدير المدرسة.", "يصدر مدير المدرسة قراراً بتشكيل اللجنة."], "meetings": ["تعقد اللجنة اجتماعاتها بشكل دوري في كل فصل دراسي بما لا يقل عن اجتماعين، ولمدير المدرسة ورئيس اللجنة دعوة اللجنة إلى اجتماعات طارئة وفق الحاجة، على أن لا تتسبب هذه الاجتماعات بإرباك اليوم الدراسي.", "توثيق اجتماعات اللجنة بمحاضر رسمية وتدوين في سجل خاص متضمن المناقشات و التوصيات والقرارات."], "goal": "ضمان تطبيق اختبارات التحصيل الدراسي بما يسهم في تجويد العمليات التربوية والتعليمية والتنظيمية في المدرسة، والارتقاء بكفاءة الأداء التحصيلي ونواتج التعلم للمدرسة، وتدقيق واستخراج النتائج وفقاً للوائح والإجراءات والتعليمات المعتمدة.", "freq": "اجتماعان على الأقل كل فصل"}, "guide": {"name": "لجنة التوجيه الطلابي", "display": "لجنة التوجيه والإرشاد (التوجيه الطلابي)", "tasks": ["متابعة الخطة السنوية للإرشاد الطلابي في المدرسة، وتوزيع الأسابيع الدراسية حسب التعليمات المنظمة لذلك، وتنفيذها بعد اعتمادها.", "متابعة تطبيق قواعد السلوك والمواظبة على طلاب المدرسة، وإعداد معايير منح الحوافز للطلبة بهذا الخصوص وتخصيص ميزانية لذلك.", "متابعة توزيع الطلاب على الفصول حسب ما تراه اللجنة مع بداية العام الدراسي وفقاً للفروق الفردية بين الطلاب والاستعداد والميول.", "دراسة إضافة حصص علاجية أو إثرائية لبعض المواد الدراسية المقررة في الخطة الدراسية، بالتنسيق مع لجنة التحصيل الدراسي على ألا يترتب على ذلك مبالغ مالية للطلاب أو تعويض مادي للمعلمين وتكون في فراغات جداول المعلمين مما يكفل أنصبتهم الرسمية ولا يخل بحفاظ المدرسة.", "دراسة سلوك الطلاب ومواطنتهم على مستوى المدرسة، والعمل على تعزيز السلوك الإيجابي ومعالجة السلوك السلبي فيها.", "متابعة نتائج وأعمال المجالس الطلابية وتقديم الدعم لها وفقاً للتنظيمات والتعليمات المعتمدة، ودراسة التوصيات الواردة منها وعرضها على الأطراف المعنية في المدرسة، لاتخاذ الإجراءات اللازمة من قبل إدارة المدرسة.", "إعداد التقارير الفصلية عن أعمال التوجيه والإرشاد وأعمال اللجنة واعتمادها من مدير المدرسة ليتم رفعها إلى الجهة المختصة بمكتب التعليم /إدارة التعليم.", "التوصية بتحويل من لم تتم الموافقة على مواصلتهم الدراسة (مكرري الرسوب) إلى أقرب مدرسة لتعليم الكبار واعتماد التوصية والرفع بها من قبل مدير المدرسة ليتم إشعار إدارة / قسم التوجيه والإرشاد بمكتب التعليم / إدارة التعليم بذلك.", "دراسة أوضاع الطلاب المخالفين لإجراءات سير الاختبارات، وإقرار الخدمات الإرشادية اللازمة لهم.", "دراسة أعذار الطلاب الغائبين عن الاختبارات الفصلية والتحريرية، وإقرار مدى وجاهة العذر لدخول الطالب الاختبار البديل خلال الفترة المحددة.", "الإشراف على تنظيم لقاءات مع مؤسسات المجتمع المحلي للمدرسة، ومتابعة نتائجها والرفع بتقاريرها لمدير المدرسة.", "دراسة الشراكات مع مؤسسات المجتمع المحلي المحيط بالمدرسة، بما يدعم أهدافها، والرفع بها لمدير المدرسة للاعتماد.", "اتخاذ القرارات اللازمة بشأن حالات الطلاب الذين لم يتمكنوا من تحقيق مهارات الحد الأدنى وحالات التأخر الدراسي التي لم تبد تجاوزاً مع البرامج العلاجية، (المواءمة مع المادة الخامسة في لائحة تقويم الطالب بعد التعديل).", "متابعة و تقويم برامج رعاية الطلاب و دعمهم في المدرسة."], "members": ["وكيل المدرسة لشؤون الطلاب (رئيس اللجنة)", "وكيل المدرسة للشؤون التعليمية (عضو)", "ثلاثة معلمين (أعضاء)", "الموجه الطلابي (مقرر اللجنة)"], "formation": ["يصدر مدير المدرسة قراراً بتشكيل اللجنة.", "يشارك في اجتماع اللجنة وفقاً لإثبات أعضاء اللجنة من يستدعي حضوره دون التصويت على قرارات اللجنة، مثل: معلم الصف، معلم المادة، معلم التربية الخاصة، معلم الموهوبين، رائد النشاط، الطالب، ولي أمر الطالب."], "meetings": ["تعقد اللجنة اجتماعاتها بشكل شهري، ولرئيس اللجنة دعوة اللجنة إلى اجتماعات طارئة وفق الحاجة، على أن لا تتسبب هذه الاجتماعات بإرباك/تعطيل اليوم الدراسي.", "توثيق اجتماعات اللجنة بمحاضر رسمية وتدون في سجل خاص متضمن المناقشات والتوصيات والقرارات."], "goal": "التخطيط لبرامج التوجيه والإرشاد ومتابعة تنفيذها وتقويمها واقتراح البرامج التي تتناسب مع إمكانيات وحاجات المدرسة، والنظر في قضايا الطلاب.", "freq": "شهري"}};
const COM_KEYS={'لجنة التميز':'excel','اللجنة الإدارية':'admin','لجنة التحصيل الدراسي':'achieve','لجنة التوجيه الطلابي':'guide'};
const BUILTIN_COMS=[
 ['اللجنة الإدارية','متابعة سير العمل الإداري، وتوزيع المهام والتكليفات، واعتماد الخطط والجداول ومتابعة تنفيذها.'],
 ['لجنة التحصيل الدراسي','تحليل نتائج الطلاب، ومتابعة الخطط العلاجية والإثرائية، ورفع مستوى التحصيل في المواد.'],
 ['لجنة التوجيه الطلابي','دراسة الحالات السلوكية والدراسية، واعتماد البرامج الإرشادية والوقائية ومتابعة أثرها.'],
 ['لجنة التميز','متابعة التقويم الذاتي وخطط التحسين، وتطبيق معايير التميز المدرسي وتوثيق الشواهد.']];
const offCopy=k=>{const o=OFFICIAL_COMS[k];return {goal:o.goal,tasks:o.tasks.map((t,i)=>({id:'o'+(i+1),t})),members:[...o.members],formation:[...o.formation],meetings:[...o.meetings]}};
const comName=c=>c&&c.official&&OFFICIAL_COMS[c.official]?OFFICIAL_COMS[c.official].display:(c?c.name:'');
function mergeOfficial(){const norm=t=>String(t||'').replace(/\s+/g,' ').trim();let n=0;const oldDesc=new Set(BUILTIN_COMS.map(b=>b[1]));
 DB.committees.forEach(c=>{let k=c.official;if(!k){const nm=norm(c.name);k=Object.keys(OFFICIAL_COMS).find(x=>norm(OFFICIAL_COMS[x].name)===nm||norm(OFFICIAL_COMS[x].display)===nm);if(!k)return;c.official=k;n++}
  const o=offCopy(k);c.off=c.off&&typeof c.off==='object'?c.off:{};['goal','tasks','members','formation','meetings'].forEach(f=>{const v=c.off[f];if(v==null||v===''||(Array.isArray(v)&&!v.length)){c.off[f]=o[f];n++}});
  if(!c.freq){c.freq=OFFICIAL_COMS[k].freq;n++}if(c.tasks&&oldDesc.has(c.tasks)){c.tasks='';n++}if(!c.tdone||typeof c.tdone!=='object')c.tdone={}});
 if(n)save();return n}
function mergeCommittees(){const done=new Set(DB.comMerged||[]);let n=0;const norm=t=>String(t||'').replace(/\s+/g,' ').trim();
 BUILTIN_COMS.forEach(([name,tasks])=>{if(done.has(name))return;if(!DB.committees.some(x=>norm(x.name)===norm(name))){DB.committees.push({id:uid(),name,kind:'لجنة',head:'',members:'',tasks,date:today(),status:'سارية',builtin:true,created:new Date().toISOString()});n++}done.add(name)});
 DB.comMerged=[...done];if(n){audit('إضافة اللجان الأساسية','committees',{title:n+' لجنة'});save()}return n}
/* ---------- Derived ---------- */
const isOver=(c,x)=>{const k=S[c].date;return (c==='tasks'||c==='actions'||c==='oplan')&&x[k]&&x[k]<today()&&x.status!==DONE[c]};
const attRate=x=>{const e=+x.enrolled,a=+x.absent;return e>0?Math.round((e-a)/e*1000)/10:null};
function cellVal(c,k,x,hl){if(S[c].vc&&S[c].vc[k])return S[c].vc[k](x,true);if(k==='rate'){const r=attRate(x);return r==null?'—':r+'%'}
 const f=S[c].f.find(y=>y.k===k)||{};let v=x[k];
 if(f.type==='date')return fmtDate(v,DB.settings.hijri);
 if(k==='status'){const cls=/مكتملة|منجز|مغلقة|منفذ|سارية/.test(v)?'green':/متعثر|ملغى/.test(v)?'red':/قيد/.test(v)?'blue':'amber';return `<span class="pill ${cls}">${esc(v||'—')}</span>`}
 if(k==='priority')return `<span class="pill ${v==='عالية'?'red':v==='منخفضة'?'green':'amber'}">${esc(v||'')}</span>`;
 if(k==='progress')return `<div class="bar" style="min-width:70px" title="${+v||0}%"><i style="width:${Math.min(100,+v||0)}%"></i></div><span class="small">${+v||0}%</span>`;
 v=esc(v??'');if(hl)v=v.replace(new RegExp(hl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<mark class="hl">${m}</mark>`);return v||'—'}

/* ---------- Form dialog with validation ---------- */
function rowsLine(x,r){return `<div class="rw">${x.rc.map(cc=>`<input data-rk="${cc.k}" aria-label="${esc(cc.l)}" placeholder="${esc(cc.l)}" value="${esc(r[cc.k]??'')}" ${cc.num?'type="number" inputmode="decimal" step="any" min="0" max="100" data-novoice':cc.date?'type="date" data-novoice':'maxlength="500"'} ${cc.w?`style="flex:0 0 ${cc.w}"`:''}>`).join('')}<button type="button" class="btn sm ghost" data-rwdel aria-label="حذف المؤشر">🗑</button></div>`}
function openForm(c,item,onSaved){const sc=S[c],isNew=!item||!!item._new;item=item||{};
 const f=$('#dlgForm');
 f.innerHTML=`<div class="dlg-h"><span>${isNew?'إضافة':'تعديل'} ${sc.one}</span><button type="button" class="iconbtn" data-x aria-label="إغلاق">✕</button></div><div class="dlg-b">`+
 sc.f.map(x=>{if(x.type==='head')return `<div class="fld full fhead"><b>${esc(x.l)}</b></div>`;let v=item[x.k];if(v==null&&isNew){v=x.defFn?x.defFn():x.def==='today'?today():x.def??''}if(v==null)v='';const id='f_'+x.k;const req=x.req?' <span class="req">*</span>':'';
  let inp;const xo=x.optsFn?x.optsFn():x.opts;if(x.type==='select'&&x.optsFn)inp=`<select id="${id}" name="${x.k}">${xo.map(o=>`<option value="${esc(o)}" ${o===v?'selected':''}>${esc(o||'— بدون —')}</option>`).join('')}</select>`;else if(x.type==='select')inp=`<select id="${id}" name="${x.k}">${x.req&&!v?'<option value="">— اختر —</option>':''}${x.opts.map(o=>`<option ${fem(o)===fem(String(v))?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  else if(x.type==='textarea')inp=`<textarea id="${id}" name="${x.k}" maxlength="5000">${esc(v)}</textarea>`;
  else if(x.type==='rows')inp=`<div class="rowsed" data-rows="${x.k}" id="${id}">${(Array.isArray(v)&&v.length?v:[{}]).map(r=>rowsLine(x,r)).join('')}</div><button type="button" class="btn sm ghost" data-rowadd="${x.k}">＋ إضافة مؤشر</button>`;
  else if(x.listFn)inp=`<input id="${id}" name="${x.k}" value="${esc(v)}" maxlength="${x.max||300}" list="dl_${x.k}" autocomplete="off"><datalist id="dl_${x.k}">${x.listFn().map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`;
  else inp=`<input id="${id}" name="${x.k}" type="${x.type||'text'}" value="${esc(v)}" ${x.min!=null?`min="${x.min}"`:''} ${x.max!=null&&x.type==='number'?`max="${x.max}"`:''} maxlength="${x.max&&x.type!=='number'?x.max:300}" ${x.ph?`placeholder="${esc(x.ph)}"`:''} ${x.type==='number'?(x.dec?'inputmode="decimal" step="any"':'inputmode="numeric" step="1"'):''}>`;
  return `<div class="fld ${x.full?'full':''}"><label for="${id}">${esc(x.l)}${req}</label>${inp}<span class="err" id="e_${x.k}"></span></div>`}).join('')+
 `</div><div class="dlg-f"><button class="btn gold" value="ok" type="submit">حفظ (Ctrl+Enter)</button><button type="button" class="btn ghost" data-x>إلغاء</button>${!isNew?'<button type="button" class="btn red" data-del style="margin-inline-start:auto">حذف</button>':''}</div>`;
 f.innerHTML=fem(f.innerHTML);const dlg=$('#dlg');
 f.onsubmit=e=>{e.preventDefault();const data={};let ok=true;
  sc.f.forEach(x=>{if(x.type==='head')return;if(x.type==='rows'){const arr=[];let bad='';$$(`[data-rows="${x.k}"] .rw`,f).forEach(rw=>{const o={};x.rc.forEach(cc=>{const iv=$(`[data-rk="${cc.k}"]`,rw).value.trim();o[cc.k]=cc.num&&iv!==''?Number(iv):iv.slice(0,500);if(cc.num&&iv!==''&&(!Number.isFinite(o[cc.k])||o[cc.k]<0||o[cc.k]>100))bad='النسبة يجب أن تكون بين 0 و100'});if(x.rc.some(cc=>o[cc.k]!==''))arr.push(o)});$('#e_'+x.k).textContent=bad;if(bad)ok=false;data[x.k]=arr;return}const el=f.elements[x.k];let v=el.value.trim();const fe=$('#e_'+x.k);let err='';
   if(x.req&&v==='')err='هذا الحقل مطلوب';
   else if(x.type==='number'&&v!==''){const n=Number(v);if(!Number.isFinite(n)||(!x.dec&&!Number.isInteger(n)))err=x.dec?'أدخل رقماً':'أدخل رقماً صحيحاً';else if(x.min!=null&&n<x.min)err='الحد الأدنى '+x.min;else if(x.max!=null&&n>x.max)err='الحد الأعلى '+x.max;else v=n}
   else if(x.type==='date'&&v!==''&&isNaN(parseD(v)))err='تاريخ غير صالح';
   fe.textContent=err;el.closest('.fld').classList.toggle('bad',!!err);if(err)ok=false;data[x.k]=v});
  if(c==='attendance'&&ok){if(data.absent>data.enrolled){ok=false;$('#e_absent').textContent='الغائبون أكثر من المقيدين'}if((+data.excused||0)>data.absent){ok=false;$('#e_excused').textContent='أكبر من عدد الغائبين'}}
  if(c==='committees'&&ok&&data.end&&data.date&&data.end<data.date){ok=false;$('#e_end').textContent='قبل تاريخ التكليف'}
  if(c==='oplan'&&ok&&data.start&&data.end&&data.end<data.start){ok=false;$('#e_end').textContent='قبل تاريخ البداية'}
  if(c==='duty'&&ok&&data.to&&data.from&&data.to<data.from){ok=false;$('#e_to').textContent='قبل تاريخ البداية'}
  if(!ok){const b=f.querySelector('.bad input,.bad select,.bad textarea');b&&b.focus();return}
  const wasDone=item.status;
  if(isNew){const n={id:uid(),created:new Date().toISOString(),...data};DB[c].push(n);audit('إضافة',c,n);item=n}
  else{Object.assign(item,data,{updated:new Date().toISOString()});delete item.sample;audit('تعديل',c,item)}
  if(c==='tasks')maybeRecur(item,wasDone);
  if((c==='actions'||c==='oplan')&&item.status==='منجز')item.progress=100;
  save();dlg.close();toast('تم الحفظ');onSaved?onSaved():render()};
 f.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();f.requestSubmit()}};
 $$('[data-x]',f).forEach(b=>b.onclick=()=>dlg.close());
 $$('[data-rowadd]',f).forEach(b=>b.onclick=()=>{const x=sc.f.find(y=>y.k===b.dataset.rowadd);const box=$(`[data-rows="${x.k}"]`,f);box.insertAdjacentHTML('beforeend',rowsLine(x,{}));voiceWire(box);$('.rw:last-child input',box).focus()});
 f.addEventListener('click',e=>{const d=e.target.closest('[data-rwdel]');if(!d)return;const box=d.closest('.rowsed');d.closest('.rw').remove();if(!box.querySelector('.rw')){const x=sc.f.find(y=>y.k===box.dataset.rows);box.insertAdjacentHTML('beforeend',rowsLine(x,{}))}});
 const del=$('[data-del]',f);if(del)del.onclick=()=>{if(!confirm('حذف هذا السجل نهائياً؟'))return;DB[c]=DB[c].filter(x=>x.id!==item.id);delFilesOf(c,item.id);audit('حذف',c,item);save();dlg.close();toast('تم الحذف');render()};
 dlg.showModal();setTimeout(()=>{const first=f.querySelector('.dlg-b input,.dlg-b select,.dlg-b textarea');first&&first.focus()},30)}

function nextDue(d,r){const x=parseD(d||today());if(r==='يومي')x.setDate(x.getDate()+1);else if(r==='أسبوعي')x.setDate(x.getDate()+7);else if(r==='شهري')x.setMonth(x.getMonth()+1);else if(r==='فصلي')x.setMonth(x.getMonth()+3);return iso(x)}
function maybeRecur(t,prev){if(t.status==='مكتملة'&&prev!=='مكتملة'&&t.recur&&t.recur!=='لا يتكرر'&&!t.recurred){t.recurred=1;t.doneAt=today();
 let nd=nextDue(t.due,t.recur);while(nd<today())nd=nextDue(nd,t.recur);
 const n={...t,id:uid(),due:nd,status:'جديدة',created:new Date().toISOString()};delete n.recurred;delete n.doneAt;delete n.sample;DB.tasks.push(n);audit('تكرار تلقائي','tasks',n);toast('أُنشئت المهمة التالية بتاريخ '+nd)}
 if(t.status==='مكتملة'&&!t.doneAt)t.doneAt=today()}

/* ---------- Views ---------- */
const OFFICIAL_LINKS=[
 {n:'نظام فارس',d:'الخدمة الذاتية لمنسوبي التعليم',ic:'🧾',u:'https://sshr.moe.gov.sa/OA_HTML/AppsLocalLogin.jsp'},
 {n:'نظام نور',d:'نظام الإدارة التربوية',ic:'📘',u:'https://noor.moe.gov.sa/'},
 {n:'منصة مدرستي',d:'منصة التعلم الإلكتروني',ic:'🏫',u:'https://schools.madrasati.sa/'},
 {n:'منصة تميّز',d:'التقويم والاعتماد المدرسي — هيئة تقويم التعليم والتدريب',ic:'🏅',u:'https://se.etec.gov.sa/'},
 {n:'مستقبلهم',d:'الموقع الرسمي للتطبيق',ic:'🌱',u:'https://www.etec.gov.sa/ar/programs/mustaqbalhum'},
 {n:'مستقبلهم — App Store',d:'تحميل لأجهزة آيفون',ic:'🍏',u:'https://apps.apple.com/sa/app/id6446278845'},
 {n:'مستقبلهم — Google Play',d:'تحميل لأجهزة أندرويد',ic:'▶️',u:'https://play.google.com/store/apps/details?id=sa.gov.etec.mustaqbalhum'}];
function linksCard(){return `<div class="card offl"><h3>🔗 روابط الأنظمة الرسمية</h3><div class="offl-g">${OFFICIAL_LINKS.map(l=>`<a class="offl-c" href="${l.u}" target="_blank" rel="noopener noreferrer"><b>${l.ic} ${l.n}</b><small>${l.d}</small></a>`).join('')}</div></div>`}
const view=()=>(location.hash||'#dashboard').slice(1).split('?')[0];
const flt={};
function listView(c){const sc=S[c];const F=flt[c]=flt[c]||{q:'',status:'',domain:'',from:'',to:''};
 const hasSt=sc.f.find(x=>x.k==='status'),hasDom=sc.f.find(x=>x.k==='domain'),dk=sc.date;
 let rows=DB[c].filter(x=>{if(F.status==='__over'){if(!isOver(c,x))return false}else if(F.status&&x.status!==F.status)return false;if(F.domain&&x.domain!==F.domain)return false;
  if(F.from&&(x[dk]||'')<F.from)return false;if(F.to&&(x[dk]||'9')>F.to)return false;if(F.q&&!JSON.stringify(x).toLowerCase().includes(F.q.toLowerCase()))return false;return true});
 rows.sort((a,b)=>c==='oplan'?(DOMAINS.indexOf(a.domain)-DOMAINS.indexOf(b.domain))||String(a.end||'9').localeCompare(String(b.end||'9')):c==='tasks'||c==='actions'?String(a[dk]||'9').localeCompare(String(b[dk]||'9')):String(b[dk]||'').localeCompare(String(a[dk]||'')));
 const over=DB[c].filter(x=>isOver(c,x)).length;
 let extra='';
 if(c==='attendance'&&rows.length){const e=rows.reduce((s,x)=>s+(+x.enrolled||0),0),a=rows.reduce((s,x)=>s+(+x.absent||0),0);extra=`<div class="muted small" style="margin-bottom:8px">إجمالي المعروض: المقيدون ${e} — الغائبون ${a} — نسبة الحضور ${e?Math.round((e-a)/e*1000)/10+'%':'—'}</div>`}
 if(c==='activities'&&rows.length){extra=`<div class="muted small" style="margin-bottom:8px">المنفذ: ${rows.filter(x=>x.status==='منفذ').length} من ${rows.length} — إجمالي المشاركين: ${rows.reduce((s,x)=>s+(+x.participants||0),0)}</div>`}
 const help={gcases:'بيانات الحالات الفردية حساسة: تُحفظ على هذا الجهاز فقط؛ احرص على حماية الجهاز وعدم مشاركة النسخ الاحتياطية.',tasks:'التذكير يعمل والتطبيق/التبويب مفتوح أو التطبيق المثبّت قيد التشغيل. المهام المتكررة تُنشأ نسختها التالية تلقائياً عند الإنجاز.',events:'المواعيد المضافة من القوالب تشمل فقط المناسبات ذات التاريخ الميلادي الثابت؛ ما عداها حدّد تاريخه من التقويم المعتمد.'}[c];
 return `<div class="head"><div><h2>${sc.t}</h2><div class="muted small">${DB[c].length} سجل${over?` — <b style="color:var(--bad)">${over} متأخر</b>`:''}</div></div>
 <div class="btns"><button class="btn gold" data-act="add" data-c="${c}">＋ إضافة ${sc.one}</button>${c==='tasks'?'<a class="btn ghost" href="#templates">من القوالب</a>':''}${c==='events'?'<button class="btn ghost" data-act="occ">إضافة المناسبات المعتادة</button>':''}<button class="btn ghost" data-act="csv" data-c="${c}">CSV</button><button class="btn ghost" data-act="xls" data-c="${c}">Excel</button><button class="btn ghost" data-act="print" data-c="${c}">طباعة</button></div></div>
 ${help?`<div class="card small muted" style="padding:10px 14px">ℹ️ ${help}</div>`:''}
 <div class="card"><div class="filters"><input type="search" placeholder="تصفية…" data-f="q" value="${esc(F.q)}" aria-label="تصفية">
 ${hasSt?`<select data-f="status" aria-label="الحالة"><option value="">كل الحالات</option>${(c==='tasks'||c==='actions'||c==='oplan')?`<option value="__over" ${F.status==='__over'?'selected':''}>المتأخرة فقط</option>`:''}${hasSt.opts.map(o=>`<option ${o===F.status?'selected':''}>${o}</option>`).join('')}</select>`:''}
 ${hasDom?`<select data-f="domain" aria-label="المجال"><option value="">كل المجالات</option>${DOMAINS.map(o=>`<option ${o===F.domain?'selected':''}>${o}</option>`).join('')}</select>`:''}
 <label class="small">من <input type="date" data-f="from" value="${F.from}"></label><label class="small">إلى <input type="date" data-f="to" value="${F.to}"></label></div>${extra}
 ${c==='tasks'?taskTabs(F)+(rows.length?taskCards(rows.filter(x=>!F.period||x.period===F.period),F):''):''}${c==='tasks'&&rows.length?'':rows.length?table(c,rows,sc.cols,F.q):`<div class="empty">لا توجد سجلات${DB[c].length?' مطابقة للتصفية':' بعد. ابدأ بإضافة '+sc.one+'.'}</div>`}</div>`}
function table(c,rows,cols,hl){return `<div class="tbl-wrap"><table class="resp"><thead><tr>${cols.map(k=>`<th>${esc(lbl(c,k))}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map(x=>`<tr class="${isOver(c,x)?'over':''}">${cols.map(k=>`<td data-l="${esc(lbl(c,k))}"><span class="cv">${cellVal(c,k,x,hl)}</span>${k===cols[0]&&x.sample?' <span class="pill sample">تجريبي</span>':''}${k===S[c].date&&isOver(c,x)?' <span class="pill red">متأخرة</span>':''}</td>`).join('')}<td data-l="">${c==='tasks'&&x.status!=='مكتملة'?`<button class="btn sm gold" data-act="done" data-c="${c}" data-id="${x.id}" title="تعليم كمكتملة">✓</button> `:''}${evBtn(c,x.id)} <button class="btn sm ghost" data-act="edit" data-c="${c}" data-id="${x.id}">تعديل</button></td></tr>`).join('')}</tbody></table></div>`}

function stats(){const t=today(),m=t.slice(0,7),wk=addDays(t,-6),d30=addDays(t,-29);
 const att=DB.attendance.filter(x=>x.date>=d30&&x.date<=t),e=att.reduce((s,x)=>s+(+x.enrolled||0),0),ab=att.reduce((s,x)=>s+(+x.absent||0),0);
 const tod=DB.attendance.filter(x=>x.date===t),te=tod.reduce((s,x)=>s+(+x.enrolled||0),0),ta=tod.reduce((s,x)=>s+(+x.absent||0),0);
 const tk=DB.tasks,done=tk.filter(x=>x.status==='مكتملة').length;
 return{attRate:e?Math.round((e-ab)/e*1000)/10:null,attDays:new Set(att.map(x=>x.date)).size,todAbs:te?ta:null,todRate:te?Math.round((te-ta)/te*1000)/10:null,
  taskPct:tk.length?Math.round(done/tk.length*100):null,tasks:tk.length,done,over:tk.filter(x=>isOver('tasks',x)).length,dueToday:tk.filter(x=>x.due===t&&x.status!=='مكتملة').length,
  incM:DB.incidents.filter(x=>(x.date||'').startsWith(m)).length,incOpen:DB.incidents.filter(x=>x.status!=='مغلقة').length,
  visM:DB.visits.filter(x=>(x.date||'').startsWith(m)).length,visW:DB.visits.filter(x=>x.date>=wk&&x.date<=t).length,
  actPct:DB.actions.length?Math.round(DB.actions.reduce((s,x)=>s+(x.status==='منجز'?100:+x.progress||0),0)/DB.actions.length):null,actOver:DB.actions.filter(x=>isOver('actions',x)).length,
  review:reviewPct(),gProg:DB.guidance.filter(x=>x.date>=addDays(t,-89)&&x.date<=t),gOpen:DB.gcases.filter(x=>x.status!=='مغلقة').length,gDue:DB.gcases.filter(x=>x.status!=='مغلقة'&&x.next&&x.next<=t).length,gPlan:DB.gplan.length?Math.round(DB.gplan.filter(x=>x.status==='منفذ').length/DB.gplan.length*100):null,ev:FILES.length,opPct:DB.oplan.length?Math.round(DB.oplan.reduce((a,x)=>a+(x.status==='منجز'?100:+x.progress||0),0)/DB.oplan.length):null,pdHours:DB.pd.filter(x=>x.status!=='ملغى'&&x.status!=='مخطط').reduce((a,x)=>a+(+x.hours||0),0),pdCount:DB.pd.filter(x=>x.status==='منفذ').length,pdBen:DB.pd.filter(x=>x.status==='منفذ').reduce((a,x)=>a+(+x.count||0),0),pdPlan:ratio(DB.pdplan.filter(x=>x.status!=='ملغى'),x=>x.status==='منفذ'),opOver:DB.oplan.filter(x=>isOver('oplan',x)).length}}
function reviewPct(dom){const ds=dom?[dom]:DOMAINS;let s=0,n=0;ds.forEach(d=>REVIEW[d].forEach((_,i)=>{const v=(DB.review[d]||{})[i];if(v&&v.s!=null&&v.s!==''){s+=+v.s;n++}}));return n?Math.round(s/(n*2)*100):null}
const K=(l,v,s,cl='')=>`<div class="kpi ${cl}"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`;
/* ---------- Hand-made SVG charts ---------- */
const ratio=(a,f)=>a.length?Math.round(a.filter(f).length/a.length*100):null;
const avgProg=(a,done)=>a.length?Math.round(a.reduce((s,x)=>s+(x.status===done?100:+x.progress||0),0)/a.length):null;
function ring(l,p,sub,href){const r=34,C=2*Math.PI*r,v=p==null?0:Math.max(0,Math.min(100,p));const col=p==null?'var(--line)':v>=75?'var(--ok)':v>=40?'var(--gold)':'var(--bad)';
 return `<a class="ring" href="${href||'#'}" title="${esc(l)}"><svg viewBox="0 0 84 84" role="img" aria-label="${esc(l)} ${p==null?'لا بيانات':v+'%'}"><circle cx="42" cy="42" r="${r}" class="rg-bg"/><circle cx="42" cy="42" r="${r}" class="rg-fg" style="stroke:${col};--c:${C.toFixed(1)};--o:${(C*(1-v/100)).toFixed(1)}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-v/100)).toFixed(1)}" transform="rotate(-90 42 42)"/><text x="42" y="47" text-anchor="middle" class="rg-t">${p==null?'—':v+'%'}</text></svg><div class="rg-l">${esc(l)}</div><div class="rg-s">${p==null?'لا توجد بيانات':esc(sub||'')}</div></a>`}
function chartsBlock(){const t=today();
 const rings=[
  ['المهام',ratio(DB.tasks,x=>x.status==='مكتملة'),DB.tasks.length+' مهمة','#tasks'],
  ['الخطة التشغيلية',avgProg(DB.oplan,'منجز'),DB.oplan.length+' بند','#oplan'],
  ['المراجعة الذاتية',reviewPct(),'المجالات الأربعة','#review'],
  ['خطة التحسين',avgProg(DB.actions,'منجز'),DB.actions.length+' إجراء','#actions'],
  ['خطة التوجيه',ratio(DB.gplan,x=>x.status==='منفذ'),DB.gplan.length+' برنامج','#gplan'],
  ['الحالات الفردية المغلقة',ratio(DB.gcases,x=>x.status==='مغلقة'),DB.gcases.length+' حالة','#gcases'],
  ['النشاط الطلابي المنفذ',ratio(DB.activities.filter(x=>x.status!=='ملغى'),x=>x.status==='منفذ'),DB.activities.length+' نشاط','#activities'],
  ['المناسبات المنفذة',ratio(DB.events.filter(x=>x.status!=='ملغى'&&x.date&&x.date<=t),x=>x.status==='منفذ'),'حتى اليوم','#events'],
  ['الزيارات الموثقة بتوصيات',ratio(DB.visits,x=>(x.followup||x.improve||'').trim()),DB.visits.length+' زيارة','#visits'],
  ['متابعات المعلمين المغلقة',ratio(DB.followups,x=>x.status==='مغلقة'),DB.followups.length+' متابعة','#followups'],
  ['حالات السلوك المغلقة',ratio(DB.incidents,x=>x.status==='مغلقة'),DB.incidents.length+' حالة','#incidents'],
  ['محاضر الاجتماعات الموثقة',ratio(DB.meetings,x=>(x.minutes||x.decisions||'').trim()),DB.meetings.length+' اجتماع','#meetings'],
  ['تواصل أولياء الأمور المغلق',ratio(DB.parents,x=>x.status==='مغلقة'),DB.parents.length+' تواصل','#parents'],
  ['إنجاز مهام اللجان',(()=>{const a=DB.committees.map(comPct).filter(Boolean);const T=a.reduce((s,x)=>s+x.total,0);return T?Math.round(a.reduce((s,x)=>s+x.done,0)/T*100):null})(),DB.committees.filter(c=>comPct(c)).length+' لجنة بمهام','#committees'],
  ['اللجان الفاعلة (اجتماع خلال 60 يوماً)',ratio(DB.committees.filter(x=>x.status!=='منتهية'),c=>comMeetings(c).some(m=>m.date>=addDays(t,-60))),DB.committees.filter(x=>x.status!=='منتهية').length+' لجنة سارية','#committees'],
  ['قياس الأثر: برامج أثرها مرتفع',ratio(DB.impact.filter(x=>impScore(x)!=null),x=>impScore(x)>=85),DB.impact.filter(x=>impScore(x)!=null).length+' برنامج مُقاس من '+DB.impact.length,'#impact'],
  ['متوسط الاستجابة للاستبانات',(()=>{const a=DB.surveys.map(svRate).filter(v=>v!=null);return a.length?Math.min(100,Math.round(a.reduce((x,y)=>x+y,0)/a.length)):null})(),DB.surveys.length+' استبانة — '+DB.surveys.reduce((a,s)=>a+(s.resp||[]).length,0)+' رد','#surveys'],
  ['تطبيق نماذج النمو المهني (منفذ/معتمد)',ratio(DB.tpd,x=>x.status==='منفذ'||x.status==='معتمد'),DB.tpd.length+' تطبيق — '+new Set(DB.tpd.map(x=>x.teacher)).size+' معلم','#tpd'],
  ['إجراءات الاختبارات المنفذة',ratio(DB.exact.filter(x=>x.status!=='ملغى'),x=>x.status==='منفذ'),DB.exact.length+' إجراء — '+DB.exmeet.length+' اجتماع','#exams'],
  ['خطة النمو المهني',ratio(DB.pdplan.filter(x=>x.status!=='ملغى'),x=>x.status==='منفذ'),DB.pdplan.length+' برنامج','#pdplan'],
  ['برامج النمو المهني المنفذة',ratio(DB.pd.filter(x=>x.status!=='ملغى'),x=>x.status==='منفذ'),DB.pd.reduce((a,x)=>a+(x.status==='منفذ'?+x.hours||0:0),0)+' ساعة','#pd'],
  ['تغطية أيام المناوبة',DB.duty.length?Math.round(new Set(DB.duty.map(x=>x.day)).size/5*100):null,new Set(DB.duty.map(x=>x.day)).size+' من 5 أيام','#duty']];
 // domain bars (operational plan)
 const dom=DOMAINS.map(d=>{const a=DB.oplan.filter(x=>x.domain===d);return [d,avgProg(a,'منجز'),a.length]});
 const W=520,bh=26,gap=14,H=DOMAINS.length*(bh+gap)+10;
 const dbars=DB.oplan.length?`<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="إنجاز الخطة التشغيلية حسب المجال">${dom.map(([d,p,n],i)=>{const y=i*(bh+gap)+6,w=(p||0)/100*(W-200);return `<text x="${W-4}" y="${y+18}" text-anchor="end" class="ct">${d}</text><rect x="70" y="${y}" width="${W-200}" height="${bh}" rx="8" class="cb-bg"/><rect x="${70+(W-200)-w}" y="${y}" width="${w}" height="${bh}" rx="8" class="cb anim" style="fill:var(--d${i+1})"/><text x="62" y="${y+18}" text-anchor="end" class="ct b">${n?p+'%':'—'}</text>`}).join('')}</svg>`:'<div class="empty">لا توجد بنود في الخطة التشغيلية بعد</div>';
 // attendance line 30 days
 const days=[];for(let i=29;i>=0;i--)days.push(addDays(t,-i));
 const pts=days.map((d,i)=>{const a=DB.attendance.filter(x=>x.date===d),e=a.reduce((s,x)=>s+(+x.enrolled||0),0),ab=a.reduce((s,x)=>s+(+x.absent||0),0);return e?{i,d,v:(e-ab)/e*100}:null}).filter(Boolean);
 const LW=560,LH=200,px=i=>LW-30-(i/29)*(LW-60),py=v=>LH-30-(Math.max(0,v-50)/50)*(LH-50);
 const line=pts.length?`<svg viewBox="0 0 ${LW} ${LH}" class="chart" role="img" aria-label="نسبة الحضور خلال 30 يوماً">${[50,75,100].map(v=>`<line x1="30" x2="${LW-30}" y1="${py(v)}" y2="${py(v)}" class="cg"/><text x="${LW-4}" y="${py(v)+4}" text-anchor="end" class="ct s">${v}%</text>`).join('')}
  ${pts.length>1?`<polyline points="${pts.map(p=>px(p.i)+','+py(p.v)).join(' ')}" class="cl anim-l"/>`:''}${pts.map(p=>`<circle cx="${px(p.i)}" cy="${py(p.v)}" r="4" class="cd"><title>${p.d}: ${p.v.toFixed(1)}%</title></circle>`).join('')}
  <text x="${LW-30}" y="${LH-8}" text-anchor="middle" class="ct s">${days[0].slice(5)}</text><text x="30" y="${LH-8}" text-anchor="middle" class="ct s">اليوم</text></svg>`:'<div class="empty">لم يُسجَّل حضور خلال آخر 30 يوماً</div>';
 // stacked tasks by period
 const per=PERIODS.map(p=>{const a=DB.tasks.filter(x=>x.period===p);return {p,d:a.filter(x=>x.status==='مكتملة').length,o:a.filter(x=>isOver('tasks',x)).length,n:a.filter(x=>x.status!=='مكتملة'&&!isOver('tasks',x)).length}});
 const mx=Math.max(1,...per.map(x=>x.d+x.o+x.n)),SW=560,SH=220,cw=(SW-40)/5;
 const stack=DB.tasks.length?`<svg viewBox="0 0 ${SW} ${SH}" class="chart" role="img" aria-label="المهام حسب الفترة">${per.map((x,i)=>{const cx=SW-20-cw*(i+.5),bw=Math.min(54,cw*.55),u=(SH-60)/mx;let y=SH-35;const seg=(v,cl)=>{if(!v)return'';y-=v*u;return `<rect x="${cx-bw/2}" y="${y}" width="${bw}" height="${v*u}" class="${cl} anim-v"><title>${v}</title></rect>`};
   return seg(x.d,'s-done')+seg(x.n,'s-pend')+seg(x.o,'s-over')+`<text x="${cx}" y="${y-6}" text-anchor="middle" class="ct b">${x.d+x.n+x.o||''}</text><text x="${cx}" y="${SH-14}" text-anchor="middle" class="ct">${PICON[x.p]} ${x.p}</text>`}).join('')}</svg>
   <div class="legend"><span><i class="s-done"></i>منجزة</span><span><i class="s-pend"></i>قيد الانتظار</span><span><i class="s-over"></i>متأخرة</span></div>`:'<div class="empty">لا توجد مهام بعد</div>';
 // incidents per month (last 6)
 const ms=[];{const d=new Date();d.setDate(1);for(let i=5;i>=0;i--){const x=new Date(d.getFullYear(),d.getMonth()-i,1);ms.push(x.getFullYear()+'-'+pad(x.getMonth()+1))}}
 const ic=ms.map(m=>({m,n:DB.incidents.filter(x=>(x.date||'').startsWith(m)).length,pos:DB.incidents.filter(x=>(x.date||'').startsWith(m)&&x.type==='سلوك إيجابي').length}));const imx=Math.max(1,...ic.map(x=>x.n)),IW=560,IH=200,iw=(IW-40)/6;
 const inc=DB.incidents.length?`<svg viewBox="0 0 ${IW} ${IH}" class="chart" role="img" aria-label="حالات السلوك شهرياً">${ic.map((x,i)=>{const cx=IW-20-iw*(i+.5),h=x.n/imx*(IH-70),bw=Math.min(46,iw*.5);const mn=new Date(x.m+'-01T00:00:00').toLocaleDateString('ar-SA-u-ca-gregory',{month:'short'});return `<rect x="${cx-bw/2}" y="${IH-35-h}" width="${bw}" height="${h}" rx="6" class="s-inc anim-v"><title>${x.n}</title></rect><text x="${cx}" y="${IH-41-h}" text-anchor="middle" class="ct b">${x.n||''}</text><text x="${cx}" y="${IH-14}" text-anchor="middle" class="ct">${mn}</text>`}).join('')}</svg>`:'<div class="empty">لا توجد حالات سلوك مسجلة</div>';
 return `<div class="card"><h3>📈 مؤشرات الإنجاز</h3><div class="rings">${rings.map(r=>ring(...r)).join('')}</div></div>
 <div class="grid two"><div class="card"><h3>إنجاز الخطة التشغيلية حسب المجال</h3>${dbars}</div><div class="card"><h3>نسبة حضور الطلاب — آخر 30 يوماً</h3>${line}</div></div>
 <div class="grid two"><div class="card"><h3>المهام حسب الفترة</h3>${stack}</div><div class="card"><h3>حالات السلوك والحوادث شهرياً</h3>${inc}</div></div>`}
function dashboard(){const st=stats(),t=today(),soon=addDays(t,30);
 const up=[...DB.events.filter(x=>x.date>=t&&x.date<=soon&&x.status!=='ملغى').map(x=>({...x,_k:'مناسبة'})),...DB.activities.filter(x=>x.date>=t&&x.date<=soon&&x.status!=='ملغى').map(x=>({...x,_k:'نشاط'})),...DB.gplan.filter(x=>x.date>=t&&x.date<=soon&&x.status==='مخطط').map(x=>({...x,_k:'توجيه'}))].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);
 const dueList=DB.tasks.filter(x=>x.status!=='مكتملة'&&x.due&&x.due<=addDays(t,7)).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,8);
 const empty=!COLS.some(c=>DB[c].length);
 return `<div class="head"><div><h2>${esc(DB.settings.school||'لوحة قيادة المدرسة')}</h2><div class="muted small">${DB.settings.principal?esc(leaderLbl())+': '+esc(DB.settings.principal)+' — ':''}${schoolMeta()?esc(schoolMeta())+' — ':''}${supInfo()?esc(supInfo())+' — ':''}${fmtDate(t)}</div></div>
 <div class="btns"><button class="btn gold" data-act="add" data-c="tasks">＋ مهمة</button><button class="btn ghost" data-act="add" data-c="attendance">＋ حضور اليوم</button><button class="btn ghost" data-act="add" data-c="visits">＋ زيارة</button><button class="btn ghost" data-act="weekly">التقرير الأسبوعي</button></div></div>
 ${empty?`<div class="card"><h3>مرحباً بك 👋</h3><p class="muted">لا توجد بيانات بعد. ابدأ من <a href="#settings">الإعدادات</a> بإدخال اسم المدرسة والشعار، ثم أضف المهام من <a href="#templates">القوالب الجاهزة</a> وسجّل الحضور والزيارات. بياناتك محفوظة على هذا الجهاز فقط — صدّر نسخة احتياطية دورياً. يمكنك أيضاً تحميل <b>بيانات تجريبية</b> معلَّمة للتعرّف على اللوحة ثم حذفها.</p><button class="btn ghost" data-act="sample">تحميل بيانات تجريبية</button></div>`:''}
 <div class="grid kpis">
 ${K('نسبة حضور الطلاب (30 يوماً)',st.attRate==null?'—':st.attRate+'%',st.attRate==null?'لم يُسجَّل حضور':'من '+st.attDays+' يوم مسجّل','green')}
 ${K('غياب اليوم',st.todAbs==null?'—':st.todAbs,st.todRate==null?'لم يُسجَّل غياب اليوم':'نسبة الحضور '+st.todRate+'%')}
 ${K('إنجاز المهام',st.taskPct==null?'—':st.taskPct+'%',st.tasks?st.done+' من '+st.tasks+' مهمة':'لا توجد مهام','gold')}
 ${K('مهام متأخرة',st.over,st.dueToday+' مستحقة اليوم',st.over?'red':'')}
 ${K('السلوك والحوادث (هذا الشهر)',st.incM,st.incOpen+' حالة مفتوحة',st.incOpen?'red':'')}
 ${K('الزيارات الصفية (هذا الشهر)',st.visM,st.visW+' خلال 7 أيام')}
 ${K('إنجاز الخطة التشغيلية',st.opPct==null?'—':st.opPct+'%',DB.oplan.length?(st.opOver?st.opOver+' بند متأخر':DB.oplan.length+' بند — لا متأخر'):'لا توجد بنود','gold')}
 ${K('بنود الخطة التشغيلية المتأخرة',st.opOver,'<a href="#oplan">فتح الخطة</a>',st.opOver?'red':'')}
 ${K('إنجاز خطة التحسين',st.actPct==null?'—':st.actPct+'%',st.actOver?st.actOver+' إجراء متأخر':DB.actions.length+' إجراء','gold')}
 ${K('المراجعة الذاتية',st.review==null?'—':st.review+'%','متوسط المجالات الأربعة')}
 ${K('برامج التوجيه الطلابي (90 يوماً)',st.gProg.length,st.gProg.reduce((a,x)=>a+(+x.beneficiaries||0),0)+' مستفيد','green')}
 ${K('الحالات الفردية المفتوحة',st.gOpen,st.gDue?st.gDue+' متابعة مستحقة':'لا متابعات مستحقة',st.gDue?'red':'')}
 ${K('تنفيذ خطة التوجيه',st.gPlan==null?'—':st.gPlan+'%',DB.gplan.length+' برنامج مخطط','gold')}
 ${K('ساعات النمو المهني المنفذة',st.pdHours,st.pdCount+' برنامج — '+st.pdBen+' مستفيد','green')}
 ${K('تنفيذ خطة النمو المهني',st.pdPlan==null?'—':st.pdPlan+'%',DB.pdplan.length+' برنامج مخطط','gold')}
 ${(()=>{const x=evLatest();return K('آخر نتيجة تقويم مدرسي',x&&evNum(x.overall)!=null?x.overall+'%':'—',x?(x.type||'')+' — '+fmtPlain(x.date):'لم يُسجَّل تقويم','blue')})()}
 ${K('متوسط تحقق مؤشرات الأثر',(()=>{const a=DB.impact.map(impScore).filter(v=>v!=null);return a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length)+'%':'—'})(),DB.impact.length+' برنامج/مبادرة','green')}
 ${K('ردود الاستبانات',DB.surveys.reduce((a,s)=>a+(s.resp||[]).length,0),DB.surveys.length+' استبانة','blue')}
 ${K('تطبيقات نماذج النمو المهني',DB.tpd.length,new Set(DB.tpd.map(x=>x.teacher)).size+' معلم — '+DB.tpd.filter(x=>x.status==='معتمد').length+' معتمد','gold')}
 ${K('الاختبارات',DB.exmeet.length+' اجتماع',DB.exact.filter(x=>x.status==='منفذ').length+' إجراء منفذ — '+DB.exres.length+' نتيجة','gold')}
 ${K('الشواهد المرفوعة',st.ev,'<a href="#evidence">معرض الشواهد</a>')}
 </div>
 ${(()=>{const n=calNext3(),r=readyCalc();return `<div class="grid two smarth"><div class="card"><div class="row"><h3 class="grow" style="margin:0">📅 أقرب 3 مواعيد</h3><a class="small" href="#cal">التقويم ←</a></div>${n.length?`<ul class="callist">${n.map(i=>`<li class="${i.date===today()?'today':i.date===addDays(today(),1)?'tmrw':''}"><b>${i.date===today()?'اليوم':i.date===addDays(today(),1)?'غدًا':esc(hjFmt(i.date,{day:'numeric',month:'long'}))}</b> — ${calLink(i,esc(i.t))}</li>`).join('')}</ul>`:'<div class="empty">لا توجد مواعيد قادمة</div>'}</div>
 <div class="card"><div class="row"><h3 class="grow" style="margin:0">🎯 جاهزية الزيارة <span class="small muted">(مؤشر داخلي)</span></h3><b class="rdmini">${r.pct==null?'—':r.pct+'%'}</b></div><div class="bar"><i style="width:${r.pct||0}%"></i></div><div class="small muted">${r.miss.length?r.miss.length+' بند ناقص':'لا يوجد ناقص'} — <a href="#ready">التفاصيل</a></div><div class="btns" style="margin-top:8px"><a class="btn sm ghost" href="#wsum">📄 ملخص الأسبوع</a><a class="btn sm ghost" href="#meet">🎙️ وضع الاجتماع</a><a class="btn sm ghost" href="#journey">🛤️ رحلة التميز</a></div></div>
 ${(()=>{const g=gmState();return `<div class="card gmhome"><div class="row"><h3 class="grow" style="margin:0">🏆 أوسمة الإنجاز</h3><a class="small" href="#badges">كل الأوسمة ←</a></div><div class="row" style="gap:10px;margin-top:6px"><span class="gmlvl sm">${['🌱','🥉','🥈','🥇'][g.li]}</span><div class="grow"><b>المستوى: ${g.lvl}</b><div class="small">${g.pts} نقطة — ${g.list.filter(b=>b.earned).length} من ${g.list.length} وساماً</div></div></div><div class="small muted" style="margin-top:6px">${g.last?'آخر وسام: '+g.last.ic+' '+g.last.n:'لم يُكتسب أي وسام بعد — ابدأ من الأقسام المرتبطة'}</div></div>`})()}</div>`})()}
 ${chartsBlock()}
 <div class="grid two"><div class="card"><h3>المهام المستحقة والمتأخرة (7 أيام)</h3>${dueList.length?dueList.map(x=>`<div class="row"><span class="grow">${esc(x.title)} ${x.sample?'<span class="pill sample">تجريبي</span>':''}</span>${isOver('tasks',x)?'<span class="pill red">متأخرة</span>':''}<span class="small muted">${fmtDate(x.due,false)}</span><button class="btn sm gold" data-act="done" data-c="tasks" data-id="${x.id}" aria-label="إنجاز">✓</button></div>`).join(''):'<div class="empty">لا توجد مهام مستحقة</div>'}</div>
 <div class="card"><h3>المناسبات والأنشطة وبرامج التوجيه القادمة (30 يوماً)</h3>${up.length?up.map(x=>`<div class="row"><span class="pill blue">${x._k}</span><span class="grow">${esc(x.title)}</span><span class="small muted">${fmtDate(x.date,false)}</span></div>`).join(''):'<div class="empty">لا توجد مناسبات أو أنشطة قادمة مسجلة</div>'}</div></div>
 <div class="grid two"><div class="card"><h3>إنجاز المهام حسب المجال</h3>${DOMAINS.map(d=>{const a=DB.tasks.filter(x=>x.domain===d),dn=a.filter(x=>x.status==='مكتملة').length,p=a.length?Math.round(dn/a.length*100):0;return `<div class="row"><span style="width:120px">${d}</span><div class="bar grow"><i style="width:${p}%"></i></div><span class="small" style="width:80px">${a.length?p+'% ('+dn+'/'+a.length+')':'—'}</span></div>`}).join('')}</div>
 <div class="card"><h3>المراجعة الذاتية حسب المجال</h3>${DOMAINS.map(d=>{const p=reviewPct(d);return `<div class="row"><span style="width:120px">${d}</span><div class="bar grow"><i style="width:${p||0}%"></i></div><span class="small" style="width:50px">${p==null?'—':p+'%'}</span></div>`}).join('')}<a class="small" href="#review">فتح المراجعة الذاتية ←</a></div></div>
 <div class="card"><h3>إنجاز الخطة التشغيلية حسب المجال</h3>${DOMAINS.map(d=>{const a=DB.oplan.filter(x=>x.domain===d),p=a.length?Math.round(a.reduce((s,x)=>s+(x.status==='منجز'?100:+x.progress||0),0)/a.length):0,o=a.filter(x=>isOver('oplan',x)).length;return `<div class="row"><span style="width:120px">${d}</span><div class="bar grow"><i style="width:${p}%"></i></div><span class="small" style="width:130px">${a.length?p+'% ('+a.length+' بند'+(o?'، '+o+' متأخر':'')+')':'—'}</span></div>`}).join('')}<a class="small" href="#oplan">فتح الخطة التشغيلية ←</a></div>`}

const PICON={'يومي':'☀️','أسبوعي':'📆','شهري':'🗓️','فصلي':'📚','نهاية العام':'🎓'};
function taskTabs(F){const cnt=p=>DB.tasks.filter(x=>(!p||x.period===p)&&x.status!=='مكتملة').length,ov=p=>DB.tasks.filter(x=>(!p||x.period===p)&&isOver('tasks',x)).length;
 return `<div class="ptabs" role="tablist">${['',...PERIODS].map(p=>`<button type="button" role="tab" class="ptab ${(F.period||'')===p?'on':''}" data-ptab="${p}" aria-selected="${(F.period||'')===p}"><span class="pi">${p?PICON[p]:'🗂️'}</span><span>${p||'الكل'}</span><span class="pc">${cnt(p)}</span>${ov(p)?`<span class="po" title="متأخرة">${ov(p)}</span>`:''}</button>`).join('')}</div>`}
function chip(t,cls=''){return `<span class="chip ${cls}">${t}</span>`}
function taskCard(x,hl){const ov=isOver('tasks',x),done=x.status==='مكتملة';const pc={'عالية':'red','متوسطة':'amber','منخفضة':'green'}[x.priority]||'',sc={'مكتملة':'green','قيد التنفيذ':'blue','مؤجلة':'gray'}[x.status]||'amber';
 const t=hl?esc(x.title).replace(new RegExp(hl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<mark class="hl">${m}</mark>`):esc(x.title);
 return `<article class="tcard ${ov?'over':''} ${done?'done':''}" style="--dc:var(--d${DOMAINS.indexOf(x.domain)+1})">
 <button type="button" class="tchk" ${done?'disabled':''} data-act="done" data-c="tasks" data-id="${x.id}" aria-label="${done?'مكتملة':'تعليم كمكتملة'}">${done?'✓':''}</button>
 <div class="tbody"><div class="ttl2">${t} ${x.sample?'<span class="pill sample">تجريبي</span>':''}</div>
 <div class="chips">${chip(esc(x.domain),'dom')}${x.priority?chip('● '+esc(x.priority),pc):''}${chip(esc(x.status||'جديدة'),sc)}${x.recur&&x.recur!=='لا يتكرر'?chip('🔁 '+esc(x.recur),'gray'):''}${x.remind?chip('⏰ '+esc(x.remind),'gray'):''}${x.owner&&x.owner!=='مدير المدرسة'?chip('👤 '+esc(x.owner),'gray'):''}</div>
 ${x.notes?`<div class="small muted tnote">${esc(x.notes).slice(0,180)}</div>`:''}</div>
 <div class="tside"><div class="tdue ${ov?'bad':''}">${ov?'⚠️ متأخرة<br>':''}${fmtDate(x.due,DB.settings.hijri)}</div><div class="btns">${evBtn('tasks',x.id)}<button class="btn sm ghost" data-act="edit" data-c="tasks" data-id="${x.id}">تعديل</button></div></div></article>`}
function taskCards(rows,F){if(!rows.length)return '<div class="empty">لا توجد مهام في هذا التبويب</div>';
 const ps=F.period?[F.period]:PERIODS.filter(p=>rows.some(x=>x.period===p));const other=rows.filter(x=>!PERIODS.includes(x.period));
 return ps.map(p=>{const r=rows.filter(x=>x.period===p),d=r.filter(x=>x.status==='مكتملة').length,pct=r.length?Math.round(d/r.length*100):0;
  return `<section class="pgroup"><header class="pghead"><span class="pi">${PICON[p]}</span><h3>المهام ${p==='نهاية العام'?'نهاية العام':p==='يومي'?'اليومية':p==='أسبوعي'?'الأسبوعية':p==='شهري'?'الشهرية':'الفصلية'}</h3><span class="muted small">${d}/${r.length} منجزة</span><div class="bar" style="width:120px"><i style="width:${pct}%"></i></div></header>
  <div class="tgrid">${r.map(x=>taskCard(x,F.q)).join('')}</div></section>`}).join('')+(other.length?`<section class="pgroup"><header class="pghead"><h3>أخرى</h3></header><div class="tgrid">${other.map(x=>taskCard(x,F.q)).join('')}</div></section>`:'')}
let tplTab='يومي';
function templatesView(){const p=tplTab,list=DB.templates.filter(t=>t.period===p);
 const tabs=`<div class="ptabs" role="tablist">${PERIODS.map(x=>`<button type="button" role="tab" class="ptab ${x===p?'on':''}" data-ttab="${x}" aria-selected="${x===p}"><span class="pi">${PICON[x]}</span><span>${x}</span><span class="pc">${DB.templates.filter(t=>t.period===x).length}</span></button>`).join('')}</div>`;
 const body=DOMAINS.map(d=>{const l=list.filter(t=>t.domain===d);if(!l.length)return'';return `<div class="tdom" style="--dc:var(--d${DOMAINS.indexOf(d)+1})"><h4>${d} <span class="muted small">(${l.length})</span></h4><div class="tplgrid">${l.map(t=>`<label class="tplc"><input type="checkbox" data-tp="${t.id}" data-p="${p}" aria-label="تحديد القالب"><textarea class="tpl-t" data-tt="${t.id}" rows="2" maxlength="200" aria-label="نص القالب (قابل للتعديل)">${esc(t.title)}</textarea><button type="button" class="iconbtn sm" data-act="tdel" data-id="${t.id}" aria-label="حذف القالب">✕</button></label>`).join('')}</div></div>`}).join('');
 return `<div class="head"><div><h2>قوالب مهام مدير المدرسة</h2><div class="muted small">قوالب جاهزة قابلة للتعديل (اضغط على النص لتعديله). حدّد القوالب ثم أنشئ منها مهاماً تتكرر تلقائياً حسب الفترة.</div></div>
 <div class="btns"><button class="btn ghost" data-act="tadd">＋ قالب جديد</button><button class="btn ghost" data-act="treset">استعادة القوالب الافتراضية</button></div></div>
 ${tabs}<div class="card"><div class="row" style="flex-wrap:wrap;gap:10px"><label class="row small" style="margin:0"><input type="checkbox" data-allp="${p}"> تحديد كل قوالب «${p}»</label><span class="grow"></span><label class="small">تاريخ البداية <input type="date" id="tplStart" value="${today()}"></label><button class="btn gold" data-act="tcreate">إنشاء مهام من المحدد</button></div>
 ${body||'<div class="empty">لا توجد قوالب في هذه الفترة</div>'}</div>`}
function reviewView(){return `<div class="head"><div><h2>المراجعة الذاتية الدورية</h2><div class="muted small">قيّم كل مؤشر: متحقق (2) / متحقق جزئياً (1) / غير متحقق (0). تُحسب النسبة تلقائياً. أضف الشواهد في الملاحظة.</div></div>
 <div class="btns"><button class="btn ghost" data-act="print" data-c="review">طباعة</button><button class="btn ghost" data-act="rvreset">بدء دورة مراجعة جديدة</button></div></div>
 ${DB.review._date?`<div class="muted small" style="margin-bottom:8px">آخر تحديث: ${fmtDate(DB.review._date)}</div>`:''}
 ${DOMAINS.map(d=>{const p=reviewPct(d);return `<div class="card"><div class="row"><h3 class="grow" style="margin:0">${d}</h3><b>${p==null?'—':p+'%'}</b></div><div class="bar" style="margin:6px 0 4px"><i style="width:${p||0}%"></i></div>
 ${REVIEW[d].map((q,i)=>{const v=(DB.review[d]||{})[i]||{};return `<div class="rv-item"><div>${esc(q)}</div><div class="seg" role="group" aria-label="${esc(q)}">${[['2','متحقق'],['1','جزئي'],['0','غير متحقق']].map(([s,l])=>`<button type="button" data-rv="${d}|${i}" data-s="${s}" class="${String(v.s)===s?'on':''}" aria-pressed="${String(v.s)===s}">${l}</button>`).join('')}</div><div>${evBtn('review',d+'|'+i)}</div><textarea data-rvn="${d}|${i}" placeholder="الشواهد/الأدلة والملاحظات" aria-label="شواهد">${esc(v.n||'')}</textarea></div>`}).join('')}
 <button class="btn sm ghost" data-act="rv2act" data-d="${d}" style="margin-top:8px">تحويل المؤشرات غير المتحققة إلى إجراءات تحسين</button></div>`}).join('')}`}

function auditView(){const a=DB.audit.slice().reverse();return `<div class="head"><div><h2>سجل التغييرات</h2><div class="muted small">آخر ${a.length} عملية (يُحتفظ بآخر 1000)</div></div><div class="btns"><button class="btn ghost" data-act="auditcsv">تصدير CSV</button></div></div>
 <div class="card">${a.length?`<div class="tbl-wrap"><table class="resp"><thead><tr><th>الوقت</th><th>العملية</th><th>القسم</th><th>العنصر</th></tr></thead><tbody>${a.slice(0,300).map(x=>`<tr><td data-l="الوقت">${esc(new Date(x.t).toLocaleString('ar-SA-u-nu-latn'))}</td><td data-l="العملية">${esc(x.op)}</td><td data-l="القسم">${esc(audCol(x.col))}</td><td data-l="العنصر">${esc(x.title)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">لا توجد تغييرات بعد</div>'}</div>`}

function reportsView(){const opt=['summary|الملخص العام','weekly|التقرير الأسبوعي',...COLS.map(c=>c+'|'+S[c].t),'review|المراجعة الذاتية','examsall|الاختبارات (تقرير شامل)'];
 return `<div class="head"><div><h2>التقارير والتصدير</h2><div class="muted small">اختر التقرير ثم «طباعة» واحفظه PDF من نافذة الطباعة، أو صدّره CSV/Excel.</div></div></div>
 <div class="card"><div class="filters"><select id="rpType" aria-label="نوع التقرير">${opt.map(o=>{const[a,b]=o.split('|');return `<option value="${a}">${b}</option>`}).join('')}</select>
 <label class="small">من <input type="date" id="rpFrom"></label><label class="small">إلى <input type="date" id="rpTo"></label>
 <button class="btn gold" data-act="rprint">طباعة / PDF</button><button class="btn ghost" data-act="rcsv">CSV</button><button class="btn ghost" data-act="xlsall">Excel (كل السجلات)</button></div>
 <p class="small muted">التقرير الأسبوعي يغطي آخر 7 أيام تلقائياً. ملف Excel يحتوي ورقة لكل سجل.</p></div>`}

function settingsView(){const s=DB.settings,used=(new Blob([JSON.stringify(DB)]).size/1024).toFixed(0);
 return `<div class="head"><div><h2>الإعدادات والنسخ الاحتياطي</h2></div></div>
 <div class="grid two"><div class="card"><h3>بيانات المدرسة</h3><form id="setForm" novalidate>
 ${[['school','اسم المدرسة'],['principal','اسم قائد/مدير المدرسة'],['supervisor',supLbl()+' (الاسم)'],['supervisorMobile','جوال '+supLbl().split(' ')[0]+' (اختياري)'],['region','إدارة التعليم / المكتب'],['year','العام الدراسي']].map(([k,l])=>`<div class="fld" style="margin-bottom:10px"><label for="s_${k}">${l}</label><input id="s_${k}" name="${k}" value="${esc(s[k])}" maxlength="120"></div>`).join('')}
${stageGenderFields(s)}
 <div class="fld" style="margin-bottom:10px"><label>الشعار</label><div class="row">${s.logo?`<img src="${s.logo}" alt="الشعار" style="width:64px;height:64px;object-fit:contain;border:1px solid var(--line);border-radius:8px">`:'<span class="muted small">لا يوجد شعار</span>'}<button type="button" class="btn sm ghost" data-act="logo">رفع شعار</button>${s.logo?'<button type="button" class="btn sm ghost" data-act="nologo">إزالة</button>':''}</div></div>
 <button class="btn gold" type="submit">حفظ الإعدادات</button></form></div>
 <div class="card"><h3>التذكيرات والعرض</h3>
 <div class="fld" style="margin-bottom:10px"><label for="s_rt">وقت التذكير اليومي الافتراضي للمهام المستحقة</label><input type="time" id="s_rt" value="${esc(s.remindTime)}"></div>
 <label class="row"><input type="checkbox" id="s_mute" ${s.mute?'checked':''}> كتم صوت التنبيه</label>
 <label class="row"><input type="checkbox" id="s_morning" ${s.morning!==false?'checked':''}> إظهار «بطاقة صباح ${isGirls()?'القائدة':'القائد'}» في الرئيسية كل يوم دراسي</label>
 <label class="row"><input type="checkbox" id="s_hj" ${s.hijri?'checked':''}> عرض التاريخ الهجري (أم القرى) بجانب الميلادي</label>
 <div class="btns" style="margin:8px 0"><button class="btn ghost" data-act="notif">تفعيل إشعارات المتصفح</button><button class="btn ghost" data-act="chime">تجربة الصوت</button></div>
 <p class="small muted">حالة الإشعارات: <b id="nstate">${'Notification' in window?({granted:'مفعّلة',denied:'مرفوضة (فعّلها من إعدادات المتصفح)',default:'غير مفعّلة'})[Notification.permission]:'غير مدعومة في هذا المتصفح'}</b>.<br>تنبيه: تعمل التذكيرات والإشعارات فقط أثناء فتح التطبيق/التبويب أو تشغيل التطبيق المثبّت؛ لا يوجد خادم لإرسال إشعارات والتطبيق مغلق.</p></div></div>
 ${protCard()}
 <div class="card small">👩‍🏫 <a href="#share"><b>نسخة اطلاع للمعلم / للجنة</b></a> — ملف للقراءة فقط يُرسل عبر واتساب ويُفتح دون إنترنت.</div>
 <div class="grid two"><div class="card"><h3>النسخ الاحتياطي</h3><p class="small muted">البيانات محفوظة في هذا المتصفح على هذا الجهاز فقط (الحجم الحالي ≈ ${used} ك.ب). مسح بيانات المتصفح يحذفها — صدّر نسخة احتياطية بانتظام وانقلها بين الأجهزة بالاستيراد.</p>
 <p class="small" id="bkLast">آخر نسخة احتياطية: <b>${s.lastBackup?'<bdi dir="ltr">'+esc(s.lastBackup)+'</bdi> (منذ '+dDiff(today(),s.lastBackup)+' يوم)':'لم تُؤخذ نسخة بعد'}</b></p>
 <div class="fld" style="margin-bottom:10px"><label for="s_bk">تذكير النسخ الاحتياطي</label><select id="s_bk">${[[7,'كل 7 أيام'],[14,'كل 14 يوماً'],[30,'كل 30 يوماً'],[0,'إيقاف التذكير']].map(([v,l])=>`<option value="${v}" ${+s.backupEvery===v?'selected':''}>${l}</option>`).join('')}</select></div>
 <div class="btns"><button class="btn gold" data-act="export">تصدير نسخة احتياطية JSON</button><button class="btn ghost" data-act="import">استيراد نسخة احتياطية</button></div></div>
 <div class="card"><h3>البيانات التجريبية والتهيئة</h3><p class="small muted">البيانات التجريبية معلَّمة بشارة «تجريبي» وتظهر لافتة تنبيه أثناء وجودها، ويمكن حذفها بضغطة.</p>
 <div class="btns"><button class="btn ghost" data-act="sample">تحميل بيانات تجريبية</button><button class="btn ghost" data-act="clearSample">حذف البيانات التجريبية</button><button class="btn red" data-act="wipe">مسح كل البيانات</button></div></div></div>
 <div class="card small muted">الإصدار ${APP_VERSION} — يعمل دون اتصال بعد أول تحميل، ويمكن تثبيته من قائمة المتصفح «تثبيت التطبيق / إضافة إلى الشاشة الرئيسية». <button class="btn sm ghost" data-act="install" id="instBtn" hidden>تثبيت التطبيق</button></div>`}

function searchView(q){const ql=q.toLowerCase();let out='',n=0;
 COLS.forEach(c=>{const r=DB[c].filter(x=>Object.entries(x).some(([k,v])=>k!=='id'&&(typeof v!=='object'?String(v):Array.isArray(v)?v.map(r=>r&&typeof r==='object'?Object.values(r).join(' '):String(r)).join(' '):'').toLowerCase().includes(ql)));if(r.length){n+=r.length;out+=`<div class="card"><h3>${S[c].t} (${r.length})</h3>${table(c,r.slice(0,50),S[c].cols,q)}</div>`}});
 const tp=DB.templates.filter(t=>t.title.toLowerCase().includes(ql));if(tp.length){n+=tp.length;out+=`<div class="card"><h3>قوالب المهام (${tp.length})</h3>${tp.map(t=>`<div class="row">${esc(t.title)} <span class="pill">${t.period}</span></div>`).join('')}</div>`}
 const nv=[...document.querySelectorAll('#nav a[data-v]')].filter(a=>a.textContent.toLowerCase().includes(ql));if(nv.length){n+=nv.length;out=`<div class="card"><h3>الأقسام (${nv.length})</h3>${nv.map(a=>`<a class="pill" href="#${a.dataset.v}">${esc(a.textContent.trim())}</a>`).join(' ')}</div>`+out}
 {const ec=emgS().contacts.filter(c=>((c.n||'')+' '+(c.t||'')).toLowerCase().includes(ql));if(ec.length){n+=ec.length;out+=`<div class="card"><h3>أرقام الطوارئ (${ec.length})</h3>${ec.map(c=>`<div class="row"><a href="#emg">${esc(c.n||'')}</a> <a href="${telHref(c.t)}"><bdi dir="ltr">${esc(c.t||'')}</bdi></a></div>`).join('')}</div>`}}
 const bg=BADGES.filter(b=>(b[2]+' '+b[3]).toLowerCase().includes(ql));if(bg.length){n+=bg.length;out+=`<div class="card"><h3>أوسمة الإنجاز (${bg.length})</h3>${bg.map(b=>`<div class="row"><a href="#badges">${b[1]} ${esc(b[2])}</a> <span class="small muted">${esc(b[3])}</span></div>`).join('')}</div>`}
 return `<div class="head"><h2>نتائج البحث عن «${esc(q)}» (${n})</h2></div>${out||'<div class="card empty">لا توجد نتائج</div>'}`}


/* ---------- الأدلة المرجعية ---------- */
const GUIDES_DEF=[
 {id:'g-org1442',t:'الدليل التنظيمي لمدارس التعليم العام (الأهداف والمهام)',ed:'إصدار ١٤٤٢هـ',circ:'تعميم معالي الوزير رقم ٤٣٠٠٠٠٢١٣٥١ وتاريخ ٠٤/٠١/١٤٤٣هـ',qr:'guides/g-org1442.png',u:'https://saudimoe-my.sharepoint.com/:b:/g/personal/ozuair4670_moe_gov_sa/IQB62x6hPCjqQ6NvR4x3VmJzAWpIYzI1LdCI3ZzxDErisxg?e=zdVKK5'},
 {id:'g-proc1437',t:'الدليل الإجرائي لمدارس التعليم العام',ed:'إصدار ١٤٣٧هـ',circ:'التعميم الوزاري رقم ٣٧٣٠٥٤١٢٤ وتاريخ ١٧/٠٢/١٤٣٧هـ',qr:'guides/g-proc1437.png',u:'https://saudimoe-my.sharepoint.com/:b:/g/personal/ozuair4670_moe_gov_sa/IQCTVShpKCiXTpVt2WAzNP4EAStewTpyybReZchM9zK9IzQ?e=c0dFYp'}];
const guExtra=()=>{try{const a=JSON.parse(localStorage.getItem('sld_guides')||'[]');return Array.isArray(a)?a:[]}catch(_){return []}};
const guSave=a=>localStorage.setItem('sld_guides',JSON.stringify(a));
function guQR(u){try{if(window.qrcode&&u){const q=qrcode(0,'M');q.addData(u);q.make();return `<div class="guqr">${q.createSvgTag({cellSize:3,margin:2,scalable:true})}</div>`}}catch(_){}return ''}
const guQRI=g=>g.qr?`<div class="guqr"><img src="${g.qr}" alt="رمز QR — ${esc(g.t)}" loading="lazy"></div>`:guQR(g.u);
function guCard(g,own){const ok=/^https?:\/\//.test(g.u||'');return `<div class="comcard gucard"><b>📘 ${esc(g.t)}</b>${g.ed?`<div class="small"><span class="pill">${esc(g.ed)}</span></div>`:''}${g.circ?`<div class="small muted" style="margin-top:6px">${esc(g.circ)}</div>`:''}
 ${ok?guQRI(g):'<div class="small muted">⚠️ لا يوجد رابط</div>'}
 <div class="btns" style="margin-top:8px">${ok?`<a class="btn gold sm" href="${esc(g.u)}" target="_blank" rel="noopener">📖 فتح الدليل</a>`:''}${own?`<button class="btn sm ghost" data-act="gudel" data-id="${esc(g.id)}">حذف</button>`:''}</div></div>`}
function guidesView(){const ex=guExtra();return `<div class="head"><div><h2>📘 الأدلة المرجعية</h2><div class="muted small">الأدلة الرسمية المعتمدة لمدارس التعليم العام — وفق المذكرة الإلكترونية الموجهة للمدارس من إدارة الإدارة المدرسية (للتقيد بما ورد فيها والعمل بموجبه).</div></div><div class="btns"><a class="btn ghost" href="guides/memo-guides-1442-1437.jpg" download="مذكرة-الأدلة-التنظيمي-والإجرائي.jpg">⬇️ تنزيل صورة المذكرة الأصلية</a></div></div>
 <div class="comgrid">${GUIDES_DEF.map(g=>guCard(g,false)).join('')}${ex.map(g=>guCard(g,true)).join('')}</div>
 <div class="card"><h3>＋ إضافة دليل آخر</h3><div class="small muted">يُحفظ على هذا الجهاز فقط.</div>
 <div class="gufrm"><input id="guT" placeholder="اسم الدليل"><input id="guE" placeholder="الإصدار (مثال: ١٤٤٥هـ)"><input id="guC" placeholder="رقم التعميم وتاريخه (اختياري)"><input id="guU" type="url" dir="ltr" placeholder="https://…"></div>
 <div class="btns" style="margin-top:8px"><button class="btn gold" data-act="guadd">إضافة</button></div></div>`}


/* ---------- 🔗 ربط منصة إتقان (قراءة فقط من IndexedDB على نفس الجهاز + استيراد نسخة JSON) ---------- */
const ITQ_URL='https://alotibi21-spec.github.io/itqan/',ITQ_IMP='sld_itqan_sum';
let ITQ={st:'idle',sum:null,src:'',err:''};
function itqReadDB(){return new Promise(ok=>{let done=false;const fin=v=>{if(!done){done=true;ok(v)}};
 try{if(!window.indexedDB)return fin(null);const go=()=>{let r;try{r=indexedDB.open('itqan')}catch(_){return fin(null)}
  r.onupgradeneeded=()=>{try{r.transaction.abort()}catch(_){}fin(null)};/* لا نُنشئ قاعدة إتقان إن لم تكن موجودة */
  r.onerror=()=>fin(null);r.onblocked=()=>fin(null);
  r.onsuccess=()=>{const d=r.result;try{if(!d.objectStoreNames.contains('kv')){d.close();return fin(null)}const q=d.transaction('kv','readonly').objectStore('kv').get('state');q.onsuccess=()=>{d.close();fin(q.result||null)};q.onerror=()=>{d.close();fin(null)}}catch(_){try{d.close()}catch(__){}fin(null)}}};
  if(indexedDB.databases)indexedDB.databases().then(L=>{if(L.some(x=>x.name==='itqan'))go();else fin(null)}).catch(go);else go();
  setTimeout(()=>fin(null),4000)}catch(_){fin(null)}})}
function itqSummarize(S){if(!S||typeof S!=='object')return null;const st=S.settings||{};const P=+st.pass||50,E=+st.exc||90,M=+st.master||80;
 const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
 const prac=[...(S.offPrac||[]),...(S.schoolPrac||[])].filter(r=>r&&r.n);
 const TR=['calc','think','master'],tracks={};
 TR.forEach(k=>{const L=prac.filter(r=>r.tr&&r.tr[k]&&r.tr[k][1]).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||((a.t||0)-(b.t||0)));
  const n=L.reduce((s,r)=>s+r.tr[k][1],0),ok=L.reduce((s,r)=>s+r.tr[k][0],0);const by={};L.forEach(r=>{const s=r.student||'—';(by[s]=by[s]||[]).push(r)});
  let bn=0,bo=0,an=0,ao=0,pairs=0;Object.values(by).forEach(a=>{if(a.length<2)return;pairs++;const f=a[0].tr[k],l=a[a.length-1].tr[k];bn+=f[1];bo+=f[0];an+=l[1];ao+=l[0]});
  tracks[k]={n,ok,acc:n?100*ok/n:null,sessions:L.length,before:bn?100*bo/bn:null,after:an?100*ao/an:null,pairs}});
 const marks=Array.isArray(S.marks)?S.marks:[],res=Array.isArray(S.results)?S.results:[],att=Array.isArray(S.attempts)?S.attempts:[];
 let src=marks;if(!marks.length){const by={};res.forEach(r=>{if(r&&r.student!=null&&r.score!=null)(by[r.student]=by[r.student]||[]).push(+r.score)});src=Object.entries(by).map(([s,a])=>({student:s,subject:'متوسط الاختبارات القصيرة',grade:avg(a)}))}
 const edge=[];src.forEach(m=>{if(!m||m.grade==null)return;const ab=+m.absence||0,pt=m.part??70;const pred=Math.max(0,Math.min(100,m.grade-ab*0.8+(pt-70)*0.08));if(pred<P+10&&pred>=P-15)edge.push({st:String(m.student||''),subject:String(m.subject||''),grade:+m.grade,pred,risk:ab>5||pt<50})});
 edge.sort((a,b)=>a.pred-b.pred);
 const key={};res.forEach(r=>{if(r&&r.student&&r.skill)(key[r.student+'\u0001'+r.skill]=key[r.student+'\u0001'+r.skill]||{r:[],a:[]}).r.push(+r.score)});
 att.forEach(a=>{if(a&&a.student&&a.skill)(key[a.student+'\u0001'+a.skill]=key[a.student+'\u0001'+a.skill]||{r:[],a:[]}).a.push(!!a.ok)});
 const lv={ok:0,dev:0,low:0};const stu=new Set();Object.entries(key).forEach(([k,v])=>{const parts=[];if(v.r.length)parts.push(avg(v.r));if(v.a.length>=2)parts.push(100*v.a.filter(Boolean).length/v.a.length);const m=avg(parts);if(m==null)return;stu.add(k.split('\u0001')[0]);lv[m>=M?'ok':m>=P?'dev':'low']++});
 const pn=prac.reduce((s,r)=>s+(+r.n||0),0),po=prac.reduce((s,r)=>s+(+r.ok||0),0);const dates=prac.map(r=>r.date).filter(Boolean).sort();
 return{t:Date.now(),school:st.school||'',students:(S.students||[]).length,prac:{sessions:prac.length,n:pn,ok:po,acc:pn?100*po/pn:null,learners:new Set(prac.map(r=>r.student).filter(Boolean)).size,last:dates[dates.length-1]||''},tracks,edge:edge.slice(0,60),edgeN:edge.length,pass:{...lv,students:stu.size},th:{P,E,M}}}
function itqEmpty(s){return !s||(!s.prac.sessions&&!s.edgeN&&!(s.pass.ok+s.pass.dev+s.pass.low)&&!s.students)}
async function itqLoad(){ITQ.st='loading';const raw=await itqReadDB();let s=raw?itqSummarize(raw):null;
 if(s&&!itqEmpty(s)){ITQ={st:'ok',sum:s,src:'db',err:''}}else{let imp=null;try{imp=JSON.parse(localStorage.getItem(ITQ_IMP)||'null')}catch(_){}ITQ=imp&&imp.prac?{st:'ok',sum:imp,src:'file',err:''}:{st:'empty',sum:null,src:raw?'dbempty':'',err:''}}
 if(view()==='itqan')render()}
function itqImport(f){const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);const S=j&&j.data&&(j.app==='itqan'||j.data.settings)?j.data:(j&&j.settings&&(j.students||j.results)?j:null);if(!S)return toast('الملف ليس نسخة احتياطية من منصة إتقان');const s=itqSummarize(S);if(!s)return toast('تعذّر قراءة الملف');s.file=f.name;
  try{localStorage.setItem(ITQ_IMP,JSON.stringify(s))}catch(_){return toast('تعذّر الحفظ على الجهاز')}ITQ={st:'ok',sum:s,src:'file',err:''};toast('✓ استُورد ملخص إتقان — حُفظ الملخص فقط على هذا الجهاز');render()}catch(_){toast('ملف JSON غير صالح')}};r.readAsText(f)}
const itqP=v=>v==null?'—':Math.round(v)+'%';
function itqView(){if(ITQ.st==='idle'){itqLoad()}const s=ITQ.sum;
 const hd=`<div class="head"><div><h2>🔗 ربط منصة إتقان</h2><div class="muted small">قراءة فقط لبيانات منصة إتقان المحفوظة على هذا الجهاز نفسه — لا تُرسل أي بيانات خارج الجهاز ولا يُعدَّل شيء في إتقان.</div></div><div class="btns"><a class="btn gold" href="${ITQ_URL}" target="_blank" rel="noopener">🚀 فتح منصة إتقان</a><button class="btn ghost" data-act="itqrel">🔄 تحديث القراءة</button><button class="btn ghost" data-act="itqimp">⬆️ استيراد نسخة إتقان (JSON)</button>${ITQ.src==='file'?'<button class="btn ghost" data-act="itqclr">حذف الملخص المستورد</button>':''}</div></div>`;
 if(ITQ.st==='idle'||ITQ.st==='loading')return hd+'<div class="card empty">⏳ جارٍ قراءة بيانات إتقان من هذا الجهاز…</div>';
 if(!s)return hd+`<div class="card empty"><div style="font-size:2rem">🔗</div><h3>لا توجد بيانات من منصة إتقان على هذا الجهاز بعد</h3>
  <p class="small">${ITQ.src==='dbempty'?'وُجدت منصة إتقان على هذا الجهاز لكنها لا تحتوي نتائج بعد.':'لم يُعثر على بيانات إتقان في هذا المتصفح.'}</p>
  <ol class="small" style="text-align:start;max-width:560px;margin:8px auto;line-height:2"><li>افتح منصة إتقان <b>من المتصفح نفسه على هذا الجهاز</b> وأدخل بيانات الطلاب والنتائج وتدريبات نافس، ثم عد واضغط «🔄 تحديث القراءة».</li><li>أو من إتقان: الإعدادات ← «⬇️ تنزيل نسخة احتياطية (JSON)»، ثم هنا «⬆️ استيراد نسخة إتقان (JSON)». يُحفظ الملخص فقط على هذا الجهاز.</li></ol>
  <div class="btns" style="justify-content:center"><a class="btn gold" href="${ITQ_URL}" target="_blank" rel="noopener">🚀 فتح منصة إتقان</a><button class="btn ghost" data-act="itqimp">⬆️ استيراد نسخة JSON</button></div></div>`;
 const G=isGirls(),k=(l,v,x,cl='')=>`<div class="kpi ${cl}"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${x}</div></div>`;
 const TRN={calc:['🧮','احسب','المهارات الحسابية'],think:['💡','فكّر','التفكير الناقد وحل المشكلات'],master:['🎯','أتقن','قياس الأثر ونواتج التعلم']};
 const LV=G?['متقنة','قيد الإتقان','متعثّرة']:['متقن','قيد الإتقان','متعثّر'];const pt=s.pass.ok+s.pass.dev+s.pass.low,pc=x=>pt?Math.round(100*x/pt):0;
 const srcL=ITQ.src==='db'?'📱 مباشرة من منصة إتقان على هذا الجهاز':'📄 من ملف مستورد'+(s.file?' ('+esc(s.file)+')':'');
 return hd+`<div class="card small" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span class="pill blue">${srcL}</span>${s.school?`<span class="pill">${esc(s.school)}</span>`:''}<span class="muted">آخر قراءة: ${new Date(s.t).toLocaleString('ar-SA-u-nu-latn',{dateStyle:'medium',timeStyle:'short'})}</span></div>
 <h3>🧪 نتائج تدريبات نافس</h3><div class="grid kpis">${k('جلسات التدريب',s.prac.sessions,s.prac.last?'آخرها '+esc(s.prac.last):'لا جلسات بعد')}${k('الأسئلة المُجابة',s.prac.n,s.prac.ok+' إجابة صحيحة')}${k('الدقة العامة',itqP(s.prac.acc),'لكل الأسئلة',s.prac.acc==null?'':s.prac.acc>=s.th.M?'ok':s.prac.acc>=s.th.P?'':'bad')}${k(G?'المتدرّبات':'المتدرّبون',s.prac.learners,'من أصل '+s.students+' مسجَّلًا في إتقان')}</div>
 <div class="card"><h3>🎯 الدقة حسب المسار (قبل ← بعد)</h3><div class="small muted">«قبل» = أول جلسة لكل طالب في المسار، «بعد» = آخر جلسة له (للطلاب الذين لديهم جلستان فأكثر).</div>
 <div class="comgrid" style="margin-top:10px">${Object.entries(TRN).map(([key,[ic,n,d]])=>{const t=s.tracks[key]||{};const df=t.before!=null&&t.after!=null?t.after-t.before:null;
  return `<div class="comcard"><b>${ic} ${n}</b> <span class="small muted">${d}</span><div style="font-size:1.6rem;font-weight:800;margin:6px 0">${itqP(t.acc)}</div><div class="bar"><i style="width:${Math.round(t.acc||0)}%"></i></div>
  <div class="small" style="margin-top:6px">${t.ok||0} صحيحة من ${t.n||0} سؤال · ${t.sessions||0} جلسة</div>
  <div class="small" style="margin-top:4px">قبل: <b>${itqP(t.before)}</b> ← بعد: <b>${itqP(t.after)}</b> ${df==null?'<span class="pill gray">يحتاج جلستين لطالب واحد على الأقل</span>':`<span class="pill ${df>0?'green':df<0?'red':'gray'}">${df>0?'▲ +':df<0?'▼ ':''}${Math.round(df)} نقطة</span>`}</div></div>`}).join('')}</div></div>
 <div class="card"><h3>⚠️ طلاب على «حافة التعثّر» <span class="pill ${s.edgeN?'amber':'green'}">${s.edgeN}</span></h3><div class="small muted">متوقَّع أن تكون درجتهم بين ${s.th.P-15}% و${s.th.P+10}% (حسب حد النجاح ${s.th.P}% في إعدادات إتقان، مع أثر الغياب والمشاركة).</div>
 ${s.edgeN?`<div class="tw" style="margin-top:8px"><table><tr><th>الطالب</th><th>المادة</th><th>الدرجة</th><th>المتوقَّع</th><th>ملاحظة</th></tr>${s.edge.map(e=>`<tr><td>${esc(e.st)}</td><td>${esc(e.subject)}</td><td>${Math.round(e.grade)}</td><td>${Math.round(e.pred)}</td><td>${e.risk?'<span class="pill red" title="غياب مرتفع أو مشاركة ضعيفة">⚠️ غياب/مشاركة</span>':''}</td></tr>`).join('')}</table></div>${s.edgeN>s.edge.length?`<div class="small muted">يُعرض أول ${s.edge.length} — الباقي في إتقان.</div>`:''}`:'<p class="small">لا يوجد طلاب على حافة التعثّر وفق البيانات الحالية.</p>'}</div>
 <div class="card"><h3>🛂 جواز المهارات — توزيع المستويات</h3><div class="small muted">عدد المهارات المقيسة لكل طالب (مجموع طالب × مهارة)، وعدد من قيست مهاراتهم: ${s.pass.students}. ${LV[0]}: ${s.th.M}% فأكثر · ${LV[1]}: من ${s.th.P}% إلى أقل من ${s.th.M}% · ${LV[2]}: أقل من ${s.th.P}%.</div>
 ${pt?`<div class="grid kpis" style="margin-top:8px">${k('🟢 '+LV[0],s.pass.ok,pc(s.pass.ok)+'%','ok')}${k('🔵 '+LV[1],s.pass.dev,pc(s.pass.dev)+'%')}${k('🔴 '+LV[2],s.pass.low,pc(s.pass.low)+'%','bad')}</div>
 <div style="display:flex;height:14px;border-radius:8px;overflow:hidden;border:1px solid var(--line)"><i style="width:${pc(s.pass.ok)}%;background:#15803d"></i><i style="width:${pc(s.pass.dev)}%;background:#1d4ed8"></i><i style="width:${pc(s.pass.low)}%;background:#b91c1c"></i></div>`:'<p class="small">لا توجد مهارات مقيسة بعد في إتقان.</p>'}</div>`}

/* ---------- Render ---------- */
let searchQ='';
function render(){const v=view(),m=$('#main');
 $$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===v||(v==='committee'&&a.dataset.v==='committees')||(['exam','exmeet','exact','exres'].includes(v)&&a.dataset.v==='exams')||(v==='survey'&&a.dataset.v==='surveys')));
 if(searchQ)m.innerHTML=searchView(searchQ);
 else if(v==='wsum')m.innerHTML=wsView();else if(v==='share')m.innerHTML=shareView();else if(v==='decide')m.innerHTML=decView();else if(v==='heat')m.innerHTML=heatView();else if(v==='portfolio')m.innerHTML=pfView();else if(v==='vrep')m.innerHTML=vrView();else if(v==='emg')m.innerHTML=emgView();else if(v==='guides')m.innerHTML=guidesView();else if(v==='itqan')m.innerHTML=itqView();else if(v==='cmp')m.innerHTML=cmpView();else if(v==='badges')m.innerHTML=badgesView();else if(v==='journey')m.innerHTML=journeyView();else if(v==='ready')m.innerHTML=readyView();else if(v==='cal')m.innerHTML=calView();else if(v==='meet')m.innerHTML=mmView();else if(v==='dashboard')m.innerHTML=dashboard();else if(S[v]&&v!=='oplan')m.innerHTML=listView(v);else if(v==='templates')m.innerHTML=templatesView();
 else if(v==='review')m.innerHTML=reviewView();else if(v==='reports')m.innerHTML=reportsView();else if(v==='audit')m.innerHTML=auditView();else if(v==='oplan')m.innerHTML=oplanView();else if(v==='exams')m.innerHTML=examsView();else if(v==='survey')m.innerHTML=surveyView((location.hash.split('?')[1]||''));else if(v==='exam')m.innerHTML=examView((location.hash.split('?')[1]||''));else if(v==='committee')m.innerHTML=committeeView((location.hash.split('?')[1]||''));else if(v==='settings')m.innerHTML=settingsView();else if(v==='evidence')m.innerHTML=evidenceView();else m.innerHTML=dashboard();
 if(!searchQ&&v==='evals'){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=evView();[...w.children].reverse().forEach(ch=>hd.after(ch))}
 if(!searchQ&&(v==='impact'||v==='surveys')){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=(v==='impact'?impHowto()+impCards():svHowto()+svCards());[...w.children].reverse().forEach(ch=>hd.after(ch))}
 if(!searchQ&&v==='committees'){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=comCards();if(w.firstElementChild)hd.after(w.firstElementChild)}
 if(!searchQ&&SEC_VIEWS.includes(v)&&v!=='oplan'&&v!=='exams'){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=secCard(v);hd?hd.after(w.firstElementChild):m.prepend(w.firstElementChild)}
 if(!searchQ&&v==='tpd'){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=tpdLibrary();hd.after(w.firstElementChild);if(tpdCached==null)tpdCheck()}
 if(!searchQ&&v==='plans'){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=howto('الخطط العلاجية',['تُنشأ الخطة من «🧭 مساعد القرار» أو من «＋ إضافة».','أكمل الأسباب والهدف والإجراءات (المسؤول والموعد) وطريقة القياس والشواهد.','«إرسال إلى خطة التحسين» يضيف كل إجراء إلى «إجراءات خطة التحسين» مرة واحدة، و«إنشاء برنامج في قياس الأثر» يضيف برنامجاً مرتبطاً.'],!DB.plans.length)+plansCards();[...w.children].reverse().forEach(ch=>hd.after(ch))}
 if(!searchQ&&(v==='honors'||v==='inits')){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=v==='honors'?honView():initView();[...w.children].reverse().forEach(ch=>hd.after(ch))}
 if(!searchQ&&(v==='meetings'||v==='exmeet')){const b=m.querySelector('.head .btns');if(b)b.insertAdjacentHTML('afterbegin','<button class="btn ghost" data-act="mmode" data-id="g">🎙️ وضع الاجتماع</button>')}
 if(window._tkReady&&tkLastG!==null&&tkLastG!==tkGender())renderTicker();
 if(!searchQ&&v==='dashboard'){const h=mcCard();if(h)m.insertAdjacentHTML('afterbegin',h);try{m.insertAdjacentHTML('afterbegin',weeksCard());wkStart()}catch(e){console.warn(e)}}
 if(!searchQ&&v==='dashboard'){try{m.insertAdjacentHTML('beforeend',linksCard())}catch(e){console.warn(e)}}
 if(!searchQ&&v==='dashboard'){const h=instCard();if(h){const hd=m.querySelector('.head');hd?hd.insertAdjacentHTML('afterend',h):m.insertAdjacentHTML('afterbegin',h)}}
 m.innerHTML=fem(m.innerHTML);chrome();{const fc=document.querySelector('footer.credit');if(fc)fc.hidden=v!=='dashboard'}if(v==='settings')protFill();if(!searchQ){gmCheck();if(v==='journey')jCheck()}}
let NAV0;function chrome(){const s=DB.settings;document.documentElement.dataset.g=s.gender==='بنات'?'girls':'boys';applyThemeColor();$('#schoolTitle').textContent=s.school||'لوحة قيادة المدرسة';NAV0=NAV0||$('#nav').innerHTML;const nv=fem(NAV0);if($('#nav').dataset.g!==String(s.gender)){$('#nav').innerHTML=nv;$('#nav').dataset.g=s.gender}$$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===view()));document.title=(s.school?s.school+' — ':'')+'لوحة قيادة المدرسة';
 const lg=$('#topLogo');if(s.logo){lg.src=s.logo;lg.hidden=false}else lg.hidden=true;
 $('#sampleBar').hidden=!hasSample();const o=DB.tasks.filter(x=>isOver('tasks',x)).length;$('#navOver').hidden=!o;$('#navOver').textContent=o;const nc=navCounts();$$('#nav a').forEach(a=>{let sp=a.querySelector('.navf');const n=nc[a.dataset.v];if(n==null)return;if(!sp){sp=document.createElement('span');sp.className='navf';sp.title='عدد الملفات المرفوعة';a.appendChild(sp)}sp.textContent=n?'📎'+n:'';sp.hidden=!n});
 const oo=DB.oplan.filter(x=>isOver('oplan',x)).length;$('#navOp').hidden=!oo;$('#navOp').textContent=oo;
 $('#todayDate').innerHTML=[s.principal?esc(leaderLbl()+': '+s.principal):'',esc(schoolMeta()),esc(supInfo()),fmtDate(today(),s.hijri)].filter(Boolean).join(' — ');$('#todayDate').title=$('#todayDate').textContent;$('#verLbl').textContent='الإصدار '+APP_VERSION;
 const ib=$('#instBtn');if(ib)ib.hidden=!deferredInstall;bell(false)}

/* ---------- Bell & reminders ---------- */
function dueTasks(){const t=today();return DB.tasks.filter(x=>x.status!=='مكتملة'&&x.due&&x.due<=t)}
function bell(open){const list=dueTasks(),seen=DB.notified._seen||'';const unread=list.filter(x=>!seen.includes(x.id)).length;
 const b=$('#bellBadge');b.hidden=!unread;b.textContent=unread;
 if(open===false)return;const p=$('#bellPanel');
 p.innerHTML=`<div class="row"><b class="grow">المهام المستحقة والمتأخرة (${list.length})</b><button class="iconbtn" style="background:var(--soft);color:var(--text)" data-act="bellclose" aria-label="إغلاق">✕</button></div>`+
 (list.length?PERIODS.map(pr=>{const a=list.filter(x=>x.period===pr);return a.length?`<h4>${pr}</h4>`+a.map(x=>`<div class="it"><span>${esc(x.title)}</span><span>${x.due<today()?'<span class="pill red">متأخرة</span>':'<span class="pill amber">اليوم</span>'} <button class="btn sm gold" data-act="done" data-c="tasks" data-id="${x.id}" aria-label="إنجاز">✓</button></span></div>`).join(''):''}).join(''):'<div class="empty">لا توجد تنبيهات 🎉</div>')+
 `<p class="small muted">تعمل التذكيرات أثناء فتح التطبيق أو تشغيله مثبّتاً. ${'Notification' in window&&Notification.permission!=='granted'?'<button class="btn sm ghost" data-act="notif">تفعيل الإشعارات</button>':''}</p>`;
 p.style.top=(document.querySelector('.top').getBoundingClientRect().bottom+6)+'px';p.hidden=false;DB.notified._seen=list.map(x=>x.id).join(',');save();b.hidden=true}
let actx;const unlockAudio=()=>{try{if(!actx)actx=new (window.AudioContext||window.webkitAudioContext)();actx.resume()}catch(e){}};['pointerdown','keydown'].forEach(ev=>addEventListener(ev,unlockAudio,{once:true,capture:true}));
function chime(){if(DB.settings.mute||!actx)return;try{actx.resume();const t=actx.currentTime;
 [880,1318.5].forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t+i*.18);g.gain.linearRampToValueAtTime(.25,t+i*.18+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.18+.9);o.connect(g).connect(actx.destination);o.start(t+i*.18);o.stop(t+i*.18+1)})}catch(e){}}
function checkReminders(){const now=new Date(),t=today(),hm=pad(now.getHours())+':'+pad(now.getMinutes());let fired=[];
 DB.tasks.forEach(x=>{if(x.status==='مكتملة'||!x.due||x.due>t)return;const when=x.remind||DB.settings.remindTime||'07:30';const key=x.id+'@'+t;
  if(hm>=when&&!DB.notified[key]){DB.notified[key]=1;fired.push(x)}});
 Object.keys(DB.notified).forEach(k=>{if(k.includes('@')&&k.split('@')[1]<addDays(t,-14))delete DB.notified[k]});
 if(!fired.length)return;save();chime();
 const msg=fired.length===1?fired[0].title:fired.length+' مهام مستحقة/متأخرة';toast('🔔 '+msg);
 if('Notification' in window&&Notification.permission==='granted'){try{const n=new Notification('تذكير — لوحة قيادة المدرسة',{body:msg,icon:'icon-192.png',tag:'sld-'+t,lang:'ar',dir:'rtl'});n.onclick=()=>{window.focus();location.hash='#tasks'}}catch(e){navigator.serviceWorker?.ready.then(r=>r.showNotification('تذكير — لوحة قيادة المدرسة',{body:msg,icon:'icon-192.png'}))}}
 bell(false);chrome()}

/* ---------- Export ---------- */
function rowsFor(c,from,to){const k=S[c].date;return DB[c].filter(x=>(!from||(x[k]||'')>=from)&&(!to||(x[k]||'')<=to))}
function plainVal(c,k,x){if(S[c].vc&&S[c].vc[k])return S[c].vc[k](x,false);if(k==='rate'){const r=attRate(x);return r==null?'':r+'%'}const f=S[c].f.find(y=>y.k===k)||{};if(f.type==='rows')return (Array.isArray(x[k])?x[k]:[]).map(r=>f.rc.map(cc=>r[cc.k]).filter(v=>v!==''&&v!=null).join(' ')+'').join('؛ ');return f.type==='date'?fmtPlain(x[k]):(x[k]??'')}
function download(name,content,type){const b=content instanceof Blob?content:new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
const csvCell=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
function csv(c,rows){const keys=[...S[c].f.filter(f=>f.type!=='head').map(f=>f.k),...(c==='attendance'?['rate']:[])];
 const out=[keys.map(k=>lbl(c,k)).concat(['بيانات تجريبية'])].concat(rows.map(x=>keys.map(k=>plainVal(c,k,x)).concat([x.sample?'نعم':''])));
 download(`${S[c].t}-${today()}.csv`,'\ufeff'+out.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8')}
const xe=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');
function xls(cols){let x='<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="h"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0F2747" ss:Pattern="Solid"/></Style></Styles>';
 cols.forEach(c=>{const keys=[...S[c].f.filter(f=>f.type!=='head').map(f=>f.k),...(c==='attendance'?['rate']:[])];
  x+=`<Worksheet ss:Name="${xe(S[c].t.slice(0,31))}" ss:RightToLeft="1"><Table><Row>${keys.map(k=>`<Cell ss:StyleID="h"><Data ss:Type="String">${xe(lbl(c,k))}</Data></Cell>`).join('')}</Row>`+
  DB[c].map(r=>'<Row>'+keys.map(k=>{const v=plainVal(c,k,r);const num=typeof r[k]==='number';return `<Cell><Data ss:Type="${num?'Number':'String'}">${xe(v)}</Data></Cell>`}).join('')+'</Row>').join('')+'</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><DisplayRightToLeft/></WorksheetOptions></Worksheet>'});
 download(`لوحة-قيادة-المدرسة-${today()}.xls`,x+'</Workbook>','application/vnd.ms-excel')}

/* ---------- Print ---------- */
function printHead(title,sub){const s=DB.settings;return `<div class="ph">${s.logo?`<img src="${s.logo}" alt="">`:''}<div><div style="font-size:11pt">المملكة العربية السعودية — وزارة التعليم${s.region?' — '+esc(s.region):''}</div><div style="font-weight:800;font-size:14pt">${esc(s.school||'')}</div>${supInfo()?`<div style="font-size:10pt">${esc(supInfo())}</div>`:''}<div style="font-size:10pt">${schoolMeta()?esc(schoolMeta())+' — ':''}${s.year?'العام الدراسي '+esc(s.year)+' — ':''}تاريخ الطباعة: ${fmtPlain(today())}</div></div></div><h2>${esc(title)}</h2>${sub?`<p>${sub}</p>`:''}${hasSample()?'<p style="color:#b45309"><b>تنبيه: يتضمن التقرير بيانات تجريبية للتوضيح فقط.</b></p>':''}`}
function ptable(c,rows){const keys=S[c].cols;const ev=rows.some(x=>filesOf(c,x.id).length);return rows.length?`<table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><thead><tr>${keys.map(k=>`<th>${esc(lbl(c,k))}</th>`).join('')}${ev?'<th>الشواهد</th>':''}</tr></thead><tbody>${rows.map(x=>`<tr>${keys.map(k=>`<td>${esc(plainVal(c,k,x))}${k===keys[0]&&x.sample?' (تجريبي)':''}</td>`).join('')}${ev?`<td>${evPrint(c,x.id)}</td>`:''}</tr>`).join('')}</tbody></table>`:'<p>لا توجد سجلات.</p>'}
const sig=()=>`<div class="sig"><div>${leaderLbl()}: ${esc(DB.settings.principal||'....................')}</div><div>التوقيع: ....................</div><div>الختم</div></div><div class="credit-print" style="text-align:center;font-size:9pt;color:#c00000;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin-top:24px;border-top:1px solid #ccc;padding-top:6px">${CREDIT}<div class="contact-print" style="color:#333;font-weight:600;margin-top:3px">للتواصل: <bdi>0504153442</bdi> ${WA_SVG.replace('width="18" height="18"','width="12" height="12"')}</div></div><div class="copy-print" style="text-align:center;font-size:8pt;color:#555;margin-top:2px">${COPYRIGHT}</div>`;
function doPrint(type,from,to){let h='';const range=from||to?`الفترة: ${from?fmtPlain(from):'…'} — ${to?fmtPlain(to):'…'}`:'';
 if(type==='weekly'){to=today();from=addDays(to,-6);const st=stats();h=printHead('التقرير الأسبوعي','الفترة: '+fmtPlain(from)+' — '+fmtPlain(to));
  const att=rowsFor('attendance',from,to),e=att.reduce((s,x)=>s+(+x.enrolled||0),0),a=att.reduce((s,x)=>s+(+x.absent||0),0);
  const done=DB.tasks.filter(x=>x.doneAt&&x.doneAt>=from&&x.doneAt<=to);
  h+=`<section><h3>مؤشرات الأسبوع</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>نسبة حضور الطلاب</th><td>${e?Math.round((e-a)/e*1000)/10+'%':'—'}</td><th>مهام منجزة</th><td>${done.length}</td><th>مهام متأخرة</th><td>${st.over}</td></tr><tr><th>زيارات صفية</th><td>${rowsFor('visits',from,to).length}</td><th>حالات سلوك</th><td>${rowsFor('incidents',from,to).length}</td><th>اجتماعات</th><td>${rowsFor('meetings',from,to).length}</td></tr><tr><th>أنشطة</th><td>${rowsFor('activities',from,to).length}</td><th>تواصل أولياء أمور</th><td>${rowsFor('parents',from,to).length}</td><th>إنجاز خطة التحسين</th><td>${st.actPct==null?'—':st.actPct+'%'}</td></tr><tr><th>برامج التوجيه</th><td>${rowsFor('guidance',from,to).length}</td><th>المستفيدون</th><td>${rowsFor('guidance',from,to).reduce((a,x)=>a+(+x.beneficiaries||0),0)}</td><th>حالات فردية مفتوحة</th><td>${st.gOpen}</td></tr></table></section>`;
  h+=`<section><h3>المهام المنجزة</h3>${ptable('tasks',done)}</section><section><h3>المهام المتأخرة</h3>${ptable('tasks',DB.tasks.filter(x=>isOver('tasks',x)))}</section>`;
  ['visits','incidents','meetings','activities','guidance','gcases','parents','pd'].forEach(c=>h+=`<section><h3>${S[c].t}</h3>${ptable(c,rowsFor(c,from,to))}</section>`);
  h+=`<section><h3>بنود الخطة التشغيلية المتأخرة</h3>${ptable('oplan',DB.oplan.filter(x=>isOver('oplan',x)))}</section>`;
  h+=`<section><h3>الأسبوع القادم</h3>${ptable('tasks',DB.tasks.filter(x=>x.status!=='مكتملة'&&x.due>to&&x.due<=addDays(to,7)))}</section>`}
 else if(type==='summary'){const st=stats();h=printHead('الملخص العام',range);
  h+=`<section><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>نسبة الحضور (30 يوماً)</th><td>${st.attRate??'—'}${st.attRate!=null?'%':''}</td><th>إنجاز المهام</th><td>${st.taskPct??'—'}${st.taskPct!=null?'%':''}</td></tr><tr><th>المهام المتأخرة</th><td>${st.over}</td><th>حالات مفتوحة</th><td>${st.incOpen}</td></tr><tr><th>زيارات هذا الشهر</th><td>${st.visM}</td><th>المراجعة الذاتية</th><td>${st.review??'—'}${st.review!=null?'%':''}</td></tr><tr><th>برامج التوجيه (90 يوماً)</th><td>${st.gProg.length} (${st.gProg.reduce((a,x)=>a+(+x.beneficiaries||0),0)} مستفيد)</td><th>الحالات الفردية المفتوحة</th><td>${st.gOpen}</td></tr><tr><th>تنفيذ خطة التوجيه</th><td>${st.gPlan??'—'}${st.gPlan!=null?'%':''}</td><th>الشواهد المرفوعة</th><td>${st.ev}</td></tr><tr><th>إنجاز الخطة التشغيلية</th><td>${st.opPct??'—'}${st.opPct!=null?'%':''}</td><th>بنود الخطة المتأخرة</th><td>${st.opOver}</td></tr><tr><th>اللجان السارية</th><td>${DB.committees.filter(x=>x.status!=='منتهية').length} (${DB.committees.filter(x=>x.status!=='منتهية'&&comMeetings(x).length).length} لها اجتماعات)</td></tr><tr><th>ساعات النمو المهني</th><td>${st.pdHours} ساعة (${st.pdCount} برنامج، ${st.pdBen} مستفيد)</td><th>تنفيذ خطة النمو المهني</th><td>${st.pdPlan??'—'}${st.pdPlan!=null?'%':''}</td></tr></table></section>`;
  h+=`<section><h3>حسب المجال</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>المجال</th><th>المهام</th><th>المنجز</th><th>إجراءات التحسين</th><th>المراجعة الذاتية</th><th>الخطة التشغيلية</th></tr>${DOMAINS.map(d=>{const a=DB.tasks.filter(x=>x.domain===d),op=DB.oplan.filter(x=>x.domain===d),opp=op.length?Math.round(op.reduce((s,x)=>s+(x.status==='منجز'?100:+x.progress||0),0)/op.length)+'% ('+op.length+')':'—';return `<tr><td>${d}</td><td>${a.length}</td><td>${a.filter(x=>x.status==='مكتملة').length}</td><td>${DB.actions.filter(x=>x.domain===d).length}</td><td>${reviewPct(d)??'—'}${reviewPct(d)!=null?'%':''}</td><td>${opp}</td></tr>`}).join('')}</table></section>`}
 else if(type==='review'){h=printHead('المراجعة الذاتية','متوسط عام: '+(reviewPct()??'—')+(reviewPct()!=null?'%':''));
  DOMAINS.forEach(d=>{h+=`<section><h3>${d} — ${reviewPct(d)??'—'}${reviewPct(d)!=null?'%':''}</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>المؤشر</th><th>التقدير</th><th>الشواهد</th></tr>${REVIEW[d].map((q,i)=>{const v=(DB.review[d]||{})[i]||{};return `<tr><td>${esc(q)}</td><td>${({2:'متحقق',1:'متحقق جزئياً',0:'غير متحقق'})[v.s]||'—'}</td><td>${esc(v.n||'')}${evPrint('review',d+'|'+i)}</td></tr>`}).join('')}</table></section>`})}
 else if(type==='oplan'){const pf=planFiles()[0];h=printHead(S.oplan.t,(pf?'ملف الخطة المعتمد: '+esc(pf.name)+(pf.meta&&pf.meta.year?' — العام '+esc(pf.meta.year):'')+' — ':'')+'نسبة الإنجاز العامة: '+(stats().opPct??'—')+'%');DOMAINS.forEach(d=>{const r=rowsFor('oplan',from,to).filter(x=>x.domain===d);h+=`<section><h3>${d} (${r.length})</h3>${ptable('oplan',r)}</section>`})}
 else if(type==='tasks'){const r=rowsFor('tasks',from,to);h=printHead(S.tasks.t,(range?range+' — ':'')+'الإنجاز: '+r.filter(x=>x.status==='مكتملة').length+' من '+r.length);PERIODS.forEach(p=>{const a=r.filter(x=>x.period===p).sort((x,y)=>(DOMAINS.indexOf(x.domain)-DOMAINS.indexOf(y.domain))||String(x.due).localeCompare(String(y.due)));if(a.length)h+=`<section><h3>${PICON[p]} المهام — ${p} (${a.filter(x=>x.status==='مكتملة').length}/${a.length})</h3>${ptable('tasks',a)}</section>`})}
 else if(type==='examsall'){h=examPrint('')}
 else if(type==='impact'){h=impPrint('')}
 else if(type==='evals'){h=evPrintAll('')}
 else if(type==='surveys'){h=svPrint('')}
 else if(type==='committees'){h=printHead(S.committees.t,range);h+=`<section>${ptable('committees',rowsFor('committees',from,to))}</section>`;h+=`<section><h3>ملخص الاجتماعات</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>اللجنة</th><th>الرئيس</th><th>عدد الاجتماعات</th><th>آخر اجتماع</th><th>الملفات</th></tr>${DB.committees.map(c=>{const ms=comMeetings(c);return `<tr><td>${esc(comName(c))}</td><td>${esc(c.head||'')}</td><td>${ms.length}</td><td>${ms[0]?fmtPlain(ms[0].date):''}</td><td>${comFiles(c)}</td></tr>`}).join('')}</table></section>`}
 else if(S[type]){let r=rowsFor(type,from,to);h=printHead(S[type].t,range)+`<section>${ptable(type,r)}</section>`}
 const pv=type==='summary'||type==='weekly'?'reports':type;h+=secPrint(pv);
 $('#printArea').innerHTML=fem(h)+sig();const imgs=$$('#printArea img');Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))).then(()=>setTimeout(()=>window.print(),50))}

/* ---------- Sample data (clearly labeled) ---------- */
function loadSample(){if(hasSample()&&!confirm('توجد بيانات تجريبية بالفعل. إضافة المزيد؟'))return;const t=today(),sm={sample:true};const P=(c,o)=>DB[c].push({id:uid(),...sm,...o});
 DB.templates.slice(0,8).forEach((x,i)=>P('tasks',{title:x.title,domain:x.domain,period:x.period,due:addDays(t,i-3),priority:i%3?'متوسطة':'عالية',status:i<2?'مكتملة':i===3?'قيد التنفيذ':'جديدة',owner:'مدير المدرسة',recur:'لا يتكرر'}));
 for(let d=0;d<5;d++)['الأول/1','الثاني/1','الثالث/1'].forEach((c,j)=>P('attendance',{date:addDays(t,-d),cls:c,enrolled:30,absent:(d+j)%4+1,late:j,excused:0}));
 P('visits',{date:addDays(t,-2),teacher:'معلم (مثال)',subject:'الرياضيات',cls:'الثاني/1',type:'إشرافية',rating:4,strengths:'إدارة صف جيدة',improve:'تنويع التقويم'});
 P('incidents',{date:addDays(t,-1),student:'طالب (مثال)',cls:'الأول/1',type:'تأخر متكرر',degree:'الأولى',status:'مفتوحة',action:'تواصل مع ولي الأمر'});
 P('meetings',{date:addDays(t,-4),title:'اجتماع المعلمين (مثال)',type:'المعلمين',domain:'الإدارة المدرسية',minutes:'مناقشة نتائج التقويم',decisions:'تفعيل الخطط العلاجية'});
 P('activities',{title:'مسابقة القراءة (مثال)',type:'ثقافي',date:addDays(t,6),owner:'رائد النشاط',participants:25,status:'مخطط'});
 P('events',{title:'اجتماع أولياء الأمور (مثال)',kind:'فعالية مدرسية',date:addDays(t,10),status:'مخطط'});
 P('actions',{action:'رفع نسبة المواظبة عبر برنامج تحفيزي (مثال)',domain:'نواتج التعلم',owner:'الموجه الطلابي',deadline:addDays(t,20),status:'قيد التنفيذ',progress:40});
 P('oplan',{domain:'نواتج التعلم',goal:'رفع مستوى التحصيل في القراءة (مثال)',program:'برنامج القراءة اليومية',actions:'حصة قراءة أسبوعية',owner:'منسق اللغة العربية',start:addDays(t,-30),end:addDays(t,-2),kpi:'نسبة المتقنين',target:'80%',status:'قيد التنفيذ',progress:55});
 P('oplan',{domain:'البيئة المدرسية',goal:'تعزيز الأمن والسلامة (مثال)',program:'خطة الإخلاء',owner:'وكيل المدرسة',start:addDays(t,-10),end:addDays(t,40),kpi:'عدد التجارب',target:'2',status:'قيد التنفيذ',progress:30});
 P('pd',{title:'مجتمع تعلم: استراتيجيات التقويم البنائي (مثال)',type:'مجتمع تعلم مهني',date:addDays(t,-6),hours:2,count:12,provider:'المدرسة',executor:'وكيل الشؤون التعليمية',domain:'التعليم والتعلم',status:'منفذ',impact:'تطبيق بطاقات الخروج في الحصص'});
 P('pdplan',{title:'دورة التعلم النشط (مثال)',type:'دورة',target:'المعلمون الجدد',date:addDays(t,20),hours:6,owner:'منسق التطوير المهني',status:'مخطط'});
 P('guidance',{title:'برنامج تعزيز الانضباط (مثال)',field:'سلوكي',date:addDays(t,-3),target:'طلاب الصف الأول',beneficiaries:60,executor:'المرشد الطلابي',objectives:'خفض التأخر الصباحي',outcome:'انخفاض ملحوظ في التأخر'});
 P('gcases',{date:addDays(t,-5),student:'طالب (مثال)',cls:'الثاني/1',kind:'دراسية',referral:'ولي الأمر',status:'قيد المتابعة',next:addDays(t,2)});
 P('gplan',{title:'برنامج التوجيه المهني (مثال)',field:'مهني',date:addDays(t,14),target:'الصف الثالث',executor:'المرشد الطلابي',status:'مخطط'});
 audit('تحميل بيانات تجريبية','settings',{title:'بيانات تجريبية'});save();render();toast('حُمّلت بيانات تجريبية معلَّمة')}
function clearSample(){let n=0;COLS.forEach(c=>{const b=DB[c].length;DB[c]=DB[c].filter(x=>!x.sample);n+=b-DB[c].length});audit('حذف البيانات التجريبية','settings',{title:n+' سجل'});save();render();toast('حُذف '+n+' سجل تجريبي')}

/* ---------- Import with integrity checks ---------- */
async function sha(s){if(!crypto.subtle)return'';const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function backupText(){const data={...DB};const body=JSON.stringify(data);const files=await filesForExport();return JSON.stringify({format:'school-leader-dashboard-backup',version:APP_VERSION,exported:new Date().toISOString(),sha256:await sha(body),data,files,filesSha256:await sha(JSON.stringify(files))})}
async function exportJSON(){const tf=FILES.reduce((a,f)=>a+f.size,0);if(tf>40*1048576&&!confirm(`حجم الملفات المرفقة كبير (${fsize(tf)})، فستكون النسخة الاحتياطية كبيرة (≈ ${fsize(tf*1.37)}) وقد يستغرق تنزيلها وقتاً. متابعة؟`))return;
 download(`نسخة-احتياطية-لوحة-القيادة-${today()}.json`,await backupText(),'application/json');DB.settings.lastBackup=today();DB.settings.backupSnooze='';save();bkHide();if(view()==='settings')render()}
async function importJSON(file){try{if(file.size>400e6)throw new Error('الملف كبير جداً');const txt=await file.text();let w;try{w=JSON.parse(txt)}catch(e){throw new Error('الملف ليس JSON صالحاً')}
 let data=w;if(w&&w.format==='school-leader-dashboard-backup'){data=w.data;if(w.sha256&&crypto.subtle){const h=await sha(JSON.stringify(data));const hf=w.files&&w.filesSha256?await sha(JSON.stringify(w.files)):w.filesSha256;if((h!==w.sha256||hf!==w.filesSha256)&&!confirm('تحذير: بصمة الملف لا تطابق محتواه (ربما عُدّل أو تلف). المتابعة؟'))return}}
 if(!data||data.app!=='school-leader-dashboard')throw new Error('الملف ليس نسخة احتياطية من هذا التطبيق');
 const n=normalize(data);const cnt=COLS.reduce((s,c)=>s+n[c].length,0);const wf=Array.isArray(w&&w.files)?w.files:null;
 if(!confirm(`سيتم استبدال البيانات الحالية بالنسخة المستوردة (${cnt} سجل${wf?' و'+wf.length+' ملف شواهد':''}). يُنصح بتصدير نسخة من بياناتك الحالية أولاً. متابعة؟`))return;
 DB=n;mergeTemplates();mergeCommittees();mergeOfficial();let nf=0;if(wf)nf=await restoreFiles(wf);audit('استيراد نسخة احتياطية','settings',{title:cnt+' سجل، '+nf+' ملف'});save();render();toast('تم الاستيراد بنجاح'+(wf?' ('+nf+' ملف)':''))}catch(e){alert('تعذّر الاستيراد: '+e.message)}}
function setLogo(file){if(!file||!/^image\//.test(file.type)){toast('اختر ملف صورة');return}const img=new Image(),u=URL.createObjectURL(file);
 img.onload=()=>{const m=256,r=Math.min(1,m/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);c.getContext('2d').drawImage(img,0,0,c.width,c.height);DB.settings.logo=c.toDataURL('image/png');URL.revokeObjectURL(u);audit('تحديث الشعار','settings',{title:'الشعار'});save();render()};
 img.onerror=()=>toast('تعذّر قراءة الصورة');img.src=u}

function stageGenderFields(s){return `<fieldset class="fld" style="margin-bottom:10px;border:1px solid var(--line);border-radius:10px"><legend>المرحلة الدراسية (يمكن اختيار أكثر من مرحلة للمجمّعات)</legend><div class="btns">${STAGES.map(x=>`<label><input type="checkbox" name="stage" value="${x}" ${(s.stages||[]).includes(x)?'checked':''}> ${x}</label>`).join('')}</div></fieldset>
 <fieldset class="fld" style="margin-bottom:10px;border:1px solid var(--line);border-radius:10px"><legend>نوع المدرسة</legend><div class="btns">${['بنين','بنات'].map(x=>`<label><input type="radio" name="gender" value="${x}" ${s.gender===x?'checked':''}> ${x}</label>`).join('')}</div><span class="small muted">عند اختيار «بنات» تتحول المسميات إلى صيغة المؤنث (قائدة المدرسة، المعلمات، الطالبات).</span></fieldset>`}
function readSG(f){DB.settings.stages=$$('input[name=stage]:checked',f).map(x=>x.value).filter(x=>STAGES.includes(x));const g=$('input[name=gender]:checked',f);DB.settings.gender=g&&['بنين','بنات'].includes(g.value)?g.value:''}
function setupWizard(){const f=$('#dlgForm'),s=DB.settings;
 f.innerHTML=`<div class="dlg-h"><span>مرحباً — إعداد المدرسة لأول مرة</span></div><div class="dlg-b" style="grid-template-columns:1fr">
 <p class="small muted" style="margin:0">أدخل بيانات مدرستك (يمكن تعديلها لاحقاً من الإعدادات). تُحفظ البيانات على هذا الجهاز فقط.</p>
 <div class="fld"><label for="w_school">اسم المدرسة <span class="req">*</span></label><input id="w_school" name="school" maxlength="120" value="${esc(s.school)}"><span class="err" id="we_school"></span></div>
 <div class="fld"><label for="w_principal">اسم قائد/قائدة المدرسة</label><input id="w_principal" name="principal" maxlength="120" value="${esc(s.principal)}"></div>
 <div class="fld"><label for="w_sup">المشرف/المشرفة المتابع(ة) للمدرسة</label><input id="w_sup" name="supervisor" maxlength="120" value="${esc(s.supervisor)}"></div>
 <div class="fld"><label for="w_supm">جوال المشرف/المشرفة (اختياري)</label><input id="w_supm" name="supervisorMobile" inputmode="tel" maxlength="20" value="${esc(s.supervisorMobile)}"><span class="err" id="we_supm"></span></div>
 ${stageGenderFields(s)}</div><div class="dlg-f"><button class="btn gold" type="submit">بدء الاستخدام</button><button class="btn ghost" type="button" data-skip>تخطي الآن</button></div>`;
 const dlg=$('#dlg');
 f.onsubmit=e=>{e.preventDefault();const sc=f.elements.school.value.trim();if(!sc){$('#we_school').textContent='اسم المدرسة مطلوب';f.elements.school.focus();return}
  const mob=f.elements.supervisorMobile.value.trim().replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));if(mob&&!/^\+?\d[\d\s-]{7,14}$/.test(mob)){$('#we_supm').textContent='رقم غير صالح';return}
  s.school=sc.slice(0,120);s.principal=f.elements.principal.value.trim().slice(0,120);s.supervisor=f.elements.supervisor.value.trim().slice(0,120);s.supervisorMobile=mob;readSG(f);s.setupDone=true;audit('الإعداد الأولي','settings',{title:s.school});save();dlg.close();render();toast('تم حفظ بيانات المدرسة')};
 f.onkeydown=null;$('[data-skip]',f).onclick=()=>{s.setupDone=true;save();dlg.close()};
 dlg.showModal();setTimeout(()=>f.elements.school.focus(),30)}

/* ---------- Evidence files (IndexedDB blobs) ---------- */
let FILES=[];const URLS={};let idb;
const MAXF=15*1024*1024,WARNF=5*1024*1024;
function idbOpen(){return new Promise((res,rej)=>{if(!('indexedDB' in window))return rej(new Error('IndexedDB غير مدعوم'));const r=indexedDB.open('sld-files',1);r.onupgradeneeded=()=>r.result.createObjectStore('files',{keyPath:'id'});r.onsuccess=()=>res(idb=r.result);r.onerror=()=>rej(r.error)})}
const tx=(m)=>idb.transaction('files',m).objectStore('files');
const idbReq=r=>new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function loadFiles(){try{await idbOpen();FILES=await idbReq(tx('readonly').getAll());
 const old=FILES.filter(f=>f.col==='wkr');if(old.length){for(const f of old){try{await idbReq(tx('readwrite').delete(f.id))}catch(e){}}FILES=FILES.filter(f=>f.col!=='wkr')}}catch(e){console.warn(e);FILES=[]}}
const filesOf=(c,rid)=>FILES.filter(f=>f.col===c&&f.rid===rid);
const furl=f=>URLS[f.id]||(URLS[f.id]=URL.createObjectURL(f.blob));
const isImg=f=>/^image\//.test(f.type);
const ficon=f=>/pdf/.test(f.type)||/\.pdf$/i.test(f.name)?'📕':/word|\.docx?$/i.test(f.type+f.name)?'📘':/sheet|excel|\.xlsx?$|\.csv$/i.test(f.type+f.name)?'📗':/presentation|\.pptx?$/i.test(f.type+f.name)?'📙':'📄';
const fsize=n=>n>1048576?(n/1048576).toFixed(1)+' م.ب':Math.max(1,Math.round(n/1024))+' ك.ب';
function compressImg(file){return new Promise(res=>{if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size<400*1024)return res(file);const u=URL.createObjectURL(file),img=new Image();
 img.onload=()=>{const m=1600,r=Math.min(1,m/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);
  c.toBlob(b=>res(b&&b.size<file.size?new File([b],file.name.replace(/\.(png|webp)$/i,'.jpg'),{type:'image/jpeg'}):file),'image/jpeg',.8)};img.onerror=()=>{URL.revokeObjectURL(u);res(file)};img.src=u})}
async function addFiles(c,rid,list,meta){if(!idb){toast('تخزين الملفات غير متاح في هذا المتصفح');return}let n=0,big=[];
 for(const f0 of list){if(f0.size>(/^image\//.test(f0.type)?60*1024*1024:MAXF)){big.push(f0.name);continue}const f=await compressImg(f0);if(f.size>MAXF){big.push(f0.name);continue}if(f.size>WARNF&&!confirm(`الملف «${f.name}» كبير (${fsize(f.size)}) وقد يستهلك مساحة التخزين ويكبّر النسخة الاحتياطية. متابعة؟`))continue;
  const rec={id:uid(),col:c,rid,meta:meta||undefined,name:String(f.name||'ملف').slice(0,150),type:f.type||'application/octet-stream',size:f.size,added:new Date().toISOString(),blob:f};
  try{await idbReq(tx('readwrite').put(rec));FILES.push(rec);n++}catch(e){toast('تعذّر حفظ الملف: قد تكون المساحة ممتلئة');break}}
 if(big.length)alert('تجاوزت هذه الملفات الحد الأقصى (15 م.ب) ولم تُرفع:\n'+big.join('\n'));
 if(n){audit('رفع شواهد',c,{title:evTitle(c,rid)+' ('+n+')'});save();toast('رُفع '+n+' ملف')}}
async function delFile(id){const f=FILES.find(x=>x.id===id);if(!f)return;await idbReq(tx('readwrite').delete(id));FILES=FILES.filter(x=>x.id!==id);if(URLS[id]){URL.revokeObjectURL(URLS[id]);delete URLS[id]}audit('حذف شاهد',f.col,{title:f.name});save()}
async function delFilesOf(c,rid){for(const f of filesOf(c,rid))await delFile(f.id)}
function evTitle(c,rid){if(c==='emgmap')return 'وضع الطوارئ — مخطط الإخلاء';if(c==='comtask'){const[cid,tid]=rid.split(':');const cm=DB.committees.find(x=>x.id===cid);const t=cm&&cm.off&&(cm.off.tasks||[]).find(x=>x.id===tid);return comName(cm)+' — مهمة: '+(t?t.t.slice(0,60):'')}if(c.startsWith('com:')||c.startsWith('exm:'))return 'ملفات '+viewTitle(c);if(c.startsWith('sec:'))return 'ملفات القسم: '+viewTitle(c.slice(4));if(c==='opfile')return 'ملف الخطة التشغيلية';if(c==='review'){const[d,i]=rid.split('|');return d+': '+(REVIEW[d]||[])[i]}const x=(DB[c]||[]).find(y=>y.id===rid);return itemTitle(c,x)||'(سجل محذوف)'}
const audCol=c=>{if(!c)return '';if(c==='settings')return 'الإعدادات';try{return secName(c)}catch(e){return c}};
const secName=c=>c==='emgmap'?'وضع الطوارئ — مخطط الإخلاء':c.startsWith('exm:')?viewTitle(c)+' — ملفات':c==='comtask'?'اللجان — مهام اللجان':c.startsWith('com:')?'اللجان — '+viewTitle(c):c.startsWith('sec:')?viewTitle(c.slice(4))+' — ملفات القسم':c==='opfile'?'ملف الخطة التشغيلية':c==='review'?'المراجعة الذاتية':(S[c]?.t||c);
function evBtn(c,rid){const n=filesOf(c,rid).length;return `<button type="button" class="btn sm ghost evb" data-act="ev" data-c="${c}" data-id="${esc(rid)}" title="تحميل شواهد العمل" aria-label="تحميل شواهد العمل (${n})">📎${n?`<span class="evn">${n}</span>`:''}</button>`}
function thumb(f,del=true){return `<div class="ev-it">${isImg(f)?`<img src="${furl(f)}" alt="${esc(f.name)}" loading="lazy">`:`<div class="ev-ic">${ficon(f)}</div>`}<div class="ev-nm" title="${esc(f.name)}">${esc(f.name)}</div><div class="small muted">${fsize(f.size)}</div>
 <div class="btns"><button type="button" class="btn sm ghost" data-act="evopen" data-id="${f.id}">عرض</button><button type="button" class="btn sm ghost" data-act="evdl" data-id="${f.id}">تنزيل</button>${del?`<button type="button" class="btn sm ghost" data-act="evdel" data-id="${f.id}" aria-label="حذف">🗑</button>`:''}</div></div>`}
let evCtx=null;
function openEv(c,rid){evCtx={c,rid};const f=$('#dlgForm'),fs=filesOf(c,rid);
 f.innerHTML=fem(`<div class="dlg-h"><span>شواهد العمل — ${esc(evTitle(c,rid))}</span><button type="button" class="iconbtn" data-x aria-label="إغلاق">✕</button></div>
 <div class="dlg-b" style="grid-template-columns:1fr"><div class="ev-drop" tabindex="0" data-act="evpick">⬆️ اضغط لاختيار ملفات أو اسحبها هنا<br><span class="small muted">صور، PDF، Word، Excel، PowerPoint — حتى 15 م.ب للملف، وتُضغط الصور الكبيرة تلقائياً. تُحفظ على هذا الجهاز وتعمل دون اتصال وتُضمَّن في النسخة الاحتياطية.</span></div>
 <div class="ev-grid">${fs.map(x=>thumb(x)).join('')||'<div class="empty">لا توجد شواهد بعد</div>'}</div></div>
 <div class="dlg-f"><button type="button" class="btn gold" data-act="evpick">＋ إضافة ملفات</button><button type="button" class="btn ghost" data-x>إغلاق</button></div>`);
 f.onsubmit=e=>e.preventDefault();f.onkeydown=null;$$('[data-x]',f).forEach(b=>b.onclick=()=>{$('#dlg').close()});
 const dr=$('.ev-drop',f);dr.ondragover=e=>{e.preventDefault();dr.classList.add('on')};dr.ondragleave=()=>dr.classList.remove('on');dr.ondrop=async e=>{e.preventDefault();await addFiles(c,rid,[...e.dataTransfer.files]);openEv(c,rid)};
 dr.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#evIn').click()}};
 const d=$('#dlg');if(!d.open)d.showModal()}
$('#dlg').addEventListener('close',()=>{if(evCtx){evCtx=null;render()}});
$('#dlg').addEventListener('close',()=>setTimeout(bkCheck,600));setTimeout(bkCheck,3000);setTimeout(calRemind,2500);setInterval(bkCheck,60000);
function evidenceView(){const F=flt.evidence=flt.evidence||{c:'',q:''};const secs=[...new Set(FILES.map(f=>f.col))];
 const list=FILES.filter(f=>(!F.c||f.col===F.c)&&(!F.q||(f.name+' '+evTitle(f.col,f.rid)).toLowerCase().includes(F.q.toLowerCase()))).sort((a,b)=>b.added.localeCompare(a.added));
 const tot=FILES.reduce((s,f)=>s+f.size,0);
 return `<div class="head"><div><h2>الشواهد</h2><div class="muted small">${FILES.length} ملف — الحجم الإجمالي ${fsize(tot)}. ارفع الشواهد من زر 📎 في أي سجل أو مؤشر.</div></div></div>
 <div class="card"><div class="filters"><select data-evf="c" aria-label="القسم"><option value="">كل الأقسام</option>${secs.map(c=>`<option value="${c}" ${F.c===c?'selected':''}>${esc(secName(c))} (${FILES.filter(f=>f.col===c).length})</option>`).join('')}</select><input type="search" data-evf="q" placeholder="بحث باسم الملف أو السجل" value="${esc(F.q)}" aria-label="بحث"></div>
 ${list.length?`<div class="ev-grid">${list.map(f=>`<div>${thumb(f)}<div class="small"><span class="pill blue">${esc(secName(f.col))}</span> <a href="#" data-act="ev" data-c="${f.col}" data-id="${esc(f.rid)}">${esc(evTitle(f.col,f.rid))}</a></div></div>`).join('')}</div>`:'<div class="empty">لا توجد شواهد</div>'}</div>`}
function evPrint(c,rid){const fs=filesOf(c,rid);if(!fs.length)return'';return fs.map(f=>isImg(f)?`<img src="${furl(f)}" style="width:60px;height:60px;object-fit:cover;border:1px solid #ccc;margin:2px" alt="">`:`<div style="font-size:8pt">${ficon(f)} ${esc(f.name)}</div>`).join('')}
const b64=b=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(b)});
async function filesForExport(){return Promise.all(FILES.map(async f=>({id:f.id,col:f.col,rid:f.rid,meta:f.meta,name:f.name,type:f.type,size:f.size,added:f.added,data:await b64(f.blob)})))}
async function restoreFiles(arr){if(!idb)return 0;await idbReq(tx('readwrite').clear());Object.keys(URLS).forEach(k=>{URL.revokeObjectURL(URLS[k]);delete URLS[k]});FILES=[];let n=0;
 for(const f of arr||[]){if(!f||f.col==='wkr'||typeof f.data!=='string'||!f.data.startsWith('data:'))continue;try{const blob=await (await fetch(f.data)).blob();const rec={id:String(f.id||uid()),col:String(f.col),rid:String(f.rid),meta:f.meta&&typeof f.meta==='object'?{year:String(f.meta.year||'').slice(0,40),note:String(f.meta.note||'').slice(0,200),group:f.meta.group?String(f.meta.group).slice(0,40):undefined}:undefined,name:String(f.name||'ملف').slice(0,150),type:String(f.type||blob.type),size:blob.size,added:f.added||new Date().toISOString(),blob};await idbReq(tx('readwrite').put(rec));FILES.push(rec);n++}catch(e){console.warn('file',e)}}return n}

/* ---------- Operational plan ---------- */
const planFiles=()=>FILES.filter(f=>f.col==='opfile').sort((a,b)=>b.added.localeCompare(a.added));
function oplanView(){return secCard('oplan')+`<div class="card"><div class="row" style="flex-wrap:wrap"><b class="grow">استيراد بنود الخطة</b><button class="btn ghost" data-act="optpl">نموذج استيراد CSV</button><button class="btn ghost" data-act="opimp">استيراد بنود من Excel/CSV</button></div></div>`+listView('oplan')}
function printHTML(h){$('#printArea').innerHTML=fem(h)+sig();const imgs=$$('#printArea img');Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))).then(()=>setTimeout(()=>window.print(),50))}
/* ---------- Voice input (Web Speech API; recognition is done by the browser) ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const VOICE={rec:null,el:null,btn:null,base:'',fin:'',user:false};
const VERR={'not-allowed':'لم يُسمح باستخدام الميكروفون. فعّل إذن الميكروفون لهذا الموقع من إعدادات المتصفح ثم حاول مجدداً.','service-not-allowed':'خدمة التعرّف على الصوت غير متاحة أو غير مسموح بها في هذا المتصفح.','network':'تعذّر التعرّف على الصوت: يحتاج هذا المتصفح إلى اتصال بالإنترنت للإدخال الصوتي.','no-speech':'لم يُلتقط صوت. اضغط 🎤 وتحدّث بوضوح.','audio-capture':'لا يوجد ميكروفون متاح على هذا الجهاز.','language-not-supported':'اللغة العربية غير مدعومة للتعرّف الصوتي في هذا المتصفح.','aborted':''};
function voiceNote(){if(SR||localStorage.getItem('sld_voice_note'))return;localStorage.setItem('sld_voice_note','1');setTimeout(()=>toast('الإدخال الصوتي 🎤 غير مدعوم في هذا المتصفح — استخدم Chrome أو Edge أو Safari للتحدث بدل الكتابة.'),1200)}
function voiceStop(){if(VOICE.rec){VOICE.user=true;try{VOICE.rec.stop()}catch(e){}}}
function voiceReset(){if(VOICE.btn){VOICE.btn.classList.remove('on');VOICE.btn.setAttribute('aria-pressed','false');VOICE.btn.title='إدخال بالصوت'}const w=VOICE.el&&VOICE.el.closest('.vw');if(w)w.classList.remove('listening');VOICE.rec=null;VOICE.el=null;VOICE.btn=null}
function voiceStart(el,btn){if(!SR)return voiceNote();if(VOICE.rec){const same=VOICE.el===el;voiceStop();if(same)return}
 if(!navigator.onLine)toast('أنت غير متصل — قد لا يعمل التعرّف الصوتي دون إنترنت في بعض المتصفحات.');
 let r;try{r=new SR()}catch(e){toast('تعذّر تشغيل الإدخال الصوتي في هذا المتصفح.');return}
 r.lang='ar-SA';r.interimResults=true;r.continuous=!/Android|iPhone|iPad/i.test(navigator.userAgent);r.maxAlternatives=1;
 Object.assign(VOICE,{rec:r,el,btn,base:el.value,fin:'',user:false});
 const put=t=>{const b=VOICE.base,sep=b&&!/\s$/.test(b)&&t?' ':'';let v=(b+sep+t);const mx=+el.getAttribute('maxlength')||0;if(mx>0)v=v.slice(0,mx);el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))};
 r.onstart=()=>{btn.classList.add('on');btn.setAttribute('aria-pressed','true');btn.title='جارٍ الاستماع… اضغط للإيقاف';el.closest('.vw')?.classList.add('listening')};
 r.onresult=e=>{let it='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)VOICE.fin+=(VOICE.fin&&!/\s$/.test(VOICE.fin)?' ':'')+t.trim();else it+=t}put((VOICE.fin+(it?(VOICE.fin?' ':'')+it.trim():'')).trim())};
 r.onerror=e=>{const m=VERR[e.error];if(m===undefined)toast('تعذّر الإدخال الصوتي ('+e.error+').');else if(m)toast(m)};
 r.onend=()=>{if(VOICE.rec===r){put(VOICE.fin.trim());el.dispatchEvent(new Event('change',{bubbles:true}));voiceReset()}};
 try{r.start()}catch(e){voiceReset();toast('تعذّر بدء الاستماع، حاول مجدداً.')}el.focus()}
function voiceWire(root){if(!root)return;const els=[...root.querySelectorAll('textarea,input:not([type]),input[type=text],input[type=search]')].filter(e=>!e.readOnly&&!e.disabled&&!e.closest('.vw')&&!e.hasAttribute('data-novoice'));
 if(!SR){if(els.length)voiceNote();return}
 els.forEach(el=>{const w=document.createElement('span');w.className='vw'+(el.tagName==='TEXTAREA'?' ta':'');el.parentNode.insertBefore(w,el);w.appendChild(el);
  const b=document.createElement('button');b.type='button';b.className='micb';b.textContent='🎤';b.title='إدخال بالصوت';b.setAttribute('aria-label','إدخال بالصوت');b.setAttribute('aria-pressed','false');b.tabIndex=-1;
  b.addEventListener('mousedown',e=>e.preventDefault());b.onclick=e=>{e.preventDefault();e.stopPropagation();voiceStart(el,b)};w.appendChild(b)})}

/* ---------- Exams ---------- */
const exRows=(c,k)=>DB[c].filter(x=>exKey(x.area)===k).sort((a,b)=>String(b.date||b.year||'').localeCompare(String(a.date||a.year||'')));
const exFiles=k=>FILES.filter(f=>f.col==='exm:'+k||(['exmeet','exact','exres'].includes(f.col)&&DB[f.col].some(x=>x.id===f.rid&&exKey(x.area)===k))).length;
function examsView(){return `<div class="head"><div><h2>📝 الاختبارات</h2><div class="muted small">الاختبارات الوطنية، والقدرات والتحصيلي، والاختبارات الدولية — اجتماعات وإجراءات وملفات ونتائج</div></div><div class="btns"><button class="btn ghost" data-act="exprint" data-id="">طباعة الكل</button></div></div>
 <div class="comgrid">${EXAREAS.map(([k,l,ic])=>{const a=exRows('exact',k),ms=exRows('exmeet',k),r=exRows('exres',k),d=a.filter(x=>x.status==='منفذ').length,pl=a.filter(x=>x.status!=='ملغى').length;
  return `<a class="comcard" href="#exam?${k}"><b>${ic} ${esc(l)}</b><div class="chips" style="margin-top:8px">${chip('🗓️ '+ms.length+' اجتماع','blue')}${chip('🧪 '+a.length+' إجراء','gray')}${chip('📈 '+r.length+' نتيجة','gray')}${chip('📁 '+exFiles(k)+' ملف','gray')}</div>
  ${pl?`<div class="row small" style="margin-top:8px"><span>المنفذ</span><div class="bar grow"><i style="width:${Math.round(d/pl*100)}%"></i></div><b>${Math.round(d/pl*100)}%</b></div>`:''}${ms[0]?`<div class="small muted" style="margin-top:6px">آخر اجتماع: ${fmtDate(ms[0].date,false)}</div>`:''}</a>`}).join('')}</div>`}
function examView(k){const a=exArea(k);if(!a)return '<div class="card empty">المجال غير موجود. <a href="#exams">العودة</a></div>';
 const blk=(c,ttl,cols,addl)=>{const r=exRows(c,k);return `<div class="card"><div class="row" style="flex-wrap:wrap"><h3 class="grow" style="margin:0">${ttl} (${r.length})</h3><button class="btn gold sm" data-act="exadd" data-c="${c}" data-id="${k}">＋ ${addl}</button>${c==='exmeet'?`<button class="btn ghost sm" data-act="mmode" data-id="x:${k}">🎙️ وضع الاجتماع</button>`:''}</div>${r.length?table(c,r,cols,''):'<div class="empty">لا توجد سجلات بعد</div>'}</div>`};
 return `<div class="head"><div><a href="#exams" class="small">→ الاختبارات</a><h2>${a[2]} ${esc(a[1])}</h2></div><div class="btns"><button class="btn ghost" data-act="exprint" data-id="${k}">طباعة</button></div></div>
 ${secCard('exm:'+k)}
 ${blk('exmeet','سجل الاجتماعات والمحاضر',['date','title'],'اجتماع/محضر')}
 ${blk('exact','الإجراءات والبرامج (إعداد، اختبارات تجريبية، تحليل نتائج…)',['date','title','type','target','status'],'إجراء/برنامج')}
 ${blk('exres','النتائج (تُدخل من التقارير الرسمية فقط)',['year','title','grade','subject','score','level'],'نتيجة')}`}
function examPrint(k){const ks=k?[k]:EXAREAS.map(a=>a[0]);let h=printHead(k?exArea(k)[1]:'تقرير الاختبارات',k?'الاختبارات':'الاختبارات الوطنية والقدرات والتحصيلي والدولية');
 ks.forEach(k=>{const a=exArea(k);if(!k||ks.length>1)h+=`<section><h2>${esc(a[1])}</h2></section>`;
  [['exmeet','الاجتماعات'],['exact','الإجراءات والبرامج'],['exres','النتائج']].forEach(([c,t])=>{const r=exRows(c,k);h+=`<section><h3>${t} (${r.length})</h3>${ptable(c,r)}</section>`});
  exRows('exmeet',k).filter(m=>m.minutes||m.decisions).forEach(m=>{h+=`<section><h3>محضر: ${esc(m.title)} — ${fmtPlain(m.date)}</h3>${m.minutes?`<p style="white-space:pre-line">${esc(m.minutes)}</p>`:''}${m.decisions?`<p><b>القرارات:</b> <span style="white-space:pre-line">${esc(m.decisions)}</span></p>`:''}</section>`});
  h+=secPrint('exm:'+k)});return h}
/* ---------- Committees cards & page ---------- */
const comMeetings=c=>DB.meetings.filter(m=>m.committee&&m.committee===c.name).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
const comFiles=c=>FILES.filter(f=>f.col==='com:'+c.id).length;
function comCards(){if(!DB.committees.length)return'';return `<div class="comgrid">${DB.committees.map(c=>{const ms=comMeetings(c),mem=String(c.members||'').split(/[\n،,]+/).filter(x=>x.trim()).length;
 const tp=comPct(c);return `<a class="comcard" href="#committee?${c.id}"><div class="row"><b class="grow">🧩 ${esc(comName(c))}</b>${chip(esc(c.status||'سارية'),c.status==='منتهية'?'gray':'green')}</div>
 <div class="small muted">${c.head?'الرئيس: '+esc(c.head):'<span style="color:var(--warn)">لم يُحدَّد الرئيس بعد</span>'}</div>
 <div class="chips" style="margin-top:6px">${chip('👥 '+mem+' عضو','gray')}${chip('🗓️ '+ms.length+' اجتماع','blue')}${chip('📁 '+comFiles(c)+' ملف','gray')}${c.builtin||c.official?chip('أساسية','dom'):''}${c.freq?chip('⏱️ '+esc(c.freq),'gray'):''}</div>
 ${tp?`<div class="row small" style="margin-top:6px"><span>إنجاز المهام</span><div class="bar grow"><i style="width:${tp.pct}%"></i></div><b>${tp.pct}%</b><span class="muted">(${tp.done}/${tp.total})</span></div>`:''}
 ${ms[0]?`<div class="small muted" style="margin-top:6px">آخر اجتماع: ${fmtDate(ms[0].date,false)}</div>`:''}</a>`}).join('')}</div>`}
function comPct(c){const ts=(c.off&&c.off.tasks)||[];if(!ts.length)return null;const d=ts.filter(t=>c.tdone&&c.tdone[t.id]).length;return {done:d,total:ts.length,pct:Math.round(d/ts.length*100)}}
function offSections(c,print){const o=c.off||{};const ul=a=>`<ul class="offl">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;const sec=(t,b)=>b?`<section class="${print?'':'card offc'}"><h3>${t}</h3>${b}</section>`:'';
 const tasks=(o.tasks||[]).length?`<ol class="offt">${o.tasks.map(t=>{const dn=!!(c.tdone&&c.tdone[t.id]);return `<li class="${dn?'dn':''}">${print?`<span>${dn?'☑':'☐'}</span> `:`<label class="tk"><input type="checkbox" data-ctask="${c.id}|${t.id}" ${dn?'checked':''} aria-label="منجزة"></label>`}<span class="tx">${esc(t.t)}</span>${print?'':evBtn('comtask',c.id+':'+t.id)}</li>`}).join('')}</ol>`:'';
 const tp=comPct(c);
 return sec('🎯 الهدف',o.goal?`<p class="offp">${esc(o.goal)}</p>`:'')+sec(`📋 المهام${tp?` <span class="small muted">— الإنجاز ${tp.pct}% (${tp.done}/${tp.total})</span>`:''}`,tasks)+sec('👥 الأعضاء (الأدوار)',(o.members||[]).length?ul(o.members):'')+sec('📐 قواعد التشكيل',(o.formation||[]).length?ul(o.formation):'')+sec(`🗓️ اجتماعات اللجنة${c.freq?` <span class="small muted">— الدورية: ${esc(c.freq)}</span>`:''}`,(o.meetings||[]).length?ul(o.meetings):'')}
function editOfficial(c){const f=$('#dlgForm'),o=c.off||{};const ta=(k,l,v,h)=>`<div class="fld full"><label for="oe_${k}">${l}</label><textarea id="oe_${k}" name="${k}" style="min-height:${h}px">${esc(v)}</textarea></div>`;
 f.innerHTML=fem(`<div class="dlg-h"><span>تعديل نصوص ${esc(comName(c))}</span><button type="button" class="iconbtn" data-x aria-label="إغلاق">✕</button></div><div class="dlg-b" style="grid-template-columns:1fr">
 <p class="small muted" style="margin:0">سطر لكل بند. حالات إنجاز المهام تبقى محفوظة للبنود التي لم يتغير نصها.</p>
 ${ta('goal','الهدف',o.goal||'',70)}${ta('tasks','المهام (سطر لكل مهمة)',(o.tasks||[]).map(t=>t.t).join('\n'),220)}${ta('members','الأعضاء (الأدوار)',(o.members||[]).join('\n'),110)}${ta('formation','قواعد التشكيل',(o.formation||[]).join('\n'),80)}${ta('meetings','قواعد الاجتماعات',(o.meetings||[]).join('\n'),110)}
 <div class="fld"><label for="oe_freq">دورية الاجتماعات</label><input id="oe_freq" name="freq" maxlength="80" value="${esc(c.freq||'')}"></div></div>
 <div class="dlg-f"><button class="btn gold" type="submit">حفظ</button><button type="button" class="btn ghost" data-x>إلغاء</button>${c.official?'<button type="button" class="btn ghost" data-restore style="margin-inline-start:auto">↺ استعادة النص الرسمي</button>':''}</div>`);
 const lines=n=>f.elements[n].value.split('\n').map(x=>x.trim()).filter(Boolean);
 f.onsubmit=e=>{e.preventDefault();const old=(c.off&&c.off.tasks)||[];const used=new Set();
  const tasks=lines('tasks').map(t=>{const m=old.find(x=>x.t===t&&!used.has(x.id));if(m){used.add(m.id);return m}return {id:'u'+uid(),t}});
  c.off={goal:f.elements.goal.value.trim(),tasks,members:lines('members'),formation:lines('formation'),meetings:lines('meetings')};c.freq=f.elements.freq.value.trim().slice(0,80);
  audit('تعديل نصوص اللجنة','committees',{title:comName(c)});save();$('#dlg').close();render();toast('تم الحفظ')};
 f.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();f.requestSubmit()}};$$('[data-x]',f).forEach(b=>b.onclick=()=>$('#dlg').close());
 const rb=$('[data-restore]',f);if(rb)rb.onclick=()=>{if(!confirm('استعادة النص الرسمي لجميع الأقسام ودورية الاجتماعات؟ (تبقى حالات إنجاز المهام الرسمية محفوظة)'))return;c.off=offCopy(c.official);c.freq=OFFICIAL_COMS[c.official].freq;audit('استعادة النص الرسمي','committees',{title:comName(c)});save();$('#dlg').close();render();toast('استُعيد النص الرسمي')};
 $('#dlg').showModal()}
function committeeView(id){const c=DB.committees.find(x=>x.id===id);if(!c)return '<div class="card empty">اللجنة غير موجودة. <a href="#committees">العودة إلى اللجان</a></div>';const ms=comMeetings(c);
 return `<div class="head"><div><a href="#committees" class="small">→ اللجان والتكليفات</a><h2>🧩 ${esc(comName(c))}</h2><div class="muted small">${esc(c.kind||'لجنة')}${c.freq?' — الاجتماعات: '+esc(c.freq):''} — ${chip(esc(c.status||'سارية'),c.status==='منتهية'?'gray':'green')}${c.date?' — منذ '+fmtDate(c.date,false):''}</div></div>
 <div class="btns"><button class="btn gold" data-act="edit" data-c="committees" data-id="${c.id}">تعديل بيانات اللجنة</button><button class="btn ghost" data-act="comoff" data-id="${c.id}">✏️ تعديل النصوص</button>${evBtn('committees',c.id)}<button class="btn ghost" data-act="comprint" data-id="${c.id}">طباعة</button></div></div>
 ${secCard('com:'+c.id)}
 ${offSections(c,false)}
 <div class="grid two"><div class="card"><h3>التشكيل الفعلي (الأسماء)</h3><div class="row"><b style="width:90px">الرئيس</b><span>${esc(c.head||'—')}</span></div><div class="row" style="align-items:flex-start"><b style="width:90px">الأعضاء</b><span style="white-space:pre-line">${esc(c.members||'—')}</span></div></div>
 ${c.tasks?`<div class="card"><h3>مهام/ملاحظات إضافية</h3><div style="white-space:pre-line">${esc(c.tasks)}</div></div>`:''}</div>
 <div class="card"><div class="row" style="flex-wrap:wrap"><h3 class="grow" style="margin:0">سجل الاجتماعات والمحاضر (${ms.length})</h3><button class="btn gold sm" data-act="commeet" data-id="${c.id}">＋ اجتماع/محضر</button><button class="btn ghost sm" data-act="mmode" data-id="c:${c.id}">🎙️ وضع الاجتماع</button></div>
 ${ms.length?table('meetings',ms,['date','title','type'],''):'<div class="empty">لا توجد اجتماعات مسجلة لهذه اللجنة</div>'}</div>`}
function comPrint(c){const ms=comMeetings(c);const tp=comPct(c);let h=printHead(comName(c),(c.kind||'لجنة')+' — الحالة: '+(c.status||'سارية')+(c.freq?' — دورية الاجتماعات: '+c.freq:'')+(tp?' — إنجاز المهام: '+tp.pct+'% ('+tp.done+'/'+tp.total+')':''));h+=offSections(c,true);
 h+=`<section><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th style="width:120px">رئيس اللجنة (الاسم)</th><td>${esc(c.head||'')}</td></tr><tr><th>الأعضاء</th><td style="white-space:pre-line">${esc(c.members||'')}</td></tr>${c.tasks?`<tr><th>مهام إضافية</th><td style="white-space:pre-line">${esc(c.tasks)}</td></tr>`:''}</table></section>`;
 h+=`<section><h3>سجل الاجتماعات (${ms.length})</h3>${ptable('meetings',ms)}</section>`+ms.filter(m=>m.minutes||m.decisions).map(m=>`<section><h3>محضر ${esc(m.title)} — ${fmtPlain(m.date)}</h3>${m.minutes?`<p style="white-space:pre-line">${esc(m.minutes)}</p>`:''}${m.decisions?`<p><b>القرارات:</b> <span style="white-space:pre-line">${esc(m.decisions)}</span></p>`:''}</section>`).join('')+secPrint('com:'+c.id);
 const ef=evPrint('committees',c.id);if(ef)h+=`<section><h3>شواهد اللجنة</h3>${ef}</section>`;return h}
/* ---------- Section-level files (all sections) ---------- */
const SEC_VIEWS=[...Object.keys(S),'templates','review','reports','exams'];
const secCol=v=>v==='oplan'?'opfile':v.startsWith('com:')||v.startsWith('exm:')?v:'sec:'+v;
const viewTitle=v=>v.startsWith('exm:')?'الاختبارات — '+((exArea(v.slice(4))||[])[1]||''):v==='exams'?'الاختبارات':v.startsWith('com:')?(comName(DB.committees.find(c=>'com:'+c.id===v))||'لجنة محذوفة'):S[v]?.t||({templates:'قوالب المهام',review:'المراجعة الذاتية',reports:'التقارير والتصدير'})[v]||v;
const grpOf=f=>(f.meta&&f.meta.group)||(f.col==='opfile'?'plan':f.id);
function secGroups(col){const g={};FILES.filter(f=>f.col===col).forEach(f=>{(g[grpOf(f)]=g[grpOf(f)]||[]).push(f)});return Object.values(g).map(a=>a.sort((x,y)=>y.added.localeCompare(x.added))).sort((a,b)=>b[0].added.localeCompare(a[0].added))}
function secCard(v){const col=secCol(v),gs=secGroups(col),open=!!gs.length||v==='oplan'||v==='pd'||v.startsWith('com:')||v.startsWith('exm:');
 return `<details class="card seccard" ${open?'open':''}><summary class="row" style="flex-wrap:wrap;cursor:pointer"><b class="grow">📁 ${v==='oplan'?'ملف الخطة التشغيلية المعتمد':v.startsWith('com:')?'ملفات '+esc(viewTitle(v))+' (المحاضر، القرارات، التشكيل…)':'ملفات القسم: '+esc(viewTitle(v))} <span class="pill">${gs.length}</span></b>
 <button type="button" class="btn gold sm" data-act="secup" data-c="${v}">⬆️ رفع ملف</button></summary>
 <div class="ev-drop sec-drop" data-act="secup" data-c="${v}" tabindex="0" style="margin:10px 0;padding:10px">اسحب الملفات هنا أو اضغط للاختيار — PDF، Word، Excel، PowerPoint، صور (حتى 15 م.ب). تُحفظ على هذا الجهاز وتعمل دون اتصال وتُضمَّن في النسخة الاحتياطية.</div>
 ${gs.length?`<div class="tbl-wrap"><table class="resp"><thead><tr><th>الملف</th><th>العام الدراسي</th><th>ملاحظة</th><th>تاريخ الرفع</th><th>الإصدارات</th><th></th></tr></thead><tbody>${gs.map(a=>{const f=a[0];return `<tr><td data-l="الملف">${isImg(f)?`<img src="${furl(f)}" alt="" style="width:36px;height:36px;object-fit:cover;border-radius:6px;vertical-align:middle">`:ficon(f)} ${esc(f.name)} <span class="small muted">${fsize(f.size)}</span></td><td data-l="العام">${esc(f.meta?.year||'—')}</td><td data-l="ملاحظة">${esc(f.meta?.note||'')}</td><td data-l="تاريخ الرفع">${fmtDate(f.added.slice(0,10),false)}</td><td data-l="الإصدارات">${a.length>1?`<details><summary>${a.length} إصدارات</summary>${a.slice(1).map((o,k)=>`<div class="small">${a.length-1-k}. ${esc(o.name)} — ${esc(new Date(o.added).toLocaleDateString('ar-SA-u-nu-latn'))} ${esc(o.meta?.year||'')} <a href="#" data-act="evopen" data-id="${o.id}">عرض</a> · <a href="#" data-act="evdl" data-id="${o.id}">تنزيل</a> · <a href="#" data-act="secdel" data-id="${o.id}">حذف</a></div>`).join('')}</details>`:'1'}</td>
 <td data-l=""><button class="btn sm ghost" data-act="evopen" data-id="${f.id}">عرض</button> <button class="btn sm ghost" data-act="evdl" data-id="${f.id}">تنزيل</button> <button class="btn sm ghost" data-act="secrep" data-c="${v}" data-id="${grpOf(f)}">استبدال</button> <button class="btn sm ghost" data-act="secdel" data-id="${f.id}" aria-label="حذف الإصدار الحالي">🗑</button></td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty" style="padding:10px">لا توجد ملفات لهذا القسم بعد</div>'}</details>`}
let secCtx=null;
async function secUpload(v,group,files){const col=secCol(v);files=[...files];if(!files.length)return;
 const year=prompt('العام الدراسي لهذا الملف:',DB.settings.year||'');if(year===null)return;const note=prompt('ملاحظة (اختياري):','')||'';
 for(const f of files){await addFiles(col,'section',[f],{year:year.trim().slice(0,40),note:note.trim().slice(0,200),group:group||uid()})}render()}
function secPrint(v){const gs=secGroups(secCol(v));if(!gs.length)return'';return `<section><h3>ملفات القسم</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>الملف</th><th>العام الدراسي</th><th>ملاحظة</th><th>تاريخ الرفع</th><th>الإصدارات</th></tr>${gs.map(a=>{const f=a[0];return `<tr><td>${isImg(f)?`<img src="${furl(f)}" style="width:60px;height:60px;object-fit:cover" alt=""> `:ficon(f)+' '}${esc(f.name)}</td><td>${esc(f.meta?.year||'')}</td><td>${esc(f.meta?.note||'')}</td><td>${fmtPlain(f.added.slice(0,10))}</td><td>${a.length}</td></tr>`}).join('')}</table></section>`}
function navCounts(){const n={};SEC_VIEWS.forEach(v=>n[v]=0);FILES.forEach(f=>{let v=f.col.startsWith('exm:')||['exmeet','exact','exres','sec:exmeet','sec:exact','sec:exres'].includes(f.col)?'exams':f.col.startsWith('com:')||f.col==='comtask'?'committees':f.col==='opfile'?'oplan':f.col.startsWith('sec:')?f.col.slice(4):f.col;if(n[v]!=null)n[v]++});return n}
const OPMAP={domain:['المجال'],goal:['الهدف','الأهداف'],program:['البرنامج','المبادرة','البرنامج/المبادرة','البرنامج / المبادرة'],actions:['الإجراءات','الإجراء'],owner:['المسؤول','المسئول','المنفذ'],start:['تاريخ البداية','البداية','من'],end:['تاريخ النهاية','النهاية','إلى','الموعد'],kpi:['مؤشر الأداء','المؤشر'],target:['المستهدف','القيمة المستهدفة'],status:['الحالة'],progress:['نسبة الإنجاز','نسبة الإنجاز %','الإنجاز'],notes:['ملاحظات']};
function normDate(v){if(v==null||v==='')return'';if(typeof v==='number'&&v>20000&&v<80000){const d=new Date(Math.round((v-25569)*864e5));return iso(new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()))}
 if(v instanceof Date&&!isNaN(v))return iso(v);v=String(v).trim().replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));let m;
 if(m=v.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/))return m[1]+'-'+pad(m[2])+'-'+pad(m[3]);if(m=v.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/))return m[3]+'-'+pad(m[2])+'-'+pad(m[1]);return null}
function parseCSV(t){const rows=[];let r=[],f='',q=false;t=t.replace(/^\ufeff/,'');for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===','||c===';'||c==='\t'){r.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;r.push(f);rows.push(r);r=[];f=''}else f+=c}if(f!==''||r.length){r.push(f);rows.push(r)}return rows.filter(x=>x.some(y=>String(y).trim()!==''))}
function loadXLSX(){return window.XLSX?Promise.resolve(window.XLSX):new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='vendor/xlsx.full.min.js';sc.onload=()=>res(window.XLSX);sc.onerror=()=>rej(new Error('تعذّر تحميل قارئ Excel'));document.head.appendChild(sc)})}
async function importPlan(file){try{let rows;if(/\.(xlsx|xls|ods)$/i.test(file.name)){const X=await loadXLSX();const wb=X.read(await file.arrayBuffer(),{cellDates:true});const ws=wb.Sheets[wb.SheetNames[0]];rows=X.utils.sheet_to_json(ws,{header:1,raw:true,defval:''})}else rows=parseCSV(await file.text());
 if(!rows.length)throw new Error('الملف فارغ');let hi=rows.findIndex(r=>r.some(c=>OPMAP.goal.includes(String(c).trim())||OPMAP.program.includes(String(c).trim())));if(hi<0)throw new Error('لم يُعثر على صف عناوين يحتوي «الهدف» أو «البرنامج/المبادرة». استخدم نموذج الاستيراد.');
 const H=rows[hi].map(c=>String(c).trim()),idx={};Object.entries(OPMAP).forEach(([k,names])=>{const i=H.findIndex(h=>names.includes(h));if(i>=0)idx[k]=i});
 const ok=[],bad=[];rows.slice(hi+1).forEach((r,j)=>{const g=k=>idx[k]!=null?r[idx[k]]:'';const o={domain:String(g('domain')).trim(),goal:String(g('goal')).trim().slice(0,300),program:String(g('program')).trim().slice(0,300),actions:String(g('actions')).trim().slice(0,5000),owner:String(g('owner')).trim().slice(0,200),kpi:String(g('kpi')).trim().slice(0,300),target:String(g('target')).trim().slice(0,200),notes:String(g('notes')).trim().slice(0,2000)};
  const errs=[];if(!o.goal&&!o.program)return;const dm=DOMAINS.find(d=>o.domain.includes(d)||d.includes(o.domain)&&o.domain);if(!dm)errs.push('مجال غير معروف');else o.domain=dm;
  o.start=normDate(g('start'));o.end=normDate(g('end'));if(o.start===null||o.end===null)errs.push('تاريخ غير صالح');if(!o.end&&!errs.length)errs.push('تاريخ النهاية مطلوب');
  const st=String(g('status')).trim();o.status=S.oplan.f.find(f=>f.k==='status').opts.includes(st)?st:'لم يبدأ';let pr=String(g('progress')).replace('%','').trim();pr=pr===''?0:Number(pr)<=1&&String(pr).includes('.')?Math.round(Number(pr)*100):Math.round(Number(pr));o.progress=Number.isFinite(pr)?Math.max(0,Math.min(100,pr)):0;if(o.status==='منجز')o.progress=100;
  if(!o.owner)o.owner='—';if(!o.goal)o.goal=o.program;if(!o.program)o.program=o.goal;
  errs.length?bad.push('صف '+(hi+j+2)+': '+errs.join('، ')):ok.push(o)});
 if(!ok.length){alert('لم يُعثر على بنود صالحة.\n'+bad.slice(0,15).join('\n'));return}
 if(!confirm(`سيُضاف ${ok.length} بند إلى الخطة التشغيلية${bad.length?` وسيُتجاوز ${bad.length} صف غير صالح:\n`+bad.slice(0,10).join('\n'):''}\nمتابعة؟`))return;
 ok.forEach(o=>DB.oplan.push({id:uid(),created:new Date().toISOString(),...o}));audit('استيراد بنود الخطة','oplan',{title:ok.length+' بند من '+file.name});save();render();toast('استُورد '+ok.length+' بند')}catch(e){alert('تعذّر الاستيراد: '+e.message)}}

/* ---------- Event wiring ---------- */
document.addEventListener('click',e=>{if(e.target.closest('a[data-wslog]'))wsLog();const hc=e.target.closest('[data-hmc]');if(hc)hmCell(hc.dataset.hmc)});document.addEventListener('keydown',e=>{const hc=e.target.closest&&e.target.closest('[data-hmc]');if(hc&&(e.key==='Enter'||e.key===' ')){e.preventDefault();hmCell(hc.dataset.hmc)}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');
 if(!e.target.closest('#bellPanel')&&!e.target.closest('#bellBtn'))$('#bellPanel').hidden=true;
 if(e.target.closest('#nav a'))closeNav();
 if(!b)return;const a=b.dataset.act,c=b.dataset.c,id=b.dataset.id;
 const acts={
  ev:()=>{e.preventDefault();openEv(c,id)},evpick:()=>$('#evIn').click(),
  evopen:()=>{const f=FILES.find(x=>x.id===id);if(!f)return;const w=window.open(furl(f),'_blank');if(!w)download(f.name,f.blob)},
  evdl:()=>{const f=FILES.find(x=>x.id===id);f&&download(f.name,f.blob)},
  evdel:async()=>{if(!confirm('حذف هذا الشاهد؟'))return;await delFile(id);if(evCtx)openEv(evCtx.c,evCtx.rid);else render()},
  opup:()=>{secCtx={v:'oplan'};$('#secIn').click()},
  secup:()=>{e.preventDefault();secCtx={v:b.dataset.c};$('#secIn').click()},secrep:()=>{e.preventDefault();secCtx={v:b.dataset.c,group:id};$('#secIn').click()},
  secdel:async()=>{e.preventDefault();if(!confirm('حذف هذا الإصدار من الملف؟'))return;await delFile(id);render()},opimp:()=>$('#opImpIn').click(),
  optpl:()=>download('نموذج-استيراد-الخطة-التشغيلية.csv','\ufeff'+[['المجال','الهدف','البرنامج/المبادرة','الإجراءات','المسؤول','تاريخ البداية','تاريخ النهاية','مؤشر الأداء','المستهدف','الحالة','نسبة الإنجاز']].map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n','text/csv'),
  opdel:async()=>{if(!confirm('حذف هذا الإصدار من ملف الخطة؟'))return;await delFile(id);render()},
  vtask:()=>{openForm('tasks',null);voiceWire($('#dlgForm'));const t=$('#f_title');const b=t&&t.closest('.vw')?.querySelector('.micb');if(t&&b)voiceStart(t,b);else voiceNote()},
  itqrel:()=>{ITQ.st='idle';render()},itqimp:()=>$('#itqIn').click(),itqclr:()=>{if(!confirm('حذف ملخص إتقان المستورد من هذا الجهاز؟'))return;localStorage.removeItem(ITQ_IMP);ITQ.st='idle';render()},
  guadd:()=>{const t=$('#guT').value.trim(),u=$('#guU').value.trim();if(!t)return toast('اكتب اسم الدليل');if(u&&!/^https?:\/\//.test(u))return toast('الرابط يجب أن يبدأ بـ https://');const a=guExtra();a.push({id:'gu'+Date.now(),t,ed:$('#guE').value.trim(),circ:$('#guC').value.trim(),u});guSave(a);render();toast('تمت إضافة الدليل')},
  gudel:()=>{if(!confirm('حذف هذا الدليل؟'))return;guSave(guExtra().filter(x=>x.id!==id));render()},
  tpdsave:()=>tpdSave(false),bksnooze:()=>{DB.settings.backupSnooze=addDays(today(),3);save();bkHide();toast('سيُذكّرك التطبيق بعد 3 أيام')},tpdsavevid:()=>tpdSave(true),
  evsend:()=>evSend(id),evprint:()=>printHTML(evPrintAll(id)),
  impprint:()=>printHTML(impPrint(id)),svprint:()=>printHTML(svPrint(id)),
  svqadd:()=>{const sv=DB.surveys.find(x=>x.id===id);if(!sv)return;svQs(sv).push({id:'q'+(sv.qn=(sv.qn||0)+1),type:c,t:'',o:c==='mc'?['الخيار الأول','الخيار الثاني']:undefined});delete svLink[id];save();render();const ins=$$('[data-svq$="|t"]');ins.length&&ins[ins.length-1].focus()},
  svqdel:()=>{const sv=DB.surveys.find(x=>x.id===id);if(!sv||!confirm('حذف السؤال؟'))return;sv.q=svQs(sv).filter(q=>q.id!==c);delete svLink[id];save();render()},
  svmv:()=>{const sv=DB.surveys.find(x=>x.id===id);if(!sv)return;const [qid,d]=c.split('|');const a=svQs(sv),i=a.findIndex(q=>q.id===qid),j=i+(+d);if(i<0||j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];delete svLink[id];save();render()},
  svlink:async()=>{const sv=DB.surveys.find(x=>x.id===id);if(!sv)return;if(!svQs(sv).some(q=>q.t)){toast('أضف نص سؤال واحد على الأقل');return}if(svQs(sv).some(q=>q.type==='mc'&&!(q.o||[]).length)){toast('أضف خيارات لأسئلة الاختيار من متعدد');return}
   svLink[id]=await svBuildLink(sv);if(sv.status==='مسودة'){sv.status='منشورة';save()}render();toast('تم إنشاء الرابط')},
  svcopy:()=>{const i=$('#svUrl');if(!i)return;(navigator.clipboard?navigator.clipboard.writeText(i.value):Promise.reject()).then(()=>toast('تم نسخ الرابط'),()=>{i.select();document.execCommand('copy');toast('تم النسخ')})},
  svpaste:async()=>{const t=$('#svPaste').value;if(!t.trim()){toast('الصق الردود أولاً');return}const r=await svImportCodes(t);render();toast(`رموز: ${r.codes} — أُضيف ${r.add}${r.dup?' — مكرر '+r.dup:''}${r.other?' — لاستبانة أخرى/محذوفة '+r.other:''}${r.bad?' — تالف '+r.bad:''}`)},
  svfile:()=>{const sv=DB.surveys.find(x=>x.id===id);if(!sv)return;const fi=document.createElement('input');fi.type='file';fi.accept='.txt,.csv,.xlsx,.xls';fi.id='svFileIn';fi.hidden=true;document.body.append(fi);
   fi.onchange=async()=>{const f=fi.files[0];fi.remove();if(!f)return;try{if(/\.txt$/i.test(f.name)){const r=await svImportCodes(await f.text());render();toast(`من المحادثة: ${r.codes} رمز — أُضيف ${r.add}${r.dup?' — مكرر '+r.dup:''}`)}
    else{const r=await svImportForms(sv,f);render();toast(`أُضيف ${r.add} رد${r.dup?' — مكرر '+r.dup:''} — أعمدة مطابقة ${r.matched}${r.created?' — أسئلة أُنشئت '+r.created:''}${r.skipped?' — أعمدة متجاهلة '+r.skipped:''}`)}}catch(e){toast('تعذّر الاستيراد: '+(e.message||e))}};fi.click()},
  svclear:()=>{const sv=DB.surveys.find(x=>x.id===id);if(!sv||!confirm('حذف جميع ردود هذه الاستبانة؟'))return;sv.resp=[];audit('حذف ردود استبانة','surveys',{title:sv.title});save();render()},
  sv2act:()=>{const sv=DB.surveys.find(x=>x.id===id);if(!sv)return;const r=svAnalyze(sv).recs[+c];if(!r)return;DB.actions.push({id:uid(),action:'معالجة نتيجة الاستبانة: '+(r.q||r.t).slice(0,200),domain:sv.domain||'الإدارة المدرسية',owner:'',deadline:addDays(today(),30),status:'لم يبدأ',progress:0,indicator:'تحسّن نتيجة البند في الاستبانة القادمة',evidence:'استبانة: '+sv.title,created:new Date().toISOString()});audit('إضافة إجراء من استبانة','actions',{title:sv.title});save();toast('أُضيف إلى إجراءات خطة التحسين')},
  exadd:()=>{const a=exArea(id);openForm(c,null);const f=$('#dlgForm');if(a&&f.elements.area)f.elements.area.value=a[1]},
  exprint:()=>{$('#printArea').innerHTML=fem(examPrint(id))+sig();const imgs=$$('#printArea img');Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))).then(()=>setTimeout(()=>window.print(),50))},
  comoff:()=>{const cm=DB.committees.find(x=>x.id===id);cm&&editOfficial(cm)},
  comprint:()=>{const cm=DB.committees.find(x=>x.id===id);if(!cm)return;$('#printArea').innerHTML=fem(comPrint(cm))+sig();const imgs=$$('#printArea img');Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))).then(()=>setTimeout(()=>window.print(),50))},
  decgo:()=>{flt.decQ=$('#decQ').value;flt.decD='';render()},decclr:()=>{flt.decQ='';flt.decD='';render()},decplan:()=>decPlan(),plansend:()=>planSend(id),planimp:()=>planImp(id),planprint:()=>planPrint(id),
  hmprint:()=>hmPrint(),hmreset:()=>{const m=$('#hmM').value;delete hmS().thr[m];save();render()},pfprint:()=>pfPrint(),
  vrgo:()=>{flt.vrText=$('#vrText').value;flt.vr=vrSplit(flt.vrText).map(t=>({t,k:vrClass(t)}));render()},vrdel:()=>{flt.vr.splice(+id,1);render()},vrsave:()=>vrSave(),
  emgadd:()=>{emgS().contacts.push({id:uid(),n:'',t:''});save();render()},emgdel:()=>{const e=emgS();e.contacts=e.contacts.filter(x=>x.id!==id);save();render()},emgkadd:()=>{emgS().check.push({id:uid(),t:'',d:false});save();render();const l=$$('[data-emgkt]').pop();l&&l.focus()},emgkdel:()=>{const e=emgS();e.check=e.check.filter(x=>x.id!==id);save();render()},emgreset:()=>{emgS().check.forEach(x=>x.d=false);save();render()},emgprint:()=>emgPrint(),
  cmpprint:()=>cmpPrint(),cmpq:()=>{const t=today();if(id==='m'){const b1=t.slice(0,8)+'01',a2=addDays(b1,-1);flt.cmp={b1,b2:t,a1:a2.slice(0,8)+'01',a2}}else{const n=+id;flt.cmp={b2:t,b1:addDays(t,-(n-1)),a2:addDays(t,-n),a1:addDays(t,-(2*n-1))}}render()},
  gmpng:()=>gmPNG(),jprint:()=>jPrint(),mcx:()=>{localStorage.setItem('sld_mc_x',today());const e=$('#mcard');if(e)e.remove()},
  wsprint:()=>wsPrint(),wsprev:()=>{flt.wsDay=addDays(weekSun(flt.wsDay||today()),-7);render()},wsnext:()=>{flt.wsDay=addDays(weekSun(flt.wsDay||today()),7);render()},
  calprev:()=>{flt.calRef=addDays(hMonth(flt.calRef||today()).start,-1);render()},calnext:()=>{flt.calRef=addDays(hMonth(flt.calRef||today()).end,1);render()},caltoday:()=>{flt.calRef='';render()},caladd:()=>openForm('events',null),
  calnotif:()=>{if(!('Notification' in window))return toast('المتصفح لا يدعم الإشعارات');if(Notification.permission==='granted')return toast('الإشعارات مفعّلة');if(Notification.permission==='denied')return toast('الإشعارات محظورة من إعدادات المتصفح');Notification.requestPermission().then(()=>render())},
  honpng:()=>honShow(id),initadd:()=>initAdd(id),
  mmode:()=>{const d=localStorage.getItem(MMK);if(d&&confirm('توجد مسودة اجتماع غير محفوظة. استكمالها؟')){try{return mmOpen(null,JSON.parse(d))}catch(e){}}mmOpen(id||'g')},
  mmstart:()=>{const d=localStorage.getItem(MMK);if(d&&!confirm('توجد مسودة اجتماع غير محفوظة وسيتم استبدالها. متابعة؟'))return;mmOpen($('#mmTarget').value)},mmresume:()=>{try{mmOpen(null,JSON.parse(localStorage.getItem(MMK)))}catch(e){toast('تعذّر فتح المسودة')}},
  commeet:()=>{const cm=DB.committees.find(x=>x.id===id);if(!cm)return;openForm('meetings',null);const f=$('#dlgForm');f.elements.committee.value=cm.name;f.elements.title.value='اجتماع '+cm.name;f.elements.type.value=cm.name==='لجنة التميز'?'لجنة التميز':cm.name==='لجنة التوجيه الطلابي'?'الإرشاد':'أخرى'},
  add:()=>openForm(c),edit:()=>openForm(c,DB[c].find(x=>x.id===id)),
  done:()=>{const x=DB.tasks.find(t=>t.id===id);if(!x)return;const p=x.status;x.status='مكتملة';delete x.sample;maybeRecur(x,p);audit('إنجاز','tasks',x);save();render();if(!$('#bellPanel').hidden||b.closest('#bellPanel'))bell();toast('أُنجزت المهمة ✓')},
  csv:()=>csv(c,DB[c]),xls:()=>xls([c]),xlsall:()=>xls(COLS),print:()=>doPrint(c),weekly:()=>doPrint('weekly'),
  rprint:()=>doPrint($('#rpType').value,$('#rpFrom').value,$('#rpTo').value),
  rcsv:()=>{const t=$('#rpType').value;if(S[t])csv(t,rowsFor(t,$('#rpFrom').value,$('#rpTo').value));else toast('اختر سجلاً محدداً لتصدير CSV، أو استخدم Excel لكل السجلات')},
  auditcsv:()=>download('سجل-التغييرات.csv','\ufeff'+[['الوقت','العملية','القسم','العنصر']].concat(DB.audit.map(x=>[x.t,x.op,audCol(x.col),x.title])).map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv'),
  tcreate:()=>{const ids=$$('[data-tp]:checked').map(x=>x.dataset.tp);if(!ids.length){toast('حدّد قالباً واحداً على الأقل');return}const st=$('#tplStart').value||today();
   const off={'يومي':0,'أسبوعي':6,'شهري':29,'فصلي':89,'نهاية العام':179},rec={'يومي':'يومي','أسبوعي':'أسبوعي','شهري':'شهري','فصلي':'فصلي','نهاية العام':'لا يتكرر'};
   ids.forEach(i=>{const t=DB.templates.find(x=>x.id===i);const n={id:uid(),created:new Date().toISOString(),title:t.title,domain:t.domain,period:t.period,due:addDays(st,off[t.period]||0),priority:'متوسطة',status:'جديدة',owner:'مدير المدرسة',recur:rec[t.period]};DB.tasks.push(n)});
   audit('إنشاء من القوالب','tasks',{title:ids.length+' مهمة'});save();toast('أُنشئت '+ids.length+' مهمة');location.hash='#tasks'},
  tadd:()=>{const ti=prompt('نص القالب الجديد:');if(!ti||!ti.trim())return;const p=prompt('التكرار ('+PERIODS.join('، ')+'):','أسبوعي');if(!PERIODS.includes(p)){toast('تكرار غير صالح');return}const d=prompt('المجال ('+DOMAINS.join('، ')+'):',DOMAINS[0]);if(!DOMAINS.includes(d)){toast('مجال غير صالح');return}
   DB.templates.push({id:uid(),title:ti.trim().slice(0,200),period:p,domain:d});save();render()},
  tdel:()=>{if(!confirm('حذف القالب؟'))return;DB.templates=DB.templates.filter(x=>x.id!==id);save();render()},
  treset:()=>{if(!confirm('استبدال القوالب بالقوالب الافتراضية؟'))return;DB.templates=DEFAULT_TEMPLATES.map(t=>({id:uid(),...t}));save();render()},
  occ:()=>{const y=new Date().getFullYear(),t=today();let n=0;OCCASIONS.forEach(o=>{if(DB.events.some(x=>x.title===o.title))return;let date='';if(o.md){date=y+'-'+o.md;if(date<t)date=(y+1)+'-'+o.md}
   DB.events.push({id:uid(),title:o.title,kind:o.kind,date,status:'مخطط',notes:o.md?'موعد ميلادي ثابت سنوياً':'حدّد التاريخ وفق التقويم الدراسي المعتمد'});n++});audit('إضافة المناسبات المعتادة','events',{title:n+' مناسبة'});save();render();toast('أُضيفت '+n+' مناسبة — راجع التواريخ وحدّد غير المحدد منها')},
  rvreset:()=>{if(!confirm('مسح تقييمات المراجعة الحالية لبدء دورة جديدة؟ (اطبع النسخة الحالية أولاً إن رغبت)'))return;DB.review={};audit('بدء دورة مراجعة','review',{title:'دورة جديدة'});save();render()},
  rv2act:()=>{const d=b.dataset.d;let n=0;REVIEW[d].forEach((q,i)=>{const v=(DB.review[d]||{})[i];if(v&&(v.s==='0'||v.s==='1')&&!DB.actions.some(x=>x.action===q)){DB.actions.push({id:uid(),action:q,domain:d,owner:'',deadline:addDays(today(),30),status:'لم يبدأ',progress:0,indicator:'تحقق المؤشر في المراجعة القادمة'});n++}});
   if(n){audit('إنشاء إجراءات من المراجعة','actions',{title:n+' إجراء'});save();toast('أُنشئ '+n+' إجراء — حدّد المسؤول');location.hash='#actions'}else toast('لا توجد مؤشرات غير متحققة/جزئية جديدة')},
  export:exportJSON,import:()=>$('#fileIn').click(),logo:()=>$('#logoIn').click(),nologo:()=>{DB.settings.logo='';save();render()},
  sample:loadSample,clearSample,wipe:()=>{if(prompt('لمسح كل البيانات نهائياً اكتب: مسح')!=='مسح')return;DB=blank();restoreFiles([]);save();render();toast('مُسحت البيانات')},
  notif:async()=>{if(!('Notification' in window)){toast('المتصفح لا يدعم الإشعارات');return}const p=await Notification.requestPermission();toast(p==='granted'?'فُعّلت الإشعارات':'لم تُفعّل الإشعارات');render()},
  chime:()=>{const m=DB.settings.mute;DB.settings.mute=false;chime();DB.settings.mute=m},bellclose:()=>$('#bellPanel').hidden=true,
  protask:async()=>{const p=await protPersist(true);toast(p?'✅ البيانات محمية من الحذف التلقائي':p===null?'المتصفح لا يدعم التخزين الدائم':'لم يوافق المتصفح بعد — ثبّت التطبيق ثم أعد المحاولة');protFill()},abknow:()=>abkRun(true),abkpick:()=>abkPick(),abkgrant:()=>abkRegrant(),abkclear:async()=>{await metaSet('bkDir',null);toast('أُلغي مجلد النسخ؛ ستُنزَّل النسخ إلى التنزيلات');protFill()},instx:()=>{localStorage.setItem('sld_inst_x','1');const c=$('#instCard');if(c)c.remove()},
  shmode:()=>{const s=shState();s.mode=id;shSave(s);render()},shmake:()=>shMake(),
  install:async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;chrome();render()}};
 acts[a]&&acts[a]()});
document.addEventListener('input',e=>{const el=e.target;if(el.id==='tpdQ'){tpdQ=el.value;clearTimeout(window._tq);window._tq=setTimeout(()=>{render();const i=$('#tpdQ');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},250);return}if(el.dataset&&el.dataset.svq){const [sid,qid,k]=el.dataset.svq.split('|');const sv=DB.surveys.find(x=>x.id===sid);const q=sv&&svQs(sv).find(x=>x.id===qid);if(q&&k!=='type'){if(k==='o')q.o=el.value.split('\n').map(x=>x.trim()).filter(Boolean);else q.t=el.value.slice(0,300);delete svLink[sid];const sh=$('#svShare');if(sh)sh.innerHTML='';save()}return}
 if(el.dataset.f){const c=view();flt[c][el.dataset.f]=el.value;clearTimeout(el._t);el._t=setTimeout(()=>{const pos=el.selectionStart;render();const n=$(`[data-f="${el.dataset.f}"]`);if(n){n.focus();if(n.type==='search'&&pos!=null)n.setSelectionRange(pos,pos)}},el.type==='search'?250:0)}
 if(el.dataset.evf){flt.evidence[el.dataset.evf]=el.value;clearTimeout(el._t);el._t=setTimeout(()=>{render();const n=$(`[data-evf="${el.dataset.evf}"]`);n&&n.focus()},el.type==='search'?250:0)}
 if(el.dataset.tt){const t=DB.templates.find(x=>x.id===el.dataset.tt);if(t&&el.value.trim()){t.title=el.value.slice(0,200);save()}}
 if(el.dataset.rvn){const[d,i]=el.dataset.rvn.split('|');DB.review[d]=DB.review[d]||{};DB.review[d][i]={...(DB.review[d][i]||{}),n:el.value};DB.review._date=today();save()}});
document.addEventListener('change',e=>{const el=e.target;if(el.id==='decD'){flt.decD=el.value;render();return}if(el.id==='hmM'){flt.hmM=el.value;render();return}if(el.dataset&&el.dataset.hmthr){const m=$('#hmM').value,t={...hmThr(m)};delete t.def;const k=el.dataset.hmthr;t[k]=k==='hb'?el.checked:+el.value;hmS().thr[m]=t;save();render();return}
 if(el.dataset&&el.dataset.pf!=null){localStorage.setItem('sld_pf',JSON.stringify($$('[data-pf]:checked').map(x=>x.dataset.pf)));return}if(el.dataset&&el.dataset.cmp){flt.cmp={...cmpRanges(),[el.dataset.cmp]:el.value};render();return}
 if(el.dataset&&el.dataset.vrk!=null){flt.vr[+el.dataset.vrk].k=el.value;return}if(el.dataset&&el.dataset.vrt!=null){flt.vr[+el.dataset.vrt].t=el.value;return}
 if(el.dataset&&el.dataset.emgc){const c=emgS().contacts.find(x=>x.id===el.dataset.emgc);if(c){c[el.dataset.k]=el.value.trim();save();render()}return}if(el.dataset&&el.dataset.emg){emgS()[el.dataset.emg]=el.value;save();return}
 if(el.dataset&&el.dataset.emgk){const x=emgS().check.find(y=>y.id===el.dataset.emgk);if(x){x.d=el.checked;save();render()}return}if(el.dataset&&el.dataset.emgkt){const x=emgS().check.find(y=>y.id===el.dataset.emgkt);if(x){x.t=el.value;save()}return}
 if(el.matches&&el.matches('[data-jtarget]')){const v=el.value.trim();gmS().target=v===''?'':Math.max(0,Math.min(100,+v));save();render();return}if(el.matches&&el.matches('[data-wsday]')){flt.wsDay=el.value||today();render();return}if(el.matches&&el.matches('[data-evsel]')){flt.evsel=el.value;render();return}if(el.dataset&&el.dataset.svq&&el.dataset.svq.endsWith('|type')){const [sid,qid]=el.dataset.svq.split('|');const sv=DB.surveys.find(x=>x.id===sid);const q=sv&&svQs(sv).find(x=>x.id===qid);if(q){q.type=el.value;if(q.type==='mc'&&!(q.o||[]).length)q.o=['الخيار الأول','الخيار الثاني'];delete svLink[sid];save();render()}return}if(el.dataset.ctask){const[cid,tid]=el.dataset.ctask.split('|');const cm=DB.committees.find(x=>x.id===cid);if(cm){cm.tdone=cm.tdone||{};if(el.checked)cm.tdone[tid]=today();else delete cm.tdone[tid];audit(el.checked?'إنجاز مهمة لجنة':'إلغاء إنجاز مهمة لجنة','committees',{title:comName(cm)});save();const y=scrollY;render();scrollTo(0,y)}return}if(el.dataset.allp)$$(`[data-p="${el.dataset.allp}"]`).forEach(x=>x.checked=el.checked);
 if(el.dataset&&(el.dataset.shc||el.dataset.shcc)){const s=shState(),k=el.dataset.shc||el.dataset.shcc,arr=el.dataset.shc?s.cols:s.ccols;const i=arr.indexOf(k);if(el.checked&&i<0)arr.push(k);if(!el.checked&&i>-1)arr.splice(i,1);shSave(s);const w=$('#shWarn');if(w)w.hidden=!(s.mode==='t'?s.cols:s.ccols).some(x=>SH_SENS.includes(x))}if(el.id==='shT'){const s=shState();s.teacher=el.value;shSave(s)}if(el.id==='shCom'){const s=shState();s.com=el.value;shSave(s)}if(el.id==='s_abk'){DB.settings.autoBk=el.value;save();protFill();toast(el.value==='off'?'أُوقف النسخ التلقائي':'فُعّل النسخ التلقائي')}if(el.id==='s_rt'){DB.settings.remindTime=el.value||'07:30';save()}if(el.id==='s_mute'){DB.settings.mute=el.checked;save()}if(el.id==='s_morning'){DB.settings.morning=el.checked;save()}if(el.id==='s_bk'){DB.settings.backupEvery=+el.value;if(+el.value)DB.settings.backupSnooze='';save();bkHide();bkCheck();render()}if(el.id==='s_hj'){DB.settings.hijri=el.checked;save();chrome()}});
document.addEventListener('click',e=>{const s=e.target.closest('[data-rv]');if(!s)return;const[d,i]=s.dataset.rv.split('|');DB.review[d]=DB.review[d]||{};const cur=DB.review[d][i]||{};
 DB.review[d][i]={...cur,s:cur.s===s.dataset.s?'':s.dataset.s};DB.review._date=today();audit('تقييم مؤشر','review',{title:d});save();
 const y=window.scrollY;render();window.scrollTo(0,y)});
document.addEventListener('dragover',e=>{const d=e.target.closest('.sec-drop');if(d){e.preventDefault();d.classList.add('on')}});
document.addEventListener('dragleave',e=>{const d=e.target.closest('.sec-drop');d&&d.classList.remove('on')});
document.addEventListener('drop',e=>{const d=e.target.closest('.sec-drop');if(d){e.preventDefault();secUpload(d.dataset.c,null,e.dataTransfer.files)}});
document.addEventListener('keydown',e=>{const d=e.target.closest&&e.target.closest('.sec-drop');if(d&&(e.key==='Enter'||e.key===' ')){e.preventDefault();secCtx={v:d.dataset.c};$('#secIn').click()}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-ptab]');if(t){const F=flt.tasks;F.period=t.dataset.ptab;render()}const u=e.target.closest('[data-ttab]');if(u){tplTab=u.dataset.ttab;render()}});
document.addEventListener('submit',e=>{if(e.target.id!=='setForm')return;e.preventDefault();const f=e.target;const mob=f.elements.supervisorMobile.value.trim().replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));if(mob&&!/^\+?\d[\d\s-]{7,14}$/.test(mob)){toast('رقم الجوال غير صالح');f.elements.supervisorMobile.focus();return}
 ['school','principal','supervisor','region','year'].forEach(k=>DB.settings[k]=f.elements[k].value.trim().slice(0,120));DB.settings.supervisorMobile=mob;readSG(f);audit('تحديث الإعدادات','settings',{title:'بيانات المدرسة'});save();render();toast('حُفظت الإعدادات')});
$('#itqIn').onchange=e=>{const f=e.target.files[0];e.target.value='';f&&itqImport(f)};
$('#fileIn').onchange=e=>{const f=e.target.files[0];e.target.value='';f&&importJSON(f)};
$('#evIn').onchange=async e=>{const fl=[...e.target.files];e.target.value='';if(evCtx&&fl.length){await addFiles(evCtx.c,evCtx.rid,fl);openEv(evCtx.c,evCtx.rid)}};
$('#opIn').onchange=e=>{const fl=[...e.target.files];e.target.value='';secUpload('oplan',null,fl)};
$('#secIn').onchange=e=>{const fl=[...e.target.files];e.target.value='';if(secCtx){const c=secCtx;secCtx=null;secUpload(c.v,c.group,c.group?fl.slice(0,1):fl)}};
$('#opImpIn').onchange=e=>{const f=e.target.files[0];e.target.value='';f&&importPlan(f)};
$('#logoIn').onchange=e=>{const f=e.target.files[0];e.target.value='';f&&setLogo(f)};
let qT;$('#q').addEventListener('input',e=>{clearTimeout(qT);qT=setTimeout(()=>{searchQ=e.target.value.trim();render()},200)});
$('#q').addEventListener('keydown',e=>{if(e.key==='Escape'){e.target.value='';searchQ='';render()}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('#dlg').open){e.preventDefault();$('#q').focus()}
 if(e.key==='Escape'){$('#bellPanel').hidden=true;closeNav()}});
$('#bellBtn').onclick=()=>{const p=$('#bellPanel');if(p.hidden)bell();else p.hidden=true};
function applyThemeColor(){const d=document.documentElement.dataset.theme==='dark',g=document.documentElement.dataset.g==='girls';document.querySelector('meta[name=theme-color]').content=g?(d?'#4a1233':'#8a1f5a'):(d?'#0b1220':'#0f2747')}
const setTheme=t=>{document.documentElement.dataset.theme=t;$('#themeBtn').textContent=t==='dark'?'☀️':'🌙';applyThemeColor()};
$('#themeBtn').onclick=()=>{DB.settings.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(DB.settings.theme);save()};
function closeNav(){$('#nav').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false')}
$('#menuBtn').onclick=()=>{const o=$('#nav').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o)};
window.addEventListener('hashchange',()=>{searchQ='';$('#q').value='';render();$('#main').focus({preventScroll:true});window.scrollTo(0,0)});
const net=()=>{$('#netInd').textContent=navigator.onLine?'🟢 متصل':'🟠 دون اتصال'};addEventListener('online',net);addEventListener('offline',net);
window.addEventListener('storage',e=>{if(e.key===KEY){load();render()}});
let deferredInstall=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;chrome();if(view()==='dashboard'&&$('#instCard'))render()});

/* ---------- v1.18 Read-only copy (teacher / committee) — self-contained offline HTML viewer ---------- */
const SH_SAFE=['tasks','committees','events','duty','activities','honors','exmeet','pdplan','gplan'];
const SH_SENS=['attendance','visits','followups','incidents','parents','gcases','evals','exres','surveys','journal','heatv','emg'];
function shState(){let s={};try{s=JSON.parse(localStorage.getItem('sld_share')||'{}')}catch(e){}return {mode:s.mode==='com'?'com':'t',cols:Array.isArray(s.cols)?s.cols:SH_SAFE.slice(),teacher:s.teacher||'',com:s.com||'',ccols:Array.isArray(s.ccols)?s.ccols:[]}}
function shSave(s){localStorage.setItem('sld_share',JSON.stringify(s))}
const shList=()=>[...COLS.filter(c=>S[c]&&S[c].f),'emg'];
const shTitle=c=>c==='emg'?'أرقام الطوارئ':S[c].t;
const shCount=c=>c==='emg'?((DB.emg&&DB.emg.contacts)||[]).length:(DB[c]||[]).filter(x=>!x.sample).length;
function shHas(x,n){if(!n)return true;n=String(n).trim();const walk=v=>v==null?false:typeof v==='string'?v.includes(n):typeof v==='object'?Object.values(v).some(walk):false;return walk(x)}
function shVal(f,v){if(v==null||v==='')return'';if(f.type==='rows'){if(!Array.isArray(v))return'';return v.map(r=>f.rc.map(cc=>r&&r[cc.k]!=null&&r[cc.k]!==''?cc.l+': '+(cc.date?fmtPlain(r[cc.k]):r[cc.k]):'').filter(Boolean).join(' — ')).filter(Boolean)}
 if(typeof v==='string'&&v.startsWith('data:'))return'';if(f.type==='date')return fmtPlain(v);if(Array.isArray(v))return v.join('، ');return String(v)}
function shSection(c,filt){if(c==='emg'){const cs=((DB.emg&&DB.emg.contacts)||[]).filter(x=>shHas(x,filt));return {t:'أرقام الطوارئ',rows:cs.map(x=>[['الجهة',x.n||''],['الرقم',x.t||''],...(x.gen?[['ملاحظة','رقم عام — تحقق من الأرقام']]:[])].filter(p=>p[1]))}}
 const fs=S[c].f.filter(f=>f.type!=='head');const rs=(DB[c]||[]).filter(x=>!x.sample&&shHas(x,filt));const dk=S[c].date;rs.sort((a,b)=>String(b[dk]||'').localeCompare(String(a[dk]||'')));
 return {t:S[c].t,rows:rs.map(x=>fs.map(f=>[f.l,shVal(f,x[f.k])]).filter(p=>Array.isArray(p[1])?p[1].length:p[1]!==''))}}
function shBuild(s){const st=DB.settings,now=new Date(),t=today();const P={school:st.school||'',g:isGirls()?1:0,genG:t,genH:hjFmt(t),genT:now.toLocaleTimeString('ar-SA-u-nu-latn',{hour:'2-digit',minute:'2-digit'}),copy:COPYRIGHT,ver:APP_VERSION,sections:[]};
 if(s.mode==='com'){const c=DB.committees.find(x=>x.id===s.com);if(!c)throw new Error('اختر لجنة');const nm=comName(c);P.rk='لجنة';P.rn=nm;
  const info=S.committees.f.filter(f=>f.type!=='head').map(f=>[f.l,shVal(f,c[f.k])]).filter(p=>p[1]!=='');const o=c.off||{};
  if(o.goal)info.push(['الهدف',o.goal]);if(Array.isArray(o.members)&&o.members.length)info.push(['الأعضاء (التشكيل الرسمي)',o.members.map(String)]);if(Array.isArray(o.tasks)&&o.tasks.length)info.push(['مهام اللجنة',o.tasks.map(k=>(c.tdone&&c.tdone[k.id]?'✅ ':'⬜ ')+k.t)]);if(Array.isArray(o.meetings)&&o.meetings.length)info.push(['مواعيد الاجتماعات',o.meetings.map(String)]);
  P.sections.push({t:'بيانات اللجنة',rows:[info]});
  const mf=S.meetings.f.filter(f=>f.type!=='head');P.sections.push({t:'الاجتماعات والمحاضر',rows:comMeetings(c).filter(m=>!m.sample).map(m=>mf.map(f=>[f.l,shVal(f,m[f.k])]).filter(p=>Array.isArray(p[1])?p[1].length:p[1]!==''))});
  const linked=['tasks','actions','events','activities','pd','guidance','exact'].filter(k=>S[k]);linked.forEach(k=>{const sec=shSection(k,c.name);if(nm!==c.name){const s2=shSection(k,nm);if(s2.rows.length>sec.rows.length)sec.rows=s2.rows}if(sec.rows.length){sec.t+=' (المرتبطة باللجنة)';P.sections.push(sec)}});
  s.ccols.filter(k=>k!=='committees'&&k!=='meetings').forEach(k=>{if(shList().includes(k))P.sections.push(shSection(k,''))})}
 else{P.rk=isGirls()?'المعلمة':'المعلم';P.rn=s.teacher.trim()||(isGirls()?'جميع المعلمات':'جميع المعلمين');if(!s.cols.length)throw new Error('اختر قسماً واحداً على الأقل');s.cols.forEach(k=>{if(shList().includes(k))P.sections.push(shSection(k,s.teacher.trim()))})}
 return P}
function shHTML(P){const j=JSON.stringify(P).replace(/</g,'\\u003c');const ac=P.g?'#be185d':'#0b3d2e';
 return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:"><title>نسخة اطلاع — ${esc(P.school)}</title>
<style>*{box-sizing:border-box}body{margin:0;font-family:Tahoma,"Segoe UI",system-ui,sans-serif;background:#f3f4f6;color:#1f2937;line-height:1.7}header{background:${ac};color:#fff;padding:14px 16px}h1{font-size:1.15rem;margin:0}header .m{font-size:.85rem;opacity:.9}.ro{background:#fef3c7;color:#92400e;font-weight:700;text-align:center;padding:8px;border-bottom:2px solid #f59e0b}main{max-width:900px;margin:auto;padding:12px}.toc{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.toc a{background:#fff;border:1px solid #d1d5db;border-radius:999px;padding:2px 10px;font-size:.85rem;color:${ac};text-decoration:none}input{width:100%;padding:9px;border:1px solid #d1d5db;border-radius:8px;font:inherit}section{margin-top:14px}h2{font-size:1.05rem;color:${ac};border-bottom:2px solid ${ac};padding-bottom:3px}.rec{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:8px 12px;margin:8px 0}.rec div{border-bottom:1px dashed #eee;padding:2px 0;overflow-wrap:anywhere}.rec div:last-child{border:0}.rec b{color:#374151}.rec ul{margin:0;padding-inline-start:18px}.empty{color:#6b7280;font-size:.9rem}footer{text-align:center;font-size:11px;color:#6b7280;padding:16px}@media print{.toc,input{display:none}}</style></head><body>
<header><h1>${esc(P.school||'المدرسة')}</h1><div class="m">نسخة اطلاع إلى ${esc(P.rk)}: <b>${esc(P.rn)}</b></div><div class="m">أُنشئت في ${esc(P.genH)} — ${esc(P.genG)} — ${esc(P.genT)}</div></header>
<div class="ro">🔒 نسخة اطلاع فقط — لا يمكن التعديل</div><main><div class="toc" id="toc"></div><input id="q" type="search" placeholder="بحث داخل النسخة…" aria-label="بحث"><div id="out"></div></main>
<footer>${esc(P.copy)}<br>لوحة قيادة المدرسة — الإصدار ${esc(P.ver)}</footer>
<script>(function(){"use strict";var P=${j};var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function draw(q){var h='';P.sections.forEach(function(s,i){var rs=s.rows.filter(function(r){return !q||JSON.stringify(r).indexOf(q)>-1});h+='<section id="s'+i+'"><h2>'+E(s.t)+' ('+rs.length+')</h2>'+(rs.length?rs.map(function(r){return '<div class="rec">'+r.map(function(p){return '<div><b>'+E(p[0])+':</b> '+(Array.isArray(p[1])?'<ul>'+p[1].map(function(x){return '<li>'+E(x)+'</li>'}).join('')+'</ul>':E(p[1]).replace(/\\n/g,'<br>'))+'</div>'}).join('')+'</div>'}).join(''):'<p class="empty">لا توجد سجلات.</p>')+'</section>'});document.getElementById('out').innerHTML=h}
document.getElementById('toc').innerHTML=P.sections.map(function(s,i){return '<a href="#s'+i+'">'+E(s.t)+'</a>'}).join('');draw('');document.getElementById('q').addEventListener('input',function(e){draw(e.target.value.trim())})})();<\/script></body></html>`}
async function shMake(){const s=shState();let P;try{P=shBuild(s)}catch(e){toast(e.message);return}const html=shHTML(P);const nm=(s.mode==='com'?'نسخة-اطلاع-اللجنة-':'نسخة-اطلاع-المعلم-')+today()+'.html';
 window._shLast={name:nm,html,P};const f=new File([html],nm,{type:'text/html'});
 if(navigator.canShare&&navigator.share&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'نسخة اطلاع — '+(DB.settings.school||''),text:'نسخة اطلاع فقط من لوحة قيادة المدرسة'});toast('✅ تمت المشاركة');return}catch(e){if(e&&e.name==='AbortError')return}}
 download(nm,html,'text/html');toast('⬇️ نُزّل الملف '+nm+' — أرسله عبر واتساب')}
function shareView(){const s=shState(),G=isGirls(),list=shList();const box=(k,on,attr)=>{const sens=SH_SENS.includes(k);return `<label class="shbox${sens?' sens':''}"><input type="checkbox" ${attr}="${k}" ${on?'checked':''} data-novoice> ${esc(shTitle(k))} <span class="muted small">(${shCount(k)})</span>${sens?' <span class="chip warn">حساس</span>':''}</label>`};
 const coms=DB.committees.filter(c=>!c.sample);
 return `<div class="head"><div><h2>👩‍🏫 نسخة اطلاع ${G?'للمعلمة':'للمعلم'} / للجنة</h2><div class="muted small">ملف HTML واحد يُفتح على أي جوال دون إنترنت ودون تثبيت — للقراءة فقط.</div></div></div>
 <div class="card"><div class="ptabs"><button class="ptab ${s.mode==='t'?'on':''}" data-act="shmode" data-id="t">${G?'للمعلمة':'للمعلم'}</button><button class="ptab ${s.mode==='com'?'on':''}" data-act="shmode" data-id="com">للجنة</button></div>
 ${s.mode==='t'?`<div class="fld"><label for="shT">اسم ${G?'المعلمة':'المعلم'} (اختياري — لتضمين السجلات التي يرد فيها الاسم فقط)</label><input id="shT" value="${esc(s.teacher)}" placeholder="اتركه فارغاً لمشاركة الأقسام كاملة"></div>
 <h3>الأقسام المشمولة</h3><div class="shgrid">${list.map(k=>box(k,s.cols.includes(k),'data-shc')).join('')}</div>`
 :`<div class="fld"><label for="shCom">اللجنة</label><select id="shCom" data-novoice><option value="">— اختر لجنة —</option>${coms.map(c=>`<option value="${c.id}" ${s.com===c.id?'selected':''}>${esc(comName(c))}</option>`).join('')}</select></div>
 <p class="small muted">تتضمن النسخة: بيانات اللجنة (الأعضاء، المهام، الدورية، التواريخ)، واجتماعاتها ومحاضرها، والسجلات المرتبطة بها (المهام والإجراءات وغيرها التي يرد فيها اسم اللجنة).</p>
 <h3>أقسام عامة إضافية (اختياري)</h3><div class="shgrid">${list.filter(k=>k!=='committees'&&k!=='meetings').map(k=>box(k,s.ccols.includes(k),'data-shcc')).join('')}</div>`}
 <div class="banner red small" id="shWarn" ${(s.mode==='t'?s.cols:s.ccols).some(k=>SH_SENS.includes(k))?'':'hidden'}>⚠️ اخترت قسماً حساساً (قد يتضمن أسماء طلاب أو تقويمات أو أرقام تواصل). تأكد من أن المستلم مخوّل بالاطلاع عليه.</div>
 <p class="small muted">🔒 لا تُضمَّن ملفات الشواهد والمرفقات إطلاقاً، ولا تُضمَّن البيانات التجريبية.</p>
 <div class="btns"><button class="btn gold" data-act="shmake">📤 إنشاء النسخة ومشاركتها</button></div></div>
 ${howto('نسخة الاطلاع',['اختر «'+(G?'للمعلمة':'للمعلم')+'» أو «للجنة».','للمعلم: حدّد الأقسام (المجموعة الافتراضية آمنة)، ويمكن كتابة اسم '+(G?'المعلمة':'المعلم')+' لتضمين السجلات التي يرد فيها اسمه فقط.','للجنة: اختر اللجنة، فتُضمَّن بياناتها واجتماعاتها والسجلات المرتبطة بها، ويمكن إضافة أقسام عامة.','الأقسام الحساسة غير محددة افتراضياً وتظهر بشارة «حساس» مع تنبيه عند اختيارها.','اضغط «إنشاء النسخة ومشاركتها»: على الجوال تظهر قائمة المشاركة (واتساب…)، وإلا يُنزَّل ملف HTML مؤرَّخ لإرساله.','يفتح المستلم الملف في أي متصفح دون إنترنت؛ النسخة للقراءة فقط ولا تتصل بأي خادم ولا تلمس بيانات لوحته إن وُجدت على جهازه.','النسخة لقطة بتاريخ إنشائها؛ أنشئ نسخة جديدة عند تحديث البيانات.'])}`}

/* ---------- v1.17 Data protection: persistent storage, meter, auto backup, install hint ---------- */
let PROT={persisted:null,est:null};
async function protPersist(ask){try{if(!navigator.storage||!navigator.storage.persist)return PROT.persisted=null;let p=await navigator.storage.persisted();if(!p&&ask!==false)p=await navigator.storage.persist();PROT.persisted=p;return p}catch(e){return PROT.persisted=null}}
async function protEst(){try{if(navigator.storage&&navigator.storage.estimate)PROT.est=await navigator.storage.estimate()}catch(e){}return PROT.est}
function hSize(b){b=+b||0;return b>=1073741824?(b/1073741824).toFixed(2)+' ج.ب':b>=1048576?(b/1048576).toFixed(1)+' م.ب':(b/1024).toFixed(0)+' ك.ب'}
function metaDb(){return new Promise((res,rej)=>{if(!('indexedDB' in window))return rej(new Error('no idb'));const r=indexedDB.open('sld-meta',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function metaGet(k){try{const d=await metaDb();return await new Promise(r=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})}catch(e){return null}}
async function metaSet(k,v){try{const d=await metaDb();await new Promise(r=>{const t=d.transaction('kv','readwrite');v==null?t.objectStore('kv').delete(k):t.objectStore('kv').put(v,k);t.oncomplete=r;t.onerror=r})}catch(e){}}
const FSA=()=>typeof window.showDirectoryPicker==='function';
const ABK_PRE='نسخة-تلقائية-لوحة-القيادة-';
function abkMode(){const m=DB.settings.autoBk;return m==null||m===''?'daily':m}
function abkDue(){const m=abkMode(),s=DB.settings;if(m==='off'||!s.setupDone||!bkHasData())return false;if(!s.lastAutoBk)return true;const d=dDiff(today(),String(s.lastAutoBk).slice(0,10));return m==='weekly'?d>=7:d>=1}
async function abkWriteDir(h,txt){const name=ABK_PRE+today()+'.json';const fh=await h.getFileHandle(name,{create:true});const w=await fh.createWritable();await w.write(new Blob([txt],{type:'application/json'}));await w.close();
 const ns=[];for await(const [n,e] of h.entries())if(e.kind==='file'&&n.startsWith(ABK_PRE)&&n.endsWith('.json'))ns.push(n);ns.sort();for(const n of ns.slice(0,Math.max(0,ns.length-5)))await h.removeEntry(n).catch(()=>{});return name}
async function abkRun(force){if(!force&&!abkDue())return false;try{const txt=await backupText();let how='';const h=FSA()?await metaGet('bkDir'):null;
 if(h&&(await h.queryPermission({mode:'readwrite'}))==='granted'){await abkWriteDir(h,txt);how='المجلد «'+h.name+'»'}
 else{download(`${ABK_PRE}${today()}.json`,txt,'application/json');how='التنزيلات'}
 const s=DB.settings;s.lastAutoBk=new Date().toISOString();s.lastAutoHow=how;s.lastBackup=today();s.backupSnooze='';save();bkHide();toast('💾 حُفظت نسخة احتياطية تلقائية في '+how);if(view()==='settings')protFill();return true}
 catch(e){toast('تعذّر النسخ الاحتياطي التلقائي — صدّر نسخة يدوياً');return false}}
async function abkPick(){if(!FSA())return;try{const h=await window.showDirectoryPicker({mode:'readwrite',id:'sld-backup'});if((await h.requestPermission({mode:'readwrite'}))!=='granted')return;await metaSet('bkDir',h);await abkRun(true);protFill()}catch(e){if(e&&e.name!=='AbortError')toast('تعذّر اختيار المجلد')}}
async function abkRegrant(){const h=await metaGet('bkDir');if(!h)return abkPick();try{if((await h.requestPermission({mode:'readwrite'}))==='granted'){await abkRun(true);protFill()}}catch(e){}}
function protCard(){const s=DB.settings,m=abkMode();return `<div class="card prot" id="protCard"><h3>🛡️ حماية البيانات</h3>
 <div class="protrow"><b>التخزين الدائم:</b> <span id="protSt" class="chip">…</span> <button class="btn sm ghost" data-act="protask">طلب الحماية مجدداً</button></div>
 <div class="protrow"><b>مساحة التخزين:</b> <span id="protUse">…</span><div class="pbar" aria-hidden="true"><i id="protBar" style="width:0"></i></div><div id="protWarn" class="banner red small" hidden>⚠️ المساحة المستخدمة تجاوزت 80% — صدّر نسخة احتياطية وقلّل حجم المرفقات.</div></div>
 <div class="fld"><label for="s_abk">النسخ الاحتياطي التلقائي إلى ملف</label><select id="s_abk">${[['off','إيقاف'],['daily','يومياً (عند أول فتح في اليوم)'],['weekly','أسبوعياً']].map(([v,l])=>`<option value="${v}" ${m===v?'selected':''}>${l}</option>`).join('')}</select></div>
 <div class="protrow small" id="protDir">${FSA()?'…':'متصفحك لا يدعم الحفظ في مجلد؛ ستُنزَّل النسخة التلقائية إلى «التنزيلات» باسم مؤرَّخ.'}</div>
 <p class="small">آخر نسخة تلقائية: <b id="protLast">${s.lastAutoBk?'<bdi dir="ltr">'+esc(new Date(s.lastAutoBk).toLocaleString('en-GB',{hour12:false}).slice(0,17))+'</bdi> — '+esc(s.lastAutoHow||''):'لم تُؤخذ بعد'}</b></p>
 <div class="btns"><button class="btn gold sm" data-act="abknow">💾 نسخة تلقائية الآن</button></div>
 ${howto('حماية البيانات',['«التخزين الدائم» يطلب من المتصفح عدم حذف بيانات اللوحة تلقائياً عند امتلاء الجهاز؛ إن ظهرت «غير محمية» فاضغط «طلب الحماية مجدداً» (تثبيت التطبيق على الشاشة الرئيسية يزيد فرصة القبول).','«مساحة التخزين» تعرض ما تستخدمه اللوحة ومرفقاتها مقابل المتاح، ويظهر تنبيه عند تجاوز 80%.','«النسخ الاحتياطي التلقائي»: يومياً أو أسبوعياً تُحفظ نسخة كاملة (مع ملفات الشواهد) بنفس صيغة «استيراد نسخة احتياطية».','في Chrome على الحاسب أو أندرويد اختر مجلداً مرة واحدة فتُكتب النسخ فيه بصمت ويُحتفظ بآخر 5 نسخ فقط؛ وفي غيره تُنزَّل النسخة إلى «التنزيلات» مرة في كل فترة.','عند نجاح النسخ التلقائي لا يظهر تذكير النسخ الاحتياطي.','للاسترجاع: الإعدادات ← «استيراد نسخة احتياطية» واختر أحدث ملف.'])}</div>`}
async function protFill(){if(!$('#protCard'))return;const p=await protPersist(false);const st=$('#protSt');if(st){st.textContent=p===null?'غير مدعوم في هذا المتصفح':p?'✅ محمية من الحذف التلقائي':'⚠️ غير محمية';st.className='chip '+(p?'ok':'warn')}
 const e=await protEst();if(e&&e.quota){const pc=Math.min(100,(e.usage||0)/e.quota*100);$('#protUse').innerHTML=`<bdi>${hSize(e.usage)}</bdi> مستخدمة من <bdi>${hSize(e.quota)}</bdi> متاحة (<bdi>${pc.toFixed(pc<1?2:0)}%</bdi>)`;$('#protBar').style.width=Math.max(pc,1)+'%';$('#protBar').className=pc>80?'hi':'';$('#protWarn').hidden=pc<=80}else if($('#protUse'))$('#protUse').textContent='غير متاح في هذا المتصفح';
 if(FSA()){const h=await metaGet('bkDir'),d=$('#protDir');if(!d)return;let g='';try{g=h?await h.queryPermission({mode:'readwrite'}):''}catch(x){}
  d.innerHTML=h?`📁 مجلد النسخ: <b>${esc(h.name)}</b> ${g==='granted'?'(مفعّل — يُحتفظ بآخر 5 نسخ)':'<span class="chip warn">يحتاج إذناً</span> <button class="btn sm ghost" data-act="abkgrant">منح الإذن</button>'} <button class="btn sm ghost" data-act="abkpick">تغيير المجلد</button> <button class="btn sm ghost" data-act="abkclear">إلغاء المجلد</button>`:`<button class="btn sm" data-act="abkpick">📁 اختيار مجلد للنسخ التلقائي</button> <span class="muted">(بدون مجلد تُنزَّل النسخة إلى «التنزيلات»)</span>`}}
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function instCard(){if(isStandalone()||localStorage.getItem('sld_inst_x'))return'';const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 return `<div class="card instc" id="instCard"><button class="iconbtn instx" data-act="instx" aria-label="إخفاء">✕</button><h3>📲 ثبّت اللوحة على الشاشة الرئيسية</h3><p class="small">التثبيت يجعل اللوحة تفتح كتطبيق مستقل ويقلّل احتمال فقدان البيانات عند تنظيف المتصفح.</p>
 ${deferredInstall?'<div class="btns"><button class="btn gold" data-act="install">تثبيت الآن</button></div>':''}
 <div class="grid two small"><div${ios?' style="order:2"':''}><b>أندرويد (Chrome):</b><ol style="list-style:decimal;padding-inline-start:20px"><li>اضغط ⋮ أعلى المتصفح.</li><li>اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</li><li>أكّد «تثبيت».</li></ol></div>
 <div><b>آيفون (Safari):</b><ol style="list-style:decimal;padding-inline-start:20px"><li>اضغط زر المشاركة ⬆️ أسفل الشاشة.</li><li>اختر «إضافة إلى الشاشة الرئيسية».</li><li>اضغط «إضافة».</li></ol></div></div></div>`}
setTimeout(()=>protPersist(true),1500);setTimeout(()=>abkRun(false),4000);

/* ---------- Service worker + update banner ---------- */
/* A modal <dialog> makes the page behind it inert, so mirror the update banner inside any open dialog */
function updSync(){if(document.querySelector('dialog[open]'))bkHide();const bar=$('#updateBar');if(!bar)return;document.querySelectorAll('dialog').forEach(d=>{let u=d.querySelector(':scope>.updin');const want=!bar.hidden&&d.open;
 if(want&&!u){u=document.createElement('div');u.className='banner gold updin';u.setAttribute('role','status');u.innerHTML='يتوفر إصدار جديد — احفظ عملك ثم حدّث. <button type="button" class="btn sm">تحديث الآن</button>';u.querySelector('button').onclick=()=>{try{flushSave()}catch(e){}$('#updBtn').click()};d.prepend(u)}
 else if(!want&&u)u.remove()})}
new MutationObserver(updSync).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['open','hidden']});
if('serviceWorker' in navigator&&location.protocol!=='file:'){
 navigator.serviceWorker.register('sw.js').then(reg=>{
  const show=()=>{$('#updateBar').hidden=false;updSync()};
  if(reg.waiting&&navigator.serviceWorker.controller)show();
  reg.addEventListener('updatefound',()=>{const w=reg.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)show()})});
  setInterval(()=>reg.update().catch(()=>{}),30*60*1000);
  $('#updBtn').onclick=()=>{(reg.waiting||reg.installing)?.postMessage('skip');setTimeout(()=>location.reload(),600)};
 }).catch(e=>console.warn('SW',e));
 let reloading=false;const had=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||reloading)return;reloading=true;location.reload()});
}

/* ---------- Init ---------- */
loadFiles().then(()=>{if(FILES.length)render()});
load();mergeTemplates();mergeCommittees();mergeOfficial();if(!DB.settings.setupDone&&DB.settings.school)DB.settings.setupDone=true;setTheme(DB.settings.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));net();render();
if(!DB.settings.setupDone)setupWizard();
setTimeout(checkReminders,1500);setInterval(checkReminders,30000);

/* ---------- Anonymous usage counter (no school data; only +1 hits) ---------- */
(function(){try{if(!/github\.io$/.test(location.hostname)||!navigator.onLine)return;const C='https://abacus.jasoncameron.dev/hit/alotibi21-sld/';
 const hit=k=>fetch(C+k,{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',mode:'cors'}).then(r=>r.ok).catch(()=>false);
 setTimeout(()=>{if(!sessionStorage.getItem('sld_v')){sessionStorage.setItem('sld_v','1');hit('visits')}
  if(!localStorage.getItem('sld_dev'))hit('devices').then(ok=>{if(ok)localStorage.setItem('sld_dev','1')})},3000)}catch(e){}})();

/* voice wiring */
(function(){try{const f=$('#dlgForm');if(f)new MutationObserver(()=>voiceWire(f)).observe(f,{childList:true});const d=$('#dlg');if(d)d.addEventListener('close',voiceStop);
 if(SR)voiceWire($('.search'));addEventListener('hashchange',voiceStop);
 const m=$('#main');if(m)new MutationObserver(()=>{if(view()==='survey')voiceWire(m.querySelector('.card'));if(view()==='tasks'&&!searchQ){const hb=m.querySelector('.head .btns');if(hb&&!hb.querySelector('[data-act=vtask]')){const b=document.createElement('button');b.className='btn ghost';b.dataset.act='vtask';b.textContent='🎤 مهمة بالصوت';if(!SR){b.disabled=true;b.title='غير مدعوم في هذا المتصفح'}hb.prepend(b)}}}).observe(m,{childList:true})}catch(e){}})();

/* ---------- Ticker (data-driven): {t:text, url?:link, until?:'YYYY-MM-DD' last day shown, Asia/Riyadh} ---------- */
const TICKER=[
 {t:'⏰ تثبيت الغياب يوميًا قبل الساعة ٨ ص'},
 {qiyam:1,day21:1},
 {t:'📝 رابط تقرير تنفيذ برنامجي تعزيز السلوك الإيجابي «قيمة الانتماء للوطن» وتعزيز الهوية الوطنية — آخر موعد يوم الخميس ١١-٥-١٤٤٨هـ',url:'https://forms.cloud.microsoft/pages/responsepage.aspx?id=UYPKa9MBUkKF6r2o-NI1vTa68RRDvD1MvENeG7mh5SZUQVdQOVBVUFNLRzVTTUdWNzQxMk1COUo2VC4u&origin=QRCode&qrcodeorigin=presentation&route=shorturl',until:'2026-10-22'},
 {t:'رابط حصر الوعي الفكري مطلوب الانتهاء منه اليوم الأحد ٧-٥-١٤٤٨هـ',url:'https://forms.cloud.microsoft/r/ezaF8WGK4e?origin=lprLink',until:'2026-10-18'}
];
const riyadhDay=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return today()}};
const QIYAM_URL={'بنين':'https://forms.cloud.microsoft/pages/responsepage.aspx?id=0gr9a2BA-U-RAIEOdddRtRxZnL_yVexCnY4FPtcLqQFUMjhZQTk4ODRSREk1MkdHUDEyUUxYSTE4TC4u&route=shorturl','بنات':'https://forms.cloud.microsoft/Pages/ShareFormPage.aspx?id=UYPKa9MBUkKF6r2o-NI1vc2eKLLGyGZJhe9kvIOLT1JUQUtIVkxRWDdRQ0VNVURJQThZSk5BMVRTMi4u&sharetoken=91R1Kn1nsttfjH00Z8Ow'};
const tkGender=()=>{try{return DB.settings.gender||''}catch(e){return ''}};var tkLastG=null;
function tkResolve(x){if(!x.qiyam)return x;const g=tkGender(),who=g==='بنين'?'مدير':g==='بنات'?'مديرة':'مدير/مديرة';
 const t=`يُعبّأ في ٢١ من كل شهر ميلادي من قبل كل ${who} مدرسة مستهدفة في مشروع ترسيخ القيم وتعزيز الهوية الوطنية`;
 return QIYAM_URL[g]?{...x,t,url:QIYAM_URL[g]}:{...x,t,urls:[['رابط البنين',QIYAM_URL['بنين']],['رابط البنات',QIYAM_URL['بنات']]]}}
function renderTicker(){const el=$('#ticker');if(!el)return;const d=riyadhDay();tkLastG=tkGender();const hot=d.slice(8)==='21';const items=TICKER.filter(x=>!x.until||d<=x.until).map(tkResolve);
 const html=items.map(x=>{const h=x.day21&&hot,pre=h?'<b class="tk-hot">📌 اليوم ٢١</b> ':'';const cls=h?' tk-hotitem':'';
 if(x.urls)return `<span class="tk-item${cls}">${pre}🔗 ${esc(x.t)} — اضغط هنا: ${x.urls.map(([l,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" class="tk-link"><u>${l}</u></a>`).join(' | ')}</span>`;
 return x.url?`<span class="${cls.trim()}">${pre}`+`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" class="tk-link">🔗 ${esc(x.t)} — <u>اضغط هنا</u></a></span>`:`<span class="tk-item">${esc(x.t)}</span>`}).join('<span class="tk-sep" aria-hidden="true">✦</span>');
 el.setAttribute('aria-label','تنبيهات: '+items.map(x=>x.t).join('، '));el.innerHTML=`<span class="tk-run">${html}</span>`;
 const run=el.firstElementChild;requestAnimationFrame(()=>{const w=run.scrollWidth+el.clientWidth,sp=innerWidth<820?55:80;run.style.animationDuration=Math.max(10,Math.round(w/sp))+'s'})}
(function(){try{renderTicker();window._tkReady=1;const el=$('#ticker');let t;const pause=()=>{el.classList.add('paused');clearTimeout(t);t=setTimeout(()=>el.classList.remove('paused'),5000)};
 el.addEventListener('pointerdown',pause);el.addEventListener('touchstart',pause,{passive:true});el.addEventListener('focusin',()=>el.classList.add('paused'));el.addEventListener('focusout',()=>el.classList.remove('paused'));
 let lastDay=riyadhDay();setInterval(()=>{const d=riyadhDay();if(d!==lastDay){lastDay=d;renderTicker()}},60000);let rw=innerWidth;addEventListener('resize',()=>{if(Math.abs(innerWidth-rw)>40){rw=innerWidth;renderTicker()}})}catch(e){}})();

/* ---------- عداد الأسابيع الدراسية (التقويم المعتمد ١٤٤٨هـ) ---------- */
/* لتحديث العام القادم: عدّل هذه المصفوفة فقط. التواريخ ميلادية (YYYY-MM-DD) شاملة البداية والنهاية. */
const SCHOOL_CAL={year:'1448هـ (2026–2027م)',terms:[
 {name:'الفصل الدراسي الأول',start:'2026-08-23',end:'2027-01-07'},
 {name:'الفصل الدراسي الثاني',start:'2027-01-17',end:'2027-06-24'}],
 exams:[{name:'اختبارات نهاية الفترة الدراسية الأولى',from:'2027-01-03',to:'2027-01-06'}],
 holidays:[
 {name:'إجازة اليوم الوطني',from:'2026-09-23',to:'2026-09-24'},
 {name:'إجازة إضافية',from:'2026-10-25',to:'2026-10-25'},
 {name:'إجازة الخريف',from:'2026-11-20',to:'2026-11-29'},
 {name:'إجازة إضافية',from:'2027-01-07',to:'2027-01-07'},
 {name:'إجازة منتصف العام الدراسي',from:'2027-01-08',to:'2027-01-16'},
 {name:'إجازة يوم التأسيس',from:'2027-02-21',to:'2027-02-22'},
 {name:'إجازة عيد الفطر المبارك',from:'2027-02-26',to:'2027-03-13'},
 {name:'إجازة إضافية',from:'2027-04-11',to:'2027-04-11'},
 {name:'إجازة عيد الأضحى المبارك',from:'2027-05-07',to:'2027-05-22'},
 {name:'إجازة نهاية العام الدراسي',from:'2027-06-25',to:'2027-08-21'}]};
const wkSun=s=>{const d=parseD(s);d.setDate(d.getDate()-d.getDay());return iso(d)};
const wkHol=s=>SCHOOL_CAL.holidays.find(h=>s>=h.from&&s<=h.to);
const wkSchoolDay=s=>{const w=parseD(s).getDay();return w<5&&!wkHol(s)};
/* أسابيع الفصل: كل أسبوع (أحد–خميس) فيه يوم دراسي واحد على الأقل */
function wkWeeks(t){const a=[];for(let s=wkSun(t.start);s<=t.end;s=addDays(s,7)){let ok=false;for(let i=0;i<5;i++){const d=addDays(s,i);if(d>=t.start&&d<=t.end&&wkSchoolDay(d))ok=true}if(ok)a.push(s)}return a}
function wkState(now=new Date()){const t=iso(now),T=SCHOOL_CAL.terms;let term=T.find(x=>t>=x.start&&t<=x.end),i=T.indexOf(term);
 const hol=wkHol(t);const ev=[];SCHOOL_CAL.holidays.forEach(h=>ev.push({n:'بداية '+h.name,d:h.from,h}));T.forEach(x=>{ev.push({n:'نهاية '+x.name,d:addDays(x.end,1),end:1});ev.push({n:'بداية '+x.name,d:x.start})});
 ev.sort((a,b)=>a.d<b.d?-1:1);const next=hol&&hol.to<SCHOOL_CAL.holidays[SCHOOL_CAL.holidays.length-1].to?{n:'العودة من '+hol.name,d:addDays(hol.to,1)}:ev.find(e=>e.d>t&&!(hol&&e.h===hol));const nextHol=SCHOOL_CAL.holidays.find(h=>h.from>t);
 const r={t,term,hol,next,nextHol};if(term){const W=wkWeeks(term),sw=wkSun(t);r.N=W.length;let k=W.indexOf(sw);if(k<0)k=W.filter(w=>w<sw).length;else k++;r.k=Math.max(0,Math.min(k,W.length));
  const ws=W[r.k-1]||sw;r.ws=ws;r.we=addDays(ws,4);r.exam=(SCHOOL_CAL.exams||[]).find(e=>e.from<=r.we&&e.to>=ws);r.wLeft=W.filter(w=>w>sw).length;let sd=0,sdAll=0,sdDone=0;for(let d=term.start;d<=term.end;d=addDays(d,1)){if(!wkSchoolDay(d))continue;sdAll++;if(d>=t)sd++;if(d<t)sdDone++}r.sdLeft=sd;r.cal=Math.round((parseD(term.end)-parseD(t))/864e5);r.pct=Math.round(sdDone/sdAll*100)}
 else{r.before=t<T[0].start;r.after=t>T[T.length-1].end;r.between=!r.before&&!r.after}return r}
const WK_ORD=['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر','الحادي عشر','الثاني عشر','الثالث عشر','الرابع عشر','الخامس عشر','السادس عشر','السابع عشر','الثامن عشر','التاسع عشر','العشرون','الحادي والعشرون','الثاني والعشرون','الثالث والعشرون','الرابع والعشرون'];
const wkHm=s=>{const p=hjParts(s);return String(p.m+'/'+p.d).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])};
function weeksCard(){const s=wkState(),now=new Date();const hj=(()=>{try{return now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-latn',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}catch(e){return''}})(),gr=now.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{year:'numeric',month:'long',day:'numeric'});
 let main='',badge='';if(s.hol){badge=`<span class="wkbadge hol">🌴 إجازة</span>`;main=`<div class="wkbig">${esc(s.hol.name)}</div><div class="wksub">تنتهي ${fmtDate(s.hol.to,true)}</div>`}
 if(s.term){if(!s.hol)badge=`<span class="wkbadge">📚 أيام دراسة</span>`;main+=`${s.k?`<div class="wkrange">الأسبوع ${WK_ORD[s.k-1]||s.k}: <bdi>${wkHm(s.ws)}</bdi> – <bdi>${wkHm(s.we)}</bdi> هـ</div>`:''}${s.exam&&!s.hol?`<div class="wkexam">📝 ${esc(s.exam.name)}</div>`:''}<div class="wkbig">${s.hol?'':`الأسبوع <b>${s.k}</b> من <b>${s.N}</b>`}</div>${s.hol?`<div class="wksub">${esc(s.term.name)} — الأسبوع ${s.k} من ${s.N}</div>`:''}
  <div class="wkbar" role="progressbar" aria-valuenow="${s.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="نسبة ما مضى من الفصل"><i style="width:${s.pct}%"></i></div>
  ${wkGauges(s)}<div class="wkstats"><div><b>${s.pct}%</b><span>مضى من الفصل</span></div><div><b>${s.wLeft}</b><span>أسابيع متبقية</span></div><div><b>${s.sdLeft}</b><span>يوماً دراسياً متبقياً</span></div><div><b>${s.cal}</b><span>يوماً حتى نهاية الفصل</span></div></div>`}
 else if(s.before){badge=`<span class="wkbadge hol">⏳ قبل بداية العام</span>`;main=`<div class="wkbig">العام الدراسي ${SCHOOL_CAL.year} لم يبدأ بعد</div>`}
 else if(s.after){badge=`<span class="wkbadge hol">☀️ انتهى العام</span>`;main=`<div class="wkbig">انتهى العام الدراسي ${SCHOOL_CAL.year}</div><div class="wksub">يُرجى تحديث بيانات التقويم للعام الجديد</div>`}
 else if(!s.hol){badge=`<span class="wkbadge hol">🌴 إجازة</span>`;main=`<div class="wkbig">إجازة بين الفصلين</div>`}
 const cd=s.next?`<div class="wkcd"><div class="small">⏱️ المتبقي على: <b>${esc(s.next.n)}</b> (${fmtDate(s.next.d,true)})</div><div class="wkcdg" id="wkCd" data-to="${s.next.d}">${['يوم','ساعة','دقيقة','ثانية'].map(u=>`<div><b>--</b><span>${u}</span></div>`).join('')}</div></div>`:'';
 return `<section class="card wkcard" aria-label="عداد الأسابيع الدراسية"><div class="row"><h3 class="grow" style="margin:0">🗓️ عداد الأسابيع الدراسية</h3>${badge}<button type="button" class="wkcf" data-wkcf aria-label="إعادة الاحتفال" title="احتفال 🎉">🎉</button></div>
 <div class="wkdate">${esc(hj)} — ${esc(gr)}</div>${s.term?`<div class="wkterm">${esc(s.term.name)} — العام الدراسي ${SCHOOL_CAL.year}</div>`:''}${main}${cd}
 ${s.nextHol&&!(s.next&&s.next.h===s.nextHol)?`<div class="small wknh">🌴 الإجازة القادمة: <b>${esc(s.nextHol.name)}</b> — ${fmtDate(s.nextHol.from,true)}</div>`:''}
 <div class="small wknote">وفق التقويم الدراسي المعتمد من وزارة التعليم.</div></section>`}
let WKT=null;function wkTick(){const el=document.getElementById('wkCd');if(!el){clearInterval(WKT);WKT=null;return}let ms=parseD(el.dataset.to)-new Date();if(ms<=0){render();return}const v=[Math.floor(ms/864e5),Math.floor(ms/36e5)%24,Math.floor(ms/6e4)%60,Math.floor(ms/1e3)%60];el.querySelectorAll('b').forEach((b,i)=>b.textContent=String(v[i]).padStart(i?2:1,'0'))}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-wkcf]'))sldConfetti(true)});
function wkStart(){try{wkCelebrate()}catch(e){}clearInterval(WKT);if(document.getElementById('wkCd')){wkTick();WKT=setInterval(wkTick,1000)}}

/* ---------- مقاييس دائرية للفصل ---------- */
function wkGauge(l,p,txt,sub){const r=40,C=2*Math.PI*r,v=Math.max(0,Math.min(100,p||0));return `<div class="wkg"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(l)} ${esc(txt)}"><defs><linearGradient id="wkGold${l.length}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".35" stop-color="#e9c860"/><stop offset=".65" stop-color="#b88a1e"/><stop offset="1" stop-color="#f7e39a"/></linearGradient></defs><circle cx="50" cy="50" r="${r}" class="wkg-bg"/><circle cx="50" cy="50" r="${r}" class="wkg-fg" stroke="url(#wkGold${l.length})" style="--c:${C.toFixed(1)};--o:${(C*(1-v/100)).toFixed(1)}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-v/100)).toFixed(1)}" transform="rotate(-90 50 50)"/><text x="50" y="56" text-anchor="middle" class="wkg-t">${esc(txt)}</text></svg><div class="wkg-l">${esc(l)}</div>${sub?`<div class="wkg-s">${esc(sub)}</div>`:''}</div>`}
function wkGauges(s){if(!s.term)return'';return `<div class="wkgs">${wkGauge('ما مضى من الفصل',s.pct,s.pct+'%','بالأيام الدراسية')}${wkGauge('الأسابيع',s.k/s.N*100,s.k+'/'+s.N,'الأسبوع الحالي من '+s.N)}</div>`}
/* ---------- احتفال القصاصات الذهبية (مرة لكل مناسبة) ---------- */
function wkCelebrate(){const s=wkState(),T=SCHOOL_CAL.terms;let k='';
 if(s.hol)k='h_'+s.hol.from;else if(s.term&&s.k)k='w_'+s.term.start+'_'+s.k;
 if(!s.term){const e=T.filter(x=>x.end<s.t).pop();if(e)k='e_'+e.end}
 if(s.term&&s.hol&&s.term.end<=s.hol.to)k='e_'+s.term.end;
 if(!k)return;const key='sld_cf_'+k;try{if(localStorage.getItem(key))return;localStorage.setItem(key,'1')}catch(e){return}setTimeout(()=>sldConfetti(),600)}
function sldConfetti(force){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(document.getElementById('sldCf'))return;
 const c=document.createElement('canvas');c.id='sldCf';c.setAttribute('aria-hidden','true');c.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';document.body.appendChild(c);
 const dpr=Math.min(2,devicePixelRatio||1),W=innerWidth,H=innerHeight;c.width=W*dpr;c.height=H*dpr;const x=c.getContext('2d');x.scale(dpr,dpr);
 const cols=['#f7e39a','#e9c860','#c9a227','#fff3c4','#b88a1e','#1b3a63','#0f2747'],n=W<500?90:150,P=[];
 for(let i=0;i<n;i++)P.push({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*11-4,w:5+Math.random()*6,h:8+Math.random()*8,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[i%cols.length],s:Math.random()*6});
 const t0=performance.now(),D=3800;(function f(t){const e=t-t0;x.clearRect(0,0,W,H);x.globalAlpha=e>D-900?Math.max(0,(D-e)/900):1;
  P.forEach(p=>{p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.scale(1,Math.cos(e/120+p.s));x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});
  if(e<D)requestAnimationFrame(f);else c.remove()})(t0)}
