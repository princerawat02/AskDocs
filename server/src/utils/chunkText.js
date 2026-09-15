export function chunkPages(pages, chunkSize = 500, overlap = 100) {
  const words = [];

  for (const page of pages) {
    const pageWords = page.text.split(/\s+/).filter(Boolean);

    for (const word of pageWords) {
      words.push({
        word,
        pageNumber: page.num,
      });
    }
  }

  const chunks = [];
  const step = chunkSize - overlap;

  for (let i = 0; i < words.length; i += step) {
    const chunkWords = words.slice(i, i + chunkSize);

    if (chunkWords.length === 0) {
      break;
    }

    const content = chunkWords
      .map((item) => item.word)
      .join(" ");

    const pageNumbers = [
      ...new Set(
        chunkWords.map((item) => item.pageNumber)
      ),
    ];

    chunks.push({
      content,
      pageNumbers,
    });

    if (i + chunkSize >= words.length) {
      break;
    }
  }

  return chunks;
}