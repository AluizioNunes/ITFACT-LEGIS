import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposituraDto {
    @ApiProperty({ example: 123 })
    @IsInt()
    numero: number;

    @ApiProperty({ example: 2026 })
    @IsInt()
    ano: number;

    @ApiProperty({ example: 'PL' })
    @IsString()
    tipo: string;

    @ApiProperty({ example: 'Dispõe sobre a criação do programa de reciclagem...' })
    @IsString()
    ementa: string;

    @ApiProperty({ example: 'Art. 1º Fica criado o programa...', required: false })
    @IsString()
    @IsOptional()
    texto?: string;
}
