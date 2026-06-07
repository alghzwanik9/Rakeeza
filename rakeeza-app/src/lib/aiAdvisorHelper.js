import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function generateAdvisorResponse(message, contextData = {}) {
  if (!genAI) {
    return 'عذراً، مفتاح API غير متوفر. الرجاء التأكد من إعداد ملف .env بشكل صحيح.'
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const { profile = {}, tasks = [], events = [] } = contextData
    const activeTasks = tasks.filter(t => !t.completed).map(t => `- ${t.title} (${t.type})`).join('\n')
    const completedTasks = tasks.filter(t => t.completed).map(t => `- ${t.title} (${t.type})`).join('\n')
    const upcomingEvents = events.map(e => `- ${e.title} on ${e.date} at ${e.time}`).join('\n')
    
    const prompt = `You are a Smart Advisor in a productivity and career app named Rakeeza. 
Your goal is to help the user with task planning, AI/tech projects, career advice, and general productivity.
Always be concise, professional, encouraging, and respond in the same language the user used. Keep it under 3-4 sentences if possible.

Here is the current context about the user:
Name: ${profile.name || 'User'}
Title: ${profile.title || 'Professional'}
Bio: ${profile.bio || 'None'}
Skills: ${profile.skills ? profile.skills.join(', ') : 'None'}

Active Tasks:
${activeTasks || 'No active tasks.'}

Completed Tasks:
${completedTasks || 'No completed tasks yet.'}

Upcoming Events:
${upcomingEvents || 'No upcoming events.'}

Use this context to give highly personalized, accurate advice when relevant.

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
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
