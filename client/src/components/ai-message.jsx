function AiMessage({children, tokens}) {

    return (
        <div className="chat chat-start">
            <div className="chat-bubble bg-red-400">
                <div dangerouslySetInnerHTML={{__html: children}}></div>
                {tokens ? <p className="text-right text-xs">Tokens: {tokens}</p> : null}
            </div>
        </div>
    )
}

export default AiMessage