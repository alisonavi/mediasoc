import { useEffect, useState } from 'react'
import './App.css'
import Post from './Post'
import { db, auth } from './Firebase';
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import ImageUpload from './ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      }
      else {
        setUser(null);
      };
    });
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  }
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })));
    });
  }, []);
  return (
    <div className='app'>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div>
          <Box sx={style}>
            <form className='app__signup'>
              <center>
                <img className='app_headerImagee'
                  src='https://cdn.discordapp.com/attachments/741802409709535262/1165727472533377145/red-velvet.png?ex=6547e74f&is=6535724f&hm=48d48a04fb97a30e143f89ec29df9151d117f1d7a729950bd3ab92d2fbb66735&'
                  alt='' />
              </center>
              <Input
                type='text'
                placeholder='username'
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                placeholder='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type='submit' onClick={signUp}> Sign Up </Button>
            </form>
          </Box>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div>
          <Box sx={style}>
            <form className='app__signup'>
              <center>
                <img className='app_headerImagee'
                  src='https://cdn.discordapp.com/attachments/741802409709535262/1165727472533377145/red-velvet.png?ex=6547e74f&is=6535724f&hm=48d48a04fb97a30e143f89ec29df9151d117f1d7a729950bd3ab92d2fbb66735&'
                  alt='' />
              </center>
              <Input
                placeholder='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type='submit' onClick={signIn}> Sign In </Button>
            </form>
          </Box>
        </div>
      </Modal>
      <div className='app__header'>
        <img className='app__headerImage' src='https://cdn.discordapp.com/attachments/741802409709535262/1165727472533377145/red-velvet.png?ex=6547e74f&is=6535724f&hm=48d48a04fb97a30e143f89ec29df9151d117f1d7a729950bd3ab92d2fbb66735&' alt='' />
        {user ? (
          <Button onClick={() => auth.signOut()}> Log out </Button>) :
          (
            <div className='app_logInContainer'>
              <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
              <Button onClick={handleOpen}> Sign up</Button>
            </div>
          )}
      </div>
      <div className='app__posts'>
        {
          posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3> You need to login </h3>
      )}
    </div>

  )
}

export default App
