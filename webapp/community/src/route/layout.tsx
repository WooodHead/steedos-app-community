import React from 'react';

import {inject, observer} from 'mobx-react';
import {IMainStore} from '../store';
import {RouteComponentProps} from 'react-router-dom';

const Navigation = React.lazy(() => import('./navigation'));

export default inject('store')(
    observer(function ({store, location, history, match}: {store: IMainStore} & RouteComponentProps<{id: string}>) {
        const index: string = match.params.id;
        let pageSchema: any = {};
        // store.communities.forEach(function(value, key){
        //     pageSchema = JSON.parse(value.pages[0].schema)
        // })
        return (
            <Navigation></Navigation>
        );
    })
);