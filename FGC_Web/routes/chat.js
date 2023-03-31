// Import the Twilio Chat client library
const Chat = require('twilio-chat');

// Initialize the chat client with your API credentials
const client = await Chat.Client.create({
  apiKey: 'ACa33777b4dc547e679b06aa4d4b0cd07c',
  apiSecret: ' VemJL6WZWSnBoc0FdnhsxSRxiJta6x40',
  serviceSid: 'SK5fe3ab8cf5c11ec7799eed40024eb86d',
});

const channel = await client.getChannelByUniqueName('my-channel');
await channel.getMessages().then(function(messages) {
  // TODO: Display the messages in your UI
}).catch(function(error) {
  console.error('Error:', error);
});

const message = await channel.sendMessage('Hello, world!');
console.log('Message sent:', message);
