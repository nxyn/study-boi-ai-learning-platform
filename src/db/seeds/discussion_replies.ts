import { db } from '@/db';
import { discussionReplies } from '@/db/schema';

async function main() {
    const sampleReplies = [
        // Discussion 1 replies (Math help)
        {
            discussionId: 1,
            userId: 'user2',
            content: 'For quadratic equations, I always use the formula method: x = (-b ± √(b²-4ac)) / 2a. Make sure to check your discriminant first - if it\'s positive, you\'ll have two real solutions!',
            createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
        },
        {
            discussionId: 1,
            userId: 'user3',
            content: 'Also try completing the square method! It really helps you understand the vertex form of parabolas. Khan Academy has great videos on this topic.',
            createdAt: new Date('2024-01-15T11:15:00Z').toISOString(),
        },
        {
            discussionId: 1,
            userId: 'user4',
            content: 'Don\'t forget to practice factoring first - sometimes quadratics can be solved much faster that way. Look for perfect square trinomials and difference of squares patterns.',
            createdAt: new Date('2024-01-15T14:20:00Z').toISOString(),
        },

        // Discussion 2 replies (Study motivation)
        {
            discussionId: 2,
            userId: 'user5',
            content: 'You\'ve got this! 💪 I find that setting small daily goals really helps. Even 30 minutes of focused study is better than none. What subjects are you focusing on?',
            createdAt: new Date('2024-01-16T09:45:00Z').toISOString(),
        },
        {
            discussionId: 2,
            userId: 'user6',
            content: 'Try the Pomodoro technique - 25 minutes study, 5 minute break. It really helped me when I was feeling overwhelmed. Also, remember that struggling means you\'re growing!',
            createdAt: new Date('2024-01-16T12:30:00Z').toISOString(),
        },

        // Discussion 3 replies (Chemistry help)
        {
            discussionId: 3,
            userId: 'user7',
            content: 'Balancing equations becomes easier with practice! Start with the most complex molecule first, then work your way to simpler ones. Always balance metals first, then non-metals, then hydrogen and oxygen last.',
            createdAt: new Date('2024-01-17T08:20:00Z').toISOString(),
        },
        {
            discussionId: 3,
            userId: 'user8',
            content: 'I recommend using the algebraic method for complex equations. Assign variables to coefficients and solve the system of equations. It might seem harder at first but it\'s more systematic.',
            createdAt: new Date('2024-01-17T15:45:00Z').toISOString(),
        },
        {
            discussionId: 3,
            userId: 'user9',
            content: 'Here\'s a tip: always check your work by counting atoms on both sides. I keep a tally table while balancing - saves so much time catching mistakes early!',
            createdAt: new Date('2024-01-17T16:30:00Z').toISOString(),
        },

        // Discussion 4 replies (History study group)
        {
            discussionId: 4,
            userId: 'user10',
            content: 'I\'d love to join! I\'m particularly strong in Ancient Rome and Medieval Europe. Are you planning to meet virtually or in person? I have some great timeline resources to share.',
            createdAt: new Date('2024-01-18T13:15:00Z').toISOString(),
        },
        {
            discussionId: 4,
            userId: 'user11',
            content: 'Count me in! I suggest we use a shared Google Doc for notes and maybe create some practice quizzes for each other. When were you thinking of starting?',
            createdAt: new Date('2024-01-18T14:00:00Z').toISOString(),
        },

        // Discussion 5 replies (Note-taking strategies)
        {
            discussionId: 5,
            userId: 'user12',
            content: 'I swear by the Cornell Note-Taking System! Divide your page into three sections: notes, cues, and summary. It forces you to review and synthesize information.',
            createdAt: new Date('2024-01-19T10:00:00Z').toISOString(),
        },
        {
            discussionId: 5,
            userId: 'user13',
            content: 'Mind mapping works wonders for visual learners! I use different colors for different concepts and draw connections between ideas. Try apps like XMind or just use colored pens.',
            createdAt: new Date('2024-01-19T11:30:00Z').toISOString(),
        },
        {
            discussionId: 5,
            userId: 'user14',
            content: 'Digital notes with tags are game-changers! I use Notion and tag everything by subject, difficulty, and topic. Makes reviewing for exams so much easier when you can filter notes.',
            createdAt: new Date('2024-01-19T13:45:00Z').toISOString(),
        },

        // Discussion 6 replies (Physics problems)
        {
            discussionId: 6,
            userId: 'user15',
            content: 'For projectile motion, always break it into horizontal and vertical components! Remember: horizontal velocity stays constant, vertical velocity changes due to gravity. Draw diagrams for every problem!',
            createdAt: new Date('2024-01-20T09:30:00Z').toISOString(),
        },
        {
            discussionId: 6,
            userId: 'user16',
            content: 'Don\'t forget your kinematic equations! I made flashcards with all five equations and when to use each one. Also, always check if your answer makes physical sense.',
            createdAt: new Date('2024-01-20T14:15:00Z').toISOString(),
        },

        // Discussion 7 replies (English essay tips)
        {
            discussionId: 7,
            userId: 'user17',
            content: 'Strong thesis statements are crucial! Make sure it\'s specific, arguable, and previews your main points. I always write my thesis last after I know exactly what I want to argue.',
            createdAt: new Date('2024-01-21T11:00:00Z').toISOString(),
        },
        {
            discussionId: 7,
            userId: 'user18',
            content: 'Outline first, always! I spend 20% of my time outlining and it saves me hours of rewriting. Also, read your essay out loud - you\'ll catch awkward sentences and flow issues.',
            createdAt: new Date('2024-01-21T15:20:00Z').toISOString(),
        },
        {
            discussionId: 7,
            userId: 'user19',
            content: 'For body paragraphs, use the PEEL method: Point, Evidence, Explain, Link. Each paragraph should have one clear main idea that supports your thesis.',
            createdAt: new Date('2024-01-21T16:45:00Z').toISOString(),
        },

        // Discussion 8 replies (AP exam prep)
        {
            discussionId: 8,
            userId: 'user20',
            content: 'Start with past papers from College Board! The real exam questions are the best practice. Time yourself strictly - AP exams are as much about time management as content knowledge.',
            createdAt: new Date('2024-01-22T08:45:00Z').toISOString(),
        },
        {
            discussionId: 8,
            userId: 'user21',
            content: 'Focus on your weak areas but don\'t neglect your strengths. I made a study schedule that allocated 60% time to weak topics, 40% to review strong ones. Which AP subjects are you taking?',
            createdAt: new Date('2024-01-22T12:30:00Z').toISOString(),
        },

        // Discussion 9 replies (Programming study group)
        {
            discussionId: 9,
            userId: 'user22',
            content: 'I\'m interested! I\'m working through Python fundamentals and would love coding partners. We could do pair programming sessions or work through coding challenges together.',
            createdAt: new Date('2024-01-23T10:15:00Z').toISOString(),
        },
        {
            discussionId: 9,
            userId: 'user23',
            content: 'Count me in! I suggest we use LeetCode or HackerRank for practice problems. We could meet weekly to discuss solutions and different approaches. What programming languages are you all focusing on?',
            createdAt: new Date('2024-01-23T14:00:00Z').toISOString(),
        },
        {
            discussionId: 9,
            userId: 'user24',
            content: 'Great idea! I\'m learning JavaScript and React. Maybe we could build a small project together while learning? Nothing beats hands-on experience for programming concepts.',
            createdAt: new Date('2024-01-23T16:20:00Z').toISOString(),
        },

        // Discussion 10 replies (Language learning)
        {
            discussionId: 10,
            userId: 'user25',
            content: 'Immersion is key! Change your phone settings to Spanish, watch Spanish Netflix with Spanish subtitles, and try to think in Spanish throughout the day. ¡Buena suerte!',
            createdAt: new Date('2024-01-24T09:00:00Z').toISOString(),
        },
        {
            discussionId: 10,
            userId: 'user26',
            content: 'Anki flashcards for vocabulary are amazing! Use spaced repetition and add context sentences, not just word translations. Also, try HelloTalk app to chat with native speakers.',
            createdAt: new Date('2024-01-24T13:30:00Z').toISOString(),
        },

        // Discussion 11 replies (Time management)
        {
            discussionId: 11,
            userId: 'user27',
            content: 'Time blocking changed my life! I assign specific time slots for each subject and stick to it. Also, batch similar tasks together - like doing all math homework in one sitting.',
            createdAt: new Date('2024-01-25T11:45:00Z').toISOString(),
        },
        {
            discussionId: 11,
            userId: 'user28',
            content: 'The Eisenhower Matrix helps me prioritize: urgent+important (do first), important but not urgent (schedule), urgent but not important (delegate), neither (eliminate). Game changer!',
            createdAt: new Date('2024-01-25T15:15:00Z').toISOString(),
        },
        {
            discussionId: 11,
            userId: 'user29',
            content: 'Don\'t forget buffer time! I always add 25% extra time to my estimates. Things always take longer than expected, and having buffer time reduces stress significantly.',
            createdAt: new Date('2024-01-25T17:00:00Z').toISOString(),
        },

        // Discussion 12 replies (Biology lab prep)
        {
            discussionId: 12,
            userId: 'user30',
            content: 'Always read the lab manual thoroughly before class! I make notes of the procedure and potential safety hazards. Also, understand the theory behind the experiment - it helps with analysis.',
            createdAt: new Date('2024-01-26T08:30:00Z').toISOString(),
        },
        {
            discussionId: 12,
            userId: 'user31',
            content: 'Keep a detailed lab notebook with observations, not just results. Write in pen, date everything, and include diagrams. Your future self will thank you when writing lab reports!',
            createdAt: new Date('2024-01-26T12:00:00Z').toISOString(),
        },
        {
            discussionId: 12,
            userId: 'user32',
            content: 'Practice using the microscope before your practical! Know the difference between 4x, 10x, and 40x magnification. And always start with the lowest magnification first.',
            createdAt: new Date('2024-01-26T14:45:00Z').toISOString(),
        },

        // Additional replies for variety
        {
            discussionId: 3,
            userId: 'user33',
            content: 'ChemSketch or ChemDraw are great for drawing molecular structures if you\'re having trouble visualizing them. Sometimes seeing the 3D structure helps with understanding reactions.',
            createdAt: new Date('2024-01-27T10:30:00Z').toISOString(),
        },
        {
            discussionId: 5,
            userId: 'user34',
            content: 'Active recall beats passive reading every time! After taking notes, close your book and try to explain the concept out loud or write a summary from memory.',
            createdAt: new Date('2024-01-27T13:15:00Z').toISOString(),
        },
        {
            discussionId: 8,
            userId: 'user35',
            content: 'Join your AP teacher\'s review sessions if they offer them! They often share insider tips about what\'s likely to be on the exam based on their experience.',
            createdAt: new Date('2024-01-27T16:00:00Z').toISOString(),
        },
        {
            discussionId: 2,
            userId: 'user36',
            content: 'Remember that everyone learns differently! Don\'t compare your progress to others. Find what works for you and stick with it. Consistency beats intensity every time.',
            createdAt: new Date('2024-01-28T09:20:00Z').toISOString(),
        },
        {
            discussionId: 11,
            userId: 'user37',
            content: 'Use the two-minute rule: if something takes less than two minutes, do it immediately instead of adding it to your to-do list. Prevents small tasks from piling up.',
            createdAt: new Date('2024-01-28T14:30:00Z').toISOString(),
        }
    ];

    await db.insert(discussionReplies).values(sampleReplies);
    
    console.log('✅ Discussion replies seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});