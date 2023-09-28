//open AI set up:
const OpenAIApi = require("openai");
const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY
});

//open ai completion function for certain prompt:
// async function processPrompt(promptMsg) {
//   const response = await openai.completions.create({
//     model: "text-davinci-003",
//     prompt: promptMsg,
//     max_tokens: 500,
//     temperature: 0,
//   });
//   return response['choices'][0]['text'];
// }

async function processPrompt(promptMsg) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: "You are a helpful assistant."
    },
    {
      role: "user",
      content: promptMsg
    }]
  });

  return response['choices'][0]['message']['content'];
}


module.exports = {
  processPrompt
};
