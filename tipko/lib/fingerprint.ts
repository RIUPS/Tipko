"use client";

const hexEncode = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex;
};

const hash = async (str: string) => {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return hexEncode(hashBuffer);
};

const getCanvasFingerprint = () => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.log("Canvas 2D context not supported.");
      return;
    }

    ctx.fillStyle = "#f6f6f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#333";
    ctx.font = "20px 'Arial'";
    ctx.fillText("Cwm fjordbank glyphs vext quiz, ɸ ɣ", 100, 150);

    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(255,0,255)";
    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, Math.PI * 1, true);
    ctx.fill();

    ctx.fillStyle = "rgb(63,153,123)";
    ctx.beginPath();
    ctx.arc(400, 250, 60, 0, Math.PI * 1, true);
    ctx.fill();

    ctx.fillStyle = "rgb(64,42,245)";
    ctx.beginPath();
    ctx.rect(220, 180, 200, 100);
    ctx.fill();

    // document.body.appendChild(canvas);

    return canvas.toDataURL();
  } catch (error) {
    console.error("Error generating canvas fingerprint:", error);
  }
};

const getFontFingerprint = () => {
  try {
    const testString = "mmmmmmmmnnnnnnnnnlllllii";
    const baseFonts = ["monospace", "sans-serif", "serif"];
    const fontsToTest = [
      "Arial",
      "Courier New",
      "Times New Roman",
      "Helvetica",
      "Verdana",
      "Georgia",
      "Palatino",
      "Garamond",
      "Comic Sans MS",
      "Trebuchet MS",
      "Impact",
      "Segoe UI",
      "Roboto",
      "Noto Sans",
      "system-ui",
    ];

    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.left = "-999px";
    span.style.fontSize = "72px";
    span.style.visibility = "hidden";
    span.textContent = testString;
    document.body.appendChild(span);

    const baseMetrics: { [key: string]: { w: number; h: number } } = {};
    for (const base of baseFonts) {
      span.style.fontFamily = base;
      baseMetrics[base] = { w: span.offsetWidth, h: span.offsetHeight };
    }

    const detectedFonts = [];
    for (const font of fontsToTest) {
      let isDifferent = false;
      for (const base of baseFonts) {
        span.style.fontFamily = `'${font}', ${base}`;
        const w = span.offsetWidth;
        const h = span.offsetHeight;
        if (w !== baseMetrics[base].w || h !== baseMetrics[base].h) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        detectedFonts.push(font);
      }
    }
    document.body.removeChild(span);
    return detectedFonts.join(",");
  } catch (error) {
    console.error("Error generating font fingerprint:", error);
  }
};

const getNavigatorFingerprint = () => {
  try {
    const nav = window.navigator;
    const screen = window.screen;
    const data = [
      nav.userAgent || "",
      nav.vendor || "",
      nav.languages ? nav.languages.join(",") : "",
      String(nav.hardwareConcurrency || ""),
      String(nav.maxTouchPoints || ""),
      String(screen.width || ""),
      String(screen.height || ""),
      String(screen.colorDepth || ""),
      String(new Date().getTimezoneOffset() || ""),
      String(nav.platform || ""),
    ];
    return data.join("|");
  } catch (error) {
    console.error("Error generating navigator fingerprint:", error);
  }
};

const getAudioFingerprint = async () => {
  try {
    const audioCtx = window.OfflineAudioContext || window.AudioContext;
    if (!audioCtx) {
      console.log("Web Audio API not supported.");
      return;
    }

    const ctx = new audioCtx(1, 44100, 44100);
    const oscillator = ctx.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, 0);
    compressor.knee.setValueAtTime(40, 0);
    compressor.ratio.setValueAtTime(12, 0);
    compressor.attack.setValueAtTime(0, 0);
    compressor.release.setValueAtTime(0.25, 0);

    oscillator.connect(compressor);
    compressor.connect(ctx.destination);
    oscillator.start(0);

    const buffer = await ctx.startRendering();
    const channelData = buffer.getChannelData(0);
    let sum = 0,
      sumSq = 0;
    const sampleSize = Math.min(500, channelData.length);
    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.floor((i / sampleSize) * channelData.length);
      const sample = channelData[idx];
      sum += sample;
      sumSq += sample * sample;
    }
    const mean = sum / sampleSize;
    const variance = sumSq / sampleSize - mean * mean;
    return `mean:${mean.toFixed(5)}|variance:${variance.toFixed(5)}`;
  } catch (error) {
    console.error("Error generating audio fingerprint:", error);
  }
};

const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    if (!gl) {
      console.log("WebGL not supported.");
      return;
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const unmasked_vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : "unknown";
    const unmasked_renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "unknown";

    const webglData = [
      "vendor:" + gl.getParameter(gl.VENDOR),
      "renderer:" + gl.getParameter(gl.RENDERER),
      "version:" + gl.getParameter(gl.VERSION),
      "unmaskedVendor:" + unmasked_vendor,
      "unmaskedRenderer:" + unmasked_renderer,
      "shadingLanguageVersion:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      "maxVertexAttribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      "maxVertexUniformVectors:" +
        gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    ];

    return webglData.join("|");
  } catch (error) {
    console.error("Error generating WebGL fingerprint:", error);
    return;
  }
};

const logFingerprintMethods = async () => {
  const canvasFingerprint = getCanvasFingerprint();

  if (canvasFingerprint) {
    hash(canvasFingerprint).then((fingerprint) => {
      console.log("Canvas Fingerprint Hash:", fingerprint);
    });
  } else {
    console.log("Could not generate canvas fingerprint.");
  }

  const fontFingerprint = getFontFingerprint();

  console.log("Detected fonts:", fontFingerprint);

  if (fontFingerprint) {
    hash(fontFingerprint).then((fingerprint) => {
      console.log("Font Fingerprint Hash:", fingerprint);
    });
  } else {
    console.log("Could not generate font fingerprint.");
  }

  const navigatorFingerprint = getNavigatorFingerprint();

  if (navigatorFingerprint) {
    hash(navigatorFingerprint).then((fingerprint) => {
      console.log("Navigator Fingerprint Hash:", fingerprint);
    });
  } else {
    console.log("Could not generate navigator fingerprint.");
  }

  const audioFingerprint = await getAudioFingerprint();

  if (audioFingerprint) {
    hash(audioFingerprint).then((fingerprint) => {
      console.log("Audio Fingerprint Hash:", fingerprint);
    });
  } else {
    console.log("Could not generate audio fingerprint.");
  }

  const webGLFingerprint = getWebGLFingerprint();

  if (webGLFingerprint) {
    hash(webGLFingerprint).then((fingerprint) => {
      console.log("WebGL Fingerprint Hash:", fingerprint);
    });
  } else {
    console.log("Could not generate WebGL fingerprint.");
  }
};

const generateFingerprint = async () => {
  const canvas = getCanvasFingerprint();
  const fonts = getFontFingerprint();
  const navigator = getNavigatorFingerprint();
  const audio = await getAudioFingerprint();
  const webgl = getWebGLFingerprint();

  const parts = [
    `canvas:${canvas}`,
    `fonts:${fonts}`,
    `navigator:${navigator}`,
    `audio:${audio}`,
    `webgl:${webgl}`,
  ];

  const fingerprintStr = parts.join("||");
  return await hash(fingerprintStr);
};

export { generateFingerprint };
