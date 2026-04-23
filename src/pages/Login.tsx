// src/pages/Login.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await api.post("/auth/login", {
      email,
      password,
    });

    login(res.data.token);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-black border border-green-500 p-6 w-[350px]">
        <h2 className="text-green-400 mb-4 terminal-glow">
          Login Terminal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="email"
            className="w-full bg-transparent border border-gray-700 p-2 text-green-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            className="w-full bg-transparent border border-gray-700 p-2 text-green-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-green-500 text-black py-2 font-bold">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;