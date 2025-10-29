import { db } from '@/db';
import { quizAttempts } from '@/db/schema';

async function main() {
    const sampleQuizAttempts = [
        // Easy Quiz Attempts (Quiz IDs 1-6) - Higher scores
        {
            quizId: 1,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            score: 5,
            totalQuestions: 5,
            completedAt: new Date('2024-03-15T14:30:00Z').toISOString(),
        },
        {
            quizId: 1,
            userId: 'user_02h5lyu3f9a0z4c2o8n7r6x9s5',
            score: 4,
            totalQuestions: 5,
            completedAt: new Date('2024-03-14T16:45:00Z').toISOString(),
        },
        {
            quizId: 2,
            userId: 'user_03h6mzv4g0b1a5d3p9o8s7y0t6',
            score: 6,
            totalQuestions: 6,
            completedAt: new Date('2024-03-13T10:15:00Z').toISOString(),
        },
        {
            quizId: 2,
            userId: 'user_04h7naw5h1c2b6e4q0p9t8z1u7',
            score: 5,
            totalQuestions: 6,
            completedAt: new Date('2024-03-12T13:20:00Z').toISOString(),
        },
        {
            quizId: 3,
            userId: 'user_05h8obx6i2d3c7f5r1q0u9a2v8',
            score: 4,
            totalQuestions: 4,
            completedAt: new Date('2024-03-11T09:30:00Z').toISOString(),
        },
        {
            quizId: 3,
            userId: 'user_06h9pcy7j3e4d8g6s2r1v0b3w9',
            score: 3,
            totalQuestions: 4,
            completedAt: new Date('2024-03-10T11:45:00Z').toISOString(),
        },
        {
            quizId: 4,
            userId: 'user_07h0qdz8k4f5e9h7t3s2w1c4x0',
            score: 5,
            totalQuestions: 5,
            completedAt: new Date('2024-03-09T15:10:00Z').toISOString(),
        },
        {
            quizId: 5,
            userId: 'user_08h1rea9l5g6f0i8u4t3x2d5y1',
            score: 4,
            totalQuestions: 6,
            completedAt: new Date('2024-03-08T12:30:00Z').toISOString(),
        },
        {
            quizId: 6,
            userId: 'user_09h2sfb0m6h7g1j9v5u4y3e6z2',
            score: 5,
            totalQuestions: 5,
            completedAt: new Date('2024-03-07T08:45:00Z').toISOString(),
        },
        
        // Medium Quiz Attempts (Quiz IDs 7-13) - Moderate scores
        {
            quizId: 7,
            userId: 'user_10h3tgc1n7i8h2k0w6v5z4f7a3',
            score: 3,
            totalQuestions: 4,
            completedAt: new Date('2024-03-16T14:20:00Z').toISOString(),
        },
        {
            quizId: 7,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            score: 2,
            totalQuestions: 4,
            completedAt: new Date('2024-03-15T17:30:00Z').toISOString(),
        },
        {
            quizId: 8,
            userId: 'user_11h4uhd2o8j9i3l1x7w6a5g8b4',
            score: 4,
            totalQuestions: 5,
            completedAt: new Date('2024-03-14T11:15:00Z').toISOString(),
        },
        {
            quizId: 8,
            userId: 'user_12h5vie3p9k0j4m2y8x7b6h9c5',
            score: 3,
            totalQuestions: 5,
            completedAt: new Date('2024-03-13T16:40:00Z').toISOString(),
        },
        {
            quizId: 9,
            userId: 'user_13h6wjf4q0l1k5n3z9y8c7i0d6',
            score: 2,
            totalQuestions: 4,
            completedAt: new Date('2024-03-12T09:25:00Z').toISOString(),
        },
        {
            quizId: 10,
            userId: 'user_02h5lyu3f9a0z4c2o8n7r6x9s5',
            score: 3,
            totalQuestions: 5,
            completedAt: new Date('2024-03-11T14:50:00Z').toISOString(),
        },
        {
            quizId: 10,
            userId: 'user_14h7xkg5r1m2l6o4a0z9d8j1e7',
            score: 4,
            totalQuestions: 5,
            completedAt: new Date('2024-03-10T13:15:00Z').toISOString(),
        },
        {
            quizId: 11,
            userId: 'user_15h8ylh6s2n3m7p5b1a0e9k2f8',
            score: 2,
            totalQuestions: 4,
            completedAt: new Date('2024-03-09T10:30:00Z').toISOString(),
        },
        {
            quizId: 12,
            userId: 'user_03h6mzv4g0b1a5d3p9o8s7y0t6',
            score: 3,
            totalQuestions: 5,
            completedAt: new Date('2024-03-08T15:45:00Z').toISOString(),
        },
        {
            quizId: 13,
            userId: 'user_16h9zmi7t3o4n8q6c2b1f0l3g9',
            score: 4,
            totalQuestions: 5,
            completedAt: new Date('2024-03-07T12:10:00Z').toISOString(),
        },

        // Hard Quiz Attempts (Quiz IDs 14-20) - Lower scores
        {
            quizId: 14,
            userId: 'user_17h0anj8u4p5o9r7d3c2g1m4h0',
            score: 2,
            totalQuestions: 5,
            completedAt: new Date('2024-03-16T16:20:00Z').toISOString(),
        },
        {
            quizId: 14,
            userId: 'user_04h7naw5h1c2b6e4q0p9t8z1u7',
            score: 1,
            totalQuestions: 5,
            completedAt: new Date('2024-03-15T11:35:00Z').toISOString(),
        },
        {
            quizId: 15,
            userId: 'user_18h1bok9v5q6p0s8e4d3h2n5i1',
            score: 3,
            totalQuestions: 4,
            completedAt: new Date('2024-03-14T14:50:00Z').toISOString(),
        },
        {
            quizId: 15,
            userId: 'user_05h8obx6i2d3c7f5r1q0u9a2v8',
            score: 2,
            totalQuestions: 4,
            completedAt: new Date('2024-03-13T09:40:00Z').toISOString(),
        },
        {
            quizId: 16,
            userId: 'user_19h2cpl0w6r7q1t9f5e4i3o6j2',
            score: 1,
            totalQuestions: 5,
            completedAt: new Date('2024-03-12T13:25:00Z').toISOString(),
        },
        {
            quizId: 16,
            userId: 'user_06h9pcy7j3e4d8g6s2r1v0b3w9',
            score: 3,
            totalQuestions: 5,
            completedAt: new Date('2024-03-11T16:15:00Z').toISOString(),
        },
        {
            quizId: 17,
            userId: 'user_20h3dqm1x7s8r2u0g6f5j4p7k3',
            score: 2,
            totalQuestions: 4,
            completedAt: new Date('2024-03-10T08:30:00Z').toISOString(),
        },
        {
            quizId: 18,
            userId: 'user_07h0qdz8k4f5e9h7t3s2w1c4x0',
            score: 1,
            totalQuestions: 5,
            completedAt: new Date('2024-03-09T12:45:00Z').toISOString(),
        },
        {
            quizId: 18,
            userId: 'user_21h4ern2y8t9s3v1h7g6k5q8l4',
            score: 2,
            totalQuestions: 5,
            completedAt: new Date('2024-03-08T17:20:00Z').toISOString(),
        },
        {
            quizId: 19,
            userId: 'user_08h1rea9l5g6f0i8u4t3x2d5y1',
            score: 3,
            totalQuestions: 4,
            completedAt: new Date('2024-03-07T14:10:00Z').toISOString(),
        },
        {
            quizId: 19,
            userId: 'user_22h5fso3z9u0t4w2i8h7l6r9m5',
            score: 1,
            totalQuestions: 4,
            completedAt: new Date('2024-03-06T11:55:00Z').toISOString(),
        },
        {
            quizId: 20,
            userId: 'user_09h2sfb0m6h7g1j9v5u4y3e6z2',
            score: 2,
            totalQuestions: 5,
            completedAt: new Date('2024-03-05T15:40:00Z').toISOString(),
        },

        // Additional attempts for variety
        {
            quizId: 1,
            userId: 'user_23h6gtp4a0v1u5x3j9i8m7s0n6',
            score: 4,
            totalQuestions: 5,
            completedAt: new Date('2024-03-04T10:25:00Z').toISOString(),
        },
        {
            quizId: 7,
            userId: 'user_24h7huq5b1w2v6y4k0j9n8t1o7',
            score: 3,
            totalQuestions: 4,
            completedAt: new Date('2024-03-03T13:35:00Z').toISOString(),
        },
        {
            quizId: 14,
            userId: 'user_25h8ivr6c2x3w7z5l1k0o9u2p8',
            score: 1,
            totalQuestions: 5,
            completedAt: new Date('2024-03-02T16:50:00Z').toISOString(),
        },
        {
            quizId: 3,
            userId: 'user_26h9jws7d3y4x8a6m2l1p0v3q9',
            score: 4,
            totalQuestions: 4,
            completedAt: new Date('2024-03-01T09:15:00Z').toISOString(),
        },
        {
            quizId: 11,
            userId: 'user_27h0kxt8e4z5y9b7n3m2q1w4r0',
            score: 2,
            totalQuestions: 4,
            completedAt: new Date('2024-02-29T12:40:00Z').toISOString(),
        },
        {
            quizId: 17,
            userId: 'user_28h1lyu9f5a6z0c8o4n3r2x5s1',
            score: 3,
            totalQuestions: 4,
            completedAt: new Date('2024-02-28T14:25:00Z').toISOString(),
        },
        {
            quizId: 5,
            userId: 'user_29h2mzv0g6b7a1d9p5o4s3y6t2',
            score: 5,
            totalQuestions: 6,
            completedAt: new Date('2024-02-27T11:10:00Z').toISOString(),
        },
        {
            quizId: 20,
            userId: 'user_30h3naw1h7c8b2e0q6p5t4z7u3',
            score: 1,
            totalQuestions: 5,
            completedAt: new Date('2024-02-26T17:55:00Z').toISOString(),
        }
    ];

    await db.insert(quizAttempts).values(sampleQuizAttempts);
    
    console.log('✅ Quiz attempts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});