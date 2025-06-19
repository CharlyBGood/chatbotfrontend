# Maschio Chat Widget

A customizable chat widget for insurance consultations.

## Installation

1. Add the widget script to your HTML:
```html
<script src="https://your-cdn-url/chatbot-widget.umd.js"></script>
```

2. Add a container for the widget:
```html
<div id="maschio-chat-widget"></div>
```

3. Initialize the widget:
```javascript
new MaschioChatWidget({
  apiKey: 'your-api-key',
  theme: {
    primary: '#253878',
    bgDark: '#03070f',
    blueGray: '#d3dde6',
    lightBlue: '#44b0de',
    golden: '#f7d16e'
  },
  initialMessage: '¡Bienvenido! ¿En qué puedo ayudarte?',
  containerId: 'maschio-chat-widget'
});
```

## Configuration Options

- `apiKey` (required): Your Hugging Face API key
- `theme` (optional): Custom color scheme
- `initialMessage` (optional): Custom welcome message
- `containerId` (optional): Custom container ID

## Styling

The widget is fully responsive and self-contained. Custom themes can be applied through the configuration options.

## Browser Support

Supports all modern browsers (Chrome, Firefox, Safari, Edge).