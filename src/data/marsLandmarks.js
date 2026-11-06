/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Martian landmarks, single 3D surface texture mode, Earth observatories researching Moon and Mars, and subsurface astrobiology archive data
*/

export const MARS_ATMOSPHERE_CONFIG = {
  surfacePressureMbar: 6.1,
  scaleHeightKm: 11.1,
  cloudAltitudeKm: 28.5,
  cloudLayerRadiusRatio: 1.015,
  outerHaloRadiusRatio: 1.038,
  defaultCloudOpacity: 0.65,
  defaultCloudDriftSpeed: 1.0,
  defaultDustIntensity: 0.42,
};

export const MARS_3D_TEXTURE_MODES = [
  {
    id: 'global-mola',
    name: 'Global MOLA + Viking/MRO 3D',
    label: 'Global MOLA + Viking/MRO 3D',
    shortLabel: 'Global MOLA 3D',
    instrument: 'Viking & MGS MOLA Altimeter (1-mars-nasa-gov-jpg)',
    catalogCode: 'MOLA-GLOBAL',
    datasetBadge: '1-mars-nasa-gov-jpg',
    primaryImage: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
    detailImages: [
      '/assets/mars_reference/mars_ref_2_hillside.jpg',
      '/assets/mars_reference/mars_ref_4_boulder_field.jpg',
    ],
    normalBoost: 1.25,
    bumpBoost: 1.35,
    displacementMultiplier: 1.0,
    microRepeat: 6.0,
    description:
      'Unified full-globe 3D topographic relief of Valles Marineris, Olympus Mons, and Syrtis Major fused with NASA global mosaic photography.',
  },
];

export const SUBSURFACE_ASTROBIOLOGY_INFO = {
  location: '(NASA Ames Research Center Moffett Field, CA United States)',
  meeting: 'Meeting: ELSI Origins Network (EON) Workshop on Universal',
  title:
    'The Astrobiology of the Subsurface: Caves and Rock Fracture Habitats on Earth, Mars and Beyond',
  subtitle:
    'The Astrobiology of the Subsurface: Exploring Cave Habitats on Earth, Mars and Beyond.',
  image: '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.50_PM_942a037b.jpeg',
  body: 'The Astrobiology of the Subsurface: Exploring Cave Habitats on Earth, Mars and Beyond. We are using the spectacular underground landscapes of Earth caves as models for the subsurfaces of other planets. Caves have been detected on the Moon and Mars and are strongly suspected for other bodies in the Solar System including some of the ice covered Ocean Worlds that orbit gas giant planets. The caves we explore and study include many extreme conditions of relevance to planetary astrobiology exploration including high and low temperatures, gas atmospheres poisonous to humans but where exotic microbes can fluorish, highly acidic or salty fluids, heavy metals, and high background radiation levels. Some cave microorganisms eat their way through bedrock, some live in battery acid conditions, some produce unusual biominerals and rare cave formations, and many produce compounds of potential pharmaceutical and industrial significance. We study these unique lifeforms and the physical and chemical biosignatures that they leave behind. Such traces can be used to provide a Field Guide to Unknown Organisms for developing life detection space missions.',
};

export const LOST_OCEANS_OF_MARS_INFO = {
  title: 'The Lost Oceans of Mars',
  image: '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.49_PM__1__beecea09.jpeg',
  body: 'Billions of years ago, the Northern Hemisphere of Mars may have been covered by at least one ocean and thousands of lakes and rivers. These findings, based initially on telescopic observations and images by the Mariner and Viking missions, led investigators to hypothesize that stromatolite fashioning cyanobacteria may have proliferated in the surface waters, and life may have been successfully transferred between Earth and Mars via tons of debris ejected into the space following bolide impact. Studies conducted by NASA’s robotic rovers also indicate that Mars was wet and habitable and may have been inhabited in the ancient past. It has been hypothesized that Mars subsequently lost its magnetic field, oceans, and atmosphere when bolides negatively impacted its geodynamo and that the remnants of the Martian seas began to evaporate and became frozen beneath the surface. As reviewed here, twenty-five investigators have published evidence of Martian sedimentary structures that resemble microbial mats and stromatolites, which may have been constructed billions of years ago on ancient lake shores and in receding bodies of water, although if these formations are abiotic or biotic is unknown. These findings parallel the construction of the first stromatolites on Earth. The evidence reviewed here does not prove but supports the hypothesis that ancient Mars had oceans (as well as lakes) and was habitable and inhabited, and life may have been transferred between Earth and Mars billions of years ago due to powerful solar winds and life-bearing ejecta propelled into the space following the bolide impact.',
  authors: 'The authors - Dr. V. Rizzo and Dr. G. Bianciardi for thehelpful comments',
};

export const THREE_WORLDS_LIFE_INFO = {
  title: 'Three Worlds, One Question: Could Life Exist?',
  author: 'CHRISTOPHER P. MCKAY',
  image: '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.48_PM_da6dab17.jpeg',
  paragraph1:
    'Mars appears to have no life on its surface today. However, the presence of fluvial features provides evidence that liquid water was once present on the martian surface. By analogy with Earth, life may have originated on Mars early in its history, possibly during the end of the late heavy bombardment. Analysis of the one meteorite from Mars which dates to this early time appears to contain evidence of this early environment and possibly life. As the climate cooled and liquid water became unavailable, life would have eventually died out. The cold deserts of Antarctica provide a glimpse of what martian ecosystems might have been like as conditions worsened. The search for fossil evidence of past life on Mars may provide the first direct indication of life beyond Earth.',
  paragraph2:
    'The search for evidence of past life on Mars is motivated by the direct evidence that Mars once had liquid water. Studies of life on Earth strongly indicate liquid water as the essential requirement for life. Even if the mean annual temperatures on Mars were well below freezing, life could survive on transient sources of liquid water and in ice-covered bodies of water. A comparison of life on Mars, even if only expressed as fossils, with life on Earth holds the potential for greatly expanding our understanding of life in the universe.',
};

export const MOON_WATER_ICE_INFO = {
  title: "Moon's Hidden Treasure: Water Ice",
  author: 'Rahul Sakya',
  image: '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.49_PM_b42b9d04.jpeg',
  body: 'The discovery of water on the Moon has transformed lunar science and future space exploration strategies. For decades, the Moon was considered an extremely dry celestial body. However, data from multiple lunar missions have confirmed the presence of water molecules, hydroxyl compounds, and significant deposits of water ice, particularly in permanently shadowed regions (PSRs) near the lunar poles. These discoveries have major implications for planetary science, in-situ resource utilization (ISRU), human colonization, and deep-space exploration. This review article summarizes the current understanding of lunar water, including its origin, detection methods, distribution, extraction technologies, scientific significance, and its role in future Artemis and international lunar missions.',
};

export const EARTH_OBSERVATORIES = [
  {
    id: 'obs-nasa-ames',
    name: 'NASA Ames Research Center',
    shortLabel: 'NASA Ames (CA)',
    category: 'earth-observatory',
    categoryLabel: 'ASTROBIOLOGY & LUNAR/MARS RESEARCH CENTER',
    catalogId: 'OBS-ARC-01',
    mission: 'ELSI Origins Network (EON) & Planetary Cave Astrobiology',
    region: 'Moffett Field, CA United States',
    location: 'Moffett Field, California, United States',
    lat: 37.4152,
    lon: -122.0527,
    coords: '37.42°N, 122.05°W • Moffett Field, CA',
    coordinatesFormatted: '37.42° N, 122.05° W',
    researchTargets: 'Moon, Mars & Ocean Worlds Subsurface Caves',
    elevationKm: '+0.01 km Silicon Valley Basin',
    referenceImage: '/assets/aistudio/acd22-0005-026_cb253bd5.jpg',
    image: '/assets/aistudio/acd22-0005-026_cb253bd5.jpg',
    secondaryImage: '/assets/aistudio/copy_of_team4_desoto_feb25-2023_img_0105_1_ef2c9457.jpg',
    galleryImages: [
      '/assets/aistudio/acd22-0005-026_cb253bd5.jpg',
      '/assets/aistudio/copy_of_team4_desoto_feb25-2023_img_0105_1_ef2c9457.jpg',
    ],
    referenceCredit: '(NASA Ames Research Center Moffett Field, CA United States)',
    description:
      'Host of the ELSI Origins Network (EON) Workshop on Universal — "The Astrobiology of the Subsurface: Caves and Rock Fracture Habitats on Earth, Mars and Beyond", modeling lunar and Martian lava tube cave habitats, extremophile biosignatures, LCROSS lunar water-ice impact telemetry, and VIPER polar rover payloads.',
    specs: {
      Center: 'NASA Ames (Moffett Field, CA)',
      Meeting: 'ELSI Origins Network (EON)',
      Focus: 'Moon & Mars Cave Habitats',
      Output: 'Field Guide to Unknown Organisms',
    },
  },
  {
    id: 'obs-mauna-kea',
    name: 'Mauna Kea Observatories (NASA IRTF & Keck)',
    shortLabel: 'Mauna Kea (HI)',
    category: 'earth-observatory',
    categoryLabel: 'INFRARED & OPTICAL PLANETARY OBSERVATORY',
    catalogId: 'OBS-MKO-02',
    mission: 'NASA IRTF & W. M. Keck Twin 10m Telescopes',
    region: 'Big Island, Hawaii, United States',
    location: 'Mauna Kea Summit, Hawaii, United States',
    lat: 19.8206,
    lon: -155.4681,
    coords: '19.82°N, 155.47°W • Elev +4,207 m',
    coordinatesFormatted: '19.82° N, 155.47° W',
    researchTargets: 'Lunar Hydration & Martian Atmospheric Plumes',
    elevationKm: '+4.21 km Volcanic Summit',
    referenceImage: '/assets/aistudio/home-mauna-kea_1x-1500x751_916f4a56.jpg',
    image: '/assets/aistudio/home-mauna-kea_1x-1500x751_916f4a56.jpg',
    secondaryImage:
      '/assets/aistudio/Mauna-Kea-Observatory-Hawaii-Keck-telescope-Canada-France-Hawaii_0e5c1f84.webp',
    galleryImages: [
      '/assets/aistudio/home-mauna-kea_1x-1500x751_916f4a56.jpg',
      '/assets/aistudio/Mauna-Kea-Observatory-Hawaii-Keck-telescope-Canada-France-Hawaii_0e5c1f84.webp',
    ],
    referenceCredit: 'NASA IRTF / Mauna Kea Observatories',
    description:
      'Operates the 3.0-meter NASA Infrared Telescope Facility (IRTF) and twin 10-meter Keck telescopes above 40% of Earth’s atmosphere, detecting molecular water (H2O) on sunlit lunar surfaces (Honniball et al.) and mapping seasonal D/H water loss and methane distributions across Mars.',
    specs: {
      Aperture: '3.0m IRTF / Dual 10m Keck',
      Elevation: '4,207 m (13,803 ft)',
      'Moon Research': '3-µm Surface Water Spectroscopy',
      'Mars Research': 'Atmospheric HDO/H2O & Methane',
    },
  },
  {
    id: 'obs-alma-chajnantor',
    name: 'ALMA Chajnantor Submillimeter Array',
    shortLabel: 'ALMA Array (Chile)',
    category: 'earth-observatory',
    categoryLabel: 'MILLIMETER & SUBMILLIMETER INTERFEROMETER',
    catalogId: 'OBS-ALMA-03',
    mission: '66-Antenna Chajnantor Planetary Array',
    region: 'Atacama Desert, Antofagasta, Chile',
    location: 'Chajnantor Plateau, Atacama Desert, Chile',
    lat: -23.023,
    lon: -67.754,
    coords: '23.02°S, 67.75°W • Elev +5,050 m',
    coordinatesFormatted: '23.02° S, 67.75° W',
    researchTargets: 'Lunar Regolith Thermal Emission & Mars Wind Telemetry',
    elevationKm: '+5.05 km Chajnantor Plateau',
    referenceImage: '/assets/aistudio/fjbNR8Cnn8LXizm4Vj5jSY-1280-80_f26e61a4.jpg',
    image: '/assets/aistudio/fjbNR8Cnn8LXizm4Vj5jSY-1280-80_f26e61a4.jpg',
    galleryImages: ['/assets/aistudio/fjbNR8Cnn8LXizm4Vj5jSY-1280-80_f26e61a4.jpg'],
    referenceCredit: 'ESO / NAOJ / NRAO ALMA Observatory',
    description:
      'High-altitude array of 66 precision radio dishes on the hyper-arid Chajnantor Plateau, probing subsurface thermal diffusivity of lunar craters and mapping 3D global wind velocities, CO, and HDO profiles in the Martian atmosphere.',
    specs: {
      Antennas: '66 High-Precision Dishes',
      Elevation: '5,050 m (16,570 ft)',
      'Moon Research': 'Subsurface Regolith Thermophysics',
      'Mars Research': 'Global Zonal Wind & CO Mapping',
    },
  },
  {
    id: 'obs-lowell-mars-hill',
    name: 'Lowell Observatory — Mars Hill',
    shortLabel: 'Lowell Obs (AZ)',
    category: 'earth-observatory',
    categoryLabel: 'HISTORIC MARS & APOLLO LUNAR MAPPING CENTER',
    catalogId: 'OBS-LOW-04',
    mission: '4.3m Lowell Discovery Telescope & Clark Refractor',
    region: 'Flagstaff, Arizona, United States',
    location: 'Flagstaff, Arizona, United States',
    lat: 35.2028,
    lon: -111.6646,
    coords: '35.20°N, 111.66°W • Elev +2,210 m',
    coordinatesFormatted: '35.20° N, 111.66° W',
    researchTargets: 'Mars Albedo Storms & Lunar Aeronautical Charts',
    elevationKm: '+2.21 km Mars Hill Mesa',
    referenceImage: '/assets/aistudio/Lowell-Obs-Slipher-Building_Flagstaff_LoC-n_87fc38ef.jpg',
    image: '/assets/aistudio/Lowell-Obs-Slipher-Building_Flagstaff_LoC-n_87fc38ef.jpg',
    galleryImages: ['/assets/aistudio/Lowell-Obs-Slipher-Building_Flagstaff_LoC-n_87fc38ef.jpg'],
    referenceCredit: 'Lowell Observatory / USGS Flagstaff Archive',
    description:
      'Founded in 1894 on Mars Hill in Flagstaff, Arizona. Produced the official USAF/NASA Lunar Aeronautical Charts used to train every Apollo astronaut crew and conducts continuous synoptic monitoring of Martian global dust storms and polar cap recession.',
    specs: {
      Primary: '4.3m Discovery Telescope',
      Elevation: '2,210 m (7,250 ft)',
      'Moon Research': 'Apollo Lunar Cartography & Regolith',
      'Mars Research': 'Synoptic Dust Storm & Ice Cap Patrol',
    },
  },
  {
    id: 'obs-mcdonald-mlrs',
    name: 'McDonald Observatory Lunar Laser Ranging',
    shortLabel: 'McDonald Laser (TX)',
    category: 'earth-observatory',
    categoryLabel: 'LUNAR LASER RANGING & MARS SPECTROSCOPY',
    catalogId: 'OBS-MCD-05',
    mission: 'MLRS & 10m Hobby-Eberly / 2.7m Harlan J. Smith',
    region: 'Mount Locke, Davis Mountains, Texas, USA',
    location: 'Mount Locke, Davis Mountains, Texas, United States',
    lat: 30.6797,
    lon: -104.0151,
    coords: '30.68°N, 104.02°W • Elev +2,070 m',
    coordinatesFormatted: '30.68° N, 104.02° W',
    researchTargets: 'Apollo Retroreflector Geodesy & Mars Atmosphere',
    elevationKm: '+2.07 km Mount Locke',
    referenceImage: '/assets/aistudio/images__1__16c43a05.jfif',
    image: '/assets/aistudio/images__1__16c43a05.jfif',
    galleryImages: ['/assets/aistudio/images__1__16c43a05.jfif'],
    referenceCredit: 'McDonald Observatory / NASA LLR Program',
    description:
      'Fires high-powered pulsed laser beams at the Apollo 11, 14, and 15 corner-cube retroreflector arrays on the Moon to measure Earth-Moon orbital recession (3.8 cm/yr) and fluid lunar core dynamics, alongside high-dispersion spectroscopic detections of water vapor on Mars.',
    specs: {
      Instrument: 'Lunar Laser Ranging Station (MLRS)',
      Precision: 'Millimeter-Scale Time-of-Flight',
      'Moon Research': 'Apollo 11/14/15 Retroreflector Geodesy',
      'Mars Research': 'High-Dispersion H2O & CO2 Lines',
    },
  },
  {
    id: 'obs-goldstone-radar',
    name: 'Goldstone Solar System Radar (DSS-14)',
    shortLabel: 'Goldstone Radar (CA)',
    category: 'earth-observatory',
    categoryLabel: 'DEEP SPACE NETWORK PLANETARY RADAR',
    catalogId: 'OBS-GDS-06',
    mission: '70m DSS-14 "Mars" Antenna • NASA JPL DSN',
    region: 'Mojave Desert, Barstow, California, USA',
    location: 'Mojave Desert, Barstow, California, United States',
    lat: 35.4259,
    lon: -116.8895,
    coords: '35.43°N, 116.89°W • Elev +1,002 m',
    coordinatesFormatted: '35.43° N, 116.89° W',
    researchTargets: 'Lunar South Pole Radar & Mars Rover Landing Radar',
    elevationKm: '+1.00 km Mojave Basin',
    referenceImage: '/assets/aistudio/images_15fdc5b9.jfif',
    image: '/assets/aistudio/images_15fdc5b9.jfif',
    galleryImages: ['/assets/aistudio/images_15fdc5b9.jfif'],
    referenceCredit: 'NASA / JPL-Caltech Deep Space Network',
    description:
      'Home of the 70-meter DSS-14 "Mars" parabolic dish. Transmits 500-kW X-band and S-band planetary radar waves to map 5-meter Digital Elevation Models of the Lunar South Pole (Shackleton & Malapert) and characterize surface roughness for Mars Perseverance, Curiosity, and Viking landing ellipses.',
    specs: {
      Dish: '70-Meter DSS-14 "Mars" Antenna',
      Transmitter: '500 kW X-Band Planetary Radar',
      'Moon Research': '5m South Pole Bistatic DEM Mapping',
      'Mars Research': 'Rover Landing Site Radar Roughness',
    },
  },
];

export const EARTH_SIMULATION_IMAGES = [
  {
    id: 'img-nasa-ames-wind-tunnel',
    obsId: 'obs-nasa-ames',
    label: 'NASA Ames Unitary Plan Wind Tunnel',
    coords: '37.42° N, 122.05° W',
    src: '/assets/aistudio/acd22-0005-026_cb253bd5.jpg',
  },
  {
    id: 'img-nasa-ames-field-team',
    obsId: 'obs-nasa-ames',
    label: 'NASA Ames Field Telemetry Team',
    coords: '37.42° N, 122.05° W',
    src: '/assets/aistudio/copy_of_team4_desoto_feb25-2023_img_0105_1_ef2c9457.jpg',
  },
  {
    id: 'img-mauna-kea-sunset',
    obsId: 'obs-mauna-kea',
    label: 'Mauna Kea Summit Domes',
    coords: '19.82° N, 155.47° W',
    src: '/assets/aistudio/home-mauna-kea_1x-1500x751_916f4a56.jpg',
  },
  {
    id: 'img-mauna-kea-aerial',
    obsId: 'obs-mauna-kea',
    label: 'Mauna Kea Twin Keck & IRTF',
    coords: '19.82° N, 155.47° W',
    src: '/assets/aistudio/Mauna-Kea-Observatory-Hawaii-Keck-telescope-Canada-France-Hawaii_0e5c1f84.webp',
  },
  {
    id: 'img-alma-chajnantor',
    obsId: 'obs-alma-chajnantor',
    label: 'ALMA Chajnantor Array (Chile)',
    coords: '23.02° S, 67.75° W',
    src: '/assets/aistudio/fjbNR8Cnn8LXizm4Vj5jSY-1280-80_f26e61a4.jpg',
  },
  {
    id: 'img-lowell-mars-hill',
    obsId: 'obs-lowell-mars-hill',
    label: 'Lowell Observatory Mars Hill (AZ)',
    coords: '35.20° N, 111.66° W',
    src: '/assets/aistudio/Lowell-Obs-Slipher-Building_Flagstaff_LoC-n_87fc38ef.jpg',
  },
  {
    id: 'img-mcdonald-mlrs',
    obsId: 'obs-mcdonald-mlrs',
    label: 'McDonald Laser Ranging (TX)',
    coords: '30.68° N, 104.02° W',
    src: '/assets/aistudio/images__1__16c43a05.jfif',
  },
  {
    id: 'img-goldstone-radar',
    obsId: 'obs-goldstone-radar',
    label: 'Goldstone Radar DSS-14 (CA)',
    coords: '35.43° N, 116.89° W',
    src: '/assets/aistudio/images_15fdc5b9.jfif',
  },
];

export const EARTH_OBSERVATORIES_MAP = new Map(
  EARTH_OBSERVATORIES.map((obs) => [obs.id, obs])
);

export const MARS_LANDMARKS = [
  {
    id: 'valles-marineris',
    name: 'Valles Marineris Canyon',
    title: 'Valles Marineris Canyon',
    shortLabel: 'Valles Marineris',
    category: 'Tectonic Rift System',
    categoryLabel: 'MARS TECTONIC RIFT SYSTEM',
    mission: 'Viking & MGS MOLA',
    lat: -13.9,
    lon: -59.2,
    coords: '13.9°S, 59.2°W • Depth -7.0 km',
    coordinatesFormatted: '13.90° S, 59.20° W',
    areographic: { latitudeDeg: -13.9, longitudeDeg: -59.2 },
    description:
      'Colossal tectonic canyon system stretching over 4,000 km along the Martian equator and plunging up to 7 km deep beneath morning water-ice cloud wisps.',
    referenceImage: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
    image: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
    referenceCredit: 'NASA / USGS Global Mars Mosaic (1-mars-nasa-gov-jpg)',
    catalogId: 'NASA-MARS-GLOBAL',
    missionName: 'Viking & Mars Global Surveyor Mosaic',
    elevationKm: '-7.0 km Chasma Floor',
    featureDescription:
      'Layered sedimentary chasmata walls, fault scarps, and ferric-oxide canyon plateaus.',
    idealSunAngleDeg: 58,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: '1-mars-nasa-gov-jpg.webp',
    specs: {
      Length: '4,000 km',
      'Max Depth': '7.0 km',
      Dataset: 'MOLA + Viking Mosaic',
      Atmosphere: 'Morning Ice Fog',
    },
  },
  {
    id: 'jezero-perseverance',
    name: 'Jezero Crater — Perseverance',
    title: 'Jezero Crater (Perseverance)',
    shortLabel: 'Jezero Crater',
    category: 'Mars 2020 Rover Site',
    categoryLabel: 'MARS 2020 ROVER SITE',
    mission: 'Perseverance (Mars 2020)',
    lat: 18.38,
    lon: 77.58,
    coords: '18.38°N, 77.58°E • Elev -2.5 km',
    coordinatesFormatted: '18.38° N, 77.58° E',
    areographic: { latitudeDeg: 18.38, longitudeDeg: 77.58 },
    description:
      'Ancient 45 km lakebed and Neretva Vallis river channel where Perseverance captured Mastcam-Z cross-bedded deltaic strata (ZCAM08693), sand ripples (ZCAM08618), and "Cheyava Falls" (PIA26344).',
    referenceImage: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
    image: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
    referenceCredit: 'NASA / JPL-Caltech / ASU (ZL0_0695 ZCAM08693 · PIA26344)',
    catalogId: 'ZCAM08693 · PIA26344',
    missionName: 'Perseverance Mastcam-Z & SuperCam Suite',
    elevationKm: '-2.5 km Ancient Delta',
    featureDescription:
      'Mastcam-Z cross-bedded sandstone laminae (ZCAM08693), aeolian ripples (ZCAM08618), and Cheyava Falls drill site.',
    idealSunAngleDeg: 72,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: 'ZCAM08693 / ZCAM10053 / PIA26202',
    specs: {
      Diameter: '45.0 km',
      'Rover Sol': 'Sol 695–1218 (ZCAM)',
      'Stereo Pair': 'ZL0/ZR0 ZCAM08693',
      'Micro-Imager': 'SuperCam SCAM04020',
    },
  },
  {
    id: 'gale-curiosity',
    name: 'Gale Crater — Curiosity & Ventifacts',
    title: 'Gale Crater & Ventifact Ridge',
    shortLabel: 'Gale Crater',
    category: 'MSL & Mastcam-Z Geology',
    categoryLabel: 'MSL & MASTCAM-Z GEOLOGY',
    mission: 'Curiosity & Perseverance',
    lat: -5.4,
    lon: 137.8,
    coords: '5.4°S, 137.8°E • Aeolis Mons +5.5 km',
    coordinatesFormatted: '5.40° S, 137.80° E',
    areographic: { latitudeDeg: -5.4, longitudeDeg: 137.8 },
    description:
      'Impact basin hosting 5.5 km-high Aeolis Mons (Mount Sharp) and wind-carved sandstone ventifacts (ZCAM08750) sculpted by high-velocity Martian dust abrasion.',
    referenceImage: '/assets/mars_reference/mars_ref_1_ventifacts.jpg',
    image: '/assets/mars_reference/mars_ref_1_ventifacts.jpg',
    referenceCredit: 'NASA / JPL-Caltech / MSSS / ASU (ZR0_0739 ZCAM08750 · PIA19808)',
    catalogId: 'ZCAM08750 · PIA19808',
    missionName: 'MSL Curiosity & Mastcam-Z Geology',
    elevationKm: '+5.5 km Aeolis Mons Peak',
    featureDescription:
      'Wind-abraded Sombrero ventifact rock formations, tilted sandstone slabs, and Mount Sharp massif.',
    idealSunAngleDeg: 85,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: 'ZCAM08750-PIA19808',
    specs: {
      Diameter: '154.0 km',
      'Central Peak': 'Mount Sharp (5.5 km)',
      Feature: 'Wind-Carved Ventifacts',
      Instrument: 'Mastcam-Z / MAHLI',
    },
  },
  {
    id: 'planum-australe-odyssey',
    name: 'Planum Australe — Mars Odyssey',
    title: 'Planum Australe South Pole',
    shortLabel: 'Planum Australe',
    category: 'Polar Ice Cap & Odyssey Track',
    categoryLabel: 'POLAR ICE CAP & ODYSSEY TRACK',
    mission: '2001 Mars Odyssey',
    lat: -82.5,
    lon: 160.0,
    coords: '82.5°S, 160.0°E • Elev +3.0 km',
    coordinatesFormatted: '82.50° S, 160.00° E',
    areographic: { latitudeDeg: -82.5, longitudeDeg: 160.0 },
    description:
      'Layered CO2 and water-ice south polar cap surveyed by the 2001 Mars Odyssey THEMIS and Gamma Ray Spectrometer beneath polar hood clouds.',
    referenceImage: '/assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp',
    image: '/assets/aistudio/mars-odyssey-orbiter-pia04816_c33d5cdc.webp',
    referenceCredit: 'NASA / JPL-Caltech (PIA04816)',
    catalogId: 'PIA04816',
    missionName: '2001 Mars Odyssey Orbiter',
    elevationKm: '+3.0 km Polar Ice Cap',
    featureDescription:
      'Spiral CO2 ice troughs, frosted polar scarps, and Odyssey thermal mapping.',
    idealSunAngleDeg: 95,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: 'THEMIS-PIA04816',
    specs: {
      Thickness: '3.0 km CO2 + H2O Ice',
      Orbiter: '2001 Mars Odyssey',
      Instrument: 'THEMIS IR / GRS',
      Catalog: 'PIA04816',
    },
  },
  {
    id: 'olympus-tharsis',
    name: 'Olympus Mons & Boulder Aureole',
    title: 'Olympus Mons Caldera',
    shortLabel: 'Olympus Mons',
    category: 'Shield Volcano & Boulder Field',
    categoryLabel: 'SHIELD VOLCANO & BOULDER FIELD',
    mission: 'MGS MOLA & Mastcam-Z',
    lat: 18.65,
    lon: -133.8,
    coords: '18.65°N, 133.8°W • Elev +21.9 km',
    coordinatesFormatted: '18.65° N, 133.80° W',
    areographic: { latitudeDeg: 18.65, longitudeDeg: -133.8 },
    description:
      'Largest volcano in the Solar System rising 21.9 km above the Martian datum, surrounded by fractured basaltic boulder fields (ZCAM03491) and lee-wave water-ice clouds.',
    referenceImage: '/assets/aistudio/images__5__d7874cf9.jfif',
    image: '/assets/aistudio/images__5__d7874cf9.jfif',
    referenceCredit: 'NASA / Viking & Mars Global Surveyor — Olympus Mons Caldera',
    catalogId: 'MOLA · ZCAM03491',
    missionName: 'Mars Global Surveyor & Mastcam-Z',
    elevationKm: '+21.9 km Summit Caldera',
    featureDescription:
      'Nested 80 km summit caldera complex, fractured basaltic boulder fields, and orographic water-ice clouds.',
    idealSunAngleDeg: 45,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: 'MOLA-ZCAM03491-3D',
    specs: {
      Height: '21.9 km (72,000 ft)',
      Width: '624 km Shield Base',
      Caldera: '80 km Nested Complex',
      Lithology: 'Basaltic Boulder Clasts',
    },
  },
  {
    id: 'chryse-horizon',
    name: 'Neretva Hillside & Sand Ripples',
    title: 'Neretva Escarpment & Ripples',
    shortLabel: 'Neretva Escarpment',
    category: 'Delta Escarpment & Aeolian Dunes',
    categoryLabel: 'DELTA ESCARPMENT & AEOLIAN DUNES',
    mission: 'Perseverance Mastcam-Z',
    lat: 22.4,
    lon: -38.7,
    coords: '22.4°N, 38.7°W • Scale Height 11.1 km',
    coordinatesFormatted: '22.40° N, 38.70° W',
    areographic: { latitudeDeg: 22.4, longitudeDeg: -38.7 },
    description:
      'Steep rocky delta hillside (ZCAM03527) and wind-rippled sand sheets (ZCAM08618) showcasing Mars’s thin CO2 atmosphere and butterscotch dust scattering.',
    referenceImage: '/assets/mars_reference/mars_ref_2_hillside.jpg',
    image: '/assets/mars_reference/mars_ref_2_hillside.jpg',
    referenceCredit: 'NASA / JPL-Caltech / ASU (ZR0_0682 ZCAM03527 · ZCAM08618)',
    catalogId: 'ZCAM03527 · ZCAM08618',
    missionName: 'Perseverance Mastcam-Z Stereo',
    elevationKm: '-3.6 km Outflow Escarpment',
    featureDescription:
      'Steep boulder-strewn hillside talus, aeolian sand ripples, and Rayleigh/Mie twilight rim.',
    idealSunAngleDeg: 130,
    preferredTextureMode: 'global-mola',
    stereoDatasetId: 'ZR0_0682_ZCAM03527',
    specs: {
      'Surface Pressure': '6.1 mbar (95.3% CO2)',
      'Cloud Altitude': '25–30 km H2O/CO2 Ice',
      Terrain: 'Escarpment & Sand Ripples',
      Scattering: 'Butterscotch / Blue Limb',
    },
  },
];

export const MARS_LOCATIONS_MAP = new Map(
  MARS_LANDMARKS.map((site) => [site.id, site])
);

export const MARS_AXIAL_TILT_RAD = (25.19 * Math.PI) / 180;
export const MARS_SIDEREAL_SOL_SECONDS = 88642.66;

export function getPlanetaryOrbitPolicy() {
  return {
    earthHeliocentricOrbitEnabled: true,
    earthMoonOrbitEnabled: true,
    marsHeliocentricOrbitEnabled: true,
    marsSatelliteOrbitsEnabled: false,
  };
}

export function areographicToCartesian(latDeg, lonDeg, radius = 0.532) {
  const latRad = (Number(latDeg) * Math.PI) / 180;
  const lonRad = (Number(lonDeg) * Math.PI) / 180;

  const y = radius * Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const x = radius * cosLat * Math.sin(lonRad);
  const z = radius * cosLat * Math.cos(lonRad);

  return { x, y, z };
}

export function computeCloudDriftOffset(
  elapsedSeconds,
  cloudDriftSpeed = 1.0,
  planetRotationRad = 0
) {
  const safeSpeed = Math.max(0, Number(cloudDriftSpeed) || 0);
  const zonalPhaseRad =
    (elapsedSeconds * 0.018 * safeSpeed + planetRotationRad * 0.14) % (2 * Math.PI);
  const meridionalPhaseRad = Math.sin(elapsedSeconds * 0.006 * safeSpeed) * 0.18;
  const windVelocityMps = Number((22.4 * safeSpeed).toFixed(1));
  const cloudCoverPct = Math.round(38 + Math.sin(elapsedSeconds * 0.05 + 0.6) * 8);

  return {
    zonalPhaseRad: Number(zonalPhaseRad.toFixed(4)),
    meridionalPhaseRad: Number(meridionalPhaseRad.toFixed(4)),
    shaderTime: Number((elapsedSeconds * safeSpeed).toFixed(3)),
    windVelocityMps,
    cloudCoverPct,
  };
}

export function formatMarsSolTime(elapsedSeconds, basePeriodSeconds = 140) {
  const safePeriod = basePeriodSeconds > 0 ? basePeriodSeconds : 140;
  const totalSols = Math.max(0, Number(elapsedSeconds) || 0) / safePeriod;
  const solNumber = Math.floor(totalSols) + 1218;
  const solFraction = totalSols - Math.floor(totalSols);
  const marsHoursTotal = solFraction * 24.6597;
  const hours = Math.floor(marsHoursTotal);
  const minutes = Math.floor((marsHoursTotal - hours) * 60);

  return `SOL ${solNumber} · ${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )} MTC`;
}
/* --- End of marsLandmarks.js --- */
