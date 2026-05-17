import * as mockChat from "../hooks/mock-data/mock-chat";
import { Conversation } from "../types/chat.types";
import { ApiError } from "./auth.api";

const simulateLatency = () => new Promise((res) => setTimeout(res, 800))

export const getConversation = async (conversationId: string): Promise<Conversation> => {
    await simulateLatency(); 

    const conversations = mockChat.CONVERSATIONS; 
    const conversation = conversations.find(c => c.id === conversationId)

    if (!conversation) throw new ApiError(404, "No existe el contacto")
       
    return conversation
} 