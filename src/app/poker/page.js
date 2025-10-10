"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PokerGame() {
  const [gameState, setGameState] = useState("waiting"); // waiting, playing, finished
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [playerChips, setPlayerChips] = useState(1000);
  const [aiChips, setAiChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);

  // 컴포넌트 마운트 시 초기 메시지 추가
  useEffect(() => {
    addChatMessage("ai", "Hello! Ready to start a poker game?");
  }, []);

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
        <div className="w-16 h-24 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
          <i className="fas fa-question text-white text-xl"></i>
        </div>
      );
    }

    const cardColor =
      card.suit === "hearts" || card.suit === "diamonds"
        ? "text-red-600"
        : "text-slate-800";

    return (
      <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border border-slate-200">
        <div className={`text-sm font-bold ${cardColor}`}>{card.symbol}</div>
        <div className={`text-lg font-bold ${cardColor}`}>{card.rank}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-900">
      {/* Header */}
      <div className="bg-slate-800 shadow-lg py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 font-semibold text-lg"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">AI Poker Chat</h1>
          <div className="text-purple-300 text-lg font-semibold">
            <i className="fas fa-coins mr-2"></i>
            {playerChips} chips
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 게임 테이블 */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* 포커 테이블 */}
              <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-full w-full h-96 shadow-2xl border-8 border-green-800 relative overflow-hidden">
                {/* 테이블 패턴 */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-gradient-to-r from-green-600 to-green-800 rounded-full"></div>
                </div>

                {/* AI 플레이어 (상단) */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-white rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-lg border-4 border-green-300">
                    <Image
                      src="/img/avatar-ex-1.png"
                      alt="AI Avatar"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-white text-lg font-bold mb-1">
                    AI Avatar
                  </h3>
                  <p className="text-green-200 text-sm">{aiChips} chips</p>

                  {/* AI 카드 */}
                  <div className="flex justify-center gap-2 mt-3">
                    {aiCards.map((card, index) => (
                      <div
                        key={index}
                        className="transform -rotate-12 hover:rotate-0 transition-transform duration-300"
                      >
                        {renderCard(card, gameState === "waiting")}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 커뮤니티 카드 (중앙) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h4 className="text-white text-lg font-bold mb-4">
                    Community Cards
                  </h4>
                  <div className="flex justify-center gap-2">
                    {communityCards.map((card, index) => (
                      <div
                        key={index}
                        className="transform hover:scale-110 transition-transform duration-300"
                      >
                        {renderCard(card)}
                      </div>
                    ))}
                    {gameState === "waiting" && (
                      <>
                        <div className="w-16 h-24 bg-slate-500 rounded-lg flex items-center justify-center border-2 border-slate-400">
                          <i className="fas fa-plus text-slate-300 text-lg"></i>
                        </div>
                        <div className="w-16 h-24 bg-slate-500 rounded-lg flex items-center justify-center border-2 border-slate-400">
                          <i className="fas fa-plus text-slate-300 text-lg"></i>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 플레이어 (하단) */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <h3 className="text-white text-lg font-bold mb-1">You</h3>
                  <p className="text-green-200 text-sm mb-3">
                    {playerChips} chips
                  </p>

                  {/* 플레이어 카드 */}
                  <div className="flex justify-center gap-2 mb-4">
                    {playerCards.map((card, index) => (
                      <div
                        key={index}
                        className="transform rotate-12 hover:rotate-0 transition-transform duration-300"
                      >
                        {renderCard(card)}
                      </div>
                    ))}
                  </div>

                  {/* 게임 액션 버튼 */}
                  {gameState === "waiting" ? (
                    <button
                      onClick={handleStartGame}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Start Game
                    </button>
                  ) : gameState === "playing" ? (
                    <div className="flex justify-center gap-3">
                      {gameActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className={`${action.color} text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg`}
                        >
                          <i className={`${action.icon} mr-1`}></i>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={handleStartGame}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
                    >
                      <i className="fas fa-redo mr-2"></i>New Game
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 채팅 영역 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg shadow-xl h-full flex flex-col border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-bold text-white">
                  <i className="fas fa-comments mr-2"></i>
                  AI Chat
                </h3>
              </div>

              {/* 채팅 메시지 */}
              <div className="flex-1 p-6 overflow-y-auto max-h-96">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 ${
                      msg.sender === "player" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-3 ${
                        msg.sender === "player"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      {/* 아바타 이미지 */}
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        {msg.sender === "ai" ? (
                          <Image
                            src="/img/avatar-ex-1.png"
                            alt="AI Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                            <i className="fas fa-user text-white text-sm"></i>
                          </div>
                        )}
                      </div>

                      {/* 메시지 */}
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          msg.sender === "player"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 메시지 입력 */}
              <div className="p-6 border-t border-slate-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400"
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
