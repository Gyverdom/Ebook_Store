import { NextResponse } from 'next/server';

// 1. Rekipere kle sekrè yo nan kòfrefò a (Environment Variables)
// GitHub pa ka wè sa yo, se sèlman sèvè a ki konnen yo.
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  try {
    // Tcheke si kle yo egziste (pou evite erè si ou bliye mete yo nan .env)
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("ERREUR: Token Telegram oswa Chat ID manke nan .env.local");
      return NextResponse.json({ success: false, message: "Missing config" }, { status: 500 });
    }

    const body = await request.json();
    const { productName, price, transactionId, phone } = body;

    // 2. Prepare mesaj la (Ou ka modifye fòma a si w vle)
    const message = `
🚨 **NOUVO LÒD POU VALIDE!** 🚨

📘 **Liv:** ${productName}
💵 **Montan:** ${price} HTG
📱 **Telefòn:** ${phone}
🆔 **ID Tranzaksyon:** \`${transactionId}\`

_Ale nan Supabase > Orders pou valide l kounye a!_
    `;

    // 3. Voye mesaj la bay Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown', // Sa pèmèt nou mete *Gras* ak _Italik_
      }),
    });

    if (!response.ok) {
        const telegramError = await response.json();
        console.error('Telegram API Error:', telegramError);
        return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erè Jeneral nan Route Telegram:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}