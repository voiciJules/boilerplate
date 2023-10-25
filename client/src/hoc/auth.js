import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";
// 아무나 진입 가능한 페이지 => LandingPage, AboutPage
// 로그인한 회원만 진입 가능한 페이지 => DetailPage
// 로그인한 회원은 진입할 수 없는 페이지 => RegisterPage, LoginPage
// 관리자만 진입 가능한 페이지 => AdminPage

const Auth = (SpecificComponent, option, adminRoute = null) => {
  // option??
  // null => 아무나 출입이 가능한 페이지
  // true => 로그인한 유저만 출입이 가능한 페이지
  // false => 로그인한 유저는 출입 불가능한 페이지

  function AuthenticationCheck(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // 로그인 하지 않은 상태라면, 즉 isAuth가 false 라면, 로그인 페이지로 보내준다.
        if (!response.payload.isAuth) {
          if (option) {
            navigate("/login");
          }
        } else {
          //로그인 되어 있는 상태
          if (adminRoute && !response.payload.isAdmin) {
            navigate("/");
          } else {
            if (option === false) {
              navigate("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
};

export default Auth;
