/*
  Medieval WhatsApp Bot using WhatsApp Web & Google Gemini
  --------------------------------------------------------
  1. Scan the QR code shown in the terminal to pair the bot.
  2. Environment variable GEMINI_API_KEY must contain a valid key from Google AI Studio or Vertex AI.
  3. Commands:
     - !action <member> <target> <weapon>
       Example: !action Arthur gobelin épée
     - !image <description>
       Example: !image A steam-powered knight in an ancient library
*/

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// ----------------------------------------------
// Configuration & helpers
// ----------------------------------------------

if (!process.env.GEMINI_API_KEY) {
  console.error('❌  Variable d\'environnement GEMINI_API_KEY manquante !');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Utilitaire pour générer une image via Gemini / Imagen
async function generateImage(prompt) {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-preview-06-06',
    prompt,
  });

  const base64 = response?.generatedImages?.[0]?.data;
  if (!base64) throw new Error('Image vide');
  const temp = path.join(os.tmpdir(), `gemini_${Date.now()}.png`);
  fs.writeFileSync(temp, Buffer.from(base64, 'base64'));
  return temp;
}

// ----------------------------------------------
// WhatsApp client setup
// ----------------------------------------------
const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'medieval_bot' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('\u2728  Scannez le QR code ci-dessus pour connecter le bot.');
});

client.on('ready', () => {
  console.log('✅  Bot prêt !');
});

client.on('message_create', async (msg) => {
  // Ignore our own messages
  if (msg.fromMe) return;

  const chat = await msg.getChat();
  const groupName = chat.isGroup ? chat.name : 'Session Privée';
  const text = msg.body.trim();

  // ------------------------------------------------------------------
  // Commande !image => génération d'image
  // ------------------------------------------------------------------
  if (text.startsWith('!image ')) {
    const prompt = text.slice(7).trim();
    if (!prompt) {
      await msg.reply('⚠️  Utilisation: !image <description>');
      return;
    }
    await msg.reply('🖼️  Génération de l\'image, patientez…');
    try {
      const imgPath = await generateImage(`[Groupe: ${groupName}] ${prompt}`);
      const media = MessageMedia.fromFilePath(imgPath);
      await chat.sendMessage(media, { caption: prompt });
      fs.unlinkSync(imgPath);
    } catch (err) {
      console.error(err);
      await msg.reply('❌  Échec de la génération d\'image.');
    }
    return;
  }

  // ------------------------------------------------------------------
  // Commande !action => action de combat structurée
  // ------------------------------------------------------------------
  if (text.startsWith('!action ')) {
    const parts = text.slice(8).trim().split(/\s+/);

    if (parts.length < 3) {
      await msg.reply('⛔  Chaque action doit préciser <membre> <cible> <arme>. Exemple:\n!action Arthur gobelin épée');
      return;
    }

    const [member, target, ...weaponParts] = parts;
    const weapon = weaponParts.join(' ');
    const actionSentence = `${member} attaque ${target} avec ${weapon}`;

    // Confirmation immédiate
    await chat.sendMessage(`⚔️  Action reçue: ${actionSentence}`);

    // Narration par l'IA (avec contexte de groupe)
    try {
      const narration = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Tu es le narrateur d'un univers steampunk médiéval où Azeo, dieu devenu fou, a cédé la place aux Incurse Gods. Le nom du groupe WhatsApp est "${groupName}" et sert de repère pour suivre l'évolution du scénario. Raconte en exactement 4 phrases épiques, à la deuxième personne, la conséquence de l'action suivante:
Action: ${actionSentence}`,
      });
      await chat.sendMessage(narration.text);
    } catch (err) {
      console.error(err);
    }
    return;
  }
});

client.initialize();