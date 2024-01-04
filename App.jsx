import React from 'react';
import {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {updateProfile, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, setPersistence, browserLocalPersistence} from "firebase/auth";
import { doc, getDoc, addDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { onValue, ref, set, serverTimestamp } from 'firebase/database';
import { uploadBytesResumable, getDownloadURL, ref as ref_storage } from 'firebase/storage';
import {auth, googleProvider, rdb, db, storage} from "./Firebase";
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  const [mainData, setMainData] = useState(null);
  const [storyData, setStoryData] = useState([]);
  const [addingTopic, setAddingTopic] = useState(false);
  const [addingStory, setAddingStory] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newStoryName, setNewStoryName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Storys
        const storysCollectionRef = collection(db, 'Storys');
        const querySnapshot = await getDocs(storysCollectionRef);
  
        const storysArray = [];
        querySnapshot.forEach((doc) => {
          storysArray.push(doc.id);
        });
        setStoryData(storysArray);

        // Fetch data from Main
        const mainRef = ref(rdb, 'Main');
        onValue(mainRef, (snapshot) => {
          if (snapshot.exists()) {
            setMainData(snapshot.val());
          } else {
            setMainData(null);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleAddTopicClick = () => {
    setAddingTopic(true);
  };

  const handleAddStoryClick = () => {
    setAddingStory(true);
  };

  const handleTopicSubmit = (e) => {
    e.preventDefault();
    set(ref(rdb, `Main/${newTopicName}`), true);

    setAddingTopic(false);
    setNewTopicName('');
  };

  const handleStorySubmit = (e) => {
    e.preventDefault();
    set(ref(rdb, `Main/${newTopicName}`), true);

    setAddingStory(false);
    setNewStoryName('');
  };

  return (
    <div>
      <div style={{ position: 'sticky', top: 0, padding: '10px', backgroundColor: '#fff', display: 'flex', zIndex: 1000 }}>
        <img
          src={auth.currentUser.photoURL}
          className="img"
          style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '5px' }}
        />
        <Link to="/profile" style={{ marginRight: 'auto', fontSize: '22px' }}>{auth.currentUser.displayName}</Link>
      </div>
      {mainData &&
        Object.keys(mainData).map((childKey) => (
          <div className='chat-topic' key={childKey}>
            <Link to="/chat" state={{ chat: childKey }}>
              {childKey}
            </Link>
          </div>
        ))}
    {addingTopic ? (
      <div style={{ marginBottom: '5px' }}>
        <form>
          <input
            type="text"
            placeholder="Enter Topic"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
          />
          <a onClick={handleTopicSubmit}>  +</a>
        </form>
      </div>
      ) : (
        <a onClick={handleAddTopicClick}>+ Add Topic</a>
      )}
      <div style={{ marginTop: '10px' }}>
        {storyData &&
          storyData.map((storyId) => (
          <div className='my-message' key={storyId}>
            <Link to="/story" state={{ story: storyId }}>
              {storyId}
            </Link>
          </div>
        ))}
      </div>
      {addingStory ? (
      <div style={{ marginBottom: '5px' }}>
        <form>
          <input
            type="text"
            placeholder="Enter Story Name"
            value={newTopicName}
            onChange={(e) => setNewStoryName(e.target.value)}
          />
          <a onClick={handleStorySubmit}>  +</a>
        </form>
      </div>
      ) : (
        <a onClick={handleAddStoryClick}>+ Add Story</a>
      )}
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentChat = location.state && location.state.chat;

  function formatTimeAgo(date) {
    if (!date) {
      return 'Unknown time';
    }

    const currentDate = new Date();
    const timeDifference = currentDate - date;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days >= 7) {
      // If it's over a week old, display day, month, and year
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } else if (days > 0) {
      // If it's within a week, display days ago
      return `${days} day${days != 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours != 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes != 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  const uploadFile = async (file) => {
    const storageRef = ref_storage(storage, 'Main/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const mediaURL = file ? await uploadFile(file) : ''; 
  
      await set(ref(rdb, "Main/" + currentChat + "/" + Math.random().toString(36).substr(2, 8)), {
        MediaURL: mediaURL,
        Message: newMessage,
        Time: serverTimestamp(),
        UserID: auth.currentUser.uid,
        UserName: auth.currentUser.displayName,
        PhotoURL: auth.currentUser.photoURL, 
      });
  
      setNewMessage('');
      setFile(null);
    }
  };

  const handleGoHome = async () => {
    navigate('/main')
  };

  useEffect(() => {
    const chatRef = ref(rdb, "Main/" + currentChat + "/");

    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        const messageList = Object.values(data);
        setMessages(messageList);
      }
    });

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        const messageList = Object.values(data);
        const sortedMessages = messageList.sort((a, b) => b.Time - a.Time);
        setMessages(sortedMessages);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth.currentUser]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, padding: '10px', backgroundColor: '#fff', display: 'flex', zIndex: 1000 }}>
      <h1 style={{ paddingTop: '4px', marginRight: 'auto', fontSize: '30px', fontWeight: 'bold', fontStyle: 'italic' }}>
        {currentChat}
      </h1>
      <button style={{ minWidth: '80px' }} className="btn btn-secondary" onClick={handleGoHome}>Back</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {/* Display messages */}
        <ul className="message-list">
          {messages.map((message, index) => (
            <li key={index} className={message.UserID === auth.currentUser.uid ? 'my-message' : 'other-message'}>
              {/* Message content */}
              <div className="userInfo">
                <img
                  src={message.PhotoURL}
                  className="img"
                  style={{ width: '15px', height: '15px', borderRadius: '50%', marginRight: '5px' }}
                />
                <span className="userName">{message.UserName}</span>
              </div>
              <p className="message">{message.Message}</p>
              {message.MediaURL && (
                <img
                  src={message.MediaURL}
                  alt="Media"
                  style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                />
              )}
              <p className="time">{formatTimeAgo(message.Time)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Input and send button */}
      <div style={{ position: 'sticky', bottom: 0, left: 0, padding: '10px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', zIndex: 1000 }}>
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ marginRight: '10px' }} />
        <label htmlFor="file-input" style={{ cursor: 'pointer', marginRight: '10px' }}>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn2.iconfinder.com%2Fdata%2Ficons%2Fattachment%2F154%2Fattach-attachment-clip-function-512.png&f=1&nofb=1&ipt=4492819eadea63b4cb49fd9a436685b7031535506e9f1a68ed01b19636ce5161&ipo=images"
            alt="Attach File"
            style={{ width: '25px', height: '25px', borderRadius: '50%' }}
          />
          <input
            type="file"
            id="file-input"
            accept="image/*,video/*,audio/*"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

function Story() {
  const location = useLocation();
  const currentStory = location.state && location.state.story;
  const navigate = useNavigate();
  const [currentStoryData, setCurrentStoryData] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);

  const handleGoHome = () => {
    navigate('/main');
  };

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const storyDocRef = doc(db, 'Storys', currentStory);
        const storyDocSnapshot = await getDoc(storyDocRef);

        if (storyDocSnapshot.exists()) {
          const storyData = storyDocSnapshot.data();
          setCurrentStoryData(storyData.pages);
        }
      } catch (error) {
        console.error('Error fetching story data:', error);
      }
    };

    if (currentStory) {
      fetchStoryData();
    }
  }, [currentStory]);

  return (
    <div style={{ padding: '30px' }}>
    {currentStoryData && (
      <div class="card text-center">
        <div class="card-header">
          <div style={{ position: 'sticky', top: 0, padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0)', display: 'flex', zIndex: 1000 }}>
            <h1 style={{ paddingTop: '4px', marginRight: 'auto', fontSize: '30px', fontWeight: 'bold', fontStyle: 'italic' }}>
              {currentStory}
            </h1>
            <button style={{ minWidth: '80px' }} className="btn btn-secondary" onClick={handleGoHome}>Back</button>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title">{currentStoryData[pageIndex].title}</h5>
          <p class="card-text">{currentStoryData[pageIndex].writing}</p>
          <a href="#" class="btn btn-primary">Next Page</a>
        </div>
        <div class="card-footer text-muted"></div>
      </div>
    )}
  </div>
  )
}

function Profile() {
  const [newUserName, setNewUsername] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const uploadFile = async (file) => {
    const storageRef = ref_storage(storage, 'Main/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleUpdateProfile = async () => {
    if (newUserName.trim() !== '') {
      const mediaURL = file ? await uploadFile(file) : ''; 
  
      await updateProfile(auth.currentUser, {
        displayName: newUserName === "" ? auth.currentUser.displayName : newUserName,
        photoURL: mediaURL === "" ? auth.currentUser.photoURL : mediaURL,        
      });
  
      setNewUsername('');
      setFile(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="centered-form-container">
      <div className="centered-form-inner">
        <div>
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <img
              src={auth.currentUser.photoURL}
              alt="Current Profile"
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '30px' }}
            />
            <input
              type="file"
              id="file-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>
        <div>
          <input type="text" placeholder="New Username" style={{ width: '180px', marginBottom: '30px', textAlign: 'center' }} value={newUserName} onChange={(e) => setNewUsername(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleUpdateProfile}>
          Submit
        </button>
        <button className="btn btn-light" onClick={handleLogout} style={{ marginLeft: '10px' }}>
          Logout
        </button>
      </div>
      <Link to={{ pathname: '/main', state: { chat: 'Test' } }} style={{ marginTop: '10px', alignSelf: 'flex-start' }}>
        {'< Back'}
      </Link>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isIntroPage, setIsIntroPage] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/main')
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async () => {
    try{
      await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser, {
        displayName: userName,
        photoURL: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngkey.com%2Fpng%2Ffull%2F115-1150152_default-profile-picture-avatar-png-green.png&f=1&nofb=1&ipt=88b85dc2f8a0ebacc9770b247d375e3432e8b0e5436f77376ac858f296df6157&ipo=images",
      });
      setPersistence(auth, browserLocalPersistence)
    }    
    catch(err) {
      console.error(err)
    }
  }

  const signIn = async () => {
    try{
      await signInWithEmailAndPassword(auth, email, password)
      setPersistence(auth, browserLocalPersistence)
    } 
    catch(err) {
      console.error(err)
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      setPersistence(auth, browserLocalPersistence)
    }   
    catch(err) {
      console.error(err)
    }
  }

  const handleLogInLinkClick = () => {
    setIsIntroPage(false);
  };

  return (
    <div>
      {isIntroPage ? (
        <>
          <h1 className='fadeIn'>Welcome</h1>
          <p className='slideIn'>To annashumate.art</p>
          <a className='fadeIn' style={{ color: 'blue' }} onClick={handleLogInLinkClick}>
            Log In
          </a>
        </>
      ) : (
        <>
          {isSignUpMode && (
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <input
                className="form-control"
                type="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <input
              className="form-control"
              type="email"
              placeholder="Email ..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <input
              className="form-control"
              type="password"
              placeholder="Password ..."
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={isSignUpMode ? signUp : signIn}
            style={{ width: '100px' }}
          >
            {isSignUpMode ? "Sign Up" : "Sign In"}
          </button>
          <p className="account-question">
            {isSignUpMode ? "Have an account? " : "No account? "}
            <a href="#" onClick={() => setIsSignUpMode(!isSignUpMode)}>
              {isSignUpMode ? "Sign In" : "Sign Up"}
            </a>
          </p>
          <button
            className="google-sign-in-button"
            onClick={signInWithGoogle}
          >
            Sign In With Google
          </button>
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/story" element={<Story/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;