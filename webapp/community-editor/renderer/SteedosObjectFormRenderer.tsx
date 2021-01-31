import {Renderer} from 'amis';
import {isApiOutdated, isEffectiveApi} from 'amis/lib/utils/api';
import {
  promisify,
  difference,
  until,
  noop,
  isObject,
  isVisible,
  cloneObject,
  SkipOperation,
  isEmpty
} from 'amis/lib/utils/helper'
import { RendererProps } from 'amis/lib/factory';
import React from 'react';
import AMISRenderer from '../component/AMISRenderer';

export interface MyRendererProps extends RendererProps {
  target?: string;
}

@Renderer({
  test: /\bsteedos-object-form-renderer$/,
  name: 'steedos-object-form-renderer'
})
export default class SteedosObjectFormRenderer extends React.Component<MyRendererProps> {
  static defaultProps = {
    target: 'world sobject form',
    schema: {"type":"page","body":{}},
    initApi: "/api/amis/schema"
  }

  constructor(props: any) {
    super(props);
    const store = props.store;
    if(store){
      store.syncProps(props, undefined, ['schema']);
    }
  }

  componentDidMount() {
    const {
      initApi,
      initFetch,
      initFetchOn,
      objectName,
      recordId,
      readonly,
      server,
      store,
    } = this.props;
    if(store){
      const {fetchInitData , data, setSchema} = store as any
      if(fetchInitData && objectName && recordId){
        let _api = `${initApi}/${objectName}/${recordId}`;
        if(server){
          _api = `${server}${_api}`;
        }
        if(readonly){
          _api = `${_api}?readonly`
        }
        if (isEffectiveApi(_api, data, initFetch, initFetchOn)) {
          fetchInitData(_api, data, {});
        }
      }
    }
  }

  render() {
    let {
      store,
      schema
    } = this.props;
    console.log('this.props', this.props, store);
    if(store && store.data && store.data.schema){
      schema = store.data.schema;
    }
    // if(object_name){
    //   store.fetchInitData()
    // }
    // return (
    //   <AMISRenderer schema={schema} />
    // );
    return (
      <AMISRenderer schema={schema} />
    );
  }
}