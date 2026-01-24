import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
// composer Toolbox Quest
/**
 * Shared composable to load climbing locations from Supabase.
 * Can be reused in multiple views (HomeView, MapView, etc.).
 */
export function useLocations() {
    const locations = ref([])
    const loading = ref(false)
    const errorMsg = ref('')

    async function reload() {
        loading.value = true
        errorMsg.value = ''

        try {
            const { data, error } = await supabase
                .from('locations')
                .select('id, name, city, lat, lng, type, label, length, first_ascent, description, image_url')
                .order('created_at', { ascending: false })

            if (error) {
                errorMsg.value = error.message
                return
            }

            // keep only valid coordinates
            locations.value = (data ?? []).filter(
                (l) => typeof l.lat === 'number' && typeof l.lng === 'number'
            )
        } finally {
            loading.value = false
        }
    }

    return { locations, loading, errorMsg, reload }
}
