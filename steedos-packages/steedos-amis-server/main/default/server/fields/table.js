function getTableColumns(fields){
    const columns = [];
    _.each(fields, function(field){
        columns.push({
            name: field.name,
            label: field.label,
            sortable: field.sortable,
            searchable: field.searchable,
            type: "text",
            // toggled: true 
        })
    })
}

exports.getTableSchema = function(fields, options){
    return {
        mode: "table",
        name: "thelist",
        draggable: false,
        headerToolbar: ['switch-per-page', 'pagination'],
        columns: [
            {
                "name": "_id",
                "label": "_id",
                "sortable": true,
                "searchable": true,
                "type": "text",
                "toggled": true
            },
            {
                "name": "name",
                "label": "Name",
                "sortable": true,
                "searchable": true,
                "type": "text",
                "toggled": true
            }
        ]
    }
}