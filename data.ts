/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WordItem {
  id: string; // unique id e.g. 'm1', 'd1'
  spanish: string; // e.g. 'Enero'
  armenian: string; // e.g. 'Հունվար'
  armenianLat: string; // e.g. 'Hunvar'
  pronunciationAr: string; // Armenian phonetics e.g. '[էնե՛րո]'
  number: number; // 1-12 or 1-7
  type: 'month' | 'day';
  funFact: string; // simple trivia about this day/month in Spanish/Armenian
}

export const SPANISH_MONTHS: WordItem[] = [
  {
    id: 'm1',
    spanish: 'enero',
    armenian: 'Հունվար',
    armenianLat: 'Hunvar',
    pronunciationAr: 'էնե՛րո',
    number: 1,
    type: 'month',
    funFact: 'Nombrado por Jano, el dios romano de las dos caras (comienzos y finales). (Անվանվել է երկդիմի Յանուս աստծո պատվին՝ սկզբի և վերջի խորհրդանիշը):'
  },
  {
    id: 'm2',
    spanish: 'febrero',
    armenian: 'Փետրվար',
    armenianLat: 'Petrvar',
    pronunciationAr: 'ֆեբրե՛րո',
    number: 2,
    type: 'month',
    funFact: 'El mes más corto del año. ¡A veces tiene 29 días en años bisiestos! (Տարվա ամենակարճ ամիսն է: Նահանջ տարիներին ունենում է 29 օր):'
  },
  {
    id: 'm3',
    spanish: 'marzo',
    armenian: 'Մարտ',
    armenianLat: 'Mart',
    pronunciationAr: 'մա՛րսո',
    number: 3,
    type: 'month',
    funFact: 'Nombrado por Marte, el dios de la guerra. Comienza la primavera. (Անվանվել է Մարս պատերազմի աստծո պատվին: Սկսվում է գարունը):'
  },
  {
    id: 'm4',
    spanish: 'abril',
    armenian: 'Ապրիլ',
    armenianLat: 'April',
    pronunciationAr: 'աբրի՛լ',
    number: 4,
    type: 'month',
    funFact: 'Viene de "abrir", porque las flores se abren en este alegre mes. (Ծագում է «բացվել» բառից, քանի որ այս ամսին բացվում են ծաղիկները):'
  },
  {
    id: 'm5',
    spanish: 'mayo',
    armenian: 'Մայիս',
    armenianLat: 'Mayis',
    pronunciationAr: 'մա՛յո',
    number: 5,
    type: 'month',
    funFact: 'Dedicado a Maya, la diosa de la fertilidad y abundancia de la tierra. (Նվիրված է պտղաբերության և առատության աստվածուհի Մայային):'
  },
  {
    id: 'm6',
    spanish: 'junio',
    armenian: 'Հունիս',
    armenianLat: 'Hunnis',
    pronunciationAr: 'խու՛նիո',
    number: 6,
    type: 'month',
    funFact: 'Nombrado por Juno, la reina de los dioses. Comienza el radiante verano. (Անվանվել է Հունոնա չաստվածուհու պատվին: Սկսվում է շոգ ամառը):'
  },
  {
    id: 'm7',
    spanish: 'julio',
    armenian: 'Հուլիս',
    armenianLat: 'Hulis',
    pronunciationAr: 'խու՛լիո',
    number: 7,
    type: 'month',
    funFact: 'Fue nombrado en honor al gran general romano Julio César. (Անվանվել է ի պատիվ հռոմեական մեծ զորավար Հուլիոս Կեսարի):'
  },
  {
    id: 'm8',
    spanish: 'agosto',
    armenian: 'Օգոստոս',
    armenianLat: 'Ogostos',
    pronunciationAr: 'ագո՛ստո',
    number: 8,
    type: 'month',
    funFact: 'Nombrado en honor al primer emperador de Roma, César Augusto. (Անվանվել է ի պատիվ Հռոմի առաջին կայսր Օկտավիանոս Օգոստոսի):'
  },
  {
    id: 'm9',
    spanish: 'septiembre',
    armenian: 'Սեպտեմբեր',
    armenianLat: 'September',
    pronunciationAr: 'սեպտիե՛մբրե',
    number: 9,
    type: 'month',
    funFact: 'Significaba "el séptimo mes" en el antiguo calendario romano. (Հին հռոմեական օրացույցով նշանակում էր «յոթերորդ ամիս»):'
  },
  {
    id: 'm10',
    spanish: 'octubre',
    armenian: 'Հոկտեմբեր',
    armenianLat: 'Hoktember',
    pronunciationAr: 'օկտու՛բրե',
    number: 10,
    type: 'month',
    funFact: 'Significaba "el octavo mes" en el calendario antiguo de 10 meses. (Հին հռոմեական օրացույցով նշանակում էր «ութերորդ ամիս»):'
  },
  {
    id: 'm11',
    spanish: 'noviembre',
    armenian: 'Նոյեմբեր',
    armenianLat: 'Noyember',
    pronunciationAr: 'նովիե՛մբրե',
    number: 11,
    type: 'month',
    funFact: 'Proveniente de "novem", el noveno mes en el antiguo calendario. (Ծագում է «նովեմ» բառից՝ հին օրացույցի իններորդ ամիսը):'
  },
  {
    id: 'm12',
    spanish: 'diciembre',
    armenian: 'Դեկտեմբեր',
    armenianLat: 'Dektember',
    pronunciationAr: 'դիսիե՛մբրե',
    number: 12,
    type: 'month',
    funFact: 'El décimo y último mes del año romano original. ¡Mes de fiestas y Navidad! (Հին հռոմեական օրացույցի տասներորդ և վերջին ամիսն էր: Ամանորյա հրաշքների ամիս):'
  }
];

export const SPANISH_DAYS: WordItem[] = [
  {
    id: 'd1',
    spanish: 'Lunes',
    armenian: 'Երկուշաբթի',
    armenianLat: 'Erkushabti',
    pronunciationAr: 'լու՛նես',
    number: 1,
    type: 'day',
    funFact: 'El día de la Luna. Representa un nuevo inicio semanal. (Լուսնի օրն է: Այն խորհրդանշում է շաբաթվա նոր սկիզբը):'
  },
  {
    id: 'd2',
    spanish: 'Martes',
    armenian: 'Երեքշաբթի',
    armenianLat: 'Ereqshabti',
    pronunciationAr: 'մա՛րտես',
    number: 2,
    type: 'day',
    funFact: 'Dedicado al planeta Marte. En España, consideran la mala suerte los martes 13. (Մարս մոլորակի օրն է: Իսպանիայում երեքշաբթի 13-ը համարվում է անհաջող օր):'
  },
  {
    id: 'd3',
    spanish: 'Miércoles',
    armenian: 'Չորեքշաբթի',
    armenianLat: 'Choreqshabti',
    pronunciationAr: 'միե՛րկոլես',
    number: 3,
    type: 'day',
    funFact: 'Dedicado a Mercurio, dios del comercio y la comunicación rápida. (Մերկուրիի՝ առևտրի և հաղորդակցության աստծո օրն է):'
  },
  {
    id: 'd4',
    spanish: 'Jueves',
    armenian: 'Հինգշաբթի',
    armenianLat: 'Hingshabti',
    pronunciationAr: 'խուե՛վես',
    number: 4,
    type: 'day',
    funFact: 'El día de Júpiter, dios del trueno y líder del Olimpo romano. (Յուպիտերի՝ հռոմեական գլխավոր աստծո և կայծակի օրն է):'
  },
  {
    id: 'd5',
    spanish: 'Viernes',
    armenian: 'Ուրբաթ',
    armenianLat: 'Urbat',
    pronunciationAr: 'վիե՛ռնես',
    number: 5,
    type: 'day',
    funFact: 'El día de Venus, diosa del amor, la belleza y la abundancia. ¡Por fin fin de semana! (Վեներայի՝ սիրո և գեղեցկության աստվածուհու օրն է):'
  },
  {
    id: 'd6',
    spanish: 'Sábado',
    armenian: 'Շաբաթ',
    armenianLat: 'Shabat',
    pronunciationAr: 'սա՛բադո',
    number: 6,
    type: 'day',
    funFact: 'Viene del "shabbat", el día de descanso y reencuentro familiar. (Ծագում է եբրայերեն «Շաբաթ» բառից, հանգստի և ընտանեկան հանդիպումների օրը):'
  },
  {
    id: 'd7',
    spanish: 'Domingo',
    armenian: 'Կիրակի',
    armenianLat: 'Kiraki',
    pronunciationAr: 'դոմի՛նգո',
    number: 7,
    type: 'day',
    funFact: 'El día del Señor (Dominicus) o del Sol. Tiempo libre y de diversión. (Տիրոջ կամ Արեգակի օրն է: Զբոսանքների և լիակատար լիցքաթափման ժամանակն է):'
  }
];

export const THEORY_NOTES = [
  {
    title: 'Փոքրատառերով գրելը (Minúsculas)',
    content: 'Ի տարբերություն անգլերենի, իսպաներենում շաբաթվա օրերի և ամիսների անունները գրվում են **փոքրատառով**: Օրինակ՝ *lunes* (երկուշաբթի), *enero* (հունվար): Դրանք գրվում են մեծատառով միայն նախադասության սկզբում:'
  },
  {
    title: 'Արական սեռ (Género Masculino)',
    content: 'Իսպաներենում շաբաթվա բոլոր օրերը **արական սեռի** են: Օրերի մասին խոսելիս օգտագործում ենք **el** (իգակի) կամ **los** (հոգնակի) հոդերը: Օրինակ՝ *el lunes* (երկուշաբթի օրը), *los sábados* (շաբաթ օրերին):'
  },
  {
    title: 'Նախդիրների բացակায়ությունը օրերի հետ',
    content: 'Իսպաներենում «երկուշաբթի օրը» կամ «երկուշաբթիով» ասելու համար չենք օգտագործում նախդիր («en»): Փոխարենն ասում ենք ուղղակի որոշյալ հոդով՝ *el lunes* (երկուշաբթի): Օրինակ՝ *Tengo clase el martes.* (Ես դաս ունեմ երեքշաբթի օրը):'
  },
  {
    title: 'Հոգնակի թիվը (Número Plural)',
    content: '-s-ով ավարտվող օրերը (lunes, martes, miércoles, jueves, viernes) հոգնակիում չեն փոխում իրենց վերջավորությունը, ուղղակի փոխվում է հոդը՝ *los lunes*: Իսկ sábado և domingo օրերը ստանում են s վերջավորություն՝ *los sábados*, *los domingos*:'
  }
];
