export interface CountrStatesCitiesResponseI {
    id:              number;
    name:            string;
    iso3:            string;
    iso2:            string;
    numeric_code:    string;
    phone_code:      string;
    capital:         string;
    currency:        string;
    currency_name:   string;
    currency_symbol: string;
    tld:             string;
    native:          null | string;
    region:          string;
    subregion:       string;
    latitude:        string;
    longitude:       string;
}


export interface CitiesResponseI {
    idStates:    number;
    idCountry:   number;
    iso3Country: string;
    idCities:    number;
    name:        string;
    latitude:    string;
    longitude:   string;
}

export interface StatesResponseI {
    idStates:    number;
    idCountry:   number;
    iso3Country: string;
    name:        string;
    state_code:  string;
    latitude:    string;
    longitude:   string;
}



