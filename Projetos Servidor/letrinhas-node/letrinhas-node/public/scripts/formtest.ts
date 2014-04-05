var lastId = 0;

document.addEventListener('DOMContentLoaded', function (_) {
    document.getElementById('add-file')
        .addEventListener('click', function (evt) {
            console.log('Inserting a new input file tag');

            var newFileId = 'file-' + (++lastId);

            document.getElementById('file-input-container')
                .insertAdjacentHTML(
                    'beforeend', 
                    '<input type="file" name="' + newFileId + '" />'
                );

            document.getElementById('correct-id-selector')
                .insertAdjacentHTML(
                    'beforeend', 
                    '<option value="' + newFileId + '">' + newFileId + '</option>'
                );

            evt.preventDefault();
        }
    ); 
});