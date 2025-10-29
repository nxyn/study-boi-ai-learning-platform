import { db } from '@/db';
import { achievements } from '@/db/schema';

async function main() {
    const sampleAchievements = [
        // Quiz Master Achievements
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            type: 'quiz_master',
            title: 'Math Whiz',
            description: 'Scored 100% on 3 consecutive math quizzes! Your calculation skills are impressive.',
            unlockedAt: new Date('2024-01-15T14:30:00').toISOString(),
        },
        {
            userId: 'user_02h5lyt3f9a0z4c2o8n7r6x9s5',
            type: 'quiz_master',
            title: 'Quiz Champion',
            description: 'Completed 10 quizzes with an average score of 90% or higher. Keep up the excellent work!',
            unlockedAt: new Date('2024-01-20T16:45:00').toISOString(),
        },
        {
            userId: 'user_03h6mzu4g0b1a5d3p9o8s7y0t6',
            type: 'quiz_master',
            title: 'Science Genius',
            description: 'Aced 5 science quizzes in a row! Your understanding of scientific concepts is outstanding.',
            unlockedAt: new Date('2024-01-25T10:15:00').toISOString(),
        },
        {
            userId: 'user_04h7nav5h1c2b6e4q0p9t8z1u7',
            type: 'quiz_master',
            title: 'Speed Learner',
            description: 'Completed 3 difficult quizzes in under 5 minutes each with perfect scores!',
            unlockedAt: new Date('2024-01-28T13:20:00').toISOString(),
        },
        {
            userId: 'user_05h8obw6i2d3c7f5r1q0u9a2v8',
            type: 'quiz_master',
            title: 'History Expert',
            description: 'Demonstrated mastery in history by scoring 95% or higher on 7 history quizzes.',
            unlockedAt: new Date('2024-02-02T09:30:00').toISOString(),
        },
        {
            userId: 'user_06h9pcx7j3e4d8g6s2r1v0b3w9',
            type: 'quiz_master',
            title: 'Perfect Streak',
            description: 'Amazing! You scored 100% on 5 quizzes in different subjects. True academic excellence!',
            unlockedAt: new Date('2024-02-05T15:45:00').toISOString(),
        },
        // Discussion Starter Achievements
        {
            userId: 'user_07h0qdy8k4f5e9h7t3s2w1c4x0',
            type: 'discussion_starter',
            title: 'Thought Leader',
            description: 'Started 5 engaging discussions that received over 20 likes each. Great conversation starter!',
            unlockedAt: new Date('2024-01-18T11:25:00').toISOString(),
        },
        {
            userId: 'user_08h1rez9l5g6f0i8u4t3x2d5y1',
            type: 'discussion_starter',
            title: 'Community Builder',
            description: 'Created 10 meaningful discussions that sparked great conversations among peers.',
            unlockedAt: new Date('2024-01-22T14:10:00').toISOString(),
        },
        {
            userId: 'user_09h2sf0am6h7g1j9v5u4y3e6z2',
            type: 'discussion_starter',
            title: 'Question Master',
            description: 'Posted 3 thought-provoking questions that each received over 15 replies from classmates.',
            unlockedAt: new Date('2024-01-26T16:30:00').toISOString(),
        },
        {
            userId: 'user_10h3tg1bn7i8h2k0w6v5z4f7a3',
            type: 'discussion_starter',
            title: 'Trending Topic Creator',
            description: 'Started a discussion that became the most popular topic of the week with 50+ interactions!',
            unlockedAt: new Date('2024-01-30T12:15:00').toISOString(),
        },
        {
            userId: 'user_11h4uh2co8j9i3l1x7w6a5g8b4',
            type: 'discussion_starter',
            title: 'Study Group Organizer',
            description: 'Initiated 8 study-focused discussions that helped organize successful group study sessions.',
            unlockedAt: new Date('2024-02-03T10:45:00').toISOString(),
        },
        {
            userId: 'user_12h5vi3dp9k0j4m2y8x7b6h9c5',
            type: 'discussion_starter',
            title: 'Curiosity Champion',
            description: 'Your 12 diverse discussion topics across all subjects show incredible intellectual curiosity!',
            unlockedAt: new Date('2024-02-06T17:20:00').toISOString(),
        },
        // Helpful Peer Achievements
        {
            userId: 'user_13h6wj4eq0l1k5n3z9y8c7i0d6',
            type: 'helpful_peer',
            title: 'Study Buddy',
            description: 'Provided helpful replies that earned 25+ likes from grateful classmates. You make learning better!',
            unlockedAt: new Date('2024-01-17T13:40:00').toISOString(),
        },
        {
            userId: 'user_14h7xk5fr1m2l6o4a0z9d8j1e7',
            type: 'helpful_peer',
            title: 'Knowledge Sharer',
            description: 'Shared 15 insightful explanations that helped fellow students understand difficult concepts.',
            unlockedAt: new Date('2024-01-21T15:55:00').toISOString(),
        },
        {
            userId: 'user_15h8yl6gs2n3m7p5b1a0e9k2f8',
            type: 'helpful_peer',
            title: 'Problem Solver',
            description: 'Your detailed step-by-step solutions to math problems received 30+ likes from peers!',
            unlockedAt: new Date('2024-01-24T09:20:00').toISOString(),
        },
        {
            userId: 'user_16h9zm7ht3o4n8q6c2b1f0l3g9',
            type: 'helpful_peer',
            title: 'Encouraging Voice',
            description: 'Posted 20 supportive and motivational replies that boosted classmates\' confidence.',
            unlockedAt: new Date('2024-01-29T11:35:00').toISOString(),
        },
        {
            userId: 'user_17h0an8iu4p5o9r7d3c2g1m4h0',
            type: 'helpful_peer',
            title: 'Mentor Material',
            description: 'Consistently helped struggling students with patient, clear explanations. True peer leadership!',
            unlockedAt: new Date('2024-02-01T14:50:00').toISOString(),
        },
        {
            userId: 'user_18h1bo9jv5q6p0s8e4d3h2n5i1',
            type: 'helpful_peer',
            title: 'Class Hero',
            description: 'Earned 50+ likes across your helpful replies! Your contributions make our learning community amazing.',
            unlockedAt: new Date('2024-02-04T16:05:00').toISOString(),
        }
    ];

    await db.insert(achievements).values(sampleAchievements);
    
    console.log('✅ Achievements seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});