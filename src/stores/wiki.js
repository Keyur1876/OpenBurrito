import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWikiStore = defineStore('wiki', () => {
  const entryTypes = ['Boulder', 'Climb']
  const search = ref('')
  const filter = ref('All')

  const entries = ref([
    {
      id: 1,
      type: 'Boulder',
      name: 'Lokomotive Rock',
      lat: 50.96658,
      lng: 14.08351,
      image: '/images/istockphoto1.jpg',
      description:
        'A distinctive sandstone formation near Kurort Rathen. Popular in the Saxon Switzerland area for traditional climbing and bouldering-style problems on solid sandstone.',
    },
    {
      id: 2,
      name: 'Rauenstein Plateau',
      type: 'Boulder',
      lat: 50.95181,
      lng: 14.06185,
      image: '/images/stockphoto2.jpg',
      description:
        'A large sandstone table mountain offering multiple rock formations and bouldering-style sections. Scenic views over the Elbe valley.',
    },
    {
      id: 3,
      type: 'Climb',
      name: 'Schwedenturm',
      lat: 50.9605,
      lng: 14.0738,
      image: '/images/stockphoto3.jpg',
      description:
        'A narrow sandstone tower near the Schwedenlöcher area. Known for technical climbing and compact rock features typical of Saxon Switzerland.',
    },
  ])

  return { entries, entryTypes, search, filter }
})
