import { useState } from "react";

export default function Main() {
  const [blob, setBlob] = useState({src: null, w: 0, h: 0});

  const onPaste = event => {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // will give you the mime types
    var index = 0;
    for (index in items) {
      var item = items[index];
      if (item.kind === 'file') {
        var blob = item.getAsFile();
        var reader = new FileReader();
        reader.onload = function(event){
          // console.log(event.target.result); // data url!
          console.log("Event", event)
          setBlob({...blob, src: event.target.result});
        }
        reader.readAsDataURL(blob);
      }
    }
  }

  const renderOptions = () => {
    return (
      <div className="fixed top-0 left-0 flex items-center justify-center w-full">
        <div className="inline-flex px-8 py-3 mt-10 bg-gray-300/50 backdrop-blur rounded-xl">
          Options
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-center h-full min-h-screen p-10 bg-white"
      onPaste={onPaste}
    >
      {blob?.src ? (
        <div
          style={blob?.w ? { width: blob?.w / window.devicePixelRatio } : {}}
          className="max-w-[60vw] mt-20 p-10 bg-gradient-to-br from-green-200 to-yellow-200 rounded-xl"
        >
          {/* {console.log("Width", blob.naturalwidth)} */}
          <img
            src={blob?.src}
            className="shadow-xl rounded-xl"
            onLoad={(e) => {
              setBlob({
                ...blob,
                w: e.target.naturalWidth,
                h: e.target.naturalHeight,
              });
              console.log("Img e", e);
            }}
          />
        </div>
      ) : (
        <span className="text-3xl opacity-50">
          Paste your screenshot, or click to upload
        </span>
      )}
      {renderOptions()}
    </div>
  );
}