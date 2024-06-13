import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor (
    @InjectModel(Pokemon.name)
    private readonly PokemonModel:Model<Pokemon>
  ){}


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const newPokemon = await this.PokemonModel.create(createPokemonDto)
      return newPokemon
    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`Pokemon already exists  ${ JSON.stringify(error.keyValue)} `)
      }
      console.log(error)
      throw new InternalServerErrorException(`check server logs`)
    }


  }

  async findAll() {
    return "asdd"
  }

  async findOne(term: string) {
    try {
      let pokemon:Pokemon
      if(!isNaN(+term)){
        pokemon = await this.PokemonModel.findOne({no:term})
        }
        
        
        // mongo id
        if( !pokemon && isValidObjectId(term)){
          pokemon = await this.PokemonModel.findById(term)
          console.log("mongo id")
        }

      //Name
      if(!pokemon){
        pokemon = await this.PokemonModel.findOne({name:term.toLocaleUpperCase()})
      }

      if(!pokemon){
        throw new NotFoundException(`Pokemon not found`)
      }
      return pokemon
    } catch (error) {
      
      throw new InternalServerErrorException(`check server logs`)
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term)


    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
      }
    await pokemon.updateOne(updatePokemonDto)
   


    return {
      ...pokemon.toJSON(),
      ...updatePokemonDto
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
