import { getSimilarMoviesById } from "./filmeControllers";
import { getSimilarSeriesById } from "./serieControllers";

getSimilarSeriesById(48891).then((series) => {
    console.log(series);
});