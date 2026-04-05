const openRouterURL = 'https://openrouter.ai/api/v1/chat/completions';
const model = 'deepseek/deepseek-chat';
import dotenv from 'dotenv';
dotenv.config();
// console.log("API KEY :", process.env.OPEN_ROUTER_API_KEY)

export const generateResponse = async (prompt, retryInstruction = '') => {
  const response = await fetch(openRouterURL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You must return only valid raw JSON. No markdown. No backticks. No explanations.'
        },
        {
          role: 'user',
          content: retryInstruction ? prompt + '\n\n' + retryInstruction : prompt,
        },
      ],
      temperature: 0.2
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`OpenRouter API error ${response.status}: ${JSON.stringify(data)}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`Empty content from model. Full response: ${JSON.stringify(data)}`);
  }

  return content;
};