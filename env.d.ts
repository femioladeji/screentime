/// <reference types="vite/client" />
///<reference types="chrome"/>

interface Window {
  chrome?: typeof chrome
}

// Allow importing .vue SFCs in TypeScript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
