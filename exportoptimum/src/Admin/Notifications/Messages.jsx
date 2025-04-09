import React, { useEffect, useState } from 'react';
import contactData from '../../Data/Contact.json';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [openMessageIndex, setOpenMessageIndex] = useState(null);

  useEffect(() => {
    if (contactData && Array.isArray(contactData.messages)) {
      // Reverse the order of messages so that the first message is shown last
      const reversedMessages = [...contactData.messages].reverse();

      setMessages(reversedMessages);
    } else {
      console.error("Invalid contact data format.");
      setMessages([{ message: "No messages found" }]);
    }
  }, []);

  const toggleMessage = (index) => {
    setOpenMessageIndex(openMessageIndex === index ? null : index);
  };

  if (!messages || messages.length === 0 || (messages.length === 1 && messages[0].message === "No messages found")) {
    return (
      <div className="flex">
        <div className="flex-grow p-4 bg-gray-100 min-h-screen ml-64">
          <div className="text-center italic text-gray-500 py-4">No messages yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">

      <div className="flex-grow p-6 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-500 py-4 px-6 text-white">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <ul className="divide-y divide-gray-200 p-4">
            {messages.map((message, index) => (
              <li key={index} className="py-4 relative">
                <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleMessage(index)}>
                  <div className="flex items-center">
                    <div className="prose prose-sm text-gray-700">
                      <p className="font-medium">{message.fullName || "Name not available"}</p>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${openMessageIndex === index ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {openMessageIndex === index && (
                  <div className="mt-2 prose prose-sm text-gray-700">
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Email: {message.email || "Email not available"}</p>
                      <p>Subject: {message.subject || "Subject not available"}</p>
                    </div>
                    <p><span className='text-gray-900'>Message :</span> <br /> <span className='pl-5'>{message.message || "Message not available"}</span></p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Messages;
