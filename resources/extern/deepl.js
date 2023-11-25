escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})
document.querySelector('header') && document.querySelector('header').remove();
document.querySelector('footer') && document.querySelector('footer').remove();

if (document.querySelector('div.relative[data-testid="translator"]')) {
    for (const iterator of [...document.querySelector('div.relative[data-testid="translator"]').childNodes].splice(1, document.querySelector('div.relative[data-testid="translator"]').childNodes.length)) {
        iterator.remove()
    }
}

//写作页
document.querySelector('#dl_write_banner_container') && document.querySelector('#dl_write_banner_container') .remove();
document.querySelector('#dl_write_header_container') && document.querySelector('#dl_write_header_container') .remove();



let panelTranslateText = document.querySelector('#___gatsby') || document.querySelector('#dl_translator')
panelTranslateText && panelTranslateText.addEventListener('contextmenu', () => {
    window.location.href.endsWith(`translator`) && window.ipc.send('menu-show-deepl', window.getSelection().toString())
    window.location.href.endsWith(`write`) && window.ipc.send('menu-show-deepl-come-back', window.getSelection().toString())
})


var index = 0
var redesignId = setInterval(() => {
    index++; if (index === 10) clearInterval(redesignId);
    const style = window.document.createElement("style");
    style.className = 'custRedesign'
    style.setAttribute("from", new Date().getTime())
    style.innerHTML = ` 
                body{
                    background-color: transparent !important;
                }
                .dl_body--redesign{
                    background-color: transparent !important;
                }
                .bg-neutral-next-50{
                    background-color: transparent !important;
                }
              `
    document.querySelector('.custRedesign') && document.querySelector('.custRedesign').remove()
    window.document.getElementsByTagName('head')[0] && window.document.getElementsByTagName('head')[0].appendChild(style)
}, 200)