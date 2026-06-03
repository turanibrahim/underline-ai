import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGeminiStore = defineStore('gemini', () => {
    const apiKey = ref<string>('');
    const setApiKey = (key: string) => {
        apiKey.value = key;
    }
    
    return {
        apiKey,
        setApiKey
    }
});
