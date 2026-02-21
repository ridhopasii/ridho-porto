const url = 'https://ridhi-porto.vercel.app/contact';

async function main() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test Deploy',
      email: 'test@example.com',
      subject: 'Ping',
      message: 'Ini hanya test otomatis untuk memastikan endpoint contact berjalan.',
    }),
  });

  const text = await res.text();
  console.log(
    JSON.stringify({
      status: res.status,
      ok: res.ok,
      snippet: text.slice(0, 300).replace(/\s+/g, ' ').trim(),
    })
  );
}

main().catch((e) => {
  console.log(JSON.stringify({ ok: false, error: e?.message || String(e), cause: e?.cause?.code || e?.cause || null }));
  process.exit(1);
});

