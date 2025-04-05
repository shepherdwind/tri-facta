export interface ToastOptions {
  title?: string;
  description: string;
  status?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  isClosable?: boolean;
  position?: 'top' | 'bottom';
  variant?: 'solid' | 'subtle' | 'left-accent' | 'top-accent';
}

export class ToastManager {
  private static instance: ToastManager | null = null;
  private toast: ((options: ToastOptions) => void) | null = null;

  private constructor() {}

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public setToast(toast: (options: ToastOptions) => void) {
    this.toast = toast;
  }

  public showError(message: string) {
    if (this.toast) {
      this.toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
      });
    }
  }

  public showSuccess(message: string) {
    if (this.toast) {
      this.toast({
        title: 'Success',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
      });
    }
  }
}
