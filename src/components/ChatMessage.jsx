import { User } from 'lucide-react';
import { ChatFavicon } from './faviconcomponent/ChatFavicon';
import ReactMarkdown from 'react-markdown';

export function ChatMessage({ message, isBot }) {
  return (
    <div className={`w-full flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className={`flex gap-2 items-start max-w-[80%] ${isBot ? 'bg-bgDarkBlue/10 border border-bgDarkBlue/20' : 'bg-lightBlue/5 border border-lightBlue/20'} p-4 rounded-lg`}>
        {isBot ? (
          <ChatFavicon alt="Bot Logo" />
        ) : null}
        {isBot ? (
          <div className="flex-1 text-blueGray whitespace-pre-wrap break-words w-full">
            <ReactMarkdown
              components={{
                a: (props) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lightBlue underline hover:text-blue-500 transition-colors duration-200 font-semibold"
                  >
                    {props.children}
                  </a>
                )
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        ) : (
          <>
            <p className="flex-1 text-blueGray whitespace-pre-wrap break-words w-full">{message}</p>
            <User className="w-6 h-6 text-lightBlue flex-shrink-0" />
          </>
        )}
      </div>
    </div>
  );
}