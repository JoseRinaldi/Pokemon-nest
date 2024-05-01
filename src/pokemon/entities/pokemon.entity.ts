import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {

    // id: ya me lo da mongo cuando ingresa a la base de datos

    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number


}


export const PokemonSchema = SchemaFactory.createForClass(Pokemon)


