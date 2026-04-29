import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AIService {
    constructor() {
        this.genAI = null;
        this.model = null;
        this.promptTemplate = null;
    }

    async init() {
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY environment variable is not set.");
            throw new Error("GEMINI_API_KEY environment variable is not set.");
        }
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using 'gemini-flash-latest' which is available
        this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        try {
            //prompt in the same directory as this file
            const promptPath = path.join(__dirname, "execution_strategist_prompt.md");
            
            try {
                this.promptTemplate = await fs.readFile(promptPath, "utf-8");
                console.log(`AI Strategy prompt loaded from: ${promptPath}`);
            } catch (readError) {
                console.error(`Failed to load prompt from ${promptPath}, trying backup...`);
                // Fallback to project root if needed (adjusting for common project structures)
                const backupPath = path.join(process.cwd(), "src", "features", "ai", "execution_strategist_prompt.md");
                this.promptTemplate = await fs.readFile(backupPath, "utf-8");
                console.log(`AI Strategy prompt loaded from backup: ${backupPath}`);
            }

            if (!this.promptTemplate) {
                throw new Error("Execution strategist prompt file not found.");
            }
        } catch (error) {
            console.error("AI Initialization Error:", error.message);
            throw new Error(`AI initialization failed: ${error.message}`);
        }
    }

    async generateStrategy(task) {
        if (!this.model) {
            await this.init();
        }

        const taskContext = `
Here is the task you need to analyze and strategize:

### TASK DETAILS
- **Title:** ${task.title}
- **Description:** ${task.description || "No description provided"}
- **Priority:** ${task.priority || "Medium"}
- **Status:** ${task.status || "Pending"}
- **Tags:** ${task.tags && task.tags.length ? task.tags.join(', ') : "None"}

Please provide an optimized execution plan following your strict guidelines.
`;

        const fullPrompt = `${this.promptTemplate}\n\n${taskContext}`;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Generation Error:", error.message);
            
            // Handle Quota Exceeded (429) specifically
            if (error.status === 429) {
                throw new Error("AI Quota Exceeded: You have reached the limit for free tier requests. Please wait a few minutes or upgrade your plan in Google AI Studio.");
            }

            // Try fallback if primary model fails with 404
            if (error.status === 404) {
                try {
                    console.log("Model not found, attempting fallback with gemini-2.5-flash...");
                    const fallbackModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                    const result = await fallbackModel.generateContent(fullPrompt);
                    const response = await result.response;
                    return response.text();
                } catch (fallbackError) {
                    console.error("Gemini Fallback Error:", fallbackError.message);
                    if (fallbackError.status === 429) {
                         throw new Error("AI Quota Exceeded: Fallback model also reached its limit.");
                    }
                }
            }

            
            throw new Error(`AI Strategy Generation failed: ${error.message}. Ensure your API key is correct and Gemini API is enabled in Google Cloud Console.`);
        }
    }


}

export const aiService = new AIService();
