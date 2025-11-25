"use client";

import { Card, CardBody } from "@nextui-org/react";
import { FiUsers, FiVideo, FiHeadphones, FiUserCheck, FiAlertCircle, FiMessageSquare, FiShield, FiLock, FiEye, FiKey, FiMail, FiPhone, FiGlobe, FiHelpCircle } from "react-icons/fi";
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

      {/* Section Règles de Sécurité */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Règles de Sécurité & Confidentialité
          </h2>
          <p className="text-gray-600">
            Consignes importantes pour la sécurité de la plateforme et la protection des données
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carte 1: Protection des accès */}
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <FiLock className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Protection des Accès
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Ne partagez jamais vos identifiants de connexion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Utilisez des mots de passe forts et uniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Changez régulièrement votre mot de passe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Déconnectez-vous après chaque session</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Carte 2: Non-vulgarisation */}
          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow duration-300">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                  <FiShield className="text-red-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Non-Vulgarisation des Accès
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Ne communiquez pas les URLs d'accès admin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Restreignez l'accès aux personnes autorisées uniquement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Ne partagez pas les tokens ou clés d'API</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Signalez immédiatement tout accès non autorisé</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Carte 3: Confidentialité des données */}
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-300">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  <FiEye className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Confidentialité des Données
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Respectez la confidentialité des données utilisateurs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Ne partagez pas d'informations personnelles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Utilisez les données uniquement à des fins professionnelles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Conformez-vous au RGPD et aux réglementations en vigueur</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Carte 4: Bonnes pratiques */}
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-300">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <FiKey className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Bonnes Pratiques
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Effectuez des sauvegardes régulières</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Vérifiez les logs d'activité régulièrement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Mettez à jour les permissions selon les besoins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Formez-vous aux dernières pratiques de sécurité</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Avertissement important */}
        <Card className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                <FiAlertCircle className="text-orange-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  ⚠️ Avertissement Important
                </h3>
                <p className="text-sm text-orange-700 leading-relaxed">
                  Tout manquement aux règles de sécurité peut entraîner des conséquences graves, 
                  notamment la compromission des données, des violations de confidentialité et 
                  des risques légaux. En cas de doute ou d'incident, contactez immédiatement 
                  l'équipe technique ou le responsable de la sécurité.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Section Support & Contact */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Support & Assistance Technique
          </h2>
          <p className="text-gray-600">
            En cas de problème technique, de bug ou de question, contactez l'équipe de développement
          </p>
        </div>

        <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 hover:shadow-lg transition-shadow duration-300">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                <FiHelpCircle className="text-indigo-600" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Besoin d'aide ? Contactez Linked Solution
                </h3>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  Si vous rencontrez un problème technique, un bug, une erreur système ou si vous avez 
                  des questions concernant l'utilisation de la plateforme, n'hésitez pas à contacter 
                  notre équipe de développement. Nous sommes là pour vous aider.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Email */}
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <FiMail className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Email
                      </h4>
                      <a 
                        href="mailto:support@linked-solution.net" 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                      >
                        support@linked-solution.net
                      </a>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <FiPhone className="text-green-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Téléphone
                      </h4>
                      <a 
                        href="tel:+243970000000" 
                        className="text-sm text-green-600 hover:text-green-700 hover:underline"
                      >
                        +243 970 000 000
                      </a>
                    </div>
                  </div>

                  {/* Site Web */}
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiGlobe className="text-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Site Web
                      </h4>
                      <a 
                        href="https://linked-solution.net" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 hover:underline break-all"
                      >
                        linked-solution.net
                      </a>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                      <FiMessageSquare className="text-orange-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Support
                      </h4>
                      <p className="text-sm text-gray-600">
                        Disponible du lundi au vendredi<br />
                        9h00 - 18h00 (GMT+1)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations importantes */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    💡 Informations à fournir lors de votre demande :
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>Description détaillée du problème rencontré</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>Capture d'écran si possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>Étapes pour reproduire le problème</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>Navigateur et version utilisés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>Date et heure de l'incident</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

