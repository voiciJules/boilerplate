import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action.js";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        // props.history.push("/");
        // => import {useNavigate} from 'react-router-dom';
        // const navigate = useNavigate();
        // props.history.push('/')  =>  navigate('/')
        // 버전이 올라가면서 useHistory > useNavigate로 바뀜(최신버전에는 withRouter, useHistory 둘 다 없음).
        navigate("/");
      } else {
        alert("LoginPage Error");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItem: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input
          type="email"
          value={Email}
          autoComplete="email"
          onChange={onEmailHandler}
        />
        <label>Password</label>
        <input
          type="password"
          value={Password}
          autoComplete="current-password"
          onChange={onPasswordHandler}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
