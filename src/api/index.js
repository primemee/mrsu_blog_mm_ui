import request from '../utils/request';

const ARTICLEAPI = "article";
const API_VERSION = "/v1";

//上传图片
export function upload (data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/upload",
    method: "post",
    data
  });
}

//获取文章列表
export function getArticleList (data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/article_list",
    method: "post",
    data
  });
}

//根据文章id获取详情
export function getArticleListById (params) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/select/${params}`,
    method: "get"
  });
}

//新增文章
export function aricleAdd (data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/add",
    method: "post",
    data
  });
}

//修改文章
export function aricleUpdate (data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/update",
    method: "post",
    data
  });
}

//删除文章
export function aricleDelById (params) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/del/${params}`,
    method: "get"
  });
}

//获取用户信息详情
export function getUserInfo (data) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/admin_list`,
    method: "post",
    data
  });
}

//更新用户信息
export function updateUserInfo (data) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/admin_update`,
    method: "post",
    data
  });
}

//获取用户基本信息
export function getUserInfoById (params) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/admin_select/${params}`,
    method: "get",
  });
}




