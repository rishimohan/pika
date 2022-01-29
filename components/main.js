import { useEffect, useRef, useState, useCallback } from "react";
import domtoimage from "dom-to-image";
import toast from "react-hot-toast";
import classnames from "classnames";
import {
  ResetIcon,
  SaveIcon,
  ClipboardIcon,
  PasteIcon,
  TwitterIcon,
  GithubIcon,
  ColorPickerIcon,
  CoffeeIcon,
} from "ui/icons";

const isValidHexColor = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";

export default function Main() {
  const wrapperRef = useRef();
  const [blob, setBlob] = useState({ src: null, w: 0, h: 0 });
  const [bgPicker, setBGPicker] = useState(false);
  const [options, setOptions] = useState({
    aspectRatio: "aspect-auto",
    theme: "bg-gradient-to-br from-indigo-400 via-blue-400 to-purple-600",
    customTheme: {
      colorStart: "#ff40ff",
      colorEnd: "#fec700",
    },
    padding: "p-20",
    rounded: "rounded-xl",
    roundedWrapper: "rounded-xl",
    shadow: "shadow-xl",
    noise: false,
    browserBar: "hidden",
  });

  useEffect(() => {
    const preset = localStorage.getItem("options");
    if (preset) {
      setOptions(JSON.parse(preset));
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleShortcuts);

    return () => {
      document.removeEventListener("keydown", handleShortcuts);
    };
  }, [blob]);

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  const handleShortcuts = (e) => {
    if ((e.key === "c" && e.ctrlKey) || (e.key === "c" && e.metaKey)) {
      e.preventDefault();
      copyImage();
    }

    if ((e.key === "s" && e.ctrlKey) || (e.key === "s" && e.metaKey)) {
      e.preventDefault();
      saveImage();
    }
  };

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
    let savingToast = toast.loading("Exporting image...");
    const scale = window.devicePixelRatio;
    domtoimage
      .toPng(wrapperRef.current, {
        height: wrapperRef.current.offsetHeight * scale,
        width: wrapperRef.current.offsetWidth * scale,
        style: {
          transform: "scale(" + scale + ")",
          transformOrigin: "top left",
          width: wrapperRef.current.offsetWidth + "px",
          height: wrapperRef.current.offsetHeight + "px",
        },
      })
      .then(async (data) => {
        domtoimage
          .toPng(wrapperRef.current, {
            height: wrapperRef.current.offsetHeight * scale,
            width: wrapperRef.current.offsetWidth * scale,
            style: {
              transform: "scale(" + scale + ")",
              transformOrigin: "top left",
              width: wrapperRef.current.offsetWidth + "px",
              height: wrapperRef.current.offsetHeight + "px",
            },
          })
          .then(async (data) => {
            var a = document.createElement("A");
            a.href = data;
            a.download = `pika-${new Date().toISOString()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("Image exported!", { id: savingToast });
          });
      });
  };

  const copyImage = () => {
    if (!blob?.src) {
      toast.error("Nothing to copy, make sure to add a screenshot first!");
      return;
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
        .then(() => toast.success("Image copied to clipboard"))
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

  const onPaste = (event) => {
    var items =
      (event?.clipboardData || event?.originalEvent?.clipboardData)?.items ||
      event?.target?.files ||
      event?.dataTransfer?.files;
    var index = 0;
    for (index in items) {
      var item = items[index];
      if (item.kind === "file" || item?.type?.includes("image")) {
        var blob = item?.kind ? item.getAsFile() : item;
        var reader = new FileReader();
        reader.onload = function (event) {
          setBlob({ ...blob, src: event.target.result });
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const pickBackground = () => {
    return (
      <>
        {bgPicker ? (
          <div
            className="fixed inset-0 w-full h-full bg-transparent"
            onClick={() => setBGPicker(false)}
          />
        ) : (
          ""
        )}
        <div
          className={classnames(
            "absolute w-auto max-w-[400px] z-10 top-[calc(100%)] left-[-30px] bg-white/80 backdrop-blur shadow-lg py-4 px-5 rounded-xl flex shadow-gray-500/50 dark:shadow-black/80 border border-gray-400 flex-col dark:border-gray-800 dark:bg-black/80 duration-200",
            {
              "opacity-0 pointer-events-none scale-[0.9]": !bgPicker,
            },
            {
              "opacity-100 pointer-events-auto scale-[1]": bgPicker,
            }
          )}
        >
          <div
            className="absolute top-[5%] right-[5%] opacity-50 cursor-pointer hover:opacity-100 z-10"
            onClick={() => setBGPicker(false)}
          >
            ✕
          </div>
          <div className="relative mb-3">
            {/* Pick Start Color */}
            <div className="mb-1">Pick first color</div>
            <div className="flex items-center">
              <div className="relative group">
                <input
                  id="startColorPicker"
                  type="color"
                  className="absolute top-0 left-0 w-12 h-12 rounded-full opacity-0 cursor-pointer"
                  value={options.customTheme.colorStart || "#222"}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customTheme: {
                        ...options.customTheme,
                        colorStart: e.target.value,
                      },
                    })
                  }
                />
                <label
                  style={{
                    backgroundColor: options?.customTheme?.colorStart || "#222",
                  }}
                  htmlFor="startColorPicker"
                  className="left-0 flex items-center justify-center w-12 h-12 rounded-full pointer-events-none text-white/50 group-hover:scale-[1.1] duration-100"
                >
                  <span className="font-mono text-xs text-white/80 drop-shadow">
                    Pick
                  </span>
                </label>
              </div>
              <span className="px-4 opacity-50">/</span>
              <input
                placeholder="Enter hex value"
                type="text"
                value={options.customTheme.colorStart || "#000000"}
                className="px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:outline-none focus:border-black"
                onChange={(e) => {
                  let startColorToast;
                  setOptions({
                    ...options,
                    customTheme: {
                      ...options.customTheme,
                      colorStart: e.target.value,
                    },
                  });
                  if (e.target.value.match(isValidHexColor)) {
                    toast.dismiss(startColorToast);
                    toast.success("First color applied", {
                      id: startColorToast,
                    });
                  } else {
                    toast.dismiss(startColorToast);
                    toast.error("Invalid Hex color", { id: startColorToast });
                  }
                }}
              />
            </div>
          </div>

          {/* Pick End Color */}
          <div>
            <div className="mb-1">Pick second color</div>
            <div className="flex items-center">
              <div className="relative group">
                <input
                  id="startColorPicker"
                  type="color"
                  className="absolute top-0 left-0 w-12 h-12 rounded-full opacity-0 cursor-pointer"
                  value={options.customTheme.colorEnd || "#222"}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customTheme: {
                        ...options.customTheme,
                        colorEnd: e.target.value,
                      },
                    })
                  }
                />
                <label
                  style={{
                    backgroundColor: options?.customTheme?.colorEnd || "#222",
                  }}
                  htmlFor="startColorPicker"
                  className="left-0 flex items-center justify-center w-12  h-12 rounded-full pointer-events-none text-white/50 group-hover:scale-[1.1] duration-100"
                >
                  <span className="font-mono text-xs text-white/80 drop-shadow">
                    Pick
                  </span>
                </label>
              </div>
              <span className="px-4 opacity-50">/</span>
              <input
                placeholder="Enter hex value"
                type="text"
                value={options.customTheme.colorEnd || "#000000"}
                className="px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:outline-none focus:border-black"
                onChange={(e) => {
                  let endColorToast;
                  setOptions({
                    ...options,
                    customTheme: {
                      ...options.customTheme,
                      colorEnd: e.target.value,
                    },
                  });
                  if (e.target.value.match(isValidHexColor)) {
                    toast.dismiss(endColorToast);
                    toast.success("Second color applied", {
                      id: endColorToast,
                    });
                  } else {
                    toast.dismiss(endColorToast);
                    toast.error("Invalid Hex color", { id: endColorToast });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderOptions = () => {
    return (
      <div className="sticky top-0 flex items-center lg:min-h-screen">
        <div
          className={classnames(
            "p-6 lg:p-8 h-auto bg-white/90 dark:bg-pink-600/60 rounded-2xl ring-1 ring-pink-300 dark:ring-pink-200/50 ring-offset-1 ring-offset-white dark:ring-offset-red-800 shadow-lg shadow-gray-200 dark:shadow-black lg:max-h-screen w-full relative lg:min-h-[650px] mt-10 lg:mt-0"
          )}
        >
          <div className="absolute inset-0 w-full lg:h-full bg-gradient-to-br from-pink-400 dark:from-pink-500 dark:to-red-800 to-red-300 blur-xl dark:blur-md lg:scale-y-[1.05] scale-100 lg:scale-x-[1.1] dark:lg:scale-[1.05] lg:max-h-[calc(100vh-60px)] transform-gpu opacity-60" />
          <div className="relative flex flex-row flex-wrap items-start justify-start space-y-5 lg:items-start lg:flex-col lg:space-y-4">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">
                Aspect Ratio
              </div>
              <div>
                <select
                  value={options.aspectRatio}
                  className="px-2 py-1 border border-gray-500 rounded-lg shadow-lg appearance-none cursor-pointer opacity-80 hover:opacity-100"
                  onChange={(e) =>
                    setOptions({ ...options, aspectRatio: e.target.value })
                  }
                >
                  <option value="aspect-auto">Auto</option>
                  <option value="aspect-square">Square</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">
                Browser Wrapper
              </div>
              <div>
                <select
                  value={options.browserBar}
                  className="px-2 py-1 border border-gray-500 rounded-lg shadow-lg appearance-none cursor-pointer opacity-80 hover:opacity-100"
                  onChange={(e) =>
                    setOptions({ ...options, browserBar: e.target.value })
                  }
                >
                  <option value="hidden">None</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">
                Padding
              </div>
              <div>
                <select
                  value={options.padding}
                  className="px-2 py-1 border border-gray-500 rounded-lg shadow-lg appearance-none cursor-pointer opacity-80 hover:opacity-100"
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
              <div className="relative flex items-center pb-2 text-sm font-semibold dark:text-white">
                Background
                <div className="relative">
                  <div
                    onClick={() => setBGPicker(!bgPicker)}
                    className="flex items-center px-2 ml-2 border border-gray-400 rounded-lg cursor-pointer bg-white/70 opacity-70 hover:opacity-100 dark:bg-pink-900/80 dark:border-red-600 dark:text-gray-300"
                  >
                    <span className="w-3 h-3 mr-1">{ColorPickerIcon}</span>
                    Pick
                  </div>
                </div>
                {pickBackground()}
              </div>
              <div className="grid flex-wrap grid-cols-6 mt-1 gap-x-4 gap-y-2">
                {[
                  "bg-gradient-to-br from-pink-300 via-orange-200 to-red-300",
                  "bg-gradient-to-br from-green-300 via-yellow-200 to-green-200",
                  "bg-gradient-to-br from-green-200 via-blue-100 to-blue-300",
                  "bg-gradient-to-br from-indigo-300 via-blue-400 to-purple-500",
                  "bg-gradient-to-br from-red-300 via-orange-300 to-yellow-200",
                  "bg-gradient-to-br from-pink-300 via-pink-400 to-red-400",
                  "bg-gradient-to-br from-slate-400 via-gray-500 to-gray-700",
                  "bg-gradient-to-br from-orange-300 via-orange-400 to-red-400",
                  "bg-gradient-to-br from-teal-300 to-cyan-400",
                  "bg-gradient-to-br from-red-300 to-purple-600",
                  "bg-white",
                  "bg-black",
                ].map((theme) => (
                  <div
                    key={theme}
                    className={`cursor-pointer shadow dark:shadow-black/20 shadow-gray-500/20 w-8 h-8 rounded-full ${theme}`}
                    onClick={() => {
                      setOptions({
                        ...options,
                        theme: theme,
                        customTheme: false,
                      });
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">
                Wrapper Rounded Corners
              </div>
              <div>
                <select
                  value={options.roundedWrapper}
                  className="px-2 py-1 border border-gray-500 rounded-lg shadow-lg appearance-none cursor-pointer opacity-80 hover:opacity-100"
                  onChange={(e) =>
                    setOptions({ ...options, roundedWrapper: e.target.value })
                  }
                >
                  <option value="rounded-none">None</option>
                  <option value="rounded-lg">Small</option>
                  <option value="rounded-xl">Medium</option>
                  <option value="rounded-3xl">Large</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">
                Screenshot Rounded Corners
              </div>
              <div>
                <select
                  value={options.rounded}
                  className="px-2 py-1 border border-gray-500 rounded-lg shadow-lg appearance-none cursor-pointer opacity-80 hover:opacity-100"
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
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">
                Screenshot Position
              </div>
              <div>
                <select
                  value={options.position}
                  className="px-2 py-1 border border-gray-500 rounded-lg shadow-lg appearance-none cursor-pointer opacity-80 hover:opacity-100"
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
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">
                Shadow
              </div>
              <div>
                <select
                  value={options.shadow}
                  className="px-2 py-1 border border-gray-500 rounded-lg shadow-lg appearance-none cursor-pointer opacity-80 hover:opacity-100"
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
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold dark:text-white">Noise</div>
              <div>
                <input
                  type="checkbox"
                  checked={options?.noise || false}
                  className="text-xl"
                  onChange={(e) =>
                    setOptions({ ...options, noise: !options?.noise })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div
                className="flex items-center justify-center px-4 py-2 hover:scale-[1.03] duration-200 text-base lg:text-lg font-semibold text-pink-600 bg-pink-200 rounded-lg shadow cursor-pointer border border-pink-600 w-full"
                onClick={copyImage}
                title="Use Ctrl/Cmd + C to copy the image"
              >
                <span className="w-6 h-6 mr-2">{ClipboardIcon}</span>
                Copy
              </div>
              <div
                className="flex items-center justify-center px-4 py-2 hover:scale-[1.03] duration-200 text-base lg:text-lg font-semibold bg-pink-600/90 dark:bg-pink-600/90 text-pink-200 rounded-lg shadow cursor-pointer border border-pink-600 w-full ml-4"
                title="Use Ctrl/Cmd + S to save the image"
                onClick={saveImage}
              >
                <span className="w-6 h-6 mr-2">{SaveIcon}</span>
                Save
              </div>
            </div>
            <div
              onClick={() => setBlob({})}
              className="flex items-center justify-center w-full px-3 py-1 mx-auto mt-4 text-sm text-pink-400 rounded-lg cursor-pointer"
            >
              <span className="w-4 h-4 mr-1">{ResetIcon}</span>
              Reset
            </div>
            <div className="hidden mx-auto text-sm text-center opacity-50 dark:text-white lg:block">
              <div className="mb-1">
                Use{" "}
                <span className="px-2 py-px font-mono rounded-lg dark:bg-black/40 bg-white/80">
                  Cmd/Ctrl+C
                </span>{" "}
                to copy or
              </div>
              <div>
                <span className="px-2 py-px font-mono rounded-lg bg-white/80 dark:bg-black/40">
                  Cmd/Ctrl+S
                </span>{" "}
                to save output image
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getImageRadius = () => {
    if (options?.padding == "p-0") {
      return "";
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
  };

  const renderBrowserBar = () => {
    switch (options?.browserBar) {
      case "hidden":
        return "";
      case "light":
        return (
          <div className="flex items-center w-full px-4 py-[10px] rounded-t-lg bg-white/80">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="w-3 h-3 bg-yellow-300 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
        );
      case "dark":
        return (
          <div className="flex items-center w-full px-4 py-[10px] rounded-t-lg bg-black/40">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="w-3 h-3 bg-yellow-300 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
        );
      case "default":
        return "";
    }
  };

  const RenderMaker = () => (
    <div className="lg:absolute lg:bottom-[20px] flex flex-col items-center justify-center pb-5 text-sm lg:pb-0 lg:pt-20 dark:text-gray-400 lg:flex-row opacity-60">
      <a
        href="https://twitter.com/thelifeofrishi"
        target="_blank"
        className="flex items-center hover:underline"
      >
        <span className="w-5 h-5 mx-1">{TwitterIcon}</span>
        Created by Rishi Mohan
      </a>
      <span className="hidden px-2 lg:block">-</span>
      <a
        href="https://github.com/rishimohan/pika"
        target="_blank"
        className="flex items-center mt-2 hover:underline lg:mt-0"
      >
        <span className="w-5 h-5 mx-1">{GithubIcon}</span>
        View Code on Github
      </a>
      <span className="hidden px-2 lg:block">-</span>
      <a
        href="https://www.buymeacoffee.com/thelifeofrishi"
        target="_blank"
        className="flex items-center mt-2 hover:underline lg:mt-0"
      >
        <span className="w-5 h-5 mx-1">{CoffeeIcon}</span>
        Buy me a coffee
      </a>
    </div>
  );

  return (
    <div
      className="flex flex-col items-start justify-start h-screen px-5 lg:px-10 min-h-[800px]"
      onPaste={onPaste}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      onDragLeave={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onPaste(e);
      }}
    >
      <div className="relative flex flex-col-reverse w-full lg:flex-row-reverse max-w-[1600px] mx-auto">
        <div className="w-full lg:w-[350px]">{renderOptions()}</div>
        <div className="w-full lg:w-[calc(100%-350px)] py-5 lg:p-10 lg:pl-0 flex flex-col-reverse lg:flex-col items-center justify-center overflow-y-auto">
          {blob?.src ? (
            <>
              <div
                className={`${options?.roundedWrapper} overflow-hidden shadow-xl duration-200 ease-in-out relative my-5`}
              >
                <div
                  ref={(el) => (wrapperRef.current = el)}
                  style={
                    options?.customTheme
                      ? {
                          background: `linear-gradient(45deg, ${
                            options?.customTheme?.colorStart || "transparent"
                          }, ${
                            options?.customTheme?.colorEnd || "transparent"
                          })`,
                        }
                      : {}
                  }
                  className={classnames(
                    "transition-all duration-200 relative ease-in-out flex items-center justify-center overflow-hidden max-w-[80vw] flex-col",
                    options?.aspectRatio,
                    options?.padding,
                    options?.position,
                    options?.roundedWrapper,
                    { [options?.theme]: !options.customTheme }
                  )}
                >
                  {renderBrowserBar()}
                  {options?.noise ? (
                    <div
                      style={{ backgroundImage: `url("/noise.svg")` }}
                      className={`absolute inset-0 w-full h-full bg-repeat opacity-[0.15] ${
                        options?.rounded
                      } ${
                        options.browserBar !== "hidden" ? "rounded-t-none" : ""
                      }`}
                    />
                  ) : (
                    ""
                  )}
                  <img
                    src={blob?.src}
                    style={
                      blob?.w
                        ? {
                            width: blob?.w / window.devicePixelRatio + "px",
                          }
                        : {}
                    }
                    className={`relative z-10s transition-all duration-200 ease-in-out ${
                      options?.shadow
                    } ${options?.rounded} ${getImageRadius()} ${
                      options?.browserBar == "hidden" ? "" : "rounded-t-none"
                    }`}
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
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh] lg:min-h-[80vh]">
              <label
                className="flex flex-col items-center justify-center text-lg opacity-30 select-none max-w-[550px] rounded-2xl p-10 mt-20 text-center dark:text-white cursor-pointer border-2 border-dashed border-gray-400 hover:opacity-50 duration-300"
                htmlFor="imagesUpload"
              >
                <input
                  className="hidden"
                  id="imagesUpload"
                  type="file"
                  onChange={onPaste}
                />
                <span className="w-6 h-6 mb-2">{PasteIcon}</span>
                <p>Paste your screenshot(Cmd/Ctrl+V)</p>
                <p>or drag and drop your screenshot here</p>
                <p>or click here to add one</p>
              </label>
            </div>
          )}
          <RenderMaker />
        </div>
      </div>
    </div>
  );
}
