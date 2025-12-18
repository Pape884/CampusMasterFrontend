"use client";

import { Users, ShoppingCart, DollarSign } from 'lucide-react';


export default function KpiCard({ title, value, icon: Icon }: any) {
    return (
        <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-900">
            <div className="flex items-center gap-4">
                <Icon className="w-8 h-8 text-blue-500" />
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}