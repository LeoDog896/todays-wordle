function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${
    day.toString().padStart(2, "0")
  }`;
}

async function getWordle(date: string) {
  const response = await fetch(
    `https://www.nytimes.com/svc/wordle/v2/${date}.json`,
  );
  return await response.json();
}

// get the wordle for today, tomorrow, and yesterday
const [yesterday, today, tomorrow] = await Promise.all([
  getWordle(formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000))),
  getWordle(formatDate(new Date())),
  getWordle(formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000))),
]);

await Deno.writeTextFile(
  "data.json",
  JSON.stringify({ yesterday, today, tomorrow }),
);
