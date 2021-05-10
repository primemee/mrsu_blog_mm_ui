import request from "@/utils/request";

const ARTICLEAPI = "article";
const API_VERSION = "/v1";

//登录
export function login (data) {
  return request({
    url: ARTICLEAPI + API_VERSION + "/admin_login",
    method: "post",
    data
  });
}