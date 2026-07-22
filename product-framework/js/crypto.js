/**
 * GOAL Product Framework - Web Crypto API Engine (AES-GCM 256-bit)
 * Zero external dependencies. Uses browser native crypto.subtle.
 */

const AppCrypto = (function () {
    const ENCODING = 'utf-8';
    const PBKDF2_ITERATIONS = 100000;

    /**
     * Convert ArrayBuffer to Base64 String
     */
    function bufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Convert Base64 String to ArrayBuffer
     */
    function base64ToBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Derive AES-GCM key from password string using PBKDF2
     */
    async function getCryptoKey(password, saltBuffer) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        return await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: saltBuffer,
                iterations: PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Encrypt arbitrary string with password
     * Returns object: { salt: string, iv: string, ciphertext: string }
     */
    async function encryptText(plainText, password) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(plainText);

        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const key = await getCryptoKey(password, salt);

        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            dataBuffer
        );

        return {
            salt: bufferToBase64(salt),
            iv: bufferToBase64(iv),
            ciphertext: bufferToBase64(encryptedBuffer)
        };
    }

    /**
     * Decrypt encrypted payload object with password
     * Returns decrypted plaintext string. Throws error if password is wrong.
     */
    async function decryptText(encryptedPayload, password) {
        if (!encryptedPayload || !encryptedPayload.salt || !encryptedPayload.iv || !encryptedPayload.ciphertext) {
            throw new Error('Invalid encrypted payload format.');
        }

        const salt = base64ToBuffer(encryptedPayload.salt);
        const iv = base64ToBuffer(encryptedPayload.iv);
        const ciphertext = base64ToBuffer(encryptedPayload.ciphertext);

        const key = await getCryptoKey(password, salt);

        try {
            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: new Uint8Array(iv) },
                key,
                ciphertext
            );

            const decoder = new TextDecoder(ENCODING);
            return decoder.decode(decryptedBuffer);
        } catch (e) {
            throw new Error('解密失敗：密碼錯誤或資料受損。');
        }
    }

    /**
     * Encrypt JS Object
     */
    async function encryptObject(obj, password) {
        const jsonString = JSON.stringify(obj);
        return await encryptText(jsonString, password);
    }

    /**
     * Decrypt JS Object
     */
    async function decryptObject(encryptedPayload, password) {
        const jsonString = await decryptText(encryptedPayload, password);
        return JSON.parse(jsonString);
    }

    return {
        encryptText,
        decryptText,
        encryptObject,
        decryptObject
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppCrypto;
}
