import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWikiStore = defineStore('wiki', () => {
  const entryTypes = ['Boulder', 'Climb']
  const search = ref('')
  const filter = ref('All')

  const entries = ref([
    {
      id: 4,
      type: 'Boulder',
      name: 'The Nose',
      location: [55.288208, 14.752998],
      image: '/images/the_nose.png',
      description: 'A stone formation that looks like the head of a giant. Atleast from one side',
    },
    {
      id: 5,
      type: 'Climb',
      name: 'Uden Afslutning ',
      location: 4,
      image: '/images/the_nose_climbs.png',
      description:
        '7: Start sitting under the nose. Climb all the way to the right following the crack. After that you can top out following another route.',
    },
    {
      id: 6,
      type: 'Climb',
      name: 'Venlig Opvarmning ',
      location: 4,
      image: '/images/the_nose_climbs.png',
      description:
        '9: Start sitting at the ground. Put both hands in the lower crack. Than climb straight up and top out.',
    },
    {
      id: 7,
      type: 'Boulder',
      name: 'Wambis Blokken',
      location: [55.288655, 14.753618],
      image: '/images/wampis_blokken.png',
      description: 'A long boulder sitting near the coast, reaching almost into the water.',
    },
    {
      id: 8,
      type: 'Climb',
      name: ' Adrenalin',
      location: 7,
      image: '/images/wampis_blokken_climbs.png',
      description: '1: Start sitting in the corner. Go straight up and top out.',
    },
    {
      id: 9,
      type: 'Climb',
      name: 'Stærk Tobak',
      location: 7,
      image: '/images/wampis_blokken_climbs.png',
      description:
        '2: Start at the bottom of the crevice. And work your way up. you can make it more difficult buy only using the left hand side parts of the rock formation.',
    },
    {
      id: 10,
      type: 'Boulder',
      name: 'Tipvognsstationen',
      location: [55.281184, 14.752775],
      image: '/images/tipvognsstationen.png',
      description:
        'At the dead end of a hiking trail. It is less a boulder than a mining artifact.',
    },
    {
      id: 11,
      type: 'Climb',
      name: 'A Journey Beginns',
      location: 10,
      image: '/images/tipvognsstationen_climbs.png',
      description:
        '1: Make yourself as small as possible. Put your hand on the first crimp. Go straight up the wall.',
    },
    {
      id: 12,
      type: 'Climb',
      name: 'No Country For Old Men',
      location: 10,
      image: '/images/tipvognsstationen_climbs.png',
      description:
        '2: Stand with you feed on the rock formation at the groudn. Than go straight up wihtout using the cut to your right hand side.',
    },
    {
      id: 13,
      type: 'Climb',
      name: 'Little Spider',
      location: 10,
      image: '/images/tipvognsstationen_climbs.png',
      description:
        '3: Start sitting to the right of the little rock on the ground. From there, go up and lean a little bit to the right.',
    },
    {
      id: 12,
      type: 'Climb',
      name: 'Trappen',
      location: 10,
      image: '/images/tipvognsstationen_climbs.png',
      description:
        '4: Start standing in front of the wall and follow the stair like strucutre up the wall. This can be tried without hands.',
    },
  ])

  return { entries, entryTypes, search, filter }
})
