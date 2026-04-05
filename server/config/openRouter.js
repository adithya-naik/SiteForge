const openRouterURL = "https://openrouter.ai/api/v1/chat/completions"

const model = "deepseek/deepseek-chat"

const generateResponse = async (prompt) => {
  const response = await fetch(openRouterURL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You must return only valid raw JSON"
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temparature: 0.2
    }),
  });

  if (!response.ok) {
    const error = await res.text()
    throw new Error("Open Router + err")
  }

  const data = await res.json()
  return data;
}