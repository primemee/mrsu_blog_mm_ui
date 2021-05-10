import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  //路由模式
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '系统首页' },
      children: [
        {
          path: '/dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/aricleList',
          component: () => import(/* webpackChunkName: "aricleList" */ '../views/AricleList.vue'),
          meta: { title: '文章管理' }
        },
        {
          path: '/aricleAdd',
          component: () => import(/* webpackChunkName: "aricleAdd" */ '../views/AricleAdd.vue'),
          meta: { title: '新增文章' }
        },

        {
          path: '/messageBoardMm',
          component: () => import(/* webpackChunkName: "messageBoardMm" */ '../views/MessageBoardMm.vue'),
          meta: { title: '留言管理' }
        },
        {
          path: '/aboutMe',
          component: () => import(/* webpackChunkName: "aboutMe" */ '../views/AboutMe.vue'),
          meta: { title: '关于我' }
        },
        {
          path: '/404',
          component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
          meta: { title: '404' }
        },
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
