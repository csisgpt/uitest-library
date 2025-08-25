// Main entry point for BaseToast component 
export { default as BaseToast } from './BaseToast.vue' ; 

export { default as ToastContainer } from './ToastContainer.vue' ;
 // Composables 
 export { useToast } from './composables/useToast' ;
  export type { UseToastReturn } from './composables/useToast' ;
 
 // Utilities 
 export { toastManager, ToastManager } from './utils/toast-manager' 
 
 
 // Plugins 
 export { default as toastPlugin, createToastPlugin } from './plugins/index' ; 
  export type { ToastPluginOptions } from './plugins/index' 
  
  // Types 
export type { Toast, ToastOptions, ToastAction, ToastType, ToastPosition, ToastAnimation, ToastState, ToastManagerInterface } from './types/index' 


// Default configurations 

export const DEFAULT_TOAST_CONFIG = { position: 'top-right' as const, duration: 5000, maxToasts: 5, showProgress: true, animation: 'slide' as const }
