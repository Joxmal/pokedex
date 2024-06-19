export const EnvConfiguration =()=>({
    environmen: process.env.NODE_ENV || 'dev',
    mongoDB: process.env.MONGODB,
    port: process.env.PORT || 3002,
    defaultLimitPokemon: process.env.DEFAULT_LIMIT_POKEMON || 7,
})