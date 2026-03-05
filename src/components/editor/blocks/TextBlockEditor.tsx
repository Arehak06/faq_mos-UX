import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { TextBlock } from '../../../types/blocks';

interface Props {
  block: TextBlock;
  onUpdate: (block: TextBlock) => void;
  onRemove: () => void;
}

export function TextBlockEditor({ block, onUpdate, onRemove }: Props) {
  const editorRef = useRef<Editor>(null);
  const handleChange = () => {
    if (editorRef.current) {
      onUpdate({ ...block, text: editorRef.current.getInstance().getHTML() });
    }
  };

  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Текст</strong>
        <button className="danger" onClick={onRemove}>🗑</button>
      </div>
      <Editor
        ref={editorRef}
        initialValue={block.text}
        previewStyle="tab"
        height="300px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        language="ru"
        onChange={handleChange}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['table', 'image'],
          ['link'],
          ['code', 'codeblock'],
        ]}
      />
    </div>
  );
}