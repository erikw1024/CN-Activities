(() => {
  'use strict';
  const items = Array.isArray(window.ACTIVITY_DATA) ? window.ACTIVITY_DATA : [];
  const storageKey = 'good-days-crows-nest-v1';
  const categories = [
    { id:'all', name:'Everything', short:'Everything', label:'All activities', icon:'grid' },
    { id:'discussion', name:'Current affairs & discussion', short:'Discussion', icon:'chat' },
    { id:'spanish', name:'Spanish language & culture', short:'Spanish', icon:'language' },
    { id:'music', name:'Guitar, music & singing', short:'Music', icon:'music' },
    { id:'art', name:'Drawing & art', short:'Art', icon:'art' },
    { id:'social', name:'Other social activities', short:'Social', icon:'people' },
    { id:'volunteering', name:'Volunteering', short:'Volunteering', icon:'heart' }
  ];
  const state = { view:'explore', category:'all', query:'', area:'all', access:'all', sort:'recommended', choices:{}, notes:{} };
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');
    if(saved && typeof saved==='object') {
      state.choices = saved.choices && typeof saved.choices==='object' ? saved.choices : {};
      state.notes = saved.notes && typeof saved.notes==='object' ? saved.notes : {};
    }
  } catch (_) { /* Private browsing may disable storage */ }
  const $=sel=>document.querySelector(sel);
  const $$=sel=>[...document.querySelectorAll(sel)];
  const clean=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const validUrl=value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:'#'}catch{return '#'}};
  const byId=id=>items.find(item=>item.id===id);
  const category=id=>categories.find(c=>c.id===id)||categories[0];
  const chosen=id=>state.choices[id]||'';
  const validChoice=choice=>['interested','maybe','not-for-me'].includes(choice);
  const icons = {
    grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    chat:'<path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 10h7M8 13h4"/>',
    language:'<path d="M3 6h13M9.5 3v3M14.5 6c-1 5.2-4.7 8.8-10 11M5.5 9c1.5 3.1 4.2 5.3 7.5 6.5"/><path d="m14 21 4-10 4 10m-6.8-3h5.6"/>',
    music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    art:'<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1.6-3.2c-.6-.8-.1-1.8.9-1.8h1.6A4 4 0 0 0 22 12a9 9 0 0 0-10-9Z"/><circle cx="7" cy="12" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="16" cy="8" r="1"/>',
    people:'<circle cx="9" cy="8" r="3"/><path d="M2.5 20v-2a6.5 6.5 0 0 1 13 0v2H2.5Z"/><circle cx="18" cy="9" r="2.5"/><path d="M17 14a5.5 5.5 0 0 1 4.5 5.5V20h-3"/>',
    heart:'<path d="M20.5 5a5.5 5.5 0 0 0-8.5 1 5.5 5.5 0 0 0-8.5-1c-2.5 2.6-1.2 6 1 8.1L12 20l7.5-6.9c2.2-2.1 3.5-5.5 1-8.1Z"/>',
    pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  const svg=type=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[type]||icons.grid}</svg>`;
  const textNotes=id=>String(state.notes[id]||'');
  function save(){
    try{localStorage.setItem(storageKey,JSON.stringify({choices:state.choices,notes:state.notes}))}catch(_){toast('Your browser is not allowing saved selections. Export your shortlist to keep a copy.')}
  }
  let toastTimer;
  function toast(message){const el=$('#toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3400)}
  function setChoice(id,choice){
    if(!byId(id))return;
    if(!validChoice(choice)) delete state.choices[id]; else state.choices[id]=choice;
    save();renderAll();syncDialogChoices();
  }
  function badgeFor(item){
    const badges=[];
    if(item.featured) badges.push('<span class="pill">Good starting point</span>');
    if(item.online)badges.push('<span class="pill remote">Online option</span>');
    if(item.dateSensitive)badges.push('<span class="pill urgent">Confirm dates</span>');
    return badges.slice(0,2).join('');
  }
  function card(item){
    const cat=category(item.category),choice=chosen(item.id);
    const saved=choice==='interested'||choice==='maybe';
    const copy=choice==='interested'?'Interested ✓':choice==='maybe'?'Maybe later ✓':'I’m interested';
    return `<article class="activity-card" aria-label="${clean(item.name)}">
      <div class="card-head"><span class="category-icon category-${clean(item.category)}">${svg(cat.icon)}</span><span class="card-badges">${badgeFor(item)}</span></div>
      <div class="card-body"><div class="card-category">${clean(cat.name)}</div><h3 class="card-title">${clean(item.name)}</h3><p class="card-desc">${clean(item.description)}</p>
        <div class="card-meta"><span class="meta-line">${svg('pin')}<span>${clean(item.location)}</span></span><span class="meta-line">${svg('clock')}<span>${clean(item.frequency)}</span></span></div>
        ${textNotes(item.id)?`<p class="card-note">${clean(textNotes(item.id))}</p>`:''}
      </div><div class="card-foot"><button type="button" class="save-button ${saved?'is-saved':''}" data-save="${clean(item.id)}" aria-label="${clean(copy)}: ${clean(item.name)}"><span class="save-heart">${saved?'♥':'♡'}</span> ${clean(copy)}</button><button type="button" class="card-detail" data-open="${clean(item.id)}" aria-label="View details for ${clean(item.name)}">Details →</button></div>
    </article>`;
  }
  function renderCategories(){
    $('#categoryList').innerHTML=categories.map(c=>{
      const count=c.id==='all'?items.length:items.filter(i=>i.category===c.id).length;
      return `<button type="button" class="category-chip ${c.id===state.category?'active':''}" data-category="${c.id}" aria-pressed="${c.id===state.category?'true':'false'}">${svg(c.icon)}<span class="chip-name">${clean(c.short)}</span><span class="chip-count">${count} options</span></button>`;
    }).join('');
  }
  function filteredItems(){
    const q=state.query.trim().toLocaleLowerCase('en-AU');
    const localAreas=['Crows Nest','Neutral Bay','North Sydney','Kirribilli'];
    const out=items.filter(i=>{
      if(state.category!=='all'&&i.category!==state.category)return false;
      if(q&&!([i.name,i.description,i.location,i.frequency,i.cost,i.access,i.nextStep,category(i.category).name].join(' ').toLocaleLowerCase('en-AU').includes(q)))return false;
      if(state.area==='near'&&!localAreas.includes(i.area))return false;
      if(state.area==='online'&&!i.online)return false;
      if(state.area==='elsewhere'&&(localAreas.includes(i.area)||i.area==='Online'||i.area==='At home'))return false;
      if(state.access!=='all'&&i.accessType!==state.access)return false;
      return true;
    });
    const priority={High:0,Medium:1,Explore:2};
    const cmp=state.sort==='az'?(a,b)=>a.name.localeCompare(b.name):state.sort==='area'?(a,b)=>a.area.localeCompare(b.area)||a.name.localeCompare(b.name):(a,b)=>Number(b.featured)-Number(a.featured)||(priority[a.priority]??3)-(priority[b.priority]??3)||a.name.localeCompare(b.name);
    return out.sort(cmp);
  }
  function renderExplore(){
    const list=filteredItems();
    $('#activityGrid').innerHTML=list.map(card).join('');
    $('#resultsCount').innerHTML=`Showing <strong>${list.length}</strong> of <strong>${items.length}</strong> activities`;
    $('#emptyResults').hidden=list.length>0;
    renderCategories();
    const featured=items.filter(i=>i.featured);
    $('#featuredGrid').innerHTML=featured.map(card).join('');
  }
  function renderShortlist(){
    const interested=items.filter(i=>chosen(i.id)==='interested');
    const maybe=items.filter(i=>chosen(i.id)==='maybe');
    const total=interested.length+maybe.length;
    $('#navCount').textContent=total;
    $('#navCount').hidden=total===0;
    $('#shortlistSummary').innerHTML=`<strong>${total}</strong> ${total===1?'activity':'activities'} on your shortlist`;
    $('#interestedCount').textContent=interested.length;
    $('#maybeCount').textContent=maybe.length;
    $('#interestedGrid').innerHTML=interested.map(card).join('');
    $('#maybeGrid').innerHTML=maybe.map(card).join('');
    $('#shortlistEmpty').hidden=total!==0;
    $$('.shortlist-group').forEach((el,i)=>el.hidden=(i===0?interested:maybe).length===0);
    $$('#copyShortlist,#downloadCsv,#printShortlist').forEach(btn=>btn.disabled=total===0);
  }
  function renderAll(){renderExplore();renderShortlist()}
  function switchView(view,updateHash=true){
    if(!['explore','shortlist','about'].includes(view))view='explore';
    state.view=view;
    ['explore','shortlist','about'].forEach(v=>{$(`#${v}View`).hidden=v!==view});
    $$('.nav-link').forEach(btn=>{
      const selected=btn.dataset.view===view;
      btn.classList.toggle('is-active',selected);
      if(selected)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');
    });
    if(updateHash && location.hash!==`#${view}`)history.pushState(null,'',`#${view}`);
    window.scrollTo({top:0,behavior:'instant'});
  }
  function openDialog(id){
    const i=byId(id);if(!i)return;
    const cat=category(i.category),choice=chosen(i.id);
    const locationMeaningful=!(i.area==='At home'||i.area==='Online');
    const mapHref='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(i.location+(i.location.includes('Sydney')?'':', Sydney NSW Australia'));
    const link=validUrl(i.url);
    $('#dialogContent').innerHTML=`<div class="dialog-header"><span class="category-icon category-${i.category}">${svg(cat.icon)}</span><div><span class="dialog-category-label">${clean(cat.name)}</span><h2 id="dialogTitle" class="dialog-title">${clean(i.name)}</h2></div></div>
      <p class="dialog-desc">${clean(i.description)}</p>
      <div class="detail-list"><div class="detail-row"><span class="detail-label">Where</span><span class="detail-value">${clean(i.location)}</span></div><div class="detail-row"><span class="detail-label">When</span><span class="detail-value">${clean(i.frequency)}</span></div><div class="detail-row"><span class="detail-label">Cost</span><span class="detail-value">${clean(i.cost)}</span></div><div class="detail-row"><span class="detail-label">Accessibility</span><span class="detail-value">${clean(i.access)}</span></div><div class="detail-row"><span class="detail-label">Next step</span><span class="detail-value">${clean(i.nextStep)}</span></div></div>
      ${i.dateSensitive?'<div class="dialog-alert">This listing includes a published 2026 schedule or indicative fee. Confirm upcoming dates and pricing directly with the organiser.</div>':''}
      <p class="dialog-choice-heading">Does this interest you?</p>
      <div class="choice-group" role="group" aria-label="Set interest for this activity">
        <button type="button" class="choice-option ${choice==='interested'?'selected':''}" data-dialog-choice="interested" data-choice-id="${i.id}" aria-pressed="${choice==='interested'}">♡ Interested</button>
        <button type="button" class="choice-option ${choice==='maybe'?'selected':''}" data-dialog-choice="maybe" data-choice-id="${i.id}" aria-pressed="${choice==='maybe'}">◷ Maybe later</button>
        <button type="button" class="choice-option ${choice==='not-for-me'?'selected':''}" data-dialog-choice="not-for-me" data-choice-id="${i.id}" aria-pressed="${choice==='not-for-me'}">× Not for me</button>
      </div>
      <label class="note-label" for="noteInput">Personal notes (saved on this device)</label><textarea id="noteInput" class="note-input" placeholder="Questions to ask, who to go with, which dates suit…" maxlength="2000">${clean(textNotes(i.id))}</textarea>
      <div class="dialog-actions"><a class="btn btn-primary" href="${clean(link)}" target="_blank" rel="noopener noreferrer">Visit organiser's website ↗</a>${locationMeaningful?`<a class="btn btn-outline" href="${clean(mapHref)}" target="_blank" rel="noopener noreferrer">Find on map ↗</a>`:''}<button class="btn btn-outline" type="button" data-clear-choice="${i.id}">Clear choice</button></div>
      <p class="dialog-smallprint">Details sourced from a November 2026 directory. Please verify times, places, fees and availability before travelling.</p>`;
    const dialog=$('#activityDialog');dialog.dataset.id=i.id;
    dialog.showModal();
  }
  function syncDialogChoices(){
    const dialog=$('#activityDialog');if(!dialog.open)return;
    const choice=chosen(dialog.dataset.id);
    $$('[data-dialog-choice]').forEach(el=>{const selected=el.dataset.dialogChoice===choice;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected))});
  }
  function shortlistRows(){return items.filter(i=>['interested','maybe'].includes(chosen(i.id))).sort((a,b)=>Number(chosen(a.id)==='maybe')-Number(chosen(b.id)==='maybe')||a.name.localeCompare(b.name))}
  function shareText(){
    return ['Good Days | My activity shortlist','Crows Nest and nearby','',...shortlistRows().map((i,n)=>`${n+1}. ${i.name} (${chosen(i.id)==='interested'?'Interested':'Maybe later'})\n${i.location}\n${i.url}${textNotes(i.id)?'\nNotes: '+textNotes(i.id):''}`),'','Programme details and vacancies should be confirmed with organisers.'].join('\n\n')
  }
  async function copyShortlist(){
    const txt=shareText();
    try{await navigator.clipboard.writeText(txt);toast('Shortlist copied. You can paste it into an email or message.')}catch(_){
      const temp=document.createElement('textarea');temp.value=txt;temp.style.position='fixed';temp.style.left='-9999px';document.body.appendChild(temp);temp.select();
      try{const copied=document.execCommand('copy');toast(copied?'Shortlist copied.':'Copy unavailable. Use Download CSV instead.')}catch(_){toast('Copy unavailable. Use Download CSV instead.')}temp.remove();
    }
  }
  function downloadCsv(){
    const header=['Status','Activity','Category','Description','Location','When','Cost','Accessibility','Notes','Website','Next step'];
    const vals=shortlistRows().map(i=>[chosen(i.id)==='interested'?'Interested':'Maybe later',i.name,category(i.category).name,i.description,i.location,i.frequency,i.cost,i.access,textNotes(i.id),i.url,i.nextStep]);
    const escaped=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const text='\ufeff'+[header,...vals].map(r=>r.map(escaped).join(',')).join('\r\n');
    const blob=new Blob([text],{type:'text/csv;charset=utf-8;'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='good-days-my-shortlist.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
  }
  function resetFilters(){state.category='all';state.query='';state.area='all';state.access='all';state.sort='recommended';$('#searchInput').value='';$('#areaFilter').value='all';$('#accessFilter').value='all';$('#sortFilter').value='recommended';renderExplore()}
  document.addEventListener('click',e=>{
    const viewBtn=e.target.closest('[data-view]');if(viewBtn){e.preventDefault();switchView(viewBtn.dataset.view);return}
    const catBtn=e.target.closest('[data-category]');if(catBtn){state.category=catBtn.dataset.category;renderExplore();return}
    const saveBtn=e.target.closest('[data-save]');if(saveBtn){const id=saveBtn.dataset.save;setChoice(id,chosen(id)==='interested'?'':'interested');toast(chosen(id)==='interested'?'Added to your shortlist.':'Selection updated.');return}
    const detailBtn=e.target.closest('[data-open]');if(detailBtn){openDialog(detailBtn.dataset.open);return}
    const c=e.target.closest('[data-dialog-choice]');if(c){const id=c.dataset.choiceId;const newChoice=c.dataset.dialogChoice;setChoice(id,chosen(id)===newChoice?'':newChoice);return}
    const clear=e.target.closest('[data-clear-choice]');if(clear){setChoice(clear.dataset.clearChoice,'');toast('Choice cleared.');return}
  });
  $('#brandLink').addEventListener('click',e=>{e.preventDefault();switchView('explore')});
  $('#searchInput').addEventListener('input',e=>{state.query=e.target.value;renderExplore()});
  ['areaFilter','accessFilter','sortFilter'].forEach(k=>$('#'+k).addEventListener('change',e=>{state[k==='areaFilter'?'area':k==='accessFilter'?'access':'sort']=e.target.value;renderExplore()}));
  $('#clearFilters').addEventListener('click',resetFilters);
  $('#resetFilters').addEventListener('click',resetFilters);
  $('#closeDialog').addEventListener('click',()=>$('#activityDialog').close());
  $('#activityDialog').addEventListener('click',e=>{if(e.target===$('#activityDialog'))$('#activityDialog').close()});
  $('#activityDialog').addEventListener('input',e=>{if(e.target.id==='noteInput'){state.notes[$('#activityDialog').dataset.id]=e.target.value;save()}});
  $('#activityDialog').addEventListener('close',renderAll);
  $('#copyShortlist').addEventListener('click',copyShortlist);
  $('#downloadCsv').addEventListener('click',downloadCsv);
  $('#printShortlist').addEventListener('click',()=>window.print());
  window.addEventListener('popstate',()=>switchView(['#shortlist','#about'].includes(location.hash)?location.hash.slice(1):'explore',false));
  if(!items.length)toast('Activity data could not be loaded. Please refresh the page.');
  renderAll();switchView(['#shortlist','#about'].includes(location.hash)?location.hash.slice(1):'explore',false);
})();