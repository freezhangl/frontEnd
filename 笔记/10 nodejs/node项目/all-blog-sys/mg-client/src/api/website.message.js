

import {post} from "./http";

//关于博客留言信息
export const websiteMessageList = (data) =>
  post("/mg/api/public/web/websiteMessage/list", data);

//关于博客留言信息创建
export const websiteMessageCreate = (data) =>
  post("/mg/api/public/web/websiteMessage/create", data);

