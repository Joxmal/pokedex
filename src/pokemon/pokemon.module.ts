import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  exports: [
    MongooseModule
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
  imports:[
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema
      },
    ])]
})
export class PokemonModule {}
