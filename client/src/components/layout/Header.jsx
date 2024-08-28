import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../redux/actions/userActions";
import logo from "/images/logo.png";

const Header = ({ isAuthenticated, isAdmin }) => {
  const [hamburgerTrue, setHamburgerTrue] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const logoutHandler = () => {
    dispatch(logOut());
    nav("/");
  };

  const hamburgerHandler = () => {
    setHamburgerTrue(true);
  };

  const closeHamburgerHandler = () => {
    setHamburgerTrue(false);
  };

  return (
    <>
      {hamburgerTrue === true ? (
        <>
          <div
            className="w-[80%] h-[100vh] bg-red-400 fixed top-0 right-0 z-10 drop-shadow-2xl"
            id="hamburgerDiv"
          >
            <ul className="">
              <li>
                <img
                  src="
                images/icons/x.png"
                  alt=""
                  className="w-6 float-right"
                  onClick={closeHamburgerHandler}
                />
              </li>
              <Link to="/">
                <li
                  className=" hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer"
                  onClick={closeHamburgerHandler}
                >
                  Home
                </li>
              </Link>
              <Link to="/allCourses">
                <li
                  className="hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer"
                  onClick={closeHamburgerHandler}
                >
                  Browse Courses
                </li>
              </Link>

              <Link to="/about">
                <li
                  className="hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer"
                  onClick={closeHamburgerHandler}
                >
                  About Us
                </li>
              </Link>
              <Link to="/request">
                <li
                  className="hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer"
                  onClick={closeHamburgerHandler}
                >
                  Request Course
                </li>
              </Link>
            </ul>
          </div>
        </>
      ) : (
        <>
          <nav className="flex justify-between w-full h-20 bg-darkColor p-2 px-3 border-b-[1px] border-dullWhite items-center">
            <Link to="/">
              <img
                src={logo}
                alt=""
                className="w-[300px] xs:w-[170px]"
                id="mainLogo"
              />
            </Link>
            <ul className="flex items-center xs:hidden">
              <Link to="/">
                <li className=" hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer">
                  Home
                </li>
              </Link>
              <Link to="/allCourses">
                <li className="hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer">
                  Browse Courses
                </li>
              </Link>

              <Link to="/about">
                <li className="hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer">
                  About Us
                </li>
              </Link>
              <Link to="/request">
                <li className="hover:bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer">
                  Request Course
                </li>
              </Link>
            </ul>
            <ul className="flex justify-between items-center">
              {isAuthenticated ? (
                <>
                  <li
                    className="hover:bg-hoverColor bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer xs:text-xs xs:p-2"
                    onClick={logoutHandler}
                  >
                    Log Out
                  </li>
                  <Link to="/profile">
                    <li className="hover:bg-hoverColor bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer xs:text-xs xs:p-2">
                      Profile | Playlist
                    </li>
                  </Link>
                  {isAdmin == true && (
                    <Link to="/admin/dashboard">
                      <li className="hover:bg-hoverColor bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer xs:text-xs xs:p-2">
                        Dashboard
                      </li>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login">
                    <li className="hover:bg-hoverColor bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer xs:text-xs xs:p-2">
                      Login
                    </li>
                  </Link>
                  <Link to="/signup">
                    <li className="hover:bg-hoverColor bg-cardColor text-white p-2 px-3 rounded-lg mx-2 text-sm cursor-pointer xs:text-xs xs:p-2">
                      Sign up
                    </li>
                  </Link>
                </>
              )}
              <div id="hamburgerIcon" onClick={hamburgerHandler}></div>
            </ul>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;
