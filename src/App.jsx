import { useState } from 'react'
// import './App.css'

// https://blogapi.akademiprojeler.com.tr/auth/register - kayıt ol
// https://blogapi.akademiprojeler.com.tr/auth/login - giriş yap

function App() {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);

  async function handleClick() {
    if(!userToken) {
      return;
    }

    const reqHeaders = {
      Authorization: `Bearer ${userToken.accessToken}`
    };

    const requestDetails = {
      method: 'GET', // zaten ön tanımlı hali bu
      headers: reqHeaders
    }

    const req = await fetch('https://blogapi.akademiprojeler.com.tr/auth/manage/info', requestDetails).then(r => r.json());
    console.log(req);
  }

  return (
    <>
      <Auth setUserToken={setUserToken} />
      <hr />
      <button onClick={handleClick}>Kullanıcı Getir</button>
    </>
  )
}

function Auth({ setUserToken }) {
  const [isRegister, setRegister] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    // bence gereksiz ama olurda ileride biri mülakatta sorarsa diye
    // ben servisime isRegister göndermek istemiyorum. çünkü servis dokümanında yok
    delete formObj.isRegister;

    // DRY - dont repeat yourself
    const fetchUrl = `https://blogapi.akademiprojeler.com.tr/auth/${isRegister ? 'register' : 'login'}`;

    const req = await fetch(fetchUrl, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json'
          },
          body: JSON.stringify(formObj)
        });

    if(!req.ok) {
      alert('hata oldu. devam edemiyorum...');
      // burada daha detaylı hata yönetimi yapmalıyız
      return;
    }

    if(isRegister) {
      alert('kayıt başarılı!');
      setRegister(false);
    } else {
      setUserToken(await req.json());
      alert('giriş başarılı!')
    }
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <p>
        <label><input type="radio" onChange={() => setRegister(false)} name="isRegister" checked={!isRegister} /> giriş</label> | 
        <label><input type="radio" onChange={() => setRegister(true)} name="isRegister" checked={isRegister} /> kayıt</label>
      </p>
      <p><input required type="email" name="email" placeholder="e-posta adresi" /></p>
      <p><input required type="password" name="password" placeholder="şifre" /></p>
      <p><button>{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</button></p>
    </form>
  )
}

export default App
