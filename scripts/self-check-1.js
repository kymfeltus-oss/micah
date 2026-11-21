
(()=>{'use strict';
const choices=[...document.querySelectorAll('.choice')];
const priorities=[...document.querySelectorAll('.priority')];
const $=id=>document.getElementById(id);
const selected=items=>items.filter(el=>el.getAttribute('aria-pressed')==='true');
const personalNote=$('personalNote');
const wordCount=$('wordCount');
const wordList=text=>text.trim().match(/\S+/g)||[];
function updatePersonalNote(){
  const text=personalNote.value;
  const words=[...text.matchAll(/\S+/g)];
  if(words.length>150){
    // Keep the first 150 words and their original newlines/paragraph spacing.
    const last=words[149];
    personalNote.value=text.slice(0,last.index+last[0].length);
  }
  const total=wordList(personalNote.value).length;
  wordCount.textContent=total+' / 150 words';
  wordCount.classList.toggle('limit',total>=150);
}
personalNote.addEventListener('input',updatePersonalNote);
updatePersonalNote();

function refresh(){
 const n=selected(choices).length; $('countChip').textContent=n+' selected';
 const p=selected(priorities).length;$('priorityHint').textContent=p+'/2 priorities selected.';
 $('results').hidden=true;
}
choices.forEach(b=>b.addEventListener('click',()=>{b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');refresh()}));
priorities.forEach(b=>b.addEventListener('click',()=>{
 const active=b.getAttribute('aria-pressed')==='true';
 if(!active&&selected(priorities).length>=2){$('priorityHint').textContent='Select up to two. Deselect one to make a change.';return;}
 b.setAttribute('aria-pressed',active?'false':'true');refresh();
}));
const benefit={
 'Clearer answers':'understanding what may be contributing to your symptoms',
 'Medication guidance':'reviewing medication benefits, side effects, and other options',
 'Feeling heard':'having time to explain your experience and ask questions',
 'Better daily balance':'looking at sleep, routines, mood, and daily functioning',
 'A practical next step':'working toward a realistic plan for what comes next'
};
function showResults(){
 const c=selected(choices),p=selected(priorities),n=c.length;
 const goal=p.map(b=>b.textContent.trim());
 let title,lead,paragraph;
 if(!n&&!goal.length){title='A conversation can begin with a single question.';lead='You do not need to know exactly what you need before contacting a provider.';paragraph='A first conversation is an opportunity to ask about the practice, its approach, and whether an evaluation could be useful for you.';}
 else if(c.some(x=>x.dataset.title==='Medication questions')){title='You may be ready for a more thoughtful medication conversation.';lead='Past treatment experiences deserve careful consideration, not quick assumptions.';paragraph='Your selections raise questions about what you have tried, what changed, and what you hope will improve. A psychiatric evaluation may help you explore medication options and broader aspects of care.';}
 else if(c.some(x=>x.dataset.title==='Managing things outwardly')){title='What you are carrying deserves to be heard.';lead='Looking fine on the outside does not mean everything feels manageable on the inside.';paragraph='A conversation with a psychiatric professional can give you space to discuss the experiences you selected and explore care options appropriate to your needs.';}
 else if(c.some(x=>x.dataset.title==='Racing thoughts and energy changes')){title='Clarity can start with understanding the pattern.';lead='Changes in attention, mood, or energy can be difficult to sort through alone.';paragraph='A thorough evaluation can consider the bigger picture, including your history, sleep, daily life, and experiences over time, before discussing options.';}
 else {title='Your questions are worth exploring.';lead='You have identified a few things that matter to you. That is a meaningful place to start.';paragraph='You can bring these topics to an initial conversation and ask how a personalized psychiatric evaluation and treatment planning process works.';}
 $('resultHeading').textContent=title;
 $('resultLead').textContent=lead;
 $('resultTitle').textContent=goal.length?'What matters most in your next visit':'A conversation built around your needs';
 $('resultMessage').textContent=paragraph+(goal.length?' You also highlighted '+goal.map(g=>benefit[g]||g.toLowerCase()).join(goal.length===2?' and ':', ')+'.':'');
 const tags=$('topics');tags.replaceChildren();
 const values=[...new Set([...c.map(b=>b.dataset.topic),...goal])];
 if(!values.length) values.push('Questions about getting started');
 values.forEach(value=>{const tag=document.createElement('span');tag.className='tag';tag.textContent=value;tags.appendChild(tag)});
 $('results').hidden=false;$('results').scrollIntoView({behavior:'instant',block:'start'});$('results').focus({preventScroll:true});
}
$('showResults').addEventListener('click',showResults);
$('editAnswers').addEventListener('click',()=>{$('results').hidden=true;$('choices').scrollIntoView({behavior:'instant',block:'start'})});
$('reset').addEventListener('click',()=>{[...choices,...priorities].forEach(b=>b.setAttribute('aria-pressed','false'));personalNote.value='';updatePersonalNote();$('results').hidden=true;refresh();$('copyStatus').textContent='Selections and personal notes cleared.';});
function notes(){const cs=selected(choices).map(b=>'• '+b.dataset.title),ps=selected(priorities).map(b=>'• '+b.textContent.trim());return 'M.R.-Gen-C Psychiatry — My conversation notes (not a diagnosis)\n\nExperiences I selected:\n'+(cs.join('\n')||'None selected')+'\n\nWhat matters to me:\n'+(ps.join('\n')||'Not selected')+'\n\nMy additional notes:\n'+(personalNote.value.trim()||'None added')+'\n\nQuestions:\n• What would an evaluation involve?\n• What options could be worth discussing?\n• How do you approach medication decisions and follow up?'}
$('copyNotes').addEventListener('click',async()=>{try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(notes());$('copyStatus').textContent='Notes copied. You choose whether to share them.'}catch{const area=document.createElement('textarea');area.value=notes();area.style.cssText='width:100%;height:140px;margin-top:10px';const status=$('copyStatus');status.replaceChildren(document.createTextNode('Select and copy your notes:'),area);area.focus();area.select()}});
refresh();
})();
/* Self contained PDF exporter. Runs locally: no uploads, no CDNs, no print dialogue. */
(function(){
 const button=document.getElementById('downloadPdf');
 if(!button)return;
 const logoBase64='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';
 const imgWidth=348,imgHeight=88;
 const enc=new TextEncoder();
 const ascii=t=>String(t).replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,'-').replace(/\u2022/g,'-').replace(/\u2026/g,'...').replace(/[^\x20-\x7E]/g,'?');
 const escapePDF=t=>ascii(t).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
 const wrap=(s,limit=94)=>{
   let lines=[],text=ascii(s).trim();
   if(!text)return ['None provided'];
   for(const paragraph of text.split(/\n+/)){
     let line='';
     for(const word of paragraph.split(/\s+/)){
       if((line+' '+word).trim().length>limit && line){lines.push(line);line=word}
       else line=line?line+' '+word:word;
     }
     if(line)lines.push(line);
   }
   return lines;
 };
 const toBytes=s=>enc.encode(s);
 const concat=arrays=>{let n=arrays.reduce((a,b)=>a+b.length,0),out=new Uint8Array(n),offset=0;for(const a of arrays){out.set(a,offset);offset+=a.length}return out};
 const decode64=s=>{const bin=atob(s);let bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return bytes};
 function makeDocument(){
   const stamp=new Date();
   const date=stamp.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
   const selections=[...document.querySelectorAll('.choice[aria-pressed="true"]')].map(x=>x.dataset.title||x.textContent.trim());
   const priorities=[...document.querySelectorAll('.priority[aria-pressed="true"]')].map(x=>x.textContent.trim());
   const note=document.getElementById('personalNote').value.trim();
   const sections=[
     ['Experiences I selected',selections.length?selections:['None selected']],
     ['What matters most to me',priorities.length?priorities:['Not selected']],
     ['My additional notes',[note||'None added']],
     ['Questions to bring to my appointment',[
       'What would a comprehensive evaluation involve?',
       'What care options might be appropriate to discuss?',
       'How are medication decisions and follow up handled?'
     ]]
   ];
   let pages=[],commands=[],y=681;
   const line=(str)=>{commands.push(str+'\n')};
   const text=(txt,x,yy,size=10.5,font='F1',col='0.09 0.20 0.34')=>{
     line('BT '+col+' rg /'+font+' '+size+' Tf 1 0 0 1 '+x.toFixed(1)+' '+yy.toFixed(1)+' Tm ('+escapePDF(txt)+') Tj ET');
   };
   const begin=()=>{
     commands=[];
     line('0.96 0.985 0.99 rg 0 0 612 792 re f');
     line('1 1 1 rg 26 25 560 742 re f');
     line('q 160 0 0 40 43 726 cm /Logo Do Q');
     line('0.07 0.22 0.39 rg 42 712 528 1 re f');
     line('0.25 0.70 0.18 rg 42 709 100 3 re f');
     text('PATIENT INQUIRY NOTES',43,689,17,'F2','0.06 0.15 0.3');
     text('Prepared '+date+'  |  For personal discussion with a healthcare professional',43,667,9,'F1','0.33 0.42 0.5');
     line('0.87 0.91 0.93 rg 42 651 528 1 re f');
     y=630;
   };
   const end=()=>{
     line('0.87 0.91 0.93 rg 42 59 528 1 re f');
     text('M.R.-Gen-C Psychiatry  |  This worksheet is not a diagnosis or medical record.',43,43,8,'F1','0.43 0.51 0.57');
     pages.push(commands.join(''));
   };
   begin();
   for(const [heading,items] of sections){
     if(y<132){end();begin()}
     text(heading.toUpperCase(),43,y,11.5,'F2','0.10 0.43 0.24');y-=24;
     for(const item of items){
       const ls=wrap(item);
       for(let i=0;i<ls.length;i++){
         if(y<95){end();begin()}
         text((i===0?'-  ':'   ')+ls[i],48,y,10.5,'F1','0.12 0.20 0.31');y-=16;
       }
       y-=8;
     }
     y-=17;
   }
   if(y<125){end();begin()}
   text('PRIVACY REMINDER',43,y,10,'F2','0.10 0.43 0.24');y-=17;
   for(const l of wrap('This document is generated locally in your browser. It is not sent to the practice. Share it only through a channel you trust.',98)){
     text(l,43,y,9.5,'F1','0.39 0.48 0.53');y-=14;
   }
   end();
   const logo=decode64(logoBase64);
   let objects=[];
   objects[1]=toBytes('<< /Type /Catalog /Pages 2 0 R >>');
   const refs=pages.map((_,i)=>`${5+i*2} 0 R`).join(' ');
   objects[2]=toBytes('<< /Type /Pages /Kids [ '+refs+' ] /Count '+pages.length+' >>');
   objects[3]=toBytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
   objects[4]=toBytes('<< /Type /XObject /Subtype /Image /Width '+imgWidth+' /Height '+imgHeight+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+logo.length+' >>\nstream\n');
   objects[4]=concat([objects[4],logo,toBytes('\nendstream')]);
   objects.push(null);
   for(let i=0;i<pages.length;i++){
     const pageid=5+i*2, contentid=6+i*2;
     objects[pageid]=toBytes('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 '+(5+pages.length*2)+' 0 R >> /XObject << /Logo 4 0 R >> >> /Contents '+contentid+' 0 R >>');
     const stream=toBytes(pages[i]);
     objects[contentid]=concat([toBytes('<< /Length '+stream.length+' >>\nstream\n'),stream,toBytes('endstream')]);
   }
   objects[5+pages.length*2]=toBytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
   const max=5+pages.length*2;
   let chunks=[toBytes('%PDF-1.4\n%MRGC\n')],offset=chunks[0].length,xref=[0];
   for(let n=1;n<=max;n++){
     const chunk=concat([toBytes(n+' 0 obj\n'),objects[n],toBytes('\nendobj\n')]);
     xref.push(offset);chunks.push(chunk);offset+=chunk.length;
   }
   const start=offset;
   chunks.push(toBytes('xref\n0 '+(max+1)+'\n0000000000 65535 f \n'));
   for(let i=1;i<=max;i++)chunks.push(toBytes(String(xref[i]).padStart(10,'0')+' 00000 n \n'));
   chunks.push(toBytes('trailer\n<< /Size '+(max+1)+' /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF'));
   return concat(chunks);
 }
 button.addEventListener('click',()=>{
   try{
     const pdf=makeDocument();
     const blob=new Blob([pdf],{type:'application/pdf'});
     const url=URL.createObjectURL(blob);
     const a=document.createElement('a');a.href=url;a.download='MR-Gen-C-Patient-Inquiry-Notes.pdf';document.body.appendChild(a);a.click();a.remove();
     setTimeout(()=>URL.revokeObjectURL(url),5000);
     document.getElementById('copyStatus').textContent='Your inquiry notes PDF has been prepared for download. Nothing was sent to the practice.';
   }catch(error){document.getElementById('copyStatus').textContent='PDF could not be generated in this browser. You can still copy your conversation notes.';console.error(error)}
 });
})();
