export interface GeneralResponseI {
    timestamps?: Date;
    path:       string;
    exception?:  string;
    detail:     string| string[];
    code:       number;
}
