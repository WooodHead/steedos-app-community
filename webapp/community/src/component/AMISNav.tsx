import {schema2component} from './AMISRenderer';

export default schema2component(
    {
        "type": "page",
        "body": {
          "type": "nav",
          "stacked": false,
          "links": [
            {
              "label": "Nav 1",
              "to": "/docs/index",
              "icon": "fa fa-user"
            },
            {
              "label": "Nav 2",
              "to": "/docs/api"
            },
            {
              "label": "Nav 3",
              "to": "/docs/renderers"
            }
          ]
        }
      },
    ({onConfirm, pages, ...rest}: any) => {
        return {
            ...rest,
            data: {
                pages
            },
            onConfirm: (values: Array<any>) => onConfirm && onConfirm(values[0])
        };
    }
);
