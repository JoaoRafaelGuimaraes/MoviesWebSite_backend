import * as filmeControllers from './filmeControllers';
import * as seriesControllers from './serieControllers';

filmeControllers.getTitulosByYear(2020).then((res) => {
    console.log(res);
});