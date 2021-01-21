import React from 'react';

import 'amis/lib/themes/default.css';
// 或 import 'amis/lib/themes/cxd.css';
// 或 import 'amis/lib/themes/dark.css';

import axios from 'axios';
import copy from 'copy-to-clipboard';

import { render as renderAmis, ToastComponent, AlertComponent } from 'amis';
import { toast } from 'amis/lib/components/Toast';

import {inject, observer} from 'mobx-react';
import {IMainStore} from '../store';
import {RouteComponentProps} from 'react-router-dom';
// import {Layout, Switch, classnames as cx} from 'amis';
import Navigation from '../component/navigation';
import Layout from '../component/layout';
// amis 环境配置
const env = {
    // 下面三个接口必须实现
    fetcher: ({
        url, // 接口地址
        method, // 请求方法 get、post、put、delete
        data, // 请求数据
        responseType,
        config, // 其他配置
        headers // 请求头
    }: any) => {
        config = config || {};
        config.withCredentials = true;
        responseType && (config.responseType = responseType);

        if (config.cancelExecutor) {
            config.cancelToken = new (axios as any).CancelToken(
                config.cancelExecutor
            );
        }

        config.headers = headers || {};

        if (method !== 'post' && method !== 'put' && method !== 'patch') {
            if (data) {
                config.params = data;
            }
            return (axios as any)[method](url, config);
        } else if (data && data instanceof FormData) {
            config.headers = config.headers || {};
            config.headers['Content-Type'] = 'multipart/form-data';
        } else if (
            data &&
            typeof data !== 'string' &&
            !(data instanceof Blob) &&
            !(data instanceof ArrayBuffer)
        ) {
            data = JSON.stringify(data);
            config.headers = config.headers || {};
            config.headers['Content-Type'] = 'application/json';
        }

        return (axios as any)[method](url, data, config);
    },
    isCancel: (value: any) => (axios as any).isCancel(value),
    copy: (content: string) => {
        copy(content);
        toast.success('内容已复制到粘贴板');
    }

    // 后面这些接口可以不用实现

    // 默认是地址跳转
    // jumpTo: (
    //   location: string /*目标地址*/,
    //   action: any /* action对象*/
    // ) => {
    //   // 用来实现页面跳转, actionType:link、url 都会进来。
    // },

    // updateLocation: (
    //   location: string /*目标地址*/,
    //   replace: boolean /*是replace，还是push？*/
    // ) => {
    //   // 地址替换，跟 jumpTo 类似
    // },

    // isCurrentUrl: (
    //   url: string /*url地址*/,
    // ) => {
    //   // 用来判断是否目标地址当前地址
    // },

    // notify: (
    //   type: 'error' | 'success' /**/,
    //   msg: string /*提示内容*/
    // ) => {
    //   toast[type]
    //     ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
    //     : console.warn('[Notify]', type, msg);
    // },
    // alert,
    // confirm,
};

export default inject('store')(
    observer(function ({store, location, history, match}: {store: IMainStore} & RouteComponentProps<{id: string}>) {
        const pagePath: string = 'login';
        let pageSchema: any = {};
        if(store.loginPage){
            pageSchema = JSON.parse(store.loginPage?.schema || "{}");
        }
        return (
            <div>
                {renderAmis(
                        // 这里是 amis 的 Json 配置。
                        pageSchema,
                        {
                            // props...
                        },
                        env
                    )}
            </div>
        );
    })
);