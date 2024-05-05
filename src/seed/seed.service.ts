import { Injectable } from '@nestjs/common';
import axios,{ AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel:Model<Pokemon>
  ){

  }
 

  async executeSeed() {

    await this.PokemonModel.deleteMany({});

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    // caso 1********************************
    // data.results.forEach(async({name,url}) =>{

    //   const segments = url.split('/');

    //   const no = +segments[ segments.length - 2];

    //   const Pokemon = await this.PokemonModel.create({name,no})

    // })

    //caso 2************************
    // const insertPromiseArray = []

    // data.results.forEach(({name,url}) =>{

    //   const segments = url.split('/');

    //   const no = +segments[ segments.length - 2];

    //   insertPromiseArray.push(
    //     this.PokemonModel.create({name,no})
    //   )

    // });

    // await Promise.all(insertPromiseArray);

    //caso 3****************** este es la forma recomendada para hacer inserciones multiples
    const pokemonToInsert:{name:string,no:number} [] = [];

    data.results.forEach(({name,url}) =>{

      const segments = url.split('/');

      const no = +segments[ segments.length - 2];

      pokemonToInsert.push({name,no})

    });

    await this.PokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }

  
}
