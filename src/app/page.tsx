import AuroraBackground from "./components/AuroraBackground";
import ChatContainer from "./components/ChatContainerGemma/chat-container";

export default function Home() {
  return (
    <AuroraBackground>
      <div className="h-screen w-full">
        <ChatContainer />
      </div>
    </AuroraBackground>
  );
}
