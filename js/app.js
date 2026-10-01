(()=>{
 const {DAYS,esc,mins,fmt,overlaps,statusAt,stateClass,ALL,registerSection}=window.CST;
 registerSection(window.CST_SECTION_DATA);
 // Cross-section data may already be loaded by the page as CST_ALL_SECTION_DATA.
 (window.CST_ALL_SECTION_DATA||[]).forEach(registerSection);
 const section=window.CST_SECTION_DATA.section;
 const sectionTeachers=(window.CST_TEACHERS||[]).filter(t=>t.sections.includes(section));
 const byId=id=>document.getElementById(id);

 document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');byId(btn.dataset.panel).classList.add('active')}));

 // --- Schedule view ---
 const daySel=byId('scheduleDay');
 DAYS.forEach(d=>daySel.add(new Option(d,d)));
 const courses=[...new Set([...(window.CST_SECTION_DATA.exact||[]),...(window.CST_SECTION_DATA.tentative||[]),...(window.CST_SECTION_DATA.unassigned||[])].map(e=>e.course))];
 const courseOrder={Preescolar:['PREJARDÍN A','PREJARDÍN B','JARDÍN A','JARDÍN B','TRANSICIÓN A','TRANSICIÓN B'],Primaria:['PRIMERO','SEGUNDO','TERCERO','CUARTO','QUINTO'],Bachillerato:['SEXTO','SÉPTIMO','OCTAVO','NOVENO','DÉCIMO','ONCE']}[section]||courses;
 function renderSchedule(){const day=daySel.value;const blocks=(window.CST_SECTION_DATA.scheduleBlocks||[]).filter(b=>b.day===day).sort((a,b)=>mins(a.start)-mins(b.start));byId('scheduleHead').innerHTML=`<tr><th>Hora</th>${courseOrder.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>`;byId('scheduleBody').innerHTML=blocks.map(b=>`<tr><td class="time-cell">${fmt(b.start)}<br>${fmt(b.end)}</td>${courseOrder.map(c=>{const ex=(window.CST_SECTION_DATA.exact||[]).filter(e=>e.day===day&&e.start===b.start&&e.end===b.end&&e.course===c);const te=(window.CST_SECTION_DATA.tentative||[]).filter(e=>e.day===day&&e.start===b.start&&e.end===b.end&&e.course===c);const un=(window.CST_SECTION_DATA.unassigned||[]).filter(e=>e.day===day&&e.start===b.start&&e.end===b.end&&e.course===c);if(ex.length){const names=[...new Set(ex.map(e=>e.teacher))];return `<td>${names.map(n=>`<span class="teacher-chip">${esc(n)}</span>`).join('')}<span class="subject-note">${esc(ex[0].subject)}</span></td>`}if(te.length){const names=[...new Set(te.flatMap(e=>e.teachers||[]))];return `<td>${names.map(n=>`<span class="teacher-chip tentative">${esc(n)}</span>`).join('')}<span class="subject-note">${esc(te[0].subject)} · por confirmar</span></td>`}if(un.length)return `<td><span class="unknown">Docente por identificar</span><span class="subject-note">${esc(un[0].subject)}</span></td>`;return '<td>—</td>'}).join('')}</tr>`).join('')}
 daySel.addEventListener('change',renderSchedule);renderSchedule();

 // --- Availability by day/time ---
 const availDay=byId('availDay'), availTime=byId('availTime'), teacherSearch=byId('teacherSearch');DAYS.forEach(d=>availDay.add(new Option(d,d)));
 function eventText(s){if(!s.events.length)return '';return s.events.map(e=>`${esc(e.course)} · ${esc(e.subject)} <small>${esc(e.section)}</small>`).join('<br>')}
 function renderAvailability(){const day=availDay.value,time=availTime.value||'10:10',q=(teacherSearch.value||'').trim().toLocaleLowerCase('es');let rows=sectionTeachers.filter(t=>!q||t.name.toLocaleLowerCase('es').includes(q)||t.subjects.join(' ').toLocaleLowerCase('es').includes(q)).map(t=>({t,s:statusAt(t,day,time)}));const order={free:0,busy:1,maybe:2,off:3};rows.sort((a,b)=>order[a.s.kind]-order[b.s.kind]||a.t.name.localeCompare(b.t.name,'es'));const counts={free:0,busy:0,maybe:0,off:0};rows.forEach(r=>counts[r.s.kind]++);byId('availabilitySummary').innerHTML=[['free','Disponibles'],['busy','En clase'],['maybe','Por confirmar'],['off','Fuera de jornada']].map(([k,l])=>`<div class="summary-box"><strong>${counts[k]}</strong><span>${l}</span></div>`).join('');byId('teacherGrid').innerHTML=rows.map(({t,s})=>`<article class="teacher-card ${stateClass(s.kind)}"><span class="status ${stateClass(s.kind)}">${esc(s.label)}</span><h3>${esc(t.name)}</h3><p>${s.kind==='free'?'Sin clase identificada en esta hora.':s.kind==='off'?'No está dentro de su jornada registrada.':eventText(s)}</p><small>${esc(t.subjects.join(' · '))}</small></article>`).join('')}
 [availDay,availTime].forEach(x=>x.addEventListener('change',renderAvailability));teacherSearch.addEventListener('input',renderAvailability);renderAvailability();


 // --- Coverage suggestions for absences ---
 const coverageTeacher=byId('coverageTeacher');
 const coverageDays=byId('coverageDays');
 const coverageButton=byId('coverageButton');
 const coverageResults=byId('coverageResults');

 if(coverageTeacher&&coverageDays&&coverageButton&&coverageResults){
   sectionTeachers.forEach(t=>coverageTeacher.add(new Option(t.name,t.name)));

   coverageDays.innerHTML=DAYS.map(d=>`
     <label class="day-check">
       <input type="checkbox" value="${esc(d)}">
       <span>${esc(d)}</span>
     </label>`).join('');

   const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

   function subjectFamily(subject){
     const s=norm(subject);
     const families=[
       ['ingles','ingles r/w','reading and writing','tecnica de expresion'],
       ['matematicas','geometria','estadistica'],
       ['ciencias','science','biologia','quimica','fisica','medio ambiente'],
       ['sociales','democracia','ed financiera','educacion financiera','filosofia'],
       ['arte','artes','musica','diseño','diseno'],
       ['educacion fisica','recreacion'],
       ['religion','etica'],
       ['sistemas']
     ];
     return families.findIndex(f=>f.some(x=>s.includes(x)));
   }

   function laborCovers(t,day,start,end){
     const j=t?.labor?.[day];
     return !!j&&mins(start)>=mins(j.start)&&mins(end)<=mins(j.end);
   }

   function hasExactConflict(t,day,start,end){
     return ALL.exact.some(e=>e.teacher===t.name&&e.day===day&&overlaps(e.start,e.end,start,end));
   }

   function hasTentativeConflict(t,day,start,end){
     return ALL.tentative.some(e=>e.teachers?.includes(t.name)&&e.day===day&&overlaps(e.start,e.end,start,end));
   }

   function uniqueRealBlocksForTeacher(t,day){
     const seen=new Map();
     ALL.scheduleBlocks.forEach(b=>{
       if(b.day!==day||!t.sections.includes(b.section))return;
       const key=`${b.start}|${b.end}`;
       if(!seen.has(key))seen.set(key,{day,start:b.start,end:b.end});
     });
     return [...seen.values()].sort((a,b)=>mins(a.start)-mins(b.start));
   }

   function freeBlockCount(t,day){
     return uniqueRealBlocksForTeacher(t,day).filter(b=>
       laborCovers(t,day,b.start,b.end)&&
       !hasExactConflict(t,day,b.start,b.end)&&
       !hasTentativeConflict(t,day,b.start,b.end)
     ).length;
   }

   function weeklyFreeCount(t){
     return DAYS.reduce((sum,d)=>sum+freeBlockCount(t,d),0);
   }

   function isPrimarySplitEnglish(event,absentName){
     if(event.section!=='Primaria'||norm(event.subject)!=='ingles')return null;
     const peers=ALL.exact.filter(e=>
       e.section==='Primaria'&&
       e.day===event.day&&
       e.start===event.start&&
       e.end===event.end&&
       e.course===event.course&&
       norm(e.subject)==='ingles'
     );
     const teachers=[...new Set(peers.map(e=>e.teacher))];
     if(!teachers.includes(absentName)||teachers.length<3)return null;
     const present=teachers.filter(n=>n!==absentName);
     return present.length>=2?present:null;
   }

   function candidateCategory(candidate,event){
     const exactSubject=candidate.subjects.some(s=>norm(s)===norm(event.subject));
     const cf=subjectFamily(event.subject);
     const related=cf>=0&&candidate.subjects.some(s=>subjectFamily(s)===cf);
     if(exactSubject||related)return 'recommended';
     if(candidate.sections.includes(event.section))return 'possible';
     return 'alternative';
   }

   function rankCandidates(event,absentName,planLoad){
     const allTeachers=window.CST_TEACHERS||[];

     return allTeachers
       .filter(t=>t.name!==absentName)
       // Regla institucional de cobertura:
       // el reemplazo debe pertenecer a la misma sección de la clase.
       // Un docente compartido sigue siendo elegible si esa sección aparece en t.sections.
       .filter(t=>(t.coverageSections||t.sections||[]).includes(event.section))
       .filter(t=>laborCovers(t,event.day,event.start,event.end))
       .filter(t=>!hasExactConflict(t,event.day,event.start,event.end))
       .filter(t=>!hasTentativeConflict(t,event.day,event.start,event.end))
       .map(t=>{
         const daily=freeBlockCount(t,event.day);
         const weekly=weeklyFreeCount(t);
         const assigned=planLoad[t.name]||0;
         const category=candidateCategory(t,event);

         let score=0;
         if(category==='recommended')score+=100;
         else if(category==='possible')score+=48;
         else score+=15;

         if(t.sections.includes(event.section))score+=18;

         // Favorece a quien conserva margen y evita cargar al docente con un solo hueco.
         score+=Math.min(daily,6)*7;
         score+=Math.min(weekly,20)*1.4;
         if(daily<=1)score-=38;
         else if(daily===2)score-=18;

         // Rotación automática dentro del plan generado.
         score-=assigned*34;

         return {t,category,daily,weekly,assigned,score};
       })
       .sort((a,b)=>b.score-a.score||b.daily-a.daily||a.t.name.localeCompare(b.t.name,'es'));
   }

   function categoryLabel(c){
     return c==='recommended'?'Reemplazo recomendado':
            c==='possible'?'Reemplazo posible':
            'Cobertura alternativa';
   }

   function categoryClass(c){
     return c==='recommended'?'coverage-rec':
            c==='possible'?'coverage-pos':
            'coverage-alt';
   }

   function absentEvents(name,selectedDays){
     const seen=new Map();
     ALL.exact
       .filter(e=>e.teacher===name&&selectedDays.includes(e.day))
       .forEach(e=>{
         const key=`${e.day}|${e.start}|${e.end}|${e.section}|${e.course}|${e.subject}`;
         if(!seen.has(key))seen.set(key,e);
       });

     return [...seen.values()].sort((a,b)=>
       DAYS.indexOf(a.day)-DAYS.indexOf(b.day)||
       mins(a.start)-mins(b.start)||
       a.section.localeCompare(b.section,'es')
     );
   }

   function renderCoverage(){
     const absentName=coverageTeacher.value;
     const selectedDays=[...coverageDays.querySelectorAll('input:checked')].map(x=>x.value);

     if(!selectedDays.length){
       coverageResults.innerHTML='<div class="notice warning">Selecciona por lo menos un día de ausencia.</div>';
       return;
     }

     const events=absentEvents(absentName,selectedDays);

     if(!events.length){
       coverageResults.innerHTML=`<div class="notice"><strong>${esc(absentName)}</strong> no tiene clases exactas registradas en los días seleccionados. No se generan coberturas.</div>`;
       return;
     }

     const planLoad={};
     let covered=0, noReplacement=0, withoutCandidates=0;

     const cards=events.map(event=>{
       const split=isPrimarySplitEnglish(event,absentName);

       if(split){
         noReplacement++;
         return `
           <article class="coverage-class coverage-no">
             <div class="coverage-class__head">
               <div>
                 <span class="coverage-kicker">${esc(event.day)} · ${fmt(event.start)}–${fmt(event.end)}</span>
                 <h3>${esc(event.course)} · ${esc(event.subject)}</h3>
                 <p>${esc(event.section)}</p>
               </div>
               <span class="coverage-badge no">No requiere reemplazo</span>
             </div>
             <div class="coverage-special">
               El curso de Inglés de Primaria está dividido en tres subgrupos. Las otras dos docentes asumen el grupo.
               <strong>Docentes presentes: ${split.map(esc).join(' · ')}</strong>
             </div>
           </article>`;
       }

       const ranked=rankCandidates(event,absentName,planLoad);

       if(!ranked.length){
         withoutCandidates++;
         return `
           <article class="coverage-class coverage-none">
             <div class="coverage-class__head">
               <div>
                 <span class="coverage-kicker">${esc(event.day)} · ${fmt(event.start)}–${fmt(event.end)}</span>
                 <h3>${esc(event.course)} · ${esc(event.subject)}</h3>
                 <p>${esc(event.section)}</p>
               </div>
               <span class="coverage-badge none">Sin candidato disponible</span>
             </div>
             <div class="notice warning">No hay docentes completamente libres y dentro de jornada durante todo este bloque.</div>
           </article>`;
       }

       // El primer candidato se usa como sugerencia del plan. Penalizará futuras clases
       // para repartir la carga entre distintos docentes.
       const primary=ranked[0];
       planLoad[primary.t.name]=(planLoad[primary.t.name]||0)+1;
       covered++;

       const visible=ranked.slice(0,6);

       return `
         <article class="coverage-class">
           <div class="coverage-class__head">
             <div>
               <span class="coverage-kicker">${esc(event.day)} · ${fmt(event.start)}–${fmt(event.end)}</span>
               <h3>${esc(event.course)} · ${esc(event.subject)}</h3>
               <p>${esc(event.section)}</p>
             </div>
             <span class="coverage-badge ${categoryClass(primary.category)}">Sugerencia: ${esc(primary.t.name)}</span>
           </div>

           <div class="coverage-options">
             ${visible.map((c,i)=>`
               <div class="coverage-option ${i===0?'coverage-option--primary':''}">
                 <div class="coverage-option__rank">${i===0?'★':i+1}</div>
                 <div class="coverage-option__body">
                   <strong>${esc(c.t.name)}</strong>
                   <span class="coverage-type ${categoryClass(c.category)}">${categoryLabel(c.category)}</span>
                   <small>
                     ${c.daily} bloque${c.daily===1?'':'s'} libre${c.daily===1?'':'s'} ese día ·
                     ${c.weekly} en la semana
                     ${c.assigned?` · ${c.assigned} cobertura${c.assigned===1?'':'s'} ya sugerida${c.assigned===1?'':'s'} en este plan`:''}
                   </small>
                 </div>
               </div>`).join('')}
           </div>
         </article>`;
     }).join('');

     const rotation=Object.entries(planLoad)
       .sort((a,b)=>b[1]-a[1])
       .map(([n,c])=>`${esc(n)}: ${c}`)
       .join(' · ');

     coverageResults.innerHTML=`
       <div class="coverage-summary">
         <div><strong>${events.length}</strong><span>clases afectadas</span></div>
         <div><strong>${covered}</strong><span>con sugerencia</span></div>
         <div><strong>${noReplacement}</strong><span>sin reemplazo necesario</span></div>
         <div><strong>${withoutCandidates}</strong><span>sin candidato</span></div>
       </div>
       <div class="notice coverage-note">
         <strong>Plan de rotación:</strong> la primera sugerencia de cada clase baja de prioridad en los siguientes bloques para repartir las coberturas.
         ${rotation?`<br><span>Carga sugerida: ${rotation}</span>`:''}
       </div>
       ${cards}`;
   }

   coverageButton.addEventListener('click',renderCoverage);
 }

 // --- Free hours by teacher, real section blocks ---
 const freeTeacher=byId('freeTeacher');sectionTeachers.forEach(t=>freeTeacher.add(new Option(t.name,t.name)));
 function statusBlock(t,b){const labor=t.labor?.[b.day];if(!labor||mins(b.start)<mins(labor.start)||mins(b.end)>mins(labor.end))return{kind:'off',label:'Fuera de jornada',events:[]};const ex=ALL.exact.filter(e=>e.teacher===t.name&&e.day===b.day&&overlaps(e.start,e.end,b.start,b.end));if(ex.length)return{kind:'busy',label:'En clase',events:ex};const te=ALL.tentative.filter(e=>e.teachers?.includes(t.name)&&e.day===b.day&&overlaps(e.start,e.end,b.start,b.end));if(te.length)return{kind:'maybe',label:'Por confirmar',events:te};return{kind:'free',label:'Disponible',events:[]}}
 function renderFreeWeek(){const t=sectionTeachers.find(x=>x.name===freeTeacher.value)||sectionTeachers[0];if(!t)return;const blocks=(window.CST_SECTION_DATA.scheduleBlocks||[]).slice().sort((a,b)=>DAYS.indexOf(a.day)-DAYS.indexOf(b.day)||mins(a.start)-mins(b.start));byId('freeWeek').innerHTML=blocks.map(b=>{const s=statusBlock(t,b);const d=s.events.length?s.events.map(e=>`${esc(e.course)} · ${esc(e.subject)} <small>${esc(e.section)}</small>`).join('<br>'):s.kind==='free'?'Sin clase identificada en este bloque.':'—';return `<div class="week-row"><div class="week-day">${esc(b.day)}</div><div class="week-time">${fmt(b.start)}–${fmt(b.end)}</div><div class="week-state ${stateClass(s.kind)}">${esc(s.label)}</div><div class="week-detail">${d}</div></div>`}).join('')}
 freeTeacher.addEventListener('change',renderFreeWeek);renderFreeWeek();
})();
