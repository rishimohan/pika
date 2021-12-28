import { useEffect, useRef, useState } from "react";
import domtoimage from "dom-to-image";

export default function Main() {
  const wrapperRef = useRef();
  const [blob, setBlob] = useState({src: null, w: 0, h: 0});
  const [options, setOptions] = useState({
    aspectRatio: "aspect-auto",
    theme: "bg-white",
    padding: "p-0",
    rounded: "rounded-none",
    shadow: "shadow-none",
    
  });

  useEffect(() => {
    const preset = localStorage.getItem("options");
    if(preset) {
      console.log("Preset exists", JSON.parse(preset))
      setOptions(JSON.parse(preset));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options])

  const snapshotCreator = () => {
    return new Promise((resolve, reject) => {
      try {
        const scale = window.devicePixelRatio;
        const element = wrapperRef.current; // You can use element's ID or Class here
        domtoimage
          .toBlob(element, {
            height: element.offsetHeight * scale,
            width: element.offsetWidth * scale,
            style: {
              transform: "scale(" + scale + ")",
              transformOrigin: "top left",
              width: element.offsetWidth + "px",
              height: element.offsetHeight + "px",
            },
          })
          .then((blob) => {
            resolve(blob);
          });
      } catch (e) {
        reject(e);
      }
    });
  };

  const saveImage = async () => {
    const scale = window.devicePixelRatio;
    domtoimage.toPng(wrapperRef.current, {
      height: wrapperRef.current.offsetHeight * scale,
      width: wrapperRef.current.offsetWidth * scale,
      style: {
        transform: "scale(" + scale + ")",
        transformOrigin: "top left",
        width: wrapperRef.current.offsetWidth + "px",
        height: wrapperRef.current.offsetHeight + "px",
      },
    }).then(async data => {
      var a = document.createElement("A");
      a.href = data;
      a.download = `pika-1.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  const copyImage = () => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator?.userAgent
    );
    const isNotFirefox = navigator.userAgent.indexOf("Firefox") < 0;

    if (isSafari) {
      navigator.clipboard
        .write([
          new ClipboardItem({
            "image/png": new Promise(async (resolve, reject) => {
              try {
                await snapshotCreator();
                const blob = await snapshotCreator();
                resolve(new Blob([blob], { type: "image/png" }));
              } catch (err) {
                reject(err);
              }
            }),
          }),
        ])
        .then(() => console.log("Copied!"))
        .catch((err) =>
          // Error
          console.error("Error:", err)
        );
    } else if (isNotFirefox) {
      navigator?.permissions
        ?.query({ name: "clipboard-write" })
        .then(async (result) => {
          if (result.state === "granted") {
            const type = "image/png";
            await snapshotCreator();
            const blob = await snapshotCreator();
            let data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard
              .write(data)
              .then(() => {
                // Success
              })
              .catch((err) => {
                // Error
                console.error("Error:", err);
              });
          }
        });
    } else {
      alert("Firefox does not support this functionality");
    }
  };


  const onPaste = event => {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    var index = 0;
    for (index in items) {
      var item = items[index];
      if (item.kind === 'file') {
        var blob = item.getAsFile();
        var reader = new FileReader();
        reader.onload = function(event){
          setBlob({...blob, src: event.target.result});
        }
        reader.readAsDataURL(blob);
      }
    }
  }

  const renderOptions = () => {
    return (
      <div className="fixed top-0 left-0 flex items-center justify-center w-full">
        <div className="inline-flex px-8 py-3 mt-10 space-x-8 border border-gray-400 shadow-xl bg-gray-400/50 dark:bg-gray-700/60 backdrop-blur rounded-xl dark:border-gray-500 shadow-gray-600/20 dark:shadow-black/20">
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">
              Aspect Ratio
            </div>
            <div>
              <select
                className="px-2 py-1 border border-gray-500 rounded-lg shadow appearance-none cursor-pointer opacity-90 hover:opacity-100"
                onChange={(e) =>
                  setOptions({ ...options, aspectRatio: e.target.value })
                }
              >
                <option value="aspect-auto">Auto</option>
                <option value="aspect-square">Square</option>
              </select>
            </div>
          </div>
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">
              Padding
            </div>
            <div>
              <select
                className="px-2 py-1 border border-gray-500 rounded-lg shadow appearance-none cursor-pointer opacity-90 hover:opacity-100"
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
            <div className="pb-2 text-sm font-semibold dark:text-white">
              Background
            </div>
            <div className="flex items-center justify-center space-x-2">
              {[
                "bg-white",
                "bg-black",
                "bg-gradient-to-br from-red-500 to-pink-600",
                "bg-gradient-to-br from-green-100 to-yellow-100",
              ].map((theme) => (
                <div
                  key={theme}
                  className={`cursor-pointer w-10 h-10 rounded-full ${theme}`}
                  onClick={() => {
                    setOptions({ ...options, theme: theme });
                  }}
                />
              ))}
            </div>
          </div>
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">
              Rounded Corners
            </div>
            <div>
              <select
                className="px-2 py-1 border border-gray-500 rounded-lg shadow appearance-none cursor-pointer opacity-90 hover:opacity-100"
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
            <div className="pb-2 text-sm font-semibold dark:text-white">
              Shadow
            </div>
            <div>
              <select
                className="px-2 py-1 border border-gray-500 rounded-lg shadow appearance-none cursor-pointer opacity-90 hover:opacity-100"
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
          <div
            className="flex items-center justify-center px-4 text-xl font-semibold text-green-600 bg-green-200 rounded-lg shadow cursor-pointer"
            onClick={copyImage}
          >
            Copy
          </div>
          <div
            className="flex items-center justify-center px-4 text-xl font-semibold text-indigo-600 bg-indigo-200 rounded-lg shadow cursor-pointer"
            onClick={saveImage}
          >
            Save
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center h-full min-h-screen p-10 bg-gradient-to-br from-red-600/20 via-pink-600/20 to-blue-500/40 backdrop-blur-xl"
      onPaste={onPaste}
    >
      {blob?.src ? (
        <div
          ref={(el) => (wrapperRef.current = el)}
          style={blob?.w ? { width: blob?.w / window.devicePixelRatio } : {}}
          className={
            "shadow-xl duration-300 relative ease-in-out flex items-center justify-center max-w-[80vw] mt-20 rounded-3xl " +
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
        <span className="text-3xl opacity-50">
          Paste your screenshot, or click to upload
        </span>
      )}
      {renderOptions()}
    </div>
  );
}