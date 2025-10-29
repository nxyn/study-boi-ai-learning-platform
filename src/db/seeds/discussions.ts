import { db } from '@/db';
import { discussions } from '@/db/schema';

async function main() {
    const sampleDiscussions = [
        {
            title: 'Help with Quadratic Equations - Can\'t solve ax² + bx + c = 0',
            content: 'I\'m really struggling with quadratic equations in Algebra 2. I understand the basics but when it comes to solving problems like 2x² - 5x + 3 = 0, I get confused with the quadratic formula. Can someone walk me through the steps? I keep getting the wrong answer and my test is tomorrow!',
            subject: 'Math',
            imageUrl: 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Quadratic+Formula',
            createdBy: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            likes: 8,
            createdAt: new Date('2024-12-01T14:30:00Z').toISOString(),
            updatedAt: new Date('2024-12-01T14:30:00Z').toISOString(),
        },
        {
            title: 'Geometry Proof Help - Triangle Congruence',
            content: 'I need help with proving triangle congruence. The problem states: Given triangle ABC and triangle DEF, with AB = DE, BC = EF, and angle B = angle E. Prove that triangle ABC ≅ triangle DEF. I think I need to use SAS but I\'m not sure how to write the formal proof. Any tips?',
            subject: 'Math',
            createdBy: 'user_02h4kxt2e8z9y3b1n7m6q5w8r5',
            likes: 12,
            createdAt: new Date('2024-11-28T16:45:00Z').toISOString(),
            updatedAt: new Date('2024-11-28T16:45:00Z').toISOString(),
        },
        {
            title: 'Algebra Word Problems - Distance and Rate',
            content: 'Word problems are killing me! Here\'s one I can\'t figure out: A car travels 240 miles in the same time it takes a train to travel 300 miles. If the train goes 20 mph faster than the car, find the speed of each. I set up the equation but I\'m getting stuck on the algebra part.',
            subject: 'Math',
            imageUrl: 'https://via.placeholder.com/400x300/059669/ffffff?text=Distance+Rate+Time',
            createdBy: 'user_03h4kxt2e8z9y3b1n7m6q5w8r6',
            likes: 5,
            createdAt: new Date('2024-11-25T10:20:00Z').toISOString(),
            updatedAt: new Date('2024-11-25T10:20:00Z').toISOString(),
        },
        {
            title: 'Chemistry Study Group - Balancing Equations',
            content: 'Starting a study group for our upcoming chemistry exam! We\'re focusing on balancing chemical equations and stoichiometry. If anyone wants to join, we meet every Tuesday and Thursday at the library. We could really use help with combustion reactions - they\'re so confusing!',
            subject: 'Science',
            createdBy: 'user_04h4kxt2e8z9y3b1n7m6q5w8r7',
            likes: 15,
            createdAt: new Date('2024-11-30T12:00:00Z').toISOString(),
            updatedAt: new Date('2024-11-30T12:00:00Z').toISOString(),
        },
        {
            title: 'Biology Lab Report Help - Photosynthesis Experiment',
            content: 'I need help writing my lab report on our photosynthesis experiment with elodea plants. We measured oxygen production under different light conditions, but I\'m struggling with analyzing the data and drawing conclusions. Has anyone done a similar experiment? What should I focus on in my discussion section?',
            subject: 'Science',
            imageUrl: 'https://via.placeholder.com/400x300/16a34a/ffffff?text=Photosynthesis+Lab',
            createdBy: 'user_05h4kxt2e8z9y3b1n7m6q5w8r8',
            likes: 7,
            createdAt: new Date('2024-11-27T09:15:00Z').toISOString(),
            updatedAt: new Date('2024-11-27T09:15:00Z').toISOString(),
        },
        {
            title: 'Physics Study Session - Newton\'s Laws and Forces',
            content: 'Anyone want to form a physics study group? I\'m having trouble with force diagrams and applying Newton\'s laws to real-world problems. Especially when there\'s friction involved - I never know how to calculate the friction force correctly. Let\'s meet this weekend to go over practice problems together!',
            subject: 'Science',
            createdBy: 'user_06h4kxt2e8z9y3b1n7m6q5w8r9',
            likes: 11,
            createdAt: new Date('2024-11-29T18:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-29T18:30:00Z').toISOString(),
        },
        {
            title: 'Essay Writing Help - Thesis Statement for Literature Analysis',
            content: 'I\'m writing an essay on symbolism in "The Great Gatsby" and I\'m stuck on my thesis statement. I want to argue that the green light represents both hope and the impossibility of the American Dream, but I can\'t figure out how to word it clearly. Any advice on making it more specific and arguable?',
            subject: 'English',
            imageUrl: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Great+Gatsby+Essay',
            createdBy: 'user_07h4kxt2e8z9y3b1n7m6q5w8s1',
            likes: 9,
            createdAt: new Date('2024-12-02T13:45:00Z').toISOString(),
            updatedAt: new Date('2024-12-02T13:45:00Z').toISOString(),
        },
        {
            title: 'Shakespeare Analysis - Macbeth Character Development',
            content: 'I need to write a 5-page essay on how Macbeth\'s character changes throughout the play. I understand that he goes from hero to villain, but I\'m having trouble finding specific quotes and scenes that show this transformation. Can someone help me identify key moments where his character shifts?',
            subject: 'English',
            createdBy: 'user_08h4kxt2e8z9y3b1n7m6q5w8s2',
            likes: 6,
            createdAt: new Date('2024-11-26T15:20:00Z').toISOString(),
            updatedAt: new Date('2024-11-26T15:20:00Z').toISOString(),
        },
        {
            title: 'World War II Project - Need Research Partners',
            content: 'Looking for 2-3 people to collaborate on our WWII research project. I\'m focusing on the Pacific Theater and need help finding primary sources. If you\'re working on the European Theater or Home Front, we could share resources and help each other with different perspectives. The project is due next Friday!',
            subject: 'History',
            createdBy: 'user_09h4kxt2e8z9y3b1n7m6q5w8s3',
            likes: 4,
            createdAt: new Date('2024-11-24T11:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-24T11:30:00Z').toISOString(),
        },
        {
            title: 'American Revolution Timeline Help',
            content: 'I\'m creating a detailed timeline of events leading up to the American Revolution for my history project. I have the major events like Boston Tea Party and Lexington & Concord, but I\'m missing some important acts and legislation. Can anyone help me fill in the gaps between 1763-1775? Looking for lesser-known but significant events.',
            subject: 'History',
            imageUrl: 'https://via.placeholder.com/400x300/b45309/ffffff?text=Revolution+Timeline',
            createdBy: 'user_10h4kxt2e8z9y3b1n7m6q5w8s4',
            likes: 8,
            createdAt: new Date('2024-11-23T14:00:00Z').toISOString(),
            updatedAt: new Date('2024-11-23T14:00:00Z').toISOString(),
        },
        {
            title: 'Study Tips for Finals Week - What Actually Works?',
            content: 'Finals are approaching and I\'m feeling overwhelmed. I\'ve tried different study methods but nothing seems to stick. What are your best study techniques? I\'ve heard about the Pomodoro Technique and active recall, but I\'m not sure how to implement them effectively. Also, how do you manage stress during exam season?',
            subject: 'General',
            createdBy: 'user_11h4kxt2e8z9y3b1n7m6q5w8s5',
            likes: 13,
            createdAt: new Date('2024-12-03T08:15:00Z').toISOString(),
            updatedAt: new Date('2024-12-03T08:15:00Z').toISOString(),
        },
        {
            title: 'Motivation Crisis - How to Get Back on Track?',
            content: 'I\'ve been struggling with motivation lately. It\'s halfway through the semester and I feel burned out. My grades are slipping and I can\'t seem to focus during study sessions. Has anyone else experienced this? How did you overcome it? I really want to finish the semester strong but I don\'t know where to start.',
            subject: 'General',
            imageUrl: 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Stay+Motivated',
            createdBy: 'user_12h4kxt2e8z9y3b1n7m6q5w8s6',
            likes: 10,
            createdAt: new Date('2024-11-22T19:45:00Z').toISOString(),
            updatedAt: new Date('2024-11-22T19:45:00Z').toISOString(),
        }
    ];

    await db.insert(discussions).values(sampleDiscussions);
    
    console.log('✅ Discussions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});