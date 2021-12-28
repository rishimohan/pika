import { useEffect, useRef, useState } from "react";
import domtoimage from "dom-to-image";
import toast from "react-hot-toast";
import classnames from "classnames";
import { SaveIcon, ClipboardIcon, TwitterIcon, GithubIcon } from "ui/icons";

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
    let savingToast = toast.loading('Exporting image...')
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
      toast.success("Image exported!", { id: savingToast });
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
        .then(() => toast.success('Image copied to clipboard'))
        .catch((err) =>
          // Error
          toast.success(err)
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
        <div
          className={classnames(
            "duration-300 ease-in-out inline-flex px-8 py-3 mt-10 space-x-8 border border-gray-400 shadow-xl bg-gray-400/30 dark:bg-gray-700/60 backdrop-blur rounded-xl dark:border-gray-400/60 shadow-gray-500/20 dark:shadow-black/20"
          )}
        >
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">
              Aspect Ratio
            </div>
            <div>
              <select
                value={options.aspectRatio}
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
                value={options.padding}
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
                "bg-gradient-to-br from-pink-300 via-orange-200 to-red-300",
                "bg-gradient-to-br from-green-100 via-green-300 to-yellow-100",
                "bg-gradient-to-br from-green-200 via-blue-200 to-blue-300",
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
                value={options.rounded}
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
                value={options.shadow}
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
          <div className="flex items-center justify-between pl-10 space-x-5">
            <div
              className="flex items-center justify-center px-4 py-2 hover:scale-[1.03] duration-200 text-lg font-semibold text-green-600 bg-green-200 rounded-lg shadow cursor-pointer"
              onClick={copyImage}
            >
              <span className="w-6 h-6 mr-2">{ClipboardIcon}</span>
              Copy
            </div>
            <div
              className="flex items-center justify-center px-4 py-2 hover:scale-[1.03] duration-200 text-lg font-semibold text-indigo-600 bg-indigo-200 rounded-lg shadow cursor-pointer"
              onClick={saveImage}
            >
              <span className="w-6 h-6 mr-2">{SaveIcon}</span>
              Save
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center h-full min-h-screen p-10 pt-20 bg-gradient-to-br from-red-600/20 via-pink-600/20 to-blue-500/40 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700 backdrop-blur-xl"
      onPaste={onPaste}
    >
      <div className="absolute top-0 z-10 flex pt-2 text-sm opacity-30 hover:opacity-100 dark:text-white">
        <a
          href="https://twitter.com/thelifeofrishi"
          target="_blank"
          className="flex items-center hover:underline"
        >
          <span className="w-5 h-5 mx-1">{TwitterIcon}</span>
          Created by Rishi Mohan
        </a>
        <span className="px-2">-</span>
        <a
          href="https://github.com/rishimohan/pika"
          target="_blank"
          className="flex items-center hover:underline"
        >
          <span className="w-5 h-5 mx-1">{GithubIcon}</span>
          View Code on Github
        </a>
      </div>
      {blob?.src ? (
        <div
          ref={(el) => (wrapperRef.current = el)}
          style={blob?.w ? { width: blob?.w / window.devicePixelRatio } : {}}
          className={
            "shadow-xl duration-300 relative ease-in-out flex items-center justify-center overflow-hidden min-w-[1000px] max-w-[80vw] mt-20 rounded-lg " +
            options?.theme +
            " " +
            options?.aspectRatio +
            " " +
            options?.padding
          }
        >
          <img
            src={blob?.src}
            className={`relative duration-300 ease-in-out ${options?.shadow} ${options?.rounded}`}
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
        <span className="text-2xl opacity-50 dark:text-white">
          Paste your screenshot(Cmd/Ctrl+V) to get started
        </span>
      )}
      {renderOptions()}
    </div>
  );
}