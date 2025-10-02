import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const colorClasses = {
  blue: "from-blue-500 to-blue-600 text-blue-600",
  green: "from-green-500 to-green-600 text-green-600", 
  purple: "from-purple-500 to-purple-600 text-purple-600",
  orange: "from-orange-500 to-orange-600 text-orange-600"
};

export default function StatsOverview({ title, value, icon: Icon, color, trend }) {
  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} opacity-10 rounded-full transform translate-x-6 -translate-y-6`} />
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              {value}
            </CardTitle>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardHeader>
      
      {trend && (
        <CardContent className="pt-0">
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-gray-600">{trend}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}