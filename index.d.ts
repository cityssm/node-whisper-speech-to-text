import type { WhisperLanguage } from './types.js';
export declare const WHISPER_PATH = "whisper";
export interface WhisperOptions {
    /** The path to the whisper executable. Defaults to 'whisper' which assumes the system PATH. */
    whisperPath: string;
    /**
     * The size of the Whisper model to use for transcription. The available models are:
     * - 'tiny': The smallest and fastest model, but with lower accuracy.
     * - 'base': A small model that offers a good balance between speed and accuracy. This is the default model.
     * - 'small': A medium-sized model that provides better accuracy than the base model, but is slower.
     * - 'medium': A larger model that offers even better accuracy than the small model, but is slower.
     * - 'large': The largest and most accurate model, but also the slowest.
     */
    model: 'base' | 'large' | 'medium' | 'small' | 'tiny';
    /**
     * The language of the audio to be transcribed.
     * This can be specified as either a two-letter ISO 639-1 code (e.g., 'en' for English, 'es' for Spanish, etc.)
     * or the full language name (e.g., 'English', 'Spanish', etc.).
     * If not specified, the Whisper model will attempt to automatically detect the language of the audio.
     */
    language?: WhisperLanguage;
}
/**
 * Transcribes the audio from the specified sound file using OpenAI's Whisper model and returns the transcribed text.
 * @param pathToSoundFile - The path to the sound file to be transcribed.
 * This can be an absolute path or a relative path from the current working directory.
 * The file must be in a format supported by the Whisper model (e.g., WAV, MP3, etc.).
 * @param whisperOptions - Optional settings for the Whisper model, such as the model size and language.
 * @returns A promise that resolves to the transcribed text.
 */
export default function speechToText(pathToSoundFile: string, whisperOptions?: Partial<WhisperOptions>): Promise<string>;
