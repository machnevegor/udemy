const subtitleSelector = "span[data-purpose='cue-text']";
const activeSubtitleSelector = "p[data-purpose='transcript-cue-active']";

const endpoint = "https://libretranslate.de/translate";
const chunkSize = 5;
const cooldown = 4000;

const fetchChunk = (chunk) => {
  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      q: chunk.map((subtitle) => subtitle.textContent),
      source: "en",
      target: "ru",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    const { translatedText, error } = await response.json();
    translatedText
      ? chunk.forEach((subtitle, x) => subtitle.innerText = translatedText[x])
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

  for (let i = 0; i < Math.ceil(actualizedSubtitles.length / chunkSize); i++) {
    const chunk = actualizedSubtitles.slice(
      i * chunkSize,
      i * chunkSize + chunkSize,
    );
    setTimeout(fetchChunk, i * cooldown, chunk);
  }
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
