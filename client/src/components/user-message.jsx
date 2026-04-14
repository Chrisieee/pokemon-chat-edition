function UserMessage({children}) {
    return (
        <div className="chat chat-end">
            <div className="chat-bubble bg-white text-black"><p
                className="text-right">{children}</p></div>
        </div>

    )
}

export default UserMessage