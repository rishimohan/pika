import { useState } from "react";

export default function Main() {
  const [blob, setBlob] = useState({src: null, w: 0, h: 0});
  const [options, setOptions] = useState({
    aspectRatio: "aspect-auto",
    theme: "bg-white",
    padding: "p-0",
    rounded: "rounded-none",
    shadow: "shadow-none",
    
  });

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
        <div className="inline-flex px-8 py-3 mt-10 space-x-8 border border-gray-300 border-gray-400 shadow-xl bg-gray-400/50 dark:bg-gray-700/60 backdrop-blur rounded-xl dark:border-gray-500 shadow-black/20">
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">Aspect Ratio</div>
            <div>
              <select
                className="cursor-pointer"
                onChange={(e) =>
                  setOptions({ ...options, aspectRatio: e.target.value })
                }
              >
                <option value="aspect-auto">Auto</option>
                <option value="aspect-square">Square</option>
                <option value="aspect-video">9:16</option>
              </select>
            </div>
          </div>
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">Padding</div>
            <div>
              <select
                className="cursor-pointer"
                onChange={(e) =>
                  setOptions({ ...options, padding: e.target.value })
                }
              >
                <option value="p-0">None</option>
                <option value="p-10">Small</option>
                <option value="p-20">Medium</option>
                <option value="p-32">Large</option>
              </select>
            </div>
          </div>
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">Theme</div>
            <div>
              <select
                className="cursor-pointer"
                onChange={(e) =>
                  setOptions({ ...options, theme: e.target.value })
                }
              >
                <option value="bg-white">White</option>
                <option value="bg-black">Black</option>
                <option value="bg-gradient-to-br from-red-500 to-pink-600">
                  Evil
                </option>
                <option value="bg-gradient-to-br from-green-100 to-yellow-100">
                  Heaven
                </option>
              </select>
            </div>
          </div>
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">Rounded Corners</div>
            <div>
              <select
                className="cursor-pointer"
                onChange={(e) =>
                  setOptions({ ...options, rounded: e.target.value })
                }
              >
                <option value="rounded-none">None</option>
                <option value="rounded-lg">Small</option>
                <option value="rounded-xl">Medium</option>
                <option value="rounded-3xl">Large</option>
              </select>
            </div>
          </div>
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">Shadow</div>
            <div>
              <select
                className="cursor-pointer"
                onChange={(e) =>
                  setOptions({ ...options, shadow: e.target.value })
                }
              >
                <option value="shadow-none">None</option>
                <option value="shadow-lg">Small</option>
                <option value="shadow-xl">Medium</option>
                <option value="shadow-2xl">Large</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center h-full min-h-screen p-10 bg-gradient-to-br from-slate-200 to-slate-400 dark:from-gray-900 dark:to-gray-900/90"
      onPaste={onPaste}
    >
      {blob?.src ? (
        <div
          style={blob?.w ? { width: blob?.w / window.devicePixelRatio } : {}}
          className={
            "duration-300 ease-in-out flex items-center justify-center max-w-[60vw] mt-20 rounded-xl " +
            options?.theme +
            " " +
            options?.aspectRatio +
            " " +
            options?.padding
          }
        >
          <img
            src={blob?.src}
            className={`${options?.shadow} ${options?.rounded}`}
            onLoad={(e) => {
              setBlob({
                ...blob,
                w: e.target.naturalWidth,
                h: e.target.naturalHeight,
              });
            }}
          />
        </div>
      ) : (
        <span className="text-3xl opacity-50 dark:text-white">
          Paste your screenshot, or click to upload
        </span>
      )}
      {renderOptions()}
    </div>
  );
}