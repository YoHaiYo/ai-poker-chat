"use client";
import { useState } from "react";
import Link from "next/link";

export default function PokerGame() {
  const [gameState, setGameState] = useState("waiting"); // waiting, playing, finished
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "ai",
      message: "Hello! Ready to start a poker game?",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [playerChips, setPlayerChips] = useState(1000);
  const [aiChips, setAiChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);

  const handleStartGame = () => {
    setGameState("playing");
    // 임시 카드 데이터 (실제로는 랜덤하게 생성)
    setPlayerCards([
      { suit: "hearts", rank: "A", symbol: "♥" },
      { suit: "spades", rank: "K", symbol: "♠" },
    ]);
    setAiCards([
      { suit: "diamonds", rank: "Q", symbol: "♦" },
      { suit: "clubs", rank: "J", symbol: "♣" },
    ]);
    setCommunityCards([
      { suit: "hearts", rank: "10", symbol: "♥" },
      { suit: "spades", rank: "9", symbol: "♠" },
      { suit: "diamonds", rank: "8", symbol: "♦" },
    ]);

    addChatMessage("ai", "Game started! You have great cards!");
  };

  const handleFold = () => {
    setGameState("finished");
    addChatMessage("ai", "You folded. Better luck next time!");
  };

  const handleCall = () => {
    const betAmount = currentBet;
    setPlayerChips((prev) => prev - betAmount);
    addChatMessage("player", `Call! Betting ${betAmount} chips.`);
    addChatMessage("ai", "Good! I&apos;ll call too.");
  };

  const handleRaise = () => {
    const raiseAmount = currentBet + 50;
    setCurrentBet(raiseAmount);
    setPlayerChips((prev) => prev - raiseAmount);
    addChatMessage("player", `Raise! Betting ${raiseAmount} chips.`);
    addChatMessage("ai", "Interesting! I&apos;ll follow.");
  };

  const addChatMessage = (sender, message) => {
    const newMsg = {
      id: Date.now(),
      sender,
      message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    addChatMessage("player", newMessage);
    setNewMessage("");

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponses = [
        "That&apos;s an interesting perspective!",
        "I see what you mean.",
        "Poker is really about psychology, isn&apos;t it?",
        "Better cards will come in the next round!",
      ];
      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];
      addChatMessage("ai", randomResponse);
    }, 1000);
  };

  const gameActions = [
    {
      id: "fold",
      label: "Fold",
      icon: "fas fa-times",
      action: handleFold,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      id: "call",
      label: "Call",
      icon: "fas fa-check",
      action: handleCall,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "raise",
      label: "Raise",
      icon: "fas fa-arrow-up",
      action: handleRaise,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  const renderCard = (card, isHidden = false) => {
    if (isHidden) {
      return (
        <div className="w-20 h-28 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
          <i className="fas fa-question text-white text-2xl"></i>
        </div>
      );
    }

    const cardColor =
      card.suit === "hearts" || card.suit === "diamonds"
        ? "text-red-600"
        : "text-slate-800";

    return (
      <div className="w-20 h-28 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border border-slate-200">
        <div className={`text-sm font-bold ${cardColor}`}>{card.symbol}</div>
        <div className={`text-xl font-bold ${cardColor}`}>{card.rank}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-lg py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-800 font-semibold text-lg"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">AI Poker Chat</h1>
          <div className="text-purple-700 text-lg font-semibold">
            <i className="fas fa-coins mr-2"></i>
            {playerChips} chips
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 게임 테이블 */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-10 shadow-2xl">
              {/* AI 플레이어 영역 */}
              <div className="text-center mb-12">
                <div className="bg-white rounded-lg w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <i className="fas fa-robot text-4xl text-purple-600"></i>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">
                  AI Avatar
                </h3>
                <p className="text-green-100 text-lg">{aiChips} chips</p>

                {/* AI 카드 */}
                <div className="flex justify-center gap-3 mt-6">
                  {aiCards.map((card, index) => (
                    <div key={index}>
                      {renderCard(card, gameState === "waiting")}
                    </div>
                  ))}
                </div>
              </div>

              {/* 커뮤니티 카드 */}
              <div className="text-center mb-12">
                <h4 className="text-white text-2xl font-bold mb-6">
                  Community Cards
                </h4>
                <div className="flex justify-center gap-3">
                  {communityCards.map((card, index) => (
                    <div key={index}>{renderCard(card)}</div>
                  ))}
                  {gameState === "waiting" && (
                    <>
                      <div className="w-20 h-28 bg-slate-400 rounded-lg flex items-center justify-center">
                        <i className="fas fa-plus text-slate-600 text-xl"></i>
                      </div>
                      <div className="w-20 h-28 bg-slate-400 rounded-lg flex items-center justify-center">
                        <i className="fas fa-plus text-slate-600 text-xl"></i>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 플레이어 영역 */}
              <div className="text-center">
                <h3 className="text-white text-2xl font-bold mb-3">You</h3>
                <p className="text-green-100 text-lg mb-6">
                  {playerChips} chips
                </p>

                {/* 플레이어 카드 */}
                <div className="flex justify-center gap-3 mb-8">
                  {playerCards.map((card, index) => (
                    <div key={index}>{renderCard(card)}</div>
                  ))}
                </div>

                {/* 게임 액션 버튼 */}
                {gameState === "waiting" ? (
                  <button
                    onClick={handleStartGame}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-lg font-bold text-xl shadow-lg"
                  >
                    <i className="fas fa-play mr-3"></i>
                    Start Game
                  </button>
                ) : gameState === "playing" ? (
                  <div className="flex justify-center gap-4">
                    {gameActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className={`${action.color} text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg`}
                      >
                        <i className={`${action.icon} mr-2`}></i>
                        {action.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={handleStartGame}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-lg font-bold text-xl shadow-lg"
                  >
                    <i className="fas fa-redo mr-3"></i>New Game
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 채팅 영역 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl h-full flex flex-col border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900">
                  <i className="fas fa-comments mr-3"></i>
                  AI Chat
                </h3>
              </div>

              {/* 채팅 메시지 */}
              <div className="flex-1 p-6 overflow-y-auto max-h-96">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-6 ${
                      msg.sender === "player" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block max-w-xs p-4 rounded-lg ${
                        msg.sender === "player"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 메시지 입력 */}
              <div className="p-6 border-t border-slate-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
