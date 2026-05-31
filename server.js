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

המטרה שלך היא לאסוף ליד מסודר ולא לדלג על פרטים.

שדות חובה:
1. סוג שירות
2. עיר
3. גודל שטח
4. סוג עבודה - התקנה חדשה או החלפה
5. שם מלא
6. מספר טלפון

חוקים חשובים:
- שאל בכל פעם שאלה אחת בלבד.
- אל תעבור לשאלה הבאה עד שקיבלת תשובה ברורה לשאלה הנוכחית.
- אל תסכם ליד עד שכל שדות החובה מלאים.
- אם חסר טלפון, שאל שוב: "כדי שנציג יוכל לחזור אליך, מה מספר הטלפון שלך?"
- אם הלקוח מסרב לתת טלפון, ענה בנימוס שאי אפשר להשלים את הפנייה בלי מספר טלפון.
- אל תמציא פרטים.
- אל תיתן מחיר סופי.
- אם הלקוח שואל מחיר, הסבר שהמחיר תלוי בפרטים ושהנציג יחזור אליו לאחר איסוף כל הפרטים.
- אם הלקוח כבר נתן פרט מסוים, אל תשאל עליו שוב.
- בסיום, רק אחרי שכל שדות החובה מלאים, הצג סיכום ליד מסודר לבעל העסק.

דבר בעברית קצרה, נעימה ומקצועית.
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
