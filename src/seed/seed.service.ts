import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
  
    private readonly http:AxiosAdapter
  
  ){}

  async executedSeed(){
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: {name:string, no:number}[] = [];

    data.results.forEach((poke) => {
    pokemonToInsert.push({
        name: poke.name,
        no: Number(poke.url.split('/')[6]),
      })
    })

    await this.PokemonModel.deleteMany({})
    await this.PokemonModel.insertMany(pokemonToInsert)

    return this.PokemonModel.find()
  }
}
