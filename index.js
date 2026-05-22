/* eslint-disable promise/avoid-new */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from './debug.config.js';
const debug = Debug(`${DEBUG_NAMESPACE}:index`);
export const WHISPER_PATH = 'whisper';
/**
 * Transcribes the audio from the specified sound file using OpenAI's Whisper model and returns the transcribed text.
 * @param pathToSoundFile - The path to the sound file to be transcribed.
 * This can be an absolute path or a relative path from the current working directory.
 * The file must be in a format supported by the Whisper model (e.g., WAV, MP3, etc.).
 * @param whisperOptions - Optional settings for the Whisper model, such as the model size and language.
 * @returns A promise that resolves to the transcribed text.
 */
export default async function speechToText(pathToSoundFile, whisperOptions) {
    // Output to the temporary directory to avoid cluttering the project directory with transcriptions. The output file will be automatically deleted after processing.
    const outputDirectory = os.tmpdir();
    const options = {
        whisperPath: 'whisper',
        model: 'base',
        ...whisperOptions
    };
    const whisperArguments = [
        '--model',
        options.model,
        '--output_dir',
        outputDirectory,
        '--output_format',
        'txt'
    ];
    if (options.language) {
        whisperArguments.push('--language', options.language);
    }
    whisperArguments.push(pathToSoundFile);
    const debugCommand = `${options.whisperPath} ${whisperArguments.join(' ')}`;
    debug(`Executing command: ${debugCommand}`);
    // eslint-disable-next-line promise/avoid-new
    await new Promise((resolve, reject) => {
        execFile(options.whisperPath, whisperArguments, (error, stdout, stderr) => {
            if (error) {
                debug(`Error executing whisper command: ${error.message}`);
                reject(error);
            }
            else if (stderr) {
                debug(`Whisper command stderr: ${stderr}`);
            }
            resolve(stdout.trim());
        });
    });
    debug('Whisper command executed successfully, reading transcription from output file');
    // The output file will have the same name as the input file but with a .txt extension, and it will be located in the temporary directory.
    const outputFilePath = `${outputDirectory}/${pathToSoundFile
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '')}.txt`;
    debug(`Expected output file path: ${outputFilePath}`);
    // Read the transcribed text from the output file and return it.
    const transcription = await fs.readFile(outputFilePath, 'utf-8');
    // Clean up the output file after reading the transcription.
    debug(`Cleaning up output file: ${outputFilePath}`);
    await fs.unlink(outputFilePath);
    return transcription;
}
