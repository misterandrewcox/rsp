/* Public form destinations are retained from the original Red Stain Press site. */
async function requestForm(url,options,request=fetch){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),20000);
  try{return await request(url,{...options,signal:controller.signal});}
  finally{clearTimeout(timer);}
}
async function sendNewsletter(endpoint,email,request=fetch){
  const response=await requestForm(endpoint,{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({email,source:'Website — redesigned launch signup',consent:true})},request);
  // An opaque response confirms dispatch, but cannot confirm the Sheet write.
  if(response.type==='opaque')return {confirmed:false};
  if(!response.ok)throw new Error('Newsletter request failed');
  const result=await response.json();
  if(result.success===true||result.ok===true)return {confirmed:true};
  throw new Error('Newsletter registration was not confirmed');
}
async function sendSubmission(endpoint,formData,request=fetch){
  const response=await requestForm(endpoint,{method:'POST',body:formData,headers:{Accept:'application/json'}},request);
  if(!response.ok)throw new Error('Submission was not accepted');
  const result=await response.json();
  if(result.errors?.length)throw new Error('Submission was not accepted');
  return {confirmed:true};
}
if(typeof module!=='undefined'&&module.exports)module.exports={sendNewsletter,sendSubmission};
if(typeof document!=='undefined'){
  document.querySelectorAll('[data-newsletter]').forEach(form=>{
    const button=form.querySelector('button[type="submit"]');
    const note=form.querySelector('.form-note');
    const emailInput=form.querySelector('input[type="email"]');
    const defaultLabel=button.textContent;
    form.addEventListener('input',()=>{if(button.dataset.sent){delete button.dataset.sent;button.disabled=false;button.textContent=defaultLabel;note.textContent='Title announcements and news. To leave the list, email hello@redstainpress.com.';note.className='form-note';}});
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(button.disabled)return;
      emailInput.value=emailInput.value.trim();
      if(!form.reportValidity())return;
      button.disabled=true;button.textContent='Sending…';note.textContent='Sending your signup request…';note.className='form-note';
      try{
        const result=await sendNewsletter(form.dataset.endpoint,emailInput.value);
        if(result.confirmed){note.textContent='You’re on the list. Look out for launch news from Red Stain.';note.classList.add('success');form.reset();}
        else{note.textContent='Your signup request has been sent. Registration can’t be confirmed here. Need help? Email hello@redstainpress.com.';note.classList.add('request-sent');}
        button.dataset.sent='true';button.textContent=result.confirmed?'Signed up':'Request sent';
      }catch{note.textContent='Your signup request couldn’t be sent. Please try again or email hello@redstainpress.com.';note.classList.add('error');button.disabled=false;button.textContent=defaultLabel;}
    });
  });
  document.querySelectorAll('[data-submission]').forEach(form=>{
    const button=form.querySelector('button[type="submit"]');
    const note=form.querySelector('.form-note');
    const defaultLabel=button.textContent;
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(button.disabled||!form.reportValidity())return;
      const link=form.querySelector('input[name="link"]');
      try{if(!['https:','http:'].includes(new URL(link.value).protocol))throw new Error();}
      catch{link.setCustomValidity('Enter a full link beginning with https:// or http://.');link.reportValidity();return;}
      button.disabled=true;button.textContent='Sending…';note.textContent='Sending your submission…';note.className='form-note';
      try{await sendSubmission(form.action,new FormData(form));note.textContent='Thank you. Your submission has been received. Red Stain will be in touch if it feels right for the list.';note.classList.add('success');form.reset();}
      catch{note.textContent='Your submission couldn’t be sent. Your entries are still here. Please try again or email submissions@redstainpress.com.';note.classList.add('error');}
      finally{button.disabled=false;button.textContent=defaultLabel;}
    });
    form.querySelector('input[name="link"]').addEventListener('input',event=>event.target.setCustomValidity(''));
  });
}
