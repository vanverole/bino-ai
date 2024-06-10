const OPENAI_API_KEY = 'sk-apiapi-giauo2VdVWbmkXimfhlrT3BlbkFJFypH0xYAT5WZyD7d7TqK';
const ALLOWED_IP = '194.0.88.126';

async function checkIP() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;

        if (userIP === ALLOWED_IP) {
            document.getElementById('content').style.display = 'block';
            document.getElementById('restricted-message').style.display = 'none';
        } else {
            document.getElementById('content').style.display = 'none';
            document.getElementById('restricted-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const chatOutput = document.getElementById('chat-output');

    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-004/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: userInput,
            max_tokens: 1000
        })
    });

    const data = await response.json();
    const reply = data.choices[0].text.trim();
    chatOutput.innerHTML += `<p><strong>You:</strong> ${userInput}</p><p><strong>AI:</strong> ${reply}</p>`;
    document.getElementById('user-input').value = '';
}

async function generateImage() {
    const imagePrompt = document.getElementById('image-prompt').value;
    const imageOutput = document.getElementById('image-output');

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024'
        })
    });

    const data = await response.json();
    const imageUrl = data.data[0].url;
    imageOutput.innerHTML = `<img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 10px;">`;
    document.getElementById('image-prompt').value = '';
}

function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const fileOutput = document.getElementById('file-output');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            fileOutput.innerHTML = `<p>${file.name} loaded. Content: <pre>${e.target.result}</pre></p>`;
        };

        reader.onerror = function(e) {
            fileOutput.innerHTML = `<p>Error reading file ${file.name}</p>`;
        };

        reader.readAsText(file);
    } else {
        fileOutput.innerHTML = `<p>No file selected.</p>`;
    }
}

// Check IP on page load
window.onload = checkIP;
