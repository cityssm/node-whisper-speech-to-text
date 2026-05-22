/* eslint-disable no-console */
import assert from 'node:assert';
import { describe, it } from 'node:test';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js';
import speechToText from '../index.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug(`${DEBUG_NAMESPACE}:test`);
await describe('whisper-speech-to-text', async () => {
    await it('should translate the audio file to text', async () => {
        const expectedFruits = ['apple', 'blackberry', 'current', 'fig'];
        const transcription = await speechToText('./test/alphabetOfFruits.mp3', {
            model: 'tiny',
            language: 'en'
        });
        debug('Transcription:', transcription);
        for (const fruit of expectedFruits) {
            assert.ok(transcription.includes(fruit), `Transcription should include "${fruit}"`);
        }
    });
});
