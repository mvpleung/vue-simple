import Vue from 'vue';
import Router from 'vue-router';
import RouterConfig from '@/router/config.json';
import store from '@/store';
import * as Types from '@/store/types';
Vue.use(Router);

String.prototype.startWith = function(str, ignoreCase) {
  if (
    !str ||
    str === '' ||
    str === null ||
    this.length === 0 ||
    str.length > this.length
  ) {
    return false;
  }
  if (
    ignoreCase &&
      this.toUpperCase().substr(0, str.length) === str.toUpperCase() ||
    !ignoreCase && this.substr(0, str.length) === str
  ) {
    return true;
  }
  return false;
};

let camelCase = value => {
  let result = value
    .replace(/\d/gm, '')
    .replace(/[-|_](\w)/g, function($0, $1) {
      return $1.toUpperCase();
    })
    .replace(/[-|_]/gm, '');
  return result.substring(0, 1).toLowerCase() + result.substring(1);
};

const initRoute = rt => {
  let parentPath =
      rt.component.startWith('components') || rt.component.startWith('pages') ?
        '' :
        'pages',
    route = {
      name: rt.name,
      path: rt.path,
      // component: resolve => require([`@/${parentPath}${rt.component}`], resolve), //懒加载
      component: () => import(`@/${parentPath}${rt.component}`), //按需加载
      redirect: rt.redirect,
      meta: {
        title: rt.title || rt.name,
        description: rt.description
      }
    };
  route.meta = Object.assign({}, route.meta, rt.meta);
  return route;
};
let vues = require
  .context('@/pages', true, /^((?!common|components).)*\.vue$/)
  .keys(); //自动扫描所有vue文件
const registerRoute = config => {
  let routes = [],
    index = -1;
  config.forEach(page => {
    //处理手动配置路由
    if ((index = vues.indexOf(`.${page.component}.vue`)) !== -1) {
      vues.splice(index, 1);
    }
    let route = initRoute(page);
    if (page.children && page.children.length > 0) {
      //子路由
      let children = [];
      page.children.map(child => {
        children.push(initRoute(child));
      });
      route.children = children;
    }
    routes.push(route);
  });

  //处理自动扫描vue
  let redirectArray = [];
  vues.forEach(vue => {
    const execs = vue.substring(2, vue.length - 4).split('/'),
      parentPath = vue.substring(1, vue.lastIndexOf('/'));
    if (execs.length > 1 && redirectArray.indexOf(parentPath) < 0) {
      routes.push({
        path: parentPath,
        redirect: `${parentPath}/index`
      });
      redirectArray.push(parentPath);
    }
    routes.push({
      name: camelCase((execs.slice(-2, -1) || '') + '_' + execs.slice(-1)),
      path: vue.substring(1, vue.length - 4) + '/:title?',
      component: () => import(`@/pages${vue.substring(1)}`),
      meta: {
        requireAuth: true
      }
    });
  });
  redirectArray = null;
  return routes;
};
const routes = registerRoute(RouterConfig);
routes.push({
  path: '/',
  redirect: '/homePage'
});

const router = new Router({
  routes
});
router.beforeEach((to, from, next) => {
  router.app.$indicator.close();
  from.path === '/' ?
    document.title = to.meta.title || to.params.title || document.title :
    document.setTitle(to.meta.title || to.params.title || document.title);
  navigationBehavior(from, to);
  if (
    ($globalConfig.navigator.isWechat || $globalConfig.navigator.isAlipay) && //判断该路由是否需要登录权限
    to.matched.some(r => r.meta.requireAuth)
  ) {
    if (store.getters.isLogin) {
      //通过vuex state 判断是否登录
      store
        .dispatch(Types.CHECK_USER_INFO)
        .then(() => {
          next();
        })
        .catch(err => {
          //本次存储信息过期，重新获取
          console.error(err);
          next(oauth(to));
        });
    } else {
      //未登录，触发授权登录事件
      next(oauth(to));
    }
  } else {
    next();
  }
});

router.afterEach(route => {
  Vue.nextTick(() => {
    //滚动位置保持
    setTimeout(() => {
      let position = store.getters.scrollMap[location.hash] || {};
      scrollTo(position.x, position.y);
    }, 100);
  });
});

/**
 * 跳转授权
 * @param {Router} to 目标路由
 */
let oauth = to => {
  return {
    path: '/oauth',
    query: Object.assign({}, { redirect: to.fullPath }, to.query)
  };
};

/**
 * 存储滚动位置
 * @param {String} path  路径
 * @param {Number} scroll 滚动距离
 */
let saveHashScroll = (path, scroll) => {
  store.dispatch(Types.SAVE_HASH_SCROLL, { hash: '#' + path, scroll: scroll });
};

/**
 * 处理路由导航
 * @param {Router} from
 * @param {Router} to
 */
let navigationBehavior = (from, to) => {
  //存储滚动距离
  saveHashScroll(from.fullPath, {
    x: window.pageXOffset,
    y: window.pageYOffset
  });
  //缓存路由信息，用于前进 or 后退识别
  let routeLength = store.getters.chainLength;
  if (routeLength === 0) {
    store.dispatch(Types.SET_PAGE_DIRECTION, 'fade');
    if (to.path === from.path && to.path === '/') {
      //当直接打开根路由的时候
      store.dispatch(Types.ADD_ROUTE_CHAIN, to);
    } else {
      //直接打开非根路由的时候其实生成了两个路径，from其实就是根路由
      store.dispatch(Types.ADD_ROUTE_CHAIN, [from, to]);
    }
  } else if (routeLength === 1) {
    forward(to);
  } else {
    let lastBeforeRoute = store.getters.routeChain[routeLength - 2];
    if (lastBeforeRoute.path === to.path) {
      //返回
      store.dispatch(Types.POP_ROUTE_CHAIN);
      store.dispatch(Types.SET_PAGE_DIRECTION, 'slide-right');
    } else {
      //前进
      forward(to);
    }
  }
};

/**
 * 前进路由
 * @param {Router} route
 */
let forward = route => {
  saveHashScroll(route.fullPath, { x: 0, y: 0 }); //前进时，滚动到顶部
  store.dispatch(Types.SET_PAGE_DIRECTION, 'slide-left');
  store.dispatch(Types.ADD_ROUTE_CHAIN, route);
};

export default router;
