// @flow
export type Props = {
  selectShow: (type: string, season: number, episode: ?number) => void,
  selectedSeason: number,
  selectedEpisode: number,
  seasons: Array<{
    season: number,
    overview: string
  }>,
  episodes: Array<{
    episode: number,
    overview: string,
    title: string
  }>
};
