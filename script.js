const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#primary-nav');
function closeMenu(){navigation.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
const tropes={
everyday:{number:'1',label:'Slice of life · Office romance',title:'Ordinary days.<br>Extraordinary feelings.',copy:'A glance across the office. A familiar face at the coffee shop. Childhood friends testing the limits of “just friends.”',note:'Slow burns, grown-up romances, and small moments with serious consequences.'},
fantasy:{number:'2',label:'Fantasy · Historical · Omegaverse',title:'Other worlds.<br>Irresistible chemistry.',copy:'Rival kingdoms. Unlikely bonds. A world with rules of its own, and two men making things complicated.',note:'Immersive settings, high stakes, and a romance you’d follow anywhere.'},
complicated:{number:'3',label:'Drama · Found family · Adult romance',title:'Bad timing.<br>Excellent chemistry.',copy:'Old history. New feelings. Men with a little more life behind them, figuring out what they want and who they want it with.',note:'Older protagonists, emotional twists, and relationships that take time to find their footing.'}
};
const tabs=[...document.querySelectorAll('[data-trope]')];
function chooseTrope(tab){const item=tropes[tab.dataset.trope];tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});document.querySelector('#trope-panel').setAttribute('aria-labelledby',tab.id);document.querySelector('.trope-number').textContent=item.number;document.querySelector('#trope-label').textContent=item.label;document.querySelector('#trope-title').innerHTML=item.title;document.querySelector('#trope-copy').textContent=item.copy;document.querySelector('#trope-note').textContent=item.note;}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>chooseTrope(tab));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();chooseTrope(tabs[next]);tabs[next].focus();});});
