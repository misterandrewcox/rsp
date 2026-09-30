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
    form.addEventListener('input',()=>{if(button.dataset.sent){delete button.dataset.sent;button.disabled=false;button.textContent=defaultLabel;note.textContent='Just the good stuff. You can ask us to remove you at any time.';note.className='form-note';}});
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(button.disabled)return;
      emailInput.value=emailInput.value.trim();
      if(!form.reportValidity())return;
      button.disabled=true;button.textContent='Sending…';note.textContent='Sending your signup request…';note.className='form-note';
      try{
        const result=await sendNewsletter(form.dataset.endpoint,emailInput.value);
        if(result.confirmed){note.textContent='You’re on the list. Thank you for being here at the beginning.';note.classList.add('success');form.reset();}
        else{note.textContent='Your signup request was sent. Registration isn’t confirmed on this page; email hello@redstainpress.com if you need help.';note.classList.add('request-sent');}
        button.dataset.sent='true';button.textContent='Request sent';
      }catch{note.textContent='We couldn’t send your request. Please try again, or email hello@redstainpress.com.';note.classList.add('error');button.disabled=false;button.textContent=defaultLabel;}
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
      catch{link.setCustomValidity('Please use an https:// or http:// link.');link.reportValidity();return;}
      button.disabled=true;button.textContent='Sending…';note.textContent='Sending your work…';note.className='form-note';
      try{await sendSubmission(form.action,new FormData(form));note.textContent='Thank you—your submission has been received. We’ll be in touch if it feels right for our list.';note.classList.add('success');form.reset();}
      catch{note.textContent='We couldn’t send your work. Your entries are still here. Please try again or email submissions@redstainpress.com.';note.classList.add('error');}
      finally{button.disabled=false;button.textContent=defaultLabel;}
    });
    form.querySelector('input[name="link"]').addEventListener('input',event=>event.target.setCustomValidity(''));
  });
}
