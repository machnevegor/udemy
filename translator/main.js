let currentСourse;
const subtitleSelector = "span[data-purpose='cue-text']",
  activeSubtitleSelector = "p[data-purpose='transcript-cue-active']",
  endpoint = "https://libretranslate.de/translate";

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
    const { translatedText } = await response.json();
    chunk.forEach((subtitle, x) => subtitle.innerText = translatedText[x]);
  });
};

const translateSubtitles = () => {
  const subtitles = Array.from(document.querySelectorAll(subtitleSelector));
  const activeSubtitle = document.querySelector(activeSubtitleSelector);

  const actualizedSubtitles = [
    ...subtitles.slice(subtitles.indexOf(activeSubtitle), subtitles.length),
    ...subtitles.slice(0, subtitles.indexOf(activeSubtitle)),
  ];

  for (let i = 0; i < Math.ceil(actualizedSubtitles.length / 5); i++) {
    const chunk = actualizedSubtitles.slice(i * 5, i * 5 + 5);
    setTimeout(fetchChunk, i * 3500, chunk);
  }
};

setInterval(() => {
  if (
    currentСourse != document.location.pathname &&
    document.querySelector(activeSubtitleSelector)
  ) {
    currentСourse = document.location.pathname;
    translateSubtitles();
  }
}, 1000);
