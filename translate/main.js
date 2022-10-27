const ENDPOINT = "https://translate.terraprint.co/translate";

const SUBTITLE_SELECTOR = "span[data-purpose='cue-text']";
const CURSOR_SELECTOR = "p[data-purpose='transcript-cue-active']";

const SUBTITLE_LIMIT = 25;
const CHARACTER_LIMIT = 500;
const SLOWDOWN = 4000;

const fetchChunk = async (chunk) => {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: chunk.map((el) => el.textContent),
      source: "en",
      target: "ru",
    }),
  });

  const { translatedText } = await res.json();
  if (translatedText?.length === chunk.length) {
    chunk.forEach((el, i) => el.innerText = translatedText[i]);
  }
};

const translate = () => {
  const subtitles = Array.from(
    document.querySelectorAll(SUBTITLE_SELECTOR),
  );

  const cursor = subtitles.indexOf(
    document
      .querySelector(CURSOR_SELECTOR)
      .querySelector(SUBTITLE_SELECTOR),
  );

  const sortedSubtitles = [
    ...subtitles.slice(cursor, subtitles.length),
    ...subtitles.slice(0, cursor),
  ];

  let heap = "", chunks = [], chunk = [];
  for (let subtitle of sortedSubtitles) {
    heap += subtitle.textContent;
    if (
      chunk.length + 1 <= SUBTITLE_LIMIT &&
      heap.length <= CHARACTER_LIMIT
    ) {
      chunk.push(subtitle);
    } else {
      chunks.push(chunk);
      chunk = [subtitle];
      heap = subtitle.textContent;
    }
  }

  [...chunks, chunk].forEach((el, i) =>
    setTimeout(fetchChunk, i * SLOWDOWN, el)
  );
};

let pathname;
setInterval(() => {
  if (
    pathname !== document.location.pathname &&
    document.querySelector(CURSOR_SELECTOR)
  ) {
    pathname = document.location.pathname;
    translate();
  }
}, 1000);
