CREATE TABLE public.owned_pokemon (
    pokemon_id varchar NOT NULL,
    pokemon_owner varchar NOT NULL,
    PRIMARY KEY (pokemon_owner, pokemon_id)
);

CREATE TABLE public.registered_pokemon (
    pokemon_id varchar NOT NULL,
    pokemon_name varchar NOT NULL,
    pokemon_type varchar NOT NULL,
    pokemon_sprite varchar NOT NULL,
    PRIMARY KEY (pokemon_id)
);

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    name VARCHAR(255),
    gender VARCHAR(255)
);


CREATE TABLE public.trades (
    exchange_id SERIAL NOT NULL,
    requested_pokemon_id varchar NOT NULL,
    trader_id integer NOT NULL,
    completed boolean NOT NULL,
    PRIMARY KEY (exchange_id),
    FOREIGN KEY (requested_pokemon_id) REFERENCES registered_pokemon(pokemon_id),
    FOREIGN KEY (trader_id) REFERENCES users(id)
);

CREATE TABLE public.activities (
    activity_id SERIAL NOT NULL,
    description varchar NOT NULL,
    date date NOT NULL,
    is_readed boolean NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (activity_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);