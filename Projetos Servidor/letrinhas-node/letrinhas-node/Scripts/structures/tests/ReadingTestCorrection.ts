import TestCorrection = require('TestCorrection');

class ReadingTestCorrection extends TestCorrection {
    soundFileUrl: string;
    professorObservations: string;
    // classification: string;

    wordsPerMinute: number;
    correctWordCount: number;
    readingPrecision: number;
    readingSpeed: number;

    expressiveness: number;
    rhythm: number;

    details: string;

    wasCorrected: boolean;
}
export = ReadingTestCorrection;