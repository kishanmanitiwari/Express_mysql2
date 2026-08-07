import client from "../utils/ai.js";
import db from "../utils/db.js";

export async function chat(userId, conversationId, message) {
  //create title and create conversion if not exist
  const title = message.slice(0, 30);
  if (!conversationId) {
    const [result] = await db.query(
      `
        INSERT INTO conversations(user_id, title)
        VALUES(?, ?)
        `,

      [userId, title],
    );

    conversationId = result.insertId;
  }
  // Save User Message
  await db.query(
    `
    INSERT INTO messages(
        conversation_id,
        role,
        content
    )
    VALUES(?,?,?)
    `,

    [conversationId, "user", message],
  );

  //Load the chat history

  const [rows] = await db.query(
    `
SELECT role,content
FROM messages
WHERE conversation_id=?
ORDER BY created_at
`,

    [conversationId],
  );

  const messages = rows.map((row) => ({
    role: row.role,

    content: row.content,
  }));

  const response = await client.chat.completions.create({
    model: "gemini-2.5-flash",

    temperature: 0.3, // 0-1 range (Mirch Masala - Cretivity)

   s // max_tokens: 1000,

    messages,
  });

  //Ai response stored in our message table
  await db.query(
    `
INSERT INTO messages(

conversation_id,

role,

content

)

VALUES(?,?,?)
`,

    [conversationId, "assistant", response.choices[0].message.content],
  );

  return {
    conversationId: conversationId,
    message: response.choices[0].message.content,
  };
}

export async function reviewResume(prompt) {
  const completion = await client.chat.completions.create({
    model: "gemini-2.5-flash",

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content: `
You are an ATS Resume Reviewer.

Return ONLY valid JSON.

Format:

{
    "score": number,
    "strengths": [],
    "improvements": [],
    "weakness":[]
}
                `,
      },

      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
}
