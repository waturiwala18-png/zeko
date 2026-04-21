export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ reply: 'POST بس لو سمحت' });
  }

  const userMessage = req.body.message;
  const API_KEY = AIzaSyAFDbzJJpvGtfKnNmVQZbAxOkf67Xvc9-Y;

  if (!API_KEY) {
    return res.status(500).json({ reply: 'المفتاح مش محطوط في السيرفر يا زعيم' });
  }

  try {
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
        })
      }
    );

    const data = await apiRes.json();

    if (data.error) {
      return res.status(500).json({ reply: `جوجل بيقول: ${data.error.message}` });
    }

    if (!data.candidates ||!data.candidates[0].content) {
       return res.status(500).json({ reply: 'جوجل مردش بحاجة، ممكن السؤال كان حساس بزيادة' });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: 'السيرفر مات، جرب تاني كمان شوية' });
  }
}