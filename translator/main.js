const endpoint = "https://libretranslate.de/translate";

const subtitleSelector = "span[data-purpose='cue-text']";
const activeSubtitleSelector = "p[data-purpose='transcript-cue-active']";

const chunkSize = 25;
const characterLimit = 500;
const slowdown = 3100;

const fetchChunk = (chunk) => {
  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      q: chunk.map((el) => el.textContent),
      source: "en",
      target: "ru",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    const { translatedText, error } = await response.json();
    translatedText
      ? chunk.forEach((el, x) => el.innerText = translatedText[x])
      : console.error("[LibreTranslate]", error);
  });
};

const translateSubtitles = () => {
  const subtitles = Array.from(document.querySelectorAll(subtitleSelector));
  const activeSubtitle = document.querySelector(activeSubtitleSelector);

  const actualizedSubtitles = [
    ...subtitles.slice(subtitles.indexOf(activeSubtitle), subtitles.length),
    ...subtitles.slice(0, subtitles.indexOf(activeSubtitle)),
  ];

  let chunks = [], chunk = [];
  for (let subtitle of actualizedSubtitles) {
    const characters = subtitle.textContent +
      chunk.map((el) => el.textContent).join("");

    if (
      characters.length <= characterLimit &&
      chunk.length <= chunkSize - 1
    ) {
      chunk.push(subtitle);
    } else {
      chunks.push(chunk);
      chunk = [subtitle];
    }
  }

  [...chunks, chunk].forEach((el, i) =>
    setTimeout(fetchChunk, i * slowdown, el)
  );
};

let currentСourse;
setInterval(() => {
  if (
    currentСourse != document.location.pathname &&
    document.querySelector(activeSubtitleSelector)
  ) {
    currentСourse = document.location.pathname;
    translateSubtitles();
  }
}, 1000);
