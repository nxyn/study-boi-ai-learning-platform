import { db } from '@/db';
import { userProfiles } from '@/db/schema';

async function main() {
    const sampleUserProfiles = [
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            grade: 12,
            bio: 'Senior focused on computer science and mathematics. I love coding in Python and JavaScript, and I\'m preparing for AP Computer Science. My goal is to get into a top engineering program. Outside of academics, I enjoy building web applications and participating in coding competitions.',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            userId: 'user_02k5lyu3f9a0z4c2o8n7r6x9s5',
            grade: 10,
            bio: 'Sophomore passionate about biology and environmental science. I\'m working toward a career in marine biology and spend my free time volunteering at the local aquarium. I love learning about ocean ecosystems and climate change solutions. Currently preparing for the Science Olympiad competition.',
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            userId: 'user_03m6nzv4g0b1a5d3p9o8s7y0t6',
            grade: 11,
            bio: 'Junior with a deep love for literature and creative writing. I\'m the editor of our school newspaper and participate in debate team. My favorite authors include Maya Angelou and Shakespeare. I\'m planning to major in English Literature and eventually become a journalist or novelist.',
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        {
            userId: 'user_04n7oaw5h1c2b6e4q0p9t8z1u7',
            grade: 9,
            bio: 'Freshman excited about starting high school! I play varsity soccer and I\'m interested in sports medicine. I want to learn more about anatomy and physiology while keeping up with my athletic training. My goal is to balance sports and academics to get into a good pre-med program.',
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        {
            userId: 'user_05o8pbx6i2d3c7f5r1q0u9a2v8',
            grade: 8,
            bio: '8th grader passionate about art and design. I love painting, digital art, and photography. I\'m taking advanced art classes and hope to attend art school in the future. I also enjoy learning about art history and different cultural art styles from around the world.',
            createdAt: new Date('2024-01-28').toISOString(),
            updatedAt: new Date('2024-01-28').toISOString(),
        },
        {
            userId: 'user_06p9qcy7j3e4d8g6s2r1v0b3w9',
            grade: 7,
            bio: '7th grader who loves math and science experiments! I\'m particularly interested in chemistry and physics. I participate in the robotics club and enjoy building things. My dream is to become an engineer and work on renewable energy projects to help the environment.',
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            userId: 'user_07q0rdz8k4f5e9h7t3s2w1c4x0',
            grade: 12,
            bio: 'Senior captain of the debate team with interests in political science and law. I\'m preparing for AP Government and planning to study international relations in college. I volunteer at the local legal aid clinic and hope to become a civil rights lawyer.',
            createdAt: new Date('2024-02-04').toISOString(),
            updatedAt: new Date('2024-02-04').toISOString(),
        },
        {
            userId: 'user_08r1sea9l5g6f0i8u4t3x2d5y1',
            grade: 6,
            bio: '6th grader new to middle school! I love reading fantasy novels and playing video games. I\'m interested in learning more about history, especially ancient civilizations. I also enjoy playing the violin and hope to join the school orchestra next year.',
            createdAt: new Date('2024-02-07').toISOString(),
            updatedAt: new Date('2024-02-07').toISOString(),
        },
        {
            userId: 'user_09s2tfb0m6h7g1j9v5u4y3e6z2',
            grade: 10,
            bio: 'Sophomore interested in psychology and human behavior. I\'m fascinated by how the mind works and enjoy reading psychology books. I volunteer at a local mental health awareness organization and hope to become a clinical psychologist to help teenagers.',
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            userId: 'user_10t3ugc1n7i8h2k0w6v5z4f7a3',
            grade: 11,
            bio: 'Junior passionate about music and theater. I play guitar in a band and act in school plays. I\'m studying music theory and composition, with a goal to attend a performing arts college. I also love learning about different musical cultures and genres.',
            createdAt: new Date('2024-02-13').toISOString(),
            updatedAt: new Date('2024-02-13').toISOString(),
        },
        {
            userId: 'user_11u4vhd2o8j9i3l1x7w6a5g8b4',
            grade: 9,
            bio: 'Freshman with a strong interest in business and entrepreneurship. I\'m learning about economics and marketing, and I run a small online store selling handmade jewelry. My goal is to start my own tech company someday and make a positive impact on society.',
            createdAt: new Date('2024-02-16').toISOString(),
            updatedAt: new Date('2024-02-16').toISOString(),
        },
        {
            userId: 'user_12v5wie3p9k0j4m2y8x7b6h9c5',
            grade: 8,
            bio: '8th grader fascinated by space and astronomy. I\'m a member of the astronomy club and love stargazing. I\'m studying physics and math to prepare for a career in aerospace engineering. My dream is to work for NASA and help with Mars exploration missions.',
            createdAt: new Date('2024-02-19').toISOString(),
            updatedAt: new Date('2024-02-19').toISOString(),
        },
        {
            userId: 'user_13w6xjf4q0l1k5n3z9y8c7i0d6',
            grade: 7,
            bio: '7th grader who loves languages and different cultures. I\'m learning Spanish and French, and I hope to travel the world someday. I\'m interested in becoming a translator or working in international business. I also enjoy cooking foods from different countries.',
            createdAt: new Date('2024-02-22').toISOString(),
            updatedAt: new Date('2024-02-22').toISOString(),
        },
        {
            userId: 'user_14x7ykg5r1m2l6o4a0z9d8j1e7',
            grade: 12,
            bio: 'Senior interested in both STEM and humanities. I\'m taking AP Biology and AP English Literature. I love the intersection of science and ethics, and I\'m considering bioethics or science journalism as career paths. I volunteer at the hospital and write for the science magazine.',
            createdAt: new Date('2024-02-25').toISOString(),
            updatedAt: new Date('2024-02-25').toISOString(),
        },
        {
            userId: 'user_15y8zlh6s2n3m7p5b1a0e9k2f8',
            grade: 6,
            bio: '6th grader excited about learning everything! I love science experiments, especially chemistry, and I enjoy creative writing. I play basketball and participate in the school chess club. My goal is to keep exploring different subjects to find what I\'m most passionate about.',
            createdAt: new Date('2024-02-28').toISOString(),
            updatedAt: new Date('2024-02-28').toISOString(),
        }
    ];

    await db.insert(userProfiles).values(sampleUserProfiles);
    
    console.log('✅ User profiles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});