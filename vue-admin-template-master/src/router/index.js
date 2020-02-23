import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/regulationsList',
    name: 'Example',
    meta: { title: '法规管理', icon: 'component' },
    children: [
      {
        path: 'regulationsTrype',
        name: 'RegulationsTrype',
        component: () => import('@/views/RegulationsTrype/index'),
        meta: { title: '分类列表', icon: 'table' }
      },
      {
        path: 'regulationsList',
        name: 'RegulationsList',
        component: () => import('@/views/regulations-list/index'),
        meta: { title: '法规列表', icon: 'table' }
      },
      {
        path: 'addRegulations',
        name: 'AddRegulations',
        component: () => import('@/views/addRegulations/index'),
        meta: { title: '新增法规', icon: 'form' },
        hidden:true
      },
      {
        path: 'updateRegulations',
        name: 'UpdateRegulations',
        component: () => import('@/views/addRegulations/updateRegulations'),
        meta: { title: '修改法规', icon: 'form' },
        hidden: true
      },
      {
        path: 'directoryManage',
        name: 'Directory',
        component: () => import('@/views/directoryManage/index'),
        meta: { title: '法规目录管理', icon: 'table' }
      },
      {
        path: 'clauseList',
        name: 'AlauseList',
        component: () => import('@/views/clauseList/index'),
        meta: { title: '条款列表', icon: 'table' }
      },
      {
        path: 'addClause',
        name: 'AddClause',
        component: () => import('@/views/addClause/index'),
        meta: { title: '新增条款', icon: 'form' },
        hidden: true
      },
      {
        path: 'updateClause',
        name: 'UpdateClause',
        component: () => import('@/views/addClause/updateClause'),
        meta: { title: '修改条款', icon: 'form' },
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/userList',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'userList',
        name: 'UserList',
        component: () => import('@/views/userList/index'),
        meta: { title: '用户列表', icon: 'peoples' }
      },
      {
        path: 'xxx'
      }
    ]
  },
  {
    path: '/consult',
    component: Layout,
    redirect: '/consult/consultList',
    name: 'User',
    meta: { title: '咨询管理', icon: 'message' },
    children: [
      {
        path: 'consultList',
        name: 'ConsultList',
        component: () => import('@/views/consultList/index'),
        meta: { title: '咨询列表', icon: 'phone' }
      },
      {
        path: 'xxx'
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/websetting',
    name: 'Setting',
    meta: { title: '设置', icon: 'table' },
    children: [
      {
        path: '/websetting',
        name: 'websetting',
        component: () => import('@/views/websetting/index'),
        meta: { title: '网站设置', icon: 'international' }
      },
      {
        path: '/aboutus',
        name: 'aboutus',
        component: () => import('@/views/aboutus/index'),
        meta: { title: '公司介绍', icon: 'instructions' }
      },
      {
        path: '/serviceAgreement',
        name: 'serviceAgreement',
        component: () => import('@/views/serviceAgreement/index'),
        meta: { title: '服务协议', icon: 'documentation' }
      },
      {
        path: '/smtp',
        name: 'smtp',
        component: () => import('@/views/smtp/index'),
        meta: { title: '邮件SMTP设置', icon: 'email' }
      },
      {
        path: '/note',
        name: 'note',
        component: () => import('@/views/note/index'),
        meta: { title: '短信设置', icon: 'tongxun' }
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员管理', icon: 'user' }
      },
      {
        path: '/feedback',
        name: 'feedback',
        component: () => import('@/views/feedback/index'),
        meta: { title: '意见反馈列表', icon: 'edit' },
      }

    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
