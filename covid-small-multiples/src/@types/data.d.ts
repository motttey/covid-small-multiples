export interface CovidData {
  name_jp: string;
  ncurrentpatients: number;
  ndeaths: number;
  nexits: number;
  nheavycurrentpatients: number;
  ninspections: number;
  npatients: number;
  avgNpatients: number;
  [key: string]: any;
}
