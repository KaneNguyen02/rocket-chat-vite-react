import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import api from "../../api/axiosInstance";
import InputMessage from "../../components/InputMessage/InputMessage";
import { socket } from "../../../socket";

interface IMessage {
  _id?: string;
  username: string;
  message: string;
  createdAt?: number;
}

const HomePage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [newMessage, setNewMessage] = useState<IMessage[]>([
    {
      username: "",
      message: "",
      createdAt: 0,
    },
  ]);
  const currentUser = localStorage.getItem("username") || "";
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [newMessage]);

  useEffect(() => {
    const fetchData = async () => {
      const listMessage = await api.get("/messages");
      console.log("🚀 ~ useEffect ~ listMessage:", listMessage);
      setNewMessage(listMessage.data.result);
    };
    fetchData();
  }, []);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target?.value);
  };

  const emitMessage = () => {
    socket.emit("message", {
      username: currentUser,
      message: inputMessage,
    });
    console.log("send");

    setInputMessage("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      emitMessage();
    }
  };

  const handleSendMessage = () => {
    emitMessage();
  };

  useEffect(() => {
    socket.off("message");
    socket.on("message", (res: IMessage) => {
      console.log(res);
      setNewMessage((prev) => [...prev, res]);
    });
    // return () => {
    //   socket.off("message");
    // };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl bg-gray-100">
      <div className="flex flex-col w-full h-full flex-shrink-0 ">
        <div className="flex flex-col overflow-x-auto mb-4 m-4 h-[76vh] gap-2">
          {newMessage &&
            newMessage.map((item) => {
              return (
                <div
                  key={item.createdAt}
                  className={
                    item.username === currentUser
                      ? "self-end text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl max-w-xs w-fit"
                      : "self-start text-sm bg-white py-2 px-4 shadow rounded-xl max-w-xs w-fit"
                  }
                >
                  <p className="font-thin ">{item.username}</p>
                  <div className="">{item.message}</div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <InputMessage
        inputMessage={inputMessage}
        handleChangeInput={handleChangeInput}
        onKeyDown={handleKeyPress}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default HomePage;
