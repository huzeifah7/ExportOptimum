
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe } from 'lucide-react';

const MissionSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} className="py-28 lg:py-36 relative bg-primary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={isInView ? { opacity: 1 } : {}} 
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-12"
                >
                    <span className="w-8 h-px bg-primary" />
                    <span className="text-lg font-bold uppercase tracking-[0.2em] text-primary inline-flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Our Mission</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
                        <h2 className="text-4xl md:text-6xl font-black leading-[1] tracking-tight text-foreground mb-4">
                            We Grow with
                            <br />
                            <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%), hsl(88,92%,30%))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Purpose</span>
                        </h2>
                         <p className="text-xl text-muted-foreground leading-relaxed">And we bring our partners with us</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                            <p>As Export Optimum continues to expand, our mission is clear: to create lasting value across the agribusiness chain while strengthening Morocco's position as a global benchmark for quality fresh produce.</p>
                            <p>We believe responsibility isn't a limitation; it's a <span className="text-primary font-semibold">competitive advantage</span>. We are responsible for supporting Moroccan growers and social standards.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
