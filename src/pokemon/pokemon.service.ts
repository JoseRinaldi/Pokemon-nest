import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel:Model<Pokemon>
  ){

  }

  async create(createPokemonDto: CreatePokemonDto) {
    
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
  
      const Pokemon = await this.PokemonModel.create(createPokemonDto)
  
      return Pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
      
    }
  }

  findAll(paginationDto:PaginationDto) {

    const {limit = 10, offset = 0} = paginationDto;// si vienen valores paginationDto los toma y si no pone valores por defecto ej. limit=10

    return this.PokemonModel.find()
    .limit(limit)// limita la cantidad de resultados
    .skip(offset)// salta la cantidad de resultados que le mandemos como valor
    .sort({
      no: 1,
    })// ordena
    .select('-__v');// quita los campos que le indiquemos de la respuesta
  }

  async findOne(term: string) {
    let pokemon: Pokemon; 

    if ( !isNaN(+term) ) {
      pokemon = await this.PokemonModel.findOne({no: term})
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.PokemonModel.findById(term)
    }
    if (!pokemon) {
      pokemon = await this.PokemonModel.findOne({name: term.toLowerCase().trim()})
    }
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);
    }



    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    
    try {
       // await pokemon.updateOne(updatePokemonDto,{new:true}) 
    await pokemon.updateOne(updatePokemonDto)

    return {...pokemon.toJSON(), ...updatePokemonDto};//esto sobre escribe los datos de pokemon y actualiza los datos que se ven en postman
    // return pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
      
    }
   
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);

    // await pokemon.deleteOne()
    //return {id}

    //const result = await this.PokemonModel.findByIdAndDelete(id);
    //const result = await this.PokemonModel.deleteOne({id: id});
    const {deletedCount} = await this.PokemonModel.deleteOne({_id: id});

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} is not valid`)
    }

    return ;
  }

  private handleExceptions(error:any){
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }

    throw new InternalServerErrorException(`Can´t create Pokemon - Check server logs`);

  }
}
