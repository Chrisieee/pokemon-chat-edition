import trainer from "../assets/trainer.jpg";

function UserMessage({children}) {
    return (
        <div className="chat chat-end">
            <div className="chat-image avatar pr-1">
                <div className="w-10 rounded-full">
                    <img className="scale-120" alt="foto van een ai silouthet" src={trainer}/>
                </div>
            </div>
            <div className="chat-bubble bg-white text-black"><p
                className="text-right">{children}</p></div>
        </div>

    )
}

export default UserMessage