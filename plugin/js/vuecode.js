
Vue.createApp({
    setup() {
        let Keyword = Vue.ref(localStorage.getItem('Keyword') ?? 'rikka')
        let ggopacity = Vue.ref(Number(localStorage.getItem('ggopacity') ?? 0.8))
        let search = () => {
            getSearchCount(Keyword.value).then(cout => {
                ElementPlus.ElNotification({
                    title: '搜索成功',
                    message: '一共有' + cout + "张图片",
                    type: 'success',
                })
            })
        }
        let save = () => {
            localStorage.setItem('Keyword', Keyword.value)
            localStorage.setItem('ggopacity', ggopacity.value)
            ElementPlus.ElNotification({
                message: "保存成功",
                type: 'success',
            })
        }
     
        return {
            Keyword,
            ggopacity,
            search,
            save
        }
    }
}).use(ElementPlus).mount('#app')
