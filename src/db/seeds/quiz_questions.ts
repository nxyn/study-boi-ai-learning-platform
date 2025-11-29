import { db } from '@/db';
import { quizQuestions } from '@/db/schema';

async function main() {
    const sampleQuestions = [
        // Quiz 1 - Easy Science questions
        {
            quizId: 1,
            question: "What is the chemical symbol for water?",
            correctAnswer: "H2O",
            wrongAnswers: ["H2SO4", "CO2", "NaCl"],
            explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O."
        },
        {
            quizId: 1,
            question: "Which planet is closest to the Sun?",
            correctAnswer: "Mercury",
            wrongAnswers: ["Venus", "Earth", "Mars"],
            explanation: "Mercury is the innermost planet in our solar system, orbiting closest to the Sun."
        },
        {
            quizId: 1,
            question: "What gas do plants absorb from the atmosphere during photosynthesis?",
            correctAnswer: "Carbon dioxide",
            wrongAnswers: ["Oxygen", "Nitrogen", "Hydrogen"],
            explanation: "Plants use carbon dioxide from the air, along with water and sunlight, to produce glucose and oxygen."
        },
        {
            quizId: 1,
            question: "What is the hardest natural substance on Earth?",
            correctAnswer: "Diamond",
            wrongAnswers: ["Gold", "Iron", "Quartz"],
            explanation: "Diamond is the hardest naturally occurring substance, ranking 10 on the Mohs hardness scale."
        },

        // Quiz 2 - Easy Math questions
        {
            quizId: 2,
            question: "If a pizza is cut into 8 equal slices and you eat 3 slices, what fraction of the pizza did you eat?",
            correctAnswer: "3/8",
            wrongAnswers: ["3/5", "1/3", "5/8"],
            explanation: "You ate 3 out of 8 total slices, which is represented as the fraction 3/8."
        },
        {
            quizId: 2,
            question: "What is 15% of 200?",
            correctAnswer: "30",
            wrongAnswers: ["25", "35", "40"],
            explanation: "To find 15% of 200, multiply 200 × 0.15 = 30."
        },
        {
            quizId: 2,
            question: "A rectangle has a length of 12 cm and width of 5 cm. What is its area?",
            correctAnswer: "60 cm²",
            wrongAnswers: ["17 cm²", "34 cm²", "25 cm²"],
            explanation: "Area of a rectangle = length × width = 12 cm × 5 cm = 60 cm²."
        },
        {
            quizId: 2,
            question: "If x + 7 = 15, what is the value of x?",
            correctAnswer: "8",
            wrongAnswers: ["22", "7", "15"],
            explanation: "To solve x + 7 = 15, subtract 7 from both sides: x = 15 - 7 = 8."
        },

        // Quiz 3 - Easy History questions
        {
            quizId: 3,
            question: "Who was the first President of the United States?",
            correctAnswer: "George Washington",
            wrongAnswers: ["Thomas Jefferson", "John Adams", "Benjamin Franklin"],
            explanation: "George Washington served as the first President from 1789 to 1797 and is known as the 'Father of His Country.'"
        },
        {
            quizId: 3,
            question: "In which year did World War II end?",
            correctAnswer: "1945",
            wrongAnswers: ["1944", "1946", "1943"],
            explanation: "World War II ended in 1945 with Japan's surrender in September following the atomic bombings."
        },
        {
            quizId: 3,
            question: "Which ancient wonder of the world was located in Alexandria, Egypt?",
            correctAnswer: "The Lighthouse of Alexandria",
            wrongAnswers: ["The Hanging Gardens", "The Colossus of Rhodes", "The Temple of Artemis"],
            explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World and guided ships into the harbor."
        },
        {
            quizId: 3,
            question: "What empire was ruled by Julius Caesar?",
            correctAnswer: "Roman Empire",
            wrongAnswers: ["Greek Empire", "Persian Empire", "Ottoman Empire"],
            explanation: "Julius Caesar was a Roman general and statesman who played a critical role in the fall of the Roman Republic."
        },

        // Quiz 4 - Medium Science questions
        {
            quizId: 4,
            question: "What is the pH of pure water at 25°C?",
            correctAnswer: "7",
            wrongAnswers: ["0", "14", "1"],
            explanation: "Pure water has a pH of 7, which is considered neutral on the pH scale that ranges from 0-14."
        },
        {
            quizId: 4,
            question: "Which organelle is responsible for cellular respiration?",
            correctAnswer: "Mitochondria",
            wrongAnswers: ["Nucleus", "Ribosome", "Chloroplast"],
            explanation: "Mitochondria are the powerhouses of the cell, converting glucose and oxygen into ATP energy."
        },
        {
            quizId: 4,
            question: "What is Newton's second law of motion?",
            correctAnswer: "F = ma",
            wrongAnswers: ["E = mc²", "v = d/t", "P = mv"],
            explanation: "Newton's second law states that force equals mass times acceleration (F = ma)."
        },
        {
            quizId: 4,
            question: "Which type of rock is formed from cooled magma?",
            correctAnswer: "Igneous",
            wrongAnswers: ["Sedimentary", "Metamorphic", "Fossilized"],
            explanation: "Igneous rocks form when magma or lava cools and solidifies, either underground or on the surface."
        },

        // Quiz 5 - Medium Math questions
        {
            quizId: 5,
            question: "What is the slope of a line passing through points (2, 3) and (6, 11)?",
            correctAnswer: "2",
            wrongAnswers: ["1/2", "4", "8"],
            explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(6 - 2) = 8/4 = 2."
        },
        {
            quizId: 5,
            question: "If sin θ = 3/5, what is cos θ in a right triangle?",
            correctAnswer: "4/5",
            wrongAnswers: ["3/4", "5/3", "5/4"],
            explanation: "Using the Pythagorean theorem: if sin θ = 3/5, then cos θ = 4/5 (since 3² + 4² = 5²)."
        },
        {
            quizId: 5,
            question: "What is the median of the data set: 5, 8, 12, 15, 20?",
            correctAnswer: "12",
            wrongAnswers: ["8", "15", "12.5"],
            explanation: "The median is the middle value when data is arranged in order. With 5 values, the median is the 3rd value: 12."
        },
        {
            quizId: 5,
            question: "Solve for x: 2x² - 8 = 0",
            correctAnswer: "x = ±2",
            wrongAnswers: ["x = ±4", "x = 2", "x = 4"],
            explanation: "2x² - 8 = 0 → 2x² = 8 → x² = 4 → x = ±2."
        },

        // Quiz 6 - Medium History questions
        {
            quizId: 6,
            question: "The Renaissance began in which country?",
            correctAnswer: "Italy",
            wrongAnswers: ["France", "England", "Germany"],
            explanation: "The Renaissance began in Italy during the 14th century, starting in cities like Florence and Venice."
        },
        {
            quizId: 6,
            question: "Who wrote the Communist Manifesto?",
            correctAnswer: "Karl Marx and Friedrich Engels",
            wrongAnswers: ["Vladimir Lenin", "Joseph Stalin", "Leon Trotsky"],
            explanation: "The Communist Manifesto was published in 1848 by Karl Marx and Friedrich Engels."
        },
        {
            quizId: 6,
            question: "Which empire built Machu Picchu?",
            correctAnswer: "Inca Empire",
            wrongAnswers: ["Aztec Empire", "Maya Empire", "Spanish Empire"],
            explanation: "Machu Picchu was built by the Inca Empire in the 15th century in what is now Peru."
        },
        {
            quizId: 6,
            question: "The Magna Carta was signed in which year?",
            correctAnswer: "1215",
            wrongAnswers: ["1066", "1485", "1337"],
            explanation: "The Magna Carta was signed in 1215, limiting the power of King John of England."
        },

        // Quiz 7 - Hard Science questions
        {
            quizId: 7,
            question: "What is the electron configuration of iron (Fe)?",
            correctAnswer: "[Ar] 3d⁶ 4s²",
            wrongAnswers: ["[Ar] 3d⁸", "[Ne] 3s² 3p⁶ 3d⁶", "[Kr] 4d⁶"],
            explanation: "Iron has 26 electrons. Its electron configuration is [Ar] 3d⁶ 4s², where [Ar] represents the first 18 electrons."
        },
        {
            quizId: 7,
            question: "Which principle states that you cannot simultaneously know both the position and momentum of a particle?",
            correctAnswer: "Heisenberg Uncertainty Principle",
            wrongAnswers: ["Pauli Exclusion Principle", "Hund's Rule", "Aufbau Principle"],
            explanation: "The Heisenberg Uncertainty Principle states that the more precisely you know a particle's position, the less precisely you can know its momentum."
        },
        {
            quizId: 7,
            question: "What is the half-life of Carbon-14?",
            correctAnswer: "5,730 years",
            wrongAnswers: ["1,600 years", "12,000 years", "50,000 years"],
            explanation: "Carbon-14 has a half-life of approximately 5,730 years, making it useful for dating organic materials up to about 50,000 years old."
        },

        // Quiz 8 - Hard Math questions
        {
            quizId: 8,
            question: "What is the derivative of ln(x²)?",
            correctAnswer: "2/x",
            wrongAnswers: ["1/x²", "2x", "x"],
            explanation: "Using the chain rule: d/dx[ln(x²)] = (1/x²) × 2x = 2/x."
        },
        {
            quizId: 8,
            question: "If log₂(x) = 5, what is x?",
            correctAnswer: "32",
            wrongAnswers: ["10", "25", "125"],
            explanation: "If log₂(x) = 5, then x = 2⁵ = 32."
        },
        {
            quizId: 8,
            question: "What is the sum of the infinite geometric series 1 + 1/2 + 1/4 + 1/8 + ...?",
            correctAnswer: "2",
            wrongAnswers: ["1", "4", "∞"],
            explanation: "For an infinite geometric series with first term a = 1 and ratio r = 1/2, the sum is a/(1-r) = 1/(1-1/2) = 2."
        },

        // Quiz 9 - Hard History questions
        {
            quizId: 9,
            question: "The Treaty of Westphalia (1648) ended which major conflict?",
            correctAnswer: "Thirty Years' War",
            wrongAnswers: ["Hundred Years' War", "Seven Years' War", "War of Spanish Succession"],
            explanation: "The Treaty of Westphalia in 1648 ended the Thirty Years' War and established the principle of state sovereignty."
        },
        {
            quizId: 9,
            question: "Who was the last Byzantine Emperor?",
            correctAnswer: "Constantine XI Palaiologos",
            wrongAnswers: ["Justinian I", "John VIII Palaiologos", "Manuel II Palaiologos"],
            explanation: "Constantine XI Palaiologos was the last Byzantine Emperor, dying during the fall of Constantinople in 1453."
        },
        {
            quizId: 9,
            question: "The Opium Wars were fought between China and which European power?",
            correctAnswer: "Britain",
            wrongAnswers: ["France", "Portugal", "Netherlands"],
            explanation: "The Opium Wars (1839-1842 and 1856-1860) were fought between China and Britain over trade disputes."
        },

        // Quiz 10 - Mixed Easy questions
        {
            quizId: 10,
            question: "What is the largest organ in the human body?",
            correctAnswer: "Skin",
            wrongAnswers: ["Liver", "Brain", "Heart"],
            explanation: "The skin is the largest organ, accounting for about 16% of body weight and protecting internal organs."
        },
        {
            quizId: 10,
            question: "What is 7 × 8?",
            correctAnswer: "56",
            wrongAnswers: ["54", "48", "63"],
            explanation: "7 × 8 = 56. This is a basic multiplication fact."
        },
        {
            quizId: 10,
            question: "Who painted the Mona Lisa?",
            correctAnswer: "Leonardo da Vinci",
            wrongAnswers: ["Michelangelo", "Raphael", "Picasso"],
            explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519 during the Italian Renaissance."
        },

        // Quiz 11 - Mixed Medium questions
        {
            quizId: 11,
            question: "What is the molecular formula for glucose?",
            correctAnswer: "C₆H₁₂O₆",
            wrongAnswers: ["C₆H₆O₆", "C₁₂H₂₂O₁₁", "C₂H₆O"],
            explanation: "Glucose has the molecular formula C₆H₁₂O₆ and is a simple sugar essential for cellular energy."
        },
        {
            quizId: 11,
            question: "What is the quadratic formula?",
            correctAnswer: "x = (-b ± √(b²-4ac))/2a",
            wrongAnswers: ["x = -b/2a", "x = √(b²-4ac)", "x = (a+b)/c"],
            explanation: "The quadratic formula solves equations of the form ax² + bx + c = 0."
        },
        {
            quizId: 11,
            question: "The Berlin Wall fell in which year?",
            correctAnswer: "1989",
            wrongAnswers: ["1987", "1991", "1985"],
            explanation: "The Berlin Wall fell on November 9, 1989, marking a key moment in the end of the Cold War."
        },

        // Quiz 12 - Mixed Hard questions
        {
            quizId: 12,
            question: "What is the Avogadro constant?",
            correctAnswer: "6.022 × 10²³ mol⁻¹",
            wrongAnswers: ["3.14 × 10⁸ m/s", "9.81 m/s²", "1.602 × 10⁻¹⁹ C"],
            explanation: "Avogadro's constant is 6.022 × 10²³ mol⁻¹, representing the number of particles in one mole."
        },
        {
            quizId: 12,
            question: "What is the integral of e^x dx?",
            correctAnswer: "e^x + C",
            wrongAnswers: ["xe^x + C", "e^x/x + C", "ln(x) + C"],
            explanation: "The integral of e^x is e^x + C, where C is the constant of integration."
        },
        {
            quizId: 12,
            question: "The Congress of Vienna was held in which year?",
            correctAnswer: "1815",
            wrongAnswers: ["1814", "1816", "1820"],
            explanation: "The Congress of Vienna was held in 1815 to reorganize Europe after Napoleon's defeat."
        },

        // Quiz 13 - Physics Focus
        {
            quizId: 13,
            question: "What is the speed of light in a vacuum?",
            correctAnswer: "299,792,458 m/s",
            wrongAnswers: ["300,000,000 m/s", "186,000 mi/s", "3.00 × 10⁶ m/s"],
            explanation: "The speed of light in a vacuum is exactly 299,792,458 meters per second, denoted as 'c'."
        },
        {
            quizId: 13,
            question: "According to Einstein's mass-energy equivalence, what does E represent?",
            correctAnswer: "Energy",
            wrongAnswers: ["Electric field", "Entropy", "Electron"],
            explanation: "In E=mc², E represents energy, showing the equivalence between mass and energy."
        },
        {
            quizId: 13,
            question: "What is the SI unit for electric current?",
            correctAnswer: "Ampere",
            wrongAnswers: ["Volt", "Ohm", "Watt"],
            explanation: "The ampere (A) is the SI base unit for electric current, named after André-Marie Ampère."
        },

        // Quiz 14 - Biology Focus
        {
            quizId: 14,
            question: "DNA is primarily located in which part of the cell?",
            correctAnswer: "Nucleus",
            wrongAnswers: ["Cytoplasm", "Mitochondria", "Ribosome"],
            explanation: "Most DNA is located in the cell nucleus, though small amounts are also found in mitochondria."
        },
        {
            quizId: 14,
            question: "Which blood type is considered the universal donor?",
            correctAnswer: "O negative",
            wrongAnswers: ["AB positive", "A positive", "B negative"],
            explanation: "O negative blood can be given to recipients of any blood type, making it the universal donor."
        },
        {
            quizId: 14,
            question: "What is the process by which plants make their own food?",
            correctAnswer: "Photosynthesis",
            wrongAnswers: ["Cellular respiration", "Fermentation", "Digestion"],
            explanation: "Photosynthesis is the process where plants convert sunlight, water, and CO₂ into glucose and oxygen."
        },

        // Quiz 15 - World History Focus
        {
            quizId: 15,
            question: "The ancient city of Babylon was located in present-day which country?",
            correctAnswer: "Iraq",
            wrongAnswers: ["Iran", "Turkey", "Syria"],
            explanation: "Ancient Babylon was located in Mesopotamia, in what is now modern-day Iraq near Baghdad."
        },
        {
            quizId: 15,
            question: "Which dynasty built the Great Wall of China?",
            correctAnswer: "Ming Dynasty",
            wrongAnswers: ["Qin Dynasty", "Han Dynasty", "Tang Dynasty"],
            explanation: "While earlier dynasties built walls, most of the Great Wall that exists today was built during the Ming Dynasty (1368-1644)."
        },
        {
            quizId: 15,
            question: "The Rosetta Stone was crucial for deciphering which ancient script?",
            correctAnswer: "Egyptian hieroglyphs",
            wrongAnswers: ["Cuneiform", "Linear B", "Mayan glyphs"],
            explanation: "The Rosetta Stone contained the same text in three scripts, allowing scholars to decipher Egyptian hieroglyphs."
        },
        {
            quizId: 15,
            question: "Which explorer led the first expedition to circumnavigate the globe?",
            correctAnswer: "Ferdinand Magellan",
            wrongAnswers: ["Christopher Columbus", "Vasco da Gama", "James Cook"],
            explanation: "Magellan began the first circumnavigation in 1519, though he died in the Philippines before completing the journey."
        }
    ];

    // Transform questions to match schema
    const questionsToInsert = sampleQuestions.map((q, index) => {
        // Create options array
        const options = [q.correctAnswer, ...q.wrongAnswers];

        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        // Find correct answer index
        const correctIndex = options.indexOf(q.correctAnswer);

        // Calculate order (simple approximation based on index in this array,
        // ideally should be per quiz but this seed file is ordered by quiz)
        // We can just use the loop index + 1 as a unique order if global, or calculate per quiz.
        // Let's just use index for now, assuming frontend sorts by this field.

        return {
            quizId: q.quizId,
            question: q.question,
            options: options,
            correctAnswer: correctIndex,
            explanation: q.explanation,
            order: index + 1
        };
    });

    await db.insert(quizQuestions).values(questionsToInsert);
    
    console.log('✅ Quiz questions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});