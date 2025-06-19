import { ChatFavicon } from "./faviconcomponent/ChatFavicon";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="flex gap-2 items-start max-w-[80%] bg-bgDarkBlue/10 border border-bgDarkBlue/20 pr-6 rounded-lg">
        {/* <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"> */}
        <ChatFavicon />
        {/* </div> */}
      </div>
      {/* Mensaje de typing */}
      <div className="bg-bgDarkBlue shadow-sm flex-1 whitespace-pre-wrap break-words w-full">
        {/* <div className="flex items-center"> */}
          {/* <span className="text-gray-600 text-sm">SegurBot está escribiendo</span> */}
          <div className="flex align-baseline gap-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default TypingIndicator;
