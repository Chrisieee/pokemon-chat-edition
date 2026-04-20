import {AzureChatOpenAI} from "@langchain/openai"

const model = new AzureChatOpenAI({
    temperature: 0.4, streaming: true
});

const systemMessage = 'Je weet alles over pokemon. Je kan heel goed citeren uit de anime en games. Geef alleen de quote terug!'

let quotes = []

let messages = [
    {role: "system", content: systemMessage},
]

export async function callQuotesAssistant(prompt, res) {
    messages.push({role: "user", content: prompt})
    let fullText = ""

    for await (const chunk of await model.stream(messages)) {
        if (chunk.content) {
            // console.log(chunk.content)
            fullText += chunk.content
            res.write(
                `data: ${JSON.stringify({
                    content: chunk.content
                })}\n\n`
            );
            await new Promise(r => setTimeout(r, 80));
        }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();

    messages.push({role: "ai", content: JSON.stringify(fullText)})
    quotes.push(JSON.stringify(fullText))

    messages = [
        {
            role: "system",
            content: `${systemMessage} De quotes die je al gedaan hebt zijn: ${quotes} gebruik deze niet nog een keer!`
        },
    ]
}