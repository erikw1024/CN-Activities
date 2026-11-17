/* Good Days visual layer. Images are served by their original publishers.
   Venue photos are labelled separately from illustrative photos. */
(() => {
  'use strict';
  const activities = Array.isArray(window.ACTIVITY_DATA) ? window.ACTIVITY_DATA : [];
  const byId = Object.fromEntries(activities.map(item => [item.id, item]));
  const image = (src, credit, page, genuine = false) => ({src, credit, page, genuine});
  const actual = {
    crows: image('https://res.akamaized.net/domain/image/upload/t_web/c_fill%2Cw_720%2Ch_480/v1720406133/Neighbourhood_Crows_Nest_01_gxzmud_tro3x5.jpg', 'Crows Nest precinct · Domain', 'https://www.domain.com.au/news/crows-nest-community-welcomes-its-new-metro-era-1437835/', true),
    neutral: image('https://static.wixstatic.com/media/e9935d_1b5cd96d291c47dc8baad8c49c6a406d~mv2.jpg/v1/crop/x_308%2Cy_0%2Cw_2884%2Ch_1688/fill/w_769%2Ch_450%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_auto/New%20Board%20April%202022%20%282%29.jpg', 'Neutral Bay Community Centre', 'https://www.nbaycommunity.com.au/', true),
    cervantes: image('https://csidn.cancilleria.gob.ar/userfiles/504939721_1117436873759674_2757279278887266370_n.jpg', 'Instituto Cervantes Sydney event · Argentine Consulate', 'https://csidn.cancilleria.gob.ar/es/cierre-del-ciclo-de-cine-argentino-2025', true),
    guitar: image('https://res.cloudinary.com/cityofsydney/image/upload/v1678847882/k7h9gk6i1z6d/6u2XCn7qNwLMeuBdZLKMv3/63de7ad1-c2d9-11ed-95e8-9f73b4ebbf4d--Guitar-Ensemble-Class--Beginners--tile.jpg', 'Guitar ensemble · City of Sydney', 'https://whatson.cityofsydney.nsw.gov.au/events/ukulele-beginners-class'),
    wave: image('https://www.eventbrite.com.au/e/_next/image?q=75&url=https%3A%2F%2Fimg.evbuc.com%2Fhttps%253A%252F%252Fcdn.evbuc.com%252Fimages%252F1176949672%252F2319532892203%252F1%252Foriginal.20260207-155925%3Fw%3D600%26auto%3Dformat%252Ccompress%26q%3D75%26sharp%3D10%26s%3D69181f621d109391522402ab938bc854&w=940', 'Adults’ art workshop · Eventbrite', 'https://www.eventbrite.com.au/e/adults-acrylics-class-seniors-1-2-price-tickets-1982583645052'),
    redcross: image('https://www.redcross.org.au/globalassets/cms/community-action-catalogue/volunteer/connect-with-people-over-the-phone.jpg', 'Australian Red Cross · Telephone volunteering', 'https://www.redcross.org.au/act/action-catalogue/volunteer/connect-with-people-over-the-phone/', true),
    northsydney: image('https://tlc-northsydneyliving.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2022/09/pottery_tile_mural_1_1_resize.jpg', 'North Sydney Community Centre · North Sydney Living', 'https://northsydneyliving.com.au/north-sydney-community-centre-turns-50/', true),
    neutralDance: image('https://static.wixstatic.com/media/e9935d_c40f1d43ad6a4d9a84396250b6362cf7~mv2.jpeg/v1/fill/w_773%2Ch_515%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_auto/e9935d_c40f1d43ad6a4d9a84396250b6362cf7~mv2.jpeg','Neutral Bay Community Centre activity photo','https://www.nbaycommunity.com.au/',true)
  };
  const stock = {
    discussion: [
      image('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/')
    ],
    spanish: [
      image('https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/')
    ],
    music: [
      image('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/')
    ],
    art: [
      image('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/')
    ],
    social: [
      image('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/')
    ],
    volunteering: [
      image('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/'),
      image('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=980&q=80','Illustrative photo · Unsplash','https://unsplash.com/')
    ]
  };
  const specific = {
    a01:actual.crows, a02:actual.neutral, a03:actual.crows,
    a08:actual.cervantes, a09:actual.cervantes, a12:actual.cervantes,
    a11:actual.northsydney, a14:actual.guitar, a15:actual.guitar, a16:actual.guitar,
    a19:actual.wave, a20:actual.northsydney, a23:actual.neutral, a25:actual.crows,
    a26:actual.crows, a28:actual.neutralDance, a29:actual.crows, a30:actual.redcross
  };
  const photos = {};
  activities.forEach((item,index) => { const options=stock[item.category]||stock.social;photos[item.id]=specific[item.id]||options[index%options.length]; });
  function escapeHtml(str) {return String(str??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function safeUrl(url) {try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)?u.href:'#';}catch{return '#';}}
  function imageMarkup(pic,alt,cls,loading='lazy') {
    return `<img class="${cls}" src="${escapeHtml(safeUrl(pic.src))}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async" referrerpolicy="no-referrer">`;
  }
  function decorateCards(){
    document.querySelectorAll('.activity-card:not([data-has-photo])').forEach(card=>{
      const id=card.querySelector('[data-open]')?.dataset.open;
      if(!id||!photos[id])return;
      const pic=photos[id],item=byId[id];card.dataset.hasPhoto='true';
      const div=document.createElement('div'); div.className='activity-photo';
      div.innerHTML=`${imageMarkup(pic,`${item.category} image accompanying ${item.name}`,'activity-photo-img')}<span class="photo-kind">${pic.genuine?'Venue / organiser image':'Illustrative photo'}</span>`;
      div.querySelector('img').addEventListener('error',()=>{div.classList.add('image-unavailable');div.querySelector('img').remove();});
      card.insertBefore(div,card.firstChild);
    });
  }
  function decorateCategories(){
    document.querySelectorAll('[data-category]:not([data-has-photo])').forEach(button=>{
      const id=button.dataset.category;
      if(id==='all'||!stock[id])return;
      button.dataset.hasPhoto='true';button.classList.add('category-visual');
      const pic=stock[id][0];const img=document.createElement('img');img.src=safeUrl(pic.src);img.alt='';img.loading='lazy';img.decoding='async';img.className='category-visual-bg';
      img.addEventListener('error',()=>img.remove());button.prepend(img);
    });
  }
  function addHero(){
    const area=document.querySelector('.hero-scene');if(!area||area.dataset.visualReady)return;
    area.dataset.visualReady='true';area.classList.add('hero-photo-scene');
    area.innerHTML=`<div class="hero-photo-primary">${imageMarkup(stock.social[0],'People enjoying time together','hero-photo-img','eager')}<span>Good company. Good conversation.</span></div><div class="hero-photo-secondary">${imageMarkup(actual.crows,'Crows Nest village precinct','hero-photo-img','eager')}<span>Right on your doorstep</span></div><div class="hero-photo-tertiary">${imageMarkup(actual.guitar,'Group guitar class','hero-photo-img','eager')}<span>New things to try</span></div>`;
    area.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{const holder=img.parentElement;img.remove();holder?.classList.add('image-unavailable');}));
  }
  function addStory(){
    const section=document.querySelector('#explore-activities');if(!section||document.querySelector('#visualStory'))return;
    const box=document.createElement('section');box.className='visual-story';box.id='visualStory';
    box.innerHTML=`<div class="container"><div class="visual-story-heading"><div><span class="kicker">FOLLOW YOUR CURIOSITY</span><h2>Something for every kind of day.</h2></div><p>Meet people, make something, or make a difference. Start with whatever catches your eye.</p></div><div class="story-grid"><button type="button" class="story-tile" data-story="discussion">${imageMarkup(actual.neutral,'People at Neutral Bay Community Centre','story-image')}<span class="story-tile-body"><small>01 / CONVERSATION</small><strong>Good company & ideas</strong><span>Find discussion and social groups →</span></span></button><button type="button" class="story-tile" data-story="art">${imageMarkup(stock.art[0],'Art supplies','story-image')}<span class="story-tile-body"><small>02 / CREATIVITY</small><strong>Make room for creativity</strong><span>Explore drawing and painting →</span></span></button><button type="button" class="story-tile" data-story="volunteering">${imageMarkup(actual.redcross,'Older man speaking on a phone','story-image')}<span class="story-tile-body"><small>03 / PURPOSE</small><strong>Give a little back</strong><span>See volunteering opportunities →</span></span></button></div><p class="image-credits">Photography includes images from Neutral Bay Community Centre, Australian Red Cross and illustrative Unsplash photos. Venue images show the organisation or locality, not necessarily the exact activity.</p></div>`;
    section.parentNode.insertBefore(box,section);
    box.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{const holder=img.parentElement;img.remove();holder?.classList.add('image-unavailable');}));
    box.addEventListener('click',e=>{const el=e.target.closest('[data-story]');if(!el)return;document.querySelector(`[data-category="${el.dataset.story}"]`)?.click();document.querySelector('#explore-activities')?.scrollIntoView({behavior:'smooth'});});
  }
  function decorateDialog(){
    const dialog=document.querySelector('#activityDialog');const content=document.querySelector('#dialogContent');
    if(!dialog?.open||!content)return;
    const item=byId[dialog.dataset.id];if(!item||content.querySelector('.detail-photo'))return;
    const pic=photos[item.id];if(!pic)return;
    const img=document.createElement('figure');img.className='detail-photo';
    img.innerHTML=`${imageMarkup(pic,`${item.name}: ${pic.genuine?'organiser or locality photo':'illustrative activity photo'}`,'detail-photo-img')}<figcaption><span>${pic.genuine?'Photograph from the venue or related organisation':'Illustrative photograph'}</span><a href="${escapeHtml(safeUrl(pic.page))}" target="_blank" rel="noopener noreferrer">Image source ↗</a></figcaption>`;
    img.querySelector('img').addEventListener('error',()=>img.classList.add('image-unavailable'));
    const header=content.querySelector('.dialog-header');header?.insertAdjacentElement('afterend',img);
    const url=safeUrl(item.url);
    if(url!=='#'){
      const preview=document.createElement('section');preview.className='website-preview';
      preview.innerHTML=`<div class="website-preview-top"><span class="website-preview-symbol">▣</span><div><strong>See the organiser's website</strong><p>Preview the actual website before visiting it.</p></div></div><button type="button" class="website-preview-trigger">Show website screenshot</button><div class="website-preview-frame" hidden><div class="browser-chrome"><span>● ● ●</span><span>${escapeHtml(new URL(url).hostname)}</span></div><img alt="Screenshot preview of the organiser's website" loading="lazy"><div class="website-preview-fallback" hidden>Screenshot unavailable. Use the link below to visit the website directly.</div><small>Website snapshot supplied by a third-party preview service. It may be out of date.</small></div><a class="website-preview-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Open official organiser website ↗</a>`;
      preview.querySelector('.website-preview-trigger').addEventListener('click',()=>{
        const trigger=preview.querySelector('.website-preview-trigger'), frame=preview.querySelector('.website-preview-frame'),img=frame.querySelector('img');
        if(!frame.hidden){frame.hidden=true;trigger.textContent='Show website screenshot';return;}
        frame.hidden=false;trigger.textContent='Hide website screenshot';
        if(!img.src){img.src=`https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=900`;}
      });
      preview.querySelector('img').addEventListener('error',()=>{preview.querySelector('img').hidden=true;preview.querySelector('.website-preview-fallback').hidden=false;});
      content.querySelector('.dialog-actions')?.insertAdjacentElement('afterend',preview);
    }
  }
  function run(){decorateCards();decorateCategories();decorateDialog();}
  function initialise(){
    addHero();addStory();run();
    let pending=false;
    const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;run();});});
    ['featuredGrid','activityGrid','interestedGrid','maybeGrid','categoryList','dialogContent'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{childList:true,subtree:false});});
    document.addEventListener('click',e=>{if(e.target.closest('[data-open]'))requestAnimationFrame(decorateDialog);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialise,{once:true});else initialise();
})();