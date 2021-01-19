import React from 'react';
import {RendererEditor, BasicEditor} from 'amis-editor';

@RendererEditor('steedos-object-crud-renderer', {
    name: 'Steedos Object CRUD name',
    description: 'Steedos Object CRUD description',
    // docLink: '/docs/renderers/Nav',
    type: 'steedos-object-crud-renderer',
    previewSchema: {
        // 用来生成预览图的
        type: 'steedos-object-crud-renderer',
        target: 'demo'
    },
    scaffold: {
        // 拖入组件里面时的初始数据
        type: 'steedos-object-crud-renderer',
        target: '233'
    }
})
export default class SteedosObjectCRUD extends BasicEditor {
    tipName = 'Steedos Object CRUD';
    settingsSchema = {
        title: 'Steedos Object CRUD',
        controls: [
            {
                type: 'tabs',
                tabsMode: 'line',
                className: 'm-t-n-xs',
                contentClassName: 'no-border p-l-none p-r-none',
                tabs: [
                    {
                        title: '常规',
                        controls: [
                            {
                                name: 'limit',
                                label: '记录数',
                                type: 'number'
                            },
                            {
                                name: 'object_name',
                                label: '对象名',
                                type: 'text'
                            },
                            {
                                name: 'list_view',
                                label: '默认列表视图',
                                type: 'text'
                            }
                        ]
                    },

                    {
                        title: '外观',
                        controls: [{
                            name: 'className',
                            label: 'className',
                            type: 'text'
                        }]
                    }
                ]
            }
        ]
    };

    // 配置表单一些简单的基本上够用了。
    // 还有一些逻辑可以复写来自定义的，但是我现在没时间写说明了。
}
