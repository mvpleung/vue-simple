const Config = {
  prod: 'http://localhost:9000', //Production
  uat: 'http://localhost:9000', //UAT
  sit: 'http://localhost:9000', //SIT
  dev: 'http://localhost:9000' //DEV
};

const REQUEST_URL = Config[process.env.ENV_CONFIG];

const Url = {
  baseUrl: `${REQUEST_URL}/api`,

  /**资源路径 */
  asserts: `${REQUEST_URL}/asserts`
};
export default Url;
