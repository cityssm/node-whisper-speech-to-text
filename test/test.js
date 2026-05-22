import { describe, it } from 'node:test';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js';
import speechToText from '../index.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
await describe('whisper-speech-to-text', async () => {
    await it('should translate the audio file to text', async () => {
        const transcription = await speechToText('./test/alphabetOfFruits.mp3', {
            model: 'tiny',
            language: 'en'
        });
        console.log('Transcription:', transcription);
        if (transcription.includes('apple') &&
            transcription.includes('blackberry') &&
            transcription.includes('currents')) {
            // Test passed
        }
        else {
            throw new Error('Transcription did not include expected words');
        }
    });
});
