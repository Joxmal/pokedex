import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
  ){
    console.log(process.env.DEFAULT_LIMIT_POKEMON)
    console.log(process.env.DEFAULT_LIMIT_POKEMON)
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const newPokemon = await this.PokemonModel.create(createPokemonDto);
      return newPokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit,offset} = paginationDto


    return await this.PokemonModel.find().select('-__v').sort({ no: 1 }).limit(limit).skip(offset)


     // return await this.PokemonModel.find().select('-__v').sort({ no: 1 }).limit(limit).skip(offset)
  }

  async findOne(term: string) {
    console.log(term)
    try {
      let pokemon: Pokemon;
      if (!isNaN(+term)) {
        console.log(!isNaN(+term))
        pokemon = await this.PokemonModel.findOne({ no: term }).select('-__v');
      }

      // mongo id
      if (!pokemon && isValidObjectId(term)) {
        pokemon = await this.PokemonModel.findById(term);
        console.log('mongo id');
      }

      //Name
      if (!pokemon) {
        pokemon = await this.PokemonModel.findOne({
          name: term.toLocaleUpperCase(),
        });
      }

      if (!pokemon) {
        throw new NotFoundException(`Pokemon not found`);
      }
      return pokemon;
    } catch (error) {
      throw new InternalServerErrorException(`check server logs`);
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto,
      };
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
   
      // const pokemon: Pokemon = await this.findOne(id)
      
      // const pokemonDeleted = await this.PokemonModel.deleteOne({_id: id}).select('-__v')
      const pokemonDeleted = await this.PokemonModel.findByIdAndDelete({_id: id}).select('-__v')

      if(!pokemonDeleted){
        throw new NotFoundException(`Pokemon not found`)
      }
       
      return pokemonDeleted
  }

  async removeAll(){
    try {
      console.log('pokemon deleted')
      await this.PokemonModel.deleteMany({})
      return {mesaage:"pokemonDeleted"}
      
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(`check server logs`)
    }
  }

  private handleExceptions(error: any){
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists  ${JSON.stringify(error.keyValue)} `,);
    }
    console.log(error);
    throw new InternalServerErrorException(`check server logs`)
  }

}
