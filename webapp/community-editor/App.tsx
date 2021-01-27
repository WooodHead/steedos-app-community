import React from 'react';
import {Provider} from 'mobx-react';
import {toast, alert, confirm} from 'amis';
import axios from 'axios';
import {MainStore} from './store/index';
import RootRoute from './route/index';
import copy from 'copy-to-clipboard';

export default function(): JSX.Element {
    const store = ((window as any).store = MainStore.create(
        {},
        {
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
            isCancel: (e: any) => axios.isCancel(e),
            notify: (type: 'success' | 'error' | 'info', msg: string) => {
                toast[type]
                    ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                    : console.warn('[Notify]', type, msg);
                console.log('[notify]', type, msg);
            },
            alert,
            confirm,
            copy: (contents: string, options: any = {}) => {
                const ret = copy(contents, options);
                ret && (!options || options.shutup !== true) && toast.info('内容已拷贝到剪切板');
                return ret;
            },
            rootUrl: ()=>{
                //TODO 动态赋值 build 时，需要先手动注释此代码
                // return "http://127.0.0.1:8088";
                return "";
            }
        }
    ));

    return (
        <Provider store={store}>
            <RootRoute store={store}/>
        </Provider>
    );
}
