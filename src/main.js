import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
// import './components/common/directives';
import 'babel-polyfill';
import axios from 'axios';
//导入nprogress包对应的js和css
import NProgress from 'nprogress';
import AV from 'leancloud-storage';

axios.defaults.baseURL = 'http://localhost:8081';
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

const appId = 'b0ldHK3FgjGVVjSKHelxO3Ux-gzGzoHsz';
const appKey = '9BzkUEUXyIiNnflLJqhprwTA';
AV.init({
    appId, appKey,serverURL: "https://b0ldhk3f.lc-cn-n1-shared.com"
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    NProgress.start();
    // if (to.path === '/login') {
    //     next('/login');
    // } else {
    //     next();
    // }
    document.title = `${to.meta.title} | Mr.Su个人博客后台管理系统`;
    const role = sessionStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
