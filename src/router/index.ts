type Route = {
  path: string;
  component: React.ComponentType;
};

class Router {
  private routes: Route[] = [];
  private currentPath: string = window.location.pathname;
  private listeners: (() => void)[] = [];

  constructor() {
    // 监听浏览器前进后退
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname;
      this.notify();
    });
  }

  addRoute(path: string, component: React.ComponentType) {
    this.routes.push({ path, component });
  }

  navigate(path: string) {
    window.history.pushState({}, '', path);
    this.currentPath = path;
    this.notify();
  }

  getCurrentComponent() {
    const route = this.routes.find((route) => route.path === this.currentPath);
    return route?.component;
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const router = new Router();
