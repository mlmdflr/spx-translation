

try {

    escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    });


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
    let _a_kczyd5 = document.querySelectorAll('.akczyd')[5];


    // 切换背景 start
    let _b_utton = document.createElement('div')
    _b_utton.className = 'VfPpkd-Bz112c-LgbsSe'
    _b_utton.innerHTML = escapeHTMLPolicy.createHTML('<svg t="1634091907879" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2425" data-spm-anchor-id="a313x.7781069.0.i0" width="20" height="20"><path d="M721.024 725.333333A298.666667 298.666667 0 1 1 810.666667 512a42.666667 42.666667 0 0 0 85.333333 0 384 384 0 1 0-128 286.208V810.666667c0 23.722667 19.114667 42.666667 42.666667 42.666666 23.722667 0 42.666667-19.114667 42.666666-42.666666v-128a42.538667 42.538667 0 0 0-42.666666-42.666667h-128c-23.722667 0-42.666667 19.114667-42.666667 42.666667 0 23.722667 19.114667 42.666667 42.666667 42.666666h38.357333z" fill="#3D3D3D" p-id="2426"></path></svg><div jsname="s3Eaab" class="VfPpkd-Bz112c-Jh9lGc"></div>');
    // 复制多两份节点 文档页和网站页
    let _b_utton_1 = _b_utton.cloneNode(true)
    let _b_utton_2 = _b_utton.cloneNode(true)

    //绑定事件
    _b_utton.onclick = () => window.ipc.invoke('switch-background');
    _b_utton_1.onclick = () => window.ipc.invoke('switch-background');
    _b_utton_2.onclick = () => window.ipc.invoke('switch-background');

    //添加节点
    _a_kczyd.appendChild(_b_utton)
    _a_kczyd3.appendChild(_b_utton_1)
    _a_kczyd5.appendChild(_b_utton_2)

    // 切换背景 end


    // 缩小按钮 start
    let _b_utton1 = document.createElement('div')
    _b_utton1.id = 'VfPpkd-Bz112c-LgbsSe-fdsx'
    _b_utton1.className = 'VfPpkd-Bz112c-LgbsSe'
    _b_utton1.innerHTML = escapeHTMLPolicy.createHTML('<svg t="1636428130620" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5859" width="200" height="200"><path d="M362.7 160v202.7H160c-17.7 0-32 14.3-32 32s14.3 32 32 32h224c23.6 0 42.7-19.1 42.7-42.7V160c0-17.7-14.3-32-32-32s-32 14.3-32 32zM661.3 864V661.3H864c17.7 0 32-14.3 32-32s-14.3-32-32-32H640c-23.6 0-42.7 19.1-42.7 42.7v224c0 17.7 14.3 32 32 32s32-14.3 32-32z" fill="#F5C71D" p-id="5860"></path><path d="M160 661.3h157.4L170.7 808.1c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l146.7-146.8V864c0 17.7 14.3 32 32 32s32-14.3 32-32V640c0-23.6-19.1-42.7-42.7-42.7H160c-17.7 0-32 14.3-32 32s14.3 32 32 32zM640 426.7h224c17.7 0 32-14.3 32-32s-14.3-32-32-32H706.6L853.4 216c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L661.3 317.4V160c0-17.7-14.3-32-32-32s-32 14.3-32 32v224c0 23.6 19.1 42.7 42.7 42.7z" fill="#040000" p-id="5861"></path></svg><div jsname="s3Eaab" class="VfPpkd-Bz112c-Jh9lGc"></div>');

    // 复制多两份节点 文档页和网站页
    let _b_utton1_1 = _b_utton1.cloneNode(true)
    let _b_utton1_2 = _b_utton1.cloneNode(true)

    // 绑定事件
    _b_utton1.onclick = () => _b_utton1Click()
    _b_utton1.ondblclick = () => _b_utton1Dblclick()
    _b_utton1_1.onclick = () => _b_utton1Click()
    _b_utton1_1.ondblclick = () => _b_utton1Dblclick()
    _b_utton1_2.onclick = () => _b_utton1Click()
    _b_utton1_2.ondblclick = () => _b_utton1Dblclick()

    var _b_utton1_to

    //点击和双击
    function _b_utton1Click() {
        clearTimeout(this._b_utton1_to);//停止单击定时事件
        this._b_utton1_to = setTimeout(function () {//延迟单击事件触发内容               
            window.ipc.send('window-func', { type: 'minimize', id: undefined });
        }, 100);
    }
    function _b_utton1Dblclick() {
        clearTimeout(this._b_utton1_to);//停止单击定时事件
        window.ipc.invoke('full-screen')
    }

    //添加节点
    _a_kczyd.appendChild(_b_utton1)
    _a_kczyd3.appendChild(_b_utton1_1)
    _a_kczyd5.appendChild(_b_utton1_2)
    // 缩小按钮 end


    //关闭按钮 start
    let _b_utton5 = document.createElement('div')
    _b_utton5.className = 'VfPpkd-Bz112c-LgbsSe'
    _b_utton5.innerHTML = escapeHTMLPolicy.createHTML('<svg t="1636428290369" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6830" width="200" height="200"><path d="M767.986697 174.60776c29.986965 21.286816 56.608276 45.414329 79.868025 72.355935 23.316032 26.970258 43.268456 56.087413 59.914578 87.349417 16.647145 31.29168 29.291117 64.381309 37.932937 99.326193s12.991895 70.355371 12.991895 106.316397c0 61.887512-11.83249 119.945813-35.43914 174.176948-23.663956 54.231135-55.565527 101.501742-95.875604 141.754514-40.252773 40.252773-87.466074 72.181973-141.753491 95.818299-54.172807 23.635303-112.289436 35.438117-174.176948 35.438117-61.191664 0-118.90204-11.802814-173.191504-35.438117-54.172807-23.636327-101.617375-55.565527-142.218072-95.818299-40.600697-40.281425-72.501244-87.523379-95.817276-141.754514-23.317055-54.231135-34.917254-112.289436-34.917254-174.176948 0-35.265178 4.117784-69.891813 12.412704-103.821577 8.352225-33.930787 20.184715-66.207911 35.496445-96.833419 15.311731-30.594809 34.220383-59.21873 56.840566-85.841064 22.620184-26.623357 47.90915-50.576909 75.865875-71.863724 14.674211-10.643408 30.507828-14.645558 47.444569-11.977799 16.935718 2.667759 30.740118 10.962679 41.412179 24.941042 10.67206 13.977339 14.616906 29.609365 12.006452 46.922682-2.667759 17.313318-10.961656 31.29168-24.998347 41.934065-41.87676 30.595832-74.009597 68.209498-96.281857 112.783693-22.272259 44.602847-33.466206 92.510974-33.466206 143.755078 0 43.906999 8.293897 85.34783 24.998347 124.267235 16.587793 38.948057 39.382962 72.878844 68.325132 101.821013 29.000498 28.942169 62.872956 51.9113 101.849666 68.876694 38.918381 16.965393 80.331583 25.433252 124.238582 25.433252 43.964304 0 85.377506-8.467859 124.295887-25.433252s72.849168-39.933501 101.849666-68.876694c28.942169-28.942169 51.852972-62.872956 68.847018-101.821013 16.994046-38.918381 25.461905-80.359212 25.461905-124.267235 0-51.9113-12.005428-100.979856-35.961026-147.235342-23.953551-46.25651-57.537438-84.362386-100.805894-114.291023-14.615882-9.976212-23.431665-23.635303-26.448372-40.918945-3.015683-17.313318 0.521886-33.293267 10.498098-47.938825 9.976212-13.977339 23.606651-22.446221 40.891316-25.433252C737.420541 161.121608 753.370815 164.631548 767.986697 174.60776L767.986697 174.60776 767.986697 174.60776 767.986697 174.60776zM511.44895 542.942733c-17.284665 0-32.075533-6.148024-44.428885-18.473747-12.297071-12.296047-18.444071-27.115568-18.444071-44.428885L448.575993 100.742449c0-17.313318 6.148024-32.277124 18.444071-44.921095 12.353352-12.642948 27.14422-18.965957 44.428885-18.965957 17.97949 0 33.118282 6.323009 45.414329 18.965957 12.354376 12.643971 18.502399 27.607778 18.502399 44.921095l0 379.297652c0 17.313318-6.148024 32.132838-18.502399 44.428885C544.567231 536.795732 529.42844 542.942733 511.44895 542.942733L511.44895 542.942733 511.44895 542.942733 511.44895 542.942733zM511.44895 542.942733" p-id="6831"></path></svg><div jsname="s3Eaab" class="VfPpkd-Bz112c-Jh9lGc"></div>');

    // 复制多两份节点 文档页和网站页
    let _b_utton5_1 = _b_utton5.cloneNode(true)
    let _b_utton5_2 = _b_utton5.cloneNode(true)

    //绑定事件
    _b_utton5.onclick = () => _b_utton5Click()
    _b_utton5.ondblclick = () => _b_utton5Dblclick()
    _b_utton5_1.onclick = () => _b_utton5Click()
    _b_utton5_1.ondblclick = () => _b_utton5Dblclick()
    _b_utton5_2.onclick = () => _b_utton5Click()
    _b_utton5_2.ondblclick = () => _b_utton5Dblclick()

    var _b_utton5_to

    // 点击和双击 
    function _b_utton5Click() {
        clearTimeout(this._b_utton5_to);//停止单击定时事件
        this._b_utton5_to = setTimeout(function () {//延迟单击事件触发内容               
            window.ipc.send('window-func', { type: 'close', id: undefined });
        }, 200);
    }
    function _b_utton5Dblclick() {
        clearTimeout(this._b_utton5_to);//停止单击定时事件
        window.ipc.send('app-relaunch', true);
    }

    //添加节点
    _a_kczyd.appendChild(_b_utton5)
    _a_kczyd3.appendChild(_b_utton5_1)
    _a_kczyd5.appendChild(_b_utton5_2)
    //关闭按钮 end



    // U0xwnf  导航栏
    let _U0xwnf = document.querySelectorAll('.U0xwnf')[0]
    //设置按钮
    let _b_utton6 = document.createElement('div')
    _b_utton6.className = 'cWQYBc'
    _b_utton6.innerHTML = escapeHTMLPolicy.createHTML('<button class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc qfvgSe VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc Rj2Mlf OLiIxf PDpWxe irkilc"  style="--mdc-ripple-fg-size:49px; --mdc-ripple-fg-scale:2.03756; --mdc-ripple-fg-translate-start:-20.125px, -1.5px; --mdc-ripple-fg-translate-end:16.6563px, -6.5px;">  <div class="VfPpkd-Jh9lGc"></div>  <div class="VfPpkd-J1Ukfc-LhBDec"></div>  <svg class="material-icons-extended VfPpkd-kBDsod ep0rzf" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"  > <g><path d="M0,0h24v24H0V0z" fill="none" /><path  d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/> </g></svg><span jsname="V67aGc" class="VfPpkd-vQzf8d" aria-hidden="true">Setting</span></button>')
    _b_utton6.onclick = () => window.ipc.invoke('open:window');

    _U0xwnf.appendChild(_b_utton6)

    let T4LgNb = document.querySelector('.T4LgNb')
    T4LgNb.addEventListener('contextmenu', () => {
        window.ipc.send('menu-show-goole', window.getSelection().toString())
    })

} catch (e) {
    console.log(e);
}