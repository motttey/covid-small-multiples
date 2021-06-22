export interface CovidData {
  name_jp: String;
  ncurrentpatients: number;
  ndeaths: number;
  nexits: number;
  nheavycurrentpatients: number;
  ninspections: number;
  npatients: number;
  avgNpatients: number;
  [key: String]: any;
}