import { NextResponse } from 'next/server';

// --- RANPLASE 2 BAGAY SA YO ---
const TELEGRAM_BOT_TOKEN = '8567551368:AAHoNN-fBDPfRTKnH1CZxpUuYkeInDgZR00';
const TELEGRAM_CHAT_ID = '7941511917';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, price, transactionId, phone } = body;

    // Mesaj k ap parèt sou telefòn ou an
    const message = `
💰 **NOUVO LÒD RANTRE!** 💰

📘 **Liv:** ${productName}
💵 **Montan:** ${price} HTG
📱 **Telefòn:** ${phone}
🆔 **ID Tranzaksyon:** \`${transactionId}\`

_Ale nan Supabase pou valide l vit!_
    `;

    // Voye mesaj la bay Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erè Telegram:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}