import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Code,
  Palette,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  const examples = [
    "Create a modern portfolio website for a UX designer",
    "Build an e-commerce site for handmade jewelry",
    "Design a landing page for a tech startup",
    "Make a blog website with dark mode"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              WebForge
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">Features</a>
            <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">Examples</a>
            <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">Pricing</a>
            <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-900/50 border border-indigo-700/50 rounded-full text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Web Development
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build Beautiful Websites
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent block">
                With AI Assistance
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into stunning websites with intelligent step-by-step guidance. 
              Just describe what you want, and we'll help you build it.
            </p>
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to create..."
                className="w-full px-6 py-4 pr-16 text-lg bg-gray-800/80 border-2 border-gray-700 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none shadow-2xl backdrop-blur-sm text-white placeholder-gray-400"
                rows={3}
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="absolute right-3 top-3 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
              >
                <span>Create</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Example Prompts */}
          <div className="mb-16">
            <p className="text-gray-400 mb-4 font-medium">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-4 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl hover:bg-gray-800/80 hover:border-indigo-600/50 transition-all duration-200 text-gray-300 hover:text-indigo-300 shadow-lg"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Generate complete websites in minutes, not hours. Our AI understands your vision instantly.</p>
            </div>
            <div className="text-center p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Beautiful Design</h3>
              <p className="text-gray-300">Every website is crafted with modern design principles and responsive layouts.</p>
            </div>
            <div className="text-center p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Production Ready</h3>
              <p className="text-gray-300">Clean, optimized code that's ready to deploy. No cleanup needed.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
