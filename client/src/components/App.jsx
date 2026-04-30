import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SingUp from "./SingUp";
import ChatPage from "./ChatPage";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; // 🔑 Replace this

function App() {
  const [username, setUsername] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <SingUp setUsername={setUsername} />,
    },
    {
      path: "/chat",
      element: <ChatPage username={username} setUsername={setUsername} />,
    },
  ]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;