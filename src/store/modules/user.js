/*
 * 用户信息Module
 * @Author: liangzc 
 * @Date: 2018-01-18 11:30:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 14:48:32
 */
import { LOGIN, LOGOUT, UPDATE_USER, CHECK_USER_INFO } from '@/store/types.js';
const user = {
  state: {
    token: null, //令牌
    user: null //用户信息
  },
  getters: {
    openId: (state, getters) => (getters.user || {}).openid, //微信openId
    userId: (state, getters) => (getters.user || {}).userId, //支付宝userId
    isLogin: (state, getters) => {
      //是否登录，校验本地存储的 openid
      let user = getters.user;
      return user && !Vue.$utils.isEmpty(user.openid);
    },
    user: state =>
      state.user ||
      (state.user = Vue.$utils.getLocalStorage('u_info', {
        exp: 60 * 60 * 24 * 7,
        force: true,
        needDecipher: true
      })) ||
      {}
  },
  mutations: {
    /**
     * 触发登录，暂时闲置
     */
    [LOGIN]: (state, data) => {
      localStorage.token = data;
      state.token = data;
    },
    /**
     * 触发登出，暂时闲置
     */
    [LOGOUT]: state => {
      localStorage.removeItem('token');
      state.token = null;
    },
    /**
     * 更新本地用户缓存(包含有效时间,默认7天)
     */
    [UPDATE_USER]: (state, userInfo) => {
      Vue.$utils.setLocalStorage('u_info', state.user = userInfo, {
        exp: 60 * 60 * 24 * 7,
        needCipher: true
      });
    }
  },
  actions: {
    /**
     * 登录事件
     * @param {*} commit module
     * @param {String} token 登录令牌
     */
    [LOGIN]({ commit }, token) {
      commit(LOGIN, token);
    },
    /**
     * 登出事件
     */
    [LOGOUT]({ commit }) {
      commit(LOGOUT);
    },
    /**
     * 更新缓存用户信息
     * @param {*} commit module
     * @param {Object} userInfo 用户信息
     */
    [UPDATE_USER]({ commit }, userInfo) {
      commit(UPDATE_USER, userInfo);
    },
    /**
     * 检测本地用户信息是否已经过期（默认七天）
     * @param {Store} context store module
     */
    [CHECK_USER_INFO](context) {
      return new Promise((resolve, reject) => {
        let userInfo = Vue.$utils.getLocalStorage('u_info', {
          exp: 60 * 60 * 24 * 7,
          needDecipher: true
        });
        if (userInfo && userInfo.expire) {
          //已过期，重新获取数据
          reject({ message: '用户信息已过期' });
        } else {
          resolve();
        }
      });
    }
  }
};

export default user;
