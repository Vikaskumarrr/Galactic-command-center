"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTamboThread, useTamboThreadInput, useTamboGenerationStage } from '@tambo-ai/react';
import { Send, Loader2, Bot, User, Trash2 } from 'lucide-react';
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
  onClear: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}> = ({ value, onChange, onSubmit, onClear, isLoading, hasMessages }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form className={styles.inputForm} onSubmit={handleSubmit}>
      {hasMessages && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
          disabled={isLoading}
          aria-label="Clear chat"
          title="Clear chat"
        >
          <Trash2 size={16} />
        </button>
      )}
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

  const renderContent = (text: string) => {
    if (!text) return null;
    
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^\w+\n/, '');
        return (
          <pre key={i} className={styles.codeBlock}>
            <code>{code}</code>
          </pre>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className={styles.inlineCode}>{part.slice(1, -1)}</code>;
      }
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={j} className={styles.boldText}>{bp.slice(2, -2)}</strong>;
            }
            return bp;
          })}
        </span>
      );
    });
  };

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
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={styles.messageContent}>
        {message.content && (
          <div className={styles.messageText}>
            {isUser ? message.content : renderContent(message.content)}
          </div>
        )}
        {message.component && (
          <div className={styles.componentWrapper}>
            {message.component}
          </div>
        )}
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
  
  const { thread, streaming, startNewThread } = useTamboThread();
  const { value, setValue, submit } = useTamboThreadInput();
  const { isIdle, generationStage } = useTamboGenerationStage();

  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const prevMessageCount = useRef(0);
  
  // Only show loading after user has actually submitted AND Tambo is working
  const isLoading = hasSubmitted && (!isIdle || streaming);

  // Reset hasSubmitted when new assistant messages arrive (response received)
  const messageCount = thread?.messages?.length || 0;
  useEffect(() => {
    if (hasSubmitted && messageCount > prevMessageCount.current) {
      // New messages arrived — check if the latest is from assistant
      const lastMsg = thread?.messages?.[messageCount - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        setHasSubmitted(false);
      }
    }
    prevMessageCount.current = messageCount;
  }, [messageCount, hasSubmitted, thread?.messages]);

  // Also reset when generation stage reaches a terminal state
  useEffect(() => {
    if (hasSubmitted && isIdle && !streaming) {
      setHasSubmitted(false);
    }
  }, [hasSubmitted, isIdle, streaming]);

  // Convert Tambo messages to display format
  const displayMessages: DisplayMessage[] = React.useMemo(() => [
    {
      id: 'welcome',
      role: 'assistant' as const,
      content: welcomeMessage,
    },
    ...(thread?.messages || []).map((msg) => {
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
  ], [thread?.messages, welcomeMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages.length, streaming, scrollToBottom]);

  // Listen for navigation events from sidebar
  useEffect(() => {
    const handleNavEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ section: string; prompt: string }>;
      const { prompt } = customEvent.detail;
      if (prompt) {
        setValue(prompt);
        setError(null);
        setHasSubmitted(true);
        setTimeout(() => {
          submit().catch((err: unknown) => {
            console.error('Submit failed:', err);
            setHasSubmitted(false);
            setError('Failed to send. Please try again.');
          });
        }, 100);
      }
    };

    window.addEventListener('galactic-nav', handleNavEvent);
    return () => window.removeEventListener('galactic-nav', handleNavEvent);
  }, [setValue, submit]);

  const handleSubmit = async () => {
    if (value.trim() && !isLoading) {
      setError(null);
      setHasSubmitted(true);
      try {
        await submit();
      } catch (err) {
        console.error('Submit failed:', err);
        setHasSubmitted(false);
        setError('Failed to send. Please try again.');
      }
    }
  };

  const handleClearChat = () => {
    startNewThread();
    setValue('');
    setError(null);
    setHasSubmitted(false);
    prevMessageCount.current = 0;
  };

  // Generation stage label for the loading indicator
  const getStageLabel = () => {
    switch (generationStage) {
      case 'CHOOSING_COMPONENT': return 'Analyzing request';
      case 'FETCHING_CONTEXT': return 'Gathering intel';
      case 'HYDRATING_COMPONENT': return 'Assembling response';
      case 'STREAMING_RESPONSE': return 'Transmitting data';
      default: return 'Processing transmission';
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
            <span>{getStageLabel()}</span>
            <span className={styles.dots} aria-hidden="true">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.errorMessage}
            role="alert"
          >
            <span>{error}</span>
            <button 
              className={styles.errorDismiss}
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        value={value} 
        onChange={setValue} 
        onSubmit={handleSubmit} 
        onClear={handleClearChat}
        isLoading={isLoading}
        hasMessages={messageCount > 0}
      />
    </div>
  );
};

export default GalacticChat;
