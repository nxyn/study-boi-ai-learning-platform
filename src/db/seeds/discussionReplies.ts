import { db } from '@/db';
import { discussionReplies } from '@/db/schema';

async function main() {
    const sampleReplies = [
        // Discussion 1 - Quadratic Formula Replies
        {
            discussionId: 1,
            content: 'Great question! For quadratic equations ax² + bx + c = 0, the formula is x = (-b ± √(b²-4ac)) / 2a. Let me break it down step by step: 1) Identify a, b, and c coefficients 2) Calculate the discriminant (b²-4ac) 3) Apply the formula. For your example 2x² + 5x - 3 = 0: a=2, b=5, c=-3. Discriminant = 25 - 4(2)(-3) = 25 + 24 = 49. So x = (-5 ± 7) / 4, giving us x = 0.5 or x = -3.',
            createdBy: 'user_02h4kxt2e8z9y3b1n7m6q5w8r4',
            likes: 6,
            createdAt: '2024-02-16T10:30:00Z'
        },
        {
            discussionId: 1,
            content: 'I always struggled with this too! A tip that helped me: remember that the discriminant tells you about the solutions. If b²-4ac > 0, you have 2 real solutions. If it equals 0, you have 1 solution. If it\'s negative, you have complex solutions. Also, Khan Academy has excellent videos on this topic!',
            createdBy: 'user_03h4kxt2e8z9y3b1n7m6q5w8r5',
            likes: 4,
            createdAt: '2024-02-16T14:20:00Z'
        },
        {
            discussionId: 1,
            content: 'Don\'t forget you can also complete the square or factor if possible! Sometimes those methods are faster than the quadratic formula. For simple cases like x² - 5x + 6 = 0, factoring to (x-2)(x-3) = 0 is much quicker.',
            createdBy: 'user_04h4kxt2e8z9y3b1n7m6q5w8r6',
            likes: 3,
            createdAt: '2024-02-16T16:45:00Z'
        },

        // Discussion 2 - Photosynthesis Replies
        {
            discussionId: 2,
            content: 'The balanced equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This happens in two main stages: Light reactions (in thylakoids) capture energy and produce ATP/NADPH, then the Calvin cycle (in stroma) uses that energy to make glucose from CO₂. Remember: chloroplasts are the powerhouses of plant cells!',
            createdBy: 'user_05h4kxt2e8z9y3b1n7m6q5w8r7',
            likes: 5,
            createdAt: '2024-02-17T09:15:00Z'
        },
        {
            discussionId: 2,
            content: 'What really helped me understand this was thinking about it as an energy transformation: light energy → chemical energy (glucose). Plants are basically solar panels! The oxygen we breathe is actually a waste product from this process. Crazy to think about, right?',
            createdBy: 'user_06h4kxt2e8z9y3b1n7m6q5w8r8',
            likes: 2,
            createdAt: '2024-02-17T11:30:00Z'
        },

        // Discussion 3 - Shakespeare Essay Replies
        {
            discussionId: 3,
            content: 'For Hamlet essays, focus on the themes of revenge, madness, and appearance vs reality. Start with a strong thesis - for example: "Through Hamlet\'s feigned madness and quest for revenge, Shakespeare explores how the pursuit of justice can corrupt even the noblest intentions." Use specific quotes and analyze Shakespeare\'s language choices. The "To be or not to be" soliloquy is perfect for discussing internal conflict.',
            createdBy: 'user_07h4kxt2e8z9y3b1n7m6q5w8r9',
            likes: 7,
            createdAt: '2024-02-18T13:45:00Z'
        },
        {
            discussionId: 3,
            content: 'Don\'t forget about the play-within-a-play scene! It\'s brilliant for showing how Hamlet tests reality vs appearance. Also, compare Hamlet\'s hesitation with Fortinbras\' decisive action - Shakespeare uses foils effectively. SparkNotes is helpful for plot summary, but make sure to develop your own analysis.',
            createdBy: 'user_08h4kxt2e8z9y3b1n7m6q5w8ra',
            likes: 4,
            createdAt: '2024-02-18T15:20:00Z'
        },
        {
            discussionId: 3,
            content: 'My English teacher always says to analyze HOW Shakespeare creates meaning, not just WHAT happens. Look at his use of imagery - disease imagery throughout the play reflects the "rottenness" in Denmark. Metaphors and symbolism are your best friends in literary analysis!',
            createdBy: 'user_09h4kxt2e8z9y3b1n7m6q5w8rb',
            likes: 3,
            createdAt: '2024-02-18T17:10:00Z'
        },

        // Discussion 4 - World War I Replies
        {
            discussionId: 4,
            content: 'Remember MAIN: Militarism, Alliances, Imperialism, Nationalism. The alliance system turned a regional conflict into a world war. When Austria-Hungary declared war on Serbia, Russia mobilized to help Serbia, Germany declared war on Russia, France was pulled in due to their alliance with Russia, and Britain joined when Germany invaded Belgium.',
            createdBy: 'user_10h4kxt2e8z9y3b1n7m6q5w8rc',
            likes: 8,
            createdAt: '2024-02-19T10:00:00Z'
        },
        {
            discussionId: 4,
            content: 'The assassination of Archduke Franz Ferdinand was just the spark - tensions had been building for years. Don\'t forget about the naval arms race between Britain and Germany, and the competition for colonies in Africa. These created an environment where war was almost inevitable.',
            createdBy: 'user_11h4kxt2e8z9y3b1n7m6q5w8rd',
            likes: 5,
            createdAt: '2024-02-19T14:30:00Z'
        },

        // Discussion 5 - Calculus Limits Replies
        {
            discussionId: 5,
            content: 'For limits approaching infinity, look at the highest power terms in numerator and denominator. If degrees are equal, the limit is the ratio of leading coefficients. If numerator degree > denominator degree, limit is ±∞. If denominator degree > numerator degree, limit is 0. For your example lim(x→∞) (3x²+2x)/(x²+1) = 3/1 = 3.',
            createdBy: 'user_12h4kxt2e8z9y3b1n7m6q5w8re',
            likes: 6,
            createdAt: '2024-02-20T11:15:00Z'
        },
        {
            discussionId: 5,
            content: 'L\'Hôpital\'s rule is super helpful for indeterminate forms like 0/0 or ∞/∞! Just take derivatives of numerator and denominator separately. Also, try substitution for limits at finite values - sometimes direct substitution works, sometimes you need to factor or rationalize first.',
            createdBy: 'user_13h4kxt2e8z9y3b1n7m6q5w8rf',
            likes: 4,
            createdAt: '2024-02-20T16:45:00Z'
        },
        {
            discussionId: 5,
            content: 'Professor Leonard on YouTube has amazing calculus videos that really helped me understand limits conceptually. Practice with graphing calculator too - seeing the behavior visually makes it click!',
            createdBy: 'user_14h4kxt2e8z9y3b1n7m6q5w8rg',
            likes: 2,
            createdAt: '2024-02-20T19:00:00Z'
        },

        // Discussion 6 - Chemistry Stoichiometry Replies
        {
            discussionId: 6,
            content: 'Stoichiometry is all about mole ratios from balanced equations! Steps: 1) Balance the equation 2) Convert given quantity to moles 3) Use mole ratio to find moles of desired substance 4) Convert to requested units. For 2H₂ + O₂ → 2H₂O, if you have 4 moles H₂, you need 2 moles O₂ and produce 4 moles H₂O. The coefficients tell you the ratios!',
            createdBy: 'user_15h4kxt2e8z9y3b1n7m6q5w8rh',
            likes: 7,
            createdAt: '2024-02-21T08:30:00Z'
        },
        {
            discussionId: 6,
            content: 'Always identify your limiting reagent! It determines how much product you can actually make. Calculate moles of each reactant, use stoichiometry to see which runs out first. That\'s your limiting reagent. The other is in excess.',
            createdBy: 'user_16h4kxt2e8z9y3b1n7m6q5w8ri',
            likes: 5,
            createdAt: '2024-02-21T12:15:00Z'
        },

        // Discussion 7 - Physics Motion Replies
        {
            discussionId: 7,
            content: 'For projectile motion, break it into x and y components! x-direction: vₓ = v₀cos(θ), x = v₀cos(θ)t (constant velocity). y-direction: vᵧ = v₀sin(θ) - gt, y = v₀sin(θ)t - ½gt² (constant acceleration due to gravity). Maximum height occurs when vᵧ = 0. Range formula: R = v₀²sin(2θ)/g.',
            createdBy: 'user_17h4kxt2e8z9y3b1n7m6q5w8rj',
            likes: 8,
            createdAt: '2024-02-22T09:45:00Z'
        },
        {
            discussionId: 7,
            content: 'Remember that horizontal and vertical motions are independent! Air resistance is usually ignored in basic problems. The time to reach maximum height equals the time to fall back down (symmetry). 45° gives maximum range for projectiles launched and landing at same height.',
            createdBy: 'user_18h4kxt2e8z9y3b1n7m6q5w8rk',
            likes: 4,
            createdAt: '2024-02-22T13:20:00Z'
        },
        {
            discussionId: 7,
            content: 'Draw diagrams! Seriously, it helps so much to visualize the parabolic path and label all your known/unknown variables. I use different colors for x and y components.',
            createdBy: 'user_19h4kxt2e8z9y3b1n7m6q5w8rl',
            likes: 2,
            createdAt: '2024-02-22T15:30:00Z'
        },

        // Discussion 8 - Spanish Grammar Replies
        {
            discussionId: 8,
            content: 'Ser vs Estar: SER for permanent/inherent characteristics (Soy estudiante, Es inteligente, Son las tres) and ESTAR for temporary states/locations (Estoy cansado, Está en casa, Estamos estudiando). Remember DOCTOR for ser: Description, Occupation, Characteristic, Time, Origin, Relationship. PLACE for estar: Position, Location, Action, Condition, Emotion.',
            createdBy: 'user_20h4kxt2e8z9y3b1n7m6q5w8rm',
            likes: 6,
            createdAt: '2024-02-23T10:30:00Z'
        },
        {
            discussionId: 8,
            content: 'Practice with personality vs mood: "Él es feliz" (He\'s a happy person) vs "Él está feliz" (He\'s feeling happy right now). Also, ser with events: "La fiesta es mañana" but estar for location: "La fiesta está en mi casa".',
            createdBy: 'user_21h4kxt2e8z9y3b1n7m6q5w8rn',
            likes: 3,
            createdAt: '2024-02-23T14:15:00Z'
        },

        // Discussion 9 - Economics Supply/Demand Replies
        {
            discussionId: 9,
            content: 'Law of Demand: As price increases, quantity demanded decreases (negative relationship). Law of Supply: As price increases, quantity supplied increases (positive relationship). Market equilibrium occurs where supply and demand curves intersect - that\'s where quantity supplied equals quantity demanded and the market "clears".',
            createdBy: 'user_22h4kxt2e8z9y3b1n7m6q5w8ro',
            likes: 7,
            createdAt: '2024-02-24T11:00:00Z'
        },
        {
            discussionId: 9,
            content: 'Shifts vs movements along curves: Price changes cause movements along the curve. Other factors (income, preferences, number of buyers/sellers, expectations, related goods prices) cause the entire curve to shift. Increase in demand shifts curve right, decrease shifts left.',
            createdBy: 'user_23h4kxt2e8z9y3b1n7m6q5w8rp',
            likes: 5,
            createdAt: '2024-02-24T15:45:00Z'
        },
        {
            discussionId: 9,
            content: 'Real world example: When gas prices rise, people drive less and demand more fuel-efficient cars. The demand curve for gas shifts left, while demand for hybrids shifts right!',
            createdBy: 'user_24h4kxt2e8z9y3b1n7m6q5w8rq',
            likes: 2,
            createdAt: '2024-02-24T17:20:00Z'
        },

        // Discussion 10 - Computer Science Algorithms Replies
        {
            discussionId: 10,
            content: 'Big O notation describes worst-case time complexity. O(1) = constant, O(log n) = logarithmic, O(n) = linear, O(n²) = quadratic, O(2ⁿ) = exponential. Binary search is O(log n) because you eliminate half the search space each step. Bubble sort is O(n²) because of nested loops. Understanding this helps you choose the right algorithm for your problem size!',
            createdBy: 'user_25h4kxt2e8z9y3b1n7m6q5w8rr',
            likes: 8,
            createdAt: '2024-02-25T12:30:00Z'
        },
        {
            discussionId: 10,
            content: 'For space complexity, think about extra memory used. Recursive algorithms often have O(n) space due to call stack. Some algorithms trade time for space - hash tables use O(n) space for O(1) average lookup time.',
            createdBy: 'user_26h4kxt2e8z9y3b1n7m6q5w8rs',
            likes: 4,
            createdAt: '2024-02-25T16:10:00Z'
        },

        // Discussion 11 - Geometry Proofs Replies
        {
            discussionId: 11,
            content: 'For triangle congruence proofs, remember SSS, SAS, ASA, AAS, and HL (for right triangles). Start by identifying what you\'re given and what you need to prove. Then work backwards - what would make those triangles congruent? Often you need to identify shared sides or vertical angles. Always state your reasoning clearly: "AB = AB by reflexive property" or "∠1 = ∠2 because they are vertical angles".',
            createdBy: 'user_27h4kxt2e8z9y3b1n7m6q5w8rt',
            likes: 6,
            createdAt: '2024-02-26T09:20:00Z'
        },
        {
            discussionId: 11,
            content: 'Draw auxiliary lines when needed! Sometimes adding a diagonal or perpendicular line creates the congruent triangles you need. Also, look for isosceles triangles - they give you free congruent angles and sides.',
            createdBy: 'user_28h4kxt2e8z9y3b1n7m6q5w8ru',
            likes: 3,
            createdAt: '2024-02-26T13:45:00Z'
        },
        {
            discussionId: 11,
            content: 'Practice identifying patterns! Parallel lines cut by transversals give you corresponding, alternate interior, and alternate exterior angles. These relationships are super useful in proofs.',
            createdBy: 'user_29h4kxt2e8z9y3b1n7m6q5w8rv',
            likes: 2,
            createdAt: '2024-02-26T16:30:00Z'
        },

        // Discussion 12 - Art History Replies
        {
            discussionId: 12,
            content: 'Renaissance art focused on humanism, realism, and classical ideals. Key techniques: linear perspective (Brunelleschi), sfumato (Leonardo\'s smoky shadows), contrapposto (natural poses), and chiaroscuro (dramatic light/dark contrast). Artists studied anatomy, mathematics, and nature. Think Michelangelo\'s David - perfect human form based on classical Greek ideals but with Renaissance individualism.',
            createdBy: 'user_30h4kxt2e8z9y3b1n7m6q5w8rw',
            likes: 7,
            createdAt: '2024-02-27T10:15:00Z'
        },
        {
            discussionId: 12,
            content: 'Compare to Medieval art which was more symbolic and religious-focused. Renaissance brought back interest in mythology, portraiture, and secular themes. Patronage system also changed - wealthy merchants and families (like the Medicis) commissioned art, not just the Church.',
            createdBy: 'user_31h4kxt2e8z9y3b1n7m6q5w8rx',
            likes: 4,
            createdAt: '2024-02-27T14:50:00Z'
        },
        {
            discussionId: 12,
            content: 'Don\'t forget about Northern Renaissance! Van Eyck\'s oil painting techniques, detailed realism in Flemish art. Different from Italian Renaissance but equally important. The printing press also spread artistic ideas faster across Europe.',
            createdBy: 'user_32h4kxt2e8z9y3b1n7m6q5w8ry',
            likes: 3,
            createdAt: '2024-02-27T17:25:00Z'
        }
    ];

    await db.insert(discussionReplies).values(sampleReplies);
    
    console.log('✅ Discussion replies seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});