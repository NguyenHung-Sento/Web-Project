import React, { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor = ({ label, value, changeValue, nameKey, invalidFields, setInvalidFields }) => {
  const handleFocus = () => {
    setInvalidFields(prev => prev.filter(el => el.name !== nameKey));
  };

  return (
    <div className="flex flex-col">
      <span className="font-semibold">{label}</span>
      <Editor
        apiKey={process.env.REACT_APP_MCETINY}
        value={value}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          setup: (editor) => {
            editor.on('KeyDown', (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                editor.execCommand('InsertParagraph');
              }
            });
          }
        }}
        onEditorChange={(content) => changeValue(prev => ({ ...prev, [nameKey]: content }))}
        onFocus={setInvalidFields && handleFocus}
      />
      {invalidFields?.some(el => el.name === nameKey) && (
        <small className="text-red-500 text-sm">
          {invalidFields.find(el => el.name === nameKey)?.mes + `${nameKey}`}
        </small>
      )}
    </div>
  );
}

export default memo(MarkdownEditor);
