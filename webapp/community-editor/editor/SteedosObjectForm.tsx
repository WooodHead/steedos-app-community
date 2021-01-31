import React from 'react';
import {RendererEditor, BasicEditor} from 'amis-editor';

@RendererEditor('steedos-object-form-renderer', {
    name: 'Steedos Object Form name',
    description: 'Steedos Object Form description',
    // docLink: '/docs/renderers/Nav',
    type: 'steedos-object-form-renderer',
    previewSchema: {
        // 用来生成预览图的
        type: 'steedos-object-form-renderer',
        target: 'demo'
    },
    scaffold: {
        // 拖入组件里面时的初始数据
        type: 'steedos-object-form-renderer',
        target: '233'
    }
})
export default class SteedosObjectForm extends BasicEditor {
    tipName = 'Steedos Object Form';
    settingsSchema = {
        title: 'Steedos Object Form',
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
                                name: 'objectName',
                                label: '对象名',
                                type: 'text'
                            },
                            {
                                name: 'recordId',
                                label: '记录ID',
                                type: 'text'
                            },
                            {
                                name: 'readonly',
                                label: '只读',
                                type: 'switch'
                            },
                            {
                                name: 'server',
                                label: '服务地址',
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
}
