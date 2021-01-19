import {Renderer} from 'amis';
import { RendererProps } from 'amis/lib/factory';
import React from 'react';
import AMISRenderer from '../component/AMISRenderer';

export interface MyRendererProps extends RendererProps {
  target?: string;
}

@Renderer({
  test: /\bsteedos-object-crud-renderer$/,
  name: 'steedos-object-crud-renderer'
})
export default class SteedosObjectCRUDRenderer extends React.Component<MyRendererProps> {
  static defaultProps = {
    target: 'world crud',
    schema: 
    {"type":"page","title":"TODO List","body":[{"type":"crud","api":{"method":"post","url":"http://127.0.0.1:8088/graphql","data":{"query":"{rows: todo {   id:_id   name   description   space   created   modified   is_deleted   deleted   instances   sharing   message_count   locked   instance_state   _table   created__label   modified__label   is_deleted__label   deleted__label   locked__label   instance_state__label }}"}},"columns":[{"name":"name","label":"Title","type":"text","placeholder":"-","quickEdit":{"mode":"popOver","saveImmediately":{"api":{"method":"put","url":"http://127.0.0.1:8088/api/v4/todo/${id}","data":null,"dataType":"json","replaceData":false,"requestAdaptor":"api.data = {\r\n    $set: {\r\n        name: api.data.name\r\n    }\r\n}"}}}},{"name":"description","label":"Description","type":"text","placeholder":"-","fixed":"","quickEdit":{"mode":"popOver"}}],"messages":{},"initFetch":true,"loadDataOnce":true,"filter":{"title":"查询条件","controls":[{"type":"text","name":"keywords","label":"关键字"}]},"quickSaveApi":{"method":"put","url":"http://127.0.0.1:8088/api/v4/todo/${id}"},"quickSaveItemApi":{"method":"put","url":"http://127.0.0.1:8088/api/v4/todo/${id}","data":null},"syncLocation":true}],"messages":{},"initApi":{"method":"post","url":"http://127.0.0.1:8088/graphql","dataType":"json","sendOn":"","data":{"query":"{rows: todo {   id:_id   name   description   space   created   modified   is_deleted   deleted   instances   sharing   message_count   locked   instance_state   _table   created__label   modified__label   is_deleted__label   deleted__label   locked__label   instance_state__label }}"}},"initFetch":true} 
  }

  

  render() {
    const {
      schema
    } = this.props;

    return (
      <AMISRenderer schema={schema} />
    );
  }
}