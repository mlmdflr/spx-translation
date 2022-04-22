function getImgUrl() {
    chrome.runtime.sendMessage(
        {
            men: 'Refresh'
        },
        response => {
            console.log(response);
            const style = window.document.createElement("style");
            style.setAttribute("from", new Date().getTime())
            style.innerHTML = ` #yDmH0d{
                background-size:100% 100%;
                background-position: center;
                background-image: url('${response.url}');
              }
                
                .T4LgNb{
                    opacity: ${response.ggopacity};
                }
                .VfPpkd-Jh9lGc{
                    background: white;
                    opacity:  ${response.ggopacity};
                }
                .VfPpkd-Jh9lGc1{
                    background-color: #1a73e8;
                    background-color: var(--gm-fillbutton-container-color,#1a73e8);
                    opacity:  ${response.ggopacity};
                }
                .goog-container-vertical {
                    opacity:   ${response.ggopacity};
                }

              
              `
            let index = 0
            const id = setInterval(() => {
                index++; if (index === 10) clearInterval(id);
                window.document.getElementsByTagName('head')[0] && window.document.getElementsByTagName('head')[0].appendChild(style) && clearInterval(id)
            }, 200)
        });
}

function isCn() {
    return document.domain.split('.')[document.domain.split('.').length - 1] === 'cn'
}

getImgUrl()

try {
    //文字按钮点击获焦
    document.querySelector('.cWQYBc').onclick = () => {
        if (document.querySelectorAll('.er8xn')[0]) setTimeout(() => document.querySelectorAll('.er8xn')[0].focus(), 200);
    }
    // 去除更翻译无关的 start
    let _z_QTmif = document.querySelector('.zQTmif');
    _z_QTmif.style = 'background: transparent';
    let _p_GxpHc = document.querySelector('.pGxpHc>header');
    _p_GxpHc.parentNode.removeChild(_p_GxpHc);
    let _V_lPnLc = document.querySelector('.VlPnLc');
    if (_V_lPnLc) _V_lPnLc.parentNode.removeChild(_V_lPnLc);
    let _a_88hkc = document.querySelector('.a88hkc');
    _a_88hkc.parentNode.removeChild(_a_88hkc);
    let _g_HNJvf = document.querySelector('.gHNJvf');
    _g_HNJvf.parentNode.removeChild(_g_HNJvf);
    let _V_jFXz = document.querySelector('.VjFXz');
    _V_jFXz.parentNode.removeChild(_V_jFXz);
    // 去除更翻译无关的 end

    //文字翻译
    let _a_kczyd = document.querySelectorAll('.akczyd')[1];
    //文档翻译
    let _a_kczyd3 = document.querySelectorAll('.akczyd')[3];
    //网站翻译
    let _a_kczyd5
    if (!isCn()) {
        _a_kczyd5 = document.querySelectorAll('.akczyd')[5];
    }

    // 切换背景 start
    let _b_utton = document.createElement('div')
    _b_utton.className = 'VfPpkd-Bz112c-LgbsSe'
    _b_utton.innerHTML = ('<svg t="1634091907879" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2425" data-spm-anchor-id="a313x.7781069.0.i0" width="20" height="20"><path d="M721.024 725.333333A298.666667 298.666667 0 1 1 810.666667 512a42.666667 42.666667 0 0 0 85.333333 0 384 384 0 1 0-128 286.208V810.666667c0 23.722667 19.114667 42.666667 42.666667 42.666666 23.722667 0 42.666667-19.114667 42.666666-42.666666v-128a42.538667 42.538667 0 0 0-42.666666-42.666667h-128c-23.722667 0-42.666667 19.114667-42.666667 42.666667 0 23.722667 19.114667 42.666667 42.666667 42.666666h38.357333z" fill="#3D3D3D" p-id="2426"></path></svg><div jsname="s3Eaab" class="VfPpkd-Bz112c-Jh9lGc"></div>');
    // 复制多两份节点 文档页和网站页
    let _b_utton_1 = _b_utton.cloneNode(true)
    let _b_utton_2

    if (!isCn()) {
        _b_utton_2 = _b_utton.cloneNode(true)
    }

    _b_utton.onclick = getImgUrl
    _b_utton_1.onclick = getImgUrl

    !isCn() && (_b_utton_2.onclick = getImgUrl)

    //添加节点
    _a_kczyd.appendChild(_b_utton)
    _a_kczyd3.appendChild(_b_utton_1)
    !isCn() && _a_kczyd5.appendChild(_b_utton_2)

    // 切换背景 end

    const style = window.document.createElement("style");
    style.setAttribute("from", "base")
    style.innerHTML =
        ` 
            .RvYhPd::before {
                background: transparent;
                border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                content: "";
                display: block;
                overflow: hidden;
                width: 100%;
                z-index: -1;
                position: absolute;
                top: 0;
                left: 0;
            }
            .ita-hwt-ime-st { position: fixed; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px; border: 1px solid rgb(204, 204, 204); transition: opacity 0.1s linear 0s; z-index: 2147483640; }
            `
    let index = 0
    const id = setInterval(() => {
        index++; if (index === 10) clearInterval(id);
        window.document.getElementsByTagName('head')[0] && window.document.getElementsByTagName('head')[0].appendChild(style) && clearInterval(id)
    }, 200)


} catch (e) {
    console.log(e);
}
