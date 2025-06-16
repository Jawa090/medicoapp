import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import MedicationCard from '@/components/medication/MedicationCard';
import { Plus, Calendar, Clock, MessageCircle, Activity, Heart, ChevronLeft, ChevronRight, Pill, BarChart2, User, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import CompactHealthTip from '@/components/health/CompactHealthTip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  // Mock data - would come from a backend in a real app
  const [medications, setMedications] = useState([{
    id: '1',
    name: 'Aspirin',
    dosage: '80mg - 1 tablet',
    time: '8:00 AM',
    color: 'blue' as const,
    taken: true
  }, {
    id: '2',
    name: 'Vitamin D',
    dosage: '1000 IU - 1 capsule',
    time: '9:00 AM',
    color: 'green' as const,
    taken: true
  }, {
    id: '3',
    name: 'Lisinopril',
    dosage: '10mg - 1 tablet',
    time: '1:00 PM',
    color: 'purple' as const,
    taken: false
  }, {
    id: '4',
    name: 'Metformin',
    dosage: '500mg - 1 tablet',
    time: '7:00 PM',
    color: 'peach' as const,
    taken: false
  }]);
  const [progress, setProgress] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(loadTimer);
  }, []);
  useEffect(() => {
    // Calculate progress
    const takenCount = medications.filter(med => med.taken).length;
    const progressValue = medications.length > 0 ? takenCount / medications.length * 100 : 0;

    // Animate progress from 0 to actual value
    let start = 0;
    const target = progressValue;
    const duration = 1500;
    const startTime = Date.now();
    const animateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProgress(start + progress * (target - start));
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    requestAnimationFrame(animateProgress);
  }, [medications]);
  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarOpen(false);
    }
  };
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  // Container animation variants
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Format the selected date
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const [stats] = useState({
    medicationAdherence: 92,
    waterIntake: 6,
    steps: 8240,
    sleepHours: 7.5
  });

  // Skeleton loader for content
  if (loading) {
    return <PageTransition className="app-container">
        <div className="mb-4">
          <Skeleton className="h-32 w-full" />
        </div>
        
        <div className="mb-5">
          <Skeleton className="h-16 w-full" />
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-3" />
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-14 w-10 flex-shrink-0" />)}
          </div>
        </div>
        
        <div>
          <Skeleton className="h-8 w-48 mb-3" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        </div>
      </PageTransition>;
  }
  return <PageTransition className="app-container">
      {/* Hero section with quick stats */}
      <motion.div className="mb-6" initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/5 via-primary/10 to-background">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-medium text-gray-600 dark:text-gray-400">
                  Health Overview
                </h2>
              </div>
              <motion.div 
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5 text-primary" />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-blue-500/20">
                    <Pill className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Adherence</span>
                </div>
                <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
                  {stats.medicationAdherence}%
                </p>
              </div>

              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-green-500/20">
                    <Activity className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Steps</span>
                </div>
                <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                  {stats.steps.toLocaleString()}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-purple-500/20">
                    <Clock className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Sleep</span>
                </div>
                <p className="text-2xl font-semibold text-purple-700 dark:text-purple-300">
                  {stats.sleepHours}h
                </p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-cyan-500/20">
                    <Heart className="h-4 w-4 text-cyan-500" />
                  </div>
                  <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Water</span>
                </div>
                <p className="text-2xl font-semibold text-cyan-700 dark:text-cyan-300">
                  {stats.waterIntake}L
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Enhanced Daily Health Tip */}
      <motion.div className="mb-6" initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.3,
      duration: 0.5
    }}>
        <CompactHealthTip />
      </motion.div>
      
      {/* Enhanced animated progress section */}
      <motion.div className="mb-6" initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.4,
      duration: 0.5
    }}>
        <Card className="overflow-hidden border border-primary/10 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-base font-medium">Daily Medications Progress</p>
              <span className="text-sm bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                {medications.filter(m => m.taken).length}/{medications.length} taken
              </span>
            </div>
            
            {/* Animated progress bar */}
            <motion.div initial={{
            opacity: 0,
            scaleX: 0
          }} animate={{
            opacity: 1,
            scaleX: 1
          }} transition={{
            delay: 0.5,
            duration: 0.5
          }}>
              <Progress value={progress} className="h-2.5" />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick action buttons with refined animations */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Link to="/add-medication">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-2">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Add Meds</span>
          </motion.div>
        </Link>
        
        <Link to="/reminders">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-full mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Reminders</span>
          </motion.div>
        </Link>
        
        <Link to="/chatbot">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/10 hover:shadow-md hover:shadow-green-500/5 transition-all duration-300"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-green-500/10 text-green-500 rounded-full mb-2">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Health AI</span>
          </motion.div>
        </Link>
        
        <Link to="/health-records">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-300"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-purple-500/10 text-purple-500 rounded-full mb-2">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Records</span>
          </motion.div>
        </Link>
      </div>

      {/* Calendar strip with elegant date navigation */}
      <motion.div className="mb-6" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.7,
      duration: 0.5
    }}>
        <Card className="overflow-hidden border border-primary/10 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-medium text-gray-900 dark:text-white">Schedule</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigateDate('prev')} 
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <motion.button 
                      className="text-sm bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {formatSelectedDate(selectedDate)}
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <CalendarComponent 
                      mode="single" 
                      selected={selectedDate} 
                      onSelect={handleDateSelect} 
                      initialFocus 
                      className="rounded-lg border-none shadow-none" 
                    />
                  </PopoverContent>
                </Popover>
                <button 
                  onClick={() => navigateDate('next')} 
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Refined day selection strip */}
            <motion.div 
              className="grid grid-cols-7 gap-2" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index - 3);
                const isToday = index === 3;
                const isSelected = date.toDateString() === selectedDate.toDateString();
                
                return (
                  <motion.button
                    key={index}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                      isSelected 
                        ? "bg-primary text-white shadow-md" 
                        : isToday 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    )}
                    onClick={() => setSelectedDate(new Date(date))}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xs opacity-80">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                    </span>
                    <span className={cn(
                      "text-lg font-medium mt-1",
                      isSelected 
                        ? "text-white" 
                        : isToday 
                          ? "text-primary"
                          : "text-gray-900 dark:text-gray-100"
                    )}>
                      {date.getDate()}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's medications with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mb-6"
      >
        <Card className="overflow-hidden border border-primary/10 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Pill className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-medium text-gray-900 dark:text-white">Today's Medications</h2>
              </div>
              
              <Link to="/add-medication">
                <motion.button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {!isSmallScreen && "Add New"}
                </motion.button>
              </Link>
            </div>
            
            <AnimatePresence>
              {medications.length > 0 ? (
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid gap-3"
                >
                  {medications.map(medication => (
                    <motion.div
                      key={medication.id}
                      variants={item}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                      layoutId={medication.id}
                      className={cn(
                        "p-3 rounded-xl border transition-all duration-200",
                        medication.taken
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-orange-500/5 border-orange-500/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "p-1.5 rounded-md",
                            medication.taken
                              ? "bg-green-500/10"
                              : "bg-orange-500/10"
                          )}>
                            <Pill className={cn(
                              "h-4 w-4",
                              medication.taken
                                ? "text-green-500"
                                : "text-orange-500"
                            )} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {medication.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {medication.dosage}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-sm px-2 py-0.5 rounded-lg",
                            medication.taken
                              ? "bg-green-500/10 text-green-700 dark:text-green-300"
                              : "bg-orange-500/10 text-orange-700 dark:text-orange-300"
                          )}>
                            {medication.time}
                          </span>
                          
                          <button
                            onClick={() => handleDeleteMedication(medication.id)}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <X className="h-4 w-4" />
                            </motion.div>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            medication.color === 'blue' && "bg-blue-500",
                            medication.color === 'green' && "bg-green-500",
                            medication.color === 'purple' && "bg-purple-500",
                            medication.color === 'peach' && "bg-orange-500"
                          )} />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {medication.taken ? 'Taken' : 'Not taken'}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-7 text-xs",
                            medication.taken
                              ? "text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              : "text-orange-600 hover:text-orange-700 hover:bg-orange-500/10"
                          )}
                          onClick={() => {
                            setMedications(medications.map(med =>
                              med.id === medication.id
                                ? { ...med, taken: !med.taken }
                                : med
                            ));
                          }}
                        >
                          {medication.taken ? 'Mark as Not Taken' : 'Mark as Taken'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-8 rounded-xl bg-gradient-to-br from-background to-primary/5 border border-primary/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="text-primary/60 mb-3">
                    <div className="h-14 w-14 mx-auto rounded-full bg-primary/5 flex items-center justify-center">
                      <Pill className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    No medications scheduled for today
                  </p>
                  <Link to="/add-medication">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add your first medication
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subtle animated floating medical elements (purely decorative) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50">
        {[...Array(4)].map((_, i) => <motion.div key={i} className="absolute opacity-5" initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5
      }} animate={{
        y: -100 + Math.random() * -100,
        rotate: 360
      }} transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        delay: i * 5,
        ease: "easeInOut"
      }}>
            {i % 4 === 0 && <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                <path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5m7 12v4a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1m-7-8v2m-2-4h4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>}
            {i % 4 === 1 && <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                <path d="M16.5 4.5a1.5 1.5 0 0 0-3 0v2.5h-3V4.5a1.5 1.5 0 0 0-3 0V9H5a1.5 1.5 0 0 0 0 3h2.5v3H5a1.5 1.5 0 0 0 0 3h2.5v1a1.5 1.5 0 0 0 3 0v-1h3v1a1.5 1.5 0 0 0 3 0v-1H19a1.5 1.5 0 0 0 0-3h-2.5v-3H19a1.5 1.5 0 0 0 0-3h-2.5V4.5z" />
              </svg>}
            {i % 4 === 2 && <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>}
            {i % 4 === 3 && <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500">
                <path d="M7 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H7zM7 17a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H7z" strokeWidth="2" stroke="currentColor" fill="none" />
                <path d="M12 7v5M10 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>}
          </motion.div>)}
      </div>
    </PageTransition>;
};
export default Dashboard;
