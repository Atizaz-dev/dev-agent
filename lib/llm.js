const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

const provider = process.env.LLM_PROVIDER || 'anthropic';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Call LLM with system prompt and user message
 */
async function callLLM(systemPrompt, userMessage, options = {}) {
  const { temperature = 0.3, maxTokens = 4000, expectJSON = false } = options;

  try {
    if (provider === 'anthropic') {
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      });

      const content = response.content[0].text;
      return expectJSON ? extractJSON(content) : content;
    } else {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      });

      const content = response.choices[0].message.content;
      return expectJSON ? extractJSON(content) : content;
    }
  } catch (error) {
    console.error('LLM API Error:', error.message);
    throw error;
  }
}

/**
 * Extract JSON from markdown code blocks or raw text
 */
function extractJSON(text) {
  // Try to find JSON in code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1]);
  }

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('No valid JSON found in LLM response');
}

/**
 * Call LLM with conversation history
 */
async function callLLMWithHistory(systemPrompt, messages, options = {}) {
  const { temperature = 0.3, maxTokens = 4000 } = options;

  try {
    if (provider === 'anthropic') {
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages
      });

      return response.content[0].text;
    } else {
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        temperature,
        max_tokens: maxTokens,
        messages: formattedMessages
      });

      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error('LLM API Error:', error.message);
    throw error;
  }
}

module.exports = {
  callLLM,
  callLLMWithHistory,
  extractJSON
};