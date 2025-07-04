export async function fetchQr(): Promise<string|null> {
  try {
    const res = await fetch('/api/qr');
    if (!res.ok) return null;
    return await res.text();
  } catch (_) {
    return null;
  }
}

export async function fetchStatus(): Promise<{ ready: boolean }> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) return { ready: false };
    return await res.json();
  } catch (_) {
    return { ready: false };
  }
}