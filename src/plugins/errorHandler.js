import { useToast } from 'vue-toast-notification'


export function setupGlobalErrorHandler(params) {
  const $toast = useToast()

  app.config.ErrorHandler(error, instance, info) {
    console.error(error, info)
    let instance = $toast.error(error, info)
  }

}
