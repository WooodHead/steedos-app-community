import React from 'react';

import 'amis/lib/themes/default.css';
// 或 import 'amis/lib/themes/cxd.css';
// 或 import 'amis/lib/themes/dark.css';

import { render as renderAmis, ToastComponent, AlertComponent } from 'amis';

import {inject, observer} from 'mobx-react';
import {IMainStore} from '../store';
import {RouteComponentProps} from 'react-router-dom';


export default inject('store')(
    observer(function () {
        return (
            <div>
                <ul className="flex">
                    <li className="mr-6">
                        <a className="text-blue-500 hover:text-blue-800" href="#">Active</a>
                    </li>
                    <li className="mr-6">
                        <a className="text-blue-500 hover:text-blue-800" href="#">Link</a>
                    </li>
                    <li className="mr-6">
                        <a className="text-blue-500 hover:text-blue-800" href="#">Link</a>
                    </li>
                    <li className="mr-6">
                        <a className="text-gray-400 cursor-not-allowed" href="#">Disabled</a>
                    </li>
                </ul>
            </div>
        );
    })
);