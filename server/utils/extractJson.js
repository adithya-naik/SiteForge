const extractJson = (text) => {
  if (!text) return null

  try {
    // strip markdown fences if present
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1) return null

    const jsonString = cleaned.slice(firstBrace, lastBrace + 1)
    return JSON.parse(jsonString)

  } catch (e) {
    // JSON.parse failed — HTML inside "code" likely has unescaped quotes
    // manually extract message and code
    try {
      const messageMatch = text.match(/"message"\s*:\s*"([^"]*)"/)
      const codeStart = text.indexOf('"code"')
      if (codeStart === -1) return null

      // find the opening quote after "code":
      const afterCodeKey = text.slice(codeStart + 6) // skip past "code"
      const colonIdx = afterCodeKey.indexOf(':')
      const afterColon = afterCodeKey.slice(colonIdx + 1).trimStart()
      
      if (!afterColon.startsWith('"')) return null

      // everything between first and last quote
      const innerContent = afterColon.slice(1) // remove opening quote
      const lastQuote = innerContent.lastIndexOf('"')
      if (lastQuote === -1) return null

      const code = innerContent.slice(0, lastQuote)

      return {
        message: messageMatch?.[1] ?? "Website generated successfully.",
        code
      }
    } catch {
      return null
    }
  }
}

export default extractJson