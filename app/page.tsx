'use client'

import { motion } from 'framer-motion'
import { Building2, Truck, Shield, Award, Heart, Users } from 'lucide-react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import History from '@/components/History'
import Essence from '@/components/Essence'
import Logistics from '@/components/Logistics'
import Brands from '@/components/Brands'
import Quality from '@/components/Quality'
import Footer from '@/components/Footer'

export default function Home() {
    return (
        <main className="min-h-screen">
            <Header />
            <Hero />
            <Logistics />
            <History />
            <Essence />
            <Brands />
            <Quality />
            <Footer />
        </main>
    )
}
