const OPENAI_API_KEY = '';
const ALLOWED_IP = '194.0.88.126';

async function checkIP() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;

        if (userIP === ALLOWED_IP) {
            document.getElementById('chat-container').style.display = 'flex';
            document.getElementById('restricted-message').style.display = 'none';
        } else {
            document.getElementById('chat-container').style.display = 'none';
            document.getElementById('restricted-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

async function sendMessage() {
    const chatInput = document.getElementById('chat-input').value;
    const chatOutput = document.getElementById('chat-output');

    if (chatInput.trim() === '') {
        return;
    }

    // Display user's message
    chatOutput.innerHTML += `<p><strong>You:</strong> ${chatInput}</p>`;
    chatOutput.scrollTop = chatOutput.scrollHeight;
    document.getElementById('chat-input').value = '';

    let response;
    try {
        if (chatInput.toLowerCase().startsWith("generate image")) {
            response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: chatInput.slice(15).trim(), // Remove "generate image" prefix
                    n: 1,
                    size: '1024x1024'
                })
            });

            const data = await response.json();
            if (data.data && data.data.length > 0) {
                const imageUrl = data.data[0].url;
                chatOutput.innerHTML += `<p><strong>AI:</strong> <img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 10px;"></p>`;
            } else {
                chatOutput.innerHTML += `<p><strong>AI:</strong> Error generating image.</p>`;
            }
        } else {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo", // Specify the model
                    messages: [{role: "user", content: chatInput}], // Use the correct parameter "messages"
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                const reply = data.choices[0].message.content.trim(); // Update to access the message content
                chatOutput.innerHTML += `<p><strong>AI:</strong> ${reply}</p>`;
            } else {
                chatOutput.innerHTML += `<p><strong>AI:</strong> Error generating response.</p>`;
            }
        }
    } catch (error) {
        console.error('Error making request:', error);
        chatOutput.innerHTML += `<p><strong>AI:</strong> Error processing your request.</p>`;
    }

    chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Check IP on page load
document.addEventListener('DOMContentLoaded', checkIP);
