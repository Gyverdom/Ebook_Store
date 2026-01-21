import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  // 1. TCHEKE KLE YO
  console.log("--- TÈS NOTIFIKASYON ---");
  console.log("Token egziste?", !!TELEGRAM_BOT_TOKEN); // L ap di true oswa false
  console.log("Chat ID egziste?", !!TELEGRAM_CHAT_ID); // L ap di true oswa false

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("❌ ERÈ: Kle Telegram yo manke nan anviwònman an.");
    return NextResponse.json({ success: false, message: "Missing config" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { productName, price, transactionId, phone } = body;

    const message = `
🚨 **NOUVO LÒD!** 🚨
📘 ${productName}
💰 ${price} HTG
📱 ${phone}
🆔 ${transactionId}
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // 2. VOYE REKÈT LA
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    // 3. GADE REPONS TELEGRAM NAN
    const data = await response.json();
    
    if (!response.ok) {
        console.error('❌ Telegram refize mesaj la:', data); // <--- GADE LA A
        return NextResponse.json({ success: false, error: data }, { status: 500 });
    }

    console.log("✅ Mesaj voye avèk siksè!");
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Gwo Erè:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}