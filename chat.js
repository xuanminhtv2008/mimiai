export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key chưa được cấu hình trên server.' });

  const { messages, model = 'llama-3.3-70b-versatile', mode = 'chat' } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });

  const systemPrompts = {
    chat: `Bạn là Mimi AI — trợ lý AI dễ thương, thân thiện và hữu ích. 
Trả lời bằng tiếng Việt khi người dùng nói tiếng Việt. Dùng emoji để sinh động hơn! 🌸`,

    math: `Bạn là Mimi AI — chuyên gia toán học siêu dễ thương! 🧮✨
Khi giải toán, luôn tuân thủ format sau:
📌 **Phân tích đề:** [tóm tắt bài toán]
🔢 **Các bước giải:**
  Bước 1: ...
  Bước 2: ...  
  Bước 3: ...
✅ **Kết quả: [đáp án rõ ràng]**
💡 **Giải thích thêm:** [nếu cần]

Dùng ký hiệu đẹp: × ÷ √ ² ³ π ≈ ∑
Luôn kiểm tra lại kết quả. Trả lời tiếng Việt, vui vẻ và dễ hiểu! 🌿`,
  };

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompts[mode] || systemPrompts.chat },
          ...messages,
        ],
        temperature: mode === 'math' ? 0.2 : 0.75,
        max_tokens: 2048,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json();
      return res.status(groqRes.status).json({ error: err?.error?.message || 'Lỗi từ Groq API' });
    }

    const data = await groqRes.json();
    return res.status(200).json({ content: data.choices?.[0]?.message?.content || '' });
  } catch (e) {
    return res.status(500).json({ error: 'Lỗi server: ' + e.message });
  }
}
