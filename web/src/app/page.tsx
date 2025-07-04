// @ts-nocheck

import QrView from '../components/QrView';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Medieval WhatsApp Bot</h1>
      <QrView />
    </main>
  );
}