const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#primary-nav');
function closeMenu(){navigation.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
const tropes={
everyday:{number:'1',label:'Slice of life · Office romance',title:'Ordinary days.<br>Extraordinary feelings.',copy:'A glance across the office. A familiar face at the coffee shop. Childhood friends discovering that “just friends” has an expiration date.',note:'Slow burns, adult romances, and the little moments that change everything.'},
fantasy:{number:'2',label:'Fantasy · Historical · Omegaverse',title:'Other worlds.<br>The same pull.',copy:'A love that crosses kingdoms. A bond that rewrites destiny. Characters finding each other in worlds with rules all their own.',note:'Immersive settings, high stakes, and romance at the heart of the story.'},
complicated:{number:'3',label:'Drama · Found family · Adult romance',title:'Messy feelings.<br>Worth every page.',copy:'Bad timing. Complicated histories. People with a little more life behind them, figuring out what they want—and who they want it with.',note:'Emotional turns, older protagonists, and relationships with room to grow.'}
};
const tabs=[...document.querySelectorAll('[data-trope]')];
function chooseTrope(tab){const item=tropes[tab.dataset.trope];tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});document.querySelector('#trope-panel').setAttribute('aria-labelledby',tab.id);document.querySelector('.trope-number').textContent=item.number;document.querySelector('#trope-label').textContent=item.label;document.querySelector('#trope-title').innerHTML=item.title;document.querySelector('#trope-copy').textContent=item.copy;document.querySelector('#trope-note').textContent=item.note;}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>chooseTrope(tab));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();chooseTrope(tabs[next]);tabs[next].focus();});});
