import client from "../utils/ai.js";

export async function chat(message) {
  const response = await client.chat.completions.create({
    model: "gemini-2.5-flash",

    temperature : 0, // 0-1 range (Mirch Masala - Cretivity)

    //max_tokens: 500,

    messages: [
      // {
      //   role: "system",
      //   content: "You are a Senior Java Trainer.",
      // },
      {
        role: "user",
        content: message,
      },

      // {
      //   role: "assistant",
      //   content: "JVM stands for Java Virtual Machine...",
      // },
    ],
  });

  return response.choices[0].message.content;
}

//Token

// how are you 

// h-1
// o-1
// w-1
// ""-1
// a -1
// r-1
// e-1
// ""-1
// y-1
// o-1
// i-1


