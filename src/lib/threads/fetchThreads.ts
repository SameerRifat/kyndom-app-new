// fetchData.js

import supabase from 'utils/supabase/server';

export const fetchThreadsData = async (userId) => {
    try {
        const { data, error } = await supabase
            .schema('ai')
            .from('my_assistant')
            .select(`
                run_id,
                assistant_data,
                memory:memory->>chat_history
            `)
            .eq('user_id', `${userId}`)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data; // Return processed data if needed
    } catch (error) {
        throw error;
    }
};

interface Message {
    role: "user" | "assistant";
    content: string;
    metrics: {};
}

export const fetchChatHistory = async (userId, run_id) => {
    try {
        const { data, error } = await supabase
            .schema('ai')
            .from('my_assistant')
            .select(`
                memory:memory->>chat_history
            `)
            .eq('user_id', `${userId}`)
            .eq('run_id', `${run_id}`);
        if (error) {
            throw error;
        }

        // Process and parse the retrieved data as needed
        const chatHistoryJson = JSON.parse(data[0]?.memory || '[]'); // Parse memory data to JSON array

        // Map the JSON data to Message[] format
        const chatHistory: Message[] = chatHistoryJson.map(entry => ({
            role: entry.role,
            content: entry.content,
            metrics: entry.metrics || {},
        }));

        return chatHistory;
    } catch (error) {
        throw error;
    }
};

