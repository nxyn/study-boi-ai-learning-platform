import { db } from '@/db';
import { quizzes } from '@/db/schema';

async function main() {
    const sampleQuizzes = [
        // Math quizzes (5 total)
        {
            title: 'Basic Algebra: Solving Linear Equations',
            description: 'Practice solving simple linear equations with one variable. Perfect for students just starting algebra.',
            subject: 'math',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            isPublic: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            title: 'Geometry Fundamentals: Angles and Triangles',
            description: 'Learn about different types of angles and triangle properties. Includes basic angle calculations.',
            subject: 'math',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            isPublic: true,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            title: 'Quadratic Functions and Parabolas',
            description: 'Explore quadratic equations, graphing parabolas, and finding vertex form. Suitable for Algebra II students.',
            subject: 'math',
            difficulty: 'medium',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            isPublic: false,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            title: 'Advanced Geometry: Circle Theorems',
            description: 'Master circle theorems, arc lengths, and sector areas. Comprehensive review for geometry students.',
            subject: 'math',
            difficulty: 'medium',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            isPublic: true,
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-05').toISOString(),
        },
        {
            title: 'Pre-Calculus: Limits and Continuity',
            description: 'Introduction to limits, continuity, and derivatives. Essential preparation for AP Calculus.',
            subject: 'math',
            difficulty: 'hard',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            isPublic: true,
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        
        // Science quizzes (5 total)
        {
            title: 'Cell Structure and Function',
            description: 'Identify cell organelles and understand their functions. Great introduction to cell biology.',
            subject: 'science',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            isPublic: true,
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        {
            title: 'Basic Chemistry: Atoms and Elements',
            description: 'Learn about atomic structure, the periodic table, and chemical bonding basics.',
            subject: 'science',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            isPublic: false,
            createdAt: new Date('2024-01-30').toISOString(),
            updatedAt: new Date('2024-01-30').toISOString(),
        },
        {
            title: 'Forces and Motion in Physics',
            description: 'Understand Newton\'s laws, velocity, acceleration, and force calculations. Core physics concepts.',
            subject: 'science',
            difficulty: 'medium',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            isPublic: true,
            createdAt: new Date('2024-02-03').toISOString(),
            updatedAt: new Date('2024-02-03').toISOString(),
        },
        {
            title: 'Organic Chemistry: Functional Groups',
            description: 'Identify and understand common organic functional groups and their reactions.',
            subject: 'science',
            difficulty: 'medium',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            isPublic: true,
            createdAt: new Date('2024-02-07').toISOString(),
            updatedAt: new Date('2024-02-07').toISOString(),
        },
        {
            title: 'Advanced Biology: Genetics and DNA',
            description: 'Explore DNA replication, protein synthesis, and inheritance patterns. AP Biology level content.',
            subject: 'science',
            difficulty: 'hard',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            isPublic: false,
            createdAt: new Date('2024-02-12').toISOString(),
            updatedAt: new Date('2024-02-12').toISOString(),
        },
        
        // English/Literature quizzes (4 total)
        {
            title: 'Grammar Basics: Parts of Speech',
            description: 'Test your knowledge of nouns, verbs, adjectives, and other parts of speech.',
            subject: 'english',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            isPublic: true,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            title: 'Reading Comprehension: Short Stories',
            description: 'Practice reading comprehension skills with excerpts from classic short stories.',
            subject: 'english',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            isPublic: true,
            createdAt: new Date('2024-01-28').toISOString(),
            updatedAt: new Date('2024-01-28').toISOString(),
        },
        {
            title: 'Shakespeare: Romeo and Juliet Analysis',
            description: 'Analyze themes, characters, and literary devices in Romeo and Juliet.',
            subject: 'english',
            difficulty: 'medium',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            isPublic: false,
            createdAt: new Date('2024-02-04').toISOString(),
            updatedAt: new Date('2024-02-04').toISOString(),
        },
        {
            title: 'Advanced Literature: Symbolism and Themes',
            description: 'Explore complex literary analysis including symbolism, allegory, and thematic development.',
            subject: 'english',
            difficulty: 'hard',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            isPublic: true,
            createdAt: new Date('2024-02-14').toISOString(),
            updatedAt: new Date('2024-02-14').toISOString(),
        },
        
        // History/Social Studies quizzes (4 total)
        {
            title: 'Ancient Civilizations: Egypt and Mesopotamia',
            description: 'Learn about early civilizations, their achievements, and cultural contributions.',
            subject: 'history',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            isPublic: true,
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        {
            title: 'American Revolution: Causes and Effects',
            description: 'Understand the events leading to the American Revolution and its consequences.',
            subject: 'history',
            difficulty: 'medium',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            isPublic: true,
            createdAt: new Date('2024-02-02').toISOString(),
            updatedAt: new Date('2024-02-02').toISOString(),
        },
        {
            title: 'World War II: Major Events and Figures',
            description: 'Comprehensive review of WWII battles, leaders, and global impact.',
            subject: 'history',
            difficulty: 'medium',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            isPublic: false,
            createdAt: new Date('2024-02-08').toISOString(),
            updatedAt: new Date('2024-02-08').toISOString(),
        },
        {
            title: 'Constitutional Law and Government',
            description: 'Advanced study of constitutional principles, Supreme Court cases, and federal system.',
            subject: 'history',
            difficulty: 'hard',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            isPublic: true,
            createdAt: new Date('2024-02-15').toISOString(),
            updatedAt: new Date('2024-02-15').toISOString(),
        },
        
        // Mixed/Other subjects (2 total)
        {
            title: 'Critical Thinking and Logic Puzzles',
            description: 'Develop problem-solving skills with logic puzzles and critical thinking exercises.',
            subject: 'other',
            difficulty: 'easy',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            isPublic: true,
            createdAt: new Date('2024-01-26').toISOString(),
            updatedAt: new Date('2024-01-26').toISOString(),
        },
        {
            title: 'Study Skills and Time Management',
            description: 'Learn effective study techniques, note-taking strategies, and time management skills.',
            subject: 'other',
            difficulty: 'hard',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            isPublic: false,
            createdAt: new Date('2024-02-16').toISOString(),
            updatedAt: new Date('2024-02-16').toISOString(),
        },
    ];

    await db.insert(quizzes).values(sampleQuizzes);
    
    console.log('✅ Quizzes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});