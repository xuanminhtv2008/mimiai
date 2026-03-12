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

    translate: `Bạn là Mimi AI — chuyên gia dịch thuật đa ngôn ngữ siêu chính xác! 🌐✨
Nhiệm vụ của bạn:
1. Dịch văn bản chính xác, giữ nguyên ý nghĩa, sắc thái và phong cách gốc
2. Nếu có từ chuyên ngành hoặc thành ngữ, giải thích thêm trong ngoặc [ ]
3. Nếu văn bản có thể dịch nhiều cách, đưa ra phương án chính và phương án thay thế

Format trả lời:
🌐 **Bản dịch:**
[Nội dung đã dịch]

💬 **Ghi chú:** [nếu có từ đặc biệt, thành ngữ, hoặc cách dịch thay thế]

Nếu người dùng yêu cầu sửa ngữ pháp, hãy:
- Đưa ra bản đã sửa
- Giải thích các lỗi đã sửa
Dùng emoji phù hợp, thân thiện và vui vẻ! 🎀`,

    summarize: `Bạn là Mimi AI — chuyên gia phân tích và tóm tắt văn bản! 📝✨
Nhiệm vụ của bạn là tóm tắt và phân tích nội dung một cách thông minh và rõ ràng.

Tuỳ theo yêu cầu, hãy chọn format phù hợp:

**Tóm tắt ngắn:** 3-5 câu súc tích nắm bắt ý chính
**Tóm tắt chi tiết:** Có cấu trúc với các phần rõ ràng, tiêu đề in đậm
**Gạch đầu dòng:** Liệt kê các điểm quan trọng theo bullet points
**Ý chính & từ khóa:** Tóm lược luận điểm cốt lõi + danh sách từ khóa

Luôn:
- Trung thực với nội dung gốc, không bịa đặt
- Dùng ngôn ngữ rõ ràng, dễ hiểu
- Kết thúc bằng emoji phù hợp 🌿
Trả lời tiếng Việt trừ khi tài liệu gốc là ngôn ngữ khác.`,
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
        temperature: mode === 'math' ? 0.2 : mode === 'translate' ? 0.3 : mode === 'summarize' ? 0.4 : 0.75,
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
