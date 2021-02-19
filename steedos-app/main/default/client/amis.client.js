;(function() {
  // try {
  //   var sdk = document.createElement("script");
  //   sdk.src = "/amis-sdk/sdk.js";
  //   var s = document.getElementsByTagName("script")[0]; 
  //   s.parentNode.insertBefore(sdk, s);
  //   let amis = amisRequire('amis/embed');
  //   console.log('amis', amis);
  // } catch (error) {
  //   console.log(error);
  // }
  import("/amis-sdk/sdk.js").then(()=>{
    console.log('amisRequire', amisRequire);
    window.SteedosAmis = amisRequire('amis/embed');
    let amisLib = amisRequire('amis');
    let React = amisRequire('react');

    // 自定义组件，props 中可以拿到配置中的所有参数，比如 props.label 是 'Name'
    function CustomComponent(props) {
      let dom = React.useRef(null);
      React.useEffect(function () {
        // 从这里开始写自定义代码，dom.current 就是新创建的 dom 节点
        // 可以基于这个 dom 节点对接任意 JavaScript 框架，比如 jQuery/Vue 等
        dom.current.innerHTML = 'custom';
        // 而 props 中能拿到这个
      });
      return React.createElement('div', {
        ref: dom
      });
    }

    //注册自定义组件，请参考后续对工作原理的介绍
    amisLib.Renderer({
      test: /(^|\/)my-custom/
    })(CustomComponent);

    window.getSObjectAmisFormSchema = function(objectName, recordId, readonly){
      let api = `/api/amis/schema/${objectName}/${recordId}?t=${(new Date()).getTime()}`;
      if(readonly){
        api = `${api}&readonly`;
      }
      return Steedos.authRequest(api, {async: false}).schema;
    }

    window.getSObjectListSchema = function(objectName, listview, fields, options){
      let api = `/api/amis/list/${objectName}`;
      let urlSearch = new URLSearchParams();
      if(listview){
        urlSearch.append('list_view', listview);
      }
      if(fields){
        urlSearch.append('fields', fields);
      }
      _.each(options, function(option, key){
        urlSearch.append(key, option);
      })
      urlSearch.append('t', (new Date()).getTime());
      return Steedos.authRequest(`${api}/?${urlSearch.toString()}`, {async: false}).schema;
    }

    window.AmisEmbed = function(tagger, schema){
      $(tagger).children().remove();
      $(tagger).append(`<div class='${schema.name}'></div>`)
      return SteedosAmis.embed(`.${schema.name}`, schema, null, {
        jumpTo: (to, link) => { console.log('jumpTo', to);
        if(link && link.blank){
          return window.open(to);
        }
        if(FlowRouter.current().path == to){FlowRouter.reload()}else{FlowRouter.go(to);}},
        updateLocation: (to, replace) => {console.log('updateLocation', to, replace)}
      });
    }

});
})();