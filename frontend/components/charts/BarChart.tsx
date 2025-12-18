'use client';


import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


export default function BarChartComponent({ data }: any) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" />
                <Bar dataKey="orders" />
            </BarChart>
        </ResponsiveContainer>
    );
}