import express from 'express'
import {callAssistant} from "./chat.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.post('/api/chat', async (req, res) => {
    const prompt = req.body.prompt
    const response = await callAssistant(prompt)
    res.json(response)
})

app.use(express.static("public"));
app.listen(3000, () => console.log(`Server on http://localhost:3000`))
