"use client";

import React, { useRef, useEffect } from 'react';
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GalacticChat.module.css';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  component?: React.ReactNode;
}

const ChatInput: React.FC<{ 
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}> = ({ value, onChange, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form className={styles.inputForm} onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask about planets, fleet status, or Jedi wisdom..."
        className={styles.input}
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={!value.trim() || isLoading}
        aria-label="Send message"
      >
        {isLoading ? (
          <Loader2 size={18} className={styles.spinner} />
        ) : (
          <Send size={18} />
        )}
      </button>
    </form>
  );
};

const MessageBubble: React.FC<{ message: DisplayMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${styles.messageBubble} ${isUser ? styles.userMessage : styles.assistantMessage}`}
      role="article"
      aria-label={`${isUser ? 'Your message' : 'Assistant response'}`}
    >
      <div className={styles.messageIcon} aria-hidden="true">
        {isUser ? (
          <User size={16} />
        ) : (
          <Bot size={16} />
        )}
      </div>
      <div className={styles.messageContent}>
        {message.content && <p className={styles.messageText}>{message.content}</p>}
        {message.component}
      </div>
    </motion.div>
  );
};

interface GalacticChatProps {
  welcomeMessage?: string;
  placeholder?: string;
}

export const GalacticChat: React.FC<GalacticChatProps> = ({
  welcomeMessage = "Welcome, Commander. The Force is strong with this UI. What tactical data do you require?",
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use Tambo AI hooks for real AI interaction
  const { thread, streaming } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  // Track if user has submitted at least once
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  
  // Only show loading after user has actually submitted something
  // This prevents the initial streaming/isPending state from blocking input
  const isLoading = hasSubmitted && (streaming || isPending);

  // Reset hasSubmitted when response completes
  useEffect(() => {
    if (hasSubmitted && !streaming && !isPending) {
      setHasSubmitted(false);
    }
  }, [hasSubmitted, streaming, isPending]);

  // Convert Tambo messages to display format
  const displayMessages: DisplayMessage[] = [
    {
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessage,
    },
    ...(thread?.messages || []).map((msg) => {
      // Extract text content from message parts
      let textContent = '';
      if (Array.isArray(msg.content)) {
        textContent = msg.content
          .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
          .map(part => part.text)
          .join('');
      } else if (typeof msg.content === 'string') {
        textContent = msg.content;
      }
      
      return {
        id: msg.id,
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: textContent,
        component: msg.renderedComponent,
      };
    }),
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages.length, streaming]);

  // Listen for navigation events from sidebar
  useEffect(() => {
    const handleNavEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ section: string; prompt: string }>;
      const { prompt } = customEvent.detail;
      if (prompt) {
        setValue(prompt);
        // Auto-submit after a brief delay
        setTimeout(() => {
          submit();
        }, 100);
      }
    };

    window.addEventListener('galactic-nav', handleNavEvent);
    return () => window.removeEventListener('galactic-nav', handleNavEvent);
  }, [setValue, submit]);

  const handleSubmit = async () => {
    if (value.trim() && !isLoading) {
      setHasSubmitted(true);
      await submit();
    }
  };

  return (
    <div className={styles.chatContainer} role="region" aria-label="Galactic Command Chat Interface">
      <div 
        className={styles.messagesContainer} 
        role="log" 
        aria-label="Chat messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence>
          {displayMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.typingIndicator}
            role="status"
            aria-label="Processing your request"
          >
            <Bot size={16} aria-hidden="true" />
            <span>Processing transmission</span>
            <span className={styles.dots} aria-hidden="true">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        value={value} 
        onChange={setValue} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default GalacticChat;
