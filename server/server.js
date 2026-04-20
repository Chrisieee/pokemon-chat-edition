import express from 'express'
import {callAssistant} from "./chat.js"
import {callQuotesAssistant} from "./quote.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.post('/api/quote', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await callQuotesAssistant(req.body.message, res)
})

app.post('/api/chat', async (req, res) => {
    const prompt = req.body.prompt
    const response = await callAssistant(prompt)
    res.json(response)
})

app.use(express.static("public"));
app.listen(3000, () => console.log(`Server on http://localhost:3000`))
