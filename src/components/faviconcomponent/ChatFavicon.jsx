export function ChatFavicon({ className = '', alt = 'Favicon' }) {
  return (
    <img
      src="https://res.cloudinary.com/dr8pwzxzn/image/upload/c_thumb,w_200,g_face/v1741819729/logoSolo_qvxfcr.png"
      alt={alt}
      loading="lazy"
      className={`w-6 h-4 ${className}`}
    />
  );
}