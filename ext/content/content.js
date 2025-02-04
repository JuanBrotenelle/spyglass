async function getScreenShot() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "captureVisibleTab" }, (response) => {
            if (chrome.runtime.lastError || !response.success) {
                reject(new Error(response?.error || chrome.runtime.lastError.message));
            } else {
                const dataUrl = response.dataUrl;
                const byteString = atob(dataUrl.split(',')[1]);
                const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                const buffer = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    buffer[i] = byteString.charCodeAt(i);
                }
                const file = new Blob([buffer], { type: mimeString });
                resolve(file);
            }
        });
    });
}


async function uploadPhoto(formData) {
    try {
        const response = await fetch('https://console-test873.com:3000/pictures/upload', {
            method: 'POST',
            body: formData,
        });

        data = await response.json();

        if (data.status === "OK") {
            return { success: true };
        } else {
            throw new Error('Failed to upload photo');
        }
    } catch (e) {
        console.log("Error in uploadPhoto:", e);
        return { success: false, message: e.message };
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Message received in content script:", message);

    if (message.action === "requestScreenshot") {
        try {
            const screenshot = await getScreenShot();
            const formData = new FormData();
            formData.append('uuid', message.uuid);
            formData.append('file', screenshot, 'screenshot.jpg');

            const response = await uploadPhoto(formData);

            if (response.success) {
                sendResponse({ success: true, message: "Screenshot uploaded successfully" });
            } else {
                sendResponse({ success: false, message: "Screenshot upload failed" });
            }
        } catch (error) {
            console.error("Error capturing or uploading screenshot:", error);
            sendResponse({ success: false, message: error.message });
        }
    }

    return true;
});

