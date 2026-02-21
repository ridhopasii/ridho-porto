const urls = [
  'https://ridhi-porto.vercel.app/',
  'https://ridhi-porto.vercel.app/health',
  'https://ridhi-porto.vercel.app/showcase',
];

async function check(url) {
  const res = await fetch(url, { redirect: 'follow' });
  const text = await res.text();

  return {
    url,
    status: res.status,
    ok: res.ok,
    snippet: text.slice(0, 120).replace(/\s+/g, ' ').trim(),
  };
}

async function main() {
  for (const url of urls) {
    try {
      const result = await check(url);
      console.log(JSON.stringify(result));
    } catch (e) {
      console.log(
        JSON.stringify({
          url,
          ok: false,
          error: e?.message || String(e),
          cause: e?.cause?.code || e?.cause || null,
        })
      );
    }
  }
}

main();

