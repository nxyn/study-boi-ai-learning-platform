import { db } from '@/db';
import { quizQuestions } from '@/db/schema';

async function main() {
    const sampleQuestions = [
        // Quiz 1: Math Easy
        {
            quizId: 1,
            question: "What is 7 + 5?",
            options: ["10", "12", "15", "11"],
            correctAnswer: 1,
            explanation: "When adding 7 + 5, we count forward: 7, 8, 9, 10, 11, 12. The answer is 12.",
            order: 1,
        },
        {
            quizId: 1,
            question: "Which number is larger: 23 or 32?",
            options: ["23", "32", "They are equal", "Cannot tell"],
            correctAnswer: 1,
            explanation: "32 is larger than 23. In the tens place, 3 is greater than 2.",
            order: 2,
        },
        {
            quizId: 1,
            question: "What is 10 - 6?",
            options: ["3", "4", "5", "16"],
            correctAnswer: 1,
            explanation: "When subtracting 6 from 10, we count backwards: 10, 9, 8, 7, 6, 5, 4. The answer is 4.",
            order: 3,
        },
        {
            quizId: 1,
            question: "How many sides does a triangle have?",
            options: ["2", "3", "4", "5"],
            correctAnswer: 1,
            explanation: "A triangle is a shape with exactly three sides and three angles.",
            order: 4,
        },

        // Quiz 2: Science Easy
        {
            quizId: 2,
            question: "What do plants need to make food?",
            options: ["Sunlight and water", "Only water", "Only sunlight", "Soil only"],
            correctAnswer: 0,
            explanation: "Plants use sunlight and water in photosynthesis to make their own food, along with carbon dioxide from the air.",
            order: 1,
        },
        {
            quizId: 2,
            question: "How many legs does a spider have?",
            options: ["6", "8", "10", "4"],
            correctAnswer: 1,
            explanation: "Spiders are arachnids and have 8 legs, which distinguishes them from insects that have 6 legs.",
            order: 2,
        },
        {
            quizId: 2,
            question: "What is the largest planet in our solar system?",
            options: ["Earth", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 2,
            explanation: "Jupiter is the largest planet in our solar system, with a diameter more than 11 times that of Earth.",
            order: 3,
        },
        {
            quizId: 2,
            question: "What happens to water when it freezes?",
            options: ["It becomes gas", "It becomes ice", "It disappears", "It becomes warmer"],
            correctAnswer: 1,
            explanation: "When water freezes at 0°C (32°F), it changes from a liquid to a solid state called ice.",
            order: 4,
        },

        // Quiz 3: English Easy
        {
            quizId: 3,
            question: "Which word is a noun?",
            options: ["Run", "Happy", "Dog", "Quickly"],
            correctAnswer: 2,
            explanation: "A noun is a person, place, or thing. 'Dog' is a thing (animal), making it a noun.",
            order: 1,
        },
        {
            quizId: 3,
            question: "What is the plural of 'child'?",
            options: ["Childs", "Children", "Childes", "Child"],
            correctAnswer: 1,
            explanation: "'Children' is the irregular plural form of 'child'. It doesn't follow the typical -s or -es pattern.",
            order: 2,
        },
        {
            quizId: 3,
            question: "Which sentence uses correct capitalization?",
            options: ["i went to school.", "I went to School.", "I went to school.", "i Went To School."],
            correctAnswer: 2,
            explanation: "The first word of a sentence and the pronoun 'I' should always be capitalized, but common nouns like 'school' are not capitalized unless they start a sentence.",
            order: 3,
        },
        {
            quizId: 3,
            question: "What is a synonym for 'big'?",
            options: ["Small", "Large", "Tiny", "Little"],
            correctAnswer: 1,
            explanation: "A synonym is a word with the same meaning. 'Large' means the same thing as 'big'.",
            order: 4,
        },

        // Quiz 4: History Easy
        {
            quizId: 4,
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
            correctAnswer: 1,
            explanation: "George Washington served as the first President of the United States from 1789 to 1797.",
            order: 1,
        },
        {
            quizId: 4,
            question: "In which year did World War II end?",
            options: ["1944", "1945", "1946", "1947"],
            correctAnswer: 1,
            explanation: "World War II ended in 1945 when Japan surrendered on September 2, 1945, following the atomic bombings.",
            order: 2,
        },
        {
            quizId: 4,
            question: "Which ancient wonder was located in Egypt?",
            options: ["Hanging Gardens", "Great Pyramid", "Colossus of Rhodes", "Lighthouse of Alexandria"],
            correctAnswer: 1,
            explanation: "The Great Pyramid of Giza was built in ancient Egypt and is the only ancient wonder still standing today.",
            order: 3,
        },
        {
            quizId: 4,
            question: "What did Christopher Columbus discover in 1492?",
            options: ["Australia", "The Americas", "India", "China"],
            correctAnswer: 1,
            explanation: "Columbus reached the Americas in 1492, though he believed he had reached Asia. This led to European exploration of the New World.",
            order: 4,
        },

        // Quiz 5: Math Medium
        {
            quizId: 5,
            question: "What is 15% of 200?",
            options: ["25", "30", "35", "40"],
            correctAnswer: 1,
            explanation: "To find 15% of 200, multiply 200 × 0.15 = 30.",
            order: 1,
        },
        {
            quizId: 5,
            question: "If x + 7 = 15, what is x?",
            options: ["6", "7", "8", "9"],
            correctAnswer: 2,
            explanation: "To solve x + 7 = 15, subtract 7 from both sides: x = 15 - 7 = 8.",
            order: 2,
        },
        {
            quizId: 5,
            question: "What is the area of a rectangle with length 8 and width 5?",
            options: ["13", "26", "40", "80"],
            correctAnswer: 2,
            explanation: "The area of a rectangle is length × width = 8 × 5 = 40 square units.",
            order: 3,
        },
        {
            quizId: 5,
            question: "What is 2³ (2 to the power of 3)?",
            options: ["6", "8", "9", "12"],
            correctAnswer: 1,
            explanation: "2³ means 2 × 2 × 2 = 8. This is 2 multiplied by itself 3 times.",
            order: 4,
        },
        {
            quizId: 5,
            question: "What is the square root of 64?",
            options: ["6", "7", "8", "9"],
            correctAnswer: 2,
            explanation: "The square root of 64 is 8, because 8 × 8 = 64.",
            order: 5,
        },

        // Quiz 6: Science Medium
        {
            quizId: 6,
            question: "What is the chemical formula for water?",
            options: ["CO2", "H2O", "NaCl", "O2"],
            correctAnswer: 1,
            explanation: "Water's chemical formula is H2O, indicating it contains 2 hydrogen atoms and 1 oxygen atom.",
            order: 1,
        },
        {
            quizId: 6,
            question: "Which organ in the human body produces insulin?",
            options: ["Liver", "Kidney", "Pancreas", "Heart"],
            correctAnswer: 2,
            explanation: "The pancreas produces insulin, a hormone that helps regulate blood sugar levels.",
            order: 2,
        },
        {
            quizId: 6,
            question: "What type of energy does a moving car have?",
            options: ["Potential energy", "Kinetic energy", "Chemical energy", "Nuclear energy"],
            correctAnswer: 1,
            explanation: "A moving car has kinetic energy, which is the energy of motion.",
            order: 3,
        },
        {
            quizId: 6,
            question: "Which gas makes up about 78% of Earth's atmosphere?",
            options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
            correctAnswer: 2,
            explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen makes up about 21%.",
            order: 4,
        },

        // Quiz 7: English Medium
        {
            quizId: 7,
            question: "Which sentence is written in passive voice?",
            options: ["The dog chased the cat.", "The cat was chased by the dog.", "The dog is chasing the cat.", "The dog will chase the cat."],
            correctAnswer: 1,
            explanation: "Passive voice occurs when the subject receives the action. 'The cat was chased by the dog' shows the cat receiving the action of being chased.",
            order: 1,
        },
        {
            quizId: 7,
            question: "What is the main theme of Romeo and Juliet?",
            options: ["Friendship", "Love and tragedy", "Adventure", "Comedy"],
            correctAnswer: 1,
            explanation: "Romeo and Juliet is primarily about tragic love between two young people from feuding families.",
            order: 2,
        },
        {
            quizId: 7,
            question: "Which is an example of alliteration?",
            options: ["The sun was bright", "Peter Piper picked peppers", "It was raining cats and dogs", "Time flies like an arrow"],
            correctAnswer: 1,
            explanation: "Alliteration is the repetition of the same initial consonant sound. 'Peter Piper picked peppers' repeats the 'P' sound.",
            order: 3,
        },
        {
            quizId: 7,
            question: "What is the past tense of 'swim'?",
            options: ["Swimmed", "Swam", "Swimming", "Swum"],
            correctAnswer: 1,
            explanation: "'Swam' is the simple past tense of 'swim'. 'Swum' is the past participle used with helping verbs.",
            order: 4,
        },

        // Quiz 8: History Medium
        {
            quizId: 8,
            question: "Which event started World War I?",
            options: ["Sinking of Lusitania", "Assassination of Archduke Franz Ferdinand", "German invasion of Poland", "Attack on Pearl Harbor"],
            correctAnswer: 1,
            explanation: "The assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo on June 28, 1914, triggered the start of World War I.",
            order: 1,
        },
        {
            quizId: 8,
            question: "Who wrote the Declaration of Independence?",
            options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "John Adams"],
            correctAnswer: 2,
            explanation: "Thomas Jefferson was the primary author of the Declaration of Independence, drafted in 1776.",
            order: 2,
        },
        {
            quizId: 8,
            question: "Which empire was ruled by Julius Caesar?",
            options: ["Greek Empire", "Roman Empire", "Persian Empire", "Byzantine Empire"],
            correctAnswer: 1,
            explanation: "Julius Caesar was a Roman general and statesman who played a critical role in the Roman Republic's transformation into the Roman Empire.",
            order: 3,
        },
        {
            quizId: 8,
            question: "In which century did the Renaissance begin?",
            options: ["12th century", "13th century", "14th century", "15th century"],
            correctAnswer: 2,
            explanation: "The Renaissance began in the 14th century in Italy, marking a period of renewed interest in art, science, and learning.",
            order: 4,
        },

        // Quiz 9: Math Hard
        {
            quizId: 9,
            question: "If log₂(x) = 5, what is x?",
            options: ["10", "25", "32", "50"],
            correctAnswer: 2,
            explanation: "If log₂(x) = 5, then x = 2⁵ = 32. Logarithms and exponentials are inverse operations.",
            order: 1,
        },
        {
            quizId: 9,
            question: "What is the derivative of x³ + 2x² - 5x + 3?",
            options: ["3x² + 4x - 5", "x⁴ + 2x³ - 5x² + 3x", "3x² + 2x - 5", "3x³ + 4x² - 5x"],
            correctAnswer: 0,
            explanation: "Using the power rule, d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, and d/dx(3) = 0.",
            order: 2,
        },
        {
            quizId: 9,
            question: "What is the value of sin(π/6)?",
            options: ["1/2", "√3/2", "√2/2", "1"],
            correctAnswer: 0,
            explanation: "sin(π/6) = sin(30°) = 1/2. This is a standard trigonometric value.",
            order: 3,
        },
        {
            quizId: 9,
            question: "If the sum of an arithmetic sequence is 100 and it has 10 terms with first term a₁ = 2, what is the common difference?",
            options: ["1.6", "1.8", "2.0", "2.2"],
            correctAnswer: 1,
            explanation: "Using S = n/2(2a₁ + (n-1)d): 100 = 10/2(2(2) + 9d) = 5(4 + 9d). Solving: 20 = 4 + 9d, so d = 16/9 ≈ 1.8.",
            order: 4,
        },

        // Quiz 10: Science Hard
        {
            quizId: 10,
            question: "What is the molecular geometry of methane (CH₄)?",
            options: ["Linear", "Trigonal planar", "Tetrahedral", "Octahedral"],
            correctAnswer: 2,
            explanation: "Methane has a tetrahedral molecular geometry due to sp³ hybridization of the central carbon atom with four bonding pairs.",
            order: 1,
        },
        {
            quizId: 10,
            question: "According to Heisenberg's Uncertainty Principle, what cannot be simultaneously determined with perfect accuracy?",
            options: ["Energy and time", "Position and momentum", "Mass and velocity", "Charge and spin"],
            correctAnswer: 1,
            explanation: "Heisenberg's Uncertainty Principle states that the position and momentum of a particle cannot both be precisely determined at the same time.",
            order: 2,
        },
        {
            quizId: 10,
            question: "What is the rate-determining step in enzyme catalysis according to Michaelis-Menten kinetics?",
            options: ["Enzyme-substrate binding", "Product formation", "Product release", "Enzyme regeneration"],
            correctAnswer: 2,
            explanation: "In Michaelis-Menten kinetics, product release is typically the rate-determining step, as it's usually the slowest step in the catalytic cycle.",
            order: 3,
        },
        {
            quizId: 10,
            question: "What type of nuclear decay increases the atomic number by 1?",
            options: ["Alpha decay", "Beta-minus decay", "Beta-plus decay", "Gamma decay"],
            correctAnswer: 1,
            explanation: "Beta-minus decay converts a neutron to a proton, electron, and antineutrino, increasing the atomic number by 1.",
            order: 4,
        },
    ];

    await db.insert(quizQuestions).values(sampleQuestions);
    
    console.log('✅ Quiz questions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});