import { useEffect, useRef, useState } from "react";
import domtoimage from "dom-to-image";
import toast from "react-hot-toast";
import classnames from "classnames";
import { SaveIcon, ClipboardIcon,PasteIcon, TwitterIcon, GithubIcon } from "ui/icons";

export default function Main() {
  const wrapperRef = useRef();
  const [blob, setBlob] = useState({src: null, w: 0, h: 0});
  const [options, setOptions] = useState({
    aspectRatio: "aspect-auto",
    theme: "bg-white",
    padding: "p-0",
    rounded: "rounded-none",
    shadow: "shadow-none",
    noise: true
  });

  useEffect(() => {
    const preset = localStorage.getItem("options");
    if(preset) {
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
    if (!blob?.src) {
      toast.error("Nothing to save, make sure to add a screenshot first!");
      return;
    }
    if (window.pirsch) {
      pirsch("🎉 Screenshot saved");
    }
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
    });
  }

  const copyImage = () => {
    if(!blob?.src) {
      toast.error("Nothing to copy, make sure to add a screenshot first!");
      return
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator?.userAgent
    );
    const isNotFirefox = navigator.userAgent.indexOf("Firefox") < 0;
    if (window.pirsch) {
      pirsch("🙌 Screenshot copied");
    }

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
            "duration-200 ease-in-out inline-flex px-8 py-3 mt-10 space-x-8 border border-gray-400/70 shadow-xl bg-gray-100/80 dark:bg-gray-700/60 backdrop-blur rounded-xl dark:border-gray-500/90 shadow-gray-600/20 dark:shadow-black/10"
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
            <div className="flex items-center justify-start max-w-[200px] flex-wrap">
              {[
                "bg-white",
                "bg-black",
                "bg-gradient-to-br from-pink-300 via-orange-200 to-red-300",
                "bg-gradient-to-br from-green-200 via-yellow-100 to-green-200",
                "bg-gradient-to-br from-green-200 via-blue-200 to-blue-300",
                "bg-gradient-to-br from-indigo-400 via-blue-400 to-purple-600",
                "bg-gradient-to-br from-red-400 via-organge-500 to-yellow-200",
                "bg-gradient-to-br from-pink-400 via-pin-500 to-red-300",
              ].map((theme) => (
                <div
                  key={theme}
                  className={`cursor-pointer shadow-xl mr-2 mb-2 shadow-gray-500/20 w-7 h-7 rounded-full ${theme}`}
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
              Screenshot position
            </div>
            <div>
              <select
                value={options.position}
                className="px-2 py-1 border border-gray-500 rounded-lg shadow appearance-none cursor-pointer opacity-90 hover:opacity-100"
                onChange={(e) =>
                  setOptions({ ...options, position: e.target.value })
                }
              >
                <option value="">Center</option>
                <option value="pl-0 pt-0">Top left</option>
                <option value="pt-0 pr-0">Top right</option>
                <option value="pb-0 pl-0">Bottom left</option>
                <option value="pb-0 pr-0">Bottom right</option>
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
          <div className="">
            <div className="pb-2 text-sm font-semibold dark:text-white">
              Noise
            </div>
            <div>
              <input
                type="checkbox"
                checked={options?.noise || false}
                // className="px-2 py-1 border border-gray-500 rounded-lg shadow appearance-none cursor-pointer opacity-90 hover:opacity-100"
                onChange={(e) =>
                  setOptions({ ...options, noise: !options?.noise })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between pl-10 space-x-5">
            <div
              className="flex items-center justify-center px-4 py-2 hover:scale-[1.03] duration-200 text-lg font-semibold text-green-600 bg-green-200 rounded-lg shadow cursor-pointer border border-green-600"
              onClick={copyImage}
            >
              <span className="w-6 h-6 mr-2">{ClipboardIcon}</span>
              Copy
            </div>
            <div
              className="flex items-center justify-center px-4 py-2 hover:scale-[1.03] duration-200 text-lg font-semibold text-indigo-600 bg-indigo-200 rounded-lg shadow cursor-pointer border border-indigo-600"
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

  const getImageRadius = () => {
    if(options?.padding == "p-0") {
      return ""
    }

    switch (options?.position) {
      case "pl-0 pt-0":
        return "rounded-l-none rounded-tr-none";
      case "pt-0 pr-0":
        return "rounded-r-none rounded-tl-none";
      case "pb-0 pl-0":
        return "rounded-l-none rounded-br-none";
      case "pb-0 pr-0":
        return "rounded-r-none rounded-bl-none";
      default:
        return "";
    }
  }

  const RenderMaker = () => (
    <div className="flex pt-20 mt-auto text-sm">
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
  );

  return (
    <div
      className="flex flex-col items-center justify-center h-full min-h-screen p-10 pt-48"
      onPaste={onPaste}
    >
      {blob?.src ? (
        <div className={`${options?.rounded} overflow-hidden shadow-xl duration-200 ease-in-out`}>
          <div
            ref={(el) => (wrapperRef.current = el)}
            style={blob?.w ? { width: blob?.w / window.devicePixelRatio } : {}}
            className={classnames(
              "transition-all duration-200 relative ease-in-out flex items-center justify-center overflow-hidden min-w-[1000px] max-w-[80vw] rounded-lg",
              options?.theme,
              options?.aspectRatio,
              options?.padding,
              options?.position
            )}
          >
            {options?.noise ? (
              <div
                style={{ backgroundImage: `url("/noise.svg")` }}
                className={`absolute inset-0 w-full h-full bg-repeat opacity-[0.15] ${options?.rounded}`}
              />
            ) : (
              ""
            )}
            <img
              src={blob?.src}
              className={`relative z-10s transition-all duration-200 ease-in-out ${
                options?.shadow
              } ${options?.rounded} ${getImageRadius()}`}
              onLoad={(e) => {
                setBlob({
                  ...blob,
                  w: e.target.naturalWidth,
                  h: e.target.naturalHeight,
                });
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-xl opacity-30 select-none max-w-[550px] rounded-2xl p-10 mt-20 text-center">
          <span className="w-6 h-6 mb-2">{PasteIcon}</span>
          Paste your screenshot(Cmd/Ctrl+V) to get started
        </div>
      )}
      {renderOptions()}
      <RenderMaker />
    </div>
  );
}