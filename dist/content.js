(()=>{"use strict";const e=()=>{let e=c();e&&(console.log("Hospital Cure"),frames[1].document.location.href=`https://avalon.endlesswar.ru/hospital.php?cmd=hospital.show&set=recovery&nd=${e}&${Math.random()}`)},t=()=>{let e=c();return!!e&&(console.log("Creating haot fight"),frames[1].document.location.href=`https://avalon.endlesswar.ru/zayavka.php?nd=${e}&cmd=haot.create&gradesmembers=3&startime2=3&timeout=3&blood=1&cmt=&open=1`,!0)},o=[{cookieName:"ext-carnage-spin-wheel",func:async()=>{let e=c();if(!e)return;console.log("Крутим колесо");let t=Math.random(),o=await fetch(`https://avalon.endlesswar.ru/wheel.php?cmd=wheel.turn&nd=${e}&${t}`,{method:"GET",referrer:"https://avalon.endlesswar.ru/lotery.php"}),a="";o.ok?a=await o.text():alert("Ошибка HTTP: "+o.status);let n=document.createElement("p");n.innerHTML=a,console.log("Result: ",n.children[0].children[0].getAttribute("text"))}},{cookieName:"ext-carnage-shadow-fight",func:()=>{console.log("Fighting with Shadow!"),frames[1].document.location.href="https://avalon.endlesswar.ru/zayavka.php?level=duel&duel_shadow=1"}},{cookieName:"ext-carnage-haot-fight-create",func:t},{cookieName:"ext-carnage-hospital-cure",func:e},{cookieName:"ext-carnage-clear-chat",func:()=>{frames[2].frames[1].document.querySelector("#chat-channels").children[1].innerHTML="",localStorage.avalonMessages=""}}],a=e=>{let t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0},n=e=>{((e,t,o={})=>{(o={path:"/",...o}).expires instanceof Date&&(o.expires=o.expires.toUTCString());let a=encodeURIComponent(e)+"="+encodeURIComponent(t);for(let e in o){a+="; "+e;let t=o[e];!0!==t&&(a+="="+t)}document.cookie=a})(e,"",{"max-age":-1})};o.forEach((e=>{n(e.cookieName)}));const r=(s=document.cookie,function(){var e=document.cookie;e!=s&&(s=e,o.forEach((e=>{"true"==a(e.cookieName)&&(e.func(),n(e.cookieName))})))});var s;const c=()=>{if(sessionStorage.identifND)return+sessionStorage.identifND;if(!frames[1].document.querySelector('input[name="nd"]'))return frames[1].document.location.href="https://avalon.endlesswar.ru/inventory.php?"+Math.random(),console.log("Нужно зайти в инвентарь!"),!1;let e=frames[1].document.querySelector('input[name="nd"]').value;return sessionStorage.identifND=""+e,e},l=()=>+frames[0].document.querySelector("#dvhp").innerText,i=()=>+frames[0].document.querySelector("#dvmaxhp").innerText,u=()=>+frames[0].document.querySelector("#dvmana").innerText,m=()=>+frames[0].document.querySelector("#dvmaxmana").innerText;let d=!1,f=!1,h=!1,g=!1,p=!1,v=!1;const x={current:0,max:1},w=e=>{runesNodes=[...frames[1].document.querySelectorAll('li[data-slot-name="rune"]')],runesNodes.find((t=>{const o=t.querySelector("img");if(o&&o.src===e){let e=(""+o.getAttribute("onclick")).match(/window.location=(.*);}/)[1].trim();return e=e.slice(1,-1),frames[1].document.location.href="https://avalon.endlesswar.ru/"+e,!0}}))};console.log("Endlesswar extension is now working");let S=!1;setInterval((()=>{(e=>{if("true"==a("ext-carnage-autofight")&&frames[1]&&frames[1].document)if(frames[1].document.location.href.includes("https://avalon.endlesswar.ru/fbattle.php")){if(h||g)return void console.log("Waiting...");if(f){f=!1,p=+a("ext-carnage-autofight-animals"),p&&p>0&&(e=>{h=!0;for(let t=0;t<e;t++)setTimeout((()=>{console.log("Call dragon num: ",t+1),frames[1].location.href="https://avalon.endlesswar.ru/fbattle.php?cmd=ability.summon_pet"}),3e3*(t+1));setTimeout((()=>{h=!1}),3e3*(e+1))})(p);const e=+a("ext-carnage-autofight-delay");return void(e&&e>0&&(g=!0,setTimeout((()=>{g=!1}),1e3*e)))}if(v=+a("ext-carnage-autofight-mana"),v&&v>0&&(x.max=v,!(x.current>=x.max)&&currentMana()+100<maxMana()&&(console.log("using mana"),w("https://img.endlesswar.ru/i/rune/37.gif"),x.current+=1,h=!0,setTimeout((()=>{h=!1}),3e3),1)))return;if(console.log("Hit an oppenent"),frames[1].document.forms.bform)return void frames[1].document.forms.bform.submit();if(frames[1].document.querySelector("#buttonRefresh"))return void frames[1].document.querySelector("#buttonRefresh").click();frames[1].document.querySelector(".xbbutton")&&(frames[1].document.querySelector(".xbbutton").click(),f=!0,x.current=0)}else f=!0})(),d||"true"==a("ext-carnage-auto-create-haot-fight")&&frames[1]&&frames[1].document&&(frames[1].document.location.href.includes("https://avalon.endlesswar.ru/fbattle.php")||i()!=+a("ext-carnage-mymaxhp")||(l()+150<=i()||u()+150<=m()?(l()<=i()/1.6||u()<=m()/1.6)&&"true"===a("ext-carnage-auto-regeneration-in-hospital")?(console.log("Need to USE hospital"),e(),d=!0,setTimeout((()=>{d=!1}),5e3)):console.log("Regeneration..."):t()&&(console.log("Создаем заявку на бой"),d=!0,setTimeout((()=>{d=!1}),18e4))))}),1500),setTimeout((()=>{S=!0}),6e5),setTimeout((()=>{if(localStorage.avalonMessages&&frames[2]&&localStorage.avalonMessages){const e=frames[2].frames[1].document.querySelector("#chat-channels").children[1];e.innerHTML=`${localStorage.avalonMessages}${e.innerHTML}`}}),5e3),window.setInterval(r,100)})();