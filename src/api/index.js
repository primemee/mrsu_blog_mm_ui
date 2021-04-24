import request from '../utils/request';

const ARTICLEAPI = "article";
const API_VERSION = "/v1";

export function upload(data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/upload",
    method: "post",
    data
  });
}

export function getArticleList(data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/article_list",
    method: "post",
    data
  });
}

export function getArticleListById(params) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/select/${params}`,
    method: "get"
  });
}

export function aricleAdd(data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/add",
    method: "post",
    data
  });
}

export function aricleUpdate(data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/update",
    method: "post",
    data
  });
}

export function aricleDelById(params) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/del/${params}`,
    method: "get"
  });
}

export function getUserInfo(data) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/admin_list`,
    method: "post",
    data
  });
}

export function updateUserInfo(data) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/admin_update`,
    method: "post",
    data
  });
}

export function getUserInfoById(params) {
  return request({
    url: ARTICLEAPI + API_VERSION + `/admin_select/${params}`,
    method: "get",
  });
}




