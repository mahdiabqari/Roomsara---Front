'use client'
import { revalidateTag } from 'next/cache';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';



export default function Messenger({params}) {

  const [userId, setUserId] = useState(params.id);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUser_name, setSelectedUser_name] = useState(null);
  const [ selectShow , setSelectShow ] = useState(false)
  const [suggest, setSuggest] = useState([]);
  const [showres , setShowres] = useState(false)


    //Messages
    useEffect(() => {
      const fetchMessage = async () => {
        
        try {
          const response = await fetch(`https://my-db-p.liara.run/messages/${userId}/${selectedUser}`, {
            'cache': 'no-cache',
            next: {
              tags: ['messages']
            }
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      

      const intervalId = setInterval(fetchMessage, 500);

      return () => clearInterval(intervalId);


    }, [selectedUser]);

    //Friends Account
    useEffect(() => {
      const fetchContacts = async () => {
        try {
          const response = await fetch(`https://my-db-p.liara.run/users/friends/${userId}`);
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      };

      fetchContacts();
    }, [userId]);
    


    //Search Users
    const handleSearchUsers = async () => {
      try {
        const response = await fetch(`https://my-db-p.liara.run/users/search?name=${searchTerm}`);
        const data = await response.json();
        setSuggest(data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };
    const handleSelectUser = (user) => {
      setMessages([])
      setSelectedUser(user.id);
      setSelectedUser_name(user.name);
      setSelectShow(true)
      setShowres(true)
    };
    const enterSearch = (e) => {
      if(e.key == 'Enter'){
        handleSearchUsers(e)
      }
    }


    //Send Messages
    const handleSendMessage = async (e) => {
      e.preventDefault();

      try {
        const response = await fetch(`https://my-db-p.liara.run/messages/send`, {
          method: 'POST',
          body: JSON.stringify({
            sender_id: userId,
            receiver_id: selectedUser,
            message: newMessage
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setNewMessage('')
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        alert('Message sent:', data);
  
        // Revalidate messages tag
        revalidateTag('messages');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage(e);
      }
    };
    
  
  

  return (
    <main className="chat-page h-screen w-full bg-message">
      <div className="container hidden gap-5 py-2 h-screen w-[95%] mx-auto">
        
        <div className="left md:hidden overflow-y-scroll rounded-xl h-full md:w-[90%] md:mx-auto w-[30%] py-7 px-5">
          
          <div className="search px-5 py-4 container gap-2 mx-auto">
            <input
              className="search-input w-[100%] px-3 text-xl mx-auto container h-[2.5rem] rounded-xl opacity-90"
              type="text"
              value={searchTerm}
              onKeyPress={enterSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Users ..."
            />
            <button onClick={handleSearchUsers}>
              <img className='img_search rounded-full w-12 opacity-60' src="https://th.bing.com/th/id/R.e29dcc1648f5211a86399f382dc91df1?rik=HbXfaAhcTXSfxQ&pid=ImgRaw&r=0" alt="png" />
            </button>
          </div>

          {suggest[0] && <div className="suggest gap-4 fixed container flex-col left-[15%] w-[70%] mx-auto py-2 px-2 bg-green-900 rounded-xl ">
              <div className='container gap-2 w-[90%] mx-auto'>
              <img onClick={() => setSuggest([])} className='w-8 rotate-180 ml-auto rounded-xl opacity-60 hover:opacity-95 transition-all cursor-pointer' src="https://th.bing.com/th/id/OIP.AtMAbDgKLti8K279Cutr6AAAAA?w=474&h=474&rs=1&pid=ImgDetMain" alt="png" />
              <div className='bg-gray-500 rounded-xl w-[85%] h-[2rem]'></div>
            </div>
            <div className='h-[34rem] overflow-y-scroll w-full'>
              {suggest.map((user, index) => (
                <div className="chat_s" key={index} onClick={() => handleSelectUser(user)}>
                  <div className="profile_s"></div>
                  <div className="info w-[70%] text-gray-200">
                    <h1 className="text-[20px]">{user.name}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {users.map((user, index) => (
            <div className="chat" key={index} onClick={() => handleSelectUser(user)}>
              <div className="profile"></div>
              <div className="info w-[70%] text-gray-200">
                <h1 className="text-[24px]">{user.name}</h1>
              </div>
            </div>
          ))}
          

            <div className='text-white text-xl fixed bottom-4 left-[6rem]'>
              <Link href="https://mahdiabqari.liara.run">
                <h1 className='me-me text-center bg-black px-8 py-2 rounded-xl  '>Created By M.N.S</h1>
              </Link>
              <p className='text-center text-sm mt-1'>Demo version</p>
            </div>


        </div>

        <div className="right md:hidden rounded-xl h-full w-[70%]">
            {selectShow && <div className="top rounded-b-xl text-gray-200 text-center py-2 text-3xl z-10 w-[80%] left-[9%] absolute top-4 m-0 h-[3.5rem] bg-blue-950">
              {selectedUser_name}
            </div>}
            {selectShow && <div className="messages overflow-y-scroll gap-3 flex flex-col px-5 pb-12 pt-20 w-[95%] h-[41.5rem] mx-auto relative top-4 rounded-xl">
            {messages.map((msg, index) => (
              <div className={`message relative ${msg.sender_id === userId ? 'send-message' : 'receive-message'}`} key={index}>
                
                <h1 dir='rtl' className={msg.sender_id === userId ? 'send-m flex' : 'receive-m'} style={{ display: 'inline-block', position: 'relative' }}>
                  {msg.message}
                </h1>
              </div>
            ))}

            
            {!messages[0] &&
              <>
                <h1 className='text-white text-[20px] text-center mt-40'>There is no message yet</h1>
                <div class="loader mx-auto mt-20"></div>
              </>
            }

            </div>}
            {selectShow &&  <div className="sendM rounded-t-[40px] gap-2 container px-4 py-5 absolute bottom-0 w-full">
              <input
                type="text"
                className="w-[90%] h-[3rem] rounded-xl text-xl px-3 border-0 bg-gray-500 text-black"
                value={newMessage}
                onKeyPress={handleKeyPress}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>
                <img className='w-12 rounded-full opacity-60 hover:opacity-95 transition-all' src="https://th.bing.com/th/id/OIP.AtMAbDgKLti8K279Cutr6AAAAA?w=474&h=474&rs=1&pid=ImgDetMain" alt="png" />
              </button>
            </div>}

            {!selectShow && <h1 className='text-gray-400 text-xl mx-auto text-center mt-[20rem]'>No user Selected</h1>}
        </div>



        {!showres && <div className="left hidden md:block overflow-y-scroll rounded-xl h-full md:w-[100%] md:mx-auto w-[30%] py-7 px-5">
          
          <div className="search px-5 mb-4 py-3 container gap-2 mx-auto">
            <input
              className="search-input w-[100%] px-3 text-xl mx-auto container h-[2.5rem] rounded-xl opacity-80"
              type="text"
              value={searchTerm}
              onKeyPress={enterSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Users ..."
            />
            <button onClick={handleSearchUsers}>
              <img className='img_search rounded-full w-12 opacity-60' src="https://th.bing.com/th/id/R.e29dcc1648f5211a86399f382dc91df1?rik=HbXfaAhcTXSfxQ&pid=ImgRaw&r=0" alt="png" />
            </button>
          </div>

          {suggest[0] && <div className="suggest gap-4 mt-[-16px] fixed container flex-col left-[15%] w-[70%] mx-auto py-2 px-2 rounded-b-xl ">
              <div className='container gap-2 w-[90%] mx-auto'>
              <img onClick={() => setSuggest([])} className='w-8 rotate-180 ml-auto rounded-xl opacity-60 hover:opacity-95 transition-all cursor-pointer' src="https://th.bing.com/th/id/OIP.AtMAbDgKLti8K279Cutr6AAAAA?w=474&h=474&rs=1&pid=ImgDetMain" alt="png" />
              <div className='bg-gray-500 rounded-xl w-[85%] h-[2rem]'></div>
            </div>
            <div className='h-[34rem] overflow-y-scroll w-full'>
              {suggest.map((user, index) => (
                <div className="chat_s" key={index} onClick={() => handleSelectUser(user)}>
                  <div className="profile_s"></div>
                  <div className="info w-[70%] text-gray-200">
                    <h1 className="text-[20px]">{user.name}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {users.map((user, index) => (
            <div className="chat md:my-2" key={index} onClick={() => handleSelectUser(user)}>
              <div className="profile"></div>
              <div className="info w-[70%] text-gray-200">
                <h1 className="text-[24px]">{user.name}</h1>
              </div>
            </div>
          ))}

          <div className='text-white text-xl fixed bottom-4 left-[6rem] right-[6rem]'>
            <Link href="https://mahdiabqari.liara.run">
              <h1 className='me-me text-center bg-black px-4 py-2 rounded-xl md:text-[16px]'>Created By M.N.S</h1>
            </Link>
            <p className='text-center text-sm mt-1'>Demo version</p>
          </div>

         </div>
        }

        {showres && <div className="right hidden md:block rounded-xl h-full w-[70%] md:w-full">
            {selectShow && <div className="top rounded-xl container mb-[-10px] mx-auto w-[95%] text-gray-200 text-center py-1 text-3xl md:text-2xl md:pt-1 z-10 w-[90%] h-[3.5rem] bg-blue-950">
              <img onClick={() => setShowres(false)} className='w-8 absolute left-2 rotate-180 mr-auto ml-2 rounded-full opacity-60 hover:opacity-95 transition-all' src="https://th.bing.com/th/id/OIP.AtMAbDgKLti8K279Cutr6AAAAA?w=474&h=474&rs=1&pid=ImgDetMain" alt="png" />
              <h1 className='mx-auto w-[100%]'>{selectedUser_name}</h1>
            </div>}
            {selectShow && <div className="messages overflow-y-scroll gap-3 flex flex-col px-2 pb-12 pt-20 w-[95%] h-[41.5rem] mx-auto relative top-4 rounded-xl">
              {messages.map((msg, index) => (
                <div className={`message ${msg.sender_id === userId ? 'send-message' : 'receive-message'}`} key={index}>
                  <h1 dir='rtl' className={msg.sender_id === userId ? 'send-m md:text-[18px]' : 'receive-m md:text-[18px]'}>{msg.message}</h1>
                </div>
              ))}
            {!messages[0] && 
              <>
                <h1 className='text-white text-[18px] text-center mt-40'>There is no message yet</h1>
                <div class="loader mx-auto mt-10"></div>
              </> 
            }
            </div>}

            {selectShow &&  <div className="sendM rounded-t-[40px] gap-2 container px-4 py-5 fixed bottom-0 w-full">
              <input
                type="text"
                className="w-[90%] h-[3rem] md:h-[2.5rem] rounded-xl text-xl px-3 border-0 bg-gray-500 text-black"
                value={newMessage}
                onKeyPress={handleKeyPress}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>
                <img className='w-10 rounded-full opacity-60 hover:opacity-95 transition-all' src="https://th.bing.com/th/id/OIP.AtMAbDgKLti8K279Cutr6AAAAA?w=474&h=474&rs=1&pid=ImgDetMain" alt="png" />
              </button>
            </div>}

            {!selectShow && <h1 className='text-gray-400 text-xl mx-auto text-center mt-[20rem]'>No user Selected</h1>}
        
        </div>}

      </div>
    </main>
  );
}