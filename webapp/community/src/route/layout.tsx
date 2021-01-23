import React from 'react';

import { inject, observer } from 'mobx-react';
import { IMainStore } from '../store';
import { Switch, HashRouter, Route, Redirect } from 'react-router-dom';

import Layout from '../component/layout';

const LayoutInRouter = ({component: Component, ...rest}: any) => {
    if (!Component) return null;

    const { store } = rest.props

    return (
      <Route
          {...rest}
          render={(props) => (
              <Layout navigations={store.navigations} logo={store.logo} userInfo={store.userInfo} {...props}>
                  <Component {...props}/>
              </Layout>
          )}
      />
      )}
  ;

export default LayoutInRouter;