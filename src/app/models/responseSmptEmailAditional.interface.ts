export interface SMTPEmailAditionalResponseI {
    current_page:   number;
    data:           StmpEmailNom[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    next_page_url:  null;
    path:           string;
    per_page:       string;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface StmpEmailNom {
    data? : StmpEmailNom;
    id_smpt_email:   number;
    id_empresa:      number;
    smtp_transport:  string;
    smtp_host:       string;
    smtp_port:       number;
    smtp_encryption: string;
    smtp_username:   string;
    smtp_password:   string;
    address:         string;
    name:            null;
    estado_id:       number;
}
