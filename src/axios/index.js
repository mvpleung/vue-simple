import axios from 'axios';
import router from '@/router';
import store from '@/store';
import { LOGOUT, UPDATE_CONFIG } from '@/store/types.js';
import Url from '@/axios/urls';

// # axios 请求额外参数

// axios({

//  silence: false 是否静默请求，静默状态下，不弹出 loading 框，不提示错误信息

//  errorHandle：false  是否手动处理错误信息，为 true 时，不提示错误信息，需要手动实现 catch

//  response: false  是否返回全部请求信息，为 true 时，返回response 信息，包括http 请求信息,为 false 时，仅返回 data 数据

// })

/**更新全局配置  */
store.dispatch(UPDATE_CONFIG, {
  url: Url
});
// axios.defaults.withCredentials = true; //暂时屏蔽Http单实例
!$globalConfig.debug && (axios.defaults.baseURL = Url.baseUrl); //debug模式用 proxyTable 实现跨域请求
axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
let source = axios.CancelToken.source();
axios.interceptors.request.use(
  config => {
    !config.silence && store._vm.$indicator.open(); //config.silence:是否静默
    let _configData = config.data || config.params || {};
    _configData['platform'] = $globalConfig.navigator.ua;
    if (
      config.method === 'post' &&
      config.headers.post &&
      config.headers.post['Content-Type'] === 'application/json;charset=utf-8'
    ) {
      //POST JSON字符串
      if (config.data instanceof FormData) {
        _configData = { [_configData.platform]: _configData.platform };
        config.data.forEach((value, key) => (_configData[key] = value));
      }
      config.data = JSON.stringify(_configData || {});
    } else {
      config.params && (config.params = _configData);
      config.data && (config.data = _configData);
    }
    $globalConfig.console && console.log('[url:::]', config.url);
    $globalConfig.console && console.log('[send:::]', _configData);
    config.cancelToken = source.token;
    return config;
  },
  err => {
    if (!(err.config && err.config.silence)) {
      //config.silence:是否静默
      store._vm.$indicator.close();
      !(err.config || {}).errorHandle && store._vm.$toast(err.message);
    }
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    !(response.config && response.config.silence) &&
      store._vm.$indicator.close();
    $globalConfig.console &&
      console.log(
        '[response:::]',
        response.config.response === true ? response : response.data
      );
    let msg = !response.data ?
      '请求异常，请重试' :
      response.data.ret === 0 ?
        null :
        response.data.errmsg || '响应失败，请重试';
    if (msg) {
      if (response.data && response.data.ret === '4') {
        source.cance(data.msg || '登录超时，请重新登录');
        store.dispatch(LOGOUT);
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.fullPath }
        });
      } else {
        !(response.config && response.config.silence) &&
          !(response.config || {}).errorHandle &&
          store._vm.$toast(msg); //config.silence:是否静默
      }
      return Promise.reject({
        message: msg,
        data: (response.data || {}).data,
        code: (response.data || {}).ret
      });
    }
    return response.config.response === true ? response : response.data;
  },
  error => {
    let errMsg =
      error.message && error.message.indexOf('timeout') !== -1 ?
        '请求超时，请重试' :
        error.message;
    if (!(error.config && error.config.silence)) {
      //config.silence:是否静默
      store._vm.$indicator.close();
      !(error.config || {}).errorHandle && store._vm.$toast(errMsg);
    }
    $globalConfig.console && console.error(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.dispatch(LOGOUT);
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          });
          break;
        default:
          break;
      }
    }
    return Promise.reject({ message: errMsg });
  }
);
export default axios;
