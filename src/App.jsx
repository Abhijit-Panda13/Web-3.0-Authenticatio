import React from "react";
import { useState, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import Button from 'react-bootstrap/Button';
import "./app.css";
import { getValue } from "@testing-library/user-event/dist/utils";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import validator from 'validator';

const VERIFIER = [
  {
    loginProvider: "google",
    id : "0"
  },
  {
    loginProvider: "facebook",
    id : "1"
  }
]


function App() {
  const [isLoading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const classes = useStyles();
  const [formIsValid, setFormIsValid] = useState(false);
  const [openlogin, setOpenLogin] = useState();
  const [privKey, setPrivKey] = useState();

  var loginObject ={
    loginProvider: "google",
    clientId: "BDEZMlXEtCPU0_sfOO22To8ZnFS8ppSJs_yBNBxiMWhdAmPJSUk4jlCI3ykKBHO2cl1iDEu_M6UDVFAqALmZPto",
    redirectUrl: "http://localhost:3000/redirect"
  }

  useEffect(() => {
    setFormIsValid(validator.isEmail(email))
  }, [email]);


  const onMount = async () => {
    setLoading(true);

    try {
      const openlogin = new OpenLogin({
        clientId: loginObject.clientId,
        network: "mainnet", // valid values (testnet or mainnet)
      });
      setOpenLogin(openlogin);

      await openlogin.init();
      setPrivKey(openlogin.privKey);
    } finally {
      setLoading(false);
    }
  };

  const onLoginBrand = async (event) => {
    
    VERIFIER.filter(login => login.id === event.target.id).map(filtered => (
      loginObject.loginProvider = filtered.loginProvider
    ));
    console.log(loginObject);
    if (isLoading || privKey || !openlogin) return;

    setLoading(true);
    try {
      await openlogin.login(loginObject);
      setPrivKey(openlogin.privKey);
    } finally {
      setLoading(false);
    }
  };

  const onLoginEmail = async (event) => {

    
    if (isLoading || privKey || !openlogin) return;

    setLoading(true);
    try {
      await openlogin.login({
        extraLoginOptions: {
          login_hint: email,
        },
        loginProvider: "email_passwordless",
        redirectUrl: "http://localhost:7005/",
    });
    
    setPrivKey(openlogin.privKey);
    
    } finally {
      setLoading(false);
    }
  };
  const onLogout = async () =>{
    if (isLoading || !openlogin) return;

    setLoading(true);
      try {
        await openlogin.logout();
        setPrivKey(openlogin.privKey);
      } finally {
        setLoading(false);
      }
    };
    // {
    //   loginProvider: VERIFIER.loginProvider,
    //   redirectUrl: "http://localhost:3000/redirect",
    // }
  

  useEffect(() => {
    onMount();
    
  }, []);

  if(isLoading) return <div className="central">Loading...</div>;
  return privKey ? 
  (
    <div className="central">
      <p>Logged in: {privKey}</p>
      <Button  variant="outline-dark" onClick={onLogout}>Logout</Button>
    </div>
  ) : (<div className="central">
      <Container fluid >
        <Row>
          <Col sm={4}></Col>
          <Col sm = {4}>
          <form noValidate>
          <MDBInput 
              label='Email Address'
              id='typeEmail'
              type='email'
              size='lg'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
          />
          <Button className="loginbutton"
              disabled={!formIsValid}
              variant="dark"
              onClick={onLoginEmail}
          >
              Login
          </Button>
          </form>
          <Box mt={8}>
          <Copyright />
        </Box>
        </Col>
      </Row>
      <Row>
        <Col sm={5}></Col>
        <Col sm={2}><Button variant="outline-dark" id="0" onClick={onLoginBrand}>Google <FaGoogle /></Button></Col>
        <Col sm={2}><Button variant="outline-dark" id="1" onClick={onLoginBrand}>Facebook <FaFacebook /></Button></Col>
      </Row>
    </Container>
    </div> );
}

export default App;