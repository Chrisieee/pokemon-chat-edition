import {useEffect, useRef, useState} from "react";
import UserMessage from "./components/user-message.jsx";
import AiMessage from "./components/ai-message.jsx";
import {micromark} from 'https://esm.sh/micromark@3?bundle'

function App() {
    const [chat, setChat] = useState([{
        role: "ai", message: "Hallo trainer, Ben je klaar om een pokemon te raden?"
    }])
    const [formData, setFormData] = useState({prompt: ""})
    const [isLoading, setIsLoading] = useState(false)
    const bottomRef = useRef(null)
    const [score, setScore] = useState(0)
    const [quote, setQuote] = useState(null)

    const inputHandler = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const sendChat = async ({prompt}) => {
        setChat(prev => [...prev, {
            role: "user", message: prompt,
        }])
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt})
            })
            const data = await response.json()
            if (data) {
                setIsLoading(false)
            }
            setChat(prev => [...prev, {
                role: "ai", message: micromark(data.message), tokens: data.tokens
            }])
            setScore(data.score)
        } catch (e) {
            console.log(e.message)
        }
    }

    const getQuote = async () => {
        console.log("test")
        try {
            const response = await fetch('http://localhost:3000/api/quote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: "Geef me een toffe quote uit pokemon"})
            })

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let fullText = ""

            while (true) {
                const {done, value} = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split("\n\n")

                for (let line of lines) {

                    if (!line.startsWith("data:")) continue
                    const data = line.replace("data: ", "")
                    if (data === "[DONE]") return

                    const parsed = JSON.parse(data)
                    fullText += parsed.content
                    setQuote(fullText)
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    const formHandler = (e) => {
        e.preventDefault()
        sendChat(formData)
        setFormData({prompt: ""})
        setIsLoading(true)
    }

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        console.log(chat)
        scrollToBottom()
    }, [chat])

    useEffect(() => {
        const timer = setInterval(() => {
            getQuote();
        }, 50000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        console.log(quote)
    }, [quote]);

    return (
        <main className="w-[80%] mx-auto h-[95%] flex flex-col bg-blue-500 rounded-4xl p-5">
            <h1 className="text-4xl text-yellow-300 text-center font-bold pb-2">Pokemon: Chat Edition</h1>
            <p className="text-center max-w-[90%] px-2 m-auto text-yellow-300 font-bold rounded-xl mb-2">{quote}</p>
            <p className="text-center bg-yellow-300 w-[15%] m-auto text-blue-500 font-bold rounded-xl mb-2">Score: {score}</p>
            <section className="grow bg-gray-900 rounded-2xl p-3 flex flex-col gap-3 overflow-y-auto">
                {chat.map((chat) =>
                    <div className="flex flex-col gap-3">
                        {chat.role === "user" ?
                            <UserMessage>{chat.message}</UserMessage> :
                            <AiMessage tokens={chat.tokens}>{chat.message}</AiMessage>}
                    </div>
                )}
                {isLoading ? <div className="chat chat-start">
                    <div className="chat-bubble bg-red-400">
                        <p>...</p></div>
                </div> : null}
                <div ref={bottomRef}/>
            </section>

            <form className="flex mt-3" onSubmit={formHandler}>
                <input name="prompt" type="text" placeholder="Typ je bericht..."
                       className="grow bg-yellow-100 rounded-lg px-3 py-1 mr-2 text-black"
                       value={formData.prompt} onChange={inputHandler}></input>
                <button disabled={isLoading} className="bg-yellow-200 p-2 rounded-lg text-black">Verstuur</button>
            </form>
        </main>
    )
}

export default App
