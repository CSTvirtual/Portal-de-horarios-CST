window.CST = (()=>{
 const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes'];
 const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const mins=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
 const fmt=t=>{const [h,m]=t.split(':').map(Number);const ap=h>=12?'p. m.':'a. m.';const hh=h%12||12;return `${hh}:${String(m).padStart(2,'0')} ${ap}`};
 const overlaps=(a,b,c,d)=>!(mins(b)<=mins(c)||mins(a)>=mins(d));
 function teacher(name){return (window.CST_TEACHERS||[]).find(t=>t.name===name)}
 function laborAt(t,day,time){const j=t?.labor?.[day];return !!j&&mins(time)>=mins(j.start)&&mins(time)<mins(j.end)}
 function exactAt(name,day,time){return ALL.exact.filter(e=>e.teacher===name&&e.day===day&&mins(time)>=mins(e.start)&&mins(time)<mins(e.end))}
 function tentativeAt(name,day,time){return ALL.tentative.filter(e=>e.teachers?.includes(name)&&e.day===day&&mins(time)>=mins(e.start)&&mins(time)<mins(e.end))}
 function statusAt(t,day,time){if(!laborAt(t,day,time))return{kind:'off',label:'Fuera de jornada',events:[]};const x=exactAt(t.name,day,time);if(x.length)return{kind:'busy',label:'En clase',events:x};const q=tentativeAt(t.name,day,time);if(q.length)return{kind:'maybe',label:'Por confirmar',events:q};return{kind:'free',label:'Disponible',events:[]}}
 function stateClass(k){return k==='free'?'free-card':k==='busy'?'busy-card':k==='maybe'?'maybe-card':'off-card'}
 const ALL={exact:[],tentative:[],unassigned:[]};
 function registerSection(data){if(!data)return; ALL.exact.push(...(data.exact||[]));ALL.tentative.push(...(data.tentative||[]));ALL.unassigned.push(...(data.unassigned||[]))}
 function github(path){let base=(window.CST_CONFIG?.githubRepoUrl||'').replace(/\/$/,'');const branch=window.CST_CONFIG?.githubBranch||'main';if(!base&&location.hostname.endsWith('.github.io')){const user=location.hostname.split('.')[0];const first=location.pathname.split('/').filter(Boolean)[0];const repo=first||`${user}.github.io`;base=`https://github.com/${user}/${repo}`}return base?`${base}/edit/${branch}/${path}`:'#'}
 return{DAYS,esc,mins,fmt,overlaps,teacher,laborAt,statusAt,stateClass,ALL,registerSection,github};
})();
