import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function generateAdvisorResponse(message, contextData = {}) {
  if (!genAI) {
    return 'عذراً، مفتاح API غير متوفر. الرجاء التأكد من إعداد ملف .env بشكل صحيح.'
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings })
    
    const { profile = {}, tasks = [], events = [] } = contextData
    const activeTasks = tasks.filter(t => !t.completed).map(t => `- ${t.title} (${t.type})`).join('\n')
    const completedTasks = tasks.filter(t => t.completed).map(t => `- ${t.title} (${t.type})`).join('\n')
    const upcomingEvents = events.map(e => `- ${e.title} on ${e.date} at ${e.time}`).join('\n')
    
    const prompt = `You are a highly intelligent, conversational, and observant AI Advisor in an app named Rakeeza (ركيزة).
IMPORTANT: Whenever you mention the app name in Arabic, ALWAYS spell it "ركيزة" (with a kaf), NEVER "رقيزة".

Your goal is to be the ultimate personal assistant and mentor. You have absolute freedom to answer ANY question the user asks, whether it's about productivity, tech, science, general chatting, life, or personal advice.
Do not limit your responses. Be knowledgeable, friendly, and engaging.

CRITICAL DIRECTIVE: Deeply analyze the user's data below (Name, Title, Bio, Skills, Tasks). Understand their personality, interests, and current life goals based on what they are working on. 
Whenever you answer their questions, try to weave in personalized advice. Connect their questions to their existing skills and tasks. Make them feel like you truly know them and are invested in their success.

Here is the current context about the user:
Name: ${profile.name || 'User'}
Title: ${profile.title || 'Professional'}
Bio: ${profile.bio || 'None'}
Skills: ${profile.skills ? profile.skills.join(', ') : 'None'}

Active Tasks (What they are currently focused on):
${activeTasks || 'No active tasks.'}

Completed Tasks (What they have achieved):
${completedTasks || 'No completed tasks yet.'}

Upcoming Events:
${upcomingEvents || 'No upcoming events.'}

Use this rich context to study their character, analyze their goals, and provide highly personalized, insightful, and accurate advice. Always respond in the same language the user used.

User's message: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("AI Advisor Error:", error)
    return 'عذراً، واجهت مشكلة في التفكير. يرجى المحاولة مرة أخرى لاحقاً.'
  }
}

export async function generateProfessionalResume(description, contextData = {}) {
  if (!genAI) {
    return 'عذراً، مفتاح API غير متوفر. الرجاء التأكد من إعداد ملف .env بشكل صحيح.'
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings })
    
    const { profile = {}, tasks = [], events = [] } = contextData
    const activeTasks = tasks.filter(t => !t.completed).map(t => `- ${t.title} (${t.type})`).join('\n')
    const completedTasks = tasks.filter(t => t.completed).map(t => `- ${t.title} (${t.type})`).join('\n')
    const upcomingEvents = events.map(e => `- ${e.title} on ${e.date}`).join('\n')
    
    const prompt = `You are an expert career coach and resume writer. 
The user is requesting a professional resume for the following role/description: "${description}".

Here is all the data gathered from the user's Rakeeza productivity app profile:
Name: ${profile.name || 'User'}
Current Title: ${profile.title || 'Professional'}
Bio: ${profile.bio || 'None'}
Skills: ${profile.skills ? profile.skills.join(', ') : 'None'}

Projects:
${profile.projects && profile.projects.length > 0 ? profile.projects.map(p => `- ${p.name} (${p.techStack}): ${p.description}`).join('\n') : 'No projects listed.'}

Recent Active Tasks:
${activeTasks || 'No active tasks.'}

Completed Work:
${completedTasks || 'No completed tasks.'}

Upcoming Events:
${upcomingEvents || 'No upcoming events.'}

Based ONLY on this real context (do not invent experiences), generate a highly professional, well-formatted resume in Markdown. 
IMPORTANT: Write the resume in the same language that the user used in their description. If they used Arabic, write the resume in Arabic. If English, write it in English.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("AI Resume Error:", error)
    return 'حدث خطأ أثناء توليد السيرة الذاتية. الرجاء المحاولة مرة أخرى.'
  }
}

export async function generateHTMLPortfolio(description, contextData = {}) {
  if (!genAI) {
    return 'عذراً، مفتاح API غير متوفر. الرجاء التأكد من إعداد ملف .env بشكل صحيح.'
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings })
    
    const { profile = {} } = contextData
    
    const prompt = `You are an expert web developer and UI/UX designer.
The user wants a standalone, single-file HTML portfolio page based on their profile data.
They have requested the following style/description: "${description}"

Here is the data to include:
Name: ${profile.name || 'User'}
Title: ${profile.title || 'Professional'}
Bio: ${profile.bio || 'None'}
Skills: ${profile.skills ? profile.skills.join(', ') : 'None'}
Projects:
${profile.projects && profile.projects.length > 0 ? profile.projects.map(p => `- ${p.name} (${p.techStack}): ${p.description}`).join('\n') : 'No projects listed.'}
Social Links:
GitHub: ${profile.socialLinks?.github || '#'}
LinkedIn: ${profile.socialLinks?.linkedin || '#'}
Email: ${profile.socialLinks?.email || '#'}
Avatar URL: ${profile.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=default&backgroundColor=b6e3f4'}

Requirements:
- Generate a SINGLE standalone HTML file containing all CSS and JS (if any) inline or within the <style> and <script> tags.
- Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) or write beautiful custom CSS.
- Ensure the design matches the user's requested style/description.
- The output MUST BE ONLY valid HTML code. Do NOT wrap it in markdown code blocks (\`\`\`html). Start immediately with <!DOCTYPE html> and end with </html>.
- Make it fully responsive, accessible, and visually stunning.
- Include smooth scrolling and hover effects.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Clean up markdown code blocks if the AI accidentally includes them
    if (text.startsWith('```html')) {
      text = text.replace(/^```html\n?/, '').replace(/\n?```$/, '')
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n?/, '').replace(/\n?```$/, '')
    }
    
    return text.trim()
  } catch (error) {
    console.error("AI Portfolio Error:", error)
    return '<div style="color: red; padding: 20px; text-align: center; font-family: sans-serif;">حدث خطأ أثناء إنشاء الصفحة. الرجاء المحاولة مرة أخرى.</div>'
  }
}

