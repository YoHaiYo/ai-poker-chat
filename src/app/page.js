"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  const handleStartGame = () => {
    // 포커게임 페이지로 이동.
    window.location.href = "/poker";
  };

  const features = [
    {
      icon: "fas fa-robot",
      title: "AI Avatar",
      description: "Play poker with an intelligent AI avatar",
    },
    {
      icon: "fas fa-comments",
      title: "Real-time Chat",
      description: "Have natural conversations with AI during gameplay",
    },
    {
      icon: "fas fa-spade",
      title: "Poker Game",
      description: "Experience various poker game modes",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-20">
            <h1 className="text-7xl font-bold text-slate-900 mb-8 tracking-tight">
              AI Poker Chat
            </h1>
            <p className="text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of poker with intelligent AI avatars
            </p>

            <button
              onClick={handleStartGame}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-semibold px-12 py-5 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
            >
              <i className="fas fa-play mr-3"></i>
              Start Playing
            </button>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="text-center">
                  <div className="bg-purple-50 w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <i
                      className={`${feature.icon} text-3xl text-purple-600`}
                    ></i>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Avatar Preview */}
          <div className="bg-white rounded-lg p-12 shadow-xl border border-slate-100">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-8">
                Meet Your AI Partner
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-12 mb-8">
                <div className="bg-white rounded-lg w-40 h-40 mx-auto mb-8 flex items-center justify-center shadow-lg overflow-hidden">
                  <Image
                    src="/img/avatar-ex-1.png"
                    alt="AI Avatar"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-slate-800 text-xl leading-relaxed">
                  &quot;Hello! I&apos;m your AI poker partner. Ready to
                  play?&quot;
                </p>
              </div>
              <p className="text-slate-600 text-lg">
                Experience more engaging conversations during actual gameplay
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
