import { Metadata } from "next";
import { AiGeneratorForm } from "./AiGeneratorForm";

export const metadata: Metadata = {
  title: "AI Quiz Generator • Study Boi",
  description: "Generate NCERT/CBSE-aligned quizzes with AI based on your grade and topic.",
};

/**
 * The page for the AI quiz generator.
 * It displays the `AiGeneratorForm` component.
 */
export default function AiQuizGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-b from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-xl">
            AI Quiz Generator
          </h1>
          <p className="mt-3 text-sm sm:text-base text-purple-200/80">
            Create NCERT/CBSE-aligned quizzes tailored to your grade level.
          </p>
        </div>
        <AiGeneratorForm />
      </div>
    </div>
  );
}
