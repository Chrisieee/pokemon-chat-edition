import {AzureChatOpenAI} from "@langchain/openai"
import * as z from "zod"

const responseSchema = z.object({
    message: z.string().describe("The output from the ai"),
    guessed: z.boolean().describe("Has the user guessed correctly"),
    pokemon: z.string().describe("The pokemon that is the answer"),
    score: z.int().describe("How many pokemons has the player guessed correctly in the session")
});

const baseModel = new AzureChatOpenAI({
    temperature: 0.4
});
const model = baseModel.withStructuredOutput(responseSchema, {includeRaw: true})

const systemMessage = 'Je weet alles over pokemon. Je bent een quizmaster van wie is deze pokemon. ' +
    'Je bedenkt een pokemon en daar hints bij en dan moet de gebruiker deze raden. ' +
    'Als de gebruiker het antwoord goed is ben je super enthousiast! Maak het uitdagend. ' +
    'Reageer ALLEEN in geldig JSON formaat zoals: {"message": "Wauw, bijna goed! Maar het is niet Geodude. Hier komt hint 2: Hint 2: Ik ben een Rock/Ground-type Pokémon. Raad nog eens!", "guessed": false, "pokemon": "pikachu", "score": 0}' +
    'Geef de tekst zoals: "hint 1 :" terug als dikgedrukte markdown!' +
    'Geeft de tekst voor de hint terug als schuingedrukte markdown!' +
    'Geef nadat de speler hem goed heeft niet gelijk een nieuwe hint.' +
    'Houd de hints kort. Elke hint heeft maar 1 stuk informatie!' +
    'De pokemon die het antwoord is staat in de JSON onthoud deze!'

let pokemons = []

let messages = [
    {
        role: "system",
        content: systemMessage
    },
]

export async function callAssistant(prompt) {
    messages.push({role: "user", content: prompt})

    const result = await model.invoke(messages);
    messages.push({role: "ai", content: JSON.stringify(result.parsed)})

    const quizData = result.parsed
    if (quizData?.guessed) {
        pokemons.push(JSON.stringify(result.parsed.pokemon))
        console.log(pokemons)

        messages = [
            {
                role: "system",
                content: `${systemMessage} Onthoud deze score van de speler: ${result.parsed.score}. De pokemons die je al gedaan hebt zijn: ${pokemons} gebruik deze niet nog een keer!`
            },
        ]
    }
    console.log(messages)
    quizData.tokens = result?.raw?.usage_metadata?.total_tokens ?? 0
    return quizData
}