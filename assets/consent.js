/* NexVita (nexvita.com) — consentimento de cookies (LGPD).
   Nada de medição é carregado antes de o visitante aceitar.
   Escolha guardada em localStorage "nv_consent" = "sim" | "nao". */
(function(){
  var GA_ID="G-CZ96HGER0V", KEY="nv_consent";
  /* Mídia paga: preencher para ativar. Vazio = não carrega nada. */
  var NV_AW_ID="";          /* ex.: "AW-123456789" (Google Ads, conversão "Lead formulário site") */
  var NV_AW_LABEL="";       /* ex.: "AbCdEfGhIjk" (rótulo da conversão) */
  var NV_META_PIXEL_ID="";  /* ex.: "123456789012345" (Pixel do Meta) */
  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}

  function loadGA(){
    if(window.__nvGA)return; window.__nvGA=1;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments)};
    gtag("js",new Date());
    gtag("config",GA_ID,{anonymize_ip:true});
    var s=document.createElement("script");
    s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;
    document.head.appendChild(s);
    if(NV_AW_ID)gtag("config",NV_AW_ID);
    if(NV_META_PIXEL_ID&&!window.fbq){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,"script","https://connect.facebook.net/en_US/fbevents.js");
      fbq("init",NV_META_PIXEL_ID); fbq("track","PageView");
    }
  }

  /* Chamado pelo site.js no mesmo ponto do generate_lead (lead confirmado pelo CRM). */
  window.nvLead=function(){
    if(!window.__nvGA)return;
    if(NV_AW_ID&&NV_AW_LABEL&&window.gtag)gtag("event","conversion",{send_to:NV_AW_ID+"/"+NV_AW_LABEL});
    if(window.fbq)fbq("track","Lead");
  };

  function banner(){
    if(document.getElementById("nv-cookies"))return;
    var priv=(document.querySelector('a[href$="privacidade/"]')||{}).getAttribute
      ? document.querySelector('a[href$="privacidade/"]').getAttribute("href") : "/privacidade/";
    var b=document.createElement("div");
    b.id="nv-cookies"; b.setAttribute("role","dialog"); b.setAttribute("aria-label","Aviso de cookies");
    b.innerHTML='<p>Usamos cookies de medição (Google Analytics) e de anúncios (Google Ads e Meta) para entender o uso do site e medir nossas campanhas, só com a sua permissão. '+
      '<a href="'+priv+'">Política de privacidade</a>.</p>'+
      '<div class="nv-cookies-acoes"><button type="button" class="nv-recusar">Recusar</button>'+
      '<button type="button" class="nv-aceitar">Aceitar</button></div>';
    document.body.appendChild(b);
    b.querySelector(".nv-aceitar").onclick=function(){set("sim");b.remove();loadGA()};
    b.querySelector(".nv-recusar").onclick=function(){set("nao");b.remove()};
  }

  function init(){
    var c=get();
    if(c==="sim")loadGA(); else if(c!=="nao")banner();
    document.querySelectorAll("[data-cookies]").forEach(function(a){
      a.addEventListener("click",function(ev){ev.preventDefault();
        try{localStorage.removeItem(KEY)}catch(e){}
        if(window.__nvGA){location.reload();return}
        banner();});
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
})();
