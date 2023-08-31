import React from "react";
import LoginBg3 from "../assets/img/loginbg3.jpg";
import LoginBg4 from "../assets/img/loginbg4.jpg";
import { FaUser, FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-300 to-sky-700">
      <div className="hidden md:flex justify-center items-center h-full px-3 lg:px-0">
        <div
          className="rounded-lg shadow-lg flex w-full lg:w-3/4 lg:h-3/4"
          style={{
            backgroundColor: "#f9f9f9",
            backgroundImage: `url(${LoginBg4})`,
            backgroundSize: "90% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex w-full h-full py-10 lg:mt-16">
            <div className="h-full flex flex-col p-10" style={{ width: "60%" }}>
              <div className="flex w-full justify-start items-start h-full flex-col gap-y-1">
                <div className="flex flex-col items-start my-10">
                  <h1 className="text-4xl font-san font-semibold text-gray-200">
                    BDBDg
                  </h1>
                  <h1 className="text-3xl font-san font-semibold text-gray-200">
                    협회 시스템
                  </h1>
                </div>

                <h2 className="text-gray-300 text-lg">
                  협회업무와 심사를 위한{" "}
                </h2>
                <h2 className="text-gray-300 text-lg">시스템입니다.</h2>
              </div>
            </div>
            <div
              className="flex w-auto h-full flex-col px-5 py-10"
              style={{ minWidth: "35%" }}
            >
              <div className="flex w-full justify-start items-center h-full flex-col gap-y-3">
                <div className="flex flex-col items-center my-5">
                  <h1 className="text-2xl font-san font-semibold text-gray-800">
                    사용자 로그인
                  </h1>
                </div>
                <div className="flex flex-col items-center w-full px-5 ml-5 gap-y-5">
                  <div className="flex w-full bg-gray-200 h-10 rounded-lg">
                    <div className="flex w-10 h-10 justify-center items-center">
                      <FaUser className="text-gray-600 text-lg" />
                    </div>
                    <input
                      type="text"
                      className=" bg-transparent outline-none"
                    />
                  </div>
                  <div className="flex w-full bg-gray-200 h-10 rounded-lg">
                    <div className="flex w-10 h-10 justify-center items-center">
                      <FaKey className="text-gray-600 text-lg" />
                    </div>
                    <input
                      type="text"
                      className=" bg-transparent  outline-none"
                    />
                  </div>
                  <div className="flex w-full h-20">
                    <button
                      className="w-full  bg-gradient-to-r from-amber-400 to-pink-600 h-10 rounded-3xl mt-2"
                      onClick={() => navigate("/management")}
                    >
                      <span
                        className="font-semibold font-san text-gray-100"
                        style={{ letterSpacing: "10px" }}
                      >
                        로그인
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex md:hidden h-full p-5 flex-col justify-start"
        style={{
          backgroundColor: "#f9f9f9",
          backgroundImage: `url(${LoginBg3})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full h-auto flex flex-col justify-start items-start">
          <div className="flex w-full justify-start items-end h-full flex-col gap-y-1">
            <div className="flex flex-col items-start my-10">
              <h1 className="text-3xl font-san font-semibold text-gray-200">
                BDBDg
              </h1>
              <h1 className="text-2xl font-san font-semibold text-gray-200">
                협회 시스템
              </h1>
            </div>
          </div>
        </div>
        <div className="flex w-full h-auto flex-col mt-20">
          <div className="flex w-full h-auto flex-col px-5 py-10 ">
            <div className="flex w-full justify-start items-center flex-col gap-y-1">
              <div className="flex flex-col items-center my-5">
                <h1 className="text-2xl font-san font-semibold text-gray-800">
                  사용자 로그인
                </h1>
              </div>
              <div className="flex flex-col items-center w-full px-5 ml-5 gap-y-2">
                <div className="flex w-full bg-gray-200 h-10 rounded-lg">
                  <div className="flex w-10 h-10 justify-center items-center">
                    <FaUser className="text-gray-600 text-lg" />
                  </div>
                  <input type="text" className=" bg-transparent" />
                </div>
                <div className="flex w-full bg-gray-200 h-10 rounded-lg">
                  <div className="flex w-10 h-10 justify-center items-center">
                    <FaKey className="text-gray-600 text-lg" />
                  </div>
                  <input type="text" className=" bg-transparent" />
                </div>
                <div className="flex w-full h-20">
                  <button
                    className="w-full  bg-gradient-to-r from-amber-400 to-pink-600 h-10 rounded-3xl mt-2"
                    onClick={() => navigate("/management")}
                  >
                    <span
                      className="font-semibold font-san text-gray-100"
                      style={{ letterSpacing: "10px" }}
                    >
                      로그인
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
