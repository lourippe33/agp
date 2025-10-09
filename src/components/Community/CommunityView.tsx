import { Users, MessageCircle, ExternalLink } from 'lucide-react';

export function CommunityView() {
  const whatsappGroupUrl = 'https://chat.whatsapp.com/HYXDiwAFdlk6K4GMAAxwc3';

  const handleJoinWhatsApp = () => {
    window.open(whatsappGroupUrl, '_blank');
  };

  return (
    <div className="pb-24 h-full flex flex-col">
      <div className="bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] pt-8 pb-12 px-6 rounded-b-3xl">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Communauté AGP</h1>
        </div>
        <p className="text-white text-opacity-90">
          Rejoignez notre groupe WhatsApp et partagez votre parcours
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#333333] mb-2">
              Groupe WhatsApp AGP
            </h2>
            <p className="text-gray-600">
              Connectez-vous avec d'autres participants du programme
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Partagez vos progrès</span> et célébrez vos réussites avec le groupe
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Posez vos questions</span> et obtenez des conseils de la communauté
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Échangez des astuces</span> et des recettes avec les autres membres
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Trouvez du soutien</span> et de la motivation au quotidien
              </p>
            </div>
          </div>

          <button
            onClick={handleJoinWhatsApp}
            className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Rejoindre le groupe WhatsApp</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-[#333333] mb-3">
            Règles de la communauté
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-[#25D366] font-bold">•</span>
              <span>Respectez tous les membres du groupe</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#25D366] font-bold">•</span>
              <span>Partagez des contenus positifs et motivants</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#25D366] font-bold">•</span>
              <span>Évitez le spam et les messages hors sujet</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#25D366] font-bold">•</span>
              <span>Soutenez et encouragez les autres participants</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-[#333333] mb-3">
            Besoin d'aide?
          </h3>
          <p className="text-gray-600 mb-4">
            Si vous avez des questions techniques ou besoin d'assistance, contactez notre équipe de support.
          </p>
          <a
            href="mailto:support@agp.com"
            className="text-[#2B7BBE] font-semibold hover:underline"
          >
            support@agp.com
          </a>
        </div>
      </div>
    </div>
  );
}
