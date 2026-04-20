import agent from '../assets/logo.png'

function AiMessage({children, tokens}) {

    return (
        <div className="chat chat-start">
            <div className="chat-image avatar pr-1">
                <div className="w-10 rounded-full">
                    <img alt="foto van een ai silouthet" src={agent}/>
                </div>
            </div>
            <div className="chat-bubble bg-red-400">
                <div dangerouslySetInnerHTML={{__html: children}}></div>
                {tokens ? <p className="text-right text-xs">Tokens: {tokens}</p> : null}
            </div>
        </div>
    )
}

export default AiMessage