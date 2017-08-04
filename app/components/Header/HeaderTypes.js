// @flow

export type Props = {
  setActiveMode: () => void,
  
  match: {
    params: {
      mode: string,
    }
  },
}
