'use client';

import { motion } from 'framer-motion';

const stats = [
  { id: 1, name: 'AI Projects', value: '25+' },
  { id: 2, name: 'Active Users', value: '1,000+' },
  { id: 3, name: 'Trusted Members', value: '150+' },
  { id: 4, name: 'Surveys Completed', value: '5,000+' },
];

export default function Stats() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
          <p className="mt-4 text-xl text-gray-600">
            Growing community of AI enthusiasts and professionals
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.p 
                className="text-4xl font-bold text-gray-900"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {stat.value}
              </motion.p>
              <p className="mt-2 text-lg font-medium text-gray-600">{stat.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}