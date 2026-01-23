A -
1 - L’utilisateur arrive
2 - Il écrit une phrase
3 - Il choisit une émotion
4 - Il visualise l'extrait
5 - Il partage ce qu'il a ressenti

B - Je contrôle l'appli, le design, la programmation ainsi que le contenu mais si je dois utiliser des API pour créer de la source, des extraits , de la transcription. Et oui il faudra faire attention aux droits des extraits mais ça existe déjà en VO le fait d'à partir d'une phrase avoir un extrait, je me dis que c'est jouable.

D’où viendra l’extrait au tout début ? Vidéos en Local
Où sera stockée la phrase ? Dans une variable en local
Comment associer une phrase → une émotion → un extrait ? Au début l'émotion choisi par l'utilisateur pour décrire sa phrase ne correspondra pas forcément à l'extrait mais l'utilisateur pourra ensuite décrire l'émotion de l'extrait afin d'affiner par la suite les résultats
B - Les modèles qui j'imagine pour le moment : Phrase (content, emotion) ; Video (titre, transcription, emplacement) ; Extrait (transcription, emotion, video_id)
