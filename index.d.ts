import type { WhisperLanguage } from './types.js';
export declare const WHISPER_PATH = "whisper";
export interface WhisperOptions {
    /** The path to the whisper executable. Defaults to 'whisper' which assumes the system PATH. */
    whisperPath: string;
    model: 'base' | 'large' | 'medium' | 'small' | 'tiny';
    language?: WhisperLanguage;
}
export default function speechToText(pathToSoundFile: string, whisperOptions?: Partial<WhisperOptions>): Promise<string>;
