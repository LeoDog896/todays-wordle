import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";

const wordleSchema = z.object({
  id: z.number(),
  solution: z.string(),
  print_date: z.string(),
  days_since_launch: z.number(),
  editor: z.string(),
});

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
]).then((wordles) => wordles.map((wordle) => wordleSchema.parse(wordle)));

await Deno.writeTextFile(
  "data.json",
  JSON.stringify({ yesterday, today, tomorrow }),
);

await Deno.writeTextFile(
  "README.md",
  `# today's wordle generator

uses the ny times API: \`https://www.nytimes.com/svc/wordle/v2/YYYY-MM-DD.json\`

## yesterday

<details>
    <summary>click to see yesterday's wordle</summary>

    ${yesterday.solution}
</details>

## today

<details>
    <summary>click to see today's wordle</summary>

    ${today.solution}
</details>

## tomorrow

<details>
    <summary>click to see tomorrow's wordle</summary>

    ${tomorrow.solution}
</details>
`,
);
