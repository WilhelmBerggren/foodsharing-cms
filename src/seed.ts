/**
 * One-off seed: writes the current page content into data/*.json.
 * Run once with `npm run seed`. Existing files are overwritten, so don't
 * re-run after editors have made changes.
 */
import { savePage } from "./store.js";
import type { PageInput } from "./schema.js";

const gh = (file: string) =>
  `https://github.com/WilhelmBerggren/foodsharing-plugin/blob/main/src/assets/banner/${file}?raw=true`;

const banner = gh("plastic_bag_with_food.png");
const bg = gh("foodsharing_bg.png");

const logo = (file: string) =>
  `https://github.com/WilhelmBerggren/foodsharing-plugin/blob/main/src/assets/logos/${file}?raw=true`;

const pages: PageInput[] = [
  {
    kind: "generic",
    slug: "landing2",
    title: "Foodsharing Sweden",
    hero: {
      banner,
      headingLines: ["Mindre matsvinn,", "Mer *gemenskap*"],
      subtitle: "Tillsammans räddar vi mat och bygger en hållbar framtid",
      buttons: [
        { label: "Bli Voluntär", style: "primary" },
        { label: "Donera Mat", style: "secondary" },
      ],
    },
    showGroups: true,
    sections: [
      {
        title: "Foodsharing Sweden",
        text: [
          "Gå med i en rörelse för att minska matsvinn och främja delande av matöverskott! Genom samarbete med våra olika samarbetspartners – butiker, bagerier, och andra aktörer. – samt öppna matutdelningar gör vi en konkret insats för miljön och våra medmänniskor.",
          "",
          "Att dela utan motprestation är ett självklart sätt att skapa gemenskap. Hjälp oss att rädda maten - tillsammans!",
        ],
        variant: "even",
        bgImage: bg,
        hasButton: false,
      },
      {
        title: "Starta en grupp",
        text: [
          "Om du inte redan finns en aktiv grupp i din kommun så hjälper vi dig att komma igång. Du kan få handledning och hjälp med allt från att hitta samarbeten med butiker och hantera livsmedel på ett säkert sätt, till att ordna en lokal för matutdelning.",
        ],
        variant: "odd",
        bannerImg: gh("starta_en_grupp.jpg"),
        hasButton: true,
      },
      {
        title: "Ta emot mat",
        text: [
          "Du gör miljön en tjänst genom att rädda maten! Alla våra utdelningar är öppna för allmänheten. Ta med egen påse och tänk på att vi är ingen välgörenhetsorganisation, utan vi jobbar solidariskt mot oss själva och mot andra, oavsett inkomst och bakgrund.",
        ],
        variant: "even",
        bgImage: bg,
        bannerImg: gh("ta_emot_mat.png"),
        hasButton: true,
      },
    ],
  },
  {
    kind: "generic",
    slug: "om-oss",
    title: "Om oss",
    hero: { banner: gh("om_oss.png"), headingLines: ["Om oss"], buttons: [] },
    showGroups: false,
    sections: [
      {
        title: "Vad är Foodsharing Sweden?",
        text: [
          "Foodsharing Sweden är ett projekt med målet att sprida den framgångsrika gräsrotsmodellen för maträddning på nationell nivå. Med erfarenheter från Solikyl i Göteborg som grund arbetar vi för att bygga upp ett nätverk och en paraplyförening för foodsharing-grupper runt om i Sverige.",
          "Projektet får stöd från Västra Götalandsregionen under en tvåårsperiod och samarbetar med olika föreningar och initiativ som delar våra mål: att minska matsvinnet, stärka lokalsamhällen och främja delning av resurser.",
        ],
        variant: "even",
        bgImage: bg,
      },
      {
        title: "Vad är foodsharing?",
        text: [
          "Vi organiserar oss genom hela Sverige som del av en rörelse för att kunna minska matsvinn och främja delande av matöverskott. Främst genom samarbete med våra olika samarbetspartners, butiker, bageer, osv. Genom öppna matutdelningar lyckas vi göra en konkret handling för miljön och för medmänniskor.",
          "Att dela utan motprestation är ett självklart sätt att skapa gemenskap! Hjälp oss att rädda maten, tillsammans!",
        ],
        variant: "odd",
        bannerImg: gh("ta_emot_mat.png"),
      },
    ],
    partnerSections: [
      {
        title: "Drivs av:",
        variant: "even",
        items: [
          {
            logo: logo("solikyl.png"),
            name: "Solidarisk kylskåp",
            linkLabel: "solikyl.se",
            url: "https://solikyl.se",
          },
          {
            logo: logo("msf.png"),
            name: "Majornas Samverkansföreningen",
            linkLabel: "majsamverkan.se",
            url: "https://majsamverkan.se",
          },
        ],
      },
      {
        title: "Sammarbetar med:",
        variant: "odd",
        items: [
          {
            logo: logo("omstallningsverket.jpg"),
            name: "Omställningsnätverket",
            linkLabel: "omstallning.net",
            url: "https://omstallning.net",
          },
          {
            logo: logo("vgr.png"),
            name: "Västra götalandsregion",
            linkLabel: "vgr.se",
            url: "https://vgr.se",
          },
          {
            logo: logo("kollaborativ_ekonomi.png"),
            name: "Kollaborativ Ekonomi Sverige",
            linkLabel: "kollaborativekonomi.se",
            url: "https://kollaborativekonomi.se",
          },
          {
            logo: logo("karrot.png"),
            name: "Karrot",
            linkLabel: "karrot.world",
            url: "https://karrot.world",
          },
          {
            logo: logo("atbart.png"),
            name: "Ätbart",
            linkLabel: "atbart.org",
            url: "https://atbart.org",
          },
        ],
      },
    ],
  },
  {
    kind: "generic",
    slug: "starta-en-grupp",
    title: "Starta en grupp",
    hero: {
      banner: gh("starta_en_grupp.jpg"),
      headingLines: ["Starta en grupp"],
      buttons: [],
    },
    showGroups: true,
    sections: [
      {
        title: "Starta en egen grupp – vi backar dig!",
        text: [
          "Vill du dra igång något eget där du bor? Rädda mat, skapa gemenskap och göra konkret skillnad? Vi hjälper dig att komma igång!",
          "Med stöd och erfarenhet från Solidariskt Kylskåp i Göteborg slipper du börja från noll. Vi delar med oss av det vi lärt oss – allt från hur du pratar med butiker till hur ni fixar en trygg och schysst matutdelning.",
        ],
        variant: "even",
        bgImage: bg,
      },
      {
        title: "Du fixar viljan – vi fixar resten (typ)",
        text: [
          "Oavsett om du är själv eller ett gäng, så kan vi stötta dig med:",
          "- En enkel steg-för-steg-guide för att dra igång och hålla igång",
          "- Studiebesök – kom till oss eller bjud in oss (inom Västra Götaland)",
          "- En plattform att organisera er på + ett gemensamt namn att samlas kring",
          "- Kontakter, tips och ett nätverk av andra som gör samma resa",
        ],
        variant: "odd",
        bannerImg: gh("ta_mat.jpg"),
        hasButton: true,
        buttonText: "Kontakta Oss",
        buttonHref: "#/kontakta-oss",
      },
      {
        title: "Börja där du står",
        text: [
          "Du behöver inte vara expert. Det räcker att du bryr dig och vill göra något tillsammans med andra. Skicka ett mejl så snackar vi vidare och hittar ett upplägg som funkar för dig och din plats. Eller gå med i en av våra grupper.",
        ],
        variant: "even",
        bgImage: bg,
        hasButton: true,
        buttonText: "Kontakta Oss",
        buttonHref: "#/kontakta-oss",
      },
    ],
    linkSections: [
      {
        title: "Läs mer om....",
        items: [
          {
            label: "Guide i sammarbete med butiker",
            href: "#/guide-samarbete-butiker",
          },
          {
            label: "Guide när verksamheten är igång",
            href: "#/guide-verksamheten-igang",
          },
          { label: "Guide i mathantering", href: "#/guide-mathantering" },
        ],
      },
    ],
  },
  {
    kind: "donera",
    slug: "donera-mat",
    title: "Donera mat",
    hero: {
      title: "Donera mat",
      subtitle: "Nu kan ni donera, istället för att slänga! :)",
    },
    intro: {
      title: "För regelbundna donationer",
      paragraphs: [
        "Vi samarbetar främst med mataffärer, bagerier och andra livsmedelsverksamhet där svinnet förekommer varje dag. Vi arbetar ideellt och förväntar oss bara att ni sätter in rutiner för att donera matöverskottet istället för att slänga.",
      ],
      lead: "Så fungerar det i praktiken:",
    },
    steps: [
      {
        icon: "calendar",
        text: "Ni bestämmer vilka dagar och tidpunkter som passar bäst för regelbundna upphämtningar - minst en gång i veckan, helst flera gänger!",
      },
      {
        icon: "apple-pail",
        text: "Vi har koll på matsäkerheten – vi sorterar och kontrollerar innan utdelning",
      },
      {
        icon: "delivery-box",
        text: "Vi levererar varoma till närmaste utdelningsställe, där volontärer håller i en utdelning och får ta del av maten tillsammans med andra",
      },
    ],
    benefitsTitle: "Några fördelar",
    benefits: [
      {
        icon: "handshake",
        text: "Kontinuitet och pålitlighet: vi dyker alltid upp på bestämda dagar och tider för hämtningar!",
      },
      {
        icon: "trash",
        text: "Minskade kostnader för avfallshantering på längden",
      },
      {
        icon: "tree",
        text: "Minskad miljöpåverkan då ert svinn får en andra chans att konsumeras",
      },
      {
        icon: "thumbs-up",
        text: "Bra rykte i det lokala samhället för ert ansvarstagande",
      },
    ],
    temporary: {
      title: "För tillfälliga donationer",
      text: "Kontakta oss eller hitta din lokala grupp för donation.",
      buttonLabel: "Till Grupper",
      buttonHref: "#/groupPreview",
    },
    contact: {
      title: "Hör av dig!",
      text: "Vi bokar gärna ett möte eller har ett telefonsamtal för att gå genom funderingar eller praktisk uppstart av samarbete.",
      buttonLabel: "Kontakta Oss",
      buttonHref: "#/kontakta-oss",
    },
  },
  {
    kind: "generic",
    slug: "ta-emot-mat",
    title: "Ta emot mat",
    hero: { banner: gh("ta_emot_mat.jpg"), headingLines: ["Ta emot mat"] },
    sections: [
      {
        title: "Vem kan ta emot mat?",
        text: [
          "Vi organiserar oss genom hela Sverige som del av en rörelse för att kunna minska matsvinn och främja delande av matöverskott. Främst genom samarbete med våra olika samarbetspartners, butiker, bageer, osv. Genom öppna matutdelningar lyckas vi göra en konkret handling för miljön och för medmänniskor.",
          "Att dela utan motprestation är ett självklart sätt att skapa gemenskap! Hjälp oss att rädda maten, tillsammans!",
        ],
        variant: "even",
        bgImage: bg,
        bannerImg: gh("spare_ribs.jpg"),
      },
      {
        title: "Hur tar man emot mat?",
        text: [
          "Vi organiserar oss genom hela Sverige som del av en rörelse för att kunna minska matsvinn och främja delande av matöverskott. Främst genom samarbete med våra olika samarbetspartners, butiker, bageer, osv. Genom öppna matutdelningar lyckas vi göra en konkret handling för miljön och för medmänniskor.",
          "Att dela utan motprestation är ett självklart sätt att skapa gemenskap! Hjälp oss att rädda maten, tillsammans!",
        ],
        variant: "odd",
        bannerImg: gh("plocka_fralla.jpg"),
        hasButton: true,
        buttonText: "Till Grupper",
        buttonHref: "#/groupPreview",
      },
    ],
  },
  {
    kind: "contact",
    slug: "kontakta-oss",
    title: "Kontakta oss",
    heading: "Kontakta oss gärna!",
    subtitle:
      "Vi finns här för att svara på dina frågor och hjälpa dig komma igång med att rädda mat och skapa gemenskap.",
    emailCard: {
      heading: "Emaila oss",
      email: "info@foodsharing.se",
      note: "Vi ser fram emot att höra från dig!",
    },
    socialHeading: "Följ oss på våra sociala medier!",
  },
  {
    kind: "guide",
    slug: "guide-samarbete-butiker",
    title: "Sammarbete med butiker",
    banner: gh("samarbete_butiker.jpg"),
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
      "Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    ],
  },
  {
    kind: "guide",
    slug: "guide-verksamheten-igang",
    title: "När verksamheten är igång",
    banner: gh("verksamheten_igang.jpg"),
    body: [
      "Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit Porem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
      "Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.",
      "Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis.",
    ],
  },
  {
    kind: "guide",
    slug: "guide-mathantering",
    title: "Mathantering 101",
    banner: gh("mathantering_101.jpg"),
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
      "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.",
    ],
  },
];

for (const page of pages) {
  await savePage(page);
  console.log(`seeded ${page.slug}.json`);
}
