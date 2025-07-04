# Medieval WhatsApp Bot

Ce bot s'appuie sur **whatsapp-web.js** pour se connecter à WhatsApp Web et sur **Google Gemini** pour générer du texte et des images.

## Fonctionnalités principales

* **QR Code** : scannez le QR affiché dans le terminal pour appairer le bot.
* **Commandes**
  * `!action <membre> <cible> <arme>` : décrit une action de combat. Toute imprécision est sanctionnée.
  * `!image <description>` : génère une image correspondant à la description via Gemini/Imagen et l'envoie dans le chat.
* **Contexte RP** : les réponses sont formulées dans l'univers steampunk/magie d'Azeo.

## Prérequis

1. **Node.js >= 18**
2. Un token **GEMINI_API_KEY** (Google AI Studio ou Vertex AI)
3. Un compte WhatsApp à appairer.

## Installation

```bash
cd whatsapp-bot
npm install
```

Créez (ou exportez) la variable d'environnement :

```bash
export GEMINI_API_KEY="<votre_cle_google_ai>"
```

## Lancement

```bash
npm start
```

Scannez le QR code, puis utilisez les commandes dans n'importe quel groupe où le bot est présent.

## Notes

* Les sessions WhatsApp sont stockées (répertoire `./.wwebjs_auth/`) pour éviter de rescanner le QR à chaque redémarrage.
* Les images sont temporairement écrites dans le dossier système `/tmp` puis supprimées après envoi.
* Le modèle d'image peut évoluer ; changez l'ID dans `index.js` si nécessaire.