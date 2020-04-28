/* eslint-disable import/order */

import 'vtex.render-runtime'

declare module 'vtex.render-runtime' {
  export const useChildBlock: (opts: { id: string }) => {} | null
}
