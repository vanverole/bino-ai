const OPENAI_API_KEY = 'sk-apiapi-giauo2VdVWbmkXimfhlrT3BlbkFJFypH0xYAT5WZyD7d7TqK';
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

    // Determine type of request based on input
    let isImageRequest = chatInput.toLowerCase().startsWith("generate image");

    let response;
    if (isImageRequest) {
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
        const imageUrl = data.data[0].url;
        chatOutput.innerHTML += `<p><strong>AI:</strong> <img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 10px;"></p>`;
    } else {
        response = await fetch('https://api.openai.com/v1/engines/text-davinci-004/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: chatInput,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        const reply = data.choices[0].text.trim();
        chatOutput.innerHTML += `<p><strong>AI:</strong> ${reply}</p>`;
    }

    chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Check IP on page load
document.addEventListener('DOMContentLoaded', checkIP);
