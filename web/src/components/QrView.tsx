// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { fetchQr, fetchStatus } from '../lib/api';

export default function QrView() {
  const [qr, setQr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Poll QR every 5 s until ready
  useEffect(() => {
    const load = async () => {
      const status = await fetchStatus();
      setReady(status.ready);
      if (!status.ready) {
        const q = await fetchQr();
        setQr(q);
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (ready) {
    return <p className="text-green-600">✅ Bot connecté !</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Scannez le QR-code pour connecter le bot</h2>
      {qr ? <QRCode value={qr} size={256} /> : <p>Chargement du QR…</p>}
    </div>
  );
}