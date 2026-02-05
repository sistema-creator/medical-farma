'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SUGGESTED_QUESTIONS } from '@/lib/gemini'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [conversationId, setConversationId] = useState<string>('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || input

        if (!textToSend.trim() || isLoading) return

        const userMessage: Message = {
            role: 'user',
            content: textToSend,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            // Usamos la versión cliente para soportar hosting estático (Ferozo/cPanel)
            // Esto evita el error 404 en /api/ai/chat
            const { generateResponseClient } = await import('@/lib/gemini')
            const { obtenerProductos } = await import('@/lib/productos')

            // Obtener contexto fresco (productos)
            // Nota: En producción real, esto debería estar optimizado o cacheado
            const prodRes = await obtenerProductos()
            const productos = prodRes.success ? prodRes.data : []

            const responseText = await generateResponseClient(textToSend, productos)

            const assistantMessage: Message = {
                role: 'assistant',
                content: responseText,
                timestamp: new Date().toISOString()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('❌ Error completo:', error)
            console.error('❌ Tipo de error:', typeof error)
            console.error('❌ Mensaje:', error instanceof Error ? error.message : 'Error desconocido')

            const errorMessage: Message = {
                role: 'assistant',
                content: '❌ Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
                timestamp: new Date().toISOString()
            }

            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewConversation = () => {
        setMessages([])
        setConversationId('')
    }

    const handleSuggestionClick = (question: string) => {
        handleSendMessage(question)
    }

    return (
        <>
            {/* Botón flotante */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </motion.button>

            {/* Modal de Chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    🤖
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Asistente IA</h3>
                                    <p className="text-xs text-white/80">MEDICAL FARMA</p>
                                </div>
                            </div>
                            <button
                                onClick={handleNewConversation}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                title="Nueva conversación"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                            {messages.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">👋</div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                        ¡Hola! Soy tu asistente de MEDICAL FARMA
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                        Puedo ayudarte con información de productos, precios, stock y clientes
                                    </p>

                                    {/* Sugerencias */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-3">
                                            Preguntas sugeridas:
                                        </p>
                                        {SUGGESTED_QUESTIONS.slice(0, 4).map((question, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestionClick(question)}
                                                className="w-full text-left text-sm bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                            >
                                                💡 {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                        <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {new Date(message.timestamp).toLocaleTimeString('es-AR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-600">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSendMessage()
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe tu consulta..."
                                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Enviar mensaje"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
