/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stars, Gift, Music, Sparkles, ChevronRight, ChevronLeft, Quote, Camera, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

const compliments = [
  "Ton sourire illumine mes journées.",
  "Tu es la personne la plus douce que je connaisse.",
  "Chaque moment avec toi est un cadeau.",
  "Ton intelligence et ta grâce me fascinent.",
  "Tu es mon plus beau poème.",
  "Le monde est plus beau parce que tu y es.",
  "Ta gentillesse n'a pas de limite.",
  "Je t'aime plus que les mots ne peuvent le dire."
];

export default function App() {
  const [step, setStep] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [activeCompliment, setActiveCompliment] = useState(0);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [clickHearts, setClickHearts] = useState<{id: number, x: number, y: number}[]>([]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't spawn hearts if clicking on a button or interactive element
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.cursor-pointer')) {
      return;
    }

    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = (e as React.MouseEvent).clientX;
      y = (e as React.MouseEvent).clientY;
    }

    const newHeart = { id: Date.now(), x, y };
    setClickHearts(prev => [...prev, newHeart]);
    
    setTimeout(() => {
      setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1500);
  };

  useEffect(() => {
    if (step === 1) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [step]);

  const nextCompliment = () => {
    setActiveCompliment((prev) => (prev + 1) % compliments.length);
  };

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden flex flex-col items-center py-12 px-4"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <div className="atmosphere" />
      
      {/* Interactive Click Hearts */}
      <AnimatePresence>
        {clickHearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.5, x: heart.x - 12, y: heart.y - 12 }}
            animate={{ opacity: 0, scale: 1.5, y: heart.y - 100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed pointer-events-none z-50 text-romantic-pink"
          >
            <Heart className="w-6 h-6 fill-romantic-pink" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8 inline-block"
              >
                <Heart className="w-20 h-20 text-romantic-pink fill-romantic-pink" />
              </motion.div>
              <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight">
                Pour <span className="italic text-gradient">Ladouce</span>
              </h1>
              <p className="font-elegant text-xl md:text-2xl text-white/70 mb-10 max-w-md mx-auto leading-relaxed">
                Un petit voyage magique préparé juste pour toi, en ce jour si spécial.
              </p>

              {selectedGift && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-10 p-6 glass-card border-romantic-pink/50 inline-block"
                >
                  <p className="text-romantic-pink font-serif text-xl mb-2">Ton choix de cadeau :</p>
                  <p className="text-2xl font-bold text-white">{selectedGift}</p>
                  <p className="text-sm text-white/70 mt-2">Excellent choix mon amour ! ❤️</p>
                </motion.div>
              )}

              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-white text-black rounded-full font-semibold flex items-center gap-2 hover:bg-romantic-pink hover:text-white transition-all duration-300 group"
              >
                Commencer le voyage
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl z-10 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-center mb-12"
              >
                <h2 className="font-serif text-6xl md:text-8xl mb-4 text-gradient leading-tight">
                  Joyeux Anniversaire !
                </h2>
                <div className="flex justify-center gap-4 text-gold">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                  <Stars className="w-8 h-8 animate-pulse delay-75" />
                  <Sparkles className="w-8 h-8 animate-pulse delay-150" />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Compliment Card */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="glass-card p-8 flex flex-col justify-between min-h-[300px]"
                >
                  <div>
                    <Quote className="w-10 h-10 text-romantic-pink mb-6 opacity-50" />
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeCompliment}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="font-elegant text-3xl italic leading-snug"
                      >
                        "{compliments[activeCompliment]}"
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={nextCompliment}
                    className="mt-8 text-sm uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    Une autre pensée <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* Interactive Gift */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="glass-card p-8 flex flex-col items-center justify-center text-center group cursor-pointer"
                  onClick={() => setShowMessage(!showMessage)}
                >
                  <motion.div
                    animate={showMessage ? { rotate: [0, -10, 10, 0] } : { y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Gift className={`w-24 h-24 ${showMessage ? 'text-gold' : 'text-romantic-pink'} transition-colors`} />
                  </motion.div>
                  <h3 className="font-serif text-2xl mt-6 mb-2">Ton Message Secret</h3>
                  <p className="text-sm text-white/40 uppercase tracking-tighter">Clique pour ouvrir</p>
                  
                  <AnimatePresence>
                    {showMessage && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-6 font-body text-lg text-white/80 leading-relaxed">
                          Ladouce, tu es l'étoile qui guide mes nuits et le soleil qui réchauffe mes jours. 
                          Que cette nouvelle année t'apporte autant de bonheur que tu m'en donnes chaque seconde. 
                          Je t'aime infiniment. ❤️
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-romantic-pink/20 border border-romantic-pink/50 text-white rounded-full font-semibold flex items-center gap-3 hover:bg-romantic-pink hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,133,162,0.3)] hover:shadow-[0_0_30px_rgba(255,133,162,0.6)]"
                >
                  <Gift className="w-5 h-5" />
                  Ton Cadeau
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-full font-semibold flex items-center gap-3 hover:bg-white/20 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  Lettre d'amour
                </button>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => setStep(0)}
                className="mt-8 text-white/30 hover:text-white/60 text-sm uppercase tracking-widest transition-colors"
              >
                Revoir le début
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="gifts"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-4xl z-10 flex flex-col items-center"
            >
              <h2 className="font-serif text-4xl md:text-6xl mb-4 text-gradient text-center">
                Choisis ton cadeau
              </h2>
              <p className="text-white/80 mb-12 text-center text-lg max-w-2xl">
                Parce que tu mérites ce qu'il y a de mieux, choisis la paire qui te fait le plus rêver...
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Option 1: Kyrie 7 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-romantic-pink transition-all duration-300 group"
                  onClick={() => {
                    setSelectedGift("je ne sais pas (surppred moi!!!!!)");
                    setStep(0);
                  }}
                >
                  <div className="w-full h-64 rounded-xl overflow-hidden mb-6 relative bg-white/5 flex items-center justify-center">
                    <img 
                      src="https://www.basketusa.com/wp-content/uploads/2021/08/Nike-Kyrie-7-1.jpeg" 
                      alt="Kyrie 7 Violette" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">je ne sais pas</h3>
                  <p className="text-romantic-pink mb-6">surppred moi!!!!!</p>
                  <button className="px-6 py-3 bg-white/10 rounded-full text-white group-hover:bg-romantic-pink transition-colors w-full font-semibold">
                    Je veux celle-ci !
                  </button>
                </motion.div>

                {/* Option 2: Jordan 4 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-romantic-pink transition-all duration-300 group"
                  onClick={() => {
                    setSelectedGift("Jordan 4 (Rose et Blanche)");
                    setStep(0);
                  }}
                >
                  <div className="w-full h-64 rounded-xl overflow-hidden mb-6 relative bg-white/5 flex items-center justify-center">
                    <img 
                      src="https://sneakerfortress.com/wp-content/uploads/2024/02/Air-Jordan-4-Orchid-Sneakers-1.jpg" 
                      alt="Jordan 4 Rose et Blanche" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Jordan 4</h3>
                  <p className="text-romantic-pink mb-6">Couleur Rose et Blanche</p>
                  <button className="px-6 py-3 bg-white/10 rounded-full text-white group-hover:bg-romantic-pink transition-colors w-full font-semibold">
                    Je veux celle-ci !
                  </button>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setStep(1)}
                className="mt-12 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
              >
                Retour aux surprises
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              className="w-full max-w-2xl z-10 flex flex-col items-center"
            >
              <div className="glass-card p-8 md:p-14 relative w-full bg-white/5 border-white/20 shadow-2xl">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-romantic-pink p-4 rounded-full shadow-[0_0_20px_rgba(255,133,162,0.5)]">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center mt-4 text-romantic-pink">
                  Ma douce Ladouce,
                </h2>
                
                <div className="font-handwriting text-2xl md:text-4xl leading-relaxed text-white/90 space-y-6">
                  <p>
                    Aujourd'hui est un jour exceptionnel, car c'est celui où le monde a eu la chance de t'accueillir.
                  </p>
                  <p>
                    Chaque instant passé à tes côtés est une aventure merveilleuse. Ton sourire est ma lumière, et ta présence est mon plus grand réconfort.
                  </p>
                  <p>
                    Je te souhaite un anniversaire aussi magnifique et unique que toi. Que tous tes rêves se réalisent, et que je puisse être là pour les voir s'accomplir à tes côtés.
                  </p>
                  <p className="text-right mt-12 text-romantic-pink">
                    Avec tout mon amour,<br/>
                    Ton chéri ❤️
                  </p>
                </div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setStep(1)}
                className="mt-12 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
              >
                Retour aux surprises
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Hearts Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-romantic-pink/10"
            initial={{ 
              x: Math.random() * 100 + 'vw', 
              y: '110vh',
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: '-10vh',
              rotate: Math.random() * 360 + 360
            }}
            transition={{ 
              duration: Math.random() * 10 + 15, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 20
            }}
          >
            <Heart size={Math.random() * 40 + 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
