'use client';


import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';


export default function PieChartComponent({ data }: any) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}