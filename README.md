# 🌸 Mimi AI — Cute AI Chatbot

Chatbot AI dễ thương với giao diện Hello Kitty, màu matcha + hồng nhạt.  
Powered by **Groq API** · API Key **ẩn hoàn toàn** trên Vercel server.

## 🚀 Deploy lên Vercel (5 phút)

### Bước 1 — Upload code lên GitHub
1. Vào [github.com](https://github.com) → **New repository** → đặt tên `mimi-ai`
2. Upload 3 files: `index.html`, `vercel.json`, `api/chat.js`  
   *(Chú ý: file `chat.js` phải nằm trong thư mục `api/`)*

### Bước 2 — Deploy trên Vercel
1. Vào [vercel.com](https://vercel.com) → Đăng nhập bằng GitHub
2. Nhấn **"Add New Project"** → chọn repo `mimi-ai`
3. Nhấn **Deploy** (không cần cấu hình gì thêm)

### Bước 3 — Thêm API Key (QUAN TRỌNG)
1. Trong Vercel dashboard → Project → **Settings** → **Environment Variables**
2. Thêm biến:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `gsk_xxxxxxxxxxxx` *(lấy tại console.groq.com)*
   - **Environment:** Production, Preview, Development *(check tất cả)*
3. Nhấn **Save**
4. Vào **Deployments** → **Redeploy** để áp dụng

✅ Xong! API Key được ẩn hoàn toàn, không ai xem được từ frontend.

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 💬 Chat Mode | Trò chuyện thông thường, hỏi đáp |
| 🧮 Math Mode | Giải toán từng bước chi tiết |
| = Máy tính nhanh | Tính ngay không cần AI (math.js) |
| 🔊 Đọc đáp án | Text-to-speech kết quả toán |
| 📋 Sao chép | Copy nội dung AI trả lời |
| 💾 Lịch sử | Lưu & load lại cuộc trò chuyện |
| 🔒 API Key ẩn | Chạy qua Vercel serverless function |

## 📁 Cấu trúc

```
mimi-ai/
├── index.html      # Giao diện chính
├── vercel.json     # Config Vercel
└── api/
    └── chat.js     # Serverless function (ẩn API key)
```

## 🆓 Lấy Groq API Key miễn phí
→ [console.groq.com](https://console.groq.com) → Sign up → API Keys → Create
