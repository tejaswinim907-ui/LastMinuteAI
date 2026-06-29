import { useState } from "react";
import { auth } from "../firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

function Login() {
  const [user, setUser] = useState(null);

  async function login() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(
        auth,
        provider
      );

      setUser(result.user);
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  if (user) {
    return (
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.photoURL}
          alt="profile"
          className="w-14 h-14 rounded-full"
        />

        <div>
          <h2 className="font-bold">
            {user.displayName}
          </h2>

          <p className="text-gray-600">
            {user.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="bg-purple-600 text-white px-5 py-3 rounded"
    >
      Sign In With Google
    </button>
  );
}

export default Login;