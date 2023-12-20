import { useEffect, useState } from "react";
import { oktaAuth, isAuthenticated } from "./../../oktaConfig";

const AuthLink = () => {
  const [authenticated, setIsAuthenticated] = useState(false);
  const logOutRedirect = async () => await oktaAuth.signOut();

  useEffect(() => {
    const validate = async () => {
      (await isAuthenticated())
        ? setIsAuthenticated(true)
        : setIsAuthenticated(false);
    };
    validate();
  }, []);

  return (
    <>
      {authenticated ? (
        <button onClick={logOutRedirect}>Sign-Out</button>
      ) : (
        <a
          className="text-white hover:text-white hover:bg-slate-500 p-2 rounded-md"
          href="/sign-in"
        >
          Sign In
        </a>
      )}
    </>
  );
};

export default AuthLink;
