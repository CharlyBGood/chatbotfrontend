export function ChatFavicon({ className = '', alt = 'Favicon' }) {
  return (
    <img
      src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1751043341/mini-logo_piu1w6.png"
      alt={alt}
      loading="lazy"
      className={`h-[1.45em] ${className}`}
    />
  );
}