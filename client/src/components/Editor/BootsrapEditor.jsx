import React, { useEffect, useMemo, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import the Quill styles

const BootsrapEditor = ({ setValue, value }) => {
  const editorRef = useRef(null);
  const [myEditor, setMyEditor] = useState(null)
  // const myEditor = useMemo(() => {
  //   if (
  //     editorRef.current &&
  //     editorRef?.current?.className != "ql-container ql-snow"
  //   ) {
  //     return new Quill(editorRef.current, {
  //       theme: "snow",
  //     });
  //   } else {
  //     return editorRef?.current;
  //   }
  // }, [editorRef.current]);

  
  useEffect(() => {
    let editorElement = null;
    const interval = setInterval(() => {
      if (
        editorRef?.current &&
        editorRef?.current?.className != "ql-container ql-snow"
      ) {
       editorElement = new Quill(editorRef.current, {
          theme: "snow",
        });
      } else {
        setMyEditor(editorElement);
        clearInterval(interval);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (myEditor) {
      myEditor?.on("text-change", function (delta, source) {
        var value = myEditor?.root?.innerHTML;
        setValue(value);
      });
    }
    return () => {
    };
  }, [myEditor]);

  
  useEffect(() => {
    if (
      value &&
      editorRef?.current &&
      editorRef?.current?.className == "ql-container ql-snow"
    ) {
      myEditor?.clipboard?.dangerouslyPasteHTML(value);
    }
  }, [value, myEditor]);
  
  return (
    <div>
      <div
        ref={editorRef}
        id="editor"
        style={{ height: "200px" }}
      ></div>
    </div>
  );
};

export default BootsrapEditor;
