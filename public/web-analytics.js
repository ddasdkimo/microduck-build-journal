// Only collect public production browsing, never local previews or moderation.
if (location.hostname === 'microduck.intemotech.com' && !location.pathname.startsWith('/moderation')) {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.dataset.cfBeacon = JSON.stringify({token: 'f37a0a038e4f40b5be9de75ceede1d97'});
  document.head.appendChild(script);
}
