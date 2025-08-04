// proxy.js (Cloudflare Worker or Vercel function)
addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});
async function handle(request) {
  const { token, chat_id, message } = await request.json();
  const resp = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text: message, parse_mode: "Markdown" })
    }
  );
  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
