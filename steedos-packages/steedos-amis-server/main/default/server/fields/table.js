const Tpl = require('../tpl');

function getTableColumns(fields){
    const columns = [];
    _.each(fields, function(field){

        const tpl = Tpl.getFieldTpl(field);

        let type = 'text';
        if(tpl){
            type = 'tpl';
        }

        columns.push({
            name: field.name,
            label: field.label,
            sortable: field.sortable,
            searchable: field.searchable,
            type: type,
            tpl: tpl,
            // toggled: true 
        })
    });
    return columns;
}

exports.getTableSchema = function(fields, options){
    return {
        mode: "table",
        name: "thelist",
        draggable: false,
        headerToolbar: ['switch-per-page', 'pagination'],
        columns: getTableColumns(fields)
    }
}