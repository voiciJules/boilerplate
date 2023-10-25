import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../_actions/user_action.js";
import Auth from "../../../hoc/auth";

function RegisterPage() {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const onNameHandler = (e) => {
    setName(e.target.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);

    // if (Password !== ConfirmPassword) {
    //   alert("Password is different from ConfirmPassword");
    // }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("password and confirm password are not matched");
    }

    let body = {
      email: Email,
      name: Name,
      password: Password,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        navigate("/login");
      } else {
        alert("Register Failed!");
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
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Username</label>
        <input
          type="text"
          value={Name}
          autoComplete="username"
          onChange={onNameHandler}
        />
        <label>Password</label>
        <input
          type="password"
          value={Password}
          autoComplete="new-password"
          onChange={onPasswordHandler}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          autoComplete="new-password"
          onChange={onConfirmPasswordHandler}
        />
        <br />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

export default Auth(RegisterPage, false);
