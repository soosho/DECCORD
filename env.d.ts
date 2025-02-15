declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CCPAYMENT_APP_ID: string
      CCPAYMENT_APP_SECRET: string
      // ... other env vars
    }
  }
}

export {}