import {
  AIStream,
  trimStartOfStreamHelper,
  type AIStreamCallbacks
} from './ai-stream'

function parseOpenAIStream(): (data: string) => string | void {
  const trimStartOfStream = trimStartOfStreamHelper()
  return data => {
    const json = JSON.parse(data)

    if (json.choices[0]?.delta?.function_call?.name) {
      return `{"function_call": {"name": "${json.choices[0]?.delta?.function_call.name}", "arguments": "`
    } else if (json.choices[0]?.delta?.function_call?.arguments) {
      const argumentChunk: string = json.choices[0].delta.function_call.arguments;

      let escapedPartialJson = argumentChunk
        .replace(/\\/g, '\\\\') // Replace backslashes first to prevent double escaping
        .replace(/\//g, '\\/')  // Escape slashes
        .replace(/"/g, '\\"')   // Escape double quotes
        .replace(/\n/g, '\\n')  // Escape new lines
        .replace(/\r/g, '\\r')  // Escape carriage returns
        .replace(/\t/g, '\\t')  // Escape tabs
        .replace(/\f/g, '\\f'); // Escape form feeds

      return `${escapedPartialJson}`
    } else if (json.choices[0]?.finish_reason === 'function_call') {
      return '"}}'
    }

    // this can be used for either chat or completion models
    const text = trimStartOfStream(
      json.choices[0]?.delta?.content ?? json.choices[0]?.text ?? ''
    )

    return text
  }
}

export function OpenAIStream(
  res: Response,
  cb?: AIStreamCallbacks
): ReadableStream {
  return AIStream(res, parseOpenAIStream(), cb)
}
