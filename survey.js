/* Respondent page: survey is encoded in the URL hash (never sent to any server). The answer is returned as a code the respondent sends back (WhatsApp/copy). */
(function(){'use strict';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b64e=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const b64d=t=>{t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const s=atob(t),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
async function unpack(t){const p=t.slice(0,2);let u=b64d(t.slice(2));if(p==='z.'){if(!window.DecompressionStream)throw new Error('old');u=new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}else if(p!=='j.')throw new Error('bad');return JSON.parse(new TextDecoder().decode(u))}
const LIK=['','غير موافق بشدة','غير موافق','محايد','موافق','موافق بشدة'];
const fail=m=>{$('#m').innerHTML=`<div class="card"><b>تعذّر فتح الاستبانة</b><p class="muted">${m}</p></div>`};
const h=location.hash.slice(1);if(!h){fail('الرابط غير مكتمل. اطلب الرابط الصحيح من المدرسة.');return}
unpack(h).then(S=>{
 document.title=S.t+' — استبانة';$('#ttl').textContent=S.t;$('#sub').textContent=[S.s,S.gr?'الفئة: '+S.gr:''].filter(Boolean).join(' — ');if(S.g)document.body.classList.add('girls');
 const today=new Date().toISOString().slice(0,10);
 if(S.e&&S.e<today){$('#m').innerHTML='<div class="card"><b>انتهت مدة هذه الاستبانة.</b><p class="muted">شكراً لاهتمامك.</p></div>';return}
 const done=localStorage.getItem('sld_ans_'+S.i);
 const q=S.q.map((x,i)=>{const [id,type,t,o]=x,n='q_'+id;let body='';
  if(type==='likert')body=`<div class="opts lik">${[5,4,3,2,1].map(k=>`<label><input type="radio" name="${n}" value="${k}"> ${LIK[k]}</label>`).join('')}</div>`;
  else if(type==='yn')body=`<div class="opts lik">${['نعم','لا'].map(k=>`<label><input type="radio" name="${n}" value="${k}"> ${k}</label>`).join('')}</div>`;
  else if(type==='mc')body=`<div class="opts">${(o||[]).map(k=>`<label><input type="radio" name="${n}" value="${esc(k)}"> ${esc(k)}</label>`).join('')}</div>`;
  else body=`<textarea name="${n}" maxlength="400" placeholder="اكتب إجابتك (اختياري)"></textarea>`;
  return `<div class="card q" data-id="${esc(id)}" data-type="${type}"><b>${i+1}. ${esc(t)}${type!=='text'?' <span class="req">*</span>':''}</b>${body}<div class="err"></div></div>`}).join('');
 $('#m').innerHTML=`${S.n?`<div class="card">${esc(S.n).replace(/\n/g,'<br>')}</div>`:''}${done?'<div class="card err">سبق أن أرسلتَ رداً من هذا الجهاز. يمكنك الإرسال مرة أخرى فقط إذا لم يصل ردك السابق.</div>':''}
  <form id="f" novalidate>${q}<button class="btn" type="submit" style="width:100%">إنهاء وإنشاء الرد</button></form>
  <p class="muted" style="text-align:center">لا تُرسل إجاباتك إلى أي خادم؛ ستظهر لك رسالة قصيرة ترسلها بنفسك إلى المدرسة. لا يُطلب ذكر الاسم.</p>`;
 $('#f').onsubmit=e=>{e.preventDefault();const a={};let ok=true,first=null;
  document.querySelectorAll('.q').forEach(c=>{const id=c.dataset.id,t=c.dataset.type,n='q_'+id;let v;
   if(t==='text'){v=c.querySelector('textarea').value.trim();if(v)a[id]=v.slice(0,400);return}
   const r=c.querySelector(`input[name="${n}"]:checked`);c.querySelector('.err').textContent=r?'':'يرجى اختيار إجابة';if(!r){ok=false;first=first||c;return}
   a[id]=t==='likert'?+r.value:r.value});
  if(!ok){first.scrollIntoView({behavior:'smooth',block:'center'});return}
  const rid=(crypto.getRandomValues?Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>b.toString(36)).join(''):Math.random().toString(36).slice(2)).slice(0,10);
  const code='SLDj.j.'+b64e(new TextEncoder().encode(JSON.stringify({i:S.i,r:rid,at:today,a})));
  const msg=`رد على استبانة «${S.t}»\n${code}`;localStorage.setItem('sld_ans_'+S.i,'1');
  $('#m').innerHTML=`<div class="card"><b>✅ شكراً لك، اكتملت إجاباتك.</b><p>الخطوة الأخيرة: أرسل الرد إلى المدرسة.</p>
   <div class="row"><a class="btn g" id="wa" target="_blank" rel="noopener" href="https://wa.me/${S.ph||''}?text=${encodeURIComponent(msg)}">إرسال الرد عبر واتساب</a><button class="btn o" id="cp">نسخ الرد</button></div>
   <p class="muted">إن لم يعمل واتساب: انسخ الرد وأرسله بأي وسيلة تعتمدها المدرسة.</p><div class="code" id="cd">${esc(code)}</div></div>`;
  $('#cp').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(msg):Promise.reject()).then(()=>{$('#cp').textContent='تم النسخ ✓'},()=>{const r=document.createRange();r.selectNode($('#cd'));getSelection().removeAllRanges();getSelection().addRange(r)})};scrollTo(0,0)}
}).catch(e=>fail(e&&e.message==='old'?'متصفحك قديم ولا يدعم فتح هذا الرابط. حدّث المتصفح أو افتح الرابط من متصفح آخر (Chrome / Safari حديث).':'الرابط تالف أو غير مكتمل. تأكد من نسخه كاملاً.'));
})();
