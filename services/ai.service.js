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

    // max_tokens: 1000,

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

// Add this to your ai.service.js file
export async function getUserConversations(userId) {
  const [rows] = await db.query(
    `
    SELECT id, title, created_at 
    FROM conversations 
    WHERE user_id = ? 
    ORDER BY created_at DESC
    `,
    [userId],
  );

  return rows;
}

// Add these to your services/ai.service.js file

export async function getConversationMessages(conversationId, userId) {
  // 1. Verify the conversation actually belongs to this user
  const [conv] = await db.query(
    `SELECT id FROM conversations WHERE id = ? AND user_id = ?`,
    [conversationId, userId]
  );

  if (conv.length === 0) {
    throw new Error("Conversation not found or unauthorized");
  }

  // 2. Fetch the messages, renaming 'content' to 'text' to match your React state
  const [rows] = await db.query(
    `
    SELECT role, content AS text 
    FROM messages 
    WHERE conversation_id = ? 
    ORDER BY created_at ASC
    `,
    [conversationId]
  );

  return rows;
}

export async function deleteConversation(conversationId, userId) {
  // The ON DELETE CASCADE in your DB schema will automatically handle the messages
  const [result] = await db.query(
    `DELETE FROM conversations WHERE id = ? AND user_id = ?`,
    [conversationId, userId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Conversation not found or unauthorized");
  }

  return true;
}
