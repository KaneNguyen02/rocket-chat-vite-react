import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
// import api, { API_HOST_URL } from "../../api/axiosInstance";
import InputMessage from "../../components/InputMessage/InputMessage";

import { sdk } from "../../services/SDK";
import { IMessage } from "../../utils/constant";
import StorageService from "../../utils/storage";

const HomePage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [listMessage, setListMessage] = useState<IMessage[]>([]);
  const userId = StorageService.get("id");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [listMessage]);

  useEffect(() => {
    const connect = async () => {
      try {
        // console.log("sdk.current()", sdk.current);

        if (!sdk.current) {
          sdk.connect();

          // subscribe room - message event
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    connect();
  }, []);
  

  useEffect(() => {

    const getHistory = async () => {
      // chua lam ham resume nen vao day moi co sdk.current co info login
      const generalRoomId = "GENERAL";
      const history = await sdk.current.methodCall(
        "loadHistory",
        generalRoomId,
        null,
        30,
        new Date().toISOString()
      );

      const messageHistory = history.messages;
      messageHistory.sort(
        (a: IMessage, b: IMessage) => a.ts.$date - b.ts.$date
      );
      setListMessage(messageHistory);
      console.log("🚀 ~ getHistory ~ messageHistory:", messageHistory);
    };
    getHistory();
  }, []);

  useEffect(() => {
    const subscribeRoom = async () => {
      const roomId = "GENERAL";
      const messages = await sdk.current.subscribeRoom(roomId);
      console.log("🚀 ~ subscribeToGeneralRoom ~ messages:", messages);
    };
    subscribeRoom();
  }, []);




  const sendMessage = async (inputMessage: string) => {
    const res = await sdk.current.methodCall("sendMessage", {
      rid: "GENERAL",
      msg: inputMessage,
    });
    setListMessage((prevMessage) => [...prevMessage, res]);
    setInputMessage("");
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target?.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(inputMessage);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage);
  };

  return (
    <div className="w-full h-full rounded-2xl bg-gray-100">
      <div className="flex flex-col w-full h-full flex-shrink-0 ">
        <div className="flex flex-col overflow-x-auto mb-4 m-4 h-[76vh] gap-2">
          {listMessage &&
            listMessage.map((item) => {
              return (
                <div
                  key={item._id}
                  className={
                    item.u._id === userId
                      ? "self-end text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl max-w-xs w-fit"
                      : "self-start text-sm bg-white py-2 px-4 shadow rounded-xl max-w-xs w-fit"
                  }
                >
                  <p className="font-thin ">{item.u.name}</p>
                  <div className="">{item.msg}</div>
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
