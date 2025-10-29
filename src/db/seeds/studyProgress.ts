import { db } from '@/db';
import { studyProgress } from '@/db/schema';

async function main() {
    const sampleStudyProgress = [
        // Math - 7 records
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            subject: 'Algebra',
            totalQuizzesTaken: 12,
            averageScore: 87,
            lastStudiedAt: new Date('2024-01-15T14:30:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            subject: 'Geometry',
            totalQuizzesTaken: 8,
            averageScore: 92,
            lastStudiedAt: new Date('2024-01-16T10:15:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            subject: 'Calculus',
            totalQuizzesTaken: 15,
            averageScore: 78,
            lastStudiedAt: new Date('2024-01-17T16:45:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            subject: 'Statistics',
            totalQuizzesTaken: 6,
            averageScore: 85,
            lastStudiedAt: new Date('2024-01-18T09:20:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            subject: 'Trigonometry',
            totalQuizzesTaken: 10,
            averageScore: 81,
            lastStudiedAt: new Date('2024-01-19T13:10:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            subject: 'Pre-Algebra',
            totalQuizzesTaken: 4,
            averageScore: 95,
            lastStudiedAt: new Date('2024-01-20T11:30:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r9',
            subject: 'Linear Algebra',
            totalQuizzesTaken: 13,
            averageScore: 73,
            lastStudiedAt: new Date('2024-01-21T15:25:00').toISOString(),
        },

        // Science - 6 records
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            subject: 'Biology',
            totalQuizzesTaken: 11,
            averageScore: 89,
            lastStudiedAt: new Date('2024-01-16T12:40:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            subject: 'Chemistry',
            totalQuizzesTaken: 9,
            averageScore: 84,
            lastStudiedAt: new Date('2024-01-17T14:15:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            subject: 'Physics',
            totalQuizzesTaken: 14,
            averageScore: 76,
            lastStudiedAt: new Date('2024-01-18T16:50:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            subject: 'Environmental Science',
            totalQuizzesTaken: 7,
            averageScore: 91,
            lastStudiedAt: new Date('2024-01-19T10:05:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r9',
            subject: 'Anatomy',
            totalQuizzesTaken: 5,
            averageScore: 88,
            lastStudiedAt: new Date('2024-01-20T13:35:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8ra',
            subject: 'Earth Science',
            totalQuizzesTaken: 12,
            averageScore: 82,
            lastStudiedAt: new Date('2024-01-21T09:45:00').toISOString(),
        },

        // English - 4 records
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            subject: 'Literature',
            totalQuizzesTaken: 8,
            averageScore: 93,
            lastStudiedAt: new Date('2024-01-15T17:20:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8rb',
            subject: 'Creative Writing',
            totalQuizzesTaken: 6,
            averageScore: 86,
            lastStudiedAt: new Date('2024-01-16T14:55:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8rc',
            subject: 'Grammar',
            totalQuizzesTaken: 3,
            averageScore: 79,
            lastStudiedAt: new Date('2024-01-17T11:15:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8rd',
            subject: 'Reading Comprehension',
            totalQuizzesTaken: 10,
            averageScore: 90,
            lastStudiedAt: new Date('2024-01-18T15:40:00').toISOString(),
        },

        // History - 4 records
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            subject: 'World History',
            totalQuizzesTaken: 9,
            averageScore: 83,
            lastStudiedAt: new Date('2024-01-19T12:25:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8re',
            subject: 'US History',
            totalQuizzesTaken: 11,
            averageScore: 88,
            lastStudiedAt: new Date('2024-01-20T16:10:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8rf',
            subject: 'Ancient Civilizations',
            totalQuizzesTaken: 7,
            averageScore: 75,
            lastStudiedAt: new Date('2024-01-21T14:30:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8rg',
            subject: 'European History',
            totalQuizzesTaken: 13,
            averageScore: 81,
            lastStudiedAt: new Date('2024-01-22T10:50:00').toISOString(),
        },

        // Other subjects - 4 records
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            subject: 'Spanish',
            totalQuizzesTaken: 15,
            averageScore: 92,
            lastStudiedAt: new Date('2024-01-17T13:45:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8rh',
            subject: 'Computer Science',
            totalQuizzesTaken: 12,
            averageScore: 87,
            lastStudiedAt: new Date('2024-01-18T17:15:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8ri',
            subject: 'French',
            totalQuizzesTaken: 4,
            averageScore: 68,
            lastStudiedAt: new Date('2024-01-19T09:30:00').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8rj',
            subject: 'Art History',
            totalQuizzesTaken: 6,
            averageScore: 85,
            lastStudiedAt: new Date('2024-01-20T12:05:00').toISOString(),
        }
    ];

    await db.insert(studyProgress).values(sampleStudyProgress);
    
    console.log('✅ Study progress seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});