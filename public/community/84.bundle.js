(window.webpackJsonp=window.webpackJsonp||[]).push([[84],{1717:function(e,n,a){"use strict";a.r(n);var t=a(0),r=a.n(t),o=(a(1486),a(154)),c=a.n(o),s=a(223),i=a.n(s),p=a(31),l=a(221),u=a(78),d={fetcher:function(e){var n=e.url,a=e.method,t=e.data,r=e.responseType,o=e.config,s=e.headers;return(o=o||{}).withCredentials=!0,r&&(o.responseType=r),o.cancelExecutor&&(o.cancelToken=new c.a.CancelToken(o.cancelExecutor)),o.headers=s||{},"post"!==a&&"put"!==a&&"patch"!==a?(t&&(o.params=t),c.a[a](n,o)):(t&&t instanceof FormData?(o.headers=o.headers||{},o.headers["Content-Type"]="multipart/form-data"):!t||"string"==typeof t||t instanceof Blob||t instanceof ArrayBuffer||(t=JSON.stringify(t),o.headers=o.headers||{},o.headers["Content-Type"]="application/json"),c.a[a](n,t,o))},isCancel:function(e){return c.a.isCancel(e)},copy:function(e){i()(e),l.toast.success("内容已复制到粘贴板")}};n.default=Object(u.b)("store")(Object(u.c)((function(e){var n,a=e.store,t=(e.location,e.history,e.match,{});return a.loginPage&&(t=JSON.parse((null===(n=a.loginPage)||void 0===n?void 0:n.schema)||"{}")),r.a.createElement("div",null,Object(p.render)(t,{},d))})))}}]);