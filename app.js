'use strict';
const CREDIT='تصميم: عضو الفريق التنفيذي عبدالله خالد العتيبي – قطاع السر';
const APP_VERSION='1.7.0';
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
const FEM=[['قائد/مدير','قائدة/مديرة'],['قائد المدرسة','قائدة المدرسة'],['مدير المدرسة','مديرة المدرسة'],['المعلمين','المعلمات'],['المعلمون','المعلمات'],['معلمو','معلمات'],['المدرب','المدربة'],['معلمين','معلمات'],['للمعلمين','للمعلمات'],['المعلم','المعلمة'],['معلم','معلمة'],['الطلاب','الطالبات'],['للطلاب','للطالبات'],['طلاب','طالبات'],['الطالب','الطالبة'],['طالب','طالبة'],['المتفوقين','المتفوقات'],['الموجه الطلابي','الموجهة الطلابية'],['رائد النشاط','رائدة النشاط'],['المكرَّم','المكرَّمة'],['المكلف','المكلفة'],['المرشد الطلابي','المرشدة الطلابية'],['المرشد','المرشدة'],['المستفيدين','المستفيدات'],['الوكلاء','الوكيلات'],['المحتاجين','المحتاجات'],['منسوبين','منسوبات'],['المنسوبين','المنسوبات'],['إداري','إدارية']];
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
  {k:'domain',l:'المجال',type:'select',opts:DOMAINS,def:'الإدارة المدرسية'},{k:'attendees',l:'الحضور',type:'textarea',full:1},{k:'minutes',l:'المحضر/ما نوقش',type:'textarea',full:1},{k:'decisions',l:'القرارات والتوصيات',type:'textarea',full:1}],
  cols:['date','title','type','domain'],date:'date'},
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
  {k:'members',l:'الأعضاء',type:'textarea',full:1},{k:'tasks',l:'المهام',type:'textarea',full:1},{k:'date',l:'تاريخ التكليف',type:'date',def:'today'},{k:'end',l:'تاريخ الانتهاء',type:'date'},{k:'status',l:'الحالة',type:'select',opts:['سارية','منتهية'],def:'سارية'}],
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
const DONE={tasks:'مكتملة',actions:'منجز',oplan:'منجز'};
const lbl=(c,k)=>k==='rate'?'نسبة الحضور':(S[c].f.find(x=>x.k===k)||{}).l||k;

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
function blank(){const d={app:'school-leader-dashboard',schema:1,settings:{school:'',principal:'',region:'',year:'',logo:'',remindTime:'07:30',mute:false,theme:'',hijri:true,stages:[],gender:'',supervisor:'',supervisorMobile:'',setupDone:false},templates:DEFAULT_TEMPLATES.map(t=>({id:uid(),...t})),tplMerged:TPL_V2.map(t=>t.period+'|'+t.title),review:{},audit:[],notified:{}};COLS.forEach(c=>d[c]=[]);return d}
let DB;
function load(){try{const r=localStorage.getItem(KEY);DB=r?normalize(JSON.parse(r)):blank()}catch(e){console.warn(e);DB=blank()}}
function normalize(d){const b=blank();if(!d||typeof d!=='object')return b;
 const o={...b,...d,settings:{...b.settings,...(d.settings||{})}};
 COLS.forEach(c=>{o[c]=Array.isArray(d[c])?d[c].filter(x=>x&&typeof x==='object').map(x=>({...x,id:String(x.id||uid())})):[]});
 o.templates=Array.isArray(d.templates)?d.templates.filter(t=>t&&t.title):b.templates;
 o.tplMerged=Array.isArray(d.tplMerged)?d.tplMerged.map(String):[];o.review=d.review&&typeof d.review==='object'?d.review:{};o.audit=Array.isArray(d.audit)?d.audit.slice(-1000):[];o.notified=d.notified||{};return o}
let saveT;
function save(){const ind=$('#saveInd');ind.textContent='… جارٍ الحفظ';ind.className='save saving';clearTimeout(saveT);
 saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(DB));ind.textContent='✓ محفوظ '+new Date().toLocaleTimeString('ar-SA-u-nu-latn',{hour:'2-digit',minute:'2-digit'});ind.className='save'}
 catch(e){ind.textContent='✗ تعذّر الحفظ';ind.className='save';toast('تعذّر الحفظ: قد تكون مساحة التخزين ممتلئة (قلّل حجم الشعار أو صدّر نسخة احتياطية).')}},250)}
function audit(op,col,item){DB.audit.push({t:new Date().toISOString(),op,col,title:itemTitle(col,item)});if(DB.audit.length>1000)DB.audit.splice(0,DB.audit.length-1000)}
function itemTitle(c,x){if(!x)return'';return String(x.title||x.action||x.name||x.program||x.goal||x.teacher||x.student||x.parent||x.cls||x.staff||x.day||'').slice(0,80)}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3200)}
const hasSample=()=>COLS.some(c=>DB[c].some(x=>x.sample));

/* One-time merge of new built-in templates into existing data: adds only missing titles, never edits or re-adds deleted ones */

function mergeTemplates(){const done=new Set(DB.tplMerged||[]);let n=0;const norm=t=>String(t).replace(/\s+/g,' ').trim();
 TPL_V2.forEach(t=>{const key=t.period+'|'+t.title;if(done.has(key))return;if(!DB.templates.some(x=>norm(x.title)===norm(t.title))){DB.templates.push({id:uid(),...t});n++}done.add(key)});
 DB.tplMerged=[...done];if(n){audit('إضافة قوالب جديدة','templates',{title:n+' قالب'});save()}return n}
/* ---------- Derived ---------- */
const isOver=(c,x)=>{const k=S[c].date;return (c==='tasks'||c==='actions'||c==='oplan')&&x[k]&&x[k]<today()&&x.status!==DONE[c]};
const attRate=x=>{const e=+x.enrolled,a=+x.absent;return e>0?Math.round((e-a)/e*1000)/10:null};
function cellVal(c,k,x,hl){if(k==='rate'){const r=attRate(x);return r==null?'—':r+'%'}
 const f=S[c].f.find(y=>y.k===k)||{};let v=x[k];
 if(f.type==='date')return fmtDate(v,DB.settings.hijri);
 if(k==='status'){const cls=/مكتملة|منجز|مغلقة|منفذ|سارية/.test(v)?'green':/متعثر|ملغى/.test(v)?'red':/قيد/.test(v)?'blue':'amber';return `<span class="pill ${cls}">${esc(v||'—')}</span>`}
 if(k==='priority')return `<span class="pill ${v==='عالية'?'red':v==='منخفضة'?'green':'amber'}">${esc(v||'')}</span>`;
 if(k==='progress')return `<div class="bar" style="min-width:70px" title="${+v||0}%"><i style="width:${Math.min(100,+v||0)}%"></i></div><span class="small">${+v||0}%</span>`;
 v=esc(v??'');if(hl)v=v.replace(new RegExp(hl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<mark class="hl">${m}</mark>`);return v||'—'}

/* ---------- Form dialog with validation ---------- */
function openForm(c,item,onSaved){const sc=S[c],isNew=!item;item=item||{};
 const f=$('#dlgForm');
 f.innerHTML=`<div class="dlg-h"><span>${isNew?'إضافة':'تعديل'} ${sc.one}</span><button type="button" class="iconbtn" data-x aria-label="إغلاق">✕</button></div><div class="dlg-b">`+
 sc.f.map(x=>{let v=item[x.k];if(v==null&&isNew){v=x.def==='today'?today():x.def??''}if(v==null)v='';const id='f_'+x.k;const req=x.req?' <span class="req">*</span>':'';
  let inp;if(x.type==='select')inp=`<select id="${id}" name="${x.k}">${x.req&&!v?'<option value="">— اختر —</option>':''}${x.opts.map(o=>`<option ${fem(o)===fem(String(v))?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  else if(x.type==='textarea')inp=`<textarea id="${id}" name="${x.k}" maxlength="5000">${esc(v)}</textarea>`;
  else inp=`<input id="${id}" name="${x.k}" type="${x.type||'text'}" value="${esc(v)}" ${x.min!=null?`min="${x.min}"`:''} ${x.max!=null&&x.type==='number'?`max="${x.max}"`:''} maxlength="${x.max&&x.type!=='number'?x.max:300}" ${x.ph?`placeholder="${esc(x.ph)}"`:''} ${x.type==='number'?'inputmode="numeric" step="1"':''}>`;
  return `<div class="fld ${x.full?'full':''}"><label for="${id}">${esc(x.l)}${req}</label>${inp}<span class="err" id="e_${x.k}"></span></div>`}).join('')+
 `</div><div class="dlg-f"><button class="btn gold" value="ok" type="submit">حفظ (Ctrl+Enter)</button><button type="button" class="btn ghost" data-x>إلغاء</button>${!isNew?'<button type="button" class="btn red" data-del style="margin-inline-start:auto">حذف</button>':''}</div>`;
 f.innerHTML=fem(f.innerHTML);const dlg=$('#dlg');
 f.onsubmit=e=>{e.preventDefault();const data={};let ok=true;
  sc.f.forEach(x=>{const el=f.elements[x.k];let v=el.value.trim();const fe=$('#e_'+x.k);let err='';
   if(x.req&&v==='')err='هذا الحقل مطلوب';
   else if(x.type==='number'&&v!==''){const n=Number(v);if(!Number.isFinite(n)||!Number.isInteger(n))err='أدخل رقماً صحيحاً';else if(x.min!=null&&n<x.min)err='الحد الأدنى '+x.min;else if(x.max!=null&&n>x.max)err='الحد الأعلى '+x.max;else v=n}
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
 const del=$('[data-del]',f);if(del)del.onclick=()=>{if(!confirm('حذف هذا السجل نهائياً؟'))return;DB[c]=DB[c].filter(x=>x.id!==item.id);delFilesOf(c,item.id);audit('حذف',c,item);save();dlg.close();toast('تم الحذف');render()};
 dlg.showModal();setTimeout(()=>{const first=f.querySelector('.dlg-b input,.dlg-b select,.dlg-b textarea');first&&first.focus()},30)}

function nextDue(d,r){const x=parseD(d||today());if(r==='يومي')x.setDate(x.getDate()+1);else if(r==='أسبوعي')x.setDate(x.getDate()+7);else if(r==='شهري')x.setMonth(x.getMonth()+1);else if(r==='فصلي')x.setMonth(x.getMonth()+3);return iso(x)}
function maybeRecur(t,prev){if(t.status==='مكتملة'&&prev!=='مكتملة'&&t.recur&&t.recur!=='لا يتكرر'&&!t.recurred){t.recurred=1;t.doneAt=today();
 let nd=nextDue(t.due,t.recur);while(nd<today())nd=nextDue(nd,t.recur);
 const n={...t,id:uid(),due:nd,status:'جديدة',created:new Date().toISOString()};delete n.recurred;delete n.doneAt;delete n.sample;DB.tasks.push(n);audit('تكرار تلقائي','tasks',n);toast('أُنشئت المهمة التالية بتاريخ '+nd)}
 if(t.status==='مكتملة'&&!t.doneAt)t.doneAt=today()}

/* ---------- Views ---------- */
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
function table(c,rows,cols,hl){return `<div class="tbl-wrap"><table class="resp"><thead><tr>${cols.map(k=>`<th>${esc(lbl(c,k))}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map(x=>`<tr class="${isOver(c,x)?'over':''}">${cols.map(k=>`<td data-l="${esc(lbl(c,k))}">${cellVal(c,k,x,hl)}${k===cols[0]&&x.sample?' <span class="pill sample">تجريبي</span>':''}${k===S[c].date&&isOver(c,x)?' <span class="pill red">متأخرة</span>':''}</td>`).join('')}<td data-l="">${c==='tasks'&&x.status!=='مكتملة'?`<button class="btn sm gold" data-act="done" data-c="${c}" data-id="${x.id}" title="تعليم كمكتملة">✓</button> `:''}${evBtn(c,x.id)} <button class="btn sm ghost" data-act="edit" data-c="${c}" data-id="${x.id}">تعديل</button></td></tr>`).join('')}</tbody></table></div>`}

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
  ['اللجان المنتهية/المنجزة',ratio(DB.committees,x=>x.status==='منتهية'),DB.committees.length+' لجنة','#committees'],
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
 ${K('غياب اليوم',st.todAbs==null?'—':st.todAbs,st.todRate==null?'لم يُسجَّل حضور اليوم':'نسبة الحضور '+st.todRate+'%')}
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
 ${K('الشواهد المرفوعة',st.ev,'<a href="#evidence">معرض الشواهد</a>')}
 </div>
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
 <div class="card">${a.length?`<div class="tbl-wrap"><table class="resp"><thead><tr><th>الوقت</th><th>العملية</th><th>القسم</th><th>العنصر</th></tr></thead><tbody>${a.slice(0,300).map(x=>`<tr><td data-l="الوقت">${esc(new Date(x.t).toLocaleString('ar-SA-u-nu-latn'))}</td><td data-l="العملية">${esc(x.op)}</td><td data-l="القسم">${esc(S[x.col]?.t||x.col||'')}</td><td data-l="العنصر">${esc(x.title)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">لا توجد تغييرات بعد</div>'}</div>`}

function reportsView(){const opt=['summary|الملخص العام','weekly|التقرير الأسبوعي',...COLS.map(c=>c+'|'+S[c].t),'review|المراجعة الذاتية'];
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
 <label class="row"><input type="checkbox" id="s_hj" ${s.hijri?'checked':''}> عرض التاريخ الهجري (أم القرى) بجانب الميلادي</label>
 <div class="btns" style="margin:8px 0"><button class="btn ghost" data-act="notif">تفعيل إشعارات المتصفح</button><button class="btn ghost" data-act="chime">تجربة الصوت</button></div>
 <p class="small muted">حالة الإشعارات: <b id="nstate">${'Notification' in window?({granted:'مفعّلة',denied:'مرفوضة (فعّلها من إعدادات المتصفح)',default:'غير مفعّلة'})[Notification.permission]:'غير مدعومة في هذا المتصفح'}</b>.<br>تنبيه: تعمل التذكيرات والإشعارات فقط أثناء فتح التطبيق/التبويب أو تشغيل التطبيق المثبّت؛ لا يوجد خادم لإرسال إشعارات والتطبيق مغلق.</p></div></div>
 <div class="grid two"><div class="card"><h3>النسخ الاحتياطي</h3><p class="small muted">البيانات محفوظة في هذا المتصفح على هذا الجهاز فقط (الحجم الحالي ≈ ${used} ك.ب). مسح بيانات المتصفح يحذفها — صدّر نسخة احتياطية بانتظام وانقلها بين الأجهزة بالاستيراد.</p>
 <div class="btns"><button class="btn gold" data-act="export">تصدير نسخة احتياطية JSON</button><button class="btn ghost" data-act="import">استيراد نسخة احتياطية</button></div></div>
 <div class="card"><h3>البيانات التجريبية والتهيئة</h3><p class="small muted">البيانات التجريبية معلَّمة بشارة «تجريبي» وتظهر لافتة تنبيه أثناء وجودها، ويمكن حذفها بضغطة.</p>
 <div class="btns"><button class="btn ghost" data-act="sample">تحميل بيانات تجريبية</button><button class="btn ghost" data-act="clearSample">حذف البيانات التجريبية</button><button class="btn red" data-act="wipe">مسح كل البيانات</button></div></div></div>
 <div class="card small muted"><b style="color:var(--text)">${CREDIT}</b><br>الإصدار ${APP_VERSION} — يعمل دون اتصال بعد أول تحميل، ويمكن تثبيته من قائمة المتصفح «تثبيت التطبيق / إضافة إلى الشاشة الرئيسية». <button class="btn sm ghost" data-act="install" id="instBtn" hidden>تثبيت التطبيق</button></div>`}

function searchView(q){const ql=q.toLowerCase();let out='',n=0;
 COLS.forEach(c=>{const r=DB[c].filter(x=>Object.entries(x).some(([k,v])=>k!=='id'&&typeof v!=='object'&&String(v).toLowerCase().includes(ql)));if(r.length){n+=r.length;out+=`<div class="card"><h3>${S[c].t} (${r.length})</h3>${table(c,r.slice(0,50),S[c].cols,q)}</div>`}});
 const tp=DB.templates.filter(t=>t.title.toLowerCase().includes(ql));if(tp.length){n+=tp.length;out+=`<div class="card"><h3>قوالب المهام (${tp.length})</h3>${tp.map(t=>`<div class="row">${esc(t.title)} <span class="pill">${t.period}</span></div>`).join('')}</div>`}
 return `<div class="head"><h2>نتائج البحث عن «${esc(q)}» (${n})</h2></div>${out||'<div class="card empty">لا توجد نتائج</div>'}`}

/* ---------- Render ---------- */
let searchQ='';
function render(){const v=view(),m=$('#main');
 $$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===v));
 if(searchQ)m.innerHTML=searchView(searchQ);
 else if(v==='dashboard')m.innerHTML=dashboard();else if(S[v]&&v!=='oplan')m.innerHTML=listView(v);else if(v==='templates')m.innerHTML=templatesView();
 else if(v==='review')m.innerHTML=reviewView();else if(v==='reports')m.innerHTML=reportsView();else if(v==='audit')m.innerHTML=auditView();else if(v==='oplan')m.innerHTML=oplanView();else if(v==='settings')m.innerHTML=settingsView();else if(v==='evidence')m.innerHTML=evidenceView();else m.innerHTML=dashboard();
 if(!searchQ&&SEC_VIEWS.includes(v)&&v!=='oplan'){const hd=m.querySelector('.head');const w=document.createElement('div');w.innerHTML=secCard(v);hd?hd.after(w.firstElementChild):m.prepend(w.firstElementChild)}
 m.innerHTML=fem(m.innerHTML);chrome()}
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
function plainVal(c,k,x){if(k==='rate'){const r=attRate(x);return r==null?'':r+'%'}const f=S[c].f.find(y=>y.k===k)||{};return f.type==='date'?fmtPlain(x[k]):(x[k]??'')}
function download(name,content,type){const b=content instanceof Blob?content:new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
const csvCell=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
function csv(c,rows){const keys=[...S[c].f.map(f=>f.k),...(c==='attendance'?['rate']:[])];
 const out=[keys.map(k=>lbl(c,k)).concat(['بيانات تجريبية'])].concat(rows.map(x=>keys.map(k=>plainVal(c,k,x)).concat([x.sample?'نعم':''])));
 download(`${S[c].t}-${today()}.csv`,'\ufeff'+out.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8')}
const xe=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');
function xls(cols){let x='<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="h"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0F2747" ss:Pattern="Solid"/></Style></Styles>';
 cols.forEach(c=>{const keys=[...S[c].f.map(f=>f.k),...(c==='attendance'?['rate']:[])];
  x+=`<Worksheet ss:Name="${xe(S[c].t.slice(0,31))}" ss:RightToLeft="1"><Table><Row>${keys.map(k=>`<Cell ss:StyleID="h"><Data ss:Type="String">${xe(lbl(c,k))}</Data></Cell>`).join('')}</Row>`+
  DB[c].map(r=>'<Row>'+keys.map(k=>{const v=plainVal(c,k,r);const num=typeof r[k]==='number';return `<Cell><Data ss:Type="${num?'Number':'String'}">${xe(v)}</Data></Cell>`}).join('')+'</Row>').join('')+'</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><DisplayRightToLeft/></WorksheetOptions></Worksheet>'});
 download(`لوحة-قيادة-المدرسة-${today()}.xls`,x+'</Workbook>','application/vnd.ms-excel')}

/* ---------- Print ---------- */
function printHead(title,sub){const s=DB.settings;return `<div class="ph">${s.logo?`<img src="${s.logo}" alt="">`:''}<div><div style="font-size:11pt">المملكة العربية السعودية — وزارة التعليم${s.region?' — '+esc(s.region):''}</div><div style="font-weight:800;font-size:14pt">${esc(s.school||'')}</div>${supInfo()?`<div style="font-size:10pt">${esc(supInfo())}</div>`:''}<div style="font-size:10pt">${schoolMeta()?esc(schoolMeta())+' — ':''}${s.year?'العام الدراسي '+esc(s.year)+' — ':''}تاريخ الطباعة: ${fmtPlain(today())}</div></div></div><h2>${esc(title)}</h2>${sub?`<p>${sub}</p>`:''}${hasSample()?'<p style="color:#b45309"><b>تنبيه: يتضمن التقرير بيانات تجريبية للتوضيح فقط.</b></p>':''}`}
function ptable(c,rows){const keys=S[c].cols;const ev=rows.some(x=>filesOf(c,x.id).length);return rows.length?`<table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><thead><tr>${keys.map(k=>`<th>${esc(lbl(c,k))}</th>`).join('')}${ev?'<th>الشواهد</th>':''}</tr></thead><tbody>${rows.map(x=>`<tr>${keys.map(k=>`<td>${esc(plainVal(c,k,x))}${k===keys[0]&&x.sample?' (تجريبي)':''}</td>`).join('')}${ev?`<td>${evPrint(c,x.id)}</td>`:''}</tr>`).join('')}</tbody></table>`:'<p>لا توجد سجلات.</p>'}
const sig=()=>`<div class="sig"><div>${leaderLbl()}: ${esc(DB.settings.principal||'....................')}</div><div>التوقيع: ....................</div><div>الختم</div></div><div style="text-align:center;font-size:9pt;color:#555;margin-top:24px;border-top:1px solid #ccc;padding-top:6px">${CREDIT}</div>`;
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
  h+=`<section><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>نسبة الحضور (30 يوماً)</th><td>${st.attRate??'—'}${st.attRate!=null?'%':''}</td><th>إنجاز المهام</th><td>${st.taskPct??'—'}${st.taskPct!=null?'%':''}</td></tr><tr><th>المهام المتأخرة</th><td>${st.over}</td><th>حالات مفتوحة</th><td>${st.incOpen}</td></tr><tr><th>زيارات هذا الشهر</th><td>${st.visM}</td><th>المراجعة الذاتية</th><td>${st.review??'—'}${st.review!=null?'%':''}</td></tr><tr><th>برامج التوجيه (90 يوماً)</th><td>${st.gProg.length} (${st.gProg.reduce((a,x)=>a+(+x.beneficiaries||0),0)} مستفيد)</td><th>الحالات الفردية المفتوحة</th><td>${st.gOpen}</td></tr><tr><th>تنفيذ خطة التوجيه</th><td>${st.gPlan??'—'}${st.gPlan!=null?'%':''}</td><th>الشواهد المرفوعة</th><td>${st.ev}</td></tr><tr><th>إنجاز الخطة التشغيلية</th><td>${st.opPct??'—'}${st.opPct!=null?'%':''}</td><th>بنود الخطة المتأخرة</th><td>${st.opOver}</td></tr><tr><th>ساعات النمو المهني</th><td>${st.pdHours} ساعة (${st.pdCount} برنامج، ${st.pdBen} مستفيد)</td><th>تنفيذ خطة النمو المهني</th><td>${st.pdPlan??'—'}${st.pdPlan!=null?'%':''}</td></tr></table></section>`;
  h+=`<section><h3>حسب المجال</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>المجال</th><th>المهام</th><th>المنجز</th><th>إجراءات التحسين</th><th>المراجعة الذاتية</th><th>الخطة التشغيلية</th></tr>${DOMAINS.map(d=>{const a=DB.tasks.filter(x=>x.domain===d),op=DB.oplan.filter(x=>x.domain===d),opp=op.length?Math.round(op.reduce((s,x)=>s+(x.status==='منجز'?100:+x.progress||0),0)/op.length)+'% ('+op.length+')':'—';return `<tr><td>${d}</td><td>${a.length}</td><td>${a.filter(x=>x.status==='مكتملة').length}</td><td>${DB.actions.filter(x=>x.domain===d).length}</td><td>${reviewPct(d)??'—'}${reviewPct(d)!=null?'%':''}</td><td>${opp}</td></tr>`}).join('')}</table></section>`}
 else if(type==='review'){h=printHead('المراجعة الذاتية','متوسط عام: '+(reviewPct()??'—')+(reviewPct()!=null?'%':''));
  DOMAINS.forEach(d=>{h+=`<section><h3>${d} — ${reviewPct(d)??'—'}${reviewPct(d)!=null?'%':''}</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>المؤشر</th><th>التقدير</th><th>الشواهد</th></tr>${REVIEW[d].map((q,i)=>{const v=(DB.review[d]||{})[i]||{};return `<tr><td>${esc(q)}</td><td>${({2:'متحقق',1:'متحقق جزئياً',0:'غير متحقق'})[v.s]||'—'}</td><td>${esc(v.n||'')}${evPrint('review',d+'|'+i)}</td></tr>`}).join('')}</table></section>`})}
 else if(type==='oplan'){const pf=planFiles()[0];h=printHead(S.oplan.t,(pf?'ملف الخطة المعتمد: '+esc(pf.name)+(pf.meta&&pf.meta.year?' — العام '+esc(pf.meta.year):'')+' — ':'')+'نسبة الإنجاز العامة: '+(stats().opPct??'—')+'%');DOMAINS.forEach(d=>{const r=rowsFor('oplan',from,to).filter(x=>x.domain===d);h+=`<section><h3>${d} (${r.length})</h3>${ptable('oplan',r)}</section>`})}
 else if(type==='tasks'){const r=rowsFor('tasks',from,to);h=printHead(S.tasks.t,(range?range+' — ':'')+'الإنجاز: '+r.filter(x=>x.status==='مكتملة').length+' من '+r.length);PERIODS.forEach(p=>{const a=r.filter(x=>x.period===p).sort((x,y)=>(DOMAINS.indexOf(x.domain)-DOMAINS.indexOf(y.domain))||String(x.due).localeCompare(String(y.due)));if(a.length)h+=`<section><h3>${PICON[p]} المهام — ${p} (${a.filter(x=>x.status==='مكتملة').length}/${a.length})</h3>${ptable('tasks',a)}</section>`})}
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
async function exportJSON(){const data={...DB};const body=JSON.stringify(data);const files=await filesForExport();const wrap={format:'school-leader-dashboard-backup',version:APP_VERSION,exported:new Date().toISOString(),sha256:await sha(body),data,files,filesSha256:await sha(JSON.stringify(files))};
 download(`نسخة-احتياطية-لوحة-القيادة-${today()}.json`,JSON.stringify(wrap),'application/json');DB.settings.lastBackup=today();save()}
async function importJSON(file){try{if(file.size>20e6)throw new Error('الملف كبير جداً');const txt=await file.text();let w;try{w=JSON.parse(txt)}catch(e){throw new Error('الملف ليس JSON صالحاً')}
 let data=w;if(w&&w.format==='school-leader-dashboard-backup'){data=w.data;if(w.sha256&&crypto.subtle){const h=await sha(JSON.stringify(data));const hf=w.files&&w.filesSha256?await sha(JSON.stringify(w.files)):w.filesSha256;if((h!==w.sha256||hf!==w.filesSha256)&&!confirm('تحذير: بصمة الملف لا تطابق محتواه (ربما عُدّل أو تلف). المتابعة؟'))return}}
 if(!data||data.app!=='school-leader-dashboard')throw new Error('الملف ليس نسخة احتياطية من هذا التطبيق');
 const n=normalize(data);const cnt=COLS.reduce((s,c)=>s+n[c].length,0);const wf=Array.isArray(w&&w.files)?w.files:null;
 if(!confirm(`سيتم استبدال البيانات الحالية بالنسخة المستوردة (${cnt} سجل${wf?' و'+wf.length+' ملف شواهد':''}). يُنصح بتصدير نسخة من بياناتك الحالية أولاً. متابعة؟`))return;
 DB=n;mergeTemplates();let nf=0;if(wf)nf=await restoreFiles(wf);audit('استيراد نسخة احتياطية','settings',{title:cnt+' سجل، '+nf+' ملف'});save();render();toast('تم الاستيراد بنجاح'+(wf?' ('+nf+' ملف)':''))}catch(e){alert('تعذّر الاستيراد: '+e.message)}}
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
async function loadFiles(){try{await idbOpen();FILES=await idbReq(tx('readonly').getAll())}catch(e){console.warn(e);FILES=[]}}
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
function evTitle(c,rid){if(c.startsWith('sec:'))return 'ملفات القسم: '+viewTitle(c.slice(4));if(c==='opfile')return 'ملف الخطة التشغيلية';if(c==='review'){const[d,i]=rid.split('|');return d+': '+(REVIEW[d]||[])[i]}const x=(DB[c]||[]).find(y=>y.id===rid);return itemTitle(c,x)||'(سجل محذوف)'}
const secName=c=>c.startsWith('sec:')?viewTitle(c.slice(4))+' — ملفات القسم':c==='opfile'?'ملف الخطة التشغيلية':c==='review'?'المراجعة الذاتية':(S[c]?.t||c);
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
 for(const f of arr||[]){if(!f||typeof f.data!=='string'||!f.data.startsWith('data:'))continue;try{const blob=await (await fetch(f.data)).blob();const rec={id:String(f.id||uid()),col:String(f.col),rid:String(f.rid),meta:f.meta&&typeof f.meta==='object'?{year:String(f.meta.year||'').slice(0,40),note:String(f.meta.note||'').slice(0,200),group:f.meta.group?String(f.meta.group).slice(0,40):undefined}:undefined,name:String(f.name||'ملف').slice(0,150),type:String(f.type||blob.type),size:blob.size,added:f.added||new Date().toISOString(),blob};await idbReq(tx('readwrite').put(rec));FILES.push(rec);n++}catch(e){console.warn('file',e)}}return n}

/* ---------- Operational plan ---------- */
const planFiles=()=>FILES.filter(f=>f.col==='opfile').sort((a,b)=>b.added.localeCompare(a.added));
function oplanView(){return secCard('oplan')+`<div class="card"><div class="row" style="flex-wrap:wrap"><b class="grow">استيراد بنود الخطة</b><button class="btn ghost" data-act="optpl">نموذج استيراد CSV</button><button class="btn ghost" data-act="opimp">استيراد بنود من Excel/CSV</button></div></div>`+listView('oplan')}
/* ---------- Section-level files (all sections) ---------- */
const SEC_VIEWS=[...Object.keys(S),'templates','review','reports'];
const secCol=v=>v==='oplan'?'opfile':'sec:'+v;
const viewTitle=v=>S[v]?.t||({templates:'قوالب المهام',review:'المراجعة الذاتية',reports:'التقارير والتصدير'})[v]||v;
const grpOf=f=>(f.meta&&f.meta.group)||(f.col==='opfile'?'plan':f.id);
function secGroups(col){const g={};FILES.filter(f=>f.col===col).forEach(f=>{(g[grpOf(f)]=g[grpOf(f)]||[]).push(f)});return Object.values(g).map(a=>a.sort((x,y)=>y.added.localeCompare(x.added))).sort((a,b)=>b[0].added.localeCompare(a[0].added))}
function secCard(v){const col=secCol(v),gs=secGroups(col),open=!!gs.length||v==='oplan'||v==='pd';
 return `<details class="card seccard" ${open?'open':''}><summary class="row" style="flex-wrap:wrap;cursor:pointer"><b class="grow">📁 ${v==='oplan'?'ملف الخطة التشغيلية المعتمد':'ملفات القسم: '+esc(viewTitle(v))} <span class="pill">${gs.length}</span></b>
 <button type="button" class="btn gold sm" data-act="secup" data-c="${v}">⬆️ رفع ملف</button></summary>
 <div class="ev-drop sec-drop" data-act="secup" data-c="${v}" tabindex="0" style="margin:10px 0;padding:10px">اسحب الملفات هنا أو اضغط للاختيار — PDF، Word، Excel، PowerPoint، صور (حتى 15 م.ب). تُحفظ على هذا الجهاز وتعمل دون اتصال وتُضمَّن في النسخة الاحتياطية.</div>
 ${gs.length?`<div class="tbl-wrap"><table class="resp"><thead><tr><th>الملف</th><th>العام الدراسي</th><th>ملاحظة</th><th>تاريخ الرفع</th><th>الإصدارات</th><th></th></tr></thead><tbody>${gs.map(a=>{const f=a[0];return `<tr><td data-l="الملف">${isImg(f)?`<img src="${furl(f)}" alt="" style="width:36px;height:36px;object-fit:cover;border-radius:6px;vertical-align:middle">`:ficon(f)} ${esc(f.name)} <span class="small muted">${fsize(f.size)}</span></td><td data-l="العام">${esc(f.meta?.year||'—')}</td><td data-l="ملاحظة">${esc(f.meta?.note||'')}</td><td data-l="تاريخ الرفع">${fmtDate(f.added.slice(0,10),false)}</td><td data-l="الإصدارات">${a.length>1?`<details><summary>${a.length} إصدارات</summary>${a.slice(1).map((o,k)=>`<div class="small">${a.length-1-k}. ${esc(o.name)} — ${esc(new Date(o.added).toLocaleDateString('ar-SA-u-nu-latn'))} ${esc(o.meta?.year||'')} <a href="#" data-act="evopen" data-id="${o.id}">عرض</a> · <a href="#" data-act="evdl" data-id="${o.id}">تنزيل</a> · <a href="#" data-act="secdel" data-id="${o.id}">حذف</a></div>`).join('')}</details>`:'1'}</td>
 <td data-l=""><button class="btn sm ghost" data-act="evopen" data-id="${f.id}">عرض</button> <button class="btn sm ghost" data-act="evdl" data-id="${f.id}">تنزيل</button> <button class="btn sm ghost" data-act="secrep" data-c="${v}" data-id="${grpOf(f)}">استبدال</button> <button class="btn sm ghost" data-act="secdel" data-id="${f.id}" aria-label="حذف الإصدار الحالي">🗑</button></td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty" style="padding:10px">لا توجد ملفات لهذا القسم بعد</div>'}</details>`}
let secCtx=null;
async function secUpload(v,group,files){const col=secCol(v);files=[...files];if(!files.length)return;
 const year=prompt('العام الدراسي لهذا الملف:',DB.settings.year||'');if(year===null)return;const note=prompt('ملاحظة (اختياري):','')||'';
 for(const f of files){await addFiles(col,'section',[f],{year:year.trim().slice(0,40),note:note.trim().slice(0,200),group:group||uid()})}render()}
function secPrint(v){const gs=secGroups(secCol(v));if(!gs.length)return'';return `<section><h3>ملفات القسم</h3><table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse"><tr><th>الملف</th><th>العام الدراسي</th><th>ملاحظة</th><th>تاريخ الرفع</th><th>الإصدارات</th></tr>${gs.map(a=>{const f=a[0];return `<tr><td>${isImg(f)?`<img src="${furl(f)}" style="width:60px;height:60px;object-fit:cover" alt=""> `:ficon(f)+' '}${esc(f.name)}</td><td>${esc(f.meta?.year||'')}</td><td>${esc(f.meta?.note||'')}</td><td>${fmtPlain(f.added.slice(0,10))}</td><td>${a.length}</td></tr>`}).join('')}</table></section>`}
function navCounts(){const n={};SEC_VIEWS.forEach(v=>n[v]=0);FILES.forEach(f=>{let v=f.col==='opfile'?'oplan':f.col.startsWith('sec:')?f.col.slice(4):f.col;if(n[v]!=null)n[v]++});return n}
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
  add:()=>openForm(c),edit:()=>openForm(c,DB[c].find(x=>x.id===id)),
  done:()=>{const x=DB.tasks.find(t=>t.id===id);if(!x)return;const p=x.status;x.status='مكتملة';delete x.sample;maybeRecur(x,p);audit('إنجاز','tasks',x);save();render();if(!$('#bellPanel').hidden||b.closest('#bellPanel'))bell();toast('أُنجزت المهمة ✓')},
  csv:()=>csv(c,DB[c]),xls:()=>xls([c]),xlsall:()=>xls(COLS),print:()=>doPrint(c),weekly:()=>doPrint('weekly'),
  rprint:()=>doPrint($('#rpType').value,$('#rpFrom').value,$('#rpTo').value),
  rcsv:()=>{const t=$('#rpType').value;if(S[t])csv(t,rowsFor(t,$('#rpFrom').value,$('#rpTo').value));else toast('اختر سجلاً محدداً لتصدير CSV، أو استخدم Excel لكل السجلات')},
  auditcsv:()=>download('سجل-التغييرات.csv','\ufeff'+[['الوقت','العملية','القسم','العنصر']].concat(DB.audit.map(x=>[x.t,x.op,S[x.col]?.t||x.col,x.title])).map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv'),
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
  install:async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;chrome()}};
 acts[a]&&acts[a]()});
document.addEventListener('input',e=>{const el=e.target;
 if(el.dataset.f){const c=view();flt[c][el.dataset.f]=el.value;clearTimeout(el._t);el._t=setTimeout(()=>{const pos=el.selectionStart;render();const n=$(`[data-f="${el.dataset.f}"]`);if(n){n.focus();if(n.type==='search'&&pos!=null)n.setSelectionRange(pos,pos)}},el.type==='search'?250:0)}
 if(el.dataset.evf){flt.evidence[el.dataset.evf]=el.value;clearTimeout(el._t);el._t=setTimeout(()=>{render();const n=$(`[data-evf="${el.dataset.evf}"]`);n&&n.focus()},el.type==='search'?250:0)}
 if(el.dataset.tt){const t=DB.templates.find(x=>x.id===el.dataset.tt);if(t&&el.value.trim()){t.title=el.value.slice(0,200);save()}}
 if(el.dataset.rvn){const[d,i]=el.dataset.rvn.split('|');DB.review[d]=DB.review[d]||{};DB.review[d][i]={...(DB.review[d][i]||{}),n:el.value};DB.review._date=today();save()}});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset.allp)$$(`[data-p="${el.dataset.allp}"]`).forEach(x=>x.checked=el.checked);
 if(el.id==='s_rt'){DB.settings.remindTime=el.value||'07:30';save()}if(el.id==='s_mute'){DB.settings.mute=el.checked;save()}if(el.id==='s_hj'){DB.settings.hijri=el.checked;save();chrome()}});
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
let deferredInstall=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;chrome()});

/* ---------- Service worker + update banner ---------- */
if('serviceWorker' in navigator&&location.protocol!=='file:'){
 navigator.serviceWorker.register('sw.js').then(reg=>{
  const show=()=>{$('#updateBar').hidden=false};
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
load();mergeTemplates();if(!DB.settings.setupDone&&DB.settings.school)DB.settings.setupDone=true;setTheme(DB.settings.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));net();render();
if(!DB.settings.setupDone)setupWizard();
setTimeout(checkReminders,1500);setInterval(checkReminders,30000);
