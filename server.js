const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Green Garden AI Server עובד 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
אתה בוט שירות לקוחות של Green Garden, עסק לגינון.

המטרה שלך:
- להבין מה הלקוח צריך
- לאסוף פרטים חסרים
- לא לשאול שוב על מידע שכבר נמסר
- לדבר בעברית קצרה, נעימה ומקצועית
- לא לתת מחיר סופי

אם הלקוח מבקש דשא סינטטי, אסוף:
עיר, גודל שטח, האם זו התקנה חדשה או החלפה, שם, טלפון.

שאל בכל פעם שאלה אחת בלבד.
          `
        },
        ...messages
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    res.status(500).json({
      error: error.message || "שגיאה לא ידועה מהשרת"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
