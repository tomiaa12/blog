import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: "MP3 (MPEG-1 Audio Layer III) est le format audio avec perte le plus populaire, très compatible et idéal pour la lecture musicale quotidienne" },
  wav: { desc: "WAV est un format audio sans perte développé par Microsoft avec une qualité audio parfaite, adapté à l'enregistrement et à l'édition professionnels" },
  wem: { desc: "WEM est un format audio de jeu couramment utilisé dans le moteur Wwise" },
}

const customMeta = (source: string, target: string) => ({
  title: `Convertisseur ${source.toUpperCase()} en ${target.toUpperCase()} en Ligne Gratuit - Rapide, Sans Logiciel`,
  description: `Convertissez ${source.toUpperCase()} en ${target.toUpperCase()} en ligne gratuitement. Aucun téléchargement de logiciel requis, aucun téléversement sur serveur nécessaire. Prend en charge la conversion par lots avec une sortie audio de haute qualité, rapide et sécurisé.`,
  keywords: `${source} en ${target},convertir ${source} en ${target},convertisseur en ligne de ${source} en ${target},convertisseur audio gratuit,${source} en ${target} en lot,aucun téléversement requis,conversion rapide,conversion audio en ligne`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
