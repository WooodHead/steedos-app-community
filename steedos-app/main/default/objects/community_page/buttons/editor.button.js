module.exports = {
    editor: function(object_name, record_id) {
        window.open(`http://127.0.0.1:8082/?id=${record_id}`, 'newwindow-' + record_id, 'top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
    }
}