import React from 'react'
import { motion } from 'framer-motion'
import { skills } from './skills_data'

function Skiils() {
    return (
        <section className="py-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-center">
            <motion.div
                className="max-w-5xl mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl font-bold mb-6">My Skills</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
                    {skills.map((skill: string) => (
                        <div
                            key={skill}
                            className="bg-base-100 text-primary-content p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <p className="text-xl font-semibold">{skill}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default Skiils