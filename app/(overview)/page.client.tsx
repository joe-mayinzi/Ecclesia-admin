"use client";

import { Card, CardBody } from "@nextui-org/react";
import { FiUsers, FiVideo, FiHeadphones, FiUserCheck, FiAlertCircle, FiMessageSquare } from "react-icons/fi";
import { Link } from "@nextui-org/link";

type DashboardStats = {
  totalUsers: number;
  totalAdmins: number;
  totalVideos: number;
  totalAudios: number;
  totalSignals: number;
  totalSuggestions: number;
};

export default function DashboardClient({ stats }: { stats: DashboardStats }) {
  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: FiUsers,
      color: "bg-blue-500",
      link: "/users",
    },
    {
      title: "Administrateurs",
      value: stats.totalAdmins,
      icon: FiUserCheck,
      color: "bg-purple-500",
      link: "/admin",
    },
    {
      title: "Vidéos",
      value: stats.totalVideos,
      icon: FiVideo,
      color: "bg-red-500",
      link: "/views-stats",
    },
    {
      title: "Audios",
      value: stats.totalAudios,
      icon: FiHeadphones,
      color: "bg-green-500",
      link: "/streams-stats",
    },
    {
      title: "Signalements",
      value: stats.totalSignals,
      icon: FiAlertCircle,
      color: "bg-orange-500",
      link: "/signal-video",
    },
    {
      title: "Suggestions",
      value: stats.totalSuggestions,
      icon: FiMessageSquare,
      color: "bg-indigo-500",
      link: "/suggestions",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre administration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.link} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`${stat.color} p-4 rounded-lg text-white`}
                    >
                      <Icon size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Bienvenue sur le dashboard
            </h2>
            <p className="text-gray-600">
              Gérez votre plateforme Ecclesia depuis ce tableau de bord. 
              Consultez les statistiques, gérez les utilisateurs et administrez votre contenu.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

