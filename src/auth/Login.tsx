import { useState } from "react";
import { login } from "./Auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const success = login(username, password);

    if (success) {
      window.location.reload();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-6 text-center">
          <h2 className="text-2xl font-bold text-white">⭐ Login</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Access Star Wars Characters
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <p className="text-red-600 text-sm font-medium text-center bg-red-50 border border-red-200 rounded-lg py-2">
              {error}
            </p>
          )}

          <div>
            <label className="text-gray-500 font-medium text-sm mb-1 block">
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="text-gray-500 font-medium text-sm mb-1 block">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 active:scale-95"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;